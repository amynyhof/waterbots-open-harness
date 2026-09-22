# Changelog — vwba-2.0

## 0.4.3 — 21 Sep 2026

- **Her scope is a fact she phrases.** The maintainer's ruling at eyeball stop 4:
  her prompt gains "What you check today, and what is coming" — today she checks
  eligibility under VWBA 2.0 only; carbon eligibility is a second pathway, coming
  and not live, with no carbon cards; a project may qualify on one pathway and not
  the other, so "eligible" from her never means eligible everywhere. Facts only, in
  her own words, on the ruling of 3 Sep 2026. Line 7 of the contract table carries
  it in one line. Four checks in `check-wellington` (136), two of them holding that
  the A6 instrument stays out of both relays. No card changed.

## 0.4.2 — 21 Sep 2026

- **Contract table refreshed for steps 4 and 5; the measured run written down.** Line 8,
  hands back, reads yes: her answer carries `handBack`, `none` or `wellington`, checked
  against that closed list by the relay and the client, and the console draws the way
  back from the field alone. Lines 4 and 5 read yes: her prompt walks the six rows in
  the manual's order from the first unchecked, one row, one question, and under any turn
  that moved a row the console draws one line from her verdicts. `evals/README.md` now
  says how the measured run and the measured walk are done and what the bar is — an
  internal gate, one paragraph, no score. The A6 diagnostic switch left her relay. No
  card changed. Item A15, steps 4 to 6.

## 0.4.1 — 21 Sep 2026

- **Contract table refreshed for step 3.** Line 3, sees its tool's state, reads yes:
  the six rows go with every ask from the console and the Commons seat and come
  back as "What the worksheet shows" after the cache breakpoint, each verdict
  marked as her own from earlier in the conversation. Line 10 reads yes. Line 9
  moves: her verdicts are the record's eligibility section, read back to her and
  carried on the seal; Wellington's reading of it is named, not built. No pack
  content changed. Item A15, step 3.

## 0.4.0 — 21 Sep 2026

- **What Phoebe is told about her tool, from this pack.** `tool/README.md` gains a
  region between AGENT-FACING markers, generated into `api/_tool.generated.ts` by
  `build-prompt-modules` and embedded in her prompt as "Your tool": one tool, the
  eligibility worksheet; six rows in the manual's order; the three states a row
  takes and the route forward; where a row's value comes from; the four record
  fields she reads first, what each takes and where it comes from; ask for
  everything when no record comes; say what settled a row. Contract lines 2 and 10.
  Her prompt also says her level, screen, held to the roster by `check-roster`,
  and that Wellington leads. Lines 2 and 7 read yes; 8 and 10 move. Item A15, step 2.

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
