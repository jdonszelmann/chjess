
//list of pieces' filenames
let piecemap = {
	black:{
		queen:"/Solo/resources/queen-black.png",
		king:"/Solo/resources/king-black.png",
		pawn:"/Solo/resources/pawn-black.png",
		rook:"/Solo/resources/rook-black.png",
		bishop:"/Solo/resources/bishop-black.png",
		knight:"/Solo/resources/knight-black.png",
	},
	white:{
		queen:"/Solo/resources/queen-white.png",
		king:"/Solo/resources/king-white.png",
		pawn:"/Solo/resources/pawn-white.png",
		rook:"/Solo/resources/rook-white.png",
		bishop:"/Solo/resources/bishop-white.png",
		knight:"/Solo/resources/knight-white.png",
	}
}

//generic chesspiece class
class chesspiece{
	constructor(filename,x,y,blackpiece){
		this.filename = filename

		this.img = new Image();
		this.img.src = this.filename;

		this.x = x;
		this.y = y;
		this.blackpiece = blackpiece;

		gameboard.get().addpiece(this)

	}

    //draw a chesspiece
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

    //draw all possible moves of this piece (blue lines)
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
				) * 0.3

				if(gamestate.movehelper){
					stroke(0,255 - o,255 - o);
					fill(0,255 - o*1.4,255 - o*1.4,0.35);
					strokeWidth(4);
					rect((i.x)*gamestate.cellwidth,(i.y)*gamestate.cellwidth,gamestate.cellwidth,gamestate.cellwidth);
				}
			}
		}
	}

	kill(){
		this.dead = true;
	}
}


//subclass chesspiece for bishops
class bishop extends chesspiece{
	constructor(x,y,blackpiece){
		let filename;

		if(blackpiece){
			filename = piecemap.black.bishop;			
		}else{
			filename = piecemap.white.bishop;			
		}

		super(filename,x,y,blackpiece);
	}  

