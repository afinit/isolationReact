import React from "react";
import { Form } from "semantic-ui-react";

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
  const playerLabel = `Player${props.playerNum}`
  const playerNameLabel = `${playerLabel} Name`
  return (
    <Form.Group>
      <Form.Select 
        label={playerLabel} 
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
      <Form.Input
        label={playerNameLabel}
        value={props.player.name}
        type="string"
        onChange={e => props.setPlayer({...props.player, name: e.target.value})}
      />
    </Form.Group>
  );
}
