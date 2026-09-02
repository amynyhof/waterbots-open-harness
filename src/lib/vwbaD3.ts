/**
 * VWBA 2.0 · D-3 Volume Provided — a screening pack.
 *
 * WHAT IT COVERS, AND NOTHING ELSE. Water supply for households and
 * communities — drinking and domestic use. Ex-ante, before the project runs.
 * Option 3 of Table D3.3: people × litres per person per day × days, capped by
 * the system's capacity where that is known.
 *
 * WHAT IT DOES NOT COVER, deliberately and by name: sanitation (method D-6),
 * irrigation (Table D3.2, a different table entirely), putting water back into
 * the ground (D-4), and metered supply (Option 1). A project that is any of
 * those gets told which method fits instead of getting a number from this one.
 *
 * Later: if a project has a meter, the metered option is the better route and
 * this pack is not it. That option is not built here.
 *
 * WHAT IT PRODUCES IS A SCREENING ESTIMATE. Anticipated, never delivered and
 * never verified, and it carries a consultant-review tag wherever it renders.
 * This console does not replicate anyone's calculator and does not speak for
 * the publisher — the licence is CC BY 4.0, the source is attributed, and the
 * changes are indicated.
 *
 * THE WITHOUT-PROJECT VOLUME IS THE WHOLE DIFFICULTY, and it is the one thing
 * this file is most careful about. It is required, it may be left empty, and
 * an empty one is NEVER zero. A pack that quietly treated a blank as zero
 * would report the entire with-project volume as benefit, which is the single
 * easiest way for this method to produce a large and confident wrong number.
 *
 * The guidebook is cited and linked. It is not quoted at length, its tables
 * are not reproduced, and no page of it is pasted into this file or the UI.
 */

import type { Figure, FormulaStep, MethodPack, PackResult, PackValues } from './methodPacks';

/* --------------------------------------------------------------------------
   The published defaults.

   These are the guidebook's own figures, cited on the fields that use them.
   A rate measured for the project, or a local rate, is better than a default
   and the field says so — the default is a starting point, not an answer.
   -------------------------------------------------------------------------- */

/** Litres per person per day at full access. */
const LPCD_FULL = '20';
/** Litres per person per day at limited access. */
const LPCD_LIMITED = '2';
/** Days a year at full access. Limited access has NO default — see below. */
const DAYS_FULL = '365';

/**
 * Sphere rates are humanitarian and disaster figures.
 *
 * They are OFF unless the visitor says the project is humanitarian, and even
 * then they are help text rather than a switched default. A default that
 * changed itself under someone would be a figure they never chose.
 */
const SPHERE_HELP =
  'Humanitarian and disaster responses often use the Sphere rates instead. ' +
  'Check them against this project and type the figure you mean — nothing is switched for you.';

/* --------------------------------------------------------------------------
   Reading the answers.

   Empty means empty everywhere in this file. A blank never becomes a zero,
   and a value that is not a number never becomes one either.
   -------------------------------------------------------------------------- */

const isBlank = (v: string | undefined): boolean => v === undefined || v.trim() === '';

/**
 * A field's number, or null when it is blank or not a number.
 *
 * Returns null rather than NaN or 0 so that every caller has to decide what a
 * missing figure means, rather than inheriting a wrong one.
 */
