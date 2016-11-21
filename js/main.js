var _board;
var _pieceContainer = document.getElementById("pieces");

function newGame() {
    _board = new Board();
    _pieceContainer.innerHTML = "";
    computerMove();computerMove();
    console.log(_board.pieces);
}

function uiAddPiece(cords, value) {
    var uiPiece = document.createElement("div");
    uiPiece.setAttribute("class", pieceClass(cords, value));
    uiPiece.innerHTML = parseInt(value);
    _pieceContainer.appendChild(uiPiece);
}

function cordsClass(cords) {
    return "x"+(cords.x+1)+"-y"+(cords.y+1);
}

function pieceClass(cords, value) {
    return "piece v"+parseInt(value)+" "+cordsClass(cords);
}
var uiMovePiece = function(oldPos, newPos, merged) {
    var oldP = document.getElementsByClassName(cordsClass(oldPos))[0];
    var v = merged ? parseInt(oldP.innerHTML) * 2 : oldP.innerHTML;
    if (merged)
        document.getElementsByClassName(cordsClass(newPos))[0].remove();
    oldP.setAttribute("class", pieceClass(newPos, v));
    oldP.innerHTML = v;
};

function computerMove() {
    var p = _board.addRandomPiece();
    uiAddPiece(p.pos, p.value);
}

document.onkeydown = function(kdevent) {
    switch (kdevent.keyCode) {
        case 37:
            //left
            var m = _board.moveBoard(-1, 0, uiMovePiece);
            setTimeout(computerMove, 220);
            // console.log("left");
            break;
        case 38:
            //up
            var m = _board.moveBoard(0, 1, uiMovePiece);
            setTimeout(computerMove, 220);
            // console.log("up");
            break;
        case 39:
            //right
            var m = _board.moveBoard(1, 0, uiMovePiece);
            setTimeout(computerMove, 220);
            // console.log("right");
            break;
        case 40:
            //down
            var m = _board.moveBoard(0, -1, uiMovePiece);
            setTimeout(computerMove, 220);
            // console.log("down");
            break;
    }
};

newGame();