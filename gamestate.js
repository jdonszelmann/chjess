

let gamestate = {
	playerblack:false,
	cellwidth:undefined,
	paused: false,
}


function switchplayers(){
	gamestate.playerblack = !gamestate.playerblack;
}