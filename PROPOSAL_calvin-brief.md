# PROPOSAL — Calvin's brief: the carried engine on the free site

**Written 27 Sep 2026; amended and committed 10 Oct 2026. Build-order step 5 under the v1 fence
in BUILD_PLAN.md. Every ruling in §13 is answered; pull request A is built from it one step at a
time, and nothing reaches `main` without her word.**

**Amended 10 Oct 2026 by her word:** no fuel-mix preset (§1.3, §2.3); the slider openings and their
tags (§4, §6, §7); embodied carbon never zero (§2.2, §6); the water column's own litres slider
(§2.5, §4.4); R1 closed with no detail kept (§1.5, §13); pull request A builds on the bundle on
hand (R12); household treatment days (R13); the water litres ceiling (R14); the look reference is
a text list carried by her hand (§0, R10); and, in a second set the same day, R15 to R21 —
embodied spread over five years, C_b and U_p without a source, the energy question, institutions
held, the stove rule, the duplicate folder and the country aliases; and, in a third set the same day,
R22 to R26 — every SDWS reference shows its version, six sliders that teach, household treatment's
days as a full year, no script for Calvin, and schools and clinics moved to v2. The pre-amendment
wording is in `docs/archive/CORRECTIONS.md`, except the deleted §1.5 passage, which is not kept
anywhere.

Calvin is build-order step 5, the next step toward the v1 fence. This proposal says what crosses from
`carried/` into the repository and where, what the Quantify screen shows and hides, how the
six sliders work and what they cite, how households become people, what the four tags mean,
what the save and the export carry, how Calvin's chat fills the tool, how it is proved, and the
steps and eyeball stops. It ends with the rulings it needs.

The maintainer's eleven rulings of 26 and 27 Sep 2026 are fixed and are not reopened here. Each
section names the ruling it carries out. Where a ruling leaves a choice, the choice is listed in
§13 for her word.

---

## 0. What was checked before writing this

- **The bundle on hand is v0.16.1, and pull request A builds on it** (R12). Its 34 files match
  `carried/carry-hashes.sha256`, and no file sits on disk that the list does not name. The twelve
  registry rows its data files cite are all present; `un-hh-size-2022` reads
  `rights: open-licence` (CC BY 3.0 IGO). **It carries a labelled stub with no country data in
  place of the fuel mix** (`data/baseline-mix/countries.json`), so until a newer sealed engine
  carries cleared fuel data, every carbon headline is a dash (§1.3).
- **The engine typechecked here byte-identical.** A scratch copy of the engine files was compiled
  under this site's own compiler settings — strict, no unused locals or parameters, bundler
  resolution, JSON modules. It passed with no errors, so nothing in the engine has to be edited
  to live here. Step 1 of pull request A runs the same check in the build.
- **The methodology text was read for the three slider sources** (§5), from the V2.0 PDF held
  locally in `sources-local/`, never committed. Every page number below comes from that read.
- **The look reference is a text list and four captures of the paid calculator.** The `Design
  refs` folder of saved production calculator pages is deleted. The reference is a text list of
  the paid calculator's block names and tag words, carried by her hand on 10 Oct 2026 (R10), and
  four PDF captures of the paid calculator page she placed at the repository root the same day.
  The captures carry a project's figures, so they stay untracked and are never committed; the
  sheet takes their blocks, order, row style and tag words and none of their data.

---

## 1. What crosses from `carried/`, and where (rulings 1, 9, 10)

### 1.1 The place

A new tracked folder at the repository root, **`engine/`**, holding the bundle in exactly the
shape it has in `carried/`, so every relative import inside it still resolves:

```
engine/
  MANIFEST.md                 — the carry manifest, as carried
  carry-hashes.sha256         — the hash list, as carried; the gate reads it
  _build-report.json          — the builder's record, as carried
  calculators/
    gs4gg-carbon/             — the engine files, byte-identical
    data/                     — the data folders, byte-identical
  sources/registry.yaml       — the registry subset, byte-identical
```

Nothing is added to it and nothing in it is edited. The file list is the bundle on hand,
v0.16.1. A later sealed engine replaces the whole folder as one hash-checked swap (§1.3).

`carried/` itself stays as she left it: tracked since #132, stored byte for byte, never edited.
It is where a bundle arrives by her hand; `engine/` is the copy the site builds from and the gate
checks, stored byte for byte the same way (`engine/** -text` in `.gitattributes`). Why a root
folder and not `src/`: the bundle is one thing that crosses whole and is
checked whole, and a folder of its own is what a hash gate can hold. `src/` imports it by a
relative path, the way it already imports `brand/` and `knowledge-packs/`.

**The same files sit in `carried/` and `engine/`.** Logged as a later tidy, no change now (R20).

### 1.2 The gate — a fork fails the build

**`scripts/check-engine.mjs`** reads `engine/carry-hashes.sha256` and hashes every listed file
on disk. Any mismatch fails and names the file. Any `.ts` or `.json` under `engine/calculators/`
that is not on the list fails too. It runs in front of
`npm run build` beside `check-roster`, because a forked engine deploying is exactly the thing
ruling 1 forbids, and a check that only runs by hand can be forgotten. When she carries a new
seal, the hash list crosses with it and the gate follows.

Two small settings changes: `tsconfig.app.json` gains `resolveJsonModule: true`, because the
engine imports its data files as JSON and nothing in `src/` did before; and the root
`tsconfig.json` gains a reference to a new `tsconfig.engine.json` covering
`engine/calculators/**/*.ts` minus the test files, with the same strict options `src/` has.
The build's `tsc -b` then checks the engine on every build without any engine file being edited.

### 1.3 The fuel mix: no preset, a dash until cleared data arrives (ruling 9, amended 10 Oct 2026)

