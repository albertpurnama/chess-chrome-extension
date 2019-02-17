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