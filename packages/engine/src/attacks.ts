/**
 * Attack rules for each piece type.
 *
 * Each function returns true when the piece at `source` attacks `target`.
 * The functions assume source !== target.
 */

import type { Position, PieceType } from './types.js';

/** Returns true when the queen at `source` attacks `target`. */
export function queenAttacks(source: Position, target: Position): boolean {
  const rowDiff = Math.abs(source.row - target.row);
  const colDiff = Math.abs(source.col - target.col);
  return source.row === target.row || source.col === target.col || rowDiff === colDiff;
}

/** Returns true when the rook at `source` attacks `target`. */
export function rookAttacks(source: Position, target: Position): boolean {
  return source.row === target.row || source.col === target.col;
}

/** Returns true when the bishop at `source` attacks `target`. */
export function bishopAttacks(source: Position, target: Position): boolean {
  const rowDiff = Math.abs(source.row - target.row);
  const colDiff = Math.abs(source.col - target.col);
  return rowDiff === colDiff;
}

/** Returns true when the knight at `source` attacks `target`. */
export function knightAttacks(source: Position, target: Position): boolean {
  const rowDiff = Math.abs(source.row - target.row);
  const colDiff = Math.abs(source.col - target.col);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

/** Dispatch table mapping piece type to its attack function. */
const ATTACK_FUNCTIONS: Record<PieceType, (source: Position, target: Position) => boolean> = {
  queen: queenAttacks,
  rook: rookAttacks,
  bishop: bishopAttacks,
  knight: knightAttacks,
};

/**
 * Returns true when a piece of the given type at `source` attacks `target`.
 */
export function canAttack(type: PieceType, source: Position, target: Position): boolean {
  return ATTACK_FUNCTIONS[type](source, target);
}
