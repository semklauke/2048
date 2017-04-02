var _board;
var _ai;
var _pieceContainer = document.getElementById("pieces"); // Spielbrett
var _aiButton = document.getElementById("ai-button");

// Initaliesiert das Spiel, sowohl GUI als aoch Model
function newGame() {
    _board = new Board();
    _pieceContainer.innerHTML = "";
    computerMove();computerMove(); // 2 Start Pieces stetzen
    console.log(_board.pieces);
}

// Fügt ein Piece in das GUI ein
//-- arguments --
// cords (cord-object) => Koordinaten des Pieces, wo es eingefügt werden soll
// value (int) => Wert des Pieces
function uiAddPiece(cords, value) {
    var uiPiece = document.createElement("div");
    uiPiece.setAttribute("class", pieceClass(cords, value)); // position setzen
    uiPiece.innerHTML = parseInt(value);
    _pieceContainer.appendChild(uiPiece);
}

// Erstellt die CSS Klasse aus einem cord-object
//-- arguments --
// cords (cord-object) => zu konvertierendes cord-object
//-- return --
// (string) => css klasse
function cordsClass(cords) {
    return "x"+(cords.x+1)+"-y"+(cords.y+1);
}

// git alle Heuristiken des aktuellen boards aus.
function logHeuristics() {
    var a = new MinimaxAI(_board);
    var l =  new AILayer(_board, a.heuristicValues);
    l.logHeuristics();
}

// Erstellt die CSS Klasse für ein Piece (Koordinaten und Wert)
//-- arguments --
// cords (cord-object) => cord-object welches konvertiert wird
// value (int) => wert welches zur css klasse konvertiert wird 
//-- return --
// (string) => CSS klasse
function pieceClass(cords, value) {
    return "piece v"+parseInt(value)+" "+cordsClass(cords);
}

// GUI Funktion die ein ein einzeldes Piece verschiebt oder merged.
// Wird an die Board Klasse über moveBoard() übergeben. Bei Spielzug wird jedes Teile einzeln bewegt
//-- arguments --
// oldPos (cord-object) => alte Position des Pieces
// newPos (cord-object) => neue Position (nach dem Spielzug)
// merged (bool) => wird das neue Piece aus 2 zusammen gemerged ?
var uiMovePiece = function(oldPos, newPos, merged) {
    var oldP = document.getElementsByClassName(cordsClass(oldPos))[0];
    var v = merged ? parseInt(oldP.innerHTML) * 2 : oldP.innerHTML; // Wert erhöhen wenn gemerged
    if (merged)
        document.getElementsByClassName(cordsClass(newPos))[0].remove();
    oldP.setAttribute("class", pieceClass(newPos, v)); // animation passiert über css
    oldP.innerHTML = v;
};

// Fügt ein Zufälliges neues Piece ein und Kehrt den Spielzug wieder zum Spieler
function computerMove() {
    var p = _board.addRandomPiece();
    if (p)
        uiAddPiece(p.pos, p.value);
    else
        newGame(); // lose
    _board.playerMoved = false;
}

// Fängt vom Browser Keyboard Events ab. Wird benutzt um die Pfeiltasten abzufangen.
// Je nach richtung wird das der Spielzug in die entsprechende Richtung ausgeführt.
//-- arguments --
// kdevent (obj) => vom Browser
document.onkeydown = function(kdevent) {
    switch (kdevent.keyCode) {
        case 37:
            //left
            if (_board.moveBoard(-1, 0, uiMovePiece))
                setTimeout(computerMove, 220);
            else _board.playerMoved = false;
            break;
        case 38:
            //up
            if (_board.moveBoard(0, 1, uiMovePiece))
                setTimeout(computerMove, 220);
            else _board.playerMoved = false;
            break;
        case 39:
            //right
            if (_board.moveBoard(1, 0, uiMovePiece))
                setTimeout(computerMove, 220);
            else _board.playerMoved = false;
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


//Ai start Knopf EventListener
_aiButton.addEventListener("click", function() {
    _ai = new MinimaxAI(_board); // neue Ai erstellen mit aktuellem Board

    // rekusive funktion um immer wieder den Besten nächsten Zug zu errechnen mit der AI. 
    function bestMove() {
        var res = _ai.bestMove(4); //4 lvl deep
        console.log(res);
        if (res.direction == -1) { // keine Züge mehr möglich, ai gibt -1 zurück
            console.log("result waring: -1");
            alert("Game Over");
        } else if (_board.moveBoard(res.direction.x, res.direction.y, uiMovePiece)) { // nur wenn der zug gültig war
        	// Nach anomation (200ms) neues Piece hinzufügen. 
            setTimeout(function() {
                computerMove();
            }, 220);
            // 40ms nach animation rekusiver Aufruf um neunen Besten zug zu rerechnen
            setTimeout(function() {
                bestMove();
            }, 240)
        } else _board.playerMoved = false;

    }

    bestMove();// rekusion initialisieren

});


newGame(); // Neues Spiel bei laden der seite erstellen