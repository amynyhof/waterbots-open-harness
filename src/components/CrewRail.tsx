/**
 * The crew rail — the right column of the desk.
 *
 * THE SHAPE is the production console's, from the saved page the maintainer
 * brought in by hand on 2 Sep 2026: "The crew", then one row per agent with a
 * portrait, a name in the agent's own accent, a role caption, and the current
 * agent's row raised to a card. The look is taken; nothing else is.
 *
 * CLICK A FACE AND YOU GO TO THAT AGENT'S SURFACE. On the paid site the centre
 * becomes that agent's desk. Here Phoebe, Bridget and Calvin each already have
 * a surface, so their row opens it — Eligibility, the map, Quantification —
 * which is the honest version of the same gesture. Wellington's row is the
 * desk itself.
 *
 * THE COUNT IS OPEN NEXT STEPS, AND ONLY WELLINGTON CARRIES ONE, because only
 * his desk holds rows. It derives from the visit (checkpoint 2) and is never
 * typed. At checkpoint 1 there are no rows, so there is no count.
 *
 * FOUR AGENTS, AND THE ROSTER IS THE BOOK'S. Wellington and Bridget are the
 * shared crew, Phoebe and Calvin extend it under §6. Nobody is minted here.
 * ~~The roster lives in this file.~~ It moved to src/lib/crew.ts on
 * 11 Sep 2026 (item S18, slice 2), and the row to CrewRow.tsx, when the Agent
 * Commons' right column came to list the same four; this rail reads both.
 */

import { CREW } from '../lib/crew';
import { MAX_HUMAN_NOTE_CHARS, type PersonAsk, type SealState } from '../lib/handoff';
import type { Surface } from '../lib/surfaces';
import type { DeskRow } from '../lib/visit';
import CrewRow from './CrewRow';

/**
 * THE CONSENT LINE — item S7, the contract's first step: the visitor is told
 * what crosses before they click, in their own words for the things. It
 * lists exactly what the seal holds (src/lib/handoff.ts) and names the two
 * things it never holds. If the seal ever changes, this line changes with it.
 */
function consentLine(askingForPerson: boolean): string {
  return (
    'Going with you: what you said about the project, the basin you pinned, where each ' +
    'eligibility criterion stands, ' +
    (askingForPerson
      ? 'the numbers you typed in, and your request for the WaterBots team to look at it, with your note. '
      : 'and the numbers you typed in. ') +
    'Not the results worked out here, and not your conversation. Nothing stays on this site.'
  );
}

/**
 * THE TOOLS LINE — the maintainer's canon of 23 Sep 2026, in AGENT_RULES.md
 * under ruling 5: wherever a Fixable or Unknown row shows, the visitor is told
 * that WaterBots is building tools for exactly those fixes, and the same line
 * goes on the save door. A fact, never a sales line, so it shows only when the
 * visit has such a row, and says nothing when it has none.
 */
const TOOLS_LINE =
  'WaterBots is building tools and resources on waterbots.ai for exactly the fixes Phoebe ' +
  'found. Save your project to sign up for updates and access.';

