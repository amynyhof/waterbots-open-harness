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
import type { Surface } from '../lib/surfaces';

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
    role: 'Floor manager',
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
  onNavigate,
}: {
  active: Surface;
  /** Open next steps on Wellington's desk. Null hides the count. */
  openCount: number | null;
  onNavigate: (surface: Surface) => void;
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

      <div style={{ flex: 1 }} />

      <p
        className="t-mono"
        style={{
          margin: 0,
          padding: '12px 18px 16px',
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          lineHeight: 1.8,
          color: 'var(--ink-4)',
        }}
      >
        Counts are open next steps.
        <br />
        Each face opens its own surface.
        <br />
        Only Phoebe answers on this site.
      </p>
    </aside>
  );
}
