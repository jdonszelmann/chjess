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
        mainMenuInGame.addButton("quit game", 2, 2.1, 2, 0.5, "Quit this game!", function(){
            if(confirm("Are you sure you want to quit this game?")){
                open(location, '_self');
            }
        });
    },
    "EndGame": function () {
        EndGame = new Menu("EndGame", 3,3.5,4,1.5, winner + " won this game! Congratulations!");
        EndGame.addButton("newGame", 2, 1.5, 2, 0.5, "New Game!", function () {
            open(location, '_self');
        })
        EndGame.activate();
    }
}
function openMenu(name){
    preconfiguredmenus[name]();
}