import { ScoreState } from "./util";
import { Game } from "./Game";

// SUPPORTING METHODS SECTION
//  NOTE: These heuristics evaluate the state of the board at the beginning of the maxPlayer's turn
//    in other words, this is an evaluation of the current state of the board(squares) from the current position(pos)
const floodfillHeuristicMethod = (game: Game, pos: number, maxPlayer: boolean) => {
  const floodSize = floodfill(game.getBoard(), pos, game.boardSize).length;
  const multiplier = floodSize % 2 === 0 ? 1 : -1;
  const score = multiplier * (game.boardSize - floodSize);
  return maxPlayer ? {score, pos} : {score: -score, pos};
}

const openMovesHeuristicMethod = (game: Game, pos: number, maxPlayer: boolean) => {
  const moves = game.getLegalMoves().length;
  return maxPlayer ? {score: moves, pos} : {score: -moves, pos};
}

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

function floodfill(squares: Array<string>, pos: number, boardSize: number) {
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
  
// HEURISTICS SECTION
export interface Heuristic {
  name: string;
  evaluate: (game: Game, pos: number, maxPlayer: boolean) => ScoreState;
}

export const openMovesHeuristic: Heuristic = {
  name: "OpenMoves",
  evaluate: openMovesHeuristicMethod
}

export const floodfillHeuristic: Heuristic = {
  name: "FloodFill",
  evaluate: floodfillHeuristicMethod
}

const OPENMOVES = "OpenMoves";
const FLOODFILL = "FloodFill";

export type HeuristicValue = "FloodFill" | "OpenMoves";

export const heuristicOptionDictionary = {
  [OPENMOVES]: {
    key: "openmoves",
    text: OPENMOVES,
    value: OPENMOVES,
    heuristic: openMovesHeuristic
  },
  [FLOODFILL]: {
    key: "floodfill",
    text: FLOODFILL,
    value: FLOODFILL,
    heuristic: floodfillHeuristic
  }
};

export const heuristicOptions = Object.values(heuristicOptionDictionary);
