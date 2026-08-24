/**
 * Board model for the Peaceful 8 game engine.
 *
 * A Board is an immutable value that holds the size and placed pieces.
 * All mutating operations return new Board instances.
 */

import type { Piece, PieceType, Position, BoardSize } from './types.js';
import { canAttack } from './attacks.js';
import type { Conflict, ValidationResult } from './types.js';

/** Default board size: 8×8. */
export const DEFAULT_BOARD_SIZE: BoardSize = { rows: 8, cols: 8 };

/** Creates a unique id for a piece given its index. Exported for testing. */
export function createPieceId(type: PieceType, row: number, col: number): string {
  return `${type}-${row}-${col}`;
}

/** Returns true when the position is within the given board size. */
export function isValidPosition(position: Position, size: BoardSize): boolean {
  return (
    position.row >= 0 && position.row < size.rows && position.col >= 0 && position.col < size.cols
  );
}

/**
 * Immutable board representation.
 *
 * Create a board with `createBoard`, then use `placePiece` and `removePiece`
 * to derive new board states.
 */
export interface Board {
  readonly size: BoardSize;
  readonly pieces: ReadonlyArray<Piece>;
}

/** Creates an empty board with the given size (defaults to 8×8). */
export function createBoard(size: BoardSize = DEFAULT_BOARD_SIZE): Board {
  return { size, pieces: [] };
}

/**
 * Returns a new board with the piece placed at the given position.
 *
 * Throws when the position is outside the board or already occupied.
 */
export function placePiece(board: Board, type: PieceType, position: Position): Board {
  if (!isValidPosition(position, board.size)) {
    throw new Error(`Position (${position.row}, ${position.col}) is outside the board.`);
  }

  const occupied = board.pieces.some(
    (p) => p.position.row === position.row && p.position.col === position.col
  );
  if (occupied) {
    throw new Error(`Position (${position.row}, ${position.col}) is already occupied.`);
  }

  const piece: Piece = {
    id: createPieceId(type, position.row, position.col),
    type,
    position,
  };

  return { ...board, pieces: [...board.pieces, piece] };
}

/**
 * Returns a new board with the piece at the given position removed.
 *
 * If no piece exists at that position the board is returned unchanged.
 */
export function removePiece(board: Board, position: Position): Board {
  const pieces = board.pieces.filter(
    (p) => p.position.row !== position.row || p.position.col !== position.col
  );
  return { ...board, pieces };
}

/**
 * Returns the piece at the given position, or undefined if the cell is empty.
 */
export function getPieceAt(board: Board, position: Position): Piece | undefined {
  return board.pieces.find(
    (p) => p.position.row === position.row && p.position.col === position.col
  );
}

/**
 * Returns all pairs of pieces that attack each other.
 */
export function detectConflicts(board: Board): Conflict[] {
  const conflicts: Conflict[] = [];
  const { pieces } = board;

  for (let i = 0; i < pieces.length; i++) {
    for (let j = i + 1; j < pieces.length; j++) {
      const a = pieces[i];
      const b = pieces[j];
      if (canAttack(a.type, a.position, b.position) || canAttack(b.type, b.position, a.position)) {
        conflicts.push({ pieceA: a, pieceB: b });
      }
    }
  }

  return conflicts;
}

/**
 * Validates the current board state.
 *
 * A board is valid when it contains exactly `board.size.rows` pieces and no
 * conflicts exist. For a standard 8×8 board this means exactly 8 pieces.
 */
export function validateBoard(board: Board): ValidationResult {
  const conflicts = detectConflicts(board);
  const valid = board.pieces.length === board.size.rows && conflicts.length === 0;
  return { valid, conflicts };
}
