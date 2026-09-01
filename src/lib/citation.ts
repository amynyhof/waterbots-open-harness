/**
 * What a citation is, in one place.
 *
 * CITATIONS.md fixes the four-part shape every cited claim carries, and this
 * is that shape as the console holds it. It lives in its own module because
 * more than one kind of thing cites a source now: Phoebe's rule cards, and the
 * method packs inside the Quantification step. Two copies of this interface
 * would be two shapes that could drift, which is the disease the one-home rule
 * exists to cure.
 *
 * MOVED HERE 1 Sep 2026, out of lib/phoebeCards. Nothing about the shape
 * changed in the move, and phoebeCards re-exports it so every existing import
 * still resolves. It was moved because phoebeCards reads the card files
 * through the bundler's raw-text import, which only the bundler can resolve —
 * so anything importing this type from there could only ever run in a browser.
 * A method pack has to be exercised by a check script in plain Node, and a
 * type should not decide where code is allowed to run.
 */

/**
 * A citation broken into the parts CITATIONS.md renders as tags.
 *
 * `document` and `section` and `page` each become their own .tag — a value,
 * bordered and unfilled, never a .chip. Chips carry state; citations do not.
 */
export interface Citation {
  /** "VWBA 2.0" — the short document name. */
  document: string;
  /** "Version 1, September 2025" — part of the four-part shape. */
  version: string;
  /** "Appendix A · criterion 1" — where in the document. */
  section: string;
  /** "p. 32" — the printed page, which matches the PDF page 1:1. */
  page: string;
  /** The source line as written on the card, for the title attribute. */
  full: string;
  /** The publisher's canonical URL. */
  href: string;
}
