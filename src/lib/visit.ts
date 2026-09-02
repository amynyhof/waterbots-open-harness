/**
 * The visit — everything this console knows about the project in front of it.
 *
 * ONE PLACE, HELD BY THE SHELL, KEPT FOR THIS VISIT ONLY. Nothing here is
 * written to storage. A reload starts over, and the page says so. That is the
 * no-memory-across-visits ruling of 21 Aug 2026, unchanged; what changed on
 * 2 Sep 2026 (item S11) is that the pieces the surfaces already held —
 * Phoebe's worksheet rows, the calculator's answers — now sit together with
 * the two new ones, the project context and the map pin, so that the desk can
 * read them and Wellington's rows derive from them.
 *
 * ROWS DERIVE. THEY ARE NEVER INVENTED. `deskRows` below is the one function
 * that turns the visit into dispatch rows, and every row it returns points at
 * the thing on this site it came from. An empty visit produces no derived
 * rows — the desk explains what will appear — and the save row, which is the
 * one row that is always there, opens the paid site. Nothing is persisted
 * here and nothing crosses without the visitor's click.
 *
 * THE SAVE ACTION IS A DOOR, NOT A BRIDGE. Until the production bridge (item
 * S7, on production's desk as their #149) is real, "Save this project and
 * sign up" opens waterbots.ai in a new window and carries nothing across. The
 * row's own copy says so. Maintainer's ruling, 2 Sep 2026 — the two-window
 * fallback.
 */

import type { CriterionStatus } from './criteriaState';
import type { MethodPack, PackValues } from './methodPacks';
import { SITE_LABEL, SITE_URL } from './site';
import type { Surface } from './surfaces';

/* --------------------------------------------------------------------------
   The project context — what a visit says about its project.
   -------------------------------------------------------------------------- */

/** The standard the visitor is interested in. An interest, not a capability. */
export type StandardInterest = '' | 'water' | 'carbon' | 'unsure';

export const STANDARD_CHOICES: { value: StandardInterest; label: string }[] = [
  { value: 'water', label: 'Water benefit · VWBA' },
  { value: 'carbon', label: 'Carbon' },
  { value: 'unsure', label: 'Not sure yet' },
];

export interface VisitContext {
  /** What the visitor calls the project. Empty until they say. */
  name: string;
  /** Where it is, in their words — or the pinned basin's, if they left it blank. */
  place: string;
  standard: StandardInterest;
}

export const EMPTY_CONTEXT: VisitContext = { name: '', place: '', standard: '' };

/* --------------------------------------------------------------------------
   The map pin — the one basin this visit is about.
   -------------------------------------------------------------------------- */

export interface MapPin {
  /** HydroSHEDS identifiers, as published. */
  hybasId: number;
  pfafId: number;
  /** Which layer it was pinned from. Level 4 stress is derived; Level 6 is WRI's. */
  level: 4 | 6;
  /** WRI's exact published stress label for the basin, or the honest fallback. */
  stressLabel: string;
  /** Sub-basin area in km², as published. */
  subAreaKm2: number;
}

/** One line naming the basin the way the map's tooltip does. */
export function describePin(pin: MapPin): string {
  return `HYBAS ${pin.hybasId} · Level ${pin.level} · ${pin.stressLabel}`;
}

/* --------------------------------------------------------------------------
   The whole visit.
   -------------------------------------------------------------------------- */

export interface Visit {
  context: VisitContext;
  pin: MapPin | null;
  /** Each pack's answers, keyed by pack. Empty means nothing typed. */
  packValues: Record<string, PackValues>;
}

export const EMPTY_VISIT: Visit = { context: EMPTY_CONTEXT, pin: null, packValues: {} };

/* --------------------------------------------------------------------------
   The dispatch rows.
   -------------------------------------------------------------------------- */

/** Who a row comes from. The desk shows the sender's face on the row. */
export type RowSender = 'phoebe' | 'bridget' | 'calvin' | 'wellington';

export type RowAction =
  | { kind: 'surface'; label: string; surface: Surface }
  | { kind: 'link'; label: string; href: string };

export interface DeskRow {
  key: string;
  from: RowSender;
  /** One complete sentence. */
  sentence: string;
  action: RowAction;
}

const group = (n: number) => n.toLocaleString('en-GB');

/**
 * The rows, derived from the visit and from nothing else.
 *
 * Phoebe's row exists once any criterion has moved. Bridget's once a basin is
 * pinned. Calvin's once a pack has a with-project figure — and it says whether
 * the benefit is complete or still waiting on the without-project volume,
 * because a row that named a number while the benefit was incomplete would be
 * claiming more than the worksheet does. The save row is always last.
 */
