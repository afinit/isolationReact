import { Heuristic } from "./heuristic";
import { Score, calculateLegalMoves } from "./util";
import { WINNING_SCORE } from "./constants";

// AI METHODS SECTION

export function aiAlgorithm(
  squares: Array<string>, 
  legalMoves: Array<number>, 
  boardSize: number, 
  maxPlayer: boolean, 
  endTime: number, 
  depth: number,
  heuristic: Heuristic,
  alphaBeta: boolean
): Score {
    return minimax(squares, legalMoves, boardSize, maxPlayer, endTime, depth, heuristic)
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
  heuristic: Heuristic
): Score {
  if (legalMoves.length === 0) {
    // if there are no moves, this is bad for maxPlayer
    return {score: maxPlayer ? -(WINNING_SCORE + depth) : WINNING_SCORE + depth, pos: -1};
  } else {
    let moveScores: {score: number, pos: number}[] = [];
    if ( depth === 0 || endTime < new Date().getTime() ) {
      moveScores = legalMoves.map( move => heuristic.evaluate(squares, move, boardSize, !maxPlayer));
    } else {
      moveScores = legalMoves.map( move => {
        const squaresCopy = squares.slice();
        squaresCopy[move] = "t";
        const currentLegalMoves = calculateLegalMoves(squaresCopy, move, boardSize).flat();
        return {score: minimax(squaresCopy, currentLegalMoves, boardSize, !maxPlayer, endTime, depth - 1, heuristic).score, pos: move}
      })
    }

    const scores = moveScores.map(o => o.score);
    // maxPlayer wants to maximize the outcome of the decision
    const bestScore = maxPlayer ? Math.max(...scores) : Math.min(...scores);

    return moveScores[scores.indexOf(bestScore)];
  }
}
