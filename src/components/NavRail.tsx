/**
 * The left rail — the visit's project, and nothing else.
 *
 * RESHAPED 2 Sep 2026, maintainer's ruling C. The surfaces moved out of the
 * rail and into the tab row under the journey bar, matching the production
 * console, so the rail now does what the production rail does: it names the
 * project you are working on. Here that is the current visit's project only —
 * unsaved, session-only, cleared by a reload — and the rail says so on the
 * card rather than implying a project list that does not exist.
 *
 * THE SHAPE is the production rail's, from the saved page the maintainer
 * brought in by hand: a small eyebrow, a raised project card with a dot, the
 * name, and a state chip. Production shows an organisation block above it;
 * there are no organisations here, so there is none.
 *
 * Chrome recedes, content rises (BRAND.md §2.3): the rail sits ON the frame,
 * flush and square, never as a card. The project card inside it rises one
 * plane to --card with the hairline §2.3 pairs with a white card.
 *
 * WIDER SINCE 29 Aug 2026. The design canon asked that the rail be widened
 * modestly whenever it was next opened; 208 -> 224. Unchanged today.
 */

import { useEffect, useState } from 'react';
import { SITE_LABEL, SITE_URL } from '../lib/site';

const EXPANDED = 224;
const COLLAPSED = 52;

/**
 * Below this the rail starts collapsed. The rail and the right column together
 * take about 600px; on a narrow window that leaves the centre too little to be
 * worth looking at. The reader can still expand it.
 */
const AUTO_COLLAPSE_BELOW = 1180;

/** What the card says when the visit has not named its project. Not a value. */
const UNNAMED = 'Unnamed project';

export default function NavRail({ projectName }: { projectName: string }) {
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

  const name = projectName.trim() || UNNAMED;

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
        <div style={{ padding: '14px 12px 0' }}>
          {/* One word. The card's own chip says the rest, and a second line
              here wrapped in the 224px rail. */}
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
                  color: projectName.trim() ? 'var(--ink)' : 'var(--ink-3)',
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

          <p
            className="t-caption"
            style={{ margin: '12px 0 0', padding: '0 4px', fontSize: 10.5, lineHeight: 1.55 }}
          >
            Nothing is kept between visits. A reload starts over.
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
