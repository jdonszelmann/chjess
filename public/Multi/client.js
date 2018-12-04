let socket;
let clientIP;
let http = new XMLHttpRequest();
http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let res = JSON.parse(this.responseText);
        clientIP = res.address;
        startSocket.start();
    }
};
http.open("GET", "https://v4.ident.me/.json", true);
http.send();

let matchmaking = true;
let yourTurn;

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
let startSocket = {
    closeGame: function () {
        socket.onclose = function () {
        };
        socket.close();
        open('../', '_self');
    },

    sendMove: function (piece, x, y) {
        socket.send(JSON.stringify({move: true, piece: piece, x: x, y: y}));
    },

    start: function() {
        socket = new WebSocket("ws://" + window.location.hostname+":8005/"+window.location.pathname.substr(7));
        waiting(true);
        socket.onmessage = function (evt) {
            let message = JSON.parse(evt.data);
            if (message.id == clientIP || window.location.hostname == 'localhost' || window.location.hostname == 'lvh.me') {
                if (message.matchmaked == true) {
                    let id = setTimeout(function () {
                    }, 0);
                    while (id--) {
                        clearTimeout(id);
                    }
                    stopWaiting();
                    yourTurn = message.yourTurn;
                    gamestate.playerblack = message.playerblack;
                    matchmaking = false;
                }
                if (message.closed == true) {
                    startSocket.closeGame();
                }
                if (message.move == true) {
                    if (gamestate.playerblack == false) {
                        let oldpiece = gameboard.get().getpieceat(7 - message.x, 7 - message.y);
                        if (oldpiece != null) {
                            oldpiece.kill();
                        }
                        movepiece(message.x, message.y, gameboard.get().getpieceat(7 - message.piece.x, 7 - message.piece.y));
                    } else {
                        let oldpiece = gameboard.get().getpieceat(message.x, message.y);
                        if (oldpiece != null) {
                            oldpiece.kill();
                        }
                        movepiece(message.x, message.y, gameboard.get().getpieceat(message.piece.x, message.piece.y));
                    }
                    if (message.piece.move) {
                        message.piece.move();
                    }
                    console.log(message.piece);
                    console.log(message.x);
                    console.log(message.y);
                    yourTurn = true;
                }
                if(message.matchmaked === false){
                    open("http://"+window.location.hostname+":8001", "_self");
                }
            } else {
                console.log("IP send by server: " + message.id);
                console.log("My IP: " + clientIP);
            }
        };

        setTimeout(function () {
            document.getElementById("matchmaking-status").innerHTML = "There were not enough players to match, try again later.";
        }, 60000);

        setTimeout(function () {
            stopWaiting();
            startSocket.closeGame();
        }, 65000);
    }
}
