import { PlayerConfig } from "../components/PlayerConfigForm";
import { PASTMOVECHAR, CURRENTPOSCHAR } from "./constants";
import { range } from "lodash";
import { calculateLegalMoves } from "./util";

export abstract class Game {
  boardSize: number;
  players: PlayerConfig[];

  constructor(
    boardSize: number,
    players: PlayerConfig[],
  ) {
    this.boardSize = boardSize;
    this.players = players;
  }

  abstract copy(): Game;
  abstract getPlayer(): PlayerConfig;
  abstract getBoard(): string[];
  abstract getPosition(): number | undefined;
  abstract getLegalMoves(): number[];
  abstract move(i: number): Game;
  
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
    historyIdx: number,
    history: OnePieceHistory[],
    legalMoves: number[]
  ) {
    super(boardSize, players);
    this.historyIdx = historyIdx;
    this.history = history;
    this.legalMoves = legalMoves;
  }

  copy() {
    return new OnePieceGame(
      this.boardSize,
      this.players,
      this.historyIdx,
      this.history.map(h => { return {...h} }),
      this.legalMoves
    )
  }

  getPlayer() { return this.players[this.history[this.history.length - 1].currPlayerIdx]; }
  getBoard() { return this.history[this.history.length - 1].squares.slice(); }
  getPosition() { return this.history[this.history.length - 1].currPosition; }
  getLegalMoves() { return this.legalMoves; }

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
  
  return new OnePieceGame(boardSize, players, 0, history, range(0, boardSize * boardSize));
}
