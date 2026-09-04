/**
 * The surfaces this console actually has.
 *
 * The tab row lists exactly what is built and nothing else. A tab for
 * something unbuilt would be a fabricated claim about the product — the same
 * rule that keeps fabricated data off the map.
 *
 * Adding a surface here adds it to the tab row, so this list and the shell's
 * routing cannot fall out of step.
 *
 * FOUR SURFACES FROM 2 Sep 2026. The desk joined, and the console took the
 * production shape on the maintainer's ruling of the same day: a journey bar
 * across the top of the centre, and the surfaces as tabs beneath it rather
 * than as items in the left rail. The rail now carries the visit's project
 * and nothing else. Item S11.
 *
 * THE TAB NAMES ARE THE JOURNEY'S NAMES, not the surfaces' old ones. The map
 * is the Partners phase of the journey, so its tab says so, with the map named
 * in brackets so nobody looking for it is lost. The two consoles should rhyme.
 */

export type Surface = 'desk' | 'eligibility' | 'map' | 'quantification';

/** The console's surfaces — the same four; the alias names what a route may open. */
export type ConsoleSurface = Surface;

export const SURFACES: { key: ConsoleSurface; label: string }[] = [
  { key: 'desk', label: 'Dispatch' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'map', label: 'Partners (Map)' },
  { key: 'quantification', label: 'Quantify' },
];

/**
 * The surface the console opens on.
 *
 * The desk, from 2 Sep 2026 — Wellington is the host, and the host's desk is
 * where a visit starts. Maintainer's ruling B of that day. It was the map.
 *
 * A landing surface was built in front of it on 3 Sep 2026 and rejected the
 * same day, entirely; nothing of it was kept. The hero chat that replaces
 * that idea waits on a reference the maintainer brings by hand.
 */
export const DEFAULT_SURFACE: Surface = 'desk';
