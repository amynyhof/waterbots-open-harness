/**
 * The left navigation rail.
 *
 * Chrome recedes, content rises (BRAND.md §8.3a): the rail sits BELOW the
 * canvas on --chrome, flush and square, never as a card — a rail rendered as
 * a card would float navigation above the work it serves. The active item is
 * marked with --paper, one step up, never with an accent fill.
 *
 * It lists exactly what exists. The map is the only surface this repo has, so
 * it is the only item here. Inventing a nav item for something unbuilt would
 * be a fabricated claim about the product, which is the same rule that keeps
 * fabricated data off the map.
 */

import { useEffect, useState } from 'react';

const EXPANDED = 208;
const COLLAPSED = 52;

/**
 * Below this the rail starts collapsed. The rail and the chat dock together
 * take 580px; on a narrow window that leaves the map too little to be worth
 * looking at, and the map is the work these surfaces serve. The reader can
 * still expand it.
 */
const AUTO_COLLAPSE_BELOW = 1180;

export default function NavRail() {
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

      <RailItem label="Basin map" active collapsed={!open} />

      <div style={{ flex: 1 }} />

      {open && (
        <p
          className="t-caption"
          style={{ margin: 0, padding: '12px 14px', fontSize: 10.5, lineHeight: 1.5 }}
        >
          The map is the only surface built so far.
        </p>
      )}
    </nav>
  );
}

function RailItem({
  label,
  active,
  collapsed,
}: {
  label: string;
  active?: boolean;
  collapsed: boolean;
}) {
  return (
    <div
      className="wb-rail-item"
      aria-current={active ? 'page' : undefined}
      title={collapsed ? label : undefined}
      style={{
        /* --paper marks the subject, one step up from chrome. Never an accent. */
        background: active ? 'var(--paper)' : 'transparent',
        color: active ? 'var(--fg-1)' : 'var(--fg-2)',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 'var(--r-pill)',
          background: active ? 'var(--fg-3)' : 'var(--fg-4)',
          flex: 'none',
        }}
      />
      {!collapsed && <span style={{ fontSize: 13.5 }}>{label}</span>}
    </div>
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
