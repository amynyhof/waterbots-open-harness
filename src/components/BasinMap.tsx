/**
 * The basin map.
 *
 * Two layers with a zoom swap: Level 4 at world view, Level 6 from zoom 5.
 * The detail layer is fetched lazily on first crossing and is viewport
 * filtered once mounted.
 *
 * Leaflet's attribution control is ON and carries the short credit line, with
 * a "Data & licences" link opening the full statements. The control is never
 * disabled and the credit line is never replaced.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Rectangle, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import { latLngBounds, type LatLngBoundsExpression } from 'leaflet';
import { BASEMAP_WASH } from '../lib/basemapWash';
import 'leaflet/dist/leaflet.css';
import BasinLayer from './BasinLayer';
import StressLegend from './StressLegend';
import LicencePanel from './LicencePanel';
import { cached, loadBasins } from '../lib/loadBasins';
import { SHORT_CREDIT } from '../lib/licences';
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

/**
 * Panning is bounded to the same box the view fits.
 *
 * An earlier version padded this by a few degrees on each side "for slack",
 * but degrees are not symmetric in Mercator: 2° at 84°N is far taller in
 * pixels than 4° at 68°S, so the pad clamped the view off-centre and stacked
 * all the vertical slack above the map. Using the view bounds themselves
 * means Leaflet centres on them whenever the column is larger than the world,
 * which is exactly the atlas view.
 */
const PAN_BOUNDS: LatLngBoundsExpression = VIEW_BOUNDS;

/**
 * The basemap, and the key it now needs.
 *
 * CARTO ended keyless access to their basemaps. Tiles still return HTTP 200
 * without a key — they come back stamped "API KEY REQUIRED" across the image,
 * which is why a status check never caught it and a browser did. It applied to
 * the light_all style this map shipped with from launch, not only to Voyager,
 * so there was no staying put.
 *
 * The key is a BUILD-TIME value. Vite bakes anything named VITE_* into the
 * bundle when it builds; it is not read at runtime. This is the opposite of
 * Phoebe's settings, which Node reads from process.env when a request arrives.
 * Two consequences worth stating because both have cost time here:
 *
 *   - The key must be present in Vercel BEFORE the build runs. A settings
 *     change only reaches a deployment that starts after it.
 *   - A build with no key produces a bundle that works perfectly, looks
 *     healthy, and is watermarked. scripts/check-basemap-key.mjs reads the
 *     BUILT bundle and fails on exactly that, the same way check-attribution
 *     guards the licence strings.
 *
 * The key travels to the browser and is readable in the shipped JavaScript.
 * That is inherent to browser map tiles: it is a rate-limit token, not a
 * secret. It is not committed — it comes from the environment.
 *
 * Voyager rather than light_all is the maintainer's ruling of 27 Aug 2026,
 * walked in the browser: the seas read as water and the arid and no-data
 * basins, which are deliberately near-transparent so the basemap shows
 * through, read as land instead of as grey fog. Every stress band was
 * composited over both basemaps before the change: the largest shift is under
 * a hundredth of relative luminance, and the warm bands do not intensify. A
 * brighter map does not read as more alarmed than the data.
 */
