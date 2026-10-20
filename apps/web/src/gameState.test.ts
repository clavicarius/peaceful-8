import { describe, expect, it } from 'vitest';
import { createBoard, placePiece } from '@peaceful-8/engine';
import type { Board } from '@peaceful-8/engine';
import {
  applyDragPayload,
  applyToolToCell,
  DIFFICULTIES,
  FIXED_PIECE_COUNTS,
  createGameBoard,
  getBoardSnapshot,
  getStatusMessage,
  parsePlayerDragPayload,
  PLAYABLE_BOARD_SIZE,
  TARGET_PIECE_COUNT,
} from './gameState';

describe('createGameBoard', () => {
  it('creates a 5x5 board with the correct fixed pieces for each difficulty', () => {
    const board = createGameBoard();
    const snapshot = getBoardSnapshot(board);

    expect(board.size).toEqual({ rows: 5, cols: 5 });
    expect(snapshot.targetPieceCount).toBe(8);
    expect(board.pieces).toHaveLength(FIXED_PIECE_COUNTS.easy);
    expect(board.pieces.every((piece) => piece.fixed)).toBe(true);

    for (const difficulty of DIFFICULTIES) {
      const level = createGameBoard(difficulty);
      expect(level.pieces).toHaveLength(FIXED_PIECE_COUNTS[difficulty]);
      expect(level.pieces.every((piece) => piece.fixed)).toBe(true);
    }
  });
});

describe('applyToolToCell', () => {
  it('does not replace or remove a fixed piece', () => {
    const board = createGameBoard('hard');
    const fixedPosition = board.pieces[0]!.position;

    expect(applyToolToCell(board, 'erase', fixedPosition)).toBe(board);
    expect(applyToolToCell(board, 'queen', fixedPosition)).toBe(board);
  });

  it('places a selected piece on an empty square', () => {
    const board = applyToolToCell(createEmptyGameBoard(), 'queen', { row: 0, col: 0 });
    expect(board.pieces).toHaveLength(1);
    expect(board.pieces[0]?.type).toBe('queen');
  });

  it('replaces an occupied square with a different selected piece', () => {
    const board = placePiece(createEmptyGameBoard(), 'rook', { row: 1, col: 1 });
    const updated = applyToolToCell(board, 'bishop', { row: 1, col: 1 });

    expect(updated.pieces).toHaveLength(1);
    expect(updated.pieces[0]?.type).toBe('bishop');
  });

  it('removes an occupied square when the selected piece matches', () => {
    const board = placePiece(createEmptyGameBoard(), 'bishop', { row: 1, col: 1 });
    const updated = applyToolToCell(board, 'bishop', { row: 1, col: 1 });

    expect(updated.pieces).toHaveLength(0);
  });

  it('removes a piece when the erase tool is active', () => {
    const board = placePiece(createEmptyGameBoard(), 'knight', { row: 3, col: 3 });
    const updated = applyToolToCell(board, 'erase', { row: 3, col: 3 });

    expect(updated.pieces).toHaveLength(0);
  });

  it('toggles a blocked square without reducing the piece target', () => {
    const board = applyToolToCell(createEmptyGameBoard(), 'blocked', { row: 1, col: 1 });
    const snapshot = getBoardSnapshot(board);

    expect(board.blockedPositions).toEqual([{ row: 1, col: 1 }]);
    expect(snapshot.pieceCount).toBe(0);
    expect(snapshot.remainingSlots).toBe(8);
    expect(applyToolToCell(board, 'blocked', { row: 1, col: 1 }).blockedPositions).toEqual([]);
  });

  it('ignores placing a piece on a blocked square', () => {
    const board = applyToolToCell(createEmptyGameBoard(), 'blocked', { row: 1, col: 1 });

    expect(applyToolToCell(board, 'queen', { row: 1, col: 1 })).toBe(board);
  });
});

describe('applyDragPayload', () => {
  it('does not move a fixed board piece', () => {
    const board = createGameBoard('hard');
    const fixedPiece = board.pieces[0]!;

    expect(
      applyDragPayload(
        board,
        {
          kind: 'board-piece',
          pieceType: fixedPiece.type,
          position: fixedPiece.position,
        },
        { row: 4, col: 4 }
      )
    ).toBe(board);
  });

  it('moves a board piece to an empty square', () => {
    const board = placePiece(createEmptyGameBoard(), 'rook', { row: 0, col: 0 });
    const updated = applyDragPayload(
      board,
      { kind: 'board-piece', pieceType: 'rook', position: { row: 0, col: 0 } },
      { row: 2, col: 2 }
    );

    expect(updated.pieces).toHaveLength(1);
    expect(updated.pieces[0]?.position).toEqual({ row: 2, col: 2 });
  });

  it('does not move a piece onto a blocked square', () => {
    let board = applyToolToCell(createEmptyGameBoard(), 'blocked', { row: 2, col: 2 });
    board = placePiece(board, 'rook', { row: 0, col: 0 });

    const updated = applyDragPayload(
      board,
      { kind: 'board-piece', pieceType: 'rook', position: { row: 0, col: 0 } },
      { row: 2, col: 2 }
    );

    expect(updated).toBe(board);
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

describe('parsePlayerDragPayload', () => {
  it('rejects blocked-cell payloads while preserving supported player payloads', () => {
    expect(parsePlayerDragPayload('{"kind":"blocked"}')).toBeNull();
    expect(parsePlayerDragPayload('{"kind":"palette","pieceType":"queen"}')).toEqual({
      kind: 'palette',
      pieceType: 'queen',
    });
  });
});

describe('board status', () => {
  it('uses the configured required piece count', () => {
    const board = createBoard({ size: { rows: 6, cols: 6 }, requiredPieceCount: 3 });
    const snapshot = getBoardSnapshot(board);

    expect(snapshot.targetPieceCount).toBe(3);
  });

  it('reports conflicts and an eight-piece solved state', () => {
    let conflictBoard = placePiece(createEmptyGameBoard(), 'rook', { row: 0, col: 0 });
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
    createEmptyGameBoard()
  );
}

function createEmptyGameBoard(): Board {
  return createBoard({ size: PLAYABLE_BOARD_SIZE, requiredPieceCount: TARGET_PIECE_COUNT });
}
