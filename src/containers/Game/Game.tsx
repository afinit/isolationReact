import * as React from 'react';
import {range, flatten, includes} from 'lodash';

import Board from '../Board/Board';
import { calculateLegalMoves } from '../../common/util';


interface GameProps {
  boardSize: number;
}

interface GameState {
  squares: Array<string>;
  p1IsNext: boolean;
  lastMove?: number;
  legalMoves: Array<number>;
}

class Game extends React.Component<GameProps> {

  constructor(props: GameProps) {
    super(props);
    this.boardSize = props.boardSize;
    this.state = {
      squares: (Array<string>(this.boardSize * this.boardSize) as any).fill(null),
      p1IsNext: true,
      legalMoves: range(0, this.boardSize * this.boardSize),
    }
  }

  squarePixels = 34;
  minGameWidth = 320;

  boardSize: number;
  
  state: GameState;

  handleClick(i: number) {
    const squares = this.state.squares.slice();
    const p1IsNext = this.state.p1IsNext;
    const lastMove = this.state.lastMove;
    const legalMovesFlat = flatten(this.state.legalMoves);

    if (!includes(legalMovesFlat, i)) return;

    if (lastMove !== undefined) {
      squares[lastMove] = "#";
    }

    squares[i] = "ø";
    this.setState({
      squares: squares,
      p1IsNext: !p1IsNext,
      lastMove: i,
      legalMoves: calculateLegalMoves(squares, i, this.boardSize),
    })
  }

  render() {
    const squares = this.state.squares;
    let status;
    if (flatten(this.state.legalMoves).length !== 0) {
      status = "Next Move: " + (this.state.p1IsNext ? "P1" : "P2");
    } else {
      status = "Winner: " + (this.state.p1IsNext ? "P2" : "P1");
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