**The "all wood, three-stone" screening preset is retired.** No project is ever worked out from a
fuel mix nobody cleared. Where the engine has no cleared baseline fuel data for a country, the
carbon headline is an em dash with one line: *Baseline fuel data is not on this site yet.* The
water headline is not affected. **On the bundle on hand that is every country**, because its fuel
mix is a stub with no rows; the carbon blocks still draw, and their fuel-dependent rows show dashes.

What arrives later, inside a **new sealed engine carried from the paid site**, by her hand:

- the **fuel-mix floor** — DHS survey data for 12 countries, the WHO clean-fuel share elsewhere,
  both CC BY 4.0;
- **X_cleanboil**, worked from the same data;
- the **full downward-adjustment-factor (DAF) table**.

Nothing in `engine/` is edited here, and no stand-in file is added. The bundle on hand carries
its own labelled stub with no country data; it is not used for any figure. The wrapper asks the
engine's `countryBaselineDefault` for the country first; with no row, it does not run the carbon
calculation at all, so the engine's own preset can never reach the screen. **Pull request A does
not wait** (R12): it builds on v0.16.1. When the new engine lands, it replaces `engine/` whole, as
one swap the hash gate checks (§1.2), and the dash lifts for every country its data covers.

**Fuel without stove data stays a dash** (R19). The wrapper needs both halves — fuel shares and
stove shares — before it runs, because a missing half would fall to the preset. The new engine must
carry a stove rule for every country it gives a fuel figure for.

### 1.4 The tests cross too, and how they run

The bundle's `.test.ts` files are on the hash list, so they cross. They use `vitest`,
which is not a dependency here. Proposed: `vitest` as a dev dependency and
`npm run test:engine`, run by hand with the other checks, never a gate in the build. The
alternative is to carry the test files and never run them, which keeps a claim nobody checks.
§13, R3.

### 1.5 What does not cross

Not carried, by the seal's own rule: the reference cases, the test files built on real filings,
and the published case studies. The free site therefore cannot run the reference suite; its proof
is §10.

### 1.6 The citations — cite-and-link, nothing typed (ruling 10)

Every default the screen shows takes its citation from **`engine/sources/registry.yaml`**, by the
`registrySources` id the data file carries: title, version, publisher, canonical link. A new
reader, `src/lib/registry.ts`, parses the YAML once at build (the `yaml` package is already a
dev dependency; the generator pattern is `scripts/build-prompt-modules.mjs`) into a generated
module, so no citation string is typed by hand anywhere in `src/`. Where a default's source is
the methodology itself (Table 9, SDWS 11, SDWS 22, SDWS 32, Eq. 2), the row cites
`gs-429-v2-methodology` plus the section and page the engine's own labels carry.

**The defaults rule: every default Calvin uses comes from a cited source. Where no source gives a
default, there is none, and the visitor must enter the value.**

---

## 2. What the screen shows, in words (rulings 2, 3, 4)

### 2.1 The top

The Quantify screen's Tool tab opens on **two headline numbers side by side**: the water
pathway's anticipated benefit in cubic metres a year (VWBA 2.0 D-3, as built), and the carbon
pathway's net emission reductions in tonnes of CO₂-equivalent a year (PAA v2.0, from the carried
engine). Each headline carries its method's name, its screening chip, and the consultant-review
tag, as today. **A headline that cannot yet be worked out is an em dash with one line saying
what is still needed** — for a country with no cleared fuel data, *Baseline fuel data is not on
this site yet* (§2.3); for a project whose device class is not known, that the class is needed
(§2.2). Nothing is ever zero for want of an answer.

**Which headlines appear** follows Phoebe's read for each pathway (§8): carbon beside water
when she found both fit; one alone when the other reads likely not or does not apply; both,
with a line saying eligibility has not been checked yet, when she has looked at nothing.

**The pack tab strip goes** (ruling 2): the water and carbon results are two columns of one sheet,
not two tabs, and the Legacy pack leaves the registry (§11). **The paid page's version tabs are
built and switched off for a new project** (the look reference, R10): a "Carbon" chip on each,
Legacy V1.0 and PAA v2.0 with their totals, and "Transition delta (PAA − Legacy)" beneath. They
switch on only where Phoebe's carbon pack sorted the project as transitioning, and there the Legacy
side shows the engine's own refusal, *Filed V1.0 fNRB needed*, until the filed value and its source
are given (R25). Every total is a dash while the carbon headline is.

**Every SDWS reference shows its version** (R22), as the paid site does: "V2.0 SDWS 36", never
"SDWS 36" alone, on every chip, source line and note. Where an engine label says "SDWS n" bare or
"V2 SDWS n", the wrapper shows it as "V2.0 SDWS n" for a PAA run; nothing in `engine/` changes.

### 2.2 The carbon blocks, in this order (ruling 3)

Under the carbon headline, five blocks, each a hairline-separated section in the row anatomy
the worksheet already draws — symbol, label, equation number, value, unit — with a tag on
every value:

1. **Baseline emissions (BE)** — the emission factor per litre (EF_b, Eq. 1–2: SE_o, the stove
   efficiency, the fuel factors, fNRB), the water volume (Q_pop, Eq. 5 or Eq. 6–7: people or
   premises, litres per person per day, operational days), the credited volume (Q_y, Eq. 4 for
   Method 1), and BE.
2. **Adjustments to the crediting baseline** — Q_adj (Eq. 8: X_cleanboil, M_q, U_p), the
   uncertainty-adjusted baseline (Eq. 9), the downward adjustment factor (DAF), the crediting
   baseline (Eq. 10–12).
