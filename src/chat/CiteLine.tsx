/**
 * Level 2, and the end of a citation on this site.
 *
 * ONE LINE AND NOTHING MORE — source · version · section · page → canonical
 * link. CITATIONS.md fixes both the contents and the order. There is no Level 3
 * here: the pop-out with a verbatim source-text tab is a paid-platform feature
 * (OPEN_ITEMS.md S3), and this repository holds no verbatim source text to put
 * in one.
 *
 * EVERY VALUE COMES FROM A COMMITTED CARD FILE, by way of the agent's adapter.
 * The agent supplied a number and nothing else.
 */

import type { Evidence } from './evidence';

export default function CiteLine({ item, id }: { item: Evidence; id?: string }) {
  const { citation } = item;

  return (
    <div className="wb-cite-line" id={id} title={citation.full}>
      <span>{citation.document}</span>
      <span aria-hidden="true">·</span>
      <span>{citation.version}</span>
      <span aria-hidden="true">·</span>
      <span>{citation.section}</span>
      <span aria-hidden="true">·</span>
      <span>{citation.page}</span>
      <a className="wb-cite-link" href={citation.href} target="_blank" rel="noopener noreferrer">
        Source
        <span className="wb-cite-ext" aria-hidden="true">
          ↗
        </span>
      </a>
    </div>
  );
}

/**
 * The honest note for a rule that rests on figures.
 *
 * CITATIONS.md: a number-dense passage is sent to the source rather than
 * paraphrased into prose that reads as precise and is not.
 */
export function DataTableNote() {
  return (
    <p className="t-caption" style={{ margin: '4px 0 0', color: 'var(--ink-3)' }}>
      This rule rests on a data table. Read it at the source rather than from a summary.
    </p>
  );
}
