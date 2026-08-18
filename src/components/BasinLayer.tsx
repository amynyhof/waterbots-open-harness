/**
 * One rendered basin layer.
 *
 * The detail layer is viewport-filtered: only basins intersecting the padded
 * current view are handed to Leaflet. Without this, all 16,397 Level 6 basins
 * are mounted regardless of zoom, which measured 8 FPS on SVG and was still
 * not smooth on Canvas.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import type { Layer, PathOptions } from 'leaflet';
import type { Feature, Geometry } from 'geojson';
import {
  bboxIntersects,
  featureBbox,
  VIEWPORT_PAD,
  type BasinCollection,
  type BasinProps,
  type Bbox,
} from '../lib/basins';
import { styleFor, type StressLookup } from '../lib/stress';

/**
 * One stroke for every basin regardless of value, so the boundary reads as
 * geography and the fill alone carries the data.
 */
const STROKE: Pick<PathOptions, 'color' | 'weight' | 'opacity'> = {
  color: '#5B6478', // --fg-3
  weight: 0.5,
  opacity: 0.45,
};

const km2 = (n: number) => `${Math.round(n).toLocaleString()} km²`;

function styleForFeature(stress: StressLookup, f?: Feature<Geometry, BasinProps>): PathOptions {
  const key = f ? stress[String(f.properties.PFAF_ID)] : undefined;
  const s = styleFor(key);
  return { ...STROKE, fillColor: s.fill, fillOpacity: s.fillOpacity };
}

function padded(b: Bbox, ratio: number): Bbox {
  const dx = (b[2] - b[0]) * ratio;
  const dy = (b[3] - b[1]) * ratio;
  return [b[0] - dx, b[1] - dy, b[2] + dx, b[3] + dy];
}

export default function BasinLayer({
  data,
  stress,
  filterToViewport,
  onVisibleCount,
}: {
  data: BasinCollection;
  stress: StressLookup;
  filterToViewport: boolean;
  onVisibleCount?: (n: number) => void;
}) {
  const map = useMap();

  /* Bounding boxes are computed once per dataset, not per pan. */
  const boxes = useMemo(
    () => data.features.map((f) => (f.geometry ? featureBbox((f.geometry as any).coordinates) : null)),
    [data]
  );

  const [subset, setSubset] = useState<BasinCollection>(() =>
    filterToViewport ? { ...data, features: [] } : data
  );
  /* The padded box the current subset is good for. */
  const [validFor, setValidFor] = useState<Bbox | null>(null);

  const recompute = useCallback(() => {
    if (!filterToViewport) return;

    const b = map.getBounds();
    const view: Bbox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];

    /* Still inside the box the last subset was built for — nothing to do. */
    if (
      validFor &&
      view[0] >= validFor[0] &&
      view[1] >= validFor[1] &&
      view[2] <= validFor[2] &&
      view[3] <= validFor[3]
    ) {
      return;
    }

    const pad = padded(view, VIEWPORT_PAD);
    const features = data.features.filter((_, i) => boxes[i] && bboxIntersects(boxes[i]!, pad));

    setValidFor(pad);
    setSubset({ ...data, features });
    onVisibleCount?.(features.length);
  }, [map, data, boxes, filterToViewport, validFor, onVisibleCount]);

  useEffect(() => {
    if (!filterToViewport) {
      setSubset(data);
      setValidFor(null);
      onVisibleCount?.(data.features.length);
      return;
    }
    recompute();
    map.on('moveend zoomend', recompute);
    return () => {
      map.off('moveend zoomend', recompute);
    };
  }, [map, recompute, filterToViewport, data, onVisibleCount]);

  const onEachBasin = useCallback(
    (feature: Feature<Geometry, BasinProps>, layer: Layer) => {
      const p = feature.properties;
      const key = stress[String(p.PFAF_ID)];
      const s = styleFor(key);

      layer.bindTooltip(
        `<span class="wb-tt-value">${s.label}</span>` +
          `<span class="wb-tt-row">HYBAS_ID ${p.HYBAS_ID}</span>` +
          `<span class="wb-tt-row">Sub-basin ${km2(p.SUB_AREA)}</span>` +
          `<span class="wb-tt-row">Upstream ${km2(p.UP_AREA)}</span>`,
        { sticky: true, className: 'wb-basin-tooltip' }
      );

      layer.on({
        mouseover: (e) => e.target.setStyle({ weight: 1.6, opacity: 0.95 }),
        mouseout: (e) => e.target.setStyle(STROKE),
      });
    },
    [stress]
  );

  /* Re-keying on the subset size forces Leaflet to rebuild the layer when the
     visible set changes. GeoJSON does not diff its `data` prop. */
  return (
    <GeoJSON
      key={`${subset.features.length}-${validFor?.join(',') ?? 'all'}`}
      data={subset}
      style={(f) => styleForFeature(stress, f as Feature<Geometry, BasinProps>)}
      onEachFeature={onEachBasin}
    />
  );
}
