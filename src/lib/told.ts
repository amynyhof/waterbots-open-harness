/**
 * What the visitor tells Calvin or Violet, written to the visit — 25 Nov 2026, the shared console behaviours, item 9
 * (agent rule 10). The shared record is worked out from the visit (src/lib/projectRecord.ts), so this is where a fact
 * they give a calculator agent joins it, and every agent reads it.
 *
 * EACH NUMBER IS CHECKED where it enters, by core's one fact check. A refused one changes nothing, and its message comes
 * back for the agent's reply. The visitor's newest words win, as they do with Wellington. A typed entry is never
 * overwritten.
 *
 * THE SOURCE, THE TREATMENT AND WHETHER THE WATER IS SAFE (core 0.4.0, 26 Nov 2026) go on the visit's one list of kind
 * facts, the newest word standing, whoever the visitor told: a fact that changes takes off a figure that no longer fits,
 * because the record is worked out again from it. Nobody files a kind or a class.
 */

import { readKindFacts } from '@waterbots/core/projectKinds';
import { checkEntry, entryMessage, type GivenFacts } from '@waterbots/core/record';
import { COUNTRIES } from '@waterbots/calvin/engine';
import { learnedContext, withKind, type KindFacts, type ServedUnit, type Teller, type Told, type Visit } from './visit';

/**
 * WHAT A CALCULATOR CHAT'S TURN CARRIES ABOUT THE PROJECT, for the relay to work out what the agent does (core 0.4.0): the
 * source, the treatment and whether the water is safe, the type and home use. Plain values; the relay checks each again.
 */
export interface TurnFacts {
  kindFacts: KindFacts;
  type?: string;
  homeUse?: string;
}

export function turnFacts(visit: Visit): TurnFacts {
  return { kindFacts: visit.context.kindFacts, ...(visit.context.type ? { type: visit.context.type } : {}), ...(visit.context.homeUse ? { homeUse: visit.context.homeUse } : {}) };
}

const PUMPS = ['hand', 'gravity', 'solar', 'diesel', 'grid'] as const;
const UNITS: readonly ServedUnit[] = ['people', 'households'];

/** The visit with what they said, and a message for each number that was refused. */
export function toldVisit(visit: Visit, agent: Teller, given: GivenFacts): { visit: Visit; refused: string[] } {
  const refused: string[] = [];
  let context = visit.context;
  const told: Told = { ...visit.told?.[agent] };
  const others = agent === 'calvin' ? 'violet' : 'calvin';
  const other: Told = { ...visit.told?.[others] };

  /* THE KIND FACTS, the newest word standing. Only a word on core's list, or a yes or no, is kept. */
  context = withKind(context, readKindFacts(given), agent);
  if (given.homeUse) context = learnedContext(context, { homeUse: given.homeUse });

  if (given.country && COUNTRIES.some((c) => c.iso === given.country)) {
    told.country = given.country;
    delete other.country;
  }
  const pump = PUMPS.find((p) => p === given.pumpPower);
  if (pump) {
    told.pumpPower = pump;
    delete other.pumpPower;
  }

  if (given.population) {
    const mode = UNITS.find((u) => u === given.population?.mode);
    const unit = mode ?? told.population?.mode ?? other.population?.mode ?? context.served?.unit;
    const population = { ...other.population, ...told.population };
    delete other.population;
    const take = (key: 'served' | 'householdSize', value: number | undefined) => {
      if (value === undefined) return;
      const fact = key === 'served' ? ('population.served' as const) : ('population.householdSize' as const);
      if (checkEntry(fact, value).ok) population[key] = value;
      else refused.push(entryMessage(fact, unit));
    };
    take('served', given.population.served);
    take('householdSize', given.population.householdSize);
    if (mode) population.mode = mode;
    /* A count and its unit together are Wellington's field, on the left rail and in the save; a count with no unit waits. */
    const count = population.served ?? context.served?.count;
    if (count !== undefined && unit && (given.population.served !== undefined || mode) && checkEntry('population.served', count).ok) {
      context = learnedContext(context, { served: { count, unit } });
      delete population.served;
      delete population.mode;
    }
    told.population = population;
    if (Object.keys(population).length === 0) delete told.population;
  }

  return { visit: { ...visit, context, told: { [agent]: told, [others]: other } }, refused };
}
