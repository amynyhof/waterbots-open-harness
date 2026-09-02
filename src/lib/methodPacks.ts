/**
 * Method packs — the tools that live inside the Quantification step.
 *
 * THE STEP IS QUANTIFICATION. A PACK IS ONE TOOL INSIDE IT. That separation is
 * the whole point of this file: the same seat has to hold carbon screening,
 * the other VWBA D-methods, and methods from standards this console does not
 * carry yet. Nothing about the surface may be typed to any one of them.
 *
 * So this file holds the SHAPE of a pack — its fields, its gates, and the
 * shape of its answer — and no method's arithmetic. Each pack brings its own
 * `compute`, and the worksheet renders whatever the registry holds.
 *
 * GENERALISED 2 Sep 2026, when the two carbon packs joined the one water pack
 * (item K6). A result used to be litres by name; it is now a list of figures,
 * each carrying its own unit, with one of them named as the headline. The
 * water pack reports cubic metres a year and the carbon packs report tonnes
 * of CO₂-equivalent a year, and the worksheet draws either without knowing
 * which is which.
 *
 * A pack that rendered fields it could not compute would be worse than
 * nothing: a form that looks like it works and does not, which is the false
 * success state CLAUDE.md forbids. A pack ships its fields and its arithmetic
 * together or it does not ship.
 */

import type { Citation } from './citation';
import { VWBA_D3 } from './vwbaD3';
import { GS_SDWS_LEGACY_V1, GS_SDWS_PAA_V2 } from './gsSdws';

/**
 * How confident a pack's output is allowed to sound.
 *
 * Only screening exists, and it is the only tier this free console is scoped
 * to produce. A measured or verified tier is not a value to add on a guess —
 * it arrives with a method that can honestly carry it.
 */
export type PackTier = 'screening';

/** What a field collects. The worksheet renders one control per kind. */
export type FieldKind = 'yesno' | 'choice' | 'number';

export interface FieldChoice {
  value: string;
  label: string;
}

export interface PackField {
  key: string;
  kind: FieldKind;
  /** The question, in the plain words a person would use. */
  label: string;
  /** ONE line under the field. Longer explanation goes in `why`. */
  help: string;
  /** The longer explanation, behind a "why" toggle. Optional. */
  why?: string;
  /**
   * Whether an answer is needed before the pack will produce a number.
   *
   * A required field may still be LEFT EMPTY — that is a different thing from
   * being optional, and the difference matters more here than anywhere else on
   * this site. The without-project volume is required and empty-allowed: the
   * pack refuses to complete without it and refuses to invent it.
   */
  required: boolean;
  /** For number fields — the unit, shown beside the control. */
  unit?: string;
  /** For choice fields. */
  choices?: FieldChoice[];
  /** Placeholder text. Never a value; a number typed here would be fabricated. */
  placeholder?: string;
  /**
   * Only shown when this returns true for the current answers. A field that
   * belongs to one branch of a method — Method 1's households, Method 2's
   * units — is hidden on the other branch rather than asked for nothing.
   */
  when?: (values: PackValues) => boolean;
  /** A short heading drawn above this field, opening a group. Optional. */
  group?: string;
}

/**
 * A gate. Pass or fail, never a multiplier.
 *
 * A gate that scored 0.7 would let a project that fails it still produce a
 * number, which is exactly the thing a gate exists to prevent.
 */
export interface PackGate {
  /** The field this gate reads. */
  fieldKey: string;
  /** Plain words for why the project stopped here. */
  stopReason: string;
  /** What would move it forward. Never a bare refusal. */
  routeForward: string;
}

/** Every answer the visitor has given, keyed by field. Empty means empty. */
export type PackValues = Record<string, string>;

/**
 * One figure a pack reports.
 *
 * `value` is the number in `unit`. `secondary` is the same figure said
 * another way — litres beside cubic metres — and `note` is one line of
 * context that renders under the row.
 */
export interface Figure {
  key: string;
  label: string;
  value: number;
  unit: string;
  /** How many decimals to show. Litres want none; tonnes want one. */
  decimals: number;
  secondary?: string;
  note?: string;
}

