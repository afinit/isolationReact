import React from "react";
import { Link } from "react-router-dom";

import PlayerConfigForm, {
  PlayerConfig
} from "../../components/PlayerConfigForm";
import "./index.css";
import { Form, Button, Segment } from "semantic-ui-react";

import { MIN_BOARD_SIZE, MAX_BOARD_SIZE, MIN_MINIMAX_DEPTH, MAX_MINIMAX_DEPTH } from '../../common/constants';

export interface Props {
  p1: PlayerConfig;
  p2: PlayerConfig;
  boardSize: number;
  minimaxDepth: number;
  setP1: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setP2: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;
  setMinimaxDepth: React.Dispatch<React.SetStateAction<number>>;
}

export default function NewGameForm(props: Props) {
  const adjustNumber = (num: number, minNum: number, maxNum: number) => {
    let numAdj = minNum;
    if (num > maxNum) numAdj = maxNum
    else if (num > minNum) numAdj = num
    
    return numAdj;
  }

  const adjustBoardSize = (boardSize: number) => adjustNumber(boardSize, MIN_BOARD_SIZE, MAX_BOARD_SIZE)
  const adjustMinimaxDepth = (minimaxDepth: number) => adjustNumber(minimaxDepth, MIN_MINIMAX_DEPTH, MAX_MINIMAX_DEPTH)

  return (
    <div className="new-game-form">
      <Segment>
      <Form>
        <PlayerConfigForm
          playerNum={1}
          player={props.p1}
          setPlayer={props.setP1}
        />
        <PlayerConfigForm
          playerNum={2}
          player={props.p2}
          setPlayer={props.setP2}
        />
        <Form.Input
          label="Board Size"
          type="number"
          value={props.boardSize}
          min={MIN_BOARD_SIZE}
          max={MAX_BOARD_SIZE}
          onChange={e => { props.setBoardSize(adjustBoardSize(+e.target.value)) }}
        />

        <Form.Input
          label="Minimax Depth (AI Smartness Level)"
          type="number"
          value={props.minimaxDepth}
          min={MIN_MINIMAX_DEPTH}
          max={MAX_MINIMAX_DEPTH}
          onChange={e => { props.setMinimaxDepth(adjustMinimaxDepth(+e.target.value)) }}
        />

        <Button as={Link} to={{ pathname: "/game" }} >
          Start Game
        </Button>
      </Form>
      </Segment>
    </div>
  );
}
