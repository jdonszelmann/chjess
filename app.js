var express = require('express');
const WebSocket = require('ws');
const Game = require('./Game');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var lobbyRouter = require('./routes/lobby');
var gameRouter = require('./routes/game');
var MultiRouter = require('./routes/multi');
const https = require('https');
const fs = require('fs');
let {server, options, portHTTPS} = require('./bin/www');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/solo', gameRouter);
app.use('/multi', MultiRouter);
app.use('/', lobbyRouter);

let wssLobbyServer = https.createServer(options,app);
const wssLobby = new WebSocket.Server({server: wssLobbyServer});
wssLobbyServer.listen(8006);

let wssGameServer = https.createServer(options, app);
const wssGame = new WebSocket.Server({server: wssGameServer});
wssGameServer.listen(8005);

//Read the saved stats from the facts.json file
fs.readFile("./facts.json", "utf8", function(err, data){
    if(!err) {
        let Data = JSON.parse(data);
        Game.lists.gamesPlayed = Data.gamesPlayed;
        Game.lists.timePlayed = Data.timePlayed;
        Game.lists.timeInQueue = Data.timeInQueue;
    } else {
        let json = JSON.stringify({gamesPlayed: 0, timePlayed: 0, timeInQueue: 0});
        fs.writeFile("./facts.json", json, "utf8", function () {
            console.log("Statistics data saved!");
        });
        Game.lists.gamesPlayed = 0;
        Game.lists.timePlayed = 0;
        Game.lists.timeInQueue = 0;
    }
});
wssGame.on("connection", function(ws, req){
    let match;
    let player;
    let lobbyID;
    if(req.url === "/") {
        console.log("Websocket joined: " + req.connection.remoteAddress);
        if (Object.keys(Game.lists.openLobbyList).length === 0) {
            match = new Game.Game(ws);
            player = 1;
        } else {
            match = Game.lists.openLobbyList[0];
            if (match.playerOne != ws) {
                match.join(ws);
                player = 2;
            } else {
                match = new Game.Game(ws);
                player = 1;
            }

        }
    } else {
        lobbyID = req.url.substring(1);
        if(Game.lists.privateLobbyList[lobbyID]===undefined){
            // Game doesn't exist
            ws.send(JSON.stringify({id: ws._socket.remoteAddress ,matchmaked: false}));
            return;
        }
        console.log("Private Websocket joined from: "+ req.connection.remoteAddress+" to lobby: "+lobbyID);
        match = Game.lists.privateLobbyList[lobbyID];
        if(!match.playerTwo){
            match.playerTwo = ws;
            player = 2;
            match.getStarter();
        } else if(!match.playerOne){
            match.playerOne = ws;
            player=1;
            console.log(match.playerTwo._socket.remoteAddress + " privately joined player "+ match.playerOne._socket.remoteAddress);
            match.start();
        } else {
            // Game is full
            ws.send(JSON.stringify({id: ws._socket.remoteAddress ,matchmaked: false}));
            return;
        }
    }
    ws.onmessage = function(evt){
        let message = JSON.parse(evt.data);
        if(message.move == true){
            match.move(player, message.piece, message.x, message.y);
        }
    }

    ws.onclose = function () {
        if(match) {
            match.stop(player);
            console.log("Websocket closed: " + req.connection.remoteAddress);
        }
    }
});
wssLobby.on("connection", function (ws, req) {
   let playingGames = Game.lists.gameList.length + Object.keys(Game.lists.privateLobbyList).length;
   let InQueue = ((Game.lists.openLobbyList.length >0)? true : false);
   let playersOnline = wssGame.clients.size + wssLobby.clients.size;
   let gamesPlayed = Game.lists.gamesPlayed;
   let timePlayed = Game.lists.timePlayed;
   let timeInQueue = Game.lists.timeInQueue;
   let json = JSON.stringify({type: "facts", playersOnline: playersOnline, playerInQueue: InQueue, gamesBeingPlayed: playingGames, gamesPlayed: gamesPlayed, timePlayed: timePlayed, timeInQueue: timeInQueue});
   ws.send(json);
   ws.onmessage = function(evt){
       let message = JSON.parse(evt.data);
        if(message.req == "privateLobby"){
            let lobbyID;
            do {
                lobbyID = Math.random().toString().substr(2);
            }while(Game.lists.privateLobbyList[lobbyID]!==undefined);
            Game.lists.privateLobbyList[lobbyID] = new Game.Game(ws, lobbyID);
            ws.send(JSON.stringify({type: "gameID", gameID: lobbyID}));
            ws.onclose = function () {
                if(Game.lists.privateLobbyList[lobbyID].playerTwo === undefined){
                    delete Game.lists.privateLobbyList[lobbyID];
                    console.log("Private lobby "+lobbyID+" stopped");
                }
            }
        }
   };
});

function sendFacts() {
    let playingGames = Game.lists.gameList.length + Object.keys(Game.lists.privateLobbyList).length;
    let InQueue = ((Game.lists.openLobbyList.length >0)? true : false);
    let playersOnline = wssGame.clients.size + wssLobby.clients.size;
    let gamesPlayed = Game.lists.gamesPlayed;
    let timePlayed = Game.lists.timePlayed;
    let timeInQueue = Game.lists.timeInQueue;
    let json = JSON.stringify({type: "facts", playersOnline: playersOnline, playerInQueue: InQueue, gamesBeingPlayed: playingGames, gamesPlayed: gamesPlayed, timePlayed: timePlayed, timeInQueue: timeInQueue});
    for(let ws of wssLobby.clients){
        ws.send(json);
    }
}
setInterval(sendFacts, 10000);
setInterval(storeFacts, 120000);

function storeFacts() {
    let json = JSON.stringify({gamesPlayed: Game.lists.gamesPlayed, timePlayed: Game.lists.timePlayed, timeInQueue: Game.lists.timeInQueue});
    fs.writeFile("./facts.json", json, "utf8", function () {
        console.log("Statistics data saved!");
    });

}




logger('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
})


module.exports = app;
