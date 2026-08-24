/**
 * The surfaces this console actually has.
 *
 * The rail lists exactly what is built and nothing else. A nav item for
 * something unbuilt would be a fabricated claim about the product — the same
 * rule that keeps fabricated data off the map.
 *
 * Adding a surface here adds it to the rail, so this list and the shell's
 * routing cannot fall out of step.
 */

export type Surface = 'map' | 'eligibility';

export const SURFACES: { key: Surface; label: string }[] = [
  { key: 'map', label: 'Basin map' },
  { key: 'eligibility', label: 'Eligibility' },
];

/** The surface the console opens on. */
export const DEFAULT_SURFACE: Surface = 'map';
