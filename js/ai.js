function AILayer(board) {
	this.board = board.copy();
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
		for (var k = 0; k < len; k++) {
			//minmax
			var minimalPiece = smallestHeuristics[k];
			var nextLevel = new AILayer(this.board);
			nextLevel.board.addPiece(minimalPiece.cords, newPiece(minimalPiece.value));
			nextLevel.board.playerMoved = false;
			
			result = nextLevel.minimax(depth, alpha, maxValue);

			if (result.value < maxValue) {
				maxValue = result.value;
				break;
			}

			if (maxValue <= alpha) {
				console.log("Exit Point 1");
				return { direction: null, value: maxValue };
			}

		}
		return { direction: null, value: maxValue };
		
	} else {
		// PlayerTurn (Max)
		maxValue = alpha;
		//Build Tree
		var directions = getDirections();
		for (var i = 0; i < 4; i++) {
			var dir = directions[i];
			var nextLevel = new AILayer(this.board);
			if (nextLevel.board.moveBoard(dir.x, dir.y)) {

				if (depth == 0)
					result = { direction: dir, value: nextLevel.getHeuristic() };
				else {
					result = nextLevel.minimax(depth-1, maxValue, beta);
				}

				if (result.value > maxValue) {
					maxValue = result.value;
					nextMove = dir;
					break;
				}
				if (maxValue >= beta) {
					console.log("Exit Point 2");
					return { direction: nextMove, value: maxValue };
				}

			}

			
		}
		return { direction: nextMove, value: maxValue };



	} // end player or compter 
	console.log("Exit Point 3");
	return { direction: nextMove, value: maxValue };


};

AILayer.prototype.getHeuristic = function() {
	var heuristics = [
		{ v: this.smoothness(), m: 0.2 },
		{ v: this.monotonic(), m: 0.9 }
	];
	var res = 0;
	for (var i = heuristics.length - 1; i >= 0; i--)
	 	res += parseFloat(heuristics[i].v) * parseFloat(heuristics[i].m);
	console.log("[H]: ", res);
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
					smoothness -= Math.abs(pLvl-nextLvl);	
				}
				

			}
		}

	}} // end X and Y loop

	return smoothness;

};


AILayer.prototype.monotonic = function() {
	var yAxis = { down: 0, up: 0 };
	var xAxis = { left: 0, right: 0 };

	for (var x=0; x<4; x++) {
		var y = 0;
		var nextPiece = y+1;
		while (nextPiece<4) {
			if (nextPiece<4 && this.board.getPiece({x: x, y: nextPiece}) == null) {
				nextPiece++;
			}
			if (nextPiece>=4) { nextPiece--; }
			var cValue = this.board.getLvl({x: x, y: y});
			var nValue = this.board.getLvl({x: x, y: nextPiece});
			if (cValue > nValue)
				yAxis.up += nValue - cValue;
			else if (nValue > cValue)
				yAxis.down += cValue - nValue;
			y = nextPiece;
			nextPiece++;
		}

	}

	for (var y=0; y<4; y++) {
		var x = 0;
		var nextPiece = x+1;
		while (nextPiece<4) {
			if (nextPiece<4 && this.board.getPiece({x: x, y: nextPiece}) == null) {
				nextPiece++;
			}
			if (nextPiece>=4) { nextPiece--; }
			var cValue = this.board.getLvl({x: x, y: y});
			var nValue = this.board.getLvl({x: nextPiece, y: y});
			if (cValue > nValue)
				xAxis.left += nValue - cValue;
			else if (nValue > cValue)
				xAxis.right += cValue - nValue;
			y = nextPiece;
			nextPiece++;
		}
	}

	return Math.max(yAxis.down, yAxis.up) + Math.max(xAxis.left, xAxis.right);
};


function MinimaxAI(board) {
	this.board = board;
}

MinimaxAI.prototype.deepening = function(minTime) {
	var layer = new AILayer(this.board);
	return layer.minimax(10, -10000, 10000);
};

