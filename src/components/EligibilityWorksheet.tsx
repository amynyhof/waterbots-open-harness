/**
 * The eligibility worksheet — Phoebe's centre console.
 *
 * A GUIDE, NOT A GATE, FROM 25 SEP 2026. This page was two lists: six criteria
 * that had to be met, and ten considerations. It is now one section per pathway,
 * read from the tool definition file in each of Phoebe's packs, because a tool
 * is defined once in one file in its pack — the maintainer's ruling of 24 Sep
 * 2026. Each section shows:
 *
 *   the pathway's own state, from its "does this apply" tests;
 *   the readiness read, worked out from the rows and never from prose;
 *   the Eligibility rows, the ones Phoebe asks on this site, each in one of
 *     five states, with the cited route under a Fixable one;
 *   the rows that are acted on later, grouped by the phase where that happens
 *     and the seat that helps there, shown once and never counted.
 *
 * NOTHING HERE IS TYPED BY HAND. The rows, their order, their states and their
 * colours come from the tool files; the words of each row come from the card it
 * cites; the seats come from the roster. So the screen cannot drift from what
 * the maintainer approved, and a card edit lands here without a code change.
 *
 * THE STATES ARE HONEST. A worksheet nobody has worked shows every row as Not
 * yet checked, which is true. There is no demo state, no pre-filled example and
 * no way to click a row into looking Met.
 */

import { useState } from 'react';
import {
  CONSIDERATIONS,
  CONSIDERATION_GROUPS,
  cardFor,
  routeFor,
  type Citation,
  type Consideration,
  type RowCard,
} from '../lib/phoebeCards';
import {
  PATHWAY_STATE_LABEL,
  READINESS_LABEL,
  TOOL_SECTIONS,
  askedRows,
  isPathwayRow,
  shownGroups,
  type ToolRow,
  type ToolSection,
} from '../lib/worksheet.generated';
import {
  STATE_LABEL,
  contextFor,
  pathwayState,
  readiness,
  stateColour,
  stateOf,
  type RowStatus,
  type Sheet,
} from '../lib/worksheetState';

