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

/**
 * THE THREE STEPS, by the journey's names (src/lib/journey.ts; scripts/check-wellington.mjs holds them to it). The
 * journey is told by step, not by agent: the maintainer's ruling of 24 Nov 2026.
 */
export const STEP_NAMES = ['Eligibility', 'Partners', 'Quantify'] as const;
const STEP_KEYS = ['eligibility', 'partners', 'quantify'] as const;
type StepKey = (typeof STEP_KEYS)[number];
const STEP_OF: Partial<Record<Agent, number>> = { phoebe: 1, bridget: 2, calvin: 3, violet: 3 };
const stepWords = (n: number): string => `Step ${n} of ${STEP_NAMES.length}, ${STEP_NAMES[n - 1]}`;

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
  /** The steps that are done, and every agent who helps with the next one (24 Nov 2026). */
  done: StepKey[];
  agents: Agent[];
  /** Calvin's calculator does not cover this kind of project. */
  uncovered: boolean;
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
    done: Array.isArray(v.done) ? STEP_KEYS.filter((k) => (v.done as unknown[]).includes(k)) : [],
    agents: agents(v.agents),
    uncovered: v.uncovered === true,
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
  for (const key of map.done) lines.push(`- ${stepWords(STEP_KEYS.indexOf(key) + 1)}: done.`);
  if (map.next === 'gather facts') {
    lines.push(`The one next step: gather ${map.facts.map((f) => FACT_WORDS[f]).join(' and ') || 'the basics'}. Phoebe comes after that.`);
  } else if (map.next === 'call' && map.agent) {
    const helpers = map.agents.length ? map.agents : [map.agent];
    lines.push(`The one next step: ${stepWords(STEP_OF[map.agent] ?? 1)}, with ${helpers.map((a) => NAME[a]).join(' and ')}. Set the route to "${ROUTE_OF[map.agent] ?? 'none'}". The screening is not done while this step is ahead, so never say it is.`);
    if (map.facts.length) lines.push(`Still missing, and worth asking for: ${map.facts.map((f) => FACT_WORDS[f]).join(' and ')}.`);
  } else if (map.next === 'point to the WaterBots team') {
    lines.push('The one next step: no funding path goes forward for now. Say so kindly, say what would change it, and point to the WaterBots team: the box under the save button sends them the project. Set the route to "none". Do not invite Bridget, Calvin or Violet.');
  } else {
    lines.push('Every step this project calls for is done. Say so, and offer the screening report and "Save and sign up". The console draws both under your message.');
  }
  const closed = map.closed.filter((a) => ROUTE_OF[a]);
  if (closed.length) lines.push(`Not called for this project: ${closed.map((a) => NAME[a]).join(', ')}. Never route there. The calculator can be read about in the Agent Commons; it does not open there yet.`);
  if (map.uncovered) lines.push('Calvin is not the next step here: his calculator does not cover this kind of project yet. Say so kindly.');
  if (map.transitioning) lines.push('This project already earns credits under the older carbon rules, so Calvin also shows the older calculator and what changes.');
  return lines.join('\n');
}

/**
 * The note he gets when a step has ended: which one, what comes next, and how to hand over. The same for every step and
 * every agent (24 Nov 2026, items 5 to 8 and 10).
 */
export function stepEndNote(at: 'eligibility' | 'map', map: MapNote | null): string {
  const step = at === 'eligibility' ? 1 : 2;
  const done = map?.done.includes(STEP_KEYS[step - 1]) ?? false;
  const who = at === 'eligibility' ? 'Phoebe' : 'Bridget';
  const where = `# Where you are speaking\n\nYou have joined the visitor in ${who}'s chat. Never tell the visitor to come back to you.`;
  if (map && !done) {
    return `${where} ${stepWords(step)}, is not done yet: they asked something ${who} does not cover. Answer it, then leave them with ${who}. Set the route to "none".`;
  }
  const says = `Say that ${stepWords(step)}, is done and, in a line, what came of it.`;
  if (!map || (map.next === 'call' && map.agent)) {
    const helpers = map?.agents.length ? map.agents : map?.agent ? [map.agent] : [];
    const next = helpers.length
      ? `Then name ${stepWords(STEP_OF[helpers[0]] ?? step + 1)}, and what it helps them decide. Then introduce ${helpers.map((a) => NAME[a]).join(' and ')} and what each does for them, the way you introduced Phoebe. Set the route to "${ROUTE_OF[helpers[0]] ?? 'none'}" and fill the introduction field for ${NAME[helpers[0]]}.`
      : 'Then name the next step and what it helps them decide, introduce who helps there, set the route and fill the introduction field.';
    return `${where} ${says} ${next} The console draws the button.`;
  }
  if (map.next === 'point to the WaterBots team') {
    return `${where} ${says} No funding path goes forward for now, so say why, kindly, what would change it, and that the box under the save button sends the project to the WaterBots team. Offer the screening report and "Save and sign up". Set the route to "none". The console draws both.`;
  }
  return `${where} ${says} No step is left. ${map.uncovered ? 'Say why no calculator comes next: Calvin does not cover this kind of project yet. ' : ''}Offer the screening report and "Save and sign up". Set the route to "none". The console draws both.`;
}

/** The route a step's end has to carry: the map's next agent, whatever his field says. Null where the map has none. */
export function stepEndRoute(at: 'eligibility' | 'map', map: MapNote): Route | null {
  if (!map.done.includes(at === 'eligibility' ? 'eligibility' : 'partners')) return null;
  return map.next === 'call' && map.agent ? (ROUTE_OF[map.agent] ?? 'none') : 'none';
}

/** True when a reply says the whole screening, or every step, is done. Never said while a step is ahead (item 7). */
export function saysAllDone(reply: string): boolean {
  return /\b(?:every|all)\b(?:\s+\w+){0,3}\s+steps?\b[^.?!]{0,40}\b(?:done|finished|complete|completed)\b|\b(?:the|this|your|our)\s+(?:\w+\s+)?screening\b[^.?!]{0,25}\b(?:is|are|'s|’s)\s+(?:now\s+|all\s+)*(?:done|finished|complete|completed)\b|\b(?:that|this)(?:'s|’s| is) the end of (?:the|your) screening\b/i.test(reply);
}

/** A route to an agent the map has closed is "none". The console acts on the field, so the guard is here. */
export function guardRoute(route: Route, map: MapNote): Route {
  const agent = (Object.keys(ROUTE_OF) as Agent[]).find((a) => ROUTE_OF[a] === route);
  return agent && map.closed.includes(agent) ? 'none' : route;
}
