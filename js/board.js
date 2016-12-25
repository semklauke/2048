function newPiece(v, m) {
	return {
		value: parseInt(v),
		merged: !!m,
	};
}

function Board(index) {
	this.pieces = [];

	if (index == undefined || index == true) 
		for (var x=0; x<4; x++) {
			this.pieces[x] = [];
			for (var y=0; y<4; y++)
				this.pieces[x][y] = null;
		}
	
	this.playerMoved = false;
}

Board.prototype.addPiece = function (cord, piece) {
	this.pieces[cord.x][cord.y] = piece;
}

Board.prototype.removePiece = function (cord) {
	this.pieces[cord.x][cord.y] = null;
}


Board.prototype.onBoard = function (piece) {
	if (piece.x < 0 || piece.x > 3)
		return false;
	if (piece.y < 0 || piece.y > 3)
		return false;
	return true;
};

Board.prototype.getPiece = function(piece) {
	if (this.onBoard(piece))
		return this.pieces[piece.x][piece.y];
	else 
		return null;
};

Board.prototype.freePiece = function(piece) {
	if (this.getPiece(piece) == null)
		return true;
	else return false;
};

Board.prototype.updatePosistion = function(oPiece, nPiece) {
	this.addPiece(nPiece, this.getPiece(oPiece));
	this.removePiece(oPiece);
};

Board.prototype.copy = function() {
	var newBoard = new Board(false);
	for (var x=0; x<4; x++) {
		newBoard.pieces[x] = this.pieces[x].slice();
	}
	return newBoard;
};

Board.prototype.clearMerge = function() {
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			if (this.pieces[x][y] != null)
				this.pieces[x][y].merged = false;
};

Board.prototype.freePieces = function() {
	var ps = [];
	for (var x=0; x<4; x++) 
		for (var y=0; y<4; y++) 
			if (this.getPiece({ x: x, y: y }) == null)
				ps.push({ x: x, y: y });
	return ps;
};

Board.prototype.moveBoard = function(x, y, uiMove) {
	/* 	
		up: 	 0 /  1
		down: 	 0 / -1
		left: 	-1 /  0
		right:   1 /  0
	*/

	var moved = false;

	if (this.playerMoved == true)
		return moved;

	var pathX = x != 1 ? [0, 1, 2, 3] : [3, 2, 1, 0];
	var pathY = y != 1 ? [0, 1, 2, 3] : [3, 2, 1, 0];

	xloop:
	for (var xM=0; xM<4; xM++) {
		yloop:
		for (var yM=0; yM<4; yM++) {

			var cords = { x: pathX[xM], y: pathY[yM] };
			var oldPos = { x: pathX[xM], y: pathY[yM] };
			//console.log(cords);

			var piece = this.getPiece(cords);

			if (piece == null)
				continue yloop;

			var newPos;

			posloop:
			while (true) {
				cords.x += x;
				cords.y += y;

				if (!this.onBoard(cords)) {
					newPos = { 
						pos: { x: cords.x - x, y: cords.y - y },
						next: null 
					};
					break posloop;
				}
				
				if (!this.freePiece(cords)) {
					newPos = { 
						pos: { x: cords.x - x, y: cords.y - y },
						next: this.getPiece(cords),
						nextPos: cords 
					};
					break posloop;
				}
			}


			if (newPos.next != null && !newPos.next.merged && newPos.next.value == piece.value) {
				this.addPiece(newPos.nextPos, newPiece(piece.value * 2, true));
				this.removePiece(oldPos);
				moved = true;
				if (uiMove !== undefined) 
					uiMove(oldPos, newPos.nextPos, true);
			} else if (oldPos.x != newPos.pos.x || oldPos.y != newPos.pos.y) {
				this.updatePosistion(oldPos, newPos.pos);
				moved = true;
				if (uiMove !== undefined)
					uiMove(oldPos, newPos.pos, false);
			}

			
			
		}
	}
	//console.log(_board.pieces);
	this.playerMoved = true;
	this.clearMerge();
	return moved;

};


Board.prototype.addRandomPiece = function() {
	var p = newPiece(Math.random() < 0.9 ? 2 : 4);

	var free = [];
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			if (this.pieces[x][y] == null)
				free.push({ x: x, y: y});

	if (free.length == 0)
		return null;
	var cords = free[Math.round(Math.random() * (free.length-1))];
	this.addPiece(cords, p);
	return { pos: cords, value: p.value };
};
