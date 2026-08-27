/// <reference types="vite/client" />

/**
 * The settings the browser bundle is allowed to see.
 *
 * Vite exposes only names beginning VITE_ to the browser, and bakes them in at
 * BUILD time. Declaring them here means a typo in the name is a type error
 * rather than a silent `undefined` that ships a watermarked map.
 */
interface ImportMetaEnv {
  /** CARTO basemaps key. Absent locally is allowed; absent in a build is not —
   *  see scripts/check-basemap-key.mjs. Never committed. */
  readonly VITE_CARTO_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
