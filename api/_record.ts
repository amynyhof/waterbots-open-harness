/**
 * WHAT THE BROWSER CARRIES ABOUT THE PROJECT, read on the server — the visit and Phoebe's worksheet, for the relays of
 * Wellington, Phoebe and Bridget.
 *
 * THE VISIT IS READ ON TO CORE'S RECORD (26 Nov 2026, core 0.4.0). The browser sends the visitor's own words about the
 * project; each is read here through core's one fact check (`addGivenFacts`) on to a new record (`newProjectRecord`),
 * so a value off core's lists, a text too long or a count out of range is left out whole, never cut and never guessed.
 * The agents' packages read that record. Nobody is asked for a kind or a class: the source, the treatment and whether
 * the water is safe cross as plain facts, and core works out the rest.
 *
 * THE WORKSHEET IS READ AGAINST HER TOOL FILES. A row, a state, a route or a sorting word that is not on her package's
 * lists is dropped. What Phoebe found is worked out from the rows, by her package's own reads, never from her sentences.
 *
 * Nothing here is stored. The visit still ends with the page.
 */

import { readKindFacts } from '@waterbots/core/projectKinds';
import { addGivenFacts, newProjectRecord, PROJECT_STAGES, PROJECT_TYPE_IDS, type GivenFacts, type ProjectRecord } from '@waterbots/core/record';
import {
  HER_PACKS,
  PATHWAY_STATE_IDS,
  ROW_STATE_IDS,
  classFor,
  contextFor,
  pathwayState,
  readiness,
  section,
  stateOf,
  verdictRows,
  type RowStatus,
  type Sheet,
} from '@waterbots/phoebe';
import { readServed, type FoundPathway } from '@waterbots/wellington';

/** The longest sentence a row may carry, as core's record holds it. */
export const MAX_BECAUSE_CHARS = 500;

function text(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

/**
 * The visit as the browser carries it, on to core's record. Null when it holds nothing. Each fact counts as said to
 * Wellington, where the visitor gave it; core's check decides what is kept.
 */
export function readCarried(value: unknown): ProjectRecord | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const given: GivenFacts = { ...readKindFacts(v.kindFacts) };
  const does = text(v.does);
  const name = text(v.name);
  const place = text(v.place);
  const type = PROJECT_TYPE_IDS.find((id) => id === v.type);
  const stage = PROJECT_STAGES.find((id) => id === v.stage);
  const served = readServed(v.served);
  if (does) given.does = does;
  if (name) given.name = name;
  if (place) given.placeWords = place;
  if (type) given.type = type;
  if (stage) given.stage = stage;
  if (served) given.population = { served: served.count, mode: served.unit };
  if (Object.keys(given).length === 0) return null;
  const record = addGivenFacts(newProjectRecord(), 'wellington', given).record;
  /* A fact Phoebe's readings rest on changed since she worked them out (core 0.5.0): her turn reads it from her part of the
     record, and works every reading out again. Only exactly `true` counts. */
  if (v.factsChanged === true) record.agents.phoebe = { ...record.agents.phoebe, factsChanged: true };
  return record;
}

/**
 * Her worksheet off a request body, held to her tool files, or null when nothing usable came. A row that is not in its
 * pack, a state off the list, a sentence over the limit or a route the row does not have is dropped.
 */
export function readSheet(value: unknown): Sheet | null {
  if (!Array.isArray(value)) return null;
  const sheet: Sheet = { rows: {}, sorts: {} };
  for (const raw of value) {
    if (typeof raw !== 'object' || raw === null) continue;
    const entry = raw as Record<string, unknown>;
    const pack = typeof entry.pack === 'string' ? entry.pack : '';
    const found = section(pack);
    if (!found) continue;
    const rows: Record<string, RowStatus> = {};
    for (const rawRow of Array.isArray(entry.rows) ? entry.rows : []) {
      if (typeof rawRow !== 'object' || rawRow === null) continue;
      const r = rawRow as Record<string, unknown>;
      const id = typeof r.id === 'string' ? r.id : '';
      const row = found.rows.find((candidate) => candidate.id === id);
      if (!row || rows[id]) continue;
      const state = [...ROW_STATE_IDS, ...PATHWAY_STATE_IDS].find((s) => s === r.state);
      if (!state) continue;
      const because = text(r.because);
      if (because.length > MAX_BECAUSE_CHARS) continue;
      const routes = Array.isArray(r.routes) ? r.routes.filter((rid): rid is string => typeof rid === 'string' && row.routes.includes(rid)) : [];
      rows[id] = { state: state as RowStatus['state'], ...(because ? { because } : {}), ...(routes.length ? { routes } : {}) };
    }
    const sorts = Array.isArray(entry.sorts)
      ? entry.sorts.filter(
          (word): word is string =>
            typeof word === 'string' && word !== 'all' && (found.appliesTo.some((w) => w.id === word) || found.versionFlags.some((w) => w.id === word))
        )
      : [];
    sheet.rows[pack] = rows;
    sheet.sorts[pack] = sorts;
  }
  return Object.keys(sheet.rows).length ? sheet : null;
}

/** Each pathway's plain name, as Wellington says it. */
const PATHWAY_NAME: Record<string, string> = { water: 'Water benefits', carbon: 'Carbon credits' };

/** Her package's read, in rule 14's three words. */
const READ_WORD = { 'likely-eligible': 'likely', 'not-enough-known': 'more to learn', 'likely-not': 'unlikely' } as const;

/**
 * WHAT PHOEBE FOUND, for Wellington's package (`FoundPathway`): each pathway's read, and the rows behind it by id and by
 * the title in her tool file. Worked out from the rows by her package's own reads; never her sentences. Null while she
 * has looked at nothing.
 */
export function foundPathways(sheet: Sheet | null, record: ProjectRecord | null): FoundPathway[] | null {
  if (!sheet) return null;
  const gsClass = record ? classFor(record) : '';
  const out: FoundPathway[] = [];
  for (const pack of HER_PACKS) {
    const part = section(pack);
    if (!part || !sheet.rows[pack]) continue;
    const context = contextFor(sheet, pack, gsClass);
    const rows = verdictRows(pack, context);
    const looked = rows.some((row) => stateOf(sheet, pack, row.id).state !== 'unchecked');
    const titled = (ids: string[]) => ids.map((id) => ({ id, title: rows.find((row) => row.id === id)?.title ?? id }));
    const name = PATHWAY_NAME[part.sectionId] ?? part.sectionName;
    if (pathwayState(sheet, pack, context) === 'does-not-apply') {
      out.push({ name, read: 'does not apply', looked: true, blocked: [], open: [] });
      continue;
    }
    out.push({
      name,
      read: READ_WORD[readiness(sheet, pack, context)],
      looked,
      blocked: titled(rows.filter((row) => stateOf(sheet, pack, row.id).state === 'blocked').map((row) => row.id)),
      open: titled(rows.filter((row) => !['met', 'blocked'].includes(stateOf(sheet, pack, row.id).state)).map((row) => row.id)),
    });
  }
  return out.some((p) => p.looked) ? out : null;
}
