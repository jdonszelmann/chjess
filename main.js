

let whitechessboard;
let blackchessboard;
let winner = null;

let activemenus;
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
		MouseInput.detect();
    });

	activemenus = new activeMenus();
	openMenu("Main Menu");
	openMenu("Main Menu Tab");
	openMenu("Main Menu InGame");
}

function draw(){
	
	//executed 60 times per second after all loads have completed

	if(gamestate.animation == "rotateboard"){


		let darktime = 50;

		gamestate.animationcounter++;

		if(gamestate.animationcounter == Math.round(20 + darktime/8)){
			gamestate.playerblack = !gamestate.playerblack;
		}

		if(gamestate.animationcounter == 40 + darktime){
			gamestate.animation = null;			
		}

		if(gamestate.playerblack){
			blit(0,0,canvas.width,canvas.height,blackchessboard);
		}else{
			blit(0,0,canvas.width,canvas.height,whitechessboard);
		}

		// singleton
		gameboard.get().draw()
		MouseInput.draw();
        activemenus.draw();

        let x = 1.2 * Math.sin(((2*Math.PI)/(80+darktime)) * gamestate.animationcounter);


		if(x > 1){
			x = 1;
		}

		background(51,51,51,x);

	}else if(false){

	}else{
		if(gamestate.playerblack){
			blit(0,0,canvas.width,canvas.height,blackchessboard);
		}else{
			blit(0,0,canvas.width,canvas.height,whitechessboard);
		}

		//singleton
		gameboard.get().draw();
		MouseInput.draw();
		activemenus.draw();
	}
}