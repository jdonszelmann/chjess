

let gamestate = {
	playerblack:false,
	cellwidth:undefined,
	playing:true,
	animation:null,
	animationcounter:-1,
}


function switchplayers(){
	gamestate.animation="rotateboard";
	gamestate.animationcounter=0;

}