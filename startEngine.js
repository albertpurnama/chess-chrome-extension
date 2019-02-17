function getBoardState(document) {
  state = {};

  // find the board DOM element
  var pieces = document.getElementsByClassName("piece");

  // get the x,y positions of each pair
  var regExp = /square-([^)]+)/;
  var typeRegExp = /\/([A-z]{2})\.png/;
  [].forEach.call(pieces, (element) => {
    var matches = regExp.exec(element.className);
    var pieceType = typeRegExp.exec(element.style.cssText);
    // build the board in a state
    state[matches[1]] = pieceType[1];
  });

  return state;
}

// get the clock element
playerClock = document.getElementsByClassName("board-player-bottom")[0];

// Callback when it's white's turn
// this is used to track whose turn currently is.
function cb(element){
  playerTurn = (element.className.includes("clock-playerTurn")) ? true : false;
  if(playerTurn){
    jsonPacket = {
      "state": JSON.stringify(getBoardState(document)),
      "wk_moved": true,
      "bk_moved": false,
      "white_to_move": true,
    }

    fetch("http://localhost:5000/nextmove", {
      method: "POST",
      body: JSON.stringify(jsonPacket),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.text())
      .then((data) => console.log(data));
  }
}

// Create an observer for the whiteClock
var observer = new MutationObserver(() => {
  cb(playerClock);
});
observer.observe(playerClock, {
  attributes: true,
  attributeFilter: ["class"]
})