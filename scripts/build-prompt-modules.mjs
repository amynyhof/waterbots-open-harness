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

/* ---------------------------------------------------------------------------
   The project types — item A16, built 24 Sep 2026.

   ONE FILE, ONE PARSER, TWO READERS. `product-shared/project-types.md` is
   the cited list Wellington matches a visitor's project to: twenty VWBA
   activity types, four Gold Standard technology classes, and "none of these".
   The relay needs it twice — as the short list in his prompt, and as the
   closed lists his logged type, class and stage are checked against — and
   the browser needs it once, to show the standard's name and its plain
   sentence on the rail. Three readers parsing one markdown table would be
   three parsers that can drift, so this script parses it once and writes
   two modules, one under api/ and one under src/lib/, both committed and
   both under the staleness gate.

   THE SHORT FORM, the maintainer's ruling of 24 Sep 2026: one line per type
   — the id, the standard's own name, the plain sentence — and no per-row
   page cites, because he never writes citation text. The cites stay on the
   file, for people and for Phoebe's applies cards. A page reference inside
   a plain sentence is dropped from the short form for the same reason.
--------------------------------------------------------------------------- */

const TYPE_ROW = /^\| (C-\d{1,2}|HWT|IWT|CWT|CWS|NONE) \| ([^|]+?) \| ([^|]+?) \|$/;

