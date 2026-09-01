/**
 * Phoebe's knowledge, read from the committed card files.
 *
 * THE CARD FILES ARE THE ONLY SOURCE. The worksheet does not carry its own
 * copy of the six criteria or the ten considerations — it reads
 * eligibility-cards-vwba.md and feasibility-cards-vwba.md. A card edit
 * therefore lands in the UI automatically, and the UI cannot drift from what
 * the maintainer approved.
 *
 * Both files are imported raw. They live at the repository root rather than
 * under src/ because they are published documents in their own right, read by
 * people as well as by this module. Vite inlines their text into the bundle,
 * which costs roughly 46 KB before compression — small against the map's data,
 * and the files are public anyway.
 *
 * WHEN THIS RUNS. The import is resolved when the bundle is built; the parsing
 * below runs when the module is first loaded in the browser. So a card whose
 * formatting has drifted throws on page load, not during `vite build`.
 * scripts/check-cards.mjs is the build-time guard — it re-derives both card
 * sets independently and fails the gate, in the same way check-attribution
 * guards the licence strings.
 *
 * PARSING FAILS LOUDLY. Every extractor throws when it cannot find what it
 * expects, and the counts are asserted against what the sources actually hold.
 * A silently empty worksheet would be a fabricated state — it would tell a
 * reader that no criteria exist, which is false.
 */

import eligibilityRawFile from '../../eligibility-cards-vwba.md?raw';
import feasibilityRawFile from '../../feasibility-cards-vwba.md?raw';

/**
 * Line endings are normalised before anything is parsed.
 *
 * Git checks these files out with CRLF on Windows and LF on Vercel's Linux
 * builders. Every pattern below keys off blank lines, and `\n\n` does not
 * match `\r\n\r\n` — so without this the worksheet parses cleanly in
 * production and throws on a Windows checkout. It is the same normalisation
 * scripts/build-prompt-modules.mjs applies for the relay's copy.
 */
const lf = (text: string) => text.replace(/\r\n/g, '\n');

const eligibilityRaw = lf(eligibilityRawFile);
const feasibilityRaw = lf(feasibilityRawFile);

/** Appendix A gives six criteria; Appendix B gives ten considerations. */
const CRITERIA_EXPECTED = 6;
const CONSIDERATIONS_EXPECTED = 10;

/**
 * The citation shape now lives in lib/citation, and is re-exported here so
 * every existing import of it keeps resolving. Moved 1 Sep 2026 because this
 * module reads the card files through the bundler's raw-text import, which
 * only the bundler can resolve — so a method pack could not import the type
 * from here and still be exercised by a check script in plain Node.
 */
export type { Citation } from './citation';
import type { Citation } from './citation';

export interface Criterion {
  /** 1-6, the manual's own numbering. */
  number: number;
  /** The card's title, e.g. "A working route to a countable benefit". */
  title: string;
  /** The rule, in the card's plain words. */
  rule: string;
  citation: Citation;
  /** What a project owner would be asked to show — the route forward. */
  evidence: string[];
}

export interface Consideration {
  /** 1-10, the manual's own numbering. */
  number: number;
  title: string;
  /** The consideration, in the card's plain words. */
  summary: string;
  /** Why the manual says it matters. */
  why: string;
  citation: Citation;
  /** How to weigh it. Guidance, never a gate. */
  weigh: string[];
  /** Which half of Appendix B this falls in. */
  group: 'success' | 'value';
}

/* -------------------------------------------------------------------------
   Extractors. Each throws rather than returning a default.
------------------------------------------------------------------------- */

function fail(what: string, where: string): never {
  throw new Error(
    `phoebeCards: could not read ${what} from ${where}. The card files are the ` +
      `only source for the worksheet, so this is a build error rather than an ` +
      `empty state. Check that the card's formatting still matches the parser.`
  );
}

/** Splits a card file into its "## Card ..." blocks, keeping the heading. */
function splitCards(source: string, file: string): { heading: string; body: string }[] {
  const parts = source.split(/^## Card /m).slice(1);
  if (parts.length === 0) fail('any cards', file);
  return parts.map((part) => {
    const newline = part.indexOf('\n');
    return {
      heading: part.slice(0, newline).trim(),
      body: part.slice(newline + 1),
    };
  });
}

/**
 * Reads a bold-labelled paragraph — `**Label.** text` — and returns the text
 * with its line wrapping flattened. Markdown emphasis is stripped so the
 * worksheet renders plain prose; the cards keep their emphasis for readers.
 */
function labelledText(body: string, label: string, file: string): string {
  const pattern = new RegExp(`\\*\\*${label}[^*]*\\*\\*\\s*([\\s\\S]*?)(?=\\n\\n|$)`);
  const match = body.match(pattern);
  if (!match) fail(`the "${label}" section`, file);
  return flatten(match[1]);
}

/** Reads the bullet list that follows a bold-labelled heading. */
function labelledBullets(body: string, label: string, file: string): string[] {
  const pattern = new RegExp(`\\*\\*${label}[^*]*\\*\\*\\s*\\n\\n([\\s\\S]*?)(?=\\n---|\\n## |$)`);
  const match = body.match(pattern);
  if (!match) fail(`the "${label}" list`, file);

  const items = match[1]
    .split(/^- /m)
    .slice(1)
    .map((item) => flatten(item))
    .filter(Boolean);

  if (items.length === 0) fail(`any bullets under "${label}"`, file);
  return items;
}

/** Collapses wrapped lines and strips markdown emphasis and link syntax. */
function flatten(text: string): string {
  return text
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|[\s(])\*(?!\s)(.+?)\*/g, '$1$2')
    .replace(/<(https?:[^>]+)>/g, '$1')
    .trim();
}