/**
 * What a pack says back.
 *
 * `blocked`    — a gate failed. No number, a reason, and a route forward.
 * `pending`    — not enough answered yet to say anything.
 * `incomplete` — some figures stand, the headline cannot be worked out, and
 *                the pack says which answer is missing. It NEVER fills the
 *                gap with zero.
 * `complete`   — every figure, and the one that is the headline. Still
 *                anticipated, still needing review.
 */
export type PackResult =
  | { kind: 'blocked'; stopReason: string; routeForward: string }
  | { kind: 'pending' }
  | { kind: 'incomplete'; figures: Figure[]; missing: string }
  | { kind: 'complete'; figures: Figure[]; headline: Figure };

/**
 * What every registered pack has, whether or not it can answer yet.
 *
 * The tab strip is drawn from these, so the family of tools is visible from
 * the first day rather than appearing all at once later. A planned pack is
 * named and marked planned; it is never clickable into something that looks
 * like a working tool, which would be the same false success state a
 * live-looking composer would be.
 */
export interface PackListing {
  /** Stable key. Data and UI are keyed on this, never on a pack's position. */
  key: string;
  /** How the pack names itself on the surface. */
  name: string;
  /** `live` answers; `planned` is named and honest about not being built. */
  state: 'live' | 'planned';
}

/** A pack that is named but cannot answer yet. It carries no fields at all. */
export interface PlannedPack extends PackListing {
  state: 'planned';
  /** One plain line about what it will do. Never a claim that it does it. */
  note: string;
}

/**
 * One line of a pack's formula, with the visitor's own figures dropped in.
 *
 * THE PACK WRITES ITS OWN FORMULA; the worksheet only draws it. If the surface
 * knew that D-3 multiplies people by litres by days, it would be a D-3 surface
 * wearing a general name, and the next pack would have to fight it.
 *
 * A blank term is an em dash, never a zero — the same rule the arithmetic
 * follows, said out loud on screen so a visitor can see which figure is
 * missing rather than wondering why no answer appeared.
 */
export interface FormulaStep {
  /** The method's own symbol for this line, e.g. "Q_y" or "EF_b". Optional. */
  symbol?: string;
  /** The equation number in the cited document, e.g. "Eq. 5". Optional. */
  eq?: string;
  /** What this line works out, e.g. "With the project". */
  label: string;
  /** The formula in words, e.g. "people × litres per person per day × days". */
  terms: string;
  /** The same line with live values in it, e.g. "100 × 20 × 365". */
  live: string;
  /** The answer, already grouped for reading, or null when it cannot be had. */
  value: string | null;
  unit?: string;
}

/**
 * The method, said once, in the method's own terms.
 *
 * A short strip, not a second set of questions and not a paste of the
 * guidebook. It names what the pack reports, defines it in one line, and shows
 * the route actually in use — so a reader can see which of a method's several
 * routes produced their figure without opening the source.
 */
export interface PackMethod {
  /** What the pack reports, e.g. "Volume provided". */
  indicator: string;
  /** The unit it is reported in, e.g. "m³ per year". */
  indicatorUnit: string;
  /** The defining line, in the method's own terms. */
  definition: string;
  /** Further lines, given the current answers — the option in use, a cap, a simplification. */
  lines: (values: PackValues) => string[];
  /** Which option this is, e.g. "Table D3.3, Option 3". */
  optionName: string;
}

/** A worked example a pack may offer. Round, obviously made up, and labelled. */
export interface PackExample {
  /** The label on the button and the chip, e.g. "Example · Uganda, made up". */
  label: string;
  /** One line saying what it is and that it is not a real project. */
  note: string;
  values: PackValues;
}

