/**
 * The crew rail — the right column of the console.
 *
 * THE SHAPE is the production console's, from the saved page the maintainer
 * brought in by hand on 2 Sep 2026: "The crew", then one row per agent with a
 * portrait, a name in the agent's own accent, a role caption, and the current
 * agent's row raised to a card. The look is taken; nothing else is.
 *
 * CLICK A FACE AND YOU GO TO THAT AGENT'S STEP. Phoebe, Bridget, Calvin and,
 * from 23 Nov 2026, Violet each have a step, so their row opens it;
 * Wellington's row is the desk.
 *
 * ONLY THE AGENTS THE MAP HAS CALLED ARE HERE — the maintainer's ruling of
 * 24 Nov 2026, the shared console behaviours, line 1. An agent the map has not
 * called yet is hidden, not dimmed. It appears when the map calls it and never
 * disappears after that. A calculator whose pathway reads unlikely is not
 * called (RULINGS.md section 4), so it does not appear; one that had appeared
 * stays, and its line and its desk say it is unlikely for this project.
 *
 * A QUIET LIST, FROM 14 NOV 2026 — the maintainer's word (W26, W27). The
 * next-step rows, their buttons, the repeated "Open the Eligibility
 * worksheet" links left this column: every handoff's button now sits in the
 * chat under Wellington's message. What stays is the crew, each with one plain
 * line on where their part stands ("water likely · carbon unlikely"), worked
 * out from the visit and never typed (crewStatus, visit.ts).
 *
 * SAVE IS NOT HERE — the maintainer's word of 21 Nov 2026. It is the site
 * menu's one button, with the box that sends the project to the team under it
 * (the site menu, SiteMenu.tsx). For a few hours that day it sat under the crew.
 *
 * FIVE AGENTS (four until 23 Nov 2026). The roster lives in
 * src/lib/crew.ts and the row in CrewRow.tsx; this rail reads both.
 *
 * ON A PHONE THE COLUMN IS A PANEL — the maintainer's word of 29 Oct 2026. It
 * slides over the page from the right, opened from "Crew" under the journey bar.
 */

import { CREW } from '../lib/crew';
import type { Surface } from '../lib/surfaces';
import CrewRow from './CrewRow';

export default function CrewRail({
  active,
  status,
  onNavigate,
  shown,
  drawer,
}: {
  active: Surface;
  /** One plain line per member, keyed by the step each one opens. */
  status: Partial<Record<Surface, string>>;
  onNavigate: (surface: Surface) => void;
  /** The desks of the agents the map has called. The one in view is always among them, so nobody loses their place. */
  shown: ReadonlySet<Surface>;
  /** On a phone: the column is a sliding panel, open or shut by the shell. */
  drawer?: { open: boolean; onClose: () => void };
}) {
  return (
    <aside
      className={drawer ? `chrome wb-drawer wb-drawer-right${drawer.open ? ' is-open' : ''}` : 'chrome'}
      aria-label="The crew"
      aria-hidden={drawer ? !drawer.open : undefined}
      style={{
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--line)',
        borderBottom: 0,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        className="t-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          padding: '18px 18px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span aria-hidden style={{ width: 22, height: 1, background: 'var(--ink-4)' }} />
        The crew
        {drawer && (
          <button type="button" className="wb-drawer-close" onClick={drawer.onClose} aria-label="Close the crew panel">
            Close
          </button>
        )}
      </div>

      <div style={{ padding: '0 12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CREW.filter((member) => member.surface === active || shown.has(member.surface)).map((member) => (
          <CrewRow
            key={member.name}
            member={member}
            current={member.surface === active}
            status={status[member.surface]}
            onOpen={() => onNavigate(member.surface)}
          />
        ))}
      </div>

    </aside>
  );
}