/**
 * Pulls the four-part citation apart.
 *
 * The Source line is written to one shape across every committed card:
 *   VWBA 2.0 (Version 1, September 2025), <section> — "<title>", p. <n>. ...
 */
function readCitation(body: string, file: string): Citation {
  const full = labelledText(body, 'Source\\.', file);
  const link = labelledText(body, 'Canonical link\\.', file);

  const href = link.match(/https?:\/\/\S+/)?.[0]?.replace(/[.,]$/, '');
  if (!href) fail('a canonical link', file);

  const version = full.match(/\(([^)]*Version[^)]*)\)/)?.[1];
  if (!version) fail('a version in the citation', file);

  const page = full.match(/\bp{1,2}\.\s*\d+(?:–\d+)?/)?.[0];
  if (!page) fail('a page in the citation', file);

  /* Everything between the version and the em dash (or the page) locates the
     claim inside the document — "Appendix A, criterion 1". */
  const afterVersion = full.slice(full.indexOf(version) + version.length + 1);
  const section = afterVersion
    .split(/\s—\s|,\s*p{1,2}\./)[0]
    .replace(/^[,\s]+/, '')
    .replace(/[,\s]+$/, '')
    .replace(/,\s*/g, ' · ')
    .trim();
  if (!section) fail('a section in the citation', file);

  return { document: 'VWBA 2.0', version, section, page, full, href };
}

/* -------------------------------------------------------------------------
   The two card sets.
------------------------------------------------------------------------- */

const ELIGIBILITY_FILE = 'eligibility-cards-vwba.md';
const FEASIBILITY_FILE = 'feasibility-cards-vwba.md';

export const CRITERIA: Criterion[] = splitCards(eligibilityRaw, ELIGIBILITY_FILE).map(
  ({ heading, body }) => {
    const parsed = heading.match(/^(\d+)\s+—\s+(.+)$/);
    if (!parsed) fail(`a criterion number and title from "${heading}"`, ELIGIBILITY_FILE);
    return {
      number: Number(parsed[1]),
      title: parsed[2],
      rule: labelledText(body, 'The rule in plain words\\.', ELIGIBILITY_FILE),
      citation: readCitation(body, ELIGIBILITY_FILE),
      evidence: labelledBullets(
        body,
        'What a project owner would be asked to show\\.',
        ELIGIBILITY_FILE
      ),
    };
  }
);

export const CONSIDERATIONS: Consideration[] = splitCards(feasibilityRaw, FEASIBILITY_FILE).map(
  ({ heading, body }) => {
    const parsed = heading.match(/^B-(\d+)\s+—\s+(.+)$/);
    if (!parsed) fail(`a consideration number and title from "${heading}"`, FEASIBILITY_FILE);
    const number = Number(parsed[1]);
    return {
      number,
      title: parsed[2],
      summary: labelledText(body, 'The consideration in plain words\\.', FEASIBILITY_FILE),
      why: labelledText(body, 'Why it matters\\.', FEASIBILITY_FILE),
      citation: readCitation(body, FEASIBILITY_FILE),
      weigh: labelledBullets(body, 'How to weigh it', FEASIBILITY_FILE),
      /* Appendix B's own split, stated in its introduction on p. 34. */
      group: number <= 5 ? 'success' : 'value',
    };
  }
);

/* The manual's counts, asserted rather than assumed. If a card is added or
   dropped without this module being revisited, the build stops here. */
if (CRITERIA.length !== CRITERIA_EXPECTED) {
  throw new Error(
    `phoebeCards: expected ${CRITERIA_EXPECTED} eligibility criteria, parsed ${CRITERIA.length}.`
  );
}
if (CONSIDERATIONS.length !== CONSIDERATIONS_EXPECTED) {
  throw new Error(
    `phoebeCards: expected ${CONSIDERATIONS_EXPECTED} feasibility considerations, ` +
      `parsed ${CONSIDERATIONS.length}.`
  );
}

/** Appendix B's two halves, labelled as the manual labels them. */
export const CONSIDERATION_GROUPS = [
  {
    key: 'success' as const,
    label: 'Likelihood of success',
    note: 'Considerations 1 to 5 — whether the project will work, and go on working.',
  },
  {
    key: 'value' as const,
    label: 'Added impact or value',
    note: 'Considerations 6 to 10 — beyond working, what else the project brings.',
  },
];
