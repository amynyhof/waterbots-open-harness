/**
 * Chips that answer the question just asked — the maintainer's ruling of 24 Nov 2026, the shared console behaviours,
 * line 2: "The chips under an agent's reply answer the question that reply just asked. They come first."
 *
 * The agent names them in a field, and this checks it. A chip is sent as the visitor's own words, so it must never put
 * a fact in their mouth (RULINGS.md, section 2): no chip under a reply that asks nothing, none with a number the reply
 * did not say, and none that is itself a question. The field's description keeps names and places out.
 *
 * In its own module with no dependency, so the check scripts can load it compiled as the platform compiles it.
 */

/** A chip is a few words on one line. Longer is dropped, never cut. */
export const MAX_CHIP_CHARS = 40;
/** Few enough to read at a glance. */
export const MAX_CHIPS = 3;

/** The field every live agent's answer carries. */
export const ANSWERS_SCHEMA = {
  type: 'array' as const,
  description:
    'Up to three short answers the visitor could tap to answer the question this reply ends with, in their own plain words, such as "Yes", "Not yet" or "I\'m not sure". They fit that question and no other. Never a made-up fact: no name, place or number. [] when the reply asks nothing, or when the answer is a name, a place, a number or a description.',
  items: { type: 'string' as const },
};

const numbersIn = (text: string): string[] => text.match(/\d[\d,.]*/g)?.map((n) => n.replace(/[.,]+$/, '')) ?? [];

/** The chips an answer may carry, from its field and its own reply. */
export function readChips(value: unknown, reply: string): string[] {
  if (!Array.isArray(value) || !/\?["”’)]*\s*$/.test(reply)) return [];
  const said = numbersIn(reply);
  const out: string[] = [];
  for (const raw of value) {
    if (typeof raw !== 'string') continue;
    const chip = raw.trim().replace(/[.!]+$/, '');
    if (chip === '' || chip.length > MAX_CHIP_CHARS || /[\n\r?]/.test(chip)) continue;
    if (numbersIn(chip).some((n) => !said.includes(n))) continue;
    if (out.some((kept) => kept.toLowerCase() === chip.toLowerCase())) continue;
    out.push(chip);
    if (out.length === MAX_CHIPS) break;
  }
  return out;
}
