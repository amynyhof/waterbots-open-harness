/**
 * The Agent Commons page's centre — the opening, how it works, and the list
 * of modules. Item S18, slice 2, built 11 Sep 2026 as a shelf of cards;
 * rewritten on 28 Oct 2026 to the maintainer's words of that day: an
 * opening paragraph, three short points on how it works, a "Build a module
 * with us" button to the main site's Consulting page at the right of the
 * header, and the modules as one vertical list, one row each.
 *
 * ONE ROW PER MODULE: the agent's picture, name and role; one line on what
 * it does; its method; its status; its owner; its grade; its community
 * rating; and the row's action. The rows come from src/lib/commonsShelf.ts,
 * which reads the registries; nothing here names a pack. ONE LIST, the
 * maintainer's word of 28 Oct 2026: the built modules, then the planned one,
 * then the modules seeking partners, after them, in the same list.
 *
 * THE ACTION. Open hands the entry up to the Commons page, which opens the
 * holder's screen alone (slice 3); only a module marked `opens` has it, and
 * the others say "Coming soon", not clickable. A planned module says "Not
 * open yet". A module seeking partners has "Work with us", and its status
 * chip does the same: both open an email to the team, its subject
 * "Partnering on: <module name>".
 *
 * PLAIN TEXT, NOT CHIPS: status, method and grade are plain text from 28 Oct
 * 2026, her word. The one chip left is "Seeking partners", because it is a
 * link.
 *
 * EVERY GRADE READS "NOT YET GRADED", and will until a real card from the one
 * public exam exists — the maintainer's ONE GRADER and REAL ONLY rulings of
 * 9 Sep 2026. A module seeking partners shows a dash: nothing exists to grade.
 * The grading note says where a grade would come from and that none has run.
 *
 * THE COMMUNITY RATING IS DISPLAY ONLY: five empty stars and "No ratings yet"
 * on every row, and no way to rate. Nothing is counted or stored.
 */

import type { ReactNode } from 'react';
import { PLANNED, SEEKING, SHELF, shelfCountLine, type PlannedModule, type ShelfCard } from '../lib/commonsShelf';
import { CONSULTING_URL, partnerMailto } from '../lib/site';

/** How it works — the maintainer's three points of 28 Oct 2026, as she wrote them. */
const HOW_IT_WORKS: { lead: string; body: string }[] = [
  {
    lead: 'One module, every site:',
    body: 'the same agent and calculator runs here and on waterbots.ai.',
  },
  {
    lead: 'Open by default:',
    body: 'code under Apache 2.0; methods and guides under CC BY 4.0; anyone can use them with credit.',
  },
  {
    lead: 'Built with partners:',
    body:
      'we build modules with developers, experts and funders; a partner can own its module, and ' +
      'the Commons lists it with credit.',
  },
];

const EYEBROW = {
  fontSize: 10.5,
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  color: 'var(--ink-3)',
} as const;

