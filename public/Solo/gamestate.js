

let gamestate = {
	playerblack:false,
	cellwidth:undefined,

	AI:false,
	AImove:false,

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
		ai:"AI off"
	},

	menus: [],

	history:[],

	framecounter:0,
}


function movepiece(x1,y1,piece){
	gamestate.animation="movepiece";
	gamestate.animationcounter=0;
	gamestate.dst = [x1,y1];
	gamestate.src = [piece.x,piece.y];
	gamestate.piecemoving = piece

	gamestate.history.push(gameboard.get().getmap())
}

function revert(n=1){
	if(gamestate.history.length < 1){
		return;
	}
	gameboard.get().loadmap(gamestate.history.pop());

	gamestate.animation="rotateboard";
	gamestate.animationcounter=0;
}
