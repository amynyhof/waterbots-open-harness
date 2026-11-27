/**
 * The Agent Commons shelf — one entry per knowledge pack. Item S18, slice 2, built 11 Sep 2026. From 28 Oct 2026 the
 * page draws them as a list of modules, one row each, with a stage and an owner, a planned module after them, and a
 * section of modules that are seeking partners.
 *
 * THE ROWS LIVE IN A CONTENT FILE OF THEIR OWN from 26 Nov 2026 (item S26): src/content/commons-modules.json. A row's
 * words, stage, owner and whether it opens change there, without touching code. This file keeps the types, reads that
 * file, checks every field, and throws, naming the row and the field, when one is wrong — so a bad row fails the build
 * rather than drawing a blank or a made-up cell.
 *
 * NOTHING IS TYPED TWICE. A value the registries already hold is written in the content file as `{ "read": "<name>" }`
 * and read here from the registry (READS, below): Phoebe's tag from her committed card sets (her package,
 * @waterbots/phoebe), and Violet's title, line and tag from the water method registry (src/lib/methodPacks.ts).
 *
 * THE INSTALLED AGENTS (item S32, 26 Nov 2026). Each row names the installed package it belongs to, and the row shows
 * that package's own version, read from its package.json at build time. An installed agent that has no row still
 * appears, as a plain row of its package name and version, where the crew list lets it appear at the Commons.
 * THE OPEN CORE'S COMMONS READER REPLACES THIS when it ships: until then this file stands in for it, reading
 * node_modules/@waterbots/* at build time.
 *
 * WELLINGTON HAS NO CARD. He carries no knowledge pack, and the crew list gives him no place at the Commons door.
 *
 * THE GRADE IS NULL ON EVERY CARD, AND ONLY ONE THING MAY EVER FILL IT. Maintainer's rulings of 9 Sep 2026, canon: ONE
 * GRADER — the grading rig kept outside this repository is the only public grade, and this site's own checks are
 * internal gates, never a score; REAL ONLY — a grade comes from real projects and real packs run through that rig,
 * never an invented case. Until a real card from that rig exists, every chip reads "not yet graded", and slice 4 widens
 * the type when the first one arrives. No mock grade, ever.
 */

import { crewMember, type CrewMember } from './crew';
import { WATER_D3_LISTING } from './methodPacks';
import { WATER_METHOD_ID } from './visit';
import { CRITERIA } from '@waterbots/phoebe';
import modulesRaw from '../content/commons-modules.json?raw';
import rosterRaw from '../../knowledge-packs/product-shared/roster.yaml?raw';

/**
 * A MODULE'S STAGE AND OWNER — maintainer's rulings, 28 Oct 2026. The owner
 * is never a partner's name, until a partner owns a module and she says so.
 *
 * SIX STAGES, IN ORDER, from a later ruling the same day, replacing the status
 * phrases of earlier that day: a module moves from seeking partners to
 * graduated, and the list draws each stage as its name and a small bar of six
 * steps. The one
 * line on what each stage means is the engineer's draft for her approval,
 * shown behind the (i) beside the column.
 */
export const STAGES = [
  { name: 'Seeking partners', line: 'Looking for a partner to build it and an expert to shape it.' },
  { name: 'Proposed', line: 'Scoped and written up; building has not started.' },
  { name: 'In development', line: 'Being built: its knowledge pack, and a calculator or tool where it needs one.' },
  { name: 'Expert review', line: 'Built, and being checked by experts in its method.' },
  { name: 'Exam', line: 'Sitting its independent exam on real, completed projects.' },
  { name: 'Graduated', line: 'Passed its exam; its grade shows here.' },
] as const;

export type ModuleStage = (typeof STAGES)[number]['name'];

/** A stage's place in the six, counted from 1. */
export function stageNumber(stage: ModuleStage): number {
  return STAGES.findIndex((s) => s.name === stage) + 1;
}

const OWNERS = ['WaterBots', 'WaterBots + partner (to be named)', 'Partner pending', 'Open to partners'] as const;

export type ModuleOwner = (typeof OWNERS)[number];

export interface ShelfCard {
  /** Stable key. The registry's own where it has one. */
  key: string;
  /**
   * The module's address on the Commons, /commons/<slug> — the maintainer's
   * word of 28 Oct 2026. Only a module that opens answers to it.
   */
  slug: string;
  /** The agent whose face the card wears, and whose screen opens. */
  holder: CrewMember;
  /** The installed package the module belongs to, by its name. */
  packageName: string;
  /** That package's own version, read from its package.json at build time (S32). */
  version: string;
  /** The pack's name as the card's title. */
  title: string;
  /** One short line on what the pack is good at. */
  line: string;
  /** The document the pack is drawn from, by its short name. */
  tag: string;
  /** Where that document can be read, where the maintainer has given one. */
  tagHref?: string;
  /** For a method pack, its registry key, so the calculator opens on it. */
  packKey?: string;
  /**
   * Whether its Open button works on the Commons. Phoebe's did from 28 Oct 2026; from 26 Nov 2026 (S33) each agent
   * opens there, on its own seat (src/components/CommonsSeats.tsx).
   */
  opens: boolean;
  stage: ModuleStage;
  owner: ModuleOwner;
  /**
   * The public grade. Null until a real card from the one public exam
   * exists — see the note at the head of this file. Slice 4 widens this.
   */
  grade: null;
}

