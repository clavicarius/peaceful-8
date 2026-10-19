import { describe, expect, it } from 'vitest';
import { createBoard, getHint, placePiece, solveBoard, validateBoard } from '../index.js';

describe('solveBoard', () => {
  it('finds a valid completion while preserving starting pieces', () => {
    const board = placePiece(
      createBoard({ size: { rows: 3, cols: 3 }, requiredPieceCount: 2 }),
      'queen',
      { row: 0, col: 0 },
      true
    );

    const solution = solveBoard(board);

    expect(solution).not.toBeNull();
    expect(solution?.pieces).toContainEqual(board.pieces[0]);
    expect(solution && validateBoard(solution).valid).toBe(true);
  });

  it('returns null when the puzzle cannot be completed', () => {
    const board = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 2 });

    expect(solveBoard(board)).toBeNull();
  });
});

describe('getHint', () => {
  it('returns a piece placement that advances the puzzle without changing the board', () => {
    const board = placePiece(
      createBoard({ size: { rows: 3, cols: 3 }, requiredPieceCount: 2 }),
      'queen',
      { row: 0, col: 0 },
      true
    );

    const hint = getHint(board);

    expect(hint).toBeDefined();
    expect(hint?.fixed).toBe(false);
    expect(board.pieces).toHaveLength(1);
    expect(hint && validateBoard(placePiece(board, hint.type, hint.position)).valid).toBe(true);
  });

  it('returns undefined for solved and unsolvable boards', () => {
    const solvedBoard = placePiece(
      createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 1 }),
      'queen',
      { row: 0, col: 0 }
    );
    const unsolvableBoard = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 2 });

    expect(getHint(solvedBoard)).toBeUndefined();
    expect(getHint(unsolvableBoard)).toBeUndefined();
  });
});
