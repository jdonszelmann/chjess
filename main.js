

let chessboard;

function setup(){
	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;
	document.getElementsByTagName("body")[0].style.textAlign = "center"

	chessboard = createImage();
	chessboard.src = "recourses/chessboard.png"

}

function draw(){
	background(51);
	
	blit(chessboard,0,0,canvas.width,canvas.height)

	stroke(255);
	noFill();
	ellipse(canvas.width/2,canvas.height/2,50,50);


	line(0,0,canvas.width,canvas.height)

	rect(100,100,100,100)
}