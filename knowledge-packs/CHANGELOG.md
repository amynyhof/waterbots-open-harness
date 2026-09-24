# Changelog — knowledge-packs tree (open)

Semver for this folder tree. Seat and tool versions live in their own changelogs.
When a tool changes, the seat changelog cites `tool-id@version`.

## 0.16.0 — 24 Sep 2026

- **The agent primer is swept clean of struck text and date stamps**, and Wellington's region
  loses the stamp that carried a person's name. `product-shared@0.5.0`. The maintainer's
  ruling of 24 Sep 2026 on `PROPOSAL_wellington-prompt-trim.md`; the old wording, whole, is
  in that pack's CHANGELOG. No card set changed; the seal of 23 Sep 2026 is untouched.

## 0.15.0 — 24 Sep 2026

- **The tool definition contract gains its one optional key**, `applies`, ruling R9 as
  amended 24 Sep 2026: which rows exist for a project's technology class or version, read
  from the card's own "Applies to" line, absent meaning every project. It is what lets the
  tool file say which rows this project has, the row states say what is done and what is
  left, and the agent ask only what is left. `phoebe-eligibility@0.11.0`
  (`vwba-2.0@0.9.0`, `gs-paa-v2.0@0.7.0`), `eligibility-worksheet@0.2.0` in both packs.
  `scripts/check-tool.mjs` holds the key to the card the way it already holds a row's
  title, its fixability and its phase. No card set changed; the seal of 23 Sep 2026 is
  untouched.

## 0.14.0 — 24 Sep 2026

- **Both of Phoebe's packs carry a tool definition file**, the contract of 24 Sep 2026:
  `phoebe-eligibility/vwba-2.0/tool/eligibility-worksheet.yaml@0.1.0` and
  `phoebe-eligibility/gs-paa-v2.0/tool/eligibility-worksheet.yaml@0.1.0` — one tool, two
  sections, one file each. Forty-four rows between them, every one citing its card by id.
  `scripts/check-tool.mjs` is the gate and runs with the other checks. No card set changed,
  so the seal of 23 Sep 2026 is untouched. Packs at `vwba-2.0@0.8.0` and
  `gs-paa-v2.0@0.6.0`.

## 0.13.0 — 23 Sep 2026

- **Every card set on the free site is sealed at its version on this date**, the maintainer's
  ruling of 23 Sep 2026, "V1 — the done line" (BUILD_PLAN.md). No card in a sealed set changes,
  and no card is added, until a real project fails on one; a tool README's or seat README's
  wording may still be corrected without touching the cards themselves. The sealed sets, by
  their version today: `phoebe-eligibility@0.10.0` (`vwba-2.0@0.7.0`, `gs-paa-v2.0@0.5.0`).
  Parked until after v1, untouched by the seal because none of them is a live card set today:
  the two draft water card sets at the root (activity types, the glossary), the Reggie, Monty
  and Audrey packs, D-4, D-6.

## 0.12.0 — 23 Sep 2026

- **The nineteen carbon routes approved and in the pack.** `phoebe-eligibility@0.10.0`
  (`gs-paa-v2.0@0.5.0`): `routes-cards-gs.md`, R-1 to R-19, moved whole from the root
  draft, approved as written. All three carbon card sets are now in the folder; nothing
  reads any of them yet. Item K7, step 4 (carbon half) done.
- **A stale version footer corrected on the tree README.** It closed with "Tree v0.5.1",
  left over from before the pack-shape rewrite, against a head that already read 0.11.0.
  Old wording, whole, under the no-strikes rule: `## Version` followed by `Tree **v0.5.1**.
  See [CHANGELOG.md](./CHANGELOG.md).` Replaced with a line pointing at this changelog
  once, no second number.

## 0.11.0 — 23 Sep 2026

- **All 32 carbon eligibility cards approved.** `phoebe-eligibility@0.9.0`
  (`gs-paa-v2.0@0.4.0`): P1–P2 and G1–G13 appended to the methodology set; the nineteen
  carbon routes drafted at the root. Nothing reads the carbon pack yet. Item K7.

## 0.10.0 — 23 Sep 2026

- **Phase tags, and the methodology set approved.** `phoebe-eligibility@0.8.0`
  (`gs-paa-v2.0@0.3.0`, `vwba-2.0@0.7.0`): every eligibility card on both pathways carries
  a Phase line, *To start* or *To remain eligible*; M1–M17 approved and in the carbon pack;
  the framework cards drafted at the root. Items K7 and A18.

