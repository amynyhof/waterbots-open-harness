/**
 * THE JOURNEY, TOLD BY STEP — the maintainer's ruling of 24 Nov 2026, the shared console behaviours, items 6 to 8 and 10.
 *
 * Step 1 is Eligibility, with Phoebe. Step 2 is Partners, with Bridget. Step 3 is Quantify, with the calculator agent or
 * agents the map calls. What comes next, and each step's number and name, come from the agent map (`nextStep`,
 * src/lib/projectRecord.ts; core's STEPS from 0.3.0); the journey's own words (src/lib/journey.ts) are the same three.
 * Nothing here types a step's name a second time.
 *
 * EVERY HAND-OFF BUTTON HAS ONE FORMAT: it names the step, and it wears the next agent's colour. It looks the same
 * whether or not the visitor has been there, because a hand-off is a hand-off.
 *
 * A VISITOR NEVER REACHES A DEAD END. `onward` gives the buttons to the next step; when every step the map calls is done,
 * or no funding path goes forward, they are the report and "Save and sign up".
 */

import type { TurnButton } from '../chat/evidence';
import { CREW } from './crew';
import { JOURNEY, phaseSurface } from './journey';
import type { NextStep, StepWords } from './projectRecord';
import type { Surface } from './surfaces';

/** The steps this site has, in the journey's order and words: where a desk is opened and the map has not named its step. */
const STEPS = JOURNEY.filter((phase) => phase.surface !== null);

/** The step a desk belongs to: its number, how many there are, and its name. */
export function stepOf(surface: Surface): StepWords | null {
  const at = STEPS.findIndex((phase) => phase.surface === phaseSurface(surface));
  return at < 0 ? null : { number: at + 1, of: STEPS.length, label: STEPS[at].label };
}

/** The hand-off to one desk, or undefined for Wellington's own. The step is this project's, as the map numbers it. */
export function handoffButton(surface: Surface, go: () => void, steps?: Partial<Record<Surface, StepWords>>): TurnButton | undefined {
  const step = steps?.[surface] ?? stepOf(surface);
  const agent = CREW.find((member) => member.surface === surface);
  if (!step || !agent) return undefined;
  return {
    label: `Step ${step.number} of ${step.of}: ${step.label}. Meet ${agent.name}`,
    handoff: { token: agent.token, portrait: agent.portrait, name: agent.name },
    reaches: surface,
    go,
  };
}

/** What the console does for a visitor at the end of the steps. */
export interface Ending {
  open: (surface: Surface) => void;
  report: () => void;
  save: () => void;
}

/** The buttons to what comes next, leaving out the desk the visitor is on. Empty while Wellington is still gathering the basics. */
export function onward(next: NextStep, ending: Ending, here?: Surface): TurnButton[] {
  const end: TurnButton[] = [
    { label: 'Export screening report', go: ending.report },
    { label: 'Save and sign up', go: ending.save },
  ];
  if (next.kind === 'gather') return [];
  if (next.kind === 'call') {
    const ahead = next.surfaces
      .filter((surface) => surface !== here)
      .map((surface) => handoffButton(surface, () => ending.open(surface), next.steps))
      .filter((button): button is TurnButton => button !== undefined);
    /* The last calculator's own desk: nobody else is ahead, and a figure they cannot finish must not hold the visitor. */
    return ahead.length === 0 && (here === 'quantification' || here === 'water') ? end : ahead;
  }
  return end;
}
