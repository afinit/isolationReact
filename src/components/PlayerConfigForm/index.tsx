import React from "react";
import { Form } from "semantic-ui-react";
import { DEFAULT_MINIMAX_DEPTH, MIN_MINIMAX_DEPTH, MAX_MINIMAX_DEPTH } from "../../common/constants";
import { boundNumber } from "../../common/util";

export type ActorType = "AI" | "Human";
export interface PlayerConfig {
  name: string;
  actor: ActorType;
  minimaxDepth?: number;
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

const boundMinimaxDepth = (minimaxDepth: number) => boundNumber(minimaxDepth, MIN_MINIMAX_DEPTH, MAX_MINIMAX_DEPTH);

export default function(props: Props) {
  const playerLabel = `Player${props.playerNum}`
  const playerNameLabel = `${playerLabel} Name`
  let minimaxDepthInput
  if (props.player.actor === "AI") {
    const minimaxDepthLabel = `${playerLabel} Minimax Depth (AI Smartness Level)`

    minimaxDepthInput = (
      <Form.Input
        label={minimaxDepthLabel}
        value={props.player.minimaxDepth}
        type="number"
        onChange={e => props.setPlayer({...props.player, minimaxDepth: boundMinimaxDepth(+e.target.value)})}
      />
    )
  }

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
            actor: data.value as ActorType,
            minimaxDepth: data.value === "AI" ? DEFAULT_MINIMAX_DEPTH : undefined
          })
        }}
      />
      <Form.Input
        label={playerNameLabel}
        value={props.player.name}
        type="string"
        onChange={e => props.setPlayer({...props.player, name: e.target.value})}
      />
      {minimaxDepthInput}
    </Form.Group>
  );
}
