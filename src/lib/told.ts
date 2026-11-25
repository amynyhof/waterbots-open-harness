/**
 * What the visitor tells Calvin or Violet, written to the visit — 25 Nov 2026, the shared console behaviours, item 9
 * (agent rule 10). The shared record is worked out from the visit (src/lib/projectRecord.ts), so this is where a fact
 * they give a calculator agent joins it, and every agent reads it.
 *
 * EACH NUMBER IS CHECKED where it enters, by core's one fact check. A refused one changes nothing, and its message comes
 * back for the agent's reply. The visitor's newest words win, as they do with Wellington. A typed entry is never
 * overwritten.
 */

import { checkEntry, entryMessage, type GivenFacts } from '@waterbots/core/record';
import { technologyOfClass, TECHNOLOGY_CLASSES } from '@waterbots/core/technologyLabels';
import { COUNTRIES } from '@waterbots/calvin/engine';
import { DRINKING_WATER_TYPE } from './projectTypes.generated';
import { HOME_USE_TYPE, learnedContext, type ServedUnit, type Teller, type Told, type Visit } from './visit';

const PUMPS = ['hand', 'gravity', 'solar', 'diesel', 'grid'] as const;
const UNITS: readonly ServedUnit[] = ['people', 'households'];

/** The visit with what they said, and a message for each number that was refused. */
export function toldVisit(visit: Visit, agent: Teller, given: GivenFacts): { visit: Visit; refused: string[] } {
  const refused: string[] = [];
  let context = visit.context;
  const told: Told = { ...visit.told?.[agent] };
  const others = agent === 'calvin' ? 'violet' : 'calvin';
  const other: Told = { ...visit.told?.[others] };

  /* THE KIND OF PROJECT is Wellington's field. Where it is blank, it is filled in as if the visitor had told him. */
  if (given.technology) {
    const kind = TECHNOLOGY_CLASSES.find((c) => technologyOfClass(c).label === given.technology?.label);
    if (kind && (context.type === '' || (context.type === DRINKING_WATER_TYPE && context.gsClass === ''))) {
      context = learnedContext(context, { type: DRINKING_WATER_TYPE, gsClass: kind });
    } else if (!kind && context.type === '') {
      context = learnedContext(context, { type: HOME_USE_TYPE });
    }
  }
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
