/**
 * Peaceful 8 – Game Engine
 *
 * Entry point for the engine package.
 */

export const ENGINE_VERSION = '0.2.0';

export type {
  Position,
  PieceType,
  Piece,
  Conflict,
  ValidationResult,
  BoardSize,
  BoardConfig,
} from './types.js';
export type { Board } from './board.js';

export { queenAttacks, rookAttacks, bishopAttacks, knightAttacks, canAttack } from './attacks.js';

export {
  DEFAULT_BOARD_SIZE,
  createBoard,
  placePiece,
  removePiece,
  movePiece,
  getPieceAt,
  detectConflicts,
  validateBoard,
  isValidPosition,
  isBlockedPosition,
  createPieceId,
} from './board.js';
