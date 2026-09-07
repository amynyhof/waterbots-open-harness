/**
 * The surfaces this console actually has.
 *
 * Four surfaces from 2 Sep 2026: the desk joined the map, the eligibility
 * worksheet and the quantification step, and the console took the production
 * shape on the maintainer's ruling of that day. Item S11. The left rail
 * carries the visit's project and nothing else.
 *
 * ONE ROW OPENS THEM, from 7 Sep 2026 — the journey bar, which is the
 * navigation (src/components/JourneyBar.tsx). Dispatches sits first, the desk,
 * then the six phases from src/lib/journey.ts, of which Eligibility, Partners
 * and Quantify open this site's tools. The tab row that listed the surfaces
 * beneath the bar is gone, and with it the list that lived here; a surface
 * with nothing on the bar to open it would be unreachable, and the bar reads
 * the journey, so the two cannot fall out of step. Item S15.
 *
 * NO TOOL NAME SITS ON THE ROW. The phase names are canon (item A11), and the
 * desk's own word is the one label that is not a phase.
 */

export type Surface = 'desk' | 'eligibility' | 'map' | 'quantification';

/** The console's surfaces — the same four; the alias names what a route may open. */
export type ConsoleSurface = Surface;

/**
 * The desk's word on the journey bar. "Dispatches", matching production —
 * maintainer's naming ruling, 5 Sep 2026. It is the desk, not a phase.
 */
export const DESK_LABEL = 'Dispatches';

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
