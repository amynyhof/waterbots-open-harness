/**
 * Generates the TypeScript modules the relay needs from committed markdown.
 *
 * Two bundles today: Phoebe's card sets, and the shared agent primer. Five by
 * 23 Sep 2026; the project-type list joined on 24 Sep 2026 as the sixth, and
 * it is the one bundle that is parsed rather than embedded whole.
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

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/* ---------------------------------------------------------------------------
   The pack list the primer renders.

   THE PRIMER'S PACK LIST IS NEVER HAND-TYPED. Maintainer's ruling, 1 Sep 2026.
   A list of packs typed into a document an agent inherits would go stale the
   day a pack was added or renamed, and an agent would then either claim a pack
   that is gone or miss one that is here — the exact drift the primer exists to
   prevent.

   So the primer carries a marker and this reads the registry itself. The packs
   are TypeScript in src/, whose imports name no file extension because a
   bundler resolves them, so they are compiled to CommonJS in a temporary
   folder and read from there — the same way the pack's own check does it.

   Only packs that can actually answer are listed. A planned pack is named on
   the surface's tab strip, where it is visibly marked planned; an agent that
   named it in conversation would be claiming a tool that does not exist.
--------------------------------------------------------------------------- */

const PACKS_MARKER = '{{FITTED_PACKS}}';

const COUNT_WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];

