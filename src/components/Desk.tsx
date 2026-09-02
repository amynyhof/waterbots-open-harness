/**
 * The free desk — Wellington's dispatch desk on the open site.
 *
 * THE SHAPE is the production desk's, from the saved page the maintainer
 * brought in by hand on 2 Sep 2026: the host's header, a "needs you" card of
 * dispatch rows, the desk chat beneath it, and the one composer at the bottom
 * of the centre. Ruling C of that day: the two consoles should rhyme. The look
 * is taken and nothing else is.
 *
 * ONE COMPOSER PER SCREEN — BRAND.md §6 as corrected on 30 Aug 2026. It is
 * here, in the centre, and it is honestly disabled: Wellington answers on the
 * paid site, and here he organises the visit's next steps. There are NO
 * scripted messages, no fake typing indicator, and no control that appears to
 * work. No live model is called from this surface.
 *
 * ROWS DERIVE FROM THIS VISIT AND ARE NEVER INVENTED. Phoebe's eligibility
 * result, the basin pinned on the map, Calvin's screening number — and the
 * last row is always "Save this project and sign up", which opens the paid
 * site in a new window. Nothing is persisted here. That is checkpoint 2 of
 * item S11; at checkpoint 1 the desk is honestly empty and explains what will
 * appear.
 *
 * WELLINGTON IS EXTENDED, NEVER FORKED. Same portrait, same Tide accent, read
 * from the token — BRAND.md §6, "shared, never copied", the rule Bridget
 * already lives under here.
 */

import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';

const HOST = {
  name: 'Wellington',
  role: 'Floor manager',
};

/** The maintainer's own sentence, 2 Sep 2026. It is the composer's whole voice. */
const COMPOSER_NOTE =
  'Wellington answers on the paid site — here he organizes your next steps.';

export default function Desk() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* THE SAME BOX AS THE WORKSHEETS — 880px wide, the same gutter — so
            every centre surface shares one margin. */}
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '26px var(--gutter) 24px' }}>
          <HostHeader />

          <NeedsYou />

          <DeskChat />
        </div>
      </div>

      {/* The one composer, at the bottom of the centre, disabled and saying why. */}
      <div
        className="chrome"
        style={{
          flex: 'none',
          borderTop: '1px solid var(--line)',
          borderBottom: 0,
          padding: '12px 0 14px',
        }}
      >
        {/* The same 880px box and gutter as the content above it, so the
            composer's edges land exactly where the desk's do. */}
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 var(--gutter)' }}>
          <label htmlFor="wb-desk-composer" className="label" style={{ display: 'block', marginBottom: 6 }}>
            Message {HOST.name}
          </label>
          <textarea
            id="wb-desk-composer"
            className="wb-composer"
            rows={2}
            disabled
            placeholder={`Message ${HOST.name} — not live on this site.`}
            aria-describedby="wb-desk-composer-note"
          />
          <p id="wb-desk-composer-note" className="t-caption" style={{ margin: '7px 0 0', fontSize: 11 }}>
            {COMPOSER_NOTE}
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The host's header.
   -------------------------------------------------------------------------- */

function HostHeader() {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
      <HostMark size={48} />
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: 22, margin: 0, letterSpacing: '-0.015em', lineHeight: 1.15 }}>
          {HOST.name}
        </h1>
        <div
          className="t-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
            marginTop: 3,
          }}
        >
          {HOST.role} · host
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The "needs you" card — the dispatch rows.

   At checkpoint 1 it is honestly empty. It says what will appear here and
   where each row comes from, so an empty desk is a promise with its terms on
   it rather than a blank.
   -------------------------------------------------------------------------- */

function NeedsYou() {
  return (
    <section
      aria-labelledby="wb-needs-you"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
      }}
    >
      <div
        id="wb-needs-you"
        className="t-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-2)',
          padding: '10px 16px',
          borderBottom: '1px solid var(--line)',
          /* The reference's device: the card's top edge carries the host's
             accent as a keyline. An identity may be a keyline — §2.6. */
          borderTop: '2px solid var(--bot-wellington)',
        }}
      >
        Needs you
      </div>

      <div style={{ padding: '16px 16px 18px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>
          Nothing needs you yet.
        </div>
        <p className="t-caption" style={{ margin: '0 0 10px', lineHeight: 1.65, maxWidth: '64ch' }}>
          Rows appear here from this visit only, and none is ever invented. Phoebe’s eligibility
          result lands here when the worksheet moves. The basin you pin on the map lands here. Calvin’s
          screening number lands here once a pack has one.
        </p>
        <p className="t-caption" style={{ margin: 0, lineHeight: 1.65, maxWidth: '64ch' }}>
          The last row is always <strong style={{ color: 'var(--ink-2)' }}>Save this project and sign up</strong>,
          which opens waterbots.ai. Nothing is kept on this site, and a reload starts over.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   The desk chat — the label and the honest state above the composer.
   -------------------------------------------------------------------------- */

function DeskChat() {
  return (
    <div style={{ marginTop: 22 }}>
      <div
        className="t-mono"
        style={{
          fontSize: 10.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          marginBottom: 10,
        }}
      >
        Desk chat · {HOST.name}
      </div>
      <p className="t-body" style={{ margin: 0, color: 'var(--ink-3)', fontSize: 14 }}>
        Wellington does not answer on this site. Ask him on waterbots.ai; here his desk keeps your
        next steps in one place.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Wellington's portrait.

   Shared, never copied. It ships from brand/assets/bots/wellington.svg, which
   has its own allow-list line in .gitignore — the folder is ignored and
   re-opened one file at a time, and a portrait without a line builds locally
   and fails on deploy.
   -------------------------------------------------------------------------- */

export function HostMark({ size = 40 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--r-md)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: 'color-mix(in oklab, var(--bot-wellington) 12%, var(--card))',
        border: '1px solid color-mix(in oklab, var(--bot-wellington) 30%, transparent)',
        overflow: 'hidden',
      }}
    >
      <img
        src={wellingtonPortrait}
        alt=""
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        style={{ display: 'block' }}
      />
    </span>
  );
}
