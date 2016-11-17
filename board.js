function newPice(v, m) {
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

Board.prototype.addPice = function (cord, pice) {
	this.pieces[cord.x][cord.y] = pice;
}

Board.prototype.removePice = function (cord) {
	this.pieces[cord.x][cord.y] = null;
}


Board.prototype.onBoard = function (pice) {
	if (pice.x < 0 || pice.x > 3)
		return false;
	if (pice.y < 0 || pice.y > 3)
		return false;
	return true;
};

Board.prototype.getPice = function(pice) {
	if (this.onBoard(pice))
		return this.pieces[pice.x][pice.y];
	else 
		return null;
};

Board.prototype.freePice = function(pice) {
	if (this.getPice(pice) == null)
		return true;
	else return false;
};

Board.prototype.updatePosistion = function(oPice, nPice) {
	this.addPice(nPice, this.getPice(oPice));
	this.removePice(oPice);
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
			this.pieces[x][y].merged = false;
}

Board.prototype.moveBoard = function(x, y) {
	/* 	
		up: 	 0 /  1
		down: 	 0 / -1
		left: 	-1 /  0
		right:   1 /  0
	*/

	var pathX = x != 1 ? [0, 1, 2, 3] : [3, 2, 1, 0];
	var pathY = y != 1 ? [0, 1, 2, 3] : [3, 2, 1, 0];

	xloop:
	for (var xM=0; xM<4; xM++) {
		yloop:
		for (var yM=0; yM<4; yM++) {

			var cords = { x: pathX[xM], y: pathY[yM] };
			//console.log(cords);

			var pice = this.getPice(cords);

			if (pice == null)
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
				
				if (!this.freePice(cords)) {
					newPos = { 
						pos: { x: cords.x - x, y: cords.y - y },
						next: this.getPice(cords),
						nextPos: cords 
					};
					break posloop;
				}
			}


			if (newPos.next != null && !newPos.next.merged && newPos.next.value == pice.value) {
				this.addPice(newPos.nextPos, newPice(pice.value * 2, true));
				this.removePice({ x: pathX[xM], y: pathY[yM] });
			} else {
				this.updatePosistion({ x: pathX[xM], y: pathY[yM] }, newPos.pos);
			}

			this.playerMoved = true;
			
		}
	}


}

var b = new Board();


b.pieces[0][0] = newPice(2, false);
b.pieces[0][1] = newPice(2, false);
b.pieces[0][2] = newPice(2, false);


console.log(b.pieces);

b.moveBoard(0,1);

console.log(b.pieces);
