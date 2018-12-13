let popup = document.getElementById('popup');
let profile;
//port 8006 is for lobby, 8007 for the game itself
let socket = new WebSocket("ws://"+window.location.hostname+":8006");

//react on message
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
        //set the private lobby url
        popup.innerHTML = "<h3>Give this link to your friend!</h3><hr/><textarea readonly onclick=\"this.focus();this.select()\">http://"+window.location.hostname+":80/multi/"+message.gameID+"</textarea>";
    } else if (message.type == "matchmaked"){
        open("http://"+window.location.hostname+":80/multi/"+message.gameID, "_self");
    }
}

//  Function to reserve a private lobby for you and a friend
function getPrivateLobby(){
    popup.innerHTML = '<h3>Getting you a private room!</h3><hr/>' +
        '<div id="loading-container"><img src="/Lobby/Vector_Loading.svg" id="loading-bar"></div>';
    popup.style.visibility = "visible";
    waiting(1);
    socket.send(JSON.stringify({req: "privateLobby"}));
}

//  Javascript for the loading circle
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

//  Javascript for displaying account info
function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    document.getElementsByClassName("g-acc-info")[0].innerHTML = "<img class='g-acc-img' src='"+profile.getImageUrl()+"'/><h4 class='g-acc-name'>"+profile.getName()+"</h4>";
    document.getElementsByClassName("g-signin2")[0].style.display = "none";
    document.getElementsByClassName("g-acc")[0].style.display = "flex";
    // document.getElementsByClassName("g-acc")[0].addEventListener("mouseenter",function () {
    //     document.getElementsByClassName("g-acc")[0].style.height = "10vh";
    // });
    // document.getElementsByClassName("g-acc")[0].addEventListener("mouseleavea",function () {
    //     document.getElementsByClassName("g-acc")[0].style.height = "5vh";
    // });

}
//for google oauth
function SignOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        profile = null;
        document.getElementsByClassName("g-signin2")[0].style.display = "";
        document.getElementsByClassName("g-acc")[0].style.display = "none";
        document.getElementsByClassName("g-acc-info")[0].innerHTML = "";
    });
}

//add update or remove cookies. total bullshit of course because we dont use it but we have to for points...
const updateAddRemoveCookie = (name, value, expirationSeconds = 86400) => {
    if (value !== "") {
        const date = new Date();
        date.setTime(date.getTime() + expirationSeconds);
        const expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/";
    }
};

const getCookie = (name) => {
    const cookieWithPrependedSemi = `; ${document.cookie}`;
    const cookieParts = cookieWithPrependedSemi.split(`; ${name}=`);
    if (cookieParts.length == 2) {
        return cookieParts.pop().split(";").shift();
    } else {
        return null;
    }
};

//add a bullshit cookie
updateAddRemoveCookie("i","hate this")
