/**
 * THE SHARED PROJECT RECORD AND THE AGENT MAP, on this site — J3 and J4, 23 Nov 2026.
 *
 * ONE RECORD FOR ONE PROJECT, in the open core's shape (@waterbots/core/record). It is worked out from what
 * the shell already holds, the visit and Phoebe's worksheet, every time either changes. Nothing is kept from
 * before, so a fact that changes changes every reading with it (RULINGS.md, section 4), and no two places can
 * hold a fact differently. Nothing here is stored; the visit still ends with the page.
 *
 * WHO ADDS WHAT (agent rule 10).
 *   - Wellington: the name, the technology in this site's own label, people or households served, the country.
 *   - Phoebe: each pathway's reading, with its reason and what would change it; whether the project is already
 *     credited under the carbon method's V1.0; the class, where her own test settled it and the record had none.
 *   - Bridget: the pinned basin, in her own part.
 *   - Calvin: his V2.0 figure. Violet: the access level and the water before the project, her inputs, her figure.
 *
 * THE CODES ARE CORE'S, NEVER GUESSED. A technology label is turned into the record's code by core's one label
 * list (`technologyCode`), for the two classes this site counts; see THE SITE'S GUARD below. A label the list does
 * not know gets no code.
 *
 * THE MAP IS CORE'S (@waterbots/core/agentMap). It says who is called, which method applies and the one next
 * step. This file adds one thing only. Core's map knows four funding pathways and this site reads two, so the
 * two nobody reads here are taken out of the map's question; see `siteMap`.
 */

import { agentMap, PATHWAYS, type AgentCall, type AgentMap } from '@waterbots/core/agentMap';
import {
  addGivenFacts,
  emptyRecord,
  setAgentResults,
  type AgentId,
  type PathwayReading,
  type ProjectRecord,
  type Source,
} from '@waterbots/core/record';
import type { StandardId } from '@waterbots/core/standards';
import { technologyCode } from '@waterbots/core/technologyLabels';
import { addVioletFacts, addVioletResults, violetGivenFacts } from '@waterbots/violet';
import type { D3Input, D3Result } from '@waterbots/violet/engine';
import { GS4GG_CALCULATOR_VERSION } from '@waterbots/calvin/engine';
import { countryIsoFor } from './calvinProject';
import { cardFor, routeFor } from './phoebeCards';
import { DRINKING_WATER_TYPE, GS_CLASS_IDS, projectType } from './projectTypes.generated';
import type { Surface } from './surfaces';
import { phoebeDone, type CarbonFigure, type Visit, type VisitContext } from './visit';
import { HER_PACKS, pathwayRows, section, verdictRows } from './worksheet.generated';
import { contextFor, packDone, pathwayState, readiness, stateOf, touched, type Sheet } from './worksheetState';

/** The funding pathway each section of Phoebe's worksheet is, in core's word. */
const PATHWAY_OF: Record<string, StandardId> = { water: 'vwba', carbon: 'carbon' };

/** The pathways this site reads: one for each pack Phoebe works. */
export const READ_HERE: readonly StandardId[] = HER_PACKS.map((pack) => PATHWAY_OF[section(pack)?.sectionId ?? '']).filter(
  (p): p is StandardId => p !== undefined
);

/** The pathway one of Phoebe's packs is. */
export function pathwayForPack(pack: string): StandardId | undefined {
  return PATHWAY_OF[section(pack)?.sectionId ?? ''];
}

/** The pack behind a pathway, or undefined when this site reads none for it. */
export function packFor(pathway: StandardId): string | undefined {
  return HER_PACKS.find((pack) => PATHWAY_OF[section(pack)?.sectionId ?? ''] === pathway);
}

/* --------------------------------------------------------------------------
   The technology, in this site's label and core's code.
   -------------------------------------------------------------------------- */

/** The class the project has: the record's, or the one Phoebe's own test settled where the record has none. */
export function classOf(context: Pick<VisitContext, 'type' | 'gsClass'>, sheet: Sheet): { id: string; by: 'wellington' | 'phoebe' } | null {
  if (context.gsClass) return { id: context.gsClass, by: 'wellington' };
  if (context.type && context.type !== DRINKING_WATER_TYPE) return null;
  for (const pack of HER_PACKS) {
    const words = section(pack)?.appliesTo.map((w) => w.id) ?? [];
    const settled = (sheet.sorts[pack] ?? []).find((word) => words.includes(word));
    const id = settled === undefined ? undefined : GS_CLASS_IDS.find((c) => c.toLowerCase() === settled);
    if (id) return { id, by: 'phoebe' };
  }
  return null;
}

