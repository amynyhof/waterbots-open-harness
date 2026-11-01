/**
 * Where the Map tab opens — the maintainer's ruling of 31 Oct 2026 on #167:
 * zoom to the place Wellington already heard, the whole world when no place is
 * known, and never guess a place.
 *
 * ONE COUNTRY, NAMED, OR NOTHING. The visitor's place is matched, word for
 * word, against every country's names in Natural Earth (countryBoxes.generated.ts).
 * A name inside a longer name that also matched gives way to it, so
 * "Democratic Republic of the Congo" is one country, not two. When exactly one
 * country is left its box comes back; when none is ("Lilongwe") or two are
 * ("between Malawi and Zambia") the answer is null, and the map stays on the
 * whole world. A town or district is never looked up: there is no list of them
 * here, and a lookup that might pick the wrong one is a guess.
 */

import type { Bbox } from './basins';
import { COUNTRY_BOXES } from './countryBoxes.generated';

/** The folding scripts/build-country-boxes.mjs applied to the names. */
export function foldPlace(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function placeBox(place: string): Bbox | null {
  const text = ` ${foldPlace(place)} `;
  if (text.trim() === '') return null;

  const hits: { country: number; start: number; end: number }[] = [];
  COUNTRY_BOXES.forEach((c, country) => {
    for (const name of c.names) {
      for (let at = text.indexOf(` ${name} `); at !== -1; at = text.indexOf(` ${name} `, at + 1)) {
        hits.push({ country, start: at + 1, end: at + 1 + name.length });
      }
    }
  });

  const standing = hits.filter(
    (h) => !hits.some((o) => o !== h && o.start <= h.start && o.end >= h.end && o.end - o.start > h.end - h.start)
  );
  const countries = new Set(standing.map((h) => h.country));
  if (countries.size !== 1) return null;
  return COUNTRY_BOXES[[...countries][0]].box;
}
