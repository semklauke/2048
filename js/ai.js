// Konstruktor AILayer klasse -> Beschreibt einen Spielbrett Zustand, hate alle Fuktion um ihn zu bewerten
//-- arguments -- 
// board (obj) => Board Klasse. Aktueller Board zustand der kopeirt wird
// heuData (obj) => Heuristik gewichtungen (multiplikations werte)
//-- return --
// AILayer Klasse (object)
function AILayer(board, heuData) {
	this.board = board.copy(); // nicht das alte Board verändern
	this.heuristicValues = heuData;
	this.groupBoard = [];
	/*
	// Gerüst für groups() funktion. Wird nicht genutzt
	this.groupBoard = [];
	for (var i=0; i<4; i++) {
		var t = [];
		for (var j=0; j<4; j++)
			t.push(false);
		this.groupBoard.push(t);
	}*/
}

// MiniMax algorthmus + alpha/beta puring  Hauptfunktion (siehe Dokumentation)
//-- arguments --
// depth (int) => Baum Ebenne (bei =0 ist der letzte Punkt des Astes erricht und der Heuristik Wert wird ausgegeben)
// alpha (int) => Maximaler Wert in einem Ast, Werte darüber werden abgeschnitten
// beta (int) => Minimaler Wert in einem Ast, Werte darunter werde abegschnitten
//-- return --
// object: -> repräsentiert den nächsten Zug und den Aktuellen alpha oder beta wert im Ast
//   direction (int) (can be null) => aktuell bester Zug (0/1/2/3)
//   maxValue (int) => aktueller beta oder alpha wert
AILayer.prototype.minimax = function(depth, alpha, beta) {
	self = this;
	var result; // return Wert
	var nextMove = -1; // bester Zug
	var maxValue; // alpah oder beta 

	// Ist Computer oder Spieler am Zug
	// (Computer heißt, ein neues, Zufälliges Teil wird hinzugefügt)
	if (this.board.playerMoved) {
		// Computer Zug (Minimale Werte werden versucht zu ereichen)
		// Es werden nur die Zweige weitergeführt mit den kleinsten Heuristik Werten (Performance Boost)
		maxValue = beta;
		var frees = this.board.freePieces(); //alle freien Felder
		var positions = [];
		var piece2 = newPiece(2, false);
		var piece4 = newPiece(4, false);

		var heuristics2 = [];
		var heuristics4 = [];

		var smallestHeuristics = [];

		var len = frees.length;
		for (var j = 0; j < len; j++) {
			var cords = frees[j];
			this.board.addPiece(cords, piece2); // 2er Teil einfügen 
			heuristics2.push(this.getHeuristic()); // Heuristik abspeichern 
			this.board.addPiece(cords, piece4); // 4er Teil einfügen 
			heuristics4.push(this.getHeuristic()); // Heuristik abspeichern 
			this.board.removePiece(cords); // Board reseten
			positions.push(cords);
		}

		var minHeur = Math.min(
			Math.min.apply(null, heuristics2),
			Math.min.apply(null, heuristics4)); // kleinsten Heuristik Wert herausfinden

		if (heuristics2.length != heuristics4.length) // sollte nicht passieren
			console.log("UNEQUAL ERROR! 2: ", heuristics2.length, " // 4: ", heuristics4.length);

		len = heuristics2.length;
		// alle Poitionen sammeln bei den der kleinste Heuristik Wert auftritt
		for (var i = 0; i < len; i++) {
			if (parseInt(heuristics2[i]) == parseInt(minHeur))
				smallestHeuristics.push({ cords: positions[i], value: 2 });
			if (parseInt(heuristics4[i]) == parseInt(minHeur))
				smallestHeuristics.push({ cords: positions[i], value: 4 });
		}

		len = smallestHeuristics.length;
		// min Teil des minimax algorthmus
		minloop:
		for (var k = 0; k < len; k++) {
			//minmax
			var minimalPiece = smallestHeuristics[k];
			// neuen Zweig aufmachen
			var nextLevel = new AILayer(this.board, this.heuristicValues);
			nextLevel.board.addPiece(minimalPiece.cords, newPiece(minimalPiece.value));
			nextLevel.board.playerMoved = false;
			result = nextLevel.minimax(depth, alpha, maxValue); // Ergebnis vom darunter liegendem Baum(Ast)

			// minimalisierung, also wenn neuer wert kleiner ist, alten überschreiben
			if (result.value < maxValue) {
				maxValue = result.value;
			}

			// ist kleiner als Maximaler wert, der Ast kann also verworfen werden da es einen besserne Ast gibt
			if (maxValue <= alpha) {
				return { direction: null, value: maxValue };
			}

		}
		return { direction: null, value: maxValue };
		
	} else {
		// Spieler Zug (Max)
		maxValue = alpha;
		var directions = getDirections();
		// max Teil
		maxloop:
		for (var i = 0; i < 4; i++) {
			var dir = directions[i];
			// Neuen Zweig aufmachen
			var nextLevel = new AILayer(this.board, this.heuristicValues);
			if (nextLevel.board.moveBoard(dir.x, dir.y)) { // machen Richtungen können nicht benutzt werden

				if (depth == 0) // Ende des Astes -> Heuristik ausgeben
					result = { direction: dir, value: nextLevel.getHeuristic() };
				else {
					// ansonsten Baum weiter ein Level runter gehen
					result = nextLevel.minimax(depth-1, maxValue, beta);
				}

				// Neuer Wert Besser also Maximaler Wert, also alten Wert neu setzten. Auch die beste Richtung wird hierbei geändert
				if (result.value > maxValue) {
					maxValue = result.value;
					nextMove = dir;
				}

				// Wert größer als minmaler Wert -> Ast muss nicht weiter geführt werden
				if (maxValue >= beta) {
					return { direction: nextMove, value: maxValue };
				}

			}

			
		} 
		return { direction: nextMove, value: maxValue };

	} // end player or compter 
	return { direction: nextMove, value: maxValue };


};

