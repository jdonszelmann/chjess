let socket = new WebSocket("ws://"+window.location.hostname+":8006");
socket.onmessage = function (evt) {
    let message = JSON.parse(evt.data);
    document.getElementById("playersOnline").getElementsByTagName("p")[0].innerHTML = message.playersOnline;
    document.getElementById("playerInQueue").getElementsByTagName("p")[0].innerHTML = ((message.playerInQueue)? "Yes" : "No");
    document.getElementById("gamesBeingPlayed").getElementsByTagName("p")[0].innerHTML = message.gamesBeingPlayed;
    document.getElementById("gamesPlayed").getElementsByTagName("p")[0].innerHTML = message.gamesPlayed;
    document.getElementById("timePlayed").getElementsByTagName("p")[0].innerHTML = message.timePlayed + " minutes";
    document.getElementById("timeInQueue").getElementsByTagName("p")[0].innerHTML = message.timeInQueue + " minutes";
}