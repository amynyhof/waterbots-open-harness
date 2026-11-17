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
import { MAX_HUMAN_NOTE_CHARS, type PersonAsk, type SealState } from '../lib/handoff';
import { SITE_LABEL, SITE_URL } from '../lib/site';
import { pathForInterest } from '../lib/pages';
import { PROJECT_STAGES, projectType } from '../lib/projectTypes.generated';
import { WATER_SUPPLY_TYPES, servedWords, type Provenance, type VisitContext } from '../lib/visit';

const EXPANDED = 224;
const COLLAPSED = 52;

/** Narrowed below this after landing, the rail collapses. The reader can still expand it. */
const AUTO_COLLAPSE_BELOW = 1180;

/** What the card says when the visit has not named its project. Not a value. */
const UNNAMED = 'Unnamed project';

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
 * THE SAVE DOOR AND THE REPORT, under the project — the maintainer's word of
 * 14 Nov 2026 (W27, S21). The save button left the foot of the crew column
 * for here, with the box that sends the project to the team for review, and
 * "Export screening report" sits under it. Save is blue only when it is the
 * one next step (src/lib/blue.ts, 16 Nov 2026); otherwise it is drawn quiet.
 */
export interface SaveDoor {
  /** Something is on the record, so there is a project to save and report. */
  show: boolean;
  sealing: SealState;
  onSeal: () => void;
  /** A path is ruled out: the box to send the project to the team shows. */
  showPerson: boolean;
  person: PersonAsk;
  onPerson: (next: PersonAsk) => void;
  /** Opens the print dialog on the screening report (S21). */
  onExport: () => void;
  /** One blue button at a time: Save is the blue one only when nothing comes before it. */
  blue: boolean;
}

