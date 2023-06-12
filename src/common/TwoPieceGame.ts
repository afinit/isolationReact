import { PlayerConfig } from "../components/PlayerConfigForm";
import { SQUARE_PASTMOVE, SQUARE_P1_TOKEN, SQUARE_P2_TOKEN } from "./constants";
import { calculateLegalMoves } from "./util";
import { Game } from "./Game";

interface TwoPieceHistory {
  squares: number[];
  currPlayerIdx: number;
  currPosition0: number | undefined;
  currPosition1: number | undefined;
}

function calculateCurrPosition(
  twoPieceHistory: TwoPieceHistory
) {
  if (twoPieceHistory.currPlayerIdx === 0) {
    return twoPieceHistory.currPosition0;
  } else {
    return twoPieceHistory.currPosition1
  }
}

export class TwoPieceGame extends Game {
  private historyIdx: number;
  private history: TwoPieceHistory[];
  private scoreHistory: number[];

  constructor(
    boardSize: number,
    players: PlayerConfig[],
    reviewMode: boolean,
    historyIdx: number,
    history: TwoPieceHistory[],
    scoreHistory: number[]
  ) {
    super(boardSize, players, reviewMode);
    this.historyIdx = historyIdx;
    this.history = history;
    this.scoreHistory = scoreHistory;
  }

  copy() {
    return new TwoPieceGame(
      this.boardSize,
      this.players,
      this.reviewMode,
      this.historyIdx,
      this.history.map(h => {
        return { ...h };
      }),
      this.scoreHistory
    );
  }

  getPlayer() {
    return this.players[this.history[this.historyIdx].currPlayerIdx];
  }
  getBoard() {
    return this.history[this.historyIdx].squares.slice();
  }
  getScore() {
    return this.scoreHistory[this.historyIdx];
  }
  getPosition() {
    const currentHistory = this.history[this.history.length - 1]
    return calculateCurrPosition(currentHistory);
  }
  getLegalMoves() {
    const currPosition = this.getPosition();
    const currentHistory = this.history[this.history.length - 1]
    const legalMoves = calculateLegalMoves(currentHistory.squares, currPosition, this.boardSize)
    return legalMoves;
  }
  endReview() {
    const gameCopy = this.copy();
    gameCopy.historyIdx = this.history.length - 1;
    gameCopy.reviewMode = false;
    return gameCopy;
  }
  lastMove() {
    const gameCopy = this.copy();
    gameCopy.historyIdx = Math.max(0, gameCopy.historyIdx - 1);
    return gameCopy;
  }
  nextMove() {
    const gameCopy = this.copy();
    gameCopy.historyIdx = Math.min(
      gameCopy.historyIdx + 1,
      gameCopy.history.length - 1
    );
    return gameCopy;
  }
  restartHere() {
    const gameCopy = this.copy();
    const newGameHistory = gameCopy.history.slice(0, gameCopy.historyIdx + 1);

    gameCopy.history = newGameHistory;
    gameCopy.reviewMode = false;
    return gameCopy;
  }

  moveScore(i: number, score: number = 0): Game {
    const currentHistory = this.history[this.history.length - 1];
    const squaresCopy = currentHistory.squares.slice();
    const currPosition = calculateCurrPosition(currentHistory);

    if (currPosition !== undefined) {
      squaresCopy[currPosition] = SQUARE_PASTMOVE;
    }

    const currPlayerIdx = currentHistory.currPlayerIdx;
    let currPosition0 = currentHistory.currPosition0;
    let currPosition1 = currentHistory.currPosition1;
    if (currPlayerIdx === 0) {
      squaresCopy[i] = SQUARE_P1_TOKEN;
      currPosition0 = i;
    } else {
      squaresCopy[i] = SQUARE_P2_TOKEN;
      currPosition1 = i;
    }
    const newState = {
      squares: squaresCopy,
      currPlayerIdx: (currPlayerIdx + 1) % 2,
      currPosition0: currPosition0,
      currPosition1: currPosition1
    };

    return new TwoPieceGame(
      this.boardSize,
      this.players,
      this.reviewMode,
      this.historyIdx + 1,
      [...this.history, newState],
      [...this.scoreHistory, score]
    );
  }
}

export function initializeTwoPieceGame(
  boardSize: number,
  players: PlayerConfig[],
  squares: number[],
  startingPlayerIdx: number
) {
  const history = [
    {
      squares,
      currPlayerIdx: startingPlayerIdx,
      currPosition0: undefined,
      currPosition1: undefined
    }
  ];
  const reviewMode = false;

  return new TwoPieceGame(
    boardSize,
    players,
    reviewMode,
    0,
    history,
    []
  );
}