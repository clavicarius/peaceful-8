import { describe, expect, it } from 'vitest';
import { createBoard, placePiece } from '../index.js';
import { countSolutions, findSolutions, validateLevelByDifficulty } from '../index.js';

describe('countSolutions', () => {
  it('finds a unique solution when all required pieces are conflict-free', () => {
    const board = placePiece(
      createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 1 }),
      'queen',
      { row: 0, col: 0 },
      true
    );

    expect(countSolutions(board, 1)).toBe(1);
  });

  it('counts no solutions when the required piece count cannot fit', () => {
    const board = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 2 });

    expect(countSolutions(board)).toBe(0);
  });

  it('rejects conflicting starting positions', () => {
    let board = createBoard({ size: { rows: 1, cols: 2 }, requiredPieceCount: 2 });
    board = placePiece(board, 'queen', { row: 0, col: 0 }, true);
    board = placePiece(board, 'queen', { row: 0, col: 1 }, true);

    expect(countSolutions(board)).toBe(0);
  });

  it('stops counting at the requested limit', () => {
    const board = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 1 });

    expect(countSolutions(board, 2)).toBe(2);
    expect(() => countSolutions(board, 0)).toThrow('maxSolutions must be a positive integer.');
  });

  it('returns solved boards for generator consumers', () => {
    const board = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 1 });
    const [solution] = findSolutions(board);

    expect(solution?.pieces).toHaveLength(1);
    expect(solution?.pieces[0]?.fixed).toBe(false);
    expect(countSolutions(board, 1)).toBe(1);
  });
});

describe('validateLevelByDifficulty', () => {
  it.each(['easy', 'medium'] as const)('accepts multiple solutions for %s levels', (difficulty) => {
    const board = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 1 });

    expect(validateLevelByDifficulty(board, difficulty)).toMatchObject({
      valid: true,
      solutionCount: 2,
    });
  });

  it.each(['hard', 'extra-hard'] as const)(
    'accepts a unique solution for %s levels',
    (difficulty) => {
      const board = placePiece(
        createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 1 }),
        'bishop',
        { row: 0, col: 0 },
        true
      );

      expect(validateLevelByDifficulty(board, difficulty)).toMatchObject({
        valid: true,
        solutionCount: 1,
      });
    }
  );

  it.each(['hard', 'extra-hard'] as const)(
    'rejects multiple solutions for %s levels',
    (difficulty) => {
      const board = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 1 });

      expect(validateLevelByDifficulty(board, difficulty)).toMatchObject({
        valid: false,
        solutionCount: 2,
      });
    }
  );

  it('rejects an unsolvable level and reports a piece-count error', () => {
    const board = createBoard({ size: { rows: 1, cols: 1 }, requiredPieceCount: 2 });

    expect(validateLevelByDifficulty(board, 'easy')).toMatchObject({
      valid: false,
      solutionCount: 0,
    });
  });

  it('rejects conflicting starting positions', () => {
    let board = createBoard({ size: { rows: 1, cols: 2 }, requiredPieceCount: 2 });
    board = placePiece(board, 'rook', { row: 0, col: 0 }, true);
    board = placePiece(board, 'rook', { row: 0, col: 1 }, true);

    expect(validateLevelByDifficulty(board, 'medium')).toMatchObject({
      valid: false,
      solutionCount: 0,
      errors: ['Starting pieces contain conflicts.'],
    });
  });

  it('accepts a known conflict-free eight-piece solution', () => {
    let board = createBoard({
      size: { rows: 5, cols: 5 },
      blockedPositions: [
        { row: 0, col: 0 },
        { row: 0, col: 4 },
        { row: 4, col: 0 },
        { row: 4, col: 4 },
      ],
      requiredPieceCount: 8,
    });

    const solution = [
      ['rook', 4, 1],
      ['rook', 3, 2],
      ['bishop', 2, 0],
      ['bishop', 1, 3],
      ['knight', 2, 3],
      ['knight', 1, 0],
      ['knight', 1, 4],
      ['knight', 0, 3],
    ] as const;

    for (const [type, row, col] of solution) {
      board = placePiece(board, type, { row, col }, true);
    }

    expect(validateLevelByDifficulty(board, 'hard')).toMatchObject({
      valid: true,
      solutionCount: 1,
    });
  });
});
