/**
 * The basin map.
 *
 * Two layers with a zoom swap: Level 4 at world view, Level 6 from zoom 5.
 * The detail layer is fetched lazily on first crossing and is viewport
 * filtered once mounted.
 *
 * Leaflet's attribution control is ON and carries the short credit line. The
 * full HydroSHEDS Exhibit B statement and the Data & licences panel arrive at
 * step 5.
 */

import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { latLngBounds, type LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BasinLayer from './BasinLayer';
import StressLegend from './StressLegend';
import { cached, loadBasins } from '../lib/loadBasins';
import { STRESS_URL, type StressDocument, type StressLookup } from '../lib/stress';
import {
  DETAIL_LAYER,
  WORLD_LAYER,
  ZOOM_TO_DETAIL,
  ZOOM_TO_WORLD,
  type BasinCollection,
  type BasinLayerSpec,
} from '../lib/basins';

/**
 * The real extent of the basin data, measured by scripts/check-basins.mjs:
 * latitude -55.883 to 83.624, longitude -180 to 180. HydroBASINS excludes
 * Antarctica, so there is no basin geometry south of roughly -56.
 */
export const DATA_SOUTH = -55.883;

/**
 * The view is bounded to the DATA rather than the full globe — a full-globe
 * view would leave roughly a quarter of the screen permanently empty.
 *
 * The southern edge is the one deliberate exception. Cropping at the data
 * limit put the frame straight through the Southern Ocean and the map read as
 * cut off. -68 reaches past the tip of the Antarctic Peninsula (~-63) and
 * across the northern coastal fringe of East Antarctica, so the continent
 * registers as context without opening up the interior ice sheet — which
 * carries no basins and, in Mercator, would swallow the screen.
 *
 * The strip below DATA_SOUTH is basemap only, by design.
 */
export const VIEW_BOUNDS = latLngBounds([-68, -180], [84, 180]);

/** A little slack so the edge does not feel clamped against the geometry. */
const PAN_BOUNDS: LatLngBoundsExpression = latLngBounds([-72, -184], [86, 184]);

type Fetched =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; data: BasinCollection }
  | { status: 'error'; message: string };

/**
 * Loads a layer, tolerating StrictMode's double mount.
 *
 * The guard lives in loadBasins() and is keyed on the URL, not on a ref flag
 * in this component — see the note in src/lib/loadBasins.ts for why a ref
 * silently swallowed successful responses.
 */
