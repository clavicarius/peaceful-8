import { describe, it, expect } from 'vitest';
import {
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
  DEFAULT_BOARD_SIZE,
  DEFAULT_REQUIRED_PIECE_COUNT,
} from '../board.js';
import type { Board } from '../board.js';
import type { Position } from '../types.js';

const pos = (row: number, col: number): Position => ({ row, col });

describe('createBoard', () => {
  it('creates an empty board with default size', () => {
    const board = createBoard();
    expect(board.size).toEqual(DEFAULT_BOARD_SIZE);
    expect(board.pieces).toHaveLength(0);
    expect(board.blockedPositions).toEqual([]);
    expect(board.requiredPieceCount).toBe(DEFAULT_REQUIRED_PIECE_COUNT);
  });

  it('creates a board with custom size', () => {
    const board = createBoard({ rows: 4, cols: 4 });
    expect(board.size).toEqual({ rows: 4, cols: 4 });
  });

  it('rejects non-positive or non-integer dimensions', () => {
    expect(() => createBoard({ rows: 0, cols: 4 })).toThrow();
    expect(() => createBoard({ rows: 4, cols: 2.5 })).toThrow();
  });

  it('creates a board with blocked positions and custom required piece count', () => {
    const board = createBoard({
      size: { rows: 4, cols: 4 },
      blockedPositions: [pos(1, 1), pos(2, 2)],
      requiredPieceCount: 3,
    });

    expect(board.blockedPositions).toEqual([pos(1, 1), pos(2, 2)]);
    expect(board.requiredPieceCount).toBe(3);
  });
});

describe('isValidPosition', () => {
  const size = DEFAULT_BOARD_SIZE;
  it('accepts valid positions', () => {
    expect(isValidPosition(pos(0, 0), size)).toBe(true);
    expect(isValidPosition(pos(7, 7), size)).toBe(true);
  });

  describe('toggleBlockedPosition', () => {
    it('toggles an empty position without changing the piece count', () => {
      const board = createBoard();
      const blocked = toggleBlockedPosition(board, pos(2, 2));

      expect(blocked.blockedPositions).toEqual([pos(2, 2)]);
      expect(blocked.pieces).toHaveLength(0);
      expect(toggleBlockedPosition(blocked, pos(2, 2)).blockedPositions).toEqual([]);
    });

    it('does not block a position occupied by a piece', () => {
      const board = placePiece(createBoard(), 'queen', pos(2, 2));

      expect(toggleBlockedPosition(board, pos(2, 2))).toBe(board);
    });
  });
  it('rejects out-of-bounds positions', () => {
    expect(isValidPosition(pos(-1, 0), size)).toBe(false);
    expect(isValidPosition(pos(8, 0), size)).toBe(false);
    expect(isValidPosition(pos(0, 8), size)).toBe(false);
  });
});

describe('placePiece', () => {
  it('places a piece on an empty cell', () => {
    const board = placePiece(createBoard(), 'queen', pos(3, 4));
    expect(board.pieces).toHaveLength(1);
    expect(board.pieces[0].type).toBe('queen');
    expect(board.pieces[0].position).toEqual(pos(3, 4));
    expect(board.pieces[0].fixed).toBe(false);
  });

  it('marks a placed piece as fixed when requested', () => {
    const board = placePiece(createBoard(), 'queen', pos(3, 4), true);

    expect(board.pieces[0]?.fixed).toBe(true);
  });

  it('throws when position is outside the board', () => {
    expect(() => placePiece(createBoard(), 'rook', pos(9, 0))).toThrow();
  });

  it('throws when position is already occupied', () => {
    const board = placePiece(createBoard(), 'rook', pos(0, 0));
    expect(() => placePiece(board, 'bishop', pos(0, 0))).toThrow();
  });

  it('throws when position is blocked', () => {
    const board = createBoard({
      blockedPositions: [pos(2, 2)],
    });

    expect(() => placePiece(board, 'bishop', pos(2, 2))).toThrow();
  });

  it('is immutable – original board is unchanged', () => {
    const original = createBoard();
    placePiece(original, 'knight', pos(0, 0));
    expect(original.pieces).toHaveLength(0);
  });
});

describe('removePiece', () => {
  it('removes a piece from the board', () => {
    const board = placePiece(createBoard(), 'rook', pos(1, 1));
    const updated = removePiece(board, pos(1, 1));
    expect(updated.pieces).toHaveLength(0);
  });

  it('is a no-op when no piece at position', () => {
    const board = placePiece(createBoard(), 'rook', pos(1, 1));
    const updated = removePiece(board, pos(5, 5));
    expect(updated.pieces).toHaveLength(1);
  });

  it('does not remove a fixed piece', () => {
    const board = placePiece(createBoard(), 'rook', pos(1, 1), true);

    expect(removePiece(board, pos(1, 1))).toBe(board);
  });
});

describe('movePiece', () => {
  it('moves a piece to an empty cell', () => {
    const board = placePiece(createBoard(), 'rook', pos(1, 1));
    const updated = movePiece(board, pos(1, 1), pos(2, 3));

    expect(getPieceAt(updated, pos(1, 1))).toBeUndefined();
    expect(getPieceAt(updated, pos(2, 3))?.type).toBe('rook');
  });

  it('returns the same board when moving to the same cell', () => {
    const board = placePiece(createBoard(), 'bishop', pos(2, 2));
    expect(movePiece(board, pos(2, 2), pos(2, 2))).toBe(board);
  });

  it('does not move a fixed piece', () => {
    const board = placePiece(createBoard(), 'bishop', pos(2, 2), true);

    expect(movePiece(board, pos(2, 2), pos(3, 3))).toBe(board);
  });

  it('throws when the source cell is empty', () => {
    expect(() => movePiece(createBoard(), pos(0, 0), pos(1, 1))).toThrow();
  });

  it('throws when the target cell is occupied', () => {
    let board = placePiece(createBoard(), 'queen', pos(0, 0));
    board = placePiece(board, 'knight', pos(1, 2));

    expect(() => movePiece(board, pos(0, 0), pos(1, 2))).toThrow();
  });

  it('throws when moving to a blocked cell', () => {
    let board = createBoard({ blockedPositions: [pos(2, 3)] });
    board = placePiece(board, 'rook', pos(1, 1));

    expect(() => movePiece(board, pos(1, 1), pos(2, 3))).toThrow();
  });
});

