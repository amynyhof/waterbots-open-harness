/**
 * Where an agent is working — J2 and agent rule 21, 23 Nov 2026 (item A27).
 *
 * The host names the door and the relay checks it against this closed list: the two of core's places
 * (@waterbots/core/places) this site serves a chat at. Wellington and Bridget chat at the Free site only;
 * Phoebe at both. A request that names none is a page loaded before this, and it was always the Free site's
 * instructions, so nothing is guessed about it. Phoebe's package writes the block that says which door she is at.
 *
 * In its own module with no dependency, so the check script can load it compiled as the platform compiles it.
 */

export const DOORS = ['free-site', 'agent-commons'] as const;
export type Door = (typeof DOORS)[number];

export function readDoor(value: unknown): Door | null {
  return DOORS.find((d) => d === value) ?? null;
}
