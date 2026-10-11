/**
 * Calvin's fields — the one closed list of what a visitor may type into his
 * sheet, or he may fill from chat, and the six sliders.
 *
 * Calvin's brief, §6 and §4 (PROPOSAL_calvin-brief.md), with the maintainer's
 * rulings of 10 Oct 2026. Every SDWS reference here carries its version, "V2.0
 * SDWS 32", as the paid site's do (R22). ONE HOME, read by the screen, the wrapper
 * (lib/calvinEngine) and, from pull request C, the prompt generator, so what
 * each input is, why it matters, what kind of value it takes and where it
 * usually comes from is never typed twice.
 *
 * EVERY VALUE IS CHECKED HERE, NOT TRUSTED. `read` takes whatever arrived — a
 * typed box, a fill from Calvin's answer — and returns the value or undefined.
 * Undefined means "not given", never zero.
 *
 * Plain TypeScript, no bundler-only imports, so a check script can load it.
 */

import { EMBODIED_CATEGORIES, type EmbodiedCategory } from '../../engine/calculators/gs4gg-carbon/scenario';
import { QPW_PERSON_CAP_DEFAULT } from '../../engine/calculators/gs4gg-carbon/quantity';
import { DEFAULT_STOVE_ETA } from '../../engine/calculators/gs4gg-carbon/presets';
import m49Json from '../../engine/calculators/data/regions/un-m49.json';
import { GS_CLASS_IDS, type GsClassId } from './projectTypes.generated';
import type { Served } from './visit';
import { LPCD_FULL, LPCD_LIMITED } from './vwbaD3';

/* --------------------------------------------------------------------------
   The country, matched against the engine's own UN M49 table.
   -------------------------------------------------------------------------- */

const M49 = (m49Json as unknown as { countries: Record<string, { name: string }> }).countries;

/** The M49 name for an ISO3 code, or undefined when the table has no such row. */
export function countryName(iso: string): string | undefined {
  return M49[iso]?.name;
}

/**
 * The country a place names, when exactly one M49 country name — or one of our
 * common names for one, below — appears in it as whole words. "Near Lilongwe,
 * Malawi" names Malawi; "Arusha, Tanzania" names the United Republic of Tanzania. A place that names none, or
 * two that are not one inside the other, returns undefined and Calvin asks —
 * a guessed country would unlock the wrong fNRB, DAF and household size.
 * Where one matched name sits inside another ("Guinea" in "Equatorial
 * Guinea"), the longer one stands.
 */
/**
 * COMMON NAMES FOR UN M49 COUNTRIES — OURS, NOT THE UN'S. The maintainer's
 * ruling of 10 Oct 2026 (R21). Many M49 names are formal ("United Republic of
 * Tanzania", "Viet Nam", "Bolivia (Plurinational State of)"), so a visitor who
 * says "Tanzania" would otherwise be asked again. Each alias only points at an
 * M49 row; the country shown and used is always that row's own name. Never a
 * value, never shown. A name that could mean two countries ("Congo", "Korea")
 * is left out on purpose, so Calvin asks — and "Congo" alone, which is also the
 * Republic of the Congo's own M49 name, is set aside in AMBIGUOUS_NAMES below.
 */
export const COUNTRY_ALIASES: Readonly<Record<string, string>> = {
  tanzania: 'TZA',
  drc: 'COD',
  'dr congo': 'COD',
  'democratic republic of congo': 'COD',
  'congo brazzaville': 'COG',
  'republic of the congo': 'COG',
  'ivory coast': 'CIV',
  "cote d'ivoire": 'CIV',
  "côte d'ivoire": 'CIV',
  bolivia: 'BOL',
  venezuela: 'VEN',
  iran: 'IRN',
  laos: 'LAO',
  vietnam: 'VNM',
  syria: 'SYR',
  russia: 'RUS',
  'south korea': 'KOR',
  'north korea': 'PRK',
  moldova: 'MDA',
  uk: 'GBR',
  'united kingdom': 'GBR',
  britain: 'GBR',
  'great britain': 'GBR',
  usa: 'USA',
  'united states': 'USA',
  micronesia: 'FSM',
  swaziland: 'SWZ',
  'cape verde': 'CPV',
  turkey: 'TUR',
  'czech republic': 'CZE',
  palestine: 'PSE',
  burma: 'MMR',
  'east timor': 'TLS',
  netherlands: 'NLD',
  holland: 'NLD',
  brunei: 'BRN',
};

