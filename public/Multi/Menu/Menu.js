
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

        gamestate.menus.push(this);

        this.active = true;
        this.alpha = 255;

        this.alternativeDraw = function(){};
    }
    addButton(name, x , y, w, h, text, click){
        this.buttons[name] = new Button(x+this.x, y+this.y, w, h, text, click);
    }

    update(){
        if(this.active && this.alpha < 255){
            this.alpha+=30;
        }        
        if(!this.active && this.alpha > 0){
            this.alpha-=30;
        }
        if(this.alpha > 255){
            this.alpha = 255;
        }
        if(this.alpha < 0){
            this.alpha = 0;
        }

        // console.log(this.name,this.alpha,this.active)
        if(this.alpha != 0 && !this.nodraw && !this.active){
            this.draw();
        }
        
    }

    draw(){

        if(!this.nodraw){
            context.beginPath();
            fill(255,255,255,this.alpha/255);
            update();
            noStroke();
            rect(this.x*gamestate.cellwidth, this.y*gamestate.cellwidth, this.w, this.h);
            fill(0,0,0,this.alpha/255);
            writeText(this.x*gamestate.cellwidth + (this.w/2), this.y*gamestate.cellwidth+25, this.text, this.w);
            for(let button in this.buttons){
                this.buttons[button].draw(this.alpha);
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
        this.active = false;
        this.alpha = 255;
    }
    activate(){
        activemenus.active[this.name] = this;
        gamestate.paused = true;

        this.active = true;
        this.alpha = 0;
    }
    setAlternativeDraw(func){
        this.noDraw();
        this.alternativeDraw = func;
    }
}

