class Menu{
    constructor(x,y,w,h,text){
        gamestate.paused = true;
    }
    addButton(name, x , y, w, h, text){
        new Button(x, y, w, h, text);
    }
}
let mainMenu = new Menu();
mainMenu.addButton("play", )