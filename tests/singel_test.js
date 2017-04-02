// !! Wird benutz um 1 Spiel in der commandozeile zu simulieren (mit defaul config) !!
// erspart rechenzeit der GUI

//einbinden der benötigten Controller und Modell Datein (view ist nicht nötig)
var fs = require('fs');
eval(fs.readFileSync('../js/board.js')+'');
eval(fs.readFileSync('../js/ai.js')+'');

// logging funktion für ein Feld (wegen spaceing und so)
//-- argumenst --
// x, y (int) => Koordinaten
//-- return --
// string
function logCord(x, y) {
	var v = _board.pieces[x][y] == null ? "    ": "   "+(_board.pieces[x][y]).value;
	return v.substr(-4);
}

var _board = new Board();
var _nMove;

// zufälliges Piece (2/4) hinzufügen
function computerMove() {
	_board.addRandomPiece();
	_board.playerMoved = false;
}

// Spiel vorbereiten 
computerMove();computerMove();

var _ai = new MinimaxAI(_board);

// ai durchlaufen bis error
while (true) {
	_nMove = _ai.bestMove(4);
	if (_nMove.direction == -1)
		break; // austreigen
	if (_board.moveBoard(_nMove.direction.x, _nMove.direction.y)) {
		computerMove();
	} else 
		_board.playerMoved = false;
} ;

// ergebniss loggen 
console.log("------------------------------------------");
console.log("["+logCord(0, 3)+"]"+"["+logCord(1, 3)+"]"+"["+logCord(2, 3)+"]"+"["+logCord(3, 3)+"]");
console.log("["+logCord(0, 2)+"]"+"["+logCord(1, 2)+"]"+"["+logCord(2, 2)+"]"+"["+logCord(3, 1)+"]");
console.log("["+logCord(0, 1)+"]"+"["+logCord(1, 1)+"]"+"["+logCord(2, 1)+"]"+"["+logCord(3, 2)+"]");
console.log("["+logCord(0, 0)+"]"+"["+logCord(1, 0)+"]"+"["+logCord(2, 0)+"]"+"["+logCord(3, 0)+"]");