describe('getPieceAt', () => {
  it('returns the piece at an occupied cell', () => {
    const board = placePiece(createBoard(), 'bishop', pos(2, 3));
    const piece = getPieceAt(board, pos(2, 3));
    expect(piece).toBeDefined();
    expect(piece?.type).toBe('bishop');
  });

  it('returns undefined for empty cell', () => {
    expect(getPieceAt(createBoard(), pos(0, 0))).toBeUndefined();
  });
});

describe('detectConflicts', () => {
  it('returns no conflicts for an empty board', () => {
    expect(detectConflicts(createBoard())).toHaveLength(0);
  });

  it('detects a row conflict between two rooks', () => {
    let board = placePiece(createBoard(), 'rook', pos(0, 0));
    board = placePiece(board, 'rook', pos(0, 7));
    const conflicts = detectConflicts(board);
    expect(conflicts).toHaveLength(1);
  });

  it('detects no conflict when rooks are on different rows and cols', () => {
    let board = placePiece(createBoard(), 'rook', pos(0, 0));
    board = placePiece(board, 'rook', pos(1, 1));
    // They share a diagonal but rooks don't attack diagonally
    const conflicts = detectConflicts(board);
    expect(conflicts).toHaveLength(0);
  });

  it('detects a diagonal conflict between two bishops', () => {
    let board = placePiece(createBoard(), 'bishop', pos(0, 0));
    board = placePiece(board, 'bishop', pos(3, 3));
    const conflicts = detectConflicts(board);
    expect(conflicts).toHaveLength(1);
  });

  it('detects a knight conflict', () => {
    let board = placePiece(createBoard(), 'knight', pos(4, 4));
    board = placePiece(board, 'knight', pos(2, 3));
    const conflicts = detectConflicts(board);
    expect(conflicts).toHaveLength(1);
  });

  it('detects cross-type conflict (queen vs rook same row)', () => {
    let board = placePiece(createBoard(), 'queen', pos(3, 0));
    board = placePiece(board, 'rook', pos(3, 7));
    const conflicts = detectConflicts(board);
    expect(conflicts).toHaveLength(1);
  });

  it('does not detect direct slider conflict through another piece', () => {
    let board = placePiece(createBoard(), 'rook', pos(0, 0));
    board = placePiece(board, 'knight', pos(0, 3));
    board = placePiece(board, 'rook', pos(0, 7));
    const conflicts = detectConflicts(board);
    const hasEdgeRookConflict = conflicts.some(
      ({ pieceA, pieceB }) =>
        pieceA.position.row === 0 &&
        pieceA.position.col === 0 &&
        pieceB.position.row === 0 &&
        pieceB.position.col === 7
    );
    expect(hasEdgeRookConflict).toBe(false);
  });

  it('does not detect slider conflict through a blocked cell', () => {
    let board = createBoard({ blockedPositions: [pos(0, 3)] });
    board = placePiece(board, 'queen', pos(0, 0));
    board = placePiece(board, 'queen', pos(0, 7));
    const conflicts = detectConflicts(board);
    expect(conflicts).toHaveLength(0);
  });
});

describe('validateBoard', () => {
  it('is invalid when fewer than 8 pieces', () => {
    const result = validateBoard(createBoard());
    expect(result.valid).toBe(false);
  });

  it('is invalid when 8 pieces but conflicts exist', () => {
    // Place 8 queens all on the same row → many conflicts
    let board: Board = createBoard();
    for (let col = 0; col < 8; col++) {
      board = placePiece(board, 'queen', pos(0, col));
    }
    const result = validateBoard(board);
    expect(result.valid).toBe(false);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });

  it('is valid for a known correct 8-queen solution', () => {
    // A valid 8-queens solution: queens placed so none attack each other
    const solution: [number, number][] = [
      [0, 0],
      [1, 4],
      [2, 7],
      [3, 5],
      [4, 2],
      [5, 6],
      [6, 1],
      [7, 3],
    ];
    let board: Board = createBoard();
    for (const [row, col] of solution) {
      board = placePiece(board, 'queen', pos(row, col));
    }
    const result = validateBoard(board);
    expect(result.valid).toBe(true);
    expect(result.conflicts).toHaveLength(0);
  });

  it('uses custom required piece count for validation', () => {
    let board: Board = createBoard({ requiredPieceCount: 2 });
    board = placePiece(board, 'queen', pos(0, 0));
    board = placePiece(board, 'rook', pos(1, 2));

    const result = validateBoard(board);
    expect(result.valid).toBe(true);
  });
});

describe('isBlockedPosition', () => {
  it('returns true only for blocked positions', () => {
    const board = createBoard({
      size: { rows: 3, cols: 3 },
      blockedPositions: [pos(1, 1)],
    });

    expect(isBlockedPosition(board, pos(1, 1))).toBe(true);
    expect(isBlockedPosition(board, pos(0, 0))).toBe(false);
  });
});
