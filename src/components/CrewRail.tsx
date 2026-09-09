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
 */

import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import type { SealState } from '../lib/handoff';
import type { Surface } from '../lib/surfaces';
import type { DeskRow } from '../lib/visit';

/**
 * THE CONSENT LINE — item S7, the contract's first step: the visitor is told
 * what crosses before they click, in their own words for the things. It
 * lists exactly what the seal holds (src/lib/handoff.ts) and names the two
 * things it never holds. If the seal ever changes, this line changes with it.
 */
const CONSENT_LINE =
  'Going with you: what you said about the project, the basin you pinned, where each ' +
  'eligibility criterion stands, and the numbers you typed in. Not the results worked out ' +
  'here, and not your conversation. Nothing stays on this site.';

interface CrewMember {
  name: string;
  role: string;
  portrait: string;
  /** The identity token, read and never re-typed. */
  token: string;
  /** Whether the accent clears 4.5:1 on white and may carry the name as text. */
  nameInAccent: boolean;
  surface: Surface;
}

const CREW: CrewMember[] = [
  {
    name: 'Wellington',
    /* "Team Lead" — maintainer's naming ruling, 2 Sep 2026. */
    role: 'Team Lead',
    portrait: wellingtonPortrait,
    token: '--bot-wellington',
    nameInAccent: true,
    surface: 'desk',
  },
  {
    name: 'Phoebe',
    role: 'Eligibility',
    portrait: phoebePortrait,
    token: '--bot-phoebe',
    nameInAccent: true,
    surface: 'eligibility',
  },
  {
    name: 'Bridget',
    role: 'Map',
    portrait: bridgetPortrait,
    token: '--bot-bridget',
    /* Surf is 2.04:1 on white and never carries text. */
    nameInAccent: false,
    surface: 'map',
  },
  {
    name: 'Calvin',
    role: 'Calculator',
    portrait: calvinPortrait,
    token: '--bot-calvin',
    nameInAccent: true,
    surface: 'quantification',
  },
];

export default function CrewRail({
  active,
  openCount,
  rows,
  onNavigate,
  sealing,
  onSeal,
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
}) {
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
        {CREW.map((member) => {
          const current = member.surface === active;
          const count = member.surface === 'desk' ? openCount : null;
          return (
            <button
              key={member.name}
              type="button"
              className="wb-crew-row"
              onClick={() => onNavigate(member.surface)}
              aria-current={current ? 'page' : undefined}
              style={{
                /* The current row rises one plane, with the hairline §2.3
                   pairs with a white card. Never an accent fill. */
                background: current ? 'var(--card)' : 'transparent',
                border: current ? '1px solid var(--line)' : '1px solid transparent',
                /* The current card is underlined in the agent's colour, the
                   same underline its screen's active tab wears — maintainer's
                   ruling 3 of 9 Sep 2026, item S16. An identity keyline, never
                   a status dot (§2.6); Surf may carry a keyline. */
                borderBottom: current ? `2px solid var(${member.token})` : '1px solid transparent',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--r-md)',
                  flex: 'none',
                  display: 'grid',
                  placeItems: 'center',
                  background: `color-mix(in oklab, var(${member.token}) 12%, var(--card))`,
                  overflow: 'hidden',
                }}
              >
                <img src={member.portrait} alt="" width={28} height={28} style={{ display: 'block' }} />
              </span>
              <span style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: member.nameInAccent ? `var(${member.token})` : 'var(--ink)',
                  }}
                >
                  {member.name}
                </span>
                <span
                  className="t-mono"
                  style={{
                    display: 'block',
                    fontSize: 10,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    marginTop: 3,
                  }}
                >
                  {member.role}
                </span>
              </span>
              {count !== null && count > 0 && (
                <span
                  className="t-mono"
                  aria-label={`${count} open next steps`}
                  style={{ fontSize: 13, color: 'var(--ink-2)', flex: 'none' }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
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
                  className="wb-row-action"
                  style={{ fontSize: 12 }}
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
        <button
          type="button"
          className="wb-save-button"
          onClick={onSeal}
          disabled={sealing.kind === 'sealing' || sealing.kind === 'sealed'}
          aria-busy={sealing.kind === 'sealing' || undefined}
        >
          {sealing.kind === 'sealing' && 'Saving your project…'}
          {sealing.kind === 'sealed' && 'Saved. Taking you to waterbots.ai…'}
          {(sealing.kind === 'idle' || sealing.kind === 'failed') && 'Save this project and sign up'}
        </button>
        <p className="t-caption" style={{ margin: '8px 0 0', fontSize: 10.5, lineHeight: 1.55 }}>
          {CONSENT_LINE}
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
