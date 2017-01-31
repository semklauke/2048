var fs = require('fs');
eval(fs.readFileSync('../js/board.js')+'');
eval(fs.readFileSync('../js/ai.js')+'');

var _board = new Board();
var _nMove;

function computerMove() {
	_board.addRandomPiece();
	_board.playerMoved = false;
}

function logCord(x, y) {
	var v = _board.pieces[x][y] == null ? "    ": "   "+(_board.pieces[x][y]).value;
	return v.substr(-4);
}

computerMove();computerMove();

var _ai = new MinimaxAI(_board);

while (true) {
	_nMove = _ai.deepening(1);
	if (_nMove.direction == -1)
		break;
	if (_board.moveBoard(_nMove.direction.x, _nMove.direction.y)) {
		computerMove();
	} else 
		_board.playerMoved = false;
} ;

var infos = {
	"2": 0,
	"4": 0,
	"8": 0,
	"16": 0,
	"32": 0,
	"64": 0,
	"128": 0,
	"256": 0,
	"512": 0,
	"1024": 0,
	"2048": 0,
	"4096": 0,
	"8192": 0,
	"16384": 0,
	"32768": 0,
	"65536": 0,
};

for (var x=0; x<4; x++) {
for (var y=0; y<4; y++) {

	var p = _board.pieces[x][y];
	if (p == null || p == undefined)
		continue;
	else
		infos[p.value.toString()] += 1;

}}

console.log(infos);
