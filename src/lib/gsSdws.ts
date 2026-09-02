/**
 * Gold Standard · Emission Reductions from Safe Drinking Water Supply — two
 * screening packs, Legacy V1.0 and PAA v2.0, from one module.
 *
 * WHAT IT COVERS. A project that supplies safe drinking water where people
 * boil unsafe water today with wood or charcoal, so that the boiling stops.
 * The emission reduction is the fuel not burnt. Two calculation methods, as
 * both versions of the methodology set out: Method 1 for community supply and
 * community treatment (CWS/CWT), Method 2 for treatment in the home or an
 * institution (HWT/IWT). Ex-ante, screening tier.
 *
 * THE TWO TABS SHARE ONE EQUATION AND DIFFER IN ONE INPUT. Both versions
 * write the same baseline: an emission factor per litre boiled, times the
 * litres the project supplies, less the share of people who already had safe
 * water. What moves between them is the fraction of non-renewable biomass
 * (fNRB): the legacy version took a national default per country, and the
 * Paris-aligned version takes the MoFuSS assessment's figure, which for the
 * countries recorded here is much lower. That one number is the whole of the
 * transition delta the worksheet can show. Maintainer's rulings D, E and F,
 * 2 Sep 2026; item K6.
 *
 * WHAT THIS SCREENING DOES NOT APPLY, said plainly on the tab. The v2.0
 * methodology adjusts the baseline further — a water-quality modifier, a usage
 * rate, statistical conservativeness, a downward adjustment factor for
 * ambition, and a crediting baseline that is the lower of two figures. None
 * of those is a default a screening can honestly assume, so this pack applies
 * the unadjusted equation and says so. The figure a registered activity would
 * be credited is lower, never higher.
 *
 * THE EMISSION FACTOR IS DERIVED, AND LABELLED DERIVED. Both versions build
 * it from the fuel mix, the stove efficiency, the energy to boil a litre and
 * the fuels' emission factors (Eq. 1 and 2 in each). This pack carries a
 * STANDARD PROFILE — wood 80%, charcoal 20%, the methodology's default stove
 * efficiencies, 360.83 kJ/L — under which that equation reduces to a straight
 * line in fNRB. The two constants of that line were recovered from the
 * profile and confirmed across seven recorded points to nine figures; the
 * check script proves it. A project with a different fuel mix or a measured
 * stove efficiency has a different factor, and the strip says so.
 *
 * BLANK IS NEVER ZERO, anywhere in this file. Every blank required figure
 * leaves the headline as a dash and names itself. The one figure that
 * defaults to zero — project emissions for a zero-emission technology — does
 * so because the methodology says it does, and the default is shown as one.
 *
 * WHAT IS NOT IN THIS PACK, deliberately: suppressed-demand baselines, the
 * institutional age tiers, embodied-emission deductions, the downward
 * adjustment factor, monitoring, and anything about registration. A project
 * that needs those needs the methodology and a consultant, and the tab's own
 * chip says consultant review.
 *
 * The methodologies are cited and linked. They are not quoted at length, their
 * tables are not reproduced, and no page of them is pasted into this file or
 * the interface.
 */

import type { Citation } from './citation';
import type {
  Figure,
  FormulaStep,
  MethodPack,
  PackField,
  PackGate,
  PackResult,
  PackValues,
} from './methodPacks';

/* --------------------------------------------------------------------------
   Sources.
   -------------------------------------------------------------------------- */

/** One publisher page hosts both versions of the methodology. */
const GS_PAGE =
  'https://globalgoals.goldstandard.org/429-ee-sws-emission-reductions-from-safe-drinking-water-supply/';

export const CITE_LEGACY_V1: Citation = {
  document: 'Emission Reductions from Safe Drinking Water Supply, V1.0 (EE-SWS)',
  version: 'Version 1.0, 3 May 2021',
  section: '§3.6 Baseline emissions, Eq. 1–7 · §3.7–3.9, Eq. 8–11',
  page: 'pp. 10–15',
  full:
    'Gold Standard for the Global Goals. Methodology for Emission Reductions from Safe Drinking ' +
    'Water Supply (EE-SWS). Version 1.0, 3 May 2021. §3.6–3.9, pp. 10–15.',
  href: GS_PAGE,
};

export const CITE_PAA_V2: Citation = {
  document: 'PAA-M400-12 Emission Reductions from Safe Drinking Water Supply, V2.0',
  /* The cover date, 9 July 2026 — the running header says 7 July, and the
     maintainer's errata ruling for this document takes the cover. */
  version: 'Version 2.0, 9 July 2026',
  section: '§7.3.7–7.3.10, Eq. 1–7 · §7.4, Eq. 8–10 · §10.1, Eq. 22',
  page: 'pp. 29–33, 39',
  full:
    'Gold Standard for the Global Goals. GS4GG PAA M400-12, Emission Reductions from Safe ' +
    'Drinking Water Supply. Version 2.0, 9 July 2026. §7.3–7.4 and §10.1, pp. 29–33 and 39.',
  href: GS_PAGE,
};

/**
 * The MoFuSS country shares behind the PAA v2.0 tab's defaults.
 *
 * The report names its own site as where its results are published and
 * consulted (p. 26), and that is the canonical link used here.
 */
