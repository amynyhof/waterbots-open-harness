/**
 * Phoebe's knowledge, read from the committed card files.
 *
 * THE CARD FILES ARE THE ONLY SOURCE. The worksheet does not carry its own
 * copy of the six criteria or the ten considerations — it reads
 * eligibility-cards-vwba.md and feasibility-cards-vwba.md. A card edit
 * therefore lands in the UI automatically, and the UI cannot drift from what
 * the maintainer approved.
 *
 * PACK-KEYED FROM 23 SEP 2026 (build-order step 1 under "V1 — the done line";
 * the reader half of item K7's step 5). This module reads every approved card
 * set in both of her packs — the water pack's applies, eligibility,
 * feasibility and routes sets, and the carbon pack's applies, eligibility and
 * routes sets — plus each pack's README for its version. It reads them so the
 * Knowledge pack tab can show every card. WHAT REACHES HER PROMPT IS
 * UNCHANGED: scripts/build-prompt-modules.mjs still embeds the two water files
 * and nothing else; the carbon cards are shown and not yet read by her, and
 * her tab says so. The worksheet still reads CRITERIA and CONSIDERATIONS, whose
 * shape is kept.
 *
 * The files are imported raw. They live in the packs, at
 * knowledge-packs/phoebe-eligibility/<pack>/cards/, by the maintainer's ruling
 * of 17 Sep 2026 that a pack is the cards' one home. They sit outside src/
 * because they are published documents in their own right, read by people as
 * well as by this module. Vite inlines their text into the bundle — roughly
 * 182 KB before compression for the seven files, against 40 KB for the two it
 * inlined before; the maintainer accepted the cost on 23 Sep 2026. The files
 * are public anyway.
 *
 * WHEN THIS RUNS. The import is resolved when the bundle is built; the parsing
 * below runs when the module is first loaded in the browser. So a card whose
 * formatting has drifted throws on page load, not during `vite build`.
 * scripts/check-cards.mjs is the build-time guard — it re-derives every set
 * independently and fails the gate, in the same way check-attribution guards
 * the licence strings.
 *
 * PARSING FAILS LOUDLY. Every extractor throws when it cannot find what it
 * expects, and the counts are asserted against what the sources actually hold.
 * A silently empty worksheet would be a fabricated state — it would tell a
 * reader that no criteria exist, which is false.
 */

import eligibilityRawFile from '../../knowledge-packs/phoebe-eligibility/vwba-2.0/cards/eligibility-cards-vwba.md?raw';
import feasibilityRawFile from '../../knowledge-packs/phoebe-eligibility/vwba-2.0/cards/feasibility-cards-vwba.md?raw';
import routesWaterRawFile from '../../knowledge-packs/phoebe-eligibility/vwba-2.0/cards/routes-cards-vwba.md?raw';
import appliesWaterRawFile from '../../knowledge-packs/phoebe-eligibility/vwba-2.0/cards/applies-cards-vwba.md?raw';
import waterReadmeRawFile from '../../knowledge-packs/phoebe-eligibility/vwba-2.0/README.md?raw';
import appliesCarbonRawFile from '../../knowledge-packs/phoebe-eligibility/gs-paa-v2.0/cards/applies-cards-gs.md?raw';
import eligibilityCarbonRawFile from '../../knowledge-packs/phoebe-eligibility/gs-paa-v2.0/cards/eligibility-cards-gs.md?raw';
import routesCarbonRawFile from '../../knowledge-packs/phoebe-eligibility/gs-paa-v2.0/cards/routes-cards-gs.md?raw';
import carbonReadmeRawFile from '../../knowledge-packs/phoebe-eligibility/gs-paa-v2.0/README.md?raw';

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
const routesWaterRaw = lf(routesWaterRawFile);
const appliesWaterRaw = lf(appliesWaterRawFile);
const appliesCarbonRaw = lf(appliesCarbonRawFile);
const eligibilityCarbonRaw = lf(eligibilityCarbonRawFile);
const routesCarbonRaw = lf(routesCarbonRawFile);

/* The sets' own counts, asserted rather than assumed. Appendix A gives six
   criteria and Appendix B ten considerations; the other five are the counts
   the maintainer graded on 23 Sep 2026. */
const CRITERIA_EXPECTED = 6;
const CONSIDERATIONS_EXPECTED = 10;
const WATER_APPLIES_EXPECTED = 2;
const WATER_ROUTES_EXPECTED = 9;
const CARBON_APPLIES_EXPECTED = 4;
const CARBON_ELIGIBILITY_EXPECTED = 32;
const CARBON_ROUTES_EXPECTED = 19;

