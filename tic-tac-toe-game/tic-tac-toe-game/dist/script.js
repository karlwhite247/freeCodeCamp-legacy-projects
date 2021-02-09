const blocks = document.querySelectorAll("#blocks-con > div");
let board = new Array(9).fill(0);
let ai = [1, "O"]; // [Player id, Symbol]
let user = [2, "X"];
let firstChoice = true;

const winCombos = [
  [0, 4, 8],
  [2, 4, 6], // Diagonal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Horizontal
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8] // Vertical
];

const x = document.querySelector("#x");
const o = document.querySelector("#o");
x.addEventListener("click", x_or_o);
o.addEventListener("click", x_or_o);

/* O & X Selection function
==============================================================================*/
function x_or_o() {
  if (this.id === "x") {
    user[1] = "X";
    ai[1] = "O";
    o.classList.remove("xo_active");
    this.classList.add("xo_active");
    reset();
  } else {
    user[1] = "O";
    ai[1] = "X";
    x.classList.remove("xo_active");
    this.classList.add("xo_active");
    reset();
    aiIntialChoice();
  }
}

function addBlocksEventsHandler() {
  blocks.forEach((block) => block.addEventListener("click", blockEvents));
}

function blockEvents() {
  let blockNumber = this.getAttribute("data-blockNumber");
  update(this, blockNumber);
}

addBlocksEventsHandler();

/* Blocks listeners removal function (Used for board reset)
==============================================================================*/
function removeBlocksEventsHandler() {
  blocks.forEach((block) => block.removeEventListener("click", blockEvents));
}

/* Update board function
==============================================================================*/
function update(block, number) {
  block.removeEventListener("click", blockEvents);
  board[number] = user[0];
  block.innerHTML = user[1];
  boardResult(user[0]);
  return firstChoice ? aiIntialChoice() : aiThink(board);
}

/* Board Result Checker
==============================================================================*/
/** @function boardResult(player)
 * Take a @param player as an argument and loop through @const winCombos
 * to determine if a winning combination occurred.
 *
 * If a @const winCombos element had a full house (counter === 3), remove blocks events
 * to prevent further gameplay and trigger the winning  'ceremony'.
 */
function boardResult(player) {
  for (let i = 0; i < winCombos.length; i++) {
    let counter = 0;
    for (let j = 0; j < winCombos[i].length; j++) {
      if (board[winCombos[i][j]] !== player) {
        break; // Early break as a mismatch found
      } else {
        counter++;
      }
    }
    if (counter === 3) {
      removeBlocksEventsHandler();
      return ceremony(winCombos[i]);
    }
  }
}
const ceremony = (combo) => {
  combo.forEach((winningBlock) => blocks[winningBlock].classList.add("win"));
};

/* Board Reset (Returns everything to its original state)
==============================================================================*/
function reset() {
  firstChoice = true;
  board = new Array(9).fill(0);
  blocks.forEach((block) => {
    block.classList.remove("win");
    block.innerHTML = "";
  });
  removeBlocksEventsHandler();
  addBlocksEventsHandler();
  if (ai[1] === "X") {
    aiIntialChoice();
  }
}
const resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", reset);

/* Initial AI choice function: (performance boost compared to using minimax first)
==============================================================================*/
function aiIntialChoice() {
  if (ai[1] === "O") {
    const choice = board[4] === 0 ? 4 : 2;
    board[choice] = ai[0];
    blocks[choice].innerHTML = ai[1];
    blocks[choice].removeEventListener("click", blockEvents);
  } else {
    board[6] = ai[0];
    blocks[6].innerHTML = ai[1];
    blocks[6].removeEventListener("click", blockEvents);
  }
  firstChoice = false;
}

/* Artificial Intelligence functionality
==============================================================================*/
function aiThink(currentBoard) {
  let choicesLeft = choiceFinder(board).length;
  if (choicesLeft === 0) {
    return false;
  }
  function choiceFinder(board) {
    let choicesLeft = [];
    board.forEach((block, index) => {
      if (block === 0) {
        choicesLeft.push(index);
      }
    });
    return choicesLeft;
  }
  /** @function boardState(board)
   *  Returns an integer:
   *    +10 = user lost
   *    -10 = user won
   *      0 = tie or neutral board state
   */
  function boardState(board) {
    for (let i = 0; i < winCombos.length; i++) {
      let score = [0, 0]; // [ai,user]
      for (let j = 0; j < winCombos[i].length; j++) {
        if (board[winCombos[i][j]] === 0) {
          break; // Out of loop as a mismatch found
        } else if (board[winCombos[i][j]] === ai[0]) {
          score[0]++;
        } else {
          score[1]++;
        }
      } // End of [j]
      if (score[0] === 3) {
        return 10;
      } else if (score[1] === 3) {
        return -10;
      }
    } // End of [i]
    return 0; // No winning combinations found.
  }

  /* U-minimax (see comment below) algorithm to find the best choice for ai
  ==============================================================================*/
  /** @function [u-]minimax(currentBoard,turn)
   *  My minimax explanation took about 60 lines (~100 columns each).
   *  So Wiki is a good start: https://en.wikipedia.org/wiki/Minimax
   *
   * NOTE:
   *  The minimax algorithm I implemented is not the same as the standard one.
   *  It is an algorithm I created to make a 'realistic' use of the stack. It
   *  climbs down from the stack like a "real" human (by assesing each value)
   *  instead of creating external (i.e. ±infinity) values to find the best move.
   */
  function minimax(currentBoard, turn) {
    let depth = choiceFinder(currentBoard).length; // Track stack depth

    function recursion(board, turn, choiceMade) {
      let choicesLeft = choiceFinder(board);
      let nextTurn = turn === ai[0] ? user[0] : ai[0];
      let state = boardState(board);

      if (choicesLeft.length === 0 || state !== 0) {
        return state;
      } else {
        let childValues = choicesLeft
          .map((choice) => {
            let nextBoard = [...board];
            nextBoard[choice] = turn;
            let nextBoardState = recursion(nextBoard, nextTurn);
            return [choice, nextBoardState];
          })
          .sort((a, b) => b[1] - a[1]);

        if (depth !== choicesLeft.length) {
          return turn === ai[0]
            ? childValues[0][1]
            : childValues[childValues.length - 1][1];
        } else {
          return childValues[0][0];
        }
      } // else
    } // recursion
    return recursion(currentBoard, turn);
  } // minimax

  let aiChoice = minimax(currentBoard, ai[0]);
  board[aiChoice] = ai[0];
  blocks[aiChoice].innerHTML = ai[1];
  blocks[aiChoice].removeEventListener("click", blockEvents);
  return boardResult(ai[0]);
}