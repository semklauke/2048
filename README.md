# 2048 - AI
This is a copy of the game [2048](https://en.wikipedia.org/wiki/2048_(video_game) "Wikipdeia 2048")
with an basic AI and an testing eviourment.

It was build for a school project as part of my A-Levels ("Abitur" in German) and I got a **B-** for it. Don't ask my why.

## Generell

The game and the AI are build in JavaScript and a bit off CSS and HTML for the UI.
I picked these becasue in HTML it was easy for me to buld an UI.

The AI is opt in. So its easy to write an new AI algrithem and implement it in the game.
You just have to tell the game in witch direction it move next 

### Playing

Open the `index.html` on any browser and play with the arrow keys.
To restart the game, reload the page (sorry, I was lazy)

### Staring the AI

Press on the big gery Button `Start AI` to start the AI anytime in the game

## The UI

The game grind is simply and HTML Table with `divs` in it as pieces. The animations are done by CSS Animations

# `Board`

Board is definded in `js/baord.js`. This "JavaScript Class" handels the logic begind the UI. So ist the representaion of a 2048
grid and stores its pieces with poitions and value.

This in not only used to dispaly the UI, but also for the AI very important.
With Board you can create ans many instances of the game state as you want, that you can also query.
This is really helpfull for the AI, when you want to create game trees (or would binary tree the right therm, I don't know,
I'm still studying)

### Importnat objects

#### Cord-Object
```javascript
{
  x: a,
  y: b,
}
```
- `a` and `b` are integers
- (0,0) is in the upper left corner

#### Piece-Object
```javascript
{
  value: parseInt(v),
	merged: !!m,
	old: null
}
```
- This object represens a piece in the `Board.pieces` array.
- `value` is the Value of the piece (2,4,8,16,...)
- `merged` tells, if the piece was merged this turn _(important, because a piece cant be merged twice a turn)_
- `old` is used for the AI I build. Just delete it/ignore it or use it urlself
- **You can create a new piece via the function** `newPiece(value, merged)` **in** `js/board.js`

### Important attributes of Board

#### pieces
```javascript
Board.pieces
```
- 2D Array which conatins the pices on the board
- When a field is empty the array at this coordinate has the value `null`

#### who's turn is it
```javascript
Board.playerMoved
```
- Bool vaue
- is set to true after the played moved. So by values:
- `true` = computers turn (Adding randome piece)
- `fasle` = user most move

### Important functions of Board

`cord` **is always a Cord-Object**
`piece` **is always a Piece-Object**

```javascript
// add piece to the grid
Board.addPiece(cord, piece);

// remove a piece from the grind
Board.removePiece(cord);

// returns a piece (or null) at cord
Board.getPiece(cord);

// moves a piece from oldCord to newCord
Board.updatePosistion(oldCord, newCord);

// checks if this cord is on the bounds of the grid
Board.onBoard(cord);

// returns the level (or 0) of the piece at cord
Board.getLvl(cord);

// checks, if that cord is free
Board.freePiece(cord);

// sets merged of all pieces to false
Board.clearMerge();

// returns an array with all cooordinates as cord objects with no pieces
Board.freePieces();

// return a new copy of the current Board object (usefull for the AI)
Board.copy();

// add's a randome 2 or 4 piece to a randome localtion on the grid
// return's a object with informations about the new piece:
// { pos: cords, value: v }
Board.addRandomPiece();

// moves the board in x,y direction
//  up:     0  /  1
//  down:   0  / -1
//  left:   -1 /  0
//  right:  1  /  0
// uiMove (function) => uiMove(oldCord, newCord, merged)
// uiMovie is optional
// move() returns true if the move is vaild and false if not
Board.moveBoard(x, y, uiMove);
```


# Adding an AI

Im `js/main.js` the UI is created with an `Board` Object as underling model. So you just need in cereate a object of your AI
(my is located in `js/ai.js`) and ask it in which direction to move next, and then tell it the Board with the call:
```javascript
_board.moveBoard(x ,y , uiMovePiece);
```
`uiMovePiece` is predefined by me

After this call:
```javascript
computerMove();
```

I called my AI recursively, but your mileage may vary.

Oh and keep in mind, the animations for the moving pieces has a duration of **220ms**

# My AI

My AI is a Minimax aproach.
It's creats a binary tree of the diffrent possible turns and with several heristiks it choses the best next move

\* I'm planimg on adding a deeper explanation here later, but if you understand German, take a look an the documentation \*

# Texting Enviourment

In my AI, teher are different heuristic's which evaluete the value of a current grid.
The different heuriscs value are put together to one single heuristics value.
So more importnat heuristcs should have more impact on this single value than less importnat heuristics.

Therefor the heursics are multipled with config values (as I coll them) before they are put together.

So to figure out, which conig values to pick, I need to test them.
I created a MySQL Database, where i scheduled many different configs (a combination of config values) with n numbers of tests.

Then i run Node.JS on diffenren computers (laptop/imac/my vps). The Node.Js programm fetches one configurationa and runes the AI with it.
After is was finished, it uploaded the result to the database.

With a simple PHP file I could look at the differnet configuartion and the results and picked the best on for me


## Can u use this too ?

Of course you can, but i wont explaint it to you. look at teh `tests` folder and figure it out urself.
If you have question, mail me [privat@semklauke.de](mailto://privat@semklauke.de).

If you want to know the database, look at `documentation/Documentation.pdf` at page **17**




