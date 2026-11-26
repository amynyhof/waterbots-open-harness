/**
 * GPS numbers a visitor types to Bridget, and the basin they fall in — the maintainer's ruling of 24 Nov 2026: she asks
 * for a more exact place three ways, and GPS numbers are one of them.
 *
 * THE NUMBERS ARE READ BY CODE, NEVER BY A MODEL (RULINGS.md, section 2), from the visitor's own message. A pair that
 * could be anything else is not read: it has to look like a position (a decimal point, a degree sign or a compass
 * letter on both) and lie on the globe.
 *
 * THE READING IS BRIDGET'S PACKAGE'S (`readGps`, `basinContaining`, @waterbots/bridget 0.1.0, 26 Nov 2026). The map's data
 * stays with this site until the rights check, so the basins are handed in from here.
 *
 * NO NEW DATA. The basin is found in the two files the map already draws: the detailed basins (Level 6, WRI's published
 * figures) and the water-stress lookup. A point in no basin, or a layer that could not be loaded, is said as it is.
 */

import { basinContaining, type Point } from '@waterbots/bridget';
import { DETAIL_LAYER, featureBbox, type Bbox } from './basins';
import { loadBasins } from './loadBasins';
import { STRESS_URL, styleFor, type StressDocument } from './stress';
import type { MapPin } from './visit';

export { readGps } from '@waterbots/bridget';
export type { Point };

export type Found = { kind: 'found'; pin: MapPin; box: Bbox } | { kind: 'outside' } | { kind: 'failed' };

/** The basin a point falls in, as a click on the map would pin it. */
export async function basinAt(point: Point): Promise<Found> {
  try {
    const [basins, stress] = await Promise.all([
      loadBasins(DETAIL_LAYER.url),
      fetch(STRESS_URL).then(async (res) => {
        if (!res.ok) throw new Error(`the server responded ${res.status}`);
        return (await res.json()) as StressDocument;
      }),
    ]);
    const hit = basinContaining(point, basins.features);
    if (!hit) return { kind: 'outside' };
    const p = hit.properties;
    return {
      kind: 'found',
      pin: {
        hybasId: p.HYBAS_ID,
        pfafId: p.PFAF_ID,
        level: DETAIL_LAYER.level,
        stressLabel: styleFor(stress.levels?.[String(DETAIL_LAYER.level)]?.stress?.[String(p.PFAF_ID)]).label,
        subAreaKm2: p.SUB_AREA,
      },
      box: featureBbox((hit.geometry as { coordinates: unknown }).coordinates),
    };
  } catch {
    return { kind: 'failed' };
  }
}
