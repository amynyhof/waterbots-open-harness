/**
 * Calvin's wrapper around the sealed engine — the one place this site talks to it.
 *
 * Calvin's brief (PROPOSAL_calvin-brief.md) §3, §5 and §7, with the maintainer's
 * rulings of 10 Oct 2026. It does four things and computes nothing of its own:
 *
 *   1. CHOOSES THE CALCULATOR from the record — the type and the class — never
 *      from prose (§3).
 *   2. SAYS WHAT IS MISSING, so the carbon headline is a dash with its line
 *      instead of a number nobody can stand behind. Nothing is ever zero for
 *      want of an answer.
 *   3. RUNS THE ENGINE — `computeScenario`, unedited — on the record and the
 *      visitor's answers, and gives the people count through the engine's own
 *      `derivePopulation` (§5).
 *   4. TAGS EVERY VALUE THE ENGINE USED — entered, default, derived, assumed — and
 *      lists them in `usedValues`, inputs only and never an equation result (§7,
 *      R7). The seal and the export read the same list.
 *
 * NO PRESET EVER REACHES THE SCREEN. The "all wood, three-stone" screening preset
 * is retired (her ruling of 10 Oct 2026). The wrapper asks the engine's
 * `countryBaselineDefault` first and does not run the carbon calculation for a
 * country without cleared fuel and stove data; it checks the run's own
 * `baselineMix` afterwards as a second guard. On the bundle on hand (v0.16.1)
 * the fuel mix is a stub with no rows, so every carbon headline is a dash with
 * BASELINE_FUEL_LINE until a new sealed engine carries cleared data (R12).
 *
 * Plain TypeScript, no bundler-only imports, so a check script can load it.
 */

import {
  computeScenario,
  derivePopulation,
  fnrbAvailability,
  EMBODIED_CATEGORIES,
  DEFAULT_SE_O,
  type EmbodiedCategory,
  type Provenance as EngineProvenance,
  type ScenarioResult,
} from '../../engine/calculators/gs4gg-carbon/scenario';
import { countryBaselineDefault } from '../../engine/calculators/gs4gg-carbon/presets';
import type { QuantityMethod } from '../../engine/calculators/gs4gg-carbon/quantity';
import type { PaaErOutput } from '../../engine/calculators/gs4gg-carbon/types';
import householdJson from '../../engine/calculators/data/household-size/countries.json';
import fnrbJson from '../../engine/calculators/data/fnrb/countries.json';
import dafJson from '../../engine/calculators/data/daf/countries.json';
import ageSharesJson from '../../engine/calculators/data/age-shares/countries.json';
import embodiedJson from '../../engine/calculators/data/embodied/factors.json';
import m49Json from '../../engine/calculators/data/regions/un-m49.json';
import {
  CALVIN_FIELDS,
  DAYS_OPENING,
  HWT_DAYS,
  LITRES_SLIDER,
  QUALITY_OPENING,
  QUALITY_SLIDER,
  DAYS_SLIDER,
  clampSlider,
  countryName,
  type CalvinFieldKey,
  type SuppliedFnrb,
} from './calvinFields';
import { DRINKING_WATER_TYPE, type GsClassId } from './projectTypes.generated';
import { METHODOLOGY_V2_ID } from './registry';
import type { ProjectClass, ProjectType, Served } from './visit';

/* --------------------------------------------------------------------------
   The words the dash carries. Her words, 10 Oct 2026.
   -------------------------------------------------------------------------- */

/** The carbon headline's line for a country with no cleared baseline fuel data. */
export const BASELINE_FUEL_LINE = 'Baseline fuel data is not on this site yet.';

/* --------------------------------------------------------------------------
   1. Which calculator, from the record (§3).
   -------------------------------------------------------------------------- */

