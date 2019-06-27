import {range, takeWhile} from 'lodash';
import { WINNING_SCORE } from './constants';

interface Score {
  score: number;
  pos: number;
}

function getLineRange(pos: number, rangeStop: number, step: number) {
  return range(pos, rangeStop, step).slice(1);
}

function filterLineRange(
  lineRange: Array<number>, 
  squares: Array<string>, 
  extraFilter = (_: number) => true
) {
  return takeWhile(lineRange, (i) => squares[i] === null && extraFilter(i));
}

function calculateQueenMoves(squares: Array<string>, pos: number, boardSize: number) {
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

  return [n, ne, e, se, s, sw, w, nw].flat();
}

export const calculateLegalMoves = calculateQueenMoves;

function isLegal(squares: Array<string>, pos: number, row: number, boardSize: number) {
  // check row of new pos with mod boardSize
  // check if pos is outside of legal pos
  // return and of both
  return pos >= 0 && pos < boardSize * boardSize && squares[pos] === null && Math.floor(pos / boardSize) === row;
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

export function openMovesHeuristic(squares: Array<string>, pos: number, boardSize: number, maxPlayer: boolean) {
  const moves = calculateLegalMoves(squares, pos, boardSize).flat().length;
  return maxPlayer ? {score: moves, pos} : {score: -moves, pos};
}

// calculate minimax decision for the current state of the board from viewpoint of maxPlayer
//   maxPlayer is the one moving, so current state would be bad for maxPlayer if there are no moves
export function minimax(
  squares: Array<string>, 
  legalMoves: Array<number>, 
  boardSize: number, 
  maxPlayer: boolean, 
  endTime: number, 
  depth: number,
  heuristic: (squares: Array<string>, pos: number, boardSize: number, maxPlayer: boolean) => Score
): Score {
  if (legalMoves.length === 0) {
    // if there are no moves, this is bad for maxPlayer
    return {score: maxPlayer ? -(WINNING_SCORE + depth) : WINNING_SCORE + depth, pos: -1};
  }

  const moveScores: Array<{score: number, pos: number}> = legalMoves.map( (move: number) => {
    // collect heuristics if we are at depth limit or time is up.. don't actually need to "move" the piece here for the open moves heuristic because we just want legal moves from the proposed position
    if ( depth === 0 || endTime < new Date().getTime()) {
      return heuristic(squares, move, boardSize, !maxPlayer);
    }
    else {
      const squaresCopy = squares.slice();
      squaresCopy[move] = "t";
      return {score: minimax(squaresCopy, calculateLegalMoves(squaresCopy, move, boardSize).flat(), boardSize, !maxPlayer, endTime, depth - 1, heuristic).score, pos: move}
    }
  })

  const scores = moveScores.map(o => o.score);
  // maxPlayer wants to maximize the outcome of the decision
  const bestScore = maxPlayer ? Math.max(...scores) : Math.min(...scores);

  return moveScores[scores.indexOf(bestScore)];
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
  
export const boundNumber = (num: number, minNum: number, maxNum: number) => {
  let numAdj = minNum;
  if (num > maxNum) numAdj = maxNum
  else if (num > minNum) numAdj = num
  
  return numAdj;
}
