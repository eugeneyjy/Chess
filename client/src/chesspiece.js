class Chesspiece {
  constructor(x, y, color, scale) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.scale = scale;
    this.moving = false;
    this.type;
    this.img;
    this.alive = true;
    this.first_move = true;
    this.moves = [];
    this.capturing = false;
  }

  show() {
    if(this.alive){
      if(this.color == "black"){
        stroke(255);
        fill(0);
      }else{
        stroke(0);
        fill(255);
      }
      if(this.moving == true){
        // this.showHint();
        imageMode(CENTER);
        image(this.img, mouseX, mouseY, this.scale, this.scale);
      }else{
        imageMode(CORNER);
        image(this.img, this.x*this.scale+offset, this.y*this.scale+offset, this.scale, this.scale);
      }
    }
  }

  showHint() {
    var hint = this.legalMoves(board);
    for(var i = 0; i < hint.length; i++){
      // console.log(hint[i]);
      // ellipseMode();
      fill('rgba(0,0,0,0.25)');
      stroke(255);
      // noStroke();
      circle(hint[i][0]*this.scale+offset+this.scale/2, hint[i][1]*this.scale+offset+this.scale/2, 15);
    }
  }

  startMove() {
    this.moving = true;
  }

  stopMove() {
    this.moving = false;
  }

  move(board, x, y, target) {
    this.x = x;
    this.y = y;
    if(this.first_move)
      this.first_move = false; // used first_move
    if(target != null){
      target.alive = false;
      return 1;
    }
    return 0;
  }

  generateMove(board, dx, dy) {
    var move;
    var x = this.x + dx;
    var y = this.y + dy;
    var eating = board.getPieceAt(x, y);
    move = [x, y];
    if(this.canMove(board, x, y, eating)){
      if(eating != null){
        this.capturing = true;
      }
      return move;
    }
    return null;
  }


  killed() {
    this.alive = false;
  }

  dead() {
    if(this.alive == false){
      return true;
    }
    else{
      return false;
    }
  }

  canMove(board, x, y, eating) {}

  eatable(piece) {
    if(piece != null){
      if(piece.color == this.color){
        return false;
      }else{
        return true;
      }
    }
    return null;
  }

  leap_forward(board, dy) {
    var y = dy;
    // console.log(this.y + y);
    while(y != 0){
      // console.log(board.getPieceAt(this.x, this.y - y));
      if(board.getPieceAt(this.x, this.y - y) && y != dy){ // see if got piece in the way
        // console.log("leap forward");
        return true;
      }
      if(y > 0){
        y--;
      }else if(y < 0){
        y++;
      }
    }
    return false;
  }

  leap_side(board, dx) {
    var x = dx;
    while(x != 0){
      if(board.getPieceAt(this.x - x, this.y) && x != dx){ // see if got piece in the way
        return true;
      }
      if(x > 0){
        x--;
      }else if(x < 0){
        x++;
      }
    }
    return false;
  }

  leap_diagonal(board, dx, dy) {
    var y = dy;
    var x = dx;
    while(x != 0 && y != 0){
      if(board.getPieceAt(this.x - x, this.y - y) && x != dx && y != dy){ // see if got piece in the way
        return true;
      }
      if(x > 0){
        x--;
      }else if(x < 0){
        x++;
      }
      if(y > 0){
        y--;
      }else if(y < 0){
        y++;
      }
    }
    return false;
  }

  cornerSteps(limit) {
    var u_dy, l_dx, d_dy, r_dx;
    u_dy = this.y;
    l_dx = this.x;
    d_dy = 7 - this.y;
    r_dx = 7-this.x;
    var tl = Math.min(u_dy, l_dx, limit);
    var tr = Math.min(r_dx, u_dy, limit);
    var bl = Math.min(l_dx, d_dy, limit);
    var br = Math.min(r_dx, d_dy, limit);
    return [tl,tr,bl,br];
  }

  straightSteps(limit) {
    var up = Math.min(this.y, limit);
    var down = Math.min(7-this.y, limit);
    var left = Math.min(this.x, limit);
    var right = Math.min(7-this.x);

    return [up,down,left,right];
  }

  cornerMoves(board, limit) {
    var moves = [];
    var move;
    var steps = this.cornerSteps(limit);
    for(var i = 0; i <= steps[0]; i++){     // genereate move for top left corner
      if(move = this.generateMove(board, -i, -i)){
        moves.push(move);
      }
    }
    for(var i = 0; i <= steps[1]; i++){      // generate move for top right corner
      if(move = this.generateMove(board, i, -i)){
        moves.push(move);
      }
    }
    for(var i = 0; i <= steps[2]; i++){     // generate move for bottom left corner
      if(move = this.generateMove(board, -i, i)){
        moves.push(move);
      }
    }
    for(var i = 0; i <= steps[3]; i++){     // generate move for bottom right corner
      if(move = this.generateMove(board, i, i)){
        moves.push(move);
      }
    }
    return moves;
  }

  straightMoves(board, limit) {
    var moves = [];
    var move;
    var steps = this.straightSteps(limit);
    for(var i = 0; i <= steps[0]; i++){     // generate move upward
      if(move = this.generateMove(board, 0, -i)){
        moves.push(move);
      }
    }
    for(var i = 0; i <= steps[1]; i++){     // generate move downward
      if(move = this.generateMove(board, 0, i)){
        moves.push(move);
      }
    }
    for(var i = 0; i <= steps[2]; i++){     // generate move left
      if(move = this.generateMove(board, -i, 0)){
        moves.push(move);
      }
    }
    for(var i = 0; i <= steps[3]; i++){     // generate move right
      if(move = this.generateMove(board, i, 0)){
        moves.push(move);
      }
    }
    return moves;
  }
}

