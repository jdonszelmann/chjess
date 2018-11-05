

let chessboard;

function setup(){

	setuppieces(); //chesspiece.js

	//graphics lib executes this once at load time

	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;

	document.getElementsByTagName("body")[0].style.textAlign = "center"

	chessboard = new Image();
	chessboard.src = "resources/chessboard.png"

	//Event listeners for mouse-input
    canvas.addEventListener("mousemove", function (evt) {
        MouseInput.x = evt.clientX - canvas.offsetLeft;
        MouseInput.y = evt.clientY - canvas.offsetTop;
    });
	canvas.addEventListener("click", function (){
		MouseInput.detect()
    });
}

function draw(){
	
	//executed 60 times per second after all loads have completed
	pop();
	blit(0,0,canvas.width,canvas.height,chessboard)

	ellipse(canvas.width/2,canvas.height/2,50,50);

	line(0,0,canvas.width,canvas.height);

	rect(100,100,100,100);
	push();

	MouseInput.draw();

}