/**
 * THE SITE'S GUARD, the maintainer's ruling of 23 Nov 2026: "Do not count it. I need to ask the experts." Core 0.2.0's
 * list turns community level water treatment into a community supply. This site counts the classes it counted before
 * that list and no others, so a class off this pair gets no code and no carbon figure.
 *
 * TO REMOVE IT, once core's list is fixed: delete this constant and its two uses in `technologyOf`.
 */
const COUNTED_CLASSES: readonly string[] = ['CWS', 'HWT'];

/**
 * Core's code for one of this site's labels. The Gold Standard classes' full names end in "technologies"
 * ("Community water supply technologies"), and core's list holds two of the four without that word, so the
 * label is looked up whole first and then without it. Both lookups are core's one list; no code is typed here.
 */
export function codeFor(label: string): ReturnType<typeof technologyCode> {
  return technologyCode(label) ?? technologyCode(label.replace(/ technologies$/i, ''));
}

/** The technology as the record holds it: the label the visitor's record shows, and core's code for it. */
export function technologyOf(context: Pick<VisitContext, 'type' | 'gsClass'>, sheet: Sheet): { label: string; code?: 'CWS' | 'HWT'; by: 'wellington' | 'phoebe' } | null {
  const found = classOf(context, sheet);
  if (found) {
    const label = projectType(found.id)?.name;
    if (label) {
      const code = COUNTED_CLASSES.includes(found.id) ? codeFor(label) : undefined;
      return { label, ...(code ? { code } : {}), by: found.by };
    }
  }
  const label = context.type ? projectType(context.type)?.name : undefined;
  if (!label) return null;
  /* A type alone never gave a code on this site, and does not now. */
  const code = COUNTED_CLASSES.includes(context.type) ? codeFor(label) : undefined;
  return { label, ...(code ? { code } : {}), by: 'wellington' };
}

/**
 * The label of a project Calvin does not cover, for his screen to say so; undefined when he covers it, or when the
 * visitor has not said enough yet (nothing, or a drinking-water project whose class is still blank).
 */
export function uncoveredLabel(record: ProjectRecord): string | undefined {
  const technology = record.facts.technology;
  if (!technology || technology.code !== undefined) return undefined;
  return technology.label === projectType(DRINKING_WATER_TYPE)?.name ? undefined : technology.label;
}

/** Whether Phoebe's own test says the project already earns credits under V1.0; undefined until it is settled. */
export function creditedUnderV1(sheet: Sheet): boolean | undefined {
  const sorts = Object.values(sheet.sorts).flat();
  if (sorts.includes('transitioning')) return true;
  if (sorts.includes('new')) return false;
  return undefined;
}

/* --------------------------------------------------------------------------
   Each pathway's reading, with its reason and what would change it.
   -------------------------------------------------------------------------- */

/** The card's title for a row, or its tool-file title. */
function titleOf(pack: string, row: { id: string; card: string; title: string }): string {
  return cardFor(pack, row.card)?.title ?? row.title;
}

/** Up to four titles, then how many more there are. */
function listed(titles: string[]): string {
  return titles.length <= 4 ? titles.join('; ') : `${titles.slice(0, 4).join('; ')}; and ${titles.length - 4} more`;
}

/** "Asked by Phoebe": her rows and the pack's version, for the reading's source. */
function sourceOf(pack: string): Source {
  return { by: 'phoebe', note: `Worked out from her worksheet rows, ${section(pack)?.sectionName ?? pack}, pack ${pack} ${section(pack)?.version ?? ''}`.trim() };
}

/**
 * One pathway's reading, or undefined while Phoebe is still on it.
 *
 * Unlikely as soon as a test says the path does not apply or a row is Blocked. Likely once every row she asks is
 * Met. More to learn once her part is done and some of it is still open. Until then there is no reading: an
 * absence is never one.
 */
