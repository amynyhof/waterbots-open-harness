# Changelog — product-shared

## 0.4.0 — 23 Sep 2026

- `project-types.md` joins: the cited list of project types Wellington will match a
  visitor's project to — twenty VWBA activity types (Appendix C, Table C-1,
  pp. 37–39), four Gold Standard safe-water technology classes (GS4GG PAA M400-12
  V2.0, Table 2, pp. 6–7; Table 3, p. 9) and "none of these", one plain sentence
  each. Drafted at the repository root on 23 Sep 2026, graded by the maintainer the
  same day ("ships, one edit": the "not ruled out" note cited as Appendix C,
  pp. 37–39, the note itself on p. 39), and moved here whole. Items A16 and A18.
- It follows the roster rule, her word: carried by her hand to the paid repository,
  which becomes its source; never edited here after that; a build-time check to
  follow at item A16's build. Nothing reads it yet.
- The grader notes that sat at the foot of the draft, kept here so the file holds
  only the list: (1) twenty-four types and not twenty, because the two standards
  sort on different axes — a borehole project is C-11 or C-19 on the water axis and
  CWS on the carbon axis — and folding the classes into C-19 would lose the class
  that decides the carbon rows; (2) C-11 and C-19 overlap on purpose, as the
  guidebook lists well construction and household connections under both, and the
  applies card W2 handles which row a project takes; (3) page numbers follow the
  untracked activity draft's per-row citations, checked against the local copy's
  footers, and the definitions are rewrites, nothing quoted; (4) the check that
  holds this site to the paid copy is built at the proposal's step 5, on the
  `check-roster` pattern, checked and never generated.

## 0.3.0 — 18 Sep 2026

- `roster.yaml` joins, carried whole from production by the maintainer's hand and
  never edited here. It is the one crew list for both sites: ten seats, three doors,
  the levels each door allows, and whether each seat is built there. Item A13.
- `scripts/check-roster.mjs` reads it in front of every build and fails the build,
  naming the line, when `src/lib/crew.ts`, the Commons shelf, the primer's crew
  facts or Wellington's people sentence disagree with it. "unconfirmed" passes.
- The README's roster table is struck and points at the file. It had drifted:
  Bridget's label read "Map" where the roster's seat is "Partners".

## 0.2.0 — 17 Sep 2026

- `agent-primer.md` moved in from the repository root, history kept. Maintainer's
  ruling of 17 Sep 2026: the shared pack is the primer's one home. Both generated
  strings byte-identical before and after; the generator's `Sources:` header lines
  are the only change to the relay. The primer's own six links climb two levels.

## 0.1.0 — 16 Sep 2026

- Stub for the open free pathway, roster, and phase names.
- No `tools/` folder, by design.
