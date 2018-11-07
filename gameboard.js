



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
		if(!nomovedetect){
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
				stroke(250,0,0)
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

}
