import * as React from "react";
import Square from "../../components/Square";

interface BoardProps {
  squares: number[];
  legalMoves: number[];
  onClick(i: number): void;
  boardSize: number;
}

const Board = function(props: BoardProps) {
  const renderSquare = function(i: number, legalMove: boolean) {
    return (
      <Square
        key={i}
        value={props.squares[i]}
        legalMove={legalMove}
        onClick={() => props.onClick(i)}
      />
    );
  };

  const boardSize = props.boardSize;
  return (
    <div>
      {[...(Array<string>(boardSize) as any).keys()].map(i => (
        <div key={"boardRow" + i} className="board-row">
          {[...(Array<string>(boardSize) as any).keys()].map(j => {
            const idx = j + i * boardSize;
            return renderSquare(idx, props.legalMoves.includes(idx));
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
