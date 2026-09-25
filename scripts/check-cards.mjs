/**
 * Phoebe's card sets — build check.
 *
 * The eligibility worksheet and the Knowledge pack tab read their rows from
 * the committed card files rather than from a hand-typed copy, so the card
 * files are load-bearing UI input as well as published documents. This
 * script is the guard on that.
 *
 * It re-derives every card set INDEPENDENTLY of src/lib/phoebeCards.ts rather
 * than importing it. Importing the module would only prove the module agrees
 * with itself. Deriving the same facts a second way is what makes this a
 * check — the same reasoning behind check-attribution reading the built
 * bundle instead of the source.
 *
 * SEVEN FILES FROM 23 SEP 2026 (build-order step 1 under "V1 — the done
 * line"): the water pack's applies, eligibility, feasibility and routes sets
 * and the carbon pack's applies, eligibility and routes sets, plus each pack's
 * README and CHANGELOG for its version. Every set is held to its graded
 * count, its ids in order, its plain-words paragraphs, a Source line with a
 * version and a page, and canonical links that are the publisher's pages the
 * pack already names; an eligibility card is held to a "Can it be fixed?"
 * value and a Phase word from their closed lists; a feasibility card to its
 * "guidance, not a gate" framing; a pack's README version to the head of its
 * CHANGELOG (ruling R10). The relay's generated copy of the two water files
 * is still checked for staleness; nothing else reaches the relay.
 *
 * Run it with the others:
 *   node scripts/check-cards.mjs
 */

import { existsSync, readFileSync } from 'node:fs';

const SEAT = 'knowledge-packs/phoebe-eligibility';

const range = (prefix, from, to) => Array.from({ length: to - from + 1 }, (_, i) => `${prefix}${from + i}`);

/* The values the two labelled lines may take — item A18 and the phase-tags
   ruling of 23 Sep 2026. A new word is a maintainer's ruling, not an edit. */
const FIXABLE = ['yes', 'no', 'depends'];
const PHASES = ['Eligibility', 'Partners', 'Quantify', 'Plan', 'Monitor', 'Communicate', 'To remain eligible'];

const EVIDENCE = 'What a project owner would be asked to show.';

/**
 * Every set, in the order the packs hold them. The counts are the numbers the
 * committed cards were graded against, so a change here needs a maintainer's
 * word, not a quick edit.
 */
const PACKS = [
  {
    key: 'vwba-2.0',
    dir: `${SEAT}/vwba-2.0`,
    sets: [
      {
        name: 'water applies',
        file: 'cards/applies-cards-vwba.md',
        word: 'Card',
        ids: ['W1', 'W2'],
        text: ['The test in plain words.', 'Applies to.'],
        head: ['If the answer is'],
        bullets: EVIDENCE,
      },
      {
        name: 'water eligibility',
        file: 'cards/eligibility-cards-vwba.md',
        word: 'Card',
        ids: range('', 1, 6),
        text: ['The rule in plain words.'],
        bullets: EVIDENCE,
        fixable: true,
        phase: true,
        appendix: /Appendix A/,
      },
      {
        name: 'water feasibility',
        file: 'cards/feasibility-cards-vwba.md',
        word: 'Card',
        ids: range('B-', 1, 10),
        text: ['The consideration in plain words.', 'Why it matters.'],
        bullets: 'How to weigh it',
        /* The never-a-gate framing is load-bearing, not decoration. If this
           label is ever softened away, the worksheet would start reading like
           a verdict. */
        mustInclude: 'guidance, not a gate',
        appendix: /Appendix B/,
      },
      {
        name: 'water routes',
        file: 'cards/routes-cards-vwba.md',
        word: 'Route',
        ids: range('R-', 1, 9),
        text: ['The gap.', 'The route in plain words.', 'What it does not promise.'],
      },
    ],
  },
  {
    key: 'gs-paa-v2.0',
    dir: `${SEAT}/gs-paa-v2.0`,
    sets: [
      {
        name: 'carbon applies',
        file: 'cards/applies-cards-gs.md',
        word: 'Card',
        ids: range('T', 1, 4),
        text: ['The test in plain words.', 'Applies to.'],
        head: ['If the answer is'],
        bullets: EVIDENCE,
      },
      {
        name: 'carbon eligibility',
        file: 'cards/eligibility-cards-gs.md',
        word: 'Card',
        ids: [...range('M', 1, 17), ...range('P', 1, 2), ...range('G', 1, 13)],
        text: ['The rule in plain words.', 'Applies to.', 'External standard.'],
        bullets: EVIDENCE,
        fixable: true,
        phase: true,
      },
      {
        name: 'carbon routes',
        file: 'cards/routes-cards-gs.md',
        word: 'Route',
        ids: range('R-', 1, 19),
        text: ['The gap.', 'The route in plain words.', 'What it does not promise.'],
      },
    ],
  },
];

