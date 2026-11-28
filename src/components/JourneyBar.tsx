/**
 * The journey bar — the one row at the top of the centre, on every surface.
 *
 * A PROGRESS LINE, NOT A MENU — the maintainer's word of 21 Nov 2026: the
 * agents lead. The crew on the right is how a visitor moves (a click on a face
 * opens that agent's screen), and Wellington's "Meet …" button in the chat;
 * this row only shows where the visit stands. Nothing on it clicks. Until
 * 21 Nov 2026 it was the navigation (ruling of 7 Sep 2026).
 *
 * THE ROW READS Dispatches | Eligibility · Partners · Quantify · After you save.
 * Dispatches sits first with a hairline after it — the desk, not a phase. The
 * phase names stay canon. Plan, Monitor and Communicate fold into one quiet
 * mark, "After you save", because they open on waterbots.ai once the project is
 * saved, never on this site; their names are in the mark's title.
 *
 * "YOU ARE HERE" IS THE STRONGEST MARK. The step in view has a solid dot and a
 * bold name; a step with something from this visit has a ring in Tide; one with
 * nothing yet, a quiet ring. Until 21 Nov 2026 progress filled the dot solid
 * and the step in view had only a wash, so a step left behind read as current.
 * A ring in Tide means "something is here", never "done" — this console
 * certifies nothing, and a phase does not pass.
 *
 * THE BAR NEVER SCROLLS — ruling 2b, 5 Sep 2026. When the labels no longer
 * fit, each phase collapses to its number in a ring, and the label moves to
 * the title. Dispatches keeps its own mark: a ring holding a dot.
 *
 * ON A PHONE, ONE ROW — the maintainer's word of 21 Nov 2026: the rings and
 * the row under them became one. "Project" at the left opens the record,
 * "Crew" at the right opens the crew; between them, the step in view by name,
 * with a small dot for each step beside it.
 */

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AFTER_SAVE_LABEL, AFTER_SAVE_NOTE, JOURNEY, phaseSurface } from '../lib/journey';
import { DESK_LABEL, type Surface } from '../lib/surfaces';
import { CREW } from '../lib/crew';

/**
 * Below this many pixels of bar, the labels no longer fit and the bar
 * collapses to marks rather than scrolling (look pass, 8 Sep 2026).
 */
const COMPACT_BELOW = 760;

/** The open phases: the ones this site has a step for. */
const OPEN = JOURNEY.filter((phase) => phase.surface !== null);

type Mark = 'here' | 'has' | 'none';

/** A mark's look: "here" solid, "has" a Tide ring, "none" a quiet ring. */
function markStyle(mark: Mark): CSSProperties {
  return {
    borderColor: mark === 'none' ? 'var(--ink-4)' : 'var(--tide-ui)',
    background: mark === 'here' ? 'var(--tide-ui)' : 'transparent',
  };
}

