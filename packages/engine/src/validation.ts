import { detectConflicts } from './board.js';
import type { Board } from './board.js';
import { countSolutions } from './solver.js';

export type LevelDifficulty = 'easy' | 'medium' | 'hard' | 'extra-hard';

export interface LevelValidationResult {
  valid: boolean;
  errors: string[];
  solutionCount: number;
}

/** Validates that a level has enough solutions for its difficulty. */
export function validateLevelByDifficulty(
  board: Board,
  difficulty: LevelDifficulty
): LevelValidationResult {
  if (!['easy', 'medium', 'hard', 'extra-hard'].includes(difficulty)) {
    return {
      valid: false,
      errors: [`Unsupported difficulty: ${difficulty}.`],
      solutionCount: 0,
    };
  }

  const errors: string[] = [];
  const conflicts = detectConflicts(board);

  if (conflicts.length > 0) {
    return {
      valid: false,
      errors: ['Starting pieces contain conflicts.'],
      solutionCount: 0,
    };
  }

  const solutionCount = countSolutions(board, 2);
  if (solutionCount === 0) {
    errors.push('Level has no valid solution.');
  } else if ((difficulty === 'hard' || difficulty === 'extra-hard') && solutionCount !== 1) {
    errors.push('Level must have exactly one valid solution.');
  }

  return { valid: errors.length === 0, errors, solutionCount };
}
