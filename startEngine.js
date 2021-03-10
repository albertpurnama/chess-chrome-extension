chrome.storage.sync.get(['borw'], function(result) {
  const BLACK_USER = result['borw'];
  function getBoardState(document, pTurn, castleState, enpassant, half, full) {
    state = [
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
    ];
  
    // find the board DOM element
    var pieces = document.getElementsByClassName("piece");
  
    // get the x,y positions of each pair
    var regExp = /square-([^)]+)/;
    var typeRegExp = /\/([A-z]{2})\.png/;
    [].forEach.call(pieces, (element) => {
      var matches = regExp.exec(element.className);
      var pieceType = typeRegExp.exec(element.style.cssText);
      var row = parseInt(matches[1].substring(0,2)) - 1;
      var col = parseInt(matches[1].substring(2,4)) - 1;
      // build the board in a state
      state[col][row] = pieceType[1];
    });
  
    // console.log(state);
    str = "";
    for(let idx = 7; idx >= 0 ; idx--){
      element = state[idx]
      var empty_num = 0;
      var row = element;
      for(let i = 0; i < 8; i++){
        if(row[i] == null) {
          empty_num++;
        } else {
          if(empty_num != 0){
            // if there are empty squares in between
            str += empty_num.toString();
            if(row[i][0] == 'w') {
              str += row[i][1].toUpperCase();
            } else {
              str += row[i][1];
            }
            empty_num = 0
          } else {
            // if non empty squares found
            if(row[i][0] == 'w') {
              str += row[i][1].toUpperCase();
            } else {
              str += row[i][1];
            }
          }
        }
  
        if(i == 7 && empty_num > 0){
          str += empty_num.toString();
        }
      }
      str += "/"
    }
    str = str.substring(0, str.length-1);
  
    str += " " + pTurn + " " + castleState + " " + enpassant + " " + half + " " + full;
  
    return str;
  }
  
  function next(turn, cState, enpass, half, full ){
    // fetch("https://chess.apurn.com/nextmove", {
    fetch("https://localhost:8000/nextmove", {
      method: "POST",
      body: getBoardState(document, turn, cState, enpass, half, full)
    })
      .then((res) => res.text())
      .then((data) => alert(data));
  }
  
  var ChessState = {};
  ChessState.move = "w";
  ChessState.userColor = BLACK_USER.toLowerCase();
  ChessState.cState = "KQkq";
  ChessState.enpassant = '-';
  ChessState.halfMove = 0;
  ChessState.fullMove = 1;
  
  // Select the node that will be observed for mutations
  var targetNode = document.getElementsByClassName('clock-black')[0];
  
  // Options for the observer (which mutations to observe)
  var config = { attributes: true, };
  
  // Callback function to execute when mutations are observed
  var callback = function(mutationsList, observer) {
      for(var mutation of mutationsList) {
          if (mutation.type == 'attributes' && mutation.attributeName == 'class' ) {
              if(mutation.target.className.includes("clock-playerTurn") && ChessState.userColor == 'b') {
                console.log("Black to move, user is black");
                
                // use timeout to prevent not updated board state
                setTimeout(() => next('b', ChessState.cState, ChessState.enpassant, ChessState.halfMove, ChessState.fullMove), 500);
              } else if (!mutation.target.className.includes("clock-playerTurn") && ChessState.userColor == 'w') {
                console.log("White to move, user is white");
  
                // use timeout to prevent not updated board state
                setTimeout(() => next('w', ChessState.cState, ChessState.enpassant, ChessState.halfMove, ChessState.fullMove), 500);
              }
              console.log(mutation);
              console.log('The ' + mutation.attributeName + ' attribute was modified.');
          }
      }
  };
  
  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);
  
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
  
  next(ChessState.move, ChessState.cState, ChessState.enpassant, ChessState.halfMove, ChessState.fullMove);
});
