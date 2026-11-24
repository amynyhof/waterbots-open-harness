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
 * ROWS DERIVE. THEY ARE NEVER INVENTED. `deskRows` turns the visit into record
 * rows. `nextStepRows` is what the right rail shows: the current stage's one
 * invite first, then derived rows that never outrank it. Place-filled does not
 * put the map ahead of an Eligibility invite. Ruled 16 Sep 2026.
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

import { HER_PACKS, section, verdictRows } from './worksheet.generated';
import {
  contextFor,
  counts,
  packDone,
  pathwayState,
  readiness,
  stateOf,
  type Sheet,
} from './worksheetState';
import { DRINKING_WATER_TYPE, type GsClassId, type ProjectStageId, type ProjectTypeId } from './projectTypes.generated';
import type { Surface } from './surfaces';

/* --------------------------------------------------------------------------
   The project context — what a visit says about its project.
   -------------------------------------------------------------------------- */

/**
 * THE TYPE AND THE STAGE, for "what kind" — item A16, 24 Sep 2026. The type
 * is the one standard project type Wellington matched the visitor's words to
 * and they confirmed, as an id from the shared file; a drinking-water project
 * also carries its class; the stage is on paper, being built, or already
 * running. Each is logged only on the visitor's yes, in his prompt, and each
 * is checked against the closed lists by the relay and again by the client.
 * "What kind" — water, carbon or unsure, the maintainer's brief of 2 Sep
 * 2026 — retired the same day: which pathway a project fits is Phoebe's to
 * find, never a field. The "standard of interest" chips died on 2 Sep 2026
 * and stay dead.
 */
export type ProjectType = '' | ProjectTypeId;
export type ProjectClass = '' | GsClassId;
export type ProjectStage = '' | ProjectStageId;

/**
 * Where a context field came from. Provenance stays honest on the card:
 * "typed" is the visitor's own entry on the form, "chat" is their own words to
 * Wellington, "pin" is the basin they clicked. Empty means empty.
 */
export type Provenance = '' | 'typed' | 'chat' | 'pin';

/**
 * PEOPLE SERVED — 27 Sep 2026, the maintainer's rulings on the people-served
 * proposal. The standard measure for a water supply project, as the visitor
 * said it. Households travel as households and are never converted on this
 * site; the conversion is Calvin's brief, from a household size with a source.
 * The relay checks it (api/_wellingtonAnswer.ts) and the client again.
 */
export type ServedUnit = 'people' | 'households';
export interface Served {
  count: number;
  unit: ServedUnit;
}

/** The two water supply types — the only ones Wellington asks people served of. */
export const WATER_SUPPLY_TYPES: readonly string[] = ['C-11', 'C-19'];

/** "2,400 households" — the count and the unit the visitor used, never converted. */
export function servedWords(served: Served): string {
  const unit = served.count === 1 ? (served.unit === 'people' ? 'person' : 'household') : served.unit;
  return `${served.count.toLocaleString('en-US')} ${unit}`;
}

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
  type: ProjectType;
  gsClass: ProjectClass;
  stage: ProjectStage;
  /** People served, as the visitor said it. Null until they say. */
  served: Served | null;
  provenance: {
    does: Provenance;
    name: Provenance;
    place: Provenance;
    type: Provenance;
    gsClass: Provenance;
    stage: Provenance;
    served: Provenance;
  };
}

/**
 * True once anything is on the record: a fact the visitor gave, or a pinned
 * basin. The save button waits for it — the maintainer's walk of 13 Nov 2026:
 * on landing there is nothing to save, so the site menu's Sign up is the door.
 */
export function somethingOnRecord(visit: { context: VisitContext; pin: unknown }): boolean {
  const c = visit.context;
  return (
    Boolean(visit.pin) ||
    c.served !== null ||
    [c.does, c.name, c.place, c.type, c.gsClass, c.stage].some((v) => String(v).trim() !== '')
  );
}

