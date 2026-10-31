/**
 * What Bridget is told about this visit — the place, the device, the pin.
 *
 * Item A22, 31 Oct 2026. Everything she says about a basin comes from here and
 * nothing else, so everything here is checked before it reaches her: a pin
 * whose level, size or label is not one the map could have produced is dropped
 * whole, and she is told no basin is pinned rather than handed a reading the
 * map never showed.
 *
 * THE LABELS ARE A CLOSED LIST: WRI Aqueduct 4.0's published categories as
 * public/water_stress.json carries them, and the map's own fallback for a basin
 * with no row ("Not in the dataset", src/lib/stressPalette.ts). Copied here
 * because a served function cannot read the public folder at answer time;
 * scripts/check-wellington.mjs holds this list to both homes.
 *
 * In its own module, with no dependency on the SDK, so the check script can
 * load it compiled as the platform compiles it — the pattern of _handBack.ts.
 */

export const STRESS_LABELS: readonly string[] = [
  'Low (<10%)',
  'Low - Medium (10-20%)',
  'Medium - High (20-40%)',
  'High (40-80%)',
  'Extremely High (>80%)',
  'Arid and Low Water Use',
  'No Data',
  'Not in the dataset',
];

/** A place longer than this is not a place. The same 80 as the carried contract. */
const MAX_PLACE_CHARS = 80;

export interface PinnedBasin {
  hybasId: number;
  level: 4 | 6;
  subAreaKm2: number;
  stressLabel: string;
}

/** The pin as the console sent it, or null when there is none or it does not hold. */
export function readPin(value: unknown): PinnedBasin | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  const { hybasId, level, subAreaKm2, stressLabel } = v;
  if (typeof hybasId !== 'number' || !Number.isInteger(hybasId) || hybasId <= 0) return null;
  if (level !== 4 && level !== 6) return null;
  if (typeof subAreaKm2 !== 'number' || !Number.isFinite(subAreaKm2) || subAreaKm2 <= 0) return null;
  if (typeof stressLabel !== 'string' || !STRESS_LABELS.includes(stressLabel)) return null;
  return { hybasId, level, subAreaKm2, stressLabel };
}

/** The visitor's own words for where the project is, or blank. */
export function readPlace(value: unknown): string {
  if (typeof value !== 'string') return '';
  const place = value.replace(/\s+/g, ' ').trim();
  return place.length > 0 && place.length <= MAX_PLACE_CHARS ? place : '';
}

/**
 * One block, after the cache breakpoint: where, which device, what is pinned,
 * and who is next once it is. `quantifyNext` is true when the right rail offers
 * Quantify — the visit's stage is Quantify, which a pin at Partners reaches only
 * where a pathway read allows it (pinnedVisit, src/lib/visit.ts). The
 * maintainer's ruling of 31 Oct 2026 on #167: Calvin is next then, by the
 * rail's button; otherwise Wellington, by her hand-back.
 */
export function visitBlock(place: string, phone: boolean, pin: PinnedBasin | null, quantifyNext: boolean): string {
  const lines = ['# This visit', ''];
  lines.push(
    place
      ? `Where the visitor told Wellington the project is, in their own words: "${place}".`
      : 'Wellington has not heard where the project is.'
  );
  lines.push(phone ? 'The visitor is on a phone, so they tap.' : 'The visitor is on a computer, so they click.');
  if (!pin) {
    lines.push('No basin is pinned yet.');
    return lines.join('\n');
  }
  const km2 = Math.round(pin.subAreaKm2).toLocaleString('en-GB');
  lines.push(
    `A basin is pinned. Its area is ${km2} km². Its water stress reading is "${pin.stressLabel}".`,
    pin.level === 6
      ? 'The reading is published: WRI Aqueduct 4.0’s own figure for this basin.'
      : 'The reading is derived: this site worked it out as the area-weighted majority of the smaller basins inside it, because WRI publishes no figure at this size. Zooming in to pin one of the smaller basins shows the published figure.',
    quantifyNext
      ? `Calvin is next, on the Quantify step. The "Open Quantify" button ${phone ? 'is under "Crew" at the top of the screen' : 'is under "Next steps" on the right'}.`
      : 'Nothing on this visit goes on to Quantify yet, so Wellington, on Dispatches, has the next step.'
  );
  return lines.join('\n');
}

/**
 * The hand-back as the console will act on it. When Calvin is next after a pin,
 * the rail's button is the way on and no link is drawn, whatever the model set;
 * an abstention still goes back to Wellington. No button of her own, except the
 * 'Back to Wellington' link when no pathway goes on to Quantify, the same
 * hand-back Phoebe uses. Ruled 31 Oct 2026.
 */
export function settleHandBack(
  handBack: 'none' | 'wellington',
  turn: { pinned: boolean; quantifyNext: boolean; abstained: boolean }
): 'none' | 'wellington' {
  if (turn.pinned && turn.quantifyNext && !turn.abstained) return 'none';
  return handBack;
}
