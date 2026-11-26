/**
 * THE SHARED PROJECT RECORD AND THE AGENT MAP, on this site — J3 and J4, 23 Nov 2026; on the agents' packages from
 * 26 Nov 2026 (J5).
 *
 * ONE RECORD FOR ONE PROJECT, in the open core's shape (@waterbots/core/record). It is worked out from what the shell
 * already holds, the visit and Phoebe's worksheet, every time either changes. Nothing is kept from before, so a fact that
 * changes changes every reading with it (RULINGS.md, section 4), and no two places can hold a fact differently. Nothing
 * here is stored; the visit still ends with the page.
 *
 * A NEW PROJECT STARTS FROM CORE'S NEW RECORD (`newProjectRecord`, core 0.4.0), under today's rules. Nobody is asked for a
 * kind or a class: the source, the treatment and whether the water is safe are plain facts, and core works out from them
 * what Calvin and Violet do (`carbonAnswer`, `waterAnswer`). No list of what is covered is kept here.
 *
 * WHO ADDS WHAT (agent rule 10).
 *   - Wellington: the name, what it does, the type, the stage, people or households served, the place; and the source,
 *     the treatment and the water's safety, under whoever the visitor told them to.
 *   - Phoebe: her package's own part (`addPhoebeResults`): each pathway's reading, her worksheet, whether the project is
 *     already credited under the carbon method's V1.0, and whether her step is done.
 *   - Bridget: the pinned basin, in her own part.
 *   - Calvin: his figure. Violet: the access level and the water before the project, her inputs, her figure.
 *
 * THE MAP IS CORE'S (@waterbots/core/agentMap), and Wellington reads it through his package (`mapNote`).
 */

import { agentMap, stepOf, type AgentCall, type AgentMap, type Step } from '@waterbots/core/agentMap';
import { NO_CALCULATOR_YET as CORE_NO_CALCULATOR_YET, type Answer, type KindFact } from '@waterbots/core/projectKinds';
import {
  addGivenFacts,
  AGENTS,
  carbonAnswer,
  carbonAnswers,
  newProjectRecord,
  setAgentResults,
  waterAnswer,
  type AgentId,
  type GivenFacts,
  type ProjectRecord,
} from '@waterbots/core/record';
import type { StandardId } from '@waterbots/core/standards';
import { READ_HERE as HER_READS, addPhoebeResults, packFor as herPackFor, pathwayForPack as herPathwayForPack, type Sheet } from '@waterbots/phoebe';
import { addVioletFacts, addVioletResults, violetGivenFacts } from '@waterbots/violet';
import type { D3Input, D3Result } from '@waterbots/violet/engine';
import { GS4GG_CALCULATOR_VERSION } from '@waterbots/calvin/engine';
import { mapNote, type MapNote } from '@waterbots/wellington';
import { countryIsoFor } from './calvinProject';
import type { Surface } from './surfaces';
import type { CarbonFigure, KindFacts, Visit } from './visit';

/** The pathways this site reads: one for each pack Phoebe works (her package's list). */
export const READ_HERE: readonly StandardId[] = HER_READS;

/** The pathway one of Phoebe's packs is. */
export const pathwayForPack = herPathwayForPack;

/** The pack behind a pathway, or undefined when this site reads none for it. */
export const packFor = herPackFor;

/* --------------------------------------------------------------------------
   What each calculator does with the project: core's answer, from the facts.
   -------------------------------------------------------------------------- */

/** What Calvin or Violet does with the project as it stands: core's one table, read from the facts alone. */
export function answerFor(record: Pick<ProjectRecord, 'facts'>, agent: 'calvin' | 'violet'): Answer {
  return agent === 'calvin' ? carbonAnswer(record.facts) : waterAnswer(record.facts);
}

/**
 * True when the calculator counts the project as it stands, so a figure may show. For Calvin, under any version in use: a
 * project already credited under V1.0 is counted under each version on its own (core 0.4.0).
 */
export function counted(record: Pick<ProjectRecord, 'facts'>, agent: 'calvin' | 'violet'): boolean {
  if (agent === 'violet') return waterAnswer(record.facts).says === 'counted';
  return Object.values(carbonAnswers(record.facts)).some((answer) => answer.says === 'counted');
}

