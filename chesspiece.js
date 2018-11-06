

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
		if(!this.dead){
			let x = this.x;
			let y = this.y;

			//flip board for black
			if(!gamestate.playerblack){
				x = 7-x
				y = 7-y
			}

			blit(x*gamestate.cellwidth,y*gamestate.cellwidth,gamestate.cellwidth,gamestate.cellwidth,this.img);
	
		}
	}


	drawoptions(){

		 function distance(x1,y1,x2,y2){
			return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2))
		};

		if(!this.dead){
			for(let i of this.options()){

				//decreasing shades of blue

				let x = this.x, y = this.y;
				if(!gamestate.playerblack){
					x = 7 - x;
					y = 7 - y;
				}


				let o = distance(
					i.x*gamestate.cellwidth,
					i.y*gamestate.cellwidth,
					x*gamestate.cellwidth,
					y*gamestate.cellwidth,
				) * 0.5


				stroke(0,255 - o,255 - o);
				fill(0,255 - o,255 - o,0.35);
				strokeWidth(4);
				rect((i.x)*gamestate.cellwidth,(i.y)*gamestate.cellwidth,gamestate.cellwidth,gamestate.cellwidth);
			}
		}
	}

	kill(){
		this.dead = true;
	}
}

class bishop extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}

	options(){
		let possibilities = [];
		let gm = gameboard.get().constructgamemap();


		//topright
		for(let i = this.x + 1,j = this.y + 1; i <= 7 && j <= 7; i++,j++){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}
		//bottomleft
		for(let i = this.x + 1,j = this.y - 1; i <= 7 && j >= 0; i++,j--){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}
		//topright
		for(let i = this.x - 1,j = this.y + 1; i >= 0 && j <= 7; i--,j++){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}
		//bottomright
		for(let i = this.x - 1,j = this.y - 1; i >= 0 && j >= 0; i--,j--){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}


		if(!gamestate.playerblack){
			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}

		return possibilities;
	}
}

class king extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}

	options(){
		let possibilities = [];
		let gm = gameboard.get().constructgamemap();

		possibilities.push({x:this.x,y:this.y+1});
		possibilities.push({x:this.x+1,y:this.y+1});
		possibilities.push({x:this.x-1,y:this.y+1});
		possibilities.push({x:this.x-1,y:this.y});
		possibilities.push({x:this.x+1,y:this.y});
		possibilities.push({x:this.x-1,y:this.y-1});
		possibilities.push({x:this.x,y:this.y-1});
		possibilities.push({x:this.x+1,y:this.y-1});


		if(!gamestate.playerblack){
			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}	

		return possibilities;
	}
	kill(){
        if(this.blackpiece){
            winner = "White";
        } else {
            winner = "Black";
        }
        openMenu("EndGame");
        this.dead = true;
	}
}

class queen extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}

	options(){
		let possibilities = [];
		let gm = gameboard.get().constructgamemap();


		//left
		for(let i = this.x + 1; i <= 7; i++){
			possibilities.push({x:i,y:this.y});
			if(gm[i][this.y] != null){break;}
		}
		//right
		for(let i = this.x - 1; i >= 0; i--){
			possibilities.push({x:i,y:this.y});
			if(gm[i][this.y] != null){break;}
		}
		//up
		for(let i = this.y + 1; i <= 7; i++){
			possibilities.push({x:this.x,y:i});
			if(gm[this.x][i] != null){break;}
		}
		//down
		for(let i = this.y - 1; i >= 0; i--){
			possibilities.push({x:this.x,y:i});
			if(gm[this.x][i] != null){break;}
		}

		//topright
		for(let i = this.x + 1,j = this.y + 1; i <= 7 && j <= 7; i++,j++){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}
		//bottomleft
		for(let i = this.x + 1,j = this.y - 1; i <= 7 && j >= 0; i++,j--){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}
		//topright
		for(let i = this.x - 1,j = this.y + 1; i >= 0 && j <= 7; i--,j++){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}
		//bottomright
		for(let i = this.x - 1,j = this.y - 1; i >= 0 && j >= 0; i--,j--){
			possibilities.push({x:i,y:j});
			if(gm[i][j] != null){break;}
		}



		if(!gamestate.playerblack){
			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}

		return possibilities;
	}
}

