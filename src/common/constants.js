import { heuristicOptionDictionary } from "./heuristic";

export const WINNING_SCORE = 1000;
export const MIN_BOARD_SIZE = 3;
export const MAX_BOARD_SIZE = 15;
export const MIN_MINIMAX_DEPTH = 1;
export const MAX_MINIMAX_DEPTH = 15;
export const DEFAULT_MINIMAX_DEPTH = 5;
export const DEFAULT_HEURISTIC = heuristicOptionDictionary["OpenMoves"].heuristic;
export const PASTMOVECHAR = "#";
export const CURRENTPOSCHAR = "ø";
