/**
 * The water-stress palette on Frost.
 *
 * DERIVED FROM BRAND.md ANCHORS, NOT INVENTED. BRAND.md publishes no tint or
 * sequential ramps, so the five steps are produced mechanically from three
 * published hues — the same kind of derivation as BRAND.md's own elevation
 * formula (`color-mix(in srgb, #FFFFFF 8%, var(--paper))`), not new colour.
 *
 *   Surf  #14C8D9 — the low end. Water reads as water, and Surf carries no
 *                   agent identity in this repo.
 *   Amber #E8A12B — the warm-reserved rule fits exactly: amber and coral mean
 *   Coral #E25858   a warning or a SUB-PAR METRIC, which is literally what
 *                   water stress is. This is the rule applying, not bending.
 *
 * Tide is deliberately absent: it is the primary action colour, and a data
 * fill wearing it would collide with every button on the surface.
 *
 * TWO PROPERTIES THE RAMP HOLDS, both machine-checked by
 * scripts/check-palette.mjs:
 *
 * 1. LIGHTNESS DESCENDS MONOTONICALLY, in even steps of roughly 0.17-0.19
 *    relative luminance. The published anchors do not order by lightness on
 *    their own (Surf 2.0:1, Amber 2.2:1 and the no-data grey 2.6:1 all sit in
 *    one narrow band against white), so a ramp built from raw anchors would
 *    scramble in greyscale and for colour-blind readers. Tinting toward white
 *    at the low end and shading toward ink at the high end fixes the order.
 *
 * 2. CHROMA SEPARATES THE SCALE FROM THE NON-SCALE. Every ramp step carries
 *    more chroma than either off-ramp category. That is what marks Arid and
 *    No Data as "not a reading" rather than "a low reading".
 *
 * Arid and Low Water Use is NOT low stress — it means the water-use
 * denominator is too small for a stress ratio to be meaningful. No Data is an
 * absence. Together they are 20.93% of basins, so getting this distinction
 * wrong would mislead across a fifth of the map. Both take a near-neutral
 * fill AND a reduced opacity, so the basemap shows through and they read as
 * unfilled rather than as a value.
 */

export type StressKey =
  | 'low'
  | 'low-medium'
  | 'medium-high'
  | 'high'
  | 'extremely-high'
  | 'arid'
  | 'nodata';

export interface StressStyle {
  /** WRI's exact published label. This is what the legend must say. */
  label: string;
  fill: string;
  fillOpacity: number;
  /** True for the five ordered stress bands; false for the off-scale two. */
  onScale: boolean;
  /** How the colour was derived from a BRAND.md anchor. */
  derivation: string;
}

export const STRESS_PALETTE: Record<StressKey, StressStyle> = {
  low: {
    label: 'Low (<10%)',
    fill: '#CBF3F7',
    fillOpacity: 0.7,
    onScale: true,
    derivation: 'Surf 22% on white',
  },
  'low-medium': {
    label: 'Low - Medium (10-20%)',
    fill: '#85E2EB',
    fillOpacity: 0.7,
    onScale: true,
    derivation: 'Surf 52% on white',
  },
  'medium-high': {
    label: 'Medium - High (20-40%)',
    fill: '#EBAF4B',
    fillOpacity: 0.7,
    onScale: true,
    derivation: 'Amber 85% on white',
  },
  high: {
    label: 'High (40-80%)',
    fill: '#E67171',
    fillOpacity: 0.7,
    onScale: true,
    derivation: 'Coral 85% on white',
  },
  'extremely-high': {
    label: 'Extremely High (>80%)',
    fill: '#A6454B',
    fillOpacity: 0.7,
    onScale: true,
    derivation: 'Coral shaded 28% toward Ink',
  },
  arid: {
    label: 'Arid and Low Water Use',
    fill: '#BDC6D1',
    fillOpacity: 0.45,
    onScale: false,
    derivation: 'Slate 34% on white',
  },
  nodata: {
    label: 'No Data',
    fill: '#E6E8ED',
    fillOpacity: 0.28,
    onScale: false,
    derivation: 'Ink-4 24% on white',
  },
};

/** Legend order: the scale in order, then the two off-scale categories. */
export const STRESS_ORDER: StressKey[] = [
  'low',
  'low-medium',
  'medium-high',
  'high',
  'extremely-high',
  'arid',
  'nodata',
];

/** A basin with no entry at all — distinct from WRI's own "No Data". */
export const UNKNOWN_STYLE: StressStyle = {
  label: 'Not in the dataset',
  fill: '#E6E8ED',
  fillOpacity: 0.15,
  onScale: false,
  derivation: 'Ink-4 24% on white, further reduced',
};

export function styleFor(key: string | undefined): StressStyle {
  if (!key) return UNKNOWN_STYLE;
  return STRESS_PALETTE[key as StressKey] ?? UNKNOWN_STYLE;
}
