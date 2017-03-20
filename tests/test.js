// !! Test File welches sich aus der Warteschlage automatisch neue Configuration läd und diese durchtestet !!

// Moduel laden (mysql für config laden und ergbniss wegschriebn)
var fs = require('fs');
var mysql = require('mysql2');
//Modell und Controller einbinden (view nicht benötigt) #ist ein ekeliger hack, funktioniert aber 
eval(fs.readFileSync('../js/board.js')+'');
eval(fs.readFileSync('../js/ai.js')+'');

// Global vars
const _args = process.argv.slice(2);
var _board = new Board();
var _nMove;
var _configID = null;
var _config = {};
var _versionID = null;
var _priority = null;
var _ai;

var _infos;

// Verbindung zum Datenbank server (passwort)
var _connection = mysql.createConnection({host:'vps.semklauke.de', user: 'sem', password: 'Fortess.11', database: '2048'});
//LOCAL var _connection = mysql.createConnection({host:'127.0.0.1', user: 'root', password: 'root', database: '2048'});

function computerMove() {
	_board.addRandomPiece();
	_board.playerMoved = false;
}

//Spiel vorbereiten
computerMove();computerMove();

// läd nächsten Test aus `scheduled_runs` (evtl. beschrängt auf version)
_connection.query('SELECT * FROM scheduled_runs WHERE versionID = 6 ORDER BY priority DESC, recID ASC LIMIT 1', function (err, result, fields) {
	if (result == undefined || result == null) {
		_connection.end();
		console.log("[2048Test] empty");
		return;
	}
	_configID = parseInt(result[0].configID);
	_versionID = parseInt(result[0].versionID);
	_priority = parseInt(result[0].priority);

	// Angesetzen Test löschen
	_connection.query('DELETE FROM scheduled_runs WHERE recID = ?', [parseInt(result[0].recID)]);

	//config für den Test laden
	_connection.query('SELECT * FROM configs WHERE configID = ?', [_configID], function(err2, result2, fields2){
		var resLength = result2.length;
		for (var i=0; i<resLength; i++) {
			_config[result2[i].name.toString()]=parseFloat(result2[i].value);
		}

		// AI starten mit config
		_ai = new MinimaxAI(_board, _config);

		while (true) {
			_nMove = _ai.deepening(4);
			if (_nMove.direction == -1)
				break;
			if (_board.moveBoard(_nMove.direction.x, _nMove.direction.y)) {
				computerMove();
			} else 
				_board.playerMoved = false;
		}
 		
 		// Array für SQL werte (id, vesrion, wie oft welches Piece a ende exestiert)
		_infos = [
			_configID,
			_versionID,
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

		// ergebniss in die `finished_runs` Tabelle eintragen
		_connection.query('INSERT INTO finished_runs VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', _infos, function(err3, result3, fields3){
			_connection.end();
		});

	});
});