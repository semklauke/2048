// !! Test File welches sich aus der Warteschlage automatisch neue Configuration läd und diese durchtestet !!

// Moduel laden (mysql für config laden und ergbniss wegschriebn)
var fs = require('fs');
var mysql = require('mysql2');
//Modell und Controller einbinden (view nicht benötigt) #ist ein ekeliger hack, funktioniert aber 
eval(fs.readFileSync('../js/board.js')+'');
eval(fs.readFileSync('../js/ai.js')+'');

var _board = null;
var _nMove;
var _ai;
var _counter = 100;
var _infos;

// Verbindung zum Datenbank server (passwort)
var _connection = mysql.createConnection({host:'vps.semklauke.de', user: '2048project', password: '2017#2048#sqlPassword', database: '2048'});

function computerMove() {
	_board.addRandomPiece();
	_board.playerMoved = false;
}

function testRandome() {
	_board = new Board();
	computerMove();computerMove();

	_ai = new RandomAI(_board);

	while (true) {
		_nMove = _ai.fullRandom();
		if (_board.moveBoard(_nMove.x, _nMove.y)) {
				computerMove();
		} else {
			break;
		}
	}

	_infos = [
		10001,
		7,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];


	for (var x=0; x<4; x++) {
	for (var y=0; y<4; y++) {
	
		var p = _board.pieces[x][y];
		if (p == null || p == undefined)
			continue;
		else
			_infos[(getPieceLvl(p)+1)] += 1;
	
	}}

	_connection.query('INSERT INTO finished_runs VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', _infos, function(err3, result3, fields3){
		if (_counter >= 0) {
			_counter--;
 			testRandome();
		} else
		_connection.end();

	});

}

//testRandome();



function testCircle() {
	_board = new Board();
	computerMove();computerMove();

	_ai = new RandomAI(_board);

	while (true) {
		_nMove = _ai.circle();
		if (_board.moveBoard(_nMove.x, _nMove.y)) {
				computerMove();
		} else {
			break;
		}
	}

	_infos = [
		10002,
		7,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];


	for (var x=0; x<4; x++) {
	for (var y=0; y<4; y++) {
	
		var p = _board.pieces[x][y];
		if (p == null || p == undefined)
			continue;
		else
			_infos[(getPieceLvl(p)+1)] += 1;
	
	}}

	_connection.query('INSERT INTO finished_runs VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', _infos, function(err3, result3, fields3){
		if (_counter >= 0) {
			_counter--;
 			testCircle();
		} else
		
		_connection.end();
	});

}

//testCircle();





