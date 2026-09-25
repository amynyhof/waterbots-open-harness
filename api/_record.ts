/**
 * The project record, carried from the desk to the agents.
 *
 * SLICE 3 OF THE DESK PLAN, 7 Sep 2026 — Phoebe's row closes the loop. What
 * Wellington learned at the desk, or the visitor typed on the rail — what the
 * project does, its type and stage, where it is, what it is called — travels
 * with each of Phoebe's requests, so nobody says it twice. Her verdicts already come
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
 * each field capped at the length the desk already caps it at, the type, the
 * class and the stage from the closed lists. A field that is too long is
 * dropped whole rather than cut, because a cut sentence is not the visitor's
 * sentence.
 *
 * TYPE, CLASS AND STAGE for "what kind" from 24 Sep 2026, item A16. The type
 * is an id from the shared project-type file; the class rides only beside a
 * drinking-water type; the stage is one of three. Each line the agents read
 * carries the standard's name and its plain sentence, so neither agent has
 * to know an id.
 *
 * This file imports only the generated project-type module, which imports
 * nothing, so the check scripts can still load it plain.
 */

import {
  DRINKING_WATER_TYPE,
  GS_CLASS_IDS,
  PROJECT_STAGES,
  PROJECT_STAGE_IDS,
  PROJECT_TYPE_IDS,
  projectType,
  type GsClassId,
  type ProjectStageId,
  type ProjectTypeId,
} from './_projectTypes.generated.js';
import {
  PATHWAY_STATE_IDS,
  PATHWAY_STATE_LABEL,
  READINESS_LABEL,
  ROW_STATE_IDS,
  ROW_STATE_LABEL,
  pathwayStateOf,
  readinessOf,
  rowsFor,
  section,
  type RowContext,
} from './_worksheet.generated.js';

export interface ProjectRecord {
  does: string;
  type: ProjectTypeId | '';
  gsClass: GsClassId | '';
  stage: ProjectStageId | '';
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
  const type = PROJECT_TYPE_IDS.find((id) => id === v.type) ?? '';
  /* A class is a fact about a drinking-water project and nothing else. */
  const gsClass = type === DRINKING_WATER_TYPE ? (GS_CLASS_IDS.find((id) => id === v.gsClass) ?? '') : '';
  const stage = PROJECT_STAGE_IDS.find((id) => id === v.stage) ?? '';
  const record: ProjectRecord = {
    does: field(v.does),
    type,
    gsClass,
    stage,
    place: field(v.place),
    name: field(v.name),
  };
  if (!record.does && !record.type && !record.stage && !record.place && !record.name) return null;
  return record;
}

/** The field lines, only those that were said. Shared by both blocks. */
function recordLines(record: ProjectRecord): string[] {
  const lines: string[] = [];
  if (record.does) lines.push(`- What it does: ${record.does}`);
  const type = record.type ? projectType(record.type) : undefined;
  if (type) lines.push(`- What type: ${type.name} — ${type.plain}`);
  const gsClass = record.gsClass ? projectType(record.gsClass) : undefined;
  if (gsClass) lines.push(`- Which class of drinking-water project: ${gsClass.name} — ${gsClass.plain}`);
  const stage = record.stage ? PROJECT_STAGES.find((s) => s.id === record.stage) : undefined;
  if (stage) lines.push(`- Stage: ${stage.words} — ${stage.plain}`);
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
    'These are the visitor’s own words about their project, carried from the desk so they need not say them twice. They are facts about the project and never a verdict on any row of your worksheet; only the cards decide that. Start from them, do not ask again for what is here, and ask for what is missing.',
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
      'Every row you ask on this site has a verdict for this visit. Give the read for each pathway, show once the rows that are acted on at later phases, send them back to Wellington on Dispatches with a clear next step, and set handBack to "wellington". Do not leave them with no way on.'
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

/** Stage-only block when the visit has no record fields yet. */
export function stageBlock(stage: ScreeningStage): string {
  return [`# ${VISIT_HEADING}`, '', STAGE_LINES[stage]].join('\n');
}

/* --------------------------------------------------------------------------
   The worksheet, as it stands — contract line 3, item A15, step 3,
   21 Sep 2026, and per pack with five states from 25 Sep 2026.

   Every pack she works travels with every ask: its rows as they stand, its
   pathway state, its version flag where it has one, and the read those rows
   give. Every verdict in it is one she set earlier this visit; the shell holds
   the rows and nobody else writes them. Checked here: a pack and a row id the
   tool files know, a state from the closed list, and the sentence a state
   carries, capped. Anything else is dropped whole.
   -------------------------------------------------------------------------- */

export interface SheetRow {
  id: string;
  state: string;
  because?: string;
  routes?: string[];
}

export interface PackSheet {
  pack: string;
  rows: SheetRow[];
  /** The class and the version, where this pack's own tests have settled them. */
  sorts?: string[];
}

/** The heading Phoebe's prompt names, so she knows the block when she sees it. */
export const WORKSHEET_HEADING = 'What the worksheet shows';

/** A sentence a state carries is a sentence or two, never an essay. */
export const MAX_BECAUSE_CHARS = 500;

/**
 * Read the sheet off a request body. Null when nothing usable came, which is
 * the case for an old client or a caller that is not the console.
 */
export function readSheet(value: unknown): PackSheet[] | null {
  if (!Array.isArray(value)) return null;
  const out: PackSheet[] = [];
  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const entry = raw as Record<string, unknown>;
    const pack = typeof entry.pack === 'string' ? entry.pack : '';
    const found = section(pack);
    if (!found) continue;
    const rows: SheetRow[] = [];
    const seen = new Set<string>();
    if (Array.isArray(entry.rows)) {
      for (const rawRow of entry.rows) {
        if (typeof rawRow !== 'object' || rawRow === null) continue;
        const r = rawRow as Record<string, unknown>;
        const id = typeof r.id === 'string' ? r.id : '';
        if (!id || seen.has(id)) continue;
        const row = found.rows.find((candidate) => candidate.id === id);
        if (!row) continue;
        const state = typeof r.state === 'string' ? r.state : '';
        const known =
          ROW_STATE_IDS.some((s) => s === state) || PATHWAY_STATE_IDS.some((s) => s === state);
        if (!known) continue;
        const because = typeof r.because === 'string' ? r.because.trim() : '';
        if (because.length > MAX_BECAUSE_CHARS) continue;
        const routes = Array.isArray(r.routes)
          ? r.routes.filter((id2): id2 is string => typeof id2 === 'string' && row.routes.includes(id2))
          : [];
        seen.add(id);
        rows.push({
          id,
          state,
          ...(because ? { because } : {}),
          ...(routes.length ? { routes } : {}),
        });
      }
    }
    const sorts = Array.isArray(entry.sorts)
      ? entry.sorts.filter(
          (word): word is string =>
            typeof word === 'string' &&
            word !== 'all' &&
            (found.appliesTo.some((entry2) => entry2.id === word) ||
              found.versionFlags.some((entry2) => entry2.id === word))
        )
      : [];
    out.push({ pack, rows, ...(sorts.length ? { sorts } : {}) });
  }
  return out.length ? out : null;
}

