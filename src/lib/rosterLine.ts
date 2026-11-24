/**
 * A seat's job line, read from the one crew list — knowledge-packs/product-shared/roster.yaml, carried from
 * the paid site and never edited here. The crew list is the source of Violet's seat word and job line (the
 * maintainer's word of 23 Nov 2026, J5), so the line is read, never typed again. The seat word itself is held
 * to the list by scripts/check-roster.mjs.
 *
 * It reads one line of one seat and no more, and it throws rather than showing an empty line.
 */

import rosterRaw from '../../knowledge-packs/product-shared/roster.yaml?raw';

const ROSTER = rosterRaw.replace(/\r\n/g, '\n');

export function rosterJob(id: string): string {
  const from = ROSTER.indexOf(`\n  - id: ${id}\n`);
  const seat = from === -1 ? '' : ROSTER.slice(from + 1).split(/\n  - id: /)[0];
  const job = /^    job: (.+)$/m.exec(seat)?.[1]?.trim();
  if (!job) throw new Error(`The crew list has no job line for the seat "${id}".`);
  return job;
}

/** The job line without the phase it opens with ("Quantify. …"), for an agent's own desk. */
export function rosterJobAtDesk(id: string): string {
  return rosterJob(id).replace(/^[A-Z][a-z]+\. /, '');
}
