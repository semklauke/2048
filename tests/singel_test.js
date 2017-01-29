var fs = require('fs');
eval(fs.readFileSync('../js/board.js')+'');
eval(fs.readFileSync('../js/ai.js')+'');

function logCord(x, y) {
	var v = _board.pieces[x][y] == null ? "    ": "   "+(_board.pieces[x][y]).value;
	return v.substr(-4);
}
var _board = new Board();
var _nMove;

function computerMove() {
	_board.addRandomPiece();
	_board.playerMoved = false;
}

computerMove();computerMove();

var _ai = new MinimaxAI(_board);

while (true) {
	_nMove = _ai.deepening(5);
	if (_nMove.direction == -1)
		break;
	if (_board.moveBoard(_nMove.direction.x, _nMove.direction.y)) {
		computerMove();
	} else 
		_board.playerMoved = false;
} ;

console.log("------------------------------------------");
console.log("["+logCord(0, 3)+"]"+"["+logCord(1, 3)+"]"+"["+logCord(2, 3)+"]"+"["+logCord(3, 3)+"]");
console.log("["+logCord(0, 2)+"]"+"["+logCord(1, 2)+"]"+"["+logCord(2, 2)+"]"+"["+logCord(3, 1)+"]");
console.log("["+logCord(0, 1)+"]"+"["+logCord(1, 1)+"]"+"["+logCord(2, 1)+"]"+"["+logCord(3, 2)+"]");
console.log("["+logCord(0, 0)+"]"+"["+logCord(1, 0)+"]"+"["+logCord(2, 0)+"]"+"["+logCord(3, 0)+"]");