/**
 * The citation shape now lives in lib/citation, and is re-exported here so
 * every existing import of it keeps resolving. Moved 1 Sep 2026 because this
 * module reads the card files through the bundler's raw-text import, which
 * only the bundler can resolve — so a method pack could not import the type
 * from here and still be exercised by a check script in plain Node.
 */
export type { Citation } from './citation';
import type { Citation } from './citation';

/**
 * The card's own "Can it be fixed?" line — the only place the word Blocked
 * can come from (item A18). `value` is the first word of the bold head, one of
 * three; `text` is the whole paragraph, head included, in the card's words.
 */
export interface Fixable {
  value: 'yes' | 'no' | 'depends';
  text: string;
}

/**
 * The card's Phase line (the phase-tags ruling of 23 Sep 2026): the phase on
 * the navigation where the row is acted on, or "To remain eligible"; and the
 * "Kept up by" clause where the card carries one.
 */
export interface Phase {
  phase: string;
  keptUp?: string;
}

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
  fixable: Fixable;
  phase: Phase;
  /** Further canonical links the card names beyond the cite line's. */
  moreLinks: string[];
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

/** One "does this apply" question — W1, W2 on the water pack; T1 to T4 on carbon. */
export interface AppliesCard {
  id: string;
  title: string;
  /** The test in plain words. */
  test: string;
  appliesTo: string;
  evidence: string[];
  /** "If the answer is no" — or, on T4, "If the answer is unknown"; the card's own heading. */
  ifNo: { heading: string; text: string };
  citation: Citation;
  moreLinks: string[];
}

/** One carbon eligibility row — M1 to M17, P1 to P2, G1 to G13. */
export interface CarbonCard {
  id: string;
  /** The file's three parts: the methodology's own gate, the framework, the rules for every project. */
  part: 'M' | 'P' | 'G';
  title: string;
  rule: string;
  fixable: Fixable;
  phase: Phase;
  appliesTo: string;
  external: string;
  evidence: string[];
  citation: Citation;
  moreLinks: string[];
}

/** One cited fix — R-1 to R-9 on the water pack; R-1 to R-19 on carbon. */
export interface RouteCard {
  id: string;
  title: string;
  gap: string;
  route: string;
  notPromise: string;
  citation: Citation;
  moreLinks: string[];
}

