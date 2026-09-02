/**
 * The six-phase journey, as the journey bar draws it.
 *
 * Eligibility → Partners → Quantify → Plan → Monitor → Communicate. The first
 * three are this site's surfaces. The last three belong to the paid platform
 * and open with a saved project; they are named here so a visitor can see the
 * whole road, and they are never clickable, because there is nothing here for
 * them to open. Naming a planned thing is allowed and is not a claim.
 *
 * THIS IS THE ONE HOME FOR THE PHASE LIST. The bar reads it, and nothing else
 * types the six names again. Maintainer's ruling C, 2 Sep 2026.
 *
 * The north star in OPEN_ITEMS.md names four steps, the fourth being project
 * management on the paid platform. These six are that same road at the
 * production console's grain: Plan, Monitor and Communicate are what "running
 * the project after it starts" is made of.
 */

import type { Surface } from './surfaces';

export interface JourneyPhase {
  key: string;
  label: string;
  /** The surface this phase opens on this site, or null when it is gated. */
  surface: Surface | null;
}

export const JOURNEY: JourneyPhase[] = [
  { key: 'eligibility', label: 'Eligibility', surface: 'eligibility' },
  { key: 'partners', label: 'Partners', surface: 'map' },
  { key: 'quantify', label: 'Quantify', surface: 'quantification' },
  { key: 'plan', label: 'Plan', surface: null },
  { key: 'monitor', label: 'Monitor', surface: null },
  { key: 'communicate', label: 'Communicate', surface: null },
];

/** What a gated phase says when asked. One sentence, stated, never simulated. */
export const GATED_NOTE = 'Opens with a saved project.';
