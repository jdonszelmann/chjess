class activeMenus{
    constructor(){
        this.active = new Object();
    }
    draw(){
        for(let menu in this.active){
            this.active[menu].draw();
        }
    }
    checkForButtons(x, y){
        for(let menu in this.active){
            for(let _button in this.active[menu].buttons){

                if(menu in this.active){
                    let button = this.active[menu].buttons[_button];
               
                    if(button.x<x && button.x+button.w>x && button.y < y && button.y+button.h > y){
                        button.clicked();
                    }
                }
            }
        }
    }

    checkForButtonsHover(x, y){
        for(let menu in this.active){
            for(let _button in this.active[menu].buttons){

                if(menu in this.active){
                    let button = this.active[menu].buttons[_button];
               
                    if(button.x<x && button.x+button.w>x && button.y < y && button.y+button.h > y){
                        button.hover();
                    }
                }
            }
        }
    }
}
