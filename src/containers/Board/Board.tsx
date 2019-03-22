import * as React from 'react';


interface SquareProps {
    value: string;
    onClick(i: React.MouseEvent): void;
}

function Square(props: SquareProps) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

interface BoardProps {
    squares: Array<string>;
    onClick(i: number): void;
    boardSize: number;
}


class Board extends React.Component<BoardProps> {
    constructor(props: BoardProps) {
        super(props);
    }

    renderSquare(i: number) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const boardSize = this.props.boardSize
        return (
            <div>
                {
                    [...(Array<string>(boardSize) as any).keys()].map((i) =>
                        <div key={"boardRow" + i} className="board-row">
                            {
                                [...(Array<string>(boardSize) as any).keys()].map((j) => this.renderSquare(j + i * boardSize))
                            }
                        </div>
                    )
                }
            </div>
        );
    }
}

export default Board;