function fittedPackSentence() {
  const out = mkdtempSync(join(tmpdir(), 'wb-packs-'));
  try {
    const compile = spawnSync(
      process.execPath,
      [
        join('node_modules', 'typescript', 'bin', 'tsc'),
        join('src', 'lib', 'methodPacks.ts'),
        '--outDir', out,
        '--module', 'commonjs',
        '--moduleResolution', 'node',
        '--target', 'es2022',
        '--skipLibCheck',
        '--esModuleInterop',
      ],
      { encoding: 'utf8' }
    );
    if (compile.status !== 0) {
      throw new Error(
        'The method pack registry did not compile, so the primer’s pack list ' +
          'could not be read from it.\n' +
          (compile.stdout || compile.stderr)
      );
    }
    writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}');
    const { CORE_CALCULATORS = [] } = createRequire(import.meta.url)(join(out, 'methodPacks.js'));

    /* The open core's calculators: every one on Quantify from 22 Nov 2026, when
       Violet's D-3 took the place of this site's own water pack (#189). */
    const live = [...CORE_CALCULATORS];
    if (live.length === 0) return 'No pack is fitted to the step yet.';

    const missing = live.find((p) => !p.primerLine);
    if (missing) {
      throw new Error(
        `The pack "${missing.name}" has no primerLine, so the primer cannot describe it. ` +
          'Every live pack owes one clause for the roster.'
      );
    }

    const word = COUNT_WORD[live.length] ?? String(live.length);
    const noun = live.length === 1 ? 'pack' : 'packs';
    const listed = live.map((p) => `**${p.name}** — ${p.primerLine}`).join('; ');
    return `Today that is ${word} ${noun}: ${listed}.`;
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

/**
 * Each bundle is one generated module built from one or more markdown files.
 * Adding a third is a row here, not a new script.
 */
const BUNDLES = [
  {
    label: 'agent-rules',
    target: 'api/_agentRules.generated.ts',
    /* THE FOUNDATIONAL AGENT RULES, in force from 22 Nov 2026. AGENT_RULES.md is
       an exact copy of the maintainer's master, so it carries no region markers:
       rules 1 to 21 are taken from their first heading up to the "Notes for
       builders" heading, which is for builders and never reaches an agent. Every
       agent's prompt opens its rules with this text.
       FROM CORE, 22 NOV 2026 (calvin-violet-v0.5.1, the maintainer's word): the rules come from
       @waterbots/core's agent-rules.md, rules 1 to 21 word for word, as every agent in the open core reads
       them. AGENT_RULES.md stays the exact master copy; scripts/check-calvin-package.mjs holds core's rules
       to its rules part, word for word. */
    sources: [{ name: 'AGENT_RULES_MD', file: 'node_modules/@waterbots/core/dist/agent-rules.md', between: ['## How an agent talks', null] }],
    stale: 'An agent would deploy following agent rules the maintainer has since changed.',
  },
  {
    label: 'calvin',
    target: 'api/_calvinPrompt.generated.ts',
    /* CALVIN'S OWN INSTRUCTIONS AND NOTES, as his package ships them, whole (calvin-v0.7.0, 25 Nov 2026). This site
       writes none of its own for him. */
    sources: [
      { name: 'CALVIN_PROMPT_MD', file: 'node_modules/@waterbots/calvin/dist/prompt.md' },
      { name: 'CALVIN_KNOWLEDGE_MD', file: 'node_modules/@waterbots/calvin/dist/knowledge.md' },
    ],
    stale: 'Calvin would deploy on instructions his package no longer ships.',
  },
  {
    label: 'bridget',
    target: 'api/_bridgetPrompt.generated.ts',
    /* BRIDGET'S OWN INSTRUCTIONS, as her package ships them, whole (bridget-v0.1.0, 26 Nov 2026). Her package builds them for
       this site's place (`bridgetInstructions`); this site writes none of its own for her. */
    sources: [{ name: 'BRIDGET_PROMPT_MD', file: 'node_modules/@waterbots/bridget/dist/prompt.md' }],
    stale: 'Bridget would deploy on instructions her package no longer ships.',
  },
  {
    label: 'violet',
    target: 'api/_violetPrompt.generated.ts',
    /* VIOLET'S, the same (violet-v0.7.0). */
    sources: [
      { name: 'VIOLET_PROMPT_MD', file: 'node_modules/@waterbots/violet/dist/prompt.md' },
      { name: 'VIOLET_KNOWLEDGE_MD', file: 'node_modules/@waterbots/violet/dist/knowledge.md' },
    ],
    stale: 'Violet would deploy on instructions her package no longer ships.',
  },
  {
    label: 'primer',
    target: 'api/_primer.generated.ts',
    /* The primer moved into the shared pack on 17 Sep 2026; it was at the
       repository root before that day. */
    sources: [{ name: 'AGENT_PRIMER_MD', file: 'knowledge-packs/product-shared/agent-primer.md', region: 'AGENT-FACING' }],
    stale: 'The relay would deploy with an out-of-date primer, so an agent could describe a colleague in words the maintainer never approved.',
  },
  {
    label: 'status-sheet',
    target: 'api/_statusSheet.generated.ts',
    /* The one build status sheet (agent rule 16), in force 22 Nov 2026: an exact
       copy of the master in the handoff folder, read whole by every agent. A
       build update comes from its "New lately" part. It replaced Wellington's
       own build-update card the same day. */
    sources: [{ name: 'BUILD_STATUS_SHEET_MD', file: 'knowledge-packs/product-shared/BUILD_STATUS_SHEET.md' }],
    stale: 'An agent would deploy telling visitors what is live and coming from a status sheet the maintainer has since changed.',
  },
  {
    label: 'plain-words',
    target: 'api/_plainWords.generated.ts',
    /* The shared plain-words list and the before-and-after pairs — the
       maintainer's word of 14 Nov 2026 on #173. Both agents read both; only the
       marked regions embed. */
    sources: [
      { name: 'PLAIN_WORDS_MD', file: 'knowledge-packs/product-shared/plain-words.md', region: 'AGENT-FACING' },
      { name: 'BEFORE_AFTER_MD', file: 'knowledge-packs/product-shared/before-and-after.md', region: 'AGENT-FACING' },
    ],
    stale: 'An agent would deploy translating method terms with a list the maintainer has since changed.',
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
 * Sources: ${sources.map((s) => (s.region ? `${s.file} (${s.region} region only)` : s.between ? `${s.file} (from "${s.between[0]}" ${s.between[1] === null ? "to the end" : `up to "${s.between[1]}"`})` : s.file)).join(', ')}
 */

`;

  const body = sources
    .map(({ name, file, region, between, render }) => {
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

      /* A source that is an exact copy of a master cannot carry markers, so it
         names the heading it starts at and the heading it stops before. A
         missing heading throws, for the same reason a missing marker does. */
      if (between) {
        /* A stop of null runs to the end: core's agent-rules.md ships rules 1 to 21 and nothing after them. */
        const [first, stop] = between;
        const from = text.indexOf(first);
        const to = stop === null ? text.length : text.indexOf(stop);
        if (from === -1 || to === -1 || to < from) {
          throw new Error(`${file} is missing "${first}" or "${stop}", or they are out of order.`);
        }
        text = text.slice(from, to).trim() + '\n';
      }

      /* The pack list comes from the registry, never from typed prose. A
         marker left unreplaced would ship a literal {{FITTED_PACKS}} to an
         agent, so this throws rather than embedding it. */
      if (text.includes(PACKS_MARKER)) {
        text = text.split(PACKS_MARKER).join(fittedPackSentence());
      }
      if (text.includes('{{')) {
        throw new Error(`${file} still carries an unreplaced marker: ${text.match(/\{\{[^}]*\}\}/)}`);
      }
      /* A parsed source renders its own module body. */
      if (render) return render(text);
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
