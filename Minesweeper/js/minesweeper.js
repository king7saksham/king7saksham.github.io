let gameOver = false;
let flagy;
let running = false;
let timeCount = 0;
let mines;
let time;
let newGame;

setInterval(function () {
    if (running) {
        timeCount++;
        time.innerHTML = timeCount;
    }
}, 1000);


let view = {
    displayCell: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "tile");
        cell.style.backgroundImage = "none";
    },

    displayNum: function (location, num) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "square");
        if (num > 0) {
            cell.innerHTML = num;
            cell.style.color = this.numColor(num);
        }
    },

    displayFlag: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "flag");
        cell.style.backgroundImage = "url(\"../images/flag.png\")";
    },

    displayMine: function (location, clicked) {
        let cell = document.getElementById(location);
        if (clicked === undefined) {
            if (cell.className === "flag") {
                cell.style.backgroundImage = "url(\"../images/ok.png\")"
            } else {
                cell.style.backgroundImage = "url(\"../images/mine.png\")"
            }
        } else {
            cell.style.backgroundColor = "red";
            cell.style.backgroundImage = "url(\"../images/mine.png\")"
        }
        cell.setAttribute("class", "square");
        cell.style.backgroundPosition = "center";
        cell.style.backgroundRepeat = "no-repeat";
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
    width: 20,
    height: 10,
    numMine: 20,

    generateBoard: function () {
        this.board = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.board[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                this.board[i][j] = 0;


                let cell = document.getElementById(this.locationConverter(i,j));
                cell.setAttribute("class", "tile");
                cell.style.backgroundColor = "#CCC";
                cell.innerHTML = "";
                cell.style.backgroundImage = "none";
            }
        }
    },

    generateMineLocations: function () {
        for (let i = 0; i < this.numMine; i++) {
            let occupied = true;
            let x,y;
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
                        view.displayMine(this.locationConverter(i,j), true);
                    } else {
                        view.displayMine(this.locationConverter(i,j));
                    }
                }
            }
        }
    },

    flag: function (cell) {
        if (cell.className === "tile") {
            view.displayFlag(cell.id);
            flagy--;
        } else if (cell.className === "flag") {
            view.displayCell(cell.id);
            flagy++;
        }

        if (flagy >= 0) {
            mines.innerHTML = flagy;
        }
    },

    cellChecker: function (cell) {
        running = true;

        let location = cell.id;
        let a = Number(location.charAt(0));
        let b = Number(location.substring(1));

        if (this.board[a][b] === -1) {
            this.showAllMines(a, b);
            gameOver = true;
            running = false;
            newGame.innerHTML = "Try Again?"
        } else {
            let flags = 0;
            for (let i = -1; i < 2; i++) {
                if (a + i >= 0 && a + i < this.height) {
                    for (let j = -1; j < 2; j++) {
                        if (b + j >= 0 && b + j < this.width) {
                            let cell2 = document.getElementById(this.locationConverter(a+i,b+j));
                            if (cell2.className === "flag") {
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
                                let cell2 = document.getElementById(this.locationConverter(a+i,b+j));
                                if (cell2.className === "tile") {
                                    if (this.board[a+i][b+j] === -1) {
                                        this.showAllMines(a+i, b+j);
                                        gameOver = true;
                                        newGame.innerHTML = "Try Again?"
                                    }
                                    this.reveal((a+i), (b+j));
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
                newGame.innerHTML = "You Won!!!"
            }
        }
    },

    reveal: function (a, b) {
        let cell = document.getElementById(this.locationConverter(a,b));
        if (cell.className === "tile") {
            if (this.board[a][b] > 0) {
                view.displayNum(this.locationConverter(a,b), this.board[a][b]);
                this.totalTiles--;
            } else if (this.board[a][b] === 0) {
                view.displayNum(this.locationConverter(a,b), 0);
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

    locationConverter: function (a,b) {
        let location;
        if (b < 10) {
            location = [a,b].join("0");
        } else {
            location = [a,b].join("");
        }

        return location;
    }
}

let controller = {
    safeTiles: model.height*model.width - model.numMine,
    startGame: function () {
        model.generateBoard();
        model.generateMineLocations();
        model.totalTiles = model.height*model.width;
        flagy = model.numMine;
        mines.innerHTML = flagy;
        time.innerHTML = 0;
        running = false;
        gameOver = false;
        timeCount = 0;
        newGame.innerHTML = "New Game";
    },

    processLeftClick: function (eventObj) {
        let cell = eventObj.target;
        model.cellChecker(cell);
    },

    processRightClick: function (eventObj) {
        let cell = eventObj.target;
        model.flag(cell);
    }
}

window.onload = init;

function init() {
    mines = document.getElementById("mines");
    time = document.getElementById("time");
    newGame = document.getElementById("newGame");

    controller.startGame();

    let cells = document.getElementsByTagName("td");
    for (let i = 3; i < cells.length; i++) {
        cells[i].onclick = handleLeftClick;
        cells[i].oncontextmenu = handleRightClick;
    }

    newGame.onclick = controller.startGame;

    document.getElementById("board").oncontextmenu = function (eventObj) {
        eventObj.preventDefault();
    }
}

function handleLeftClick(eventObj) {
    if (!gameOver) {
        controller.processLeftClick(eventObj);
    }
}

function handleRightClick(eventObj) {
    if (!gameOver) {
        controller.processRightClick(eventObj);
    }
}