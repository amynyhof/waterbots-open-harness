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
 * ~~THE SAVE ACTION IS A DOOR, NOT A BRIDGE.~~ **THE SAVE ACTION IS THE
 * BRIDGE, from 8 Sep 2026.** Until then "Save this project and sign up"
 * opened waterbots.ai in a new window and carried nothing across — the
 * two-window fallback, maintainer's ruling of 2 Sep 2026. Now the click
 * seals the visit and moves the page to production's sign-up with a ticket
 * in the address (item S7; src/lib/handoff.ts). The row is still always
 * last and still derives nothing; what it carries is the visit and nothing
 * else, and this site keeps no copy.
 */

import type { CriterionStatus } from './criteriaState';
import type { MethodPack, PackValues } from './methodPacks';
import { SITE_LABEL } from './site';
import type { Surface } from './surfaces';

/* --------------------------------------------------------------------------
   The project context — what a visit says about its project.
   -------------------------------------------------------------------------- */

/**
 * What kind of project it is, in the visitor's own answer to Wellington's
 * plain question. The console maps the answer to a standard internally; the
 * visitor never needs the word. "unsure" is a first-class answer and routes to
 * Phoebe. Maintainer's brief, 2 Sep 2026 — the "standard of interest" chips
 * died as a form concept the same day.
 */
export type ProjectKind = '' | 'water' | 'carbon' | 'unsure';

export const KIND_LABEL: Record<Exclude<ProjectKind, ''>, string> = {
  water: 'A water benefit in a basin',
  carbon: 'Safe drinking water that stops boiling · carbon',
  unsure: 'Not sure yet — Phoebe’s criteria settle it',
};

/**
 * Where a context field came from. Provenance stays honest on the card:
 * "typed" is the visitor's own entry on the form, "chat" is their own words to
 * Wellington, "pin" is the basin they clicked. Empty means empty.
 */
export type Provenance = '' | 'typed' | 'chat' | 'pin';

export interface VisitContext {
  /**
   * What the project does, in the visitor's own words to Wellington. The
   * first thing his interview asks, because it is the first thing Phoebe
   * needs. Never typed on a form; only heard. Added 4 Sep 2026.
   */
  does: string;
  /** What the visitor calls the project. Empty until they say. */
  name: string;
  /** Where it is, in their words — or the pinned basin's, if they left it blank. */
  place: string;
  kind: ProjectKind;
  provenance: { does: Provenance; name: Provenance; place: Provenance; kind: Provenance };
}

export const EMPTY_CONTEXT: VisitContext = {
  does: '',
  name: '',
  place: '',
  kind: '',
  provenance: { does: '', name: '', place: '', kind: '' },
};

/** What Wellington learned this turn, from the visitor's own words. */
export interface Learned {
  does?: string;
  name?: string;
  place?: string;
  kind?: Exclude<ProjectKind, ''>;
}

/**
 * The visitor typed a field on the form. Their entry, their provenance.
 * A blank clears the field and its provenance.
 */
export function typedContext(context: VisitContext, field: 'name' | 'place', value: string): VisitContext {
  return {
    ...context,
    [field]: value,
    provenance: { ...context.provenance, [field]: value.trim() === '' ? '' : 'typed' },
  };
}

/**
 * Wellington learned something. ONE SOURCE OF TRUTH, TWO WRITERS, ONE RULE:
 * a typed entry is never overwritten by what he heard; a blank field, or one
 * he filled earlier, or one the pin filled, takes the visitor's words to him.
 * Only the visitor's own words fill a field — the relay and the client both
 * check that his context came back as stated, never inferred.
 */
export function learnedContext(context: VisitContext, learned: Learned): VisitContext {
  let next = context;
  const take = (field: 'does' | 'name' | 'place' | 'kind', value: string) => {
    if (next.provenance[field] === 'typed') return;
    next = {
      ...next,
      [field]: value,
      provenance: { ...next.provenance, [field]: 'chat' },
    };
  };
  if (learned.does) take('does', learned.does);
  if (learned.name) take('name', learned.name);
  if (learned.place) take('place', learned.place);
  if (learned.kind) take('kind', learned.kind);
  return next;
}

/**
 * The pin filled the place, or cleared what it had filled. Never touches a
 * typed place, and never a place the visitor told Wellington.
 */
export function pinnedContext(context: VisitContext, pin: MapPin | null): VisitContext {
  const wrote = context.provenance.place === 'pin';
  if (pin === null) {
    return wrote ? { ...context, place: '', provenance: { ...context.provenance, place: '' } } : context;
  }
  if (context.provenance.place === 'typed' || context.provenance.place === 'chat') return context;
  return { ...context, place: describePin(pin), provenance: { ...context.provenance, place: 'pin' } };
}

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
  | { kind: 'link'; label: string; href: string }
  /** The bridge: seal the visit and go to production's sign-up. */
  | { kind: 'seal'; label: string };

/**
 * Whether a pack's answers are exactly its worked example.
 *
 * Used by the desk row, which then says so first, and by the seal, which
 * flags it — a made-up figure must never travel looking like the visitor's
 * own. One test, two readers.
 */
export function isWorkedExample(pack: MethodPack, values: PackValues): boolean {
  if (pack.example === undefined) return false;
  const example = pack.example.values;
  return Object.keys({ ...values, ...example }).every((k) => (values[k] ?? '') === (example[k] ?? ''));
}

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
 * Phoebe's row exists once any criterion has moved. Bridget's once a place is
 * known — typed, heard by Wellington, or pinned — and a pinned basin fills it
 * (slice 2, maintainer's ruling of 7 Sep 2026; before that, only a pin made
 * her row). Calvin's once a pack has a with-project figure — and it says whether
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

  /* Bridget — the place, then the pinned basin. Her row appears once a place
     is known, from wherever it came, and asks for the pin; the pin fills it
     with the basin's published reading. A row with no place would have
     nothing real to say, so there is none. */
  const place = visit.context.place.trim();
  if (visit.pin) {
    const pin = visit.pin;
    const derived = pin.level === 4 ? ' The Level 4 reading is derived from its Level 6 basins.' : '';
    rows.push({
      key: 'bridget',
      from: 'bridget',
      sentence: `The pinned basin is HYBAS ${pin.hybasId}, ${group(Math.round(pin.subAreaKm2))} km², reading ${pin.stressLabel} for water stress.${derived}`,
      action: { kind: 'surface', label: 'Open the map', surface: 'map' },
    });
  } else if (place !== '') {
    rows.push({
      key: 'bridget',
      from: 'bridget',
      sentence: `The project is in ${place}. Pin its basin on the map, and this row will carry the basin's water-stress reading.`,
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
    const lead = isWorkedExample(pack, values) ? 'Example figures, not a real project: ' : '';
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

  /* Wellington — the bridge. Always last, always there. The click seals the
     visit and moves the page to production's sign-up; the consent line under
     the button says what crosses, and it is worded in src/components/CrewRail.tsx. */
  rows.push({
    key: 'save',
    from: 'wellington',
    sentence: `Save this project and sign up on ${SITE_LABEL}. What you have built here goes across with you, and this site keeps no copy.`,
    action: { kind: 'seal', label: 'Save this project and sign up' },
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