export function pathwayReading(pack: string, sheet: Sheet, gsClass: string, herPartDone: boolean): PathwayReading | undefined {
  const context = contextFor(sheet, pack, gsClass);
  const source = sourceOf(pack);
  const stops = [
    ...pathwayRows(pack, context).filter((row) => (stateOf(sheet, pack, row.id).state as string) === 'does-not-apply'),
    ...verdictRows(pack, context).filter((row) => stateOf(sheet, pack, row.id).state === 'blocked'),
  ];
  if (pathwayState(sheet, pack, context) === 'does-not-apply' || readiness(sheet, pack, context) === 'likely-not') {
    return {
      reading: 'unlikely',
      reason: stops
        .map((row) => {
          const because = stateOf(sheet, pack, row.id).because;
          return because ? `${titleOf(pack, row)}: ${because}` : `${titleOf(pack, row)}.`;
        })
        .join(' '),
      wouldChange: `A different answer on: ${listed(stops.map((row) => titleOf(pack, row)))}.`,
      source,
    };
  }
  if (readiness(sheet, pack, context) === 'likely-eligible') {
    return {
      reading: 'likely',
      reason: 'Every question Phoebe asks about it here is in place.',
      wouldChange: 'A different answer to any of those questions.',
      source,
    };
  }
  if (!packDone(sheet, pack, context) && !herPartDone) return undefined;
  const rows = verdictRows(pack, context);
  const fixable = rows.filter((row) => stateOf(sheet, pack, row.id).state === 'fixable');
  const open = rows.filter((row) => ['unknown', 'unchecked'].includes(stateOf(sheet, pack, row.id).state));
  const met = rows.length - fixable.length - open.length;
  const routes = [...new Set(fixable.flatMap((row) => stateOf(sheet, pack, row.id).routes ?? []))]
    .map((id) => routeFor(pack, id)?.title)
    .filter((t): t is string => t !== undefined);
  const missing = open.map((row) => titleOf(pack, row));
  return {
    reading: 'more to learn',
    reason: touched(sheet, pack, context) === 0 ? 'Phoebe has not asked about it yet.' : `${met} of ${rows.length} questions are in place so far.`,
    wouldChange: [
      missing.length ? `Finding out: ${listed(missing)}.` : '',
      fixable.length ? `Fixing: ${listed(routes.length ? routes : fixable.map((row) => titleOf(pack, row)))}.` : '',
    ]
      .filter(Boolean)
      .join(' '),
    ...(missing.length ? { missing } : {}),
    source,
  };
}

/* --------------------------------------------------------------------------
   The record.
   -------------------------------------------------------------------------- */

export interface RecordInput {
  visit: Visit;
  sheet: Sheet;
  /** Calvin's V2.0 figure, once his screen shows it. */
  carbon?: CarbonFigure | null;
}

/** The shared project record, worked out from the visit and the worksheet as they stand. */
export function projectRecord({ visit, sheet, carbon = null }: RecordInput): ProjectRecord {
  const { context } = visit;
  let record = emptyRecord();

  /* WELLINGTON. What the visitor told him counts as a question he asked; what they typed themselves does not. */
  const typed: Source = { by: 'person', note: 'typed on the project card' };
  const name = context.name.trim();
  const country = context.provenance.place === 'pin' ? null : countryIsoFor(context.place);
  if (name && context.provenance.name === 'typed') record.facts.name = name;
  if (country && context.provenance.place === 'typed') record.place.country = { value: country, source: typed };
  const technology = technologyOf(context, sheet);
  record = addGivenFacts(record, 'wellington', {
    ...(name ? { name } : {}),
    ...(technology?.by === 'wellington' ? { technology: { label: technology.label, ...(technology.code ? { code: technology.code } : {}) } } : {}),
    ...(context.served ? { population: { mode: context.served.unit, served: context.served.count } } : {}),
    ...(country ? { country } : {}),
  }).record;
  record = setAgentResults(record, 'wellington', {
    inputs: { does: context.does.trim(), type: context.type, gsClass: context.gsClass, stage: context.stage, place: context.place.trim() },
  });

  /* PHOEBE. */
  const credited = creditedUnderV1(sheet);
  record = addGivenFacts(record, 'phoebe', {
    ...(technology?.by === 'phoebe' ? { technology: { label: technology.label, ...(technology.code ? { code: technology.code } : {}) } } : {}),
    ...(credited !== undefined ? { creditedUnderV1: credited } : {}),
  }).record;
  /* Her part is done by the rule her own screen keeps (phoebeDone, src/lib/visit.ts). */
  const done = phoebeDone(visit, sheet);
  for (const pack of HER_PACKS) {
    const pathway = PATHWAY_OF[section(pack)?.sectionId ?? ''];
    const read = pathway ? pathwayReading(pack, sheet, context.gsClass, done) : undefined;
    if (pathway && read) record.pathways[pathway] = read;
  }
  record = setAgentResults(record, 'phoebe', {
    inputs: { rows: sheet.rows, sorts: sheet.sorts },
    done: READ_HERE.every((p) => record.pathways[p] !== undefined),
  });

  /* BRIDGET. Core's record has no field for a basin yet, so it is her own part, as the map handed it over. */
  if (visit.pin) record = setAgentResults(record, 'bridget', { inputs: { basin: visit.pin }, done: true });

  /* CALVIN. The figure is his engine's; this file only writes it down. */
  if (carbon) {
    record = setAgentResults(record, 'calvin', {
      estimate: { figure: carbon.er, unit: 'tCO₂e a year', method: carbon.version === 'paa' ? 'carbon-v2.0' : 'carbon-v1.0', engineVersion: GS4GG_CALCULATOR_VERSION },
      done: true,
    });
  }

  /* VIOLET, by her own package's helpers. */
  if (visit.water) {
    const input = visit.water.input as unknown as D3Input;
    const result = visit.water.result as unknown as D3Result;
    record = addVioletFacts(record, { ...violetGivenFacts(input), population: undefined }).record;
    record = addVioletResults(record, { input, result, done: result.vwbM3PerYear !== null });
  }
  return record;
}

