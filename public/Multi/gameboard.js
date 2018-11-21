



class gameboard{
	constructor(){
		this.pieces = [];
		this.moving = null;
		this.selectedX = -1;
		this.selectedY = -1;
	}

	reset(){
		this.pieces = [];
		this.moving = null;
		this.selectedX = -1;
		this.selectedY = -1;
		if(gamestate.playerblack){
			gamestate.playerblack = false;
		}
		gamestate.animation = null;
		gamestate.animationcounter = 0;
		insertPieces();
	}

	static get(){
		if(!gameboard.instance){
			gameboard.instance = new gameboard;
		}
		return gameboard.instance;		
	}

	addpiece(piece){
		this.pieces.push(piece);
	}

	constructgamemap(){
		let gamemap = [];
		for (var i = 0; i < 8; i++) {
			gamemap.push([null,null,null,null,null,null,null,null,]);
		}


		for(let i of this.pieces){
			if(!i.dead){
				gamemap[i.x][i.y] = i;
			}
		}


		return gamemap;
	}

	getpieceat(x,y){
		if(!gamestate.playerblack){
			x = 7 - x;
			y = 7 - y;
		}

		for(let i of this.pieces){
			if(i.x == x && i.y == y && !i.dead){
				return i;
			}
		}
		return null;
	}

