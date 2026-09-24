/**
 * What a tool folder's README says about itself — read, never re-typed.
 *
 * BUILD-ORDER STEP 1 under "V1 — the done line", 24 Sep 2026, ruling R10 on
 * the Knowledge-tab proposal: every pack shows its version, and the version is
 * read from the committed file that declares it. Phoebe's two packs are in the
 * new pack shape and src/lib/phoebeCards.ts reads their pack READMEs. Calvin's
 * and Bridget's packs are still in the old shape, where each TOOL FOLDER is
 * the versioned thing, so their versions are read one per tool row. When item
 * K9 moves those packs to the new shape, this module follows them.
 *
 * IT READS THREE FACTS AND NO MORE: the "**Version x.y.z.**" line, the plain
 * sentence that follows it, and the cited-document table where the folder
 * carries one. Anything else a README says is for a person to read.
 *
 * IT FAILS LOUDLY. A README whose opening line has been reworded stops the
 * page rather than showing a tab with a version silently missing — the same
 * choice phoebeCards makes, for the same reason: an empty state that looks
 * deliberate is worse than an error that is not.
 */

import calvinD3Readme from '../../knowledge-packs/calvin-quantify/tools/vwba-2.0-d3-volume-provided/README.md?raw';
import calvinLegacyReadme from '../../knowledge-packs/calvin-quantify/tools/gs-sdws-legacy-v1/README.md?raw';
import calvinPaaReadme from '../../knowledge-packs/calvin-quantify/tools/gs-sdws-paa-v2/README.md?raw';
import basinsReadme from '../../knowledge-packs/bridget-map/tools/hydrosheds-hydrobasins/README.md?raw';
import stressReadme from '../../knowledge-packs/bridget-map/tools/wri-aqueduct-4.0/README.md?raw';

/**
 * Windows checks these files out with CRLF and Vercel's builders with LF, and
 * every pattern below keys off line ends. Same normalisation, same reason, as
 * src/lib/phoebeCards.ts.
 */
const lf = (text: string) => text.replace(/\r\n/g, '\n');

/**
 * Every live tool folder, by the id its registry uses.
 *
 * Calvin's ids are his `methodPacks` keys; Bridget's are her dataset folders.
 * The two parked stubs (vwba-2.0-d4, vwba-2.0-d6) are not live and are not
 * shown on any tab, so they are not read here.
 */
const READMES: Record<string, { path: string; raw: string }> = {
  'vwba-2.0-d3-volume-provided': {
    path: 'knowledge-packs/calvin-quantify/tools/vwba-2.0-d3-volume-provided/README.md',
    raw: lf(calvinD3Readme),
  },
  'gs-sdws-legacy-v1': {
    path: 'knowledge-packs/calvin-quantify/tools/gs-sdws-legacy-v1/README.md',
    raw: lf(calvinLegacyReadme),
  },
  'gs-sdws-paa-v2': {
    path: 'knowledge-packs/calvin-quantify/tools/gs-sdws-paa-v2/README.md',
    raw: lf(calvinPaaReadme),
  },
  'hydrosheds-hydrobasins': {
    path: 'knowledge-packs/bridget-map/tools/hydrosheds-hydrobasins/README.md',
    raw: lf(basinsReadme),
  },
  'wri-aqueduct-4.0': {
    path: 'knowledge-packs/bridget-map/tools/wri-aqueduct-4.0/README.md',
    raw: lf(stressReadme),
  },
};

function fail(what: string, where: string): never {
  throw new Error(
    `toolReadmes: could not read ${what} from ${where}. A tool folder's README is ` +
      `the only source for what its row shows, so this is a build error rather ` +
      `than a blank. Check that the README's opening still matches the parser.`
  );
}

function readme(id: string): { path: string; raw: string } {
  const found = READMES[id];
  if (!found) fail('a README', `the tool id "${id}" — it is not in toolReadmes`);
  return found;
}

/** Wrapped prose from a file, as one line, with the markdown taken off. */
const flatten = (text: string) =>
  text
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .trim();

/** The folder's own version — the "**Version 0.1.0.**" that opens its README. */
export function toolVersion(id: string): string {
  const { path, raw } = readme(id);
  const match = raw.match(/\*\*Version (\d+\.\d+\.\d+)\b/);
  if (!match) fail('a Version line', path);
  return match[1];
}

/**
 * The plain sentence the README gives after its version, in its own words.
 *
 * Bridget's two folders open "**Version 0.1.0.** One tool: …", which is the
 * one plain-words statement of what the dataset is. It is taken whole: a
 * README's sentence trimmed to read better on a page is a sentence this site
 * wrote, not one the pack did.
 */
export function toolSummary(id: string): string {
  const { path, raw } = readme(id);
  const paragraph = raw.split('\n\n').find((p) => p.includes('**Version '));
  if (!paragraph) fail('the paragraph that opens with the version', path);
  const after = paragraph.slice(paragraph.indexOf('**Version '));
  const sentence = flatten(after).replace(/^Version \d+\.\d+\.\d+\.\s*/, '');
  if (!sentence) fail('a sentence after the version', path);
  return sentence;
}

/** The three parts of the source a tool folder cites, from its own table. */
export interface CitedDocument {
  /** The document's name, as the table writes it. */
  document: string;
  /** The document's version, as the table writes it. */
  version: string;
}

/**
 * The cited-document table at the head of a dataset folder's README.
 *
 * The publisher and the canonical link are NOT read from here: they are named
 * in src/lib/licences.ts, which is the one home for this site's attribution
 * facts, and that is where Bridget's tab takes them from.
 */
export function citedDocument(id: string): CitedDocument {
  const { path, raw } = readme(id);
  const document = raw.match(/^\| \*\*Document\*\* \| (.+?) \|\s*$/m)?.[1];
  const version = raw.match(/^\| \*\*Version\*\* \| (.+?) \|\s*$/m)?.[1];
  if (!document) fail('the Document row of the cited-document table', path);
  if (!version) fail('the Version row of the cited-document table', path);
  return { document: flatten(document), version: flatten(version) };
}
