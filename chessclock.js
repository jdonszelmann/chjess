

class chessclock{
	constructor(){
		this.chessclock = document.getElementById("chessclock");
	}

	static get(){
		if(!gameboard.instance){
			gameboard.instance = new gameboard;
		}
		return gameboard.instance;		
	}


	start(){

	}

	stop(){

	}

	reset(){

	}

	switch(){
		
	}

}