const problems = [];
const note = (m) => problems.push(m);
const read = (file) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

function cards(text, word) {
  return text
    .split(new RegExp(`^## ${word} `, 'm'))
    .slice(1)
    .map((part) => {
      const nl = part.indexOf('\n');
      return { heading: part.slice(0, nl).trim(), body: part.slice(nl + 1) };
    });
}

/** Reads a `**Label…** …` paragraph without reusing the app's helper. */
function section(body, label) {
  const start = body.indexOf(`**${label}`);
  if (start < 0) return null;
  const afterLabel = body.indexOf('**', start + 2 + label.length);
  if (afterLabel < 0) return null;
  const from = afterLabel + 2;
  const end = body.indexOf('\n\n', from);
  return body.slice(from, end < 0 ? undefined : end).replace(/\s+/g, ' ').trim();
}

/** The bold head after a label — "Yes." on "**Can it be fixed? Yes.**". */
function head(body, label) {
  const start = body.indexOf(`**${label}`);
  if (start < 0) return null;
  const afterLabel = body.indexOf('**', start + 2 + label.length);
  if (afterLabel < 0) return null;
  return body.slice(start + 2 + label.length, afterLabel).replace(/\s+/g, ' ').trim();
}

function bulletsAfter(body, label) {
  const start = body.indexOf(`**${label}`);
  if (start < 0) return null;
  const rest = body.slice(start);
  /* A list ends at a rule, the next card, or a bold paragraph after the
     first bullet; a bold paragraph before the first bullet is passed over. */
  const stop = rest.search(/\n---|\n## /);
  const block = stop < 0 ? rest : rest.slice(0, stop);
  const firstBullet = block.search(/^- /m);
  if (firstBullet < 0) return [];
  const trailing = block.slice(firstBullet).search(/\n\n\*\*/);
  const list = trailing < 0 ? block.slice(firstBullet) : block.slice(firstBullet, firstBullet + trailing);
  return list.split(/^- /m).slice(1).map((b) => b.replace(/\s+/g, ' ').trim());
}

const links = (text) => (text.match(/https?:\/\/[^\s<>)|\]]+/g) ?? []).map((h) => h.replace(/[.,;]+$/, ''));

/* ---- Every pack, every set ---------------------------------------------- */

const summary = [];

for (const pack of PACKS) {
  const readme = read(`${pack.dir}/README.md`);
  const changelog = read(`${pack.dir}/CHANGELOG.md`);

  /* The version, once, on the README; the CHANGELOG's head must agree. */
  const version = readme.match(/\*\*Version (\d+\.\d+\.\d+)\b/)?.[1];
  const changelogHead = changelog.match(/^## (\d+\.\d+\.\d+) —/m)?.[1];
  if (!version) note(`${pack.dir}/README.md: no "**Version x.y.z" line`);
  if (!changelogHead) note(`${pack.dir}/CHANGELOG.md: no "## x.y.z —" heading`);
  if (version && changelogHead && version !== changelogHead) {
    note(`${pack.dir}: README says version ${version} but the CHANGELOG's head is ${changelogHead}`);
  }

  /* The publisher's pages this pack may cite: those on its README, and those
     in a card file's own head, before its first card (the routes file names
     the one published project it cites there). */
  const readmeLinks = new Set(links(readme));

  for (const set of pack.sets) {
    const file = `${pack.dir}/${set.file}`;
    const text = read(file);
    const firstCard = text.search(new RegExp(`^## ${set.word} `, 'm'));
    const headText = firstCard < 0 ? text : text.slice(0, firstCard);
    const allowed = new Set([...readmeLinks, ...links(headText)]);

    if (!/\*\*Status: approved by the maintainer, \d{1,2} \w{3} \d{4}/.test(headText)) {
      note(`${file}: no dated "Status: approved by the maintainer" line at its head`);
    }

    const found = cards(text, set.word);
    if (found.length !== set.ids.length) {
      note(`${file}: expected ${set.ids.length} cards, found ${found.length}`);
    }

    found.forEach((card, i) => {
      const m = card.heading.match(/^([A-Z]?-?\d+)\s+—\s+(.+)$/);
      if (!m) {
        note(`${file}: heading does not parse — "${card.heading}"`);
        return;
      }
      const id = m[1];
      const label = `${set.name} ${id}`;
      if (set.ids[i] !== id) note(`${file}: card ${i + 1} is ${id}, expected ${set.ids[i]}`);

      for (const t of set.text) {
        if (!section(card.body, t)) note(`${label}: no "${t}" paragraph`);
      }
      for (const h of set.head ?? []) {
        if (!head(card.body, h)) note(`${label}: no "${h} …" paragraph`);
      }
      if (set.bullets) {
        const items = bulletsAfter(card.body, set.bullets);
        if (!items || items.length === 0) note(`${label}: no bullets under "${set.bullets}"`);
      }
      if (set.mustInclude && !card.body.includes(set.mustInclude)) {
        note(`${label}: the "${set.mustInclude}" framing is missing`);
      }
      if (set.fixable) {
        const value = head(card.body, 'Can it be fixed?')?.match(/^(yes|no|depends)\b/i)?.[1]?.toLowerCase();
        if (!value || !FIXABLE.includes(value)) note(`${label}: "Can it be fixed?" is not yes, no or depends`);
      }
      if (set.phase) {
        const line = section(card.body, 'Phase.') ?? '';
        const word = line.split('.')[0].trim();
        if (!PHASES.includes(word)) note(`${label}: Phase "${word}" is not one of ${PHASES.join(', ')}`);
      }

      /* The four-part citation: a version in parentheses, a page, and the
         publisher's own page as the link — every link, where a card names
         more than one. */
      const source = section(card.body, 'Source.');
      const link = section(card.body, 'Canonical link.');
      if (!source) note(`${label}: no Source line`);
      else {
        if (!/\((?:Version|v\d)[^)]*\)/.test(source)) note(`${label}: citation is missing the document version`);
        if (!/\bp{1,2}\.\s*\d+/.test(source)) note(`${label}: citation names no page`);
        if (set.appendix && !set.appendix.test(source)) note(`${label}: citation names no appendix`);
      }
      if (!link) note(`${label}: no Canonical link line`);
      else {
        const hrefs = links(link);
        if (hrefs.length === 0) note(`${label}: canonical link paragraph carries no link`);
        for (const h of hrefs) {
          if (!allowed.has(h)) note(`${label}: ${h} is not a publisher's page the pack names`);
        }
      }
    });

    summary.push({ file, count: found.length, expected: set.ids.length });
  }
}

