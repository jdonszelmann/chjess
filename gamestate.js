

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

	winner:null,

	clocklength:3600,
	clockoff:true,


	movehelper:true,

	gamestring: {
		movehelper:"Movehelper on",
	},

	menus: [],
}


function movepiece(x1,y1,piece){
	gamestate.animation="movepiece";
	gamestate.animationcounter=0;
	gamestate.dst = [x1,y1];
	gamestate.src = [piece.x,piece.y];
	gamestate.piecemoving = piece
}
