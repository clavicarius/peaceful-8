import { describe, expect, it } from 'vitest';
import {
  createBoardForLevel,
  deleteLevel,
  generateLevel,
  levelFromBoard,
  parseLevelFile,
  STARTER_LEVEL,
  STARTER_LEVELS,
  upsertLevel,
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

  it('generates hard levels with exactly one solver solution', () => {
    const level = generateLevel(3, 'hard', 5, 5);

    expect(level.pieces.length).toBeLessThan(8);
    expect(validateLevel(level)).toMatchObject({ valid: true, solutionCount: 1 });
  });

  it('creates, edits, and deletes validated catalog levels', () => {
    const created = upsertLevel([], STARTER_LEVEL);
    const edited = upsertLevel(created, { ...STARTER_LEVEL, difficulty: 'medium' });

    expect(created).toEqual([STARTER_LEVEL]);
    expect(edited).toHaveLength(1);
    expect(edited[0]?.difficulty).toBe('medium');
    expect(deleteLevel(edited, STARTER_LEVEL.id)).toEqual([]);
    expect(upsertLevel(STARTER_LEVELS, STARTER_LEVEL)).toEqual(STARTER_LEVELS);
  });

  it('rejects malformed or unsolvable imported levels', () => {
    expect(() => parseLevelFile('{}')).toThrow('JSON array');
    expect(() =>
      parseLevelFile(
        JSON.stringify([
          { ...STARTER_LEVEL, board: { ...STARTER_LEVEL.board, blockedCells: ['Z9'] } },
        ])
      )
    ).toThrow('outside the board');
  });
});
