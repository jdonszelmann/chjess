let mainMenu;
let mainMenuTab;
let mainMenuInGame;
let EndGame;
let settings;
let confirm;
let confirm2;
let ChoosePawn;

let preconfiguredmenus = {
    "Main Menu": function(){
        mainMenu = new Menu("mainMenu", 3,3,4,3, "Main Menu!");
        mainMenu.addButton("Single Player", 2, 1.5,2,0.5, "Single Player!", function(){
            mainMenu.deactivate();
            mainMenuTab.activate();
            gamestate.paused = false;
            chessclock.get().reset();
        });
        mainMenu.addButton("quit", 2, 2.1, 2, 0.5, "Quit!", function(){
            open("https://www.urbandictionary.com/define.php?term=ragequit", '_self');
        });
        mainMenu.addButton("settings", 2, 2.7, 2, 0.5, "settings", function(){
            mainMenu.deactivate();
            settings.activate();
        });
        mainMenu.activate();
    },

    "confirm":function(){
        confirm = new Menu("confirm", 3,3,4,2, "are you sure you want to leave?");
       
        confirm.addButton("continue playing", 2, 1.5,2,0.5, "continue playing", function(){
            confirm.deactivate();
            mainMenuInGame.activate();
        });

        confirm.addButton("Main Menu", 2, 2.1, 2, 0.5, "Main Menu", function(){
            gameboard.get().reset();
            confirm.deactivate();
            mainMenu.activate();
        });        
    },

    "confirm2":function(){
        confirm2 = new Menu("confirm", 3,3,4,2, "are you sure you want to restart?");
       
        confirm2.addButton("continue playing", 2, 1.5,2,0.5, "continue playing", function(){
            confirm2.deactivate();
            mainMenuInGame.activate();
        });

        confirm2.addButton("restart", 2, 2.1, 2, 0.5, "restart", function () {
            gameboard.get().reset();
            confirm2.deactivate();
            mainMenuTab.activate();
            gamestate.paused = false;
        });
    },


    "settings":function(){
        settings = new Menu("settings",3,2,4,5, "Settings");
        settings.addButton("toggle chessclock",2, 1.5,2,0.5, "toggle chessclock", function(){
            gamestate.clockoff = !gamestate.clockoff;
            chessclock.get().reset();
        });

        settings.addButton("chessclock hour+",3.6, 2.1,0.4,0.5, "+1h", function(){
            if(gamestate.clockoff){return;}
            if(gamestate.clocklength < 3600*12){
                gamestate.clocklength += 3600; 
                chessclock.get().reset();
            }
        });

        settings.addButton("chessclock hour-",2, 2.1,0.4,0.5, "-1h", function(){
            if(gamestate.clockoff){return;}
            if(gamestate.clocklength > 3601){
                gamestate.clocklength -= 3600;
                chessclock.get().reset();
            }else if(gamestate.clocklength > 0){
                gamestate.clocklength = 1;
                chessclock.get().reset();
            }        
        });

        settings.addButton("chessclock min+",3.055, 2.1,0.4,0.5, "+1m", function(){
            if(gamestate.clockoff){return;}
            if(gamestate.clocklength < 3600*12){
                gamestate.clocklength += 60; 
                chessclock.get().reset();
            }
        });

        settings.addButton("chessclock min-",2.525, 2.1,0.4,0.5, "-1m", function(){
            if(gamestate.clockoff){return;}
            if(gamestate.clocklength > 61){
                gamestate.clocklength -= 60;
                chessclock.get().reset();
            }else if(gamestate.clocklength > 0){
                gamestate.clocklength = 1;
                chessclock.get().reset();
            }        
        });

        settings.addButton("chessclock sec+",3.05, 2.7,0.95,0.5, "+1 sec", function(){
            if(gamestate.clockoff){return;}
            if(gamestate.clocklength < 3600*12){
                gamestate.clocklength += 1; 
                chessclock.get().reset();
            }
        });

        settings.addButton("chessclock sec-",2, 2.7,0.95,0.5, "-1 sec", function(){
            if(gamestate.clockoff){return;}
            if(gamestate.clocklength > 2){
                gamestate.clocklength -= 1;
                chessclock.get().reset();
            }      
        });

        settings.addButton("change start setup",2, 3.3,2,0.5, "change start setup", function(){
            alert("WIP");
        });

        settings.addButton("movehelper",2, 3.9,2,0.5, "toggle movehelper", function(){
            gamestate.movehelper = !gamestate.movehelper;

            if(gamestate.movehelper){
                gamestate.gamestring.movehelper = "Movehelper on";
            }else{
                gamestate.gamestring.movehelper = "Movehelper off";
            }
        });

        settings.addButton("back",2, 4.5,2,0.5, "back", function(){
            settings.deactivate();
            mainMenu.activate();
        });
    },
    "Main Menu Tab": function () {
        mainMenuTab = new Menu("mainMenuTab", 8.5, 1, 0.5, 0.5, "");
        mainMenuTab.addButton("openMainMenu", 0, 0, 0.5,0.5, "", function () {
            mainMenuTab.deactivate();
            mainMenuInGame.activate();
        });
        mainMenuTab.setAlternativeDraw(function () {
            let tabButton = new Image();
            tabButton.src = "resources/MainMenuTab.png";
            blit(this.x*gamestate.cellwidth, this.y*gamestate.cellwidth, this.w, this.h, tabButton);
        });
    },
    "Main Menu InGame": function () {
        mainMenuInGame = new Menu("mainMenuInGame", 3,3,4,3, "How is your game going?");
        mainMenuInGame.addButton("resume", 2, 1.5,2,0.5, "Resume!", function(){
            mainMenuInGame.deactivate();
            mainMenuTab.activate();
            gamestate.paused = false;
        });
        mainMenuInGame.addButton("newGame", 2, 2.1, 2, 0.5, "New Game", function () {
            confirm2.activate();
            mainMenuInGame.deactivate();
        });

        mainMenuInGame.addButton("backToMainMenu", 2, 2.7, 2, 0.5, "Main Menu", function(){
            confirm.activate();
            mainMenuInGame.deactivate();
        });
    },
    "EndGame": function () {
        EndGame = new Menu("EndGame", 3,3.5,4,1.7, gamestate.winner + " won this game! Congratulations!");
        EndGame.addButton("newGame", 2, 1.5, 2, 0.5, "New Game!", function () {
            gamestate.winner = null;
            gameboard.get().reset();
            chessclock.get().reset();
            EndGame.deactivate();
            mainMenuTab.activate();
            gamestate.paused = false;
        });
        EndGame.addButton("backToMainMenu", 2, 2.1, 2, 0.5, "Main Menu", function(){
            gamestate.winner=null;
            gameboard.get().reset();
            chessclock.get().reset();
            EndGame.deactivate();
            mainMenu.activate();
        });
        EndGame.activate();
    },
    "ChoosePawn": function () {
        ChoosePawn = new Menu("ChoosePawn", 1,5.5,8, 1.5, "Choose your price!");
        ChoosePawn.addButton("Rook", 1, 0, 1, 1, "", function(){
            alert("Rook!");
        });
        ChoosePawn.addButton("Knight", 2, 0, 1, 1, "", function(){
           alert("Knight!");
        });
    }
}
function openMenu(name){
    preconfiguredmenus[name]();
}