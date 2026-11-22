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
 *   - Technology: only for a drinking-water project (type C-19). Its Gold
 *     Standard class says which: a new community source (CWS) or water made
 *     safe in the home (HWT). Community treatment (CWT) and institutions (IWT)
 *     are "other" until the core maps them (proposal section 1, item 6), and
 *     the calculator says it does not cover them.
 *   - Country: the visitor's place, matched word for word against the engine's
 *     own country list. One country named, or none — the rule the map uses
 *     (src/lib/placeBox.ts). A town alone is never looked up.
 *   - People served: as said, people or households, never converted here.
 *   - Already credited under V1.0 (`creditedUnderV1`): LEFT UNSET, the maintainer's word of
 *     16 Nov 2026, so every project gets calvin's V2.0-only view: one V2.0 figure, no V1.0
 *     figure, no transition, no ask for a V1.0 filing. Item A29 sets it from Phoebe's question.
 */

import type { CalvinProject } from '@waterbots/calvin/screen';
import { COUNTRIES } from '@waterbots/calvin/engine';
import { DRINKING_WATER_TYPE } from './projectTypes.generated';
import { foldPlace } from './placeBox';
import type { VisitContext } from './visit';

/** The installed package's version, held to the lockfile by scripts/check-calvin-package.mjs. */
export const CALVIN_PACKAGE_VERSION = '0.5.0';

/** Violet's D-3 package, the water calculator from 22 Nov 2026, from the same release. */
export const VIOLET_PACKAGE_VERSION = '0.5.0';

/** The release tag both came from. */
export const CALVIN_RELEASE = 'calvin-violet-v0.5.0';

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

/** The core's technology for this visit's project, or undefined when the record does not say. */
export function technologyFor(context: Pick<VisitContext, 'type' | 'gsClass'>): CalvinProject['technology'] {
  if (context.type !== DRINKING_WATER_TYPE || !context.gsClass) return undefined;
  if (context.gsClass === 'CWS') return 'CWS';
  if (context.gsClass === 'HWT') return 'HWT';
  return 'other';
}

/** The project the calculator reads, from the visit's record alone. */
export function calvinProject(context: VisitContext): CalvinProject {
  const technology = technologyFor(context);
  const country = countryIsoFor(context.place);
  return {
    name: context.name.trim() || 'This project',
    /* The calculator is the carbon calculator: opening it is the visitor
       asking about carbon credits. Nothing else is said about the project. */
    standards: ['carbon'],
    ...(technology ? { technology } : {}),
    ...(country ? { country } : {}),
    ...(context.served ? { population: { mode: context.served.unit, served: context.served.count } } : {}),
  };
}
