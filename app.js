var express = require('express');
const WebSocket = require('ws');
const Game = require('./Game');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var lobbyRouter = require('./routes/lobby');
var gameRouter = require('./routes/game');
var MultiRouter = require('./routes/multi');

const wss = new WebSocket.Server({port: 8005});
wss.on("connection", function(ws, req){
    let match;
    let player;
    console.log("Websocket joined: "+req.connection.remoteAddress);
    if(Object.keys(Game.lists.lobbyList).length === 0){
        match = new Game.Game(ws);
        player = 1;
    } else {
        match = Game.lists.lobbyList[0];
        match.join(ws);
        player = 2;
    }
    ws.onmessage = function(evt){
        let message = JSON.parse(evt.data);
        if(message.move == true){
            match.move(player, message.piece, message.x, message.y);
        }
    }

    ws.onclose = function () {
        match.stop(player);
        console.log("Websocket closed: "+ req.connection.remoteAddress);
    }

});

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
