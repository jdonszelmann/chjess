class Menu{
    constructor(name, x,y,w,h,text){
        this.name = name;
        this.x = (x -1);
        this.y = (y -1);
        this.w = w*gamestate.cellwidth;
        this.h = h*gamestate.cellwidth;
        this.text = text;
        this.buttons = new Object();
        this.nodraw = false;
        this.alternativeDraw = function(){};
    }
    addButton(name, x , y, w, h, text, click){
        this.buttons[name] = new Button(x+this.x, y+this.y, w, h, text, click);
    }
    draw(){
        if(!this.nodraw){
            context.beginPath();
            fill(255);
            update();
            noStroke();
            rect(this.x*gamestate.cellwidth, this.y*gamestate.cellwidth, this.w, this.h);
            fill(0);
            writeText(this.x*gamestate.cellwidth + (this.w/2), this.y*gamestate.cellwidth+25, this.text, this.w);
            for(let button in this.buttons){
                this.buttons[button].draw();
            }
        } else {
            this.alternativeDraw();
        }

    }
    noDraw(){
        this.nodraw = true;
    }
    deactivate(){
        delete activemenus.active[this.name];
        if(Object.keys(activemenus.active).length === 0){
            gamestate.paused = false;
        }
    }
    activate(){
        activemenus.active[this.name] = this;
        gamestate.paused = true;

    }
    setAlternativeDraw(func){
        this.noDraw();
        this.alternativeDraw = func;
    }
}

