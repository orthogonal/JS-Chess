/*  Piece class declaration */

function Piece(color, type, obj, square){
	
	this.type = type;
	this.color = color;
	
	this.hasMoved = false;
	
	this.square = square;
	square.piece = this;
	
	this.representation = obj;
}
Piece.WHITE = 0;
Piece.BLACK = 1;

Piece.PAWN = 0;
Piece.KNIGHT = 1;
Piece.BISHOP = 2;
Piece.ROOK = 3;
Piece.QUEEN = 4;
Piece.KING = 5;


/*  Square class declaration */

function Square(column, row){
	this.column = column;
	this.row = row;
	
	this.piece = null;
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

var bp1 = document.createElement("img");
bp1.setAttribute("src", "images/bpawn.png");
bp1.setAttribute("width", "50px");
bp1.setAttribute("height", "50px");
bp1.style.position = "absolute";
bp1.style.top = "100px";
bp1.style.left = "100px";
document.body.appendChild(bp1);

c6 = new Square(3, 6);

bp1Piece = new Piece(Piece.BLACK, Piece.PAWN, bp1, c6);

bp2Piece = new Piece(Piece.WHITE, Piece.KNIGHT, bp1, c6);