export const EMPTY_CONTEXT: VisitContext = {
  does: '',
  name: '',
  place: '',
  type: '',
  gsClass: '',
  stage: '',
  served: null,
  provenance: { does: '', name: '', place: '', type: '', gsClass: '', stage: '', served: '' },
};

/** What Wellington learned this turn, from the visitor's own words and their yes. */
export interface Learned {
  does?: string;
  name?: string;
  place?: string;
  type?: ProjectTypeId;
  gsClass?: GsClassId;
  stage?: ProjectStageId;
  served?: Served;
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
  const take = (field: 'does' | 'name' | 'place' | 'type' | 'gsClass' | 'stage', value: string) => {
    if (next.provenance[field] === 'typed') return;
    next = {
      ...next,
      [field]: value,
      provenance: { ...next.provenance, [field]: 'chat' },
    };
  };
  if (learned.does) take('does', learned.does);
  if (learned.name) take('name', learned.name);
  /* A more exact place the visitor gave Bridget is never undone by the shorter one he heard first (24 Nov 2026). */
  const heard = learned.place?.trim().toLowerCase() ?? '';
  const held = next.provenance.place === 'chat' ? next.place.trim().toLowerCase() : '';
  if (learned.place && !(held !== heard && held.includes(heard))) take('place', learned.place);
  if (learned.type) take('type', learned.type);
  /* A class is a fact about a drinking-water project and nothing else: it
     lands only beside C-19, and a type that is not C-19 clears any class. */
  if (next.type !== DRINKING_WATER_TYPE && next.gsClass) {
    next = { ...next, gsClass: '', provenance: { ...next.provenance, gsClass: '' } };
  }
  if (learned.gsClass && next.type === DRINKING_WATER_TYPE) take('gsClass', learned.gsClass);
  if (learned.stage) take('stage', learned.stage);
  if (learned.served) {
    next = { ...next, served: learned.served, provenance: { ...next.provenance, served: 'chat' } };
  }
  return next;
}

/**
 * A more exact place, in the visitor's own words to Bridget — the maintainer's ruling of 24 Nov 2026. It goes in front of
 * what Wellington heard, so the country they gave is kept: "Kitui" beside "Kenya" is "Kitui, Kenya". Words that name a
 * country themselves stand alone. A typed place is never overwritten.
 */
