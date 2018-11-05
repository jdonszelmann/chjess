

let chessboard;
let mainMenu;
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
    mainMenu = new Menu("mainMenu", 3,3,4,3, "Main Menu!");
    mainMenu.addButton("play", 2, 1.5,2,0.5, "Play!", function(){
    	mainMenu.close();
	});
    mainMenu.addButton("quit", 2, 2.1, 2, 0.5, "Quit!", function(){
    	//alert("Quiting is for losers!");
		if(confirm("You sure you want to quit? (Quiting is for losers :P)")){
			//Cant close this tab, because apparently I didnt create it, so i'll
			// just redirect them to the urban dictionary of the word rage quit
            open("https://www.urbandictionary.com/define.php?term=ragequit", '_self');
    	}
	});
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
		gameboard.get().draw()
		MouseInput.draw();
    activemenus.draw();
	}
}