export interface MethodPack extends PackListing {
  state: 'live';
  /** The method strip. */
  method: PackMethod;
  /** What it covers and what it does not, in one plain line. */
  scope: string;
  /** One plain sentence: what this pack measures. */
  measures: string;
  /** The words over the big number, e.g. "Anticipated benefit". */
  headlineLabel: string;
  /**
   * One clause naming what this pack does, for the agent primer's roster.
   *
   * THE PRIMER'S PACK LIST IS RENDERED FROM THIS REGISTRY AND IS NEVER
   * HAND-TYPED. Maintainer's ruling, 1 Sep 2026. A list of packs typed into a
   * document an agent inherits would go stale the day a pack was added or
   * renamed, and a stale roster is exactly what the primer exists to prevent —
   * an agent would either claim a pack that is gone or miss one that is here.
   *
   * It reads after an em dash: "VWBA 2.0 · D-3 Volume Provided — <this>."
   * So it is a clause, lower case, with no full stop.
   */
  primerLine: string;
  tier: PackTier;
  /** The source, in the shape CITATIONS.md fixes. The console renders it. */
  citation: Citation;
  /** Further sources the pack's defaults rest on, rendered under the first. */
  alsoCites?: Citation[];
  /** The questions, in the order they are asked. */
  fields: PackField[];
  /** The gates, checked before any arithmetic runs. */
  gates: PackGate[];
  /** The pack's own arithmetic. Pure: same answers in, same result out. */
  compute: (values: PackValues) => PackResult;
  /** The pack's formula, written out with the visitor's figures in it. */
  formula: (values: PackValues) => FormulaStep[];
  /** The field keys that are gates, in the order they are asked. */
  gateKeys: string[];
  /** The field keys that are variables — the figures the formula reads. */
  variableKeys: string[];
  /**
   * The default that follows from another answer, or null for none.
   *
   * Returned rather than written into the values, so a default is always
   * visibly a default and a visitor's own figure is never overwritten.
   */
  defaultFor: (fieldKey: string, values: PackValues) => string | null;
  /** Help that only applies in some circumstances. Never a silent default. */
  conditionalHelp: (fieldKey: string, values: PackValues) => string | null;
  /** A worked example, if the pack offers one. */
  example?: PackExample;
  /**
   * Small figures for the header's stat row — the production calculator's
   * idiom: value, label, unit. Optional; drawn only when the pack returns any.
   */
  tiles?: (values: PackValues, result: PackResult) => Figure[];
  /** The one-word category on the tab's pill, e.g. "Water" or "Carbon". */
  category: string;
}

/** Any pack the strip knows about, answering or not. */
export type RegisteredPack = MethodPack | PlannedPack;

/**
 * Every pack this console carries.
 *
 * Adding a pack here adds its tab — there is no second place to register one.
 *
 * ~~Carbon screening is named, planned, and not built.~~ Two carbon packs are
 * live from 2 Sep 2026 and the planned placeholder they replace is gone with
 * them. The water pack keeps the first tab.
 */
export const METHOD_PACKS: RegisteredPack[] = [VWBA_D3, GS_SDWS_LEGACY_V1, GS_SDWS_PAA_V2];

/** The packs that can answer, in tab order. */
export function livePacks(): MethodPack[] {
  return METHOD_PACKS.filter((p): p is MethodPack => p.state === 'live');
}

/** The first pack that can answer, or null when none can. */
export function fittedPack(): MethodPack | null {
  return livePacks()[0] ?? null;
}

/** A pack by key, if it is live. */
export function packByKey(key: string): MethodPack | null {
  return livePacks().find((p) => p.key === key) ?? null;
}

/**
 * A comparison the worksheet draws between two packs' headlines.
 *
 * It is registered here, pack-keyed, so the surface knows that two figures
 * may be compared and nothing about why. The card appears only when both
 * packs have a complete answer; it never fills a side in.
 */
export interface PackComparison {
  key: string;
  title: string;
  /** The pack whose figure comes first — "this minus that". */
  minuendKey: string;
  subtrahendKey: string;
  /** One line under the card saying what the difference means. */
  note: string;
}

export const PACK_COMPARISONS: PackComparison[] = [
  {
    key: 'carbon-transition',
    title: 'Transition delta (PAA − Legacy)',
    minuendKey: GS_SDWS_PAA_V2.key,
    subtrahendKey: GS_SDWS_LEGACY_V1.key,
    note:
      'Difference attributable to the methodology transition, computed on identical project data. ' +
      'Here the whole difference is the non-renewable share of biomass; nothing else moves.',
  },
];

/** Litres to cubic metres. The result is shown in both. */
export const cubicMetres = (litres: number): number => litres / 1000;
