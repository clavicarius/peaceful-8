import { useMemo, useState } from 'react';
import type { CSSProperties, DragEvent } from 'react';
import { getPieceAt } from '@peaceful-8/engine';
import type { Board, PieceType, Position } from '@peaceful-8/engine';
import './App.css';
import {
  AVAILABLE_PIECES,
  DEFAULT_TOOL,
  applyDragPayload,
  applyToolToCell,
  getBoardSnapshot,
  getStatusMessage,
  parseDragPayload,
  serializeDragPayload,
} from './gameState';
import type { Tool } from './gameState';
import { createBoardForLevel, STARTER_LEVELS } from './levels';

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

function PlayerMode() {
  const [levelId, setLevelId] = useState<number | null>(STARTER_LEVELS[0]?.id ?? null);
  const level = STARTER_LEVELS.find((candidate) => candidate.id === levelId);
  const [board, setBoard] = useState<Board | null>(() =>
    level ? createBoardForLevel(level) : null
  );
  const [selectedTool, setSelectedTool] = useState<Tool>(DEFAULT_TOOL);
  const snapshot = useMemo(() => (board ? getBoardSnapshot(board) : null), [board]);

  const handleCellClick = (position: Position) => {
    setBoard((currentBoard) =>
      currentBoard ? applyToolToCell(currentBoard, selectedTool, position) : currentBoard
    );
  };

  const handleDrop = (event: DragEvent<HTMLElement>, position: Position) => {
    event.preventDefault();
    const payload = parseDragPayload(event.dataTransfer.getData('text/plain'));

    if (!payload) {
      return;
    }

    setBoard((currentBoard) =>
      currentBoard ? applyDragPayload(currentBoard, payload, position) : currentBoard
    );
  };

  const selectLevel = (nextLevelId: number) => {
    const nextLevel = STARTER_LEVELS.find((candidate) => candidate.id === nextLevelId);
    if (nextLevel) {
      setLevelId(nextLevel.id);
      setBoard(createBoardForLevel(nextLevel));
    }
  };

  if (!level || !board || !snapshot) {
    return (
      <main className="app-shell">
        <section className="panel intro-panel">
          <p className="eyebrow">Player mode · {versionTag}</p>
          <h1>Peaceful 8</h1>
          <p>No levels are currently available.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="panel intro-panel">
        <p className="eyebrow">Player mode · {versionTag}</p>
        <h1>Peaceful 8</h1>
        <p className="intro-copy">
          Solve repository levels by placing pieces without attacks. Red squares mark conflicts;
          blocked squares are defined by each level.
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
        <label className="level-select">
          Level
          <select
            value={levelId ?? ''}
            onChange={(event) => selectLevel(Number(event.target.value))}
          >
            {STARTER_LEVELS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id} · {option.difficulty}
              </option>
            ))}
          </select>
        </label>
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
          <button type="button" className="secondary-button" onClick={() => selectLevel(level.id)}>
            Restart level
          </button>
        </aside>

        <section className="panel board-panel">
          <div
            className="board"
            role="grid"
            aria-label={`Peaceful 8 ${board.size.cols}x${board.size.rows} board`}
            style={{ '--board-columns': String(board.size.cols) } as CSSProperties}
          >
            {Array.from({ length: board.size.rows }, (_, row) =>
              Array.from({ length: board.size.cols }, (_, col) => {
                const position = { row, col };
                const piece = getPieceAt(board, position);
                const conflict = piece ? snapshot.conflictingPieceIds.has(piece.id) : false;
                const blocked = board.blockedPositions.some(
                  (blockedPosition) => blockedPosition.row === row && blockedPosition.col === col
                );
                const squareTone = (row + col) % 2 === 0 ? 'light' : 'dark';

                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    role="gridcell"
                    className={`board-cell ${squareTone} ${conflict ? 'conflict' : ''} ${
                      blocked ? 'blocked' : ''
                    }`}
                    aria-label={buildCellLabel(
                      position,
                      board.size.rows,
                      piece?.type,
                      conflict,
                      blocked,
                      piece?.fixed
                    )}
                    onClick={() => handleCellClick(position)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, position)}
                  >
                    {piece ? (
                      <span
                        className="piece-token"
                        draggable={!piece.fixed}
                        title={piece.fixed ? 'Fixed piece' : undefined}
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
                        {piece.fixed && (
                          <span className="fixed-indicator" aria-hidden="true">
                            🔒
                          </span>
                        )}
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
  conflict = false,
  blocked = false,
  fixed = false
): string {
  const coordinate = `${String.fromCharCode(97 + position.col)}${boardRows - position.row}`;
  if (blocked) {
    return `Blocked square ${coordinate}`;
  }

  if (!pieceType) {
    return `Empty square ${coordinate}`;
  }

  const conflictMessage = conflict ? ' in conflict' : '';
  const fixedMessage = fixed ? ' (fixed)' : '';
  return `${PIECE_LABELS[pieceType]} on ${coordinate}${conflictMessage}${fixedMessage}`;
}

export default PlayerMode;
