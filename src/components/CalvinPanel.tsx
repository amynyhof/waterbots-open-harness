/**
 * Calvin's dock — the seat, not the agent.
 *
 * Same rule as Bridget's panel: there are NO scripted messages, no fake typing
 * indicator, and no composer that appears to work. Calvin's chat is not built,
 * and the panel says so plainly.
 *
 * HIS DOCK HAS A SHAPE OF ITS OWN, AND THAT IS DELIBERATE. Phoebe's dock and
 * Bridget's dock are top-anchored — host at the top, then body. Calvin's adds
 * a footer strip that never scrolls, carrying the one line that must never
 * leave the screen: this is a screening estimate and it is not verified.
 *
 * A calculator that hands someone a number cannot let the words "not verified"
 * scroll out of sight, and a chat dock's shape allows exactly that. The strip
 * is the difference between his seat and a conversation's seat, and it is the
 * reason the maintainer approved a new shape rather than a recoloured one.
 * Maintainer's ruling, 31 Aug 2026, signed on pixels.
 *
 * HIS COLOUR IS PLUM #5848A8, and it is a knowing exception to BRAND.md §6.
 * The book otherwise gives Plum to Reggie and forbids pointing an accent at a
 * second agent; the maintainer ruled the exception and it is recorded in the
 * book at §6 rather than left here. Mint was the obvious pick — Vector holds
 * the calculator seat on the paid side — and was refused on the merits,
 * because §2.1 also makes Mint "Success / approved" and a surface whose whole
 * message is "not verified" must not wash green.
 *
 * At 7.22:1 on white Plum clears 4.5:1, so unlike Surf and Anemone it may
 * carry text as well as keylines. The caveat line below is set in it.
 */

import calvinPortrait from '../../brand/assets/bots/calvin.svg';

const HOST = {
  name: 'Calvin',
  role: 'Screening calculator',
};

export default function CalvinPanel() {
  return (
    <aside
      className="wb-panel wb-dock"
      aria-label={`${HOST.name}, ${HOST.role}`}
      style={{
        /* Calvin hosts the quantification step, so its dock is tinted in his
           accent — the same 5% fill and 25% border every host panel takes. */
        ['--host-accent' as string]: 'var(--bot-calvin)',
        width: 'var(--chat-rail)',
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Host presence, pinned to the top. */}
      <div
        style={{
          display: 'flex',
          gap: 11,
          alignItems: 'center',
          padding: '14px 16px',
          borderBottom: '1px solid var(--line)',
          flex: 'none',
        }}
      >
        <HostMark />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{HOST.name}</div>
          <div className="t-caption" style={{ fontSize: 11.5 }}>
            {HOST.role}
          </div>
        </div>
      </div>

      {/* The honest empty state. Two sentences, no urgency, no emoji. */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Not live yet
        </div>
        <p className="t-body" style={{ margin: 0, color: 'var(--ink-2)', fontSize: 14 }}>
          Calvin is not answering yet, and this panel is deliberately empty until he can give you a
          real answer. The worksheet explains each question itself in the meantime.
        </p>
      </div>

      {/* The strip that never scrolls. This is the shape's whole job. */}
      <div
        style={{
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '11px 16px',
          borderTop: '1px solid color-mix(in oklab, var(--host-accent) 25%, transparent)',
          background: 'color-mix(in oklab, var(--host-accent) 8%, var(--frame))',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: 'var(--r-pill)',
            background: 'var(--bot-calvin)',
            flex: 'none',
          }}
        />
        <span
          className="t-mono"
          style={{
            fontSize: 10.5,
            fontWeight: 500,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'var(--bot-calvin)',
          }}
        >
          Screening estimate · not verified
        </span>
      </div>
    </aside>
  );
}

/**
 * Calvin's portrait.
 *
 * Drawn in the house form on this site rather than carried in from the Commons
 * design — a knowing exception to BRAND.md §0's "never invent", ruled by the
 * maintainer on 31 Aug 2026 and recorded in the book at §6.
 *
 * HIS FINIAL IS AN OPEN RING WHERE VECTOR'S IS A SOLID DOT. That is the
 * signature, and it carries the meaning: a solid dot is a measured value, an
 * open ring is an estimate. His mouth is an approximately-equals sign for the
 * same reason.
 *
 * It ships from brand/assets/bots/calvin.svg, which needed its own line in
 * .gitignore — that folder is ignored and re-opened one file at a time, so a
 * portrait without an exception builds locally and fails on deploy.
 */
function HostMark() {
  return (
    <span
      style={{
        /* 40px in chat — BRAND.md §6. */
        width: 40,
        height: 40,
        borderRadius: 'var(--r-pill)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: 'color-mix(in oklab, var(--bot-calvin) 12%, var(--card))',
        border: '1px solid color-mix(in oklab, var(--bot-calvin) 40%, transparent)',
        overflow: 'hidden',
      }}
    >
      <img src={calvinPortrait} alt="" width={30} height={30} style={{ display: 'block' }} />
    </span>
  );
}
