

let chessboard;

function setup(){

	//graphics lib executes this once at load time

	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;
	document.getElementsByTagName("body")[0].style.textAlign = "center"

	chessboard = new Image();
	chessboard.src = "recourses/chessboard.png"

}

function draw(){
	
	//executed 60 times per second after all loads have completed






	stroke(255);
	ellipse(canvas.width/2,canvas.height/2,50,50);
	noFill();

	line(0,0,canvas.width,canvas.height)

	rect(100,100,100,100)

	blit(0,0,canvas.width,canvas.height,chessboard)
	

}