    //calculate move options for this piece. different for every piece of course
	options(){
		let possibilities = [];
		let gm = gameboard.get().constructgamemap();
		gameboard.get().saveTheKing();
		let possible = gameboard.get().kingNotInDanger(this);
		if(possible[0]) {
            //topright
            for (let i = this.x + 1, j = this.y + 1; i <= 7 && j <= 7; i++, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //bottomright
            for (let i = this.x + 1, j = this.y - 1; i <= 7 && j >= 0; i++, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //topleft
            for (let i = this.x - 1, j = this.y + 1; i >= 0 && j <= 7; i--, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //bottomleft
            for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
        } else if (possible[1] == "x+y+" || possible[1] == "x-y-"){
            //topright
            for (let i = this.x + 1, j = this.y + 1; i <= 7 && j <= 7; i++, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //bottomleft
            for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
		} else if (possible[1] == "x+y-" || possible[1] == "x-y+"){
            //bottomright
            for (let i = this.x + 1, j = this.y - 1; i <= 7 && j >= 0; i++, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //topleft
            for (let i = this.x - 1, j = this.y + 1; i >= 0 && j <= 7; i--, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
		}

        possibilities = possibilities.filter(function(x){
            if(!(gm[x.x][x.y] != null && gm[x.x][x.y].blackpiece == gamestate.playerblack)&& 0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
                return x;
            }
        });

        if (!gamestate.playerblack) {
            for (let i of possibilities) {
                i.x = 7 - i.x;
                i.y = 7 - i.y;
            }
        }

        let saveKing = gameboard.get().saveTheKing();
        if(!saveKing[0]){
            possibilities = possibilities.filter(function(possibility){
                if(saveKing[1]){
                    for(let option of saveKing[1]){
                        if(option[0]==possibility.x && option[1]==possibility.y){
                            return possibility;
                        }
                    }
                }
            });
        }

		return possibilities;
	}
}

class king extends chesspiece{
	constructor(x,y,blackpiece){
		let filename;
	
		if(blackpiece){
			filename = piecemap.black.king;			
		}else{
			filename = piecemap.white.king;			
		}

		super(filename,x,y,blackpiece);
	}

	options(){
		let possibilities = [];
		let gm = gameboard.get().constructgamemap();
        let save = [false, false, false, false, false, false, false, false];

		if(gameboard.get().tileSaveForKing(this.x+1, this.y-1, this)[0]){
            possibilities.push({x:this.x+1,y:this.y-1});
        }
       	if(gameboard.get().tileSaveForKing(this.x-1, this.y+1, this)[0]) {
            possibilities.push({x: this.x - 1, y: this.y + 1});
        }
	    if(gameboard.get().tileSaveForKing(this.x-1, this.y-1, this)[0]) {
            possibilities.push({x: this.x - 1, y: this.y - 1});
	    }
	    if(gameboard.get().tileSaveForKing(this.x+1, this.y+1, this)[0]) {
            possibilities.push({x: this.x + 1, y: this.y + 1});
	    }
	    if(gameboard.get().tileSaveForKing(this.x, this.y+1, this)[0]) {
            possibilities.push({x: this.x, y: this.y + 1});
	    }
	    if(gameboard.get().tileSaveForKing(this.x-1, this.y, this)[0]) {
            possibilities.push({x: this.x - 1, y: this.y});
	    }
	    if(gameboard.get().tileSaveForKing(this.x+1, this.y, this)[0]) {
            possibilities.push({x: this.x + 1, y: this.y});
	    }
	    if(gameboard.get().tileSaveForKing(this.x, this.y-1, this)[0]) {
            possibilities.push({x: this.x, y: this.y - 1});
	    }
	    possibilities = possibilities.filter(function(x){
	        if(0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
	            return x;
            }
        });

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
            gamestate.winner = "White";
        } else {
            gamestate.winner = "Black";
        }
        this.dead = true;
	}
}

class queen extends chesspiece{
	constructor(x,y,blackpiece){
		let filename;
		
		if(blackpiece){
			filename = piecemap.black.queen;			
		}else{
			filename = piecemap.white.queen;			
		}

		super(filename,x,y,blackpiece);
	}

	options(){
		let possibilities = [];
		let gm = gameboard.get().constructgamemap();
        let possible = gameboard.get().kingNotInDanger(this);

        if(possible[0]) {
            //right
            for(let i = this.x + 1; i <= 7; i++){
                possibilities.push({x: i, y: this.y});
                if(gm[i][this.y] != null){break;}
            }
            //left
            for(let i = this.x - 1; i >= 0; i--){
                possibilities.push({x: i, y: this.y});
                if(gm[i][this.y] != null){break;}
            }
            //down
            for(let i = this.y + 1; i <= 7; i++){
                possibilities.push({x: this.x, y: i});
                if(gm[this.x][i] != null){break;}
            }
            //up
            for(let i = this.y - 1; i >= 0; i--){
                possibilities.push({x: this.x, y: i});
                if(gm[this.x][i] != null){break;}
            }
            //topright
            for (let i = this.x + 1, j = this.y + 1; i <= 7 && j <= 7; i++, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //bottomright
            for (let i = this.x + 1, j = this.y - 1; i <= 7 && j >= 0; i++, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //topleft
            for (let i = this.x - 1, j = this.y + 1; i >= 0 && j <= 7; i--, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //bottomleft
            for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
        } else if (possible[1] == "x+y+" || possible[1] == "x-y-"){
            //topright
            for (let i = this.x + 1, j = this.y + 1; i <= 7 && j <= 7; i++, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //bottomleft
            for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
        } else if (possible[1] == "x+y-" || possible[1] == "x-y+"){
            //bottomright
            for (let i = this.x + 1, j = this.y - 1; i <= 7 && j >= 0; i++, j--) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
            //topleft
            for (let i = this.x - 1, j = this.y + 1; i >= 0 && j <= 7; i--, j++) {
                possibilities.push({x: i, y: j});
                if (gm[i][j] != null) {
                    break;
                }
            }
        } else if (possible[1] == "y"){
            //down
            for(let i = this.y + 1; i <= 7; i++){
                possibilities.push({x: this.x, y: i});
                if(gm[this.x][i] != null){break;}
            }
            //up
            for(let i = this.y - 1; i >= 0; i--){
                possibilities.push({x: this.x, y: i});
                if(gm[this.x][i] != null){break;}
            }
		} else if (possible[1] == "x"){
            //right
            for(let i = this.x + 1; i <= 7; i++){
                possibilities.push({x: i, y: this.y});
                if(gm[i][this.y] != null){break;}
            }
            //left
            for(let i = this.x - 1; i >= 0; i--){
                possibilities.push({x: i, y: this.y});
                if(gm[i][this.y] != null){break;}
            }
		}

        possibilities = possibilities.filter(function(x){
            if(!(gm[x.x][x.y] != null && gm[x.x][x.y].blackpiece == gamestate.playerblack)&& 0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
                return x;
            }
        });

		if(!gamestate.playerblack){
			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}

        let saveKing = gameboard.get().saveTheKing();
        if(!saveKing[0]){
            possibilities = possibilities.filter(function(possibility){
                if(saveKing[1]){
                    for(let option of saveKing[1]){
                        if(option[0]==possibility.x && option[1]==possibility.y){
                            return possibility;
                        }
                    }
                }
            });
        }
		return possibilities;
	}
}

class rook extends chesspiece{
	constructor(x,y,blackpiece){
		let filename;
		if(blackpiece){
			filename = piecemap.black.rook;			
		}else{
			filename = piecemap.white.rook;			
		}

		super(filename,x,y,blackpiece);
	}

	options() {
        let possibilities = [];
        let gm = gameboard.get().constructgamemap();
		let possible = gameboard.get().kingNotInDanger(this);
		if(possible[0]){
        //right
        for (let i = this.x + 1; i <= 7; i++) {
            possibilities.push({x: i, y: this.y});
            if (gm[i][this.y] != null) {
                break;
            }
        }
        //left
        for (let i = this.x - 1; i >= 0; i--) {
            possibilities.push({x: i, y: this.y});
            if (gm[i][this.y] != null) {
                break;
            }
        }
        //down
        for (let i = this.y + 1; i <= 7; i++) {
            possibilities.push({x: this.x, y: i});
            if (gm[this.x][i] != null) {
                break;
            }
        }
        //up
        for (let i = this.y - 1; i >= 0; i--) {
            possibilities.push({x: this.x, y: i});
            if (gm[this.x][i] != null) {
                break;
            }
        }

    	}else if (possible[1] == "y"){
            //down
            for(let i = this.y + 1; i <= 7; i++){
                possibilities.push({x:this.x,y:i});
                if(gm[this.x][i] != null){break;}
            }
            //up
            for(let i = this.y - 1; i >= 0; i--){
                possibilities.push({x:this.x,y:i});
                if(gm[this.x][i] != null){break;}
            }
        } else if (possible[1] == "x"){
            //right
            for(let i = this.x + 1; i <= 7; i++){
                possibilities.push({x:i,y:this.y});
                if(gm[i][this.y] != null){break;}
            }
            //left
            for(let i = this.x - 1; i >= 0; i--){
                possibilities.push({x:i,y:this.y});
                if(gm[i][this.y] != null){break;}
            }
        }

        possibilities = possibilities.filter(function(x){
            if(!(gm[x.x][x.y] != null && gm[x.x][x.y].blackpiece == gamestate.playerblack)&& 0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
                return x;
            }
        });

		if(!gamestate.playerblack){
			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}

        let saveKing = gameboard.get().saveTheKing();
        if(!saveKing[0]){
            possibilities = possibilities.filter(function(possibility){
                if(saveKing[1]){
                    for(let option of saveKing[1]){
                        if(option[0]==possibility.x && option[1]==possibility.y){
                            return possibility;
                        }
                    }
                }
            });
        }

		return possibilities;
	}
}

class pawn extends chesspiece{
	constructor(x,y,blackpiece){
		let filename;
		if(blackpiece){
			filename = piecemap.black.pawn;			
		}else{
			filename = piecemap.white.pawn;			
		}

		super(filename,x,y,blackpiece);
		this.moved = false;
	}

	move(){
		this.moved=true;
	}

	options(){
		let gm = gameboard.get().constructgamemap();
		
		let possibilities = [];
		let possible = gameboard.get().kingNotInDanger(this);
		if(!gamestate.playerblack){
			if(possible[0]) {
                if (gm[this.x][this.y + 1] == null) {
                    possibilities.push({x: this.x, y: this.y + 1});

                    if (!this.moved) {

                        if (gm[this.x][this.y + 2] == null) {
                            possibilities.push({x: this.x, y: this.y + 2});
                        }
                    }
                }

                if (this.x < 7 && this.y < 7 && gm[this.x + 1][this.y + 1] instanceof chesspiece) {
                    possibilities.push({x: this.x + 1, y: this.y + 1});
                }

                if (this.x > 0 && this.y < 7 && gm[this.x - 1][this.y + 1] instanceof chesspiece) {
                    possibilities.push({x: this.x - 1, y: this.y + 1});
                }
            } else if (possible[0] == "y"){
                if (gm[this.x][this.y + 1] == null) {
                    possibilities.push({x: this.x, y: this.y + 1});

                    if (!this.moved) {

                        if (gm[this.x][this.y + 2] == null) {
                            possibilities.push({x: this.x, y: this.y + 2});
                        }
                    }
                }
			} else if (possible[0] == "x+y+"){
                if (this.x < 7 && this.y < 7 && gm[this.x + 1][this.y + 1] instanceof chesspiece) {
                    possibilities.push({x: this.x + 1, y: this.y + 1});
                }
			} else if (possible[0] == "x-y+"){
                if (this.x > 0 && this.y < 7 && gm[this.x - 1][this.y + 1] instanceof chesspiece) {
                    possibilities.push({x: this.x - 1, y: this.y + 1});
                }
			}

            possibilities = possibilities.filter(function(x){
                if(!(gm[x.x][x.y] != null && gm[x.x][x.y].blackpiece == gamestate.playerblack)&& 0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
                    return x;
                }
            });

			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}

            let saveKing = gameboard.get().saveTheKing();
            if(!saveKing[0]){
                possibilities = possibilities.filter(function(possibility){
                    if(saveKing[1]){
                        for(let option of saveKing[1]){
                            if(option[0]==possibility.x && option[1]==possibility.y){
                                return possibility;
                            }
                        }
                    }
                });
            }
		}else{
			if(possible[0]) {
                if (gm[this.x][this.y - 1] == null) {
                    possibilities.push({x: this.x, y: this.y - 1});

                    if (!this.moved) {

                        if (gm[this.x][this.y - 2] == null) {
                            possibilities.push({x: this.x, y: this.y - 2});
                        }
                    }

                }

                if (this.x < 7 && this.y > 0 && gm[this.x + 1][this.y - 1] instanceof chesspiece) {
                    possibilities.push({x: this.x + 1, y: this.y - 1});
                }

                if (this.x > 0 && this.y > 0 && gm[this.x - 1][this.y - 1] instanceof chesspiece) {
                    possibilities.push({x: this.x - 1, y: this.y - 1});
                }
            } else if (possible[1] == "y"){
                if (gm[this.x][this.y - 1] == null) {
                    possibilities.push({x: this.x, y: this.y - 1});

                    if (!this.moved) {

                        if (gm[this.x][this.y - 2] == null) {
                            possibilities.push({x: this.x, y: this.y - 2});
                        }
                    }

                }
			} else if (possible[1] == "x+y-"){
                if (this.x < 7 && this.y > 0 && gm[this.x + 1][this.y - 1] instanceof chesspiece) {
                    possibilities.push({x: this.x + 1, y: this.y - 1});
                }
			} else if (possible[1] == "x-y-"){
                if (this.x > 0 && this.y > 0 && gm[this.x - 1][this.y - 1] instanceof chesspiece) {
                    possibilities.push({x: this.x - 1, y: this.y - 1});
                }
			}

            possibilities = possibilities.filter(function(x){
                if(!(gm[x.x][x.y] != null && gm[x.x][x.y].blackpiece == gamestate.playerblack)&& 0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
                    return x;
                }
            });

            let saveKing = gameboard.get().saveTheKing();
            if(!saveKing[0]){
                possibilities = possibilities.filter(function(possibility){
                    if(saveKing[1]){
                        for(let option of saveKing[1]){
                            if(option[0]==possibility.x && option[1]==possibility.y){
                                return possibility;
                            }
                        }
                    }
                });
            }

		}

		return possibilities;
	}

}

class knight extends chesspiece{
	constructor(x,y,blackpiece){
		let filename;
		if(blackpiece){
			filename = piecemap.black.knight;			
		}else{
			filename = piecemap.white.knight;			
		}
		super(filename,x,y,blackpiece);
	}

	options(){
        let possibilities = [];

        if(gameboard.get().kingNotInDanger(this)[0]) {
            possibilities.push({x: this.x + 2, y: this.y + 1});
            possibilities.push({x: this.x - 2, y: this.y + 1});
            possibilities.push({x: this.x - 1, y: this.y + 2});
            possibilities.push({x: this.x + 1, y: this.y + 2});
            possibilities.push({x: this.x + 2, y: this.y - 1});
            possibilities.push({x: this.x - 2, y: this.y - 1});
            possibilities.push({x: this.x + 1, y: this.y - 2});
            possibilities.push({x: this.x - 1, y: this.y - 2});
        }
        if(gamestate.playerblack){
            possibilities = possibilities.filter(function(x){
                let piece = gameboard.get().getpieceat(x.x,x.y);
                if(!(piece != null && piece.blackpiece == gamestate.playerblack) && 0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
                    return x;
                }
            });
        } else {
            possibilities = possibilities.filter(function(x){
                let piece = gameboard.get().getpieceat(7-x.x,7-x.y);
                if(!(piece != null && piece.blackpiece == gamestate.playerblack)&& 0<=x.x && x.x<=7 && 0<=x.y && x.y<=7){
                    return x;
                }
            });

			for(let i of possibilities){
				i.x = 7-i.x;
				i.y = 7-i.y;
			}
		}

        let saveKing = gameboard.get().saveTheKing();
        if(!saveKing[0]){
            possibilities = possibilities.filter(function(possibility){
                if(saveKing[1]){
                    for(let option of saveKing[1]){
                        if(option[0]==possibility.x && option[1]==possibility.y){
                            return possibility;
                        }
                    }
                }
            });
        }


		return possibilities;
	}
}
function insertPieces() {
    //default game setup
    new rook(0, 0, false);
    new knight(1, 0, false);
    new bishop(2, 0, false);
    new king(3, 0, false);
    new queen(4, 0, false);
    new bishop(5, 0, false);
    new knight(6, 0, false);
    new rook(7, 0, false);
    new pawn(0, 1, false);
    new pawn(1, 1, false);
    new pawn(2, 1, false);
    new pawn(3, 1, false);
    new pawn(4, 1, false);
    new pawn(5, 1, false);
    new pawn(6, 1, false);
    new pawn(7, 1, false);

    new rook(0, 7, true);
    new knight(1, 7, true);
    new bishop(2, 7, true);
    new king(3, 7, true);
    new queen(4, 7, true);
    new bishop(5, 7, true);
    new knight(6, 7, true);
    new rook(7, 7, true);
    new pawn(0, 6, true);
    new pawn(1, 6, true);
    new pawn(2, 6, true);
    new pawn(3, 6, true);
    new pawn(4, 6, true);
    new pawn(5, 6, true);
    new pawn(6, 6, true);
    new pawn(7, 6, true);
}
insertPieces();


