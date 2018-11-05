



class gameboard{
	constructor(){
		if(!gameboard.instance){
			this.board = [
				[,,,,,,,,],
				[,,,,,,,,],
				[,,,,,,,,],
				[,,,,,,,,],
				[,,,,,,,,],
				[,,,,,,,,],
				[,,,,,,,,],
				[,,,,,,,,]
			]


			gameboard.instance = this;
		}
		return gameboard.instance;
	}
}