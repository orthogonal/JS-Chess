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

