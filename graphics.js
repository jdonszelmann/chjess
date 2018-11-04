
const c = document.getElementById("canvas");
const context = c.getContext("2d");

function translate(x,y){
	context.translate(x,y);
}

function push(){
	context.save();
}

function pop(){
	context.restore();
}

function rotate(angle){
	context.rotate(angle);
}

function dash(open,close){
	context.setLineDash([open,close]);
}

function fill(r,g=r,b=g,a=1){
	context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
}

function noFill(){
	fill(255,255,255,0);
}

function stroke(r,g=r,b=g,a=1){
	context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
}

function noStroke(){
	stroke(255,255,255,0);
}

function strokeWidth(width){
	context.lineWidth = width
}

function restoredefaults(){
	context.globalCompositeOperation = "destination-over";
	context.setLineDash([])
	context.setTransform(1, 0, 0, 1, 0, 0);
	noFill();;
	stroke(255);
	strokeWidth(1);
}

function background(r,g=r,b=g,a=1){
	context.setTransform(1, 0, 0, 1, 0, 0);
	fill(r,g,b,a);
	context.fillRect(0, 0, canvas.width, canvas.height);
	restoredefaults();
	update();
}

function update(){
	context.stroke();
	context.fill();
}

function line(x1,y1,x2,y2){
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	update();
}

function rect(x,y,w,h=w){
	context.rect(x,y,w,h);
	update();
}

function ellipse(x,y,w,h=w){
	context.beginPath();
	context.ellipse(x,y, w, h, 0, 0, 2 * Math.PI);
	update();
}

function eventloop(){
	
	window.requestAnimationFrame(draw);
	update();

}

let images = [];
let loadcount = 0;

function createImage(){
	let i = new Image();
	images.push(i);
	i.onload = () => {
		console.log("loaded")
		loadcount++;
		if(loadcount == images.length){
			loaddone();
		}
	}
	return i;
}

function blit(x,y,w,h,img){
	context.drawImage(img, x, y, w, h);
}

function loaddone(){

	restoredefaults();
	window.setInterval(eventloop, (1/60)*1000);
}

window.onload = function(){
	setup();
	if(images.length == 0){
		loaddone();
	}

}









