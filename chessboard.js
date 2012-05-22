/*  Piece class declaration */

function Piece(color, type, obj, square){
	
	this.type = type;
	this.color = color;
	
	this.hasMoved = false;
	
	this.square = square;
	square.piece = this;
	
	this.representation = obj;
	
	this.representation.addEventListener("click", function(e){
		var x = e.pageX;
		var y = e.pageY;
		var column = (Math.floor(x / 50) + 1);
		var row = 8 - (Math.floor(y / 50));
		var sq = squares[(column - 1)][(row - 1)];
		var pc = sq.piece;
		alert(pc.color + " " + pc.type + ": " + pc.square.column + " " + pc.square.row);
	}, false);
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
	
	this.coordinates = {
			x : (8 - row) * 50,
			y : (column - 1) * 50
	};
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
