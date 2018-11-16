

let whitechessboard;
let blackchessboard;

let activemenus;

window.onresize = function(){
	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;

	gamestate.cellwidth = canvas.width/8;

	openMenu("Main Menu");
	openMenu("Main Menu Tab");
	openMenu("Main Menu InGame");
	openMenu("settings");
	openMenu("confirm");
	openMenu("confirm2");
	openMenu("ChoosePawn");
	chessclock.get().reload();
}

//listening to zoom events
window.onzoom = function() {
	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;

	gamestate.cellwidth = canvas.width/8;
	
	openMenu("Main Menu");
	openMenu("Main Menu Tab");
	openMenu("Main Menu InGame");
	openMenu("settings");
	openMenu("confirm");
	openMenu("confirm2");
	chessclock.get().reload();
};

// detect resize
let pixelratio = 0;
function pollresize() {
	let newpixelratio = (window.outerWidth - 8) / window.innerWidth;
	if(newpixelratio != pixelratio){
		window.onzoom();
		pixelratio = newpixelratio;
		if((pixelratio < 0.8 || pixelratio > 1.8)){
			alert("for a better experience, please change your zoom level closer to 100%");
		}
	}
}


window.setInterval(pollresize, 100);

function setup(){
	//graphics lib executes this once at load time

	canvas.width = window.innerHeight-50;
	canvas.height = canvas.width;

	gamestate.cellwidth = canvas.width/8;

	document.getElementsByTagName("body")[0].style.textAlign = "center"
	document.getElementsByTagName("body")[0].style.backgroundColor = "rgb(51,51,51)"

	whitechessboard = new Image();
	whitechessboard.src = "resources/chessboard-black.png"

	blackchessboard = new Image();
	blackchessboard.src = "resources/chessboard-white.png"

	//make room for chessclock
	canvas.style.marginTop = 30;

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
	openMenu("settings");
	openMenu("confirm");
	openMenu("confirm2");
	openMenu("ChoosePawn");


	let ratio = (window.outerWidth - 8) / window.innerWidth;
	if(ratio < 0.8 || ratio > 1.8){
		alert("for a better experience, please change your zoom level closer to 100%");
	}
}

function draw(){
	
	//executed 60 times per second after all loads have completed

	if(gamestate.animation == "rotateboard" && gamestate.winner==null){

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
        gameboard.get().isItCheckMate();

        let x = 1.2 * Math.sin(((2*Math.PI)/(80+darktime)) * gamestate.animationcounter);

		if(x > 1){
			x = 1;
		}

		background(51,51,51,x);

	}else if(gamestate.animation == "movepiece"){

		function lerp(a, b, n) {
			return (1 - n) * a + n * b;
		}

		let length = 20;

		gamestate.animationcounter++;

		//linearly interpolate between src and dst
		let newx = lerp(gamestate.src[0],gamestate.dst[0],gamestate.animationcounter/length);
		let newy = lerp(gamestate.src[1],gamestate.dst[1],gamestate.animationcounter/length);

		// console.log([newx,newy]	,gamestate.src,gamestate.dst);

		gamestate.piecemoving.x = newx;
		gamestate.piecemoving.y = newy;


		if(gamestate.animationcounter == length-1){
			gamestate.animation = "rotateboard";
			gamestate.animationcounter = 0;

			gamestate.piecemoving.x = gamestate.dst[0];
			gamestate.piecemoving.y = gamestate.dst[1];
		}


		if(gamestate.playerblack){
			blit(0,0,canvas.width,canvas.height,blackchessboard);
		}else{
			blit(0,0,canvas.width,canvas.height,whitechessboard);
		}

		gameboard.get().draw(nomovedetect=true)
		MouseInput.draw();
		activemenus.draw();

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