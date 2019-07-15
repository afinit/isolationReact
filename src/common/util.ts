import { range, takeWhile } from 'lodash';
import { SQUARE_EMPTY } from './constants';

export interface ScoreState {
  score: number;
  pos: number;
  depth?: number;
}

function getLineRange(pos: number, rangeStop: number, step: number) {
  return range(pos, rangeStop, step).slice(1);
}

function filterLineRange(
  lineRange: Array<number>, 
  squares: number[], 
  extraFilter = (_: number) => true
) {
  return takeWhile(lineRange, (i) => squares[i] === SQUARE_EMPTY && extraFilter(i));
}

function calculateQueenMoves(squares: number[], pos: number | undefined, boardSize: number) {
  if (pos === undefined) {
    return range(0, boardSize * boardSize).filter(i => squares[i] === SQUARE_EMPTY);
  }
  else {
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
}

export const calculateLegalMoves = calculateQueenMoves;

export const boundNumber = (num: number, minNum: number, maxNum: number) => {
  let numAdj = minNum;
  if (num > maxNum) numAdj = maxNum
  else if (num > minNum) numAdj = num
  
  return numAdj;
}