/** Bare names that could mean two countries. Never matched on their own; Calvin asks. Ours. */
const AMBIGUOUS_NAMES: ReadonlySet<string> = new Set(['congo']);

export function matchCountry(place: string): string | undefined {
  let text = ` ${words(place)} `;
  const names = [
    ...Object.entries(M49).map(([iso, row]) => ({ iso, name: words(row.name) })),
    ...Object.entries(COUNTRY_ALIASES).map(([alias, iso]) => ({ iso, name: words(alias) })),
  ]
    .filter((n) => n.name !== '' && !AMBIGUOUS_NAMES.has(n.name))
    .sort((a, b) => b.name.length - a.name.length);
  const found = new Set<string>();
  /* Longest names first, each match taken out of the text, so "Guinea" is not
     found again inside "Equatorial Guinea" — but "Niger" beside "Nigeria" is. */
  for (const { iso, name } of names) {
    const needle = ` ${name} `;
    if (!text.includes(needle)) continue;
    found.add(iso);
    text = text.split(needle).join('  ');
  }
  return found.size === 1 ? [...found][0] : undefined;
}

function words(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}’']+/gu, ' ').trim();
}

/* --------------------------------------------------------------------------
   The rows a visitor types (§6). Everything the record already holds is
   never asked again.
   -------------------------------------------------------------------------- */

export type CalvinFieldKey =
  | 'country'
  | 'gsClass'
  | 'served'
  | 'operationalDays'
  | 'premises'
  | 'deviceClass'
  | 'deviceUnits'
  | 'householdSize'
  | 'fnrb'
  | 'energySource'
  | 'energyAmount'
  | 'fnrbFiledV1';

/** What the system runs on, for activity emissions (Eq. 14). R17, 10 Oct 2026. */
export type EnergySource = 'none' | 'diesel' | 'grid';
export const ENERGY_SOURCES: readonly EnergySource[] = ['none', 'diesel', 'grid'];
/** The unit the amount is asked in, by source. */
export const ENERGY_UNIT: Record<Exclude<EnergySource, 'none'>, string> = {
  diesel: 'litres of diesel / year',
  grid: 'kWh of grid electricity / year',
};

export interface CalvinField<T> {
  key: CalvinFieldKey;
  /** The row's label, in a visitor's words. */
  label: string;
  /** What needs it — the equation or the number it unlocks. */
  neededBy: string;
  /** What kind of value it takes. */
  kind: string;
  /** Where it usually comes from. */
  whereFrom: string;
  /** The value, checked; undefined when it is not a value of this kind. */
  read: (value: unknown) => T | undefined;
}

const wholeNumber = (min: number, max = Number.MAX_SAFE_INTEGER) => (value: unknown): number | undefined => {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  return typeof n === 'number' && Number.isInteger(n) && n >= min && n <= max ? n : undefined;
};

const positiveNumber = (value: unknown): number | undefined => {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined;
};

/** An fNRB the visitor supplies, only when the engine refuses: a fraction and where it came from. */
export interface SuppliedFnrb {
  value: number;
  source: string;
}

/** A fraction with its source — both fNRB rows read through this one check. */
function readFnrb(value: unknown): SuppliedFnrb | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const { value: raw, source } = value as { value?: unknown; source?: unknown };
  const v = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw;
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1 && typeof source === 'string' && source.trim() !== ''
    ? { value: v, source: source.trim() }
    : undefined;
}

