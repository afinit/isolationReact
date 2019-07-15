import { Heuristic } from "./heuristic";
import { ScoreState } from "./util";
import { WINNING_SCORE } from "./constants";
import { Game } from "./Game";

// AI METHODS SECTION

function bestScore(moveScores: ScoreState[], maxPlayer: boolean): ScoreState {
  const scores = moveScores.map(o => o.score);
  // maxPlayer wants to maximize the outcome of the decision
  const bestScore = maxPlayer ? Math.max(...scores) : Math.min(...scores);

  return moveScores[scores.indexOf(bestScore)];
}

export function aiAlgorithm(
  game: Game,
  maxPlayer: boolean, 
  endTime: number, 
  depth: number,
  heuristic: Heuristic,
  useAlphaBeta: boolean
): ScoreState {
  const moveScores = game.getLegalMoves().map(
    move => {
      const gameCopy = game.move(move);
      if (useAlphaBeta) {
        // if maxPlayer, then we need to minimize the value of the board for the next move
        return maxPlayer ?
          alphaBetaMin(gameCopy, move, endTime, depth-1, heuristic) :
          alphaBetaMax(gameCopy, move, endTime, depth-1, heuristic);
      }
      else {
        return minimax(gameCopy, move, !maxPlayer, endTime, depth-1, heuristic)
      }
    }
  );

  const score = bestScore(moveScores, maxPlayer);
  return {...score, depth: score.depth !== undefined ? depth - score.depth : undefined};
}
  
// calculate minimax decision for the current state of the board from viewpoint of maxPlayer
//   maxPlayer is the one moving, so current state would be bad for maxPlayer if there are no moves
export function minimax(
  game: Game,
  move: number, 
  maxPlayer: boolean, 
  endTime: number, 
  depth: number,
  heuristic: Heuristic
): ScoreState {
  const legalMoves = game.getLegalMoves();
  if (legalMoves.length === 0) {
    // if there are no moves, this is bad for maxPlayer
    return {score: maxPlayer ? -(WINNING_SCORE + depth) : WINNING_SCORE + depth, pos: move, depth};
  } else if ( depth === 0 || endTime < new Date().getTime() ) {
    return {...heuristic.evaluate(game, move, maxPlayer), depth};
  } else {
    const moveScores = legalMoves.map( newMove => {
      const gameCopy = game.move(newMove);
      return minimax(gameCopy, newMove, !maxPlayer, endTime, depth - 1, heuristic);
    });

    // need to replace move to propagate back the most recent move
    return {...bestScore(moveScores, maxPlayer), pos: move};
  }
}


function alphaBetaMax(
  game: Game,
  move: number,
  endTime: number,
  depth: number,
  heuristic: Heuristic,
  alpha: number = Number.MIN_SAFE_INTEGER,
  beta: number = Number.MAX_SAFE_INTEGER
): ScoreState {
  const legalMoves = game.getLegalMoves();
  if (legalMoves.length === 0) {
    return {score: -(WINNING_SCORE + depth), pos: move, depth};
  } else if (depth === 0 || endTime < new Date().getTime()) {
    return {...heuristic.evaluate(game, move, true), depth};
  } else {
    // default state starts at the move passed
    const startState = {score: Number.MIN_SAFE_INTEGER, pos: move, alpha, beta};
    const bestMove = legalMoves.reduce( (accState, newMove) => {
      if (accState.score >= accState.beta) return accState;
      else {
        const gameCopy = game.move(newMove);
        const retVal = alphaBetaMin(gameCopy, newMove, endTime, depth-1, heuristic, accState.alpha, accState.beta);
        return {...accState, score: retVal.score, pos: newMove, alpha: Math.max(retVal.score, accState.alpha), depth: retVal.depth};
      }
    }, startState)
    return {...bestMove, pos: move}
  }
}

function alphaBetaMin(
  game: Game,
  move: number,
  endTime: number,
  depth: number,
  heuristic: Heuristic,
  alpha: number = Number.MIN_SAFE_INTEGER,
  beta: number = Number.MAX_SAFE_INTEGER
): ScoreState {
  const legalMoves = game.getLegalMoves();
  if (legalMoves.length === 0) {
    return {score: WINNING_SCORE + depth, pos: move, depth};
  } else if (depth === 0 || endTime < new Date().getTime()) {
    return {...heuristic.evaluate(game, move, false), depth};
  } else {
    // default state starts at the move passed
    const startState = {score: Number.MAX_SAFE_INTEGER, pos: move, alpha, beta};
    const bestMove = legalMoves.reduce( (accState, newMove) => {
      if (accState.score <= accState.alpha) return accState;
      else {
        const gameCopy = game.move(newMove);
        const retVal = alphaBetaMax(gameCopy, newMove, endTime, depth-1, heuristic, accState.alpha, accState.beta);
        return {...accState, score: retVal.score, pos: newMove, beta: Math.min(retVal.score, accState.beta), depth: retVal.depth};
      }
    }, startState)
    return {...bestMove, pos: move}
  }
}
