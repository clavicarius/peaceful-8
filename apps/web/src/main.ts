/**
 * Peaceful 8 – Web App Entry Point
 *
 * Bootstraps the game UI inside #app.
 */

import { createBoard, placePiece, removePiece, validateBoard } from '@peaceful-8/engine';
import type { Board, PieceType } from '@peaceful-8/engine';

const PIECE_TYPES: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];
const PIECE_SYMBOLS: Record<PieceType, string> = {
  queen: '♛',
  rook: '♜',
  bishop: '♝',
  knight: '♞',
};

// ── State ──────────────────────────────────────────────────────────────────

let board: Board = createBoard();
let selectedType: PieceType = 'queen';

// ── DOM helpers ────────────────────────────────────────────────────────────

function el<T extends HTMLElement>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Element not found: ${selector}`);
  return node;
}

// ── Render ─────────────────────────────────────────────────────────────────

function render(): void {
  const result = validateBoard(board);
  const conflictIds = new Set(result.conflicts.flatMap((c) => [c.pieceA.id, c.pieceB.id]));

  // Status banner
  el<HTMLParagraphElement>('#status').textContent = result.valid
    ? '✅ Puzzle solved!'
    : board.pieces.length === 0
      ? 'Place 8 pieces so none attack each other.'
      : `${board.pieces.length} / 8 pieces placed – ${result.conflicts.length} conflict(s)`;

  // Board cells
  const cells = document.querySelectorAll<HTMLButtonElement>('.cell');
  cells.forEach((cell) => {
    const row = Number(cell.dataset['row']);
    const col = Number(cell.dataset['col']);
    const piece = board.pieces.find(
      (p: import('@peaceful-8/engine').Piece) => p.position.row === row && p.position.col === col
    );

    cell.textContent = piece ? PIECE_SYMBOLS[piece.type] : '';
    cell.classList.toggle('occupied', !!piece);
    cell.classList.toggle('conflict', piece ? conflictIds.has(piece.id) : false);
    cell.classList.toggle('solved', result.valid && !!piece);
  });

  // Piece selector buttons
  document.querySelectorAll<HTMLButtonElement>('.piece-btn').forEach((btn) => {
    btn.classList.toggle('selected', btn.dataset['type'] === selectedType);
  });
}

// ── Board setup ────────────────────────────────────────────────────────────

function buildBoard(): void {
  const grid = el<HTMLDivElement>('#board');
  grid.innerHTML = '';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('button');
      cell.className = `cell ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
      cell.dataset['row'] = String(row);
      cell.dataset['col'] = String(col);
      cell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}`);

      cell.addEventListener('click', () => {
        const pos = { row, col };
        const existing = board.pieces.find(
          (p: import('@peaceful-8/engine').Piece) =>
            p.position.row === row && p.position.col === col
        );
        if (existing) {
          board = removePiece(board, pos);
        } else if (board.pieces.length < 8) {
          board = placePiece(board, selectedType, pos);
        }
        render();
      });

      grid.appendChild(cell);
    }
  }
}

// ── Piece selector ─────────────────────────────────────────────────────────

function buildSelector(): void {
  const selector = el<HTMLDivElement>('#selector');
  PIECE_TYPES.forEach((type) => {
    const btn = document.createElement('button');
    btn.className = 'piece-btn';
    btn.dataset['type'] = type;
    btn.title = type.charAt(0).toUpperCase() + type.slice(1);
    btn.textContent = `${PIECE_SYMBOLS[type]} ${btn.title}`;
    btn.addEventListener('click', () => {
      selectedType = type;
      render();
    });
    selector.appendChild(btn);
  });
}

// ── Reset ──────────────────────────────────────────────────────────────────

function bindReset(): void {
  el<HTMLButtonElement>('#reset').addEventListener('click', () => {
    board = createBoard();
    render();
  });
}

// ── Init ───────────────────────────────────────────────────────────────────

buildBoard();
buildSelector();
bindReset();
render();
