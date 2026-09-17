/**
 * The project record, carried from the desk to the agents.
 *
 * SLICE 3 OF THE DESK PLAN, 7 Sep 2026 — Phoebe's row closes the loop. What
 * Wellington learned at the desk, or the visitor typed on the rail — what the
 * project does, what kind, where it is, what it is called — travels with each
 * of Phoebe's requests, so nobody says it twice. Her verdicts already come
 * back the other way, through the criteria to her row on the desk.
 *
 * WELLINGTON READS THE SAME RECORD from 16 Sep 2026. One reader (`readRecord`),
 * one set of field lines; each agent gets its own block so her "only the cards
 * decide" line never reaches him, and his "already on this visit" line never
 * reaches her. Carried URL facts stamp the visit as chat; he sees them on the
 * first ask because the shell writes a ref before that send.
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

/** The heading Wellington's prompt names, so he knows the visit is already filled. */
export const VISIT_HEADING = 'What this visit already holds';

/** The free screening loop. Console-owned; never read out of prose. */
export type ScreeningStage = 'learn' | 'eligibility' | 'partners' | 'quantify';

const STAGES: readonly ScreeningStage[] = ['learn', 'eligibility', 'partners', 'quantify'];

export function readStage(value: unknown): ScreeningStage | null {
  return STAGES.find((s) => s === value) ?? null;
}

const STAGE_LINES: Record<ScreeningStage, string> = {
  learn: 'Screening step: still learning the project. Ask only for what is missing. When you have enough, invite Eligibility with Phoebe.',
  eligibility: 'Screening step: Eligibility with Phoebe is next. Do not skip to the map.',
  partners:
    'Screening step: Eligibility is done for this visit. Invite the Partners step — the map. Bridget is not answering yet; point at the map. Do not pretend her chat is live.',
  quantify:
    'Screening step: Quantify is next. Calvin is not answering yet; point at the calculator. Do not pretend his chat is live.',
};

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

/** The four field lines, only those that were said. Shared by both blocks. */
function recordLines(record: ProjectRecord): string[] {
  const lines: string[] = [];
  if (record.does) lines.push(`- What it does: ${record.does}`);
  if (record.kind) lines.push(`- What kind: ${KIND_WORDS[record.kind]}`);
  if (record.place) lines.push(`- Where it is: ${record.place}`);
  if (record.name) lines.push(`- What it is called: ${record.name}`);
  return lines;
}

/**
 * The block as Phoebe reads it: only the fields that were said, and a plain
 * line saying what the block is and is not.
 */
export function recordBlock(record: ProjectRecord): string {
  return [
    `# ${RECORD_HEADING}`,
    '',
    'These are the visitor’s own words about their project, carried from the desk so they need not say them twice. They are facts about the project and never a verdict on any criterion; only the cards decide that. Start from them, do not ask again for what is here, and ask for what is missing.',
    '',
    ...recordLines(record),
  ].join('\n');
}

/** Extra visit notes for Phoebe, after the record. Empty when neither applies. */
export function phoebeNotesBlock(notes: { opened?: boolean; eligibilityDone?: boolean }): string | null {
  const extra: string[] = [];
  if (notes.opened) {
    extra.push(
      'The visitor has just opened Eligibility after Wellington invited them. His invite is already on this thread. Greet them, say what your worksheet and knowledge pack are for at screening, and ask if they are ready to work through eligibility. Do not invent a method.'
    );
  }
  if (notes.eligibilityDone) {
    extra.push(
      'Every eligibility criterion on the worksheet has a verdict for this visit. Send them back to Wellington on Dispatches with a clear next step. Do not leave them with no way on.'
    );
  }
  return extra.length ? extra.join('\n\n') : null;
}

/**
 * The block as Wellington reads it: the same fields, his own heading. Those
 * values are already on this visit — do not ask for them again as if blank.
 */
export function visitBlock(record: ProjectRecord | null, stage?: ScreeningStage | null): string {
  const lines = record ? recordLines(record) : [];
  const stageLine = stage ? STAGE_LINES[stage] : '';
  return [
    `# ${VISIT_HEADING}`,
    '',
    'These fields are already on this visit — from the visitor, from a carried link, or from the map pin. Do not ask for them again as if they were blank. Ask only for what is still missing. If this visit already holds the project, do not introduce yourself as if this were a cold start. One next step.',
    '',
    ...lines,
    ...(stageLine ? ['', stageLine] : []),
  ].join('\n');
}

/** Stage-only block when the visit has no does/name/place/kind yet. */
export function stageBlock(stage: ScreeningStage): string {
  return [`# ${VISIT_HEADING}`, '', STAGE_LINES[stage]].join('\n');
}