export const CALVIN_FIELDS = {
  country: {
    key: 'country',
    label: 'Country',
    neededBy: 'fNRB, the downward adjustment factor (DAF), household size and the age shares',
    kind: 'one of the UN M49 countries',
    whereFrom: 'the place on the record, matched; otherwise asked',
    read: (value: unknown) => (typeof value === 'string' && M49[value.trim().toUpperCase()] ? value.trim().toUpperCase() : undefined),
  } satisfies CalvinField<string>,
  gsClass: {
    key: 'gsClass',
    label: 'Class of drinking-water project',
    neededBy: 'which carbon method runs: Method 1 or Method 2',
    kind: 'HWT, IWT, CWT or CWS',
    whereFrom: "Wellington; otherwise asked, and posted to the record as Wellington's field",
    read: (value: unknown) => ((GS_CLASS_IDS as readonly string[]).includes(value as string) ? (value as GsClassId) : undefined),
  } satisfies CalvinField<GsClassId>,
  served: {
    key: 'served',
    label: 'People served',
    neededBy: 'the water volume, Q_pop',
    kind: 'a whole count, of people or of households',
    whereFrom: 'Wellington; otherwise asked',
    read: (value: unknown): Served | undefined => {
      if (typeof value !== 'object' || value === null) return undefined;
      const { count, unit } = value as { count?: unknown; unit?: unknown };
      const n = wholeNumber(1)(count);
      return n !== undefined && (unit === 'people' || unit === 'households') ? { count: n, unit } : undefined;
    },
  } satisfies CalvinField<Served>,
  operationalDays: {
    key: 'operationalDays',
    label: 'Days a year the water is available',
    neededBy: 'the water volume, Q_pop',
    kind: 'whole days, 1 to 365',
    whereFrom: 'the plan; the slider opens at 347, or at 365 on household treatment',
    read: wholeNumber(1, 365),
  } satisfies CalvinField<number>,
  premises: {
    key: 'premises',
    label: 'Homes or premises with a unit',
    neededBy: 'Eq. 6, on household treatment (V2.0 SDWS 33)',
    kind: 'a whole count',
    whereFrom: "sales or distribution records; a planned project's target",
    read: wholeNumber(1),
  } satisfies CalvinField<number>,
  deviceClass: {
    key: 'deviceClass',
    label: 'Kind of device',
    neededBy: 'embodied emissions, Table 10',
    kind: 'one of the seven device classes in Table 10',
    whereFrom: 'the plan',
    read: (value: unknown) =>
      typeof value === 'string' && Object.prototype.hasOwnProperty.call(EMBODIED_CATEGORIES, value) ? (value as EmbodiedCategory) : undefined,
  } satisfies CalvinField<EmbodiedCategory>,
  deviceUnits: {
    key: 'deviceUnits',
    label: 'New units this year',
    neededBy: 'embodied emissions, Table 10',
    kind: 'a whole count',
    whereFrom: 'the plan',
    read: wholeNumber(1),
  } satisfies CalvinField<number>,
  householdSize: {
    key: 'householdSize',
    label: 'People per household',
    neededBy: 'turning households into people, where the UN file has no figure for the country',
    kind: 'a number above zero, with where it came from',
    whereFrom: "the project's own survey",
    read: positiveNumber,
  } satisfies CalvinField<number>,
  fnrb: {
    key: 'fnrb',
    label: 'fNRB, with its source',
    neededBy: 'the baseline emission factor, EF_b — only where no official default covers the country',
    kind: 'a fraction between 0 and 1, with where it came from',
    whereFrom: "the project's own filing or study",
    read: (value: unknown): SuppliedFnrb | undefined => readFnrb(value),
  } satisfies CalvinField<SuppliedFnrb>,
  energySource: {
    key: 'energySource',
    label: 'Energy the system uses to run',
    neededBy: 'activity emissions, Eq. 14',
    kind: 'diesel, grid electricity, or none',
    whereFrom: 'the plan',
    read: (value: unknown) => ((ENERGY_SOURCES as readonly string[]).includes(value as string) ? (value as EnergySource) : undefined),
  } satisfies CalvinField<EnergySource>,
  energyAmount: {
    key: 'energyAmount',
    label: 'How much energy a year',
    neededBy: 'activity emissions, Eq. 14 — asked only where the system uses energy',
    kind: 'litres of diesel, or kWh of grid electricity, a year',
    whereFrom: "the plan or the supplier's figures",
    read: positiveNumber,
  } satisfies CalvinField<number>,
  fnrbFiledV1: {
    key: 'fnrbFiledV1',
    label: 'Filed V1.0 fNRB, with its source',
    neededBy: 'the Legacy V1.0 side of a transitioning project — the transition cannot run without it',
    kind: 'a fraction between 0 and 1, with where it came from',
    whereFrom: "the project's own V1.0 filing: its PDD or monitoring report",
    read: (value: unknown): SuppliedFnrb | undefined => readFnrb(value),
  } satisfies CalvinField<SuppliedFnrb>,
} as const;

