class Button {
    constructor (x, y, w, h, text, click) {
        this.x = (x - 1) * gamestate.cellwidth;
        this.y = (y - 1) * gamestate.cellwidth;
        this.w = w * gamestate.cellwidth;
        this.h = h * gamestate.cellwidth;
        this.text = text;
        this.clicked = click;
        this.hovering = false
        this.noDraw = false;
        this.alternativeDraw = function(){};
    }

    draw(alpha=255){

        if(this.hovering){
            context.beginPath();
            fill(200,200,200,alpha/255);
            update();
            stroke(255,255,255,alpha/255);
            strokeWidth(2);
            rect(this.x, this.y, this.w, this.h);
            fill(0,0,0,alpha/255);
            writeText(this.x + (this.w/2), this.y+(this.h/2), this.text, this.w);
            this.hovering = false;   
        }else{
            context.beginPath();
            fill(230,230,230,alpha/255);
            update();
            stroke(255,255,255,alpha/255);
            strokeWidth(2);
            rect(this.x, this.y, this.w, this.h);
            fill(0,0,0,alpha/255);
            writeText(this.x + (this.w/2), this.y+(this.h/2), this.text, this.w);
        }
    }

    hover(){
        this.hovering = true;
    }
}