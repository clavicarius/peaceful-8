import { describe, expect, it } from 'vitest';
import { createBoardFromLevel, placePiece } from '../index.js';

describe('createBoardFromLevel', () => {
  it('creates a rectangular board and maps blocked cells from level coordinates', () => {
    const board = createBoardFromLevel({
      width: 6,
      height: 8,
      blockedCells: ['B2', 'F8'],
    });

    expect(board.size).toEqual({ rows: 8, cols: 6 });
    expect(board.blockedPositions).toEqual([
      { row: 6, col: 1 },
      { row: 0, col: 5 },
    ]);
  });

  it('prevents a piece from being placed on a blocked level cell', () => {
    const board = createBoardFromLevel({
      width: 6,
      height: 8,
      blockedCells: ['B2'],
    });

    expect(() => placePiece(board, 'queen', { row: 6, col: 1 })).toThrow(
      'Position (6, 1) is blocked.'
    );
  });

  it('rejects malformed and out-of-board blocked cell coordinates', () => {
    expect(() => createBoardFromLevel({ width: 5, height: 5, blockedCells: ['A0'] })).toThrow(
      'Invalid level cell coordinate'
    );
    expect(() => createBoardFromLevel({ width: 5, height: 5, blockedCells: ['F1'] })).toThrow(
      'outside the board'
    );
  });
});
