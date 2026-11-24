/**
 * The chips under an agent's reply, built in one place for every agent — the maintainer's ruling of 24 Nov 2026, the
 * shared console behaviours, lines 2 and 3.
 *
 * THE ORDER IS THE RULING'S. First the chips that answer the question just asked. Then the one that opens a tab the
 * agent asked for ("Go to map"). Last, at most one helper ("Learn more about …").
 *
 * All from fields the relay has checked (api/_chips.ts), never from prose. An answer chip sends a real message the
 * visitor can see in their own bubble. Quiet chips, never blue: the one blue button is "Meet <name>" (src/lib/blue.ts).
 */

import type { TurnButton } from '../chat/evidence';

/** The relay's own ceilings (api/_chips.ts), checked again here. */
const MAX_CHIPS = 3;
const MAX_CHIP_CHARS = 40;

/** The answers as the relay sends them, or none. */
export function answersFrom(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((chip): chip is string => typeof chip === 'string' && chip.trim() !== '' && chip.length <= MAX_CHIP_CHARS)
    .slice(0, MAX_CHIPS);
}

export function chipsFor(input: {
  answers: readonly string[];
  /** Sends a chip's words as the visitor's own message. */
  send: (text: string) => void;
  /** The tab the agent asked the visitor to open: its label on screen, and what opens it. */
  tab?: { label: string; open: () => void } | null;
  /** One helper from the answer itself; it comes last. */
  helper?: TurnButton;
}): TurnButton[] | undefined {
  const chips: TurnButton[] = [];
  for (const answer of input.answers) chips.push({ label: answer, go: () => input.send(answer) });
  if (input.tab) chips.push({ label: `Go to ${input.tab.label.toLowerCase()}`, go: input.tab.open });
  if (input.helper) chips.push(input.helper);
  /* Two chips with one label would be one chip. */
  const unique = chips.filter((chip, i) => chips.findIndex((c) => c.label === chip.label) === i);
  return unique.length ? unique : undefined;
}
