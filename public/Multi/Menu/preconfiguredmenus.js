let mainMenuTab;
let mainMenuInGame;
let EndGame;
let confirm;
let ChoosePawn;

let preconfiguredmenus = {

    "confirm":function(){
        confirm = new Menu("confirm", 3,3,4,2, "are you sure you want to leave?");
       
        confirm.addButton("continue playing", 2, 1.5,2,0.5, "continue playing", function(){
            confirm.deactivate();
            mainMenuInGame.activate();
        });

        confirm.addButton("Main Menu", 2, 2.1, 2, 0.5, "quit", function(){
            window.location = "/"
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
            tabButton.src = "/Multi/resources/MainMenuTab.png";
            blit(this.x*gamestate.cellwidth, this.y*gamestate.cellwidth, this.w, this.h, tabButton);
        });
    },
    "Main Menu InGame": function () {
        mainMenuInGame = new Menu("mainMenuInGame", 3,3,4,2, "How is your game going?");
        mainMenuInGame.addButton("resume", 2, 1.5,2,0.5, "Resume!", function(){
            mainMenuInGame.deactivate();
            mainMenuTab.activate();
            gamestate.paused = false;
        });

        mainMenuInGame.addButton("backToMainMenu", 2, 2.1, 2, 0.5, "Quit", function(){
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