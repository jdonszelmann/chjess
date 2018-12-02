let socket = new WebSocket("ws://"+window.location.hostname+":8006");
socket.onmessage = function (evt) {
    let message = JSON.parse(evt.data);
    if(message.type == "facts") {
        document.getElementById("playersOnline").getElementsByTagName("p")[0].innerHTML = message.playersOnline;
        document.getElementById("playerInQueue").getElementsByTagName("p")[0].innerHTML = ((message.playerInQueue) ? "Yes" : "No");
        document.getElementById("gamesBeingPlayed").getElementsByTagName("p")[0].innerHTML = message.gamesBeingPlayed;
        document.getElementById("gamesPlayed").getElementsByTagName("p")[0].innerHTML = message.gamesPlayed;
        document.getElementById("timePlayed").getElementsByTagName("p")[0].innerHTML = message.timePlayed + " minutes";
        document.getElementById("timeInQueue").getElementsByTagName("p")[0].innerHTML = message.timeInQueue + " minutes";
    } else if (message.type == "gameID"){
        waiting(0);
        popup.innerHTML = "<h3>Give this link to your friend!</h3><hr/><textarea readonly>http://"+window.location.hostname+":8001/multi/"+message.gameID+"</textarea>";
    } else if (message.type == "matchmaked"){
        open("http://"+window.location.hostname+":8001/multi/"+message.gameID, "_self");
    }
}
function getPrivatID(){
    popup.innerHTML = '<h3>Getting you a private room!</h3><hr/>' +
        '<div id="loading-container"><img src="/Lobby/Vector_Loading.svg" id="loading-bar"></div>';
    popup.style.visibility = "visible";
    waiting(1);
    socket.send(JSON.stringify({req: "privateLobby"}));
}

// Javascript for loading circle
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