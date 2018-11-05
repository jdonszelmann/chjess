



class gameboard{
	constructor(){
		this.pieces = []
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
		let gamemap = []
		for (var i = 0; i < 8; i++) {
			map.push([]);
		}

		for(let i of this.pieces){
			map[i.x][i.y] = i;
		}

		return gamemap;
	}

	draw(){
		for(let i of this.pieces){
			i.draw();
		}
	}

}
