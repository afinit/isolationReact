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

export default Square;