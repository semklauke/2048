function AILayer(board) {
	this.board = board.copy();
}


AILayer.prototype.minimax = function(depth, alpha, beta) {
	self = this;
	var result;
	var nextMove = -1;
	var maxValue;
	console.log("HumandTurn: "+!this.board.playerMoved+" || depth: "+depth+" | alpha: "+alpha+" | beta: "+beta);
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
			heuristics2.push(self.getHeuristic());
			this.board.addPiece(cords); // overwrites
			heuristics4.push(self.getHeuristic());
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
	
	// calc 
	return Math.round(Math.random() * 200); 
	//return heuristics = 0;
};

AILayer.prototype.smoothness = function() {

	for (var x=0; x<4; x++) {
	for (var y=0; y<4; y++) {

		

		var pLvl = getPieceLvl()

	}} // end X and Y loop

};


function MinimaxAI(board) {
	this.board = board;
}

MinimaxAI.prototype.deepening = function(minTime) {
	var layer = new AILayer(this.board);
	return layer.minimax(10, -10000, 10000);
};