// Errechnet den Gesamt Heuristik Wert für das aktuelle Board der AILayer Klasse
//-- return --
// heuristik wert (float)
AILayer.prototype.getHeuristic = function() {
	var heuristics = [
		{ v: this.smoothness(), m: this.heuristicValues.smoothness },
		{ v: this.monotonic(), m: this.heuristicValues.monotonic },
		{ v: this.emptyPieces(), m: this.heuristicValues.emptyPieces },
		{ v: this.highestValue(), m: this.heuristicValues.highestValue },
		{ v: this.merges(), m: this.heuristicValues.merges }
		//{ v: this.distance(), m: this.heuristicValues.distance } //hat sich als unbrauchbar herausgestellt
	]; // alle Heuristiken und ihre Muliplikatoren (gewichtungen) berechnen
	var res = 0;
	for (var i = heuristics.length - 1; i >= 0; i--) {
	 	res += parseFloat(heuristics[i].v) * parseFloat(heuristics[i].m);
	}

	//console.log("[H]: ", res);
	return res;
};

// logt alle heurstik Werte und ihre mulitplikatoren des aktuell Boards 
AILayer.prototype.logHeuristics = function() {
	console.log("[smoothness] "+this.smoothness()+" * "+this.heuristicValues.smoothness+" => "+(parseFloat(this.smoothness()*this.heuristicValues.smoothness))+" <= ");
	console.log("[monotonic] "+this.monotonic()+" * "+this.heuristicValues.monotonic+" => "+(parseFloat(this.monotonic()*this.heuristicValues.monotonic))+" <= ");
	console.log("[emptyPieces] "+this.emptyPieces()+" * "+this.heuristicValues.emptyPieces+" => "+(parseFloat(this.emptyPieces()*this.heuristicValues.emptyPieces))+" <= ");
	console.log("[highestValue] "+this.highestValue()+" * "+this.heuristicValues.highestValue+" => "+(parseFloat(this.highestValue()*this.heuristicValues.highestValue))+" <= ");
	//console.log("[groups] => "+this.groups()+" <= ");
	console.log("[merges] "+this.merges()+" * "+this.heuristicValues.merges+" => "+(parseFloat(this.merges()*this.heuristicValues.merges))+" <= ");
	//console.log("[distance] "+this.distance()+" * "+this.heuristicValues.distance+" => "+(parseFloat(this.distance()*this.heuristicValues.distance))+" <= ");
}


