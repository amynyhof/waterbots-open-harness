/**
 * The left rail — the visit's project, and the record Wellington's interview
 * populates.
 *
 * RESHAPED 4 Sep 2026, maintainer's ruling 3. The project context left the
 * desk's centre and became this: the project card, then one row per field —
 * what it does, what kind, where it is, what it is called, in the order the
 * seats need them (ruled 5 Sep 2026, from Bob) — each showing the value or a
 * dash, and where the value came from. **A visitor who never chats
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
 */

import { useEffect, useState } from 'react';
import { SITE_LABEL, SITE_URL } from '../lib/site';
import { KIND_LABEL, type Provenance, type VisitContext } from '../lib/visit';

const EXPANDED = 224;
const COLLAPSED = 52;

/** Below this the rail starts collapsed. The reader can still expand it. */
const AUTO_COLLAPSE_BELOW = 1180;

/** What the card says when the visit has not named its project. Not a value. */
const UNNAMED = 'Unnamed project';

const PROVENANCE_LABEL: Record<Provenance, string> = {
  '': '',
  typed: 'typed',
  chat: 'from the conversation',
  pin: 'from the map pin',
};

export default function NavRail({
  context,
  onTyped,
}: {
  context: VisitContext;
  onTyped: (field: 'name' | 'place', value: string) => void;
}) {
  const [open, setOpen] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= AUTO_COLLAPSE_BELOW
  );

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
      className="chrome"
      aria-label="This visit"
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
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: context.name.trim() ? 'var(--ink)' : 'var(--ink-3)',
                  overflowWrap: 'anywhere',
                }}
              >
                {name}
              </span>
            </div>
            <div
              className="t-mono"
              style={{
                fontSize: 9.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginTop: 8,
              }}
            >
              unsaved · this visit
            </div>
          </div>

          {/* THE RECORD his interview populates. Four rows; a dash until he
              has heard it; the source under each value. */}
          <div className="eyebrow" style={{ margin: '18px 0 6px', paddingLeft: 4 }}>
            Project record
          </div>

          {/* THE ORDER IS THE SEATS' — ruled 5 Sep 2026, from Bob: what it
              does (Phoebe, Calvin), what kind (Phoebe, Calvin), where it is
              (Phoebe, Bridget before any pin, Calvin), what it is called (the
              desk only). Wellington asks in this order. */}
          <RecordRow label="What it does" value={context.does} provenance={context.provenance.does} />
          <RecordRow
            label="What kind"
            value={context.kind ? KIND_LABEL[context.kind] : ''}
            provenance={context.provenance.kind}
          />
          <RecordRow
            label="Where it is"
            value={context.place}
            provenance={context.provenance.place}
            editable={{ value: context.place, onChange: (v) => onTyped('place', v), placeholder: 'or type it' }}
          />
          <RecordRow
            label="What it is called"
            value={context.name}
            provenance={context.provenance.name}
            editable={{ value: context.name, onChange: (v) => onTyped('name', v), placeholder: 'or type it' }}
            last
          />

          <p
            className="t-caption"
            style={{ margin: '12px 0 0', padding: '0 4px', fontSize: 10.5, lineHeight: 1.55 }}
          >
            Wellington asks for these in the chat, and what you tell him lands here. Nothing is kept
            between visits.
          </p>
        </div>
      ) : (
        <div
          title={`${name} · unsaved, this visit`}
          aria-label={`${name}, unsaved, this visit`}
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

/**
 * One row of the record. A value once known, a dash until then, and the
 * source in a small caption. Name and place carry a quiet input so a visitor
 * who never chats can still say them; the input shows only when the field is
 * blank or was typed, so a value from the conversation reads as a value.
 */
function RecordRow({
  label,
  value,
  provenance,
  editable,
  last,
}: {
  label: string;
  value: string;
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
      <div className="t-caption" style={{ fontSize: 9.5, marginTop: 2, color: 'var(--ink-4)' }}>
        {provenance ? PROVENANCE_LABEL[provenance] : 'Wellington asks this'}
      </div>
    </div>
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
