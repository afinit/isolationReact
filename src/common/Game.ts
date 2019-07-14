import { PlayerConfig } from "../components/PlayerConfigForm";
import { PASTMOVECHAR, CURRENTPOSCHAR } from "./constants";
import { calculateLegalMoves } from "./util";

export abstract class Game {
  boardSize: number;
  players: PlayerConfig[];
  reviewMode: boolean;

  constructor(
    boardSize: number,
    players: PlayerConfig[],
    reviewMode: boolean
  ) {
    this.boardSize = boardSize;
    this.players = players;
    this.reviewMode = reviewMode;
  }

  abstract copy(): Game;
  abstract getPlayer(): PlayerConfig;
  abstract getBoard(): string[];
  abstract getPosition(): number | undefined;
  abstract getLegalMoves(): number[];
  abstract endReview(): Game;
  abstract lastMove(): Game;
  abstract nextMove(): Game;
  abstract restartHere(): Game;
  abstract move(i: number): Game;
  
  startReview() {
    this.reviewMode = true;
    return this;
  }

}

interface OnePieceHistory {
  squares: string[];
  currPlayerIdx: number;
  currPosition: number | undefined;
}

export class OnePieceGame extends Game {
  private historyIdx: number;
  private history: OnePieceHistory[];
  private legalMoves: number[];

  constructor(
    boardSize: number,
    players: PlayerConfig[],
    reviewMode: boolean,
    historyIdx: number,
    history: OnePieceHistory[],
    legalMoves: number[]
  ) {
    super(boardSize, players, reviewMode);
    this.historyIdx = historyIdx;
    this.history = history;
    this.legalMoves = legalMoves;
  }

  copy() {
    return new OnePieceGame(
      this.boardSize,
      this.players,
      this.reviewMode,
      this.historyIdx,
      this.history.map(h => { return {...h} }),
      this.legalMoves
    )
  }

  getPlayer() { return this.players[this.history[this.historyIdx].currPlayerIdx]; }
  getBoard() { return this.history[this.historyIdx].squares.slice(); }
  getPosition() { return this.history[this.history.length - 1].currPosition; }
  getLegalMoves() { return this.legalMoves; }
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
    gameCopy.historyIdx = Math.min(gameCopy.historyIdx + 1, gameCopy.history.length - 1);
    return gameCopy;
  }
  restartHere() {
    const gameCopy = this.copy();
    gameCopy.history = gameCopy.history.slice(0, gameCopy.historyIdx + 1);
    gameCopy.reviewMode = false;
    gameCopy.legalMoves = calculateLegalMoves(gameCopy.getBoard(), gameCopy.history[gameCopy.historyIdx].currPosition, gameCopy.boardSize);
    return gameCopy;
  }

  move(i: number): Game {
    // FIXME::: COULD USE SOME GUARDS HERE
    const currentHistory = this.history[this.history.length - 1];
    const squaresCopy = currentHistory.squares.slice()
    if (currentHistory.currPosition !== undefined) {
      squaresCopy[currentHistory.currPosition] = PASTMOVECHAR;
    }
    squaresCopy[i] = CURRENTPOSCHAR;
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
      calculateLegalMoves(squaresCopy, i, this.boardSize)
    );
  }
}
  
export function initializeGame(boardSize: number, players: PlayerConfig[], squares: string[], startingPlayerIdx: number) {
  const history = [{
    squares,
    currPlayerIdx: startingPlayerIdx,
    currPosition: undefined
  }];
  const reviewMode = false;

  return new OnePieceGame(boardSize, players, reviewMode, 0, history, calculateLegalMoves(squares, undefined, boardSize));
}