class King extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "kg";
    this.value = 10000;

    if(this.color == "white"){
      this.img = white_images[5];
    }else{
      this.img = black_images[5];
    }
  }

  canMove(board, x, y, eating) {
    if((x < 0 || x > 7) || (y < 0 || y > 7)){
      return false;
    }
    // var eating = board.getPieceAt(x, y);
    if(eating != null){
      if(eating.type == "rk" && eating.color == this.color){
        return(this.canCastle(board, eating));
      }
      if(eating.color == this.color){
        return false;
      }
    }
    var dx = this.x - x;
    var dy = this.y - y;
    if(abs(dx) <= 1 && abs(dy) <= 1){
      return true;
    }else{
      return false;
    }
  }

  canCastle(board, rook) {
    if(this.first_move && rook.first_move){
      var dx = this.x - rook.x;
      if(this.leap_side(board, dx)){
        // console.log("cant castle");
        return false;
      }else{
        return "castling";
      }
    }
    return false;
  }

  castle(rook) {
    var dx = this.x - rook.x;
    this.first_move = false;
    rook.first_move = false;
    if(dx > 0){ // castle with left rook
      this.x -= 2;
      rook.x = this.x + 1;
    }else{      // castle with right rook
      this.x += 2;
      rook.x = this.x - 1;
    }
  }

  move(board, x, y, target) {
    if(target != null && target.type == "rk" && target.color == this.color){
      this.castle(target);
    }else{
      this.x = x;
      this.y = y;
      if(this.first_move)
        this.first_move = false; // used first_move
      if(target != null){
        target.alive = false;
      }
    }
  }

  castleMoves(board) {
    var moves = [];
    var move;
    if(this.first_move){
      if(move = this.generateMove(board, -4, 0)){ // generate move with left castle
        moves.push(move);
      }
      if(move = this.generateMove(board, 3, 0)){  // generate move with right castle
        moves.push(move);
      }
    }
    return moves;
  }

  legalMoves(board) {
    this.capturing = false;
    var straight_moves = this.straightMoves(board, 1);
    var corner_moves = this.cornerMoves(board, 1);
    var castle_moves = this.castleMoves(board);
    var moves = straight_moves.concat(corner_moves);
    moves = moves.concat(castle_moves);
    return moves;
  }

  clonePiece() {
    var newPiece = new King(this.x,this.y,this.color,this.scale);
    newPiece.moving = this.moving;
    newPiece.alive = this.alive;
    newPiece.first_move = this.first_move;
    for(var i = 0; i < this.moves.length; i++){
      var move_x = this.moves[i][0];
      var move_y = this.moves[i][1];
      var move = [move_x, move_y];
      newPiece.moves.push(move);
    }
    return newPiece;
  }
}

