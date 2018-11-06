

let gamestate = {
	playerblack:false,
	cellwidth:undefined,

	paused: false,
	playing:true,
	animation:null,
	animationcounter:-1,
	dst:[],
	src:[],
	piecemoving:null,

}


function movepiece(x1,y1,piece){
	gamestate.animation="movepiece";
	gamestate.animationcounter=0;
	gamestate.dst = [x1,y1];
	gamestate.src = [piece.x,piece.y];
	gamestate.piecemoving = piece
}
