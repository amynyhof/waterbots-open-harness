/**
 * Reading the water-stress lookup.
 *
 * The file carries two levels, and they are NOT equivalent:
 *
 *   Level 6 — direct. WRI's published figure for that exact basin.
 *   Level 4 — derived. An area-weighted majority of the Level 6 children,
 *             because Level 4 has no published Aqueduct value.
 *
 * The distinction is surfaced in the legend rather than smoothed over: a
 * reader is entitled to know when they are looking at a published number and
 * when they are looking at ours.
 */

export type StressLookup = Record<string, string>;

export interface StressLevel {
  keyedBy: string;
  derivation: string;
  note: string;
  stress: StressLookup;
}

export interface StressDocument {
  source: {
    dataset: string;
    licence: string;
    citation: string;
  };
  categories: Record<string, string>;
  levels: Record<string, StressLevel>;
}

export const STRESS_URL = '/water_stress.json';

export { styleFor, STRESS_PALETTE, STRESS_ORDER, type StressKey, type StressStyle } from './stressPalette';
