/**
 * The left navigation rail.
 *
 * Chrome recedes, content rises (BRAND.md §8.3a): the rail sits BELOW the
 * canvas on --chrome, flush and square, never as a card — a rail rendered as
 * a card would float navigation above the work it serves. The active item is
 * marked with --paper, one step up, never with an accent fill.
 *
 * It lists exactly what exists. Two surfaces are built — the basin map and
 * the eligibility worksheet — so there are two items. Inventing a nav item
 * for something unbuilt would be a fabricated claim about the product, which
 * is the same rule that keeps fabricated data off the map.
 */

import { useEffect, useState } from 'react';
import { SITE_LABEL, SITE_URL } from '../lib/site';
import type { Surface } from '../lib/surfaces';
import { SURFACES } from '../lib/surfaces';

const EXPANDED = 208;
const COLLAPSED = 52;

/**
 * Below this the rail starts collapsed. The rail and the chat dock together
 * take 580px; on a narrow window that leaves the map too little to be worth
 * looking at, and the map is the work these surfaces serve. The reader can
 * still expand it.
 */
const AUTO_COLLAPSE_BELOW = 1180;

export default function NavRail({
  active,
  onNavigate,
}: {
  active: Surface;
  onNavigate: (surface: Surface) => void;
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

  return (
    <nav
      className="chrome"
      aria-label="Sections"
      style={{
        width: open ? EXPANDED : COLLAPSED,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--line)',
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
        aria-label={open ? 'Collapse the navigation rail' : 'Expand the navigation rail'}
        title={open ? 'Collapse' : 'Expand'}
      >
        <Chevron open={open} />
        {open && <span className="t-caption">Collapse</span>}
      </button>

      {SURFACES.map((surface) => (
        <RailItem
          key={surface.key}
          label={surface.label}
          active={surface.key === active}
          collapsed={!open}
          onSelect={() => onNavigate(surface.key)}
        />
      ))}

      <div style={{ flex: 1 }} />

      {/* The production site this map is linked from. The reverse link is the
          marketing site's to make, not this repository's. */}
      <a
        className="wb-rail-link"
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={collapsedTitle(open)}
        style={{ justifyContent: open ? 'flex-start' : 'center' }}
      >
        <ExternalIcon />
        {open && <span>{SITE_LABEL}</span>}
      </a>

      {open && (
        <p
          className="t-caption"
          style={{ margin: 0, padding: '10px 14px 12px', fontSize: 10.5, lineHeight: 1.5 }}
        >
          Two surfaces are built so far. The chat console is next.
        </p>
      )}
    </nav>
  );
}

const collapsedTitle = (open: boolean) => (open ? undefined : SITE_LABEL);

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

function RailItem({
  label,
  active,
  collapsed,
  onSelect,
}: {
  label: string;
  active?: boolean;
  collapsed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className="wb-rail-item"
      onClick={onSelect}
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      style={{
        width: '100%',
        border: 0,
        font: 'inherit',
        cursor: 'pointer',
        textAlign: 'left',
        /* --paper marks the subject, one step up from chrome. Never an accent. */
        background: active ? 'var(--paper)' : 'transparent',
        color: active ? 'var(--ink)' : 'var(--ink-2)',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 'var(--r-pill)',
          background: active ? 'var(--ink-3)' : 'var(--ink-4)',
          flex: 'none',
        }}
      />
      {!collapsed && <span style={{ fontSize: 13.5 }}>{label}</span>}
    </button>
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