/**
 * Why there is no carbon calculation for this record.
 *   no-type      — the type is not settled; Calvin asks what the project does
 *                  and hands back to Wellington to settle it.
 *   no-class     — a drinking-water project whose class is not known yet;
 *                  Calvin asks it.
 *   not-named    — the carbon pathway does not name this type.
 */
export type NoCarbonReason = 'no-type' | 'no-class' | 'not-named';

/** The water side: the D-3 pack runs, its own gate decides, or nothing yet. */
export type WaterChoice = 'vwba-d3' | 'vwba-d3-gate' | null;

export interface CalculatorChoice {
  carbon: { method: QuantityMethod; gsClass: GsClassId } | { method: null; reason: NoCarbonReason };
  water: WaterChoice;
}

/** §3's table, row for row. */
export function chooseCalculators(type: ProjectType, gsClass: ProjectClass): CalculatorChoice {
  if (type === '') return { carbon: { method: null, reason: 'no-type' }, water: null };
  if (type === DRINKING_WATER_TYPE) {
    if (gsClass === 'HWT' || gsClass === 'IWT') return { carbon: { method: 2, gsClass }, water: 'vwba-d3' };
    if (gsClass === 'CWT' || gsClass === 'CWS') return { carbon: { method: 1, gsClass }, water: 'vwba-d3' };
    return { carbon: { method: null, reason: 'no-class' }, water: 'vwba-d3' };
  }
  if (type === 'C-11') return { carbon: { method: null, reason: 'not-named' }, water: 'vwba-d3' };
  return { carbon: { method: null, reason: 'not-named' }, water: 'vwba-d3-gate' };
}

/* --------------------------------------------------------------------------
   The visitor's answers, and how each was given.
   -------------------------------------------------------------------------- */

/** A value the visitor gave, typed into its box or said to Calvin. Tagged entered. */
export interface Answer<T> {
  value: T;
  from: 'typed' | 'chat';
}

/**
 * A slider's position when it is not at its opening. `moved` is the visitor
 * dragging it — tagged assumed; `answered` is a figure they gave Calvin, which
 * moves the slider — tagged entered.
 */
export interface SliderPosition {
  value: number;
  how: 'moved' | 'answered';
}

export interface CarbonInputs {
  type: ProjectType;
  gsClass: ProjectClass;
  /** People served as the record holds it; never converted on the record. */
  served: Served | null;
  /** ISO3, from the record's place matched against UN M49, or answered. */
  country: string | null;
  litres?: SliderPosition;
  operationalDays?: SliderPosition;
  waterQuality?: SliderPosition;
  premises?: Answer<number>;
  deviceClass?: Answer<EmbodiedCategory>;
  deviceUnits?: Answer<number>;
  /** Only where the country is absent from the UN household file (R6). */
  householdSize?: Answer<number>;
  /** Only where the engine refuses fNRB for the country. */
  fnrb?: Answer<SuppliedFnrb>;
  /**
   * Embodied emissions route: upfront (Eq. 18) or amortised over five years
   * (Eq. 19). The engine never picks it; neither does this wrapper. The screen
   * passes it, and it waits on the maintainer's word before step 4.
   */
  embodiedRoute: 'upfront' | 'amortised';
}

/* --------------------------------------------------------------------------
   2 and 3. What is missing, then the run.
   -------------------------------------------------------------------------- */

export type Tag = 'entered' | 'default' | 'derived' | 'assumed';

/** Where a value came from: a registry row (cited through lib/registry), the engine's own label, or the visitor. */
export interface ValueSource {
  registryId?: string;
  section?: string;
  page?: string;
  /** The engine's own words for the source, shown as they are. */
  label?: string;
}

export interface UsedValue {
  key: string;
  label: string;
  value: number | string;
  unit: string;
  tag: Tag;
  source: ValueSource;
  /** A ruling that stands until another side confirms it, said on the row. */
  pending?: string;
}

