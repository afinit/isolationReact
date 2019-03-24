import {range, takeWhile} from 'lodash';


function getLineRange(pos: number, rangeStop: number, step: number) {
  return range(pos, rangeStop, step).slice(1);
}

function filterLineRange(
  lineRange: Array<number>, 
  squares: Array<string>, 
  extraFilter = (i: number) => true
) {
  return takeWhile(lineRange, (i) => squares[i] === null && extraFilter(i));
}

export function calculateLegalMoves(squares: Array<string>, pos: number, boardSize: number) {
  const maxBoardSize = boardSize * boardSize;
  const bs = boardSize;
  const mbs = maxBoardSize;
  const eastLimitFun = (i: number) => i % bs !== 0;
  const westLimitFun = (i: number) => i % bs !== bs-1;

  const n  = filterLineRange( getLineRange(pos, -1, -bs),   squares);
  const ne = filterLineRange( getLineRange(pos, -1, -(bs-1)), squares, eastLimitFun);
  const e  = filterLineRange( getLineRange(pos, mbs, 1),    squares, eastLimitFun);
  const se = filterLineRange( getLineRange(pos, mbs, bs+1), squares, eastLimitFun);
  const s  = filterLineRange( getLineRange(pos, mbs, bs),   squares);
  const sw = filterLineRange( getLineRange(pos, mbs, bs-1), squares, westLimitFun);
  const w  = filterLineRange( getLineRange(pos, -1, -1),    squares, westLimitFun);
  const nw = filterLineRange( getLineRange(pos, -1, -(bs+1)), squares, westLimitFun);

  return [n, ne, e, se, s, sw, w, nw];
}

function isLegal(squares: Array<string>, pos: number, row: number, boardSize: number) {
  // check row of new pos with mod boardSize
  // check if pos is outside of legal pos
  // return and of both
  return pos >= 0 && pos < boardSize * boardSize && squares[pos] === null && Math.floor(pos / boardSize) == row;
}

function addMove(squares: Array<string>, currPos: number, move: number, boardSize: number, queue: Array<number>, flood: Array<number>) {
  // calc row adjustment for moves that expect a different row from the current
  const rowAdj = move < -1 || move > 1 ? move / Math.abs(move) : 0;
  const newPos = currPos + move;

  if (! flood.includes(newPos) && isLegal(squares, newPos, Math.floor(currPos / boardSize) + rowAdj, boardSize)) {
    queue.unshift(newPos);
    flood.unshift(newPos);
  }
}

export function floodfill(squares: Array<string>, pos: number, boardSize: number) {
  let q = [pos];
  let flood = [pos];
  const moves = [ -boardSize-1, -boardSize, -boardSize + 1, 
                  -1,                       1, 
                  boardSize-1,  boardSize,  boardSize + 1];

  while (q.length > 0) {
    // pull next element
    // loop over all single square moves
      // if move is legal and not in flood
        // add to flood
        // add to q

    const currPos = q[q.length - 1];
    q.pop();
    moves.forEach(d => addMove(squares, currPos, d, boardSize, q, flood));
  }

  flood.shift();

  return flood;
}