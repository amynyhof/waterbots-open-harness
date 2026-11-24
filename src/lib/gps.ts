/**
 * GPS numbers a visitor types to Bridget, and the basin they fall in — the maintainer's ruling of 24 Nov 2026: she asks
 * for a more exact place three ways, and GPS numbers are one of them.
 *
 * THE NUMBERS ARE READ BY CODE, NEVER BY A MODEL (RULINGS.md, section 2), from the visitor's own message. A pair that
 * could be anything else is not read: it has to look like a position (a decimal point, a degree sign or a compass
 * letter on both) and lie on the globe.
 *
 * NO NEW DATA. The basin is found in the two files the map already draws: the detailed basins (Level 6, WRI's published
 * figures) and the water-stress lookup. A point in no basin, or a layer that could not be loaded, is said as it is.
 */

import type { Geometry } from 'geojson';
import { DETAIL_LAYER, featureBbox, type Bbox } from './basins';
import { loadBasins } from './loadBasins';
import { STRESS_URL, styleFor, type StressDocument } from './stress';
import type { MapPin } from './visit';

export interface Point {
  lat: number;
  lon: number;
}

/** One number of a position: degrees, perhaps minutes and seconds, perhaps a compass letter before or after. */
const PART =
  "([NSEW])?\\s*([+-−]?\\d{1,3}(?:\\.\\d+)?)\\s*(?:(°|deg(?:rees)?)\\s*(?:(\\d{1,2}(?:\\.\\d+)?)\\s*['’′]\\s*(?:(\\d{1,2}(?:\\.\\d+)?)\\s*(?:\"|”|″|''))?)?)?\\s*([NSEW])?(?![\\w°])";
const PAIR = new RegExp(`(?<![\\w.])${PART}[\\s,;/]+(?:(?:and|lon|long|longitude|lng)\\s*[:=]?\\s*)?${PART}`, 'i');

function readPart(m: RegExpMatchArray, at: number): { value: number; axis: 'lat' | 'lon' | null; marked: boolean } | null {
  const [before, whole, degree, minutes, seconds, after] = m.slice(at, at + 6);
  const letter = (before ?? after ?? '').toUpperCase();
  let value = Number(whole.replace('−', '-'));
  if (!Number.isFinite(value)) return null;
  const negative = value < 0 || whole.trim().startsWith('-') || whole.trim().startsWith('−');
  value = Math.abs(value) + Number(minutes ?? 0) / 60 + Number(seconds ?? 0) / 3600;
  if (negative || letter === 'S' || letter === 'W') value = -value;
  const axis = letter === 'N' || letter === 'S' ? 'lat' : letter === 'E' || letter === 'W' ? 'lon' : null;
  return { value, axis, marked: letter !== '' || degree !== undefined || /\.\d/.test(whole) };
}

/** The one position in a message, or null when there is none. Latitude comes first unless the letters say otherwise. */
export function readGps(message: string): Point | null {
  const m = message.match(PAIR);
  if (!m) return null;
  const a = readPart(m, 1);
  const b = readPart(m, 7);
  if (!a || !b || !a.marked || !b.marked) return null;
  if (a.axis !== null && a.axis === b.axis) return null;
  const swapped = a.axis === 'lon' || b.axis === 'lat';
  const point = swapped ? { lat: b.value, lon: a.value } : { lat: a.value, lon: b.value };
  return Math.abs(point.lat) <= 90 && Math.abs(point.lon) <= 180 ? point : null;
}

/** Whether a point is inside one ring, by counting the edges a line to the west of it crosses. */
function inRing([lon, lat]: [number, number], ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Whether a point is inside a shape: in an outer ring and in none of its holes. */
export function inGeometry(point: Point, geometry: Geometry | null): boolean {
  if (!geometry) return false;
  const at: [number, number] = [point.lon, point.lat];
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
  return polygons.some(([outer, ...holes]) => outer !== undefined && inRing(at, outer) && !holes.some((hole) => inRing(at, hole)));
}

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
    const hit = basins.features.find((feature) => inGeometry(point, feature.geometry));
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