/** The closed list a fill is checked against. A key not on it is dropped whole. */
export const CALVIN_FIELD_KEYS = Object.keys(CALVIN_FIELDS) as CalvinFieldKey[];

/**
 * The water column's rows a visitor types live in the VWBA D-3 pack itself
 * (lib/vwbaD3): its access level, its litres, its days and its without-project
 * volume. They are named here so the closed list is whole; they are never
 * redefined here.
 */
export const WATER_FIELD_KEYS = ['access_level', 'lpcd', 'days', 'without_lpy'] as const;

/* --------------------------------------------------------------------------
   The six sliders (§4, the maintainer's rulings of 10 Oct 2026, R23).

   Each is a learning tool: one line under it says, in a visitor's words, how
   moving it changes the credits (on the water column, the water benefit).
   Each opens at the cautious value the engine carries, cited, tagged default.
   A slider the visitor moves becomes a value they set, tagged assumed; an
   answer given to Calvin makes it entered. Nothing opens assumed.
   -------------------------------------------------------------------------- */

export type SliderKey = 'litres' | 'operationalDays' | 'waterQuality' | 'waterLitres' | 'eta' | 'usageRate';

export interface SliderSpec {
  key: SliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Drawn as a percentage: the value is a fraction. */
  percent?: boolean;
  /** How moving it changes the credits — the learning line (R23). */
  credits: string;
}

/** Where a slider opens, what that value is called and where it is cited. */
export interface SliderOpening {
  value: number;
  label: string;
  section: string;
  page: string;
}

/** Litres per person per day, carbon (QPW_p, V2.0 SDWS 29). Opens at the engine's Table 9 default. */
export const LITRES_SLIDER: SliderSpec = {
  key: 'litres',
  label: 'Drinking water per person per day',
  min: 0,
  /* The engine's cap, for household and community supply. Institutions (IWT)
     have no slider: schools and clinics are v2 — the maintainer's ruling of
     10 Oct 2026 (R26). */
  max: QPW_PERSON_CAP_DEFAULT,
  step: 0.1,
  unit: 'L / person / day',
  credits: `More water per person means more water made safe, so more credits — up to the ${QPW_PERSON_CAP_DEFAULT} L the methodology allows.`,
};

/** Days a year (DO_p, V2.0 SDWS 32; DP_p, V2.0 SDWS 36 on household treatment). */
export const DAYS_SLIDER: SliderSpec = {
  key: 'operationalDays',
  label: 'Days a year the water is available',
  min: 1,
  max: 365,
  step: 1,
  unit: 'days / year',
  credits: 'More days a year means more water made safe, so more credits.',
};

/** Where the days slider opens on community treatment and supply (DO_p). */
export const DAYS_OPENING: SliderOpening = {
  value: 347,
  label: "the methodology's cap for paper logs",
  section: 'V2.0 SDWS 32',
  page: 'p. 68',
};

/** Above this many days the methodology credits only the days a sensor records (V2.0 SDWS 32, p. 68). DO_p only. */
export const DAYS_SENSOR_THRESHOLD = 347;

/** The line the days row carries above the threshold, in a visitor's words. */
export const DAYS_ABOVE_THRESHOLD_LINE =
  'Above 347 days the methodology only credits the days a sensor records. Below it, an operation and maintenance log is enough.';

/**
 * Household treatment (HWT): days present, DP_p — the days the device is in the
 * home, a full year. The maintainer's ruling of 10 Oct 2026 (R24). The slider
 * opens here and only moves down.
 */
