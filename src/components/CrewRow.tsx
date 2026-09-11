/**
 * One crew row — a portrait in a tinted square, the name in the agent's own
 * accent where the accent may carry text, and a role caption beneath. The
 * row is a button that opens the agent's step, and the current one rises to
 * a card underlined in the agent's colour.
 *
 * THE SHAPE IS THE PRODUCTION CONSOLE'S, from the saved page the maintainer
 * brought in by hand on 2 Sep 2026. Drawn here from 11 Sep 2026 (item S18,
 * slice 2), moved out of the crew rail. ~~A static, listing form sat beside
 * the button for the Commons' right column~~ — gone with that column on the
 * maintainer's ruling of 11 Sep 2026: on the Commons the shelf is the crew.
 */

import type { CrewMember } from '../lib/crew';

export default function CrewRow({
  member,
  current = false,
  count = null,
  onOpen,
}: {
  member: CrewMember;
  /** Whether this member's step is the one open. */
  current?: boolean;
  /** A count to show at the row's end, or null for none. */
  count?: number | null;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="wb-crew-row"
      onClick={onOpen}
      aria-current={current ? 'page' : undefined}
      style={{
        /* The current row rises one plane, with the hairline §2.3 pairs with
           a white card. Never an accent fill. */
        background: current ? 'var(--card)' : 'transparent',
        border: current ? '1px solid var(--line)' : '1px solid transparent',
        /* The current card is underlined in the agent's colour, the same
           underline its screen's active tab wears — maintainer's ruling 3 of
           9 Sep 2026, item S16. An identity keyline, never a status dot
           (§2.6); Surf may carry a keyline. */
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
}
