/**
 * Calvin's project, from this visit — the one adapter between the open site's
 * record and the open core's calculator (proposal the open-core proposal on #156,
 * step 2; built 14 Nov 2026 on the maintainer's word).
 *
 * THE CALCULATOR IS THE OPEN CORE'S, @waterbots/calvin, installed from its
 * release file and locked to the ex-ante view. It computes every number; this
 * file computes none. It only hands over the project facts a host hands over
 * (the core's `ModuleProject`): the technology, the country, and how many the
 * project serves, as the visitor said it. A fact the record does not hold is
 * left out, and the calculator says plainly what it still needs. Nothing is
 * guessed.
 *
 *   - Technology: worked out by core from the project facts (the source, the treatment, whether the water
 *     is safe), never from a label. Nobody is asked for a kind or a class (core 0.4.0, 26 Nov 2026).
 *   - Country: the visitor's place, matched word for word against the engine's
 *     own country list. One country named, or none — the rule the map uses
 *     (src/lib/placeBox.ts). A town alone is never looked up.
 *   - People served: as said, people or households, never converted here.
 *   - Already credited under V1.0 (`creditedUnderV1`): SET FROM THE SHARED RECORD from 23 Nov 2026 (J4,
 *     item A29). Phoebe's own question settles it. A transitioning project sees the legacy calculator and
 *     the transition; every other project gets calvin's V2.0-only view, as before.
 */

import { calvinProjectFromRecord } from '@waterbots/calvin/agent';
import type { CalvinProject } from '@waterbots/calvin/screen';
import type { ProjectRecord } from '@waterbots/core/record';
import { COUNTRIES } from '@waterbots/calvin/engine';
import { foldPlace } from './placeBox';

/** The installed package's version, held to the lockfile by scripts/check-calvin-package.mjs. */
export const CALVIN_PACKAGE_VERSION = '0.9.0';

/** Violet's D-3 package, the water calculator from 22 Nov 2026. */
export const VIOLET_PACKAGE_VERSION = '0.9.0';

/** Each package has a release and a tag of its own from 23 Nov 2026 (J1). */
export const CALVIN_RELEASE = 'calvin-v0.9.0';
export const VIOLET_RELEASE = 'violet-v0.9.0';

/** The ISO 3166-1 alpha-3 code of the one country the place names, or null. */
export function countryIsoFor(place: string): string | null {
  const text = ` ${foldPlace(place)} `;
  if (text.trim() === '') return null;
  const hits: { iso: string; start: number; end: number }[] = [];
  for (const country of COUNTRIES) {
    const name = foldPlace(country.name);
    if (!name) continue;
    for (let at = text.indexOf(` ${name} `); at !== -1; at = text.indexOf(` ${name} `, at + 1)) {
      hits.push({ iso: country.iso, start: at + 1, end: at + 1 + name.length });
    }
  }
  /* A name inside a longer name that also matched gives way to it. */
  const standing = hits.filter(
    (h) => !hits.some((o) => o !== h && o.start <= h.start && o.end >= h.end && o.end - o.start > h.end - h.start)
  );
  const found = new Set(standing.map((h) => h.iso));
  return found.size === 1 ? [...found][0] : null;
}

/**
 * The project the calculator reads, from the shared project record: his package's own adapter
 * (`calvinProjectFromRecord`, calvin 0.8.0). Under today's rules the kind of project is worked out from the record's
 * facts, never from a label. Nothing is filled in that the record does not hold. This site has no Project Record page, so
 * his screen never points to one (`recordPage: false`, calvin 0.9.0).
 */
export function calvinProjectFrom(record: ProjectRecord): CalvinProject {
  return { ...calvinProjectFromRecord(record), recordPage: false };
}
