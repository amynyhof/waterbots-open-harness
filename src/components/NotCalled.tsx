/**
 * What a calculator's desk shows when the agent map closes it — J4, 23 Nov 2026 (RULINGS.md, section 4): an
 * unlikely pathway's agent is not called in the screening. The visitor is told why, what would change it, and
 * that they may look in the Agent Commons. Every word about the project comes from the shared record's reading.
 */

import type { PathwayReading } from '@waterbots/core/record';
import type { StandardId } from '@waterbots/core/standards';
import { PATHWAY_NAME } from '../lib/projectRecord';
import { COMMONS_LABEL } from '../lib/pages';
import { SCREEN_COLUMN } from '../screen/ScreenChat';

export default function NotCalled({
  pathway,
  reading,
  onCommons,
}: {
  pathway: StandardId;
  /** The reading on the record. Absent, only the heading's words are shown. */
  reading: PathwayReading | undefined;
  onCommons: () => void;
}) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div data-not-called={pathway} style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '24px 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px', lineHeight: 1.3 }}>
          {PATHWAY_NAME[pathway] ?? pathway}: unlikely for this project
        </h2>
        {reading?.reason && <Line label="Why" text={reading.reason} />}
        {reading?.wouldChange && <Line label="What would change it" text={reading.wouldChange} />}
        <p className="t-body" style={{ margin: '14px 0 0', fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          If one of those answers changes, tell Wellington or Phoebe and it is read again. You can look at this
          calculator in the{' '}
          <button type="button" className="wb-row-action" onClick={onCommons}>
            {COMMONS_LABEL}
          </button>
          .
        </p>
      </div>
    </div>
  );
}

function Line({ label, text }: { label: string; text: string }) {
  return (
    <p className="t-body" style={{ margin: '0 0 10px', fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
      <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{label}.</strong> {text}
    </p>
  );
}