export function deskRows(
  visit: Visit,
  statuses: CriterionStatus[],
  packs: MethodPack[]
): DeskRow[] {
  const rows: DeskRow[] = [];

  /* Phoebe — the eligibility worksheet. */
  const touched = statuses.filter((s) => s.state !== 'unchecked').length;
  if (touched > 0) {
    const met = statuses.filter((s) => s.state === 'met').length;
    const notYet = statuses.filter((s) => s.state === 'not-yet').length;
    const total = statuses.length;
    let sentence: string;
    if (met === total) {
      sentence = `All ${total} eligibility criteria are met on the worksheet, so this project looks eligible.`;
    } else if (notYet > 0) {
      sentence = `${met} of ${total} eligibility criteria are met and ${notYet} ${notYet === 1 ? 'is' : 'are'} not yet, each with a route forward on the worksheet.`;
    } else {
      sentence = `${met} of ${total} eligibility criteria are met so far; ${total - met} ${total - met === 1 ? 'has' : 'have'} not been checked yet.`;
    }
    rows.push({
      key: 'phoebe',
      from: 'phoebe',
      sentence,
      action: { kind: 'surface', label: 'Open the Eligibility worksheet', surface: 'eligibility' },
    });
  }

  /* Bridget — the pinned basin. */
  if (visit.pin) {
    const pin = visit.pin;
    const derived = pin.level === 4 ? ' The Level 4 reading is derived from its Level 6 basins.' : '';
    rows.push({
      key: 'bridget',
      from: 'bridget',
      sentence: `The pinned basin is HYBAS ${pin.hybasId}, ${group(Math.round(pin.subAreaKm2))} km², reading ${pin.stressLabel} for water stress.${derived}`,
      action: { kind: 'surface', label: 'Open the map', surface: 'map' },
    });
  }

  /* Calvin — each live pack that has produced a figure. The row reads the
     pack's own headline and unit; it knows nothing about any method. */
  for (const pack of packs) {
    const values = visit.packValues[pack.key];
    if (!values) continue;
    const result = pack.compute(values);
    /* A row built from a pack's worked example says so first. The example is
       labelled on the worksheet; a row that dropped the label would put a
       made-up figure on the desk looking like the visitor's own. */
    const example =
      pack.example !== undefined &&
      Object.keys({ ...values, ...pack.example.values }).every(
        (k) => (values[k] ?? '') === (pack.example!.values[k] ?? '')
      );
    const lead = example ? 'Example figures, not a real project: ' : '';
    if (result.kind === 'complete') {
      const h = result.headline;
      const figure = h.value.toLocaleString('en-GB', { maximumFractionDigits: h.decimals });
      rows.push({
        key: `calvin-${pack.key}`,
        from: 'calvin',
        sentence: `${lead}${pack.name} screens at ${figure} ${h.unit} for ${h.label.toLowerCase()} — a screening estimate, not verified.`,
        action: { kind: 'surface', label: 'Open Quantify', surface: 'quantification' },
      });
    } else if (result.kind === 'incomplete') {
      rows.push({
        key: `calvin-${pack.key}`,
        from: 'calvin',
        sentence: `${lead}${pack.name} is part-way through and still needs an answer before it can say its figure. ${result.missing}`,
        action: { kind: 'surface', label: 'Open Quantify', surface: 'quantification' },
      });
    }
  }

  /* Wellington — the door. Always last, always there. */
  rows.push({
    key: 'save',
    from: 'wellington',
    sentence: `Save this project and sign up on ${SITE_LABEL}. Saving happens there, and nothing you entered here is carried across yet.`,
    action: { kind: 'link', label: 'Save this project and sign up', href: SITE_URL },
  });

  return rows;
}

/* --------------------------------------------------------------------------
   What the journey bar fills in.
   -------------------------------------------------------------------------- */

/** Whether each of the three open phases has something from this visit. */
export function journeyProgress(
  visit: Visit,
  statuses: CriterionStatus[],
  packs: MethodPack[]
): Record<'eligibility' | 'partners' | 'quantify', boolean> {
  return {
    eligibility: statuses.some((s) => s.state !== 'unchecked'),
    partners: visit.pin !== null,
    quantify: packs.some((p) => {
      const v = visit.packValues[p.key];
      if (!v) return false;
      const r = p.compute(v);
      return r.kind === 'complete' || r.kind === 'incomplete';
    }),
  };
}