// Errechnet die Smoothnes Heuristik (siehe Dokumentation)
//-- return --
// smoothness (int)
AILayer.prototype.smoothness = function() {

	var smoothness = 1;
	var directions = [0, 1];

	for (var x=0; x<4; x++) {
	for (var y=0; y<4; y++) {

		var c = { x: x, y: y };
		if (this.board.getPiece(c) != null) {
			var pLvl = this.board.getLvl(c);

			
			for (var d = 0; d<2; d++) {
				var nextPieceCords = this.board.nextPiece(c, directions[d]);
				var nextPiece = nextPieceCords != null ? this.board.getPiece(nextPieceCords.nextPiece) : null;
				if (nextPiece != null) {
					var nextLvl = getPieceLvl(nextPiece);
					if (nextLvl == pLvl)
						smoothness += pLvl*2;
					else if (nextLvl - pLvl < pLvl - nextLvl)
						smoothness += nextLvl - pLvl;
					else
						smoothness += pLvl - nextLvl;
				}
				

			}
		}

	}} // end X and Y loop

	return smoothness;

};

// Errechnet die Monochromatik Heuristik (siehe Dokumentation)
//-- return --
// monotonic (float)
AILayer.prototype.monotonic = function() {
	var up = 0; //y-achse
	var right = 0; //x-achse
 
 	//jede Spalte
	for (var x=0; x<4; x++) {
		var y = 0;
		var nextY = y+1;
		while (nextY<4) {
			if (this.board.getPiece({ x: x, y: nextY }) == null) {
				nextY++;
				continue;
			}
			var cValue = this.board.getLvl({ x: x, y: y });
			var nValue = this.board.getLvl({ x: x, y: nextY });
			up += nValue - cValue;
			y = nextY;
			nextY++;
		}
		

	}

	//jede Zeile
	for (var y=0; y<4; y++) {
		var x = 0;
		var nextX = x+1;
		while (nextX<4) {
			if (this.board.getPiece({ x: nextX, y: y }) == null) {
				nextX++;
				continue;
			}
			var cValue = this.board.getLvl({ x: x, y: y });
			var nValue = this.board.getLvl({ x: nextX, y: y });
			right += nValue - cValue;
			x = nextX;
			nextX++;
		}
	}

	return ((right *1.05) + up); //x-richtung etwas höher bewerten
};

// Errechnet die Leere Felder als heurstik (siehe Dokumentation)
//-- return --
// leere Felder ^ 0.8 (float)
AILayer.prototype.emptyPieces = function() {
	var count = parseInt(this.board.freePieces().length);
	return Math.pow(parseInt(count), 0.8); // kurve zum ende abflachend. Siehe dokumentation

};

// Errechnet das höchste Level auf dem Feld als Heurstik (siehe Dokumentation)
//-- return --
// highestValue (float)
AILayer.prototype.highestValue = function() {
	var m = { value: 0 };
	var p;
	var mult = 1;
	var c;
	for (var x=0; x<4; x++) {
	for (var y=0; y<4; y++) {
		p = this.board.getPiece({ x: x, y: y });
		if (p != null)
			if (p.value > m.value) {
				m = p;
				c = { x: x, y: y};
			}	
	}}
	// Wert wird erhöht wenn das ho2chste Piece in einer der rechten Recken ist (rechts -> siehe Dokumantation)
	if (c.x == 3 && c.y == 3 || c.x == 3 && c.y == 0)
		mult = 1.6;
	return mult * getPieceLvl(m);
};



//##################################[ NOT IN USE ]##################################\\
// Errechnet die Merges Heuristik (siehe Dokumentation)
//-- result --
// e ^ (merges*0.4) (float)
AILayer.prototype.merges = function() {
	var merge = 0;
	for (var x=0; x<4; x++)
	for (var y=0; y<4; y++) {
		if (this.board.pieces[x][y] != null && this.board.pieces[x][y].merged == true ) {
			var l = this.board.getLvl({ x: x, y: y });
			if (l >= 6) // erst ab Wert 64 (lvl 6)
				merge += Math.pow(Math.E, l*0.4);//immer stärker steigende Kurve -> um so höher der Wert des Pieces, um so höher der merge value
		}
	}
	return merge;
}