export function placedContext(context: VisitContext, place: string, namesACountry: (text: string) => boolean): VisitContext {
  const text = place.trim();
  if (text === '' || context.provenance.place === 'typed') return context;
  const had = context.provenance.place === 'pin' ? '' : context.place.trim();
  if (had.toLowerCase().includes(text.toLowerCase())) return context;
  const next = had === '' || namesACountry(text) ? text : `${text}, ${had}`;
  return { ...context, place: next, provenance: { ...context.provenance, place: 'chat' } };
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

/**
 * Where this visit is in the free screening loop. Console-owned, this visit
 * only. Place-filled never moves the stage to Partners — that wait is Phoebe
 * finishing, then Wellington inviting the map. Ruled 16 Sep 2026.
 */
export type ScreeningStage = 'learn' | 'eligibility' | 'partners' | 'quantify';

/**
 * THE WATER ESTIMATE — Violet's D-3 screen, the open core's, from 22 Nov 2026
 * (her word on #189). What the visitor set and what her engine gave back, kept
 * as her screen hands it over; this site works none of it out. Null until the
 * visitor changes something on her screen.
 *
 * ONLY THE PARTS THIS SITE READS are written here. Her package's own types,
 * D3Input and D3Result in @waterbots/violet/engine, are wider and fit this
 * shape; they are not imported, so the checks that compile this file alone,
 * with plain Node resolution, need not reach the package.
 */
export interface WaterEstimate {
  input: {
    view: string;
    option: string;
    withoutProjectM3PerYear?: number;
    accessLevel?: string;
    meteredM3PerYear?: number;
    flowM3PerHour?: number;
    operatingHoursPerYear?: number;
    litresPerPersonPerDay?: { value: number; source: string };
    daysOfAccessPerYear?: number;
    population?: { mode?: string; served?: number; householdSize?: number };
  };
  result: {
    /** Her module's standing, "Draft — pending expert review". */
    status: string;
    /** The volumetric water benefit, m³ a year; null until every value it needs is known. */
    vwbM3PerYear: number | null;
    /** The labels of every value still awaited. */
    awaiting: string[];
  };
}

/** The method's name, as Calvin's water chip, the report and the save call it. */
export const WATER_METHOD_NAME = 'VWBA 2.0 · D-3 Volume Provided';

/** The method's key in the save, kept from this site's own pack so the paid site's receiver reads the same key. */
export const WATER_METHOD_ID = 'vwba-2.0-d3-volume-provided';

export interface Visit {
  context: VisitContext;
  pin: MapPin | null;
  /** The water estimate from Violet's screen, or null before the visitor touched it. */
  water: WaterEstimate | null;
  stage: ScreeningStage;
  /** Wellington's real Eligibility invite, copied onto Phoebe's thread once. */
  eligibilityInvite: string;
  /** His line to Bridget, copied onto her thread once — "Wellington comes to you", 14 Nov 2026. */
  partnersInvite: string;
  /** His lines to Calvin and Violet, at the head of their desks — the same hand-off for every agent, 24 Nov 2026. */
  quantifyInvite: string;
  waterInvite: string;
  /** Bridget has handed the visitor on without a basin: her step does not hold them (24 Nov 2026). */
  partnersDone?: boolean;
  /** Phoebe has handed the visitor on with a path done or closed: what she has not read is "more to learn" (24 Nov 2026). */
  eligibilityHanded?: boolean;
  /** True once he has invited Partners while the stage is partners. */
  invitedPartners: boolean;
  /** True once he has invited Quantify. */
  invitedQuantify: boolean;
}

export const EMPTY_VISIT: Visit = {
  context: EMPTY_CONTEXT,
  pin: null,
  water: null,
  stage: 'learn',
  eligibilityInvite: '',
  partnersInvite: '',
  quantifyInvite: '',
  waterInvite: '',
  invitedPartners: false,
  invitedQuantify: false,
};

/**
 * Every row she asks has a verdict, on at least one pathway she reads.
 *
 * A pathway whose own test says it does not apply is done too: there is nothing
 * left to ask there, and holding the visit open for rows that do not exist would
 * be a wait for something that is never coming.
 */
export function eligibilityDone(visit: Visit, sheet: Sheet): boolean {
  return onePathDone(sheet, visit.context.gsClass);
}

/** One path she reads is done or closed. */
export function onePathDone(sheet: Sheet, gsClass: string): boolean {
  const packs = HER_PACKS.filter((pack) => section(pack) !== undefined);
  if (packs.length === 0) return false;
  return packs.some((pack) => {
    const context = contextFor(sheet, pack, gsClass);
    if (pathwayState(sheet, pack, context) === 'does-not-apply') return true;
    return packDone(sheet, pack, context);
  });
}

/**
 * HER PART IS DONE, as the agent map reads it (J4, 23 Nov 2026): `eligibilityDone`, and she has looked at every
 * pathway she reads. Without the second half, closing the first path counted as the end of her step, and the other
 * path was never asked about at all.
 */
export function phoebeDone(visit: Visit, sheet: Sheet): boolean {
  const packs = HER_PACKS.filter((pack) => section(pack) !== undefined);
  return eligibilityDone(visit, sheet) && packs.every((pack) => Object.keys(sheet.rows[pack] ?? {}).length > 0);
}

/**
 * Every question she asks has an answer, on every pathway still open. Stricter than `phoebeDone`: with this, there is
 * nothing left for her to ask, so Wellington comes whether or not her answer handed back (24 Nov 2026).
 */
export function nothingLeftToAsk(sheet: Sheet, gsClass: string): boolean {
  const packs = HER_PACKS.filter((pack) => section(pack) !== undefined);
  return (
    packs.length > 0 &&
    packs.every((pack) => {
      const context = contextFor(sheet, pack, gsClass);
      /* A path that does not apply, or with a row that stops it, is closed: she asks nothing more there. */
      return pathwayState(sheet, pack, context) === 'does-not-apply' || readiness(sheet, pack, context) === 'likely-not' || packDone(sheet, pack, context);
    })
  );
}

/** Opening Eligibility during learn starts that stage. Later stages stay put. */
export function openedEligibility(visit: Visit): Visit {
  if (visit.stage === 'learn') return { ...visit, stage: 'eligibility' };
  return visit;
}

/**
 * Wellington's route field advances the loop, and never skips Eligibility.
 * His Eligibility reply is stored as-is so Phoebe's thread can copy it.
 */
export function applyWellingtonRoute(
  visit: Visit,
  route: 'none' | 'eligibility' | 'quantification' | 'water' | 'map' | 'paid',
  reply: string
): Visit {
  const text = reply.trim();
  if (route === 'eligibility' && (visit.stage === 'learn' || visit.stage === 'eligibility')) {
    return {
      ...visit,
      stage: 'eligibility',
      eligibilityInvite: text || visit.eligibilityInvite,
    };
  }
  /* His line to Bridget is kept whenever he routes to her, so it heads her
     chat however the visitor got there (14 Nov 2026); the invite itself still
     waits for the Partners stage. */
  if (route === 'map') {
    return {
      ...visit,
      invitedPartners: visit.invitedPartners || visit.stage === 'partners',
      partnersInvite: text || visit.partnersInvite,
    };
  }
  /* Calvin's desk and, from 23 Nov 2026, Violet's: both are the Quantify step. His line to each heads their desk,
     as it does Phoebe's and Bridget's pages (24 Nov 2026). */
  if (route === 'quantification' || route === 'water') {
    const next = handedOver(visit, route, text);
    return visit.stage === 'partners' || visit.stage === 'quantify' ? { ...next, stage: 'quantify', invitedQuantify: true } : next;
  }
  return visit;
}

/** Where each desk's hand-off line is kept. */
const INVITE_OF = {
  eligibility: 'eligibilityInvite',
  map: 'partnersInvite',
  quantification: 'quantifyInvite',
  water: 'waterInvite',
} as const satisfies Partial<Record<Surface, keyof Visit>>;

/** Wellington's hand-off line for a desk, or '' before he has given one. His own desk has none. */
export function inviteFor(visit: Visit, surface: Surface): string {
  return surface === 'desk' ? '' : visit[INVITE_OF[surface]];
}

/** His hand-off line put at the head of a desk. Nothing else about the visit moves. */
export function handedOver(visit: Visit, surface: Surface, line: string): Visit {
  const text = line.trim();
  return surface === 'desk' || text === '' ? visit : { ...visit, [INVITE_OF[surface]]: text };
}

/**
 * A pin is the Partners step's work, so a pin while the visit is at Partners
 * finishes it — Bridget's step, A22, 30–31 Oct 2026. Where a pathway read allows
 * Quantify the visit moves there, so Wellington's next answer points on to
 * Quantify and never back to the map; that is the invite the rail already
 * showed after a pin (ruled 30 Sep 2026), now written into the stage he reads.
 * Where none allows it the stage stays, and nothing is invited past it.
 */
export function pinnedVisit(visit: Visit, pin: MapPin | null, canQuantify: boolean): Visit {
  const next = { ...visit, pin, context: pinnedContext(visit.context, pin) };
  if (pin !== null && visit.stage === 'partners' && canQuantify) {
    return { ...next, stage: 'quantify', invitedQuantify: true };
  }
  return next;
}

/** When every criterion has a verdict, Eligibility is done and the loop returns to Wellington. */
export function applyEligibilityProgress(visit: Visit, sheet: Sheet): Visit {
  if ((visit.stage === 'learn' || visit.stage === 'eligibility') && eligibilityDone(visit, sheet)) {
    return { ...visit, stage: 'partners' };
  }
  return visit;
}

/* --------------------------------------------------------------------------
   The dispatch rows.
   -------------------------------------------------------------------------- */

/** Who a row comes from. The desk shows the sender's face on the row. */
export type RowSender = 'phoebe' | 'bridget' | 'calvin' | 'violet' | 'wellington';

export type RowAction =
  | { kind: 'surface'; label: string; surface: Surface }
  | { kind: 'link'; label: string; href: string };

export interface DeskRow {
  key: string;
  from: RowSender;
  /** One complete sentence. */
  sentence: string;
  action: RowAction;
  /**
   * The stage invite — the one filled-blue primary. Derived rows never
   * take this. Ruled 16 Sep 2026: one primary, on the rail, not also on
   * "Next phase".
   */
  primary?: boolean;
}

const group = (n: number) => n.toLocaleString('en-GB');

/** Each funding path by its plain name, as Phoebe says it in chat (14 Nov 2026). */
const PLAIN_PATH: Record<string, string> = { water: 'Water benefits', carbon: 'Carbon credits' };

/** What each read means, in a visitor's words, for the right panel (14 Nov 2026). */
const PLAIN_READ: Record<string, string> = {
  'likely-eligible': 'look likely so far',
  'likely-not': 'look unlikely for now',
  'not-enough-known': 'need a few more answers',
};

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
export function deskRows(visit: Visit, sheet: Sheet): DeskRow[] {
  const rows: DeskRow[] = [];

  /* Phoebe — one row per pathway she has worked, and the pathway's own reading
     on it. Never one merged verdict for the project: a project can be likely
     eligible on water and not enough known on carbon, and saying one word for
     both would be a claim neither pathway made. */
  for (const pack of HER_PACKS) {
    const part = section(pack);
    if (!part) continue;
    const context = contextFor(sheet, pack, visit.context.gsClass);
    const state = pathwayState(sheet, pack, context);
    const tally = counts(sheet, pack, context);
    const looked = verdictRows(pack, context).filter(
      (row) => stateOf(sheet, pack, row.id).state !== 'unchecked'
    ).length;

    /* PLAIN WORDS, the maintainer's word of 14 Nov 2026 on #173: the line
       named the pathway and its read in the worksheet's own words ("The water
       pathway reads not enough known yet"). It now says the funding path and
       what the read means, as Phoebe does in chat. The read itself is still
       worked out from the rows and never from prose. */
    const name = PLAIN_PATH[part.sectionId] ?? part.sectionName;
    let sentence = '';
    if (state === 'does-not-apply') {
      sentence = `${name} do not fit this project. Phoebe's worksheet says why.`;
    } else if (looked > 0) {
      const open = [
        tally.fixable ? `${tally.fixable} can be fixed` : '',
        tally.unknown ? `${tally.unknown} to find out` : '',
        tally.blocked ? `${tally.blocked} cannot be fixed` : '',
      ].filter(Boolean);
      const read = PLAIN_READ[readiness(sheet, pack, context)];
      /* A Blocked row has no fix to show, only the card's reason, so where one
         stands the line says "or why it cannot". Corrected 26 Sep 2026. */
      const carries = tally.blocked
        ? 'The worksheet shows what would change each, or why it cannot.'
        : 'The worksheet shows what would change each.';
      sentence = open.length
        ? `${name} ${read}: ${tally.met} in place, ${open.join(', ')}. ${carries}`
        : `${name} ${read}, with ${tally.met} of the questions asked here in place. This is a first screening, not an official decision.`;
    }
    if (!sentence) continue;
    rows.push({
      key: `phoebe-${pack}`,
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

  /* Violet — the water estimate, once the visitor has worked on it. Under Calvin until 23 Nov 2026.
     The figure and the words for what is missing are her engine's; the row
     carries her result's own status, a draft until an outside expert checks it. */
  if (visit.water) {
    const { result } = visit.water;
    if (result.vwbM3PerYear !== null) {
      const figure = result.vwbM3PerYear.toLocaleString('en-GB', { maximumFractionDigits: 0 });
      rows.push({
        key: `violet-${WATER_METHOD_ID}`,
        from: 'violet',
        sentence: `${WATER_METHOD_NAME} screens at ${figure} m³ a year of water provided — a screening estimate. ${result.status}. This is a first screening, not an official decision.`,
        action: { kind: 'surface', label: 'Open Violet’s desk', surface: 'water' },
      });
    } else {
      rows.push({
        key: `violet-${WATER_METHOD_ID}`,
        from: 'violet',
        sentence: `${WATER_METHOD_NAME} is part-way through and still needs: ${result.awaiting.join(', ')}.`,
        action: { kind: 'surface', label: 'Open Violet’s desk', surface: 'water' },
      });
    }
  }

  /* The save door is no longer a row. Look pass, 8 Sep 2026: the bridge's
     button sits at the foot of the crew rail, always in view, and the rows
     here are only what the visit produced. */
  return rows;
}

/**
 * The current invite — one row, the stage's next step, in Wellington's loop.
 * Learn has none yet. After Eligibility is done, the invite is back to
 * Dispatches until he invites Partners.
 */
export function currentInvite(visit: Visit, canQuantify = false): DeskRow | null {
  if (visit.stage === 'eligibility') {
    return {
      key: 'invite-eligibility',
      from: 'wellington',
      sentence: 'Phoebe can take this on the Eligibility step.',
      action: { kind: 'surface', label: 'Open Eligibility', surface: 'eligibility' },
      primary: true,
    };
  }
  if (visit.stage === 'partners' && !visit.invitedPartners) {
    return {
      key: 'invite-desk',
      from: 'phoebe',
      sentence: 'Phoebe has finished this visit. Wellington is on Dispatches.',
      action: { kind: 'surface', label: 'Open Dispatches', surface: 'desk' },
      primary: true,
    };
  }
  /* THE MAP ROW IS TAKEN ONCE A BASIN IS PINNED. Pinning is the step's work, so
     the row goes; what lands next is Wellington's invite to Quantify, and only
     where a pathway read allows it (the rule his own route to Quantify keeps,
     item A17). When none allows it the rail shows nothing until the next agent
     says they are ready. Maintainer's ruling, 30 Sep 2026. */
  if (visit.stage === 'partners' && visit.pin !== null) {
    return canQuantify ? quantifyInvite() : null;
  }
  if (visit.stage === 'partners') {
    return {
      key: 'invite-partners',
      from: 'wellington',
      sentence: 'Pin the basin on the Partners step, with Bridget.',
      action: { kind: 'surface', label: 'Open the map', surface: 'map' },
      primary: true,
    };
  }
  if (visit.stage === 'quantify') return quantifyInvite();
  return null;
}

function quantifyInvite(): DeskRow {
  return {
    key: 'invite-quantify',
    from: 'wellington',
    sentence:
      'The Quantify step can work out a screening figure. Calvin is not answering yet; the calculator works.',
    action: { kind: 'surface', label: 'Open Quantify', surface: 'quantification' },
    primary: true,
  };
}

/**
 * SWITCHED OFF, 23 NOV 2026 (J4): the agent map decides who is called (src/lib/projectRecord.ts), and the
 * shell no longer asks this. Kept, not deleted.
 *
 * Whether any pathway she reads is one Calvin can screen: likely eligible, or
 * not enough known yet. Likely not, and a pathway that does not apply, are not.
 * The same rule Wellington's route to Quantify keeps (item A17, ruling R4).
 */
export function pathwayAllowsQuantify(visit: Visit, sheet: Sheet): boolean {
  return HER_PACKS.filter((pack) => section(pack) !== undefined).some((pack) => {
    const context = contextFor(sheet, pack, visit.context.gsClass);
    if (pathwayState(sheet, pack, context) === 'does-not-apply') return false;
    const read = readiness(sheet, pack, context);
    return read === 'likely-eligible' || read === 'not-enough-known';
  });
}

/**
 * Only a row that SENDS the visitor somewhere clears when taken. That is the
 * stage's invite, and Bridget's ask for the pin. Every other row is a record
 * fact — Phoebe's readings, the pinned basin's water-stress reading, Calvin's
 * figures — and stays in the rail whether or not the visitor is on its step.
 * Maintainer's ruling, 30 Sep 2026.
 */
function sendsSomewhere(row: DeskRow, visit: Visit): boolean {
  return row.primary === true || (row.key === 'bridget' && visit.pin === null);
}

/**
 * A row that sends the visitor somewhere is taken when they are on that step,
 * or, for one that sends them to the map, once a basin is pinned. A taken row
 * leaves the rail; the shell draws what is left.
 */
export function rowTaken(row: DeskRow, surface: Surface, visit: Visit): boolean {
  if (row.action.kind !== 'surface' || !sendsSomewhere(row, visit)) return false;
  if (row.action.surface === surface) return true;
  return row.action.surface === 'map' && visit.pin !== null;
}

/**
 * What the right rail shows. The current invite is first. Derived rows may
 * follow and never outrank it. Bridget's pinned basin shows from Partners;
 * her ask for the pin only from Quantify, because at Partners the stage's own
 * invite asks for it, and two rows asking one thing is a repeated question
 * (A22, 30 Oct 2026). Calvin's figures wait until Quantify.
 */
export function nextStepRows(visit: Visit, sheet: Sheet): DeskRow[] {
  const invite = currentInvite(visit, pathwayAllowsQuantify(visit, sheet));
  const derived = deskRows(visit, sheet).filter((row) => {
    if (row.from === 'bridget') return visit.pin !== null ? visit.stage === 'partners' || visit.stage === 'quantify' : visit.stage === 'quantify';
    if (row.from === 'calvin' || row.from === 'violet') return visit.stage === 'quantify';
    if (row.from === 'phoebe') return visit.stage !== 'learn';
    return true;
  });
  return invite ? [invite, ...derived] : derived;
}

/** The surface the current invite opens, or null while still learning. */
export function inviteSurface(visit: Visit): Surface | null {
  const invite = currentInvite(visit);
  return invite?.action.kind === 'surface' ? invite.action.surface : null;
}

/* --------------------------------------------------------------------------
   What the journey bar fills in.
   -------------------------------------------------------------------------- */

/** Whether each of the three open phases has something from this visit. */
export function journeyProgress(visit: Visit, sheet: Sheet): Record<'eligibility' | 'partners' | 'quantify', boolean> {
  return {
    eligibility: HER_PACKS.some((pack) =>
      verdictRows(pack, contextFor(sheet, pack, visit.context.gsClass)).some(
        (row) => stateOf(sheet, pack, row.id).state !== 'unchecked'
      )
    ),
    partners: visit.pin !== null,
    quantify: visit.water !== null,
  };
}

/* --------------------------------------------------------------------------
   THE CREW'S STATUS — the maintainer's word of 14 Nov 2026 (W27). The right
   panel is the crew, each with one plain line on where their part stands,
   worked out from the visit and the rows alone, never from anyone's prose:
   "Phoebe: water likely · carbon unlikely".
   -------------------------------------------------------------------------- */

/** Each funding path's short name in a status line. */
const SHORT_PATH: Record<string, string> = { water: 'water', carbon: 'carbon' };

/**
 * Where one funding path stands, in rule 14's three words: likely, more to learn,
 * unlikely (RULINGS.md, section 3; the screens' older words went on 23 Nov 2026).
 * A path that does not apply and a path with a Blocked row are both unlikely.
 */
export function pathStatus(visit: Visit, sheet: Sheet, pack: string): 'likely' | 'unlikely' | 'more to learn' | 'not started' {
  const context = contextFor(sheet, pack, visit.context.gsClass);
  if (pathwayState(sheet, pack, context) === 'does-not-apply') return 'unlikely';
  const read = readiness(sheet, pack, context);
  if (read === 'likely-not') return 'unlikely';
  if (read === 'likely-eligible') return 'likely';
  const looked = verdictRows(pack, context).some((row) => stateOf(sheet, pack, row.id).state !== 'unchecked');
  return looked || pathwayState(sheet, pack, context) === 'applies' ? 'more to learn' : 'not started';
}

/** Calvin's carbon headline, from the open core's engine, once the visitor has opened Quantify. */
export interface CarbonFigure {
  /** Emission reductions, tCO₂e a year, as the engine returned them. */
  er: number;
  /** "legacy" (V1.0) or "paa" (V2.0). */
  version: string;
}

/**
 * THE WORDS, FROM 21 NOV 2026 — the maintainer's word: each line says what
 * the agent is ready to do, then what they found, so it never reads as if the
 * visitor had fallen behind ("not started", "not done yet" are gone). The
 * "ready" line is the agent's offer; anything else is news.
 */
const READY: Record<Surface, string> = {
  desk: 'Ready to hear about your project',
  eligibility: 'Ready to check funding',
  map: 'Ready to find your basin',
  quantification: 'Ready to estimate',
  water: 'Ready to estimate',
};

/** A funding path's state, as the crew line says it. */
const PATH_WORDS: Record<ReturnType<typeof pathStatus>, string> = {
  likely: 'likely',
  unlikely: 'unlikely',
  'more to learn': 'more to learn',
  'not started': 'next',
};

/** One line per crew member, keyed by the step each one opens. */
export function crewStatus(
  visit: Visit,
  sheet: Sheet,
  carbon: CarbonFigure | null = null
): Record<Surface, string> {
  const c = visit.context;
  const asked = [c.does, c.type, c.stage, c.place.trim(), ...(WATER_SUPPLY_TYPES.includes(c.type) ? [c.served ? 'x' : ''] : [])];
  const known = asked.filter(Boolean).length;
  const wellington = known === 0 ? READY.desk : known === asked.length ? 'Has your project' : `Knows ${known} of ${asked.length} details`;

  const paths = HER_PACKS.filter((pack) => section(pack) !== undefined).map((pack) => ({
    name: SHORT_PATH[section(pack)!.sectionId] ?? section(pack)!.sectionName,
    status: pathStatus(visit, sheet, pack),
  }));
  const phoebe = paths.every((p) => p.status === 'not started')
    ? READY.eligibility
    : paths.map((p) => `${p.name[0].toUpperCase() + p.name.slice(1)}: ${PATH_WORDS[p.status]}`).join(" · ");

  const bridget = visit.pin ? `Basin found: ${visit.pin.stressLabel.toLowerCase()} water stress` : READY.map;

  /* Each has a line of their own from 23 Nov 2026 (J5); Violet's estimate was on Calvin's line until then. */
  const calvin = carbon ? 'Carbon estimate ready' : READY.quantification;
  const violet = !visit.water ? READY.water : visit.water.result.vwbM3PerYear !== null ? 'Water estimate ready' : 'Estimate started';
  return { desk: wellington, eligibility: phoebe, map: bridget, quantification: calvin, water: violet };
}

/**
 * Which lines are news — anything but the agent's "ready" offer. The crew
 * shows a member's line only when it is news or that member's step is in
 * view, so the first screen is lighter (the maintainer's word, 21 Nov 2026).
 */
export function crewNews(status: Record<Surface, string>): Record<Surface, boolean> {
  return {
    desk: status.desk !== READY.desk,
    eligibility: status.eligibility !== READY.eligibility,
    map: status.map !== READY.map,
    quantification: status.quantification !== READY.quantification,
    water: status.water !== READY.water,
  };
}
