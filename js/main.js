var _board;
var _ai;
var _pieceContainer = document.getElementById("pieces");
var _aiButton = document.getElementById("ai-button");

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

function logHeuristics() {
    var a = new MinimaxAI(_board);
    var l =  new AILayer(_board, a.heuristicValues);
    l.logHeuristics();
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
    if (p)
        uiAddPiece(p.pos, p.value);
    else
        newGame(); // lose
    _board.playerMoved = false;
}

document.onkeydown = function(kdevent) {
    switch (kdevent.keyCode) {
        case 37:
            //left
            if (_board.moveBoard(-1, 0, uiMovePiece))
                setTimeout(computerMove, 220);
            else _board.playerMoved = false;
            // console.log("left");
            break;
        case 38:
            //up
            if (_board.moveBoard(0, 1, uiMovePiece))
                setTimeout(computerMove, 220);
            else _board.playerMoved = false;
            // console.log("up");
            break;
        case 39:
            //right
            if (_board.moveBoard(1, 0, uiMovePiece))
                setTimeout(computerMove, 220);
            else _board.playerMoved = false;
            // console.log("right");
            break;
        case 40:
            //down
            if (_board.moveBoard(0, -1, uiMovePiece))
                setTimeout(computerMove, 220);
            else _board.playerMoved = false;
            // console.log("down");
            break;
    }
};

_aiButton.addEventListener("click", function() {
    _ai = new MinimaxAI(_board);


    function ehy() {
        var res = _ai.deepening(null);
        console.log(res);
        if (res.direction == -1) {
            console.log("res waring");
        } else if (_board.moveBoard(res.direction.x, res.direction.y, uiMovePiece)) {
            setTimeout(function() {
                computerMove();
                
            }, 240);
            setTimeout(function() {
                ehy();
            }, 250)
        } else _board.playerMoved = false;

    }

    ehy();

});



newGame();