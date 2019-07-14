import React from "react";
import { Link } from "react-router-dom";

import PlayerConfigForm, {
  PlayerConfig
} from "../../components/PlayerConfigForm";
import "./index.css";
import { Form, Button, Segment } from "semantic-ui-react";

import { MIN_BOARD_SIZE, MAX_BOARD_SIZE } from "../../common/constants";
import { boundNumber } from "../../common/util";

export interface Props {
  p1: PlayerConfig;
  p2: PlayerConfig;
  boardSize: number;
  setP1: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setP2: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function NewGameForm(props: Props) {
  const boundBoardSize = (boardSize: number) =>
    boundNumber(boardSize, MIN_BOARD_SIZE, MAX_BOARD_SIZE);

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
          <Form.Group>
            <Form.Input
              label="Board Size"
              type="number"
              value={props.boardSize}
              min={MIN_BOARD_SIZE}
              max={MAX_BOARD_SIZE}
              onChange={e => {
                props.setBoardSize(boundBoardSize(+e.target.value));
              }}
            />
          </Form.Group>

          <Button as={Link} to={{ pathname: "/game" }}>
            Start Game
          </Button>
        </Form>
      </Segment>
    </div>
  );
}
