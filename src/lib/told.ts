/**
 * What the visitor tells Calvin or Violet, written to the visit — 25 Nov 2026, the shared console behaviours, item 9
 * (agent rule 10). The shared record is worked out from the visit (src/lib/projectRecord.ts), so this is where a fact
 * they give a calculator agent joins it, and every agent reads it.
 *
 * EACH NUMBER IS CHECKED where it enters, by core's one fact check. A refused one changes nothing, and its message comes
 * back for the agent's reply. The visitor's newest words win, as they do with Wellington. A typed entry is never
 * overwritten.
 *
 * THE KIND OF PROJECT IS FILED ONLY WHERE THE RECORD HAS NONE, whoever settled it, and only on the visitor's own words
 * (api/_chatGuards.ts, 25 Nov 2026). One filed here comes off again when what they say next does not fit it.
 */

import { checkEntry, entryMessage, type GivenFacts } from '@waterbots/core/record';
import { technologyOfClass, TECHNOLOGY_CLASSES } from '@waterbots/core/technologyLabels';
import { COUNTRIES } from '@waterbots/calvin/engine';
import { DRINKING_WATER_TYPE } from './projectTypes.generated';
import { kindOnRecord } from './projectRecord';
import { HOME_USE_TYPE, learnedContext, type ServedUnit, type Teller, type Told, type Visit, type VisitContext } from './visit';
import type { ProjectRecord } from '@waterbots/core/record';

const PUMPS = ['hand', 'gravity', 'solar', 'diesel', 'grid'] as const;
const UNITS: readonly ServedUnit[] = ['people', 'households'];

/** What the two chats' guards are told of the kind of project, with each turn. */
export interface KindNow {
  /** What the project does, in the visitor's own words to Wellington. */
  does: string;
  /** The kind on the record, in core's label; '' when nobody has said it. */
  kind: string;
  /** True when one of the two chats filed it. */
  filedInChat: boolean;
}

export function kindNow(visit: Visit, record: ProjectRecord): KindNow {
  const filed = [visit.told?.calvin?.kind, visit.told?.violet?.kind].filter((kind) => kind !== undefined);
  return { does: visit.context.does, kind: kindOnRecord(record), filedInChat: filed.some((kind) => kind === visit.context.gsClass || kind === visit.context.type) };
}

/** The context without a kind that was filed from a chat. A kind anyone else gave stays. */
function withoutKind(context: VisitContext, kind: string): VisitContext {
  if (context.gsClass === kind) return { ...context, gsClass: '', provenance: { ...context.provenance, gsClass: '' } };
  if (context.type === kind) return learnedContext({ ...context, type: '', provenance: { ...context.provenance, type: '' } }, {});
  return context;
}

/** The visit with what they said, and a message for each number that was refused. `record` is the record as it stands. */
export function toldVisit(visit: Visit, agent: Teller, given: GivenFacts, record: ProjectRecord, unfile = false): { visit: Visit; refused: string[] } {
  const refused: string[] = [];
  let context = visit.context;
  const told: Told = { ...visit.told?.[agent] };
  const others = agent === 'calvin' ? 'violet' : 'calvin';
  const other: Told = { ...visit.told?.[others] };

  if (unfile) {
    for (const one of [told, other]) {
      if (one.kind !== undefined) context = withoutKind(context, one.kind);
      delete one.kind;
    }
  }

  /* THE KIND OF PROJECT is Wellington's field. Where it is blank, it is filled in as if the visitor had told him. Where the
     record has one, his or Phoebe's, it stands. */
  if (given.technology && (unfile || kindOnRecord(record) === '')) {
    const kind = TECHNOLOGY_CLASSES.find((c) => technologyOfClass(c).label === given.technology?.label);
    if (kind && (context.type === '' || (context.type === DRINKING_WATER_TYPE && context.gsClass === ''))) {
      context = learnedContext(context, { type: DRINKING_WATER_TYPE, gsClass: kind });
      told.kind = kind;
    } else if (!kind && context.type === '') {
      context = learnedContext(context, { type: HOME_USE_TYPE });
      told.kind = HOME_USE_TYPE;
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
