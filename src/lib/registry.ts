/**
 * The sealed engine's source registry, read for citations.
 *
 * Calvin's brief, §1.6 (ruling 10): every default his screen shows cites its
 * source through engine/sources/registry.yaml, by the `registrySources` id the
 * engine's data file carries, and no citation string is typed anywhere in src/.
 * The YAML is parsed once, by scripts/build-prompt-modules.mjs, into
 * registry.generated.ts; this module is the one place that turns a row into the
 * four-part Citation shape (CITATIONS.md; lib/citation).
 *
 * Plain TypeScript with no bundler-only imports, so a check script can load it
 * in Node the same way the screen does.
 */

import type { Citation } from './citation';
import { REGISTRY_ROWS, type RegistryRow } from './registry.generated';

export type { RegistryRow };

/** The registry id the methodology rows cite: GS4GG PAA safe drinking water, V2.0. */
export const METHODOLOGY_V2_ID = 'gs-429-v2-methodology';

const BY_ID: ReadonlyMap<string, RegistryRow> = new Map(REGISTRY_ROWS.map((row) => [row.id, row]));

/** The row for an id, or undefined when the sealed engine's registry does not carry it. */
export function findRegistryRow(id: string): RegistryRow | undefined {
  return BY_ID.get(id);
}

/**
 * A row as a Citation.
 *
 * Throws on an id the registry does not carry: a default whose source cannot be
 * found must not render as though it had one (CITATIONS.md — no canonical link,
 * no citation). `section` and `page` are where in the document, as the engine's
 * own label or data file gives them; they are passed through, never composed here.
 *
 * Where a row states no version, the citation says so with its publication date
 * rather than inventing one.
 */
export function registryCitation(id: string, section = '', page = ''): Citation {
  const row = BY_ID.get(id);
  if (!row) {
    throw new Error(`No row "${id}" in engine/sources/registry.yaml; this value cannot be cited.`);
  }
  const version = row.version ?? `no version stated; published ${row.published}`;
  const where = [section, page].filter((part) => part !== '').join(', ');
  return {
    document: row.docRef ?? row.title,
    version,
    section,
    page,
    full: `${row.publisher}. ${row.title}. ${version}.${where ? ` ${where}.` : ''}`,
    href: row.canonicalUrl,
  };
}