3. **Activity emissions (AE)** — Eq. 14. **Calvin asks whether the system uses energy to run —
   diesel, grid electricity, or none — and how much** (§6; her ruling of 10 Oct 2026, R17). None
   is zero by the methodology for a technology that uses no energy. Until the question is
   answered, and for any system that uses energy, the carbon headline is a dash. The engine
   carries no diesel or grid emission factor, so an answered amount still leaves a dash, with one
   line saying that factor is not on this site yet, until a sealed engine carries one.
4. **Leakage (LE)** — market leakage, Option 1 at 2% (Eq. 20), and embodied emissions
   (Eq. 17–19), the per-unit figure from **Table 10 (V2.0 p. 36) by device class**, **spread over
   the first crediting period of five years (Eq. 19), per V2.0 §9.2.2.1(b), p. 37** — the
   methodology's rule (R15). **Embodied is never 0.** If the class is not known, Calvin asks it
   (§6, §8), and until it is known the carbon headline is a dash that says the device class is
   needed.
5. **Emission reductions (credits)** — Eq. 22, and the total over the first crediting period
   (five years, V2.0 p. 5), in the registry's time words only: crediting period, monitoring
   period, vintage (ruling 11).

Each block opens with its one-line plain sentence, in a visitor's words, and its section
citation. **Every figure in every block is the engine's**; the screen draws `ScenarioResult`
and computes nothing of its own. Every derived value is tagged DERIVED (§7).

### 2.3 Where the fuel data shows (ruling 9, amended 10 Oct 2026)

The stove and fuel rows in the Baseline block carry what the engine used from the cleared
country data: the fuel shares, the stove efficiency (V2.0 SDWS 11), the fuel factors (SDWS 9 and
10) and X_cleanboil. Each is tagged DEFAULT and cites its dataset through the registry (§1.6).
**There is no preset.** For a country the engine has no cleared fuel data for, the Baseline block
shows those rows as dashes, the carbon headline is a dash, and one line says, in these words:
*Baseline fuel data is not on this site yet.* No pencil.

### 2.4 Hidden, not deleted (ruling 4)

