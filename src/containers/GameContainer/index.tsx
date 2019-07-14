import React, { useState, useEffect } from "react";
import { includes } from "lodash";

import Board from "../Board";
import { Link } from "react-router-dom";

import "./index.css";

import { Button } from "semantic-ui-react";
import Rules from "../../components/Rules";
import { PlayerConfig } from "../../components/PlayerConfigForm";
import {
  DEFAULT_MINIMAX_DEPTH,
  DEFAULT_HEURISTIC,
  DEFAULT_ALPHABETA
} from "../../common/constants";
import { aiAlgorithm } from "../../common/aiMethods";
import { Game, initializeGame } from "../../common/Game";

interface GameProps {
  boardSize: number;
  p1: PlayerConfig;
  p2: PlayerConfig;
}

const GameContainer = function(props: GameProps) {
  const nextPlayer = (p: PlayerConfig) =>
    p === props.p1 ? props.p2 : props.p1;

  const boardSize = props.boardSize;
  const squarePixels = 34;
  const minGameWidth = 320;

  const [initGame] = useState(
    initializeGame(
      boardSize, 
      [props.p1, props.p2],
      (Array<string>(boardSize * boardSize) as any).fill(null),
      Math.random() < 0.5 ? 0 : 1
    ) as Game
  );
  const [game, setGame] = useState(initGame);
  const currPlayer: PlayerConfig = game.getPlayer();

  useEffect(() => {
    if (currPlayer.actor === "AI")
      runAi(currPlayer.minimaxDepth || DEFAULT_MINIMAX_DEPTH);
  });

  const runAi = async (minimaxDepth: number) => {
    if (game.getLegalMoves().length > 0) {
      const startTime = new Date().getTime();
      const aiMove = aiAlgorithm(
        game,
        true,
        new Date().getTime() + 1000,
        minimaxDepth,
        currPlayer.heuristic || DEFAULT_HEURISTIC,
        currPlayer.alphaBeta === undefined
          ? DEFAULT_ALPHABETA
          : currPlayer.alphaBeta
      );
      const name = currPlayer.heuristic ? currPlayer.heuristic.name : "NONE";
      console.log("minimax: ", name, aiMove);
      console.log("runtime: ", new Date().getTime() - startTime);

      setGame((prevState: Game) => prevState.move(aiMove.pos));
    }
  };

  const handleClick = function(i: number) {
    if (currPlayer.actor === "Human") {
      if (!includes(game.getLegalMoves(), i)) return;

      setGame((prevState: Game) => prevState.move(i));
    }
  };

  let status;
  if (game.getLegalMoves().length !== 0) {
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
        <div>
          {"Starting Player: " + initGame.getPlayer().name}
          <br />
          {status}
        </div>
      </div>
      <div className="game-board">
        <Board
          squares={game.getBoard()}
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

export default GameContainer;
