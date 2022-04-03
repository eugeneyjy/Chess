class Chessboard {
  constructor(scale, player="white", opp="black") {
    this.scale = scale; // attribute to scale size of board
    this.gridsize = this.scale*10;
    this.sidegrid = 8;
    this.blackPieces = [];
    this.whitePieces = [];
    this.movingpiece = null;
    this.turn = "white";
    this.player = player;
    this.opp = opp
    this.win = null;
    this.promoting = null;

    this.fillPieces("black");
    // console.log(this.blackPieces);
    this.fillPieces("white");
  }

  fillPieces(color) {
    var piece;
    var x;
    var y;

    for(var j = 0; j < 2; j++){
      for(var i = 0; i < this.sidegrid; i++){
        if(color == this.opp){
          x = i;
          y = j;
        }else if(color == this.player){ // mirror the position
          x = i;
          y = this.sidegrid-j-1;
        }
        if(j == 1){   // filling out pawns
          piece = new Pawn(x,y,color,this.gridsize);  // creating pawns
        }else if(j == 0){   //filling out other pieces
          if(i == 0 || i == 7){
            piece = new Rook(x,y,color,this.gridsize); // creating rooks
          }else if(i == 1 || i == 6){
            piece = new Knight(x,y,color,this.gridsize); // creating knight
          }else if(i == 2 || i == 5){
            piece = new Bishop(x,y,color,this.gridsize); // creating bishop
          }else if(i == 3){
            piece = new Queen(x,y,color,this.gridsize); // creating queen
          }else if(i == 4){
            piece = new King(x,y,color,this.gridsize); //creating king
          }
        }
        if(color == "black"){
          this.blackPieces.push(piece);
        }else{
          this.whitePieces.push(piece);
        }
      }
    }
  }

  show() {
    // print("showing");
    for(var i = 0; i < this.sidegrid; i++){
      for(var j = 0; j < this.sidegrid; j++){
        noStroke();
        if((i+j)%2 == 0){
          fill(256);
        }else{
          fill(204);
        }
        rect(i*this.gridsize+offset, j*this.gridsize+offset, this.gridsize, this.gridsize);
      }
    }
    this.showPieces(this);
    if(this.movingpiece != null)
      this.movingpiece.showHint();
    // print("show end");
  }

  showPieces(board) {
    for(var i = 0; i < this.blackPieces.length; i++){
      this.blackPieces[i].show(board);
    }

    for(var i = 0; i < this.whitePieces.length; i++){
      this.whitePieces[i].show(board);
    }
    if(this.promoting != null)
      this.promoting.showPromotion();
  }

  getPieceAt(x, y) {
    for(var i = 0; i < this.blackPieces.length; i++){
      if(this.blackPieces[i].x == x && this.blackPieces[i].y == y && this.blackPieces[i].alive){
        return this.blackPieces[i];
      }
    }
    for(var i = 0; i < this.whitePieces.length; i++){
      if(this.whitePieces[i].x == x && this.whitePieces[i].y == y && this.whitePieces[i].alive){
        return this.whitePieces[i];
      }
    }
    return null;
  }

  changeTurn() {
    if(this.turn == "white"){
      this.turn = "black";
    }else{
      this.turn = "white";
    }
  }

  movePiece(x_from, y_from, x, y) {
    var piece = this.getPieceAt(x_from, y_from);
    var target = this.getPieceAt(x, y);
    var ate = piece.move(this, x, y, target);
    if(this.turn == "white"){
      this.clearWhiteEnPassant();
    }else{
      this.clearBlackEnPassant();
    }
    this.changeTurn();
    this.isEnd();
    showTurn();
    return ate;
  }

  moving(x, y) {
    // print("yo");
    var move;
    var pointing = this.getPieceAt(x,y);
    // console.log(pointing);
    if((x >= 0 && x < 8) && (y >= 0 && y < 8)){
      if(this.movingpiece == null && pointing != null){
        if(pointing.color == this.turn){  // check if moving own piece
          this.movingpiece = pointing;
          this.movingpiece.startMove();
          // if(this.movingpiece.type == "pn")
            // console.log(this.movingpiece.legalMoves(this));
        }
      }else if(this.movingpiece != null){
        if(this.movingpiece.canMove(this, x, y, pointing)){
          // this.grid[this.movingpiece.x][this.movingpiece.y] = null;
          this.movePiece(this.movingpiece.x, this.movingpiece.y, x, y);
          // if(this.turn == minimax.color){
          //   print(minimax.getMove(board));
          // }
          // if(this.turn == minimax.color){
          //   minimax.maxValue(this);
          //   console.log(this);
          // }
        }
        this.movingpiece.stopMove();
        this.movingpiece = null;
      }
    }
    // print("yo again");
  }

  clearWhiteEnPassant() {
    for(var i = 8; i < 16; i++){
      this.whitePieces[i].enpassant = null;
    }
  }

  clearBlackEnPassant() {
    for(var i = 8; i < 16; i++){
      this.blackPieces[i].enpassant = null;
    }
  }

  promotion(x, y) {
    var piece_x = this.promoting.x;
    var piece_y = this.promoting.y;

    var promote = null;
    // console.log(piece_x + " " + piece_y);
    if(x == piece_x){
      if(this.promoting.color == board.player){
        if(y == 0){
          promote = new Queen(piece_x,piece_y,board.player,this.gridsize); // promote to queen
        }else if(y == 1){
          promote = new Rook(piece_x,piece_y,board.player,this.gridsize); // promote to rook
        }else if(y == 2){
          promote = new Bishop(piece_x,piece_y,board.player,this.gridsize); // promote to bishop
        }else if(y == 3){
          promote = new Knight(piece_x,piece_y,board.player,this.gridsize); // promote to knight
        }
        if(promote != null){
          this.whitePieces[this.whitePieces.indexOf(this.promoting)] = promote;;
          // this.grid[piece_x][piece_y] = promote;
          this.promoting = null;
        }
      }else if(this.promoting.color == board.opp){
        if(y == 7){
          promote = new Queen(piece_x,piece_y,board.opp,this.gridsize); // promote to queen
        }else if(y == 6){
          promote = new Rook(piece_x,piece_y,board.opp,this.gridsize); // promote to rook
        }else if(y == 5){
          promote = new Bishop(piece_x,piece_y,board.opp,this.gridsize); // promote to bishop
        }else if(y == 4){
          promote = new Knight(piece_x,piece_y,board.opp,this.gridsize); // promote to knight
        }
        if(promote != null){
          this.blackPieces[this.blackPieces.indexOf(this.promoting)] = promote;;
          // this.grid[piece_x][piece_y] = promote;
          this.promoting = null;
        }
      }
    }
  }

  isEnd() {
    if(this.blackPieces[4].dead()){
      // console.log("White win");
      this.win = "white";
    }else if(this.whitePieces[4].dead()){
      // console.log("Black win");
      this.win = "black";
    }
  }

  cloneBoard() {
    var newBoard = new Chessboard(this.scale, this.player, this.opp);
    newBoard.turn = this.turn;
    newBoard.win = this.win;
    newBoard.blackPieces = [];
    newBoard.whitePieces = [];
    for(var i = 0; i < this.blackPieces.length; i++){
      newBoard.blackPieces.push(this.blackPieces[i].clonePiece(this));
    }
    for(var i = 0; i < this.whitePieces.length; i++){
      newBoard.whitePieces.push(this.whitePieces[i].clonePiece(this));
    }
    if(this.movingpiece != null)
      newBoard.movingpiece = newBoard.getPieceAt(this.movingpiece.x, this.movingpiece.y);
    if(this.promoting != null)
      newBoard.promoting = newBoard.getPieceAt(this.promoting.x, this.promoting.y);
    return newBoard;
  }
}
