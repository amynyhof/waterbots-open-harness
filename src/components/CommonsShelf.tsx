/**
 * The Agent Commons page's centre — the opening, how it works, and the list
 * of modules. Item S18, slice 2, built 11 Sep 2026 as a shelf of cards;
 * rewritten on 28 Oct 2026 to the maintainer's words of that day: an
 * opening in two paragraphs and four points on how it works (her words
 * exactly, from a later ruling the same day), a "Build a module with us" button to the main site's Consulting page at the right of the
 * header, and the modules as one vertical list, one row each.
 *
 * ONE ROW PER MODULE: the agent's picture, name and role; one line on what
 * it does; its method; its stage, one of six, as a name and a bar; its
 * owner; its grade; its community rating; and the row's action. The rows come from src/lib/commonsShelf.ts,
 * which reads the registries; nothing here names a pack. ONE LIST, the
 * maintainer's word of 28 Oct 2026: the built modules, then the planned one,
 * then the modules seeking partners, after them, in the same list.
 *
 * THE ACTION. Open hands the entry up to the Commons page, which opens the
 * holder's screen alone (slice 3); only a module marked `opens` has it, and
 * the others say "Coming soon", not clickable. A planned module says "Not
 * open yet". A module seeking partners has "Work with us", and its stage's
 * name does the same: both open an email to the team, its subject
 * "Partnering on: <module name>".
 *
 * PLAIN TEXT, NOT CHIPS: method and grade are plain text from 28 Oct 2026,
 * her word; a method is a link where she has given one. The stage is its
 * name and a small bar, from her later word the same day, with "Beta" a tag
 * beside it on a module open to try.
 *
 * EVERY GRADE READS "NOT YET GRADED", and will until a real card from the one
 * public exam exists — the maintainer's ONE GRADER and REAL ONLY rulings of
 * 9 Sep 2026. A module seeking partners shows a dash: nothing exists to grade.
 * The grading note says where a grade would come from and that none has run.
 *
 * THE COMMUNITY RATING IS DISPLAY ONLY: five empty stars and "No ratings yet"
 * on every row, and no way to rate. Nothing is counted or stored.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  PLANNED,
  SEEKING,
  SHELF,
  STAGES,
  stageNumber,
  type ModuleStage,
  type PlannedModule,
  type ShelfCard,
} from '../lib/commonsShelf';
import { CONSULTING_URL, partnerMailto } from '../lib/site';

/**
 * How It Works — the maintainer's four points, her words exactly, 28 Oct 2026.
 * The first no longer gives every agent a calculation engine: her later word
 * the same day, that the page follows the opening, where an agent uses a
 * calculator or tool only where its task needs one.
 */
const HOW_IT_WORKS: { lead: string; body: string }[] = [
  {
    lead: 'One module, everywhere:',
    body:
      'The same agent, knowledge pack, and any calculator or tool it uses are built to power both ' +
      'Agent Commons and WaterBots, so results match wherever they’re used.',
  },
  {
    lead: 'Open by default:',
    body:
      'Agent code is released under the Apache 2.0 license. Methodologies, documentation, and ' +
      'guidance are shared under CC BY 4.0, making them freely available with attribution.',
  },
  {
    lead: 'Built with experts and partners:',
    body:
      'We co-develop modules with utility leaders, researchers, consultants, funders, and ' +
      'technical experts. Organizations can sponsor or steward individual modules, with full ' +
      'credit and ownership clearly recognized in the Commons.',
  },
  {
    lead: 'Transparent and verifiable:',
    body:
      'Every agent includes its underlying methodology, reference materials, assumptions, and ' +
      'testing approach, so users can understand exactly how results are generated.',
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
            {/* The opening — her words exactly, from her second wording of 28 Oct 2026. */}
            <p
              className="t-body"
              style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}
            >
              A free, open library of AI agents designed for water projects of every kind, from safe
              drinking water and wastewater management to watershed protection and resilience
              planning. Each agent is purpose-built for one task on the journey to impact funding,
              from checking eligibility to estimating results. Agents work from a knowledge pack
              curated by domain experts, so they can cite sources for every answer. Where a task needs
              one, they also use a transparent calculator or tool.
            </p>
            <p
              className="t-body"
              style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}
            >
              Explore the agents, review their methods, test their outputs, and see exactly where every
              answer comes from. Community ratings coming soon.
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
          How It Works
        </h2>
        <ul style={{ margin: 0, paddingLeft: 18, maxWidth: 760, display: 'grid', gap: 6 }}>
          {HOW_IT_WORKS.map((point) => (
            <li key={point.lead} style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
              <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{point.lead}</strong> {point.body}
            </li>
          ))}
        </ul>
        {/* The grading note — her words exactly, 28 Oct 2026. The count line
            above it is gone, her word the same day. */}
        <p
          className="t-caption"
          style={{ margin: '28px 0 14px', maxWidth: 760, fontSize: 12, lineHeight: 1.55 }}
        >
          Grades come from an independent exam. Each agent is tested outside this site against real,
          completed projects, and scored on whether it gets the answers right. No agent has sat its
          exam yet.
        </p>
        {/* Below 900px the header row is hidden, and its two (i)s with it, so
            they stand here instead. */}
        <div className="wb-module-tips-phone">
          <span>
            Stages <InfoTip label="The six stages">{STAGE_LEGEND}</InfoTip>
          </span>
          <span>
            Grades and ratings <InfoTip label="Grades and ratings">{GRADE_AND_RATING}</InfoTip>
          </span>
        </div>

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

      <Cell label="Method">
        <Method text={card.tag} href={card.tagHref} />
      </Cell>
      <Cell label="Stage">
        <Stage stage={card.stage} beta={card.beta} />
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