export default function NavRail({
  context,
  onTyped,
  save,
  onInterest,
  drawer,
}: {
  context: VisitContext;
  onTyped: (field: 'name' | 'place', value: string) => void;
  save: SaveDoor;
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

  return (
    <nav
      className={drawer ? `chrome wb-drawer wb-drawer-left${drawer.open ? ' is-open' : ''}` : 'chrome'}
      aria-label="This visit"
      aria-hidden={drawer ? !drawer.open : undefined}
      style={{
        width: open ? EXPANDED : COLLAPSED,
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
                  Wellington; the record below no longer repeats it. A name he
                  heard reads as a value; a blank or typed one is an input. */}
              {context.provenance.name === 'chat' ? (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: 'var(--ink)',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {name}
                </span>
              ) : (
                <input
                  className="wb-rail-input wb-rail-name"
                  type="text"
                  value={context.name}
                  onChange={(e) => onTyped('name', e.target.value)}
                  placeholder={UNNAMED}
                  aria-label="Project name"
                  maxLength={160}
                />
              )}
            </div>
          </div>

          {/* S21 — the screening report, under the project. Quiet: blue is for
              the one main next step. The save button left this spot for the
              foot of the rail on 16 Nov 2026 (her walk of #174, on a tablet). */}
          {save.show && (
            <button type="button" className="wb-report-button" onClick={save.onExport} style={{ marginTop: 10 }}>
              Export screening report
            </button>
          )}

          {/* THE RECORD his interview populates. Four rows; a dash until he
              has heard it. The explainer sits behind the (i). */}
          <div
            className="eyebrow"
            style={{ margin: '18px 0 6px', paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            Project record
            <span
              className="wb-info"
              role="img"
              tabIndex={0}
              aria-label={RECORD_EXPLAINER}
              title={RECORD_EXPLAINER}
            >
              i
            </span>
          </div>

          {/* THE ORDER IS THE SEATS' — ruled 5 Sep 2026: what it
              does (Phoebe, Calvin), what type and the stage (Phoebe, Calvin),
              where it is (Phoebe, Bridget before any pin, Calvin), what it is
              called (the desk only). Wellington asks in this order. */}
          <RecordRow label="What it does" value={context.does} provenance={context.provenance.does} />
          <RecordRow
            label="What type"
            value={typeWords(context)}
            hint={typeHint(context)}
            provenance={context.provenance.type}
          />
          <RecordRow
            label="Stage"
            value={PROJECT_STAGES.find((s) => s.id === context.stage)?.words ?? ''}
            hint={PROJECT_STAGES.find((s) => s.id === context.stage)?.plain}
            provenance={context.provenance.stage}
          />
          {/* PEOPLE SERVED — 27 Sep 2026, ruling R4: a row in the same shape,
              after the stage, as Wellington asks it. Only for a water supply
              project, or once said; households stay households. */}
          {(context.served || WATER_SUPPLY_TYPES.includes(context.type)) && (
            <RecordRow
              label="People served"
              value={context.served ? servedWords(context.served) : ''}
              provenance={context.provenance.served}
            />
          )}
          <RecordRow
            label="Where it is"
            value={context.place}
            provenance={context.provenance.place}
            editable={{ value: context.place, onChange: (v) => onTyped('place', v), placeholder: 'or type it' }}
            last
          />
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

      {/* SAVE, AT THE FOOT OF THE RAIL, just above Register your interest —
          the maintainer's word of 16 Nov 2026 on #174. Still the one blue
          button when nothing comes before it (src/lib/blue.ts), at normal
          text size; the box to send the project to the team stays with it,
          because it goes with the save. The record above scrolls; this stays
          put. With the rail collapsed it is a small button with an icon. */}
      {save.show && <SaveFoot save={save} open={open} />}

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
          happens. The reverse link is the marketing site's to make. */}
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
      </a>
    </nav>
  );
}

/** The save button at the foot of the rail, with the team-review box above it when a path is ruled out. */
function SaveFoot({ save, open }: { save: SaveDoor; open: boolean }) {
  const { sealing, person, onPerson } = save;
  const busy = sealing.kind === 'sealing' || sealing.kind === 'sealed';
  if (!open) {
    return (
      <button
        type="button"
        className={save.blue ? 'wb-save-button is-collapsed' : 'wb-save-button is-quiet is-collapsed'}
        onClick={save.onSeal}
        disabled={busy}
        title="Save and sign up"
        aria-label="Save and sign up"
      >
        <SaveIcon />
      </button>
    );
  }
  return (
    <div className="wb-rail-save wb-rail-save-foot">
      {/* THE DOOR TO A PERSON — item A18, 26 Sep 2026; from 14 Nov 2026 shown
          whenever a path is ruled out, Blocked or not applying (the ruling of
          23 Sep 2026), and never offered in chat. Nothing is sent until the
          save button below is pressed, and then only with it. */}
      {save.showPerson && (
        <div style={{ margin: '0 2px 10px' }}>
          <label
            style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, lineHeight: 1.45, color: 'var(--ink)', cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={person.wanted}
              disabled={busy}
              onChange={(e) => onPerson({ ...person, wanted: e.target.checked })}
              style={{ marginTop: 3, accentColor: 'var(--tide-ui)', flex: 'none' }}
            />
            Send my project to the WaterBots team so a person can look at it
          </label>
          {person.wanted && (
            <textarea
              className="wb-rail-input"
              value={person.note}
              disabled={busy}
              onChange={(e) => onPerson({ ...person, note: e.target.value })}
              placeholder="A note for them, if you like"
              aria-label="A note for the WaterBots team"
              maxLength={MAX_HUMAN_NOTE_CHARS}
              rows={2}
              style={{ resize: 'none', marginTop: 6 }}
            />
          )}
        </div>
      )}

      <button
        type="button"
        className={save.blue ? 'wb-save-button' : 'wb-save-button is-quiet'}
        onClick={save.onSeal}
        disabled={busy}
        aria-busy={sealing.kind === 'sealing' || undefined}
      >
        {sealing.kind === 'sealing' && 'Saving your project…'}
        {sealing.kind === 'sealed' && 'Saved. Taking you to waterbots.ai…'}
        {(sealing.kind === 'idle' || sealing.kind === 'failed') && 'Save and sign up'}
      </button>
      {sealing.kind === 'failed' && (
        <p role="alert" style={{ margin: '8px 0 0', fontSize: 12, lineHeight: 1.5, color: 'var(--state-pending)' }}>
          {sealing.message}
        </p>
      )}
    </div>
  );
}

/** An arrow into a tray: saving the project to take it on. */
function SaveIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden style={{ display: 'block' }}>
      <path d="M8 2.5v7M5 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** The type row's value: the standard's name, and the class beside a drinking-water type. */
function typeWords(context: VisitContext): string {
  const type = context.type ? projectType(context.type) : undefined;
  if (!type) return '';
  const gsClass = context.gsClass ? projectType(context.gsClass) : undefined;
  return gsClass ? `${type.name} · ${gsClass.name}` : type.name;
}

/** The one-line definitions, behind the value on hover. */
function typeHint(context: VisitContext): string | undefined {
  const type = context.type ? projectType(context.type) : undefined;
  if (!type) return undefined;
  const gsClass = context.gsClass ? projectType(context.gsClass) : undefined;
  return gsClass ? `${type.plain} ${gsClass.plain}` : type.plain;
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
function InterestIcon() {
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
