class Minimax {
  constructor(depth, color="black") {
    this.color = color;
    this.max_depth = depth;
    this.setOppColor();
  }

  setOppColor() {
    this.opp_color = "white";
    if(this.color == "white"){
      this.opp_color = "black";
    }
  }

  getAiPieces(board) {
    var ai_pieces = board.blackPieces;
    if(this.color == "white"){
      ai_pieces = board.whitePieces;
    }
    return ai_pieces;
  }

  getPlayerPieces(board) {
    var player_pieces = board.whitePieces;
    if(this.color == "white"){
      player_pieces = board.blackPieces;
    }
    return player_pieces;
  }

  getPieces(board, color) {
    var pieces = board.whitePieces;
    if(color == "black"){
      pieces = board.blackPieces;
    }
    return pieces;
  }

  utilityScore(board) {
    var score = 0;
    var ai_pieces = this.getAiPieces(board);
    var player_pieces = this.getPlayerPieces(board);
    for(var i = 0; i < ai_pieces.length; i++){
      if(!ai_pieces[i].dead())
        score += ai_pieces[i].value;
    }
    for(var i = 0; i < player_pieces.length; i++){
      if(!player_pieces[i].dead())
        score -= player_pieces[i].value;
    }
    return score;
  }

  successor(board, color) {
    var pieces = this.getPieces(board, color);
    // console.log(pieces.length-1);
    var curr_piece, moves, curr_eat;
    var result = [];
    // for(var i = (pieces.length-1); i >= 0; i--){
    for(var i = 0; i < pieces.length; i++){
      // console.log(i);
      curr_piece = pieces[i].clonePiece(board);
      if(curr_piece.alive){
        curr_piece.moves = curr_piece.legalMoves(board);
        result.push(curr_piece);
      }
    }
    // console.log(result);
    result = shuffling(result);
    return result;
  }

  // successor(board, color) {
  //   var pieces = this.getPieces(board, color);
  //   // console.log(pieces.length-1);
  //   var curr_piece, curr_move, move_x, move_y;
  //   var temp_board;
  //   var result = [];
  //   // for(var i = (pieces.length-1); i >= 0; i--){
  //   for(var i = 0; i < pieces.length; i++){
  //     curr_piece = pieces[i];
  //     // console.log(i);
  //     if(curr_piece.alive){
  //       curr_piece.moves = curr_piece.legalMoves(board);
  //       for(var j = 0; j < curr_piece.moves.length; j++){
  //         temp_board = board.cloneBoard();
  //         curr_move = curr_piece.moves[j];
  //         move_x = curr_move[0];
  //         move_y = curr_move[1]
  //         temp_board.movePiece(curr_piece.x, curr_piece.y, move_x, move_y);
  //         result.push(temp_board);
  //       }
  //     }
  //   }
  //   // console.log(result);
  //   return result;
  // }

  maxAB(board, depth, alpha, beta) {
    if(depth >= this.max_depth){
      return this.utilityScore(board);
    }

    if(board.win == this.opp_color){
      return -200;
    }else if(board.win == this.color){
      return 200;
    }

    var max_value = -Infinity, value;
    var pieces = this.successor(board, this.color);
    var temp_board, count = 1;
    var moving_piece, curr_move, move_x, move_y, max_i, max_j;
    var max_piece;
    for(var i = 0; i < pieces.length; i++){
      moving_piece = pieces[i];
      for(var j = 0; j < moving_piece.moves.length; j++){
        temp_board = board.cloneBoard();
        curr_move = moving_piece.moves[j];
        move_x = curr_move[0];
        move_y = curr_move[1];
        temp_board.movePiece(moving_piece.x, moving_piece.y, move_x, move_y);
        value = this.minAB(temp_board, depth+1, alpha, beta);
        if(depth == 0){
          print(moving_piece, value);
        }
        if(value > max_value){
          max_value = value;
          max_j = j;
          max_piece = moving_piece;
        }
        if(value >= beta){
          return max_value;
        }
        alpha = Math.max(alpha, value);
      }
    }
    if(depth == 0){
      return [max_piece, max_j];
    }
    return max_value;
  }

  minAB(board, depth, alpha, beta) {
    if(depth >= this.max_depth){
      return this.utilityScore(board);
    }

    if(board.win == this.opp_color){
      return -200;
    }else if(board.win == this.color){
      return 200;
    }

    var value = Infinity;
    var temp_board;
    var pieces = this.successor(board, this.opp_color);
    var moving_piece, curr_move, move_x, move_y;
    for(var i = 0; i < pieces.length; i++){
      moving_piece = pieces[i];
      for(var j = 0; j < moving_piece.moves.length; j++){
        temp_board = board.cloneBoard();
        curr_move = moving_piece.moves[j];
        move_x = curr_move[0];
        move_y = curr_move[1];
        temp_board.movePiece(moving_piece.x, moving_piece.y, move_x, move_y);
        value = Math.min(value, this.maxAB(temp_board, depth+1, alpha, beta));
        if(value <= alpha){
          return value;
        }
        beta = Math.min(beta, value);
      }
    }
    return value;
  }

  getMove(board) {
    var piece, move_index;
    [piece, move_index] = this.maxAB(board, 0, -Infinity, Infinity);
    var move_from = [piece.x, piece.y];
    var move_to = [piece.moves[move_index][0], piece.moves[move_index][1]];
    return [move_from, move_to];
  }

}

function shuffling(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
