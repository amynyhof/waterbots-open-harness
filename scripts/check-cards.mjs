/**
 * Phoebe's card sets — build check.
 *
 * The eligibility worksheet reads its rows from the committed card files
 * rather than from a hand-typed copy, so the card files are load-bearing UI
 * input as well as published documents. This script is the guard on that.
 *
 * It re-derives both card sets INDEPENDENTLY of src/lib/phoebeCards.ts rather
 * than importing it. Importing the module would only prove the module agrees
 * with itself. Deriving the same facts a second way is what makes this a
 * check — the same reasoning behind check-attribution reading the built
 * bundle instead of the source.
 *
 * Run it with the others:
 *   node scripts/check-cards.mjs
 */

import { existsSync, readFileSync } from 'node:fs';

const ELIGIBILITY = 'eligibility-cards-vwba.md';
const FEASIBILITY = 'feasibility-cards-vwba.md';

/* The manual's own counts. Appendix A gives six criteria, Appendix B ten
   considerations. These are the numbers the committed cards were graded
   against, so a change here needs a maintainer's word, not a quick edit. */
const EXPECT_CRITERIA = 6;
const EXPECT_CONSIDERATIONS = 10;

/* Every card carries the publisher's canonical link, per the maintainer's
   ruling of 21 Aug 2026 that each card must stand alone. */
const CANONICAL = 'https://doi.org/10.46830/wrigb.23.00112';

/* The four-part citation shape requires the version inside each citation. */
const VERSION = 'Version 1, September 2025';

const problems = [];
const note = (m) => problems.push(m);

