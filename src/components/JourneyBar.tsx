/**
 * The journey bar — the one row at the top of the centre, on every surface.
 *
 * ONE ROW, NOT TWO. Maintainer's ruling, 7 Sep 2026: the journey bar is the
 * navigation, and the tab row that sat beneath it is gone. The row reads
 * Dispatches | Eligibility · Partners · Quantify · Plan · Monitor · Communicate.
 * Dispatches sits first with a hairline after it — the desk, not a phase.
 * Eligibility, Partners and Quantify click and open the screening tools:
 * Phoebe's screen, the map, the calculator. The phase names stay canon, and no
 * tool name sits on this row. Item S15 offers the shape to production, later.
 *
 * THE LOOK IS STILL THE PRODUCTION CONSOLE'S, from the saved desk the
 * maintainer brought in by hand on 2 Sep 2026: phase markers joined by
 * hairlines, production's measure. The tab row's Tide rule left with the tab
 * row; the bar keeps its own hairline. The look is taken; nothing else is.
 *
 * PHASES 4 TO 6 ARE GATED, AND SAY SO IN WORDS. They render quieter, they do
 * not click, and their title states plainly that they open with a saved
 * project. No caption — ruling 2a, 5 Sep 2026. A phase that looked clickable
 * and did nothing would be a false success state; a phase hidden altogether
 * would hide the road.
 *
 * A PHASE MARKER IS A HOLLOW DOT UNTIL THE VISIT HAS SOMETHING FOR IT. It is
 * a status, so it obeys BRAND.md §2.6 — a dot, never a portrait. What fills
 * it derives from the visit (src/lib/visit.ts): a criterion moved, a basin
 * pinned, a pack with a figure. A filled dot means "something is here", never
 * "done" — this console certifies nothing, and a phase does not pass.
 *
 * THE BAR NEVER SCROLLS — ruling 2b, 5 Sep 2026. When the labels no longer
 * fit, each phase collapses to its number in a ring, (1) to (6), and the label
 * moves to the title. Dispatches keeps its own mark: a ring holding a dot, not
 * a number, because the desk has no number on the road.
 */

import { useEffect, useRef, useState } from 'react';
import { GATED_NOTE, JOURNEY } from '../lib/journey';
import { DESK_LABEL, type Surface } from '../lib/surfaces';

/**
 * Below this many pixels of bar, Dispatches and the six labels no longer fit
 * and the bar collapses to marks rather than scrolling. Measured on the
 * labels' own width at their type size, with the joining hairlines at their
 * minimum, plus the desk's word and its hairline.
 */
const COMPACT_BELOW = 1080;

export default function JourneyBar({
  active,
  progress,
  onNavigate,
}: {
  active: Surface;
  /** Which open phases have something from this visit, keyed by phase key. */
  progress: Record<string, boolean>;
  onNavigate: (surface: Surface) => void;
}) {
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

  return (
    <div className="chrome" style={{ flex: 'none' }}>
      {/* Production's measure, from the saved console: 12px labels, 7px hollow
          dots, hairlines that stretch to fill, 8px of vertical padding, and a
          hairline under the row. Look pass, 2 Sep 2026. */}
      <nav
        ref={bar}
        aria-label="Journey"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: '8px var(--gutter)',
          borderBottom: '1px solid var(--line)',
          overflow: 'hidden',
        }}
      >
        {/* DISPATCHES, FIRST, THEN A HAIRLINE — the desk on one side of the
            line, the journey on the other. It is not a phase: no dot, no
            number, and it never fills, because the desk is where the visit
            starts rather than a step it gets through. */}
        <button
          type="button"
          className="wb-phase"
          title={compact ? DESK_LABEL : undefined}
          onClick={() => onNavigate('desk')}
          aria-current={onDesk ? 'page' : undefined}
          style={{ flex: 'none' }}
        >
          {compact ? (
            <span
              className="wb-phase-number"
              aria-label={DESK_LABEL}
              style={{
                borderColor: onDesk ? 'var(--tide-ui)' : 'var(--ink-4)',
                background: onDesk ? 'color-mix(in oklab, var(--tide-ui) 18%, transparent)' : 'transparent',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 'var(--r-pill)',
                  background: onDesk ? 'var(--tide-ui)' : 'var(--ink-3)',
                }}
              />
            </span>
          ) : (
            <span
              style={{
                fontSize: 12,
                fontWeight: onDesk ? 600 : 500,
                color: onDesk ? 'var(--tide-text)' : 'var(--ink-2)',
                whiteSpace: 'nowrap',
              }}
            >
              {DESK_LABEL}
            </span>
          )}
        </button>
        <span
          aria-hidden
          style={{ width: 1, height: 14, background: 'var(--line)', flex: 'none', margin: '0 14px 0 8px' }}
        />

        {/* The six phases. */}
        {JOURNEY.map((phase, i) => {
          const gated = phase.surface === null;
          const current = phase.surface !== null && phase.surface === active;
          const has = Boolean(progress[phase.key]);
          const inner = compact ? (
            <span
              className="wb-phase-number t-mono"
              aria-label={phase.label}
              style={{
                borderColor: current || has ? 'var(--tide-ui)' : 'var(--ink-4)',
                background: has
                  ? 'var(--tide-ui)'
                  : current
                    ? 'color-mix(in oklab, var(--tide-ui) 18%, transparent)'
                    : 'transparent',
                color: has ? '#ffffff' : gated ? 'var(--ink-4)' : current ? 'var(--tide-text)' : 'var(--ink-3)',
              }}
            >
              {i + 1}
            </span>
          ) : (
            <>
              <span
                aria-hidden
                className="wb-phase-dot"
                style={{
                  borderColor: current || has ? 'var(--tide-ui)' : 'var(--ink-4)',
                  /* Something from the visit fills the dot solid; the current
                     phase with nothing in it yet takes only a wash. */
                  background: has
                    ? 'var(--tide-ui)'
                    : current
                      ? 'color-mix(in oklab, var(--tide-ui) 18%, transparent)'
                      : 'transparent',
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: current ? 600 : 400,
                  color: gated ? 'var(--ink-4)' : current ? 'var(--tide-text)' : 'var(--ink-3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {phase.label}
              </span>
            </>
          );
          return (
            <div
              key={phase.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                /* Each phase keeps its own width; only the hairline between
                   phases stretches. Squeezed past the labels' width, the bar
                   collapses to marks rather than scrolling. */
                flex: i < JOURNEY.length - 1 ? '1 1 auto' : 'none',
                minWidth: 'max-content',
              }}
            >
              {gated ? (
                <span
                  className="wb-phase"
                  title={`${phase.label} — ${GATED_NOTE}`}
                  aria-disabled
                  style={{ cursor: 'default' }}
                >
                  {inner}
                </span>
              ) : (
                <button
                  type="button"
                  className="wb-phase"
                  title={compact ? phase.label : undefined}
                  onClick={() => phase.surface && onNavigate(phase.surface)}
                  aria-current={current ? 'page' : undefined}
                >
                  {inner}
                </button>
              )}
              {/* The joining hairline. It is the same hairline everywhere; a
                  phase does not colour the road behind it. */}
              {i < JOURNEY.length - 1 && (
                <span
                  aria-hidden
                  style={{
                    flex: '1 1 8px',
                    minWidth: 8,
                    height: 1,
                    background: 'var(--line)',
                    margin: '0 8px',
                  }}
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
