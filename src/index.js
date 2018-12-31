import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {range, takeWhile, flatten, includes} from 'lodash';


function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
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
          [...Array(boardSize).keys()].map((i) =>
            <div key={"boardRow" + i} className="board-row">
              {
                [...Array(boardSize).keys()].map((j) => this.renderSquare(j + i*boardSize))
              }
            </div>
          )
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.boardSize = props.boardSize;
    this.state = {
      squares: Array(props.boardSize * props.boardSize).fill(null),
      p1IsNext: true,
      lastMove: null,
      legalMoves: range(0, props.boardSize * props.boardSize),
    }
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    const p1IsNext = this.state.p1IsNext;
    const lastMove = this.state.lastMove;
    const legalMovesFlat = flatten(this.state.legalMoves);

    if (!includes(legalMovesFlat, i)) return;

    if (lastMove !== null) {
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
            boardSize={this.props.boardSize}
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

function getLineRange(pos, rangeStop, step) {
  return range(pos, rangeStop, step).slice(1);
}

function filterLineRange(lineRange, squares, extraFilter = () => true) {
  return takeWhile(lineRange, (i) => squares[i] === null && extraFilter(i));
}

function calculateLegalMoves(squares, pos, boardSize) {
  const maxBoardSize = boardSize * boardSize;
  const bs = boardSize;
  const mbs = maxBoardSize;
  const eastLimitFun = (i) => i % bs !== 0;
  const westLimitFun = (i) => i % bs !== bs-1;

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
