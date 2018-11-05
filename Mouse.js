class Mouse {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.selectedX = -1;
        this.selectedY = -1;
    }
    draw(){
        this.drawCursor();
        this.drawSelectedSquare();
    }

    drawCursor (){
        // if(gamestate.playerblack){
        //     stroke(0);
        // }else{
        //     stroke(255);
        // }


        // noFill();
        // strokeWidth(1);
        // ellipse(this.x, this.y, 20);
    }

    drawSelectedSquare(){
        if(this.selectedX != -1 && this.selectedY != -1){
            let squareSize = gamestate.cellwidth;
            context.beginPath();
            if(gamestate.playerblack){
                stroke(0);
            }else{
                stroke(255);
            }
            noFill();
            strokeWidth(5);
            rect(this.selectedX*squareSize, this.selectedY*squareSize, squareSize);
        }
    }

    selectSquare(x,y){
        //unselect
        this.selectedX = x;
        this.selectedY = y;
    }

    detect (){

        if(gamestate.paused){
            activemenus.checkForButtons(this.x,this.y);
        } else {
            this.selectSquare(
                Math.floor(this.x/gamestate.cellwidth),
                Math.floor(this.y/gamestate.cellwidth)
            );
        }
    }
}

let MouseInput = new Mouse();
