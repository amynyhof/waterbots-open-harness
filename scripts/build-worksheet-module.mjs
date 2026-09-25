/**
 * The worksheet model — read from the tool files, written for both readers.
 *
 * ONE HOME, FROM 25 SEP 2026. The maintainer's ruling of 24 Sep 2026 made
 * `<pack>/tool/<tool-id>.yaml` the one place a tool is defined: its rows, their
 * states, what each takes, where a value comes from, and its citations by card
 * id. Build-order step 3 is where the runtime starts reading it. This module
 * turns the two tool files into ordinary TypeScript, twice:
 *
 *   api/_worksheet.generated.ts     for Phoebe's relay
 *   src/lib/worksheet.generated.ts  for the console
 *
 * THE TWO BODIES ARE IDENTICAL, on the project-type pattern of 24 Sep 2026.
 * The relay cannot import from src/ and the browser cannot import from api/,
 * so the alternative is two hand-written copies of one rule — which is two
 * rules that can disagree. Generated twice from one render, they cannot.
 *
 * IT ALSO RENDERS WHAT PHOEBE IS TOLD ABOUT HER TOOL, into
 * api/_tool.generated.ts, which until today was a copy of a region of the water
 * pack's `tool/README.md`. That region retires with this build; the facts now
 * come from the tool files, and the rules that sat in the region with them
 * moved into her prompt, where her other rules live. Ruling R1, 25 Sep 2026.
 *
 * THE SEATS COME FROM THE ROSTER. A shown row names the phase where it is acted
 * on and the seat that helps there (the phase-tags ruling of 23 Sep 2026), and
 * the crew list is `product-shared/roster.yaml`, carried from production and
 * never edited here. Read, not typed, so a seat cannot drift.
 *
 * WHAT IT REFUSES TO WRITE. A file whose keys it does not know, a row missing
 * one of the contract's eight keys, a state list that differs between the two
 * sections, a row citing a card set the pack does not hold, a phase that is not
 * on the navigation, an `applies` value the file does not declare. Those are
 * also `scripts/check-tool.mjs`'s business; this script refuses because a
 * generated module that is quietly wrong is worse than a build that stops.
 *
 *   node scripts/build-worksheet-module.mjs          # write the modules
 *   node scripts/build-worksheet-module.mjs --check  # exit 1 if either would change
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { parse } from 'yaml';

/* --------------------------------------------------------------------------
   What is read.
   -------------------------------------------------------------------------- */

const TOOL_FILES = [
  'knowledge-packs/phoebe-eligibility/vwba-2.0/tool/eligibility-worksheet.yaml',
  'knowledge-packs/phoebe-eligibility/gs-paa-v2.0/tool/eligibility-worksheet.yaml',
];

const ROSTER = 'knowledge-packs/product-shared/roster.yaml';

/**
 * The packs Phoebe reads.
 *
 * Build-order step 3 landed in two halves on the maintainer's word: the water
 * pathway on 25 Sep 2026 (pull request A, #122), the carbon pathway the same
 * day (pull request B). Both are hers now, and the staging in _systemPrompt.ts
 * is what keeps a visitor on one pathway from being read the other.
 */
const HER_PACKS = ['vwba-2.0', 'gs-paa-v2.0'];

/** The navigation's phases, in the order a visitor meets them. */
const PHASES = ['eligibility', 'partners', 'quantify', 'plan', 'monitor', 'communicate'];

/**
 * The tag for a row that is not acted on at one phase but kept up while the
 * project runs. It shows inside the Monitor group, which is where keeping
 * things up is somebody's job — ruling R4 of the phase-tags proposal.
 */
const TO_REMAIN = 'to-remain-eligible';

/**
 * How the record's fields are named where Phoebe reads them.
 *
 * The tool file names a field by its key, because that is what a reader of the
 * file needs. Phoebe meets the same fields as lines in the block headed "What
 * the visitor has already told Wellington", and those lines are written in
 * api/_record.ts. She must not learn two names for one fact, so the block's
 * words are used here and scripts/check-phoebe.mjs holds the two equal.
 */
