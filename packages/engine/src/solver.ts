import { canAttack } from './attacks.js';
import { detectConflicts, isBlockedPosition, placePiece, validateBoard } from './board.js';
import type { Board } from './board.js';
import type { Piece, PieceType, Position } from './types.js';

const PIECE_TYPES: ReadonlyArray<PieceType> = ['queen', 'rook', 'bishop', 'knight'];

/** Counts solutions up to maxSolutions, treating the board's pieces as clues. */
export function countSolutions(board: Board, maxSolutions = 2): number {
  if (!Number.isInteger(maxSolutions) || maxSolutions < 1) {
    throw new Error('maxSolutions must be a positive integer.');
  }

  return searchSolutions(board, maxSolutions, () => {});
}

/** Returns the first valid completion of the board, or null when none exists. */
export function solveBoard(board: Board): Board | null {
  let solution: Board | null = null;
  searchSolutions(board, 1, (foundSolution) => {
    solution = foundSolution;
  });
  return solution;
}

/**
 * Returns the next piece placement from a valid solution, or undefined when
 * the board is already complete or has no solution.
 */
export function getHint(board: Board): Piece | undefined {
  const solution = solveBoard(board);
  if (!solution) {
    return undefined;
  }

  return solution.pieces.find(
    (piece) =>
      !board.pieces.some(
        (existing) =>
          existing.position.row === piece.position.row &&
          existing.position.col === piece.position.col
      )
  );
}

function searchSolutions(
  board: Board,
  maxSolutions: number,
  onSolution: (solution: Board) => void
): number {
  if (board.pieces.length > board.requiredPieceCount || detectConflicts(board).length > 0) {
    return 0;
  }

  const positions: Position[] = [];
  for (let row = 0; row < board.size.rows; row++) {
    for (let col = 0; col < board.size.cols; col++) {
      const position = { row, col };
      if (
        !isBlockedPosition(board, position) &&
        !board.pieces.some((piece) => piece.position.row === row && piece.position.col === col)
      ) {
        positions.push(position);
      }
    }
  }

  const remainingPieceCount = board.requiredPieceCount - board.pieces.length;
  if (remainingPieceCount > positions.length) {
    return 0;
  }

  let solutionCount = 0;

  function search(currentBoard: Board, startIndex: number): void {
    if (solutionCount >= maxSolutions) {
      return;
    }

    const piecesToPlace = board.requiredPieceCount - currentBoard.pieces.length;
    if (piecesToPlace === 0) {
      if (validateBoard(currentBoard).valid) {
        solutionCount++;
        onSolution(currentBoard);
      }
      return;
    }

    if (positions.length - startIndex < piecesToPlace) {
      return;
    }

    for (let index = startIndex; index <= positions.length - piecesToPlace; index++) {
      const position = positions[index]!;

      for (const type of PIECE_TYPES) {
        const nextBoard = placePiece(currentBoard, type, position);
        if (hasUnblockableConflict(nextBoard)) {
          continue;
        }

        search(nextBoard, index + 1);
        if (solutionCount >= maxSolutions) {
          return;
        }
      }
    }
  }

  search(board, 0);
  return solutionCount;
}

function hasUnblockableConflict(board: Board): boolean {
  return detectConflicts(board).some(({ pieceA, pieceB }) => {
    return (
      (pieceA.type === 'knight' && canAttack('knight', pieceA.position, pieceB.position)) ||
      (pieceB.type === 'knight' && canAttack('knight', pieceB.position, pieceA.position))
    );
  });
}
