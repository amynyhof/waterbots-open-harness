/**
 * Generates the TypeScript modules the relay needs from committed markdown.
 *
 * Two bundles today: Phoebe's card sets, and the shared agent primer.
 *
 * WHY THIS EXISTS. The browser gets committed markdown through Vite's `?raw`
 * import. The serverless relay cannot — it is built by Vercel's Node builder,
 * which has no such loader and does not reliably trace a runtime
 * `fs.readFileSync` on a repository file. Turning the markdown into an ordinary
 * TypeScript module means the bundler has to include it, with no deploy-time
 * guesswork about whether Phoebe's knowledge shipped with her.
 *
 * ONE SCRIPT, NOT TWO. The card-specific part of this was always data — a list
 * of files and an output path. Everything else is generic: normalise the line
 * endings, escape the text into a string literal, emit it, then compare or
 * write. A second copy of that would be a second copy of three things that have
 * to stay byte-identical or the staleness gate misbehaves: the line-ending
 * normalisation, the escaping, and the comparison. It was named
 * build-card-module.mjs until 28 Aug 2026, when the primer joined and the old
 * name stopped being true.
 *
 * THE OUTPUTS ARE COMMITTED, and `--check` fails if either has drifted from its
 * sources. Generated code in the tree is a cost; a relay that silently deploys
 * with stale cards or a stale primer is a much worse one.
 *
 *   node scripts/build-prompt-modules.mjs          # write the modules
 *   node scripts/build-prompt-modules.mjs --check  # exit 1 if either would change
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

/**
 * Each bundle is one generated module built from one or more markdown files.
 * Adding a third is a row here, not a new script.
 */
const BUNDLES = [
  {
    label: 'cards',
    target: 'api/_cards.generated.ts',
    sources: [
      { name: 'ELIGIBILITY_MD', file: 'eligibility-cards-vwba.md' },
      { name: 'FEASIBILITY_MD', file: 'feasibility-cards-vwba.md' },
    ],
    stale: 'The relay would deploy with out-of-date cards.',
  },
  {
    label: 'primer',
    target: 'api/_primer.generated.ts',
    sources: [{ name: 'AGENT_PRIMER_MD', file: 'agent-primer.md', region: 'AGENT-FACING' }],
    stale: 'The relay would deploy with an out-of-date primer, so an agent could describe a colleague in words the maintainer never approved.',
  },
];

const checkOnly = process.argv.includes('--check');

function render({ target, sources }) {
  const header = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Written by scripts/build-prompt-modules.mjs from committed markdown.
 * Edit the source, not this file, then re-run:
 *
 *   node scripts/build-prompt-modules.mjs
 *
 * The build gate fails if this has drifted from its sources, so a stale copy
 * cannot reach the relay unnoticed.
 *
 * Sources: ${sources.map((s) => (s.region ? `${s.file} (${s.region} region only)` : s.file)).join(', ')}
 */

`;

  const body = sources
    .map(({ name, file, region }) => {
      /* Normalised to LF before embedding. Git may check these files out with
         CRLF on Windows and LF on Vercel's Linux builders; without this the
         generated module differs by platform and the staleness gate fails on a
         clean tree. The content is what matters here, not the newlines. */
      let text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

      /* Some sources hand the relay only part of themselves. The primer's outer
         sections are instructions about the prompt and provenance for human
         readers; measured 28 Aug 2026, feeding those to an agent as a second
         instruction layer destabilised ordinary answers. A missing marker throws
         rather than silently embedding the whole file or nothing, because either
         would be a wrong prompt that still builds cleanly. */
      if (region) {
        const begin = `<!-- ${region}: BEGIN -->`;
        const end = `<!-- ${region}: END -->`;
        const from = text.indexOf(begin);
        const to = text.indexOf(end);
        if (from === -1 || to === -1 || to < from) {
          throw new Error(
            `${file} is missing its ${region} markers, or they are out of order. ` +
              `Expected ${begin} before ${end}.`
          );
        }
        text = text.slice(from + begin.length, to).trim() + '\n';
      }
      /* JSON.stringify gives a correctly escaped TypeScript string literal —
         backslashes, quotes, newlines and any stray control characters included. */
      return `export const ${name}: string = ${JSON.stringify(text)};\n`;
    })
    .join('\n');

  return header + body;
}

let failed = false;

for (const bundle of BUNDLES) {
  const { target, sources, stale } = bundle;

  const missingSource = sources.find(({ file }) => !existsSync(file));
  if (missingSource) {
    console.error(`MISSING SOURCE — ${missingSource.file} does not exist.`);
    failed = true;
    continue;
  }

  const output = render(bundle);

  if (checkOnly) {
    if (!existsSync(target)) {
      console.error(`MISSING — ${target} has not been generated.`);
      console.error('Run: node scripts/build-prompt-modules.mjs');
      failed = true;
      continue;
    }
    if (readFileSync(target, 'utf8') !== output) {
      console.error(`STALE — ${target} does not match its sources.`);
      console.error(stale);
      console.error('Run: node scripts/build-prompt-modules.mjs');
      failed = true;
      continue;
    }
    console.log(`${target} is current.`);
    continue;
  }

  writeFileSync(target, output);
  const kb = (output.length / 1024).toFixed(1);
  console.log(`Wrote ${target} (${kb} KB) from ${sources.length} source file(s).`);
}

process.exit(failed ? 1 : 0);
