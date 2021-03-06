import React from "react";
import { Form, Checkbox } from "semantic-ui-react";
import { DEFAULT_MINIMAX_DEPTH, MIN_MINIMAX_DEPTH, MAX_MINIMAX_DEPTH, DEFAULT_HEURISTIC, DEFAULT_ALPHABETA } from "../../common/constants";
import { boundNumber } from "../../common/util";
import { Heuristic, heuristicOptions, heuristicOptionDictionary, HeuristicValue } from "../../common/heuristic";

export type ActorType = "AI" | "Human";
export interface PlayerConfig {
  name: string;
  actor: ActorType;
  minimaxDepth?: number;
  heuristic?: Heuristic;
  alphaBeta?: boolean;
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
  let minimaxDepthInput;
  let heuristicInput;
  let alphaBetaInput;
  if (props.player.actor === "AI") {
    const minimaxDepthLabel = `${playerLabel} Minimax Depth (AI Smartness Level)`
    const minimaxDepth = props.player.minimaxDepth !== undefined ? props.player.minimaxDepth : DEFAULT_MINIMAX_DEPTH;
    minimaxDepthInput = (
      <Form.Input
        label={minimaxDepthLabel}
        value={minimaxDepth}
        type="number"
        onChange={e => props.setPlayer({...props.player, minimaxDepth: boundMinimaxDepth(+e.target.value)})}
      />
    )

    const heuristicLabel = `${playerLabel} Heuristic (Strategy)`;
    const heuristic = props.player.heuristic ? props.player.heuristic : DEFAULT_HEURISTIC;
    heuristicInput = (
      <Form.Select
        label={heuristicLabel}
        options={heuristicOptions}
        defaultValue={heuristic.name}
        type="string"
        onChange={(_, data) => {
          props.setPlayer({
            ...props.player, 
            heuristic: heuristicOptionDictionary[data.value as HeuristicValue].heuristic
          })}}
      />
    )

    const alphaBetaLabel = `${playerLabel} AlphaBeta`;
    const alphaBeta = props.player.alphaBeta ? props.player.alphaBeta : DEFAULT_ALPHABETA;
    alphaBetaInput = (
      <Checkbox
        label={alphaBetaLabel}
        toggle
        checked={alphaBeta}
        onChange={ () => 
          props.setPlayer({
            ...props.player,
            alphaBeta: !alphaBeta
          })
        }
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
          props.setPlayer({
            name: `${data.value}${props.playerNum}`,
            actor: data.value as ActorType,
            minimaxDepth: data.value === "AI" ? DEFAULT_MINIMAX_DEPTH : undefined,
            heuristic: data.value === "AI" ? DEFAULT_HEURISTIC : undefined,
            alphaBeta: data.value === "AI" ? DEFAULT_ALPHABETA : undefined
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
      {heuristicInput}
      {alphaBetaInput}
    </Form.Group>
  );
}
