/**
 * The Agent Commons shelf — one entry per knowledge pack, assembled from the
 * registries that already exist. Item S18, slice 2, built 11 Sep 2026. From
 * 28 Oct 2026 the page draws them as a list of modules, one row each, with a
 * status and an owner, and a planned module after them.
 *
 * NOTHING IS TYPED TWICE. Phoebe's card reads her committed card sets
 * (src/lib/phoebeCards.ts); Calvin's three read the method pack registry
 * (src/lib/methodPacks.ts), one card per live pack, so a pack added to the
 * registry has a card here the same day; Bridget's names the map's two
 * datasets, which the licences module cites. The only words that live here
 * alone are the one line on what a pack is good at where no registry carries
 * one — Phoebe's and Bridget's — and Bridget's short tag.
 *
 * SHORT LINES AND SHORT NAMES, from slice 3 — maintainer's ruling, 11 Sep
 * 2026: ~~Calvin's lines were each pack's `measures` sentence and every tag
 * the citation's full document title~~, which ran a card to twice the drawn
 * height. Each pack now carries a `shelf` line and short name in the registry,
 * written once, and the card reads those.
 *
 * WELLINGTON HAS NO CARD. He carries no knowledge pack; the shelf says so in
 * one line at its foot rather than drawing an empty card for him.
 *
 * THE GRADE IS NULL ON EVERY CARD, AND ONLY ONE THING MAY EVER FILL IT.
 * Maintainer's rulings of 9 Sep 2026, canon: ONE GRADER — the grading rig
 * kept outside this repository is the only public grade, and this site's own
 * checks are internal gates, never a score; REAL ONLY — a grade comes from
 * real projects and real packs run through that rig, never an invented case.
 * Until a real card from that rig exists, every chip reads "not yet graded",
 * and slice 4 widens the type when the first one arrives. No mock grade,
 * ever.
 */

import { crewMember, type CrewMember } from './crew';
import { livePacks } from './methodPacks';
import { CRITERIA } from './phoebeCards';

/**
 * A MODULE'S STATUS AND OWNER — maintainer's ruling, 28 Oct 2026. Three
 * statuses only. The owner is WaterBots or "Partner pending", and never a
 * partner's name, until a partner owns a module and she says so.
 *
 * EVERY MODULE READS "In development" FOR NOW. "Shared module" says the same
 * agent and calculator run here and on waterbots.ai, and nothing in this
 * repository shows that yet: the open core is not installed here (item A21).
 * Each module's status is one word below, for her to move.
 */
export type ModuleStatus = 'Shared module' | 'In development' | 'Partner pending';
export type ModuleOwner = 'WaterBots' | 'Partner pending';

export interface ShelfCard {
  /** Stable key. The registry's own where it has one. */
  key: string;
  /** The agent whose face the card wears, and whose screen opens. */
  holder: CrewMember;
  /** The pack's name as the card's title. */
  title: string;
  /** One short line on what the pack is good at. */
  line: string;
  /** The document the pack is drawn from, by its short name. */
  tag: string;
  /** For a method pack, its registry key, so the calculator opens on it. */
  packKey?: string;
  status: ModuleStatus;
  owner: ModuleOwner;
  /**
   * The public grade. Null until a real card from the one public exam
   * exists — see the note at the head of this file. Slice 4 widens this.
   */
  grade: null;
}

/**
 * A module that is named on the Commons but has no agent and nothing to open
 * yet — maintainer's ruling, 28 Oct 2026. It carries no agent name and no
 * partner name, and no method until one is chosen.
 */
export interface PlannedModule {
  key: string;
  title: string;
  line: string;
  status: ModuleStatus;
  owner: ModuleOwner;
  grade: null;
}

const PHOEBE_CARD: ShelfCard = {
  key: 'phoebe-vwba-cards',
  holder: crewMember('Phoebe'),
  title: 'Eligibility and feasibility cards',
  line:
    'Whether a water project can count a volumetric water benefit, and what would make the ' +
    'case stronger.',
  /* "VWBA 2.0" — read from the first card's citation, as her pack tab reads it. */
  tag: CRITERIA[0].citation.document,
  status: 'In development',
  owner: 'WaterBots',
  grade: null,
};

const CALVIN_CARDS: ShelfCard[] = livePacks().map((pack) => ({
  key: `pack-${pack.key}`,
  holder: crewMember('Calvin'),
  title: pack.name,
  line: pack.shelf.line,
  tag: pack.shelf.document,
  packKey: pack.key,
  status: 'In development',
  owner: 'WaterBots',
  grade: null,
}));

const BRIDGET_CARD: ShelfCard = {
  key: 'bridget-map-datasets',
  holder: crewMember('Bridget'),
  title: 'The map’s two datasets',
  line: 'Where the world’s river basins are, and how stressed each one’s water is.',
  tag: 'HydroSHEDS · WRI Aqueduct 4.0',
  status: 'In development',
  owner: 'WaterBots',
  grade: null,
};

/** The shelf, in the order the maintainer approved on the picture of 9 Sep 2026. */
export const SHELF: ShelfCard[] = [PHOEBE_CARD, ...CALVIN_CARDS, BRIDGET_CARD];

/** Modules named but not yet open, listed after the shelf. Her words, 28 Oct 2026. */
export const PLANNED: PlannedModule[] = [
  {
    key: 'health-impact-guide',
    title: 'Health impact guide',
    line: 'Estimates the health benefits of water and sanitation projects.',
    status: 'In development',
    owner: 'Partner pending',
    grade: null,
  },
];

/**
 * The count line above the list, derived and never typed: how many modules,
 * and how many are graded. With every grade null it reads "none graded yet".
 */
export function shelfCountLine(rows: { grade: null }[] = [...SHELF, ...PLANNED]): string {
  const graded = rows.filter((c) => c.grade !== null).length;
  const modules = `${inWords(rows.length)} module${rows.length === 1 ? '' : 's'}`;
  const grades = graded === 0 ? 'none graded yet' : `${inWords(graded)} graded`;
  return `${modules} · ${grades}`;
}

const WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function inWords(n: number): string {
  return WORDS[n] ?? String(n);
}