export default function CommonsShelf({ onOpen }: { onOpen: (card: ShelfCard) => void }) {
  return (
    /* The scrollbar's room is kept on both edges, so the centred page sits
       exactly under the menu, which has no scrollbar beside it. */
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarGutter: 'stable both-edges' }}>
      {/* Centred on the menu's own band — 1240px, 24px each side — so the page
          lines up with the menu above it; the maintainer's word of 28 Oct 2026. */}
      <div style={{ padding: '22px 24px 32px', maxWidth: 1240, margin: '0 auto' }}>
        {/* THE HEADER: the title and opening on the left, the one button that
            asks a partner in on the right; it drops below on a narrow screen. */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            columnGap: 32,
            rowGap: 14,
          }}
        >
          <div style={{ flex: '1 1 480px', maxWidth: 760 }}>
            <h1 style={{ fontSize: 21, margin: '0 0 8px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
              Agent Commons
            </h1>
            <p
              className="t-body"
              style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}
            >
              A free, open library of AI agents for water projects of every kind, from safe drinking
              water to watershed protection, each built for a specific task. Every agent works from a
              reviewed knowledge pack and an exact calculator, built with human experts. Read it, try
              it, and see how it was tested.
            </p>
          </div>
          <a
            className="btn"
            href={CONSULTING_URL}
            style={{ display: 'inline-block', flex: 'none', textDecoration: 'none', marginTop: 2 }}
          >
            Build a module with us
          </a>
        </div>

        <h2 className="t-mono" style={{ ...EYEBROW, fontWeight: 400, margin: '22px 0 10px' }}>
          How it works
        </h2>
        <ul style={{ margin: 0, paddingLeft: 18, maxWidth: 760, display: 'grid', gap: 6 }}>
          {HOW_IT_WORKS.map((point) => (
            <li key={point.lead} style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
              <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{point.lead}</strong> {point.body}
            </li>
          ))}
        </ul>
        <div className="t-mono" style={{ ...EYEBROW, margin: '28px 0 4px' }}>
          {shelfCountLine()}
        </div>
        <p className="t-caption" style={{ margin: '0 0 14px', fontSize: 12, lineHeight: 1.55 }}>
          Grades come from one exam, run outside this site on real projects. None has run yet, so
          every module says so.
        </p>

        <ModuleHead />
        <ul className="wb-module-list">
          {SHELF.map((card) => (
            <ModuleRow key={card.key} card={card} onOpen={() => onOpen(card)} />
          ))}
          {PLANNED.map((planned) => (
            <PlannedRow key={planned.key} planned={planned} />
          ))}
          {SEEKING.map((planned) => (
            <PlannedRow key={planned.key} planned={planned} seeking />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ModuleRow({ card, onOpen }: { card: ShelfCard; onOpen: () => void }) {
  const { holder } = card;
  return (
    <li className="wb-module-row" aria-label={card.title}>
      {/* The holder, as the crew row draws them: a tinted square, the name in
          the accent where it may carry text, the role beneath. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <Portrait token={holder.token}>
          <img src={holder.portrait} alt="" width={24} height={24} style={{ display: 'block' }} />
        </Portrait>
        <span style={{ minWidth: 0 }}>
          <span
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.2,
              color: holder.nameInAccent ? `var(${holder.token})` : 'var(--ink)',
            }}
          >
            {holder.name}
          </span>
          <Role>{holder.role}</Role>
        </span>
      </div>

      <Module title={card.title} line={card.line} />

      <Cell label="Method">{card.tag}</Cell>
      <Cell label="Status">
        <Status text={card.status} />
      </Cell>
      <Cell label="Owner">{card.owner}</Cell>
      <Cell label="Grade">not yet graded</Cell>
      <Cell label="Community rating">
        <Rating />
      </Cell>
      <div>
        {card.opens ? (
          <button type="button" className="wb-row-action" onClick={onOpen}>
            Open
          </button>
        ) : (
          <Quiet>Coming soon</Quiet>
        )}
      </div>
    </li>
  );
}

/** The list's header row; below 900px it hides and each cell carries its label. */
function ModuleHead() {
  return (
    <div className="wb-module-head t-mono" aria-hidden>
      <span>Agent</span>
      <span>What it does</span>
      <span>Method</span>
      <span>Status</span>
      <span>Owner</span>
      <span>Grade</span>
      <span>Rating</span>
      <span />
    </div>
  );
}

/* A module with nothing to open: a named agent shows its name with an empty
   square, as no portrait exists for it; with none, the row says so. A module
   seeking partners links its status chip and its action to the team's inbox. */
function PlannedRow({ planned, seeking = false }: { planned: PlannedModule; seeking?: boolean }) {
  const mail = partnerMailto(planned.title);
  return (
    <li className="wb-module-row" aria-label={planned.title}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <Portrait />
        {planned.agent ? (
          <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)' }}>
            {planned.agent}
          </span>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>No agent yet</span>
        )}
      </div>

      <Module title={planned.title} line={planned.line} />

      <Cell label="Method">{planned.method}</Cell>
      <Cell label="Status">
        {seeking ? (
          <a
            className="chip"
            href={mail}
            aria-label={`${planned.status}: email us about partnering on ${planned.title}`}
            style={{ whiteSpace: 'nowrap', textDecoration: 'none', cursor: 'pointer' }}
          >
            {planned.status}
          </a>
        ) : (
          <Status text={planned.status} />
        )}
      </Cell>
      <Cell label="Owner">{planned.owner}</Cell>
      <Cell label="Grade">
        {/* A module seeking partners has nothing to grade yet: a dash, her word of 28 Oct 2026. */}
        {seeking ? <span style={{ color: 'var(--ink-3)' }}>—</span> : 'not yet graded'}
      </Cell>
      <Cell label="Community rating">
        <Rating />
      </Cell>
      <div>
        {seeking ? (
          <a className="wb-row-action" href={mail} style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Work with us
          </a>
        ) : (
          <Quiet>Not open yet</Quiet>
        )}
      </div>
    </li>
  );
}

/** A tinted square in the agent's accent; an empty, quiet one where there is no agent. */
function Portrait({ token, children }: { token?: string; children?: ReactNode }) {
  return (
    <span
      aria-hidden
      style={{
        width: 34,
        height: 34,
        borderRadius: 'var(--r-md)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: token ? `color-mix(in oklab, var(${token}) 12%, var(--card))` : 'var(--card)',
        border: token
          ? `1px solid color-mix(in oklab, var(${token}) 30%, transparent)`
          : '1px dashed var(--line)',
        overflow: 'hidden',
      }}
    >
      {children}
    </span>
  );
}

function Role({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </span>
  );
}

function Module({ title, line }: { title: string; line: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{title}</div>
      <div style={{ marginTop: 2, fontSize: 13, lineHeight: 1.45, color: 'var(--ink-2)' }}>{line}</div>
    </div>
  );
}

/** One cell; below 900px it carries its own small label, as the header row is hidden. */
function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ minWidth: 0, fontSize: 13, lineHeight: 1.4, color: 'var(--ink-2)' }}>
      <span className="wb-module-label">{label}</span>
      {children}
    </div>
  );
}

/** A status as plain text. A two-part status breaks after its dot, never before it. */
export function Status({ text }: { text: string }) {
  return <>{text.replace(' · ', ' · ')}</>;
}

/** An action that is not one yet: quiet text, not clickable. */
function Quiet({ children }: { children: ReactNode }) {
  return <span style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{children}</span>;
}

/* THE COMMUNITY RATING — display only, her word of 28 Oct 2026: five empty
   stars and "No ratings yet". No way to rate, and nothing counted. */
export function Rating() {
  return (
    <span role="img" aria-label="No ratings yet" style={{ display: 'inline-block' }}>
      <span aria-hidden style={{ display: 'block', letterSpacing: '0.08em', color: 'var(--ink-4)', fontSize: 13 }}>
        ☆☆☆☆☆
      </span>
      <span aria-hidden style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
        No ratings yet
      </span>
    </span>
  );
}