//##################################[ NOT IN USE ]##################################\\
// Errechnet die Distanz die Pieces zurücklegen als Heuristik (siehe Dokumentation)
//-- return --
// e ^ (distance traveld * 0.3) -1 (float)
AILayer.prototype.distance = function() {
	var distance = 0;
	for (var x=0; x<4; x++)
	for (var y=0; y<4; y++) {
		if (this.board.pieces[x][y] != null) {
			var cPiece = this.board.pieces[x][y];
			if (cPiece.old != null && cPiece.old != undefined && cPiece.merged == false) {
				var l = this.board.getLvl({ x: x, y: y });
				if (l >= 6) // erst ab Wert 64 (lvl 6)
					distance += (Math.pow(Math.E, l*0.3)-1); //immer stärker steigende Kurve -> um so höher der Wert des Pieces, um so höher der merge value
					//(Math.abs(x - cPiece.old.x) + Math.abs(y - cPiece.old.y) //distance
			}
		}
	}

	return -distance;// soll sich negativ auswirken
}

// Konstruktor für die MinimaxAI klasse. Warper für die AIayer klassen
//-- arguments --
// board (obj) => Board klasse. Spielbrett, welches vom GUI angezeiht wird. Haupt-Spielbrett sozusagen.
//                Die Finalen Spielzüge weerden auf diesem Board ausgeführt
// heuData (obj) (can be undefindet) => Heuristik gewichtungen (multiplikations werte)
//-- return --
// MinimaxAI klasse (object)
function MinimaxAI(board, heuData) {
	this.board = board;
	// wenn keine Heurstik configuration übergebe wird, default (die beset die ich finden konnte) benuzten 
	this.heuristicValues = heuData != undefined || heuData != null ? heuData : {
		smoothness: 0.2,
		monotonic: 1.6,
		emptyPieces: 1.0,
		highestValue: 1.0,
		merges: 0.0,
		distance: 0.0
	};
	//console.log(this.heuristicValues);
}

// Sucht besten Zug für aktuelles Spielbrett (Board)
// Iterativ deepeing ist das zwar nicht, funktiosn name bliebt aber (siehe dokumentation)
//-- arguments --
// deep (int) -> maxumale Baumtiefe für den Alogrthmus
MinimaxAI.prototype.deepening = function(deep) {
	var layer = new AILayer(this.board, this.heuristicValues);
	if (deep == null || deep == undefined)
		deep = 4 // default 4
	return layer.minimax(deep, -Infinity, Infinity);
};


//##################################[ NOT IN USE ]##################################\\
/*
// markiert alle Gruppen an Pieces, ausgeghen von einem Piece. Gebrauch für groups Heurstik. Siehe Dokumantation
//-- arguments --
// cords (cord-object)
// value (int)
AILayer.prototype.markGroups = function(cords, value) {

	var directions = getDirections();

	if (this.board.onBoard(cords) 
		&& this.board.getPiece(cords) != null 
		&& this.board.getPiece(cords).value == value
		&& this.groupBoard[cords.x][cords.y] == false) {

		this.groupBoard[cords.x][cords.y] = true;

		for (var d=0; d<4; d++) {
			this.markGroups({ x: cords.x + directions[d].x, y: cords.y + directions[d].y, value });
		}

	}
};*/

//##################################[ NOT IN USE ]##################################\\
/*
// Errechent die Groups Heuristik (siehe Dokumentation)
//-- return --
// anzahl gruppen (int)
AILayer.prototype.groups = function() {
	var self = this;
	var groups = 0;

	for (var x=0; x<4; x++)
    for (var y=0; y<4; y++) {
    	this.groupBoard[x][y] = false;
    }

    for (var x=0; x<4; x++)
    for (var y=0; y<4; y++) {
    	if (this.board.pieces[x][y] != null && this.groupBoard[x][y] == false) {
    		groups++;
    		this.markGroups({x: x, y: y}, self.board.pieces[x][y].value);
    	}

    }

    return groups;

};
*/
