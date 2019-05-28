var view={
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","hit");
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","miss");
  },
  displayLocation: function(location) {
    var cell = document.getElementById(location);
  }
};

var model = {
  boardSize: 7,
  shipLength: 3,
  shipSunk: 0,
  ships: [{locations:[0,0,0],hits:["","",""]},
          {locations:[0,0,0],hits:["","",""]},
          {locations:[0,0,0],hits:["","",""]},
          {locations:[0,0],hits:["",""]},
          {locations:[0],hits:[""]}
      ],
  fire: function(guess) {
    for (var i = 0;i < model.ships.length;i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  isSunk: function(ship) {
    var count = 0;
    for (var i = 0;i < model.shipLength;i++) {
      document.getElementById(ship.locations[i]).style.backgroundColor = 'green';
      view.displayHit(ship.locations[i]);
    }
    for (var i = 0;i < model.shipLength;i++) {
      if(ship.hits[i] ==="hit"){
        document.getElementById(ship.locations[i]).style.backgroundColor = 'red';
        count++;
      }
      if (count *10 > model.shipLength *6) {
        for (var i = 0;i < model.shipLength;i++) {
          document.getElementById(ship.locations[i]).style.backgroundColor = 'red';
        }
        return true;
      }
    }
    return false;
  },
  generateShipLocations: function() {
    var location;
    for (var i = 0;i < model.ships.length;i++) {
      do {
        locations = this.generateShip();
      } while (this.collisison(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
  collisison: function(locations) {
    for (var i = 0;i < model.ships.length;i++) {
      var ship = model.ships[i];
      for (var j = 0;j < locations.length;j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

var controller = {
  guesses: 0,
  processGuess: function(e) {
    var paramType = typeof e
    var location
    if (paramType === 'object'){
      location = e.target.id
    } else {
      location = parseGuess(e)
    }
    if (location) {
      controller.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipSunk === model.ships.length) {
        view.displayMessage("You sank all my battleships, in " + controller.guesses + " guesses");
      }
    }
  }
};

function parseGuess(guess) {
  var alphabet = ["A","B","C","D","E","F","G"];
  if (guess === null || guess.length !== 2) {
    alert("Oops,please enter a letter and a number on the board.")
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops. that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}

function init() {
  var td = document.getElementsByTagName("td");
  for (var i = 0;i < td.length;i++) {
    td[i].onclick = controller.processGuess;
  }
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipLocations();
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = ""; 
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;