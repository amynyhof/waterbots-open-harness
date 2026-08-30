/**
 * The water-stress legend.
 *
 * Three jobs beyond naming the colours:
 *
 * 1. It separates the ordered scale from the two categories that are NOT on
 *    it. Arid and Low Water Use means the water-use denominator is too small
 *    for a stress ratio to be meaningful; No Data is an absence. Together they
 *    are 20.93% of basins, so presenting them as a low reading would mislead
 *    across a fifth of the map.
 *
 * 2. It says whether the values on screen are WRI's published figures or our
 *    roll-up. Level 6 is published; Level 4 is an area-weighted majority of
 *    its children, because Aqueduct publishes nothing at Level 4.
 *
 * 3. It gets out of the way. On a narrow centre column the expanded legend
 *    covered most of the map, so it collapses to a single strip and starts
 *    collapsed when the column is tight. The map is the work; the legend
 *    explains it and should not outrank it.
 *
 * Labels are WRI's exact published strings.
 */

import { useEffect, useRef, useState } from 'react';
import { STRESS_ORDER, STRESS_PALETTE } from '../lib/stress';

/** Below this the legend starts collapsed. Measured on the MAP COLUMN, not the
 *  window, because the rail and chat dock both change how much is left. */
const AUTO_COLLAPSE_BELOW = 560;

export default function StressLegend({
  level,
  derivation,
}: {
  level: 4 | 6;
  derivation: string;
}) {
  const [open, setOpen] = useState(true);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  /* Follows the column width until the reader expresses a preference. */
  useEffect(() => {
    const parent = root.current?.parentElement;
    if (!parent) return;
    const measure = () => {
      if (!touched) setOpen(parent.clientWidth >= AUTO_COLLAPSE_BELOW);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [touched]);

  const scale = STRESS_ORDER.filter((k) => STRESS_PALETTE[k].onScale);
  const offScale = STRESS_ORDER.filter((k) => !STRESS_PALETTE[k].onScale);
  const derived = level === 4;

  return (
    <div
      ref={root}
      className="card"
      style={{
        position: 'absolute',
        left: 12,
        bottom: 22,
        zIndex: 500,
        width: open ? 232 : 'auto',
        maxWidth: 'calc(100% - 24px)',
        maxHeight: 'calc(100% - 44px)',
        overflowY: 'auto',
        padding: open ? 14 : '9px 12px',
      }}
    >
      <button
        className="wb-legend-toggle"
        onClick={() => {
          setTouched(true);
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        style={{ marginBottom: open ? 10 : 0 }}
      >
        {/* When collapsed the swatches preview the ramp, so the strip still
            says what it is rather than being a bare label. */}
        {!open && (
          <span style={{ display: 'inline-flex', gap: 2, flex: 'none' }} aria-hidden>
            {scale.map((k) => (
              <span
                key={k}
                style={{
                  width: 9,
                  height: 11,
                  borderRadius: 1,
                  background: STRESS_PALETTE[k].fill,
                  opacity: STRESS_PALETTE[k].fillOpacity + 0.18,
                }}
              />
            ))}
          </span>
        )}
        <span className="eyebrow" style={{ flex: 1 }}>
          Water stress
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <>
          {scale.map((key) => (
            <Row key={key} colourKey={key} />
          ))}

          <div style={{ borderTop: '1px solid var(--line)', margin: '9px 0 8px' }} />

          <div className="t-caption" style={{ marginBottom: 6, fontSize: 11 }}>
            Not a stress reading
          </div>
          {offScale.map((key) => (
            <Row key={key} colourKey={key} />
          ))}

          <div style={{ borderTop: '1px solid var(--line)', margin: '10px 0 8px' }} />

          <p className="t-caption" style={{ margin: 0, fontSize: 11, lineHeight: 1.45 }}>
            {derived ? (
              <>
                Level {level} values are <strong>derived</strong> — {derivation}. WRI publishes
                water stress at Level 6; zoom in for the published figures.
              </>
            ) : (
              <>
                Level {level} values are WRI&rsquo;s published figures for each basin. No
                aggregation was applied.
              </>
            )}
          </p>
          <p className="t-caption" style={{ margin: '6px 0 0', fontSize: 10, color: 'var(--ink-4)' }}>
            WRI Aqueduct 4.0 · CC BY 4.0
          </p>
        </>
      )}
    </div>
  );
}

function Row({ colourKey }: { colourKey: keyof typeof STRESS_PALETTE }) {
  const s = STRESS_PALETTE[colourKey];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '2.5px 0' }}>
      <span
        style={{
          width: 18,
          height: 12,
          borderRadius: 2,
          flex: 'none',
          /* Composited over paper so the swatch shows the true rendered
             colour, opacity included, rather than the raw fill. */
          background: s.fill,
          opacity: s.fillOpacity + 0.18,
          border: '1px solid var(--line)',
        }}
      />
      <span className="t-caption" style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
        {s.label}
      </span>
    </div>
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
        transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
        transition: `transform var(--dur) var(--ease)`,
        flex: 'none',
        color: 'var(--ink-3)',
      }}
    >
      <path
        d="M3.5 10 8 5.5l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
