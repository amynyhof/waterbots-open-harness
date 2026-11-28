/**
 * THE SCREENING REPORT EXPORT (S21), on core's print part (core 0.6.0; the shared console page of 26 Nov 2026,
 * rule 13). Moved out of App.tsx in family 4, and from 27 Nov 2026 the site's own print rules and fallback tab
 * are gone: core copies the report into a print area of its own under <body>, so no console panel can clip it;
 * opens it in its own tab when no print window opens; and clears the print area however the print ends, so a
 * cancelled print followed by a second Export prints in full.
 *
 * RULE 22 (the walk of 27 Nov 2026): under 600 pixels wide, or inside a browser built into an app, Export opens
 * the report in its own tab instead of the print window, because that window's buttons can be out of reach there.
 * The person prints from the tab.
 */

import { openReportInTab, printReport, type ExportOutcome } from '@waterbots/core/print';
import { EXPORT_WORDS } from '@waterbots/core/consoleWords';

/** Sent just before the report is copied, so each part of it sets its time stamp first (CalvinCalculator.tsx). */
export const REPORT_STAMP_EVENT = 'wb-report-stamp';

/** The screening report's own root (src/components/ScreeningReport.tsx). */
export const SCREENING_REPORT_ID = 'wb-screening-report';

/** The Export button's one name and its line, the same on both sites (core's words). */
export const EXPORT_BUTTON = EXPORT_WORDS.button;
export const EXPORT_HOW = EXPORT_WORDS.hint;

/** Under this width Export goes straight to the report's own tab (rule 22). */
const SMALL_SCREEN_PX = 600;

/**
 * A browser built into an app: Android's web view (`; wv)` or "WebView"), the in-app browsers of the large chat
 * and social apps, which name themselves, and a desktop app's own browser (Electron). Read from the browser's
 * own name for itself; a browser that hides it is treated as a full one, and core's print part still catches a
 * print window that never opens.
 */
const BUILT_IN = /; wv\)|\bWebView\b|FBAN|FBAV|Instagram|LinkedInApp|Line\/|MicroMessenger|Snapchat|Electron\//;

/** True where Export should open the report in its own tab rather than the print window (rule 22). */
export function opensInTab(): boolean {
  return window.innerWidth < SMALL_SCREEN_PX || BUILT_IN.test(navigator.userAgent);
}

/** What the site says when it chose the tab itself (rule 22). Core holds no words for it yet. */
const TAB_CHOSEN =
  'The report is open in its own tab, where your browser’s print or share menu can reach it. Choose “Save as PDF” there.';

export type ScreeningExport = ExportOutcome | 'tab-chosen' | 'missing';

/** What the site says after an export, in core's words where core has them. Empty when it printed. */
export function exportSaid(outcome: ScreeningExport): string {
  if (outcome === 'tab-chosen') return TAB_CHOSEN;
  if (outcome === 'in-tab') return EXPORT_WORDS.inTab;
  if (outcome === 'failed' || outcome === 'missing') return EXPORT_WORDS.failed;
  return '';
}

/**
 * Exports the screening report from the visitor's own click, and resolves to what really happened. "missing" only if
 * the report is not on the page, which the site never shows a button for.
 */
export async function printScreeningReport(): Promise<ScreeningExport> {
  const report = document.getElementById(SCREENING_REPORT_ID);
  if (!report) return 'missing';
  window.dispatchEvent(new Event(REPORT_STAMP_EVENT));
  if (opensInTab()) return openReportInTab(report) ? 'tab-chosen' : 'failed';
  return printReport(report);
}
