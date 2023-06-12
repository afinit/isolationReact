import React from "react";
import { Link } from "react-router-dom";

import PlayerConfigForm, {
  PlayerConfig
} from "../../components/PlayerConfigForm";
import "./index.css";
import { Form, Button, Segment, CheckboxProps } from "semantic-ui-react";

import { MIN_BOARD_SIZE, MAX_BOARD_SIZE } from "../../common/constants";
import { boundNumber } from "../../common/util";
import { PieceCount } from "../../common/types";

export interface Props {
  p1: PlayerConfig;
  p2: PlayerConfig;
  boardSize: number;
  pieceCount: PieceCount;
  setP1: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setP2: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;
  setPieceCount: React.Dispatch<React.SetStateAction<PieceCount>>;
}

export default function NewGameForm(props: Props) {
  const boundBoardSize = (boardSize: number) =>
    boundNumber(boardSize, MIN_BOARD_SIZE, MAX_BOARD_SIZE);

  const handleRadioCheck = (e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
    props.setPieceCount(data.value as PieceCount);
  };

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
          <Form.Group grouped>
            <label>Number of Game Pieces</label>
            <Form.Field>
              <Form.Radio
                label="One Piece (Players share the piece)"
                value={PieceCount.OnePiece}
                checked={props.pieceCount === PieceCount.OnePiece}
                onChange={handleRadioCheck}
              />
            </Form.Field>
            <Form.Field>
              <Form.Radio
                label="Two Piece (Players control their own piece)"
                value={PieceCount.TwoPiece}
                checked={props.pieceCount === PieceCount.TwoPiece}
                onChange={handleRadioCheck}
              />
            </Form.Field>
          </Form.Group>

          <Button as={Link} to={{ pathname: "/game" }}>
            Start Game
          </Button>
        </Form>
      </Segment>
    </div>
  );
}
