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



// Make Web Socket servers
const wssLobby = new WebSocket.Server({port:8006, host:"0.0.0.0"});
const wssGame = new WebSocket.Server({port:8005, host:"0.0.0.0"});


//Read the saved stats from the facts.json file
fs.readFile("./facts.json", "utf8", function(err, data){
    if(!err) {
        let Data = JSON.parse(data);
        Game.lists.gamesPlayed = Data.gamesPlayed;
        Game.lists.timePlayed = Data.timePlayed;
        Game.lists.timeInQueue = Data.timeInQueue;
    } else {
        // There probably is no fact.json file so create it.
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
    // Check if it's an open lobby or a private one
    if(req.url === "/") {
        //  Public lobby
        console.log("Websocket joined: " + req.connection.remoteAddress);
        
        if (Object.keys(Game.lists.openLobbyList).length === 0) {
            // There is no active game, so make one
            match = new Game.Game(ws);
            player = 1;
        } else {
            // Join the first game in the list. The game itself will remove itself from this list.
            match = Game.lists.openLobbyList[0];
            match.join(ws);
            player = 2;
        }
    } else {
        //  Private lobby
        lobbyID = req.url.substring(1); // Remove the first '/' from the url path
        if(Game.lists.privateLobbyList[lobbyID]===undefined){
            // Game doesn't exist
            ws.send(JSON.stringify({id: ws._socket.remoteAddress ,matchmaked: false}));
            return;
        }
        // There is a game with this lobbyID
        console.log("Private Websocket joined from: "+ req.connection.remoteAddress+" to lobby: "+lobbyID);
        match = Game.lists.privateLobbyList[lobbyID];
        if(!match.playerTwo){
            // There is no 2nd player yet
            match.playerTwo = ws;
            player = 2;
            // Get the player who started the private lobby and is now waiting on the lobby page
            match.getStarter();
        } else if(!match.playerOne){
            // If the playerOne slot is still open join as playerOne
            match.playerOne = ws;
            player=1;
            console.log(match.playerTwo._socket.remoteAddress + " privately joined player "+ match.playerOne._socket.remoteAddress);
            //  The game is full now, so start it!
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
            // The WebSocket Server received a move made by a player.
            match.move(player, message.piece, message.x, message.y);
        }
    }

    ws.onclose = function () {
        if(match) {
            // If there is still a match going on tell the other person that the game is closed.
            match.stop(player);
            console.log("Websocket closed: " + req.connection.remoteAddress);
        }
    }
});
wssLobby.on("connection", function (ws, req) {
   // Send the game statistics as soon as a websocket connection is made
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
            // Run this if the user requests a private lobby
            let lobbyID;
            // Make a new lobbyID every time the lobbyID already exists
            do {
                lobbyID = Math.random().toString().substr(2);
            }while(Game.lists.privateLobbyList[lobbyID]!==undefined);
            Game.lists.privateLobbyList[lobbyID] = new Game.Game(ws, lobbyID);
            ws.send(JSON.stringify({type: "gameID", gameID: lobbyID}));
            ws.onclose = function () {
                if(Game.lists.privateLobbyList[lobbyID].playerTwo === undefined){
                    //  If this websocket connection is closed and the second player is no longer in his player slot then
                    //  the game is no longer running and will be closed.
                    delete Game.lists.privateLobbyList[lobbyID];
                    console.log("Private lobby "+lobbyID+" stopped");
                }
            }
        }
   };
});
// Function to send the current statistics to all clients in the lobby
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
// Send every client the statistics every 10 seconds
setInterval(sendFacts, 10000);
// Store the current statistics every 2 minutes in the facts.json file.
setInterval(storeFacts, 120000);

// Save the current statistics in the facts.json file
function storeFacts() {
    let json = JSON.stringify({gamesPlayed: Game.lists.gamesPlayed, timePlayed: Game.lists.timePlayed, timeInQueue: Game.lists.timeInQueue});
    fs.writeFile("./facts.json", json, "utf8", function () {
        console.log("Statistics data saved!");
    });

}

// Only errors will be reported in the server console, so your server console is still useable with a lot of users
logger('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
});

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes...
app.use('/solo', gameRouter);
app.use('/multi', MultiRouter);
app.use('/', lobbyRouter);

module.exports = app;
