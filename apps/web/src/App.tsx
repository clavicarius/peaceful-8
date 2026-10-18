import { lazy, Suspense, useState } from 'react';
import PlayerMode from './PlayerMode';

const LevelDesigner = lazy(() => import('./LevelDesigner'));

function App() {
  const [mode, setMode] = useState<'player' | 'designer'>('player');

  if (!import.meta.env.DEV || mode === 'player') {
    return (
      <>
        {import.meta.env.DEV && (
          <nav className="mode-navigation" aria-label="Application mode">
            <button type="button" aria-current="page">
              Player mode
            </button>
            <button type="button" onClick={() => setMode('designer')}>
              Level designer
            </button>
          </nav>
        )}
        <PlayerMode />
      </>
    );
  }

  return (
    <>
      <nav className="mode-navigation" aria-label="Application mode">
        <button type="button" onClick={() => setMode('player')}>
          Player mode
        </button>
        <button type="button" aria-current="page">
          Level designer
        </button>
      </nav>
      <Suspense fallback={<p className="loading-message">Loading level designer…</p>}>
        <LevelDesigner />
      </Suspense>
    </>
  );
}

export default App;
