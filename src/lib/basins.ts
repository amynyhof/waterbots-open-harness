/**
 * Basin layer definitions and the zoom-swap rules.
 *
 * Two layers, because no single Pfafstetter level works at every zoom:
 *
 *   Level 4 — the world view. At world zoom a Level 4 basin is ~12px across
 *             and reads as a watershed. Level 6 at the same zoom is ~4px and
 *             reads as texture.
 *   Level 6 — the detail view. Reaches ~15px at zoom 5, and is the ONLY level
 *             that joins WRI Aqueduct 4.0 water stress directly, with no
 *             aggregation and no loss of signal.
 */

import type { FeatureCollection, Geometry } from 'geojson';

export interface BasinProps {
  HYBAS_ID: number;
  PFAF_ID: number;
  SUB_AREA: number;
  UP_AREA: number;
}

export type BasinCollection = FeatureCollection<Geometry, BasinProps>;

export interface BasinLayerSpec {
  id: 'world' | 'detail';
  level: 4 | 6;
  url: string;
  basins: number;
}

export const WORLD_LAYER: BasinLayerSpec = {
  id: 'world',
  level: 4,
  url: '/hydrobasins_lev04.json',
  basins: 1342,
};

export const DETAIL_LAYER: BasinLayerSpec = {
  id: 'detail',
  level: 6,
  url: '/hydrobasins_lev06.json',
  basins: 16397,
};

/**
 * Swap thresholds, with a dead band.
 *
 * A single threshold makes the layer flap when the viewer rests on the
 * boundary, which would thrash an 8.44 MB layer. Detail is entered at zoom 5
 * and released below 4.5; between those the current layer is kept.
 */
export const ZOOM_TO_DETAIL = 5;
export const ZOOM_TO_WORLD = 4.5;

/**
 * Viewport filtering for the detail layer.
 *
 * Leaflet builds a layer object for EVERY feature regardless of zoom, so being
 * zoomed in does not by itself avoid the cost of 16,397 basins — measured at
 * 8 FPS on SVG, and still not smooth on Canvas. Only the basins intersecting
 * the current view are mounted.
 *
 * The view is padded so small pans do not force a recompute, and the subset is
 * only rebuilt once the visible area leaves the padded box.
 */
export const VIEWPORT_PAD = 0.35;

/** A basin's bounding box: [west, south, east, north]. */
export type Bbox = [number, number, number, number];

export function featureBbox(coords: unknown): Bbox {
  let w = Infinity;
  let s = Infinity;
  let e = -Infinity;
  let n = -Infinity;

  const walk = (a: unknown): void => {
    const arr = a as number[];
    if (typeof arr[0] === 'number') {
      const [lon, lat] = arr;
      if (lon < w) w = lon;
      if (lon > e) e = lon;
      if (lat < s) s = lat;
      if (lat > n) n = lat;
      return;
    }
    (a as unknown[]).forEach(walk);
  };

  walk(coords);
  return [w, s, e, n];
}

export function bboxIntersects(a: Bbox, b: Bbox): boolean {
  return !(a[2] < b[0] || a[0] > b[2] || a[3] < b[1] || a[1] > b[3]);
}
