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
  useAlphaBeta: boolean
): Score {
  const moveScores = legalMoves.map(
    move => {
      const squaresCopy = squares.slice();
      squaresCopy[move] = "t";
      if (useAlphaBeta) {
        // if maxPlayer, then we need to minimize the value of the board for the next move
        return maxPlayer ?
          alphaBetaMin(squaresCopy, move, boardSize, endTime, depth-1, heuristic) :
          alphaBetaMax(squaresCopy, move, boardSize, endTime, depth-1, heuristic);
      }
      else {
        return minimax(squaresCopy, move, boardSize, !maxPlayer, endTime, depth-1, heuristic)
      }
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


function alphaBetaMax(
  squares: string[],
  move: number,
  boardSize: number,
  endTime: number,
  depth: number,
  heuristic: Heuristic,
  alpha: number = Number.MIN_SAFE_INTEGER,
  beta: number = Number.MAX_SAFE_INTEGER
): Score {
  const legalMoves = calculateLegalMoves(squares, move, boardSize).flat();
  if (legalMoves.length === 0) {
    return {score: -(WINNING_SCORE + depth), pos: move};
  } else if (depth === 0 || endTime < new Date().getTime()) {
    return heuristic.evaluate(squares, move, boardSize, true);
  } else {
    // default state starts at the move passed
    const startState = {score: Number.MIN_SAFE_INTEGER, pos: move, alpha, beta};
    const bestMove = legalMoves.reduce( (accState, newMove) => {
      if (accState.score >= accState.beta) return accState;
      else {
        const squaresCopy = squares.slice();
        squaresCopy[newMove] = "t";
        const retVal = alphaBetaMin(squaresCopy, newMove, boardSize, endTime, depth-1, heuristic, accState.alpha, accState.beta);
        return {...accState, score: retVal.score, pos: newMove, alpha: Math.max(retVal.score, accState.alpha)}
      }
    }, startState)
    return {...bestMove, pos: move}
  }
}

function alphaBetaMin(
  squares: string[],
  move: number,
  boardSize: number,
  endTime: number,
  depth: number,
  heuristic: Heuristic,
  alpha: number = Number.MIN_SAFE_INTEGER,
  beta: number = Number.MAX_SAFE_INTEGER
): Score {
  const legalMoves = calculateLegalMoves(squares, move, boardSize).flat();
  if (legalMoves.length === 0) {
    return {score: WINNING_SCORE + depth, pos: move};
  } else if (depth === 0 || endTime < new Date().getTime()) {
    return heuristic.evaluate(squares, move, boardSize, false);
  } else {
    // default state starts at the move passed
    const startState = {score: Number.MAX_SAFE_INTEGER, pos: move, alpha, beta};
    const bestMove = legalMoves.reduce( (accState, newMove) => {
      if (accState.score <= accState.alpha) return accState;
      else {
        const squaresCopy = squares.slice();
        squaresCopy[newMove] = "t";
        const retVal = alphaBetaMax(squaresCopy, newMove, boardSize, endTime, depth-1, heuristic, accState.alpha, accState.beta);
        return {...accState, score: retVal.score, pos: newMove, beta: Math.min(retVal.score, accState.beta)}
      }
    }, startState)
    return {...bestMove, pos: move}
  }
}