const CARTO_KEY = import.meta.env.VITE_CARTO_KEY ?? '';
const BASEMAP_URL =
  `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png` +
  (CARTO_KEY ? `?key=${CARTO_KEY}` : '');

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
    /**
     * The minimum zoom: the point at which the atlas COVERS the column.
     *
     * `inside: true` asks for the zoom at which the view fits *within* the
     * bounds, rather than the bounds within the view. That single flag is the
     * whole behaviour:
     *
     *   contain (inside: false) — the entire world is always visible, but on
     *     a column whose proportions differ from the world's it leaves empty
     *     bands. On a tall narrow column that was a wide white gap above the
     *     map, because the world had been shrunk smaller than the column.
     *   cover (inside: true) — the world always fills the column. On a wide
     *     desktop column the proportions are close enough that the whole world
     *     is effectively in view; as the column narrows the map holds its size
     *     and the reader pans, which is how maps normally behave.
     *
     * Covering never becomes MORE than one world: panning is clamped to
     * VIEW_BOUNDS at full viscosity and the tiles do not wrap.
     *
     * NO FLOOR — the zoom follows the column rather than a fixed minimum. An
     * earlier floor of 2 cropped the left edge of North America. zoomSnap is
     * 0, so this is fractional and fits exactly rather than stepping to the
     * next integer.
     *
     * getBoundsZoom clamps to the CURRENT minZoom, so measuring without
     * clearing it first is a ratchet — minZoom could only ever climb, and a
     * narrowing column kept the stale larger floor and cropped.
     */
    const measureFit = () => {
      map.setMinZoom(0);
      const fit = map.getBoundsZoom(VIEW_BOUNDS, true);
      map.setMinZoom(fit);
      return fit;
    };

    /**
     * Centre in PROJECTED space, not on the latitude midpoint.
     *
     * fitBounds centres on bounds.getCenter(), the arithmetic mean of the
     * latitudes. Mercator is not linear, so for a box running 84°N to 68°S
     * that lands south of the true pixel midpoint and stacks the slack above
     * the map. Projecting both corners and halving centres it properly.
     */
    const showAtlas = (fit: number) => {
      const nw = map.project(VIEW_BOUNDS.getNorthWest(), fit);
      const se = map.project(VIEW_BOUNDS.getSouthEast(), fit);
      map.setView(map.unproject(nw.add(se).divideBy(2), fit), fit, { animate: false });
    };

    const apply = (force = false) => {
      /* Read BEFORE measureFit, which rewrites minZoom. A reader who has
         zoomed in is left where they are; one sitting at the atlas view gets
         re-fitted to the new column. */
      const atAtlasView = map.getZoom() <= map.getMinZoom() + 0.01;
      const fit = measureFit();
      if (force || atAtlasView || map.getZoom() < fit) showAtlas(fit);
    };

    apply(true);

    const onResize = () => apply();
    map.on('resize', onResize);

    /* The centre column changes width when the rail collapses, which does not
       always reach Leaflet as a window resize. */
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
      apply();
    });
    observer.observe(map.getContainer());

    return () => {
      map.off('resize', onResize);
      observer.disconnect();
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
  const [licencesOpen, setLicencesOpen] = useState(false);

  /* The "Data & licences" link lives inside Leaflet's own attribution control,
     so the control stays enabled and the short credit line is never replaced.
     Leaflet renders that HTML itself, so the click is caught by delegation. */
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.wb-licences-link')) return;
      e.preventDefault();
      e.stopPropagation();
      setLicencesOpen(true);
    };
    node.addEventListener('click', onClick);
    return () => node.removeEventListener('click', onClick);
  }, []);

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
    <div ref={container} style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[20, 10]}
        zoom={3}
        maxZoom={8}
        preferCanvas
        /* Fractional zoom, so the fit-to-column zoom can be exact and the
           atlas view never crops or leaves an integer step of dead space.
           The layer swap already tolerates it — that is what the 5 / 4.5 dead
           band was built for. Buttons still move a whole level at a time. */
        zoomSnap={0}
        zoomDelta={1}
        /* One world only: no horizontal repeat, no panning off the atlas. */
        maxBounds={PAN_BOUNDS}
        maxBoundsViscosity={1}
        worldCopyJump={false}
        style={{ height: '100%', width: '100%', background: 'var(--paper)' }}
      >
        <WorldConstraints />
        <ZoomWatcher onZoom={onZoom} />

        <TileLayer
          url={BASEMAP_URL}
          subdomains="abcd"
          maxZoom={8}
          noWrap
          bounds={VIEW_BOUNDS}
          attribution={SHORT_CREDIT}
        />

        {/* The basemap wash — see src/lib/basemapWash.ts for why it exists and
            why it is this colour. It sits BETWEEN the tiles and the basins so
            the publisher's imagery is never recoloured and the attribution
            control, which is far above every pane, is untouched. */}
        <WashPane
          colour={BASEMAP_WASH.colour}
          opacity={BASEMAP_WASH.opacity}
          bounds={PAN_BOUNDS}
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

      {licencesOpen && (
        <LicencePanel stressDoc={stressDoc} onClose={() => setLicencesOpen(false)} />
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
        <p className="t-body" style={{ margin: 0, color: 'var(--ink-2)' }}>
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

/**
 * The basemap wash.
 *
 * A brand tint in its own Leaflet pane between the tiles (pane z-index 200) and
 * the vector overlays (400). The publisher's imagery is not recoloured and no
 * CSS filter is involved. Leaflet's attribution control lives far above every
 * pane, so the licence credit cannot be dimmed by it.
 */
function WashPane({
  colour,
  opacity,
  bounds,
}: {
  colour: string;
  opacity: number;
  bounds: LatLngBoundsExpression;
}) {
  const map = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!map.getPane('wash')) {
      const pane = map.createPane('wash');
      pane.style.zIndex = '300';
      pane.style.pointerEvents = 'none';
    }
    setReady(true);
  }, [map]);

  if (!ready) return null;
  return (
    <Rectangle
      pane="wash"
      bounds={bounds}
      interactive={false}
      pathOptions={{ stroke: false, fill: true, fillColor: colour, fillOpacity: opacity }}
    />
  );
}