function parseProjectTypes(text) {
  const types = [];
  for (const line of text.split('\n')) {
    const m = line.match(TYPE_ROW);
    if (!m) continue;
    const [, id, name, plainRaw] = m;
    const axis = id === 'NONE' ? 'none' : id.startsWith('C-') ? 'water' : 'carbon';
    /* Cites inside the sentence — "(Table 2, p. 6; Table 3, p. 9)",
       "(Appendix C, pp. 37–39; the note itself on p. 39)" — come out of the
       short form. Any other bracket stays. */
    const plain = plainRaw
      .replace(/\s*\((?:Table|Appendix|§)[^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    types.push({ id, name: name.trim(), plain, axis });
  }
  const water = types.filter((t) => t.axis === 'water').length;
  const carbon = types.filter((t) => t.axis === 'carbon').length;
  const none = types.filter((t) => t.axis === 'none').length;
  if (water !== 20 || carbon !== 4 || none !== 1) {
    throw new Error(
      `project-types.md parsed to ${water} water types, ${carbon} carbon classes and ${none} "none" rows; expected 20, 4 and 1. The table's shape has changed, and both generated modules would be wrong.`
    );
  }
  const ids = new Set(types.map((t) => t.id));
  if (ids.size !== types.length) throw new Error('project-types.md carries a duplicate id.');
  return types;
}

/** The short list as Wellington reads it. */
function projectTypesShortForm(types) {
  const line = (t) => `- ${t.id} — ${t.name}: ${t.plain}`;
  return [
    '## Water stewardship activity types — the VWBA guidebook',
    '',
    ...types.filter((t) => t.axis === 'water').map(line),
    '',
    '## Safe-water technology classes — the Gold Standard methodology, asked only for a drinking-water project (C-19)',
    '',
    ...types.filter((t) => t.axis === 'carbon').map(line),
    '',
    '## None of these',
    '',
    ...types.filter((t) => t.axis === 'none').map(line),
    '',
  ].join('\n');
}

/** The stages Wellington asks, from the guide-not-gate addendum §2, 23 Sep 2026. */
const PROJECT_STAGES = [
  { id: 'paper', words: 'on paper', plain: 'still a plan — nothing has been spent on building it yet' },
  { id: 'building', words: 'being built', plain: 'work has started and it is not running yet' },
  { id: 'running', words: 'already running', plain: 'it is in use today' },
];

function renderProjectTypes(text) {
  const types = parseProjectTypes(text);
  const short = projectTypesShortForm(types);
  const typeIds = types.filter((t) => t.axis !== 'carbon').map((t) => t.id);
  const classIds = types.filter((t) => t.axis === 'carbon').map((t) => t.id);
  return [
    `/** The list as Wellington reads it: id, the standard's name, one plain sentence; no cites. */`,
    `export const PROJECT_TYPES_MD: string = ${JSON.stringify(short)};`,
    '',
    `export interface ProjectType { id: string; name: string; plain: string; axis: 'water' | 'carbon' | 'none' }`,
    '',
    `/** Every row of the file, in file order. */`,
    `export const PROJECT_TYPES: readonly ProjectType[] = ${JSON.stringify(types, null, 2)};`,
    '',
    `/** What \`type\` may hold: the twenty water-axis ids and NONE. A class is never a type. */`,
    `export const PROJECT_TYPE_IDS = ${JSON.stringify(typeIds)} as const;`,
    `export type ProjectTypeId = (typeof PROJECT_TYPE_IDS)[number];`,
    '',
    `/** What \`gsClass\` may hold, and only beside a drinking-water project, C-19. */`,
    `export const GS_CLASS_IDS = ${JSON.stringify(classIds)} as const;`,
    `export type GsClassId = (typeof GS_CLASS_IDS)[number];`,
    '',
    `/** The one type that also takes a class. */`,
    `export const DRINKING_WATER_TYPE: ProjectTypeId = 'C-19';`,
    '',
    `/** The stage of a project, as Wellington asks it and logs it on the visitor's yes. */`,
    `export const PROJECT_STAGES = ${JSON.stringify(PROJECT_STAGES, null, 2)} as const;`,
    `export const PROJECT_STAGE_IDS = ${JSON.stringify(PROJECT_STAGES.map((s) => s.id))} as const;`,
    `export type ProjectStageId = (typeof PROJECT_STAGE_IDS)[number];`,
    '',
    `export function projectType(id: string): ProjectType | undefined {`,
    `  return PROJECT_TYPES.find((t) => t.id === id);`,
    `}`,
    '',
    `/**`,
    ` * The retired "what kind" word, derived from the type — the save-door patch`,
    ` * of 25 Sep 2026.`,
    ` *`,
    ` * "What kind" was Wellington's question until 24 Sep 2026, when the project`,
    ` * type replaced it (item A16). PRODUCTION'S RECEIVER STILL READS`,
    ` * \`record.kind\`, and a seal without it arrived there as an empty record —`,
    ` * the maintainer's live test of 25 Sep 2026, where a full desk conversation`,
    ` * crossed and came back as "your screening didn't make it across". So the`,
    ` * seal carries the word again, derived here from the type and never asked of`,
    ` * anyone, until her carry updates production's side. Item O14.`,
    ` *`,
    ` * IT IS A HINT, NEVER A VERDICT. It says which standards' lists name this`,
    ` * kind of activity. Which pathway a project actually fits is Phoebe's to`,
    ` * find, on her applies cards (item A16), and her verdicts cross in the`,
    ` * worksheet, not here.`,
    ` *`,
    ` * "carbon" is in the list because production reads the word and because a`,
    ` * carbon-only type could join the list later. No type on the list yields it`,
    ` * today: the four Gold Standard classes sit on the carbon axis, and a class`,
    ` * is never a type.`,
    ` */`,
    `export const PATHWAY_KINDS = ['', 'water', 'carbon', 'both', 'neither'] as const;`,
    `export type PathwayKind = (typeof PATHWAY_KINDS)[number];`,
    '',
    `export function pathwayKind(type: string): PathwayKind {`,
    `  if (type === '') return '';`,
    `  /* The one type both standards name: the guidebook's potable-water row,`,
    `     which is also the safe-water carbon method's whole subject. */`,
    `  if (type === DRINKING_WATER_TYPE) return 'both';`,
    `  const found = projectType(type);`,
    `  /* A class is not a type, and nor is anything off the list. The seal's own`,
    `     reader refuses both before this is reached. */`,
    `  if (!found || found.axis === 'carbon') return '';`,
    `  /* "None of these" means no listed type matched, not that no pathway`,
    `     applies: the guidebook's table is not a closed list, and the applies`,
    `     test is what decides. */`,
    `  if (found.axis === 'none') return 'neither';`,
    `  return 'water';`,
    `}`,
    '',
  ].join('\n');
}

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
    const { METHOD_PACKS } = createRequire(import.meta.url)(join(out, 'methodPacks.js'));

    const live = METHOD_PACKS.filter((p) => p.state === 'live');
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
    label: 'cards',
    target: 'api/_cards.generated.ts',
    /* EVERY SET SHE MAY BE GIVEN, ONE CONSTANT EACH — from 25 Sep 2026. Her
       prompt no longer carries them all on every request: the relay loads a set
       when the visit reaches the stage that needs it (ruling R6, staged
       loading), so each set is its own export and the relay decides. The cards
       moved into Phoebe's pack on 17 Sep 2026; they were at the repository root
       before that day. The carbon pack's sets join this list at pull request B
       of build-order step 3. */
    sources: [
      { name: 'WATER_APPLIES_MD', file: 'knowledge-packs/phoebe-eligibility/vwba-2.0/cards/applies-cards-vwba.md' },
      { name: 'WATER_ELIGIBILITY_MD', file: 'knowledge-packs/phoebe-eligibility/vwba-2.0/cards/eligibility-cards-vwba.md' },
      { name: 'WATER_ROUTES_MD', file: 'knowledge-packs/phoebe-eligibility/vwba-2.0/cards/routes-cards-vwba.md' },
      { name: 'WATER_FEASIBILITY_MD', file: 'knowledge-packs/phoebe-eligibility/vwba-2.0/cards/feasibility-cards-vwba.md' },
      /* The carbon pack joined on 25 Sep 2026, pull request B of build-order
         step 3. Its three sets are hers to read from that day; they are staged
         like the water pack's, so a visitor on one pathway is never read the
         other. */
      { name: 'CARBON_APPLIES_MD', file: 'knowledge-packs/phoebe-eligibility/gs-paa-v2.0/cards/applies-cards-gs.md' },
      { name: 'CARBON_ELIGIBILITY_MD', file: 'knowledge-packs/phoebe-eligibility/gs-paa-v2.0/cards/eligibility-cards-gs.md' },
      { name: 'CARBON_ROUTES_MD', file: 'knowledge-packs/phoebe-eligibility/gs-paa-v2.0/cards/routes-cards-gs.md' },
    ],
    stale: 'The relay would deploy with out-of-date cards.',
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
    label: 'wellington',
    target: 'api/_wellingtonPrimer.generated.ts',
    sources: [{ name: 'WELLINGTON_PRIMER_MD', file: 'knowledge-packs/product-shared/agent-primer.md', region: 'WELLINGTON-FACING' }],
    stale: 'Wellington would deploy with an out-of-date region, so he could welcome and route in words the maintainer never signed.',
  },
  {
    label: 'types',
    target: 'api/_projectTypes.generated.ts',
    /* The project-type list, parsed rather than embedded — item A16, 24 Sep
       2026. The same render is written a second time under src/lib/ so the
       rail reads the same rows; see the bundle after this one. */
    sources: [{ name: 'PROJECT_TYPES', file: 'knowledge-packs/product-shared/project-types.md', render: renderProjectTypes }],
    stale: 'Wellington would deploy matching to a list of types the maintainer has since changed, and his relay would check a logged type against the wrong list.',
  },
  {
    label: 'types (browser)',
    target: 'src/lib/projectTypes.generated.ts',
    sources: [{ name: 'PROJECT_TYPES', file: 'knowledge-packs/product-shared/project-types.md', render: renderProjectTypes }],
    stale: "The rail would name a type or a definition the file no longer carries.",
  },
  {
    label: 'build-update',
    target: 'api/_buildUpdate.generated.ts',
    /* The dated build-update fact Wellington phrases when a visitor asks how the
       site is coming along. Refreshed at every close-out, her ruling of
       23 Sep 2026. Only the marked region embeds. */
    sources: [{ name: 'WELLINGTON_BUILD_UPDATE_MD', file: 'knowledge-packs/wellington-host/build-update.md', region: 'AGENT-FACING' }],
    stale: 'Wellington would deploy telling visitors a build state that the close-out has moved past.',
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
    .map(({ name, file, region, render }) => {
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
