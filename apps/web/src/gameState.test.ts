import { describe, expect, it } from 'vitest';
import { placePiece } from '@peaceful-8/engine';
import type { Board } from '@peaceful-8/engine';
import {
  applyDragPayload,
  applyToolToCell,
  createGameBoard,
  getBoardSnapshot,
  getStatusMessage,
} from './gameState';

describe('applyToolToCell', () => {
  it('places a selected piece on an empty square', () => {
    const board = applyToolToCell(createGameBoard(), 'queen', { row: 0, col: 0 });
    expect(board.pieces).toHaveLength(1);
    expect(board.pieces[0]?.type).toBe('queen');
  });

  it('removes an occupied square when a piece tool is active', () => {
    const board = placePiece(createGameBoard(), 'rook', { row: 1, col: 1 });
    const updated = applyToolToCell(board, 'bishop', { row: 1, col: 1 });

    expect(updated.pieces).toHaveLength(0);
  });

  it('removes a piece when the erase tool is active', () => {
    const board = placePiece(createGameBoard(), 'knight', { row: 3, col: 3 });
    const updated = applyToolToCell(board, 'erase', { row: 3, col: 3 });

    expect(updated.pieces).toHaveLength(0);
  });
});

describe('applyDragPayload', () => {
  it('moves a board piece to an empty square', () => {
    const board = placePiece(createGameBoard(), 'rook', { row: 0, col: 0 });
    const updated = applyDragPayload(
      board,
      { kind: 'board-piece', pieceType: 'rook', position: { row: 0, col: 0 } },
      { row: 2, col: 2 }
    );

    expect(updated.pieces).toHaveLength(1);
    expect(updated.pieces[0]?.position).toEqual({ row: 2, col: 2 });
  });

  it('prevents adding a ninth piece from the palette', () => {
    const filledBoard = fillBoardWithoutConflicts();
    const updated = applyDragPayload(
      filledBoard,
      { kind: 'palette', pieceType: 'queen' },
      { row: 7, col: 7 }
    );

    expect(updated).toBe(filledBoard);
  });
});

describe('board status', () => {
  it('reports conflicts and solved states', () => {
    let conflictBoard = placePiece(createGameBoard(), 'rook', { row: 0, col: 0 });
    conflictBoard = placePiece(conflictBoard, 'rook', { row: 0, col: 7 });

    const conflictSnapshot = getBoardSnapshot(conflictBoard);
    expect(conflictSnapshot.status).toBe('conflict');
    expect(conflictSnapshot.conflictingPieceIds.size).toBe(2);
    expect(getStatusMessage(conflictSnapshot)).toContain('1 conflict');

    const solvedSnapshot = getBoardSnapshot(fillBoardWithoutConflicts());
    expect(solvedSnapshot.solved).toBe(true);
    expect(getStatusMessage(solvedSnapshot)).toContain('Solved');
  });
});

function fillBoardWithoutConflicts(): Board {
  const solution: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [1, 4],
    [2, 7],
    [3, 5],
    [4, 2],
    [5, 6],
    [6, 1],
    [7, 3],
  ];

  return solution.reduce(
    (board, [row, col]) => placePiece(board, 'queen', { row, col }),
    createGameBoard()
  );
}
