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

export interface MethodPack {
  /** Stable key. Data and UI are keyed on this, never on a pack's position. */
  key: string;
  /** How the pack names itself on the surface. */
  name: string;
  /** What it covers and what it does not, in one plain line. */
  scope: string;
  tier: PackTier;
  /** The source, in the shape CITATIONS.md fixes. The console renders it. */
  citation: Citation;
  /** The questions, in the order they are asked. */
  fields: PackField[];
  /** The gates, checked before any arithmetic runs. */
  gates: PackGate[];
  /** The pack's own arithmetic. Pure: same answers in, same result out. */
  compute: (values: PackValues) => PackResult;
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

/**
 * Every pack this console carries.
 *
 * Adding a pack here is what fits it to the slot — there is no second place to
 * register one.
 */
export const METHOD_PACKS: MethodPack[] = [VWBA_D3];

/** The pack currently fitted to the step, or null when the slot is empty. */
export function fittedPack(): MethodPack | null {
  return METHOD_PACKS[0] ?? null;
}

/** Litres to cubic metres. The result is shown in both. */
export const cubicMetres = (litres: number): number => litres / 1000;