Each of these is built as a part of the screen with a `shown` switch, off on the free site, so
the paid shape is intact and one flag turns any of them back on — and with them, from the look
reference: the left rail's project-record card, analysis basis (Ex-ante / Ex-post) and save area
(this site's record and save door stand where they stand), and the baseline profile's editable
stove and fuel shares:

- pencils on every row **except a row the visitor must type** — the rows Calvin asks for
  (§6, §8) carry their box; every other row is read-only;
- the fNRB source strip ("fNRB · vintage · n defaults · fallback fired");
- the "what the tags mean" and "what the marks mean" legends;
- every *entered* note and every *monitoring* note under a row (the baseline marker and
  the slate monitoring mark are not drawn; the baseline marker takes the existing token
  `--tide-text` (#2b5bff, 5.19:1 on `--card` and 4.79:1 on `--paper`, above the 4.5:1 floor),
  so nothing is owed by her hand for it).

Kept: the DERIVED and DEFAULT tags on values, and ENTERED and ASSUMED with them (§7), because
a value with no tag is a value with no provenance.

### 2.5 The water column

The VWBA 2.0 D-3 pack keeps its arithmetic and its rows — with-project, without-project,
benefit — drawn beneath its headline in the same row anatomy. **It is fed the same people
count the carbon side uses** (§6), so the two columns cannot disagree about who is served. **Its
litres per person per day is its own slider** (§4.4), never the carbon one. Its
without-project volume stays required, blank-allowed and never zero, and is one of the rows
Calvin asks for.

---

## 3. Which calculator, and from what (ruling 7)

The wrapper, `src/lib/calvinEngine.ts`, decides from the record and never from prose:

| Record | Carbon calculator | Water calculator |
|---|---|---|
| Type C-19, class HWT | PAA v2.0 Method 2 (Eq. 6–7) | VWBA D-3 |
| Type C-19, class IWT | none on this site: **schools and clinics are v2** (R26); the carbon headline is a dash that says so | VWBA D-3 |
| Type C-19, class CWT or CWS | PAA v2.0 Method 1 (Eq. 4–5) | VWBA D-3 |
| Type C-19, no class yet | none until the class is known — Calvin asks it (§8) | VWBA D-3 |
| Type C-11 | none — the carbon pathway does not name this type | VWBA D-3 |
| Any other type, or NONE | none | D-3 only where its own gate fits; otherwise its stop card names the method that does |
| No type yet | none — Calvin asks what the project does and hands back to Wellington to settle the type | none |

The carbon column is then shown or held by Phoebe's read (§8). The country comes from the
record's place where a country name can be matched against the UN M49 table the engine already
carries (`un-m49.json`, 248 rows), or against a short list of common names — "Tanzania", "Ivory
Coast", "Vietnam" — that point at their UN M49 row (R21). The alias list is ours, labelled as
ours in `src/lib/calvinFields.ts`; it only finds a row and is never shown as a value. Where
neither finds exactly one country, Calvin asks (§8). Country is what unlocks
fNRB, DAF, household size and the age shares, all from the engine's own lookups.

**Where the engine refuses, the screen shows the refusal and Calvin asks.** A country outside
AMT-009's three regions has no fNRB the engine will stand behind; its sentence
(`FnrbUnavailableError.refusal.message`) is printed verbatim, and the value is ENTERED only when
the visitor supplies their own with its source. A country with no row in the full DAF table
(arriving with a later sealed engine, §1.3) takes whatever labelled global default the engine states,
tagged DEFAULT, with the engine's label as its source; no figure is typed in `src/`.

---

## 4. The sliders — six, each a learning tool, and no others (ruling 5, amended 10 Oct 2026)

**Six sliders** (R23): litres per person per day on carbon (§4.1), days (§4.2), water quality
(§4.3), litres per person per day on water (§4.4), stove efficiency (§4.5) and usage rate (§4.6,
household treatment only). **Each is a learning tool**: under it, one line says in a visitor's
words how moving it changes the credits — or, on the water column, the water benefit. The engine is
re-run on every move; nothing else on the sheet is draggable. **Each slider opens at the cautious
value the engine carries, cited.** A slider the visitor moves becomes a value the visitor set,
tagged ASSUMED; an answer given to Calvin makes it ENTERED (§7). No value is tagged ASSUMED unless
the visitor did something to put it there.

### 4.1 Litres per person per day (QPW_p, SDWS 29)

- **Range:** 0 to 5.5 L, the engine's own cap (`QPW_PERSON_CAP_DEFAULT`, the adult residential
  cap of Table 9, V2.0 §7.3.11, p. 31), for household and community supply (HWT, CWT, CWS). The
  slider cannot pass it.
- **Opens at** the engine's own default: the Table 9 age-tiered defaults (0.9 / 3.0 / 4.0)
  weighted by the country's UN WPP 2024 age shares — DEFAULT, cited to Table 9 and to
  `un-wpp-2024-pop-age1`.
- **Institutions (IWT) have no slider and no carbon number: schools and clinics are v2** (R26,
  which settles R18). Their carbon headline is a dash with one line saying so.
- **Moved:** the run switches to `volumeBasis: "flat"` at the slider's value, tagged ASSUMED,
  with one line: *A Water Consumption Field Test (SDWS 29, Option 2, Annex 2) is what makes this
  a measured value.* The engine's own label for a flat value — "entered (design value or WCFT)"
  — is not shown, because on this site nothing was measured.

### 4.2 Operational days (DO_p, SDWS 32; DP_p, SDWS 36 on Method 2)

- **Range:** 1 to 365.
- **The threshold and its source:** *Values higher than 347 days (95% of days) may only be
  applied when an operation sensor measures them* — V2.0 SDWS 32, p. 68. Above 347 the row
  carries that line, in a visitor's words: *Above 347 days the methodology only credits the days
  a sensor records. Below it, an operation and maintenance log is enough.* For a school or
  clinic the note adds that days are limited to operating days (SDWS 32 and SDWS 36).
- **Opens at 347, labelled "the methodology's cap for paper logs" (SDWS 32, p. 68), tagged
  DEFAULT — not assumed.** Moved by the visitor, it is ASSUMED. Calvin asks the days (§8); an
  answer makes the row ENTERED and moves the slider. §13, R5.
- **Household treatment (HWT): days are the days the device is in the home — a full year, 365**
  (V2.0 SDWS 36, p. 71; R24). The row is DP_p, "days present", never "operational days". Its slider
  opens at 365, tagged DEFAULT and cited to V2.0 SDWS 36, p. 71, and only moves down. The 347 note
  is a rule for DO_p (V2.0 SDWS 32) and does not show on DP_p. Nothing in `engine/` changes.

### 4.3 Water quality passing rate (M_q,y, SDWS 22)

- **Range:** 0 to 1, shown as a percentage.
- **Opens at 90%, labelled "the lowest pass rate allowed without corrective action from
  year 3"** (V2.0 SDWS 22, pp. 58–59; §7.4.3), tagged DEFAULT and cited to the methodology.
  Moved by the visitor, it is ASSUMED. §13, R5.

No slider on X_cleanboil, C_b, fNRB, DAF or anything else; those are DEFAULT rows with no
control, as ruling 5 says.

### 4.4 The water column's litres per person per day (VWBA 2.0 D-3, Table D3.3, p. 46)

- **Its own slider, on the water column only.** It never shares the carbon litres slider (§4.1):
  moving one does not move the other, and neither reads the other's value.
- **Opens at the Table D3.3 figure for the access level on the record: 20 L for full access, 2 L
  for limited access**, tagged DEFAULT, cited to VWBA 2.0 D-3, Table D3.3, p. 46. Until the access
  level is answered the slider is not drawn and the row is a dash that says the access level is
  needed — no figure is guessed.
- **Range:** 0 to 20 L, ruled 10 Oct 2026 (R14). The table gives no upper limit; 20 is its
  highest figure. Reviewing that ceiling is on the After v1 list.
- **Moved:** ASSUMED, with the line *A figure you set, not the table's.* An answer given to
  Calvin makes it ENTERED. The pack's arithmetic (`src/lib/vwbaD3.ts`) already takes a typed
  litres figure over the default; the slider drives that existing field and adds no arithmetic.

### 4.5 Stove efficiency (η, V2.0 SDWS 11)

- **Range:** 0.15 to 0.30, shown as a percentage: the V2.0 SDWS 11 defaults from the three-stone
  fire up to the improved cookstove, both read from the engine. The ends are cited; nothing between
  them is a class of its own.
- **Opens at 0.30, the most efficient class (improved cookstove), V2.0 SDWS 11, p. 52** (R23),
  read from the engine's own `DEFAULT_STOVE_ETA` and never typed, tagged DEFAULT. It is the
  cautious opening: a more efficient old stove burned less fuel, so the project avoids less.
- **The engine takes it as `etaOverride`**, which sets every stove class to the slider's value;
  nothing in `engine/` changes. Moved, it is ASSUMED.

### 4.6 Usage rate (U_p, V2.0 SDWS 34) — household treatment only

- **Range:** 0.01 to 1, shown as a percentage. **Never 0** (R23).
- **Drawn only for HWT.** Method 1 has no usage rate (U_p = 1 by the methodology), and IWT is v2.
- **Opens at 1**, the value the engine carries, tagged DEFAULT, its source line "no source yet"
  (R16): SDWS 34 sets U_p by a usage survey and gives no default. Moved, it is ASSUMED.

---

## 5. People served, households and household size (rulings 6 and 11)

**One home: the engine's `derivePopulation`.** The wrapper passes the record's people served as
`populationCount` with `populationMode` "people" or "households", exactly as Wellington logged
it, and the country. The engine returns the people count every equation uses, the household
size it used, and which way it derived.

- **Said as people:** the carbon and water calculators take the count as ENTERED. On Method 2
  the households it implies (people ÷ household size) are DERIVED and become N_p.
- **Said as households:** people = households × the UN household size for the country
  (`un-hh-size-2022`, "Household Size and Composition 2022", UN DESA Population Division,
  CC BY 3.0 IGO). **Silently — Calvin says nothing about the conversion in chat** (ruling 6); his
  prompt holds the derived count as a fact with its source and a rule not to narrate it unless
  asked. On the record it is marked derived, with its source.
- **On the rail**, three names and no others: **People served** (as said, source tag as
  today); **Households served** (shown when households were said); **Household size** (the UN
  figure with its country and reference year, DEFAULT, its source behind the (i)). The derived
  people count shows as a second line under People served, in this shape: *N people — derived
  from H households × S (UN 2022 household size, the country).* Every figure in it is the
  engine's. The seal keeps `record.served` as said
  and unchanged; the derived count travels in the calculator's used values (§7.2).
- **A country absent from the UN file.** The engine fires its labelled 25th-percentile fallback
  (2.77 people per household, Low/Median/High dial). *Never a placeholder* (ruling 6) reads to
  me as: not on this site. Proposed: the fallback is not used; Calvin asks the household size,
  which becomes ENTERED, and the row says why. §13, R6.

---

## 6. Rows the visitor must type, and how they are filled (rulings 4 and 7)

Everything the record holds is never asked again. What can be missing for a number, and is a
row with a box (and Calvin's question):

| Row | Needed by | Kind of value | Where it usually comes from |
|---|---|---|---|
| Country | fNRB, DAF, household size, age shares | one of the UN M49 countries | the place on the record, matched; else asked |
| Class of drinking-water project | Method 1 or 2 | HWT, IWT, CWT, CWS | Wellington; else asked, and posted to the record as Wellington's field |
| People served | Q_pop | a whole count, people or households | Wellington; else asked |
| Operational days (DO_p) or days present (DP_p) | Q_pop | whole days, 1–365 | the plan; the slider opens at 347 (V2.0 SDWS 32); for HWT at 365, the days the device is in the home (V2.0 SDWS 36, p. 71) (§4.2) |
| Filed V1.0 fNRB, a transitioning project only | the Legacy V1.0 side of the transition | a fraction with its source | the project's own V1.0 filing (PDD or monitoring report) — the engine's refusal names it |
| Premises with a unit (Method 2, SDWS 33) | Eq. 6 | whole count | sales or distribution records; a planned project's target |
| Device class and new units this year | embodied emissions, Table 10 | one of seven classes; whole count | the plan; **never 0** — if the class is unknown Calvin asks it, and the carbon headline waits (§2.2) |
| Energy the system uses | activity emissions, Eq. 14 | diesel, grid electricity, or none | the plan; unanswered, the carbon headline is a dash (R17) |
| How much energy a year | activity emissions, Eq. 14 | litres of diesel, or kWh of grid electricity, a year | the plan or the supplier's figures; asked only where energy is used |
| Access level (water) | the water column's litres slider and days | full or limited | the record or the baseline; else asked |
| Without-project volume (water) | D-3 benefit | litres a year, blank allowed, never zero | the baseline; blank leaves the water headline a dash |
| fNRB, only when the engine refuses | EF_b | a fraction with a source | the project's own filing or study |

No other row takes a value on the free site. Q_m (planned production) and device capacity
(SDWS 13) are not drawn as values and carry no tag: the engine's own words for their absence
show ("No metered volume entered — population binds"; "device limit not evaluated").

---

## 7. The four tags, and what the save carries (ruling 8)

### 7.1 The tags

Four words, the same on the screen, in the record and in the seal:

| Tag | Means | Examples |
|---|---|---|
| **entered** | the visitor said it — on the record via Wellington, or to Calvin | people served, the country, operational days once answered |
| **default** | a cited value from a data file or the methodology, used as published | fNRB national value, DAF, Table 9 litres, η 0.30, fuel shares and factors, X_cleanboil, SE_o 360.83 (Eq. 2, p. 29), household size, Table 10 embodied figures, the opening 347 or 365 days, 90% passing, 20 L or 2 L water litres, U_p 1 (no source yet) |
| **derived** | worked out from other values | people from households, EF_b, Q_pop, Q_adj, BE, the crediting baseline, LE, ER, the five-year total |
| **assumed** | a value the visitor set that no source gives, standing in until one exists | any of the six sliders, once the visitor has moved it |

**Nothing opens ASSUMED.** A value is ASSUMED only because a visitor moved it; no row carries the
tag by default.

**Two engine values have no source yet** (R16): C_b 0, the share already using safe water, and
U_p 1, the usage rate on Method 2. Sources are to be found on the paid side for the new engine.
Until then they are listed among the values used, tagged DEFAULT, with a source line that says
"no source" in so many words. Every carbon headline is a dash on v0.16.1 anyway.

The engine's own provenance words map onto them once, in the wrapper: `country`, `default` →
default; `override` → entered; `global-default` → default with its label (the DAF global
default, the fNRB multi-national value with footnote 5's condition printed beside it, as the
engine builds it). A `preset` source is never shown: the wrapper does not run the carbon
calculation for a country with no cleared fuel data (§1.3). The screen never invents a source;
where the engine's label is the source, the label is what shows.

### 7.2 The save

`buildSeal` gains, on each pack entry, **`used`**: every leaf value the engine consumed, after
resolution — key, label, value, unit, tag, and the registry id or methodology section it came
from. Derived *inputs* are in it (the people count from households, the weighted litres, EF_b
as the factor the volume was multiplied by); **equation results are not** — no BE, no ER, no
headline, keeping the bridge's rule that never a computed result crosses. `api/_handoff.ts`
learns the key and its caps; a `used` entry carrying a result key is refused. Production ignores
unknown fields (ruling 8), so the seal's existing shape is untouched. §13, R7 asks her to
confirm this reading of "every value the engine used".

### 7.3 The export

The screening report export is item S21, parked, and on v1's done line. This brief builds the
one list the export needs — `usedValues()` in the wrapper, the same list the seal carries — and
does not build the document. S21's proposal renders it. Nothing is computed twice.

---

## 8. Calvin's chat (rulings 6, 7; the specialist contract)

On Phoebe's and Wellington's proven pattern, nothing new in kind:

- **No script for Calvin** (R25). He is given facts and rules, never lines to say: he follows
  AGENT_RULES.md like every agent, and phrases what he says himself. **He reads the record to tell a
  new project from one in transition** — the version Phoebe's carbon pack sorted it into — and asks
  a transitioning project for its filed V1.0 fNRB and its source, the one value the transition
  cannot run without (the engine's `filedFnrbRefusal`). A project not sorted is treated as new.

- **`api/calvin.ts`**, his own relay: Claude Opus 5 at medium, 16,000 output tokens, the
  120-second timeout, the late-400 retry, the reply floor, named method exports, no default
  export. **Thirty a day** under his own counter, `CALVIN` in `_cap.ts`, the same number as the
  other two for the same reason. The Commons uses the same counter.
- **His prompt is generated**, like theirs, by `build-prompt-modules.mjs`: the base rules, the
  primer (he inherits it from this brief; AGENT_RULES' rung-2 note updates), his own region in
  `knowledge-packs/calvin-quantify/README.md`'s agent-facing block — his job, his level (screen),
  Wellington as lead, the plain-words rules, ruling 6's silence on the conversion — and **the
  field table of §6 rendered from `src/lib/calvinFields.ts`**, one home read by the screen and
  the generator, so line 10 of the contract (what each input is, why it matters, what kind of
  value, where it comes from) is never typed twice. A staleness gate holds the generated copy
  to the sources. **His prompt gate is measured after the build plus 500**, her rule.
- **He never computes.** The tool's state goes to him with every ask, after the cache
  breakpoint, as a block "What the calculator shows": each row, its value, its tag, its source,
  the headline or what is missing — built by the same wrapper that draws the screen. The
  numbers he says are the engine's; the roster's no-model-math rule holds.
- **He fills by fields, never prose.** His answer is `{ reply, fills, handBack, abstained }`;
  `fills` is a list of `{ key, value }` checked twice against the closed list in §6 — the
  country against the M49 table, the class against `GS_CLASS_IDS`, people served through
  `readServed`, days as a whole number 1–365, the device class against Table 10's ids. A fill for
  a key not on the list is dropped whole. The console writes a fill into the visit and re-runs
  the engine; the screen updates; the desk row follows. Class and people served, when he fills
  them, land on the record as Wellington's fields with source "chat" — line 9, posting to the
  record.
- **He asks only for what is still missing**, one question a turn, the record and the tool
  state in front of him, and hands back to Wellington on a `handBack` field when the number is
  done or the question is out of his lane — line 8, the same field Phoebe sets.
- **Where a pathway is held by Phoebe's read** (likely not, does not apply), he says so in his
  own words and does not run it; where she has looked at nothing he says eligibility has not been
  checked and carries on, because the free site never gates a screening on a step nobody took.
- **On the Commons** he has no record and asks for everything; the same screen, the same
  engine, the same counter; the transition card is step 4's (the Commons check) and not this
  brief's, though `computeTransitionWaterfall` crosses with the engine and waits for it.
- **The two "not answering yet" lines** — his Chat tab's, Wellington's stage line for Quantify
  in `_record.ts`, and the invite row in `visit.ts` — are replaced with the true state. The
  roster's `built` word for his free door stays "unconfirmed" until she carries it.

---

## 9. What the desk and the record see

Calvin's desk row reads the two headlines as today, one row per pathway with a figure, and
"still needs" when one is a dash. The rail's record gains the three named rows of §5. The seal
gains `used` (§7.2). Wellington's own prompt does not change; his relay's stage line for
Quantify does (§8), which is a runtime block, not his cached prompt.

---

## 10. How it is proved

- **`check-engine`** (§1.2) — the hashes, in the build.
- **`npm run test:engine`** — the bundle's own test files, by hand (§1.4, R3).
- **`scripts/check-calvin-engine.mjs`** — the wrapper against the engine on synthetic
  projects, invented for the purpose and labelled: households → people through
  `derivePopulation` reconciles both ways; each calculator choice in §3's table; the five
  carbon sliders clamp at their ends and the 347 note fires at 348 on DO_p and never on DP_p; the
  water litres slider clamps at 20 and shares nothing with the carbon litres slider; the sliders
  open at 347 or 365, 90%, η 0.30, U_p 1 and 20 or 2 L as DEFAULT, U_p never reaches 0 and is drawn
  for HWT only, every slider carries its credits line, a moved slider is ASSUMED, an answered day
  count is ENTERED, and no row opens ASSUMED; every SDWS reference on the sheet carries its
  version; a transitioning project shows the filed-fNRB refusal and a new one shows no version
  tabs; a country with no cleared fuel data leaves the carbon headline a dash with
  the line of §2.3 and never runs a preset; an unknown device class leaves it a dash and
  embodied is never 0; the fNRB refusal renders as its own sentence; blank without-project
  volume leaves the water headline a dash; `usedValues()` carries no result key. The
  compile-then-load pattern of `check-gs-sdws.mjs`.
- **`check-handoff`** extended: a seal with `used` passes; a `used` entry carrying BE or ER is
  refused; the old shape still passes.
- **`check-calvin.mjs`** — the prompt's size gate, the fills' closed lists, the tool-state
  block present and unscripted, the cap at thirty, the hand-back field; on the pattern of
  `check-wellington.mjs`.
- **Measured runs**, her bar: a short run of ten real calls after the prompt lands, none
  empty, and one full walk from the desk through Phoebe to Calvin to a number, with the count
  and the rough cost in the For Amy block.
- **The v1 finish line.** A visitor screens in 30 questions or fewer (Wellington → Phoebe →
  Bridget → Calvin → report / sign up), the project saves to the paid site, and the paid site's
  calculators, run on that saved project's inputs, give the same numbers as the screening. The
  saved-project half needs the paid site's side, carried by her hand. Until it is run, the proof
  is the engine's own tests plus `check-calvin-engine`, and the pull request says so plainly.
  §13, R9.
- **`check-gs-sdws.mjs` retires** with the module it checked (§11).

---

## 11. What changes in the tree, and what goes

- **Retires:** `src/lib/gsSdws.ts` — the two approximated carbon packs, the straight-line
  emission factor, the six-country tables and the expired CDM list — and `check-gs-sdws.mjs`.
  The engine computes the real factor from the real profile; a second copy of the arithmetic is
  the fork ruling 1 forbids. The Legacy pack leaves `METHOD_PACKS` (ruling 2); the
  `PACK_COMPARISONS` line goes with it. The tool folder `gs-sdws-legacy-v1` stays as a stub
  marked "not on the free site", like `vwba-2.0-d4`; `gs-sdws-paa-v2` bumps to 0.2.0 and names
  the engine version and the seal it crossed under, as `engine/MANIFEST.md` names them. R4 asks whether the retired module
  is deleted or parked.
- **New:** `engine/` (§1); `src/lib/calvinEngine.ts` (the wrapper: calculator choice,
  household derivation, tag mapping, `usedValues()`); `src/lib/calvinFields.ts`;
  `src/lib/registry.ts` and its generated module; `api/calvin.ts`, `api/_calvinPrompt.ts`,
  `api/_calvinAnswer.ts`, the generated prompt module; `src/lib/calvinClient.ts`; the three
  checks; the Quantify screen's new sheet in `QuantificationWorksheet.tsx` (the file keeps its
  name and its row anatomy; the tab strip and the delta line go).
- **Touched:** `CalvinScreen.tsx` (chat live), `visit.ts` and `NavRail.tsx` (the three rows),
  `handoff.ts` and `api/_handoff.ts` (`used`), `_cap.ts` (his counter), `_record.ts` (the stage
  line), `methodPacks.ts` (registry), `tsconfig.app.json`, `tsconfig.json`, `package.json`.
- **Docs, at the full close-out (after pull request C):** the seat README's contract table (lines 1–5, 7, 8 and 10 to yes;
  6 stays "no rule cards" honestly; 9 to yes); seat 0.2.0, tree bump; README's check list;
  CLAUDE.md's scope line; AGENT_RULES' rung-2 paragraph on who inherits the primer; item A12
  loses Calvin; item K9 unchanged (the pack move is its own brief); BUILD_PLAN step 5 done;
  the build-update fact.
- **Untouched:** every card set (sealed 23 Sep 2026), Phoebe, Wellington's cached prompt, the
  map, the VWBA D-3 arithmetic, the seal's existing keys, the brand book.

---

## 12. Steps, pull requests and eyeball stops

Sized by risk, bundled by her eyeball stops, invisible groundwork riding with the visible step
it serves. Each pull request is stacked on the one before where they touch the same files.

**Pull request A — the engine crosses and the screen shows it.** It builds on the bundle on hand,
v0.16.1 (R12). Steps 1 to 3 are built; step 4 builds from the look reference she carried on
10 Oct 2026 (R10). Steps: (1) `engine/` from the bundle on hand, the two tsconfig lines, `check-engine` in the build, vitest and `test:engine`;
(2) `registry.ts`; (3) the wrapper and `calvinFields.ts`; (4) the new sheet — two headlines, the
five carbon blocks, the water column, the six sliders, the hidden parts built and switched off;
(5) `check-calvin-engine`. No chat yet: the rows of §6 take typed values in their boxes, so the
sheet is walkable. **Eyeball stop 1:** the Quantify screen in the browser on a synthetic
community-supply project, with captures of the top, the Baseline block, a country with no
cleared fuel data showing the dash and its line, and a slider past 347. Its own revert handle, because it is the engine.

**Pull request B — the record, the rail and the seal.** Steps: (6) People served, Households
served, Household size on the rail, the derived line, silent on the desk; (7) `used` on the seal
both sides, `check-handoff` extended. **Eyeball stop 2:** the rail on a households project, and
the check's output. Its own revert handle, because it is the seal's contract.

**Pull request C — Calvin's chat.** Steps: (8) his relay, counter and generated prompt;
(9) fills into the visit and the record, the hand-back, the two "not answering" lines
replaced; (10) `check-calvin`, the short run, the walk. **Eyeball stop 3:** one real walk from
Dispatches to a number, captured. Docs of §11 ride here. Pull requests A and B each end with a light close; the full close-out runs
once, after C, because C ends the family.

Nothing reaches `main` on the strength of this approval; each pull request stops at "built, not
committed" until her word, as the process rules say.

---

## 13. Rulings needed

- **R1 — Closed: the engine crossed scrubbed, 3 Oct 2026.**
- **R2 — `check-engine` runs in front of the build**, like `check-roster`, not only by hand. **Ruled 1 Oct 2026: YES.**
- **R3 — The bundle's tests run here**: vitest as a dev dependency and `test:engine` by hand.
  Or carried and never run. **Ruled 1 Oct 2026: YES.**
- **R4 — `gsSdws.ts` and `check-gs-sdws.mjs` are deleted**, history keeping them, rather than
  parked. The Legacy tool folder stays as a marked stub. **Ruled 1 Oct 2026: YES.**
- **R5 — The two slider openings.** Operational days open at 347, water quality at 90%, each
  with a slider and the label in §4, each tagged DEFAULT and cited to the methodology; moved by
  the visitor, ASSUMED. **Ruled 1 Oct 2026: YES, with a slider each. Amended 10 Oct 2026 by her
  word:** the openings and their labels are as in §4, and neither is ASSUMED until moved.
- **R6 — A country absent from the UN household file:** Calvin asks the household size; the
  engine's quartile fallback is not used on the free site. **Ruled 1 Oct 2026: YES.** A country missing from the UN file: Calvin asks.
- **R7 — "Every value the engine used"** means every leaf input after resolution, derived
  inputs included, and never an equation result. The seal's `used` block follows that line. **Ruled 1 Oct 2026: YES.** "Every value used" means inputs, never results.
- **R8 — Carbon beside water** when Phoebe's carbon read is *likely eligible* **or** *not
  enough known*, the same rule that lets Wellington route to Quantify; held when *likely not* or
  *does not apply*; both shown, with a line, when she has looked at nothing. Ruling 3 says
  "found both eligible"; this widens it by one state so a project she could not settle is not
  refused a screening number. **Ruled 1 Oct 2026: YES.** Carbon sits beside water when Phoebe reads likely or not enough known.
- **R9 — The v1 finish line**: a visitor screens in 30 questions or fewer (Wellington → Phoebe →
  Bridget → Calvin → report / sign up), the project saves to the paid site, and the paid site's
  calculators, run on that saved project's inputs, give the same numbers as the screening. The
  saved-project run waits on the paid site's side by her hand; the brief is done on the checks of
  §10 and says that run is owed. **Ruled 1 Oct 2026: YES** on the parity proof; the line above
  is her wording of 9 Oct 2026.
- **R10 — The look reference.** **Ruled 1 Oct 2026: YES** to a fresh reference before the sheet
  is built. **Ruled 10 Oct 2026:** the reference is a text list of the paid calculator's block
  names and tag words, carried by her hand, with four captures of the paid calculator page at the
  repository root, untracked. Step 4, the sheet, builds from both: the same blocks, order, row
  style and tag words. The old saved pages are deleted.
- **R11 — The three rows Calvin may post to the record** are the class and people served only;
  the country he settles stays a calculator field on this site, not a record field, until the
  seal's carry names it. **Ruled 1 Oct 2026: YES.** Calvin writes only class and people served to the record.
- **R12 — Pull request A and the new engine.** **Ruled 10 Oct 2026: do not wait.** Pull request A
  builds on the bundle on hand, v0.16.1. Until a new sealed engine carries cleared fuel data,
  every carbon headline is a dash with *Baseline fuel data is not on this site yet.* The new
  engine later replaces `engine/` as a hash-checked swap. No stand-in is added and nothing in
  `engine/` is edited. To check on the swap: that `countryBaselineDefault` still reports "no
  row" for a country without data, which is how the wrapper keeps the engine's own preset off
  the screen.
- **R13 — HWT days.** **Ruled 10 Oct 2026:** 365, the days the device is in the home — a full
  year (V2.0 SDWS 36, p. 71). Settled by R24; nothing is pending (§4.2).
- **R14 — The water litres slider's range.** **Ruled 10 Oct 2026: YES**, 0 to 20 L (§4.4). An After
  v1 entry reviews the ceiling.

**Ruled 10 Oct 2026, a second set**, on the open questions of pull request A's steps 1 to 3. An After v1
entry reviews all of them together with R14.

- **R15 — Embodied emissions route:** spread over five years (Eq. 19), per V2.0 §9.2.2.1(b) — the
  methodology's rule (§2.2).
- **R16 — C_b 0 and U_p 1 have no source:** sources to be found on the paid side for the new engine.
  Until then they stay listed as "no source" (§7.1).
- **R17 — Activity emissions:** a field Calvin asks — does the system use energy (diesel, grid, none)?
  and how much? Until answered, a technology that uses energy shows a carbon dash (§2.2, §6).
- **R18 — Institutions (IWT):** the carbon headline is a dash. Settled by R26: schools and clinics
  are v2 (§3, §4.1).
- **R19 — Fuel without stove data stays a dash;** the new engine must carry a stove rule per country
  (§1.3).
- **R20 — `engine/` beside `carried/`:** logged as a later tidy, no change now (§1.1).
- **R21 — Country matching:** a short alias list of common country names, mapping to the UN M49
  names; labelled as ours, never a value (§3).

**Ruled 10 Oct 2026, a third set**, with the look reference, before step 4 was built.

- **R22 — Every SDWS reference shows its version**, e.g. "V2.0 SDWS 36", as the paid site does
  (§2.1).
- **R23 — Six sliders, each a learning tool**, each with one line saying how moving it changes the
  credits: litres (carbon), days, water quality, litres (water), stove efficiency, usage rate
  (household treatment only, never 0). Each opens at the cautious value the engine carries, cited.
  Stove opens at the most efficient class (0.30, V2.0 SDWS 11) (§4).
- **R24 — HWT days are the days the device is in the home:** a full year, 365 (V2.0 SDWS 36,
  p. 71) (§4.2).
- **R25 — No script for Calvin.** He reads the record to tell a new project from one in
  transition, follows the shared agent rules, and asks a transitioning project for its filed V1.0
  fNRB (§8, §2.1).
- **R26 — Schools and clinics (IWT): v2** (§3, §4.1).