/* --------------------------------------------------------------------------
   The record.
   -------------------------------------------------------------------------- */

export interface RecordInput {
  visit: Visit;
  sheet: Sheet;
  /** Calvin's figure, once his screen shows it. */
  carbon?: CarbonFigure | null;
}

/** The kind facts as the visit holds them, grouped by the agent they were said to. */
function kindByAgent(visit: Visit): Partial<Record<AgentId, KindFacts>> {
  const out: Partial<Record<AgentId, KindFacts>> = {};
  for (const [key, value] of Object.entries(visit.context.kindFacts) as [KindFact, unknown][]) {
    if (value === undefined) continue;
    const by = visit.context.kindFactsBy?.[key] ?? 'wellington';
    out[by] = { ...out[by], [key]: value } as KindFacts;
  }
  return out;
}

/** The shared project record, worked out from the visit and the worksheet as they stand. */
export function projectRecord({ visit, sheet, carbon = null }: RecordInput): ProjectRecord {
  const { context } = visit;
  let record = newProjectRecord();

  /* WELLINGTON. What the visitor told him counts as a question he asked; what they typed themselves does not. */
  const typed = { by: 'person' as const, note: 'typed on the project card' };
  const name = context.name.trim();
  const country = context.provenance.place === 'pin' ? null : countryIsoFor(context.place);
  if (name && context.provenance.name === 'typed') record.facts.name = name;
  if (country && context.provenance.place === 'typed') record.place.country = { value: country, source: typed };
  const place = context.provenance.place === 'pin' ? '' : context.place.trim();
  const kinds = kindByAgent(visit);
  record = addGivenFacts(record, 'wellington', {
    ...(name ? { name } : {}),
    ...(context.does.trim() ? { does: context.does.trim() } : {}),
    ...(context.type ? { type: context.type } : {}),
    ...kinds.wellington,
    ...(context.stage ? { stage: context.stage } : {}),
    ...(context.homeUse ? { homeUse: context.homeUse } : {}),
    ...(context.served ? { population: { mode: context.served.unit, served: context.served.count } } : {}),
    ...(place ? { placeWords: place } : {}),
    ...(country ? { country } : {}),
  }).record;

  /* PHOEBE, by her package's own helper. Her step is ended once she has handed the visitor on with a path done or closed,
     so nobody is sent back to a step she has ended (24 Nov 2026). */
  record = addPhoebeResults(record, sheet, { handedOn: visit.eligibilityHanded === true });
  /* A FACT HER READINGS REST ON CHANGED (core 0.5.0): each pathway's reading comes off and her part is not done, until her
     next turn works them out again. Her rows stay on her worksheet for her to check. As core's `changeFacts` does. */
  if (visit.context.readingsOff && Object.keys(record.pathways).length + Object.keys(record.eligibility ?? {}).length > 0) {
    record = { ...record, pathways: {}, agents: { ...record.agents, phoebe: { ...record.agents.phoebe, done: false, factsChanged: true } } };
  }

  /* BRIDGET. The basin, in core's own place for it. Her step is done with a basin, or once she has handed the visitor on
     without one: we are guides, not gates (24 Nov 2026). */
  if (visit.pin) {
    record = addGivenFacts(record, 'bridget', { basin: { id: visit.pin.hybasId, level: visit.pin.level, areaKm2: visit.pin.subAreaKm2, stressLabel: visit.pin.stressLabel } }).record;
  }
  if (visit.pin || visit.partnersDone) record = setAgentResults(record, 'bridget', { done: true });

  /* WHAT THE VISITOR TOLD CALVIN AND VIOLET (src/lib/told.ts). Only a fact the record lacks is added, as core rules; the
     source and the treatment they told them are on the visit's one list of kind facts, the newest word standing. */
  for (const agent of ['calvin', 'violet'] as const) {
    const told: GivenFacts = { ...visit.told?.[agent], ...kinds[agent] };
    if (Object.keys(told).length > 0) record = addGivenFacts(record, agent, told).record;
  }

  /* CALVIN. The figure is his engine's; this file only writes it down, and only while core says his method counts the
     project, under the version the figure is for. A fact that changes takes a figure that no longer fits off. */
  const version = carbon?.version === 'paa' ? '2026' : '2021';
  if (carbon && carbonAnswer(record.facts, version).says === 'counted') {
    record = setAgentResults(record, 'calvin', {
      estimate: { figure: carbon.er, unit: 'tCO₂e a year', method: carbon.version === 'paa' ? 'carbon-v2.0' : 'carbon-v1.0', engineVersion: GS4GG_CALCULATOR_VERSION },
      /* Opening his calculator ends nothing: a figure the visitor's answers gave does (25 Nov 2026). */
      done: visit.calvinDone === true,
    });
  }

  /* VIOLET, by her own package's helpers. */
  if (visit.water) {
    const input = visit.water.input as unknown as D3Input;
    const result = visit.water.result as unknown as D3Result;
    record = addVioletFacts(record, { ...violetGivenFacts(input), population: undefined }).record;
    if (counted(record, 'violet')) record = addVioletResults(record, { input, result, done: result.vwbM3PerYear !== null && visit.violetDone === true });
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

/** Core's map for this site: the two pathways Phoebe reads here, and the five agents this site has. */
export function siteMap(record: ProjectRecord, met: readonly AgentId[] = []): AgentMap {
  return agentMap({ place: 'free-site', record, met, reads: READ_HERE, crew: AGENTS });
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

/** What the screen says then — the maintainer's own sentence, 25 Nov 2026, from core's one copy. */
export const NO_CALCULATOR_YET = CORE_NO_CALCULATOR_YET;

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
 * WHAT COMES NEXT, read from the map — the maintainer's ruling of 24 Nov 2026 (src/lib/steps.ts draws it). It is
 * Wellington's own reading of the map (`mapNote`, his package), so the screen and his chat never disagree.
 *
 * HOME USE is asked when the map asks: a new or alternative supply whose water path is in play. Wellington asks it,
 * wherever he is, before he names the next agent; `then` is who that will be.
 */
export type NextStep =
  | { kind: 'gather'; homeUse?: boolean; then?: Surface[]; steps?: Partial<Record<Surface, StepWords>> }
  | { kind: 'call'; surfaces: Surface[]; steps?: Partial<Record<Surface, StepWords>> }
  | { kind: 'team' }
  | { kind: 'done' };

/** The desk of each agent the map names. */
const DESK_OF: Record<Exclude<AgentId, 'wellington'>, Surface> = { phoebe: 'eligibility', bridget: 'map', calvin: 'quantification', violet: 'water' };

/** Wellington's reading of the map, as his package gives it. */
export function mapForWellington(record: ProjectRecord, map: AgentMap): MapNote {
  const note = mapNote(record, map, { reads: READ_HERE });
  if (!note) throw new Error('The agent map was run for the lobby chat, which this site does not have.');
  return note;
}

export function nextStep(record: ProjectRecord, map: AgentMap): NextStep {
  const note = mapForWellington(record, map);
  const surfaces = note.agents.filter((a): a is Exclude<AgentId, 'wellington'> => a !== 'wellington').map((a) => DESK_OF[a]);
  if (note.next === 'point to the WaterBots team') return { kind: 'team' };
  if (note.next === 'report or sign-up') return { kind: 'done' };
  if (note.next === 'call') return { kind: 'call', surfaces, steps: stepsOf(map, surfaces) };
  return note.facts.includes('homeUse') ? { kind: 'gather', homeUse: true, then: surfaces, steps: stepsOf(map, surfaces) } : { kind: 'gather' };
}

function stepsOf(map: AgentMap, surfaces: readonly Surface[]): Partial<Record<Surface, StepWords>> {
  const out: Partial<Record<Surface, StepWords>> = {};
  for (const surface of surfaces) {
    const step = stepAt(map, surface);
    if (step) out[surface] = step;
  }
  return out;
}

/** The steps that are done, by the journey's own keys. */
export function stepsDone(record: ProjectRecord, map: AgentMap): ('eligibility' | 'partners' | 'quantify')[] {
  return mapForWellington(record, map).done;
}

/** Each pathway's plain name, as the screens say it. */
export const PATHWAY_NAME: Partial<Record<StandardId, string>> = { vwba: 'Water benefits', carbon: 'Carbon credits' };

export type { MapNote };
