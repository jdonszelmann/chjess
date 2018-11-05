class Button {
    constructor (x, y, w, h, text){
        this.x = x -1;
        this.y = y -1;
        this.w = w;
        this.h = h;
        this.text = text;
    }
    draw(){
        fill(255);
        update();
        stroke(255);
        strokeWidth(2);
        rect(this.x*gamestate.cellwidth, this.y*gamestate.cellwidth, this.w*gamestate.cellwidth, this.h*gamestate.cellwidth);
    }
}
let TestButton = new Button(4,4,2,2, "Test");