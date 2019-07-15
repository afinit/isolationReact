import { PlayerConfig } from "../components/PlayerConfigForm";
import { SQUARE_PASTMOVE, SQUARE_P1_TOKEN } from "./constants";
import { calculateLegalMoves } from "./util";

export abstract class Game {
  boardSize: number;
  players: PlayerConfig[];
  reviewMode: boolean;

  constructor(boardSize: number, players: PlayerConfig[], reviewMode: boolean) {
    this.boardSize = boardSize;
    this.players = players;
    this.reviewMode = reviewMode;
  }

  abstract copy(): Game;
  abstract getPlayer(): PlayerConfig;
  abstract getBoard(): number[];
  abstract getScore(): number | undefined;
  abstract getPosition(): number | undefined;
  abstract getLegalMoves(): number[];
  abstract endReview(): Game;
  abstract lastMove(): Game;
  abstract nextMove(): Game;
  abstract restartHere(): Game;
  abstract moveScore(i: number, score: number): Game;
  move(i: number) {
    return this.moveScore(i, 0);
  }

  startReview() {
    this.reviewMode = true;
    return this;
  }
}

interface OnePieceHistory {
  squares: number[];
  currPlayerIdx: number;
  currPosition: number | undefined;
}

export class OnePieceGame extends Game {
  private historyIdx: number;
  private history: OnePieceHistory[];
  private scoreHistory: number[];
  private legalMoves: number[];

  constructor(
    boardSize: number,
    players: PlayerConfig[],
    reviewMode: boolean,
    historyIdx: number,
    history: OnePieceHistory[],
    legalMoves: number[],
    scoreHistory: number[]
  ) {
    super(boardSize, players, reviewMode);
    this.historyIdx = historyIdx;
    this.history = history;
    this.legalMoves = legalMoves;
    this.scoreHistory = scoreHistory;
  }

  copy() {
    return new OnePieceGame(
      this.boardSize,
      this.players,
      this.reviewMode,
      this.historyIdx,
      this.history.map(h => {
        return { ...h };
      }),
      this.legalMoves,
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
    return this.history[this.history.length - 1].currPosition;
  }
  getLegalMoves() {
    return this.legalMoves;
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
    gameCopy.history = gameCopy.history.slice(0, gameCopy.historyIdx + 1);
    gameCopy.reviewMode = false;
    gameCopy.legalMoves = calculateLegalMoves(
      gameCopy.getBoard(),
      gameCopy.history[gameCopy.historyIdx].currPosition,
      gameCopy.boardSize
    );
    return gameCopy;
  }

  moveScore(i: number, score: number = 0): Game {
    // FIXME::: COULD USE SOME GUARDS HERE
    const currentHistory = this.history[this.history.length - 1];
    const squaresCopy = currentHistory.squares.slice();
    if (currentHistory.currPosition !== undefined) {
      squaresCopy[currentHistory.currPosition] = SQUARE_PASTMOVE;
    }
    squaresCopy[i] = SQUARE_P1_TOKEN;
    const newState = {
      squares: squaresCopy,
      currPlayerIdx: (currentHistory.currPlayerIdx + 1) % 2,
      currPosition: i
    };

    return new OnePieceGame(
      this.boardSize,
      this.players,
      this.reviewMode,
      this.historyIdx + 1,
      [...this.history, newState],
      calculateLegalMoves(squaresCopy, i, this.boardSize),
      [...this.scoreHistory, score]
    );
  }
}

export function initializeGame(
  boardSize: number,
  players: PlayerConfig[],
  squares: number[],
  startingPlayerIdx: number
) {
  const history = [
    {
      squares,
      currPlayerIdx: startingPlayerIdx,
      currPosition: undefined
    }
  ];
  const reviewMode = false;

  return new OnePieceGame(
    boardSize,
    players,
    reviewMode,
    0,
    history,
    calculateLegalMoves(squares, undefined, boardSize),
    []
  );
}
