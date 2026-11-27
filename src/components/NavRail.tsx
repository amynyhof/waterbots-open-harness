/**
 * The left rail — the visit's project, and the record Wellington's interview
 * populates.
 *
 * RESHAPED 4 Sep 2026, maintainer's ruling 3. The project context left the
 * desk's centre and became this: the project card, then one row per field —
 * what it does, what type, the stage, where it is, what it is called, in the
 * order the seats need them (ruled 5 Sep 2026; type and stage for "what kind"
 * from 24 Sep 2026, item A16) — each showing the value or a dash, and where
 * the value came from. The type row shows the standard's name, and its
 * one-line definition sits behind it on hover, the way the record's explainer
 * sits behind the (i). **A visitor who never chats
 * loses nothing**: name and place stay typeable here, quietly, and a typed
 * entry is never overwritten by what he heard.
 *
 * THE SHAPE is the production rail's, from the saved page the maintainer
 * brought in on 2 Sep 2026: a small eyebrow, a raised project card with a dot,
 * the name, and a state chip. The record rows beneath it take the desk
 * context card's own row anatomy — label, value, one-line caption — at the
 * rail's density.
 *
 * Chrome recedes, content rises (BRAND.md §2.3): the rail sits ON the frame,
 * flush and square, never as a card. The project card inside it rises one
 * plane to --card with the hairline §2.3 pairs with a white card.
 *
 * ON A PHONE IT IS A PANEL THAT SLIDES OVER THE PAGE from the left — the
 * maintainer's word of 29 Oct 2026 — opened from "Project" under the journey
 * bar, always at full width inside, and closed from its own top button or a
 * tap beside it. It no longer pushes the crew off the screen.
 */

import { useEffect, useState } from 'react';
import { SITE_LABEL, SITE_URL } from '../lib/site';
import { pathForInterest } from '../lib/pages';
import { STAGE_WORDS as PROJECT_STAGES, typeWords as projectType } from '@waterbots/core/projectWords';
import { servedWords, type Provenance, type RailTally, type VisitContext } from '../lib/visit';
import { EXPORT_BUTTON, EXPORT_HOW } from '../lib/exportReport';

const EXPANDED = 224;
const COLLAPSED = 52;

/** Narrowed below this after landing, the rail collapses. The reader can still expand it. */
const AUTO_COLLAPSE_BELOW = 1180;

/** The collapsed rail's title when the visit has not named its project. Not a value. */
const UNNAMED = 'Unnamed project';

/** The name box's words while it is empty: where to type, in plain words (21 Nov 2026). */
const NAME_PLACEHOLDER = 'Type a name here';

/**
 * What sits under a row. Look pass, 8 Sep 2026: "from the conversation" and
 * "typed" are gone — a value is a value. The map pin keeps its line, because a
 * place the pin wrote is the basin's own name for itself and a visitor should
 * know it was not theirs.
 */
const PROVENANCE_LABEL: Record<Provenance, string> = {
  '': '',
  typed: '',
  chat: '',
  pin: 'from the map pin',
};

/** The record's explainer, behind the (i) — look pass, 8 Sep 2026. */
const RECORD_EXPLAINER =
  'Wellington asks for these in the chat, and what you tell him lands here. Phoebe reads them, and the eligibility verdicts she reaches with you show on her step and in the next steps. Nothing is kept between visits.';

/**
 * THE REPORT, under the project — the maintainer's word of 14 Nov 2026 (S21).
 * "Export screening report" shows once something is on the record. The save
 * door that sat in this rail moved to the right panel, under the crew, on
 * 21 Nov 2026 (src/components/SaveDoor.tsx).
 */
export interface ReportDoor {
  /** Something is on the record, so there is a project to report. */
  show: boolean;
  /** Opens the print dialog on the screening report (S21). */
  onExport: () => void;
  /** What the site said when no print window opened (rule 13); empty otherwise. */
  said?: string;
  onDismiss?: () => void;
}

