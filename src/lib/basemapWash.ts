/**
 * The basemap wash.
 *
 * A low-opacity brand tint laid between the basemap tiles and the basin
 * polygons, so the sea and the land carry a brand tone without the publisher's
 * raster imagery being recoloured.
 *
 * MAINTAINER'S RULING, 30 Aug 2026, after walking the map at four strengths:
 * 13%. It was ruled in the same breath as a ruling that the stress ramp does
 * NOT change — "the wash at 13% was the missing richness, not the ladder."
 * A hybrid ramp had been built and looked at and was withdrawn on that finding.
 * The ramp is untouched; this file is the whole of what changed.
 *
 * WHY A WASH RATHER THAN A DIFFERENT BASEMAP. Three routes were put up. A CSS
 * filter over the tiles was refused outright: it rewrites CARTO's imagery
 * wholesale and puts the licence credit's legibility at risk. A different CARTO
 * raster style means choosing from their three, and Voyager was already walked
 * and chosen (item O9). A custom CARTO vector style is the real answer and is
 * logged as such in item S9 — it is substantially more work and it changes a
 * standing dependency.
 *
 * WHY SLATE, AND WHY IT COOLS RATHER THAN WARMS. BRAND.md v3 §2.5 reserves the
 * warm hues: "amber and coral mean a warning, a sub-par metric, or an error,
 * never emphasis, never decoration". A warm basemap wash is therefore not
 * available. Driftwood is warm and was proposed for the dry categories on the
 * same day; borrowing it here would tie the basemap to a meaning the data
 * carries. Slate is the book's "quiet monitoring" hue, is reserved for nothing,
 * and holds no agent identity on this surface.
 *
 * Quieting the basemap is what lets the ramp read as rich. The map takes its
 * richness from the data; the basemap stops competing with it.
 *
 * SLATE AS A BASEMAP WASH IS A USE THE BOOK DOES NOT CARRY. It is ruled here
 * and is on the list the maintainer carries into the master brand book, rather
 * than being treated as an implementation detail — see item S9.
 *
 * WHAT IT DOES TO THE TWO DRY CATEGORIES, RECORDED SO IT IS NOT REDISCOVERED AS
 * A BUG. Arid and Low Water Use and No Data are deliberately near-neutral AND
 * low-opacity, so they read as windows onto the basemap rather than as a value.
 * They are 20.93% of basins. The wash sits under them, so it tints what shows
 * through. That is the intended behaviour — they still read as basemap, and the
 * basemap is now quieter — but it is the thing to check first if those
 * categories ever start reading as a reading.
 *
 * IT DOES NOT CHANGE THE SEA-VERSUS-LOW-BAND QUESTION SETTLED IN ITEM S8. The
 * wash sits beneath both the open sea and the basin fills, so it moves them
 * together and the hairline borders that separate them are untouched.
 */
export const BASEMAP_WASH = {
  /** Slate. Read as a literal here rather than from the stylesheet because
   *  Leaflet paints SVG path fills, which take a colour value and not a CSS
   *  custom property. It is BRAND.md's --slate and must move with it. */
  colour: '#3D5878',
  /** Ruled 30 Aug 2026, after walking 4%, 6%, 9% and 13% on the real map. */
  opacity: 0.13,
} as const;