/**
 * A module that is named on the Commons but has nothing to open yet —
 * maintainer's rulings, 28 Oct 2026. It never carries a partner's name. Its
 * agent is a name only, or none; its method is what she wrote, or the
 * document it would be built from.
 */
export interface PlannedModule {
  key: string;
  /** The agent's name where she has given one; no portrait is drawn for it. */
  agent: string | null;
  title: string;
  line: string;
  method: string;
  stage: ModuleStage;
  owner: ModuleOwner;
  grade: null;
}

/**
 * An installed agent with no row in the content file (S32): a plain row of its package name and version, and nothing
 * else, since nothing else is known of it. It does not open. Its grade is null, as every grade is.
 */
export interface InstalledModule {
  key: string;
  /** The crew list's name for the seat. */
  agent: string;
  packageName: string;
  version: string;
  grade: null;
}

/* ---------------------------------------------------------------------------
   The registries a row may read from, by the name the content file uses.
--------------------------------------------------------------------------- */

const READS: Record<string, () => string> = {
  /* "VWBA 2.0" — read from the first card's citation, as her pack tab reads it. */
  'phoebe-first-card-document': () => CRITERIA[0].citation.document,
  /* Violet's address changed with her holder: the old one carried a full stop, which the interest form refuses. */
  'water-pack-key': () => `pack-${WATER_METHOD_ID}`,
  'water-method-id': () => WATER_METHOD_ID,
  'water-d3-name': () => WATER_D3_LISTING.name,
  'water-d3-shelf-line': () => WATER_D3_LISTING.shelfLine,
  'water-d3-shelf-document': () => WATER_D3_LISTING.shelfDocument,
};

/* ---------------------------------------------------------------------------
   The installed agents, read at build time. Core's Commons reader replaces this when it ships.
--------------------------------------------------------------------------- */

/**
 * Each installed @waterbots package's own version, by its folder (the package's name after "@waterbots/"). Only the
 * `version` field is taken, so nothing else of a package.json reaches the page.
 */
const INSTALLED: Record<string, string> = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('../../node_modules/@waterbots/*/package.json', { eager: true, import: 'version', exhaustive: true })
  ).map(([path, version]) => [/@waterbots\/([^/]+)\/package\.json$/.exec(path)?.[1] ?? path, version])
);

