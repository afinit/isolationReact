import * as React from 'react';
import {range, flatten, includes} from 'lodash';

import Board from '../Board/Board';
import { calculateLegalMoves, openMovesHeuristic, minimax } from '../../common/util';

const MINIMAX_DEPTH = 3;

interface GameProps {
  boardSize: number;
}

interface GameState {
  squares: Array<string>;
  p1Name: string;
  p2Name: string;
  p1IsNext: boolean;
  lastMove?: number;
  legalMoves: Array<number>;
}

const PASTMOVECHAR = "#";
const CURRENTPOSCHAR = "ø";

class Game extends React.Component<GameProps> {

  constructor(props: GameProps) {
    super(props);
    this.boardSize = props.boardSize;
    this.state = {
      squares: (Array<string>(this.boardSize * this.boardSize) as any).fill(null),
      p1Name: "You",
      p2Name: "AI",
      p1IsNext: Math.random() < 0.5,
      legalMoves: range(0, this.boardSize * this.boardSize),
    }
  }

  squarePixels = 34;
  minGameWidth = 320;

  boardSize: number;
  
  state: GameState;

  runAi() {
    const squares = this.state.squares.slice();
    const p1IsNext = this.state.p1IsNext;
    const lastMove = this.state.lastMove;
    const legalMovesFlat = this.state.legalMoves.flat();

    if (legalMovesFlat.length > 0) {
      if (lastMove !== undefined) {
        squares[lastMove] = PASTMOVECHAR;
      }

      const startTime = new Date().getTime();
      const aiMove = minimax(squares, legalMovesFlat, this.boardSize, true, new Date().getTime() + 1000, MINIMAX_DEPTH, openMovesHeuristic);
      console.log("minimax: ", legalMovesFlat, aiMove);
      console.log("runtime: ", new Date().getTime() - startTime);
        
      squares[aiMove.pos] = CURRENTPOSCHAR;

      this.setState({
          squares: squares,
          p1IsNext: !p1IsNext,
          lastMove: aiMove.pos,
          legalMoves: calculateLegalMoves(squares, aiMove.pos, this.boardSize),
      })
    }
  }

  handleClick(i: number) {
    if (this.state.p1IsNext) {
      const squares = this.state.squares.slice();
      const p1IsNext = this.state.p1IsNext;
      const lastMove = this.state.lastMove;
      const legalMovesFlat = this.state.legalMoves.flat();

      if (!includes(legalMovesFlat, i)) return;

      if (lastMove !== undefined) {
        squares[lastMove] = PASTMOVECHAR;
      }

      squares[i] = CURRENTPOSCHAR;

      this.setState({
        squares: squares,
        p1IsNext: !p1IsNext,
        lastMove: i,
        legalMoves: calculateLegalMoves(squares, i, this.boardSize),
      })
    }
  }

  componentDidMount() {
    if ( ! this.state.p1IsNext ) this.runAi();
  }

  componentDidUpdate() {
    if ( ! this.state.p1IsNext ) this.runAi();
  }

  render() {
    const squares = this.state.squares;
    let status;
    if (flatten(this.state.legalMoves).length !== 0) {
      status = "Next Move: " + (this.state.p1IsNext ? this.state.p1Name : this.state.p2Name);
    } else {
      status = "Winner: " + (this.state.p1IsNext ? this.state.p2Name : this.state.p1Name);
    };

    const gameWidth = this.squarePixels * this.boardSize + 20;

    return(
      <div className="game" style={{width: gameWidth > this.minGameWidth ? gameWidth : this.minGameWidth + "px"}}>
        <h2>The Game of Isolation</h2>
        <div className="rules">
          <h3>Rules</h3>
          <ul>
            <li>2 players trade turns moving the game piece (ø)</li>
            <li>The game piece (ø) can be moved like a queen in chess. Horizontally, vertically, diagonally.</li>
            <li>Moves cannot be to or through previous moves, these will be marked as (#)</li>
            <li>First move can go anywhere</li>
            <li>Last player to be able to move wins the game</li>
          </ul>
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
        <div className="game-board">
          <Board
            squares={squares}
            boardSize={this.boardSize}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
      </div>
    )
  }
}

export default Game;