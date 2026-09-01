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
 * A pack that rendered fields it could not compute would be worse than
 * nothing: a form that looks like it works and does not, which is the false
 * success state CLAUDE.md forbids. A pack ships its fields and its arithmetic
 * together or it does not ship.
 */

import type { Citation } from './citation';
import { VWBA_D3 } from './vwbaD3';

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
 * What a pack says back.
 *
 * `blocked`    — a gate failed. No number, a reason, and a route forward.
 * `pending`    — not enough answered yet to say anything.
 * `incomplete` — the with-project figure stands, the benefit cannot be worked
 *                out, and the pack says which answer is missing. It NEVER
 *                fills the gap with zero.
 * `complete`   — both figures. Still anticipated, still needing review.
 */
export type PackResult =
  | { kind: 'blocked'; stopReason: string; routeForward: string }
  | { kind: 'pending' }
  | { kind: 'incomplete'; withProjectLitres: number; missing: string }
  | { kind: 'complete'; withProjectLitres: number; benefitLitres: number };

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

export interface MethodPack extends PackListing {
  state: 'live';
  /** What it covers and what it does not, in one plain line. */
  scope: string;
  /** One plain sentence: what this pack measures. */
  measures: string;
  tier: PackTier;
  /** The source, in the shape CITATIONS.md fixes. The console renders it. */
  citation: Citation;
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
}

/** Any pack the strip knows about, answering or not. */
export type RegisteredPack = MethodPack | PlannedPack;

/**
 * Carbon screening — named, planned, and not built.
 *
 * It is here so the tab strip shows the family from the first day: this seat
 * holds more than one tool, and a strip with a single tab in it hides that.
 * It carries no fields, no arithmetic and no figures, and the strip will not
 * open it — a planned pack that could be clicked into something resembling a
 * working tool would be exactly the false success state this console refuses
 * everywhere else.
 *
 * Naming a planned thing is allowed and is not a claim. Honest states are the
 * rule: "planned" and "not live yet" are said plainly, never simulated.
 */
export const CARBON_SCREENING: PlannedPack = {
  key: 'carbon-screening',
  name: 'Carbon screening',
  state: 'planned',
  note: 'Planned. Not built, and it produces no figures.',
};

/**
 * Every pack this console carries.
 *
 * Adding a pack here adds its tab — there is no second place to register one.
 */
export const METHOD_PACKS: RegisteredPack[] = [CARBON_SCREENING, VWBA_D3];

/** The pack currently fitted to the step, or null when none can answer. */
export function fittedPack(): MethodPack | null {
  return (METHOD_PACKS.find((p) => p.state === 'live') as MethodPack) ?? null;
}

/** Litres to cubic metres. The result is shown in both. */
export const cubicMetres = (litres: number): number => litres / 1000;
