/**
 * The agent map, as Wellington reads it — J4, 23 Nov 2026.
 *
 * CORE'S MAP IS RUN IN THE BROWSER, on the shared project record (src/lib/projectRecord.ts), because that is
 * where the record is. What crosses is its answer in codes. Everything is checked here against closed lists and
 * capped; the one free text is "what would change it", made there from committed card titles, never from
 * Phoebe's sentences, and it is capped and kept to one line.
 *
 * HE LEADS FROM IT. The block names the one next step and who is called. The guard drops a route to an agent
 * the map has closed: a pathway that reads unlikely, or no pathway forward. An agent whose turn has not come
 * yet is not closed, because we are guides, not gates.
 *
 * This file imports only a type, so the check script can load it compiled as the platform compiles it.
 */

import type { Route } from './_wellingtonAnswer.js';

const AGENTS = ['wellington', 'phoebe', 'bridget', 'calvin', 'violet'] as const;
type Agent = (typeof AGENTS)[number];
const STEPS = ['gather facts', 'call', 'point to the WaterBots team', 'report or sign-up'] as const;
const FACTS = ['technology', 'country'] as const;
const READINGS = ['likely', 'more to learn', 'unlikely'] as const;
const PATHWAYS = { vwba: 'Water benefits', carbon: 'Carbon credits' } as const;

/** Long enough for a few card titles, short enough to refuse an essay. */
const MAX_CHANGE_CHARS = 600;

export interface MapNote {
  next: (typeof STEPS)[number];
  agent?: Agent;
  facts: (typeof FACTS)[number][];
  called: Agent[];
  closed: Agent[];
  readings: { pathway: keyof typeof PATHWAYS; reading: (typeof READINGS)[number]; wouldChange: string }[];
  transitioning: boolean;
}

/** The map off a request body, or null when none came or it does not hold. */
export function readMap(value: unknown): MapNote | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  const next = STEPS.find((s) => s === v.next);
  if (!next) return null;
  const agents = (list: unknown): Agent[] => (Array.isArray(list) ? AGENTS.filter((a) => list.includes(a)) : []);
  const agent = AGENTS.find((a) => a === v.agent);
  if (next === 'call' && !agent) return null;
  const readings: MapNote['readings'] = [];
  for (const raw of Array.isArray(v.readings) ? v.readings : []) {
    if (typeof raw !== 'object' || raw === null) continue;
    const r = raw as Record<string, unknown>;
    const reading = READINGS.find((x) => x === r.reading);
    const pathway = (Object.keys(PATHWAYS) as (keyof typeof PATHWAYS)[]).find((p) => p === r.pathway);
    if (!reading || !pathway || readings.some((x) => x.pathway === pathway)) continue;
    const change = typeof r.wouldChange === 'string' ? r.wouldChange.replace(/\s+/g, ' ').trim() : '';
    readings.push({ pathway, reading, wouldChange: change.length <= MAX_CHANGE_CHARS ? change : '' });
  }
  return {
    next,
    ...(next === 'call' && agent ? { agent } : {}),
    facts: Array.isArray(v.facts) ? FACTS.filter((f) => (v.facts as unknown[]).includes(f)) : [],
    called: agents(v.called),
    closed: agents(v.closed),
    readings,
    transitioning: v.transitioning === true,
  };
}

const NAME: Record<Agent, string> = { wellington: 'Wellington', phoebe: 'Phoebe', bridget: 'Bridget', calvin: 'Calvin', violet: 'Violet' };
/** The route that opens each agent's desk. */
const ROUTE_OF: Partial<Record<Agent, Route>> = { phoebe: 'eligibility', bridget: 'map', calvin: 'quantification', violet: 'water' };
const FACT_WORDS: Record<(typeof FACTS)[number], string> = { technology: 'what type of project it is', country: 'which country it is in' };

/** The heading his prompt names, so he knows the block when he sees it. */
export const MAP_HEADING = 'What the agent map says';

export function mapBlock(map: MapNote): string {
  const lines = [`# ${MAP_HEADING}`, '', 'Worked out from this project\'s facts as they stand. You lead from it.', ''];
  for (const r of map.readings) {
    lines.push(`- ${PATHWAYS[r.pathway]}: ${r.reading}.${r.reading === 'unlikely' && r.wouldChange ? ` What would change it: ${r.wouldChange}` : ''}`);
  }
  if (map.next === 'gather facts') {
    lines.push(`The one next step: gather ${map.facts.map((f) => FACT_WORDS[f]).join(' and ') || 'the basics'}. Phoebe comes after that.`);
  } else if (map.next === 'call' && map.agent) {
    lines.push(`The one next step: ${NAME[map.agent]}. Set the route to "${ROUTE_OF[map.agent] ?? 'none'}".`);
  } else if (map.next === 'point to the WaterBots team') {
    lines.push('The one next step: no funding path goes forward for now. Say so kindly, say what would change it, and point to the WaterBots team: the box under the save button sends them the project. Set the route to "none". Do not invite Bridget, Calvin or Violet.');
  } else {
    lines.push('The one next step: every step is done. Point to the screening report in the left rail, or to saving and signing up.');
  }
  const closed = map.closed.filter((a) => ROUTE_OF[a]);
  if (closed.length) lines.push(`Not called for this project: ${closed.map((a) => NAME[a]).join(', ')}. Never route there. The calculator can be read about in the Agent Commons; it does not open there yet.`);
  if (map.transitioning) lines.push('This project already earns credits under the older carbon rules, so Calvin also shows the older calculator and what changes.');
  return lines.join('\n');
}

/** A route to an agent the map has closed is "none". The console acts on the field, so the guard is here. */
export function guardRoute(route: Route, map: MapNote): Route {
  const agent = (Object.keys(ROUTE_OF) as Agent[]).find((a) => ROUTE_OF[a] === route);
  return agent && map.closed.includes(agent) ? 'none' : route;
}
