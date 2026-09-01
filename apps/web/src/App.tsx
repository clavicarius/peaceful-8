import { useMemo, useState } from 'react';
import type { CSSProperties, DragEvent } from 'react';
import { getPieceAt } from '@peaceful-8/engine';
import type { PieceType, Position } from '@peaceful-8/engine';
import './App.css';
import {
  AVAILABLE_PIECES,
  DEFAULT_TOOL,
  applyDragPayload,
  applyToolToCell,
  createGameBoard,
  getBoardSnapshot,
  getStatusMessage,
  parseDragPayload,
  serializeDragPayload,
} from './gameState';
import type { Tool } from './gameState';

const PIECE_SYMBOLS: Record<PieceType, string> = {
  bishop: '♝',
  knight: '♞',
  queen: '♛',
  rook: '♜',
};

const PIECE_LABELS: Record<PieceType, string> = {
  bishop: 'Bishop',
  knight: 'Knight',
  queen: 'Queen',
  rook: 'Rook',
};

const versionTag = import.meta.env.VITE_VERSION_TAG ?? 'development';

function App() {
  const [board, setBoard] = useState(createGameBoard);
  const [selectedTool, setSelectedTool] = useState<Tool>(DEFAULT_TOOL);
  const snapshot = useMemo(() => getBoardSnapshot(board), [board]);

  const handleCellClick = (position: Position) => {
    setBoard((currentBoard) => applyToolToCell(currentBoard, selectedTool, position));
  };

  const handleDrop = (event: DragEvent<HTMLElement>, position: Position) => {
    event.preventDefault();
    const payload = parseDragPayload(event.dataTransfer.getData('text/plain'));

    if (!payload) {
      return;
    }

    setBoard((currentBoard) => applyDragPayload(currentBoard, payload, position));
  };

  const resetBoard = () => {
    setBoard(createGameBoard());
  };

  return (
    <main className="app-shell">
      <section className="panel intro-panel">
        <p className="eyebrow">[WIP] Playable prototype {versionTag}</p>
        <h1>Peaceful 8</h1>
        <p className="intro-copy">
          Play the 5x5 prototype by dragging pieces onto the board or clicking a tool and then a
          square to place or remove it. Red squares mark attacking pieces.
        </p>
        <div className={`status-banner status-${snapshot.status}`} aria-live="polite">
          {getStatusMessage(snapshot)}
        </div>
        <div className="stats-row">
          <span>
            {snapshot.pieceCount} / {snapshot.targetPieceCount} pieces placed
          </span>
          <span>{snapshot.conflictCount} conflicts</span>
        </div>
      </section>

      <section className="layout">
        <aside className="panel toolbox-panel">
          <h2>Tools</h2>
          <div className="tool-grid">
            {AVAILABLE_PIECES.map((pieceType) => (
              <PaletteButton
                key={pieceType}
                label={PIECE_LABELS[pieceType]}
                pieceType={pieceType}
                selected={selectedTool === pieceType}
                onSelect={setSelectedTool}
              />
            ))}
            <button
              type="button"
              className={`tool-button ${selectedTool === 'erase' ? 'selected' : ''}`}
              onClick={() => setSelectedTool('erase')}
            >
              <span className="tool-symbol">⌫</span>
              <span>Erase</span>
            </button>
          </div>
          <button type="button" className="secondary-button" onClick={resetBoard}>
            Reset board
          </button>
        </aside>

        <section className="panel board-panel">
          <div
            className="board"
            role="grid"
            aria-label="Peaceful 8 5x5 board"
            style={{ '--board-columns': String(board.size.cols) } as CSSProperties}
          >
            {Array.from({ length: board.size.rows }, (_, row) =>
              Array.from({ length: board.size.cols }, (_, col) => {
                const position = { row, col };
                const piece = getPieceAt(board, position);
                const conflict = piece ? snapshot.conflictingPieceIds.has(piece.id) : false;
                const squareTone = (row + col) % 2 === 0 ? 'light' : 'dark';

                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    role="gridcell"
                    className={`board-cell ${squareTone} ${conflict ? 'conflict' : ''}`}
                    aria-label={buildCellLabel(position, board.size.rows, piece?.type, conflict)}
                    onClick={() => handleCellClick(position)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, position)}
                  >
                    {piece ? (
                      <span
                        className="piece-token"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(
                            'text/plain',
                            serializeDragPayload({
                              kind: 'board-piece',
                              pieceType: piece.type,
                              position,
                            })
                          );
                        }}
                      >
                        {PIECE_SYMBOLS[piece.type]}
                      </span>
                    ) : (
                      <span className="cell-coordinate">
                        {String.fromCharCode(97 + col)}
                        {board.size.rows - row}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

interface PaletteButtonProps {
  readonly label: string;
  readonly pieceType: PieceType;
  readonly selected: boolean;
  readonly onSelect: (tool: Tool) => void;
}

function PaletteButton({ label, pieceType, selected, onSelect }: PaletteButtonProps) {
  return (
    <button
      type="button"
      draggable
      className={`tool-button ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(pieceType)}
      onDragStart={(event) => {
        event.dataTransfer.setData(
          'text/plain',
          serializeDragPayload({ kind: 'palette', pieceType })
        );
      }}
    >
      <span className="tool-symbol">{PIECE_SYMBOLS[pieceType]}</span>
      <span>{label}</span>
    </button>
  );
}

function buildCellLabel(
  position: Position,
  boardRows: number,
  pieceType?: PieceType,
  conflict = false
): string {
  if (!pieceType) {
    return `Empty square ${String.fromCharCode(97 + position.col)}${boardRows - position.row}`;
  }

  const conflictMessage = conflict ? ' in conflict' : '';
  return `${PIECE_LABELS[pieceType]} on ${String.fromCharCode(97 + position.col)}${
    boardRows - position.row
  }${conflictMessage}`;
}

export default App;
