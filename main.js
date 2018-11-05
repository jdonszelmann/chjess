

let chessboard;

window.onresize = function(){
	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;

	gamestate.cellwidth = canvas.width/8;
}


function setup(){


	//graphics lib executes this once at load time

	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;

	gamestate.cellwidth = canvas.width/8;

	document.getElementsByTagName("body")[0].style.textAlign = "center"

	whitechessboard = new Image();
	whitechessboard.src = "resources/chessboard-black.png"

	blackchessboard = new Image();
	blackchessboard.src = "resources/chessboard-white.png"

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
	// pop();
	if(gamestate.playerblack){
		blit(0,0,canvas.width,canvas.height,blackchessboard);
	}else{
		blit(0,0,canvas.width,canvas.height,whitechessboard);
	}

	// ellipse(canvas.width/2,canvas.height/2,50,50);

	// line(0,0,canvas.width,canvas.height);

	// rect(100,100,100,100);
	// push();

	gameboard.get().draw()


	TestButton.draw();
    MouseInput.draw();

}