export const HWT_DAYS: SliderOpening = {
  value: 365,
  label: 'the days the device is in the home: a full year',
  section: 'V2.0 SDWS 36',
  page: 'p. 71',
};

/** Water quality passing rate (M_q,y, V2.0 SDWS 22), drawn as a percentage. */
export const QUALITY_SLIDER: SliderSpec = {
  key: 'waterQuality',
  label: 'Share of water tests that pass',
  min: 0,
  max: 1,
  step: 0.01,
  unit: 'fraction passing',
  percent: true,
  credits: 'A lower pass rate counts less of the water as safe, so fewer credits.',
};

export const QUALITY_OPENING: SliderOpening = {
  value: 0.9,
  label: 'the lowest pass rate allowed without corrective action from year 3',
  section: 'V2.0 SDWS 22; §7.4.3',
  page: 'pp. 58–59',
};

/** Stove efficiency (η, V2.0 SDWS 11), drawn as a percentage. The ends are the engine's SDWS 11 defaults. */
export const ETA_SLIDER: SliderSpec = {
  key: 'eta',
  label: 'Efficiency of the old stove',
  min: DEFAULT_STOVE_ETA.paa.threeStone,
  max: DEFAULT_STOVE_ETA.paa.ics,
  step: 0.01,
  unit: 'fraction',
  percent: true,
  credits: 'A more efficient old stove burned less fuel, so replacing it avoids less — fewer credits.',
};

/**
 * Where the stove slider opens: the most efficient class, the improved
 * cookstove — the cautious opening, read from the engine (R23).
 */
export const ETA_OPENING: SliderOpening = {
  value: DEFAULT_STOVE_ETA.paa.ics,
  label: 'the most efficient stove class, the improved cookstove',
  section: 'V2.0 SDWS 11',
  page: 'p. 52',
};

/** Usage rate (U_p, V2.0 SDWS 34). Household treatment only, and never 0 (R23). */
export const USAGE_SLIDER: SliderSpec = {
  key: 'usageRate',
  label: 'Share of homes that really use the device',
  min: 0.01,
  max: 1,
  step: 0.01,
  unit: 'fraction of users',
  percent: true,
  credits: 'If fewer homes really use the device, less water is counted, so fewer credits.',
};

/**
 * Where the usage slider opens: the value the engine carries. V2.0 SDWS 34 sets
 * U_p by a usage survey and gives no default, so the source line says there is
 * none yet (R16); a source is to be found on the paid side for the new engine.
 */
export const USAGE_OPENING: SliderOpening = {
  value: 1,
  label: 'no source yet — the methodology sets it by a usage survey',
  section: 'V2.0 SDWS 34',
  page: '',
};

/**
 * The water column's own litres slider (VWBA 2.0 D-3, Table D3.3, p. 46). It
 * drives the D-3 pack's existing `lpcd` field and never shares a value with the
 * carbon litres slider. 0 to 20 L, the maintainer's ruling of 10 Oct 2026.
 */
export const WATER_LITRES_SLIDER: SliderSpec = {
  key: 'waterLitres',
  label: 'Water per person per day',
  min: 0,
  max: Number(LPCD_FULL),
  step: 1,
  unit: 'L / person / day',
  credits: 'More water per person raises the water benefit. It does not change the carbon credits.',
};

/** Where the water slider opens, by access level; undefined until the access level is answered. */
export function waterLitresOpening(accessLevel: unknown): number | undefined {
  if (accessLevel === 'full') return Number(LPCD_FULL);
  if (accessLevel === 'limited') return Number(LPCD_LIMITED);
  return undefined;
}

/** All six, by key — the screen and the check read the same list. */
export const SLIDERS: Readonly<Record<SliderKey, SliderSpec>> = {
  litres: LITRES_SLIDER,
  operationalDays: DAYS_SLIDER,
  waterQuality: QUALITY_SLIDER,
  waterLitres: WATER_LITRES_SLIDER,
  eta: ETA_SLIDER,
  usageRate: USAGE_SLIDER,
};

/** Clamp a slider's value into its range; undefined for anything that is not a number. */
export function clampSlider(spec: SliderSpec, value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.min(spec.max, Math.max(spec.min, value));
}
