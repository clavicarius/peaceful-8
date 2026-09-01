import { describe, expect, it } from 'vitest';
import { createBoard, placePiece } from '@peaceful-8/engine';
import type { Board } from '@peaceful-8/engine';
import {
  applyDragPayload,
  applyToolToCell,
  createGameBoard,
  getBoardSnapshot,
  getStatusMessage,
} from './gameState';

describe('createGameBoard', () => {
  it('creates a 5x5 playable board with an 8-piece target', () => {
    const board = createGameBoard();
    const snapshot = getBoardSnapshot(board);

    expect(board.size).toEqual({ rows: 5, cols: 5 });
    expect(snapshot.targetPieceCount).toBe(8);
  });
});

describe('applyToolToCell', () => {
  it('places a selected piece on an empty square', () => {
    const board = applyToolToCell(createGameBoard(), 'queen', { row: 0, col: 0 });
    expect(board.pieces).toHaveLength(1);
    expect(board.pieces[0]?.type).toBe('queen');
  });

  it('replaces an occupied square with a different selected piece', () => {
    const board = placePiece(createGameBoard(), 'rook', { row: 1, col: 1 });
    const updated = applyToolToCell(board, 'bishop', { row: 1, col: 1 });

    expect(updated.pieces).toHaveLength(1);
    expect(updated.pieces[0]?.type).toBe('bishop');
  });

  it('removes an occupied square when the selected piece matches', () => {
    const board = placePiece(createGameBoard(), 'bishop', { row: 1, col: 1 });
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
      { row: 4, col: 4 }
    );

    expect(updated).toBe(filledBoard);
  });
});

describe('board status', () => {
  it('uses the configured required piece count', () => {
    const board = createBoard({ size: { rows: 6, cols: 6 }, requiredPieceCount: 3 });
    const snapshot = getBoardSnapshot(board);

    expect(snapshot.targetPieceCount).toBe(3);
  });

  it('reports conflicts and an eight-piece solved state', () => {
    let conflictBoard = placePiece(createGameBoard(), 'rook', { row: 0, col: 0 });
    conflictBoard = placePiece(conflictBoard, 'rook', { row: 0, col: 4 });

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
    [0, 2],
    [0, 4],
    [1, 1],
    [1, 3],
    [2, 0],
    [2, 2],
    [2, 4],
  ];

  return solution.reduce(
    (board, [row, col]) => placePiece(board, 'knight', { row, col }),
    createGameBoard()
  );
}
