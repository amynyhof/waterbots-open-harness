# Changelog — product-shared

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
