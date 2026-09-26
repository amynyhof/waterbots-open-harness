# Changelog — gs-paa-v2.0

## 0.8.0 — 25 Sep 2026

- **Phoebe reads this pack.** Build-order step 3, pull request B: its three approved sets — the four
  applies cards, the thirty-two eligibility cards, the nineteen routes — are generated into her
  relay and staged like the water pack's. The applies cards are at the door of every visit; the rest
  arrive once this pathway applies, and never when it does not.
- **The runtime reads `tool/eligibility-worksheet.yaml`.** The rows she asks here, the class and
  version that sort them, the five row states, the pathway states and the readiness read all come
  from the tool file through the generated model. Nothing about a card changed.
- `tool/README.md` rewritten to say where the tool is defined and what reads it. It had said the
  agent-facing region would arrive at proposal step 8; that region never arrives, because the region
  on the water pack's page retired the same day and the tool file is the one home. Old wording of
  that paragraph:

  > ## What Phoebe will be told about this section
  >
  > An agent-facing region, between markers the generator recognises, arrives at proposal
  > step 8 and not before: the carbon section, its rows, what each takes, where its value
  > comes from, and the rule the maintainer gave on 22 Sep 2026 (R4) that questions are
  > written to cover both pathways whenever one answer can, that a verdict covers every row
  > the answer settles, and that when a pathway drops out she says so and continues with the
  > other. **There is no such region on this page today**, so nothing here reaches her prompt.

  That rule of 22 Sep 2026 is not lost: it is in her prompt from this release, under the
  applies tests.

## 0.7.0 — 24 Sep 2026

- `eligibility-worksheet@0.2.0` — the optional ninth key, `applies`, ruling R9 as amended
  24 Sep 2026. Six rows carry it — M2, M3, M4, M8, M9 and M16, the rows a technology class
  limits — and the other thirty say "every project" by carrying no key at all. The values
  are card T3's four classes and card T4's two version flags, and `scripts/check-tool.mjs`
  derives the expected value from each card's "Applies to" line and holds the file to it.
- **Three route cards to draft after v1 are logged on this page**: T1's and M2's change of
  pump drive, and M14's justified sub-national area. Each is a fix a card describes that no
  route card carries; the tool file names no route on those rows and says so in a comment.
  Nothing about the sealed card sets changes — a route card would be an addition.
- The README's `tool/` row now points at the file as this pack's section of the tool and
  its one home. No card changed.

## 0.6.0 — 24 Sep 2026

- **The tool definition file**, `tool/eligibility-worksheet.yaml`: this pack's section of
  the one eligibility worksheet, the same tool id as the water pack's file and its own
  `section`. Thirty-six rows in the card files' order — the four applies questions, then
  M1–M17, P1–P2 and G1–G13 — each citing its card by id, its routes by route card id, and
  carrying the phase and the "Can it be fixed?" value its card carries. Eleven cited
  documents, each held equal to its row of this README's tables. A fourth closed list,
  the version flag card T4 sets. No card changed and no card wording is copied into it.
  Nothing reads the file yet, and nothing in this pack is live.
  `eligibility-worksheet@0.1.0`.

## 0.5.0 — 23 Sep 2026

- **The routes set is approved and in the pack**: `cards/routes-cards-gs.md`, R-1 to R-19,
  approved as written on the maintainer's word; moved here whole from the root draft. Its
  grader notes are appended to `cards/grader-notes.md`. All three card sets this pack needs
  are now approved and in the folder. Nothing reads any of them until the pack-keyed reader
  and gate are built (K7 proposal, step 5). K7 step 4, carbon half, done.

## 0.4.0 — 23 Sep 2026

- **The framework and general set is approved and in the pack**: P1–P2 and G1–G13 graded
  "all pass as drafted" and appended to `cards/eligibility-cards-gs.md` as part two, so
  all 32 rows of the carbon pathway sit in one file; their sources table and grader notes
  travel with them (notes to `cards/grader-notes.md`). Nothing reads the file yet. K7 stop
  3 passed.
- **The nineteen carbon routes drafted** at the repository root as `routes-cards-gs-DRAFT.md`,
  cited only from the methodology, the documents it names as binding, or a held published
  project, for her grade. K7 step 4, carbon half.


## 0.3.0 — 23 Sep 2026

- **The methodology set is approved and in the pack**: `cards/eligibility-cards-gs.md`, M1
  to M17, graded "all 17 pass" with two conditions met before the move — the WHO and JMP
  pages on M3, M4, M5 and M7 confirmed on the publishers' sites (the scheme report's page
  dates it 18 March 2026, corrected on M3 and on the README), and the Blocked cases on M5,
  M12, M13 and M14 carried to the reviewer as Q11 (item O14). Every card gains a **Phase**
  line under her addendum ruling of the same day: sixteen *To start*, M17 *To remain
  eligible*, eight with a *Kept up by* clause. Grader notes to `cards/grader-notes.md`.
  Nothing reads the set yet. K7 stop 2 passed.
- **The fifteen framework and general cards, P1–P2 and G1–G13, drafted** at the repository
  root as `eligibility-cards-gs-framework-DRAFT.md`, tagged, for her grade at K7 stop 3.


## 0.2.0 — 23 Sep 2026

- **The applies set is approved and in the pack**: `cards/applies-cards-gs.md`, T1 to
  T4, graded "passes as redrafted" after the "If the answer is no" sections were
  redrafted under the guide-not-gate rule, with one addition on T4 in the
  maintainer's words: for a transitioning project, a transition-assistance module,
  overseen by trusted consultants, is coming to the paid site, and the visitor can
  save the project and sign up for access. Its grader notes are in
  `cards/grader-notes.md`, a new file. Nothing reads the set yet. K7 stop 1 passed.
- **The seventeen methodology cards, M1 to M17, drafted** at the repository root as
  `eligibility-cards-gs-DRAFT.md`, each with "Can it be fixed?", "Applies to" and
  "External standard", for her grade at K7 stop 2. Not in this pack until then.


## 0.1.0 — 22 Sep 2026

- **Scaffold.** The pack folder in the ruled shape: README, this file, `cards/` with a
  note and no cards, `tool/` and `evals/` READMEs. Nothing on the live site reads it;
  no card is approved; Phoebe's prompt is unchanged. The README carries the cited
  documents, the twelve Gold Standard pages for fourteen documents confirmed on
  22 Sep 2026 and the three WHO and JMP pages still to confirm, and the timing
  facts the standard fixes. Item K7, proposal step 1, on the maintainer's rulings of
  22 Sep 2026.
- **Six applies cards drafted**, four for this pack and two for `vwba-2.0`, as
  untracked `-DRAFT` files at the repository root for the maintainer's grade. Step 2.
  They move into `cards/` on her word and not before.
