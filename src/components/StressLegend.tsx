/**
 * The water-stress legend.
 *
 * Two jobs beyond naming the colours:
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
 * Labels are WRI's exact published strings.
 */

import { STRESS_ORDER, STRESS_PALETTE } from '../lib/stress';

export default function StressLegend({
  level,
  derivation,
}: {
  level: 4 | 6;
  derivation: string;
}) {
  const scale = STRESS_ORDER.filter((k) => STRESS_PALETTE[k].onScale);
  const offScale = STRESS_ORDER.filter((k) => !STRESS_PALETTE[k].onScale);
  const derived = level === 4;

  return (
    <div
      className="card"
      style={{
        position: 'absolute',
        left: 12,
        bottom: 22,
        zIndex: 500,
        width: 232,
        padding: 14,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        Water stress
      </div>

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
            Level {level} values are <strong>derived</strong> — {derivation}. WRI publishes water
            stress at Level 6; zoom in for the published figures.
          </>
        ) : (
          <>
            Level {level} values are WRI&rsquo;s published figures for each basin. No aggregation
            was applied.
          </>
        )}
      </p>
      <p className="t-caption" style={{ margin: '6px 0 0', fontSize: 10, color: 'var(--fg-4)' }}>
        WRI Aqueduct 4.0 · CC BY 4.0
      </p>
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
      <span className="t-caption" style={{ fontSize: 11.5, color: 'var(--fg-2)' }}>
        {s.label}
      </span>
    </div>
  );
}
