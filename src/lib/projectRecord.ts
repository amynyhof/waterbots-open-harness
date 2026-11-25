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
 * list. A label the list does not know, or does not cover yet, gets no code. From core 0.3.0 (25 Nov 2026) that is
 * core's own answer for community level and institutional treatment too, so this site's guard of 23 Nov is gone.
 *
 * THE MAP IS CORE'S (@waterbots/core/agentMap). It says who is called, which method applies, the steps and the one next
 * step. From core 0.3.0 it is told which pathways this site reads and which agents it has, so nothing is taken out of
 * its question any more.
 */

import { agentMap, stepOf, type AgentCall, type AgentMap, type Step } from '@waterbots/core/agentMap';
import {
  addGivenFacts,
  AGENTS,
  emptyRecord,
  needsHomeUse,
  setAgentResults,
  setEligibilitySheet,
  technologyOfFacts,
  type AgentId,
  type GivenFacts,
  type PathwayReading,
  type ProjectRecord,
  type Source,
} from '@waterbots/core/record';
import type { StandardId } from '@waterbots/core/standards';
import { technologyCoverage } from '@waterbots/core/technologyLabels';
import { addVioletFacts, addVioletResults, violetGivenFacts } from '@waterbots/violet';
import type { D3Input, D3Result } from '@waterbots/violet/engine';
import { GS4GG_CALCULATOR_VERSION } from '@waterbots/calvin/engine';
import { countryIsoFor } from './calvinProject';
import { cardFor, routeFor } from './phoebeCards';
import { DRINKING_WATER_TYPE, GS_CLASS_IDS, projectType, type GsClassId } from './projectTypes.generated';
import type { Surface } from './surfaces';
import { nothingLeftToAsk, phoebeDone, type CarbonFigure, type Visit, type VisitContext } from './visit';
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
 * The technology as the record holds it: core's label and code for a drinking-water class or a new supply
 * (`technologyOfFacts`), and the type's own name, with no code, for anything else.
 */
export function technologyOf(context: Pick<VisitContext, 'type' | 'gsClass'>, sheet: Sheet): (NonNullable<GivenFacts['technology']> & { by: 'wellington' | 'phoebe' }) | null {
  const found = classOf(context, sheet);
  const named = technologyOfFacts(found ? DRINKING_WATER_TYPE : context.type || undefined, found?.id as GsClassId | undefined);
  if (named) return { ...named, by: found?.by ?? 'wellington' };
  const label = context.type ? projectType(context.type)?.name : undefined;
  return label ? { label, by: 'wellington' } : null;
}

/** A drinking-water project whose class nobody has said yet: its kind is not known, so nothing can be said about its cover. */
function kindNotSaid(record: ProjectRecord): boolean {
  return record.facts.technology !== undefined && record.facts.technology.code === undefined && record.facts.technology.label === projectType(DRINKING_WATER_TYPE)?.name;
}

/**
 * The label of a project Calvin does not cover, for his screen to say so; undefined when he covers it, or when the
 * visitor has not said enough yet (nothing, or a drinking-water project whose class is still blank).
 */
export function uncoveredLabel(record: ProjectRecord): string | undefined {
  const technology = record.facts.technology;
  if (!technology || technology.code !== undefined || kindNotSaid(record)) return undefined;
  return technology.label;
}

