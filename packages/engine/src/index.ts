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
  LevelBoardLayout,
} from './types.js';
export type { Board } from './board.js';
export { createBoardFromLevel } from './level.js';

export { queenAttacks, rookAttacks, bishopAttacks, knightAttacks, canAttack } from './attacks.js';

export {
  DEFAULT_BOARD_SIZE,
  DEFAULT_REQUIRED_PIECE_COUNT,
  createBoard,
  placePiece,
  removePiece,
  movePiece,
  getPieceAt,
  detectConflicts,
  validateBoard,
  isValidPosition,
  isBlockedPosition,
  toggleBlockedPosition,
  createPieceId,
} from './board.js';
