import { describe, expect, it } from 'vitest';
import {
  createBoardForLevel,
  generateLevel,
  levelFromBoard,
  parseLevelFile,
  STARTER_LEVEL,
  validateLevel,
} from './levels';

describe('levels', () => {
  it('loads a repository level with fixed clues and validates it through the solver', () => {
    const board = createBoardForLevel(STARTER_LEVEL);

    expect(board.size).toEqual({ rows: 5, cols: 5 });
    expect(board.pieces.every((piece) => piece.fixed)).toBe(true);
    expect(validateLevel(STARTER_LEVEL).valid).toBe(true);
  });

  it('round-trips a board using the documented JSON level format', () => {
    const board = createBoardForLevel(STARTER_LEVEL);
    const level = levelFromBoard(board, 3, 'easy');

    expect(parseLevelFile(JSON.stringify([level]))).toEqual([level]);
  });

  it('generates a level whose solution and difficulty are validated by the engine', () => {
    const level = generateLevel(2, 'easy', 5, 5);

    expect(level.pieces).toHaveLength(4);
    expect(validateLevel(level).valid).toBe(true);
  });

  it('rejects malformed or unsolvable imported levels', () => {
    expect(() => parseLevelFile('{}')).toThrow('JSON array');
    expect(() =>
      parseLevelFile(
        JSON.stringify([{ ...STARTER_LEVEL, board: { ...STARTER_LEVEL.board, blockedCells: ['Z9'] } }])
      )
    ).toThrow('outside the board');
  });
});
