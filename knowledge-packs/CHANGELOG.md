# Changelog — knowledge-packs tree (open)

Semver for this folder tree. Seat and tool versions live in their own changelogs.
When a tool changes, the seat changelog cites `tool-id@version`.

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
