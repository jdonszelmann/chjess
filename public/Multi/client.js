let stopWaiting = function (){
    waiting(false);
    document.getElementById("matchmaking-status").innerHTML = "Matchmaking, please wait..";
}
function waiting(boolean){
    let img = document.getElementById("loading-bar");
    let imgC = document.getElementById("loading-container");
    if(boolean){
        imgC.style.visibility = "visible";
        img.style.webkitAnimation = "loading 1s steps(180) infinite";
    } else {
        imgC.style.visibility = "hidden";
        img.style.webkitAnimation = "";
    }
}
function closeGame(){
    socket.onclose = function(){};
    socket.close();
    open('../', '_self');
}
function sendMove(piece, x, y){
    socket.send(JSON.stringify({move: true, piece: piece, x: x, y: y}));
}
let matchmaking = true;
let yourTurn;
let socket = new WebSocket("ws://192.168.178.14:8005");
waiting(true);
socket.onmessage = function(evt){
    let message = JSON.parse(evt.data);
    if(message.matchmaked == true){
        let id = setTimeout(function () {}, 0);
        while(id--){
            clearTimeout(id);
        }
        stopWaiting();
        yourTurn = message.yourTurn;
        gamestate.playerblack = message.playerblack;
        matchmaking = false;
    }
    if(message.closed == true){
        closeGame();
    }
    if(message.move == true){
        if(gamestate.playerblack == false){
            let oldpiece = gameboard.get().getpieceat(7-message.x, 7-message.y);
            if(oldpiece != null){
                oldpiece.kill();
            }
            movepiece(message.x, message.y, gameboard.get().getpieceat(7-message.piece.x, 7-message.piece.y));
        } else {
            let oldpiece = gameboard.get().getpieceat(message.x, message.y);
            if(oldpiece != null){
                oldpiece.kill();
            }
            movepiece(message.x, message.y, gameboard.get().getpieceat(message.piece.x, message.piece.y));
        }
        if(message.piece.move){
            message.piece.move();
        }
        console.log(message.piece);
        console.log(message.x);
        console.log(message.y);
        yourTurn = true;
    }
};

setTimeout(function () {
    document.getElementById("matchmaking-status").innerHTML = "There were not enough players to match, try again later.";
}, 60000);

setTimeout(function(){
    stopWaiting();
    closeGame();
}, 65000);