export const CITE_MOFUSS: Citation = {
  document: 'Updated fNRB Values for Woodfuel Interventions (MoFuSS)',
  version: 'Revised version, 20 June 2024 — Ghilardi and Bailis',
  section: 'Table 5, national fNRB estimates for 2020–2030',
  page: 'pp. 26 ff.',
  full:
    'Ghilardi, A. and Bailis, R. Updated fNRB Values for Woodfuel Interventions. Revised version, ' +
    '20 June 2024. Table 5, national woodfuel harvests, NRB and fNRB estimates for 2020–2030.',
  href: 'https://www.mofuss.unam.mx/',
};

/**
 * The legacy shares' source — the CDM's list of default country-specific
 * fNRB values, all of which have expired. Read in a normal browser visit on
 * 2 Sep 2026; the page's text is transcribed in sources-local. The legacy
 * version of the methodology was applied with these figures, which is why
 * they are carried: not as current defaults, but as what a legacy screening
 * would have used.
 */
export const CITE_UNFCCC_FNRB: Citation = {
  document: 'CDM — Fraction of non-renewable biomass (fNRB), default country-specific values',
  version: 'As published by the UNFCCC CDM; Table 1, values approved and since expired',
  section: 'Table 1 · Uganda 82%, Kenya 92%, Malawi 81%',
  page: 'accepted 2012, expired 2017',
  full:
    'UNFCCC Clean Development Mechanism. Fraction of non-renewable biomass (fNRB): list of ' +
    'default country-specific fNRB values approved by the Board which have already expired ' +
    '(Table 1). Uganda 82%, accepted 11 April 2012, expired 10 April 2017.',
  href: 'https://cdm.unfccc.int/DNA/fNRB/index.html',
};

/* --------------------------------------------------------------------------
   The standard profile.

   The values below are the profile every recorded figure was produced under.
   Two of them are the methodology's own — the energy to boil a litre, and
   the share of end-users already on safe water is a project figure typed
   by the visitor. The emission-factor line is derived from the profile and
   is labelled derived wherever it renders.
   -------------------------------------------------------------------------- */

/**
 * EF_b as a straight line in fNRB, tCO₂e per litre, under the standard
 * profile: EF_b = EF_A + EF_B × fNRB.
 *
 * EF_A is what boiling a litre emits with fully renewable biomass (the
 * non-CO₂ part of the fuel's emissions); EF_B is what each unit of
 * non-renewability adds (the CO₂ part). Recovered from the profile's own
 * factor at two recorded shares and confirmed at all seven to better than one
 * part in a billion — scripts/check-gs-sdws.mjs holds the proof.
 */
export const EF_A = 5.96596322e-5;
export const EF_B = 4.425363452e-4;

export const PROFILE_LINE =
  'Standard profile: wood 80% and charcoal 20% by energy, the methodology’s default stove ' +
  'efficiencies, 360.83 kJ to boil a litre. A different fuel mix or a measured stove changes the factor.';

/** Emission factor per litre at a given non-renewable share. */
export function emissionFactor(fnrb: number): number {
  return EF_A + EF_B * fnrb;
}

/* --------------------------------------------------------------------------
   Countries and their recorded shares.
   -------------------------------------------------------------------------- */

export interface CountryShare {
  code: string;
  name: string;
  /** MoFuSS 2020–2030 national fNRB, Table 5. Cited. */
  mofuss: number;
  /**
   * The share the legacy version was applied with — the CDM's expired default
   * for the country (CITE_UNFCCC_FNRB), where the list carries one. Uganda,
   * Kenya and Malawi are on it; India, Tanzania and Niger are not, and ask for
   * a typed share on the legacy tab rather than guessing one. Ruling F,
   * 2 Sep 2026, widened the same day once the list was read.
   */
  legacy: number | null;
}

export const COUNTRIES: CountryShare[] = [
  { code: 'IND', name: 'India', mofuss: 0.06, legacy: null },
  { code: 'KEN', name: 'Kenya', mofuss: 0.3, legacy: 0.92 },
  { code: 'UGA', name: 'Uganda', mofuss: 0.35, legacy: 0.82 },
  { code: 'MWI', name: 'Malawi', mofuss: 0.49, legacy: 0.81 },
  { code: 'TZA', name: 'Tanzania', mofuss: 0.51, legacy: null },
  { code: 'NER', name: 'Niger', mofuss: 0.6, legacy: null },
];

const OTHER = 'other';

const countryChoices = [
  ...COUNTRIES.map((c) => ({ value: c.code, label: c.name })),
  { value: OTHER, label: 'Another country' },
];

/* --------------------------------------------------------------------------
   Reading the answers. Empty means empty. A blank never becomes a zero.
   -------------------------------------------------------------------------- */

const isBlank = (v: string | undefined): boolean => v === undefined || v.trim() === '';

