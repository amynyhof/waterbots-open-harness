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

import { GATED_NOTE, JOURNEY } from '../lib/journey';
import { SURFACES, type Surface } from '../lib/surfaces';

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
  return (
    <div className="chrome" style={{ flex: 'none' }}>
      {/* The six phases. */}
      <nav
        aria-label="Journey"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          padding: '10px var(--gutter) 0',
          overflowX: 'auto',
        }}
      >
        {JOURNEY.map((phase, i) => {
          const gated = phase.surface === null;
          const current = phase.surface !== null && phase.surface === active;
          const has = Boolean(progress[phase.key]);
          const inner = (
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
                  fontSize: 13,
                  color: gated ? 'var(--ink-4)' : current ? 'var(--ink)' : 'var(--ink-2)',
                  whiteSpace: 'nowrap',
                }}
              >
                {phase.label}
              </span>
            </>
          );
          return (
            <div key={phase.key} style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
              {gated ? (
                <span
                  className="wb-phase"
                  title={GATED_NOTE}
                  aria-disabled
                  style={{ cursor: 'default' }}
                >
                  {inner}
                </span>
              ) : (
                <button
                  type="button"
                  className="wb-phase"
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
                    width: 'clamp(16px, 4vw, 64px)',
                    height: 1,
                    background: 'var(--line)',
                    margin: '0 6px',
                    flex: 'none',
                  }}
                />
              )}
            </div>
          );
        })}
        <span
          className="t-caption"
          style={{ marginLeft: 'auto', paddingLeft: 18, fontSize: 10.5, whiteSpace: 'nowrap' }}
        >
          Plan, Monitor and Communicate open with a saved project.
        </span>
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
          gap: 22,
          padding: '8px var(--gutter) 0',
          borderBottom: '3px solid var(--tide-ui)',
        }}
      >
        {SURFACES.map((surface, i) => {
          const on = surface.key === active;
          return (
            <div key={surface.key} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
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
                  style={{ width: 1, height: 18, background: 'var(--line)', flex: 'none' }}
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