class Queen extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "qn";
    this.value = 900;

    if(this.color == "white"){
      this.img = white_images[0];
    }else{
      this.img = black_images[0];
    }
  }

  canMove(board, x, y, eating) {
    if((x < 0 || x > 7) || (y < 0 || y > 7)){
      return false;
    }
    // var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == abs(dy)){ // moving diagonally
      if(this.leap_diagonal(board, dx, dy))
        return false;
      else
        return true;
    }else if(dx == 0 || dy == 0){ // moving straight
      if(this.leap_forward(board, dy) || this.leap_side(board, dx)){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }

  legalMoves(board) {
    this.capturing = false;
    var straight_moves = this.straightMoves(board, 7);
    var corner_moves = this.cornerMoves(board, 7);
    var moves = straight_moves.concat(corner_moves);
    return moves;
  }

  clonePiece() {
    var newPiece = new Queen(this.x,this.y,this.color,this.scale);
    newPiece.moving = this.moving;
    newPiece.alive = this.alive;
    newPiece.first_move = this.first_move;
    for(var i = 0; i < this.moves.length; i++){
      var move_x = this.moves[i][0];
      var move_y = this.moves[i][1];
      var move = [move_x, move_y];
      newPiece.moves.push(move);
    }
    return newPiece;
  }
}

class Rook extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "rk";
    this.value = 500;

    if(this.color == "white"){
      this.img = white_images[1];
    }else{
      this.img = black_images[1];
    }
  }

  canMove(board, x, y, eating) {
    if((x < 0 || x > 7) || (y < 0 || y > 7)){
      return false;
    }
    // var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(dx == 0 || dy == 0){ // moving straight
      if(this.leap_forward(board, dy) || this.leap_side(board, dx))
        return false;
      else
        return true;
    }else{
      return false;
    }
  }

  legalMoves(board) {
    this.capturing = false;
    return this.straightMoves(board, 7);
  }

  clonePiece() {
    var newPiece = new Rook(this.x,this.y,this.color,this.scale);
    newPiece.moving = this.moving;
    newPiece.alive = this.alive;
    newPiece.first_move = this.first_move;
    for(var i = 0; i < this.moves.length; i++){
      var move_x = this.moves[i][0];
      var move_y = this.moves[i][1];
      var move = [move_x, move_y];
      newPiece.moves.push(move);
    }
    return newPiece;
  }
}

class Knight extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "kn";
    this.value = 300;

    if(this.color == "white"){
      this.img = white_images[3];
    }else{
      this.img = black_images[3];
    }
  }

  canMove(board, x, y, eating) {
    if((x < 0 || x > 7) || (y < 0 || y > 7)){
      return false;
    }
    // var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == 1 && abs(dy) == 2){ // moving L shape
      return true;
    }else if(abs(dx) == 2 && abs(dy) == 1){ // moving lie down L shape
      return true;
    }else{
      return false;
    }
  }

  legalMoves(board) {
    this.capturing = false;
    var moves = [];
    var move;
    for(var dx = -2; dx <= 2; dx++){
      for(var dy = -2; dy <= 2; dy++){
        if(move = this.generateMove(board, dx, dy)){
          moves.push(move);
        }
      }
    }
    return moves;
  }

  clonePiece() {
    var newPiece = new Knight(this.x,this.y,this.color,this.scale);
    newPiece.moving = this.moving;
    newPiece.alive = this.alive;
    newPiece.first_move = this.first_move;
    for(var i = 0; i < this.moves.length; i++){
      var move_x = this.moves[i][0];
      var move_y = this.moves[i][1];
      var move = [move_x, move_y];
      newPiece.moves.push(move);
    }
    return newPiece;
  }
}

class Bishop extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "bs";
    this.value = 300;

    if(this.color == "white"){
      this.img = white_images[2];
    }else{
      this.img = black_images[2];
    }
  }

  canMove(board, x, y, eating) {
    if((x < 0 || x > 7) || (y < 0 || y > 7)){
      return false;
    }
    // var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.eatable(eating) == false){
      return false;
    }
    if(abs(dx) == abs(dy)){
      if(this.leap_diagonal(board, dx, dy))
        return false;
      else
        return true;
    }else{
      return false;
    }
  }

  legalMoves(board) {
    this.capturing = false;
    return this.cornerMoves(board, 7);
  }

  clonePiece() {
    var newPiece = new Bishop(this.x,this.y,this.color,this.scale);
    newPiece.moving = this.moving;
    newPiece.alive = this.alive;
    newPiece.first_move = this.first_move;
    for(var i = 0; i < this.moves.length; i++){
      var move_x = this.moves[i][0];
      var move_y = this.moves[i][1];
      var move = [move_x, move_y];
      newPiece.moves.push(move);
    }
    return newPiece;
  }
}

class Pawn extends Chesspiece {
  constructor(x, y, color, scale) {
    super(x, y, color, scale);
    this.type = "pn";
    this.value = 100;
    this.promotion = false;
    this.enpassant = null;

    if(this.color == "white"){
      this.img = white_images[4];
    }else{
      this.img = black_images[4];
    }
  }