export type CarbonOutcome =
  | { kind: 'none'; reason: NoCarbonReason; needs: CalvinFieldKey[] }
  | {
      kind: 'dash';
      /** The one line under the em dash. */
      line: string;
      /** What Calvin asks for, in order; may be empty when nothing the visitor can give lifts the dash. */
      needs: CalvinFieldKey[];
    }
  | {
      kind: 'ok';
      scenario: ScenarioResult;
      result: PaaErOutput;
      values: UsedValue[];
    };

const HOUSEHOLD = householdJson as unknown as { registrySources: string[]; countries: Record<string, unknown> };
const M49_ROWS = (m49Json as unknown as { countries: Record<string, unknown> }).countries;
const REG = {
  household: HOUSEHOLD.registrySources[0],
  fnrb: (fnrbJson as unknown as { ruleUpdate: { registrySources: string[] } }).ruleUpdate.registrySources,
  daf: (dafJson as unknown as { registrySources: string[] }).registrySources[0],
  ageShares: (ageSharesJson as unknown as { registrySources: string[] }).registrySources[0],
  embodied: (embodiedJson as unknown as { registrySources: string[] }).registrySources[0],
  m49: (m49Json as unknown as { registrySources: string[] }).registrySources[0],
};

/** True when the engine has cleared fuel AND stove shares for the country, so no half falls to the preset. */
export function hasClearedFuelData(iso: string): boolean {
  const d = countryBaselineDefault(iso);
  return d.fuel !== undefined && d.stove !== undefined;
}

function stillNeededLine(needs: CalvinFieldKey[]): string {
  return `Still needed: ${needs.map((k) => CALVIN_FIELDS[k].label.toLowerCase()).join(', ')}.`;
}

/** The carbon headline's outcome: none, a dash with its line and what to ask, or the engine's run. */
export function carbonOutcome(input: CarbonInputs): CarbonOutcome {
  const choice = chooseCalculators(input.type, input.gsClass).carbon;
  if (choice.method === null) {
    return { kind: 'none', reason: choice.reason, needs: choice.reason === 'no-class' ? ['gsClass'] : [] };
  }
  const method = choice.method;
  const isHwt = choice.gsClass === 'HWT';

  const needs: CalvinFieldKey[] = [];
  const iso = input.country && M49_ROWS[input.country] ? input.country : null;
  if (!iso) needs.push('country');
  if (!input.served) needs.push('served');
  // R6: a country missing from the UN household file — Calvin asks the size; the quartile fallback is never used.
  const needsSize =
    iso !== null &&
    !HOUSEHOLD.countries[iso] &&
    (input.served?.unit === 'households' || method === 2) &&
    input.householdSize === undefined;
  if (needsSize) needs.push('householdSize');
  // Embodied is never 0: the class and the unit count are asked (her ruling of 10 Oct 2026).
  if (!input.deviceClass) needs.push('deviceClass');
  if (!input.deviceUnits) needs.push('deviceUnits');

  // The engine's own fNRB refusal is printed verbatim, and the visitor's own value with its source lifts it.
  if (iso) {
    const avail = fnrbAvailability(iso, undefined, input.fnrb?.value.value);
    if (!avail.ok) return { kind: 'dash', line: avail.refusal.message, needs: ['fnrb', ...needs] };
    if (!hasClearedFuelData(iso)) return { kind: 'dash', line: BASELINE_FUEL_LINE, needs };
  }
  if (needs.length > 0 || !iso || !input.served || !input.deviceClass || !input.deviceUnits) {
    return { kind: 'dash', line: stillNeededLine(needs), needs };
  }

  const litres = input.litres ? clampSlider(LITRES_SLIDER, input.litres.value) : undefined;
  const days = isHwt
    ? HWT_DAYS.value
    : (input.operationalDays ? clampSlider(DAYS_SLIDER, input.operationalDays.value) : undefined) ?? DAYS_OPENING.value;
  const quality = (input.waterQuality ? clampSlider(QUALITY_SLIDER, input.waterQuality.value) : undefined) ?? QUALITY_OPENING.value;

  const pop = derivePopulation({
    countryIso: iso,
    method,
    populationMode: input.served.unit,
    populationCount: input.served.count,
    householdSizeOverride: input.householdSize?.value ?? null,
  });
  if (!pop) return { kind: 'dash', line: stillNeededLine(['served']), needs: ['served'] };
  const premises = method === 2 ? input.premises?.value ?? pop.households : undefined;

  const scenario = computeScenario({
    version: 'paa',
    method,
    mode: 'ex-ante',
    populationMode: input.served.unit,
    populationCount: input.served.count,
    countryIso: iso,
    volumeBasis: litres === undefined ? 'table9' : 'flat',
    litresPerPersonPerDay: litres ?? 0,
    operationalDays: days,
    premises,
    householdSizeOverride: input.householdSize?.value ?? null,
    fnrbOverride: input.fnrb?.value.value ?? null,
    M_qy: quality,
    embodied: { unitsInYear: input.deviceUnits.value, category: input.deviceClass.value, route: input.embodiedRoute },
  });

  // Second guard: a run that fell back to the preset for either half is never shown.
  if (scenario.baselineMix.stove === 'preset' || scenario.baselineMix.fuel === 'preset') {
    return { kind: 'dash', line: BASELINE_FUEL_LINE, needs: [] };
  }

  return {
    kind: 'ok',
    scenario,
    result: scenario.result as PaaErOutput,
    values: usedValues(input, scenario, { method, isHwt, days, quality, litres, premises, pop }),
  };
}

