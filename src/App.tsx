/**
 * The console shell.
 *
 * Working Surface Standard §1 and §2: a full-viewport frame, a fixed left rail
 * and a fixed right column, and only the centre scrolls. Chrome is one
 * hairline row; content starts high with no dead padding above it.
 *
 * THE PRODUCTION SHAPE, FROM 2 Sep 2026 — maintainer's ruling C, item S11.
 * Under the top bar the centre carries a journey bar of six phases and a row
 * of four tabs, and the surfaces open beneath them. The left rail names the
 * visit's project; the right column is the host's dock, or the crew list when
 * the desk is open. The look is the saved production desk's, brought in by
 * the maintainer's hand; nothing else of it is — not its data, not its live
 * composer, not organisations, roles or saving.
 *
 * THE VISIT LIVES HERE. Everything this console knows about the project in
 * front of it — the eligibility rows Phoebe is filling in, the pinned basin,
 * the calculator's answers, the project context — is plain component state
 * in this file, so that the desk can derive its rows from it and no two
 * surfaces can disagree about it. Nothing writes it to storage. A reload
 * starts over, and the page says so: that is the no-memory-across-visits
 * ruling of 21 Aug 2026, unchanged. The shape is src/lib/visit.ts.
 *
 * Three planes and no fourth (BRAND.md §2.3), and two grounds. The frame —
 * top bar, journey bar, rail, and the right column's ground — sits on --frame
 * #FBFBFE. The content canvas is --paper #F6F5FA, and the map, the desk and
 * the worksheets sit on it. Content warm, frame lighter and receding.
 * Maintainer's ruling, 29 Aug 2026; the record is item S9.
 *
 * FOUR SURFACES, AND WHAT HOLDS STATE IS NOT UNMOUNTED WHEN YOU LEAVE IT.
 * Switching surface hides what you left rather than throwing it away — the
 * map, and all three chat docks alongside it. The desk and the two worksheets
 * hold no state of their own any more, so they are mounted only while open.
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
 * Each surface brings its own host: Wellington at the desk, Bridget with the
 * map, Phoebe with the eligibility worksheet, Calvin with the quantification
 * step. Phoebe answers from her cards through the relay; Wellington answers
 * on the paid site, and Bridget's and Calvin's chats are not built. Every
 * panel says so.
 */

import { useCallback, useMemo, useState } from 'react';
import BasinMap, { type MapStatus } from './components/BasinMap';
import NavRail from './components/NavRail';
import JourneyBar from './components/JourneyBar';
import Desk from './components/Desk';
import CrewRail from './components/CrewRail';
import ChatPanel from './components/ChatPanel';
import PhoebePanel from './components/PhoebePanel';
import EligibilityWorksheet from './components/EligibilityWorksheet';
import QuantificationWorksheet from './components/QuantificationWorksheet';
import CalvinPanel from './components/CalvinPanel';
import Wordmark from './components/Wordmark';
import { DEFAULT_SURFACE, type Surface } from './lib/surfaces';
import { CRITERIA } from './lib/phoebeCards';
import { initialStatuses, type CriterionStatus } from './lib/criteriaState';
import type { CriterionUpdate } from './lib/phoebeClient';
import { fittedPack, livePacks, type PackValues } from './lib/methodPacks';
import {
  EMPTY_VISIT,
  deskRows,
  describePin,
  journeyProgress,
  type MapPin,
  type Visit,
  type VisitContext,
} from './lib/visit';

