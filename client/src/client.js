let moveNumber = 1;

function showTurn() {
  var color = document.getElementById('turn-color');
  var text = document.getElementById('turn-text');
  if(board.turn == "white"){
    color.style.backgroundColor = "white";
    text.innerHTML = "White to move";
  }else{
    color.style.backgroundColor = "black";
    text.innerHTML = "Black to move";
  }
}

function generateMoveNotation(piece, to_x, to_y, ate) {
  const mappingX = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const mappingY = ["8", "7", "6", "5", "4", "3", "2", "1"];
  let moveNotation = '';
  // const moveNotation = (piece.notation==undefined ? "" : piece.notation) + mappingX[to_x] + mappingY[to_y];

  if(ate) {
    if(piece.type === "pn") {
      moveNotation += mappingX[piece.x]
    } else {
      moveNotation += piece.notation;
    }
    moveNotation += 'x' + mappingX[to_x] + mappingY[to_y];
  } else {
    moveNotation = (piece.notation==undefined ? "" : piece.notation) + mappingX[to_x] + mappingY[to_y];
  }
  return moveNotation;
}

function recordMove(piece, to_x, to_y, ate) {
  const moveNotation = generateMoveNotation(piece, to_x, to_y, ate);
  console.log(piece.notation);
  var recording = document.getElementById('recording');
  var record = document.createElement('span');
  var text = document.createTextNode(moveNotation);
  if(board.turn == board.player) {
    record.classList.add('p1-move');
    var recordContainerDiv = document.createElement('div');
    recordContainerDiv.classList.add('move-record-container');
    recordContainerDiv.dataset.moveNumber = moveNumber;
    var recordDiv = document.createElement('div');
    recordDiv.classList.add('move-record');
    var numbering = document.createElement('span');
    numbering.classList.add('numbering')
    var numberText = document.createTextNode(moveNumber + '.');
    numbering.appendChild(numberText);
    record.appendChild(text);
    recordDiv.appendChild(record);
    recordContainerDiv.appendChild(numbering);
    recordContainerDiv.appendChild(recordDiv);
    recording.append(recordContainerDiv);
  } else {
    record.classList.add('p2-move');
    var recordContainerDiv = document.querySelector('div[data-move-number="' + moveNumber +'"]');
    var recordDiv = recordContainerDiv.querySelector('div');
    record.appendChild(text);
    recordDiv.appendChild(record);
    moveNumber += 1;
  }

  // recording.appendChild(recordDiv);
}

function newGame() {
  board = new Chessboard(board_scale);
  var recording = document.getElementById('recording');
  while(recording.firstChild) {
    recording.removeChild(recording.firstChild);
  }
  showTurn();
}

var newgame = document.getElementById('new-game');
newgame.addEventListener('click', newGame);
