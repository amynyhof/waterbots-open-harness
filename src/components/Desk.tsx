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
 * ROWS DERIVE FROM THIS VISIT AND ARE NEVER INVENTED. They come from one
 * function, deskRows in src/lib/visit.ts: Phoebe's eligibility result, the
 * basin pinned on the map, Calvin's screening figure — and the last row is
 * always "Save this project and sign up", which opens the paid site in a new
 * window and carries nothing across. An empty visit shows the save row and an
 * honest note saying what will appear. Nothing is persisted here.
 *
 * A DISPATCH ROW IS A ROW, NOT A BUBBLE — BRAND.md §6: portrait, the sender's
 * name, one complete sentence, one action. Rows are divider-separated inside
 * one card; a card cannot contain a card.
 *
 * THE PROJECT CONTEXT sits at the top: name, place, standard of interest.
 * Session only, cleared by a reload, and the rail's card reads the name.
 * Maintainer's ruling A, 2 Sep 2026. Nothing typed here goes anywhere.
 *
 * WELLINGTON IS EXTENDED, NEVER FORKED. Same portrait, same Tide accent, read
 * from the token — BRAND.md §6, "shared, never copied", the rule Bridget
 * already lives under here.
 */

import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import type { Surface } from '../lib/surfaces';
import {
  STANDARD_CHOICES,
  type DeskRow,
  type RowSender,
  type StandardInterest,
  type VisitContext,
} from '../lib/visit';

/* His role is "Team Lead" — maintainer's naming ruling, 2 Sep 2026, everywhere
   he is named on this site. Not "Floor manager", and not "host" as a title. */
const HOST = {
  name: 'Wellington',
  role: 'Team Lead',
};

/** The maintainer's own sentence, 2 Sep 2026. It is the composer's whole voice. */
const COMPOSER_NOTE =
  'Wellington answers on the paid site — here he organizes your next steps.';

const SENDER: Record<RowSender, { name: string; role: string; portrait: string; token: string }> = {
  wellington: { name: 'Wellington', role: 'Team Lead', portrait: wellingtonPortrait, token: '--bot-wellington' },
  phoebe: { name: 'Phoebe', role: 'Eligibility', portrait: phoebePortrait, token: '--bot-phoebe' },
  bridget: { name: 'Bridget', role: 'Map', portrait: bridgetPortrait, token: '--bot-bridget' },
  calvin: { name: 'Calvin', role: 'Calculator', portrait: calvinPortrait, token: '--bot-calvin' },
};

export default function Desk({
  context,
  onContext,
  rows,
  onNavigate,
}: {
  context: VisitContext;
  onContext: (context: VisitContext) => void;
  rows: DeskRow[];
  onNavigate: (surface: Surface) => void;
}) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {/* THE SAME BOX AS THE WORKSHEETS — 880px wide, the same gutter — so
            every centre surface shares one margin. */}
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '26px var(--gutter) 24px' }}>
          <HostHeader />

          <ProjectContext context={context} onContext={onContext} />

          <NeedsYou rows={rows} onNavigate={onNavigate} />

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
      <Portrait sender="wellington" size={48} />
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
          {HOST.role}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The project context — three fields, this visit only.
   -------------------------------------------------------------------------- */