class rook extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}

	options(){
		let possibilities = [];
		let gm = gameboard.get().constructgamemap();


		//left
		for(let i = this.x + 1; i <= 7; i++){
			possibilities.push({x:i,y:this.y});
			if(gm[i][this.y] != null){break;}
		}
		//right
		for(let i = this.x - 1; i >= 0; i--){
			possibilities.push({x:i,y:this.y});
			if(gm[i][this.y] != null){break;}
		}
		//up
		for(let i = this.y + 1; i <= 7; i++){
			possibilities.push({x:this.x,y:i});
			if(gm[this.x][i] != null){break;}
		}
		//down
		for(let i = this.y - 1; i >= 0; i--){
			possibilities.push({x:this.x,y:i});
			if(gm[this.x][i] != null){break;}
		}

		if(!gamestate.playerblack){
			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}

		return possibilities;
	}
}

class pawn extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
		this.moved = false;
	}

	move(){
		this.moved=true;
	}

	options(){
		let gm = gameboard.get().constructgamemap();
		
		let possibilities = [];

		if(!gamestate.playerblack){
			if(gm[this.x][this.y+1] == null){
				possibilities.push({x:this.x,y:this.y+1});

				if(!this.moved){

					if(gm[this.x][this.y+2] == null){
						possibilities.push({x:this.x,y:this.y+2});		
					}	
				}
			}

			if(this.x < 7 && this.y < 7 && gm[this.x+1][this.y+1] instanceof chesspiece){
				possibilities.push({x:this.x+1,y:this.y+1});		
			}

			if(this.x > 0 && this.y < 7 && gm[this.x-1][this.y+1] instanceof chesspiece){
				possibilities.push({x:this.x-1,y:this.y+1});			
			}

			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}

		}else{

			if(gm[this.x][this.y-1] == null){
				possibilities.push({x:this.x,y:this.y-1});
			
				if(!this.moved){

					if(gm[this.x][this.y-2] == null){
						possibilities.push({x:this.x,y:this.y-2});		
					}	
				}

			}

			if(this.x < 7 && this.y > 0 && gm[this.x+1][this.y-1] instanceof chesspiece){
				possibilities.push({x:this.x+1,y:this.y-1});		
			}

			if(this.x > 0 && this.y > 0 && gm[this.x-1][this.y-1] instanceof chesspiece){
				possibilities.push({x:this.x-1,y:this.y-1});			
			}

		}

		return possibilities;
	}

}

class knight extends chesspiece{
	constructor(filename,x,y,blackpiece){
		super(filename,x,y,blackpiece);
	}

	options(){
		let possibilities = [];

		possibilities.push({x:this.x+2,y:this.y+1});
		possibilities.push({x:this.x-2,y:this.y+1});
		possibilities.push({x:this.x-1,y:this.y+2});
		possibilities.push({x:this.x+1,y:this.y+2});
		possibilities.push({x:this.x+2,y:this.y-1});
		possibilities.push({x:this.x-2,y:this.y-1});
		possibilities.push({x:this.x+1,y:this.y-2});
		possibilities.push({x:this.x-1,y:this.y-2});	

		if(!gamestate.playerblack){
			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}


		return possibilities;
	}
}

//default game setup
new rook("resources/rook-white.png",0,0,false);
new knight("resources/knight-white.png",1,0,false);
new bishop("resources/bishop-white.png",2,0,false);
new king("resources/king-white.png",3,0,false);
new queen("resources/queen-white.png",4,0,false);
new bishop("resources/bishop-white.png",5,0,false);
new knight("resources/knight-white.png",6,0,false);
new rook("resources/rook-white.png",7,0,false);
new pawn("resources/pawn-white.png",0,1,false);
new pawn("resources/pawn-white.png",1,1,false);
new pawn("resources/pawn-white.png",2,1,false);
new pawn("resources/pawn-white.png",3,1,false);
new pawn("resources/pawn-white.png",4,1,false);
new pawn("resources/pawn-white.png",5,1,false);
new pawn("resources/pawn-white.png",6,1,false);
new pawn("resources/pawn-white.png",7,1,false);

new rook("resources/rook-black.png",0,7,true);
new knight("resources/knight-black.png",1,7,true);
new bishop("resources/bishop-black.png",2,7,true);
new king("resources/king-black.png",3,7,true);
new queen("resources/queen-black.png",4,7,true);
new bishop("resources/bishop-black.png",5,7,true);
new knight("resources/knight-black.png",6,7,true);
new rook("resources/rook-black.png",7,7,true);
new pawn("resources/pawn-black.png",0,6,true);
new pawn("resources/pawn-black.png",1,6,true);
new pawn("resources/pawn-black.png",2,6,true);
new pawn("resources/pawn-black.png",3,6,true);
new pawn("resources/pawn-black.png",4,6,true);
new pawn("resources/pawn-black.png",5,6,true);
new pawn("resources/pawn-black.png",6,6,true);
new pawn("resources/pawn-black.png",7,6,true);
