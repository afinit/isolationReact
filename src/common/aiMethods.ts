import { Heuristic } from "./heuristic";
import { Score, calculateLegalMoves } from "./util";
import { WINNING_SCORE } from "./constants";

// AI METHODS SECTION

function bestScore(moveScores: Score[], maxPlayer: boolean): Score {
  const scores = moveScores.map(o => o.score);
  // maxPlayer wants to maximize the outcome of the decision
  const bestScore = maxPlayer ? Math.max(...scores) : Math.min(...scores);

  return moveScores[scores.indexOf(bestScore)];
}

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
  const moveScores = legalMoves.map(
    move => {
      const squaresCopy = squares.slice();
      squaresCopy[move] = "t";
      return minimax(squaresCopy, move, boardSize, !maxPlayer, endTime, depth-1, heuristic)
    }
  );

  return bestScore(moveScores, maxPlayer);
}
  
// calculate minimax decision for the current state of the board from viewpoint of maxPlayer
//   maxPlayer is the one moving, so current state would be bad for maxPlayer if there are no moves
export function minimax(
  squares: Array<string>, 
  move: number, 
  boardSize: number, 
  maxPlayer: boolean, 
  endTime: number, 
  depth: number,
  heuristic: Heuristic
): Score {
  const legalMoves = calculateLegalMoves(squares, move, boardSize).flat();
  if (legalMoves.length === 0) {
    // if there are no moves, this is bad for maxPlayer
    return {score: maxPlayer ? -(WINNING_SCORE + depth) : WINNING_SCORE + depth, pos: move};
  } else if ( depth === 0 || endTime < new Date().getTime() ) {
    return heuristic.evaluate(squares, move, boardSize, maxPlayer);
  } else {
    const moveScores = legalMoves.map( newMove => {
      const squaresCopy = squares.slice();
      squaresCopy[newMove] = "t";
      return minimax(squaresCopy, newMove, boardSize, !maxPlayer, endTime, depth - 1, heuristic);
    });

    // need to replace move to propagate back the most recent move
    return {...bestScore(moveScores, maxPlayer), pos: move};
  }
}