	draw(nomovedetect = false){
		if(!nomovedetect && !matchmaking && yourTurn){
			let gm = this.constructgamemap();

			if(MouseInput.selectedX != -1 && MouseInput.selectedY != -1
				&& this.selectedX == -1 && this.selectedY == -1
			){
				
				//nothing is moving at the moment
				if(this.moving == null){
					this.moving = this.getpieceat(MouseInput.selectedX,MouseInput.selectedY);

					if(this.moving != null && this.moving.blackpiece != gamestate.playerblack){
						//if wrong color is being moved: unselect
						
						this.selectedX = -1;
						this.selectedY = -1;
						this.moving = null;
					}

					if(this.moving != null){
						this.selectedX = MouseInput.selectedX;
						this.selectedY = MouseInput.selectedY;
					}

					//copy to this.selected{XY} for src position
					MouseInput.selectedX = -1;
					MouseInput.selectedY = -1;
				}else{
					//it cant be possible that a piece is moving but this.selected{XY} isnt set
					throw Error("shouldnt reach here");
				}
			}else if(this.selectedX != -1 && this.selectedY != -1
				&& MouseInput.selectedX == -1 && MouseInput.selectedY == -1
			){

				//draw the possibilities
				this.moving.drawoptions();

				//and the selected square
				noFill();
				strokeWidth(5);
				stroke(128,0,0);
				rect(this.selectedX*gamestate.cellwidth, this.selectedY*gamestate.cellwidth, gamestate.cellwidth,);


			}else if(MouseInput.selectedX != -1 && MouseInput.selectedY != -1
				&& this.selectedX != -1 && this.selectedY != -1
			){
				if(MouseInput.selectedX == this.selectedX && MouseInput.selectedY == this.selectedY){
					//if we are moving and click the src tile, stop moving 
					this.selectedX = -1;
					this.selectedY = -1;
					MouseInput.selectedX = -1;
					MouseInput.selectedY = -1;
					this.moving = null;
				}else{
					//if we are moving and we clicked a destination square

					let oldpiece = this.getpieceat(MouseInput.selectedX,MouseInput.selectedY);			

					//this check if we can actually move to the selected square
					//else keep selecting
					let found = false;
					for(let i of this.moving.options()){
						if(i.x == MouseInput.selectedX && i.y == MouseInput.selectedY ){
							if(oldpiece){
								if(oldpiece.blackpiece == this.moving.blackpiece){
									continue;
								}else{
									found = true;
									break;
								}
							}else{
								found = true;
								break;
							}
						}
					}
					if(found){
						if(oldpiece != null){
							oldpiece.kill();
						}

						let piece = this.getpieceat(this.selectedX,this.selectedY);

						//account for flipped boards
						if(gamestate.playerblack){
							movepiece(MouseInput.selectedX,MouseInput.selectedY,piece);
						}else{
							movepiece(7-MouseInput.selectedX,7-MouseInput.selectedY,piece);
						}

						if(piece.move){
							piece.move();
						}


                        yourTurn = false;

						//stop moving, reset all
						this.selectedX = -1;
						this.selectedY = -1;
						MouseInput.selectedX = -1;
						MouseInput.selectedY = -1;
						this.moving = null;

						if(gamestate.winner != null){
                            openMenu("EndGame");
                        }

					}else{
						MouseInput.selectedX = -1;
						MouseInput.selectedY = -1;			
					}
				}
			}					
		}


		for(let i of this.pieces){
			i.draw();
		}
	}
	kingNotInDanger(piece){
		let King;
		for(let i of this.pieces){
			if(i.blackpiece == gamestate.playerblack && i.constructor == king){
				King = i;
			}
		}

		//Check if the piece you want to move is the only think in between an enemy queen, rook or bishop and your king.
		//Check if piece and king are in the same line
		if(gamestate.playerblack) {
            if (King.x == piece.x && (piece.x != 0 || piece.x != 7)) {
                if (King.y < piece.y) {
                    for (let i = 1; i < (piece.y - King.y); i++) {
                        let enemyPiece = this.getpieceat(King.x, King.y + i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (8 - piece.y); i++) {
                        let enemyPiece = this.getpieceat(piece.x, piece.y + i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "y"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else {
                    for (let i = 1; i < (King.y - piece.y); i++) {
                        let enemyPiece = this.getpieceat(King.x, piece.y + i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (piece.y + 1); i++) {
                        let enemyPiece = this.getpieceat(piece.x, piece.y - i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "y"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                }
            }
            if (King.y == piece.y && (piece.y != 0 || piece.y != 7)) {
                if (King.x < piece.x) {
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat(King.x + i, King.y);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (8 - piece.x); i++) {
                        let enemyPiece = this.getpieceat(piece.x + i, piece.y);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "x"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else {
                    for (let i = 1; i < (King.x - piece.x); i++) {
                        let enemyPiece = this.getpieceat(King.x + i, piece.y);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (piece.x + 1); i++) {
                        let enemyPiece = this.getpieceat(piece.x - i, piece.y);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "x"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                }
            }
            if (Math.abs(King.x - piece.x) == Math.abs(King.y - piece.y)) {
                if (King.x < piece.x && King.y < piece.y) {
                    //Piece is right under the king
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat(King.x + i, King.y + i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(8 - piece.x, 8 - piece.y); i++) {
                        let enemyPiece = this.getpieceat(piece.x + i, piece.y + i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x+y+"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else if (King.x < piece.x && King.y > piece.y) {
                    //Piece is right above the king
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat(King.x + i, King.y - i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(8 - piece.x, piece.y + 1); i++) {
                        let enemyPiece = this.getpieceat(piece.x + i, piece.y - i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x+y-"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else if (King.x > piece.x && King.y < piece.y) {
                    //Piece is left under the king
                    for (let i = 1; i < (King.x - piece.x); i++) {
                        let enemyPiece = this.getpieceat(King.x - i, King.y + i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(piece.x + 1, 8 - piece.y); i++) {
                        let enemyPiece = this.getpieceat(piece.x - i, piece.y + i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x-y+"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else {
                    //Piece is left above the king
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat(King.x - i, King.y - i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(piece.x + 1, piece.y + 1); i++) {
                        let enemyPiece = this.getpieceat(piece.x - i, piece.y - i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x-y-"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                }
            }
        } else {
            if (King.x == piece.x && (piece.x != 0 || piece.x != 7)) {
                if (King.y < piece.y) {
                    for (let i = 1; i < (piece.y - King.y); i++) {
                        let enemyPiece = this.getpieceat((7-King.x), (7-King.y) + i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (8 - piece.y); i++) {
                        let enemyPiece = this.getpieceat(7-piece.x, (7-piece.y) - i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "y"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else {
                    for (let i = 1; i < (King.y - piece.y); i++) {
                        let enemyPiece = this.getpieceat((7-King.x), (7-piece.y) - i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (piece.y + 1); i++) {
                        let enemyPiece = this.getpieceat((7-piece.x), (7-piece.y) + i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "y"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                }
            }
            if (King.y == piece.y && (piece.y != 0 || piece.y != 7)) {
                if (King.x < piece.x) {
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat((7-King.x) - i, (7-King.y));
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (8 - piece.x); i++) {
                        let enemyPiece = this.getpieceat((7-piece.x) - i, 7-piece.y);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "x"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else {
                    for (let i = 1; i < (King.x - piece.x); i++) {
                        let enemyPiece = this.getpieceat((7-King.x) + i, 7-piece.y);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < (piece.x + 1); i++) {
                        let enemyPiece = this.getpieceat((7-piece.x) + i, 7-piece.y);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == rook || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy rook or queen.
                            return [false, "x"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy rook or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                }
            }
            if (Math.abs(King.x - piece.x) == Math.abs(King.y - piece.y)) {
                if (King.x < piece.x && King.y < piece.y) {
                    //Piece is right under the king
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat((7-King.x) - i, (7-King.y) - i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(8 - piece.x, 8 - piece.y); i++) {
                        let enemyPiece = this.getpieceat((7-piece.x) - i, (7-piece.y) - i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x+y+"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else if (King.x < piece.x && King.y > piece.y) {
                    //Piece is right above the king
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat((7-King.x) - i, (7-King.y) + i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(8 - piece.x, piece.y + 1); i++) {
                        let enemyPiece = this.getpieceat((7-piece.x) - i, (7-piece.y) + i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x+y-"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else if (King.x > piece.x && King.y < piece.y) {
                    //Piece is left under the king
                    for (let i = 1; i < (King.x - piece.x); i++) {
                        let enemyPiece = this.getpieceat((7-King.x) + i, (7-King.y) - i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(piece.x + 1, 8 - piece.y); i++) {
                        let enemyPiece = this.getpieceat((7-piece.x) + i, (7-piece.y) - i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x-y+"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                } else {
                    //Piece is left above the king
                    for (let i = 1; i < (piece.x - King.x); i++) {
                        let enemyPiece = this.getpieceat((7-King.x) + i, (7-King.y) + i);
                        if (enemyPiece != null && !enemyPiece.dead) {
                            //There is something between this piece and the king, so don't worry about moving this piece
                            return [true];
                        }
                    }
                    for (let i = 1; i < Math.min(piece.x + 1, piece.y + 1); i++) {
                        let enemyPiece = this.getpieceat((7-piece.x) + i, (7-piece.y) + i);
                        if (enemyPiece != null && enemyPiece.blackpiece != piece.blackpiece && (enemyPiece.constructor == bishop || enemyPiece.constructor == queen) && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and an enemy bishop or queen.
                            return [false, "x-y-"];
                        } else if (enemyPiece != null && !enemyPiece.dead) {
                            //The piece we want to move is standing between the king and a piece that is not an enemy bishop or queen, so we can move it.
                            return [true];
                        }
                    }
                    //Every tile is empty in front of the piece we want to move so this piece is clear to move.
                    return [true];
                }
            }
		}
		return [true];
	}
	tileSaveForKing(x,y, itself){
        let piece;
        let Return = true;
        let enemy= [];
        if(gamestate.playerblack){
            //See if there is a bishop or a queen right above this tile
            for(let i = 1; i<Math.min(8-x, 1+y); i++){
                piece = gameboard.get().getpieceat(x+i, y-i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x+e,y-e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a bishop or queen left above this tile
            for(let i = 1; i<Math.min(1+x, 1+y); i++){
                piece = gameboard.get().getpieceat(x-i, y-i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x-e,y-e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a bishop or queen right under this tile
            for(let i = 1; i<Math.min(8-x, 8-y); i++){
                piece = gameboard.get().getpieceat(x+i, y+i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x+e,y+e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a bishop or queen left under this tile
            for(let i = 1; i<Math.min(1+x, 8-y); i++){
                piece = gameboard.get().getpieceat(x-i, y+i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x-e,y+e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }

            //See if there is a rook or a queen to the right of this tile
            for(let i = 1; i<(8-x); i++){
                piece = gameboard.get().getpieceat(x+i, y);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x+e,y]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a rook or a queen to the left of this tile
            for(let i = 1; i<(1+x); i++){
                piece = gameboard.get().getpieceat(x-i, y);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x-e,y]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a rook or a queen above this tile
            for(let i = 1; i<(1+y); i++){
                piece = gameboard.get().getpieceat(x, y-i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x,y-e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a rook or a queen below this tile
            for(let i = 1; i<(8-y); i++){
                piece = gameboard.get().getpieceat(x, y+i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([x,y+e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }

            //See if there is a pawn at (x-1,y-1) or at (x+1, y-1)
            piece = this.getpieceat(x-1, y-1);
            if(piece != null && !piece.blackpiece && piece instanceof pawn){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            piece = this.getpieceat(x+1, y-1);
            if(piece != null && !piece.blackpiece && piece instanceof pawn){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }

            //See if there is a knight at (x+1, y-2)
            piece = this.getpieceat(x+1, y-2);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-1, y-2)
            piece = this.getpieceat(x-1, y-2);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x+1, y+2)
            piece = this.getpieceat(x+1, y+2);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-1, y+2)
            piece = this.getpieceat(x-1, y+2);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-2, y+1)
            piece = this.getpieceat(x-2, y+1);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-2, y-1)
            piece = this.getpieceat(x-2, y-1);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x+2, y+1)
            piece = this.getpieceat(x+2, y+1);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x+2, y-1)
            piece = this.getpieceat(x+2, y-1);
            if(piece != null && !piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([piece.x, piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }

            //See if the tile contains one of our pieces
            piece = this.getpieceat(x,y);
            if(piece != null && piece.blackpiece && piece != itself){
                return [false]
            }
        } else {
            //See if there is a bishop or a queen right above this tile
            for(let i = 1; i<Math.min(8-x, 1+y); i++){
                piece = gameboard.get().getpieceat((7-x)-i, (7-y)+i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([(7-x)-e,(7-y)+e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a bishop or queen left above this tile
            for(let i = 1; i<Math.min(1+x, 1+y); i++){
                piece = gameboard.get().getpieceat((7-x)+i, (7-y)+i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([(7-x)+e,(7-y)+e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a bishop or queen right under this tile
            for(let i = 1; i<Math.min(8-x, 8-y); i++){
                piece = gameboard.get().getpieceat((7-x)-i, (7-y)-i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([(7-x)-e,(7-y)-e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a bishop or queen left under this tile
            for(let i = 1; i<Math.min(1+x, 8-y); i++){
                piece = gameboard.get().getpieceat((7-x)+i, (7-y)-i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof bishop)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([(7-x)+e,(7-y)-e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }

            //See if there is a rook or a queen to the right of this tile
            for(let i = 1; i<(8-x); i++){
                piece = gameboard.get().getpieceat((7-x)-i, 7-y);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([(7-x)-e,7-y]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a rook or a queen to the left of this tile
            for(let i = 1; i<(1+x); i++){
                piece = gameboard.get().getpieceat((7-x)+i, 7-y);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([(7-x)+e,7-y]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a rook or a queen above this tile
            for(let i = 1; i<(1+y); i++){
                piece = gameboard.get().getpieceat(7-x, (7-y)+i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([7-x,(7-y)+e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }
            //See if there is a rook or a queen below this tile
            for(let i = 1; i<(8-y); i++){
                piece = gameboard.get().getpieceat(7-x, (7-y)-i);
                if(piece != null && piece == itself){
                    continue;
                }
                if(piece != null && !piece.dead && !piece.blackpiece){
                    break;
                }
                if(piece != null && !piece.dead && !(piece instanceof queen || piece instanceof rook)){
                    break;
                } else if (piece != null && !piece.dead){
                    if(x == itself.x && y == itself.y){
                        for(let e = i; e!=0; e--){
                            enemy.push([7-x,(7-y)-e]);
                        }
                        Return = false;
                    } else {
                        return [false]
                    }
                }
            }

            //See if there is a pawn at (x+1,y+1) or at (x-1, y+1)
            piece = this.getpieceat((7-x)-1, (7-y)-1);
            if(piece != null && piece.blackpiece && piece instanceof pawn){
                if(x == itself.x && y == itself.y){
                    enemy.push([(7-piece.x), (7-piece.y)]);
                    Return = false;
                } else {
                    return [false]
                }
            }
            piece = this.getpieceat((7-x)+1, (7-y)-1);
            if(piece != null && piece.blackpiece && piece instanceof pawn){
                if(x == itself.x && y == itself.y){
                        enemy.push([(7-piece.x), (7-piece.y)]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }

            //See if there is a knight at (x+1, y-2)
            piece = this.getpieceat((7-x)+1, (7-y)-2);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-1, y-2)
            piece = this.getpieceat((7-x)-1, (7-y)-2);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x+1, y+2)
            piece = this.getpieceat((7-x)+1, (7-y)+2);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-1, y+2)
            piece = this.getpieceat((7-x)-1, (7-y)+2);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-2, y+1)
            piece = this.getpieceat((7-x)-2, (7-y)+1);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x-2, y-1)
            piece = this.getpieceat((7-x)-2, (7-y)-1);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x+2, y+1)
            piece = this.getpieceat((7-x)+2, (7-y)+1);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }
            //See if there is a knight at (x+2, y-1)
            piece = this.getpieceat((7-x)+2, (7-y)-1);
            if(piece != null && piece.blackpiece && piece instanceof knight){
                if(x == itself.x && y == itself.y){
                        enemy.push([7-piece.x, 7-piece.y]);
                        Return = false;
                    } else {
                        return [false]
                    }
            }

            //See if the tile contains one of our pieces
            piece = this.getpieceat((7-x),(7-y));
            if(piece != null && !piece.blackpiece && piece != itself){
                return [false]
            }


        }
        if(Return){
            return [true];
        } else {
            return [false, enemy];
        }
    }
    saveTheKing(opposite=false){
	    let King;
        if(opposite){
            King = this.pieces.filter(function(x){
                if(x.blackpiece != gamestate.playerblack && x instanceof king){
                    return x;
                }
            })[0];
        } else {
            King = this.pieces.filter(function(x){
                if(x.blackpiece == gamestate.playerblack && x instanceof king){
                    return x;
                }
            })[0];
        }
        return this.tileSaveForKing(King.x, King.y, King);


	}
	isItCheckMate(){
        if(!this.saveTheKing()[0]){
            console.log("Look from here!");
            let checkmate = true;
            for(let piece of this.pieces){
                if(piece.dead == false && piece.blackpiece == gamestate.playerblack && piece.options().length != 0){
                    console.log(piece);
                    checkmate = false;
                }
            }
            if(checkmate) {
                this.pieces.filter(function (x) {
                    if (x.blackpiece == gamestate.playerblack && x instanceof king) {
                        return x;
                    }
                })[0].kill();
                openMenu("EndGame");
            }
        }
    }

}
