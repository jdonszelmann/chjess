

let AI = {

	allmoves:function(black=true){
		let possiblemoves = []
		for(let i of gameboard.get().pieces){
			if(i.blackpiece == black && !i.dead){
				for(let j of i.options()){
					possiblemoves.push({
						to:[j.x,j.y],
						from:[i.x,i.y],
						piece:i,
					});
				}
			}
		}
		return possiblemoves;
	},

	boardvalue(){
		let totalscore = 0;
		for(let i of gameboard.get().pieces){
			if(i.dead){
				continue;
			}
			let score;
			if(i == null){
				score = 0;
			}else if(i.constructor.name == "bishop"){
				score = 30;
			}else if(i.constructor.name == "pawn"){
				score = 10;
			}else if(i.constructor.name == "rook"){
				score = 50;
			}else if(i.constructor.name == "knight"){
				score = 30;
			}else if(i.constructor.name == "queen"){
				score = 90;
			}else if(i.constructor.name == "king"){
				score = 900;
			}
			if(!i.blackpiece){
				score = -score;
			}
			totalscore += score;
		}
		return totalscore;
	},

	moveto:function(move){
		let oldpiece = gameboard.get().getpieceat(move.to[0],move.to[1]);
		// move.piece = gameboard.get().getpieceat(move.from[0],move.from[1]);
		if(oldpiece != null){
			oldpiece.kill();
		}

		if(move.piece.move){
			move.piece.move();
		}
		move.piece.x = move.to[0];
		move.piece.y = move.to[1];


	},
	filtermoveswhite:function(possibilities,rec=0){
		let oldwinner = gamestate.winner;
		let oldplayer = gamestate.playerblack;
		gamestate.playerblack = true;

		let highest = {
			move:null,
			value:-999999,
		}

		let tmp = gameboard.get().getmap();
		for(let i of possibilities){		

			this.moveto(i);
			let value = this.boardvalue();
			console.log(value,i)


			gameboard.get().loadmap(tmp);
		}
		console.log(highest.move);
		gamestate.playerblack = oldplayer;
		gamestate.winner = oldwinner;
		return highest.move;
	},

	filtermovesblack:function(possibilities,rec=0){
		let oldwinner = gamestate.winner;
		let oldplayer = gamestate.playerblack;
		gamestate.playerblack = true;
		let highest = {
			move:null,
			value:-999999,
		}

		let tmp = gameboard.get().getmap();
		for(let i of possibilities){

			gamestate.playerblack = true;

			this.moveto(i);
			let value = this.boardvalue();
			// console.log(value,i);
			if(rec != 1){
				gamestate.playerblack = false;
				let newpossibilities = this.allmoves(false);
				gamestate.playerblack = true;
				this.filtermoveswhite(newpossibilities);

			}


			if(value > highest.value){
				highest.move = i;
				highest.value = value;
			}

			gameboard.get().loadmap(tmp);
		}
		gamestate.playerblack = oldplayer;
		gamestate.winner = oldwinner;
		console.log(highest.move);
		return highest.move;
	},

	//AI assumes it is always black
	nextmove:function(){

		gamestate.playerblack = true;

		let possibilities = this.allmoves();

		if(possibilities.length == 0){
            gamestate.winner = "White";
            gamestate.animation = null;
            gamestate.playerblack = false;
            openMenu("EndGame");
			return;
		}

		let move = this.filtermovesblack(possibilities);

		let oldpiece = gameboard.get().getpieceat(move.to[0],move.to[1]);

		if(gamestate.winner != null){
            openMenu("EndGame");
        }


		if(oldpiece != null){
			oldpiece.kill();
		}

		if(move.piece.move){
			move.piece.move();
		}

		gamestate.animation="movepiece";
		gamestate.animationcounter=0;
		gamestate.dst = move.to;
		gamestate.src = move.from;
		gamestate.piecemoving = move.piece;
		gamestate.AImove = true;

		gamestate.playerblack = false;
	} 
}