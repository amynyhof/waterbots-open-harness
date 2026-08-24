/**
 * The eligibility worksheet — Phoebe's centre console.
 *
 * Two sections, and the difference between them is the whole point:
 *
 *   The six criteria are a HARD GATE. Each is met or it is not. Missing one
 *   means the project is not eligible, and every "Not yet" carries the route
 *   that would change it.
 *
 *   The ten considerations are GUIDANCE. They apply to projects that already
 *   clear the gate, they help choose well among them, and they are never a
 *   bar to entry. There are no states on them, no scores, no pass or fail —
 *   rendering a verdict here would misrepresent the source.
 *
 * Every row's text comes from the committed card files through
 * lib/phoebeCards. Nothing on this surface is typed by hand, so nothing can
 * drift from what the maintainer approved.
 *
 * STEP 2 IS STATIC. No chat is wired up yet, so all six criteria show "Not yet
 * checked" — which is true. There is no demo state, no pre-filled example and
 * no way to click a row into looking Met. An empty, honest worksheet beats a
 * fabricated one.
 */

import { useState } from 'react';
import {
  CONSIDERATIONS,
  CONSIDERATION_GROUPS,
  CRITERIA,
  type Citation,
  type Consideration,
  type Criterion,
} from '../lib/phoebeCards';
import { STATE_LABEL, STATE_TOKEN, type CriterionStatus } from '../lib/criteriaState';

export default function EligibilityWorksheet({
  statuses,
  onOpenMap,
}: {
  /* Held by the shell so Phoebe's answers and this worksheet stay in step.
     No memory across visits — a reload resets them. Stated on screen. */
  statuses: CriterionStatus[];
  onOpenMap: () => void;
}) {
  const allMet = statuses.every((s) => s.state === 'met');

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 64px' }}>
        <header style={{ marginBottom: 30 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Eligibility worksheet
          </div>
          <h1 className="t-h3" style={{ margin: '0 0 10px' }}>
            Can this project generate a volumetric water benefit?
          </h1>
          <p className="t-body" style={{ margin: 0, color: 'var(--fg-2)', maxWidth: '62ch' }}>
            Six criteria decide it, and all six have to be met. Below them sit ten further
            considerations that help you choose well between projects that already qualify — those
            are guidance, and they never decide anything.
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
              This worksheet follows one pathway:{' '}
              <strong style={{ color: 'var(--fg-2)' }}>
                Volumetric Water Benefit Accounting 2.0
              </strong>
              , published by the World Resources Institute and its co-authors. It is the first
              pathway this console carries, not the only one that exists — other standards set out
              their own routes, and more are planned here. Only VWBA is built today, and nothing on
              this page speaks for any standard other than the one it cites.
            </p>
          </div>
        </header>

        {allMet && <EligibleBanner onOpenMap={onOpenMap} />}

        <section aria-labelledby="wb-criteria-heading">
          <SectionHead
            id="wb-criteria-heading"
            eyebrow="The gate"
            title="Six eligibility criteria"
            note="Every one must be met. Missing a single criterion means the project is not eligible — and every shortfall comes with the specific step that would change it."
          />

          <ol style={{ listStyle: 'none', margin: '18px 0 0', padding: 0 }}>
            {CRITERIA.map((criterion, i) => (
              <li key={criterion.number} style={{ marginBottom: 10 }}>
                <CriterionRow criterion={criterion} status={statuses[i]} />
              </li>
            ))}
          </ol>

          <p className="t-caption" style={{ margin: '14px 0 0', lineHeight: 1.6 }}>
            {statuses.every((s) => s.state === 'unchecked')
              ? 'Nothing has been checked yet. Rows change as you work through them with Phoebe, and they reset if you reload the page — this console keeps no memory between visits.'
              : 'Rows update as you work through them with Phoebe. They reset if you reload the page — this console keeps no memory between visits.'}
          </p>
        </section>

        <div style={{ borderTop: '1px solid var(--line)', margin: '38px 0 0' }} />

        <section aria-labelledby="wb-considerations-heading" style={{ marginTop: 30 }}>
          <SectionHead
            id="wb-considerations-heading"
            eyebrow="Guidance, not a gate"
            title="Ten selection considerations"
            note="These apply to projects that already meet all six criteria. They help you choose well — they are never a bar to entry, they carry no ranking, and how much each one counts for is yours to decide, not ours."
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
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>
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
   The gate rows.
------------------------------------------------------------------------- */

function CriterionRow({ criterion, status }: { criterion: Criterion; status: CriterionStatus }) {
  const [open, setOpen] = useState(false);
  const panelId = `wb-criterion-${criterion.number}`;

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
          style={{ fontSize: 11, color: 'var(--fg-3)', flex: 'none', width: 14 }}
        >
          {criterion.number}
        </span>

        <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: 'var(--fg-1)' }}>
          {criterion.title}
        </span>

        <StateBadge state={status.state} />

        <Chevron open={open} />
      </button>

      {open && (
        <div id={panelId} style={{ padding: '2px 16px 16px 44px' }}>
          <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--fg-2)', fontSize: 14 }}>
            {criterion.rule}
          </p>

          {status.state === 'not-yet' && status.routeForward && (
            <div
              style={{
                margin: '0 0 12px',
                padding: '10px 12px',
                borderLeft: `2px solid ${STATE_TOKEN['not-yet']}`,
                background: 'var(--paper)',
                borderRadius: 'var(--r-xs)',
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                What would change this
              </div>
              <p className="t-caption" style={{ margin: 0, lineHeight: 1.6 }}>
                {status.routeForward}
              </p>
            </div>
          )}

          <div className="eyebrow" style={{ marginBottom: 8 }}>
            What you would be asked to show
          </div>
          <ul
            className="t-caption"
            /* Tailwind's preflight clears list markers; these lists want them. */
            style={{ margin: '0 0 14px', paddingLeft: 18, lineHeight: 1.65, listStyle: 'disc' }}
          >
            {criterion.evidence.map((item, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </ul>

          <CitationTags citation={criterion.citation} />
        </div>
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
          style={{ fontSize: 11, color: 'var(--fg-3)', flex: 'none', width: 14 }}
        >
          {consideration.number}
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: 'var(--fg-2)' }}>
          {consideration.title}
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div id={panelId} style={{ padding: '2px 16px 16px 44px' }}>
          <p className="t-body" style={{ margin: '0 0 12px', color: 'var(--fg-2)', fontSize: 14 }}>
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

function StateBadge({ state }: { state: CriterionStatus['state'] }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        flex: 'none',
        fontSize: 12,
        color: 'var(--fg-2)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 'var(--r-pill)',
          background: STATE_TOKEN[state],
          flex: 'none',
        }}
      />
      {STATE_LABEL[state]}
    </span>
  );
}

/**
 * Shown only when all six criteria are met.
 *
 * It says the project "looks eligible" rather than "is eligible" — this
 * console reads a worksheet, it does not certify anything, and no standards
 * body endorses it.
 */
function EligibleBanner({ onOpenMap }: { onOpenMap: () => void }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 24,
        borderLeft: `3px solid ${STATE_TOKEN.met}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', marginBottom: 3 }}>
          Your project looks eligible — next stop: Partners
        </div>
        <p className="t-caption" style={{ margin: 0 }}>
          All six criteria are met. The basin map is where you find who else is working nearby.
        </p>
      </div>
      <button className="btn" onClick={onOpenMap}>
        Open the map
      </button>
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
        color: 'var(--fg-3)',
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
