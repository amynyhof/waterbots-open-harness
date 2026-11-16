/**
 * The build banner — W28, the maintainer's word of 16 Nov 2026.
 *
 * ONE QUIET LINE UNDER THE SITE MENU, ON EVERY PAGE: the console's steps, the
 * Agent Commons and the interest form. Her words, exactly, and nothing else.
 * It replaces the three-line paragraph that stood above Wellington's chat on
 * the desk from 23 Sep 2026 (item S11), so the site says it in one place.
 *
 * No colour of its own, no close button, no link. The note that a figure is
 * a first screening and not an official decision stays beside the figures and
 * in the screening report; it is not said here (her word, the same day).
 * Wellington keeps his dated build-update fact and phrases it when asked.
 */

/** Her words for the line, 16 Nov 2026. Changed only on her word. */
export const BUILD_BANNER_LINE = 'This site is still being built.';

export default function BuildBanner() {
  return (
    <p className="wb-build-banner t-caption" role="note">
      {BUILD_BANNER_LINE}
    </p>
  );
}