function ProjectContext({
  context,
  onContext,
}: {
  context: VisitContext;
  onContext: (context: VisitContext) => void;
}) {
  const set = (patch: Partial<VisitContext>) => onContext({ ...context, ...patch });

  return (
    <section
      aria-labelledby="wb-project-context"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        padding: '12px 16px 6px',
        marginBottom: 14,
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}
      >
        <div
          id="wb-project-context"
          className="t-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--ink-2)',
          }}
        >
          Project context
        </div>
        <span className="t-caption" style={{ fontSize: 10.5 }}>
          This visit only. Nothing typed here is kept or sent anywhere.
        </span>
      </div>

      <ContextRow label="Project name">
        <input
          className="wb-context-input"
          type="text"
          value={context.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="What you call it"
          aria-label="Project name"
          maxLength={120}
        />
      </ContextRow>

      <ContextRow label="Place" help="Pinning a basin on the map fills this in if you leave it blank.">
        <input
          className="wb-context-input"
          type="text"
          value={context.place}
          onChange={(e) => set({ place: e.target.value })}
          placeholder="Where it is"
          aria-label="Place"
          maxLength={160}
        />
      </ContextRow>

      <ContextRow label="Standard of interest" help="An interest, not a claim. Only VWBA is built here today." last>
        <div style={{ display: 'flex' }} role="group" aria-label="Standard of interest">
          {STANDARD_CHOICES.map((choice, i) => {
            const on = context.standard === choice.value;
            return (
              <button
                key={choice.value}
                type="button"
                aria-pressed={on}
                onClick={() => set({ standard: on ? '' : (choice.value as StandardInterest) })}
                className="t-mono wb-calc-seg"
                style={{
                  borderTopLeftRadius: i === 0 ? 'var(--r-sm)' : 0,
                  borderBottomLeftRadius: i === 0 ? 'var(--r-sm)' : 0,
                  borderTopRightRadius: i === STANDARD_CHOICES.length - 1 ? 'var(--r-sm)' : 0,
                  borderBottomRightRadius: i === STANDARD_CHOICES.length - 1 ? 'var(--r-sm)' : 0,
                  borderLeftWidth: i === 0 ? 1 : 0,
                  background: on ? 'color-mix(in oklab, var(--tide-ui) 10%, var(--card))' : 'var(--card)',
                  color: on ? 'var(--tide-text)' : 'var(--ink-3)',
                  borderColor: on ? 'color-mix(in oklab, var(--tide-ui) 40%, transparent)' : 'var(--line)',
                }}
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      </ContextRow>
    </section>
  );
}

function ContextRow({
  label,
  help,
  last,
  children,
}: {
  label: string;
  help?: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: last ? 0 : '1px solid var(--line)', padding: '9px 0 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{label}</span>
        <div style={{ flex: 'none' }}>{children}</div>
      </div>
      {help && (
        <div style={{ fontSize: 10, lineHeight: 1.5, color: 'var(--ink-3)', marginTop: 3 }}>{help}</div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   The "needs you" card — the dispatch rows.
   -------------------------------------------------------------------------- */

function NeedsYou({ rows, onNavigate }: { rows: DeskRow[]; onNavigate: (surface: Surface) => void }) {
  const derived = rows.filter((r) => r.key !== 'save');

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
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span>Needs you</span>
        <span style={{ color: 'var(--ink-4)', letterSpacing: '0.08em' }}>
          {rows.length} {rows.length === 1 ? 'next step' : 'next steps'}
        </span>
      </div>

      {/* The honest note, shown only while nothing has been derived. */}
      {derived.length === 0 && (
        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 5 }}>
            Nothing from this visit yet.
          </div>
          <p className="t-caption" style={{ margin: 0, lineHeight: 1.65, maxWidth: '64ch' }}>
            Rows appear here from this visit only, and none is ever invented. Phoebe’s eligibility
            result lands here when the worksheet moves. The basin you pin on the map lands here. Calvin’s
            screening figure lands here once a pack has one.
          </p>
        </div>
      )}

      {rows.map((row, i) => (
        <DispatchRow key={row.key} row={row} last={i === rows.length - 1} onNavigate={onNavigate} />
      ))}
    </section>
  );
}

/** One dispatch: portrait, signed name, one sentence, one action. */
function DispatchRow({
  row,
  last,
  onNavigate,
}: {
  row: DeskRow;
  last: boolean;
  onNavigate: (surface: Surface) => void;
}) {
  const who = SENDER[row.from];
  return (
    <div
      style={{
        display: 'flex',
        gap: 13,
        alignItems: 'flex-start',
        padding: '13px 16px 14px',
        borderBottom: last ? 0 : '1px solid var(--line)',
      }}
    >
      <Portrait sender={row.from} size={36} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: row.from === 'bridget' ? 'var(--ink)' : `var(${who.token})`,
            }}
          >
            {who.name}
          </span>
          <span
            className="t-mono"
            style={{ fontSize: 9.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-3)' }}
          >
            {who.role}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink)' }}>{row.sentence}</p>
        <div style={{ marginTop: 7 }}>
          {row.action.kind === 'surface' ? (
            <button
              type="button"
              className="wb-row-action"
              onClick={() => row.action.kind === 'surface' && onNavigate(row.action.surface)}
            >
              {row.action.label}
            </button>
          ) : (
            <a
              className="wb-row-action"
              href={row.action.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {row.action.label}
              <span aria-hidden> ↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
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
   Portraits.

   Shared, never copied. Wellington's ships from brand/assets/bots/
   wellington.svg, which has its own allow-list line in .gitignore — the
   folder is ignored and re-opened one file at a time, and a portrait without
   a line builds locally and fails on deploy.
   -------------------------------------------------------------------------- */

function Portrait({ sender, size }: { sender: RowSender; size: number }) {
  const who = SENDER[sender];
  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--r-md)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: `color-mix(in oklab, var(${who.token}) 12%, var(--card))`,
        border: `1px solid color-mix(in oklab, var(${who.token}) 30%, transparent)`,
        overflow: 'hidden',
      }}
    >
      <img
        src={who.portrait}
        alt=""
        width={Math.round(size * 0.72)}
        height={Math.round(size * 0.72)}
        style={{ display: 'block' }}
      />
    </span>
  );
}