function useBasinData(spec: BasinLayerSpec, enabled: boolean, attempt: number) {
  const [state, setState] = useState<Fetched>({ status: 'idle' });

  useEffect(() => {
    if (!enabled) return;

    /* An already-loaded layer resolves synchronously, with no loading flash. */
    const hit = cached(spec.url);
    if (hit) {
      setState({ status: 'ready', data: hit });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    loadBasins(spec.url)
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ status: 'error', message: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [spec.url, enabled, attempt]);

  return state;
}

/**
 * One world only.
 *
 * minZoom is COMPUTED, not hardcoded: a fixed value cannot be correct on every
 * screen (at z2 the world is 1,024px wide and leaves gutters on a desktop; at
 * z3 it is 2,048px and overflows a laptop vertically). Deriving it from the
 * viewport means exactly one atlas view fits, whatever the screen.
 */
function WorldConstraints() {
  const map = useMap();

  useEffect(() => {
    const apply = () => {
      const fit = map.getBoundsZoom(VIEW_BOUNDS, false);
      map.setMinZoom(fit);
      if (map.getZoom() < fit) map.setZoom(fit);
    };

    map.fitBounds(VIEW_BOUNDS, { animate: false });
    apply();
    map.on('resize', apply);
    return () => {
      map.off('resize', apply);
    };
  }, [map]);

  return null;
}

/** Reports zoom changes with the dead band applied. */
function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMap();
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  useMapEvent('zoomend', () => onZoom(map.getZoom()));
  return null;
}

export interface MapStatus {
  level: 4 | 6;
  zoom: number;
  rendered: number;
  loadingDetail: boolean;
  detailError: string | null;
  /** Set when the water-stress lookup failed. Basins then render unfilled. */
  stressError: string | null;
}

export default function BasinMap({ onStatus }: { onStatus?: (s: MapStatus) => void }) {
  const [zoom, setZoom] = useState(3);
  const [wantDetail, setWantDetail] = useState(false);
  const [rendered, setRendered] = useState(0);
  /* Bumping this re-runs the load effect. A timeout that cannot be retried is
     a dead end, not an honest state. */
  const [attempt, setAttempt] = useState(0);

  /* Hysteresis: enter detail at zoom 5, release below 4.5. Between those the
     current layer is kept, so resting on the boundary cannot thrash an
     8.44 MB layer. */
  const onZoom = useCallback((z: number) => {
    setZoom(z);
    setWantDetail((current) => {
      if (z >= ZOOM_TO_DETAIL) return true;
      if (z < ZOOM_TO_WORLD) return false;
      return current;
    });
  }, []);

  const world = useBasinData(WORLD_LAYER, true, attempt);
  const detail = useBasinData(DETAIL_LAYER, wantDetail, attempt);

  /* The stress lookup is small (292 KB, 44 KB gzipped) and both layers need
     it, so it loads once alongside the world layer. */
  const [stressDoc, setStressDoc] = useState<StressDocument | null>(null);
  const [stressError, setStressError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(STRESS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`the server responded ${res.status}`);
        return res.json();
      })
      .then((doc: StressDocument) => {
        if (cancelled) return;
        if (!doc?.levels) throw new Error('the file has no levels');
        setStressDoc(doc);
        setStressError(null);
      })
      .catch((err: Error) => {
        if (!cancelled) setStressError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const detailReady = wantDetail && detail.status === 'ready';
  const activeLevel: 4 | 6 = detailReady ? 6 : 4;

  /* An empty lookup renders every basin in the "not in the dataset" style
     rather than guessing a value — an honest blank, not a fabricated one. */
  const EMPTY: StressLookup = {};
  const worldStress = stressDoc?.levels?.['4']?.stress ?? EMPTY;
  const detailStress = stressDoc?.levels?.['6']?.stress ?? EMPTY;

  useEffect(() => {
    onStatus?.({
      level: activeLevel,
      zoom,
      rendered,
      loadingDetail: wantDetail && detail.status === 'loading',
      detailError: detail.status === 'error' ? detail.message : null,
      stressError,
    });
  }, [onStatus, activeLevel, zoom, rendered, wantDetail, detail, stressError]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[20, 10]}
        zoom={3}
        maxZoom={8}
        preferCanvas
        /* One world only: no horizontal repeat, no panning off the atlas. */
        maxBounds={PAN_BOUNDS}
        maxBoundsViscosity={1}
        worldCopyJump={false}
        style={{ height: '100%', width: '100%', background: 'var(--paper)' }}
      >
        <WorldConstraints />
        <ZoomWatcher onZoom={onZoom} />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={8}
          noWrap
          bounds={VIEW_BOUNDS}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &middot; &copy; <a href="https://carto.com/attributions">CARTO</a> &middot; Basins: HydroSHEDS &copy; WWF'
        />

        {/* The world layer stays mounted until the detail layer is genuinely
            ready, so the map is never blank during the swap. */}
        {!detailReady && world.status === 'ready' && (
          <BasinLayer
            data={world.data}
            stress={worldStress}
            filterToViewport={false}
            onVisibleCount={setRendered}
          />
        )}

        {detailReady && (
          <BasinLayer
            data={detail.data}
            stress={detailStress}
            filterToViewport
            onVisibleCount={setRendered}
          />
        )}
      </MapContainer>

      {stressDoc && (
        <StressLegend
          level={activeLevel}
          derivation={stressDoc.levels[String(activeLevel)]?.derivation ?? 'unknown'}
        />
      )}

      {world.status === 'loading' && <Overlay title="Loading" body="The basin layer is loading." />}

      {world.status === 'error' && (
        <Overlay
          title="Basin layer failed"
          body={`The world basin layer could not be loaded — ${world.message}.`}
          detail="The map is showing the basemap only. No basin data is displayed."
          onRetry={() => setAttempt((n) => n + 1)}
        />
      )}
    </div>
  );
}

function Overlay({
  title,
  body,
  detail,
  onRetry,
}: {
  title: string;
  body: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 500,
        display: 'grid',
        placeItems: 'center',
        background: 'color-mix(in srgb, var(--paper) 88%, transparent)',
        pointerEvents: 'none',
      }}
    >
      <div className="card" style={{ maxWidth: 440, pointerEvents: 'auto' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          {title}
        </div>
        <p className="t-body" style={{ margin: 0, color: 'var(--fg-2)' }}>
          {body}
        </p>
        {detail && (
          <p className="t-caption" style={{ marginTop: 10, marginBottom: 0 }}>
            {detail}
          </p>
        )}
        {onRetry && (
          <button className="btn" style={{ marginTop: 14 }} onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
