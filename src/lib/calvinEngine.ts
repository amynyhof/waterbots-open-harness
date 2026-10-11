/**
 * Calvin's wrapper around the sealed engine — the one place this site talks to it.
 *
 * Calvin's brief (PROPOSAL_calvin-brief.md) §3, §5 and §7, with the maintainer's
 * rulings of 10 Oct 2026. It does four things and computes nothing of its own:
 *
 *   1. CHOOSES THE CALCULATOR from the record — the type and the class — never
 *      from prose (§3).
 *   2. SAYS WHAT IS MISSING OR NOT YET ON THIS SITE, so the carbon headline is a dash with its line
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
  computeTransitionWaterfall,
  derivePopulation,
  fnrbAvailability,
  transitionAvailability,
  EMBODIED_CATEGORIES,
  DEFAULT_SE_O,
  type EmbodiedCategory,
  type FiledFnrbRefusal,
  type FnrbRefusal,
  type Provenance as EngineProvenance,
  type ScenarioInput,
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
  DAYS_ABOVE_THRESHOLD_LINE,
  DAYS_SENSOR_THRESHOLD,
  ETA_OPENING,
  ETA_SLIDER,
  HWT_DAYS,
  LITRES_SLIDER,
  QUALITY_OPENING,
  QUALITY_SLIDER,
  DAYS_SLIDER,
  USAGE_OPENING,
  USAGE_SLIDER,
  clampSlider,
  countryName,
  type CalvinFieldKey,
  type EnergySource,
  type SliderKey,
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

/** The line for an institution (IWT): schools and clinics are v2 — the maintainer's ruling of 10 Oct 2026 (R26). */
export const INSTITUTION_LINE = 'Schools, clinics and other institutions come in a later version of this site.';

/** The line for a system that runs on diesel or grid power once the amount is known (R17). */
export function energyFactorLine(source: 'diesel' | 'grid'): string {
  return `The emission factor for ${source === 'diesel' ? 'diesel' : 'grid electricity'} is not on this site yet.`;
}

/**
 * Embodied emissions are spread over the first crediting period, five years
 * (Eq. 19), per V2.0 §9.2.2.1(b) — the methodology's rule; the maintainer's
 * ruling of 10 Oct 2026 (R15). The cite is the engine's data file's own.
 */
export const EMBODIED_ROUTE = 'amortised' as const;
const EMBODIED_ROUTE_CITE: string = (embodiedJson as unknown as { amortisationYears: { cite: string } }).amortisationYears.cite;

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
 *   institution  — a school, clinic or other institution (IWT): v2 (R26).
 */
export type NoCarbonReason = 'no-type' | 'no-class' | 'not-named' | 'institution';

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
    if (gsClass === 'HWT') return { carbon: { method: 2, gsClass }, water: 'vwba-d3' };
    if (gsClass === 'IWT') return { carbon: { method: null, reason: 'institution' }, water: 'vwba-d3' };
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
  /** Stove efficiency η; opens at the most efficient class (R23). */
  eta?: SliderPosition;
  /** Usage rate U_p, household treatment only, never 0 (R23). */
  usageRate?: SliderPosition;
  /** The version Phoebe's carbon pack sorted the project into: new, transitioning or unknown (R25). */
  versionFlag?: string;
  /** A transitioning project's filed V1.0 fNRB, with its source. */
  fnrbFiledV1?: Answer<SuppliedFnrb>;
  premises?: Answer<number>;
  deviceClass?: Answer<EmbodiedCategory>;
  deviceUnits?: Answer<number>;
  /** Only where the country is absent from the UN household file (R6). */
  householdSize?: Answer<number>;
  /** Only where the engine refuses fNRB for the country. */
  fnrb?: Answer<SuppliedFnrb>;
  /** What the system runs on, for activity emissions (R17). Unanswered is a dash. */
  energySource?: Answer<EnergySource>;
  /** How much a year, in ENERGY_UNIT for the source; asked only where energy is used. */
  energyAmount?: Answer<number>;
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

/**
 * True when the engine has cleared fuel AND stove shares for the country, so no
 * half falls to the preset. Fuel without stove data stays a dash; the new engine
 * must carry a stove rule per country — the maintainer's ruling of 10 Oct 2026 (R19).
 */
export function hasClearedFuelData(iso: string): boolean {
  const d = countryBaselineDefault(iso);
  return d.fuel !== undefined && d.stove !== undefined;
}

function stillNeededLine(needs: CalvinFieldKey[]): string {
  return `Still needed: ${needs.map((k) => CALVIN_FIELDS[k].label.toLowerCase()).join(', ')}.`;
}


/* --------------------------------------------------------------------------
   Every SDWS reference carries its version (R22).
   -------------------------------------------------------------------------- */

/**
 * An engine label with every SDWS and section reference carrying its version,
 * "V2.0 SDWS 13", as the paid site shows them — the maintainer's ruling of
 * 10 Oct 2026 (R22). The engine's own text is never edited; this is how the
 * screen shows it. A bare "SDWS n" takes the run's version.
 */
export function versionedSdws(text: string, version: 'V2.0' | 'V1.0' = 'V2.0'): string {
  return text
    .replace(/\bV2(?:\.0)? (?=SDWS|§|Table|Eq)/g, 'V2.0 ')
    .replace(/\bV1(?:\.0)? (?=SDWS|§|Table|Eq)/g, 'V1.0 ')
    .replace(/(?<!V[12]\.0 )\bSDWS ?(\d+)/g, `${version} SDWS $1`);
}

/* --------------------------------------------------------------------------
   The inputs, resolved once for the headline and the sheet.
   -------------------------------------------------------------------------- */

interface Resolved {
  method: QuantityMethod;
  isHwt: boolean;
  iso: string | null;
  needs: CalvinFieldKey[];
  fnrbRefusal?: FnrbRefusal;
  litres: number | undefined;
  days: number;
  quality: number;
  eta: number;
  usage: number | undefined;
}

