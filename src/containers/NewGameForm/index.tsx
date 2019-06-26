import React from "react";
import { Link } from "react-router-dom";

import PlayerConfigForm, {
  PlayerConfig
} from "../../components/PlayerConfigForm";
import "./index.css";
import { Form, Button, Segment } from "semantic-ui-react";

import { MIN_BOARD_SIZE, MAX_BOARD_SIZE } from '../../common/constants';

export interface Props {
  p1: PlayerConfig;
  p2: PlayerConfig;
  boardSize: number;
  setP1: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setP2: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function NewGameForm(props: Props) {
  const adjustBoardSize = (boardSize: number) => {
    let boardSizeAdj = MIN_BOARD_SIZE
    if (boardSize > MAX_BOARD_SIZE) boardSizeAdj = MAX_BOARD_SIZE
    else if (boardSize > MIN_BOARD_SIZE) boardSizeAdj = boardSize

    return boardSizeAdj
  }

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
          min="3"
          max="15"
          onChange={e => { props.setBoardSize(adjustBoardSize(+e.target.value)) }}
        />

        <Button as={Link} to={{ pathname: "/game" }} >
          Start Game
        </Button>
      </Form>
      </Segment>
    </div>
  );
}