const RECORD_LABEL = {
  does: 'What it does',
  name: 'What it is called',
  place: 'Where it is',
  type: 'What type',
  stage: 'Stage',
  pin: 'The basin pin',
};

const PHASE_LABEL = {
  eligibility: 'Eligibility',
  partners: 'Partners',
  quantify: 'Quantify',
  plan: 'Plan',
  monitor: 'Monitor',
  communicate: 'Communicate',
};

/* --------------------------------------------------------------------------
   Reading a tool file.
   -------------------------------------------------------------------------- */

const ROW_KEYS = ['id', 'title', 'asked', 'takes', 'from', 'fixable', 'routes', 'cite'];
const FILE_KEYS = ['tool', 'pack', 'section', 'sources', 'record', 'states', 'rows', 'fields', 'outputs'];

function fail(message) {
  throw new Error(`build-worksheet-module: ${message}`);
}

/** `from` entries are a bare word or a one-key object; both become a phrase. */
function fromPhrase(entry, where) {
  if (typeof entry === 'string') return entry;
  if (typeof entry === 'object' && entry !== null) {
    const keys = Object.keys(entry);
    if (keys.length === 1) return `${keys[0]}: ${entry[keys[0]]}`;
  }
  return fail(`${where} has a "from" entry that is neither a word nor a one-key pair`);
}

function words(list, where) {
  if (!Array.isArray(list)) fail(`${where} is not a list`);
  return list.map((w) => {
    if (typeof w.id !== 'string' || typeof w.label !== 'string') {
      fail(`${where} has an entry with no id or no label`);
    }
    return {
      id: w.id,
      label: w.label,
      carries: typeof w.carries === 'string' ? w.carries : '',
      colour: typeof w.colour === 'string' ? w.colour : null,
    };
  });
}

function readTool(file) {
  const raw = parse(readFileSync(file, 'utf8'));
  for (const key of Object.keys(raw)) {
    if (!FILE_KEYS.includes(key)) fail(`${file} carries "${key}", which is not a key of a tool file`);
  }
  const states = raw.states ?? fail(`${file} has no states`);
  const appliesDeclared = (states['applies-to'] ?? []).map((a) => a.id);
  const versionDeclared = (states['version-flag'] ?? []).map((v) => v.id);

  const rows = (raw.rows ?? fail(`${file} has no rows`)).map((row) => {
    for (const key of ROW_KEYS) {
      if (!(key in row)) fail(`${file}: row ${row.id ?? '(no id)'} has no "${key}"`);
    }
    if (row.asked !== TO_REMAIN && !PHASES.includes(row.asked)) {
      fail(`${file}: row ${row.id} is asked at "${row.asked}", which is not a phase on the navigation`);
    }
    if (typeof row.cite?.card !== 'string') {
      fail(`${file}: row ${row.id} does not cite a card. A tool file names a card; it never copies one.`);
    }
    if (row.applies !== undefined) {
      for (const value of row.applies) {
        if (!appliesDeclared.includes(value)) {
          fail(`${file}: row ${row.id} applies to "${value}", which the file's own applies-to list does not declare`);
        }
      }
    }
    return {
      id: String(row.id),
      title: row.title,
      asked: row.asked,
      takes: { kind: row.takes.kind, ...(row.takes.of ? { of: row.takes.of } : {}) },
      from: row.from.map((entry) => fromPhrase(entry, `${file}: row ${row.id}`)),
      fixable: row.fixable,
      routes: row.routes ?? [],
      card: row.cite.card,
      ...(row.applies ? { applies: row.applies } : {}),
    };
  });

  return {
    pack: raw.pack.key,
    version: String(raw.pack.version),
    sectionId: raw.section.id,
    sectionName: raw.section.name,
    pathway: raw.section.pathway,
    rows,
    rowStates: words(states['row-state'], `${file}: row-state`),
    pathwayStates: words(states['pathway-state'], `${file}: pathway-state`),
    readiness: words(states['readiness-read'], `${file}: readiness-read`),
    versionFlags: versionDeclared.length ? words(states['version-flag'], `${file}: version-flag`) : [],
    appliesTo: words(states['applies-to'], `${file}: applies-to`),
    record: (raw.record ?? []).map((f) => ({
      field: f.field,
      asks: f.asks,
      takes: f.takes.kind,
      provenance: f.provenance ?? [],
    })),
    tool: raw.tool,
  };
}

