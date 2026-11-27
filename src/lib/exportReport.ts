/**
 * THE SCREENING REPORT EXPORT (S21), on core's print part (core 0.6.0; the shared console page of 26 Nov 2026,
 * rule 13). Moved out of App.tsx in family 4, and from 27 Nov 2026 the site's own print rules and fallback tab
 * are gone: core copies the report into a print area of its own under <body>, so no console panel can clip it;
 * opens it in its own tab when no print window opens; and clears the print area however the print ends, so a
 * cancelled print followed by a second Export prints in full.
 */

import { printReport, type ExportOutcome } from '@waterbots/core/print';
import { EXPORT_WORDS } from '@waterbots/core/consoleWords';

/** Sent just before the report is copied, so each part of it sets its time stamp first (CalvinCalculator.tsx). */
export const REPORT_STAMP_EVENT = 'wb-report-stamp';

/** The screening report's own root (src/components/ScreeningReport.tsx). */
export const SCREENING_REPORT_ID = 'wb-screening-report';

/** The Export button's one name and its line, the same on both sites (core's words). */
export const EXPORT_BUTTON = EXPORT_WORDS.button;
export const EXPORT_HOW = EXPORT_WORDS.hint;

/** What the site says after an export that opened no print window, in core's words. Empty when it printed. */
export function exportSaid(outcome: ExportOutcome | 'missing'): string {
  if (outcome === 'in-tab') return EXPORT_WORDS.inTab;
  if (outcome === 'failed' || outcome === 'missing') return EXPORT_WORDS.failed;
  return '';
}

/**
 * Exports the screening report from the visitor's own click, and resolves to what really happened. "missing" only if
 * the report is not on the page, which the site never shows a button for.
 */
export async function printScreeningReport(): Promise<ExportOutcome | 'missing'> {
  const report = document.getElementById(SCREENING_REPORT_ID);
  if (!report) return 'missing';
  window.dispatchEvent(new Event(REPORT_STAMP_EVENT));
  return printReport(report);
}