function cards(file) {
  const text = readFileSync(file, 'utf8');
  return text
    .split(/^## Card /m)
    .slice(1)
    .map((part) => {
      const nl = part.indexOf('\n');
      return { heading: part.slice(0, nl).trim(), body: part.slice(nl + 1), file };
    });
}

/** Reads a `**Label.** …` paragraph without reusing the app's helper. */
function section(body, label) {
  const start = body.indexOf(`**${label}`);
  if (start < 0) return null;
  const afterLabel = body.indexOf('**', start + 2 + label.length);
  if (afterLabel < 0) return null;
  const from = afterLabel + 2;
  const end = body.indexOf('\n\n', from);
  return body.slice(from, end < 0 ? undefined : end).replace(/\s+/g, ' ').trim();
}

function bulletsAfter(body, label) {
  const start = body.indexOf(`**${label}`);
  if (start < 0) return null;
  const rest = body.slice(start);
  const stop = rest.search(/\n---|\n## /);
  const block = stop < 0 ? rest : rest.slice(0, stop);
  return block.split(/^- /m).slice(1).map((b) => b.replace(/\s+/g, ' ').trim());
}

function checkCitation(card, label) {
  const source = section(card.body, 'Source.');
  const link = section(card.body, 'Canonical link.');

  if (!source) return note(`${label}: no Source line`);
  if (!link) return note(`${label}: no Canonical link line`);
  if (!source.includes(VERSION)) note(`${label}: citation is missing the document version`);
  if (!/\bp{1,2}\.\s*\d+/.test(source)) note(`${label}: citation names no page`);
  if (!/Appendix [AB]/.test(source)) note(`${label}: citation names no appendix`);
  if (!link.includes(CANONICAL)) note(`${label}: canonical link is not the publisher's DOI`);
}

/* ---- Eligibility: the hard gate ---------------------------------------- */

const criteria = cards(ELIGIBILITY);
if (criteria.length !== EXPECT_CRITERIA) {
  note(`${ELIGIBILITY}: expected ${EXPECT_CRITERIA} criteria, found ${criteria.length}`);
}
const seenCriteria = new Set();
for (const card of criteria) {
  const m = card.heading.match(/^(\d+)\s+—\s+(.+)$/);
  if (!m) {
    note(`${ELIGIBILITY}: heading does not parse — "${card.heading}"`);
    continue;
  }
  const label = `criterion ${m[1]}`;
  seenCriteria.add(Number(m[1]));
  if (!section(card.body, 'The rule in plain words.')) note(`${label}: no plain-words rule`);
  const evidence = bulletsAfter(card.body, 'What a project owner would be asked to show.');
  if (!evidence || evidence.length === 0) note(`${label}: no evidence bullets`);
  checkCitation(card, label);
}
for (let i = 1; i <= EXPECT_CRITERIA; i++) {
  if (!seenCriteria.has(i)) note(`${ELIGIBILITY}: criterion ${i} is missing`);
}

/* ---- Feasibility: guidance, never a gate -------------------------------- */

const considerations = cards(FEASIBILITY);
if (considerations.length !== EXPECT_CONSIDERATIONS) {
  note(
    `${FEASIBILITY}: expected ${EXPECT_CONSIDERATIONS} considerations, found ${considerations.length}`
  );
}
const seenConsiderations = new Set();
for (const card of considerations) {
  const m = card.heading.match(/^B-(\d+)\s+—\s+(.+)$/);
  if (!m) {
    note(`${FEASIBILITY}: heading does not parse — "${card.heading}"`);
    continue;
  }
  const label = `consideration ${m[1]}`;
  seenConsiderations.add(Number(m[1]));
  if (!section(card.body, 'The consideration in plain words.')) note(`${label}: no plain words`);
  if (!section(card.body, 'Why it matters.')) note(`${label}: no "why it matters"`);
  const weigh = bulletsAfter(card.body, 'How to weigh it');
  if (!weigh || weigh.length === 0) note(`${label}: no weighing bullets`);
  /* The never-a-gate framing is load-bearing, not decoration. If this label
     is ever softened away, the worksheet would start reading like a verdict. */
  if (!card.body.includes('guidance, not a gate')) {
    note(`${label}: the "guidance, not a gate" framing is missing`);
  }
  checkCitation(card, label);
}
for (let i = 1; i <= EXPECT_CONSIDERATIONS; i++) {
  if (!seenConsiderations.has(i)) note(`${FEASIBILITY}: consideration ${i} is missing`);
}

/* ---- The relay's copy of the cards -------------------------------------- */

/* api/_cards.generated.ts carries the card text into the serverless function.
   If it has drifted, the deployed relay answers from stale cards while the
   worksheet shows the current ones — a disagreement no visitor could see. */
const generated = 'api/_cards.generated.ts';
if (!existsSync(generated)) {
  note(`${generated} has not been generated — run: node scripts/build-prompt-modules.mjs`);
} else {
  const current = readFileSync(generated, 'utf8');
  for (const [name, file] of [
    ['ELIGIBILITY_MD', ELIGIBILITY],
    ['FEASIBILITY_MD', FEASIBILITY],
  ]) {
    /* Same LF normalisation the generator applies — see its note on why. */
    const source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const expected = `export const ${name}: string = ${JSON.stringify(source)};`;
    if (!current.includes(expected)) {
      note(`${generated} is stale for ${file} — run: node scripts/build-prompt-modules.mjs`);
    }
  }
}

/* ---- Report ------------------------------------------------------------- */

console.log("Phoebe's cards — build check\n");
console.log(`  ${ELIGIBILITY}`);
console.log(`    criteria            ${criteria.length} (expected ${EXPECT_CRITERIA})`);
console.log(`  ${FEASIBILITY}`);
console.log(`    considerations      ${considerations.length} (expected ${EXPECT_CONSIDERATIONS})`);
console.log(`    likelihood of success  ${[...seenConsiderations].filter((n) => n <= 5).length}`);
console.log(`    added impact or value  ${[...seenConsiderations].filter((n) => n > 5).length}`);
console.log(`\n  every card carries: plain words, a page-level citation, and the canonical link`);

if (problems.length) {
  console.log(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.log(`  - ${p}`);
  console.log(
    '\nThe worksheet reads these files directly, so a formatting change here\n' +
      'changes the product. Fix the card, or update src/lib/phoebeCards.ts and\n' +
      'this script together.'
  );
  process.exit(1);
}

console.log('\nPASSED — both card sets parse, and every card is complete.');
