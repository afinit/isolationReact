import React, { useState, useEffect } from 'react';
import {range, flatten, includes} from 'lodash';

import Board from '../Board/Board';
import { calculateLegalMoves, openMovesHeuristic, minimax } from '../../common/util';


interface GameProps {
  boardSize: number;
}

const MINIMAX_DEPTH = 5;
const PASTMOVECHAR = "#";
const CURRENTPOSCHAR = "ø";

const Game = function(props: GameProps) {
  const boardSize = props.boardSize;
  const p1Name = "You";
  const p2Name = "AI";
  const squarePixels = 34;
  const minGameWidth = 320;

  const [squares, setSquares] = useState((Array<string>(boardSize * boardSize) as any).fill(null));
  const [p1IsNext, setP1IsNext] = useState(Math.random() < 0.5);
  const [legalMoves, setLegalMoves] = useState(range(0, boardSize * boardSize));
  const [lastMove, setLastMove] = useState<number | undefined>(undefined);
  const legalMovesFlat = legalMoves.flat();

  useEffect(() => {if (!p1IsNext) runAi()})

  const runAi = async () => {
    const squaresCopy = squares.slice();

    if (legalMovesFlat.length > 0) {
      if (lastMove !== undefined) {
        squaresCopy[lastMove] = PASTMOVECHAR;
      }

      const startTime = new Date().getTime();
      const aiMove = minimax(
        squaresCopy, 
        legalMovesFlat, 
        boardSize, 
        true, 
        new Date().getTime() + 1000, 
        MINIMAX_DEPTH, 
        openMovesHeuristic
      );
      console.log("minimax: ", legalMovesFlat, aiMove);
      console.log("runtime: ", new Date().getTime() - startTime);
        
      squaresCopy[aiMove.pos] = CURRENTPOSCHAR;

      setSquares(squaresCopy);
      setP1IsNext(!p1IsNext);
      setLastMove(aiMove.pos);
      setLegalMoves(calculateLegalMoves(squaresCopy, aiMove.pos, boardSize).flat());
    }
  }

  const handleClick = function(i: number) {
    if (p1IsNext) {
      const squaresCopy = squares.slice();
      const legalMovesFlat = legalMoves.flat();

      if (!includes(legalMovesFlat, i)) return;

      if (lastMove !== undefined) {
        squaresCopy[lastMove] = PASTMOVECHAR;
      }

      squaresCopy[i] = CURRENTPOSCHAR;

      setSquares(squaresCopy);
      setP1IsNext(!p1IsNext);
      setLastMove(i);
      setLegalMoves(calculateLegalMoves(squares, i, boardSize).flat());
    }
  }

  let status;
  if (flatten(legalMoves).length !== 0) {
    status = "Next Move: " + (p1IsNext ? p1Name : p2Name);
  } else {
    status = "Winner: " + (p1IsNext ? p2Name : p1Name);
  };

  const gameWidth = squarePixels * boardSize + 20;

  return(
    <div className="game" style={{width: gameWidth > minGameWidth ? gameWidth : minGameWidth + "px"}}>
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
          boardSize={boardSize}
          onClick={(i) => handleClick(i)}
        />
      </div>
    </div>
  )
}

export default Game;