/* --------------------------------------------------------------------------
   The seats, from the roster.
   -------------------------------------------------------------------------- */

function readSeats() {
  const roster = parse(readFileSync(ROSTER, 'utf8'));
  const byPhase = {};
  for (const phase of PHASES) byPhase[phase] = [];
  for (const seat of roster.seats) {
    const phase = String(seat.phase).toLowerCase();
    if (phase === 'all') continue;
    if (!byPhase[phase]) fail(`${ROSTER}: seat ${seat.id} sits at phase "${seat.phase}", which is not on the navigation`);
    byPhase[phase].push({ names: seat.faces, seat: seat.seat });
  }
  const empty = PHASES.filter((p) => byPhase[p].length === 0);
  if (empty.length) fail(`${ROSTER} names no seat for ${empty.join(', ')}`);
  return PHASES.map((phase) => ({ phase, label: PHASE_LABEL[phase], seats: byPhase[phase] }));
}

/* --------------------------------------------------------------------------
   The module.
   -------------------------------------------------------------------------- */

const HEADER = `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Written by scripts/build-worksheet-module.mjs from the tool definition files
 * in Phoebe's packs and from the roster. Edit those, not this file, then re-run:
 *
 *   node scripts/build-worksheet-module.mjs
 *
 * The build gate fails if this has drifted from its sources, so the relay and
 * the console cannot hold different rows.
 *
 * Sources: ${TOOL_FILES.join(', ')}, ${ROSTER}
 */

`;

