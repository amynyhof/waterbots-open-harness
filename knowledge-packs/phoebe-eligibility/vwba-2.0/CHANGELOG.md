# Changelog — vwba-2.0

## 0.10.0 — 24 Sep 2026

- Corrected 25 Sep 2026: `tool/eligibility-worksheet.yaml` still said `pack.version: 0.9.0` after
  this release bumped the pack, so `scripts/check-tool.mjs` was failing on `main`. The line now
  says 0.10.0. Nothing else in the tool file changed, and no row, card or citation moved.

- `tool/README.md`, the agent-facing region: the record Phoebe reads first has five facts,
  not four — "What kind" is replaced by "What type" (the standard type Wellington confirmed,
  with its class for a drinking-water project) and "Stage" (on paper, being built, already
  running). Item A16's build; "what kind" retired the same day. Which pathway a project fits
  stays hers to find, never read from the type. Old wording, whole:

  > - **What kind** — one of three: a benefit to water in a basin, safe drinking
  >   water that stops people boiling, or not sure. One choice.

  and "The four facts you read first" / "Its four fields" / "one of the four facts" now say
  five. No card changed; the seal of 23 Sep 2026 is untouched.

## 0.9.0 — 24 Sep 2026

- `eligibility-worksheet@0.2.0` — the optional ninth key, `applies`, ruling R9 as amended
  24 Sep 2026: which projects a row exists for, read from the card's own "Applies to" line,
  absent meaning every project. **No row in this section carries it**, because the six
  criteria carry no such line and both applies cards say "every project asking about this
  pathway"; the `applies-to` list is written down with its one value so that the absence is
  stated rather than assumed. The README's `tool/` row now points at the file as this
  pack's section of the tool and its one home; `tool/README.md` and its agent-facing region
  are unchanged and stay until Phoebe's runtime step. No card changed.

## 0.8.0 — 24 Sep 2026

- **The tool definition file**, `tool/eligibility-worksheet.yaml`: this pack's section of
  the one eligibility worksheet, written to the tool definition contract of 24 Sep 2026
  (`PROPOSAL_knowledge-tab-and-tool-contract.md` §7). Eight rows — the two applies
  questions, then the six criteria in the manual's order — each citing its card by id and
  its routes by route card id, with the record fields the tool reads first, the closed
  lists of states it uses, and what it posts back. No card changed and no card wording is
  copied into it; it names cards. `tool/README.md` is unchanged, agent-facing region
  included, and is still what reaches Phoebe's prompt. Nothing reads the file yet; the gate
  `scripts/check-tool.mjs` holds it to the cards. `eligibility-worksheet@0.1.0`.

## 0.7.0 — 23 Sep 2026

- **A Phase line on every eligibility card**, the maintainer's addendum ruling of
  23 Sep 2026: all six *To start*; criterion 5 names the part kept up (running the
  tracking plan, Appendix E), which for a planned project shows in the preview block
  and is settled by consideration B-2. One paragraph on the design decision says what
  the tag means. The lines reach Phoebe's prompt; measured run on the pull request.
  No rule or evidence list changed. Item A18.


## 0.6.0 — 23 Sep 2026

- **A fourth card set, `cards/applies-cards-vwba.md`.** The two applies cards, W1 and
  W2, graded "passes as redrafted" after their "If the answer is no" sections were
  redrafted under the guide-not-gate rule, moved in whole; their grader notes
  appended to `cards/grader-notes.md`. Nothing reads the set yet. K7 stop 1 passed.


## 0.5.0 — 23 Sep 2026

- **"Can it be fixed?" on every eligibility card.** One labelled paragraph after
  "The rule in plain words" on each of the six cards, graded "ships as written" at
  the root the same day: five *yes*, and criterion 4 *depends* on whether the
  sponsor is legally obliged, with the card's two carve-outs kept reachable. It is
  the only place the word Blocked can come from; Phoebe reads it and never
  decides it. The paragraphs reach her prompt through the regenerated card module;
  the measured run is on the pull request. The draft's grader notes are in
  `cards/grader-notes.md`. Item A18, step 3.
- **A third card set, `cards/routes-cards-vwba.md`.** Nine cited routes, R-1 to
  R-9, each two or three short sentences resting on a guidebook page, and R-8 also
  on the Meta 2023 report's Navajo Community Water Supply project, its canonical
  address confirmed by the maintainer at the grade. Moved in whole from the root
  draft on her word; nothing reads it until the routes reader is built (step 5).
  Its grader notes are in `cards/grader-notes.md`. Item A18, step 4, water half.

## 0.4.5 — 23 Sep 2026

- **The design decision is replaced: a guide, not a gate.** The maintainer's
  ruling of 23 Sep 2026 (item A18) supersedes the hard gate of 20 Aug 2026 at the
  head of `cards/eligibility-cards-vwba.md`. No card changed; the six criteria and
  their evidence lists are as they were. The relay's generated copy was rebuilt,
  so the new paragraph reaches Phoebe's prompt; it tells her the worksheet keeps
  its three states until the build lands, so her behaviour today is unchanged.
  Measured run reported on the pull request. Under the no-strikes rule of the same
  day the old wording is kept here, whole:

  > ## Design decision — hard gate, with solutions
  >
  > **Maintainer's ruling, 20 Aug 2026.** The Gatekeeper treats all six criteria
  > as absolute. Miss one and the project is not eligible. There is no weighting,
  > no partial credit, and no averaging across criteria.
  >
  > **Every "not yet" has to arrive with a route forward.** A verdict that only
  > reports failure is not an acceptable output. Whenever the Gatekeeper finds a
  > criterion unmet, it states what would change that — the specific evidence,
  > document, consultation, or design change that would move the project from
  > *not yet* to *met*. The gate is hard; the posture is not.
  >
  > This resolves the wording tension noted at the foot of this file — Appendix A
  > reads as mandatory, the Step 2.3 summary box reads softer, and Figure 3 is
  > absolute. The build follows Figure 3.

- **README, old wording kept here** from 0.4.4's correction: the head line read
  "This folder is the one home of what Phoebe knows." and the not-covered line
  read "Any standard other than VWBA 2.0. Gold Standard's methodology lives in
  Calvin's packs, not here." Both now carry only the current text.

## 0.4.4 — 22 Sep 2026

- **README points at the sibling pack.** The line saying Gold Standard's
  methodology lives only in Calvin's packs is struck and corrected: its
  eligibility pack is `../gs-paa-v2.0/`, a scaffold, not live. Docs only; no
  card, no reader, no prompt changed. Item K7, step 1.

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
