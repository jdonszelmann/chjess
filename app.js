var express = require('express');
const WebSocket = require('ws');
const Game = require('./Game');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var lobbyRouter = require('./routes/lobby');
var gameRouter = require('./routes/game');
var MultiRouter = require('./routes/multi');
const fs = require('fs');

const wssFact = new WebSocket.Server({port: 8006});
const wssGame = new WebSocket.Server({port: 8005});

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
    console.log("Websocket joined: "+req.connection.remoteAddress);
    if(Object.keys(Game.lists.lobbyList).length === 0){
        match = new Game.Game(ws);
        player = 1;
    } else {
        match = Game.lists.lobbyList[0];
        if(match.playerOne != ws){
            match.join(ws);
            player = 2;
        } else {
            match = new Game.Game(ws);
            player = 1;
        }

    }
    ws.onmessage = function(evt){
        let message = JSON.parse(evt.data);
        if(message.move == true){
            match.move(player, message.piece, message.x, message.y);
        }
    }

    ws.onclose = function () {
        match.stop(player);
        console.log("Websocket closed: " + req.connection.remoteAddress);
    }
});
wssFact.on("connection", function (ws, req) {
   let playingGames = Game.lists.gameList.length;
   let InQueue = ((Game.lists.lobbyList.length >0)? true : false);
   let playersOnline = wssGame.clients.size + wssFact.clients.size;
   let gamesPlayed = Game.lists.gamesPlayed;
   let timePlayed = Game.lists.timePlayed;
   let timeInQueue = Game.lists.timeInQueue;
   let json = JSON.stringify({playersOnline: playersOnline, playerInQueue: InQueue, gamesBeingPlayed: playingGames, gamesPlayed: gamesPlayed, timePlayed: timePlayed, timeInQueue: timeInQueue});
   ws.send(json);

});
function sendFacts() {
    let playingGames = Game.lists.gameList.length;
    let InQueue = ((Game.lists.lobbyList.length >0)? true : false);
    let playersOnline = wssGame.clients.size + wssFact.clients.size;
    let gamesPlayed = Game.lists.gamesPlayed;
    let timePlayed = Game.lists.timePlayed;
    let timeInQueue = Game.lists.timeInQueue;
    let json = JSON.stringify({playersOnline: playersOnline, playerInQueue: InQueue, gamesBeingPlayed: playingGames, gamesPlayed: gamesPlayed, timePlayed: timePlayed, timeInQueue: timeInQueue});
    for(let ws of wssFact.clients){
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


var app = express();

logger('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/solo', gameRouter);
app.use('/multi', MultiRouter);
app.use('/', lobbyRouter);

module.exports = app;
