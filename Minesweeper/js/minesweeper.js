let gameOver = false;
let flagy;
let running = false;
let timeCount = 0;
let mines;
let time;
let newGame;
const levels = {
    NONE: [9, 9, 10, 0],
    EASY: [9, 9, 10],
    MEDIUM: [16, 16, 40],
    HARD: [30, 16, 99]
};
let levelSelected = levels.NONE;

setInterval(function () {
    if (running) {
        timeCount++;
        time.text(timeCount);
    }
}, 1000);


let view = {
    displayCell: function (location) {
        let $cell = $("#" + location);
        $cell.removeClass();
        $cell.addClass("tile");
        // cell.style.backgroundImage = "none";
    },

    displayNum: function (location, num) {
        let $cell = $("#" + location);
        $cell.removeClass();
        $cell.addClass("square");
        if (num > 0) {
            $cell.text(num);
            $cell.css("color", this.numColor(num));
        }
    },

    displayFlag: function (location) {
        let $cell = $("#" + location);
        $cell.removeClass();
        $cell.addClass("flag");
    },

    displayMine: function (location, clicked) {
        let $cell = $("#" + location);
        if (clicked === undefined) {
            if ($cell.attr("class") === "flag") {
                $cell.css("background-image", "url(\"/Minesweeper/images/ok.png\")");
            } else {
                $cell.css("background-image", "url(\"/Minesweeper/images/mine.png\")");
            }
        } else {
            $cell.css("background-color", "red");
            $cell.css("background-image", "url(\"/Minesweeper/images/mine.png\")");
        }
        $cell.removeClass();
        $cell.addClass("square");
        $cell.css("background-position", "center");
        $cell.css("background-repeat", "no-repeat");
    },

    numColor: function (num) {
        if (num === 1) {
            return "blue";
        } else if (num === 2) {
            return "green";
        } else if (num === 3) {
            return "red";
        } else if (num === 4) {
            return "darkblue";
        } else if (num === 5) {
            return "purple";
        } else if (num === 6) {
            return "pink";
        } else if (num === 7) {
            return "brown";
        } else if (num === 8) {
            return "darkgreen";
        } else if (num === 9) {
            return "black";
        } else return "white";
    }
}

