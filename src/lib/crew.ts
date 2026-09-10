/**
 * The crew, as the right column lists it — one home for the roster's four.
 *
 * MOVED OUT OF CrewRail.tsx on 11 Sep 2026 (item S18, slice 2), where it had
 * lived since the desk took the production shape on 2 Sep. The Agent Commons
 * shelf lists the same four faces in its own right column and its cards wear
 * them, and a second copy of the roster would be the drift the one-home rule
 * exists to prevent. The rail and the shelf both read this; nothing types a
 * name, a role or a token twice.
 *
 * FOUR AGENTS, AND THE ROSTER IS THE BOOK'S. Wellington and Bridget are the
 * shared crew, Phoebe and Calvin extend it under BRAND.md §6. Nobody is
 * minted here. Each row's identity colour is read from its token, never
 * re-typed (§6), and whether the accent may carry the name as text is
 * recorded beside it, measured — Surf is 2.04:1 on white and never carries
 * text, so Bridget's name is set in ink wherever it appears.
 */

import bridgetPortrait from '../../brand/assets/bots/bridget.svg';
import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import type { Surface } from './surfaces';

export interface CrewMember {
  name: string;
  role: string;
  portrait: string;
  /** The identity token, read and never re-typed. */
  token: string;
  /** Whether the accent clears 4.5:1 on white and may carry the name as text. */
  nameInAccent: boolean;
  /** The console surface the member's row opens. */
  surface: Surface;
}

export const CREW: CrewMember[] = [
  {
    name: 'Wellington',
    /* "Team Lead" — maintainer's naming ruling, 2 Sep 2026. */
    role: 'Team Lead',
    portrait: wellingtonPortrait,
    token: '--bot-wellington',
    nameInAccent: true,
    surface: 'desk',
  },
  {
    name: 'Phoebe',
    role: 'Eligibility',
    portrait: phoebePortrait,
    token: '--bot-phoebe',
    nameInAccent: true,
    surface: 'eligibility',
  },
  {
    name: 'Bridget',
    role: 'Map',
    portrait: bridgetPortrait,
    token: '--bot-bridget',
    /* Surf is 2.04:1 on white and never carries text. */
    nameInAccent: false,
    surface: 'map',
  },
  {
    name: 'Calvin',
    role: 'Calculator',
    portrait: calvinPortrait,
    token: '--bot-calvin',
    nameInAccent: true,
    surface: 'quantification',
  },
];

/**
 * A member by name. Throws rather than returning nothing: a card on the
 * shelf that named an agent not on the roster would be a fabricated face,
 * and the page should fail to load before it shows one.
 */
export function crewMember(name: string): CrewMember {
  const member = CREW.find((m) => m.name === name);
  if (!member) throw new Error(`No crew member is named "${name}". The roster is src/lib/crew.ts.`);
  return member;
}