/**
 * The list's header row; below 900px it hides and each cell carries its label.
 * The words are hidden from a screen reader, which hears each cell's own; the
 * (i)s are not, so the stages and the grade-and-rating line can be reached.
 */
function ModuleHead() {
  return (
    <div className="wb-module-head t-mono">
      <span aria-hidden>Agent</span>
      <span aria-hidden>What it does</span>
      <span aria-hidden>Method</span>
      <span className="wb-module-head-tip">
        <span aria-hidden>Stage</span>
        <InfoTip label="The six stages">{STAGE_LEGEND}</InfoTip>
      </span>
      <span aria-hidden>Owner</span>
      <span className="wb-module-head-tip">
        <span aria-hidden>Grade</span>
        <InfoTip label="Grades and ratings" align="right">
          {GRADE_AND_RATING}
        </InfoTip>
      </span>
      <span className="wb-module-head-tip">
        <span aria-hidden>Rating</span>
        <InfoTip label="Grades and ratings" align="right">
          {GRADE_AND_RATING}
        </InfoTip>
      </span>
      <span />
    </div>
  );
}

/** Beside the Grade and Rating headings — her words exactly, 28 Oct 2026. */
const GRADE_AND_RATING =
  'Grades come from an independent exam on real projects. Ratings come from people who’ve used ' +
  'the agent on their own projects.';

/** The six stages, one line each, each with its own bar. */
const STAGE_LEGEND = (
  <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 9 }}>
    {STAGES.map((stage) => (
      <li key={stage.name}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StageBar stage={stage.name} />
          <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{stage.name}</strong>
        </span>
        <span style={{ display: 'block', marginTop: 2 }}>{stage.line}</span>
      </li>
    ))}
  </ol>
);

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
      <Cell label="Stage">
        <Stage
          stage={planned.stage}
          href={seeking ? mail : undefined}
          hrefLabel={`${planned.stage}: email us about partnering on ${planned.title}`}
        />
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

/**
 * A method, by name; a link where the maintainer has given one. A two-part
 * name breaks after its dot, never before it.
 */
export function Method({ text, href }: { text: string; href?: string }) {
  const words = text.replace(' · ', ' · ');
  if (!href) return <>{words}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--tide-text)' }}>
      {words}
    </a>
  );
}

/**
 * THE STAGE — the maintainer's word of 28 Oct 2026: its name, and a small bar
 * of six steps beneath it. "Beta" rides beside the name as a tag on a module
 * open to try; it is not a stage. A module seeking partners links its stage to
 * the team's inbox, as its chip did before.
 */
export function Stage({
  stage,
  beta = false,
  href,
  hrefLabel,
}: {
  stage: ModuleStage;
  beta?: boolean;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <span style={{ display: 'inline-grid', gap: 5, justifyItems: 'start' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {href ? (
          <a href={href} aria-label={hrefLabel} style={{ color: 'var(--tide-text)', whiteSpace: 'nowrap' }}>
            {stage}
          </a>
        ) : (
          <span style={{ whiteSpace: 'nowrap' }}>{stage}</span>
        )}
        {beta && (
          <span className="tag" style={{ fontSize: 10, padding: '1px 6px' }}>
            Beta
          </span>
        )}
      </span>
      <StageBar stage={stage} />
    </span>
  );
}

/* ONE COLOUR, PALE TO SOLID — her word of 28 Oct 2026, and no green: Tide,
   the brand's primary, mixed into the card at a rising share, so stage six is
   Tide itself. Every filled step takes its stage's shade, so the bar darkens
   as a module moves on. */
const STAGE_SHARE = [32, 46, 60, 74, 87, 100];

function StageBar({ stage }: { stage: ModuleStage }) {
  const n = stageNumber(stage);
  const shade = `color-mix(in oklab, var(--tide) ${STAGE_SHARE[n - 1]}%, var(--card))`;
  return (
    <span className="wb-stage-bar" role="img" aria-label={`Stage ${n} of ${STAGES.length}`}>
      {STAGES.map((s, i) => (
        <span key={s.name} style={i < n ? { background: shade } : undefined} />
      ))}
    </span>
  );
}

/**
 * THE (i) — a small button that opens a note beside a heading, and closes on
 * a second press, Escape, or a press anywhere else. The house (i), drawn as on
 * the project record; a button here because the note is longer than a title.
 */
function InfoTip({
  label,
  align = 'left',
  children,
}: {
  label: string;
  align?: 'left' | 'right';
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <span ref={ref} className="wb-tip">
      <button
        type="button"
        className="wb-info"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        i
      </button>
      {open && (
        <span role="note" className={align === 'right' ? 'wb-tip-panel is-right' : 'wb-tip-panel'}>
          {children}
        </span>
      )}
    </span>
  );
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