export default function JourneyBar({
  active: inView,
  progress,
  menu,
}: {
  active: Surface;
  /** Which open phases have something from this visit, keyed by phase key. */
  progress: Record<string, boolean>;
  /** Under 1280 pixels: the one slim bar, with the menu button and the name of the place (the shared console page, rule 26). */
  menu?: { open: boolean; onOpen: () => void };
}) {
  /* Violet's desk is Quantify's second desk, so the bar marks Quantify there too. */
  const active = phaseSurface(inView);
  const bar = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const measure = () => setCompact(el.clientWidth < COMPACT_BELOW);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onDesk = active === 'desk';
  const markOf = (key: string, surface: Surface | null): Mark =>
    surface === active ? 'here' : progress[key] ? 'has' : 'none';
  const step = OPEN.findIndex((phase) => phase.surface === active);
  const stepName = step < 0 ? DESK_LABEL : `${step + 1} · ${OPEN[step].label}`;

  /* ONE MENU UNDER 1280 PIXELS (the shared console page, rule 26, the maintainer's word of 28 Nov 2026): one slim bar
     above the chat and tool, with the menu button and the name of the place. The steps, the desk's tabs, the crew and
     the rail are inside the menu (App.tsx). This replaces the phone's one row and the crew drawer of rule 19. */
  if (menu) {
    const who = CREW.find((member) => member.surface === inView)?.name;
    return (
      <div className="chrome wb-menu-bar" style={{ flex: 'none' }}>
        <button
          type="button"
          className="wb-menu-bar-button"
          onClick={menu.onOpen}
          aria-expanded={menu.open}
          aria-controls="wb-console-menu"
          aria-label="Open the menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span className="wb-menu-bar-name" aria-live="polite">
          {stepName}
          {who ? ` · ${who}` : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="chrome" style={{ flex: 'none' }}>
      <nav
        ref={bar}
        className="wb-journey"
        aria-label="Where this screening stands"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: '8px var(--gutter)',
          borderBottom: '1px solid var(--line)',
          /* The step bar never cuts off a step: it wraps (the shared console page, rule 19). */
          flexWrap: 'wrap',
          rowGap: 6,
        }}
      >
        {/* DISPATCHES, FIRST, THEN A HAIRLINE — the desk, not a phase. */}
        <span className="wb-phase" aria-current={onDesk ? 'step' : undefined} title={compact ? DESK_LABEL : undefined} style={{ flex: 'none' }}>
          {compact ? (
            <span className="wb-phase-number" aria-label={DESK_LABEL} style={markStyle(onDesk ? 'here' : 'none')}>
              <span aria-hidden style={{ width: 5, height: 5, borderRadius: 'var(--r-pill)', background: onDesk ? '#ffffff' : 'var(--ink-3)' }} />
            </span>
          ) : (
            <span style={{ fontSize: 12, fontWeight: onDesk ? 600 : 500, color: onDesk ? 'var(--tide-text)' : 'var(--ink-2)', whiteSpace: 'nowrap' }}>
              {DESK_LABEL}
            </span>
          )}
        </span>
        <span aria-hidden className="wb-journey-sep" style={{ width: 1, height: 14, background: 'var(--line)', flex: 'none', margin: '0 14px 0 8px' }} />

        {/* The three open phases. */}
        {OPEN.map((phase, i) => {
          const mark = markOf(phase.key, phase.surface);
          return (
            <div key={phase.key} style={{ display: 'flex', alignItems: 'center', flex: '1 1 auto', minWidth: 'max-content' }}>
              <span className="wb-phase" aria-current={mark === 'here' ? 'step' : undefined} title={compact ? phase.label : undefined}>
                {compact ? (
                  <span
                    className="wb-phase-number t-mono"
                    aria-label={phase.label}
                    style={{ ...markStyle(mark), color: mark === 'here' ? '#ffffff' : mark === 'has' ? 'var(--tide-text)' : 'var(--ink-3)' }}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <>
                    <span aria-hidden className="wb-phase-dot" style={markStyle(mark)} />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: mark === 'here' ? 600 : 400,
                        color: mark === 'here' ? 'var(--tide-text)' : mark === 'has' ? 'var(--ink-2)' : 'var(--ink-3)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {phase.label}
                    </span>
                  </>
                )}
              </span>
              <span aria-hidden className="wb-journey-join" style={{ flex: '1 1 8px', minWidth: 8, height: 1, background: 'var(--line)', margin: '0 8px' }} />
            </div>
          );
        })}

        {/* PLAN, MONITOR, COMMUNICATE — one quiet mark (21 Nov 2026). */}
        <span className="wb-phase wb-phase-later" title={AFTER_SAVE_NOTE} aria-label={`${AFTER_SAVE_LABEL}: ${AFTER_SAVE_NOTE}`} style={{ flex: 'none' }}>
          {/* --ink-3, not --ink-4: it must pass the normal contrast test (the shared console page, rule 21). */}
          <span style={{ fontSize: compact ? 11 : 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{AFTER_SAVE_LABEL}</span>
        </span>
      </nav>
    </div>
  );
}

/**
 * THE STEPS, INSIDE THE MENU UNDER 1280 PIXELS (rule 26): the same marks as the bar, one step to a line. A progress
 * list, as the bar is: a visitor moves by the crew.
 */
export function JourneySteps({ active: inView, progress }: { active: Surface; progress: Record<string, boolean> }) {
  const active = phaseSurface(inView);
  const markOf = (key: string, surface: Surface | null): Mark =>
    surface === active ? 'here' : progress[key] ? 'has' : 'none';
  return (
    <ol className="wb-menu-steps">
      <li aria-current={active === 'desk' ? 'step' : undefined}>
        <span className="wb-menu-step-dot" aria-hidden style={markStyle(active === 'desk' ? 'here' : 'none')} />
        {DESK_LABEL}
      </li>
      {OPEN.map((phase, i) => (
        <li key={phase.key} aria-current={phase.surface === active ? 'step' : undefined}>
          <span className="wb-menu-step-dot" aria-hidden style={markStyle(markOf(phase.key, phase.surface))} />
          {i + 1} · {phase.label}
        </li>
      ))}
      <li title={AFTER_SAVE_NOTE}>
        <span className="wb-menu-step-dot" aria-hidden style={markStyle('none')} />
        {AFTER_SAVE_LABEL}
      </li>
    </ol>
  );
}
