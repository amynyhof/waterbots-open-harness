/**
 * The Agent Commons shelf — the centre of the Commons page. Item S18,
 * slice 2, built 11 Sep 2026 to the picture the maintainer approved on
 * 10 Sep (captures/2026-09-09-agent-commons-shelf.png); the crew column
 * beside it left in slice 3 on her ruling of 11 Sep — the shelf is the crew.
 *
 * ONE CARD PER KNOWLEDGE PACK, wearing the face of the agent who holds it:
 * the portrait and name as the crew row draws them, the pack's name, one
 * short line on what it is good at, the document it is drawn from as a tag,
 * its public grade as a chip, and "Open". The cards come from
 * src/lib/commonsShelf.ts, which reads the registries; nothing here names a
 * pack. Open hands the card up to the Commons page, which opens the holder's
 * screen alone (slice 3).
 *
 * EVERY CHIP READS "NOT YET GRADED", and will until a real card from the one
 * public exam exists — the maintainer's ONE GRADER and REAL ONLY rulings of
 * 9 Sep 2026. The intro says where a grade would come from and that none
 * has been run, in a visitor's words, so the chips are explained before they
 * are read.
 *
 * WELLINGTON HAS NO CARD, and the foot says so rather than leaving a visitor
 * to wonder where the Team Lead went. The line under it says what signing up
 * does and that nothing is kept — the caption that sat under the sign-up
 * button while the column stood.
 */

import { SHELF, shelfCountLine, type ShelfCard } from '../lib/commonsShelf';
import { SITE_LABEL } from '../lib/site';
import { DESK_LABEL } from '../lib/surfaces';

export default function CommonsShelf({ onOpen }: { onOpen: (card: ShelfCard) => void }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ padding: '22px var(--gutter) 24px' }}>
        <h1 style={{ fontSize: 21, margin: '0 0 8px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
          Agent Commons
        </h1>
        <p
          className="t-body"
          style={{ margin: 0, maxWidth: 760, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}
        >
          Knowledge packs, each held by the agent who works from it. Open one to read it, try it,
          and see how it was graded. Grades come from one public exam, run outside this site on
          real projects and real packs. None has been run yet, so every pack says so.
        </p>

        <div
          className="t-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
            margin: '22px 0 10px',
          }}
        >
          {shelfCountLine()}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(232px, 1fr))',
            gap: 14,
            maxWidth: 1180,
          }}
        >
          {SHELF.map((card) => (
            <ShelfCardView key={card.key} card={card} onOpen={() => onOpen(card)} />
          ))}
        </div>

        <p className="t-caption" style={{ margin: '16px 0 0', fontSize: 12, lineHeight: 1.55 }}>
          Wellington, the Team Lead, carries no knowledge pack. He works from what the crew can do,
          and on this site he answers at {DESK_LABEL}.
        </p>
        <p className="t-caption" style={{ margin: '6px 0 0', fontSize: 12, lineHeight: 1.55 }}>
          Free to explore, and nothing is kept between visits. Signing up opens a project on{' '}
          {SITE_LABEL}, where the crew keeps what you tell them.
        </p>
      </div>
    </div>
  );
}

function ShelfCardView({ card, onOpen }: { card: ShelfCard; onOpen: () => void }) {
  const { holder } = card;
  return (
    <article className="card" aria-label={card.title} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* The holder, as the crew row draws them: a tinted square, the name in
          the accent where it may carry text, the role beneath. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          aria-hidden
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--r-md)',
            flex: 'none',
            display: 'grid',
            placeItems: 'center',
            background: `color-mix(in oklab, var(${holder.token}) 12%, var(--card))`,
            border: `1px solid color-mix(in oklab, var(${holder.token}) 30%, transparent)`,
            overflow: 'hidden',
          }}
        >
          <img src={holder.portrait} alt="" width={28} height={28} style={{ display: 'block' }} />
        </span>
        <span style={{ minWidth: 0 }}>
          <span
            style={{
              display: 'block',
              fontSize: 15,
              fontWeight: 600,
              lineHeight: 1.2,
              color: holder.nameInAccent ? `var(${holder.token})` : 'var(--ink)',
            }}
          >
            {holder.name}
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
            {holder.role}
          </span>
        </span>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 600, margin: '14px 0 0', lineHeight: 1.3, letterSpacing: '-0.005em' }}>
        {card.title}
      </h2>
      <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--ink-2)' }}>{card.line}</p>

      <div style={{ marginTop: 'auto', paddingTop: 14 }}>
        <span className="tag" style={{ maxWidth: '100%', whiteSpace: 'normal', lineHeight: 1.35 }}>
          {card.tag}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
        {/* A state, so a chip: outlined at 40% of the pending colour, no
            fill, the text in ink — amber may not carry type (§2.5). */}
        <span className="chip" style={{ ['--chip-role' as string]: 'var(--state-pending)' }}>
          {card.grade === null ? 'not yet graded' : 'graded'}
        </span>
        <button type="button" className="wb-row-action" style={{ marginLeft: 'auto' }} onClick={onOpen}>
          Open
        </button>
      </div>
    </article>
  );
}