function resolveInputs(input: CarbonInputs, method: QuantityMethod, isHwt: boolean): Resolved {
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
  // Activity emissions: does the system use energy, and how much (R17).
  if (!input.energySource) needs.push('energySource');
  else if (input.energySource.value !== 'none' && !input.energyAmount) needs.push('energyAmount');

  let fnrbRefusal: FnrbRefusal | undefined;
  if (iso) {
    const avail = fnrbAvailability(iso, undefined, input.fnrb?.value.value);
    if (!avail.ok) fnrbRefusal = avail.refusal;
  }

  return {
    method,
    isHwt,
    iso,
    needs,
    fnrbRefusal,
    litres: input.litres ? clampSlider(LITRES_SLIDER, input.litres.value) : undefined,
    days:
      (input.operationalDays ? clampSlider(DAYS_SLIDER, input.operationalDays.value) : undefined) ??
      (isHwt ? HWT_DAYS.value : DAYS_OPENING.value),
    quality: (input.waterQuality ? clampSlider(QUALITY_SLIDER, input.waterQuality.value) : undefined) ?? QUALITY_OPENING.value,
    eta: (input.eta ? clampSlider(ETA_SLIDER, input.eta.value) : undefined) ?? ETA_OPENING.value,
    usage: isHwt ? (input.usageRate ? clampSlider(USAGE_SLIDER, input.usageRate.value) : undefined) ?? USAGE_OPENING.value : undefined,
  };
}

/**
 * The engine's run on what is known, when there is enough to run it at all:
 * the class, the country, the people served and an fNRB the engine stands
 * behind. Its baseline mix may still be the engine's own preset on the bundle on
 * hand, so ONLY the values that do not depend on the fuel mix are ever read from
 * a run that is not complete — see `carbonSheet`. The device and energy answers
 * are passed when given; the run is the engine's, unedited.
 */
function engineRun(input: CarbonInputs, r: Resolved): { scenario: ScenarioResult; pop: NonNullable<ReturnType<typeof derivePopulation>>; scenarioInput: ScenarioInput } | null {
  if (!r.iso || !input.served || r.fnrbRefusal || r.needs.includes('householdSize')) return null;
  const pop = derivePopulation({
    countryIso: r.iso,
    method: r.method,
    populationMode: input.served.unit,
    populationCount: input.served.count,
    householdSizeOverride: input.householdSize?.value ?? null,
  });
  if (!pop) return null;
  const premises = r.method === 2 ? input.premises?.value ?? pop.households : undefined;
  const scenarioInput: ScenarioInput = {
    version: 'paa',
    method: r.method,
    mode: 'ex-ante',
    populationMode: input.served.unit,
    populationCount: input.served.count,
    countryIso: r.iso,
    volumeBasis: r.litres === undefined ? 'table9' : 'flat',
    litresPerPersonPerDay: r.litres ?? 0,
    operationalDays: r.days,
    premises,
    householdSizeOverride: input.householdSize?.value ?? null,
    fnrbOverride: input.fnrb?.value.value ?? null,
    M_qy: r.quality,
    etaOverride: r.eta,
    usageRate: r.usage,
    embodied: input.deviceClass && input.deviceUnits
      ? { unitsInYear: input.deviceUnits.value, category: input.deviceClass.value, route: EMBODIED_ROUTE }
      : undefined,
  };
  return { scenario: computeScenario(scenarioInput), pop, scenarioInput };
}