/** The crew list's seats: id, name and the level the Commons door gives each. Read, never edited (as rosterLine.ts). */
const SEATS: { id: string; name: string; commons: string }[] = rosterRaw
  .replace(/\r\n/g, '\n')
  .split(/\n  - id: /)
  .slice(1)
  .map((block) => ({
    id: block.split('\n')[0].trim(),
    name: /^    name: (.+)$/m.exec(block)?.[1]?.trim() ?? '',
    commons: /^      commons: \{ level: ([a-z]+)/m.exec(block)?.[1] ?? '',
  }));

/* ---------------------------------------------------------------------------
   Reading the content file. Every field is checked; a wrong one throws, naming the row.
--------------------------------------------------------------------------- */

const FILE = 'src/content/commons-modules.json';

type Raw = Record<string, unknown>;

function fail(where: string, problem: string): never {
  throw new Error(`${FILE}: ${where}: ${problem}`);
}

function text(row: Raw, field: string, where: string): string;
function text(row: Raw, field: string, where: string, optional: true): string | undefined;
function text(row: Raw, field: string, where: string, optional = false): string | undefined {
  const value = row[field];
  if (value === undefined && optional) return undefined;
  if (value !== null && typeof value === 'object' && 'read' in value) {
    const name = (value as { read: unknown }).read;
    const read = typeof name === 'string' ? READS[name] : undefined;
    if (!read) fail(where, `"${field}" reads "${String(name)}", which is not one of: ${Object.keys(READS).join(', ')}`);
    const out = read();
    if (!out) fail(where, `"${field}" reads "${String(name)}", which is empty`);
    return out;
  }
  if (typeof value !== 'string' || value.trim() === '') fail(where, `"${field}" must be words, and is ${JSON.stringify(value)}`);
  return value;
}

function stageOf(row: Raw, where: string): ModuleStage {
  const stage = STAGES.find((s) => s.name === row.stage);
  if (!stage) fail(where, `"stage" must be one of: ${STAGES.map((s) => s.name).join(', ')}`);
  return stage.name;
}

function ownerOf(row: Raw, where: string): ModuleOwner {
  const owner = OWNERS.find((o) => o === row.owner);
  if (!owner) fail(where, `"owner" must be one of: ${OWNERS.join(', ')}`);
  return owner;
}

function rows(content: Raw, list: string): Raw[] {
  const value = content[list];
  if (!Array.isArray(value)) fail(list, 'must be a list of rows');
  return value.map((row, i) => {
    if (row === null || typeof row !== 'object' || Array.isArray(row)) fail(`${list}[${i}]`, 'must be a row');
    return row as Raw;
  });
}

const CONTENT = JSON.parse(modulesRaw) as Raw;

function shelfCard(row: Raw, i: number): ShelfCard {
  const where = `shelf[${i}]`;
  const key = text(row, 'key', where);
  const at = `${where} (${key})`;
  const slug = text(row, 'slug', at);
  if (!/^[a-z0-9-]+$/.test(slug)) fail(at, '"slug" may hold only small letters, digits and dashes');
  const packageName = text(row, 'package', at);
  const installed = /^@waterbots\/([a-z0-9-]+)$/.exec(packageName)?.[1];
  const version = installed === undefined ? undefined : INSTALLED[installed];
  if (!version) fail(at, `"package" is ${packageName}, which is not installed`);
  if (typeof row.opens !== 'boolean') fail(at, '"opens" must be true or false');
  const tagHref = text(row, 'tagHref', at, true);
  const packKey = text(row, 'packKey', at, true);
  return {
    key,
    slug,
    holder: crewMember(text(row, 'holder', at)),
    packageName,
    version,
    title: text(row, 'title', at),
    line: text(row, 'line', at),
    tag: text(row, 'tag', at),
    ...(tagHref ? { tagHref } : {}),
    ...(packKey ? { packKey } : {}),
    opens: row.opens,
    stage: stageOf(row, at),
    owner: ownerOf(row, at),
    grade: null,
  };
}

function plannedModule(list: string) {
  return (row: Raw, i: number): PlannedModule => {
    const where = `${list}[${i}]`;
    const key = text(row, 'key', where);
    const at = `${where} (${key})`;
    const agent = row.agent === null ? null : typeof row.agent === 'string' && row.agent.trim() !== '' ? row.agent : undefined;
    if (agent === undefined) fail(at, '"agent" must be a name, or null where there is no agent yet');
    return {
      key,
      agent,
      title: text(row, 'title', at),
      line: text(row, 'line', at),
      method: text(row, 'method', at),
      stage: stageOf(row, at),
      owner: ownerOf(row, at),
      grade: null,
    };
  };
}

/** The shelf, in the order the content file gives (the maintainer's picture of 9 Sep 2026). */
export const SHELF: ShelfCard[] = rows(CONTENT, 'shelf').map(shelfCard);

for (const [i, card] of SHELF.entries()) {
  if (SHELF.findIndex((c) => c.slug === card.slug) !== i) fail(`shelf[${i}] (${card.key})`, `"slug" ${card.slug} is used twice`);
  if (SHELF.findIndex((c) => c.key === card.key) !== i) fail(`shelf[${i}] (${card.key})`, '"key" is used twice');
}

/** Modules named but not yet open, listed after the shelf. Her words, 28 Oct 2026. */
export const PLANNED: PlannedModule[] = rows(CONTENT, 'planned').map(plannedModule('planned'));

/**
 * Modules seeking a build partner and a domain consultant — the maintainer's
 * ruling of 28 Oct 2026. No agent yet. The method is the document each would
 * be built from, as she named it; the line on what each does is plain words —
 * all four hers, 28 Oct 2026.
 * Their grade shows a dash, not "not yet graded": nothing exists to grade.
 */
export const SEEKING: PlannedModule[] = rows(CONTENT, 'seeking').map(plannedModule('seeking'));

/**
 * Installed agents with no row (S32): a package that is a seat on the crew list, that the crew list lets appear at the
 * Commons, and that no row names. Core is not a seat, and Wellington's Commons level is "none", so today this is empty.
 */
export const INSTALLED_WITHOUT_ROW: InstalledModule[] = Object.entries(INSTALLED)
  .filter(([id]) => !SHELF.some((card) => card.packageName === `@waterbots/${id}`))
  .flatMap(([id, version]) => {
    const seat = SEATS.find((s) => s.id === id);
    if (!seat || seat.commons === 'none' || seat.commons === '') return [];
    return [{ key: `installed-${id}`, agent: seat.name, packageName: `@waterbots/${id}`, version, grade: null }];
  });