/** What a pack says about itself: its version and the document it cites, read from its files. */
export interface PackInfo {
  key: string;
  /** "0.7.0", from the pack README's own Version line. */
  version: string;
  /** The "Source being cited" table at the head of the pack's eligibility file. */
  source: { document: string; publisher: string };
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

/**
 * Splits a card file into its "## Card ..." blocks, keeping the heading. The
 * routes files head each card "## Route ..." instead, so the word is a
 * parameter. Anything before the first heading — the status line, the
 * design decision, the source table — is not a card and is not read here.
 */
function splitCards(source: string, file: string, word: 'Card' | 'Route' = 'Card'): { heading: string; body: string }[] {
  const parts = source.split(new RegExp(`^## ${word} `, 'm')).slice(1);
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

/**
 * Reads a bold-labelled paragraph whose bold head carries a value of its own —
 * `**Can it be fixed? Yes.** text`, `**If the answer is no.** text` — and
 * returns the head after the label and the text separately.
 */
function labelledHead(body: string, label: string, file: string): { head: string; text: string } {
  const pattern = new RegExp(`\\*\\*${label}([^*]*)\\*\\*\\s*([\\s\\S]*?)(?=\\n\\n|$)`);
  const match = body.match(pattern);
  if (!match) fail(`the "${label}" section`, file);
  return { head: flatten(match[1]), text: flatten(match[2]) };
}

/**
 * Reads the bullet list that follows a bold-labelled heading.
 *
 * The list ends at a rule, the next card, or a bold paragraph that follows
 * the first bullet. The third stop was added on 23 Sep 2026: an applies
 * card's "If the answer is no" follows its evidence list, and on water
 * criterion 6 two paragraphs follow the list — without it the last bullet
 * swallowed whatever came next, which is what the worksheet showed until this
 * day. A bold paragraph BEFORE the first bullet (criterion 3 carries two) is
 * not a bullet and is passed over, as it always was.
 */
function labelledBullets(body: string, label: string, file: string): string[] {
  const pattern = new RegExp(`\\*\\*${label}[^*]*\\*\\*\\s*\\n\\n([\\s\\S]*?)(?=\\n---|\\n## |$)`);
  const match = body.match(pattern);
  if (!match) fail(`the "${label}" list`, file);

  const block = match[1];
  const firstBullet = block.search(/^- /m);
  if (firstBullet < 0) fail(`any bullets under "${label}"`, file);
  const trailing = block.slice(firstBullet).search(/\n\n\*\*/);
  const list = trailing < 0 ? block.slice(firstBullet) : block.slice(firstBullet, firstBullet + trailing);

  const items = list
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
 * Pulls the four-part citation apart, and keeps any further canonical links.
 *
 * Every committed card writes its Source line to one shape:
 *   <document> (<version>), <section> — "<title>", p. <n>. ...
 * The document is whatever stands before the version parenthesis — "VWBA
 * 2.0", "GS4GG PAA M400-12", "Principles & Requirements" — never typed here.
 * The version is the parenthesis that opens "Version …" or "v<digit>…"; the
 * page is the first "p." or "pp."; the section is what lies between them.
 * The cite line takes the first canonical link; a card that names a second or
 * third gives them back as `moreLinks`, in the card's own order.
 */
function readCitation(body: string, file: string): { citation: Citation; moreLinks: string[] } {
  const full = labelledText(body, 'Source\\.', file);
  const link = labelledText(body, 'Canonical link\\.', file);

  const hrefs = (link.match(/https?:\/\/\S+/g) ?? []).map((h) => h.replace(/[.,;]+$/, ''));
  const href = hrefs[0];
  if (!href) fail('a canonical link', file);

  const version = full.match(/\(((?:Version|v\d)[^)]*)\)/)?.[1];
  if (!version) fail('a version in the citation', file);

  const document = full
    .slice(0, full.indexOf(`(${version})`))
    .replace(/\*/g, '')
    .replace(/[,\s]+$/, '')
    .trim();
  if (!document) fail('a document name in the citation', file);

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

  return { citation: { document, version, section, page, full, href }, moreLinks: hrefs.slice(1) };
}

/** "**Can it be fixed? Depends, on the pump.** …" → the value and the whole paragraph. */
function readFixable(body: string, file: string): Fixable {
  const { head, text } = labelledHead(body, 'Can it be fixed\\?', file);
  const value = head.match(/^\s*(yes|no|depends)\b/i)?.[1]?.toLowerCase() as Fixable['value'] | undefined;
  if (!value) fail(`a yes, no or depends on the "Can it be fixed?" line ("${head}")`, file);
  return { value, text: `${head} ${text}`.trim() };
}

/** "**Phase.** Plan. Kept up by: …" → the phase word and the clause, when there is one. */
function readPhase(body: string, file: string): Phase {
  const line = labelledText(body, 'Phase\\.', file);
  const stop = line.indexOf('.');
  const phase = (stop < 0 ? line : line.slice(0, stop)).trim();
  if (!phase) fail('a phase word on the Phase line', file);
  const keptUp = stop < 0 ? '' : line.slice(stop + 1).trim();
  return keptUp ? { phase, keptUp } : { phase };
}

/** The card's heading, "<id> — <title>", with the id held to the set's own pattern. */
function readHeading(heading: string, pattern: RegExp, file: string): { id: string; title: string } {
  const parsed = heading.match(pattern);
  if (!parsed) fail(`a card id and title from "${heading}"`, file);
  return { id: parsed[1], title: parsed[2] };
}

const EVIDENCE = 'What a project owner would be asked to show\\.';

/* -------------------------------------------------------------------------
   The water pack — two sets the worksheet and the relay read, two it does not.
------------------------------------------------------------------------- */

const WATER_DIR = 'knowledge-packs/phoebe-eligibility/vwba-2.0';
const ELIGIBILITY_FILE = `${WATER_DIR}/cards/eligibility-cards-vwba.md`;
const FEASIBILITY_FILE = `${WATER_DIR}/cards/feasibility-cards-vwba.md`;
const WATER_ROUTES_FILE = `${WATER_DIR}/cards/routes-cards-vwba.md`;
const WATER_APPLIES_FILE = `${WATER_DIR}/cards/applies-cards-vwba.md`;
const WATER_README = `${WATER_DIR}/README.md`;

export const CRITERIA: Criterion[] = splitCards(eligibilityRaw, ELIGIBILITY_FILE).map(({ heading, body }) => {
  const { id, title } = readHeading(heading, /^(\d+)\s+—\s+(.+)$/, ELIGIBILITY_FILE);
  const { citation, moreLinks } = readCitation(body, ELIGIBILITY_FILE);
  return {
    number: Number(id),
    title,
    rule: labelledText(body, 'The rule in plain words\\.', ELIGIBILITY_FILE),
    citation,
    evidence: labelledBullets(body, EVIDENCE, ELIGIBILITY_FILE),
    fixable: readFixable(body, ELIGIBILITY_FILE),
    phase: readPhase(body, ELIGIBILITY_FILE),
    moreLinks,
  };
});

export const CONSIDERATIONS: Consideration[] = splitCards(feasibilityRaw, FEASIBILITY_FILE).map(
  ({ heading, body }) => {
    const { id, title } = readHeading(heading, /^B-(\d+)\s+—\s+(.+)$/, FEASIBILITY_FILE);
    const number = Number(id);
    return {
      number,
      title,
      summary: labelledText(body, 'The consideration in plain words\\.', FEASIBILITY_FILE),
      why: labelledText(body, 'Why it matters\\.', FEASIBILITY_FILE),
      citation: readCitation(body, FEASIBILITY_FILE).citation,
      weigh: labelledBullets(body, 'How to weigh it', FEASIBILITY_FILE),
      /* Appendix B's own split, stated in its introduction on p. 34. */
      group: number <= 5 ? 'success' : 'value',
    };
  }
);

function readApplies(raw: string, file: string, idPattern: RegExp): AppliesCard[] {
  return splitCards(raw, file).map(({ heading, body }) => {
    const { id, title } = readHeading(heading, idPattern, file);
    const { citation, moreLinks } = readCitation(body, file);
    const ifNo = labelledHead(body, 'If the answer is', file);
    return {
      id,
      title,
      test: labelledText(body, 'The test in plain words\\.', file),
      appliesTo: labelledText(body, 'Applies to\\.', file),
      evidence: labelledBullets(body, EVIDENCE, file),
      /* The heading is the card's own: "If the answer is no", or on T4
         "If the answer is unknown". */
      ifNo: { heading: `If the answer is ${ifNo.head.replace(/\.$/, '')}`, text: ifNo.text },
      citation,
      moreLinks,
    };
  });
}

function readRoutes(raw: string, file: string): RouteCard[] {
  return splitCards(raw, file, 'Route').map(({ heading, body }) => {
    const { id, title } = readHeading(heading, /^(R-\d+)\s+—\s+(.+)$/, file);
    const { citation, moreLinks } = readCitation(body, file);
    return {
      id,
      title,
      gap: labelledText(body, 'The gap\\.', file),
      route: labelledText(body, 'The route in plain words\\.', file),
      notPromise: labelledText(body, 'What it does not promise\\.', file),
      citation,
      moreLinks,
    };
  });
}

export const WATER_APPLIES: AppliesCard[] = readApplies(appliesWaterRaw, WATER_APPLIES_FILE, /^(W\d)\s+—\s+(.+)$/);
export const WATER_ROUTES: RouteCard[] = readRoutes(routesWaterRaw, WATER_ROUTES_FILE);

/* -------------------------------------------------------------------------
   The carbon pack — three sets, shown on the tab and read by nothing else.
------------------------------------------------------------------------- */

const CARBON_DIR = 'knowledge-packs/phoebe-eligibility/gs-paa-v2.0';
const CARBON_APPLIES_FILE = `${CARBON_DIR}/cards/applies-cards-gs.md`;
const CARBON_ELIGIBILITY_FILE = `${CARBON_DIR}/cards/eligibility-cards-gs.md`;
const CARBON_ROUTES_FILE = `${CARBON_DIR}/cards/routes-cards-gs.md`;
const CARBON_README = `${CARBON_DIR}/README.md`;

export const CARBON_APPLIES: AppliesCard[] = readApplies(appliesCarbonRaw, CARBON_APPLIES_FILE, /^(T\d)\s+—\s+(.+)$/);

export const CARBON_ELIGIBILITY: CarbonCard[] = splitCards(eligibilityCarbonRaw, CARBON_ELIGIBILITY_FILE).map(
  ({ heading, body }) => {
    const { id, title } = readHeading(heading, /^([MPG]\d+)\s+—\s+(.+)$/, CARBON_ELIGIBILITY_FILE);
    const { citation, moreLinks } = readCitation(body, CARBON_ELIGIBILITY_FILE);
    return {
      id,
      part: id[0] as CarbonCard['part'],
      title,
      rule: labelledText(body, 'The rule in plain words\\.', CARBON_ELIGIBILITY_FILE),
      fixable: readFixable(body, CARBON_ELIGIBILITY_FILE),
      phase: readPhase(body, CARBON_ELIGIBILITY_FILE),
      appliesTo: labelledText(body, 'Applies to\\.', CARBON_ELIGIBILITY_FILE),
      external: labelledText(body, 'External standard\\.', CARBON_ELIGIBILITY_FILE),
      evidence: labelledBullets(body, EVIDENCE, CARBON_ELIGIBILITY_FILE),
      citation,
      moreLinks,
    };
  }
);

export const CARBON_ROUTES: RouteCard[] = readRoutes(routesCarbonRaw, CARBON_ROUTES_FILE);

/* -------------------------------------------------------------------------
   Looking a card up the way a tool file names it — from 25 Sep 2026.

   A tool row cites its card as "set/id": `eligibility/4`, `applies/W1`,
   `eligibility/M5`. The worksheet, the chat layer and the relay all need the
   card behind a row, so the lookup lives here, beside the parsing, rather than
   being written again in each reader. A name that matches no card returns
   undefined, and every caller drops rather than renders — the same arrangement
   that keeps a citation from ever being invented.
------------------------------------------------------------------------- */

/** What a row's card gives a reader, whichever set it came from. */
export interface RowCard {
  id: string;
  title: string;
  /** The rule, the test or the question, in the card's own plain words. */
  plain: string;
  citation: Citation;
  /** What a project owner would be asked to show. */
  evidence: string[];
  /** The card's own "Can it be fixed?" line, where its set carries one. */
  fixable?: Fixable;
}

export function cardFor(pack: string, cite: string): RowCard | undefined {
  const [set, id] = cite.split('/');
  if (!set || !id) return undefined;
  if (pack === 'vwba-2.0') {
    if (set === 'applies') {
      const card = WATER_APPLIES.find((c) => c.id === id);
      return card && { id: card.id, title: card.title, plain: card.test, citation: card.citation, evidence: card.evidence };
    }
    if (set === 'eligibility') {
      const card = CRITERIA.find((c) => String(c.number) === id);
      return (
        card && {
          id: String(card.number),
          title: card.title,
          plain: card.rule,
          citation: card.citation,
          evidence: card.evidence,
          fixable: card.fixable,
        }
      );
    }
    if (set === 'feasibility') {
      /* The cards are headed "Card B-1" in their file, so B-1 is the id she
         reads and the id she cites. A bare number resolves too, because the
         same card is the manual's consideration 1 and a reader may name it
         either way. */
      const number = id.replace(/^[A-Za-z]+-/, '');
      const card = CONSIDERATIONS.find((c) => String(c.number) === number);
      return card && { id: String(card.number), title: card.title, plain: card.summary, citation: card.citation, evidence: card.weigh };
    }
  }
  if (pack === 'gs-paa-v2.0') {
    if (set === 'applies') {
      const card = CARBON_APPLIES.find((c) => c.id === id);
      return card && { id: card.id, title: card.title, plain: card.test, citation: card.citation, evidence: card.evidence };
    }
    if (set === 'eligibility') {
      const card = CARBON_ELIGIBILITY.find((c) => c.id === id);
      return (
        card && {
          id: card.id,
          title: card.title,
          plain: card.rule,
          citation: card.citation,
          evidence: card.evidence,
          fixable: card.fixable,
        }
      );
    }
  }
  return undefined;
}

/** A route card by its id, within one pack. Both packs number theirs R-1 up. */
export function routeFor(pack: string, id: string): RouteCard | undefined {
  const set = pack === 'vwba-2.0' ? WATER_ROUTES : pack === 'gs-paa-v2.0' ? CARBON_ROUTES : [];
  return set.find((route) => route.id === id);
}

/** The three parts of the carbon eligibility file, in the file's order, labelled as it labels them. */
export const CARBON_ELIGIBILITY_PARTS: { key: CarbonCard['part']; label: string; range: string }[] = [
  { key: 'M', label: "The methodology's own gate", range: 'M1–M17' },
  { key: 'P', label: 'The Paris-alignment framework', range: 'P1–P2' },
  { key: 'G', label: 'The rules for every Gold Standard project', range: 'G1–G13' },
];

/* The sets' counts, asserted rather than assumed. If a card is added or
   dropped without this module being revisited, the build stops here. */
function assertCount(name: string, got: number, expected: number): void {
  if (got !== expected) {
    throw new Error(`phoebeCards: expected ${expected} ${name}, parsed ${got}.`);
  }
}
assertCount('eligibility criteria', CRITERIA.length, CRITERIA_EXPECTED);
assertCount('feasibility considerations', CONSIDERATIONS.length, CONSIDERATIONS_EXPECTED);
assertCount('water applies cards', WATER_APPLIES.length, WATER_APPLIES_EXPECTED);
assertCount('water routes', WATER_ROUTES.length, WATER_ROUTES_EXPECTED);
assertCount('carbon applies cards', CARBON_APPLIES.length, CARBON_APPLIES_EXPECTED);
assertCount('carbon eligibility cards', CARBON_ELIGIBILITY.length, CARBON_ELIGIBILITY_EXPECTED);
assertCount('carbon routes', CARBON_ROUTES.length, CARBON_ROUTES_EXPECTED);

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

/* -------------------------------------------------------------------------
   The sets' approval, read from the files rather than typed here.

   Each card file states at its head "Status: approved by the maintainer,
   <date>". The Knowledge pack tab shows that date as a chip on each set
   (item S16, slice 3, 9 Sep 2026; per set from 23 Sep 2026, ruling R2, because
   the water pack's sets were approved on two dates).
------------------------------------------------------------------------- */

function readApproval(raw: string, file: string): string {
  const match = raw.match(/\*\*Status: approved by the maintainer, (\d{1,2} \w{3} \d{4})/);
  if (!match) fail('an approval date in the status line', file);
  return match[1].trim();
}

const ELIGIBILITY_APPROVED_ON = readApproval(eligibilityRaw, ELIGIBILITY_FILE);
const FEASIBILITY_APPROVED_ON = readApproval(feasibilityRaw, FEASIBILITY_FILE);

/** "21 Aug 2026" — when the maintainer approved the cards Phoebe reads from. */
export const CARDS_APPROVED_ON =
  ELIGIBILITY_APPROVED_ON === FEASIBILITY_APPROVED_ON
    ? ELIGIBILITY_APPROVED_ON
    : `${ELIGIBILITY_APPROVED_ON} and ${FEASIBILITY_APPROVED_ON}`;

/** Each set's approval date, by the set. */
export const APPROVED_ON = {
  waterApplies: readApproval(appliesWaterRaw, WATER_APPLIES_FILE),
  waterEligibility: ELIGIBILITY_APPROVED_ON,
  waterFeasibility: FEASIBILITY_APPROVED_ON,
  waterRoutes: readApproval(routesWaterRaw, WATER_ROUTES_FILE),
  carbonApplies: readApproval(appliesCarbonRaw, CARBON_APPLIES_FILE),
  carbonEligibility: readApproval(eligibilityCarbonRaw, CARBON_ELIGIBILITY_FILE),
  carbonRoutes: readApproval(routesCarbonRaw, CARBON_ROUTES_FILE),
};

/* -------------------------------------------------------------------------
   The packs' own facts — version and source — read from the pack files.

   The version is the README's opening "**Version x.y.z.**" line, and
   check-cards holds it equal to the head of the pack's CHANGELOG (ruling
   R10, 23 Sep 2026). The source is the "Source being cited" table at the
   head of the pack's eligibility file: its Document row and its publisher
   row, so the tab's source line is the card file's words.
------------------------------------------------------------------------- */

function readVersion(readme: string, file: string): string {
  const match = readme.match(/\*\*Version (\d+\.\d+\.\d+)\b/);
  if (!match) fail('a Version line', file);
  return match[1];
}

function readSourceTable(raw: string, file: string): PackInfo['source'] {
  const document = raw.match(/^\| \*\*Document\*\* \| (.+?) \|\s*$/m)?.[1];
  const publisher = raw.match(/^\| \*\*(?:Authors \/ publisher|Publisher)\*\* \| (.+?) \|\s*$/m)?.[1];
  if (!document) fail('the Document row of the source table', file);
  if (!publisher) fail('the publisher row of the source table', file);
  return { document: flatten(document), publisher: flatten(publisher) };
}

export const WATER_PACK: PackInfo = {
  key: 'vwba-2.0',
  version: readVersion(lf(waterReadmeRawFile), WATER_README),
  source: readSourceTable(eligibilityRaw, ELIGIBILITY_FILE),
};

export const CARBON_PACK: PackInfo = {
  key: 'gs-paa-v2.0',
  version: readVersion(lf(carbonReadmeRawFile), CARBON_README),
  source: readSourceTable(eligibilityCarbonRaw, CARBON_ELIGIBILITY_FILE),
};
