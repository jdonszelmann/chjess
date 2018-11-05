

class chesspiece{
	constructor(filename,x,y,blackpiece){
		this.filename = filename;
		this.img = new Image();
		this.img.src = this.filename;

		this.x = x;
		this.y = y;
		this.blackpiece = blackpiece;

		gameboard.get().addpiece(this)

	}

	draw(){
		let x = this.x;
		let y = this.y;

		if(!gamestate.playerblack){
			x = 7-x
			y = 7-y
		}

		blit(x*gamestate.cellwidth,y*gamestate.cellwidth,gamestate.cellwidth,gamestate.cellwidth,this.img);
	}
}

class bishop extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}
}

class king extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}
}

class queen extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}
}

class rook extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}
}

class pawn extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}
}

class knight extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}
}

//default game setup
new rook("resources/rook-white.png",0,0,true);
new knight("resources/knight-white.png",1,0,true);
new bishop("resources/bishop-white.png",2,0,true);
new king("resources/king-white.png",3,0,true);
new queen("resources/queen-white.png",4,0,true);
new bishop("resources/bishop-white.png",5,0,true);
new knight("resources/knight-white.png",6,0,true);
new rook("resources/rook-white.png",7,0,true);
new pawn("resources/pawn-white.png",0,1,true);
new pawn("resources/pawn-white.png",1,1,true);
new pawn("resources/pawn-white.png",2,1,true);
new pawn("resources/pawn-white.png",3,1,true);
new pawn("resources/pawn-white.png",4,1,true);
new pawn("resources/pawn-white.png",5,1,true);
new pawn("resources/pawn-white.png",6,1,true);
new pawn("resources/pawn-white.png",7,1,true);

new rook("resources/rook-black.png",0,7,false);
new knight("resources/knight-black.png",1,7,false);
new bishop("resources/bishop-black.png",2,7,false);
new king("resources/king-black.png",3,7,false);
new queen("resources/queen-black.png",4,7,false);
new bishop("resources/bishop-black.png",5,7,false);
new knight("resources/knight-black.png",6,7,false);
new rook("resources/rook-black.png",7,7,false);
new pawn("resources/pawn-black.png",0,6,false);
new pawn("resources/pawn-black.png",1,6,false);
new pawn("resources/pawn-black.png",2,6,false);
new pawn("resources/pawn-black.png",3,6,false);
new pawn("resources/pawn-black.png",4,6,false);
new pawn("resources/pawn-black.png",5,6,false);
new pawn("resources/pawn-black.png",6,6,false);
new pawn("resources/pawn-black.png",7,6,false);
