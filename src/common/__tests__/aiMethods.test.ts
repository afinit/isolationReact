import { OnePieceGame } from "../OnePieceGame";
import { SQUARE_EMPTY, SQUARE_P1_TOKEN, SQUARE_PASTMOVE } from "../constants";
import { aiAlgorithm } from "../aiMethods";
import { openMovesHeuristic } from "../heuristic";


it('runs a quick alphabeta test', () => {
    const boardSize = 3;
    const historyElem = {
        "squares": [
            SQUARE_PASTMOVE,
            SQUARE_EMPTY,
            SQUARE_PASTMOVE,
            SQUARE_EMPTY,
            SQUARE_EMPTY,
            SQUARE_P1_TOKEN,
            SQUARE_EMPTY,
            SQUARE_EMPTY,
            SQUARE_EMPTY
        ],
        "currPlayerIdx": 0,
        "currPosition": 5
    }
    const game = new OnePieceGame(
        boardSize,
        [],
        false,
        3,
        [historyElem],
        [8,7,4,3,1],
        []
    );

    const abResults = aiAlgorithm(game, true, new Date().getTime() + 5000, 3, openMovesHeuristic, true);

    expect(abResults).toEqual({ score: -2, pos: 4, alpha: -9007199254740991, beta: -2, depth: 3 });
});

it('runs a quick alphabeta test - 2', () => {
    const boardSize = 3;
    const historyElem = {
        "squares": [
            SQUARE_PASTMOVE,
            SQUARE_PASTMOVE,
            SQUARE_PASTMOVE,
            SQUARE_PASTMOVE,
            SQUARE_P1_TOKEN,
            SQUARE_PASTMOVE,
            SQUARE_EMPTY,
            SQUARE_EMPTY,
            SQUARE_EMPTY
        ],
        "currPlayerIdx": 1,
        "currPosition": 4
    }
    const game = new OnePieceGame(
        boardSize,
        [],
        false,
        3,
        [historyElem],
        [8,7,6],
        []
    );

    const abResults = aiAlgorithm(game, true, new Date().getTime() + 5000, 3, openMovesHeuristic, true);

    expect(abResults).toEqual({ score: 1000, pos: 8, alpha: -9007199254740991, beta: 1000, depth: 3 });
});