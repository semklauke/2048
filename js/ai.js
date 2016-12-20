function AILayer(board) {
	this.board = board.copy();
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
	var maxValue;
	//self.board = new Board(); // REMOVE AFETR DEVELOPMENT // AUTOCOMPLET TWEAK

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

			result = minimax(depth, alpha, maxValue);

			if (result.value < maxValue)
				maxValue = result.value;

			if (maxValue <= alpha)
				return { direction: null, value: maxValue };

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
					result = nextLevel.minimax(depth-1, maxValue, beta);
				}

			}

			if (result.value > maxValue) {
				maxValue = result.value;
				nextMove = dir;
			}
			if (maxValue >= beta)
				return { direction: nextMove, value: beta };
		}



	} // end player or compter 

	return { direction: nextMove, value: maxValue };


};

AILayer.prototype.getHeuristic = function() {
	
	// calc 
	return Math.round(Math.random() * 200); 
	//return heuristics = 0;
};


function MinimaxAI(board) {
	this.board = board;
}

MinimaxAI.prototype.deepening = function(minTime) {
	var layer = new AILayer(this.board);
	return layer.minimax(10, -10000, 10000);
};

