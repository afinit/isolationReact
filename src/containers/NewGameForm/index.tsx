import React from 'react';
import { Link } from 'react-router-dom';

export interface Props {
  p1Name: string;
  p2Name: string;
  boardSize: number;
  setP1Name: React.Dispatch<React.SetStateAction<string>>;
  setP2Name: React.Dispatch<React.SetStateAction<string>>;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function NewGameForm(props: Props) {

  return (
    <>
      <label>
        Player1 Name: {" "}
        <input
          name="p1Name"
          type="string"
          value={props.p1Name}
          onChange={e => props.setP1Name(e.target.value)}
          />
      </label>
      <br />
      <label>
        Player2 Name: {" "}
        <input
          name="p2Name"
          type="string"
          value={props.p2Name}
          onChange={e => props.setP2Name(e.target.value)}
          />
      </label>
      <br />
      <label>
        Board Size: {" "}
        <input
          name="boardSize"
          type="number"
          value={props.boardSize}
          min="3"
          max="15"
          onChange={e => props.setBoardSize(+e.target.value)}
          />
      </label>

      <br />

      <button>
        <Link to={{pathname: "/game"}}>
          Start Game
        </Link>
      </button>
    </>
  );
}