let model = {
    width: levelSelected[0],
    height: levelSelected[1],
    numMine: levelSelected[2],

    refreshLevel: function () {
        this.width= levelSelected[0];
        this.height= levelSelected[1];
        this.numMine= levelSelected[2];
    },

    generateBoard: function () {
        let $ground = $("#ground");
        $ground.empty();
        this.board = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            let $row = $("<tr></tr>");
            this.board[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                this.board[i][j] = 0;


                let $cell = $("<td></td>");
                $cell.addClass("tile");
                $cell.attr("id", this.locationConverter(i, j));
                $row.append($cell);
            }

            $ground.append($row);
        }

        $("#head").width($ground.width());
    },

    generateMineLocations: function () {
        for (let i = 0; i < this.numMine; i++) {
            let occupied = true;
            let x = 0, y = 0;
            while (occupied) {
                x = Math.floor(Math.random() * this.height);
                y = Math.floor(Math.random() * this.width);

                if (this.board[x][y] !== -1) {
                    this.board[x][y] = -1;
                    occupied = false;
                }
            }

            for (let j = -1; j < 2; j++) {
                if (x + j >= 0 && x + j < this.height) {
                    for (let k = -1; k < 2; k++) {
                        if (y + k >= 0 && y + k < this.width) {
                            if (this.board[x + j][y + k] !== -1) {
                                this.board[x + j][y + k]++;
                            }
                        }
                    }
                }
            }
        }
    },

    showAllMines: function (a, b) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.board[i][j] === -1) {
                    if (i === a && j === b) {
                        view.displayMine(this.locationConverter(i, j), true);
                    } else {
                        view.displayMine(this.locationConverter(i, j));
                    }
                }
            }
        }
    },

    flag: function ($cell) {
        if ($cell.attr("class") === "tile") {
            if (flagy > 0) {
                view.displayFlag($cell.attr("id"));
                flagy--;
            }
        } else if ($cell.attr("class") === "flag") {
            view.displayCell($cell.attr("id"));
            flagy++;
        }

        if (flagy >= 0) {
            mines.text(flagy);
        }
    },

    cellChecker: function ($cell) {
        running = true;

        let location = $cell.attr("id");
        let a = Number(location.substring(0, 2));
        let b = Number(location.substring(2));

        if (this.board[a][b] === -1) {
            this.showAllMines(a, b);
            gameOver = true;
            running = false;
            newGame.text("Try Again?");
        } else {
            let flags = 0;
            for (let i = -1; i < 2; i++) {
                if (a + i >= 0 && a + i < this.height) {
                    for (let j = -1; j < 2; j++) {
                        if (b + j >= 0 && b + j < this.width) {
                            let cell2 = $("#" + this.locationConverter(a + i, b + j));
                            if (cell2.attr("class") === "flag") {
                                flags++;
                            }
                        }
                    }
                }
            }
            if (flags === this.board[a][b]) {
                for (let i = -1; i < 2; i++) {
                    if (a + i >= 0 && a + i < this.height) {
                        for (let j = -1; j < 2; j++) {
                            if (b + j >= 0 && b + j < this.width) {
                                let cell2 = $("#" + this.locationConverter(a + i, b + j));
                                if (cell2.attr("class") === "tile") {
                                    if (this.board[a + i][b + j] === -1) {
                                        this.showAllMines(a + i, b + j);
                                        gameOver = true;
                                        newGame.text("Try Again?");
                                    }
                                    this.reveal((a + i), (b + j));
                                }
                            }
                        }
                    }
                }
            }
            this.reveal(a, b);
            if (this.totalTiles === this.numMine) {
                gameOver = true;
                running = false;
                newGame.text("You Won!!!");
            }
        }
    },

    reveal: function (a, b) {
        let $cell = $("#" + this.locationConverter(a, b));
        if ($cell.attr("class") === "tile") {
            if (this.board[a][b] > 0) {
                view.displayNum(this.locationConverter(a, b), this.board[a][b]);
                this.totalTiles--;
            } else if (this.board[a][b] === 0) {
                view.displayNum(this.locationConverter(a, b), 0);
                this.totalTiles--;
                for (let i = -1; i < 2; i++) {
                    if (a + i >= 0 && a + i < this.height) {
                        for (let j = -1; j < 2; j++) {
                            if (b + j >= 0 && b + j < this.width) {
                                this.reveal(a + i, b + j);
                            }
                        }
                    }
                }
            }
        }
    },

    locationConverter: function (a, b) {
        let location = "";
        if (a < 10) {
            location = "0";
        }

        if (b < 10) {
            location += [a, b].join("0");
        } else {
            location += [a, b].join("");
        }

        return location;
    }
}

let controller = {
    safeTiles: model.height * model.width - model.numMine,
    startGame: function () {
        model.refreshLevel();
        model.generateBoard();
        model.generateMineLocations();
        model.totalTiles = model.height * model.width;
        flagy = model.numMine;
        mines.text(flagy);
        time.text(0);
        running = false;
        gameOver = false;
        timeCount = 0;
        newGame.text("New Game");

        $("#ground > tr > td").each(function () {
            $(this).click(function (eventObj) {
                if (!gameOver) {
                    controller.processLeftClick(eventObj);
                }
            });

            $(this).contextmenu(function (eventObj) {
                if (!gameOver) {
                    controller.processRightClick(eventObj);
                }
            });
        });
    },

    levelChange: function () {
        $level = $("#level");
        switch (levelSelected) {
            case levels.NONE :
                levelSelected = levels.EASY;
                $level.text("Easy");
                break;
            case levels.EASY :
                levelSelected = levels.MEDIUM;
                $level.text("Medium");
                break;
            case levels.MEDIUM :
                levelSelected = levels.HARD;
                $level.text("Hard");
                break;
            case levels.HARD :
                levelSelected = levels.EASY;
                $level.text("Easy");
                break;
        }

        controller.startGame();
    },

    processLeftClick: function (eventObj) {
        let cell = eventObj.target;
        if (cell.className !== "flag") {
            model.cellChecker($("#" + cell.id));
        }
    },

    processRightClick: function (eventObj) {
        let cell = eventObj.target;
        model.flag($("#" + cell.id));
    }
}

$(function () {
    mines = $("#mines");
    time = $("#time");
    newGame = $("#newGame");
    level = $("#level");

    controller.startGame();

    newGame.click(controller.startGame);
    level.click(controller.levelChange);

    $("#board").contextmenu(function (eventObj) {
        eventObj.preventDefault();
    });
});
