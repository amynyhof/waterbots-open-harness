/**
 * The console shell.
 *
 * Working Surface Standard §1 and §2: a full-viewport frame, fixed left rail
 * and right chat dock, and only the centre scrolls. Chrome is one hairline
 * row; content starts high with no dead padding above it.
 *
 * Three zones on the surface ladder — the rail and the chat dock sit on
 * --chrome below the canvas, flush and square; the centre is the canvas.
 */

import { useCallback, useState } from 'react';
import BasinMap, { type MapStatus } from './components/BasinMap';
import NavRail from './components/NavRail';
import ChatPanel from './components/ChatPanel';
import Wordmark from './components/Wordmark';

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
      {/* One hairline row. The wordmark anchors flush top-left on every surface. */}
      <header
        className="chrome"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '12px var(--gutter)',
          borderBottom: '1px solid var(--line)',
          flex: 'none',
        }}
      >
        <Wordmark height={22} />

        {/* Step 2 scaffolding: states which layer is live so the zoom swap can
            be confirmed by eye. Replaced when the map gains its own chrome. */}
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
                {status.rendered.toLocaleString()} basins drawn &middot; zoom{' '}
                {status.zoom.toFixed(1)}
              </>
            )}
          </span>
        )}
      </header>

      {/* Rails are fixed; only the centre scrolls. The centre takes no minimum
          width — a full-viewport working shell must never scroll sideways, and
          a horizontal scrollbar is a worse failure than a narrow map. The
          rail collapses instead, and the map holds a zoom floor so it stays
          readable rather than shrinking to a postage stamp. */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <NavRail />
        <main style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
          <BasinMap onStatus={onStatus} />
        </main>
        <ChatPanel />
      </div>
    </div>
  );
}
