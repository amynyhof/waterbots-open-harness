/**
 * The console shell.
 *
 * Working Surface Standard §1 and §2: a full-viewport frame, a fixed left rail
 * and a fixed right column, and only the centre scrolls. Chrome is one
 * hairline row; content starts high with no dead padding above it.
 *
 * THE PRODUCTION SHAPE, FROM 2 Sep 2026 — maintainer's ruling C, item S11.
 * Under the top bar the centre carries a journey bar of six phases and a row
 * ~~of four tabs~~ — one row from 7 Sep 2026, item S15 — and the surfaces open beneath it. The left rail names the
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
 * map, all three chat docks, and from 3 Sep 2026 the desk, which holds
 * Wellington's conversation. The two worksheets hold no state of their own,
 * so they are mounted only while open.
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
 * step. Phoebe answers from her cards through the relay; ~~Wellington answers
 * on the paid site~~ Wellington answers here from 3 Sep 2026; Bridget's and
 * Calvin's chats are not built, and their screens say so.
 *
 * EVERY SURFACE IS AN AGENT SCREEN FROM 9 Sep 2026 (item S16, four slices).
 * The chat docks that stood in the right column are retired; each agent's
 * screen holds its own chat in the centre, its tool beside it as a tab, and
 * the right column is the crew with the save button on every step. The four
 * screens stay mounted, hidden when off-surface, for the reasons above — a
 * conversation, a drawn map and a chosen tab all survive a step away.
 *
 * TWO PAGES FROM 11 Sep 2026 (item S18, slice 2): the console at "/", and the
 * Agent Commons at "/commons" — a shelf of knowledge packs with the crew in
 * the right column and the sign-up door where the save button sits. One word
 * at the right of the top bar opens it, the wordmark is the way back, and the
 * browser's back button works. The console is HIDDEN under the Commons, not
 * unmounted, for the reason every surface above is: stepping out to the
 * Commons and back must not empty a conversation or redraw the map. The
 * address is the one home in src/lib/pages.ts.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { readCarriedQuestion, withoutCarried } from './lib/carried';
import { COMMONS_LABEL, pageFromPath, pathForPage, type Page } from './lib/pages';
import { type MapStatus } from './components/BasinMap';
import NavRail from './components/NavRail';
import JourneyBar from './components/JourneyBar';
import Desk from './components/Desk';
import CrewRail from './components/CrewRail';
import Commons from './components/Commons';
import { HandoffError, buildSeal, handoffAddress, sealVisit, type SealState } from './lib/handoff';
import BridgetScreen from './components/BridgetScreen';
import PhoebeScreen from './components/PhoebeScreen';
import CalvinScreen from './components/CalvinScreen';
import Wordmark from './components/Wordmark';
import { DEFAULT_SURFACE, type Surface } from './lib/surfaces';
import { useConversation } from './chat/useConversation';
import { WELLINGTON, wellingtonAsk } from './lib/wellington';
import { CRITERIA } from './lib/phoebeCards';
import { initialStatuses, type CriterionStatus } from './lib/criteriaState';
import { applyCriterionUpdates, type CriterionUpdate } from './lib/phoebeClient';
import { fittedPack, livePacks, type PackValues } from './lib/methodPacks';
import {
  EMPTY_VISIT,
  deskRows,
  journeyProgress,
  learnedContext,
  pinnedContext,
  typedContext,
  type Learned,
  type MapPin,
  type Visit,
} from './lib/visit';

const LIVE_PACKS = livePacks();

export default function App() {
  const [status, setStatus] = useState<MapStatus | null>(null);
  const onStatus = useCallback((s: MapStatus) => setStatus(s), []);

  const [surface, setSurface] = useState<Surface>(DEFAULT_SURFACE);
  const openMap = useCallback(() => setSurface('map'), []);

  /* WHICH PAGE — the console or the Agent Commons — read from the address on
     arrival and written back to it on every move, so a reload, a shared link
     and the browser's back button all land where the visitor was. Item S18,
     slice 2. */
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname));
  /* The push happens OUTSIDE the state updater. Inside it, React's
     development mode ran the updater twice and pushed two entries per move,
     so the back button landed on the same page — found in slice 2's first
     browser walk. */
  const goTo = useCallback(
    (next: Page) => {
      if (next === page) return;
      window.history.pushState(null, '', pathForPage(next));
      setPage(next);
    },
    [page]
  );
  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const onConsole = page === 'console';
  const onCommons = page === 'commons';

  /* The worksheet lives here so Phoebe's answers and the rows she is filling
     in cannot disagree. It is plain component state and nothing writes it to
     storage — v1 keeps no memory across visits, and a reload starts over. */
  const [statuses, setStatuses] = useState<CriterionStatus[]>(() =>
    initialStatuses(CRITERIA.length)
  );

  const applyUpdates = useCallback((updates: CriterionUpdate[]) => {
    setStatuses((current) => applyCriterionUpdates(current, updates));
  }, []);

  /* The rest of the visit: the project context, the pin, the pack answers. */
  const [visit, setVisit] = useState<Visit>(EMPTY_VISIT);

  /* Three writers into one context, each under its own rule in
     src/lib/visit.ts: the visitor's typing, Wellington's hearing, the pin. */
  const onTyped = useCallback((field: 'name' | 'place', value: string) => {
    setVisit((v) => ({ ...v, context: typedContext(v.context, field, value) }));
  }, []);

  const onLearned = useCallback((learned: Learned) => {
    setVisit((v) => ({ ...v, context: learnedContext(v.context, learned) }));
  }, []);

  /* A pin fills the place if the visitor left it blank — ruling A, 2 Sep
     2026 — and never overwrites a place they typed or told Wellington.
     Unpinning clears only a place the pin wrote. */
  const setPin = useCallback((pin: MapPin | null) => {
    setVisit((v) => ({ ...v, pin, context: pinnedContext(v.context, pin) }));
  }, []);

  /* Which pack's tab is open. Held here so a step away and back keeps it. */
  const [activePack, setActivePack] = useState<string>(() => fittedPack()?.key ?? '');
  const setPackValues = useCallback((packKey: string, values: PackValues) => {
    setVisit((v) => ({ ...v, packValues: { ...v.packValues, [packKey]: values } }));
  }, []);

  /* WELLINGTON'S ONE CONVERSATION, held here rather than inside the desk so
     that any second frame around it — the hero chat, when its reference
     arrives — shows the same thread: never a second panel, never duplicated.
     Maintainer's ruling, 3 Sep 2026. A route in his answer opens the console
     at that tab. */
  /* Look pass, 8 Sep 2026: his route no longer draws a button under his turn.
     He names the step in words, and the next steps live in the right rail. */
  const ask = useMemo(() => wellingtonAsk(onLearned), [onLearned]);
  const chat = useConversation(ask, WELLINGTON.name);

  /* THE RECEIVER (item S13, built 9 Sep 2026). A visitor who typed a question
     into the production landing's box arrives here with it in the address.
     Once, on the first paint: read it, take it out of the address so a reload
     or a shared link cannot send it twice, open Dispatches, and hand it to
     Wellington as the visitor's first turn — in a bubble, so his answer is
     the first thing they see. Nothing is kept. A missing, blank, over-long or
     unreadable question is ignored without a word; the page opens as it
     always does. The contract for production's sender is in
     src/lib/carried.ts.

     THE SEND IS DEFERRED ONE TICK, and the reason was found on the first real
     call: in development React mounts twice (StrictMode), and the second
     mount's cleanup aborts whatever the first one had in flight — the
     question sat in its bubble with no answer and no error. The address is
     read once and held in a ref; the timer is cleared by a repeated mount and
     set again by the next, so the question is sent exactly once, after the
     mounting has settled. */
  const carried = useRef<string | null | undefined>(undefined);
  const sendCarried = chat.sendText;
  useEffect(() => {
    if (carried.current === undefined) {
      carried.current = readCarriedQuestion(window.location.search);
      const cleaned = withoutCarried(window.location.href);
      if (cleaned !== window.location.href) window.history.replaceState(null, '', cleaned);
    }
    const question = carried.current;
    if (question === null) return;
    const timer = window.setTimeout(() => {
      carried.current = null;
      /* The contract's address is the console's. A question carried to the
         Commons' address is out of contract but not ignored: Dispatches is
         where it lands, so the page moves there and the address follows. */
      if (pageFromPath(window.location.pathname) !== 'console') {
        window.history.replaceState(null, '', pathForPage('console'));
      }
      setPage('console');
      setSurface('desk');
      void sendCarried(question, { carried: true });
    }, 0);
    return () => window.clearTimeout(timer);
    /* On purpose, with no dependencies: the address is read on arrival and
       never again. */
  }, []);

  /* Derived, never typed. */
  const rows = useMemo(() => deskRows(visit, statuses, LIVE_PACKS), [visit, statuses]);
  const progress = useMemo(() => journeyProgress(visit, statuses, LIVE_PACKS), [visit, statuses]);

  /* THE BRIDGE (item S7, built 8 Sep 2026). The click seals the visit as it
     stands — the record with its source tags, the pin, the worksheet, each
     pack's answers as typed — and on a ticket coming back moves this window
     to production's sign-up with only the ticket in the address. Nothing is
     kept here, and every state on the way is shown on the row. */
  const [sealing, setSealing] = useState<SealState>({ kind: 'idle' });
  const onSeal = useCallback(async () => {
    setSealing({ kind: 'sealing' });
    try {
      const seal = buildSeal(visit, statuses, CRITERIA.map((c) => c.number), LIVE_PACKS);
      const { ticketId } = await sealVisit(seal);
      setSealing({ kind: 'sealed' });
      window.location.assign(handoffAddress(ticketId));
    } catch (error) {
      setSealing({
        kind: 'failed',
        message:
          error instanceof HandoffError
            ? error.message
            : 'Something went wrong on our side. Nothing was kept.',
      });
    }
  }, [visit, statuses]);

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
        {/* The wordmark is the way back to the console from the Commons; on
            the console it goes nowhere, as a wordmark conventionally does. */}
        <button
          type="button"
          className="wb-wordmark-link"
          onClick={() => goTo('console')}
          aria-label="WaterBots — the console"
        >
          <Wordmark height={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 0 }}>
          {/* The layer readout describes the map, so it only shows on the map. */}
          {onConsole && onMap && status && (
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
                /* One plain line — look pass, 8 Sep 2026. The level, the count and
                   the zoom were the engineer's readout, not a visitor's. */
                <>{visit.pin ? 'Click the pinned basin to unpin it, or another basin to pin that one.' : 'Click a basin to pin it.'}</>
              )}
            </span>
          )}

          {/* ONE WORD OPENS THE COMMONS, at the right of the top bar and never
              on the journey bar — item S18, approved 9 Sep 2026. */}
          <button
            type="button"
            className="wb-topbar-link"
            onClick={() => goTo('commons')}
            aria-current={onCommons ? 'page' : undefined}
          >
            {COMMONS_LABEL}
          </button>
        </div>
      </header>

      {/* THE TWO PAGES STACK, and the one you are not on is hidden, not
          unmounted — see the note at the head of this file. */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
      {/* The rail is fixed; the column beside it carries the journey bar, the
          tabs, and then the centre and the right column. The centre takes no
          minimum width — a full-viewport working shell must never scroll
          sideways, and a horizontal scrollbar is a worse failure than a narrow
          map. The rail collapses instead, and the map holds a zoom floor so it
          stays readable rather than shrinking to a postage stamp. */}
      <div
        style={{ position: 'absolute', inset: 0, display: 'flex', overflow: 'hidden', visibility: onConsole ? 'visible' : 'hidden' }}
        aria-hidden={!onConsole}
      >
        <NavRail context={visit.context} onTyped={onTyped} />

        <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <JourneyBar active={surface} progress={progress} onNavigate={setSurface} />

          <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
            <main style={{ flex: 1, minWidth: 0, minHeight: 0, position: 'relative' }}>
              {/* THE DESK STAYS MOUNTED, hidden when off-surface, because it
                  holds Wellington's conversation. Unmounting threw the
                  transcript away when a visitor stepped to a tab he had sent
                  them to and came back — the item S4 fault, found again on
                  3 Sep 2026 in the first browser walk and fixed the same way.

                  THE OPEN SURFACE INHERITS VISIBILITY rather than setting it —
                  all four wrappers below, from 11 Sep 2026. An explicit
                  "visible" overrides the page's "hidden" above, and the desk
                  showed through the Agent Commons in slice 2's first capture.
                  The same fault, and the same fix, as the agent screen's
                  panels in slice 4. */}
              <div
                style={{ position: 'absolute', inset: 0, visibility: onDesk ? undefined : 'hidden' }}
                aria-hidden={!onDesk}
              >
                  <Desk chat={chat} onNavigate={setSurface} />
              </div>

              {/* BRIDGET'S SCREEN, kept mounted, hidden when off-surface — see
                  the note above. The map is its Tool tab (item S16, slice 4,
                  9 Sep 2026) and is mounted for the whole visit, as it was
                  when the shell drew it here. */}
              <div
                style={{ position: 'absolute', inset: 0, visibility: onMap ? undefined : 'hidden' }}
                aria-hidden={!onMap}
              >
                <BridgetScreen
                  onStatus={onStatus}
                  pinnedHybas={visit.pin?.hybasId ?? null}
                  onPin={setPin}
                  onNavigate={setSurface}
                />
              </div>

              {/* PHOEBE'S SCREEN STAYS MOUNTED, hidden when off-surface, for
                  the same reason as the desk: her seat holds her conversation
                  (item S16, slice 3, 9 Sep 2026). Her worksheet is its Tool
                  tab; the shell still holds the worksheet's rows. THE LOOP —
                  7 Sep 2026: the record goes to Phoebe with every ask; her
                  verdicts come back through applyUpdates to the criteria, and
                  her row on the desk follows. */}
              <div
                style={{ position: 'absolute', inset: 0, visibility: onEligibility ? undefined : 'hidden' }}
                aria-hidden={!onEligibility}
              >
                <PhoebeScreen
                  onCriteriaUpdate={applyUpdates}
                  record={visit.context}
                  statuses={statuses}
                  onOpenMap={openMap}
                  onNavigate={setSurface}
                />
              </div>

              {/* CALVIN'S SCREEN, kept mounted like the others so its tab
                  stays where the visitor left it. The worksheet is its Tool
                  tab; the pack answers are the shell's, in the visit. */}
              <div
                style={{ position: 'absolute', inset: 0, visibility: onQuantification ? undefined : 'hidden' }}
                aria-hidden={!onQuantification}
              >
                <CalvinScreen
                  activeKey={activePack}
                  onSelect={setActivePack}
                  allValues={visit.packValues}
                  onChange={setPackValues}
                  onNavigate={setSurface}
                />
              </div>
            </main>

            {/* The right column is the crew on every step, with the save
                button at its foot, so saving is reachable from every step —
                item S16, complete on 9 Sep 2026 with slice 4. The host docks
                that stood here on the map and on quantification are retired;
                each agent's screen holds its own chat in the centre. */}
            <CrewRail
              active={surface}
              openCount={rows.length}
              rows={rows}
              onNavigate={setSurface}
              sealing={sealing}
              onSeal={onSeal}
            />
          </div>
        </div>
      </div>

      {/* THE AGENT COMMONS (item S18, slices 2 and 3): the shelf, and a pack
          opened on its holder's screen, alone. No left rail, no journey bar,
          no crew column, no record and no save button, because the Commons
          holds no visit and an agent there stands on its own — maintainer's
          ruling, 11 Sep 2026. */}
      <main
        style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', visibility: onCommons ? 'visible' : 'hidden' }}
        aria-hidden={!onCommons}
      >
        <Commons />
      </main>
      </div>
    </div>
  );
}