/* --------------------------------------------------------------------------
   The map.
   -------------------------------------------------------------------------- */

/** The agent behind each step, so a step the visitor has been to counts as an agent they have met. */
const AGENT_AT: Record<Surface, AgentId> = { desk: 'wellington', eligibility: 'phoebe', map: 'bridget', quantification: 'calvin', water: 'violet' };

export function metFrom(reached: ReadonlySet<Surface>): AgentId[] {
  return [...reached].map((s) => AGENT_AT[s]);
}

/**
 * Core's map, read for this site.
 *
 * CORE'S MAP ASKS ABOUT FOUR PATHWAYS AND PHOEBE READS TWO HERE. Left as it is, the map would wait for two
 * readings that can never come: she would be called for ever, and "no pathway forward" could never be worked
 * out. So the map is asked with those two out of play, and they are taken back out of its answer. They are
 * never written to the record and never shown: this site has no reading of them.
 */
export function siteMap(record: ProjectRecord, met: readonly AgentId[] = []): AgentMap {
  const asked: ProjectRecord = { ...record, pathways: { ...record.pathways } };
  for (const pathway of PATHWAYS) {
    if (READ_HERE.includes(pathway)) continue;
    asked.pathways[pathway] = { reading: 'unlikely', reason: '', wouldChange: '', source: { by: 'site intake', note: 'not read on this site' } };
  }
  const map = agentMap({ place: 'free-site', record: asked, met });
  return {
    ...map,
    pathways: map.pathways.filter((p) => READ_HERE.includes(p.pathway)),
    tellVisitor: map.tellVisitor.filter((t) => READ_HERE.includes(t.pathway)),
  };
}

/** One agent's call on the map. */
export function callOf(map: AgentMap, agent: AgentId): AgentCall {
  const call = map.agents.find((c) => c.agent === agent);
  if (!call) throw new Error(`The agent map has no entry for ${agent}.`);
  return call;
}

/**
 * Whether the map closes an agent's desk: their pathway reads unlikely, or no pathway goes forward. An agent
 * whose turn has not come yet is not closed: we are guides, not gates, and the visitor may open the desk early.
 */
export function closedBy(map: AgentMap, agent: AgentId): boolean {
  const call = callOf(map, agent);
  return !call.called && (call.because === 'pathway unlikely' || call.because === 'no pathway forward');
}

/** Each pathway's plain name, as the screens say it. */
export const PATHWAY_NAME: Partial<Record<StandardId, string>> = { vwba: 'Water benefits', carbon: 'Carbon credits' };

/**
 * The map as Wellington's relay reads it: codes and the card titles in "what would change it". Never Phoebe's
 * own sentences (docs/modules/wellington.md), which stay in the record's reasons.
 */
export interface MapForWellington {
  next: string;
  agent?: string;
  facts?: string[];
  called: string[];
  closed: string[];
  readings: { pathway: string; reading: string; wouldChange?: string }[];
  transitioning: boolean;
}

export function mapForWellington(record: ProjectRecord, map: AgentMap): MapForWellington {
  return {
    next: map.next.step,
    ...(map.next.step === 'call' ? { agent: map.next.agent } : {}),
    ...(map.next.step === 'gather facts' ? { facts: [...map.next.facts] } : {}),
    called: map.agents.filter((c) => c.called).map((c) => c.agent),
    closed: map.agents.filter((c) => closedBy(map, c.agent)).map((c) => c.agent),
    readings: map.pathways.flatMap((p) =>
      p.reading === null ? [] : [{ pathway: p.pathway, reading: p.reading, ...(record.pathways[p.pathway]?.wouldChange ? { wouldChange: record.pathways[p.pathway]!.wouldChange } : {}) }]
    ),
    transitioning: record.facts.creditedUnderV1?.value === true,
  };
}
