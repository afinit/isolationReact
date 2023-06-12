import { PlayerConfig } from "../components/PlayerConfigForm";

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
