/**
 * Generates api/_cards.generated.ts from the two committed card files.
 *
 * WHY THIS EXISTS. The browser gets the card text through Vite's `?raw`
 * import. The serverless relay cannot — it is built by Vercel's Node builder,
 * which has no such loader and does not reliably trace a runtime
 * `fs.readFileSync` on a repository file. Turning the cards into an ordinary
 * TypeScript module means the bundler has to include them, with no deploy-time
 * guesswork about whether Phoebe's knowledge shipped with her.
 *
 * THE OUTPUT IS COMMITTED, and scripts/check-cards.mjs fails if it has drifted
 * from the source files. Generated code in the tree is a cost; a relay that
 * silently deploys with stale or missing cards is a much worse one.
 *
 *   node scripts/build-card-module.mjs          # write the module
 *   node scripts/build-card-module.mjs --check  # exit 1 if it would change
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SOURCES = [
  { name: 'ELIGIBILITY_MD', file: 'eligibility-cards-vwba.md' },
  { name: 'FEASIBILITY_MD', file: 'feasibility-cards-vwba.md' },
];

const TARGET = 'api/_cards.generated.ts';
const checkOnly = process.argv.includes('--check');

const header = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Written by scripts/build-card-module.mjs from the committed card files.
 * Edit the cards, not this file, then re-run:
 *
 *   node scripts/build-card-module.mjs
 *
 * scripts/check-cards.mjs fails the build gate if this has drifted from the
 * sources, so a stale copy cannot reach the relay unnoticed.
 */

`;

const body = SOURCES.map(({ name, file }) => {
  /* Normalised to LF before embedding. Git may check these files out with
     CRLF on Windows and LF on Vercel's Linux builders; without this the
     generated module differs by platform and the staleness gate fails on a
     clean tree. The cards' content is what matters here, not their newlines. */
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  /* JSON.stringify gives a correctly escaped TypeScript string literal —
     backslashes, quotes, newlines and any stray control characters included. */
  return `export const ${name}: string = ${JSON.stringify(text)};\n`;
}).join('\n');

const output = header + body;

if (checkOnly) {
  if (!existsSync(TARGET)) {
    console.error(`MISSING — ${TARGET} has not been generated.`);
    console.error('Run: node scripts/build-card-module.mjs');
    process.exit(1);
  }
  if (readFileSync(TARGET, 'utf8') !== output) {
    console.error(`STALE — ${TARGET} does not match the card files.`);
    console.error('The relay would deploy with out-of-date cards.');
    console.error('Run: node scripts/build-card-module.mjs');
    process.exit(1);
  }
  console.log(`${TARGET} is current.`);
  process.exit(0);
}

writeFileSync(TARGET, output);
const kb = (output.length / 1024).toFixed(1);
console.log(`Wrote ${TARGET} (${kb} KB) from ${SOURCES.length} card files.`);
