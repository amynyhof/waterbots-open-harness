/**
 * Calvin's carbon calculator — the open core's, installed from the release
 * calvin-v0.2.0 (@waterbots/calvin 0.2.0, engine gs4gg-carbon 0.19.0), on the
 * maintainer's word of 14 Nov 2026 (proposal docs/proposals/calvin-from-open-core.md,
 * step 2).
 *
 * THE SAME CALCULATOR AND LOOK AS THE PAID SITE, LOCKED TO EX-ANTE. The state
 * hook is given `exAnteOnly: true`: every run is ex-ante, a saved ex-post
 * analysis would open as ex-ante, and the sliders are on. The engine does every
 * sum; this file draws nothing but the frame around the core's two zones —
 * the lens (the project facts and the controls) and the work surface (the
 * derivation, the version tabs, the tags).
 *
 * NO SAVE BUTTON. The core draws Save only when a host passes `onSave`, and
 * this site passes none: the save door is this site's, in the left rail.
 *
 * THE HOST'S HEADER. The lens takes the host's own top. On the console it says
 * where the facts come from — the project record on the left — and on the
 * Commons, which holds no record, it is a small form (CommonsSeats.tsx).
 *
 * STYLED BY THIS SITE'S TOKENS. The wrapper is `.wb-calvin`: src/styles/calvin.css
 * maps the core's colour names to this site's, and its classes are copied,
 * scoped, by scripts/build-calvin-css.mjs. The package's own print rules come
 * with it, so its report prints.
 */

import type { ReactNode } from 'react';
import { CalculatorLens, CalculatorWork, type CalculatorState, type CalvinProject } from '@waterbots/calvin/screen';
import '@waterbots/calvin/styles.css';
import '../styles/calvin.css';
import { CALVIN_PACKAGE_VERSION } from '../lib/calvinProject';

export default function CalvinCalculator({
  calc,
  project,
  header,
}: {
  calc: CalculatorState;
  project: CalvinProject;
  header?: ReactNode;
}) {
  return (
    <div className="wb-calvin" style={{ position: 'absolute', inset: 0, display: 'flex', minHeight: 0, background: 'var(--paper)' }}>
      <aside
        aria-label="The calculator's project facts and controls"
        style={{
          width: 320,
          flex: 'none',
          overflowY: 'auto',
          borderRight: '1px solid var(--line)',
          background: 'var(--card)',
          padding: '14px 14px 18px',
        }}
      >
        <CalculatorLens calc={calc} header={header} />
      </aside>
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '14px 18px 24px' }}>
        <CalculatorWork calc={calc} project={project} appVersion={CALVIN_PACKAGE_VERSION} tab="calculator" />
      </div>
    </div>
  );
}

/** The console's header: where the facts come from, in a visitor's words. */
export function RecordFacts({ missing }: { missing: string[] }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p className="t-caption" style={{ margin: 0, color: 'var(--ink-2)' }}>
        Calvin reads the facts from your project record, on the left: what kind of water system it is, the
        country, and how many people it serves.
        {missing.length > 0 && (
          <> Still needed: {missing.join(', ')}. Tell Wellington, or type the country into “Where it is”.</>
        )}
      </p>
    </div>
  );
}