export function readNumber(values: PackValues, key: string): number | null {
  const raw = values[key];
  if (isBlank(raw)) return null;
  const n = Number(String(raw).replace(/,/g, '').trim());
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/** The effective litres per person per day: the visitor's, else the default. */
function effectiveLpcd(values: PackValues): number | null {
  const typed = readNumber(values, 'lpcd');
  if (typed !== null) return typed;
  const access = values.access_level;
  if (access === 'full') return Number(LPCD_FULL);
  if (access === 'limited') return Number(LPCD_LIMITED);
  return null;
}

/**
 * The effective days a year.
 *
 * Full access defaults to 365. LIMITED ACCESS HAS NO DEFAULT — a limited
 * supply usually runs for fewer days than the year, and guessing 365 would
 * inflate every limited-access estimate. The visitor types it.
 */
function effectiveDays(values: PackValues): number | null {
  const typed = readNumber(values, 'days');
  if (typed !== null) return typed;
  if (values.access_level === 'full') return Number(DAYS_FULL);
  return null;
}

/* --------------------------------------------------------------------------
   The arithmetic.
   -------------------------------------------------------------------------- */

/**
 * people × litres per person per day × days, then capped by capacity.
 *
 * The cap is applied only when a capacity is given. An absent capacity means
 * unknown, not unlimited and not zero, so the figure stands uncapped and the
 * field says plainly that nothing is assumed in its place.
 */
export function withProjectLitres(values: PackValues): number | null {
  const people = readNumber(values, 'people');
  const lpcd = effectiveLpcd(values);
  const days = effectiveDays(values);
  if (people === null || lpcd === null || days === null) return null;

  const peopleWater = people * lpcd * days;
  const capacity = readNumber(values, 'capacity_lpy');
  return capacity === null ? peopleWater : Math.min(peopleWater, capacity);
}

/**
 * The pack's answer.
 *
 * Order matters: gates first, then completeness, then arithmetic. A project
 * that fails a gate never reaches the arithmetic, so it can never be given a
 * number it is not entitled to.
 */
function compute(values: PackValues): PackResult {
  for (const gate of VWBA_D3.gates) {
    if (values[gate.fieldKey] === 'no') {
      return { kind: 'blocked', stopReason: gate.stopReason, routeForward: gate.routeForward };
    }
  }

  const withProject = withProjectLitres(values);
  if (withProject === null) return { kind: 'pending' };

  const litreFigure = (key: string, label: string, litres: number): Figure => ({
    key,
    label,
    value: litres,
    unit: 'L / year',
    decimals: 0,
    secondary: `${(litres / 1000).toLocaleString('en-GB', { maximumFractionDigits: 2 })} m³ / year`,
  });

  const figures: Figure[] = [litreFigure('with', 'With the project', withProject)];

  /* The without-project volume. Required, empty allowed, NEVER zero by
     default. A blank stops the benefit from being worked out; it does not
     make the benefit equal to the whole with-project volume. */
  const without = readNumber(values, 'without_lpy');
  if (without === null) {
    return {
      kind: 'incomplete',
      figures,
      missing:
        'The benefit needs the without-project volume. Leave it blank until you have it — ' +
        'a blank is not zero, and this step will not treat it as one.',
    };
  }

  const benefit = withProject - without;
  /* The headline is the benefit in cubic metres, the reported unit, with the
     litres beside it. */
  const headline: Figure = {
    key: 'benefit',
    label: 'Anticipated benefit',
    value: benefit / 1000,
    unit: 'm³ / year',
    decimals: 2,
    secondary: `${benefit.toLocaleString('en-GB')} L / year`,
  };
  figures.push(litreFigure('benefit-litres', 'Anticipated benefit', benefit));

  return { kind: 'complete', figures, headline };
}

/* --------------------------------------------------------------------------
   The formula, written out.
   -------------------------------------------------------------------------- */

/** A figure grouped for reading, or an em dash where there is none. */
const show = (n: number | null): string => (n === null ? '—' : n.toLocaleString('en-GB'));

/**
 * The formula with the visitor's own figures dropped into it.
 *
 * Every blank shows as an em dash rather than vanishing or reading as zero, so
 * someone looking at an unfinished line can see exactly which figure the
 * answer is waiting on.
 */
function formula(values: PackValues): FormulaStep[] {
  const people = readNumber(values, 'people');
  const lpcd = effectiveLpcd(values);
  const days = effectiveDays(values);
  const capacity = readNumber(values, 'capacity_lpy');
  const without = readNumber(values, 'without_lpy');

  const peopleWater =
    people === null || lpcd === null || days === null ? null : people * lpcd * days;

  const steps: FormulaStep[] = [
    {
      label: 'What people would use',
      terms: 'people × litres per person per day × days',
      live: `${show(people)} × ${show(lpcd)} × ${show(days)}`,
      value: show(peopleWater) === '—' ? null : show(peopleWater),
      unit: 'L / year',
    },
  ];

  /* The cap only appears when a capacity was given. An absent capacity means
     unknown, so there is no line to draw — not a line reading "no limit". */
  const withProject = capacity === null ? peopleWater : peopleWater === null ? null : Math.min(peopleWater, capacity);

  if (capacity !== null) {
    steps.push({
      label: 'With the project, capped by what the system can deliver',
      terms: 'the smaller of what people would use and the system’s capacity',
      live: `min(${show(peopleWater)}, ${show(capacity)})`,
      value: show(withProject) === '—' ? null : show(withProject),
      unit: 'L / year',
    });
  }

  steps.push({
    label: 'Anticipated benefit',
    terms: 'with the project − without the project',
    live: `${show(withProject)} − ${show(without)}`,
    value:
      withProject === null || without === null ? null : show(withProject - without),
    unit: 'L / year',
  });

  return steps;
}

/* --------------------------------------------------------------------------
   The pack.
   -------------------------------------------------------------------------- */

export const VWBA_D3: MethodPack = {
  key: 'vwba-2.0-d3-volume-provided',
  name: 'VWBA 2.0 · D-3 Volume Provided',
  state: 'live',
  scope: 'WASH — household or community water supply · ex-ante',
  measures:
    'How much water a year a supply project provides to the people it serves, ' +
    'over and above what they were already getting without it.',
  /* The maintainer's own clause, signed 1 Sep 2026. The primer renders it. */
  primerLine: 'the water volume a household or community supply project provides',
  tier: 'screening',

  /* The method said once, in its own terms. Not a paste of the guidebook —
     one defining line, the one option in use, and what is reported. */
  method: {
    indicator: 'Volume provided',
    indicatorUnit: 'm³ per year',
    definition:
      'Volumetric water benefit = volume provided with the project − volume provided without the project',
    /* The option in use, then the capping step only when a capacity was given. */
    lines: (values) => {
      const out = ['volume provided = people × litres per person per day × days'];
      if ((values.capacity_lpy ?? '').trim() !== '') {
        out.push('with the project = the smaller of that figure and the system’s yearly capacity');
      }
      return out;
    },
    optionName: 'Table D3.3, Option 3',
  },
  headlineLabel: 'Anticipated benefit',
  category: 'Water',

  citation: {
    document: 'Volumetric Water Benefit Accounting 2.0',
    version: 'Version 1, September 2025',
    section: 'Appendix D · method D-3 · Table D3.3, Option 3',
    page: 'pp. 44–46',
    full:
      'World Resources Institute, LimnoTech, Bluerisk, and Bonneville Environmental Foundation. ' +
      'Volumetric Water Benefit Accounting 2.0. Version 1, September 2025. ' +
      'Appendix D, method D-3, pp. 44–46. CC BY 4.0.',
    href: 'https://doi.org/10.46830/wrigb.23.00112',
  },

  fields: [
    {
      key: 'activity_is_wash_supply',
      kind: 'yesno',
      label: 'Is this a project that gives people household or community water?',
      help: 'Drinking and domestic use. Not toilets, not crops, not water put into the ground.',
      why:
        'This pack only covers water supply. Sanitation is method D-6 and putting water back into ' +
        'the ground is D-4, both of which work differently. Irrigation is a different table again. ' +
        'Answering No stops this pack and points you at the method that fits.',
      required: true,
    },
    {
      key: 'quality_ok',
      kind: 'yesno',
      label: 'Will the water be clean enough for how people will use it?',
      help: 'Meets local rules for that use, and is not contaminated.',
      why:
        'A gate, not a score. Water that is not fit for the use it is put to does not produce a ' +
        'countable benefit, so no volume is worked out at all. What moves it forward is local ' +
        'quality evidence for the type of use.',
      required: true,
    },
    {
      key: 'access_ok',
      kind: 'yesno',
      label: 'Can people actually get the water?',
      help: 'At home, or at a public tap people can reach.',
      why:
        'A gate, not a score. Water people cannot reach is not water they receive. What moves it ' +
        'forward is household access, or public access people can reasonably get to.',
      required: true,
    },
    {
      key: 'within_1km',
      kind: 'yesno',
      label: 'Is the water within about 1 km of where people live?',
      help: 'Helpful to know, and you may leave it blank. It does not change the figure.',
      why:
        'A widely used marker of basic access. It gives context to the access question above, and ' +
        'it is not part of any formula here — nothing you answer changes the volume.',
      required: false,
    },
    {
      key: 'humanitarian',
      kind: 'yesno',
      label: 'Is this humanitarian or disaster response?',
      help: 'Optional. Leave it blank or answer No for ordinary projects.',
      why:
        'Humanitarian and disaster settings often use different per-person rates. Saying Yes shows ' +
        'you a note about them; it never changes a figure on your behalf.',
      required: false,
    },
    {
      key: 'people',
      kind: 'number',
      label: 'How many people will get this water?',
      help: 'The number of people the project serves.',
      required: true,
      unit: 'people',
      placeholder: 'e.g. 100',
    },
    {
      key: 'access_level',
      kind: 'choice',
      label: 'Is this full access or limited access?',
      help: 'This suggests the two figures below, and you can change either.',
      why:
        'Full access means a supply people can rely on for their everyday needs. Limited access ' +
        'means a smaller or less reliable supply. The two carry different per-person rates, and ' +
        'limited access carries no default for the number of days.',
      required: true,
      choices: [
        { value: 'full', label: 'Full' },
        { value: 'limited', label: 'Limited' },
      ],
    },
    {
      key: 'lpcd',
      kind: 'number',
      label: 'Litres each person uses per day',
      help: '20 for full access, 2 for limited. Type your own if the project has a figure.',
      why:
        'These are the guidebook’s published default rates. A rate measured for this project, or a ' +
        'local rate, is better than a default and should be used instead.',
      required: true,
      unit: 'L / person / day',
      placeholder: '20',
    },
    {
      key: 'days',
      kind: 'number',
      label: 'How many days a year will they have this water?',
      help: '365 for full access. Limited access has no default — type the number.',
      why:
        'A limited supply usually runs for fewer days than the whole year, and there is no safe ' +
        'figure to assume. Guessing 365 would inflate every limited-access estimate, so this step ' +
        'asks instead.',
      required: true,
      unit: 'days / year',
      placeholder: '365',
    },
    {
      key: 'capacity_lpy',
      kind: 'number',
      label: 'If you know it: how many litres can the system actually deliver in a year?',
      help: 'Optional. Skip it if you do not know — nothing is assumed in its place.',
      why:
        'If you give a capacity, the with-project figure becomes whichever is smaller: what people ' +
        'would use, or what the system can actually deliver. Leaving it blank means unknown, which ' +
        'is not the same as unlimited and not the same as zero.',
      required: false,
      unit: 'L / year',
      placeholder: 'optional',
    },
    {
      key: 'without_lpy',
      kind: 'number',
      label: 'How many litres a year did these people already get without this project?',
      help: 'Required, and you may leave it blank. A blank is not zero.',
      why:
        'The benefit is the difference between what people get with the project and what they were ' +
        'already getting without it. If people had some supply before, counting the whole new ' +
        'volume as benefit would overstate it — sometimes by all of it. Left blank, this step ' +
        'shows the with-project figure and says the benefit is incomplete. It never fills the gap ' +
        'with zero.',
      required: true,
      unit: 'L / year',
      placeholder: 'leave blank if unknown',
    },
  ],

  gates: [
    {
      fieldKey: 'activity_is_wash_supply',
      stopReason:
        'This pack only covers household and community water supply, and this project is ' +
        'something else. No volume is worked out.',
      routeForward:
        'Sanitation projects use method D-6. Putting water back into the ground uses D-4. ' +
        'Irrigation uses a different table again. None of those is built here yet.',
    },
    {
      fieldKey: 'quality_ok',
      stopReason:
        'Water that is not clean enough for the use it is put to does not produce a countable ' +
        'benefit. No volume is worked out.',
      routeForward:
        'Gather local water quality evidence for the way this water will actually be used, and ' +
        'come back when it meets the local rules.',
    },
    {
      fieldKey: 'access_ok',
      stopReason:
        'Water people cannot reach is not water they receive. No volume is worked out.',
      routeForward:
        'Household access, or a public tap people can reasonably get to, is what moves this ' +
        'forward.',
    },
  ],

  compute,
  formula,

  /* Which questions decide whether the pack fits, and which carry figures.
     The worksheet groups by these rather than by guessing from field kinds. */
  gateKeys: ['activity_is_wash_supply', 'quality_ok', 'access_ok', 'within_1km', 'humanitarian'],
  variableKeys: ['people', 'access_level', 'lpcd', 'days', 'capacity_lpy', 'without_lpy'],

  defaultFor(fieldKey, values) {
    if (fieldKey === 'lpcd') {
      if (values.access_level === 'full') return LPCD_FULL;
      if (values.access_level === 'limited') return LPCD_LIMITED;
      return null;
    }
    /* Full access defaults to a full year. Limited access deliberately does
       not — see effectiveDays above. */
    if (fieldKey === 'days' && values.access_level === 'full') return DAYS_FULL;
    return null;
  },

  conditionalHelp(fieldKey, values) {
    if (fieldKey === 'lpcd' && values.humanitarian === 'yes') return SPHERE_HELP;
    return null;
  },
};
