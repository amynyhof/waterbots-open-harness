/**
 * The WaterBots.AI wordmark.
 *
 * INLINED, NOT AN <img>. brand/assets/logo/wordmark.svg carries no styling of
 * its own — it is 216 bytes of markup referencing three CSS classes (.wm,
 * .ink, .tide) that the host page is expected to define. Loaded through an
 * <img> tag those classes never apply and it renders as unstyled default-font
 * text, which is worse than no logo at all.
 *
 * Importing the raw markup and inlining it lets the page's own tokens style
 * it, so the mark picks up DM Sans and the tide-blue `.AI` from the design
 * tokens rather than hard-coded values. The class rules live in base.css.
 *
 * The SVG is our own asset, checked into this repository, not user content —
 * there is nothing untrusted to sanitise here.
 */

import wordmark from '../../brand/assets/logo/wordmark.svg?raw';

export default function Wordmark({ height = 26 }: { height?: number }) {
  return (
    <span
      className="wb-wordmark"
      style={{ height, display: 'inline-flex', alignItems: 'center' }}
      dangerouslySetInnerHTML={{ __html: wordmark }}
    />
  );
}
