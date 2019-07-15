import * as React from "react";
import {
  SQUARE_PASTMOVE,
  SQUARE_P1_TOKEN,
  SQUARE_P2_TOKEN,
} from "../../common/constants";

import classes from './Square.module.css';

interface SquareProps {
  value: number;
  legalMove: boolean;
  onClick(i: React.MouseEvent): void;
}

function Square(props: SquareProps) {
  let classList = [classes.Square]
  if (props.value === SQUARE_PASTMOVE) classList = [...classList, classes.SquarePastMove];
  else if (props.value === SQUARE_P1_TOKEN) classList = [...classList, classes.SquareP1Token];
  else if (props.value === SQUARE_P2_TOKEN) classList = [...classList, classes.SquareP2Token];
  else if (props.legalMove) classList = [...classList, classes.SquareP1Hover];
  else classList = [...classList, classes.SquareEmpty];
  
  return <button className={classList.join(' ')} onClick={props.onClick} />;
}

export default Square;
