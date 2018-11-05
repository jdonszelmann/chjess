

class chesspiece{
	constructor(filename,x,y){
		this.filename = filename;
		this.img = new Image();
		this.img.src = this.filename;
		
	}
}

class bishop extends chesspiece{
	constructor(filename,x,y){
		super(filename,x,y);
	}
}

class king extends chesspiece{
	constructor(filename,x,y){
		super(filename,x,y);
	}
}

class queen extends chesspiece{
	constructor(filename,x,y){
		super(filename,x,y);
	}
}

class rook extends chesspiece{
	constructor(filename,x,y){
		super(filename,x,y);
	}
}

class pawn extends chesspiece{
	constructor(filename,x,y){
		super(filename,x,y);
	}
}

class knight extends chesspiece{
	constructor(filename,x,y){
		super(filename,x,y);
	}
}


const whitepieces = [
	new rook("resources/rook-white.png",0,0),
	new knight("resources/knight-white.png",1,0),
	new bishop("resources/bishop-white.png",2,0),
	new king("resources/king-white.png",3,0),
	new queen("resources/queen-white.png",4,0),
	new bishop("resources/bishop-white.png",5,0),
	new knight("resources/knight-white.png",6,0),
	new rook("resources/rook-white.png",7,0),
	new pawn("resources/pawn-white.png",0,1),
	new pawn("resources/pawn-white.png",1,1),
	new pawn("resources/pawn-white.png",2,1),
	new pawn("resources/pawn-white.png",3,1),
	new pawn("resources/pawn-white.png",4,1),
	new pawn("resources/pawn-white.png",5,1),
	new pawn("resources/pawn-white.png",6,1),
	new pawn("resources/pawn-white.png",7,1),
];

const blackpieces = [
	new rook("resources/rook-black.png",0,7),
	new knight("resources/knight-black.png",1,7),
	new bishop("resources/bishop-black.png",2,7),
	new king("resources/king-black.png",3,7),
	new queen("resources/queen-black.png",4,7),
	new bishop("resources/bishop-black.png",5,7),
	new knight("resources/knight-black.png",6,7),
	new rook("resources/rook-black.png",7,7),
	new pawn("resources/pawn-black.png",0,6),
	new pawn("resources/pawn-black.png",1,6),
	new pawn("resources/pawn-black.png",2,6),
	new pawn("resources/pawn-black.png",3,6),
	new pawn("resources/pawn-black.png",4,6),
	new pawn("resources/pawn-black.png",5,6),
	new pawn("resources/pawn-black.png",6,6),
	new pawn("resources/pawn-black.png",7,6),
];
