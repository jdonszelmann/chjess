
//these are constant because it makes them faster
const c = document.getElementById("canvas"); //canvas element
const context = c.getContext("2d"); //2d canvas context to draw on

function translate(x,y){
	context.translate(x,y); //translate to x,y. all coordinates are relative to this. every draw loop this is reset
}

//save current drawing context on a stack to restore later
function push(){
	context.save();
}


//restore latest saved context
function pop(){
	context.restore();
}


//rotate context by angle radians. everything draw is at this angle
function rotate(angle){
	context.rotate(angle);
}

//makes lines dashed. dash(5,5) would be 5 pixels open, 5 pixels closed
function dash(open,close){
	context.setLineDash([open,close]);
}

//fills the next drawn shape and all drawn shapes after (until the next fill) with color rgba
function fill(r,g=r,b=g,a=1){
	context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
}

//fills everything transparent white
function noFill(){
	fill(255,255,255,0);
}

//color of lines
function stroke(r,g=r,b=g,a=1){
	context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
}

//no lines (transparent)
function noStroke(){
	stroke(255,255,255,0);
}

//width of lines
function strokeWidth(width){
	context.lineWidth = width
}

//restores default context.
function restoredefaults(){
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.setLineDash([])
	noFill();
	stroke(255);
	strokeWidth(1);
}

//sets the background to a color
function background(r,g=r,b=g,a=1){
	push();
	context.resetTransform();
	fill(r,g,b,a);
	context.beginPath();
	context.fillRect(0, 0, canvas.width, canvas.height);
	update();
	noFill();
	pop();
}

//updates the screen. has to happen after every drawn shape
function update(){
	context.stroke();
	context.fill();
}

//draw a lien from x1,y1 to x2,y2
function line(x1,y1,x2,y2){
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	update();
}


//draws a rectangle (square if 3 args given)
function rect(x,y,w,h=w){
	context.beginPath();
	context.rect(x,y,w,h);
	update();
}

//draw ellipse (circle if 3 args given)
function ellipse(x,y,w,h=w){
	context.beginPath();
	context.ellipse(x,y, w, h, 0, 0, 2 * Math.PI);
	update();
}

//executed 60 times per second, calls draw and then updates
function eventloop(){
	
	restoredefaults();
	draw();

	window.requestAnimationFrame(eventloop);

}



//draw an image on x,y with w,h
function blit(x,y,w,h,img){
	context.drawImage(img, x, y, w, h);
}

//Put text on screen
function writeText(x,y, text, max=canvas.width){
	context.font = "20px monospace";
	context.textAlign = "center";
	context.fillText(text, x, y, max);
}

//detect everything is loaded
window.onload = function(){
	eventloop();
}


//start setup asap
setup();










