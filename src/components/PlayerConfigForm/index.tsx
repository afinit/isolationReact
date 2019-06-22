import React from "react";
import { Dropdown } from "semantic-ui-react";

export type ActorType = "AI" | "Human";
export interface PlayerConfig {
  name: string;
  actor: ActorType;
}

interface Props {
  playerNum: number;
  player: PlayerConfig;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerConfig>>;
}

const playerOptions = [
  {
    key: "ai",
    text: "AI",
    value: "AI"
  },
  {
    key: "human",
    text: "Human",
    value: "Human"
  }
];

export default function(props: Props) {
  return (
    <>
      <label>
        Player{props.playerNum}:{" "}
        <Dropdown
          options={playerOptions}
          defaultValue={props.player.actor}
          onChange={(_, data) => {
            console.log(data)
            props.setPlayer({
              name: `${data.value}${props.playerNum}`,
              actor: data.value as ActorType
            })
          }}
        />
      </label>
      <br />
      <label>
        Player{props.playerNum} Name:{" "}
        <input 
          value={props.player.name} 
          type="string" 
          onChange={e => props.setPlayer({...props.player, name: e.target.value})} />
      </label>
    </>
  );
}