function readNumber(values: PackValues, key: string): number | null {
  const raw = values[key];
  if (isBlank(raw)) return null;
  const n = Number(String(raw).replace(/,/g, '').trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/** A typed figure, else the pack's default for it, else null. */
function effective(pack: Variant, values: PackValues, key: string): number | null {
  const typed = readNumber(values, key);
  if (typed !== null) return typed;
  const d = defaultFor(pack, key, values);
  return d === null ? null : Number(d);
}

const isCws = (values: PackValues) => values.method === 'cws';
const isHwt = (values: PackValues) => values.method === 'hwt';

/* --------------------------------------------------------------------------
   The two variants.
   -------------------------------------------------------------------------- */

type Variant = 'legacy' | 'paa';

/** How the two versions name leakage's routes. */
const LEAKAGE_CHOICES: Record<Variant, { value: string; label: string }[]> = {
  legacy: [
    { value: 'none', label: 'Assessed insignificant' },
    { value: 'flat5', label: 'Below 5% — take 5% off' },
    { value: 'typed', label: 'Typed figure' },
  ],
  paa: [
    { value: 'none', label: 'Assessed below 2%' },
    { value: 'default2', label: 'Default — 2% of the net' },
    { value: 'typed', label: 'Typed figure' },
  ],
};

/* --------------------------------------------------------------------------
   Defaults. Returned, never written in, so a default is always visibly one.
   -------------------------------------------------------------------------- */

function defaultFor(variant: Variant, fieldKey: string, values: PackValues): string | null {
  if (fieldKey === 'fnrb') {
    const c = COUNTRIES.find((x) => x.code === values.country);
    if (!c) return null;
    if (variant === 'paa') return String(c.mofuss);
    return c.legacy === null ? null : String(c.legacy);
  }
  /* The v2.0 methodology publishes per-person defaults (Table 9): 4.0 L for
     adults at home, 2.0 L for day students. The legacy version's defaults
     live in its parameter tables and are not carried here, so its tab asks. */
  if (variant === 'paa' && fieldKey === 'litres_per_person') return '4';
  if (variant === 'paa' && fieldKey === 'half_litres') return '2';
  /* A zero-emission technology has no activity emissions — v2.0 §8.2.1 says
     so outright, and the legacy version's §3.7.1 counts only fossil fuel and
     electricity. The default appears only once the gate has been answered. */
  if (fieldKey === 'project_emissions' && values.low_emission_tech === 'yes') return '0';
  if (fieldKey === 'units_per_premises' && isHwt(values)) return '1';
  return null;
}

function conditionalHelp(variant: Variant, fieldKey: string, values: PackValues): string | null {
  if (fieldKey === 'fnrb') {
    const c = COUNTRIES.find((x) => x.code === values.country);
    if (values.country === OTHER) {
      return 'No share is recorded here for this country. Type the one your project would use; nothing is assumed.';
    }
    if (variant === 'legacy' && c && c.legacy === null) {
      return `No legacy share is recorded here for ${c.name}. Type the one your project was assessed with; nothing is assumed.`;
    }
    if (!isBlank(values.fnrb)) return 'Your own share. It is used as typed and labelled as yours.';
  }
  if (fieldKey === 'capacity_litres' && isCws(values)) {
    return 'Leave it blank if the system has no known yearly limit. A blank means no cap, not zero.';
  }
  return null;
}

/* --------------------------------------------------------------------------
   The arithmetic.
   -------------------------------------------------------------------------- */

/** The litres the project supplies in a year, or null while a figure is missing. */
export function litresSupplied(variant: Variant, values: PackValues): { litres: number | null; missing: string | null } {
  if (isCws(values)) {
    const hh = readNumber(values, 'households');
    const hn = readNumber(values, 'people_per_premises');
    const qpw = effective(variant, values, 'litres_per_person');
    const days = readNumber(values, 'days_operational');
    if (hh === null) return { litres: null, missing: 'the number of premises served' };
    if (hn === null) return { litres: null, missing: 'people per premises' };
    if (qpw === null) return { litres: null, missing: 'litres per person per day' };
    if (days === null) return { litres: null, missing: 'days the system operates in a year' };

    /* Each premises type contributes premises × people × litres, and the
       whole sum is multiplied by the operating days — Eq. 5 in both versions.
       This is the methodology's sum, not the tool's cell: an official tool
       was found to drop the premises count and the days from the half-day
       term, and this pack builds from the equation instead. */
    let perDay = hh * hn * qpw;
    const hh2 = readNumber(values, 'half_premises');
    if (hh2 !== null) {
      const hn2 = readNumber(values, 'half_people');
      const qpw2 = effective(variant, values, 'half_litres');
      if (hn2 === null) return { litres: null, missing: 'people per half-day premises' };
      if (qpw2 === null) return { litres: null, missing: 'litres per person for half-day premises' };
      perDay += hh2 * hn2 * qpw2;
    }
    const demand = perDay * days;
    const cap = readNumber(values, 'capacity_litres');
    return { litres: cap === null ? demand : Math.min(demand, cap), missing: null };
  }

  if (isHwt(values)) {
    const n = readNumber(values, 'units');
    const up = readNumber(values, 'usage_rate');
    const q = readNumber(values, 'flow_lph');
    const t = readNumber(values, 'hours_per_day');
    const dn = effective(variant, values, 'units_per_premises');
    const dp = readNumber(values, 'days_present');
    const hn = readNumber(values, 'people_per_premises');
    const qpw = effective(variant, values, 'litres_per_person');
    if (n === null) return { litres: null, missing: 'the number of premises with a unit' };
    if (up === null) return { litres: null, missing: 'the usage rate' };
    if (q === null) return { litres: null, missing: 'the unit’s flow in litres an hour' };
    if (t === null) return { litres: null, missing: 'hours a day the unit is used' };
    if (dn === null) return { litres: null, missing: 'units per premises' };
    if (dp === null) return { litres: null, missing: 'days a year the unit is present' };
    if (hn === null) return { litres: null, missing: 'people per premises' };
    if (qpw === null) return { litres: null, missing: 'litres per person per day' };

    /* Eq. 7: per premises per day, the smaller of what the unit can make and
       what the people there can drink. Then Eq. 6: units × usage × days. */
    const perPremises = Math.min(q * t * dn, qpw * hn);
    return { litres: n * up * perPremises * dp, missing: null };
  }

  return { litres: null, missing: 'which method applies — community supply, or treatment in the home' };
}

function leakage(variant: Variant, values: PackValues, be: number, pe: number): { le: number | null; missing: string | null } {
  const mode = values.leakage_mode;
  if (isBlank(mode)) return { le: null, missing: 'how leakage is treated' };
  if (mode === 'none') return { le: 0, missing: null };
  if (mode === 'flat5' && variant === 'legacy') return { le: 0.05 * be, missing: null };
  if (mode === 'default2' && variant === 'paa') return { le: 0.02 * (be - pe), missing: null };
  if (mode === 'typed') {
    const typed = readNumber(values, 'leakage_tco2e');
    return typed === null ? { le: null, missing: 'the leakage figure' } : { le: typed, missing: null };
  }
  return { le: null, missing: 'how leakage is treated' };
}

function compute(variant: Variant, values: PackValues): PackResult {
  const gates = GATES;
  for (const gate of gates) {
    if (values[gate.fieldKey] === 'no') {
      return { kind: 'blocked', stopReason: gate.stopReason, routeForward: gate.routeForward };
    }
  }

  const figures: Figure[] = [];
  const supplied = litresSupplied(variant, values);
  if (supplied.litres === null) {
    return { kind: 'pending' };
  }
  const litres = supplied.litres;
  figures.push({
    key: 'litres',
    label: 'Safe water supplied',
    value: litres,
    unit: 'L / year',
    decimals: 0,
    secondary: `${(litres / 1000).toLocaleString('en-GB', { maximumFractionDigits: 1 })} m³ / year`,
  });

  const fnrb = effective(variant, values, 'fnrb');
  if (fnrb === null) {
    return { kind: 'incomplete', figures, missing: 'The baseline needs the non-renewable share of biomass. Nothing is assumed for it.' };
  }
  const ef = emissionFactor(fnrb);
  figures.push({
    key: 'ef',
    label: 'Emission factor per litre boiled',
    value: ef,
    unit: 'tCO₂e / L',
    decimals: 9,
    note: `Derived — standard profile at a non-renewable share of ${fnrb}.`,
  });

  const cb = readNumber(values, 'clean_share');
  if (cb === null) {
    return { kind: 'incomplete', figures, missing: 'The baseline needs the share of people who already had safe water. Nothing is assumed for it.' };
  }
  const be = litres * ef * (1 - cb);
  figures.push({ key: 'be', label: 'Baseline emissions', value: be, unit: 'tCO₂e / year', decimals: 1 });

  const pe = effective(variant, values, 'project_emissions');
  if (pe === null) {
    return { kind: 'incomplete', figures, missing: 'The result needs the project’s own emissions. Answer the technology gate, or type the figure.' };
  }
  figures.push({ key: 'pe', label: variant === 'paa' ? 'Activity emissions' : 'Project emissions', value: pe, unit: 'tCO₂e / year', decimals: 1 });

  const lk = leakage(variant, values, be, pe);
  if (lk.le === null) {
    return { kind: 'incomplete', figures, missing: `The result needs ${lk.missing}.` };
  }
  figures.push({ key: 'le', label: 'Leakage', value: lk.le, unit: 'tCO₂e / year', decimals: 1 });

  const er = be - pe - lk.le;
  const headline: Figure = {
    key: 'er',
    label: variant === 'paa' ? 'Net emission reductions' : 'Emission reductions',
    value: er,
    unit: 'tCO₂e / year',
    decimals: 1,
    note: variant === 'paa'
      ? 'Before the v2.0 adjustments a registered activity would take. The credited figure is lower, never higher.'
      : undefined,
  };
  figures.push(headline);
  return { kind: 'complete', figures, headline };
}

/* --------------------------------------------------------------------------
   The formula, written out.
   -------------------------------------------------------------------------- */

const show = (n: number | null, digits = 0): string =>
  n === null ? '—' : n.toLocaleString('en-GB', { maximumFractionDigits: digits });

function formula(variant: Variant, values: PackValues): FormulaStep[] {
  const steps: FormulaStep[] = [];
  const supplied = litresSupplied(variant, values);
  const litres = supplied.litres;

  if (isHwt(values)) {
    const n = readNumber(values, 'units');
    const up = readNumber(values, 'usage_rate');
    const q = readNumber(values, 'flow_lph');
    const t = readNumber(values, 'hours_per_day');
    const dn = effective(variant, values, 'units_per_premises');
    const dp = readNumber(values, 'days_present');
    const hn = readNumber(values, 'people_per_premises');
    const qpw = effective(variant, values, 'litres_per_person');
    steps.push({
      symbol: 'Q_y',
      eq: 'Eq. 6–7',
      label: 'Safe water supplied (Method 2)',
      terms: 'units × usage rate × min(flow × hours × units per premises, litres per person × people) × days',
      live: `${show(n)} × ${show(up, 2)} × min(${show(q, 2)} × ${show(t)} × ${show(dn)}, ${show(qpw, 2)} × ${show(hn)}) × ${show(dp)}`,
      value: litres === null ? null : show(litres),
      unit: 'L / year',
    });
  } else {
    const hh = readNumber(values, 'households');
    const hn = readNumber(values, 'people_per_premises');
    const qpw = effective(variant, values, 'litres_per_person');
    const days = readNumber(values, 'days_operational');
    const hh2 = readNumber(values, 'half_premises');
    const half = hh2 === null ? '' : ` + ${show(hh2)} × ${show(readNumber(values, 'half_people'))} × ${show(effective(variant, values, 'half_litres'), 2)}`;
    const cap = readNumber(values, 'capacity_litres');
    steps.push({
      symbol: 'Q_y',
      eq: 'Eq. 4–5',
      label: 'Safe water supplied (Method 1)',
      terms: 'Σ premises × people × litres per person per day, × days' + (cap === null ? '' : ', capped by capacity'),
      live: `(${show(hh)} × ${show(hn)} × ${show(qpw, 2)}${half}) × ${show(days)}` + (cap === null ? '' : `, min with ${show(cap)}`),
      value: litres === null ? null : show(litres),
      unit: 'L / year',
    });
  }

  const fnrb = effective(variant, values, 'fnrb');
  const ef = fnrb === null ? null : emissionFactor(fnrb);
  steps.push({
    symbol: 'EF_b',
    eq: 'Eq. 1',
    label: 'Emission factor per litre boiled — derived',
    terms: 'EF_A + EF_B × non-renewable share',
    live: `${EF_A.toExponential(3)} + ${EF_B.toExponential(3)} × ${show(fnrb, 2)}`,
    value: ef === null ? null : ef.toExponential(4),
    unit: 'tCO₂e / L',
  });

  const cb = readNumber(values, 'clean_share');
  const be = litres === null || ef === null || cb === null ? null : litres * ef * (1 - cb);
  steps.push({
    symbol: 'BE',
    eq: variant === 'paa' ? 'Eq. 3, 9' : 'Eq. 3',
    label: 'Baseline emissions',
    terms: 'litres × factor × (1 − share already on safe water)',
    live: `${show(litres)} × ${ef === null ? '—' : ef.toExponential(4)} × (1 − ${show(cb, 2)})`,
    value: be === null ? null : show(be, 1),
    unit: 'tCO₂e / year',
  });

  const pe = effective(variant, values, 'project_emissions');
  const lk = be === null || pe === null ? { le: null } : leakage(variant, values, be, pe);
  const er = be === null || pe === null || lk.le === null ? null : be - pe - lk.le;
  steps.push({
    symbol: 'ER',
    eq: variant === 'paa' ? 'Eq. 22' : 'Eq. 11',
    label: variant === 'paa' ? 'Net emission reductions' : 'Emission reductions',
    terms: 'baseline − project emissions − leakage',
    live: `${show(be, 1)} − ${show(pe, 1)} − ${show(lk.le ?? null, 1)}`,
    value: er === null ? null : show(er, 1),
    unit: 'tCO₂e / year',
  });

  return steps;
}

/* --------------------------------------------------------------------------
   The stat tiles — the production calculator's idiom: value, label, unit.
   -------------------------------------------------------------------------- */

function tiles(variant: Variant, values: PackValues, result: PackResult): Figure[] {
  if (result.kind !== 'complete' && result.kind !== 'incomplete') return [];
  const out: Figure[] = [];
  const f = (key: string) => result.figures.find((x) => x.key === key);
  const litres = f('litres');
  const ef = f('ef');
  const er = result.kind === 'complete' ? result.headline : null;

  /* People served: premises × people per premises, for either method. */
  const premises = readNumber(values, isHwt(values) ? 'units' : 'households');
  const perPremises = readNumber(values, 'people_per_premises');
  const people = premises === null || perPremises === null ? null : premises * perPremises;

  if (er && people !== null && people > 0) {
    out.push({ key: 'er-per-person', label: 'ER per person per year', value: er.value / people, unit: 'tCO₂e', decimals: 4 });
  }
  if (ef) out.push({ key: 'ef-tile', label: 'Baseline EF_b (Eq. 1)', value: ef.value, unit: 'tCO₂e / L', decimals: 9 });
  if (litres) out.push({ key: 'q-tile', label: 'Water volume Q_y', value: litres.value / 1e6, unit: 'ML / yr', decimals: 2 });
  /* Five years is the crediting period both versions open with — v2.0 p. 5. */
  if (er) out.push({ key: 'cp-tile', label: 'Total · 1st crediting period (5 yr)', value: er.value * 5, unit: 'tCO₂e', decimals: 0 });
  void variant;
  return out;
}

/* --------------------------------------------------------------------------
   Gates and fields, shared by both tabs.
   -------------------------------------------------------------------------- */

const GATES: PackGate[] = [
  {
    fieldKey: 'boils_today',
    stopReason:
      'This method credits boiling that stops. If the people served do not boil unsafe water with ' +
      'wood or charcoal today, there is no baseline fuel to displace and no reduction to screen.',
    routeForward:
      'Both versions also allow a suppressed-demand baseline for people who drink unsafe water ' +
      'because they cannot afford to boil it. That route needs the methodology and is not screened here.',
  },
  {
    fieldKey: 'safe_at_use',
    stopReason:
      'Water that is not safe where it is drunk earns no reduction — the methodology credits only ' +
      'water that passes the quality standard. No figure is worked out.',
    routeForward:
      'Water quality testing at the point of use, against the national standard or the WHO guideline, ' +
      'is what moves this forward.',
  },
  {
    fieldKey: 'low_emission_tech',
    stopReason:
      'The methodology applies to zero- or low-emission technologies. A supply run on fossil-fuel ' +
      'pumps beyond a small backup is outside it, and no figure is worked out.',
    routeForward:
      'A solar or hand pump, a gravity filter, chlorination or UV are the shapes the methodology ' +
      'names. A backup engine used under a tenth of operating hours is allowed.',
  },
];

function fields(variant: Variant): PackField[] {
  const legacy = variant === 'legacy';
  return [
    {
      key: 'boils_today',
      kind: 'yesno',
      label: 'Do the people served boil unsafe water today, with wood or charcoal?',
      help: 'The baseline is that boiling, and the fuel it burns.',
      why:
        'The reduction is the fuel not burnt once safe water arrives. If nobody boils, or they boil ' +
        'with gas or electricity, this pack has nothing to count.',
      required: true,
    },
    {
      key: 'safe_at_use',
      kind: 'yesno',
      label: 'Will the water meet the drinking-water standard where it is drunk?',
      help: 'The national standard, or the WHO guideline where there is none.',
      why: 'A gate, not a score. Water that fails the standard earns no reduction, however much is supplied.',
      required: true,
    },
    {
      key: 'low_emission_tech',
      kind: 'yesno',
      label: 'Is the technology zero- or low-emission?',
      help: 'Solar or hand pumps, gravity filters, chlorine, UV. Not a diesel-pumped supply.',
      why:
        'The methodology covers technologies that do not themselves burn fuel to run. A backup engine ' +
        'used for less than a tenth of operating hours is allowed.',
      required: true,
    },
    {
      key: 'method',
      kind: 'choice',
      label: 'How does safe water reach people?',
      help: 'Method 1 is a community supply or treatment point; Method 2 treats water in the home or an institution.',
      required: true,
      choices: [
        { value: 'cws', label: 'Community supply (Method 1)' },
        { value: 'hwt', label: 'In the home (Method 2)' },
      ],
    },
    {
      key: 'country',
      kind: 'choice',
      label: 'Which country?',
      help: legacy
        ? 'Uganda, Kenya and Malawi fill the CDM list’s historical value, expired in 2017. Any other country asks for a typed one.'
        : 'Fills the non-renewable share from the MoFuSS assessment. You can type your own.',
      required: true,
      choices: countryChoices,
    },
    {
      key: 'fnrb',
      kind: 'number',
      label: 'Non-renewable share of the biomass burnt',
      help: legacy
        ? 'The CDM list’s value, historical and expired since 2017 — which is exactly why it is the legacy share. A fraction between 0 and 1.'
        : 'The MoFuSS national figure for 2020–2030. A fraction between 0 and 1.',
      why:
        'The one number that moves between the two versions. Wood that regrows adds no net CO₂; the ' +
        'non-renewable share is what counts. The legacy defaults were much higher than the MoFuSS ' +
        'assessment’s, which is where the transition delta comes from.',
      required: true,
      unit: 'fraction',
      placeholder: 'e.g. 0.35',
    },
    {
      key: 'clean_share',
      kind: 'number',
      label: 'Share of people who already had safe water without boiling',
      help: 'Required, and you may leave it blank. A blank is not zero.',
      why:
        'People who were already on a safe supply were not boiling, so their litres earn nothing. The ' +
        'baseline is scaled down by this share. Left blank, the result stays incomplete rather than ' +
        'assuming nobody had safe water.',
      required: true,
      unit: 'fraction',
      placeholder: 'e.g. 0.05',
    },
    /* Method 1. */
    {
      key: 'households',
      kind: 'number',
      label: 'How many premises are served?',
      help: 'Households, or institutions, counted the same way.',
      required: true,
      unit: 'premises',
      placeholder: 'e.g. 1,000',
      when: isCws,
      group: 'Method 1 · community supply',
    },
    {
      key: 'people_per_premises',
      kind: 'number',
      label: 'People per premises',
      help: 'The household size, or the people an institution serves all day.',
      required: true,
      unit: 'people',
      placeholder: 'e.g. 5',
    },
    {
      key: 'litres_per_person',
      kind: 'number',
      label: 'Drinking water per person per day',
      help: legacy
        ? 'The legacy version caps this at 5.5 L. Type the figure your project uses.'
        : 'v2.0 Table 9 gives 4.0 L for adults at home, capped at 5.5 L. Type your own if measured.',
      required: true,
      unit: 'L / person / day',
      placeholder: legacy ? 'e.g. 4' : '4',
    },
    {
      key: 'days_operational',
      kind: 'number',
      label: 'Days a year the system operates',
      help: 'No default. A supply that runs part of the year is not a full year.',
      required: true,
      unit: 'days / year',
      placeholder: 'e.g. 330',
      when: isCws,
    },
    {
      key: 'capacity_litres',
      kind: 'number',
      label: 'If known: litres the system can supply in a year',
      help: 'Optional. The smaller of demand and capacity counts.',
      required: false,
      unit: 'L / year',
      placeholder: 'optional',
      when: isCws,
    },
    {
      key: 'half_premises',
      kind: 'number',
      label: 'Half-day premises served, such as day schools',
      help: 'Optional. A second premises type, added into the same sum.',
      why:
        'Both versions sum premises × people × litres over each premises type. An official spreadsheet ' +
        'tool was found to drop the premises count and the operating days from its half-day term; this ' +
        'pack builds from the equation, not from that cell, and says so here.',
      required: false,
      unit: 'premises',
      placeholder: 'optional',
      when: isCws,
      group: 'Half-day premises · optional',
    },
    {
      key: 'half_people',
      kind: 'number',
      label: 'People per half-day premises',
      help: 'Needed only if half-day premises are given.',
      required: false,
      unit: 'people',
      placeholder: 'e.g. 60',
      when: (v) => isCws(v) && !isBlank(v.half_premises),
    },
    {
      key: 'half_litres',
      kind: 'number',
      label: 'Drinking water per person per day, half-day premises',
      help: legacy ? 'Type the figure your project uses.' : 'v2.0 Table 9 gives 2.0 L for day students.',
      required: false,
      unit: 'L / person / day',
      placeholder: legacy ? 'e.g. 2' : '2',
      when: (v) => isCws(v) && !isBlank(v.half_premises),
    },
    /* Method 2. */
    {
      key: 'units',
      kind: 'number',
      label: 'How many premises have at least one unit?',
      help: 'Households or institutions with a treatment unit in place.',
      required: true,
      unit: 'premises',
      placeholder: 'e.g. 1,000',
      when: isHwt,
      group: 'Method 2 · treatment in the home',
    },
    {
      key: 'usage_rate',
      kind: 'number',
      label: 'Usage rate',
      help: 'The share of units in use, from usage surveys. A fraction between 0 and 1.',
      why:
        'Both versions scale the water by how many units are actually used. v2.0 applies it as a ' +
        'downward adjustment; the arithmetic is the same.',
      required: true,
      unit: 'fraction',
      placeholder: 'e.g. 0.9',
      when: isHwt,
    },
    {
      key: 'flow_lph',
      kind: 'number',
      label: 'Flow of one unit',
      help: 'Litres an hour the unit can treat.',
      required: true,
      unit: 'L / hour',
      placeholder: 'e.g. 1.7',
      when: isHwt,
    },
    {
      key: 'hours_per_day',
      kind: 'number',
      label: 'Hours a day the unit is used',
      help: 'From usage surveys.',
      required: true,
      unit: 'hours / day',
      placeholder: 'e.g. 15',
      when: isHwt,
    },
    {
      key: 'units_per_premises',
      kind: 'number',
      label: 'Units per premises',
      help: 'Usually one. More than one adds their flows together.',
      required: true,
      unit: 'units',
      placeholder: '1',
      when: isHwt,
    },
    {
      key: 'days_present',
      kind: 'number',
      label: 'Days a year the unit is present',
      help: 'No default. Count the days it was in the premises.',
      required: true,
      unit: 'days / year',
      placeholder: 'e.g. 330',
      when: isHwt,
    },
    /* Shared tail. */
    {
      key: 'project_emissions',
      kind: 'number',
      label: legacy ? 'Project emissions' : 'Activity emissions',
      help: 'Fossil fuel or electricity the technology uses. Zero for a zero-emission technology, by the methodology’s own rule.',
      why:
        'A backup generator or a grid-powered pump emits, and that comes off the reduction. v2.0 §8.2.1 ' +
        'sets it to zero where the technology uses no fuel or grid power; the legacy version counts only ' +
        'those two sources. The default appears once the technology gate is answered Yes.',
      required: true,
      unit: 'tCO₂e / year',
      placeholder: 'e.g. 40.6',
      group: 'Deductions',
    },
    {
      key: 'leakage_mode',
      kind: 'choice',
      label: 'How is leakage treated?',
      help: legacy
        ? 'Below 5% of reductions, the legacy version takes 5% off instead of monitoring.'
        : 'v2.0 Option 1 takes 2% of the net off by default; Option 2 is a detailed assessment.',
      required: true,
      choices: LEAKAGE_CHOICES[variant],
    },
    {
      key: 'leakage_tco2e',
      kind: 'number',
      label: 'Leakage figure',
      help: 'The assessed leakage, in tonnes a year.',
      required: true,
      unit: 'tCO₂e / year',
      placeholder: 'e.g. 12',
      when: (v) => v.leakage_mode === 'typed',
    },
  ];
}

const GATE_KEYS = ['boils_today', 'safe_at_use', 'low_emission_tech'];

const VARIABLE_KEYS = [
  'method',
  'country',
  'fnrb',
  'clean_share',
  'households',
  'people_per_premises',
  'litres_per_person',
  'days_operational',
  'capacity_litres',
  'half_premises',
  'half_people',
  'half_litres',
  'units',
  'usage_rate',
  'flow_lph',
  'hours_per_day',
  'units_per_premises',
  'days_present',
  'project_emissions',
  'leakage_mode',
  'leakage_tco2e',
];

/* --------------------------------------------------------------------------
   The worked example — Uganda, made up.

   The figures are round and obviously example figures: a thousand-times-ten
   households, five to a household, four litres each, three hundred and
   thirty days. They are not a real project and are labelled as an example
   wherever they render. Maintainer's ruling, 2 Sep 2026.
   -------------------------------------------------------------------------- */

const EXAMPLE_VALUES: PackValues = {
  boils_today: 'yes',
  safe_at_use: 'yes',
  low_emission_tech: 'yes',
  method: 'cws',
  country: 'UGA',
  fnrb: '',
  clean_share: '0.05',
  households: '10000',
  people_per_premises: '5',
  litres_per_person: '4',
  days_operational: '330',
  capacity_litres: '',
  half_premises: '',
  half_people: '',
  half_litres: '',
  project_emissions: '',
  leakage_mode: 'none',
  leakage_tco2e: '',
};

/* --------------------------------------------------------------------------
   The packs.
   -------------------------------------------------------------------------- */

function pack(variant: Variant): MethodPack {
  const legacy = variant === 'legacy';
  return {
    key: legacy ? 'gs-sdws-legacy-v1' : 'gs-sdws-paa-v2',
    name: legacy ? 'Carbon · Legacy V1' : 'Carbon · PAA v2.0',
    state: 'live',
    scope: 'Safe drinking water displacing boiling · ex-ante · screening',
    measures: legacy
      ? 'The tonnes of CO₂-equivalent a year a safe-water project would have screened at under the ' +
        'legacy version of the Gold Standard methodology, with the legacy non-renewable biomass share.'
      : 'The tonnes of CO₂-equivalent a year a safe-water project screens at under the Paris-aligned ' +
        'version of the Gold Standard methodology, before its further adjustments.',
    headlineLabel: legacy ? 'Emission reductions' : 'Net emission reductions',
    /* The maintainer's own clauses, signed as drafted on 2 Sep 2026. The
       primer renders them; nothing retypes them. */
    primerLine: legacy
      ? 'the carbon reduction a safe-drinking-water project would have screened at under the legacy Gold Standard method'
      : 'the carbon reduction a safe-drinking-water project screens at under the Paris-aligned Gold Standard method',
    tier: 'screening',
    method: {
      indicator: legacy ? 'Emission reductions' : 'Net emission reductions',
      indicatorUnit: 'tCO₂e per year',
      definition: legacy
        ? 'Emission reductions = baseline emissions − project emissions − leakage'
        : 'Net emission reductions = crediting baseline − activity emissions − leakage',
      lines: (values) => {
        const out = ['baseline emissions = litres supplied × emission factor per litre × (1 − share already on safe water)'];
        out.push(
          isHwt(values)
            ? 'litres supplied (Method 2) = premises × usage rate × per-premises litres a day × days present'
            : 'litres supplied (Method 1) = Σ premises × people × litres per person per day × days operating, capped by capacity'
        );
        out.push('emission factor per litre — derived. ' + PROFILE_LINE);
        if (!legacy) {
          out.push(
            'Not applied in this screening: the water-quality modifier, the usage-rate adjustment for Method 1, ' +
              'statistical conservativeness, the downward adjustment factor, and the lower-of-two crediting ' +
              'baseline. The credited figure is lower, never higher.'
          );
        }
        return out;
      },
      optionName: legacy ? 'V1.0 §3.6–3.9, Eq. 1–11' : 'V2.0 §7.3, §7.4 and §10.1 — unadjusted',
    },
    citation: legacy ? CITE_LEGACY_V1 : CITE_PAA_V2,
    alsoCites: legacy ? [CITE_UNFCCC_FNRB] : [CITE_MOFUSS],
    category: 'Carbon',
    tiles: (values, result) => tiles(variant, values, result),
    fields: fields(variant),
    gates: GATES,
    compute: (values) => compute(variant, values),
    formula: (values) => formula(variant, values),
    gateKeys: GATE_KEYS,
    variableKeys: VARIABLE_KEYS,
    defaultFor: (key, values) => defaultFor(variant, key, values),
    conditionalHelp: (key, values) => conditionalHelp(variant, key, values),
    example: {
      label: 'Example · Uganda, made up',
      note:
        'Round example figures for a made-up community supply in Uganda. Not a real project. ' +
        'Load them on both carbon tabs to see the transition delta.',
      values: EXAMPLE_VALUES,
    },
  };
}

export const GS_SDWS_LEGACY_V1: MethodPack = pack('legacy');
export const GS_SDWS_PAA_V2: MethodPack = pack('paa');
