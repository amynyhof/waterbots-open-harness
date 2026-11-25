/**
 * Where an agent is working — J2 and agent rule 21, 23 Nov 2026 (item A27).
 *
 * The host names the door and the relay checks it against this closed list: the two of core's places
 * (@waterbots/core/places) this site serves a chat at. Wellington and Bridget chat at the Free site only;
 * Phoebe at both. A request that names none is a page loaded before this, and it was always the Free site's
 * instructions, so nothing is guessed about it: no block is added.
 *
 * In its own module with no dependency, so the check script can load it compiled as the platform compiles it.
 */

export const DOORS = ['free-site', 'agent-commons'] as const;
export type Door = (typeof DOORS)[number];

export function readDoor(value: unknown): Door | null {
  return DOORS.find((d) => d === value) ?? null;
}

/** The block Phoebe reads. Her instructions name both doors; this says which one she is at. */
export function phoebeDoorBlock(door: Door | null): string | null {
  if (door === 'agent-commons') {
    return '# Where you are\n\nYou are at the Agent Commons door of rule 21. The visitor opened you alone. There is no project record, no Wellington and no other step here: ask for each fact you need yourself, and never send anyone to Wellington or to a step. What the visitor told you in this chat is all there is.';
  }
  if (door === 'free-site') {
    return '# Where you are\n\nYou are at the Free site door of rule 21. Wellington leads, and the project record is what this visit has gathered.';
  }
  return null;
}
