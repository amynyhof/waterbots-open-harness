# Carry bundle manifest — gs4gg-carbon calculator to the open site

**Prepared:** 2026-09-26. **Not pushed anywhere.** This folder is untracked (not committed, not
added to git) and staged locally only, per the instruction that produced it.

**Seal:** `calculator-seal-2026-09-26`, on `main` at `1a0ff87bbe270ec78f18819825a5f42b2fb818f4`
(the merge of PR #137). Tag object: `119164eb31ad41c202b5ccaf7a9b02bcdc480fea`. This tag names
**gs4gg-carbon v0.16.0** as the version that carries. Full tag message: `git tag -l
calculator-seal-2026-09-26 --format="%(contents)"`.

**Rule applied:** the seal's own text — "the engine and synthetic fixtures. Nothing else." — plus
one exclusion named by Amy on 2026-09-26 (below). Every file below is copied byte-for-byte from
`main` at the seal commit, **with one named exception** — the household-size data file, corrected
in this bundle only; see *Corrected in this bundle*, below.

**Updated 2026-09-27:** a filtered `sources/registry.yaml` subset added (12 rows, the ones the
carried parameter data actually cite); the household-size coverage text corrected; this manifest's
own last-section wording corrected (it named the wrong folder name).

---

## Carried — 32 files

### The engine (`calculators/gs4gg-carbon/`)

| SHA-256 | File |
|---|---|
| `191fb50c…942fc1bd14` | `calculators/gs4gg-carbon/baseline-ef.test.ts` |
| `b70ef795…f134416738` | `calculators/gs4gg-carbon/baseline-ef.ts` |
| `0ba0ae28…400cd19497` | `calculators/gs4gg-carbon/emissions-legacy.test.ts` |
| `d4f3d94b…37834de30d` | `calculators/gs4gg-carbon/emissions-legacy.ts` ⚠ see *Flagged*, below |
| `69d9e7b4…6ffde7e1b4` | `calculators/gs4gg-carbon/emissions-paa-v2.test.ts` |
| `10d0af10…2e51ebd849` | `calculators/gs4gg-carbon/emissions-paa-v2.ts` |
| `660ad5e3…8067a239d6` | `calculators/gs4gg-carbon/fallback.ts` |
| `e5fec9b3…d125ccd7e5` | `calculators/gs4gg-carbon/presets.test.ts` |
| `a0bef888…2ec73632f4` | `calculators/gs4gg-carbon/presets.ts` — **named to cross by Amy, 2026-09-26**; see *Flagged* |
| `dde70a01…fea09e09d0` | `calculators/gs4gg-carbon/quantity.ts` |
| `a1675a23…f912b7233c` | `calculators/gs4gg-carbon/scenario.ts` |
| `601fce91…79f3e5c957` | `calculators/gs4gg-carbon/table9.test.ts` |
| `04bf2e1b…47331a5cca` | `calculators/gs4gg-carbon/table9.ts` |
| `44b80928…2584cf6178` | `calculators/gs4gg-carbon/types.ts` |
| `88c563b3…864646be78` | `calculators/gs4gg-carbon/version.ts` |

### Parameter data files (`calculators/data/`), each with its own citations

| SHA-256 | File |
|---|---|
| `04514c9e…9ec9f81edf` | `calculators/data/age-shares/countries.json` |
| `8ae00453…e6b03a0731` | `calculators/data/age-shares/countries.test.ts` |
| `62e0cc5e…bfe3d38d55` | `calculators/data/daf/countries.json` |
| `fbe4b892…9c52ea3697` | `calculators/data/daf/countries.test.ts` |
| `5f3fdcf8…9bec4d0667` | `calculators/data/embodied/factors.json` |
| `22447d3f…291636bc09` | `calculators/data/embodied/factors.test.ts` |
| `68c9bebc…c726853e91` | `calculators/data/fnrb/countries.json` |
| `d3948984…830db60fc2` | `calculators/data/fnrb/countries.test.ts` |
| `c4744f7b…b547e7125a` | `calculators/data/household-size/countries.json` ⚠ **edited for this carry** — see *Corrected in this bundle*, below |
| `a4aa3ad7…7b0edafc66` | `calculators/data/household-size/countries.test.ts` |
| `eeb9d398…f1aede8546` | `calculators/data/legacy/defaults.json` |
| `09929497…4188120b98` | `calculators/data/legacy/defaults.test.ts` |
| `5f30d9e6…2804625f5f` | `calculators/data/paa/fuel-factors.json` |
| `e87cae8d…dbc8d1fdfd` | `calculators/data/paa/fuel-factors.test.ts` |
| `579afe5c…11bf61f6fe` | `calculators/data/regions/un-m49.json` |
| `a80fd731…7ca26a0970` | `calculators/data/regions/un-m49.test.ts` |

*(Full 64-char hashes: see `carry-hashes.sha256` in this folder, generated the same way —
`sha256sum` over every file, run from the repo root.)*

### The registry (`sources/`), a filtered subset — added 2026-09-27, rights updated 2026-09-27 (three times)

| SHA-256 | File |
|---|---|
| `0362079a…e08573f4a6` | `sources/registry.yaml` |

One file, twelve rows — every `registrySources` id any carried `calculators/data/*.json` file
cites, and nothing else. Checked by reading every `registrySources` field (top-level, `ruleUpdate`,
and per-vintage) in all eight carried data files, not assumed from a list: `a64-amt-009-fnrb`,
`cdm-tool33`, `gs-429-1-ertool-cws`, `gs-429-v1-methodology`, `gs-429-v2-methodology`,
`gs-429-v2-si`, `gs-457-daf`, `mofuss-adm0-zenodo-18865904`, `mofuss-fnrb-2024`, `un-hh-size-2022`,
`un-wpp-2024-pop-age1`, `unsd-m49` — twelve found, twelve given, nothing missing either way. Each
row is the FULL block copied verbatim from `sources/registry.yaml` — title, version, publisher,
canonical link, rights posture, hash, and every other field the original row carries (kept whole
rather than trimmed to six fields, since the extra provenance costs nothing and a trimmed row would
be a second, thinner copy of the same fact). **No source PDF crosses** — each row's `file:` field
names where the source is held in the full repository, as text only; no binary travels with it.

**Updated again, same day (twice):** `un-wpp-2024-pop-age1` and `un-hh-size-2022` moved from
`pending-determination` to `rights: open-licence` (Carlisle's fourth determination,
`sources/RIGHTS-DETERMINATION_Carlisle_2026-09-27b.docx` — both CC BY 3.0 IGO), with their
TODO-Amy placeholder text removed. One stray section-divider comment, misplaced by the earlier
extraction, was also removed — no field changed by it. Then `mofuss-adm0-zenodo-18865904` got a
formal `rights_basis` (Carlisle's fifth determination, `sources/RIGHTS-DETERMINATION_Carlisle_2026-09-27c.docx`
— CC BY 4.0) and its `version` field set to `v6`. **The `rights` word itself did not move** — the
row already read `open-licence`, with no filed determination behind it; this fifth determination
supplies that paperwork.
`mofuss-fnrb-2024` was named as staying untouched and was not edited — see *Flagged*, below, for
one thing worth noting about how that row reads today. The hash above reflects both edits.

---

## Held back — named exclusion (Amy, 2026-09-26; reason updated 2026-09-27)

| File | Reason |
|---|---|
| `calculators/data/baseline-mix/countries.json` | **Does not cross — held back on the WHO half alone.** The file is built from two sources. **The DHS half is cleared:** the DHS Program Indicator Data API (stove shares, `HC_CKTC_H_*`) is attribution-only, per the Carlisle rights determination of 2026-09-27 (`sources/RIGHTS-DETERMINATION_Carlisle_2026-09-27.docx`; `sources/registry.yaml`'s `dhs-api-cooking-technology` row is `rights: open-licence`). **The WHO half is unconfirmed for redistribution** — `who-gho-cooking-fuel-by-type` remains `rights: cite-and-link`, pending a reply from sdg7@who.int (emailed 2026-09-27). Because the file mixes both halves in one JSON, the whole file is held back until the WHO half clears too; carrying it now would publish WHO's data alongside DHS's cleared data. |

Nothing that reads this file (`calculators/gs4gg-carbon/presets.ts`'s `countryBaselineDefault`,
`resolveBaselineEdit`'s country-default path) is disabled by its absence on the carried side — the
carried `presets.ts` still imports `../data/baseline-mix/countries.json` by path, so **whoever
integrates this bundle on the open site needs either that file present (once its licence is
confirmed) or a stub that resolves to no country having data**, so every project falls back to the
labelled preset. This is a build note for the open site, not a change made here.

---

## Structurally excluded — the seal's own category, not a new exclusion

| Path | Why |
|---|---|
| `evals/gs4gg-carbon/` (whole directory: `reference-dataset.json`, `legacy.eval.test.ts`, `coverage.eval.test.ts`, `v2-coverage.json`, `PAA-GOLDEN-DERIVATION.md`, `C4SW-VALIDATION-NOTES.md`, `ER-TOOL-INPUT-TEMPLATE.md`, `README.md`) | **The reference cases.** The seal: "the 127 deltas are anchored to Gold Standard's own tool output, to three issued filings, and to hand derivations... other people's project data and other people's numbers." The dataset mixes real anchors (`anchor-cws-01`, `anchor-cws-01-y2`, `anchor-hwt-ug`/`ke`, kind `real-anchor`/`transition-demo`/`multi-region`) with synthetic entries in one file; the seal treats the reference cases as one category, not a per-entry filter. |
| `calculators/gs4gg-carbon/quantity.test.ts` | Reproduces `anchor-cws-01`'s real filed figures directly in test assertions (`Q_pop 173,500,000`, `ER 59,160.03`, `ER 57,119.01`/`57,119.99`, `anchor-cws-01-y2`'s metered volume `23,823,982`), and imports the excluded `reference-dataset.json` by id. Not "a test fixture built from invented numbers" — it is a real filing's numbers wearing a test's name, per the seal's own description of what never carries. |
| `calculators/gs4gg-carbon/scenario.test.ts` | Same reason: reproduces `anchor-cws-01` end-to-end (`Q_pop 173,500,000`, filed `fNRB 0.9189`, `ER 59,160.03`), using the `south-asia-multifuel-cws` preset built from that filing. |

## Left out — outside the engine's own dependency graph

Checked by reading every `import` in `calculators/gs4gg-carbon/*.ts` (excluding `.test.ts`); none
of these are imported by the engine, so they are not "the calculator" the seal names:

| Path | Why |
|---|---|
| `calculators/README.md`, `calculators/data/README.md` | General documentation for the whole `/calculators` tree (every pathway), not this calculator or a parameter data file. |
| `calculators/_interface.ts` | The shared pathway-plugin interface; not imported by any gs4gg-carbon file. |
| `calculators/cross-cutting/mq-sample-fraction.ts` (+ `.test.ts`) | Not imported by any gs4gg-carbon file. |
| `calculators/data/countries.ts` | A UI-layer country list, imported only by `lib/bridge/contract.ts` and project components — not by the engine. |

---

## Flagged for Amy — not resolved here, carried as instructed

**1. `calculators/gs4gg-carbon/presets.ts` — named to cross, and it does — but two of its presets
carry real-filing-derived figures.** `"south-asia-multifuel-cws"` embeds `anchor-cws-01`'s exact
filed strata and shares (`0.8346`, `0.0472`, `0.2086`, `0.0118` — "a real GS India CWS filing," in
the file's own citation text). `"traditional-wood-cws"`'s citation says it "mirrors the E-African
CWS/HWT anchors (anchor-hwt-ug/ke)." Carried as instructed; flagged because the seal's own words
are "no real project data reaches the open side... not in a comment, not 'just for the anchor.'"

**2. `calculators/gs4gg-carbon/emissions-legacy.ts` — carried under the general "the engine
carries" rule, not separately named.** Its docstring states `anchor-cws-01`'s exact credited
result: *"reproduces the anchor-cws-01 filing (eta_weighted 0.141236, SE 2554.81, EF_b
0.000363867, BE = ER = 59,160)."* This is a real project's credited emission-reduction total, in a
comment, in a file carried as part of the engine — the precise case the seal's "not in a comment"
line names. Not redacted here: nothing in these files was edited for this carry, and only the one
named exclusion (`baseline-mix/countries.json`) was withheld. If this line should not cross, it
needs its own word before any push.

**3. RESOLVED 2026-09-27 — the eight `calculators/data/*/​*.test.ts` files import
`sources/registry.yaml`** (to assert every cited registry id exists there). `sources/registry.yaml`
now carries as a filtered subset (12 rows — see *Carried — sources*, above), covering every id
these files actually cite, at the same relative path (`sources/registry.yaml`) the tests expect.
This was flagged as a gap on 2026-09-26; it no longer is.

**4. The "Test Project" figures referenced in `version.ts`'s changelog** (Lesotho, HWT, households
1,199, id `e2dcbfe8-…`) are this app's own seeded demo project, used for QA walks — not a Gold
Standard filing, not one of the three real anchors in the reference dataset. Treated as in scope to
carry on that basis; noted here so the determination is visible, not assumed silently.

**5. SUPERSEDED 2026-09-27 — `mofuss-fnrb-2024` was first named to stay "cite-and-link only,
unchanged," which this item flagged against its actual then-value, `pending-determination`.**
Later the same day Carlisle amended the 2026-09-27c determination (§2) to cover this report too,
on Amy's word — CLEARED, attribution only, CC BY 4.0, the licence read from the report's own
Zenodo deposit (record 14291479) rather than from the PDF, which carries none. The row now reads
`rights: open-licence`; see *The registry*, above, and `sources/REGISTRY_VERIFICATION.md`,
"Fifth RAG determination," §2. This item is kept, not deleted, as the record of the row's earlier
posture.

---

## Corrected in this bundle — one file, not byte-identical to `main`

**`calculators/data/household-size/countries.json` — the `coverage` field, 2026-09-27.** The
receiving side noticed it names a field that does not exist in this file.

- **Was:** *"Countries absent from the source fall back to globalDefault (output labeled 'global
  default')."* There is no `globalDefault` field in this file — that sentence describes
  `age-shares/countries.json`'s mechanism, which genuinely has one; it does not describe this file.
- **Is (this file's real mechanism):** a `fallback` object with three quartile stops
  (`percentiles.p25 = 2.77`, `p50 = 3.75`, `p75 = 4.79`, `conservativeDirection: "low"`) — the
  25th-percentile stop, **2.77 people per household**, is the conservative default a country falls
  back to when absent from the UN 2022 source, and it is adjustable via a Low/Median/High picker
  (`householdSizeFallbackStop`), not fixed. The engine's own labelling agrees: a fired fallback logs
  as *"fallback fired — householdSize"*, never *"global default."*
- **Now reads:** *"Countries absent from the source fall back to the 25th-percentile stop in
  `fallback` (2.77 people per household, the conservative default; output labeled 'fallback fired',
  with an adjustable Low/Median/High picker — not a fixed global default)."*
- **Fixed here only.** `main`'s copy of this file carries the same wrong sentence — this correction
  has not been made there. The same fix is owed on `main`, as its own small, low-risk step (a
  documentation-string correction; the `fallback.percentiles.p25` value itself, 2.77, was already
  correct and did not change). Not built here because it was not asked for in this exchange; raised
  so it is not lost. Once it lands on `main`, this file stops being the one exception the second
  paragraph of this manifest names.
- **Hash:** the corrected file's SHA-256 (`c4744f7b…b547e7125a`, in the table above and in
  `carry-hashes.sha256`) will not match a checksum taken against `main`'s copy — expected, given the
  edit; noted so it is not mistaken for a transfer error.

---

## Nothing pushed

This bundle is staged locally under `carry/` and lands, once transferred, as `carried/`. It has
not been `git add`ed, committed, or pushed, and no branch or PR was opened for it, per the
instruction that produced it.

**One operational note, from precedent (memory: a `carry/` folder at the repo root broke
`typecheck`/`build` locally on 2026-09-17, tsconfig has no `carry/` exclusion):** `npm run
typecheck` and `next build`, run locally while `carry/` exists at the repo root, will likely
report errors inside it — CI does not see an untracked folder, so this is not a code defect. Move
or remove the folder before running those gates, per the standing pattern.
