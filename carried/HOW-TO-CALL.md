# How to call the engine — for an outside caller

The engine is `calculators/gs4gg-carbon/`. It is pure code: no I/O, no clock, no network. Every
number it returns comes from the inputs you pass and the cited data files beside it.

## The entry point

`computeScenario(input: ScenarioInput): ScenarioResult` in `calculators/gs4gg-carbon/scenario.ts`.
One call runs the whole calculation for one rulebook version and returns the figures with their
evidence trail.

## Run two pre-checks first

1. `derivePopulation({ countryIso, method, populationMode, populationCount })` — turns a
   household count into people (or people into households) using the UN household size for the
   country. Returns `null` when there is no count to work from. Show what it returns; the same
   function is what `computeScenario` uses.
2. `fnrbAvailability(countryIso)` — says whether the engine has a non-renewable biomass share
   (fNRB) it will stand behind for this country. `{ ok: false, refusal }` means ask the caller for
   the project's own value with its source; do not compute.

For a `"legacy"` run, also call `transitionAvailability(fnrbFiledV1)`: a legacy run needs the
project's own filed V1.0 fNRB and refuses without it.

## Required inputs

| Field | Kind |
|---|---|
| `version` | `"paa"` (current rulebook, V2.0) or `"legacy"` (V1.0) |
| `countryIso` | ISO 3166-1 alpha-3, e.g. `"MWI"` |
| `populationCount` | a positive number |
| `populationMode` | `"people"` or `"households"` |
| `litresPerPersonPerDay` | litres per person per day; capped by the engine |
| `operationalDays` | days a year, 1 to 365 |
| `method` | `1` for community supply or treatment (CWT/CWS); `2` for household or institutional treatment (HWT/IWT) |
| `premises` | Method 2 only: the number of premises with a unit |

Everything else on `ScenarioInput` is optional. Left out, the engine uses its own cited default
(fNRB, DAF, age shares, household size, the baseline preset, leakage Option 1) or refuses with a
named error. It never invents a value silently; every default it used is listed in the result.

## What comes back

- `result` — the calculation. `result.ER` is the net emission reductions in tCO₂e for the year;
  beside it the baseline, adjustments, activity emissions and leakage figures.
- `provenance` — one line per value used: the field, where it came from, and its source.
- `fallbacks` — any labelled fallback that fired, with its dial. Empty when every input had data.
- `notes` — plain-words advisories, such as a cap that bound or a term that was not evaluated.
- Also `people`, `householdSizeUsed`, `Q_pop`, `fNRB`, `DAF`, and the baseline mix used.

## Two refusals to expect

- `FnrbUnavailableError` — no official fNRB covers this country. Its `refusal.message` is the
  sentence to show; ask for the project's own value and pass it as `fnrbOverride`.
- `FiledFnrbRequiredError` — a `"legacy"` run with no filed V1.0 fNRB. Ask for the filed value
  and pass it as `fnrbFiledV1`.

Sources for every default are in `sources/registry.yaml`; cite them, do not retype them.
