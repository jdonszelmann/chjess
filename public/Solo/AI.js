

let AI = {

	allmoves:function(black){
		let possiblemoves = [];
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

	minimax: function(depth, isblack, alpha, beta){
		if(depth == 0){
			return -this.boardvalue();
		}
		gamestate.playerblack = isblack;

		let possibilities = shuffle(this.allmoves(isblack));
		if (isblack) {
			let bestMove = -9999;
			for (let i = 0; i < possibilities.length; i++) {
				
				let tmp = gameboard.get().getmap();

				this.moveto(possibilities[i]);
				bestMove = Math.max(bestMove, this.minimax(depth - 1, !isblack, alpha, beta));
				
				gameboard.get().loadmap(tmp);

				alpha = Math.max(alpha, bestMove);
				if(beta <= alpha){
					return bestMove;
				}

			}
			return bestMove;
		} else {
			let bestMove = 9999;
			for (let i = 0; i < possibilities.length; i++) {
				let tmp = gameboard.get().getmap();

				this.moveto(possibilities[i]);
				bestMove = Math.min(bestMove, this.minimax(depth - 1, !isblack, alpha, beta));

				gameboard.get().loadmap(tmp);

				beta = Math.min(beta, bestMove);
				if (beta <= alpha) {
					return bestMove;
				}
			}
			return bestMove;
		}

	},


	filtermoves:function(depth){
		let tmpwin = gamestate.winner;
		
		gamestate.playerblack = true;

	
		let possibilities = shuffle(this.allmoves(true));
		let bestMove = -9999;
		let bestMoveFound;

		for(let i = 0; i < possibilities.length; i++) {
			let tmp = gameboard.get().getmap();

			
			let newGameMove = possibilities[i];
			this.moveto(newGameMove);


			let value = this.minimax(depth - 1, false,-10000, 10000);
			gameboard.get().loadmap(tmp);

			if(value >= bestMove) {
				bestMove = value;
				bestMoveFound = newGameMove;
			}
			console.log(bestMoveFound,value,this.boardvalue());
		}


		gamestate.winner = tmpwin;
		return bestMoveFound;
	},

	//AI assumes it is always black
	nextmove:function(){

		let move = this.filtermoves(4);

		gamestate.playerblack = true;

		if(!move){
			gamestate.winner = "White";
			return;
		}

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