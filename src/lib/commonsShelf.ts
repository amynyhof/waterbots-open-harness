/**
 * The Agent Commons shelf — one card per knowledge pack, assembled from the
 * registries that already exist. Item S18, slice 2, built 11 Sep 2026.
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
  /**
   * The public grade. Null until a real card from the one public exam
   * exists — see the note at the head of this file. Slice 4 widens this.
   */
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
  grade: null,
};

const CALVIN_CARDS: ShelfCard[] = livePacks().map((pack) => ({
  key: `pack-${pack.key}`,
  holder: crewMember('Calvin'),
  title: pack.name,
  line: pack.shelf.line,
  tag: pack.shelf.document,
  packKey: pack.key,
  grade: null,
}));

const BRIDGET_CARD: ShelfCard = {
  key: 'bridget-map-datasets',
  holder: crewMember('Bridget'),
  title: 'The map’s two datasets',
  line: 'Where the world’s river basins are, and how stressed each one’s water is.',
  tag: 'HydroSHEDS · WRI Aqueduct 4.0',
  grade: null,
};

/** The shelf, in the order the maintainer approved on the picture of 9 Sep 2026. */
export const SHELF: ShelfCard[] = [PHOEBE_CARD, ...CALVIN_CARDS, BRIDGET_CARD];

/**
 * The count line above the cards, derived and never typed: how many packs,
 * and how many are graded. With every grade null it reads "none graded yet".
 */
export function shelfCountLine(cards: ShelfCard[] = SHELF): string {
  const graded = cards.filter((c) => c.grade !== null).length;
  const packs = `${inWords(cards.length)} knowledge pack${cards.length === 1 ? '' : 's'}`;
  const grades = graded === 0 ? 'none graded yet' : `${inWords(graded)} graded`;
  return `${packs} · ${grades}`;
}

const WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function inWords(n: number): string {
  return WORDS[n] ?? String(n);
}