export default function EligibilityWorksheet({
  sheet,
  gsClass,
  herPacks,
  onOpenMap,
}: {
  /* Held by the shell so Phoebe's answers and this worksheet stay in step.
     No memory across visits — a reload resets them. Stated on screen. */
  sheet: Sheet;
  /** The Gold Standard class from the record, where the project has one. */
  gsClass: string;
  /** The packs Phoebe reads today. A pack she does not read says so here. */
  herPacks: readonly string[];
  /**
   * Opens the map when a pathway reads likely eligible. Absent on the Agent
   * Commons (item S18, slice 3), which has no map: the banner then names the
   * next stop without a button to it, rather than a door to somewhere else.
   */
  onOpenMap?: () => void;
}) {
  const likely = TOOL_SECTIONS.some(
    (part) =>
      herPacks.includes(part.pack) &&
      readiness(sheet, part.pack, contextFor(sheet, part.pack, gsClass)) === 'likely-eligible'
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 64px' }}>
        <header style={{ marginBottom: 30 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Eligibility worksheet
          </div>
          <h1 className="t-h3" style={{ margin: '0 0 10px' }}>
            Which pathways could this project count on?
          </h1>
          <p className="t-body" style={{ margin: 0, color: 'var(--ink-2)', maxWidth: '62ch' }}>
            One section per pathway. Phoebe works through the rows that can be answered from the
            idea itself, and where one is not met she says what would change it. Nothing here is a
            pass or a fail: each pathway ends in a plain reading of how ready it looks.
          </p>

          <div style={{ marginTop: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Why start here
            </div>
            <p
              className="t-caption"
              style={{ margin: '0 0 10px', lineHeight: 1.7, maxWidth: '66ch' }}
            >
              Eligibility is the first step of any water-benefit journey, and it is worth taking
              before the others. Quantifying a benefit, finding partners, agreeing attribution,
              reporting for years afterwards — none of that matters if the project cannot generate
              a countable benefit in the first place. Answering that question early saves the work
              that would otherwise be spent finding out late.
            </p>
            <p className="t-caption" style={{ margin: 0, lineHeight: 1.7, maxWidth: '66ch' }}>
              Nothing on this page is verified, and nothing here speaks for any standard beyond
              citing it. A consultant confirms what a screening suggests.
            </p>
          </div>
        </header>

        {likely && <ReadyBanner onOpenMap={onOpenMap} />}

        {TOOL_SECTIONS.map((part) => (
          <PathwaySection
            key={part.pack}
            part={part}
            sheet={sheet}
            gsClass={gsClass}
            hers={herPacks.includes(part.pack)}
          />
        ))}

        <div style={{ borderTop: '1px solid var(--line)', margin: '38px 0 0' }} />

        <section aria-labelledby="wb-considerations-heading" style={{ marginTop: 30 }}>
          <SectionHead
            id="wb-considerations-heading"
            eyebrow="Guidance, not a gate"
            title="Ten selection considerations"
            note="These are for choosing well between projects that already qualify on the water pathway. They help you choose — they are never a bar to entry, they carry no ranking, and how much each one counts for is yours to decide, not ours."
          />

          {CONSIDERATION_GROUPS.map((group) => (
            <div key={group.key} style={{ marginTop: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 10,
                  marginBottom: 4,
                  flexWrap: 'wrap',
                }}
              >
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                  {group.label}
                </h3>
              </div>
              <p className="t-caption" style={{ margin: '0 0 12px', lineHeight: 1.6 }}>
                {group.note}
              </p>

              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {CONSIDERATIONS.filter((c) => c.group === group.key).map((consideration) => (
                  <li key={consideration.number} style={{ marginBottom: 8 }}>
                    <ConsiderationRow consideration={consideration} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   One pathway.
------------------------------------------------------------------------- */

function PathwaySection({
  part,
  sheet,
  gsClass,
  hers,
}: {
  part: ToolSection;
  sheet: Sheet;
  gsClass: string;
  hers: boolean;
}) {
  const context = contextFor(sheet, part.pack, gsClass);
  const asked = askedRows(part.pack, context);
  const groups = shownGroups(part.pack, context);
  const state = pathwayState(sheet, part.pack, context);
  const read = readiness(sheet, part.pack, context);
  const worked = asked.some((row) => stateOf(sheet, part.pack, row.id).state !== 'unchecked');

  return (
    <section
      aria-labelledby={`wb-pathway-${part.sectionId}`}
      style={{ marginTop: 28, opacity: hers ? 1 : 0.85 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <h2 id={`wb-pathway-${part.sectionId}`} style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>
          {part.sectionName}
        </h2>
        <span className="t-caption" style={{ fontSize: 12 }}>
          {PATHWAY_STATE_LABEL[state]}
        </span>
      </div>

      {!hers && (
        <p className="t-caption" style={{ margin: '8px 0 0', lineHeight: 1.65, maxWidth: '66ch' }}>
          Phoebe does not read this pathway&rsquo;s cards yet, so nothing here is checked. Its cards
          are on her Knowledge pack tab, where you can read every one of them today.
        </p>
      )}

      {hers && (
        <>
          <p
            className="t-caption"
            style={{ margin: '8px 0 14px', lineHeight: 1.65, maxWidth: '66ch' }}
          >
            {worked ? (
              <>
                The reading from these rows: <strong style={{ color: 'var(--ink)' }}>{READINESS_LABEL[read]}</strong>.
                Likely, not settled — nothing here is verified.
              </>
            ) : (
              <>
                Nothing has been checked yet. Rows change as you work through them with Phoebe, and
                they reset if you reload the page — this console keeps no memory between visits.
              </>
            )}
          </p>

          <ol style={{ listStyle: 'none', margin: '0', padding: 0 }}>
            {asked.map((row) => (
              <li key={row.id} style={{ marginBottom: 10 }}>
                <Row pack={part.pack} row={row} status={stateOf(sheet, part.pack, row.id)} />
              </li>
            ))}
          </ol>

          <div style={{ marginTop: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Done later, with the colleague who helps there
            </div>
            <p className="t-caption" style={{ margin: '0 0 12px', lineHeight: 1.65, maxWidth: '66ch' }}>
              These are not asked here and are never counted against a project. They are listed so
              nothing on the pathway is a surprise later.
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {groups.map((group) => (
                <li key={group.phase} style={{ marginBottom: 10 }}>
                  <ShownGroup
                    pack={part.pack}
                    label={group.label}
                    seats={group.seats}
                    rows={group.rows}
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------
   One row, in one of five states.
------------------------------------------------------------------------- */

function Row({ pack, row, status }: { pack: string; row: ToolRow; status: RowStatus }) {
  const [open, setOpen] = useState(false);
  const panelId = `wb-row-${pack}-${row.id}`;
  const card: RowCard | undefined = cardFor(pack, row.card);
  const routes = (status.routes ?? []).map((id) => routeFor(pack, id)).filter((r) => r !== undefined);

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '13px 16px',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
        }}
      >
        <span
          className="t-mono"
          aria-hidden
          style={{ fontSize: 11, color: 'var(--ink-3)', flex: 'none', minWidth: 18 }}
        >
          {row.id}
        </span>

        <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: 'var(--ink)' }}>
          {row.title}
        </span>

        <StateBadge state={status.state} pathway={isPathwayRow(row)} />

        <Chevron open={open} />
      </button>

      {open && (
        <div id={panelId} style={{ padding: '2px 16px 16px 48px' }}>
          {card && (
            <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--ink-2)', fontSize: 14 }}>
              {card.plain}
            </p>
          )}

          {status.because && (
            <Note
              label={
                status.state === 'met'
                  ? 'What settled this'
                  : status.state === 'unknown'
                    ? 'What would find this out'
                    : status.state === 'blocked'
                      ? 'Why this one stops here'
                      : 'What would change this'
              }
              colour={stateColour(status.state)}
              text={status.because}
            />
          )}

          {routes.map((route) => (
            <div
              key={route!.id}
              style={{
                margin: '0 0 12px',
                padding: '10px 12px',
                borderLeft: `2px solid ${stateColour('fixable')}`,
                background: 'var(--paper)',
                borderRadius: 'var(--r-xs)',
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                A way forward — {route!.title}
              </div>
              <p className="t-caption" style={{ margin: '0 0 8px', lineHeight: 1.6 }}>
                {route!.route}
              </p>
              <p className="t-caption" style={{ margin: '0 0 8px', lineHeight: 1.6, color: 'var(--ink-3)' }}>
                {route!.notPromise}
              </p>
              <CitationTags citation={route!.citation} />
            </div>
          ))}

          {card && card.evidence.length > 0 && (
            <>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                What you would be asked to show
              </div>
              <ul
                className="t-caption"
                /* Tailwind's preflight clears list markers; these lists want them. */
                style={{ margin: '0 0 14px', paddingLeft: 18, lineHeight: 1.65, listStyle: 'disc' }}
              >
                {card.evidence.map((item, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {card && <CitationTags citation={card.citation} />}
        </div>
      )}
    </div>
  );
}

/** One phase's group of rows nobody is asked about here. */
function ShownGroup({
  pack,
  label,
  seats,
  rows,
}: {
  pack: string;
  label: string;
  seats: { names: string[]; seat: string }[];
  rows: ToolRow[];
}) {
  const who = seats.map((seat) => seat.names.join(' and ')).join(' and ');
  return (
    <div className="card" style={{ padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
        <span className="t-caption" style={{ fontSize: 12 }}>
          {who}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="t-caption" style={{ margin: '6px 0 0', lineHeight: 1.6 }}>
          Nothing on this pathway is a row here yet.
        </p>
      ) : (
        <ul
          className="t-caption"
          style={{ margin: '8px 0 0', paddingLeft: 18, lineHeight: 1.65, listStyle: 'disc' }}
        >
          {rows.map((row) => {
            const card = cardFor(pack, row.card);
            return (
              <li key={row.id} style={{ marginBottom: 4 }}>
                {row.title}
                {card ? ` — ${card.citation.section}` : ''}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   The guidance rows. No state, deliberately.
------------------------------------------------------------------------- */

function ConsiderationRow({ consideration }: { consideration: Consideration }) {
  const [open, setOpen] = useState(false);
  const panelId = `wb-consideration-${consideration.number}`;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '11px 16px',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
        }}
      >
        <span
          className="t-mono"
          aria-hidden
          style={{ fontSize: 11, color: 'var(--ink-3)', flex: 'none', width: 14 }}
        >
          {consideration.number}
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: 'var(--ink-2)' }}>
          {consideration.title}
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div id={panelId} style={{ padding: '2px 16px 16px 44px' }}>
          <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--ink-2)', fontSize: 14 }}>
            {consideration.summary}
          </p>

          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Why it matters
          </div>
          <p className="t-caption" style={{ margin: '0 0 14px', lineHeight: 1.65 }}>
            {consideration.why}
          </p>

          <div className="eyebrow" style={{ marginBottom: 8 }}>
            How to weigh it — guidance, not a gate
          </div>
          <ul
            className="t-caption"
            /* Tailwind's preflight clears list markers; these lists want them. */
            style={{ margin: '0 0 14px', paddingLeft: 18, lineHeight: 1.65, listStyle: 'disc' }}
          >
            {consideration.weigh.map((item, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>

          <CitationTags citation={consideration.citation} />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Shared pieces.
------------------------------------------------------------------------- */

/**
 * The citation, rendered per CITATIONS.md.
 *
 * A citation reference is a .tag — a value, 4px radius, hairline border, no
 * fill — and never a .chip, which carries state. The canonical link is the
 * publisher's own DOI, carried on every card so each one stands alone.
 */
function CitationTags({ citation }: { citation: Citation }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      <span className="tag" title={citation.full}>
        {citation.document}
      </span>
      <span className="tag" title={citation.full}>
        {citation.section}
      </span>
      <span className="tag" title={`${citation.version} · ${citation.page}`}>
        {citation.page}
      </span>
      <a
        href={citation.href}
        target="_blank"
        rel="noopener noreferrer"
        className="t-caption"
        style={{ fontSize: 11.5, color: 'var(--tide-text)' }}
      >
        Source document
      </a>
    </div>
  );
}

/** One short note under a row: what settled it, or what would move it. */
function Note({ label, colour, text }: { label: string; colour: string; text: string }) {
  return (
    <div
      style={{
        margin: '0 0 12px',
        padding: '10px 12px',
        borderLeft: `2px solid ${colour}`,
        background: 'var(--paper)',
        borderRadius: 'var(--r-xs)',
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <p className="t-caption" style={{ margin: 0, lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  );
}

function StateBadge({ state, pathway }: { state: string; pathway: boolean }) {
  const label = pathway
    ? (PATHWAY_STATE_LABEL[state] ?? STATE_LABEL[state] ?? state)
    : (STATE_LABEL[state] ?? state);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        flex: 'none',
        fontSize: 12,
        color: 'var(--ink-2)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 'var(--r-pill)',
          background: stateColour(state === 'applies' ? 'met' : state === 'does-not-apply' ? 'blocked' : (state as never)),
          flex: 'none',
        }}
      />
      {label}
    </span>
  );
}

/**
 * Shown when a pathway reads likely eligible.
 *
 * "Likely" is the word the read itself uses: this console works a worksheet, it
 * does not certify anything, and no standards body endorses it.
 */
function ReadyBanner({ onOpenMap }: { onOpenMap?: () => void }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 24,
        borderLeft: `3px solid ${stateColour('met')}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
          This pathway reads likely eligible — next stop: Partners
        </div>
        <p className="t-caption" style={{ margin: 0 }}>
          Every row asked here is met. Nothing is verified; a consultant confirms it. The basin map
          is where you find who else is working nearby.
        </p>
      </div>
      {onOpenMap && (
        <button className="btn" onClick={onOpenMap}>
          Open the map
        </button>
      )}
    </div>
  );
}

function SectionHead({
  id,
  eyebrow,
  title,
  note,
}: {
  id: string;
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        {eyebrow}
      </div>
      <h2 id={id} style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 600 }}>
        {title}
      </h2>
      <p className="t-caption" style={{ margin: 0, lineHeight: 1.65, maxWidth: '68ch' }}>
        {note}
      </p>
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{
        flex: 'none',
        color: 'var(--ink-3)',
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: `transform var(--dur) var(--ease)`,
      }}
    >
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
