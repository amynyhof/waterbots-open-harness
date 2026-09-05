/**
 * The journey bar and the tab row — the top of the centre, on every surface.
 *
 * THE SHAPE IS THE PRODUCTION CONSOLE'S, from the saved desk the maintainer
 * brought in by hand on 2 Sep 2026: a row of six phase markers joined by
 * hairlines, then a row of tabs with the active one carrying the primary
 * accent and a rule beneath the row. Ruling C of that day: the two consoles
 * should rhyme. The look is taken; nothing else is — not its data, its live
 * composer, its organisations, roles or saving.
 *
 * PHASES 4 TO 6 ARE GATED, AND SAY SO IN WORDS. They render quieter, they do
 * not click, and one caption states plainly that they open with a saved
 * project. A phase that looked clickable and did nothing would be a false
 * success state; a phase hidden altogether would hide the road.
 *
 * A PHASE MARKER IS A HOLLOW DOT UNTIL THE VISIT HAS SOMETHING FOR IT. It is
 * a status, so it obeys BRAND.md §2.6 — a dot, never a portrait. What fills
 * it derives from the visit (src/lib/visit.ts): a criterion moved, a basin
 * pinned, a pack with a figure. A filled dot means "something is here", never
 * "done" — this console certifies nothing, and a phase does not pass.
 */

import { useEffect, useRef, useState } from 'react';
import { GATED_NOTE, JOURNEY } from '../lib/journey';
import { SURFACES, type Surface } from '../lib/surfaces';

/**
 * Below this many pixels of bar the six labels no longer fit, and the bar
 * collapses to numbered indicators — (1) to (6) — rather than scrolling.
 * THE BAR NEVER SCROLLS: maintainer's ruling 2b, 5 Sep 2026. Measured on the
 * labels' own width at their type size, with the joining hairlines at their
 * minimum.
 */
const COMPACT_BELOW = 960;

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

  return (
    <div className="chrome" style={{ flex: 'none' }}>
      {/* The six phases. */}
      {/* Production's measure, from the saved console: 12px phase labels,
          7px hollow dots, hairlines that stretch to fill, 8px of vertical
          padding, and a hairline under the row. Look pass, 2 Sep 2026.

          THE BAR NEVER SCROLLS. When the labels no longer fit, each phase
          collapses to its number in a ring — (1) to (6) — and the label moves
          to the title. Ruling 2b, 5 Sep 2026. The caption that said the last
          three phases open with a saved project is gone — ruling 2a; the
          gated phases still carry it as their title. */}
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
                  fontWeight: current ? 500 : 400,
                  color: gated ? 'var(--ink-4)' : current ? 'var(--ink)' : 'var(--ink-3)',
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
                   collapses to numbers rather than scrolling. */
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
                  aria-current={current ? 'step' : undefined}
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

      {/* The tabs. The active one takes the primary accent and the row sits
          on one Tide rule — the reference's own device, kept quiet.

          A HAIRLINE STANDS AFTER THE FIRST TAB, exactly as the production desk
          carries it: the host's desk on one side of the line, the journey's
          surfaces on the other. Maintainer's pixel fix, 2 Sep 2026. */}
      <nav
        aria-label="Sections"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '6px var(--gutter) 0',
          borderBottom: '2px solid var(--tide-ui)',
        }}
      >
        {SURFACES.map((surface, i) => {
          const on = surface.key === active;
          return (
            <div key={surface.key} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button
                type="button"
                className="wb-tab"
                onClick={() => onNavigate(surface.key)}
                aria-current={on ? 'page' : undefined}
                style={{
                  color: on ? 'var(--tide-text)' : 'var(--ink-2)',
                  fontWeight: on ? 600 : 500,
                }}
              >
                {surface.label}
              </button>
              {i === 0 && (
                <span
                  aria-hidden
                  style={{ width: 1, height: 14, background: 'var(--line)', flex: 'none', marginLeft: -6 }}
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