/** The carbon headline's outcome: none, a dash with its line and what to ask, or the engine's run. */
export function carbonOutcome(input: CarbonInputs): CarbonOutcome {
  const choice = chooseCalculators(input.type, input.gsClass).carbon;
  if (choice.method === null) {
    return { kind: 'none', reason: choice.reason, needs: choice.reason === 'no-class' ? ['gsClass'] : [] };
  }
  const r = resolveInputs(input, choice.method, choice.gsClass === 'HWT');
  const needs = r.needs;

  // The engine's own fNRB refusal is printed verbatim, and the visitor's own value with its source lifts it.
  if (r.fnrbRefusal) return { kind: 'dash', line: r.fnrbRefusal.message, needs: ['fnrb', ...needs] };
  if (r.iso && !hasClearedFuelData(r.iso)) return { kind: 'dash', line: BASELINE_FUEL_LINE, needs };
  if (needs.length > 0 || !input.energySource) return { kind: 'dash', line: stillNeededLine(needs), needs };
  // The engine carries no diesel or grid emission factor; an answered amount still leaves a dash.
  if (input.energySource.value !== 'none') {
    return { kind: 'dash', line: energyFactorLine(input.energySource.value), needs: [] };
  }

  const run = engineRun(input, r);
  if (!run) return { kind: 'dash', line: stillNeededLine(['served']), needs: ['served'] };
  const { scenario } = run;

  // Second guard: a run that fell back to the preset for either half is never shown.
  if (scenario.baselineMix.stove === 'preset' || scenario.baselineMix.fuel === 'preset') {
    return { kind: 'dash', line: BASELINE_FUEL_LINE, needs: [] };
  }

  return {
    kind: 'ok',
    scenario,
    result: scenario.result as PaaErOutput,
    values: usedValues(input, scenario, {
      method: r.method,
      isHwt: r.isHwt,
      days: r.days,
      quality: r.quality,
      eta: r.eta,
      usage: r.usage,
      litres: r.litres,
      premises: scenario.premises,
      pop: run.pop,
    }),
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

/** No source yet for C_b and U_p — the maintainer's ruling of 10 Oct 2026 (R16). */
const NO_SOURCE_YET = 'no source yet — to be found on the paid side for the new engine';

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
    eta: number;
    usage: number | undefined;
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
      tag: input.premises ? 'entered' : 'derived', source: { section: 'V2.0 SDWS 33' },
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
      source: { registryId: REG.ageShares, label: versionedSdws(scenario.table9.ageShares.label) },
    });
  }

  // Days: DP_p on household treatment (V2.0 SDWS 36), DO_p on community treatment and supply (V2.0 SDWS 32).
  const daysTag = sliderTag(input.operationalDays) ?? 'default';
  const daysOpening = ctx.isHwt ? HWT_DAYS : DAYS_OPENING;
  out.push({
    key: 'operationalDays', label: ctx.method === 2 ? 'Days present a year (DP_p)' : 'Days operational a year (DO_p)', value: ctx.days,
    unit: 'days / year', tag: daysTag,
    source: daysTag === 'default'
      ? { registryId: METHODOLOGY_V2_ID, section: daysOpening.section, page: daysOpening.page, label: daysOpening.label }
      : {},
  });

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
  const etaTag = sliderTag(input.eta) ?? 'default';
  out.push({
    key: 'eta', label: 'Stove efficiency (η)', value: ctx.eta, unit: 'fraction', tag: etaTag,
    source: etaTag === 'default'
      ? { registryId: METHODOLOGY_V2_ID, section: ETA_OPENING.section, page: ETA_OPENING.page, label: ETA_OPENING.label }
      : {},
  });
  const bp = provOf(scenario, 'baseline');
  out.push({
    key: 'combinedEF', label: 'Fuel emission factor, weighted', value: scenario.combinedEF, unit: 'tCO₂ / TJ',
    tag: 'derived', source: { label: bp?.label ? versionedSdws(bp.label) : undefined },
  });
  out.push({
    key: 'EF_b', label: 'Baseline emission factor per litre (EF_b)', value: (scenario.result as PaaErOutput).EF_b, unit: 'tCO₂e / L',
    tag: 'derived', source: { registryId: METHODOLOGY_V2_ID, section: 'Eq. 1–2' },
  });

  /* The engine's own values where nothing is entered. They are leaf inputs the
     run used, so they travel; the engine carries no registry row for them, so
     the source says exactly that rather than borrowing one (R16). */
  const r = scenario.result as PaaErOutput;
  out.push({
    key: 'C_b', label: 'Share already using safe water (C_b)', value: 0, unit: 'fraction', tag: 'default',
    source: { section: 'V2.0 SDWS 12', label: NO_SOURCE_YET },
  });
  out.push({
    key: 'X_cleanboil', label: 'Share boiling water that is already clean (X_cleanboil)', value: 0, unit: 'fraction', tag: 'default',
    source: { section: 'V2.0 SDWS 26', label: "the engine's ex-ante value when none is entered; cleared data replaces it with a new sealed engine" },
  });
  if (ctx.isHwt) {
    const uTag = sliderTag(input.usageRate) ?? 'default';
    out.push({
      key: 'U_p', label: 'Usage rate (U_p)', value: ctx.usage ?? USAGE_OPENING.value, unit: 'fraction', tag: uTag,
      source: uTag === 'default' ? { section: USAGE_OPENING.section, label: NO_SOURCE_YET } : {},
    });
  }
  out.push({
    key: 'energySource', label: 'Energy the system uses to run', value: 'none', unit: '', tag: 'entered', source: {},
  });
  out.push({
    key: 'AE', label: 'Activity emissions (AE)', value: r.PE, unit: 'tCO₂e', tag: 'default',
    source: { registryId: METHODOLOGY_V2_ID, section: 'Eq. 14', label: 'zero for a technology that uses no energy' },
  });

  // Leakage and embodied emissions — the methodology's defaults, by the engine's labels.
  const lp = provOf(scenario, 'leakage');
  out.push({
    key: 'leakageOption', label: 'Market leakage', value: 'Option 1, 2%', unit: '', tag: tagFor(lp?.source ?? 'default'),
    source: { registryId: METHODOLOGY_V2_ID, label: lp?.label ? versionedSdws(lp.label) : undefined },
  });
  const cat = EMBODIED_CATEGORIES[input.deviceClass!.value];
  out.push({
    key: 'deviceClass', label: 'Kind of device', value: cat.label, unit: '', tag: 'entered', source: {},
  });
  out.push({
    key: 'embodiedFactor', label: 'Embodied emissions per unit', value: cat.factor, unit: 'tCO₂e / unit', tag: 'default',
    source: { registryId: REG.embodied, label: versionedSdws(cat.cite) },
  });
  out.push({
    key: 'embodiedRoute', label: 'Embodied emissions spread over', value: 'five years (Eq. 19)', unit: '', tag: 'default',
    source: { registryId: METHODOLOGY_V2_ID, label: versionedSdws(EMBODIED_ROUTE_CITE) },
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

/* --------------------------------------------------------------------------
   5. The sheet — what the screen draws, built here so the screen computes
   nothing (§2.2). The paid calculator's blocks, order, row style and tag words,
   from the look reference she carried on 10 Oct 2026 (R10).

   THE FUEL LINE. Values that depend on the baseline fuel mix — EF_b and
   everything downstream of it, the fuel factors, X_cleanboil — are read only
   from a complete run, and are dashes otherwise. Values that do not — the
   people, the litres, the water volume, SE from the stove slider, fNRB, DAF —
   are read from the engine's run as soon as there is enough to run it, because
   none of them moves with the fuel mix. On the bundle on hand every carbon
   headline is a dash and the quantity rows still show the engine's figures.
   -------------------------------------------------------------------------- */

export type Mark = 'baseline' | 'monitoring';

/** One row under a derivation's "where". */
export interface SheetLine {
  key: string;
  label: string;
  /** "V2.0 SDWS 11" — the data sheet the value belongs to. */
  chip?: string;
  /** Null draws an em dash. */
  value: number | string | null;
  unit?: string;
  tag?: Tag;
  mark?: Mark;
  /** The grey line under the label: the opening, the source, what is missing. */
  note?: string;
  /** Where the value is cited, for a link. */
  source?: ValueSource;
  /** A slider instead of a value box; its position is `value`. */
  slider?: SliderKey;
  /** A row the visitor types; the screen draws its box. */
  field?: CalvinFieldKey;
  /** A line in a visitor's words that fires on the value — the 347 note. */
  warn?: string;
}

export interface Derivation {
  key: string;
  symbol: string;
  title: string;
  eq: string;
  /** "per GS4GG PAA M400-12 V2.0 §7.3.8". */
  per: string;
  /** One plain sentence, a visitor's words. */
  plain: string;
  formula: string;
  where: SheetLine[];
  /** A figure, or words for a row whose value is a choice (the baseline profile); null draws an em dash. */
  value: number | string | null;
  unit: string;
  /** What the dash is waiting on, when the value is a dash. */
  dashLine?: string;
  /** A flag beside the value — "filter limit not checked". */
  flag?: string;
  /** A panel under the rows: the amber "official regional value", or an engine refusal. */
  panel?: { kind: 'amber' | 'refusal'; title: string; text: string; field?: CalvinFieldKey };
}

export interface SheetBlock {
  key: 'BE' | 'ADJ' | 'AE' | 'LE' | 'ER';
  title: string;
  derivations: Derivation[];
}

export interface CarbonSheet {
  outcome: CarbonOutcome;
  /** "Method 1" or "Method 2"; null when no carbon calculation runs. */
  methodLabel: string | null;
  /** The four summary figures; each null until it can be shown. */
  summary: { erPerPerson: number | null; efb: number | null; qy: number | null; total: number | null };
  blocks: SheetBlock[];
  /**
   * The paid page's version tabs. Built always; shown only for a project
   * Phoebe sorted as transitioning (R25). The Legacy side needs the filed V1.0
   * fNRB, and shows the engine's refusal until it is given.
   */
  transition: {
    shown: boolean;
    legacy: number | null;
    paa: number | null;
    delta: number | null;
    refusal?: FiledFnrbRefusal;
  };
}

const PER = 'per GS4GG PAA M400-12 V2.0';

/** Where the engine refuses fNRB it does not run at all, so the rows that need its run say so once, briefly. */
export const FNRB_WAIT_LINE = 'The engine runs once an fNRB is given — see the fNRB panel.';
const ML = 1e6;

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function sharesWords(shares: Record<string, number | undefined> | undefined, names: Record<string, string>): string | null {
  if (!shares) return null;
  const parts = Object.entries(shares)
    .filter(([, v]) => typeof v === 'number' && v > 0)
    .map(([k, v]) => `${names[k] ?? k} ${pct(v as number)}`);
  return parts.length ? parts.join(' · ') : null;
}

const STOVE_NAMES: Record<string, string> = {
  threeStone: 'three-stone / conventional',
  otherConventional: 'other conventional biomass',
  ics: 'improved cookstove',
  fossil: 'fossil fuel system',
};
const FUEL_NAMES: Record<string, string> = {
  wood: 'wood', charcoal: 'charcoal', lpg: 'LPG', kerosene: 'kerosene', coal: 'coal', electricity: 'electricity',
};

/** Where a slider sits: its value, its tag, its note. */
function sliderLine(
  pos: SliderPosition | undefined,
  opening: { label: string; section: string; page: string },
  openingValue: string,
): { tag: Tag; note: string } {
  const tag = sliderTag(pos) ?? 'default';
  const where = [opening.section, opening.page].filter(Boolean).join(', ');
  const note =
    tag === 'default'
      ? `default ${openingValue} — ${opening.label}${where ? `, ${where}` : ''}`
      : tag === 'assumed'
        ? `a figure you set, not the default (${openingValue}, ${where})`
        : 'entered';
  return { tag, note };
}

/** The sheet the screen draws, row for row. */
export function carbonSheet(input: CarbonInputs): CarbonSheet {
  const outcome = carbonOutcome(input);
  const choice = chooseCalculators(input.type, input.gsClass).carbon;
  const transitioning = input.versionFlag === 'transitioning';

  const empty: CarbonSheet = {
    outcome,
    methodLabel: null,
    summary: { erPerPerson: null, efb: null, qy: null, total: null },
    blocks: [],
    transition: { shown: false, legacy: null, paa: null, delta: null },
  };
  if (choice.method === null) return empty;

  const r = resolveInputs(input, choice.method, choice.gsClass === 'HWT');
  const run = engineRun(input, r);
  const sc = run?.scenario;
  const full = outcome.kind === 'ok' ? outcome.result : undefined;
  const people = sc?.people ?? null;

  /* What a dash in the fuel-dependent rows is waiting on: the fuel line first,
     because nothing the visitor can give lifts it on the bundle on hand. */
  const fuelDash =
    outcome.kind === 'dash' ? outcome.line : outcome.kind === 'none' ? '' : undefined;
  const quantityDash = !sc
    ? r.fnrbRefusal
      ? FNRB_WAIT_LINE
      : stillNeededLine(r.needs.filter((k) => k === 'country' || k === 'served' || k === 'householdSize'))
    : undefined;

  /* -------- Baseline emissions (BE) -------- */
  const stoveShares = full ? sharesWords(sc?.baselineMix.shares?.stove as Record<string, number> | undefined, STOVE_NAMES) : null;
  const fuelShares = full ? sharesWords(sc?.baselineMix.shares?.fuel as Record<string, number> | undefined, FUEL_NAMES) : null;
  const profile: Derivation = {
    key: 'profile',
    symbol: 'profile',
    title: 'Baseline profile (stoves & fuel replaced)',
    eq: 'Eq.–',
    per: `${PER} §7.3.7`,
    plain: 'The old way people made water safe: the stoves and fuels the project replaces. They set the emission factor.',
    formula: 'profile = stove shares × fuel shares',
    where: [
      {
        key: 'stoveShares', label: 'stove shares — share of premises, %', chip: 'V2.0 SDWS 6', mark: 'baseline',
        value: stoveShares, tag: full ? 'default' : undefined,
        note: full ? versionedSdws(sc!.baselineMix.country?.stove?.label ?? '') : BASELINE_FUEL_LINE,
      },
      {
        key: 'fuelShares', label: 'fuel shares — share of boiling fuel, %', chip: 'V2.0 SDWS 8', mark: 'baseline',
        value: fuelShares, tag: full ? 'default' : undefined,
        note: full ? versionedSdws(sc!.baselineMix.country?.fuel?.label ?? '') : BASELINE_FUEL_LINE,
      },
    ],
    value: null,
    unit: '',
    dashLine: full ? undefined : BASELINE_FUEL_LINE,
  };
  // The profile row's own value is words, not a figure: which mix is in force.
  const profileWords = full ? 'baseline mix — country default' : null;

  const etaPos = sliderLine(input.eta, ETA_OPENING, pct(ETA_OPENING.value));
  const se: Derivation = {
    key: 'SE',
    symbol: 'SE',
    title: 'Energy to boil one litre',
    eq: 'Eq.2',
    per: `${PER} §7.3.8`,
    plain: 'The energy it took to make one litre safe on the old stove. A more efficient stove needed less, so fewer credits.',
    formula: 'SE = 360.83 / η',
    where: [
      {
        key: 'eta', label: 'η — baseline stove efficiency', chip: ETA_OPENING.section, mark: 'baseline',
        value: r.eta, unit: '%', tag: etaPos.tag, note: etaPos.note, slider: 'eta',
        source: { registryId: METHODOLOGY_V2_ID, section: ETA_OPENING.section, page: ETA_OPENING.page },
      },
      {
        key: 'SE_o', label: 'energy to boil a litre, before the stove', value: DEFAULT_SE_O, unit: 'kJ/L', tag: 'default',
        note: 'V2.0 §7.3.8, Eq. 2, p. 29',
        source: { registryId: METHODOLOGY_V2_ID, section: '§7.3.8, Eq. 2', page: 'p. 29' },
      },
    ],
    value: sc ? sc.SE : null,
    unit: 'kJ/L',
    dashLine: sc ? undefined : quantityDash,
  };

  const fnrbProv = sc ? provOf(sc, 'fNRB') : undefined;
  const fnrbFootnote = (fnrbJson as unknown as { vintages: Record<string, { multiNational?: { footnote5: string } }>; defaultVintage: string });
  const footnote5 = fnrbFootnote.vintages[fnrbFootnote.defaultVintage]?.multiNational?.footnote5 ?? '';
  const efb: Derivation = {
    key: 'EF_b',
    symbol: 'EF_b',
    title: 'Emissions per litre boiled (baseline)',
    eq: 'Eq.1',
    per: `${PER} §7.3.7`,
    plain: 'The greenhouse gas released for each litre boiled the old way. The bigger it is, the more the project avoids.',
    formula: 'EF_b = SE · Σ f_i · (EF_CO₂ · fNRB + EF_nonCO₂) / 10⁹',
    where: [
      { key: 'SE', label: 'SE (Eq.2)', value: sc ? sc.SE : null, unit: 'kJ/L', tag: sc ? 'derived' : undefined },
      {
        key: 'combinedEF', label: 'EF_CO₂ and EF_nonCO₂ — the fuels’ factors, CH₄ + N₂O (AR5)', chip: 'V2.0 SDWS 9',
        value: full ? sc!.combinedEF : null, unit: 'tCO₂/TJ', tag: full ? 'default' : undefined,
        note: full ? undefined : BASELINE_FUEL_LINE,
      },
      {
        key: 'fNRB', label: 'fNRB — non-renewable biomass · vintage', chip: 'V2.0 SDWS 25',
        value: sc ? sc.fNRB : null,
        tag: sc ? (input.fnrb ? 'entered' : 'default') : undefined,
        note: sc
          ? input.fnrb
            ? `entered — ${input.fnrb.value.source}`
            : fnrbProv?.label
          : r.fnrbRefusal
            ? undefined
            : quantityDash,
        field: r.fnrbRefusal || input.fnrb ? 'fnrb' : undefined,
        source: input.fnrb ? undefined : { registryId: 'a64-amt-009-fnrb' },
      },
    ],
    value: full ? full.EF_b : null,
    unit: 'tCO₂e/L',
    dashLine: full ? undefined : fuelDash,
    panel: r.fnrbRefusal
      ? { kind: 'refusal', title: 'No official fNRB default', text: r.fnrbRefusal.message, field: 'fnrb' }
      : sc?.fnrbMultiNational
        ? {
            kind: 'amber',
            title: 'No national value — official regional value',
            /* Footnote 5, as the data file holds it. The engine's own condition
               sentence names the fuel mix, which on the bundle on hand is the
               preset's, so it is shown only on a complete run. */
            text: full ? sc.fnrbMultiNational.condition : `${footnote5} The fuel mix is not on this site yet.`,
          }
        : undefined,
  };

  /* People, households and household size, as the engine derived them (§5). */
  const served = input.served;
  const pop = run?.pop;
  const peopleLines: SheetLine[] = [];
  if (served?.unit === 'households') {
    peopleLines.push({ key: 'households', label: 'Households served', value: served.count, tag: 'entered', field: 'served', note: 'from the project record' });
    peopleLines.push({
      key: 'people', label: 'People served', value: pop ? pop.people : null, tag: pop ? 'derived' : undefined,
      note: pop ? `${served.count.toLocaleString('en-GB')} households × ${pop.householdSize} — ${versionedSdws(pop.prov.label)}` : quantityDash,
    });
  } else {
    peopleLines.push({
      key: 'people', label: 'People served', value: served ? served.count : null, tag: served ? 'entered' : undefined,
      field: 'served', note: served ? 'from the project record' : CALVIN_FIELDS.served.whereFrom,
    });
  }
  const litresPos = sliderLine(input.litres, { label: 'Table 9, weighted by the country’s age shares', section: 'V2.0 §7.3.11', page: 'p. 31' }, 'Table 9');
  const qpwLine: SheetLine = {
    key: 'litres', label: 'QPW_p — litres / person / day', chip: 'V2.0 SDWS 29', mark: 'baseline',
    value: sc ? sc.qpwEffective : r.litres ?? null, unit: 'L', tag: sc || input.litres ? litresPos.tag : undefined,
    note: input.litres ? litresPos.note : sc ? `default — ${versionedSdws(provOf(sc, 'volume')?.label ?? '')}` : quantityDash,
    slider: 'litres',
    source: { registryId: METHODOLOGY_V2_ID, section: 'Table 9, §7.3.11', page: 'p. 31' },
  };
  const ageLine: SheetLine | null = sc?.table9
    ? {
        key: 'ageShares', label: 'age split — share of people, % (under 5, 5–18, 19+)', chip: 'V2.0 SDWS 30', mark: 'baseline',
        value: `${pct(sc.table9.ageShares.under5)} · ${pct(sc.table9.ageShares.age5_18)} · ${pct(sc.table9.ageShares.adult19plus)}`,
        tag: 'default',
        note: `${versionedSdws(sc.table9.ageShares.label)} · weighted volume ${sc.qpwEffective.toLocaleString('en-GB', { maximumFractionDigits: 3 })} L / person / day`,
        source: { registryId: REG.ageShares },
      }
    : null;
  const daysOpening = r.isHwt ? HWT_DAYS : DAYS_OPENING;
  const daysPos = sliderLine(input.operationalDays, daysOpening, String(daysOpening.value));
  const daysLine: SheetLine = {
    key: 'operationalDays',
    label: r.isHwt ? 'DP — days present / yr' : 'DO — operational days / yr',
    chip: daysOpening.section, mark: 'monitoring',
    value: r.days, unit: 'd', tag: daysPos.tag, note: daysPos.note, slider: 'operationalDays',
    /* The 347 rule is DO_p's (V2.0 SDWS 32); days present on household treatment are not held to it. */
    warn: !r.isHwt && r.days > DAYS_SENSOR_THRESHOLD ? DAYS_ABOVE_THRESHOLD_LINE : undefined,
    source: { registryId: METHODOLOGY_V2_ID, section: daysOpening.section, page: daysOpening.page },
  };

  const quantity: Derivation[] = [];
  if (r.method === 1) {
    quantity.push({
      key: 'Q_pop', symbol: 'Q_pop', title: 'Clean water the community uses / yr', eq: 'Eq.5',
      per: `${PER} §7.3.10(a)`,
      plain: 'The clean water the people served would drink in a year: people, times litres a day, times days.',
      formula: 'Q_pop = people · QPW_p · DO_p',
      where: [...peopleLines, qpwLine, ...(ageLine ? [ageLine] : []), daysLine],
      value: sc ? sc.Q_pop / ML : null, unit: 'ML/yr', dashLine: sc ? undefined : quantityDash,
    });
  } else {
    const deviceProv = sc ? provOf(sc, 'device') : undefined;
    const sizeLine: SheetLine = {
      key: 'householdSize', label: 'Household size', mark: 'baseline',
      value: pop ? pop.householdSize : null, tag: pop ? (input.householdSize ? 'entered' : 'default') : undefined,
      field: r.needs.includes('householdSize') || input.householdSize ? 'householdSize' : undefined,
      note: pop ? versionedSdws(pop.prov.label) : r.needs.includes('householdSize') ? 'The UN file has no figure for this country; type the project’s own.' : quantityDash,
      source: input.householdSize ? undefined : { registryId: REG.household },
    };
    const premisesLine: SheetLine = {
      key: 'premises', label: 'Households served (N_p)', chip: 'V2.0 SDWS 33', mark: 'monitoring',
      value: sc?.premises ?? null, tag: sc ? (input.premises ? 'entered' : served?.unit === 'households' ? 'entered' : 'derived') : undefined,
      field: 'premises',
      note: sc && !input.premises && served?.unit === 'people' ? `people ÷ household size — the engine's derivePopulation` : undefined,
    };
    quantity.push({
      key: 'QPW_hh', symbol: 'QPW_hh', title: 'Clean water per premises / day', eq: 'Eq.7',
      per: `${PER} §7.3.10(b)`,
      plain: 'The safe water each home gets a day: what the people in it can drink, and no more than the device can treat.',
      formula: 'QPW_hh = min( q_i · t_p · DN_p , HN_p · QPW_p )',
      where: [
        sizeLine,
        ...peopleLines.filter((l) => l.key !== 'households'),
        premisesLine,
        qpwLine,
        ...(ageLine ? [ageLine] : []),
        {
          key: 'deviceCapacity', label: 'q_i — device capacity (L/h)', chip: 'V2.0 SDWS 13', mark: 'baseline',
          value: null, note: deviceProv ? versionedSdws(deviceProv.label) : 'device capacity q_i (V2.0 SDWS 13) not entered — Eq.7 device limit not evaluated',
        },
      ],
      value: sc?.qpwPerPremises ?? null, unit: 'L/prem·d',
      dashLine: sc ? undefined : quantityDash,
      flag: sc && !sc.deviceLimitEvaluated ? 'filter limit not checked' : undefined,
    });
    quantity.push({
      key: 'Q_pop', symbol: 'Q_pop', title: 'Clean water all premises use / yr', eq: 'Eq.6',
      per: `${PER} §7.3.10(b)`,
      plain: 'The clean water all the homes use in a year: homes, times water a home a day, times the days the device is there.',
      formula: 'Q_pop = N_p · QPW_hh · DP_p',
      where: [
        { key: 'N_p', label: 'N_p — premises (Eq.7)', value: sc?.premises ?? null, tag: sc ? 'derived' : undefined },
        { key: 'QPW_hh', label: 'QPW_hh — per-premises volume (Eq.7)', value: sc?.qpwPerPremises ?? null, unit: 'L/prem·d', tag: sc ? 'derived' : undefined },
        { key: 'U_p_note', label: 'U_p, the usage rate, is applied in Eq. 8, below', value: null, note: undefined },
        daysLine,
      ],
      value: sc ? sc.Q_pop / ML : null, unit: 'ML/yr', dashLine: sc ? undefined : quantityDash,
    });
  }
  const qy = sc ? (sc.result as PaaErOutput).Q_y : null;
  quantity.push({
    key: 'Q_y', symbol: 'Q_y', title: 'Credited water volume', eq: 'Eq.4',
    per: `${PER} §7.3.10(a)`,
    plain: 'The water that counts: what people can drink, or what the project supplies if that is less.',
    formula: r.method === 1 ? 'Q_y = min( Q_pop , Q_m )' : 'Q_y = Q_pop',
    where: [
      { key: 'Q_pop', label: `Q_pop (Eq.${r.method === 1 ? 5 : 6})`, value: sc ? sc.Q_pop / ML : null, unit: 'ML/yr', tag: sc ? 'derived' : undefined },
      ...(r.method === 1
        ? [{
            key: 'Q_m', label: 'Q_m — metered volume / planned production / yr', chip: 'V2.0 SDWS 28', mark: 'monitoring' as Mark,
            value: null, note: 'Not entered — the people served set the volume.',
          }]
        : []),
    ],
    value: qy !== null ? qy / ML : null, unit: 'ML/yr', dashLine: sc ? undefined : quantityDash,
  });

  /* -------- Adjustments → crediting baseline -------- */
  const qPos = sliderLine(input.waterQuality, QUALITY_OPENING, pct(QUALITY_OPENING.value));
  const adjWhere: SheetLine[] = [
    {
      key: 'X_cleanboil', label: 'X_cleanboil,y — still boiling the safe water', chip: 'V2.0 SDWS 26', mark: 'monitoring',
      value: full ? 0 : null, tag: full ? 'default' : undefined,
      note: full ? "the engine's ex-ante value" : 'Worked from the baseline fuel data, which is not on this site yet.',
    },
    {
      key: 'waterQuality', label: 'M_q,y — water-quality modifier', chip: QUALITY_OPENING.section.split(';')[0], mark: 'monitoring',
      value: r.quality, unit: '%', tag: qPos.tag, note: qPos.note, slider: 'waterQuality',
      source: { registryId: METHODOLOGY_V2_ID, section: QUALITY_OPENING.section, page: QUALITY_OPENING.page },
    },
  ];
  if (r.isHwt) {
    const uPos = sliderLine(input.usageRate, USAGE_OPENING, pct(USAGE_OPENING.value));
    adjWhere.push({
      key: 'usageRate', label: 'U_p,y — usage rate', chip: USAGE_OPENING.section, mark: 'monitoring',
      value: r.usage ?? USAGE_OPENING.value, unit: '%', tag: uPos.tag,
      note: uPos.tag === 'default' ? `default ${pct(USAGE_OPENING.value)} — ${NO_SOURCE_YET}` : uPos.note,
      slider: 'usageRate',
    });
  }
  const adjustments: Derivation[] = [
    {
      key: 'Q_adj', symbol: 'Q_y,adj', title: 'Adjusted quantity (behaviour & quality)', eq: 'Eq.8',
      per: `${PER} §7.4.1`,
      plain: 'The water volume after three checks: people who still boil it, water tests that fail, and homes that stop using the device.',
      formula: r.isHwt ? 'Q_y,adj = Q_y · (1 − X_cleanboil,y) · M_q,y · U_p,y' : 'Q_y,adj = Q_y · (1 − X_cleanboil,y) · M_q,y',
      where: adjWhere,
      value: full ? full.Q_adj / ML : null, unit: 'ML/yr', dashLine: full ? undefined : fuelDash,
    },
    {
      key: 'BE_unc', symbol: 'BE_unc,y', title: 'Emissions avoided (before ambition adj.)', eq: 'Eq.9',
      per: `${PER} §7.4.4`,
      plain: 'The emissions avoided, after setting aside people who already had safe water.',
      formula: 'BE_unc,y = EF_b · (1 − C_b) · Q_y,adj',
      where: [
        {
          key: 'C_b', label: 'C_b — already-safe share', chip: 'V2.0 SDWS 12', mark: 'baseline',
          value: 0, tag: 'default', note: `default 0 — ${NO_SOURCE_YET}`,
        },
      ],
      value: full ? full.BE_u : null, unit: 'tCO₂e', dashLine: full ? undefined : fuelDash,
    },
    {
      key: 'BE_y', symbol: 'BE_y', title: 'Crediting baseline (after ambition adj.)', eq: 'Eq.10–12',
      per: `${PER} §7.4.5–7.6`,
      plain: 'A small yearly cut, set by country, keeps claims ambitious; the lower of the two figures counts.',
      formula: 'BE_y = min( BE_unc,y · (1 − DAF) , BAU_y )',
      where: [
        {
          key: 'DAF', label: 'DAF — downward adjustment (457 tool)',
          value: sc ? sc.DAF : null, tag: sc ? tagFor(provOf(sc, 'DAF')?.source ?? 'default') : undefined,
          note: sc ? provOf(sc, 'DAF')?.label : quantityDash,
          source: { registryId: REG.daf },
        },
      ],
      value: full ? full.BE_CB : null, unit: 'tCO₂e', dashLine: full ? undefined : fuelDash,
    },
  ];

  /* -------- Activity emissions (AE) -------- */
  const energy = input.energySource?.value;
  const activity: Derivation = {
    key: 'AE', symbol: 'AE_y', title: 'Emissions from running the new system', eq: 'Eq.14',
    per: `${PER} §8.2`,
    plain: 'Emissions from running the new system: fuel or grid power for its pumps. Zero for a system that uses no energy.',
    formula: 'AE_y = AE_fuel,y + AE_elec,y',
    where: [
      {
        key: 'energySource', label: 'energy the system uses — diesel, grid electricity or none', field: 'energySource',
        value: energy ?? null, tag: energy ? 'entered' : undefined,
        note: energy ? undefined : CALVIN_FIELDS.energySource.whereFrom,
      },
      ...(energy && energy !== 'none'
        ? [{
            key: 'energyAmount', label: energy === 'diesel' ? 'diesel a year (V2.0 SDWS 38)' : 'grid electricity a year (V2.0 SDWS 39)',
            field: 'energyAmount' as CalvinFieldKey,
            value: input.energyAmount?.value ?? null, unit: energy === 'diesel' ? 'L/yr' : 'kWh/yr',
            tag: input.energyAmount ? ('entered' as Tag) : undefined,
            note: energyFactorLine(energy),
          }]
        : []),
    ],
    value: energy === 'none' ? 0 : null,
    unit: 'tCO₂e',
    dashLine: energy === 'none' ? undefined : energy ? energyFactorLine(energy) : stillNeededLine(['energySource']),
  };

  /* -------- Leakage (LE) -------- */
  const cat = input.deviceClass ? EMBODIED_CATEGORIES[input.deviceClass.value] : undefined;
  const leakage: Derivation = {
    key: 'LE', symbol: 'LE_y', title: 'Emissions that shift elsewhere', eq: 'Eq.17',
    per: `${PER} §9.1.1`,
    plain: 'Emissions the project moves elsewhere: making the devices, and changes in local markets.',
    formula: 'LE_y = LE_emb,y + LE_Market,y',
    where: [
      {
        key: 'deviceClass', label: 'kind of device (Table 10)', chip: 'V2.0 SDWS 21', field: 'deviceClass',
        value: cat ? cat.label : null, tag: cat ? 'entered' : undefined,
        note: cat ? undefined : 'Embodied emissions are never zero; the kind of device is needed.',
      },
      {
        key: 'deviceUnits', label: 'new units this year', chip: 'V2.0 SDWS 41', mark: 'monitoring', field: 'deviceUnits',
        value: input.deviceUnits?.value ?? null, tag: input.deviceUnits ? 'entered' : undefined,
      },
      {
        key: 'embodiedFactor', label: 'LE_emb — embodied emissions of the devices, per unit',
        value: cat ? cat.factor : null, unit: 'tCO₂e/unit', tag: cat ? 'default' : undefined,
        note: cat ? `${versionedSdws(cat.cite)}; spread over the first five years — ${versionedSdws(EMBODIED_ROUTE_CITE)} (Eq.19)` : undefined,
        source: { registryId: REG.embodied },
      },
      {
        key: 'LE_market', label: 'LE_Market — market leakage', chip: 'V2.0 SDWS 40',
        value: full ? full.LE_market : null, unit: 'tCO₂e', tag: full ? 'derived' : undefined,
        note: 'Option 1: 2% of net reductions (V2.0 §9.3.2, Eq.20)',
      },
    ],
    value: full ? full.LE : null, unit: 'tCO₂e', dashLine: full ? undefined : fuelDash,
  };

  /* -------- Emission reductions (credits) -------- */
  const credits: Derivation = {
    key: 'ER', symbol: 'ER_y', title: 'Emission reductions — the credits', eq: 'Eq.22',
    per: `${PER} §10.1`,
    plain: 'The credits: the crediting baseline, less the new system’s own emissions and the leakage.',
    formula: 'ER_y = BE_y − AE_y − LE_y',
    where: [
      { key: 'BE_CB', label: 'BE_CB — crediting baseline', value: full ? full.BE_CB : null, unit: 'tCO₂e', tag: full ? 'derived' : undefined },
      { key: 'PE', label: 'PE — project emissions', value: full ? full.PE : null, unit: 'tCO₂e', tag: full ? 'derived' : undefined },
      { key: 'LE', label: 'LE — leakage', value: full ? full.LE : null, unit: 'tCO₂e', tag: full ? 'derived' : undefined },
      {
        key: 'total', label: 'Total over the first crediting period (five years, V2.0 p. 5)',
        value: full ? full.ER * 5 : null, unit: 'tCO₂e', tag: full ? 'derived' : undefined,
      },
    ],
    value: full ? full.ER : null, unit: 'tCO₂e/yr', dashLine: full ? undefined : fuelDash,
  };

  /* -------- The version tabs (R25) -------- */
  let transition: CarbonSheet['transition'] = { shown: transitioning, legacy: null, paa: full ? full.ER : null, delta: null };
  if (transitioning) {
    const avail = transitionAvailability(input.fnrbFiledV1?.value.value);
    if (!avail.ok) {
      /* The engine's own sentence, verbatim; its cite with every SDWS reference versioned (R22). */
      transition = { ...transition, refusal: { ...avail.refusal, cite: versionedSdws(avail.refusal.cite, 'V1.0') } };
    } else if (full && run) {
      const w = computeTransitionWaterfall({ ...run.scenarioInput, fnrbFiledV1: input.fnrbFiledV1!.value.value });
      transition = { shown: true, legacy: w.legacyER, paa: w.paaER, delta: w.delta };
    }
  }

  return {
    outcome,
    methodLabel: `Method ${r.method}`,
    summary: {
      erPerPerson: full && people ? full.ER / people : null,
      efb: full ? full.EF_b : null,
      qy: qy !== null ? qy / ML : null,
      total: full ? full.ER * 5 : null,
    },
    blocks: [
      { key: 'BE', title: 'Baseline emissions (BE)', derivations: [{ ...profile, value: profileWords }, se, efb, ...quantity] },
      { key: 'ADJ', title: 'Adjustments → crediting baseline', derivations: adjustments },
      { key: 'AE', title: 'Activity emissions (AE)', derivations: [activity] },
      { key: 'LE', title: 'Leakage (LE)', derivations: [leakage] },
      { key: 'ER', title: 'Emission reductions (credits)', derivations: [credits] },
    ],
    transition,
  };
}

/**
 * The people count the water column takes, so the two columns cannot disagree
 * about who is served (§2.5): the engine's own derivation where households were
 * said, the count as said where people were. Null until it can be known.
 */
export function peopleForWater(input: CarbonInputs): { people: number; derived: boolean } | null {
  const served = input.served;
  if (!served) return null;
  if (served.unit === 'people') return { people: served.count, derived: false };
  const iso = input.country && M49_ROWS[input.country] ? input.country : null;
  if (!iso) return null;
  if (!HOUSEHOLD.countries[iso] && input.householdSize === undefined) return null;
  const pop = derivePopulation({
    countryIso: iso,
    method: 1,
    populationMode: 'households',
    populationCount: served.count,
    householdSizeOverride: input.householdSize?.value ?? null,
  });
  return pop ? { people: pop.people, derived: true } : null;
}
