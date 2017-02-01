var COUNTER = 20;
function AILayer(board, heuData) {
	this.board = board.copy();
	this.heuristicValues = heuData;
}


AILayer.prototype.minimax = function(depth, alpha, beta) {
	self = this;
	var result;
	var nextMove = -1;
	var maxValue;
	//console.log("HumandTurn: "+!this.board.playerMoved+" || depth: "+depth+" | alpha: "+alpha+" | beta: "+beta);
	//self.board = new Board(); // REMOVE AFETR DEVELOPMENT // AUTOCOMPLET TWEAK

	if (this.board.playerMoved) {
		// ComputerTurn (Min)
		maxValue = beta;
		//all possible pieces
		var frees = this.board.freePieces();
		var positions = [];
		//filter those with the smalles heuristic
		var piece2 = newPiece(2, false);
		var piece4 = newPiece(4, false);

		var heuristics2 = [];
		var heuristics4 = [];

		var smallestHeuristics = [];

		var len = frees.length;
		for (var j = 0; j < len; j++) {
			var cords = frees[j];
			this.board.addPiece(cords, piece2);
			heuristics2.push(this.getHeuristic());
			this.board.addPiece(cords); // overwrites
			heuristics4.push(this.getHeuristic());
			this.board.removePiece(cords);
			positions.push(cords);
		}

		var minHeur = Math.min(
			Math.min.apply(null, heuristics2),
			Math.min.apply(null, heuristics4));

		if (heuristics2.length != heuristics4.length)
			console.log("UNEQUAL ERROR! 2: ", heuristics2.length, " // 4: ", heuristics4.length);

		len = (heuristics2.length + heuristics4.length) / 2;
		for (var i = 0; i < len; i++) {
			if (parseInt(heuristics2[i]) == parseInt(minHeur))
				smallestHeuristics.push({ cords: positions[i], value: 2 });
			if (parseInt(heuristics4[i]) == parseInt(minHeur))
				smallestHeuristics.push({ cords: positions[i], value: 4 });
		}
			

		len = smallestHeuristics.length;
		minloop:
		for (var k = 0; k < len; k++) {
			//minmax
			var minimalPiece = smallestHeuristics[k];
			var nextLevel = new AILayer(this.board, this.heuristicValues);
			nextLevel.board.addPiece(minimalPiece.cords, newPiece(minimalPiece.value));
			nextLevel.board.playerMoved = false;
			
			result = nextLevel.minimax(depth, alpha, maxValue);

			if (result.value < maxValue) {
				maxValue = result.value;
				//continue minloop;
			}

			if (maxValue <= alpha) {
				//console.log("Exit Point 1");
				return { direction: null, value: maxValue };
			}

		}
		return { direction: null, value: maxValue };
		
	} else {
		// PlayerTurn (Max)
		maxValue = alpha;
		//Build Tree
		var directions = getDirections();
		maxloop:
		for (var i = 0; i < 4; i++) {
			var dir = directions[i];
			var nextLevel = new AILayer(this.board, this.heuristicValues);
			if (nextLevel.board.moveBoard(dir.x, dir.y)) {

				if (depth == 0)
					result = { direction: dir, value: nextLevel.getHeuristic() };
				else {
					result = nextLevel.minimax(depth-1, maxValue, beta);
				}

				if (result.value > maxValue) {
					maxValue = result.value;
					nextMove = dir;
					//continue maxloop;
				}
				if (maxValue >= beta) {
					//console.log("Exit Point 2");
					return { direction: nextMove, value: maxValue };
				}

			}

			
		}
		return { direction: nextMove, value: maxValue };



	} // end player or compter 
	//console.log("Exit Point 3");
	return { direction: nextMove, value: maxValue };


};

var NAMES = ["smoothness", "monotonic", "emptyPieces", "highestValue"];

AILayer.prototype.getHeuristic = function() {
	var heuristics = [
		{ v: this.smoothness(), m: this.heuristicValues.smoothness },
		{ v: this.monotonic(), m: this.heuristicValues.monotonic },
		{ v: this.emptyPieces(), m: this.heuristicValues.emptyPieces },
		{ v: this.highestValue(), m: this.heuristicValues.highestValue }
	];
	var res = 0;
	for (var i = heuristics.length - 1; i >= 0; i--) {
	 	res += parseFloat(heuristics[i].v) * parseFloat(heuristics[i].m);
	 	/*if (COUNTER-- > 0) {*/ //console.log("["+NAMES[i]+"] "+heuristics[i].v); //}
	}

	//console.log("[H]: ", res);
	return res;
};

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
					//var netxtLvl = this.board.getLvl(nextPiece.nextPiece);
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


AILayer.prototype.monotonic = function() {
	var up = 0;
	var right = 0;

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

	return ((right * 1.2) + up);
};


AILayer.prototype.emptyPieces = function() {
	var count = this.board.freePieces().length;
	return Math.pow(parseInt(count), 0.7);
};


AILayer.prototype.highestValue = function() {
	var m = { value: 0 };
	var p;
	for (var x=0; x<4; x++) {
	for (var y=0; y<4; y++) {
		p = this.board.getPiece({ x: x, y: y });
		if (p != null)
			m = p.value > m.value ? p : m;
	}}
	return getPieceLvl(m);
};


function MinimaxAI(board, heuData) {
	this.board = board;
	this.heuristicValues = heuData != undefined || heuData != null ? heuData : {
		smoothness: 0.3,
		monotonic: 1.3,
		emptyPieces: 1.0,
		highestValue: 1.0
	};
	//console.log(this.heuristicValues);
}

MinimaxAI.prototype.deepening = function(deep) {
	var layer = new AILayer(this.board, this.heuristicValues);
	if (deep == null || deep == undefined)
		deep = 4
	return layer.minimax(deep, -Infinity, Infinity);
};