/* ---- The relay's copy of the cards -------------------------------------- */

/* api/_cards.generated.ts carries the water pack's four sets into the
   serverless function, one constant each from 25 Sep 2026, because her prompt
   is staged and the relay chooses which sets a turn is given. If a copy has
   drifted, the deployed relay answers from stale cards while the worksheet
   shows the current ones — a disagreement no visitor could see. The carbon
   pack's three sets joined on 25 Sep 2026, pull request B. */
const generated = 'api/_cards.generated.ts';
if (!existsSync(generated)) {
  note(`${generated} has not been generated — run: node scripts/build-prompt-modules.mjs`);
} else {
  const current = readFileSync(generated, 'utf8');
  for (const [name, file] of [
    ['WATER_APPLIES_MD', `${SEAT}/vwba-2.0/cards/applies-cards-vwba.md`],
    ['WATER_ELIGIBILITY_MD', `${SEAT}/vwba-2.0/cards/eligibility-cards-vwba.md`],
    ['WATER_ROUTES_MD', `${SEAT}/vwba-2.0/cards/routes-cards-vwba.md`],
    ['WATER_FEASIBILITY_MD', `${SEAT}/vwba-2.0/cards/feasibility-cards-vwba.md`],
    ['CARBON_APPLIES_MD', `${SEAT}/gs-paa-v2.0/cards/applies-cards-gs.md`],
    ['CARBON_ELIGIBILITY_MD', `${SEAT}/gs-paa-v2.0/cards/eligibility-cards-gs.md`],
    ['CARBON_ROUTES_MD', `${SEAT}/gs-paa-v2.0/cards/routes-cards-gs.md`],
  ]) {
    /* Same LF normalisation the generator applies — see its note on why. */
    const expected = `export const ${name}: string = ${JSON.stringify(read(file))};`;
    if (!current.includes(expected)) {
      note(`${generated} is stale for ${file} — run: node scripts/build-prompt-modules.mjs`);
    }
  }
}

/* ---- Report ------------------------------------------------------------- */

console.log("Phoebe's cards — build check\n");
for (const row of summary) {
  console.log(`  ${row.file}`);
  console.log(`    cards               ${row.count} (expected ${row.expected})`);
}
console.log(
  '\n  every card carries: plain words, a page-level citation, and a canonical link the pack names;\n' +
    '  every eligibility card a "Can it be fixed?" value and a Phase word from the closed lists;\n' +
    "  each pack's README version equals its CHANGELOG head"
);

if (problems.length) {
  console.log(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.log(`  - ${p}`);
  console.log(
    '\nThe worksheet and the Knowledge pack tab read these files directly, so a\n' +
      'formatting change here changes the product. Fix the card, or update\n' +
      'src/lib/phoebeCards.ts and this script together.'
  );
  process.exit(1);
}

console.log('\nPASSED — every card set parses, and every card is complete.');
