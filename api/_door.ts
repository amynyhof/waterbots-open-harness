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

import type { DoorFacts } from '@waterbots/core/places';

export const DOORS = ['free-site', 'agent-commons'] as const;

/**
 * THIS SITE'S DOOR FACTS (core 0.5.0, 26 Nov 2026), passed to every agent's turn here. The project is not saved; nothing
 * is kept after the visit unless the visitor chooses Save and sign up; and there is no Project Record page. Core's list
 * for when a change is kept has three words: "on save" is the nearest true one. The Agent Commons passes none: core
 * knows that door's facts itself.
 */
export const FREE_SITE_DOOR: DoorFacts = { savedProject: false, changesKept: 'on save', recordPage: false };
export type Door = (typeof DOORS)[number];

export function readDoor(value: unknown): Door | null {
  return DOORS.find((d) => d === value) ?? null;
}
