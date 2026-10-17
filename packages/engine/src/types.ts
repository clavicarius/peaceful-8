/**
 * Core types for the Peaceful 8 game engine.
 */

/** Zero-based row/column position on the board. */
export interface Position {
  row: number;
  col: number;
}

/** The piece types supported by the game. */
export type PieceType = 'queen' | 'rook' | 'bishop' | 'knight';

/** A chess piece placed on the board. */
export interface Piece {
  id: string;
  type: PieceType;
  position: Position;
}

/** A conflict between two pieces that attack each other. */
export interface Conflict {
  pieceA: Piece;
  pieceB: Piece;
}

/** The result of validating a board state. */
export interface ValidationResult {
  valid: boolean;
  conflicts: Conflict[];
}

/** The size of the board (rows × cols). */
export interface BoardSize {
  rows: number;
  cols: number;
}

/** Configuration used when creating a board. */
export interface BoardConfig {
  size?: BoardSize;
  blockedPositions?: ReadonlyArray<Position>;
  requiredPieceCount?: number;
}

/** Board layout stored in a level definition. */
export interface LevelBoardLayout {
  width: number;
  height: number;
  blockedCells: ReadonlyArray<string>;
}
