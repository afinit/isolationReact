import * as React from "react";
import {
  COLOR_EMPTY,
  SQUARE_PASTMOVE,
  COLOR_PASTMOVE,
  SQUARE_P1_TOKEN,
  COLOR_P1_TOKEN,
  SQUARE_P2_TOKEN,
  COLOR_P2_TOKEN
} from "../../common/constants";

interface SquareProps {
  value: number;
  onClick(i: React.MouseEvent): void;
}

function Square(props: SquareProps) {
  let color = COLOR_EMPTY;
  if (props.value === SQUARE_PASTMOVE) color = COLOR_PASTMOVE;
  else if (props.value === SQUARE_P1_TOKEN) color = COLOR_P1_TOKEN;
  else if (props.value === SQUARE_P2_TOKEN) color = COLOR_P2_TOKEN;
  
  return <button className="square" onClick={props.onClick} style={{background: color}} />;
}

export default Square;