/* --------------------------------------------------------------------------
   4. The tags, and every value the engine used (§7; R7: inputs, never results).
   -------------------------------------------------------------------------- */

/** The engine's provenance words onto the four tags, once (§7.1). `preset` never arrives here. */
export function tagFor(source: EngineProvenance['source']): Tag {
  return source === 'override' ? 'entered' : 'default';
}

function provOf(scenario: ScenarioResult, field: string): EngineProvenance | undefined {
  return scenario.provenance.find((p) => p.field === field);
}

const sliderTag = (pos: SliderPosition | undefined): Tag | undefined =>
  pos === undefined ? undefined : pos.how === 'moved' ? 'assumed' : 'entered';

/**
 * Every leaf value the engine consumed, after resolution, with its tag and its
 * source. Derived inputs are in it — the people count from households, the
 * households from people, the weighted litres, EF_b as the factor the volume
 * is multiplied by. Equation results are not: no Q_pop, no BE, no LE, no ER.
 */
export function usedValues(
  input: CarbonInputs,
  scenario: ScenarioResult,
  ctx: {
    method: QuantityMethod;
    isHwt: boolean;
    days: number;
    quality: number;
    litres: number | undefined;
    premises: number | undefined;
    pop: NonNullable<ReturnType<typeof derivePopulation>>;
  },
): UsedValue[] {
  const out: UsedValue[] = [];
  const iso = input.country!;
  const served = input.served!;

  out.push({
    key: 'country', label: 'Country', value: countryName(iso) ?? iso, unit: '', tag: 'entered',
    source: { registryId: REG.m49 },
  });

  // People, households and household size — §5. The record keeps what was said; these are what the engine used.
  out.push({
    key: 'people', label: 'People served', value: scenario.people, unit: 'people',
    tag: served.unit === 'people' ? 'entered' : 'derived', source: {},
  });
  if (served.unit === 'households' || ctx.pop.households !== undefined) {
    out.push({
      key: 'households', label: 'Households served',
      value: served.unit === 'households' ? served.count : (ctx.pop.households as number),
      unit: 'households', tag: served.unit === 'households' ? 'entered' : 'derived', source: {},
    });
  }
  if (scenario.householdSizeUsed !== undefined || ctx.pop.households !== undefined) {
    const prov = provOf(scenario, 'householdSize');
    out.push({
      key: 'householdSize', label: 'Household size', value: ctx.pop.householdSize, unit: 'people / household',
      tag: input.householdSize ? 'entered' : 'default',
      source: input.householdSize ? {} : { registryId: REG.household, label: prov?.label ?? ctx.pop.prov.label },
    });
  }
  if (ctx.method === 2) {
    out.push({
      key: 'premises', label: 'Homes or premises with a unit (N_p)', value: ctx.premises ?? '', unit: 'premises',
      tag: input.premises ? 'entered' : 'derived', source: { section: 'SDWS 33' },
    });
  }

  // Litres per person per day — the weighted Table 9 default, or the slider's value.
  const litresTag = sliderTag(input.litres) ?? 'default';
  out.push({
    key: 'litres', label: 'Drinking water per person per day (QPW_p)', value: scenario.qpwEffective, unit: 'L / person / day',
    tag: litresTag,
    source: litresTag === 'default'
      ? { registryId: METHODOLOGY_V2_ID, section: 'Table 9, §7.3.11', page: 'p. 31', label: provOf(scenario, 'ageShares')?.label }
      : {},
  });
  if (litresTag === 'default' && scenario.table9) {
    out.push({
      key: 'ageShares', label: 'Age shares',
      value: `${scenario.table9.ageShares.under5} / ${scenario.table9.ageShares.age5_18} / ${scenario.table9.ageShares.adult19plus}`,
      unit: 'under 5 / 5–18 / adults', tag: 'default',
      source: { registryId: REG.ageShares, label: scenario.table9.ageShares.label },
    });
  }

  // Operational days.
  if (ctx.isHwt) {
    out.push({
      key: 'operationalDays', label: 'Days a year (DP_p)', value: ctx.days, unit: 'days / year', tag: 'default',
      source: { registryId: METHODOLOGY_V2_ID, section: HWT_DAYS.section, label: HWT_DAYS.label },
      pending: HWT_DAYS.pending,
    });
  } else {
    const t = sliderTag(input.operationalDays) ?? 'default';
    out.push({
      key: 'operationalDays', label: ctx.method === 2 ? 'Days a year (DP_p)' : 'Days a year (DO_p)', value: ctx.days,
      unit: 'days / year', tag: t,
      source: t === 'default'
        ? { registryId: METHODOLOGY_V2_ID, section: DAYS_OPENING.section, page: DAYS_OPENING.page, label: DAYS_OPENING.label }
        : {},
    });
  }

  // Water quality passing rate.
  const qTag = sliderTag(input.waterQuality) ?? 'default';
  out.push({
    key: 'waterQuality', label: 'Water quality passing rate (M_q,y)', value: ctx.quality, unit: 'fraction passing', tag: qTag,
    source: qTag === 'default'
      ? { registryId: METHODOLOGY_V2_ID, section: QUALITY_OPENING.section, page: QUALITY_OPENING.page, label: QUALITY_OPENING.label }
      : {},
  });

  // fNRB, DAF — the engine's lookups, with the engine's labels.
  const fp = provOf(scenario, 'fNRB');
  out.push({
    key: 'fNRB', label: 'Fraction of non-renewable biomass (fNRB)', value: scenario.fNRB, unit: 'fraction',
    tag: input.fnrb ? 'entered' : 'default',
    source: input.fnrb
      ? { label: input.fnrb.value.source }
      : { registryId: REG.fnrb.includes('a64-amt-009-fnrb') ? 'a64-amt-009-fnrb' : REG.fnrb[0], label: fp?.label },
    pending: scenario.fnrbMultiNational?.condition,
  });
  const dp = provOf(scenario, 'DAF');
  out.push({
    key: 'DAF', label: 'Downward adjustment factor (DAF)', value: scenario.DAF, unit: 'fraction',
    tag: tagFor(dp?.source ?? 'default'), source: { registryId: REG.daf, label: dp?.label },
  });

  // The baseline emission factor and what it is built from.
  out.push({
    key: 'SE_o', label: 'Energy to boil a litre of water (SE_o)', value: scenario.SE_o, unit: 'kJ / L',
    tag: scenario.SE_o === DEFAULT_SE_O ? 'default' : 'entered',
    source: { registryId: METHODOLOGY_V2_ID, section: 'Eq. 2', page: 'p. 29' },
  });
  const bp = provOf(scenario, 'baseline');
  out.push({
    key: 'etaWeighted', label: 'Stove efficiency, weighted (η)', value: scenario.etaWeighted, unit: 'fraction',
    tag: 'derived', source: { label: bp?.label },
  });
  out.push({
    key: 'combinedEF', label: 'Fuel emission factor, weighted', value: scenario.combinedEF, unit: 'tCO₂ / TJ',
    tag: 'derived', source: { label: bp?.label },
  });
  out.push({
    key: 'EF_b', label: 'Baseline emission factor per litre (EF_b)', value: (scenario.result as PaaErOutput).EF_b, unit: 'tCO₂e / L',
    tag: 'derived', source: { registryId: METHODOLOGY_V2_ID, section: 'Eq. 1–2' },
  });

  /* The engine's own values where nothing is entered. They are leaf inputs the
     run used, so they travel; the engine carries no registry row for them, so
     the source says exactly that rather than borrowing one. See the pull
     request's open questions. */
  const r = scenario.result as PaaErOutput;
  out.push({
    key: 'C_b', label: 'Share already using safe water (C_b)', value: 0, unit: 'fraction', tag: 'default',
    source: { label: "the engine's value when none is entered; no source row in the engine" },
  });
  out.push({
    key: 'X_cleanboil', label: 'Share boiling water that is already clean (X_cleanboil)', value: 0, unit: 'fraction', tag: 'default',
    source: { label: "the engine's ex-ante value when none is entered (its note: SDWS 22); cleared data replaces it with a new sealed engine" },
  });
  if (ctx.method === 2) {
    out.push({
      key: 'U_p', label: 'Usage rate (U_p)', value: 1, unit: 'fraction', tag: 'default',
      source: { label: "the engine's value when none is entered; no source row in the engine" },
    });
  }
  out.push({
    key: 'AE', label: 'Activity emissions (AE)', value: r.PE, unit: 'tCO₂e', tag: 'default',
    source: { registryId: METHODOLOGY_V2_ID, section: 'Eq. 14', label: "the engine's value when none is entered" },
  });

  // Leakage and embodied emissions — the methodology's defaults, by the engine's labels.
  const lp = provOf(scenario, 'leakage');
  out.push({
    key: 'leakageOption', label: 'Market leakage', value: 'Option 1, 2%', unit: '', tag: tagFor(lp?.source ?? 'default'),
    source: { registryId: METHODOLOGY_V2_ID, label: lp?.label },
  });
  const cat = EMBODIED_CATEGORIES[input.deviceClass!.value];
  out.push({
    key: 'deviceClass', label: 'Kind of device', value: cat.label, unit: '', tag: 'entered', source: {},
  });
  out.push({
    key: 'embodiedFactor', label: 'Embodied emissions per unit', value: cat.factor, unit: 'tCO₂e / unit', tag: 'default',
    source: { registryId: REG.embodied, label: cat.cite },
  });
  out.push({
    key: 'deviceUnits', label: 'New units this year', value: input.deviceUnits!.value, unit: 'units', tag: 'entered', source: {},
  });

  return out;
}

/** Keys that are equation results and never travel as a used value (R7). */
export const RESULT_KEYS: readonly string[] = [
  'Q_pop', 'Q_y', 'Q_adj', 'BE', 'BE_unadj', 'BE_u', 'BE_downadj', 'BE_BAU', 'BE_CB', 'MC', 'PE', 'LE', 'LE_market', 'LE_embodied', 'ER',
];
