import React, { useState, useEffect } from "react";
import { range, includes } from "lodash";

import Board from "../Board";
import {
  calculateLegalMoves,
  openMovesHeuristic,
  minimax
} from "../../common/util";
import { Link } from "react-router-dom";

import "./index.css";

import { Button } from "semantic-ui-react";
import Rules from "../../components/Rules";
import { PlayerConfig } from "../../components/PlayerConfigForm";

interface GameProps {
  boardSize: number;
  p1: PlayerConfig;
  p2: PlayerConfig;
}

const MINIMAX_DEPTH = 5;
const PASTMOVECHAR = "#";
const CURRENTPOSCHAR = "ø";

const Game = function(props: GameProps) {
  const nextPlayer = (p: PlayerConfig) => p === props.p1 ? props.p2 : props.p1

  const boardSize = props.boardSize;
  const squarePixels = 34;
  const minGameWidth = 320;

  const [squares, setSquares] = useState(
    (Array<string>(boardSize * boardSize) as any).fill(null)
  );
  const [currPlayer, setCurrPlayer] = useState(Math.random() < 0.5 ? props.p1 : props.p2);
  const [legalMoves, setLegalMoves] = useState(range(0, boardSize * boardSize));
  const [lastMove, setLastMove] = useState<number | undefined>(undefined);
  const legalMovesFlat = legalMoves.flat();

  useEffect(() => {
    if (currPlayer.actor === "AI") runAi();
  });

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
      setCurrPlayer(nextPlayer(currPlayer));
      setLastMove(aiMove.pos);
      setLegalMoves(calculateLegalMoves(squaresCopy, aiMove.pos, boardSize));
    }
  };

  const handleClick = function(i: number) {
    if (currPlayer.actor === "Human") {
      const squaresCopy = squares.slice();
      const legalMovesFlat = legalMoves.flat();

      if (!includes(legalMovesFlat, i)) return;

      if (lastMove !== undefined) {
        squaresCopy[lastMove] = PASTMOVECHAR;
      }

      squaresCopy[i] = CURRENTPOSCHAR;

      setSquares(squaresCopy);
      setCurrPlayer(nextPlayer(currPlayer));
      setLastMove(i);
      setLegalMoves(calculateLegalMoves(squares, i, boardSize));
    }
  };

  let status;
  if (legalMoves.flat().length !== 0) {
    status = "Next Move: " + currPlayer.name;
  } else {
    status = "Winner: " + nextPlayer(currPlayer).name;
  }

  const gameWidth = squarePixels * boardSize + 20;

  return (
    <div
      className="game"
      style={{
        width: gameWidth > minGameWidth ? gameWidth : minGameWidth + "px"
      }}
    >
      <h2>The Game of Isolation</h2>
      <Rules />

      <div className="game-info">
        <div>{status}</div>
      </div>
      <div className="game-board">
        <Board
          squares={squares}
          boardSize={boardSize}
          onClick={i => handleClick(i)}
        />
      </div>
      <div className="new-game-button">
        <Button as={Link} to={{ pathname: "/" }}>
          New Game
        </Button>
      </div>
    </div>
  );
};

export default Game;
