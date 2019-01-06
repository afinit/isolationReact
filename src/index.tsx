import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import {range, takeWhile, flatten, includes} from 'lodash';


interface SquareProps {
  value: string;
  onClick(i: React.MouseEvent): void;
}

function Square(props: SquareProps) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

interface BoardProps {
  squares: Array<string>;
  onClick(i: number): void;
  boardSize: number;
}

class Board extends React.Component<BoardProps> {
  constructor(props: BoardProps) {
    super(props);
  }

  renderSquare(i: number) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardSize = this.props.boardSize
    return (
      <div>
        {
          [...(Array<string>(boardSize) as any).keys()].map((i) =>
            <div key={"boardRow" + i} className="board-row">
              {
                [...(Array<string>(boardSize) as any).keys()].map((j) => this.renderSquare(j + i*boardSize))
              }
            </div>
          )
        }
      </div>
    );
  }
}

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

    return(
      <div className="game">
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


ReactDOM.render(
  <Game boardSize={5}/>,
  document.getElementById('root')
);

function getLineRange(pos: number, rangeStop: number, step: number) {
  return range(pos, rangeStop, step).slice(1);
}

function filterLineRange(
  lineRange: Array<number>, 
  squares: Array<string>, 
  extraFilter = (i: number) => true
) {
  return takeWhile(lineRange, (i) => squares[i] === null && extraFilter(i));
}

function calculateLegalMoves(squares: Array<string>, pos: number, boardSize: number) {
  const maxBoardSize = boardSize * boardSize;
  const bs = boardSize;
  const mbs = maxBoardSize;
  const eastLimitFun = (i: number) => i % bs !== 0;
  const westLimitFun = (i: number) => i % bs !== bs-1;

  const n  = filterLineRange( getLineRange(pos, -1, -bs),   squares);
  const ne = filterLineRange( getLineRange(pos, -1, -(bs-1)), squares, eastLimitFun);
  const e  = filterLineRange( getLineRange(pos, mbs, 1),    squares, eastLimitFun);
  const se = filterLineRange( getLineRange(pos, mbs, bs+1), squares, eastLimitFun);
  const s  = filterLineRange( getLineRange(pos, mbs, bs),   squares);
  const sw = filterLineRange( getLineRange(pos, mbs, bs-1), squares, westLimitFun);
  const w  = filterLineRange( getLineRange(pos, -1, -1),    squares, westLimitFun);
  const nw = filterLineRange( getLineRange(pos, -1, -(bs+1)), squares, westLimitFun);

  return [n, ne, e, se, s, sw, w, nw];
}
