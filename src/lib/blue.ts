/**
 * ONE BLUE BUTTON AT A TIME — the maintainer's word of 16 Nov 2026, approved
 * from the queued-round proposal on #175. It settles S29 (three blue
 * buttons at once, her walk of #170) and the last clause of S30.
 *
 * At most one solid blue button is on the screen. The one next step wins, in
 * her order:
 *   1. "Meet <name>", while it is under the latest turn on the step in view;
 *   2. otherwise "Save and sign up" (shortened 16 Nov 2026), once something is on the record;
 *   3. otherwise "Sign up" in the site menu.
 * From 21 Nov 2026 the last two are one button in the site menu, which says
 * "Sign up" until something is on the record and "Save and sign up" after.
 * On the interest form's own page its Send button is the next step, so it is
 * the blue one there and Sign up is quiet.
 *
 * Every other button keeps its place and its words and is drawn quiet,
 * outlined and unfilled. The rule lives here and nowhere else: the shell asks
 * it, and the menu and the rail draw what it says. scripts/check-blue.mjs
 * holds every case to exactly one blue button.
 */

import type { Turn } from '../chat/evidence';
import type { Surface } from './surfaces';

export type Blue = 'meet' | 'save' | 'signup' | 'send';

export interface BlueState {
  /** A "Meet <name>" button is under the latest turn on the step in view. */
  meet: boolean;
  /** The save button shows: something is on the record, on the console. */
  save: boolean;
  /** The page in view has a form of its own — the interest form, or the supporters page from 18 Nov 2026 — whose Send is its next step. */
  form?: boolean;
}

/** Which button is blue. Exactly one, always. */
export function blueButton(state: BlueState): Blue {
  if (state.form) return 'send';
  if (state.meet) return 'meet';
  if (state.save) return 'save';
  return 'signup';
}

/**
 * Whether a thread's latest turn carries a primary button — "Meet <name>" —
 * that is still the next step. Only the latest turn draws its buttons
 * (src/chat/Transcript.tsx). From 21 Nov 2026 a Meet button whose agent the
 * visitor has already reached is drawn quiet, so it does not count.
 */
export function meetShowing(turns: readonly Turn[], reached: ReadonlySet<Surface> = new Set()): boolean {
  const last = turns[turns.length - 1];
  return (
    last !== undefined &&
    last.role === 'agent' &&
    (last.buttons ?? []).some((button) => button.primary && !(button.reaches && reached.has(button.reaches)))
  );
}