export default function NavRail({
  context,
  onTyped,
  report,
  tally = [],
  onInterest,
  drawer,
}: {
  context: VisitContext;
  onTyped: (field: 'name' | 'place', value: string) => void;
  report: ReportDoor;
  /** Phoebe's progress, per funding path, in the rail and not the chat (rule 2). */
  tally?: RailTally[];
  /** Opens the Register your interest form (16 Nov 2026). */
  onInterest?: () => void;
  /** On a phone: the rail is a sliding panel, open or shut by the shell. */
  drawer?: { open: boolean; onClose: () => void };
}) {
  /* OPEN ON LANDING, whatever the width — the maintainer's walk of 13 Nov
     2026: the record is the first thing a visitor should see filling. A
     later resize still follows the viewport until the reader chooses. */
  const [railOpen, setOpen] = useState(true);
  /* A phone's panel always shows the whole record; shut, it is off the screen. */
  const open = drawer ? true : railOpen;

  /* Only follows the viewport until the reader expresses a preference. */
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched) return;
    const onResize = () => setOpen(window.innerWidth >= AUTO_COLLAPSE_BELOW);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [touched]);

  const name = context.name.trim() || UNNAMED;

  /* The record starts collapsed (21 Nov 2026). */
  const [recordOpen, setRecordOpen] = useState(false);

  /* THE ORDER IS THE SEATS' — ruled 5 Sep 2026: what it does (Phoebe,
     Calvin), what type and the stage (Phoebe, Calvin), people served (a water
     supply project, ruling R4 of 27 Sep 2026, households kept as households),
     where it is (Phoebe, Bridget before any pin, Calvin). Wellington asks in
     this order. Only a row with a value shows (21 Nov 2026). */
  const stage = PROJECT_STAGES.find((s) => s.id === context.stage);
  const rows: { label: string; value: string; hint?: string; provenance: Provenance }[] = [
    { label: 'What it does', value: context.does, provenance: context.provenance.does },
    { label: 'What type', value: typeWords(context), hint: typeHint(context), provenance: context.provenance.type },
    { label: 'Stage', value: stage?.words ?? '', hint: stage?.plain, provenance: context.provenance.stage },
    { label: 'People served', value: context.served ? servedWords(context.served) : '', provenance: context.provenance.served },
    { label: 'Where it is', value: context.place.trim(), provenance: context.provenance.place },
  ].filter((row) => row.value !== '');

  return (
    <nav
      className={drawer ? `chrome wb-drawer wb-drawer-left${drawer.open ? ' is-open' : ''}` : 'chrome'}
      aria-label="This visit"
      aria-hidden={drawer ? !drawer.open : undefined}
      style={{
        /* As wide as the crew rail (the shared console page of 26 Nov 2026, rule 2). A phone's drawer keeps its own width. */
        width: open ? (drawer ? EXPANDED : 'var(--chat-rail)') : COLLAPSED,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--line)',
        borderBottom: 0,
        transition: `width var(--dur) var(--ease)`,
        overflow: 'hidden',
      }}
    >
      {drawer ? (
        <button className="wb-rail-toggle" onClick={drawer.onClose} aria-label="Close the project panel">
          <Chevron open />
          <span className="t-caption">Close</span>
        </button>
      ) : (
        <button
          className="wb-rail-toggle"
          onClick={() => {
            setTouched(true);
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-label={open ? 'Collapse the project rail' : 'Expand the project rail'}
          title={open ? 'Collapse' : 'Expand'}
        >
          <Chevron open={open} />
          {open && <span className="t-caption">Collapse</span>}
        </button>
      )}

      {open ? (
        <div style={{ padding: '14px 12px 0', overflowY: 'auto', minHeight: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 10, paddingLeft: 4 }}>
            Project
          </div>

          {/* The project card. One card, one project — the visit's. */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
              padding: '12px 14px 11px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span
                aria-hidden
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 'var(--r-pill)',
                  background: 'var(--ink-4)',
                  flex: 'none',
                }}
              />
              {/* THE NAME SHOWS ONCE, HERE — look pass, 8 Sep 2026. The card
                  is where a visitor names the project, by typing or by telling
                  Wellington; the record below no longer repeats it.
                  FROM 21 NOV 2026, the maintainer's word, the input is a clear
                  place to type: a "Project name" label over a box, and
                  Wellington asks for the name in the chat. */}
              {/* THE PROJECT NAME IS EASY TO FIX (the shared console page of 26 Nov 2026, rule 10):
                  always a box, whoever gave the name. A name typed here is the visitor's own and is
                  never overwritten (src/lib/visit.ts). */}
              <label htmlFor="wb-project-name" className="t-caption wb-rail-name-label">
                Project name
              </label>
            </div>
            <input
              id="wb-project-name"
              className="wb-rail-name wb-rail-name-box"
              type="text"
              value={context.name}
              onChange={(e) => onTyped('name', e.target.value)}
              placeholder={NAME_PLACEHOLDER}
              maxLength={160}
            />
          </div>

          {/* S21 — the screening report, under the project. Quiet: blue is for
              the one main next step. */}
          {report.show && (
            <>
              <button type="button" className="wb-report-button" onClick={report.onExport} style={{ marginTop: 10 }}>
                {EXPORT_BUTTON}
              </button>
              <p className="wb-report-how">{EXPORT_HOW}</p>
              {report.said && (
                <p className="wb-report-said" role="status">
                  {report.said}{' '}
                  <button type="button" className="wb-link-button" onClick={report.onDismiss}>
                    Close
                  </button>
                </p>
              )}
            </>
          )}

          {/* PROGRESS, IN THE RAIL (rule 2): Phoebe 0.3.0's tally, per funding path, in her own words. */}
          {tally.length > 0 && (
            <div className="wb-rail-tally" aria-label="Progress">
              <div className="eyebrow" style={{ marginBottom: 6 }}>Progress</div>
              {tally.map((t) => (
                <div key={t.pack} className="wb-rail-tally-path">
                  <div className="wb-rail-tally-row">
                    <span>{t.name}</span>
                    <span className="t-mono">{t.looked} of {t.rows} looked at</span>
                  </div>
                  {t.states.length > 0 && (
                    <div className="wb-rail-tally-states">
                      {t.states.map((s) => `${s.count} ${s.label}`).join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* THE RECORD his interview populates — from 21 Nov 2026, the
              maintainer's word, it starts collapsed and shows only the rows
              that hold a value (this replaces her 13 Nov ruling that it opens
              on landing). Collapsed, its heading still counts what he has
              heard, so the visitor sees it filling. The explainer sits behind
              the (i). */}
          <div style={{ margin: '18px 0 6px', paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              className="eyebrow wb-record-toggle"
              onClick={() => setRecordOpen((v) => !v)}
              aria-expanded={recordOpen}
            >
              Project record
              {rows.length > 0 && <span className="wb-record-count">{rows.length}</span>}
              <RecordCaret open={recordOpen} />
            </button>
            <span className="wb-info" role="img" tabIndex={0} aria-label={RECORD_EXPLAINER} title={RECORD_EXPLAINER}>
              i
            </span>
          </div>

          {recordOpen &&
            (rows.length === 0 ? (
              <p className="t-caption" style={{ margin: '4px 4px 0', fontSize: 11.5, lineHeight: 1.5, color: 'var(--ink-3)' }}>
                Nothing yet. Wellington fills this in as you talk.
              </p>
            ) : (
              rows.map((row, i) => <RecordRow key={row.label} {...row} last={i === rows.length - 1} />)
            ))}
        </div>
      ) : (
        <div
          title={name}
          aria-label={name}
          style={{ display: 'grid', placeItems: 'center', padding: '16px 0' }}
        >
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: 'var(--r-pill)',
              background: 'var(--ink-4)',
            }}
          />
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* REGISTER YOUR INTEREST — pinned to the foot of the rail, just above
          waterbots.ai and below everything else, the maintainer's word of
          16 Nov 2026 on #175. It stands out a little as BRAND.md §7's tinted
          panel in Tide (a light fill, a keyline, Tide text, a small icon) and
          is never a solid blue fill, so one blue button holds
          (src/lib/blue.ts). The record above scrolls; this stays put. With the
          rail collapsed it is the icon alone, as waterbots.ai is. */}
      {onInterest && (
        <a
          className={open ? 'wb-interest-cta' : 'wb-interest-cta is-collapsed'}
          href={pathForInterest()}
          title={open ? undefined : 'Register your interest'}
          aria-label={open ? undefined : 'Register your interest'}
          onClick={(e) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            onInterest();
          }}
        >
          <InterestIcon />
          {open && 'Register your interest'}
        </a>
      )}

      {/* The production site this console is linked from, and where saving
          happens. The reverse link is the marketing site's to make. BETA
          beside it, from 21 Nov 2026 — the maintainer's word: the one place
          the site says it is early, in place of the line under the menu. */}
      <a
        className="wb-rail-link"
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={open ? undefined : SITE_LABEL}
        style={{ justifyContent: open ? 'flex-start' : 'center' }}
      >
        <ExternalIcon />
        {open && <span>{SITE_LABEL}</span>}
        {open && <span className="tag wb-beta-tag">beta</span>}
      </a>
    </nav>
  );
}

/** The type row's value: the standard's name, in core's one copy of the words. No class is shown: none is asked. */
function typeWords(context: VisitContext): string {
  return (context.type ? projectType(context.type) : undefined)?.name ?? '';
}

/** The one-line definition, behind the value on hover. */
function typeHint(context: VisitContext): string | undefined {
  return (context.type ? projectType(context.type) : undefined)?.plain;
}

/**
 * One row of the record. A value once known, a dash until then, and the
 * source in a small caption. A hint, where the row has one, is the
 * definition behind the value, shown on hover. Name and place carry a quiet input so a visitor
 * who never chats can still say them; the input shows only when the field is
 * blank or was typed, so a value from the conversation reads as a value.
 */
function RecordRow({
  label,
  value,
  hint,
  provenance,
  editable,
  last,
}: {
  label: string;
  value: string;
  hint?: string;
  provenance: Provenance;
  editable?: { value: string; onChange: (v: string) => void; placeholder: string };
  last?: boolean;
}) {
  const showInput = editable !== undefined && (provenance === '' || provenance === 'typed');
  return (
    <div style={{ padding: '8px 4px', borderBottom: last ? 0 : '1px solid var(--line)' }}>
      <div
        className="t-mono"
        style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-4)' }}
      >
        {label}
      </div>
      {showInput ? (
        <input
          className="wb-rail-input"
          type="text"
          value={editable!.value}
          onChange={(e) => editable!.onChange(e.target.value)}
          placeholder={editable!.placeholder}
          aria-label={label}
          maxLength={160}
        />
      ) : (
        <div
          title={value ? hint : undefined}
          style={{
            fontSize: 12.5,
            lineHeight: 1.45,
            marginTop: 3,
            color: value ? 'var(--ink)' : 'var(--ink-4)',
            overflowWrap: 'anywhere',
          }}
        >
          {value || '—'}
        </div>
      )}
      {PROVENANCE_LABEL[provenance] !== '' && (
        <div className="t-caption" style={{ fontSize: 9.5, marginTop: 2, color: 'var(--ink-4)' }}>
          {PROVENANCE_LABEL[provenance]}
        </div>
      )}
    </div>
  );
}

/** A small envelope, in the link's own colour. */
export function InterestIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flex: 'none' }}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m2.5 4.5 5.5 4 5.5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flex: 'none' }}>
      <path
        d="M6.5 3.5H3.5v9h9v-3M9.5 3.5h3v3M12.5 3.5 7 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The record's caret: pointing down when open, right when collapsed. */
function RecordCaret({ open }: { open: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flex: 'none', transform: open ? 'rotate(-90deg)' : 'rotate(180deg)', transition: `transform var(--dur) var(--ease)` }}>
      <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{
        transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
        transition: `transform var(--dur) var(--ease)`,
        flex: 'none',
      }}
    >
      <path
        d="M10 3.5 5.5 8l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
