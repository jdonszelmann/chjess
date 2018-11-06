let mainMenu;
let mainMenuTab;
let mainMenuInGame;
let EndGame;
let preconfiguredmenus= {
    "Main Menu": function(){
        mainMenu = new Menu("mainMenu", 3,3,4,3, "Main Menu!");
        mainMenu.addButton("play", 2, 1.5,2,0.5, "Play!", function(){
            mainMenu.deactivate();
            mainMenuTab.activate();
            gamestate.paused = false;
        });
        mainMenu.addButton("quit", 2, 2.1, 2, 0.5, "Quit!", function(){
            //alert("Quiting is for losers!");
            if(confirm("You sure you want to quit? (Quiting is for losers :P)")){
                //Cant close this tab, because apparently I didnt create it, so i'll
                // just redirect them to the urban dictionary of the word rage quit
                open("https://www.urbandictionary.com/define.php?term=ragequit", '_self');
            }
        });
        mainMenu.activate();
    },
    "Main Menu Tab": function () {
        mainMenuTab = new Menu("mainMenuTab", 8.5, 1, 0.5, 0.5, "");
        mainMenuTab.addButton("openMainMenu", 0, 0, 0.5,0.5, "", function () {
            mainMenuTab.deactivate();
            mainMenuInGame.activate();
        })
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
        mainMenuInGame.addButton("newGame", 2,2.1,2,0.5, "New Game", function(){
            if(confirm("If you start a new game you will end this one. Are you sure?")){
                gameboard.get().reset();
                mainMenuInGame.deactivate();
                mainMenuTab.activate();
                gamestate.paused = false;
            }
        });
        mainMenuInGame.addButton("backToMainMenu", 2, 2.7, 2, 0.5, "Go back to main menu!", function(){
            if(confirm("Are you sure you want to quit this game?")){
                gameboard.get().reset();
                mainMenuInGame.deactivate();
                mainMenu.activate();
            }
        });
    },
    "EndGame": function () {
        EndGame = new Menu("EndGame", 3,3.5,4,1.7, winner + " won this game! Congratulations!");
        EndGame.addButton("newGame", 2, 1.5, 2, 0.5, "New Game!", function () {
            winner = null;
            gameboard.get().reset();
            EndGame.deactivate();
            mainMenuTab.activate();
            gamestate.paused = false;
        });
        EndGame.addButton("backToMainMenu", 2, 2.1, 2, 0.5, "Back to main menu!", function(){
            winner=null;
            gameboard.get().reset();
            EndGame.deactivate();
            mainMenu.activate();
        });
        EndGame.activate();
    }
}
function openMenu(name){
    preconfiguredmenus[name]();
}