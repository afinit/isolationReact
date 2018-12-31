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
        <div className="game-board">
          <Board
            squares={squares}
            boardSize={this.props.boardSize}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  <Game boardSize={5}/>,
  document.getElementById('root')
);

function calculateLegalMoves(squares, pos, boardSize) {
  const maxBoardSize = boardSize * boardSize;

  let nw = takeWhile(
    range(pos, -1, -(boardSize+1)).slice(1),
    (i) => (squares[i] === null) && (i % boardSize !== (boardSize-1))
  );

  let n = takeWhile(
    range(pos, -1, -boardSize).slice(1),
    (i) => squares[i] === null
  );

  let ne = takeWhile(
    range(pos, -1, -(boardSize-1)).slice(1),
    (i) => (squares[i] === null) && (i % boardSize !== 0)
  );

  let w = takeWhile(
    range(pos, -1, -1).slice(1),
    (i) => squares[i] === null && i % boardSize !== boardSize - 1
  );

  let e = takeWhile(
    range(pos, maxBoardSize, 1).slice(1),
    (i) => squares[i] === null && i % boardSize !== 0
  );

  let sw = takeWhile(
    range(pos, maxBoardSize, boardSize-1).slice(1),
    (i) => (squares[i] === null) && (i % boardSize !== boardSize-1)
  );

  let s = takeWhile(
    range(pos, maxBoardSize, boardSize).slice(1),
    (i) => squares[i] === null
  );

  let se = takeWhile(
    range(pos, maxBoardSize, boardSize+1).slice(1),
    (i) => (squares[i] === null) && (i % boardSize !== 0)
  );

  return [n, ne, e, se, s, sw, w, nw];
}
