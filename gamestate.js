

let gamestate = {
	playerblack:false,
	cellwidth:undefined,

	paused: false,
	playing:true,
	animation:null,
	animationcounter:-1,

}


function switchplayers(){
	gamestate.animation="rotateboard";
	gamestate.animationcounter=0;

}