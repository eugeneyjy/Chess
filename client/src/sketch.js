var board;
var black_images = [];
var white_images = [];
var size;
var delay = 15;
var border_width = 10;
var board_scale = 7;
var offset = border_width/2;
var minimax = new Minimax(4);

function preload() {
  black_images.push(loadImage('./image/Queen.png'));
  black_images.push(loadImage('./image/Rook.png'));
  black_images.push(loadImage('./image/Bishop.png'));
  black_images.push(loadImage('./image/Knight.png'));
  black_images.push(loadImage('./image/Pawn.png'));
  black_images.push(loadImage('./image/King.png'));
  white_images.push(loadImage('./image/Queen_w.png'));
  white_images.push(loadImage('./image/Rook_w.png'));
  white_images.push(loadImage('./image/Bishop_w.png'));
  white_images.push(loadImage('./image/Knight_w.png'));
  white_images.push(loadImage('./image/Pawn_w.png'));
  white_images.push(loadImage('./image/King_w.png'));
}

function setup() {
  board = new Chessboard(board_scale);
  size = board.sidegrid*board.gridsize;
  var canvas = createCanvas(size+border_width, size+border_width);
  canvas.parent('sketch-div');
}

function draw() {
  // background(64,64,64)
  background("black");
  // print("showing");
  board.show();
  // board.isEnd();
  // print("end");
  // runAI();

  // noLoop();
}

function runAI() {
  var from, to;
  // if(delay < 0){
  if(board.turn == minimax.color){
    // board = minimax.getMove(board, 0, -Infinity, Infinity);
    [from,to] = minimax.getMove(board);
    setTimeout(()=>board.movePiece(true, from[0], from[1], to[0], to[1]), 5000);
  }
    // delay = 15;
  // }else{
  //   delay -= 1;
  // }
}

function mouseClicked() {
  if(board.win == null){
    var x = floor(map(mouseX, 0+offset, size+offset, 0, 8));
    var y = floor(map(mouseY, 0+offset, size+offset, 0, 8));
    if(board.promoting == null){
      board.moving(x, y);
      // console.log("in");
      runAI();
      // minimax.successcor(board);
      // console.log(minimax.maxValue(board,0));
    }else{
      board.promotion(x, y);
    }
  }
  // print("yo out");
}