  canMove(board, x, y, eating) {
    if((x < 0 || x > 7) || (y < 0 || y > 7)){
      return false;
    }
    // var eating = board.getPieceAt(x, y);
    var dx = this.x - x;
    var dy = this.y - y;
    if(this.color == board.opp){
      dy = -dy;
    }
    if(this.eatable(eating, board) == false){
      return false;
    }
    if(dy == 1 && abs(dx) == 1) { // moving diagonally
      if(this.enpassant != null && this.enpassant.x == x){  // move behind en passant
        return true;
      }
      if(this.eatable(eating, board)){
        return true;
      }else{
        return false;
      }
    }else if(dy >= 0 && dy <= 1 && dx == 0){ // moving forward
      return true;
    }else if(dy == 2 && dx == 0 && !this.leap_forward(board, dy)){ // moving forward 2 space
      if(this.first_move){ // using first move
        return "double";
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  eatable(piece, board) {
    if(piece != null){
      var dx = this.x - piece.x;
      var dy = this.y - piece.y;
      if(this.color == board.opp){
        dy = -dy;
      }
      if(piece.color == this.color){
        return false;
      }else if(abs(dx) == 1 && dy == 1){
        return true;
      }else{
        return false;
      }
    }
    return null;
  }

  move(board, x, y, target) {
    var dy = abs(this.y - y);
    this.x = x;
    this.y = y;
    if(this.first_move){
      this.first_move = false; // used first_move
      if(dy == 2){ // used double move then set adjacent en passant
        var pawn_l = board.getPieceAt(x-1, y);
        var pawn_r = board.getPieceAt(x+1, y);
        if(pawn_l != null && pawn_l.color != this.color){
          pawn_l.enpassant = this;
        }
        if(pawn_r != null && pawn_r.color != this.color){
          pawn_r.enpassant = this;
        }
      }
    }
    if(target != null){
      target.alive = false;
    }else if(this.enpassant != null && this.x == this.enpassant.x){ // moved behind en passant
      // console.log(this.enpassant);
      var eating = board.getPieceAt(this.enpassant.x, this.enpassant.y);
      eating.alive = false;
    }
    if(this.reachEnd()){
      board.promoting = this;
    }
  }

  legalMoves(board) {
    this.capturing = false;
    var moves = [];
    var dy, moveX, moveY, move;
    if(this.color == board.player){
      dy = -1;
    }else{
      dy = 1;
    }
    for(var dx = -1; dx < 2; dx++){
      if(move = this.generateMove(board, dx, dy)){
        moves.push(move);
      }
    }

    if(this.first_move){
      if(this.color == board.player){
        dy = -2;
      }else{
        dy = 2;
      }
      for(var dx = -1; dx < 2; dx++){
        if(move = this.generateMove(board, dx, dy)){
          moves.push(move);
        }
      }
    }
    return moves;
  }

  reachEnd() {
    if(this.y == 0 || this.y == 7){
      return true;
    }
    return false;
  }

  showPromotion() {
    var y;
    var point_x = floor(map(mouseX, 0+offset, size+offset, 0, 8));
    var point_y = floor(map(mouseY, 0+offset, size+offset, 0, 8));

    for(var i = 0; i < 4; i++){
      var img_scale = this.scale;
      // stroke(#eee);
      noStroke();
      fill(255);
      // console.log((this.x*this.scale+offset) + " " + (this.y*this.scale*i+offset));
      if(this.y == 0){
        y = this.y + i;
      }
      else if(this.y == 7){
        y = this.y - i;
      }
      if(point_x == this.x && point_y == y){
        img_scale = this.scale + 5;
      }
      rect(this.x*this.scale+offset, y*this.scale+offset, this.scale, this.scale);
      if(this.color == "white")
        image(white_images[i], this.x*this.scale+offset, y*this.scale+offset, img_scale, img_scale);
      else
        image(black_images[i], this.x*this.scale+offset, y*this.scale+offset, img_scale, img_scale);
    }
  }

  clonePiece() {
    var newPiece = new Pawn(this.x,this.y,this.color,this.scale);
    newPiece.moving = this.moving;
    newPiece.alive = this.alive;
    newPiece.first_move = this.first_move;
    for(var i = 0; i < this.moves.length; i++){
      var move_x = this.moves[i][0];
      var move_y = this.moves[i][1];
      var move = [move_x, move_y];
      newPiece.moves.push(move);
    }
    newPiece.promotion = this.promotion;
    newPiece.enpassant = this.enpassant;
    return newPiece;
  }
}