import { createBoard } from './board.js';
import type { Board } from './board.js';
import type { LevelBoardLayout } from './types.js';

/** Creates an engine board from a level's width, height, and algebraic blocked cells. */
export function createBoardFromLevel(layout: LevelBoardLayout, requiredPieceCount?: number): Board {
  const blockedPositions = layout.blockedCells.map((cell) => parseCell(cell, layout.height));

  return createBoard({
    size: { rows: layout.height, cols: layout.width },
    blockedPositions,
    requiredPieceCount,
  });
}

function parseCell(cell: string, boardHeight: number): { row: number; col: number } {
  const match = /^([a-z]+)([1-9]\d*)$/i.exec(cell);
  if (!match) {
    throw new Error(`Invalid level cell coordinate: ${cell}.`);
  }

  const columnLabel = match[1].toUpperCase();
  const rank = Number(match[2]);
  let col = 0;
  for (const character of columnLabel) {
    col = col * 26 + character.charCodeAt(0) - 64;
  }

  return { row: boardHeight - rank, col: col - 1 };
}
