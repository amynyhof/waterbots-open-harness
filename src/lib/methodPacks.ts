/**
 * Method packs — the tools that live inside the Quantification step.
 *
 * THE STEP IS QUANTIFICATION. A PACK IS ONE TOOL INSIDE IT. That separation is
 * the whole point of this file: the same seat has to hold carbon screening,
 * the other VWBA D-methods, and methods from standards this console does not
 * carry yet. Nothing about the surface may be typed to any one of them.
 *
 * So the worksheet reads this registry and renders whatever is in it. It does
 * not know what D-3 is, and it must never learn.
 *
 * THE REGISTRY IS EMPTY TODAY, AND THE SURFACE SAYS SO. The first pack —
 * VWBA 2.0 D-3, Volume Provided, for household and community water supply —
 * is the next piece of work. An empty registry renders an honest empty slot,
 * which is the same rule that keeps unverified points off the map: an empty,
 * honest state beats a fabricated one.
 *
 * A pack that rendered fields it could not yet compute would be worse than
 * nothing. It would be a form that looks like it works and does not, which is
 * the false success state CLAUDE.md forbids.
 */

import type { Citation } from './phoebeCards';

/**
 * How confident a pack's output is allowed to sound.
 *
 * Only screening exists today, and it is the only tier this free console is
 * scoped to produce. A measured or verified tier is not a value to add here
 * on a guess — it arrives with a method that can honestly carry it.
 */
export type PackTier = 'screening';

export interface MethodPack {
  /** Stable key. Data and UI are keyed on this, never on a pack's position. */
  key: string;
  /** How the pack names itself on the surface, e.g. the method and its number. */
  name: string;
  /** What it covers and what it does not, in one plain line. */
  scope: string;
  tier: PackTier;
  /** The source, in the shape CITATIONS.md fixes. The console renders it. */
  citation: Citation;
}

/**
 * Every pack this console carries.
 *
 * Empty until the first one is built. Adding a pack here is what fits it to
 * the slot — there is no second place to register one.
 */
export const METHOD_PACKS: MethodPack[] = [];

/** The pack currently fitted to the step, or null when the slot is empty. */
export function fittedPack(): MethodPack | null {
  return METHOD_PACKS[0] ?? null;
}
