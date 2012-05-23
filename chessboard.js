/*==========================*/
/*  Piece class declaration */
/*==========================*/

function Piece(color, type, obj, square){
	
	/*  type is what kind of piece it is (a constant defined later), and color is white or black (also constants defined later) */
	
	this.type = type;
	this.color = color;
	
	/*  hasMoved is used, for instance, to check if the king and rook can castle.  */
	
	this.hasMoved = false;
	
	/*  square is the square it's on.  square.piece is set in this constructor because square is defined before piece. */
	
	this.square = square;
	square.piece = this;
	
	/*  representation is the actual image on the board */
	
	this.representation = obj;
	
	/*  epleft and epright are true if the piece is a pawn that can capture via en passant on its left or right */
	
	this.epleft = false;
	this.epright = false;
	
	/* the available array holds a key value on each of the 64 squares indicating how the piece relates to that square.
	 * these relations are defined in constants later on.  
	 * updateMoves is a huge function that sets up this array properly.
	 */
	
	this.updateMoves = function(){
		
		/*  By default, the piece can not go anywhere.  If it can go to some squares, or interacts with them in an abnormal way, 
		 * that will be defined below.
		 */
		
		for (var i = 0; i < 8; i++){
			for (var j = 0; j < 8; j++){
				this.available[i][j] = Piece.NO_MOVE;
			}
		}
		
		switch (this.type){
		case Piece.PAWN:
			for (var i = 0; i < 8; i++){
				for (var j = 0; j < 8; j++){
					var testSquare = squares[i][j];
					var row = j + 1;					//Row is the actual row it's on, not the array index.  Same for column. 
					var col = i + 1;					//This is for readability.  Also, column and row on square are this way.
					if (this.color == Piece.WHITE){
						if (this.square.row == 2){		//If the pawn is on the second rank, then it can go up two squares on its first move.
							if (row == 3 || (row == 4 && squares[i][j - 1].piece == null))	//It can only go up two if the square up one is clear.
								if (this.square.column == col)
									if (testSquare.piece == null )
										this.available[i][j] = Piece.MOVE_ONLY;
									else
										this.available[i][j] = Piece.NO_MOVE;
								else
									if (Math.abs(this.square.column - col) == 1		//Check captures/protections on the second rank.
									&& testSquare.piece != null && row == 3) 		//These are only valid for pieces on the third row.
										if (testSquare.piece.color != this.color)
											this.available[i][j] = Piece.CAPTURE;
										else
											this.available[i][j] = Piece.FRIENDLY_PIECE;
									else
										this.available[i][j] = Piece.NO_MOVE;
							else
								this.available[i][j] = Piece.NO_MOVE;
						}
						else{
							if (row == this.square.row + 1)							//If it is on any other rank, it can only move one space up.
								if (this.square.column == col)
									if (testSquare.piece == null)
										this.available[i][j] = Piece.MOVE_ONLY;
									else
										this.available[i][j] = Piece.NO_MOVE;			
								else													//Check captures on the adjacent ranks.
									if (Math.abs(this.square.column - col) == 1
									&& testSquare.piece != null)
										if (testSquare.piece.color != this.color)
											this.available[i][j] = Piece.CAPTURE;
										else
											this.available[i][j] = Piece.FRIENDLY_PIECE;
									else
										this.available[i][j] = Piece.NO_MOVE;
							else
								this.available[i][j] = Piece.NO_MOVE;
						}
					}
					else{		//Black pawn
						if (this.square.row == 7){									//Seventh rank:  One or two down
							if (row == 6 || (row == 5 && squares[i][j + 1].piece == null))
								if (this.square.column == col)
									if (testSquare.piece == null)
										this.available[i][j] = Piece.MOVE_ONLY;
									else
										this.available[i][j] = Piece.NO_MOVE;
								else
									if (Math.abs(this.square.column - col) == 1		//Check seventh rank captures
									&& testSquare.piece != null && row == 6) 
										if (testSquare.piece.color != this.color)
											this.available[i][j] = Piece.CAPTURE;
										else
											this.available[i][j] = Piece.FRIENDLY_PIECE;
									else
										this.available[i][j] = Piece.NO_MOVE;
							else
								this.available[i][j] = Piece.NO_MOVE;
						}
						else{
							if (row == this.square.row - 1)							//Other rank:  One down
								if (this.square.column == col)
									if (testSquare.piece == null)
										this.available[i][j] = Piece.MOVE_ONLY;
									else
										this.available[i][j] = Piece.NO_MOVE;			
								else													//Check other rank caps
									if (Math.abs(this.square.column - col) == 1
									&& testSquare.piece != null)
										if (testSquare.piece.color != this.color)
											this.available[i][j] = Piece.CAPTURE;
										else
											this.available[i][j] = Piece.FRIENDLY_PIECE;
									else
										this.available[i][j] = Piece.NO_MOVE;
							else
								this.available[i][j] = Piece.NO_MOVE;
						}
					}
				}
			}
			/*  Now check for en passant. */
			if (this.epleft && this.square.column != 1){			//The != is there because this gets run through when possible moves
				if (this.color == Piece.WHITE)						//are calculated.  So EP will still be true, but the piece will hypothetically
					this.available[this.square.column - 2][this.square.row] = Piece.EN_PASSANT;		//be on the ep-ing square.
				else
					this.available[this.square.column - 2][this.square.row - 2] = Piece.EN_PASSANT;
			}
			if (this.epright && this.square.column != 8)
				if (this.color == Piece.WHITE)
					this.available[this.square.column][this.square.row] = Piece.EN_PASSANT;
				else
					this.available[this.square.column][this.square.row - 2] = Piece.EN_PASSANT;
			break;
			
		/*  For knights, the rule is that if a square is three squares away but not in a straight line,
		 *  they can go to it (I made this up and it's a confusing way to think about it but it works).  
		 *  Knights can jump over other pieces so we don't need to worry about checking if there is a piece
		 *  in the way.
		 */
		case Piece.KNIGHT:
			for (var i = 1; i <= 8; i++){
				for (var j = 1; j <= 8; j++){
					var testSquare = squares[i - 1][j - 1];
					if ((Math.abs(this.square.row - j)
							  + Math.abs(this.square.column - i) == 3)
							  && this.square.row != j
							  && this.square.column != i)
								if ((testSquare.piece != null) && (testSquare.piece.color == this.color))
									this.available[i - 1][j - 1] = Piece.FRIENDLY_PIECE;
								else
									this.available[i - 1][j - 1] = Piece.CAPTURE;
							else
								this.available[i - 1][j - 1] = Piece.NO_MOVE;
				}
			}
			break;
			
		/*  For bishops, rooks and queens, check along the straight line.  After running into a piece, go to the next line.
		 *  This is tedious but I think it has to be the best way to do it.
		 */
		case Piece.BISHOP:
			var bi = this.square.column;
			var bj = this.square.row;
			
			outerloop:
			while (bi <= 8 && bj <= 8){
				var testSquare = squares[bi - 1][bj - 1];
				if (testSquare.piece == null)
					this.available[bi - 1][bj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[bi - 1][bj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[bi - 1][bj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}	
					}
					else{
						this.available[bi - 1][bj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				bi++;
				bj++;
			}
			
			bi = this.square.column;
			bj = this.square.row;			
			outerloop:
			while (bi <= 8 && bj >= 1){
				var testSquare = squares[bi - 1][bj - 1];
				if (testSquare.piece == null)
					this.available[bi - 1][bj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[bi - 1][bj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[bi - 1][bj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[bi - 1][bj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				bi++;
				bj--;
			}
			
			bi = this.square.column;
			bj = this.square.row;
			outerloop:
			while (bi >= 1 && bj <= 8){
				var testSquare = squares[bi - 1][bj - 1];
				if (testSquare.piece == null)
					this.available[bi - 1][bj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[bi - 1][bj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[bi - 1][bj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[bi - 1][bj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				bi--;
				bj++;
			}
			
			bi = this.square.column;
			bj = this.square.row;
			outerloop:
			while (bi >= 1 && bj >= 1){
				var testSquare = squares[bi - 1][bj - 1];
				if (testSquare.piece == null)
					this.available[bi - 1][bj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[bi - 1][bj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[bi - 1][bj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[bi - 1][bj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				bi--;
				bj--;
			}
			break;
					
		case Piece.ROOK:
			var ri = this.square.column;
			var rj = this.square.row;
			outerloop:
			while (ri <= 8){
				var testSquare = squares[ri - 1][rj - 1];
				if (testSquare.piece == null)
					this.available[ri - 1][rj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[ri - 1][rj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[ri - 1][rj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[ri - 1][rj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				ri++;
			}
			
			ri = this.square.column;
			outerloop:
			while (ri >= 1){
				var testSquare = squares[ri - 1][rj - 1];
				if (testSquare.piece == null)
					this.available[ri - 1][rj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[ri - 1][rj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[ri - 1][rj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[ri - 1][rj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				ri--;
			}
			
			ri = this.square.column;
			rj = this.square.row;
			outerloop:
			while (rj <= 8){
				var testSquare = squares[ri - 1][rj - 1];
				if (testSquare.piece == null)
					this.available[ri - 1][rj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[ri - 1][rj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[ri - 1][rj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[ri - 1][rj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				rj++;
			}
			
			rj = this.square.row;
			outerloop:
			while (rj >= 1){
				var testSquare = squares[ri - 1][rj - 1];
				if (testSquare.piece == null)
					this.available[ri - 1][rj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[ri - 1][rj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[ri - 1][rj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[ri - 1][rj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				rj--;
			}
			break;
			
		case Piece.QUEEN:
			var qi = this.square.column;
			var qj = this.square.row;
			
			outerloop:
			while (qi <= 8 && qj <= 8){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qi++;
				qj++;
			}
			
			qi = this.square.column;
			qj = this.square.row;			
			outerloop:
			while (qi <= 8 && qj >= 1){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qi++;
				qj--;
			}
			
			qi = this.square.column;
			qj = this.square.row;
			outerloop:
			while (qi >= 1 && qj <= 8){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qi--;
				qj++;
			}
			
			qi = this.square.column;
			qj = this.square.row;
			outerloop:
			while (qi >= 1 && qj >= 1){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qi--;
				qj--;
			}
					
			qi = this.square.column;
			qj = this.square.row;
			outerloop:
			while (qi <= 8){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qi++;
			}
			
			qi = this.square.column;
			outerloop:
			while (qi >= 1){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qi--;
			}
			
			qi = this.square.column;
			qj = this.square.row;
			outerloop:
			while (qj <= 8){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qj++;
			}
			
			qj = this.square.row;
			outerloop:
			while (qj >= 1){
				var testSquare = squares[qi - 1][qj - 1];
				if (testSquare.piece == null)
					this.available[qi - 1][qj - 1] = Piece.CAPTURE;
				else{
					if (testSquare.piece.color == this.color){
						this.available[qi - 1][qj - 1] = Piece.NO_MOVE;
						if (testSquare.piece != this){
							this.available[qi - 1][qj - 1] = Piece.FRIENDLY_PIECE;
							break outerloop;
						}
					}
					else{
						this.available[qi - 1][qj - 1] = Piece.CAPTURE;
						break outerloop;
					}
				}
				qj--;
			}
			break;
		
		/*  For the king, we're checking all the squares in the 3 x 3 box that surrounds it.
		 *  This results in the king "protecting" itself, but saves space.
		 *  We also check for castling by seeing if both the king and rook have not moved and the squares are clear.
		 *  At this point, we don't look to see if the squares are not in check, but that comes into play later.
		 */
		case Piece.KING:		
			for (var i = -1; i <= 1; i++){
				for (var j = -1; j <= 1; j++){
					var col = this.square.column + i;
					var row = this.square.row + j;
					if ((1 <= col) && (col <= 8)
							&& (1 <= row) && (row <= 8)){
						if (squares[col - 1][row - 1].piece == null 
								|| squares[col - 1][row - 1].piece.color != this.color)
							this.available[col - 1][row - 1] = Piece.CAPTURE;
						else
							this.available[col - 1][row - 1] = Piece.FRIENDLY_PIECE;
					}
				}
			}
			if (this.color == Piece.WHITE && !wk.hasMoved){
				if (!wr1.hasMoved && squares[5][0].piece == null && squares[6][0].piece == null)
					this.available[6][0] = Piece.KINGSIDE_CASTLE;
				if (!wr2.hasMoved && squares[3][0].piece == null && squares[2][0].piece == null)
					this.available[2][0] = Piece.QUEENSIDE_CASTLE;
			} else if (this.color == Piece.BLACK && !bk.hasMoved){
				if (!br1.hasMoved && squares[5][7].piece == null && squares[6][7].piece == null)
					this.available[6][7] = Piece.KINGSIDE_CASTLE;
				if (!br2.hasMoved && squares[3][7].piece == null && squares[2][7].piece == null)
					this.available[2][7] = Piece.QUEENSIDE_CASTLE;
			}
		}
	};
	
	/*  This is the best way to declare an 8 x 8 2d array.  */
	this.available = (function(a){
		while(a.push([]) < 9); 
		return a;
		})([]);
}

/*  A bunch of constants */

Piece.WHITE = 0;
Piece.BLACK = 1;

Piece.PAWN = 0;
Piece.KNIGHT = 1;
Piece.BISHOP = 2;
Piece.ROOK = 3;
Piece.QUEEN = 4;
Piece.KING = 5;

Piece.FRIENDLY_PIECE = -1;
Piece.NO_MOVE = 0;
Piece.MOVE_ONLY = 1;
Piece.CAPTURE = 2;
Piece.KINGSIDE_CASTLE = 3;
Piece.QUEENSIDE_CASTLE = 4;
Piece.EN_PASSANT = 5;



/*===========================*/
/*  Square class declaration */
/*===========================*/

function Square(column, row){
	this.column = column;
	this.row = row;
	
	this.piece = null;
	
	this.coordinates = {
			x : (column - 1) * 50,
			y : (8 - row) * 50
	};
}



/*======================*/
/* A doubly linked list */
/*======================*/

function LLNode(prev, contents, next){
	this.prev = prev;
	this.contents = contents;
	this.next = next;
}

function LinkedList(){
	this.head = null;
	this.tail = null;
	this.length = 0;
	
	this.add = function(piece){
		node = new LLNode(null, piece, null);
		if (this.length == 0){
			this.head = node;
			this.tail = node;
		}
		else{
			this.tail.next = node;
			node.prev = this.tail;
			this.tail = node;
		}
		this.length++;
	};
	
	this.remove = function(piece){
		node = this.head;
		if (node != null){
			do{
				if (node.contents == piece){
					if (node.prev != null)
						node.prev.next = node.next;
					else
						this.head = node.next;
					if (node.next != null)
						node.next.prev = node.prev;
					else
						this.tail = node.prev;
					this.length--;
				}
				node = node.next;
			} while (node != null)
		}
	};
}




/*===========================================*/
/*  Code for drag-and-dropping pieces around */
/*===========================================*/

var pickedUp = false;
var pickedUpPiece = null;

document.onmousedown = function(e){
	var x = e.pageX;
	var y = e.pageY;
	var column = (Math.floor(x / 50) + 1);
	var row = 8 - (Math.floor(y / 50));
	if (0 < column && column <= 8 && 0 < row && row <= 8){
		var sq = squares[(column - 1)][(row - 1)];
		var pc = sq.piece;
		document.body.focus();
		if (pc != null && ((turn == true && pc.color == Piece.WHITE) || (turn == false && pc.color == Piece.BLACK))){
			pickedUp = true;
			pickedUpPiece = pc;
			document.onmouseup = function(e){	
				var x = e.pageX;
				var y = e.pageY;
				var column = (Math.floor(x / 50) + 1);
				var row = 8 - (Math.floor(y / 50));
				if ((0 < row) && (row <= 8) && (0 < column) && (column <= 8)){
					var sq = squares[(column - 1)][(row - 1)];
					movePiece(sq);
					pickedUp = false;
					pickedUpPiece = null;
				}
				else{
					movePiece(pickedUpPiece.square);
					pickedUp = false;
					pickedUpPiece = null;
				}
				document.onmouseup = function(){return false;};
			};
			document.onmousemove = function(e){
				if (pickedUpPiece != null){
					pickedUpPiece.representation.style.left = (e.pageX - 25) + "px";
					pickedUpPiece.representation.style.top = (e.pageY - 25) + "px";
				}
			};
			return false;
		}
		else
			return false;
	}
	
};

/*  Code for what happens when a piece moves */

var turn = true;		//true is white
var check = false;
var checkmate = false;

var computerPlaysBlack = true;
var computerPlaysWhite = false;

function movePiece(square){
	oldPiece = square.piece;
	oldSquare = pickedUpPiece.square;
	
	var ep = pickedUpPiece.available[square.column - 1][square.row - 1] == Piece.EN_PASSANT;
	
	promoted = false;
	
	if (pickedUpPiece.type == Piece.PAWN 
			&& ((pickedUpPiece.square.column == square.column) ? square.piece == null : square.piece != null)		//Pawn moves != queen moves
			&& ((pickedUpPiece.color == Piece.WHITE) ? square.row == 8 : square.row == 1)){	//Promotion
		promoted = true;
		pickedUpPiece.type = 4;
		if (pickedUpPiece.color == Piece.WHITE)
			pickedUpPiece.representation.setAttribute("src", "images/wqueen.png");
		else
			pickedUpPiece.representation.setAttribute("src", "images/bqueen.png");
	}
	
	if (checkValidMove(pickedUpPiece, square, true) == true){
		pickedUpPiece.square = oldSquare;
		square.piece = oldPiece;
		
		pickedUpPiece.square.piece = null;
		pickedUpPiece.square = square;
		
		
		if (pickedUpPiece.square.piece != null || ep){
			if (pickedUpPiece.square.piece != null && pickedUpPiece.square.piece.color == pickedUpPiece.color){
				pickedUpPiece.square = oldSquare;
				pickedUpPiece.square.piece = pickedUpPiece;
				pickedUpPiece.representation.style.left = pickedUpPiece.square.coordinates.x + "px";
				pickedUpPiece.representation.style.top = pickedUpPiece.square.coordinates.y + "px";
				if (promoted){
					pickedUpPiece.type = 0;
					if (pickedUpPiece.color == Piece.WHITE)
						pickedUpPiece.representation.setAttribute("src", "images/wpawn.png");
					else
						pickedUpPiece.representation.setAttribute("src", "images/bpawn.png");
				}
			}
			else if (ep)
				capture (pickedUpPiece, squares[pickedUpPiece.square.column - 1][pickedUpPiece.square.row - ((pickedUpPiece.color == Piece.WHITE) ? 2 : 0)].piece, oldSquare, true);
			else
				capture(pickedUpPiece, pickedUpPiece.square.piece, oldSquare, false);
		}
		else{
			var li = document.createElement("li");
			pickedUpPiece.square.piece = pickedUpPiece;
			pickedUpPiece.representation.style.left = pickedUpPiece.square.coordinates.x + "px";
			pickedUpPiece.representation.style.top = pickedUpPiece.square.coordinates.y + "px";
			turn = (turn) ? false : true;
			if (!pickedUpPiece.hasMoved && pickedUpPiece.type == Piece.KING && (pickedUpPiece.square.column == 7 || pickedUpPiece.square.column == 3)){
				if (pickedUpPiece.square.column == 3){			//Queenside Castle
					if (pickedUpPiece.color == Piece.WHITE){
						wr1.square.pickedUpPiece = null;
						wr1.square = squares[3][0];
						wr1.square.pickedUpPiece = wr1;
						wr1.hasMoved = true;
						wr1.representation.style.left = wr1.square.coordinates.x + "px";
						wr1.representation.style.top = wr1.square.coordinates.y + "px";
						li.innerHTML = "0-0-0";
					}
					else if (pickedUpPiece.color == Piece.BLACK){
						br1.square.pickedUpPiece = null;
						br1.square = squares[3][7];
						br1.square.pickedUpPiece = br1;
						br1.hasMoved = true;
						br1.representation.style.left = br1.square.coordinates.x + "px";
						br1.representation.style.top = br1.square.coordinates.y + "px";
						li.innerHTML = "0-0-0";
					}
				}
				if (pickedUpPiece.square.column == 7){			//Kingside Castle
					if (pickedUpPiece.color == Piece.WHITE){
						wr2.square.pickedUpPiece = null;
						wr2.square = squares[5][0];
						wr2.square.pickedUpPiece = wr2;
						wr2.hasMoved = true;
						wr2.representation.style.left = wr2.square.coordinates.x + "px";
						wr2.representation.style.top = wr2.square.coordinates.y + "px";
						li.innerHTML = "0-0";
					}
					else if (pickedUpPiece.color == Piece.BLACK){
						br2.square.pickedUpPiece = null;
						br2.square = squares[5][7];
						br2.square.pickedUpPiece = br2;
						br2.hasMoved = true;
						br2.representation.style.left = br2.square.coordinates.x + "px";
						br2.representation.style.top = br2.square.coordinates.y + "px";
						li.innerHTML = "0-0";
					}
				}
			}
			else{
				switch (pickedUpPiece.type){
				case 0:
					li.innerHTML = "";
					break;
				case 1:
					li.innerHTML = "N";
					break;
				case 2:
					li.innerHTML = "B";
					break;
				case 3:
					li.innerHTML = "R";
					break;
				case 4:
					li.innerHTML = "Q";
					break;
				case 5:
					li.innerHTML = "K";
					break;
				}
				li.innerHTML += String.fromCharCode(96 + pickedUpPiece.square.column);
				li.innerHTML += pickedUpPiece.square.row;
			}
			if (pickedUpPiece.type == Piece.PAWN && Math.abs(pickedUpPiece.square.row - oldSquare.row) != 1){
				if ((pickedUpPiece.square.column > 1) 
						&& squares[pickedUpPiece.square.column - 2][pickedUpPiece.square.row - 1].piece != null
						&& squares[pickedUpPiece.square.column - 2][pickedUpPiece.square.row - 1].piece.color != pickedUpPiece.color
						&& squares[pickedUpPiece.square.column - 2][pickedUpPiece.square.row - 1].piece.type == Piece.PAWN)
					squares[pickedUpPiece.square.column - 2][pickedUpPiece.square.row - 1].piece.epright = true;
				if ((pickedUpPiece.square.column < 7) 
						&& squares[pickedUpPiece.square.column][pickedUpPiece.square.row - 1].piece != null
						&& squares[pickedUpPiece.square.column][pickedUpPiece.square.row - 1].piece.color != pickedUpPiece.color 
						&& squares[pickedUpPiece.square.column][pickedUpPiece.square.row - 1].piece.type == Piece.PAWN)
					squares[pickedUpPiece.square.column][pickedUpPiece.square.row - 1].piece.epleft = true;
			}
			pickedUpPiece.hasMoved = true;
			var tempCheck = (check ? true : false);
			if (check)
				tryCheckmate(Math.abs(pickedUpPiece.color - 1));
			check = tempCheck;
			if (checkmate)
				li.innerHTML += "#";
			else if (check)
				li.innerHTML += "+";
			listValidMoves(Piece.WHITE);
			listValidMoves(Piece.BLACK);
			(pickedUpPiece.color == Piece.WHITE) ? whiteList.appendChild(li) : blackList.appendChild(li);
			if (computerPlaysBlack && pickedUpPiece.color == Piece.WHITE)
				computerMove();
			else if (computerPlaysWhite && pickedUpPiece.color == Piece.BLACK)
				computerMove();
		}
	}
	else{
		pickedUpPiece.square = oldSquare;
		pickedUpPiece.square.piece = pickedUpPiece;
		pickedUpPiece.representation.style.left = pickedUpPiece.square.coordinates.x + "px";
		pickedUpPiece.representation.style.top = pickedUpPiece.square.coordinates.y + "px";
		if (promoted){
			pickedUpPiece.type = 0;
			if (pickedUpPiece.color == Piece.WHITE)
				pickedUpPiece.representation.setAttribute("src", "images/wpawn.png");
			else
				pickedUpPiece.representation.setAttribute("src", "images/bpawn.png");
		}
	}
	
}

function capture(winner, loser, from, ep){
	var li = document.createElement("li");
	switch (winner.type){
	case 0:
		li.innerHTML += String.fromCharCode(96 + from.column);
		li.innerHTML += from.row;
		break;
	case 1:
		li.innerHTML = "N";
		break;
	case 2:
		li.innerHTML = "B";
		break;
	case 3:
		li.innerHTML = "R";
		break;
	case 4:
		li.innerHTML = "Q";
		break;
	case 5:
		li.innerHTML = "K";
		break;
	}
	li.innerHTML += "x";
	li.innerHTML += String.fromCharCode(96 + loser.square.column);
	li.innerHTML += loser.square.row;
	if (ep)
		li.innerHTML += "ep";
	loser.square.piece = null;
	loser.square = null;
	document.body.removeChild(loser.representation);
	if (loser.color == Piece.WHITE)
		whitePieces.remove(loser);
	else
		blackPieces.remove(loser);
	winner.square.piece = winner;
	winner.representation.style.left = winner.square.coordinates.x + "px";
	winner.representation.style.top = winner.square.coordinates.y + "px";
	winner.hasMoved = true;
	turn = (turn) ? false : true;
	listValidMoves(Piece.WHITE);
	listValidMoves(Piece.BLACK);
	var tempCheck = (check ? true : false);
	if (check)
		tryCheckmate(Math.abs(winner.color - 1));
	check = tempCheck;
	if (checkmate)
		li.innerHTML += "#";
	else if (check)
		li.innerHTML += "+";
	(pickedUpPiece.color == Piece.WHITE) ? whiteList.appendChild(li) : blackList.appendChild(li);
	if (computerPlaysBlack && pickedUpPiece.color == Piece.WHITE)
		computerMove();
	else if (computerPlaysWhite && pickedUpPiece.color == Piece.BLACK)
		computerMove();
}

function checkValidMove(piece, square, tryCheck){
	piece.updateMoves();
	
	if (piece.available[square.column - 1][square.row - 1] > 0){
		var oldSquare = piece.square;
		var oldPiece = square.piece;
		
		piece.square = square;
		square.piece = piece;
		oldSquare.piece = null;
		
		if (finalize(piece.color, tryCheck))
			return true;
		else{
			piece.square.piece = oldPiece;
			piece.square = oldSquare;
			oldSquare.piece = piece;
			finalize(piece.color, false);
			return false;
		}
	}
	else
		return false;
}

function finalize(color, tryCheck){
	
	wkavail = wk.available[wk.square.column - 1][wk.square.row - 1];
	bkavail = bk.available[bk.square.column - 1][bk.square.row - 1];
	
	/* Figure out all the squares available to all the pieces now that the move has been made */
	var node = whitePieces.head;
	while (node != null){
		node.contents.updateMoves();
		if (color == Piece.WHITE && node.contents.piece != null){
			node.contents.piece.epleft = false;
			node.contents.piece.epright = false;
		}
		node = node.next;
	}
	node = blackPieces.head;
	while (node != null){
		node.contents.updateMoves();
		if (color == Piece.BLACK && node.contents.piece != null){
			node.contents.piece.epleft = false;
			node.contents.piece.epright = false;
		}
		node = node.next;
	}
	
	if (tryCheck){
		check = false;
		checkmate = false;
	}
	
	
	/* Check all the squares available to all the enemy pieces.  If any of them matches the king's square, it's an illegal move. 
	 * Also, if the player is trying to castle, check the blank square as well as the square he/she is trying to move the king to.*/	
	var node = blackPieces.head;
	while (node != null){
		if (((node.contents.available[wk.square.column - 1][wk.square.row - 1] == 2 || node.contents.available[wk.square.column - 1][wk.square.row - 1] == -1) && node.contents.square.piece == node.contents)
		 || ((wkavail == 3) && node.contents.available[5][0] == 2)
		 || ((wkavail == 4) && node.contents.available[3][0] == 2)){
			if (color == Piece.WHITE){
				if (tryCheck)
					console.log("Illegal move:  Check");
				return false;
			}
			else if (tryCheck){
				console.log("White is in check from the piece on " + String.fromCharCode(96 + node.contents.square.column) + node.contents.square.row);
				check = true;
			}					
		}
		node = node.next;
	}
		
	var node = whitePieces.head;
	while (node != null){
		if (((node.contents.available[bk.square.column - 1][bk.square.row - 1] == 2 || node.contents.available[bk.square.column - 1][bk.square.row - 1] == -1) && node.contents.square.piece == node.contents)
		 || ((bkavail == 3) && node.contents.available[5][7] == 2)
		 || ((bkavail == 4) && node.contents.available[3][7] == 2)){
			if (color == Piece.BLACK){
				if (tryCheck)
					console.log("Illegal move:  Check");
				return false;
			}
			else if (tryCheck){
				console.log("Black is in check from the piece on " + String.fromCharCode(96 + node.contents.square.column) + node.contents.square.row);
				check = true;
			}
		}
		node = node.next;
	}
	
	return true;
}

function tryCheckmate(color){
	checkmate = false;
	if (color == Piece.WHITE){
		listValidMoves(Piece.WHITE);
		if (whiteMoves.head == null){
			checkmate = true;
		}
	}
	else{
		listValidMoves(Piece.BLACK);
		if (blackMoves.head == null){
			checkmate = true;
		}
	}
	if (checkmate){
		computerPlaysBlack = false;
		computerPlaysWhite = false;
	}
}

function printTestTable(piece){
	for (var i = 7; i >= 0; i--){
		console.log(piece.available[0][i] + " " + piece.available[1][i] + " " + piece.available[2][i] + " " + piece.available[3][i] + " " + piece.available[4][i] + " " + piece.available[5][i] + " " + piece.available[6][i] + " " + piece.available[7][i]);
	}
}

function computerMove(){
	if (!turn){
		listValidMoves(Piece.BLACK);
		var randomMoveSteps = Math.floor(Math.random() * blackMoves.length);
		var node = blackMoves.head;
		if (node != null){
			while (randomMoveSteps != 0){
				node = node.next;
				randomMoveSteps--;
			}
			pickedUpPiece = node.contents.piece;
			movePiece(node.contents.square);
		}
	}
	else{
		listValidMoves(Piece.WHITE);
		var randomMoveSteps = Math.floor(Math.random() * whiteMoves.length);
		var node = whiteMoves.head;
		if (node != null){
			while (randomMoveSteps != 0){
				node = node.next;
				randomMoveSteps--;
			}
			pickedUpPiece = node.contents.piece;
			movePiece(node.contents.square);
		}
	}
}


/* Draw the board in the browser */

var board = document.createElement("table");
board.setAttribute("width", "400px");
board.setAttribute("height", "400px");
board.style.borderSpacing = 0;
board.style.borderCollapse = true;
for (var i = 1; i <= 8; i++){
	var row = document.createElement("tr");
	board.appendChild(row);
	for (var j = 1; j <= 8; j++){
		var cell = document.createElement("td");
		row.appendChild(cell);
		cell.style.borderWidth = "0px";
		if ((i + j) % 2 == 0)
			cell.style.backgroundColor = "rgb(0, 0, 0)";
		else
			cell.style.backgroundColor = "rgb(230, 230, 230)";
	}
}
board.style.position = "absolute";
board.style.left = "0px";
board.style.top = "0px";
document.body.appendChild(board);

var moves_container = document.createElement("div");
moves_container.setAttribute("width", "200px");
moves_container.style.position = "absolute";
moves_container.style.left = "400px";
moves_container.style.top = "0px";
var whiteList = document.createElement("ol");
whiteList.style.position = "absolute";
whiteList.style.left = "0px";
whiteList.setAttribute("width", "100px");
var blackList = document.createElement("ul");
blackList.style.listStyleType = "none";
blackList.style.position = "absolute";
blackList.style.left = "100px";
blackList.setAttribute("width", "100px");

moves_container.appendChild(whiteList);
moves_container.appendChild(blackList);
document.body.appendChild(moves_container);

var blackButton = document.createElement("button");
blackButton.innerHTML = "Black computer is on";
blackButton.onclick = function(){
	if (computerPlaysBlack){
		blackButton.innerHTML = "Black computer is off";
		computerPlaysBlack = false;
	}
	else{
		blackButton.innerHTML = "Black computer is on";
		computerPlaysBlack = true;
		if (!turn) computerMove();
	}
};
blackButton.style.position = "absolute";
blackButton.setAttribute("width", "200px");
blackButton.style.left = "600px";
document.body.appendChild(blackButton);

var whiteButton = document.createElement("button");
whiteButton.innerHTML = "White computer is off";
whiteButton.onclick = function(){
	if (computerPlaysWhite){
		whiteButton.innerHTML = "White computer is off";
		computerPlaysWhite = false;
	}
	else{
		whiteButton.innerHTML = "White computer is on";
		computerPlaysWhite = true;
		if (turn) computerMove();
	}
};
whiteButton.style.position = "absolute";
whiteButton.setAttribute("width", "200px");
whiteButton.style.left = "800px";
document.body.appendChild(whiteButton);

/*  Initialize all the image elements for the pieces, put the pieces in them, and set the board up properly */

var pieceImages = [];

var img_wp1 = document.createElement("img");
var img_wp2 = document.createElement("img");
var img_wp3 = document.createElement("img");
var img_wp4 = document.createElement("img");
var img_wp5 = document.createElement("img");
var img_wp6 = document.createElement("img");
var img_wp7 = document.createElement("img");
var img_wp8 = document.createElement("img");
var img_wn1 = document.createElement("img");
var img_wn2 = document.createElement("img");
var img_wb1 = document.createElement("img");
var img_wb2 = document.createElement("img");
var img_wr1 = document.createElement("img");
var img_wr2 = document.createElement("img");
var img_wq = document.createElement("img");
var img_wk = document.createElement("img");

var img_bp1 = document.createElement("img");
var img_bp2 = document.createElement("img");
var img_bp3 = document.createElement("img");
var img_bp4 = document.createElement("img");
var img_bp5 = document.createElement("img");
var img_bp6 = document.createElement("img");
var img_bp7 = document.createElement("img");
var img_bp8 = document.createElement("img");
var img_bn1 = document.createElement("img");
var img_bn2 = document.createElement("img");
var img_bb1 = document.createElement("img");
var img_bb2 = document.createElement("img");
var img_br1 = document.createElement("img");
var img_br2 = document.createElement("img");
var img_bq = document.createElement("img");
var img_bk = document.createElement("img");

pieceImages.push(img_wp1, img_wp2, img_wp3, img_wp4, img_wp5, img_wp6, img_wp7, img_wp8,
				 img_wn1, img_wn2, img_wb1, img_wb2, img_wr1, img_wr2, img_wq, img_wk,
				 img_bp1, img_bp2, img_bp3, img_bp4, img_bp5, img_bp6, img_bp7, img_bp8,
				 img_bn1, img_bn2, img_bb1, img_bb2, img_br1, img_br2, img_bq, img_bk);

for (var i = 0; i < 32; i++){
	if (i < 8)
		pieceImages[i].setAttribute("src", "images/wpawn.png");
	else if (i < 10)
		pieceImages[i].setAttribute("src", "images/wknight.png");
	else if (i < 12)
		pieceImages[i].setAttribute("src", "images/wbishop.png");
	else if (i < 14)
		pieceImages[i].setAttribute("src", "images/wrook.png");
	else if (i == 14)
		pieceImages[i].setAttribute("src", "images/wqueen.png");
	else if (i == 15)
		pieceImages[i].setAttribute("src", "images/wking.png");
	else if (i < 24)
		pieceImages[i].setAttribute("src", "images/bpawn.png");
	else if (i < 26)
		pieceImages[i].setAttribute("src", "images/bknight.png");
	else if (i < 28)
		pieceImages[i].setAttribute("src", "images/bbishop.png");
	else if (i < 30)
		pieceImages[i].setAttribute("src", "images/brook.png");
	else if (i == 30)
		pieceImages[i].setAttribute("src", "images/bqueen.png");
	else if (i == 31)
		pieceImages[i].setAttribute("src", "images/bking.png");
	pieceImages[i].setAttribute("width", "50px");
	pieceImages[i].setAttribute("height", "50px");
	pieceImages[i].style.position = "absolute";
	if (Math.floor(i / 8) % 2 == 0)
		pieceImages[i].style.left = 50 * (i % 8) + "px";
	else
		switch (i % 8){
		case 0:
			pieceImages[i].style.left = "50px";
			break;
		case 1:
			pieceImages[i].style.left = "300px";
			break;
		case 2:
			pieceImages[i].style.left = "100px";
			break;
		case 3:
			pieceImages[i].style.left = "250px";
			break;
		case 4:
			pieceImages[i].style.left = "0px";
			break;
		case 5:
			pieceImages[i].style.left = "350px";
			break;
		case 6:
			pieceImages[i].style.left = "150px";
			break;
		case 7:
			pieceImages[i].style.left = "200px";
			break;
		}
	if (i < 8)
		pieceImages[i].style.top = "300px";
	else if (i < 16)
		pieceImages[i].style.top = "350px";
	else if (i < 24)
		pieceImages[i].style.top = "50px";
	else
		pieceImages[i].style.top = "0px";
	document.body.appendChild(pieceImages[i]);
}

/*  Define all the squares */

var a1 = new Square(1, 1);
var a2 = new Square(1, 2);
var a3 = new Square(1, 3);
var a4 = new Square(1, 4);
var a5 = new Square(1, 5);
var a6 = new Square(1, 6);
var a7 = new Square(1, 7);
var a8 = new Square(1, 8);

var b1 = new Square(2, 1);
var b2 = new Square(2, 2);
var b3 = new Square(2, 3);
var b4 = new Square(2, 4);
var b5 = new Square(2, 5);
var b6 = new Square(2, 6);
var b7 = new Square(2, 7);
var b8 = new Square(2, 8);

var c1 = new Square(3, 1);
var c2 = new Square(3, 2);
var c3 = new Square(3, 3);
var c4 = new Square(3, 4);
var c5 = new Square(3, 5);
var c6 = new Square(3, 6);
var c7 = new Square(3, 7);
var c8 = new Square(3, 8);

var d1 = new Square(4, 1);
var d2 = new Square(4, 2);
var d3 = new Square(4, 3);
var d4 = new Square(4, 4);
var d5 = new Square(4, 5);
var d6 = new Square(4, 6);
var d7 = new Square(4, 7);
var d8 = new Square(4, 8);

var e1 = new Square(5, 1);
var e2 = new Square(5, 2);
var e3 = new Square(5, 3);
var e4 = new Square(5, 4);
var e5 = new Square(5, 5);
var e6 = new Square(5, 6);
var e7 = new Square(5, 7);
var e8 = new Square(5, 8);

var f1 = new Square(6, 1);
var f2 = new Square(6, 2);
var f3 = new Square(6, 3);
var f4 = new Square(6, 4);
var f5 = new Square(6, 5);
var f6 = new Square(6, 6);
var f7 = new Square(6, 7);
var f8 = new Square(6, 8);

var g1 = new Square(7, 1);
var g2 = new Square(7, 2);
var g3 = new Square(7, 3);
var g4 = new Square(7, 4);
var g5 = new Square(7, 5);
var g6 = new Square(7, 6);
var g7 = new Square(7, 7);
var g8 = new Square(7, 8);

var h1 = new Square(8, 1);
var h2 = new Square(8, 2);
var h3 = new Square(8, 3);
var h4 = new Square(8, 4);
var h5 = new Square(8, 5);
var h6 = new Square(8, 6);
var h7 = new Square(8, 7);
var h8 = new Square(8, 8);

var squares = [
		[a1, a2, a3, a4, a5, a6, a7, a8],
		[b1, b2, b3, b4, b5, b6 ,b7, b8],
		[c1, c2, c3, c4, c5, c6, c7, c8],
		[d1, d2, d3, d4, d5, d6, d7, d8],
		[e1, e2, e3, e4, e5, e6, e7, e8],
		[f1, f2, f3, f4, f5, f6, f7, f8],
		[g1, g2, g3, g4, g5, g6, g7, g8],
		[h1, h2, h3, h4, h5, h6, h7, h8]
];

var wp1 = new Piece(Piece.WHITE, Piece.PAWN, img_wp1, a2);
a2.piece = wp1;
var wp2 = new Piece(Piece.WHITE, Piece.PAWN, img_wp2, b2);
b2.piece = wp2;
var wp3 = new Piece(Piece.WHITE, Piece.PAWN, img_wp3, c2);
c2.piece = wp3;
var wp4 = new Piece(Piece.WHITE, Piece.PAWN, img_wp4, d2);
d2.piece = wp4;
var wp5 = new Piece(Piece.WHITE, Piece.PAWN, img_wp5, e2);
e2.piece = wp5;
var wp6 = new Piece(Piece.WHITE, Piece.PAWN, img_wp6, f2);
f2.piece = wp6;
var wp7 = new Piece(Piece.WHITE, Piece.PAWN, img_wp7, g2);
g2.piece = wp7;
var wp8 = new Piece(Piece.WHITE, Piece.PAWN, img_wp8, h2);
h2.piece = wp8;
var wr1 = new Piece(Piece.WHITE, Piece.ROOK, img_wr1, a1);
a1.piece = wr1;
var wn1 = new Piece(Piece.WHITE, Piece.KNIGHT, img_wn1, b1);
b1.piece = wn1;
var wb1 = new Piece(Piece.WHITE, Piece.BISHOP, img_wb1, c1);
c1.piece = wb1;
var wq = new Piece(Piece.WHITE, Piece.QUEEN, img_wq, d1);
d1.piece = wq;
var wk = new Piece(Piece.WHITE, Piece.KING, img_wk, e1);
e1.piece = wk;
var wb2 = new Piece(Piece.WHITE, Piece.BISHOP, img_wb2, f1);
f1.piece = wb2;
var wn2 = new Piece(Piece.WHITE, Piece.KNIGHT, img_wn2, g1);
g1.piece = wn2;
var wr2 = new Piece(Piece.WHITE, Piece.ROOK, img_wr2, h1);
h1.piece = wr2;

var bp1 = new Piece(Piece.BLACK, Piece.PAWN, img_bp1, a7);
a7.piece = bp1;
var bp2 = new Piece(Piece.BLACK, Piece.PAWN, img_bp2, b7);
b7.piece = bp2;
var bp3 = new Piece(Piece.BLACK, Piece.PAWN, img_bp3, c7);
c7.piece = bp3;
var bp4 = new Piece(Piece.BLACK, Piece.PAWN, img_bp4, d7);
d7.piece = bp4;
var bp5 = new Piece(Piece.BLACK, Piece.PAWN, img_bp5, e7);
e7.piece = bp5;
var bp6 = new Piece(Piece.BLACK, Piece.PAWN, img_bp6, f7);
f7.piece = bp6;
var bp7 = new Piece(Piece.BLACK, Piece.PAWN, img_bp7, g7);
g7.piece = bp7;
var bp8 = new Piece(Piece.BLACK, Piece.PAWN, img_bp8, h7);
h7.piece = bp8;
var br1 = new Piece(Piece.BLACK, Piece.ROOK, img_br1, a8);
a8.piece = br1;
var bn1 = new Piece(Piece.BLACK, Piece.KNIGHT, img_bn1, b8);
b8.piece = bn1;
var bb1 = new Piece(Piece.BLACK, Piece.BISHOP, img_bb1, c8);
c8.piece = bb1;
var bq = new Piece(Piece.BLACK, Piece.QUEEN, img_bq, d8);
d8.piece = bq;
var bk = new Piece(Piece.BLACK, Piece.KING, img_bk, e8);
e8.piece = bk;
var bb2 = new Piece(Piece.BLACK, Piece.BISHOP, img_bb2, f8);
f8.piece = bb2;
var bn2 = new Piece(Piece.BLACK, Piece.KNIGHT, img_bn2, g8);
g8.piece = bn2;
var br2 = new Piece(Piece.BLACK, Piece.ROOK, img_br2, h8);
h8.piece = br2;

var whitePieces = new LinkedList();
var blackPieces = new LinkedList();

whitePieces.add(wp1);
whitePieces.add(wp2);
whitePieces.add(wp3);
whitePieces.add(wp4);
whitePieces.add(wp5);
whitePieces.add(wp6);
whitePieces.add(wp7);
whitePieces.add(wp8);
whitePieces.add(wr1);
whitePieces.add(wr2);
whitePieces.add(wn1);
whitePieces.add(wn2);
whitePieces.add(wb1);
whitePieces.add(wb2);
whitePieces.add(wq);
whitePieces.add(wk);

blackPieces.add(bp1);
blackPieces.add(bp2);
blackPieces.add(bp3);
blackPieces.add(bp4);
blackPieces.add(bp5);
blackPieces.add(bp6);
blackPieces.add(bp7);
blackPieces.add(bp8);
blackPieces.add(br1);
blackPieces.add(br2);
blackPieces.add(bn1);
blackPieces.add(bn2);
blackPieces.add(bb1);
blackPieces.add(bb2);
blackPieces.add(bq);
blackPieces.add(bk);

var whiteMoves = new LinkedList(null);
var blackMoves = new LinkedList(null);

listValidMoves(Piece.WHITE);
listValidMoves(Piece.BLACK);

function listValidMoves(color){
	if (color == Piece.WHITE){
		window.whiteMoves = new LinkedList(null);
		pieceNode = whitePieces.head;
		while (pieceNode != null){
			for (var i = 0; i < 8; i++){
				for (var j = 0; j < 8; j++){
					oldPiece = squares[i][j].piece;
					oldSquare = pieceNode.contents.square;
					if (checkValidMove(pieceNode.contents, squares[i][j], false)){
						if (window.whiteMoves.head == null){
							window.whiteMoves.head = new LLNode(null, {piece: pieceNode.contents, square: squares[i][j]}, null);
							window.whiteMoves.tail = window.whiteMoves.head;
							window.whiteMoves.length = 1;
						}
						else
							window.whiteMoves.add({piece: pieceNode.contents, square: squares[i][j]});
					}
					squares[i][j].piece = oldPiece;
					pieceNode.contents.square = oldSquare;
					pieceNode.contents.square.piece = pieceNode.contents;
				}
			}
			pieceNode = pieceNode.next;
		}
	}
	else if (color == Piece.BLACK){
		window.blackMoves = new LinkedList(null);
		pieceNode = blackPieces.head;
		while (pieceNode != null){
			for (var i = 0; i < 8; i++){
				for (var j = 0; j < 8; j++){
					oldPiece = squares[i][j].piece;
					oldSquare = pieceNode.contents.square;
					if (checkValidMove(pieceNode.contents, squares[i][j], false)){
						if (window.blackMoves.head == null){
							window.blackMoves.head = new LLNode(null, {piece: pieceNode.contents, square: squares[i][j]}, null);
							window.blackMoves.tail = window.blackMoves.head;
							window.blackMoves.length = 1;
						}
						else
							window.blackMoves.add({piece: pieceNode.contents, square: squares[i][j]});
					}
					squares[i][j].piece = oldPiece;
					pieceNode.contents.square = oldSquare;
					pieceNode.contents.square.piece = pieceNode.contents;
				}
			}
			pieceNode = pieceNode.next;
		}
	}
}
