

class chessclock{
	constructor(){
		this.canvas = document.getElementById("chessclock");
		this.context = this.canvas.getContext("2d");

		this.canvas.width = window.innerHeight - 50;
		this.canvas.height = 30;
		this.canvas.style.position = "absolute";

		this.reset();
	}

	static get(){
		if(!chessclock.instance){
			chessclock.instance = new chessclock();
		}
		return chessclock.instance;		
	}

	reset(){
		this.whitetime = gamestate.clocklength;
		this.blacktime = gamestate.clocklength;
	}

	gettime(flt){
		let hours = ("0" + Math.floor(flt / 3600)).slice(-2);
		flt -= 3600*hours;
		let minutes = ("0" + Math.floor(flt / 60)).slice(-2);
		flt -= 60*minutes;
		let seconds =  ("0" + Math.floor(flt)).slice(-2);
		flt -= seconds;
		let milliseconds =  ("0" + Math.floor(flt * 100)).slice(-2);
		return `${hours}:${minutes}:${seconds}:${milliseconds}`
	}

	reload(){
		this.canvas.width = window.innerHeight - 50;
		this.canvas.height = 30;
		this.canvas.style.position = "absolute";		
	}

	update(){
		if(gamestate.clockoff){
			this.context.fillStyle = `rgba(${51}, ${51}, ${51}, ${1})`;
			this.context.beginPath();
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.stroke()
			this.context.fill()
			this.context.closePath()

			this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${1})`;
			this.context.font = "15px monospace";
			this.context.textAlign = "center";
			this.context.fillText(`chessclock off`, this.canvas.width/2, this.canvas.height/2);
			this.context.stroke()
			this.context.fill()	

			this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${1})`;
			this.context.font = "15px monospace";
			this.context.textAlign = "left";
			this.context.fillText(Object.values(gamestate.gamestring).join("::"), 10, this.canvas.height/2);
			this.context.stroke()
			this.context.fill()		
		}else{
			//0.1 to avoid negative times
			if(this.whitetime <= 0.1){
				gamestate.winner = "Black";
				openMenu("EndGame");
			}
			if(this.blacktime <= 0.1){
				gamestate.winner = "White";
				openMenu("EndGame");
			}

			if(!gamestate.paused){
				if(!gamestate.playerblack){
					this.whitetime -= 0.1;
				}else{
					this.blacktime -= 0.1;
				}
			}

			this.context.fillStyle = `rgba(${51}, ${51}, ${51}, ${1})`;
			this.context.beginPath();
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.stroke()
			this.context.fill()
			this.context.closePath()

			this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${1})`;
			this.context.font = "15px monospace";
			this.context.textAlign = "center";
			this.context.fillText(`white: ${this.gettime(this.whitetime)} :::: black: ${this.gettime(this.blacktime)}`, this.canvas.width/2, this.canvas.height/2);
			this.context.stroke()
			this.context.fill()

			this.context.fillStyle = `rgba(${255}, ${255}, ${255}, ${1})`;
			this.context.font = "15px monospace";
			this.context.textAlign = "left";
			this.context.fillText(Object.values(gamestate.gamestring).join("::"), 10, this.canvas.height/2);
			this.context.stroke()
			this.context.fill()
		}
	}
}