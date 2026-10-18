import {
  createBoardFromLevel,
  findSolutions,
  placePiece,
  validateLevelByDifficulty,
} from '@peaceful-8/engine';
import type { Board, LevelBoardLayout, LevelDifficulty, PieceType } from '@peaceful-8/engine';
import levelData from './levels.json';

export interface LevelDefinition {
  readonly id: number;
  readonly difficulty: LevelDifficulty;
  readonly board: LevelBoardLayout;
  readonly pieces: ReadonlyArray<{
    readonly type: PieceType;
    readonly position?: string;
    readonly fixed: boolean;
  }>;
}

export interface LevelResult {
  readonly valid: boolean;
  readonly errors: ReadonlyArray<string>;
  readonly solutionCount: number;
}

export const STARTER_LEVELS = levelData as ReadonlyArray<LevelDefinition>;
export const STARTER_LEVEL = STARTER_LEVELS[0]!;

export function createBoardForLevel(level: LevelDefinition): Board {
  const board = createBoardFromLevel(level.board, 8);
  return level.pieces.reduce((currentBoard, piece) => {
    if (!piece.fixed) {
      return currentBoard;
    }

    if (!piece.position) {
      throw new Error('Fixed level pieces must have a position.');
    }

    return placePiece(currentBoard, piece.type, parseCoordinate(piece.position, level.board), true);
  }, board);
}

export function validateLevel(level: LevelDefinition): LevelResult {
  const errors: string[] = [];

  if (!Number.isInteger(level.id) || level.id < 1) {
    errors.push('Level id must be a positive integer.');
  }

  if (
    !Number.isInteger(level.board.width) ||
    level.board.width < 1 ||
    !Number.isInteger(level.board.height) ||
    level.board.height < 1
  ) {
    errors.push('Board dimensions must be positive integers.');
  }

  if (new Set(level.board.blockedCells).size !== level.board.blockedCells.length) {
    errors.push('Blocked cells must not contain duplicates.');
  }

  const occupiedCoordinates = new Set<string>();
  for (const piece of level.pieces) {
    if (piece.fixed && !piece.position) {
      errors.push('Fixed level pieces must have a position.');
    }

    if (!piece.position) {
      continue;
    }

    try {
      parseCoordinate(piece.position, level.board);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Invalid piece coordinate.');
      continue;
    }

    const coordinate = piece.position.toUpperCase();
    if (occupiedCoordinates.has(coordinate)) {
      errors.push(`Multiple level pieces use ${piece.position}.`);
    }
    if (level.board.blockedCells.some((cell) => cell.toUpperCase() === coordinate)) {
      errors.push(`A level piece occupies blocked cell ${piece.position}.`);
    }
    occupiedCoordinates.add(coordinate);
  }

  if (errors.length > 0) {
    return { valid: false, errors, solutionCount: 0 };
  }

  try {
    const result = validateLevelByDifficulty(
      createBoardForLevel(level),
      level.difficulty
    );
    return { valid: result.valid, errors: result.errors, solutionCount: result.solutionCount };
  } catch (error) {
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Invalid level definition.'],
      solutionCount: 0,
    };
  }
}

export function levelFromBoard(
  board: Board,
  id: number,
  difficulty: LevelDifficulty
): LevelDefinition {
  return {
    id,
    difficulty,
    board: {
      width: board.size.cols,
      height: board.size.rows,
      blockedCells: board.blockedPositions.map((position) => toCoordinate(position, board.size.rows)),
    },
    pieces: board.pieces
      .filter((piece) => piece.fixed)
      .map((piece) => ({
        type: piece.type,
        position: toCoordinate(piece.position, board.size.rows),
        fixed: true,
      })),
  };
}

export function generateLevel(
  id: number,
  difficulty: LevelDifficulty,
  width: number,
  height: number,
  blockedCells: ReadonlyArray<string> = []
): LevelDefinition {
  const layout = { width, height, blockedCells };
  const solutions = findSolutions(createBoardFromLevel(layout, 8));
  const solution = solutions[0];
  if (!solution) {
    throw new Error('No complete solution exists for this board layout.');
  }

  const clueCounts: number[] =
    difficulty === 'hard'
      ? Array.from({ length: solution.pieces.length }, (_, index) => solution.pieces.length - index)
      : [difficulty === 'easy' ? 4 : 2];

  for (const clueCount of clueCounts) {
    for (const clues of combinations(solution.pieces, clueCount)) {
      const level: LevelDefinition = {
        id,
        difficulty,
        board: layout,
        pieces: clues.map((piece) => ({
          type: piece.type,
          position: toCoordinate(piece.position, height),
          fixed: true,
        })),
      };
      if (validateLevel(level).valid) {
        return level;
      }
    }
  }

  throw new Error(`Could not create a valid ${difficulty} level for this board layout.`);
}

export function parseLevelFile(contents: string): ReadonlyArray<LevelDefinition> {
  const parsed: unknown = JSON.parse(contents);
  if (!Array.isArray(parsed)) {
    throw new Error('Level file must contain a JSON array.');
  }

  for (const item of parsed) {
    if (!isLevelDefinition(item)) {
      throw new Error('Level file contains an invalid level definition.');
    }

    const validation = validateLevel(item);
    if (!validation.valid) {
      throw new Error(`Level ${item.id} is invalid: ${validation.errors.join(' ')}`);
    }
  }

  return parsed;
}

function isLevelDefinition(value: unknown): value is LevelDefinition {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const level = value as Partial<LevelDefinition>;
  return (
    Number.isInteger(level.id) &&
    ['easy', 'medium', 'hard', 'extra-hard'].includes(level.difficulty ?? '') &&
    !!level.board &&
    typeof level.board.width === 'number' &&
    typeof level.board.height === 'number' &&
    Array.isArray(level.board.blockedCells) &&
    level.board.blockedCells.every((cell) => typeof cell === 'string') &&
    Array.isArray(level.pieces) &&
    level.pieces.every(
      (piece) =>
        !!piece &&
        ['queen', 'rook', 'bishop', 'knight'].includes(piece.type) &&
        typeof piece.fixed === 'boolean' &&
        (piece.position === undefined || typeof piece.position === 'string')
    )
  );
}

function* combinations<T>(items: ReadonlyArray<T>, count: number): Generator<ReadonlyArray<T>> {
  if (count === 0) {
    yield [];
    return;
  }

  for (let index = 0; index <= items.length - count; index++) {
    for (const rest of combinations(items.slice(index + 1), count - 1)) {
      yield [items[index]!, ...rest];
    }
  }
}

function parseCoordinate(coordinate: string, layout: LevelBoardLayout): { row: number; col: number } {
  const match = /^([a-z]+)([1-9]\d*)$/i.exec(coordinate);
  if (!match) {
    throw new Error(`Invalid level cell coordinate: ${coordinate}.`);
  }

  const col = [...match[1].toUpperCase()].reduce(
    (value, character) => value * 26 + character.charCodeAt(0) - 64,
    0
  );
  const row = layout.height - Number(match[2]) + 1;
  if (col < 1 || col > layout.width || row < 1 || row > layout.height) {
    throw new Error(`Level cell coordinate ${coordinate} is outside the board.`);
  }

  return { row: row - 1, col: col - 1 };
}

function toCoordinate(position: { row: number; col: number }, height: number): string {
  let value = position.col + 1;
  let column = '';
  while (value > 0) {
    value--;
    column = String.fromCharCode(65 + (value % 26)) + column;
    value = Math.floor(value / 26);
  }
  return `${column}${height - position.row}`;
}
