import { heuristicOptionDictionary } from "./heuristic";

export const WINNING_SCORE = 1000;
export const MIN_BOARD_SIZE = 3;
export const MAX_BOARD_SIZE = 15;
export const MIN_MINIMAX_DEPTH = 1;
export const MAX_MINIMAX_DEPTH = 15;
export const DEFAULT_MINIMAX_DEPTH = 5;
export const DEFAULT_HEURISTIC = heuristicOptionDictionary["OpenMoves"].heuristic;
export const DEFAULT_ALPHABETA = false;
export const PASTMOVECHAR = "#";
export const CURRENTPOSCHAR = "ø";

export const SQUARE_EMPTY = -2;
export const SQUARE_PASTMOVE = -1;
export const SQUARE_P1_TOKEN = 0;
export const SQUARE_P2_TOKEN = 1;

export const COLOR_P1_HOVER = "#FFA5A5";  // FFA5A5   AAAE5B
export const COLOR_P1_TOKEN = "#EC368D";  // EC368D   3B5626
export const COLOR_P2_HOVER = "#51E5FF";  // 51E5FF   E49C39
export const COLOR_P2_TOKEN = "#440381";  // 440381   FC7C15
export const COLOR_PASTMOVE = "#FFD6C0";  // FFD6C0   4A3B09
export const COLOR_EMPTY = "#fff";