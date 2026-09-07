/**
 * The project record, carried from the desk to Phoebe.
 *
 * SLICE 3 OF THE DESK PLAN, 7 Sep 2026 — Phoebe's row closes the loop. What
 * Wellington learned at the desk, or the visitor typed on the rail — what the
 * project does, what kind, where it is, what it is called — travels with each
 * of Phoebe's requests, so nobody says it twice. Her verdicts already come
 * back the other way, through the criteria to her row on the desk.
 *
 * WHAT CROSSES IS THE VISITOR'S OWN WORDS AND NOTHING ELSE. Never a verdict,
 * never a figure, never the desk conversation's turns — the same line the
 * bridge (item S7) draws. It is checked here and nowhere else: strings only,
 * each field capped at the length the desk already caps it at, the kind from
 * the closed set. A field that is too long is dropped whole rather than cut,
 * because a cut sentence is not the visitor's sentence.
 *
 * This file imports nothing so the check scripts can load it plain.
 */

export type RecordKind = 'water' | 'carbon' | 'unsure';

export interface ProjectRecord {
  does: string;
  kind: RecordKind | '';
  place: string;
  name: string;
}

/** The desk's own ceiling for "what it does"; place and name are shorter on the rail. */
export const MAX_RECORD_FIELD_CHARS = 280;

/** The heading Phoebe's prompt names, so she knows the block when she sees it. */
export const RECORD_HEADING = 'What the visitor has already told Wellington';

const KINDS: readonly RecordKind[] = ['water', 'carbon', 'unsure'];

function field(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed.length > MAX_RECORD_FIELD_CHARS ? '' : trimmed;
}

/**
 * Read a record off a request body. Null when there is nothing usable, which
 * is the ordinary case for a visitor who went straight to Phoebe.
 */
export function readRecord(value: unknown): ProjectRecord | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  const kind = KINDS.find((k) => k === v.kind) ?? '';
  const record: ProjectRecord = {
    does: field(v.does),
    kind,
    place: field(v.place),
    name: field(v.name),
  };
  if (!record.does && !record.kind && !record.place && !record.name) return null;
  return record;
}

/** The kinds in the words the desk uses for them. */
const KIND_WORDS: Record<RecordKind, string> = {
  water: 'a benefit to water in a river basin — a water project',
  carbon: 'safe drinking water that stops people boiling — treated here as a carbon project',
  unsure: 'not sure yet, in the visitor’s own words',
};

/**
 * The block as Phoebe reads it: only the fields that were said, and a plain
 * line saying what the block is and is not.
 */
export function recordBlock(record: ProjectRecord): string {
  const lines: string[] = [];
  if (record.does) lines.push(`- What it does: ${record.does}`);
  if (record.kind) lines.push(`- What kind: ${KIND_WORDS[record.kind]}`);
  if (record.place) lines.push(`- Where it is: ${record.place}`);
  if (record.name) lines.push(`- What it is called: ${record.name}`);
  return [
    `# ${RECORD_HEADING}`,
    '',
    'These are the visitor’s own words about their project, carried from the desk so they need not say them twice. They are facts about the project and never a verdict on any criterion; only the cards decide that. Start from them, do not ask again for what is here, and ask for what is missing.',
    '',
    ...lines,
  ].join('\n');
}
