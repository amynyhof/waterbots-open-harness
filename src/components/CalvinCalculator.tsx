/**
 * Calvin's carbon calculator — the open core's, installed from the release
 * calvin-v0.3.0 (@waterbots/calvin 0.3.0, core 0.1.1, engine gs4gg-carbon 0.19.0) from
 * 16 Nov 2026; first calvin-v0.2.0, on the maintainer's word of 14 Nov 2026 (proposal docs/proposals/calvin-from-open-core.md,
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

import { useEffect, useRef, type ReactNode } from 'react';
import {
  CalculatorLens,
  CalculatorWork,
  useCalculatorState,
  type CalculatorState,
  type CalvinProject,
} from '@waterbots/calvin/screen';
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

/** What a host needs back from the calculator: the figure its screen shows, and the facts it still needs. */
export interface CalvinSummary {
  /** Set only when the calculator's own screen shows a figure. */
  figure: { er: number; version: string } | null;
  /** The facts it still needs, in a visitor's words. */
  missing: string[];
}

export const NO_SUMMARY: CalvinSummary = { figure: null, missing: [] };

/**
 * THE CALCULATOR, WITH ITS STATE, STARTED FRESH WHEN THE TECHNOLOGY BECOMES
 * KNOWN. Found on the 0.3.0 walk, 16 Nov 2026, and present with 0.2.0 too:
 * the core sets its starting values once, when it opens, and with the sliders
 * on a community system's days start at the slider's own starting value (347)
 * only when the technology is known at that moment. On this site the page
 * opens before Wellington has heard anything, so the days stayed at the core's
 * general 365 while the slider said "starts at 347 d", and the figure ran
 * about 5% high. So the state lives here, keyed by the technology: when the
 * record names it, the calculator opens again with the facts, and every
 * starting value is the package's own. This site types no number for it.
 * A host gets back only the figure and the facts still needed.
 */
export function CalvinCarbon({
  project,
  header,
  onSummary,
}: {
  project: CalvinProject;
  /** The host's top of the lens, given the facts still needed. */
  header?: (missing: string[]) => ReactNode;
  onSummary?: (summary: CalvinSummary) => void;
}) {
  return <CalvinCarbonState key={project.technology ?? 'none'} project={project} header={header} onSummary={onSummary} />;
}

function CalvinCarbonState({
  project,
  header,
  onSummary,
}: {
  project: CalvinProject;
  header?: (missing: string[]) => ReactNode;
  onSummary?: (summary: CalvinSummary) => void;
}) {
  const calc = useCalculatorState(project, { exAnteOnly: true });
  /* THE COUNT FOLLOWS THE RECORD. The core reads the number served only when
     it opens, so a count said afterwards is handed on, the way a record save
     reaches a seat already open. Found on the first look, 14 Nov 2026. */
  const patchCalc = calc.patch;
  const served = project.population?.served ?? null;
  const lastServed = useRef<number | null>(null);
  useEffect(() => {
    if (served === lastServed.current) return;
    lastServed.current = served;
    if (served !== null) patchCalc({ populationCount: served });
  }, [served, patchCalc]);

  /* Only a figure the calculator's own screen shows: every fact present, an
     official fNRB, and — for a project credited under V1.0, which this site
     does not yet pass (A29) — its filed V1.0 fNRB. */
  const missing = calc.missingFacts.map((fact) => fact.label);
  const shown = calc.result && missing.length === 0 && !calc.fnrbRefusal && !calc.filedFnrbRefusal;
  const er = shown && calc.result ? calc.result.result.ER : null;
  const version = shown && calc.result ? calc.result.version : '';
  const missingKey = JSON.stringify(missing);
  useEffect(() => {
    onSummary?.({ figure: er === null ? null : { er, version }, missing: JSON.parse(missingKey) as string[] });
  }, [er, version, missingKey, onSummary]);

  return <CalvinCalculator calc={calc} project={project} header={header?.(missing)} />;
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
