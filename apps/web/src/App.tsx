import { lazy, Suspense, useState } from 'react';
import PlayerMode from './PlayerMode';

const LevelDesigner = import.meta.env.DEV ? lazy(() => import('./LevelDesigner')) : null;

function App() {
  const [mode, setMode] = useState<'player' | 'designer'>('player');
  const [hasVisitedDesigner, setHasVisitedDesigner] = useState(false);

  if (!import.meta.env.DEV) {
    return <PlayerMode />;
  }

  const openDesigner = () => {
    setHasVisitedDesigner(true);
    setMode('designer');
  };

  return (
    <>
      <nav className="mode-navigation" aria-label="Application mode">
        <button
          type="button"
          aria-current={mode === 'player' ? 'page' : undefined}
          onClick={() => setMode('player')}
        >
          Player mode
        </button>
        <button
          type="button"
          aria-current={mode === 'designer' ? 'page' : undefined}
          onClick={openDesigner}
        >
          Level designer
        </button>
      </nav>
      <div hidden={mode !== 'player'}>
        <PlayerMode />
      </div>
      {hasVisitedDesigner && LevelDesigner && (
        <div hidden={mode !== 'designer'}>
          <Suspense fallback={<p className="loading-message">Loading level designer…</p>}>
            <LevelDesigner />
          </Suspense>
        </div>
      )}
    </>
  );
}

export default App;
