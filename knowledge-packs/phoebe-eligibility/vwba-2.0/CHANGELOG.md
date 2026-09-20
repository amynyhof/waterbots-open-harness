# Changelog — vwba-2.0

## 0.3.0 — 20 Sep 2026

- **The grader notes left the card files.** Item K10, part 2, by the maintainer's
  ruling of 20 Sep 2026 (R2). The "Notes for the grader" section at the foot of
  each card file, and the 31 Aug correction block under the eligibility file's
  naming table, moved to `cards/grader-notes.md`: 155 lines out, none added,
  every line carried whole. The status line, the design decision and the source
  table stay. The relay's copy was regenerated: the two exported strings shrank
  by exactly the moved text, 6,358 and 4,453 characters, and by nothing else.
  `check-cards` passes; the Tool and Knowledge pack tabs capture identical
  before and after. Nothing reads the new file.

## 0.2.1 — 20 Sep 2026

- **"The contract" on the README.** A nine-row table of where Phoebe stands
  against the specialist contract in AGENT_RULES.md, the maintainer's ruling of
  20 Sep 2026: one yes, seven partly, one no. No card changed. Item A15.

## 0.2.0 — 17 Sep 2026

- **The pack is the cards' one home.** Maintainer's ruling. Both card files
  moved here from the repository root with `git mv`, so their history is kept.
  Not one word inside them changed. Old paths: `eligibility-cards-vwba.md` and
  `feasibility-cards-vwba.md` at the root. New: `cards/` in this folder.
- Every reader followed the move: `src/lib/phoebeCards.ts`,
  `scripts/check-cards.mjs`, `scripts/build-prompt-modules.mjs`. The relay's
  copy in `api/_cards.generated.ts` was regenerated and its two exported
  strings are byte for byte what they were.
- The two pointer tools, `eligibility@0.1.0` and `feasibility@0.1.0`, are
  retired. Their citation tables folded into this folder's README.
- First pack in the new shape: `cards/`, `tool/`, `evals/`, `README.md`,
  `CHANGELOG.md`.

## 0.1.0 — 16 Sep 2026

- Two pointer tools, `eligibility` and `feasibility`, each pointing at a card
  file at the repository root. No card body copied into the pack.
