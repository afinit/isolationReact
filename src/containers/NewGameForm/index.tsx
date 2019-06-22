import React from 'react';
import { Link } from 'react-router-dom';

import PlayerConfigForm, { PlayerConfig } from '../../components/PlayerConfigForm';
import './index.css';

export interface Props {
  p1: PlayerConfig;
  p2: PlayerConfig;
  boardSize: number;
  setP1: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setP2: React.Dispatch<React.SetStateAction<PlayerConfig>>;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function NewGameForm(props: Props) {

  return (
    <div className="new-game-form">
      <PlayerConfigForm 
        playerNum={1}
        player={props.p1}
        setPlayer={props.setP1}
      />
      <br />
      <PlayerConfigForm
        playerNum={2}
        player={props.p2}
        setPlayer={props.setP2}
      />
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
    </div >
  );
}