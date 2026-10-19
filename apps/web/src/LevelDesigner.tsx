import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import {
  createBoard,
  getPieceAt,
  isBlockedPosition,
  isValidPosition,
  placePiece,
  toggleBlockedPosition,
} from '@peaceful-8/engine';
import type { Board, LevelDifficulty, PieceType } from '@peaceful-8/engine';
import './App.css';
import { AVAILABLE_PIECES, applyToolToCell, getBoardSnapshot, getStatusMessage } from './gameState';
import type { Tool } from './gameState';
import {
  createBoardForLevel,
  createCatalogImportGuard,
  deleteLevel as removeLevel,
  generateLevel,
  levelFromBoard,
  parseLevelFile,
  STARTER_LEVELS,
  upsertLevel,
  validateLevel,
} from './levels';
import type { LevelDefinition } from './levels';

const SYMBOLS: Record<PieceType, string> = {
  bishop: '♝',
  knight: '♞',
  queen: '♛',
  rook: '♜',
};
const DIFFICULTIES: ReadonlyArray<LevelDifficulty> = ['easy', 'medium', 'hard', 'extra-hard'];
const initialLevel = STARTER_LEVELS[0];

function LevelDesigner() {
  const [levels, setLevels] = useState<ReadonlyArray<LevelDefinition>>(STARTER_LEVELS);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(initialLevel?.id ?? null);
  const selectedLevelIdRef = useRef<number | null>(initialLevel?.id ?? null);
  const draftRevisionRef = useRef(0);
  const catalogImportGuardRef = useRef(createCatalogImportGuard());
  const [draftId, setDraftId] = useState(initialLevel?.id ?? 1);
  const [difficulty, setDifficulty] = useState<LevelDifficulty>(initialLevel?.difficulty ?? 'easy');
  const [width, setWidth] = useState(initialLevel?.board.width ?? 5);
  const [height, setHeight] = useState(initialLevel?.board.height ?? 5);
  const [board, setBoard] = useState(() =>
    initialLevel
      ? createEditableBoard(initialLevel)
      : createBoard({ size: { rows: 5, cols: 5 }, requiredPieceCount: 8 })
  );
  const [selectedTool, setSelectedTool] = useState<Tool>('queen');
  const [message, setMessage] = useState('');
  const snapshot = useMemo(() => getBoardSnapshot(board), [board]);
  const selectedLevel = levels.find((level) => level.id === selectedLevelId);

  const markDraftChanged = () => {
    draftRevisionRef.current += 1;
  };

  const loadLevel = (level: LevelDefinition) => {
    selectedLevelIdRef.current = level.id;
    markDraftChanged();
    setSelectedLevelId(level.id);
    setDraftId(level.id);
    setDifficulty(level.difficulty);
    setWidth(level.board.width);
    setHeight(level.board.height);
    setBoard(createEditableBoard(level));
    setMessage('');
  };

  const createNewLevel = () => {
    const id = Math.max(0, ...levels.map((level) => level.id)) + 1;
    selectedLevelIdRef.current = null;
    markDraftChanged();
    setSelectedLevelId(null);
    setDraftId(id);
    setDifficulty('easy');
    setWidth(5);
    setHeight(5);
    setBoard(createBoard({ size: { rows: 5, cols: 5 }, requiredPieceCount: 8 }));
    setMessage(`Editing new level ${id}.`);
  };

  const resizeDraft = () => {
    if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1) {
      setMessage('Board dimensions must be positive integers.');
      return;
    }

    const nextBoard = createBoard({ size: { rows: height, cols: width }, requiredPieceCount: 8 });
    const withBlocks = board.blockedPositions.reduce(
      (currentBoard, position) =>
        isValidPosition(position, nextBoard.size)
          ? toggleBlockedPosition(currentBoard, position)
          : currentBoard,
      nextBoard
    );
    const withPieces = board.pieces.reduce((currentBoard, piece) => {
      if (
        !isValidPosition(piece.position, currentBoard.size) ||
        isBlockedPosition(currentBoard, piece.position)
      ) {
        return currentBoard;
      }
      return placePiece(currentBoard, piece.type, piece.position);
    }, withBlocks);
    markDraftChanged();
    setBoard(withPieces);
    setMessage('Board size updated.');
  };

  const saveLevel = () => {
    const fixedBoard: Board = {
      ...board,
      pieces: board.pieces.map((piece) => ({ ...piece, fixed: true })),
    };
    const level = levelFromBoard(fixedBoard, draftId, difficulty);
    const validation = validateLevel(level);
    if (!validation.valid) {
      setMessage(
        `Level is invalid (${validation.solutionCount} solutions): ${validation.errors.join(' ')}`
      );
      return;
    }

    catalogImportGuardRef.current.catalogChanged();
    setLevels((currentLevels) => upsertLevel(currentLevels, level));
    selectedLevelIdRef.current = draftId;
    markDraftChanged();
    setSelectedLevelId(draftId);
    setBoard(createEditableBoard(level));
    setMessage(
      `Level ${draftId} is valid (${validation.solutionCount} solution(s)). Export JSON to save it manually.`
    );
  };

  const generate = () => {
    try {
      const layout = levelFromBoard(
        { ...board, pieces: board.pieces.map((piece) => ({ ...piece, fixed: true })) },
        draftId,
        difficulty
      );
      const level = generateLevel(draftId, difficulty, width, height, layout.board.blockedCells);
      markDraftChanged();
      setBoard(createEditableBoard(level));
      setMessage(`Generated a valid ${difficulty} level. Save it to add it to the catalog.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to generate a level.');
    }
  };

  const deleteLevel = () => {
    if (!selectedLevel || !globalThis.confirm(`Delete level ${selectedLevel.id}?`)) {
      return;
    }

    const remainingLevels = removeLevel(levels, selectedLevel.id);
    catalogImportGuardRef.current.catalogChanged();
    setLevels(remainingLevels);
    if (remainingLevels[0]) {
      loadLevel(remainingLevels[0]);
    } else {
      setSelectedLevelId(null);
      selectedLevelIdRef.current = null;
      markDraftChanged();
      setDraftId(1);
      setBoard(createBoard({ size: board.size, requiredPieceCount: 8 }));
      setMessage('Level deleted. Create or import a level before exporting.');
    }
  };

  const importLevels = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const importRevision = catalogImportGuardRef.current.begin();
    const selectedLevelAtImport = selectedLevelIdRef.current;
    const draftRevisionAtImport = draftRevisionRef.current;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseLevelFile(String(reader.result));
        if (!catalogImportGuardRef.current.commit(importRevision)) {
          setMessage('Import discarded because the catalog changed or a newer import started.');
          return;
        }

        setLevels((currentLevels) => {
          const merged = new Map(currentLevels.map((level) => [level.id, level]));
          imported.forEach((level) => merged.set(level.id, level));
          return [...merged.values()].sort((left, right) => left.id - right.id);
        });
        const selectedReplacement = imported.find((level) => level.id === selectedLevelAtImport);
        if (
          selectedReplacement &&
          selectedLevelIdRef.current === selectedLevelAtImport &&
          draftRevisionRef.current === draftRevisionAtImport
        ) {
          loadLevel(selectedReplacement);
        }
        setMessage(`Imported ${imported.length} validated level(s).`);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Unable to import levels.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const exportLevels = () => {
    const blob = new Blob([JSON.stringify(levels, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'peaceful-8-levels.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Level catalog downloaded. Add the file to the repository and commit it manually.');
  };

  return (
    <main className="app-shell">
      <section className="panel intro-panel">
        <p className="eyebrow">Developer-only level designer</p>
        <h1>Level Designer</h1>
        <p className="intro-copy">
          Build or generate levels, validate them with the game solver, then export JSON for manual
          review and version control.
        </p>
        {message && (
          <p className="designer-message" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="designer-layout">
        <aside className="panel toolbox-panel">
          <label className="field-label">
            Edit level
            <select
              value={selectedLevelId ?? ''}
              onChange={(event) => {
                const level = levels.find(
                  (candidate) => candidate.id === Number(event.target.value)
                );
                if (level) loadLevel(level);
              }}
            >
              <option value="" disabled>
                New unsaved level
              </option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.id} · {level.difficulty}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={createNewLevel}>
            New level
          </button>
          <label className="field-label">
            Difficulty
            <select
              value={difficulty}
              onChange={(event) => {
                markDraftChanged();
                setDifficulty(event.target.value as LevelDifficulty);
              }}
            >
              {DIFFICULTIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <div className="dimension-fields">
            <label className="field-label">
              Width
              <input
                type="number"
                min="1"
                value={width}
                onChange={(event) => {
                  markDraftChanged();
                  setWidth(Number(event.target.value));
                }}
              />
            </label>
            <label className="field-label">
              Height
              <input
                type="number"
                min="1"
                value={height}
                onChange={(event) => {
                  markDraftChanged();
                  setHeight(Number(event.target.value));
                }}
              />
            </label>
          </div>
          <button type="button" className="secondary-button" onClick={resizeDraft}>
            Apply board size
          </button>
          <div className="tool-grid">
            {AVAILABLE_PIECES.map((pieceType) => (
              <button
                key={pieceType}
                type="button"
                className={`tool-button ${selectedTool === pieceType ? 'selected' : ''}`}
                onClick={() => setSelectedTool(pieceType)}
              >
                <span className="tool-symbol">{SYMBOLS[pieceType]}</span>
                <span>{pieceType}</span>
              </button>
            ))}
            <button
              type="button"
              className={`tool-button ${selectedTool === 'blocked' ? 'selected' : ''}`}
              onClick={() => setSelectedTool('blocked')}
            >
              ▧ Blocked
            </button>
            <button
              type="button"
              className={`tool-button ${selectedTool === 'erase' ? 'selected' : ''}`}
              onClick={() => setSelectedTool('erase')}
            >
              ⌫ Erase
            </button>
          </div>
          <button type="button" className="secondary-button" onClick={generate}>
            Generate level
          </button>
          <button type="button" className="secondary-button" onClick={saveLevel}>
            Validate and save draft
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={deleteLevel}
            disabled={!selectedLevel}
          >
            Delete level
          </button>
          <button type="button" className="secondary-button" onClick={exportLevels}>
            Export JSON
          </button>
          <label className="secondary-button file-button">
            Import level catalog
            <input type="file" accept="application/json,.json" onChange={importLevels} />
          </label>
          <p className="designer-note">
            Export does not write to the repository or create a Git commit.
          </p>
        </aside>

        <section className="panel board-panel">
          <div className={`status-banner status-${snapshot.status}`} aria-live="polite">
            {getStatusMessage(snapshot)}
          </div>
          <p className="stats-row">
            <span>
              {snapshot.pieceCount} / {snapshot.targetPieceCount} clues
            </span>
            <span>{snapshot.conflictCount} conflicts</span>
          </p>
          <div
            className="board"
            role="grid"
            aria-label={`Level designer ${board.size.cols} by ${board.size.rows} board`}
            style={{ '--board-columns': String(board.size.cols) } as CSSProperties}
          >
            {Array.from({ length: board.size.rows }, (_, row) =>
              Array.from({ length: board.size.cols }, (_, col) => {
                const position = { row, col };
                const piece = getPieceAt(board, position);
                const blocked = isBlockedPosition(board, position);
                const conflict = piece ? snapshot.conflictingPieceIds.has(piece.id) : false;
                return (
                  <button
                    key={`${row}-${col}`}
                    type="button"
                    role="gridcell"
                    aria-label={`${blocked ? 'Blocked' : (piece?.type ?? 'Empty')} square ${col + 1}, ${row + 1}`}
                    className={`board-cell ${(row + col) % 2 === 0 ? 'light' : 'dark'} ${
                      blocked ? 'blocked' : ''
                    } ${conflict ? 'conflict' : ''}`}
                    onClick={() => {
                      markDraftChanged();
                      setBoard((currentBoard) =>
                        applyToolToCell(currentBoard, selectedTool, position)
                      );
                    }}
                  >
                    {blocked ? '▧' : piece ? SYMBOLS[piece.type] : ''}
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

function createEditableBoard(level: LevelDefinition): Board {
  const board = createBoardForLevel(level);
  return { ...board, pieces: board.pieces.map((piece) => ({ ...piece, fixed: false })) };
}

export default LevelDesigner;
