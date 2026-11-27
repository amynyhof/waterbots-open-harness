/**
 * THE SCREENING REPORT EXPORT (S21), and its honest fallback (the shared console
 * page of 26 Nov 2026, rule 13). Moved out of App.tsx in family 4.
 */

/**
 * Prints the screening report and nothing else (S21). The page is marked while
 * it prints, so Calvin's own report, from the open core, stays out of it
 * (src/styles/base.css). The mark comes off when printing ends.
 */
export function printScreeningReport(onNoWindow?: (outcome: NoWindow) => void): void {
  const body = document.body;
  let ended = false;
  const done = () => {
    ended = true;
    body.classList.remove('wb-print-screening');
    window.removeEventListener('afterprint', done);
  };
  body.classList.add('wb-print-screening');
  window.addEventListener('afterprint', done);
  const started = performance.now();
  window.print();
  /* AN HONEST FALLBACK (the shared console page of 26 Nov 2026, rule 13). A
     browser that shows a print window holds here until it closes. One built
     into an app returns at once and, at once or a moment later, says printing
     is over, having shown nothing: then the report opens in its own tab, and the
     site says so. A phone's print sheet also returns at once, but says it is over
     only when the visitor closes it, so it is left alone. The check comes within
     the time a browser still counts as the visitor's click, so the tab may open. */
  if (performance.now() - started >= NO_WINDOW_MS) return;
  window.setTimeout(() => {
    if (ended) onNoWindow?.(openReportInOwnTab() ? 'own-tab' : 'blocked');
  }, ENDED_WITHIN_MS);
}

/** A print call back in under this opened no window that held the page. */
const NO_WINDOW_MS = 150;
/** Printing said to be over by this, after such a quick return, means no window was shown. */
const ENDED_WITHIN_MS = 250;

export type NoWindow = 'own-tab' | 'blocked';

/**
 * The screening report as a page of its own, in a new tab, styled as it prints,
 * where the browser's own Print and "Save as PDF" can reach it. False when the
 * browser opens no tab either.
 */
function openReportInOwnTab(): boolean {
  const report = document.querySelector('.wb-report');
  if (!report) return false;
  const tab = window.open('', '_blank');
  if (!tab) return false;
  const styles = [...document.querySelectorAll('style, link[rel="stylesheet"]')]
    .map((node) => (node instanceof HTMLLinkElement ? `<link rel="stylesheet" href="${node.href}">` : node.outerHTML))
    .join('');
  tab.document.open();
  tab.document.write(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Screening report</title>${styles}` +
      `<style>body{background:#ffffff;margin:0}.wb-report{display:block!important;max-width:7.5in;margin:24px auto;padding:0 16px}.wb-own-tab-note{max-width:7.5in;margin:24px auto 0;padding:0 16px;font-family:var(--font-sans);font-size:14px;color:var(--ink-2)}@media print{.wb-own-tab-note{display:none}}</style>` +
      `</head><body class="wb-print-screening"><p class="wb-own-tab-note">${OWN_TAB_HOW}</p>${report.outerHTML}</body></html>`,
  );
  tab.document.close();
  return true;
}

/** The Export button's words, the same everywhere it shows (rule 13). */
export const EXPORT_HOW = 'Choose “Save as PDF” in the print window to keep a file.';

/** The line at the top of the report's own tab. */
const OWN_TAB_HOW = 'To keep a file, use your browser’s Print, then choose “Save as PDF”.';

/** What the site says after an export that opened no print window. Plain, and true. */
export const EXPORT_SAID: Record<NoWindow, string> = {
  'own-tab':
    'This browser did not open a print window, so the report opened in its own tab. Use the browser’s Print there and choose “Save as PDF”.',
  blocked:
    'This browser did not open a print window or a new tab, so the report could not be saved here. Open this page in Chrome, Edge, Safari or Firefox and try again.',
};