export default function CrewRail({
  active,
  openCount,
  rows,
  onNavigate,
  sealing,
  onSeal,
  showTools,
  showPerson,
  person,
  onPerson,
}: {
  active: Surface;
  /** Open next steps on Wellington's desk. Null hides the count. */
  openCount: number | null;
  /**
   * The desk's rows, moved here from the centre on 4 Sep 2026 so the centre
   * is the conversation only. Slice 2 re-derives them per seat, in
   * methodology order; until then they are the same rows in a new home.
   */
  rows: DeskRow[];
  onNavigate: (surface: Surface) => void;
  /** The bridge's state while a seal is in flight, and the click that starts one. */
  sealing: SealState;
  onSeal: () => void;
  /** A Fixable or Unknown row stands on the sheet: the tools line shows. */
  showTools: boolean;
  /** A Blocked row stands on the sheet: the box to ask for a person shows. */
  showPerson: boolean;
  /** The box and the note, held by the shell so the save reads them. */
  person: PersonAsk;
  onPerson: (next: PersonAsk) => void;
}) {
  /* Only a box the visitor can see can be ticked. If the Blocked row goes
     (Phoebe moves it), an old tick does not travel unseen. */
  const asking = showPerson && person.wanted;
  const busy = sealing.kind === 'sealing' || sealing.kind === 'sealed';
  return (
    <aside
      className="chrome"
      aria-label="The crew"
      style={{
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--line)',
        borderBottom: 0,
        minHeight: 0,
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
      </div>

      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {CREW.map((member) => (
          <CrewRow
            key={member.name}
            member={member}
            current={member.surface === active}
            count={member.surface === 'desk' ? openCount : null}
            onOpen={() => onNavigate(member.surface)}
          />
        ))}
      </div>

      {/* The next steps, under the crew. Only rows the visit actually
          produced; an empty visit shows the save door alone, and says why. */}
      <div
        className="t-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          padding: '22px 18px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span aria-hidden style={{ width: 22, height: 1, background: 'var(--ink-4)' }} />
        Next steps
        <span style={{ marginLeft: 'auto', color: 'var(--ink-4)', letterSpacing: '0.08em' }}>{rows.length}</span>
      </div>
      <div style={{ padding: '0 12px', overflowY: 'auto', minHeight: 0 }}>
        {rows.length === 0 && (
          <p className="t-caption" style={{ margin: '0 6px 10px', fontSize: 10.5, lineHeight: 1.55 }}>
            Rows land here from this visit only, as Wellington learns the project. None is ever
            invented.
          </p>
        )}
        {rows.map((row) => (
          <div
            key={row.key}
            style={{
              padding: '10px 6px 11px',
              borderTop: '1px solid var(--line)',
            }}
          >
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink)' }}>{row.sentence}</p>
            <div style={{ marginTop: 6 }}>
              {row.action.kind === 'surface' && (
                <button
                  type="button"
                  className={row.primary ? 'wb-invite-action' : 'wb-row-action'}
                  style={row.primary ? undefined : { fontSize: 12 }}
                  onClick={() => row.action.kind === 'surface' && onNavigate(row.action.surface)}
                >
                  {row.action.label}
                </button>
              )}
              {row.action.kind === 'link' && (
                <a className="wb-row-action" style={{ fontSize: 12 }} href={row.action.href} target="_blank" rel="noopener noreferrer">
                  {row.action.label}
                  <span aria-hidden> ↗</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* THE BRIDGE (item S7), at the foot of the rail — look pass, 8 Sep 2026.
          It was the last of the next-step rows and the three-line footer sat
          under it; now the footer is gone and the save button lives here, in
          view without scrolling at laptop height. A primary button — solid
          Tide, the book's §7 — because it is the one action on this site that
          takes the visitor somewhere else with their work. The consent line
          sits under it, before the click. Every state is shown; the page moves
          only once a ticket is back. */}
      <div style={{ flex: 'none', padding: '12px 18px 16px', borderTop: '1px solid var(--line)' }}>
        {showTools && (
          <p style={{ margin: '0 0 10px', fontSize: 11.5, lineHeight: 1.5, color: 'var(--ink-2)' }}>
            {TOOLS_LINE}
          </p>
        )}

        {/* THE DOOR TO A PERSON — item A18, 26 Sep 2026. Shown only once a
            row is Blocked, because that is the one case where Phoebe offers
            it. A box and a short note, in a visitor's words; nothing is sent
            until the save button below is pressed, and then only with it. */}
        {showPerson && (
          <div style={{ margin: '0 0 12px' }}>
            <label
              style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink)', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={person.wanted}
                disabled={busy}
                onChange={(e) => onPerson({ ...person, wanted: e.target.checked })}
                style={{ marginTop: 3, accentColor: 'var(--tide-ui)', flex: 'none' }}
              />
              Send my project to the WaterBots team so a person can look at it
            </label>
            {person.wanted && (
              <textarea
                className="wb-rail-input"
                value={person.note}
                disabled={busy}
                onChange={(e) => onPerson({ ...person, note: e.target.value })}
                placeholder="A note for them, if you like"
                aria-label="A note for the WaterBots team"
                maxLength={MAX_HUMAN_NOTE_CHARS}
                rows={2}
                style={{ resize: 'none', marginTop: 6 }}
              />
            )}
          </div>
        )}

        <button
          type="button"
          className="wb-save-button"
          onClick={onSeal}
          disabled={busy}
          aria-busy={sealing.kind === 'sealing' || undefined}
        >
          {sealing.kind === 'sealing' && 'Saving your project…'}
          {sealing.kind === 'sealed' && 'Saved. Taking you to waterbots.ai…'}
          {(sealing.kind === 'idle' || sealing.kind === 'failed') && 'Save this project and sign up'}
        </button>
        <p className="t-caption" style={{ margin: '8px 0 0', fontSize: 10.5, lineHeight: 1.55 }}>
          {consentLine(asking)}
        </p>
        {sealing.kind === 'failed' && (
          <p role="alert" style={{ margin: '8px 0 0', fontSize: 12, lineHeight: 1.5, color: 'var(--state-pending)' }}>
            {sealing.message}
          </p>
        )}
      </div>
    </aside>
  );
}
