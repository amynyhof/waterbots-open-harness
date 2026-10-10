# Carry bundle — gs4gg-carbon v0.16.1

**Built:** 2026-10-03, from the seal tag `calculator-seal-2026-10-03` (tag object `474fb52`), which sits on
`e9fd8b4`, the merge of PR #148. Built from the tag with `git show`, never from a working tree.
**Not pushed anywhere.** Amy carries it by hand (CARRY_RULES.md C1, C2).

## Install first

- **`@types/node`** — a public helper. The eight data-file tests read their JSON with `node:fs`, so a full
  typecheck needs Node's types. With it, plus `vitest` and `typescript`, the bundle counts as standing alone
  (the maintainer's ruling, 2026-10-03; CARRY_RULES C27).

## What is in it — 34 files, plus this manifest and two build records

- **32 files byte-for-byte from the tag:** the engine (`calculators/gs4gg-carbon/`, minus two tests, below), the
  parameter data files and their tests (`calculators/data/`), and `calculators/data/countries.ts`, which a carried
  test imports.
- **Two files written by the builder, not from the tag:**
  - `calculators/data/baseline-mix/countries.json` — a **labelled stub with no country data.** The real file mixes
    DHS data (cleared) with WHO data whose redistribution is not yet confirmed ([#234]). With the stub, every
    project falls back to the labelled screening preset. Replace it with the real file only once the WHO licence is
    confirmed (CARRY_RULES.md C17).
  - `sources/registry.yaml` — a filtered subset: only the 12 registry rows the carried data files cite, each row
    whole. No source document travels with it.
- SHA-256 of every file: `carry-hashes.sha256`. What the builder did: `_build-report.json`.

## What is left out, and why

- `calculators/gs4gg-carbon/quantity.test.ts` and `scenario.test.ts` — they reproduce a real filing. Never carries.
- `calculators/data/README.md` — general docs, not the calculator.
- The reference cases (`evals/`) — never carry.

## Checks run on this bundle (2026-10-03)

| Check | Result |
|---|---|
| Number gate, `node scripts/carry-number-gate.mjs` on this folder | **PASS** — no project figure, demo-project figure or identifying word |
| Short figures read by eye in `presets.ts` and `presets.test.ts` | rulebook values and invented round shares only |
| Tests in a clean folder with only `vitest` 2.1.9 and `typescript` 5.9.3 | **13 files, 84 tests passed** |
| Typecheck of the engine files alone, same clean folder | **pass** |
| Typecheck of every file, tests included | **pass with `@types/node` installed first** (above). Ruled standing alone, 2026-10-03. |

## Superseded

`..\superseded-v0.16.0\` is the old bundle. It is marked `DO-NOT-SEND.md` and kept, never deleted (C24).
