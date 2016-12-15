function AILayer(board) {
	this.board = board.copy() = new Board();
}

AILayer.prototype.getDirections = function() {
	return [
		{ x: 0, y: 1 }, // up
		{ x: 0, y: -1 }, // down
		{ x: -1, y: 0 }, // left 
		{ x: 1, y: 0 } // right
	];
};

AILayer.prototype.minimax = function(depth, alpha, beta) {
	self = this;
	var result;
	var nextMove;
	var maxScore;
	self.board = new Board(); // REMOVE AFETR DEVELOPMENT // AUTOCOMPLET TWEAK

	if (this.board.playerMoved) {
		// ComputerTurn (Min)
		
		//all possible pices
		var frees = this.board.freePieces();
		var positions = [];
		//filter those with the smalles heuristic
		var piece2 = newPiece(2, false);
		var piece4 = newPiece(4, false);

		var heuristics2 = [];
		var heuristics4 = [];

		var smallestHeuristics = [];

		for (var cords in frees) {
			this.board.addPice(cords, piece2);
			heuristics2.push(self.getHeuristic());
			this.board.addPice(cords); // overwrites
			heuristics4.push(self.getHeuristic());
			this.board.removePice(cords);
			positions.push(cords);
		}

		var minHeur = Math.min(
			Math.min.apply(null, heuristics2),
			Math.min.apply(null, heuristics4));

		if (heuristic2.length != heuristics4.length)
			console.log("UNEQUAL ERROR! 2: ", heuristics2.length, " // 4: ", heuristics4.length);

		for (var i = heuristics2.length - 1; i >= 0; i--)
			if (heuristics2[i] == minHeur)
				smallestHeuristics.push({ cords: positions[i], value: 2 });
			if (heuristics4 == minHeur)
				smallestHeuristics.push({ cords: positions[i], value: 4 });

		for (var minimalPiece in smallestHeuristics) {
			//minmax
		}


		
	} else {
		// PlayerTurn (Max)

		//Build Tree
		for (var dir in this.getDirections()) {
			if (self.board.moveBoard(dir.x, dir.y)) {

				if (depth == 0)
					result = { direction: dir, value: self.getHeuristic() };
				else {
					var nextLevel = new AILayer(self.board);
					result = nextLevel.minimax(depth-1, maxScore, beta);
				}

			}

			if (result.value > bestScore) {
				bestScore = result.value;
				nextMove = dir;
			}
			if (bestScore >= beta)
				return { direction: nextMove, value: beta };
		}



	}


};

AILayer.prototype.getHeuristic = function() {
	
	// calc 

	return heuristics = 0;
};


function MinimaxAI(board) {
	this.board = board;
}

MinimaxAI.prototype.deepening = function(minTime) {

};
