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
        if(gamestate.playerblack){
            stroke(0);
        }else{
            stroke(255);
        }

        noFill();
        strokeWidth(1);
        update();
        ellipse(this.x, this.y, 20);
    }

    drawSelectedSquare(){
        if(this.selectedX != -1 && this.selectedY != -1){
            let squareSize = gamestate.cellwidth;
            if(gamestate.playerblack){
                stroke(0);
            }else{
                stroke(255);
            }
            noFill();
            update();
            strokeWidth(5);
            rect(this.selectedX*squareSize, this.selectedY*squareSize, squareSize);
            strokeWidth(10);
        }
    }

    selectSquare(x,y){
        this.selectedX = x;
        this.selectedY = y;
    }

    detect (){
        let squareSize = gamestate.cellwidth;
        this.selectSquare(
            Math.floor(this.x/squareSize),
            Math.floor(this.y/squareSize)
        );
    }
}

let MouseInput = new Mouse();