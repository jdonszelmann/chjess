module.exports.lists = {
    gameList: [],
    openLobbyList: [],
    privateLobbyList: [],
    playList: []
}

const lists = require('./Game').lists;
module.exports.Game = class Game{
    constructor(sock, lobbyID=null){
        if(lobbyID===null) {
            let date = new Date();
            this.startQueueTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
            this.startPlayTime = [-1, -1, -1];
            this.playerOne = sock;
            this.lobby = true;
            this.gLInstance = lists.gameList.push(this);
            this.lLInstance = lists.openLobbyList.push(this);
            console.log(this.playerOne._socket.remoteAddress + " is looking for match.");
        } else {
            let date = new Date();
            this.startQueueTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
            this.startPlayTime = [-1, -1, -1];
            this.lobby = true;
            this.lobbyID = lobbyID;
            this.boss = sock;
            console.log("Private lobby "+this.lobbyID+" started");
        }
    }
    join(rival){
        if(this.lobby) {
            lists.openLobbyList.splice(this.lLInstance-1, 1);
            this.pLInstance = lists.playList.push(this);
            this.playerTwo = rival;
            this.lobby = false;
            this.start();
            console.log(this.playerTwo._socket.remoteAddress + " joined player "+ this.playerOne._socket.remoteAddress);
        }
    }
    move(player, piece, x, y){
        if(player == 1){
            this.playerTwo.send(JSON.stringify({id: this.playerTwo._socket.remoteAddress, move: true, piece: piece, x: x, y: y}));
        } else {
            this.playerOne.send(JSON.stringify({id: this.playerOne._socket.remoteAddress, move: true, piece: piece, x: x, y: y}));
        }
    }

    start(){
        let date = new Date();
        this.startPlayTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
        lists.timeInQueue += this.timeDifferenceInMinutes(this.startQueueTime, this.startPlayTime);
        lists.gamesPlayed++;
        this.playerOne.send(JSON.stringify({id: this.playerTwo._socket.remoteAddress, matchmaked: true, yourTurn: true, playerblack: false}));
        this.playerTwo.send(JSON.stringify({id: this.playerOne._socket.remoteAddress, matchmaked: true, yourTurn: false, playerblack: true}));
    }
    stop(player){
        let date = new Date();
        if(this.startPlayTime[0] == -1){
            this.startPlayTime = this.startQueueTime;
        }
        let endPlayTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
        lists.timePlayed += this.timeDifferenceInMinutes(this.startPlayTime, endPlayTime);
        if(player == 1){
            if(this.playerTwo && this.playerTwo.readyState == this.playerTwo.OPEN)
                this.playerTwo.send(JSON.stringify({id: this.playerTwo._socket.remoteAddress, closed: true}));
        } else if(player == 2){
            if(this.playerOne.readyState == this.playerOne.OPEN)
                this.playerOne.send(JSON.stringify({id: this.playerOne._socket.remoteAddress, closed: true}));
        } else {
            if(this.playerOne.readyState == this.playerOne.OPEN)
                this.playerOne.send(JSON.stringify({id: this.playerOne._socket.remoteAddress, closed: true}));
            if(this.playerTwo && this.playerTwo.readyState == this.playerTwo.OPEN)
                this.playerTwo.send(JSON.stringify({id: this.playerTwo._socket.remoteAddress, closed: true}));
        }
        if(this.playerOne.readyState != this.playerOne.CLOSED)
            this.playerOne.close();
        if(this.playerTwo && this.playerTwo.readyState != this.playerTwo.CLOSED)
            this.playerTwo.close();

        if(!this.lobbyID) {
            lists.gameList.splice(this.gLInstance - 1, 1);
            if (this.lobby) {
                lists.openLobbyList.splice(this.lLInstance - 1, 1);
            } else {
                lists.playList.splice(this.pLInstance - 1, 1);
            }
        } else {
            delete lists.privateLobbyList[this.lobbyID];
        }
    }
    timeDifferenceInMinutes(begin, end){
        let difference = [0,0,0];
        difference[0] = end[0]-begin[0];
        if(difference[0]<0){
            difference[0]+=24;
        }
        difference[1] = end[1]-begin[1];
        if(difference[1]<0){
            difference[0]--;
            difference[1]+=60;
        }
        difference[2] = end[2]-begin[2];
        if(difference[2]<0){
            difference[1]--;
            difference[2]+=60;
        }
        let minutes = Math.round(difference[0]*60+difference[1]+difference[2]/60);
        return minutes;
    }

    /* functions below are for private rooms only */
    getStarter(){
        this.boss.send(JSON.stringify({type: "matchmaked", gameID: this.lobbyID}));
    }
}