let gameOver = false;

let view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

let model = {
    boardSize: 7,
    numShips: 3,
    shipSunk: 0,
    shipLength: 3,
    ships: [{location: [0, 0, 0], hits: ["", "", ""]},
            {location: [0, 0, 0], hits: ["", "", ""]},
            {location: [0, 0, 0], hits: ["", "", ""]}],

    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.location.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my Battleship!")
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You Missed.");
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].location = locations;
        }
    },

    generateShip: function () {
        let direction = Math.floor(Math.random()*2);
        let row,col;

        if (direction === 1) {
            row = Math.floor(Math.random()*this.boardSize);
            col = Math.floor(Math.random()*(this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random()*(this.boardSize - this.shipLength));
            col = Math.floor(Math.random()*this.boardSize);
        }

        let newShipLocation = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocation.push(row + "" +(col + i));
            } else {
                newShipLocation.push((row + i) + "" + col);
            }
        }

        return newShipLocation;
    },

    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.location.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
}

let controller = {
    guesses: 0,

    processGuess: function (guess) {
        this.guesses++;
        let hit = model.fire(guess);
        if (hit && model.shipSunk === model.shipLength) {
            view.displayMessage("You Sank All My Battleships, in " + this.guesses + " guesses");
            gameOver = true;
        }
    }
};

function init() {
    model.generateShipLocations();
}

function handleButton(guess) {
    let cell = document.getElementById(guess).className;

    if (!gameOver && !cell) {
        controller.processGuess(guess);
    }
}

window.onload = init;