/**
 * What the project is known to be, for sorting which rows it has.
 *
 * Wellington's record carries the class for a drinking-water project; Phoebe's
 * own tests settle it for a visitor who never went through the desk, and settle
 * the version besides. Either fills the same context.
 */
function contextOf(record: ProjectRecord | null, sheet: PackSheet): RowContext {
  const found = section(sheet.pack);
  const sorted = sheet.sorts?.find((word) => found?.appliesTo.some((entry) => entry.id === word));
  const version = sheet.sorts?.find((word) => found?.versionFlags.some((entry) => entry.id === word));
  const gsClass = sorted ?? (record?.gsClass ? record.gsClass.toLowerCase() : '');
  return {
    ...(gsClass ? { gsClass } : {}),
    ...(version ? { versionFlag: version } : {}),
  };
}

function label(state: string): string {
  return ROW_STATE_LABEL[state] ?? PATHWAY_STATE_LABEL[state] ?? state;
}

/**
 * The block as Phoebe reads it: each pack's pathway, its rows with what each
 * state carries, and the read those rows give — so her words and the screen
 * cannot disagree, because both are drawn from the same rows by the same
 * function.
 */
export function worksheetBlock(sheets: PackSheet[], record: ProjectRecord | null): string {
  const parts: string[] = [
    `# ${WORKSHEET_HEADING}`,
    '',
    'Your eligibility worksheet as it stands for this visit. Every verdict below is one you set earlier in this conversation, from what the visitor told you; a row not listed has not been looked at. Start from the first row still unchecked, do not ask again for what a Met row already settled, and when the visitor asks where a row stands, read it from here. The read at the end of each pathway is worked out from these rows, and it is what the screen shows — say it in your own words and never a different one.',
  ];

  for (const sheet of sheets) {
    const found = section(sheet.pack);
    if (!found) continue;
    const context = contextOf(record, sheet);
    const states: Record<string, string> = {};
    for (const row of sheet.rows) states[row.id] = row.state;
    const pathway = pathwayStateOf(sheet.pack, states, context);
    parts.push('', `## ${found.sectionName} — ${PATHWAY_STATE_LABEL[pathway]}`, '');

    const rows = rowsFor(sheet.pack, context).filter((row) => row.asked === 'eligibility');
    for (const row of rows) {
      const held = sheet.rows.find((r) => r.id === row.id);
      if (!held) {
        parts.push(`- ${row.id}: ${ROW_STATE_LABEL.unchecked}.`);
        continue;
      }
      const carried = held.because ? ` — ${held.because}` : '';
      const routes = held.routes?.length ? ` — route${held.routes.length > 1 ? 's' : ''} ${held.routes.join(', ')}` : '';
      parts.push(`- ${row.id}: ${label(held.state)}${carried}${routes}.`);
    }
    for (const word of sheet.sorts ?? []) {
      const isVersion = found.versionFlags.some((entry) => entry.id === word);
      parts.push(`- ${isVersion ? 'Version' : 'Which kind of project'}: ${word}.`);
    }
    parts.push('', `The read from these rows: **${READINESS_LABEL[readinessOf(sheet.pack, states, context)]}**.`);
  }

  return parts.join('\n');
}
