import {
  createBoard,
  detectConflicts,
  getPieceAt,
  movePiece,
  placePiece,
  removePiece,
  validateBoard,
} from '@peaceful-8/engine';
import type { Board, PieceType, Position } from '@peaceful-8/engine';

export type Tool = PieceType | 'erase';

export type DragPayload =
  | { kind: 'palette'; pieceType: PieceType }
  | { kind: 'board-piece'; pieceType: PieceType; position: Position };

export interface BoardSnapshot {
  readonly targetPieceCount: number;
  readonly conflictCount: number;
  readonly conflictingPieceIds: ReadonlySet<string>;
  readonly pieceCount: number;
  readonly remainingSlots: number;
  readonly solved: boolean;
  readonly status: 'incomplete' | 'complete' | 'conflict' | 'solved';
}

export const DEFAULT_TOOL: Tool = 'queen';

export const AVAILABLE_PIECES: ReadonlyArray<PieceType> = ['queen', 'rook', 'bishop', 'knight'];
export const PLAYABLE_BOARD_SIZE = { rows: 5, cols: 5 } as const;
export const PLAYABLE_TARGET_PIECE_COUNT = PLAYABLE_BOARD_SIZE.rows;

export function createGameBoard(): Board {
  return createBoard(PLAYABLE_BOARD_SIZE);
}

export function serializeDragPayload(payload: DragPayload): string {
  return JSON.stringify(payload);
}

export function parseDragPayload(value: string): DragPayload | null {
  try {
    const parsed = JSON.parse(value) as Partial<DragPayload>;

    if (parsed.kind === 'palette' && typeof parsed.pieceType === 'string') {
      return { kind: 'palette', pieceType: parsed.pieceType as PieceType };
    }

    if (
      parsed.kind === 'board-piece' &&
      typeof parsed.pieceType === 'string' &&
      parsed.position &&
      typeof parsed.position.row === 'number' &&
      typeof parsed.position.col === 'number'
    ) {
      return {
        kind: 'board-piece',
        pieceType: parsed.pieceType as PieceType,
        position: parsed.position,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function applyToolToCell(board: Board, tool: Tool, position: Position): Board {
  if (tool === 'erase') {
    return removePiece(board, position);
  }

  const existingPiece = getPieceAt(board, position);
  if (existingPiece) {
    return existingPiece.type === tool
      ? removePiece(board, position)
      : placePiece(removePiece(board, position), tool, position);
  }

  if (board.pieces.length >= PLAYABLE_TARGET_PIECE_COUNT) {
    return board;
  }

  return placePiece(board, tool, position);
}

export function applyDragPayload(board: Board, payload: DragPayload, position: Position): Board {
  const targetPiece = getPieceAt(board, position);
  if (targetPiece) {
    return board;
  }

  if (payload.kind === 'palette') {
    if (board.pieces.length >= PLAYABLE_TARGET_PIECE_COUNT) {
      return board;
    }

    return placePiece(board, payload.pieceType, position);
  }

  return movePiece(board, payload.position, position);
}

export function getBoardSnapshot(board: Board): BoardSnapshot {
  const validation = validateBoard(board);
  const conflictingPieceIds = collectConflictingPieceIds(board);
  const pieceCount = board.pieces.length;
  const targetPieceCount = PLAYABLE_TARGET_PIECE_COUNT;
  const remainingSlots = Math.max(targetPieceCount - pieceCount, 0);

  if (validation.valid) {
    return {
      targetPieceCount,
      conflictCount: 0,
      conflictingPieceIds,
      pieceCount,
      remainingSlots,
      solved: true,
      status: 'solved',
    };
  }

  if (validation.conflicts.length > 0) {
    return {
      targetPieceCount,
      conflictCount: validation.conflicts.length,
      conflictingPieceIds,
      pieceCount,
      remainingSlots,
      solved: false,
      status: 'conflict',
    };
  }

  return {
    targetPieceCount,
    conflictCount: 0,
    conflictingPieceIds,
    pieceCount,
    remainingSlots,
    solved: false,
    status: pieceCount === targetPieceCount ? 'complete' : 'incomplete',
  };
}

export function getStatusMessage(snapshot: BoardSnapshot): string {
  if (snapshot.status === 'solved') {
    return `Solved! ${snapshot.targetPieceCount} peaceful pieces are on the board.`;
  }

  if (snapshot.status === 'conflict') {
    const suffix = snapshot.conflictCount === 1 ? '' : 's';
    return `${snapshot.conflictCount} conflict${suffix} highlighted in red.`;
  }

  if (snapshot.status === 'complete') {
    return `${snapshot.targetPieceCount} pieces placed. Rearrange them until no attacks remain.`;
  }

  const suffix = snapshot.remainingSlots === 1 ? '' : 's';
  return `Place ${snapshot.remainingSlots} more piece${suffix} to complete the puzzle.`;
}

function collectConflictingPieceIds(board: Board): ReadonlySet<string> {
  const conflictingPieceIds = new Set<string>();

  for (const conflict of detectConflicts(board)) {
    conflictingPieceIds.add(conflict.pieceA.id);
    conflictingPieceIds.add(conflict.pieceB.id);
  }

  return conflictingPieceIds;
}