## 0.9.0 — 23 Sep 2026

- **The applies sets are approved, both packs.** `phoebe-eligibility@0.7.0`
  (`gs-paa-v2.0@0.2.0`, `vwba-2.0@0.6.0`): four carbon and two water applies cards in
  their packs, graded 23 Sep 2026; the seventeen methodology cards drafted at the root.
  Nothing reads the applies sets yet. Item K7.

## 0.8.0 — 23 Sep 2026

- **Fixability and routes on the water pack.** `phoebe-eligibility@0.6.0`
  (`vwba-2.0@0.5.0`): every eligibility card carries "Can it be fixed?", and the nine
  water routes are a third card set, both approved by the maintainer on 23 Sep 2026.
  The routes are not read yet. Item A18.

## 0.7.0 — 23 Sep 2026

- **The project-type list lives in the shared pack.** `product-shared@0.4.0`:
  `project-types.md`, twenty-five cited lines, graded and approved by the maintainer
  on 23 Sep 2026, on the roster rule. Nothing reads it yet. Items A16 and A18.

## 0.6.1 — 23 Sep 2026

- **A guide, not a gate.** `phoebe-eligibility@0.5.1` (`vwba-2.0@0.4.5`): the hard-gate
  design decision at the head of the eligibility cards struck and corrected in place on
  the maintainer's ruling of 23 Sep 2026; the rule's home is AGENT_RULES.md. No card
  changed. Item A18.

## 0.6.0 — 22 Sep 2026

- **The first seat with two packs.** `phoebe-eligibility@0.5.0` (`gs-paa-v2.0@0.1.0`,
  `vwba-2.0@0.4.4`): Gold Standard's safe-water carbon methodology gets its own
  eligibility pack beside the water one, in the ruled shape, as a scaffold with no
  approved card and no reader. Docs only; the live site is unchanged. Item K7, steps 1
  and 2, on the maintainer's rulings of 22 Sep 2026.

## 0.5.1 — 21 Sep 2026

- **Phoebe sees her worksheet.** `phoebe-eligibility@0.4.1` (`vwba-2.0@0.4.1`):
  contract lines 3 and 10 read yes on the pack README; the rows travel with every
  ask and come back as a block. Docs on the pack; the change is in the relay and
  the shell. Item A15, step 3.

## 0.5.0 — 21 Sep 2026

- **Phoebe is told about her tool from her pack.** `phoebe-eligibility@0.4.0`
  (`vwba-2.0@0.4.0`): the tool README gains an agent-facing region, generated into
  her prompt under the staleness gate. Contract lines 2 and 7 read yes; 8 and 10
  move. Item A15, step 2.

## 0.4.0 — 20 Sep 2026

- **The grader notes left Phoebe's card files.** `phoebe-eligibility@0.3.0`
  (`vwba-2.0@0.3.0`): the notes to the maintainer moved whole to
  `cards/grader-notes.md`, which nothing reads. Her prompt shrank by 10,811
  characters and not one card changed. Item K10, part 2; item A15, step 1.

## 0.3.1 — 20 Sep 2026

- **Every seat pack README carries "The contract".** `phoebe-eligibility@0.2.1`
  (`vwba-2.0@0.2.1`), `calvin-quantify@0.1.1`, `bridget-map@0.1.1`: a nine-row table
  of where each agent stands against the specialist contract in AGENT_RULES.md,
  the maintainer's ruling of 20 Sep 2026. Docs only. Item A15.

## 0.3.0 — 18 Sep 2026

- **The roster lives in the shared pack.** `product-shared@0.3.0`: `roster.yaml`,
  carried from production and never edited here, is the one crew list; a build-time
  check holds this site to it. Item A13.

## 0.2.0 — 17 Sep 2026

- **Phoebe's pack is the cards' one home.** `phoebe-eligibility@0.2.0`,
  `vwba-2.0@0.2.0`. Her two card files moved in from the repository root; the
  live site reads them from the pack. First pack wired.
- **New pack shape is the rule going forward**, one pack at a time:
  `<standard>/` with `cards/`, `tool/`, `evals/`, `README.md`, `CHANGELOG.md`.
  Other packs stay in the old shape until their own briefs.

## 0.1.0 — 16 Sep 2026

- First public-safe scaffold of the open tree.
- Seat packs: `product-shared`, `wellington-host`, `phoebe-eligibility`,
  `bridget-map`, `calvin-quantify`, `reggie-library`.
- Not wired. The live site still reads cards, method packs, and map data from
  their existing paths.