const LIVE_PACKS = livePacks();

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

  /* The rest of the visit: the project context, the pin, the pack answers. */
  const [visit, setVisit] = useState<Visit>(EMPTY_VISIT);

  const setContext = useCallback((context: VisitContext) => {
    setVisit((v) => ({ ...v, context }));
  }, []);

  /* A pin fills the place if the visitor left it blank — ruling A, 2 Sep
     2026 — and never overwrites a place they typed. Unpinning clears only a
     place the pin wrote. */
  const setPin = useCallback((pin: MapPin | null) => {
    setVisit((v) => {
      const wroteBefore = v.pin !== null && v.context.place === describePin(v.pin);
      const place =
        pin === null
          ? wroteBefore
            ? ''
            : v.context.place
          : v.context.place.trim() === '' || wroteBefore
            ? describePin(pin)
            : v.context.place;
      return { ...v, pin, context: { ...v.context, place } };
    });
  }, []);

  /* Which pack's tab is open. Held here so a step away and back keeps it. */
  const [activePack, setActivePack] = useState<string>(() => fittedPack()?.key ?? '');
  const setPackValues = useCallback((packKey: string, values: PackValues) => {
    setVisit((v) => ({ ...v, packValues: { ...v.packValues, [packKey]: values } }));
  }, []);

  /* Derived, never typed. */
  const rows = useMemo(() => deskRows(visit, statuses, LIVE_PACKS), [visit, statuses]);
  const progress = useMemo(() => journeyProgress(visit, statuses, LIVE_PACKS), [visit, statuses]);

  const onDesk = surface === 'desk';
  const onMap = surface === 'map';
  const onEligibility = surface === 'eligibility';
  const onQuantification = surface === 'quantification';

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
                {visit.pin && <> &middot; click a basin to pin it, or the pinned one to unpin</>}
                {!visit.pin && <> &middot; click a basin to pin it for this visit</>}
              </>
            )}
          </span>
        )}
      </header>

      {/* The rail is fixed; the column beside it carries the journey bar, the
          tabs, and then the centre and the right column. The centre takes no
          minimum width — a full-viewport working shell must never scroll
          sideways, and a horizontal scrollbar is a worse failure than a narrow
          map. The rail collapses instead, and the map holds a zoom floor so it
          stays readable rather than shrinking to a postage stamp. */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <NavRail projectName={visit.context.name} />

        <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <JourneyBar active={surface} progress={progress} onNavigate={setSurface} />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
            <main style={{ flex: 1, minWidth: 0, minHeight: 0, position: 'relative' }}>
              {onDesk && (
                <div style={{ position: 'absolute', inset: 0 }}>
                  <Desk
                    context={visit.context}
                    onContext={setContext}
                    rows={rows}
                    onNavigate={setSurface}
                  />
                </div>
              )}

              {/* Kept mounted, hidden when off-surface — see the note above. */}
              <div
                style={{ position: 'absolute', inset: 0, visibility: onMap ? 'visible' : 'hidden' }}
                aria-hidden={!onMap}
              >
                <BasinMap onStatus={onStatus} pinnedHybas={visit.pin?.hybasId ?? null} onPin={setPin} />
              </div>

              {onEligibility && (
                <div style={{ position: 'absolute', inset: 0 }}>
                  <EligibilityWorksheet statuses={statuses} onOpenMap={openMap} />
                </div>
              )}

              {onQuantification && (
                <div style={{ position: 'absolute', inset: 0 }}>
                  <QuantificationWorksheet
                    activeKey={activePack}
                    onSelect={setActivePack}
                    allValues={visit.packValues}
                    onChange={setPackValues}
                  />
                </div>
              )}
            </main>

            {/* The right column. On the desk it is the crew; elsewhere it is
                the host's dock. All three docks stay mounted and the ones you
                are not on are hidden — same treatment as the map above, for the
                same reason. `visibility: hidden` takes a hidden dock out of the
                tab order as well as out of sight, so nobody can type into a
                composer they cannot see. */}
            <div
              style={{
                width: 'var(--chat-rail)',
                flex: 'none',
                position: 'relative',
                minHeight: 0,
              }}
            >
              <Dock visible={onDesk}>
                <CrewRail active={surface} openCount={rows.length} onNavigate={setSurface} />
              </Dock>
              <Dock visible={onMap}>
                <ChatPanel />
              </Dock>
              <Dock visible={onEligibility}>
                <PhoebePanel onCriteriaUpdate={applyUpdates} />
              </Dock>
              <Dock visible={onQuantification}>
                <CalvinPanel />
              </Dock>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One right-column occupant, shown or hidden without being unmounted.
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
