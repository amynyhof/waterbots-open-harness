/**
 * One crew row — a portrait in a tinted square, the name in the agent's own
 * accent where the accent may carry text, and a role caption beneath.
 *
 * THE SHAPE IS THE PRODUCTION CONSOLE'S, from the saved page the maintainer
 * brought in by hand on 2 Sep 2026. Drawn once here from 11 Sep 2026 (item
 * S18, slice 2) so the crew rail on the console and the Agent Commons' right
 * column show the same row; before that the rail drew it inline.
 *
 * TWO WAYS TO SIT. With `onOpen` the row is a button that opens the agent's
 * step, and the current one rises to a card underlined in the agent's colour
 * — the console's gesture. Without it the row is a plain listing: the same
 * look, no hover and no hand cursor, so it does not promise a click it cannot
 * keep. The Commons shelf lists the crew that way, because on the Commons an
 * agent is opened from its pack's card, not from the crew.
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
  /** The click, when the row opens something. Absent, the row is a listing. */
  onOpen?: () => void;
}) {
  const body = (
    <>
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
    </>
  );

  if (!onOpen) {
    return (
      <div className="wb-crew-row is-static" style={{ border: '1px solid transparent' }}>
        {body}
      </div>
    );
  }

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
      {body}
    </button>
  );
}
