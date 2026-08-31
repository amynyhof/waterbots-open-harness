/**
 * The console shell.
 *
 * Working Surface Standard §1 and §2: a full-viewport frame, fixed left rail
 * and right chat dock, and only the centre scrolls. Chrome is one hairline
 * row; content starts high with no dead padding above it.
 *
 * Three planes and no fourth (BRAND.md §2.3), and two grounds. The frame —
 * top bar, rail, both docks — sits on --frame #FBFBFE. The content canvas is
 * --paper #F6F5FA, and the map and the worksheet sit on it. Content warm,
 * frame lighter and receding. Maintainer's ruling, 29 Aug 2026; the record is
 * item S9.
 *
 * TWO SURFACES, AND NOTHING IS UNMOUNTED WHEN YOU LEAVE IT. Switching surface
 * hides what you left rather than throwing it away — the map, and both chat
 * docks alongside it.
 *
 * For the map, unmounting would throw away the Level 6 layer and re-fetch
 * 8.44 MB on the way back, which is a real cost to a visitor on a metered
 * connection, and it would lose the reader's zoom and position.
 *
 * FOR THE CHAT DOCKS, UNMOUNTING THREW AWAY THE CONVERSATION. A visitor could
 * work through several criteria with Phoebe, glance at the map, come back, and
 * find the worksheet still filled in but every word of the conversation gone.
 * The worksheet survived because its state is held here; the conversation did
 * not, because it is held inside the dock. That mismatch read as the product
 * losing someone's work (found 23 Aug 2026, item S4).
 *
 * A REFRESH STILL EMPTIES EVERYTHING, and the page says so. That is the
 * no-memory-across-visits ruling of 21 Aug 2026 and it stands. Stepping over to
 * the map and back is not a new visit, so it must not behave like one.
 *
 * Each surface brings its own host: Bridget sits with the map, Phoebe with
 * the worksheet. Phoebe answers from her cards through the relay; Bridget is
 * still a placeholder and says so.
 */

import { useCallback, useState } from 'react';
import BasinMap, { type MapStatus } from './components/BasinMap';
import NavRail from './components/NavRail';
import ChatPanel from './components/ChatPanel';
import PhoebePanel from './components/PhoebePanel';
import EligibilityWorksheet from './components/EligibilityWorksheet';
import Wordmark from './components/Wordmark';
import { DEFAULT_SURFACE, type Surface } from './lib/surfaces';
import { CRITERIA } from './lib/phoebeCards';
import { initialStatuses, type CriterionStatus } from './lib/criteriaState';
import type { CriterionUpdate } from './lib/phoebeClient';

export default function App() {
  const [status, setStatus] = useState<MapStatus | null>(null);
  const onStatus = useCallback((s: MapStatus) => setStatus(s), []);

  const [surface, setSurface] = useState<Surface>(DEFAULT_SURFACE);
  const openMap = useCallback(() => setSurface('map'), []);

  /* The worksheet lives here so Phoebe's answers and the rows she is filling
     in cannot disagree. It is plain component state and nothing writes it to
     storage — v1 keeps no memory across visits, and a reload starts over. */
  const [statuses, setStatuses] = useState<CriterionStatus[]>(() =>
    initialStatuses(CRITERIA.length)
  );

  const applyUpdates = useCallback((updates: CriterionUpdate[]) => {
    setStatuses((current) => {
      const next = [...current];
      for (const update of updates) {
        const index = CRITERIA.findIndex((c) => c.number === update.number);
        if (index < 0) continue;
        next[index] =
          update.state === 'not-yet'
            ? { state: 'not-yet', routeForward: update.routeForward }
            : { state: 'met' };
      }
      return next;
    });
  }, []);

  const onMap = surface === 'map';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--paper)',
        color: 'var(--ink)',
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

        {/* The layer readout describes the map, so it only shows on the map. */}
        {onMap && status && (
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
            {status.stressError ? (
              <span style={{ color: 'var(--state-warn-text)' }}>
                Water stress data unavailable — basins are shown unfilled
              </span>
            ) : status.detailError ? (
              <span style={{ color: 'var(--state-warn-text)' }}>
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
        <NavRail active={surface} onNavigate={setSurface} />

        <main style={{ flex: 1, minWidth: 0, minHeight: 0, position: 'relative' }}>
          {/* Kept mounted, hidden when off-surface — see the note above. */}
          <div
            style={{ position: 'absolute', inset: 0, visibility: onMap ? 'visible' : 'hidden' }}
            aria-hidden={!onMap}
          >
            <BasinMap onStatus={onStatus} />
          </div>

          {!onMap && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <EligibilityWorksheet statuses={statuses} onOpenMap={openMap} />
            </div>
          )}
        </main>

        {/* Both docks stay mounted; the one you are not on is hidden. Same
            treatment as the map above, for the same reason. `visibility:
            hidden` takes the hidden dock out of the tab order as well as out
            of sight, so nobody can type into a composer they cannot see. */}
        <div
          style={{
            width: 'var(--chat-rail)',
            flex: 'none',
            position: 'relative',
            minHeight: 0,
          }}
        >
          <Dock visible={onMap}>
            <ChatPanel />
          </Dock>
          <Dock visible={!onMap}>
            <PhoebePanel onCriteriaUpdate={applyUpdates} />
          </Dock>
        </div>
      </div>
    </div>
  );
}

/**
 * One chat dock, shown or hidden without being unmounted.
 *
 * Hidden means hidden from everyone: `visibility: hidden` removes it from the
 * tab order and from the accessibility tree, and `aria-hidden` says so
 * explicitly. A composer nobody can see must not be one a keyboard can reach.
 */
function Dock({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        minHeight: 0,
        visibility: visible ? 'visible' : 'hidden',
      }}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
