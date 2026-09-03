/**
 * Board model for the Peaceful 8 game engine.
 *
 * A Board is an immutable value that holds the size and placed pieces.
 * All mutating operations return new Board instances.
 */

import type { Piece, PieceType, Position, BoardSize, BoardConfig } from './types.js';
import { canAttack } from './attacks.js';
import type { Conflict, ValidationResult } from './types.js';

/** Default board size: 8×8. */
export const DEFAULT_BOARD_SIZE: BoardSize = { rows: 8, cols: 8 };
/** Default number of pieces required to solve a board. */
export const DEFAULT_REQUIRED_PIECE_COUNT = 8;

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
  readonly blockedPositions: ReadonlyArray<Position>;
  readonly requiredPieceCount: number;
}

/** Creates an empty board with the given size (defaults to 8×8). */
export function createBoard(input: BoardSize | BoardConfig = DEFAULT_BOARD_SIZE): Board {
  const config: BoardConfig = isBoardSize(input) ? { size: input } : input;
  const size = config.size ?? DEFAULT_BOARD_SIZE;
  const blockedPositions = config.blockedPositions ?? [];
  const requiredPieceCount = config.requiredPieceCount ?? DEFAULT_REQUIRED_PIECE_COUNT;

  if (requiredPieceCount < 0 || !Number.isInteger(requiredPieceCount)) {
    throw new Error('requiredPieceCount must be a non-negative integer.');
  }

  for (const blockedPosition of blockedPositions) {
    if (!isValidPosition(blockedPosition, size)) {
      throw new Error(
        `Blocked position (${blockedPosition.row}, ${blockedPosition.col}) is outside the board.`
      );
    }
  }

  return { size, pieces: [], blockedPositions, requiredPieceCount };
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
  if (isBlockedPosition(board, position)) {
    throw new Error(`Position (${position.row}, ${position.col}) is blocked.`);
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
 * Returns a new board with a piece moved from one position to another.
 *
 * Throws when the source cell is empty, the target position is outside the
 * board, or the target cell is occupied by a different piece.
 */
export function movePiece(board: Board, from: Position, to: Position): Board {
  if (!isValidPosition(to, board.size)) {
    throw new Error(`Position (${to.row}, ${to.col}) is outside the board.`);
  }
  if (isBlockedPosition(board, to)) {
    throw new Error(`Position (${to.row}, ${to.col}) is blocked.`);
  }

  if (from.row === to.row && from.col === to.col) {
    return board;
  }

  const piece = getPieceAt(board, from);
  if (!piece) {
    throw new Error(`No piece found at position (${from.row}, ${from.col}).`);
  }

  const targetPiece = getPieceAt(board, to);
  if (targetPiece) {
    throw new Error(`Position (${to.row}, ${to.col}) is already occupied.`);
  }

  return placePiece(removePiece(board, from), piece.type, to);
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
      if (pieceAttacks(board, a, b) || pieceAttacks(board, b, a)) {
        conflicts.push({ pieceA: a, pieceB: b });
      }
    }
  }

  return conflicts;
}

/**
 * Validates the current board state.
 *
 * A board is valid when it contains exactly `board.requiredPieceCount` pieces
 * and no conflicts exist. For a standard board this defaults to 8 pieces.
 */
export function validateBoard(board: Board): ValidationResult {
  const conflicts = detectConflicts(board);
  const valid = board.pieces.length === board.requiredPieceCount && conflicts.length === 0;
  return { valid, conflicts };
}

/** Returns true when a position is blocked on the board. */
export function isBlockedPosition(board: Board, position: Position): boolean {
  return board.blockedPositions.some(
    (blocked) => blocked.row === position.row && blocked.col === position.col
  );
}

/** Returns a new board with the blocked state of a position toggled. */
export function toggleBlockedPosition(board: Board, position: Position): Board {
  if (!isValidPosition(position, board.size)) {
    throw new Error(`Position (${position.row}, ${position.col}) is outside the board.`);
  }

  if (getPieceAt(board, position)) {
    return board;
  }

  if (isBlockedPosition(board, position)) {
    return {
      ...board,
      blockedPositions: board.blockedPositions.filter(
        (blocked) => blocked.row !== position.row || blocked.col !== position.col
      ),
    };
  }

  return { ...board, blockedPositions: [...board.blockedPositions, position] };
}

function isBoardSize(value: BoardSize | BoardConfig): value is BoardSize {
  return 'rows' in value && 'cols' in value;
}

function pieceAttacks(board: Board, attacker: Piece, target: Piece): boolean {
  if (!canAttack(attacker.type, attacker.position, target.position)) {
    return false;
  }

  if (!isSlidingPiece(attacker.type)) {
    return true;
  }

  return hasClearLineOfSight(board, attacker.position, target.position);
}

function isSlidingPiece(type: PieceType): boolean {
  return type === 'queen' || type === 'rook' || type === 'bishop';
}

function hasClearLineOfSight(board: Board, source: Position, target: Position): boolean {
  const rowDelta = target.row - source.row;
  const colDelta = target.col - source.col;

  const rowStep = Math.sign(rowDelta);
  const colStep = Math.sign(colDelta);

  const alignedStraight = rowDelta === 0 || colDelta === 0;
  const alignedDiagonal = Math.abs(rowDelta) === Math.abs(colDelta);
  if (!alignedStraight && !alignedDiagonal) {
    return false;
  }

  let row = source.row + rowStep;
  let col = source.col + colStep;

  while (row !== target.row || col !== target.col) {
    const position = { row, col };

    if (isBlockedPosition(board, position) || getPieceAt(board, position)) {
      return false;
    }

    row += rowStep;
    col += colStep;
  }

  return true;
}