/** The same, where core's list itself says "not covered yet": the label his package and his chat are told. */
export function notCoveredLabel(record: ProjectRecord): string | undefined {
  const label = uncoveredLabel(record);
  return label !== undefined && technologyCoverage(label) === 'not covered yet' ? label : undefined;
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
  const place = context.provenance.place === 'pin' ? '' : context.place.trim();
  record = addGivenFacts(record, 'wellington', {
    ...(name ? { name } : {}),
    ...(context.does.trim() ? { does: context.does.trim() } : {}),
    ...(context.type ? { type: context.type } : {}),
    ...(context.type === DRINKING_WATER_TYPE && context.gsClass ? { technologyClass: context.gsClass } : {}),
    ...(context.stage ? { stage: context.stage } : {}),
    ...(context.homeUse ? { homeUse: context.homeUse } : {}),
    ...(context.served ? { population: { mode: context.served.unit, served: context.served.count } } : {}),
    ...(place ? { placeWords: place } : {}),
    ...(country ? { country } : {}),
  }).record;
  /* The technology is the type and the class said once more, in core's label, so it is not counted as one more question. */
  if (technology?.by === 'wellington') {
    record.facts.technology = { label: technology.label, ...(technology.code ? { code: technology.code } : {}), source: { by: 'person', note: 'given to wellington' } };
  }

  /* PHOEBE. */
  const credited = creditedUnderV1(sheet);
  record = addGivenFacts(record, 'phoebe', {
    ...(technology?.by === 'phoebe' ? { technology: { label: technology.label, ...(technology.code ? { code: technology.code } : {}) } } : {}),
    ...(credited !== undefined ? { creditedUnderV1: credited } : {}),
  }).record;
  /* Her part is done by the rule her own screen keeps (phoebeDone, src/lib/visit.ts), or once she has handed the visitor
     on with a path done or closed, so nobody is sent back to a step she has ended (24 Nov 2026). */
  const done = phoebeDone(visit, sheet) || visit.eligibilityHanded === true;
  for (const pack of HER_PACKS) {
    const pathway = PATHWAY_OF[section(pack)?.sectionId ?? ''];
    const read = pathway ? pathwayReading(pack, sheet, context.gsClass, done) : undefined;
    if (pathway && read) record.pathways[pathway] = read;
  }
  for (const pack of HER_PACKS) record = setEligibilitySheet(record, pack, { rows: sheet.rows[pack] ?? {}, sorts: sheet.sorts[pack] ?? [] });
  record = setAgentResults(record, 'phoebe', {
    /* Her step is ended, for what comes next and who shows: every path has its reading, and nothing is left for her to ask
       or she has handed the visitor on (24 Nov 2026). Her readings keep the rule above. */
    done:
      READ_HERE.every((p) => record.pathways[p] !== undefined) &&
      (visit.eligibilityHanded === true || nothingLeftToAsk(sheet, context.gsClass)),
  });

  /* BRIDGET. The basin, in core's own place for it. Her step is done with a basin, or once she has handed the visitor on
     without one: we are guides, not gates (24 Nov 2026). */
  if (visit.pin) {
    record = addGivenFacts(record, 'bridget', { basin: { id: visit.pin.hybasId, level: visit.pin.level, areaKm2: visit.pin.subAreaKm2, stressLabel: visit.pin.stressLabel } }).record;
  }
  if (visit.pin || visit.partnersDone) record = setAgentResults(record, 'bridget', { done: true });

  /* WHAT THE VISITOR TOLD CALVIN AND VIOLET (src/lib/told.ts). Only a fact the record lacks is added, as core rules. */
  for (const agent of ['calvin', 'violet'] as const) {
    const told = visit.told?.[agent];
    if (told && Object.keys(told).length > 0) record = addGivenFacts(record, agent, told).record;
  }

  /* CALVIN. The figure is his engine's; this file only writes it down. */
  if (carbon) {
    record = setAgentResults(record, 'calvin', {
      estimate: { figure: carbon.er, unit: 'tCO₂e a year', method: carbon.version === 'paa' ? 'carbon-v2.0' : 'carbon-v1.0', engineVersion: GS4GG_CALCULATOR_VERSION },
      /* Opening his calculator ends nothing: a figure the visitor's answers gave does (25 Nov 2026). */
      done: visit.calvinDone === true,
    });
  }

  /* A class his calculator does not cover gives no figure, so his part could never end and the visitor would be sent to
     him for ever. It is ended here with no figure, and Wellington says why (24 Nov 2026). */
  if (!carbon && technology && uncoveredLabel(record)) record = setAgentResults(record, 'calvin', { done: true });

  /* VIOLET, by her own package's helpers. */
  if (visit.water) {
    const input = visit.water.input as unknown as D3Input;
    const result = visit.water.result as unknown as D3Result;
    record = addVioletFacts(record, { ...violetGivenFacts(input), population: undefined }).record;
    record = addVioletResults(record, { input, result, done: result.vwbM3PerYear !== null && visit.violetDone === true });
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
 * Core's map for this site: the two pathways Phoebe reads here, and the five agents this site has.
 *
 * ONE ANSWER IS PUT RIGHT. A drinking-water project whose class nobody has said yet carries its type's own name, which is
 * not on core's label list, and core answers "not covered yet" for a label it does not know. Nobody has said what it is,
 * so the true answer is that the map is waiting for it (reported to the open core, 25 Nov 2026).
 */
export function siteMap(record: ProjectRecord, met: readonly AgentId[] = []): AgentMap {
  const map = agentMap({ place: 'free-site', record, met, reads: READ_HERE, crew: AGENTS });
  if (!kindNotSaid(record)) return map;
  return {
    ...map,
    agents: map.agents.map((c) => (!c.called && c.because === 'not covered yet' ? { ...c, because: 'waiting for basic facts' as const } : c)),
    pathways: map.pathways.map((p) => (p.noMethod === 'not covered yet' ? { ...p, agent: 'violet' as const, noMethod: 'waiting for basic facts' as const } : p)),
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
  return !call.called && (call.because === 'pathway unlikely' || call.because === 'no pathway forward' || noCalculatorFor(map, agent));
}

/**
 * Whether an agent's pathway stays in play and their calculator does not count this kind of project: the map's two
 * reasons of core 0.3.0, "not covered yet" and "another kind of project" (25 Nov 2026).
 */
export function noCalculatorFor(map: AgentMap, agent: AgentId): boolean {
  const call = callOf(map, agent);
  return !call.called && (call.because === 'not covered yet' || call.because === 'another kind of project');
}

/** The same for Violet: water benefits stay in play with no calculator. The sentence is the maintainer's. */
export function waterHasNoCalculator(map: AgentMap): boolean {
  return noCalculatorFor(map, 'violet');
}

/** What the screen says then — the maintainer's own sentence, 25 Nov 2026. Never reworded here. */
export const NO_CALCULATOR_YET =
  'We do not have a calculator for this kind of project yet. To ask for it to be added, contact WaterBots at hello@waterbots.ai.';

/**
 * WHO THE MAP HAS CALLED, for the crew column — the maintainer's ruling of 24 Nov 2026, the shared console behaviours,
 * line 1: the crew shows only the agents the agent map has called, and an agent it has not called yet is hidden.
 *
 * LATER AGENTS WAIT, from core 0.3.0 in the map itself: each is called only once the agent before has finished. Calvin and
 * Violet share Step 3, so neither waits for the other.
 *
 * The caller keeps who has been called: an agent that has shown never disappears (App.tsx).
 */
export function calledSurfaces(map: AgentMap): Surface[] {
  const out: Surface[] = ['desk'];
  for (const surface of ['eligibility', 'map', 'quantification', 'water'] as const) {
    const call = callOf(map, AGENT_AT[surface]);
    /* Phoebe is not called any more once she has read every pathway: she was, and stays. */
    if (call.called || call.because === 'every pathway has a reading') out.push(surface);
  }
  return out;
}

/** One step of this project's walk, as a desk's button names it: its number, how many the project has, and its name. */
export interface StepWords {
  number: number;
  of: number;
  label: string;
}

/** The step a desk belongs to, by the map: its number is this project's, so a project with no Step 3 has two. */
export function stepAt(map: AgentMap, surface: Surface): StepWords | undefined {
  const step: Step | null = stepOf(map, AGENT_AT[surface]);
  return step ? { number: step.number, of: step.of, label: step.name } : undefined;
}

/**
 * WHAT COMES NEXT, read from the map — the maintainer's ruling of 24 Nov 2026 (src/lib/steps.ts draws it).
 *
 * It is the map's own one next step, with two things added. Step 3 names every calculator the map calls that is not done,
 * not the first alone. And once Phoebe has read every path, a missing country no longer holds the visitor at "gather
 * facts": Wellington asks for it, and the next step is still there. A visitor never reaches a dead end.
 *
 * HOME USE is asked when the map asks (core 0.3.0, 25 Nov 2026): a new or alternative supply whose water path is in play.
 * Wellington asks it, wherever he is, before he names the next agent; `then` is who that will be.
 */
export type NextStep =
  | { kind: 'gather'; homeUse?: boolean; then?: Surface[]; steps?: Partial<Record<Surface, StepWords>> }
  | { kind: 'call'; surfaces: Surface[]; steps?: Partial<Record<Surface, StepWords>> }
  | { kind: 'team' }
  | { kind: 'done' };

export function nextStep(record: ProjectRecord, map: AgentMap): NextStep {
  if (record.agents.phoebe?.done !== true) {
    const read = READ_HERE.every((pathway) => record.pathways[pathway] !== undefined);
    /* Until her step is ended the next step is Phoebe's, whatever else the facts already call. */
    return read || callOf(map, 'phoebe').called ? { kind: 'call', surfaces: ['eligibility'], steps: stepsOf(map, ['eligibility']) } : { kind: 'gather' };
  }
  if (READ_HERE.every((pathway) => record.pathways[pathway]?.reading === 'unlikely')) return { kind: 'team' };
  const ahead = (agent: AgentId) => callOf(map, agent).called && record.agents[agent]?.done !== true;
  const calculators = (['quantification', 'water'] as const).filter((surface) => ahead(AGENT_AT[surface]));
  const surfaces: Surface[] = ahead('bridget') ? ['map'] : [...calculators];
  if (asksHomeUse(record, map)) return { kind: 'gather', homeUse: true, then: surfaces, steps: stepsOf(map, surfaces) };
  return surfaces.length ? { kind: 'call', surfaces, steps: stepsOf(map, surfaces) } : { kind: 'done' };
}

function stepsOf(map: AgentMap, surfaces: readonly Surface[]): Partial<Record<Surface, StepWords>> {
  const out: Partial<Record<Surface, StepWords>> = {};
  for (const surface of surfaces) {
    const step = stepAt(map, surface);
    if (step) out[surface] = step;
  }
  return out;
}

/** The map's own rule for asking home use, read where a missing country would otherwise stand in front of it. */
export function asksHomeUse(record: ProjectRecord, map: AgentMap): boolean {
  if (map.next.step === 'gather facts' && map.next.facts.includes('homeUse')) return true;
  return record.agents.phoebe?.done === true && needsHomeUse(record.facts) && !kindNotSaid(record) && map.pathways.some((p) => p.pathway === 'vwba' && p.inPlay);
}

/** The steps that are done, by the journey's own keys. */
export function stepsDone(record: ProjectRecord, map: AgentMap): ('eligibility' | 'partners' | 'quantify')[] {
  const next = nextStep(record, map);
  const phoebe = record.agents.phoebe?.done === true;
  const bridget = record.agents.bridget?.done === true;
  return [
    ...(phoebe ? (['eligibility'] as const) : []),
    ...(phoebe && bridget ? (['partners'] as const) : []),
    /* Only where a calculator gave a figure: a project no calculator is called for has no Step 3 to call done. */
    ...(next.kind === 'done' && (record.agents.calvin?.estimate || record.agents.violet?.estimate) ? (['quantify'] as const) : []),
  ];
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
  /** The steps that are done, by the journey's keys, and every agent who helps with the next one (24 Nov 2026). */
  done: string[];
  agents: string[];
  /** Calvin's calculator does not cover this kind of project, so he is not the next step. */
  uncovered: boolean;
  /** Water benefits stay in play and no calculator covers this kind of project yet (25 Nov 2026). */
  noWaterCalculator: boolean;
  /** The steps this project has, by the journey's keys, in order. */
  steps: string[];
}

export function mapForWellington(record: ProjectRecord, map: AgentMap): MapForWellington {
  const next = nextStep(record, map);
  const ahead = next.kind === 'call' ? next.surfaces : next.kind === 'gather' ? (next.then ?? []) : [];
  const agents = ahead.map((surface) => AGENT_AT[surface]);
  const facts = [...(map.next.step === 'gather facts' ? map.next.facts.filter((f) => f !== 'homeUse') : []), ...(next.kind === 'gather' && next.homeUse ? ['homeUse'] : [])];
  return {
    next: next.kind === 'call' ? 'call' : next.kind === 'gather' ? 'gather facts' : next.kind === 'team' ? 'point to the WaterBots team' : 'report or sign-up',
    ...(agents.length ? { agent: agents[0] } : {}),
    ...(facts.length ? { facts } : {}),
    done: stepsDone(record, map),
    agents,
    uncovered: uncoveredLabel(record) !== undefined && callOf(map, 'calvin').called,
    noWaterCalculator: waterHasNoCalculator(map),
    steps: map.steps.map((step) => step.id),
    called: map.agents.filter((c) => c.called).map((c) => c.agent),
    closed: map.agents.filter((c) => closedBy(map, c.agent)).map((c) => c.agent),
    readings: map.pathways.flatMap((p) =>
      p.reading === null ? [] : [{ pathway: p.pathway, reading: p.reading, ...(record.pathways[p.pathway]?.wouldChange ? { wouldChange: record.pathways[p.pathway]!.wouldChange } : {}) }]
    ),
    transitioning: record.facts.creditedUnderV1?.value === true,
  };
}
