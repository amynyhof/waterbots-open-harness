/**
 * The map shell.
 *
 * Full-viewport working shell per the Working Surface Standard: chrome is one
 * hairline row, content starts high, and only the map fills the remainder.
 * The left rail and chat dock arrive at step 6.
 */

import { useCallback, useState } from 'react';
import BasinMap, { type MapStatus } from './components/BasinMap';

export default function App() {
  const [status, setStatus] = useState<MapStatus | null>(null);
  const onStatus = useCallback((s: MapStatus) => setStatus(s), []);

  return (
    <div
      className="theme-light"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper)',
        color: 'var(--fg-1)',
      }}
    >
      <header
        className="chrome"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '12px var(--gutter)',
          flex: 'none',
        }}
      >
        <span className="wordmark" style={{ fontSize: 17 }}>
          WaterBots<span className="dot-ai">.AI</span>
        </span>

        {/* Step 2 scaffolding: states which layer is live so the zoom swap can
            be confirmed by eye. Replaced by the legend at step 4. */}
        {status && (
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
            {status.stressError ? (
              <span style={{ color: 'var(--state-warn)' }}>
                Water stress data unavailable — basins are shown unfilled
              </span>
            ) : status.detailError ? (
              <span style={{ color: 'var(--state-warn)' }}>
                Detailed basins unavailable — showing the world view
              </span>
            ) : status.loadingDetail ? (
              'Loading detailed basins…'
            ) : (
              <>
                HydroSHEDS Level {status.level} &middot;{' '}
                {status.level === 4 ? 'world view' : 'detail view'} &middot;{' '}
                {status.rendered.toLocaleString()} basins drawn &middot; zoom {status.zoom}
              </>
            )}
          </span>
        )}
      </header>

      <main style={{ flex: 1, minHeight: 0 }}>
        <BasinMap onStatus={onStatus} />
      </main>
    </div>
  );
}