function sameWords(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function render(sections, seats) {
  /* The state words are the tool's, not a section's, so the two files have to
     agree about them. They do, and if they ever stop, the module would have to
     choose one — which is the drift this file exists to prevent. */
  const first = sections[0];
  for (const section of sections.slice(1)) {
    if (!sameWords(first.rowStates, section.rowStates)) {
      fail(`${section.pack} names different row states from ${first.pack}`);
    }
    if (!sameWords(first.pathwayStates, section.pathwayStates)) {
      fail(`${section.pack} names different pathway states from ${first.pack}`);
    }
    if (!sameWords(first.readiness, section.readiness)) {
      fail(`${section.pack} names different readiness reads from ${first.pack}`);
    }
  }

  const json = (value) => JSON.stringify(value, null, 2);

  return (
    HEADER +
    `/** One row of the worksheet, as its tool file writes it. */
export interface ToolRow {
  id: string;
  title: string;
  /** The phase on the navigation where the row is acted on, or "${TO_REMAIN}". */
  asked: string;
  takes: { kind: string; of?: string };
  /** Where the value may come from, in the file's own words. */
  from: string[];
  /** The card's own "Can it be fixed?" value. Only a row that is not "yes" can ever be Blocked. */
  fixable: string;
  /** The route cards this row may name, by id. A route outside this list is not this row's. */
  routes: string[];
  /** The card that carries the row's words, as "set/id". The tool names a card; it never copies one. */
  card: string;
  /** Which projects the row exists for. Absent means every project on the pathway. */
  applies?: string[];
}

/** A word from one of the tool's closed lists, with what it carries and its colour. */
export interface ToolWord {
  id: string;
  label: string;
  carries: string;
  colour: string | null;
}

/** One pack's section of the worksheet. */
export interface ToolSection {
  pack: string;
  version: string;
  sectionId: string;
  sectionName: string;
  pathway: string;
  rows: ToolRow[];
  versionFlags: ToolWord[];
  appliesTo: ToolWord[];
  /** The project-context fields this section reads before it asks anything. */
  record: { field: string; asks: string; takes: string; provenance: string[] }[];
}

/** The tool itself, from the files' own \`tool\` block. */
export const TOOL = ${json(first.tool)};

/** The navigation's phases, in the order a visitor meets them. */
export const PHASES = ${json(PHASES)} as const;

/** The tag a row carries when it is kept up while the project runs. */
export const TO_REMAIN = ${JSON.stringify(TO_REMAIN)};

/** How each phase is named on screen. */
export const PHASE_LABEL: Record<string, string> = ${json(PHASE_LABEL)};

/** How the record's fields are named where a visitor and an agent read them. */
export const RECORD_LABEL: Record<string, string> = ${json(RECORD_LABEL)};

/** The seat that helps at each phase, read from the roster. */
export const PHASE_SEATS: readonly { phase: string; label: string; seats: { names: string[]; seat: string }[] }[] = ${json(seats)};

/** The five row states, in the order a row moves through them. */
export const ROW_STATES: readonly ToolWord[] = ${json(first.rowStates)};

/** Whether a pathway is in play. Never a verdict on the project. */
export const PATHWAY_STATES: readonly ToolWord[] = ${json(first.pathwayStates)};

/** The readiness read, drawn from the rows and never from prose. */
export const READINESS_READS: readonly ToolWord[] = ${json(first.readiness)};

export const TOOL_SECTIONS: readonly ToolSection[] = ${json(
      sections.map((s) => ({
        pack: s.pack,
        version: s.version,
        sectionId: s.sectionId,
        sectionName: s.sectionName,
        pathway: s.pathway,
        rows: s.rows,
        versionFlags: s.versionFlags,
        appliesTo: s.appliesTo,
        record: s.record,
      }))
    )};

/**
 * The packs Phoebe reads today.
 *
 * The carbon section is shown on the worksheet and on her Knowledge tab before
 * she reads it, because hiding a pack that exists would be less honest than
 * saying it is not hers yet. This list is what her prompt is built from.
 */
export const HER_PACKS: readonly string[] = ${json(HER_PACKS)};

/* The ids as literals, so a state that is not one of them does not compile. */
export const ROW_STATE_IDS = ${json(first.rowStates.map((w) => w.id))} as const;
export const PATHWAY_STATE_IDS = ${json(first.pathwayStates.map((w) => w.id))} as const;
export const READINESS_IDS = ${json(first.readiness.map((w) => w.id))} as const;

export type RowStateId = (typeof ROW_STATE_IDS)[number];
export type PathwayStateId = (typeof PATHWAY_STATE_IDS)[number];
export type ReadinessId = (typeof READINESS_IDS)[number];

/** How each row state is named on screen. Complete words, never a symbol alone. */
export const ROW_STATE_LABEL: Record<string, string> = Object.fromEntries(
  ROW_STATES.map((s) => [s.id, s.label])
);

/** The brand token each row state carries, from the tool file. */
export const ROW_STATE_COLOUR: Record<string, string | null> = Object.fromEntries(
  ROW_STATES.map((s) => [s.id, s.colour])
);

export const PATHWAY_STATE_LABEL: Record<string, string> = Object.fromEntries(
  PATHWAY_STATES.map((s) => [s.id, s.label])
);

export const READINESS_LABEL: Record<string, string> = Object.fromEntries(
  READINESS_READS.map((r) => [r.id, r.label])
);

export function section(pack: string): ToolSection | undefined {
  return TOOL_SECTIONS.find((s) => s.pack === pack);
}

/** What the project is known to be, for sorting which rows it has. */
export interface RowContext {
  /** The Gold Standard technology class, where one is known. */
  gsClass?: string;
  /** The version flag the carbon pack's own test sets. */
  versionFlag?: string;
}

/**
 * Which rows this project has.
 *
 * A row with no \`applies\` key exists for every project on the pathway. A row
 * with one exists only for the classes or versions it names — and while the
 * class is unknown, no row is hidden, because hiding a row on a guess would
 * tell the visitor their project has fewer requirements than it may have.
 */
export function rowsFor(pack: string, context: RowContext = {}): ToolRow[] {
  const found = section(pack);
  if (!found) return [];
  const known = [context.gsClass, context.versionFlag].filter((v): v is string => !!v);
  return found.rows.filter((row) => {
    if (!row.applies) return true;
    if (known.length === 0) return true;
    return row.applies.some((value) => known.includes(value));
  });
}

/** True for a row whose answer says whether the pathway is in play at all. */
export function isPathwayRow(row: ToolRow): boolean {
  return row.takes.of === 'pathway-state';
}

/** True for the one row that sorts a project into a version of its method. */
export function isVersionRow(row: ToolRow): boolean {
  return row.takes.of === 'version-flag';
}

/**
 * The rows asked on this site: the Eligibility-phase rows, and no others.
 *
 * The maintainer's ruling of 23 Sep 2026. Every other row is shown once,
 * grouped by the phase where it is acted on, and is never asked here and never
 * counted against a project.
 */
export function askedRows(pack: string, context: RowContext = {}): ToolRow[] {
  return rowsFor(pack, context).filter((row) => row.asked === 'eligibility');
}

/** The Eligibility rows that carry a verdict — the applies tests are not verdicts. */
export function verdictRows(pack: string, context: RowContext = {}): ToolRow[] {
  return askedRows(pack, context).filter((row) => !isPathwayRow(row) && !isVersionRow(row));
}

/** The applies tests, in the order they are run. */
export function pathwayRows(pack: string, context: RowContext = {}): ToolRow[] {
  return rowsFor(pack, context).filter(isPathwayRow);
}

/**
 * The rows shown once, grouped by phase in the navigation's order.
 *
 * Communicate is returned even when nothing is a row there, because an honest
 * empty group says more than a hidden one — ruling R5 of the phase-tags
 * proposal. A row tagged "${TO_REMAIN}" shows inside Monitor.
 */
export function shownGroups(
  pack: string,
  context: RowContext = {}
): { phase: string; label: string; seats: { names: string[]; seat: string }[]; rows: ToolRow[] }[] {
  const rows = rowsFor(pack, context).filter((row) => row.asked !== 'eligibility');
  return PHASE_SEATS.filter((group) => group.phase !== 'eligibility').map((group) => ({
    phase: group.phase,
    label: group.label,
    seats: group.seats,
    rows: rows.filter((row) =>
      group.phase === 'monitor' ? row.asked === 'monitor' || row.asked === TO_REMAIN : row.asked === group.phase
    ),
  }));
}

/** Whether a row could ever be Blocked: only where its card says so. */
export function canBlock(pack: string, id: string): boolean {
  const row = section(pack)?.rows.find((r) => r.id === id);
  return row ? row.fixable !== 'yes' : false;
}

/** The route ids this row may name, and no others. */
export function routesOf(pack: string, id: string): string[] {
  return section(pack)?.rows.find((r) => r.id === id)?.routes ?? [];
}

/**
 * The pathway's state, from its own test rows and from nothing else.
 *
 * Any test answered "does not apply" settles it. Every test answered "applies"
 * settles it the other way. Anything else is not yet checked, which is an
 * absence and never a verdict.
 */
export function pathwayStateOf(
  pack: string,
  states: Record<string, string>,
  context: RowContext = {}
): PathwayStateId {
  const tests = pathwayRows(pack, context);
  if (tests.length === 0) return 'unchecked';
  if (tests.some((row) => states[row.id] === 'does-not-apply')) return 'does-not-apply';
  if (tests.every((row) => states[row.id] === 'applies')) return 'applies';
  return 'unchecked';
}

/**
 * The readiness read for one pathway.
 *
 * Likely eligible when every Eligibility row this project has is Met; likely
 * not when any is Blocked; not enough known yet for everything else, which
 * includes a worksheet nobody has touched. "Likely" is the honest word:
 * nothing on this site verifies anything.
 */
export function readinessOf(
  pack: string,
  states: Record<string, string>,
  context: RowContext = {}
): ReadinessId {
  const rows = verdictRows(pack, context);
  if (rows.some((row) => states[row.id] === 'blocked')) return 'likely-not';
  if (rows.length > 0 && rows.every((row) => states[row.id] === 'met')) return 'likely-eligible';
  return 'not-enough-known';
}
`
  );
}

/* --------------------------------------------------------------------------
   What Phoebe is told about her tool — the same model, in her words' worth of
   facts. Facts and rules never arrive as lines to repeat: she phrases her own
   sentences, and the rules that go with these facts live in her prompt.
   -------------------------------------------------------------------------- */

function toolText(sections, seats) {
  const her = sections.filter((s) => HER_PACKS.includes(s.pack));
  const notHers = sections.filter((s) => !HER_PACKS.includes(s.pack));
  const lines = [];

  lines.push(
    `**You have one tool: ${lower(sections[0].tool.name)}, on the Tool tab of your screen.** ${sections[0].tool.purpose} The map is Bridget's tool and the calculator is Calvin's; you never work either.`,
    '',
    `**It has one section per pathway, and each section is a knowledge pack of yours.** ${sections
      .map((s) => `${s.sectionName} — ${s.pack}`)
      .join('; ')}.`,
    ''
  );

  if (notHers.length) {
    lines.push(
      `**You read ${her.length === 1 ? 'one of them today' : 'these today'}: ${her
        .map((s) => s.sectionName)
        .join(', ')}.** ${notHers
        .map((s) => s.sectionName)
        .join(', ')} is on the worksheet and on your Knowledge pack tab, and you do not have its cards yet. Say so plainly when it comes up, and check nothing on it.`,
      ''
    );
  }

  for (const s of her) {
    const asked = s.rows.filter((r) => r.asked === 'eligibility');
    const shown = s.rows.filter((r) => r.asked !== 'eligibility');
    lines.push(`## ${s.sectionName}`, '');
    lines.push(
      `**The rows you ask on this site, in this order.** These are the Eligibility-phase rows: facts a planner can answer from the idea itself, whose answer can end a pathway or is needed to know it applies.`,
      ''
    );
    for (const row of asked) {
      const kind = row.takes.of === 'pathway-state'
        ? 'whether the pathway is in play'
        : row.takes.of === 'version-flag'
          ? 'which version the project is judged on'
          : 'a row state';
      lines.push(
        `- **${row.id} — ${row.title}.** Takes ${kind}. Its words are on card ${row.card}. From: ${row.from.join('; ')}.${
          row.routes.length ? ` Routes it may name: ${row.routes.join(', ')}.` : ' No route card carries a fix for it.'
        }${row.fixable === 'yes' ? ' Its card says a miss here can be fixed, so it is never Blocked.' : ' Its card allows a Blocked verdict, under the rule in your prompt.'}${
          row.applies ? ` Exists only for: ${row.applies.join(', ')}.` : ''
        }`
      );
    }
    lines.push('');
    lines.push(
      `**The rows you show once and never ask**, grouped by the phase where each is acted on and the seat that helps there:`,
      ''
    );
    for (const group of seats.filter((g) => g.phase !== 'eligibility')) {
      const rows = shown.filter((row) =>
        group.phase === 'monitor' ? row.asked === 'monitor' || row.asked === TO_REMAIN : row.asked === group.phase
      );
      const who = group.seats.map((seat) => `${seat.names.join(' and ')} (${seat.seat})`).join('; ');
      lines.push(
        rows.length
          ? `- **${group.label}** — ${who}. ${rows.map((r) => `${r.id}, ${lower(r.title)}`).join('; ')}.`
          : `- **${group.label}** — ${who}. Nothing on this pathway is a row here yet, and you say so rather than leaving the group out.`
      );
    }
    const sorts = s.appliesTo.filter((word) => word.id !== 'all');
    if (sorts.length || s.versionFlags.length) {
      lines.push('');
      lines.push(
        '**What sorts these rows, and the words to record.** A row that does not exist for this project is not asked, and the worksheet cannot drop it until you have recorded which kind of project this is. Put the word — exactly as written here — in the sorts field on the turn your test settles it.',
        ''
      );
      if (sorts.length) {
        lines.push(
          '- **Which kind of project:** ' +
            sorts.map((word) => '`' + word.id + '` — ' + lower(word.label)).join('; ') +
            '.'
        );
      }
      if (s.versionFlags.length) {
        lines.push(
          '- **Which version:** ' +
            s.versionFlags.map((word) => '`' + word.id + '` — ' + lower(word.label)).join('; ') +
            '.'
        );
      }
    }
    lines.push('');
  }

  lines.push('**What a row takes.** One of five states, and each carries something with it:', '');
  for (const word of sections[0].rowStates) {
    lines.push(`- **${word.label}** — ${word.carries === 'nothing' ? 'carries nothing.' : `carries ${word.carries}.`}`);
  }
  lines.push('');
  lines.push('**What a pathway takes**, above its rows, from its own test rows only:', '');
  for (const word of sections[0].pathwayStates) {
    lines.push(`- **${word.label}** — ${word.carries === 'nothing' ? 'carries nothing.' : `carries ${word.carries}.`}`);
  }
  lines.push('');
  lines.push('**What the read says**, one line per pathway, worked out from the rows and never from your prose:', '');
  for (const word of sections[0].readiness) {
    lines.push(`- **${word.label}** — ${word.carries === 'nothing' ? 'nothing beyond the rows it came from.' : word.carries}.`);
  }
  lines.push('');

  const record = sections[0].record.filter((f) => f.field !== 'pin');
  lines.push(
    `**The facts you read first.** Before you ask anything, check what the project context already holds. On this site that is the record Wellington collects, on the left panel, and it reaches you as the block headed "What the visitor has already told Wellington". Its fields, and what each takes:`,
    ''
  );
  for (const f of record) {
    const label = RECORD_LABEL[f.field] ?? fail(`${f.field} has no name in the record block`);
    lines.push(`- **${label}** — ${f.asks} ${f.takes === 'text' ? 'Text.' : 'One choice.'}`);
  }
  lines.push(
    '',
    'They are facts about the project, never a verdict on any row. Any of them may be absent; ask only for what you need and what is missing. When no such block comes with the conversation, you are on the Agent Commons or at a cold start, and the conversation is the only project context.',
    ''
  );
  lines.push(
    `**The pin is Bridget's, not yours.** Her tool writes the basin; yours reads it and never sets it.`
  );

  return lines.join('\n') + '\n';
}

function lower(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/* --------------------------------------------------------------------------
   Writing, and the staleness gate.
   -------------------------------------------------------------------------- */

const sections = TOOL_FILES.map(readTool);
const seats = readSeats();

const OUTPUTS = [
  { target: 'api/_worksheet.generated.ts', text: render(sections, seats) },
  { target: 'src/lib/worksheet.generated.ts', text: render(sections, seats) },
  {
    target: 'api/_tool.generated.ts',
    text:
      `/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Written by scripts/build-worksheet-module.mjs from the tool definition files
 * in Phoebe's packs and from the roster. Until 25 Sep 2026 this was a copy of a
 * marked region of the water pack's tool/README.md; that region retired when the
 * runtime started reading the tool files, so the tool has one home. Ruling R1.
 *
 *   node scripts/build-worksheet-module.mjs
 *
 * Sources: ${TOOL_FILES.join(', ')}, ${ROSTER}
 */

export const PHOEBE_TOOL_MD: string = ${JSON.stringify(toolText(sections, seats))};
`,
  },
];

const checkOnly = process.argv.includes('--check');
let failed = false;

for (const { target, text } of OUTPUTS) {
  if (checkOnly) {
    if (!existsSync(target)) {
      console.error(`MISSING — ${target} has not been generated.`);
      failed = true;
      continue;
    }
    if (readFileSync(target, 'utf8') !== text) {
      console.error(`STALE — ${target} does not match the tool files.`);
      console.error('The relay and the console would hold different rows from the ones the maintainer approved.');
      console.error('Run: node scripts/build-worksheet-module.mjs');
      failed = true;
      continue;
    }
    console.log(`${target} is current.`);
    continue;
  }
  writeFileSync(target, text);
  console.log(`Wrote ${target} (${(text.length / 1024).toFixed(1)} KB).`);
}

process.exit(failed ? 1 : 0);
