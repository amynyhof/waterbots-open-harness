# Proposal — Calvin from the open core

**Written 27 Oct 2026 for Amy. Proposal only: nothing is built, installed or deleted.** It answers her brief of
26 Oct 2026: the open site installs Calvin from the open core instead of keeping its own sealed engine copy.
**Ruled twice the same day.** Her first twelve answers and her second round are in section 7; what is still open is
in section 8. **This proposal replaces Calvin's old brief**, `PROPOSAL_calvin-brief.md`, which stays on the closed
#151's branch as history (ruling 12). Nothing is built yet.

## What I read, and what I found

**Read on GitHub only, by Amy's word:** `amynyhof/waterbots-open-core-modules` at `50fe2f6`, the merge of its pull
request #5 ("Add calculator module", 26 Oct 2026). Nothing was cloned. Rule zero now allows exactly this (ruling 1).

**The open core, as it stands:**

- `packages/core` and `packages/calvin`, both `@waterbots/...`, version `0.0.0`, marked `private` (so npm will not
  publish them). **The repository itself is public.** No release and no tag exists yet.
- The seed is recorded in its `SEEDS.md`: seal tag `calculator-seal-2026-10-25`, engine gs4gg-carbon **0.19.0**, 67
  fingerprints, 48 of 48 number checks passing on made-up cases.
- Its own plan already chooses npm: a publish job with provenance (a signed record of which commit built the
  package), Amy's approval on every release, and a first release `0.1.0` (its step M2.2).
- **Calvin holds carbon only.** The water method (Volumetric Water Benefit Accounting, VWBA, method D-3) is the
  core's step M8, which will bring this site's water file in. Until then the water figure stays on this site's code.
- **Calvin's package holds the paid site's calculator screens**: the work area, the project-facts panel, the version
  tabs, the equation stack and a print report. They compute nothing; every number comes from the engine. They are
  written for React 19 and styled with Tailwind utility classes and the paid site's colour names.

**The open site, as it stands:**

- `carried/` holds the paid site's engine **v0.16.1** (37 tracked files). **Nothing on `main` reads it.** No file
  in `src/`, `api/` or `scripts/` imports it, and no build setting includes it.
- What visitors see today comes from the site's own screening code: `src/lib/gsSdws.ts` (carbon, two versions) and
  `src/lib/vwbaD3.ts` (water), listed in `src/lib/methodPacks.ts`. The carbon code uses a fixed fuel profile, six
  countries and the MoFuSS fraction of non-renewable biomass (fNRB) figures.
- The site runs **React 18.3.1**, and its map runs on react-leaflet 4.2.1, which needs React 18.
- `src/lib/carried.ts` is a different thing: the receiver for a question carried in from the paid site's landing. It
  stays.

**Found after the first draft: the closed pull request #151.** I missed it in the first draft, and I should have
found it. #151 built Calvin on the old copy, on the branch `calvin/engine-crosses`. Amy closed it without merging on
15 Oct 2026, by her ruling: the free site installs the shared package instead of a hand-built copy of the engine.
**That ruling came first, and this proposal carries it out.** Her closing note on #151 lists what was worth reusing.
After her second round (ruling 7, changed), **#151's sheet is not used**; its six-slider layout is the guide for the
slider setting (section 10), and its rulings R22 to R26 still stand.

**What blocks a plain install today**, all on the core's side:

1. **The package shows nothing usable.** `@waterbots/calvin`'s entry exports only its name. The engine and the
   screens sit inside the package but are hidden.
2. **The screens' stylesheet is not in the package.** The build copies TypeScript output only, and the package
   ships `dist`, `LICENSE` and `NOTICE`. `styles.css` (the print rules for the report) is left behind.
3. **The built files run in a browser bundle, not in plain Node.** Fine for the site's pages; it means the engine
   cannot run inside a server endpoint here.

## 1. How the site gets the packages

Three ways. In each, the site names one exact version (no `^`), and `package-lock.json` keeps a fingerprint of the
file, so a changed file fails the install instead of slipping in.

### Option A — npm, with provenance

The core publishes `@waterbots/core` and `@waterbots/calvin` to the public npm registry through the job it already
has. The site installs them like React.

- **Safety.** npm never lets a version number be reused, so `0.1.0` means the same bytes forever. Provenance ties
  the package to one commit on the core's `main`, and this site's checks can confirm it with `npm audit signatures`.
  The risk: a publish is public and permanent (npm allows removal only for 72 hours).
- **Pinning.** `"@waterbots/calvin": "0.1.0"`, exact, plus the lockfile's fingerprint.
- **What Amy does.** The core's four hand-steps: own the `@waterbots` scope on npm, add the token, set herself as
  the release reviewer, set the tag rule. Then approve the release.
- It was my first pick: the core's own plan, and two sites on one version number.

### Option B — GitHub Packages

The same packages, kept on GitHub's own package store.

- **Safety.** As good as npm for pinning. But **every install needs a token**, even for a public package. That puts
  a secret into Vercel and into this site's checks, which hold none today.
- **What Amy does.** Make a token, store it in Vercel and in this repository's settings, and rename the packages to
  `@amynyhof/...`, because GitHub Packages names must match the account.

### Option C — a pinned commit, as a release file

npm cannot install one folder of a multi-package repository straight from a git commit, and the built files are
not stored in git. The way that works: the core builds each package into one file at a tag and attaches it to a
GitHub release. The site installs that file by its web address.

- **Safety.** The lockfile's fingerprint catches any swap. No signed record unless the core adds one. No account and
  no token.
- **Pinning.** The release file's address plus the lockfile fingerprint.
- **What Amy does.** Approve a release in the core, which first needs a release job there.

**Ruled 27 Oct 2026 (rulings 2 and 3):** the route is decided after Amy talks with Harrison Kerr. **Until then, Option
C: a release file pinned by its fingerprint.** No npm publish until after the fresh public repository and the full
number gate. Moving from C to A later is a one-line change in `package.json`.

### Own the name first

`@waterbots/calvin` asks for `@waterbots/core` by name. Until Amy owns the `@waterbots` scope on npm, a stranger
could publish a package with that name, and an install could pick it up. **Ruled (ruling 4):** Amy claims it.

### What the core needs (made by Session C in its own repository)

**Ruled (ruling 5):** Session C makes these changes in the open core. Nothing is carried by hand, and nothing is done
from here. Ruling 5 named three; with the screens now in use (ruling 7, changed) the list is longer, and section 8
asks her to pass the whole list on.

1. **Two doors:** the engine (`@waterbots/calvin/engine`, what `engine.ts` exports today) and the calculator screens
   with their state hook and the missing-facts helpers (`missingProjectFacts`, `recordOwnedFacts`).
2. **A real version** (`0.1.0`) at release, which is its step M2.2.
3. **A release job** that builds each package into one release file at a tag and attaches it to a GitHub release,
   for the interim route.
4. **`styles.css` shipped in the package.**
5. **A list of the colour and type names the screens use** (`fg-1` to `fg-4`, `line`, `t-mono`, `eyebrow` and the
   rest), so a host knows what to define. This site renamed `fg-1` to `fg-4` to `ink` to `ink-4` on 29 Aug 2026.
6. **The four drinking-water classes.** The core's technology list has `CWS`, `HWT` and `other`. This site's record
   keeps Gold Standard's four classes: CWS, CWT, HWT, IWT. Which method community treatment (CWT) takes, and that
   institutions (IWT) are v2 (ruling R26), belongs in the core's own mapping, which says Calvin owns it.
7. **The two settings in section 10**, arriving as a new open core version.
8. Optional: built files that also run in plain Node. Not needed for this plan (section 11 keeps the engine in the
   browser).

The React change in ruling 5 (React optional for engine-only users) **is no longer needed**: the site moves to
React 19 instead (section 9).

## 2. What changes on the open site

Four steps, each its own commit, in four pull requests, all lane 3. Section 9 is step 1; section 11 is step 4.

**Step 1 — React 19 (section 9).** Own pull request, with a before-and-after capture of the map.

**Step 2 — install, prove the package, and mount Calvin's calculator (Amy's browser check).**
- `package.json` and `package-lock.json`: the two packages, exact versions, from the release files.
- New `scripts/check-calvin-package.mjs`: re-runs the package's own made-up cases (proof P1) and checks the installed
  version is the pinned one. Added to `.github/workflows/checks.yml`.
- **Calvin's Tool tab mounts the open core's calculator screens** for carbon: the same calculator and look as the
  paid site. The site gives them what a host gives:
  - the project, from this visit's record, through one small adapter file (`src/lib/calvinProject.ts`): type and
    class to technology, country, people served and its unit;
  - the colour names the screens use, mapped to this site's tokens in one stylesheet, plus Tailwind told to read the
    package's files for class names;
  - the print stylesheet;
  - no save button: the screens show Save only when a host passes one, and the save door stays this site's.
- `src/lib/gsSdws.ts` and `scripts/check-gs-sdws.mjs` retire once proof P3's table is in the pull request.
  `src/lib/methodPacks.ts` keeps the water pack only.
- `knowledge-packs/calvin-quantify/`: its README and CHANGELOG name the package and its version.
- `src/lib/vwbaD3.ts` and `scripts/check-vwba-d3.mjs`: **no change.** Water stays on the site's own code until the
  core's water step.

**Step 3 — delete `carried/` (section 3).**

**Step 4 — Wellington asks Calvin's missing facts (section 11).** Own pull request: it changes a prompt, so it carries
a measured run.

**Screens.** Calvin's Tool tab, on the desk and on the Commons (the same screen), and his Knowledge tab, which names
the package and its version. #151's sheet is not used, and neither is today's carbon tab.

**Agents.** Calvin's chat is not built yet (item A21). **Ruled (ruling 8):** it uses the open core's `prompt.md`, plus a
small open-site add-on only if needed, the same way the paid site does. Wellington: section 11. Phoebe and Bridget: no
change. Wellington's build-update fact mentions the switch at the next full close-out.

**What a visitor would notice:**
- Calvin's carbon calculator looks and works like the paid site's: its derivation, its version tabs, its four tags.
- The carbon figure can move (section 4 says why and by how much).
- More countries work: every country with an official figure, and a regional figure for the rest of Asia, Latin
  America and sub-Saharan Africa. A country in none of them gets a plain "no figure" instead of a number.
- The Paris-aligned version applies the downward adjustment factor (DAF), so its figure is lower than today's.
- A transition figure needs the project's filed V1.0 fNRB (section 5).
- Wellington may ask the country, or people or households, before Quantify (section 11).
- The water figure and the map do not change.

## 3. Deleting the old sealed engine copy

**Ruled (ruling 10):** `carried/` is deleted in its own pull request once the carbon tab runs on the engine.

**What goes (lane 3):**
- `carried/`, all 37 tracked files.
- `.gitattributes`: the `carried/** -text` line and its comment.
- `.gitignore`: the `!carried/calculators/data/legacy/` line and its comment.
- `CLAUDE.md` and `BUILD_PLAN.md`: the lines that describe `carried/`, rewritten to name the package.
- **Kept:** the tags `engine-carry-2026-09-27` and `engine-carry-2026-10-04`, the `carried/**` line in
  `.github/lanes.json` (it keeps any future copy in lane 3) and its cases in `scripts/check-lanes.mjs`.

**Why after step 2, not before:** proof P2 runs the old copy and the package side by side.

**Proof that nothing still uses it, in the pull request:**
1. A search of `src/`, `api/` and `scripts/` for `carried/` finds no import. (Measured today: none. The only hits are
   the lane rule's test strings, `.gitattributes`, `.gitignore` and the docs.)
2. All checks and the build pass with the folder gone.
3. **The built site is byte for byte the same** before and after the deletion: build, take a fingerprint of every
   file in `dist/`, delete, build, compare. If nothing used it, nothing changes.

**What deleting does not do:** the files stay in this repository's history, with the old figures noted in item O16.
Only the fresh repository (section 6) leaves them behind.

## 4. Proof it is the same calculator

**Made-up cases only.** No real filing comes into this repository, and the paid side's reference cases never cross.
Checking real filings stays on the paid side.

**The carbon numbers will not all stay the same.** Today's site uses its own simpler screening sums, not the sealed
engine. What the proofs show is that every difference has a named cause, and that the site's calculator is the paid
site's calculator.

- **P1 — the package is the seal.** In this site's checks, every case in the package's `expected-outputs.json` (45
  made-up cases and 2 fNRB cases) runs through the installed package and must match exactly. The engine version must
  read `0.19.0`. The lockfile fingerprint must match the release file.
- **P2 — the package against the old copy here.** The same 45 cases run through `carried/` v0.16.1 too. They should
  match, except where the engine's own notes for 0.17.0 to 0.19.0 say they move: the full DAF table, and the cases
  where 0.18.0 refuses rather than assumes a missing fact. **Any other difference stops the work** and goes to Amy.
- **P3 — the site before against the site after.** Every made-up case in `scripts/check-gs-sdws.mjs` runs through
  today's code and through the engine. One table: old figure, new figure, difference, cause. The causes I expect:
  - fNRB source: MoFuSS (today) against the official national figures the engine cites. India 0.06 → 0.07, Kenya
    0.30 → 0.29, Uganda 0.35 → 0.39, Malawi 0.49 → 0.48, Tanzania 0.51 → 0.51, Niger 0.60 → 0.61.
  - The DAF, which today's Paris-aligned version leaves out.
  - Age tiers on household runs (the engine's Table 9 step), which today's code leaves out.
  - Where the same fNRB and the same fuel profile are typed into both, the two should agree to four decimal places.
    **That is a target to measure, not a promise.**
- **P4 — water is unchanged.** `scripts/check-vwba-d3.mjs` passes with no edits.
- **P5 — the screen shows the engine's number.** On the same made-up cases, the figure drawn on Calvin's screen equals
  the engine's own result for the same inputs.

**Ruled (ruling 6):** the new carbon figures are accepted once Amy has seen the before-and-after table on test cases.
This replaces her rulings D, E and F of 2 Sep 2026. The table and a before-and-after capture of Calvin's Tool tab go in
the step 2 pull request's For Amy block.

## 5. The v1 journey

Wellington → Phoebe → Bridget → Calvin → report / sign up.

- **Wellington.** Asks Calvin's missing facts before Quantify (section 11). His prompt grows, against a gate with 165
  characters of room.
- **Phoebe.** No change.
- **Bridget.** No change to what she does. Her map moves to React 19 underneath (section 9) and must look the same.
- **Calvin.** **This is the v1 condition met:** his carbon number comes from the same engine as the paid site, on the
  same calculator. With Wellington's questions asked, he opens with his facts filled. He still asks two things only
  he needs, by ruling 9 and ruling R25:
  - the project's filed V1.0 fNRB, for a transition figure only. With no filing he gives a plain "no transition
    figure" instead of a borrowed one;
  - household size, only for a country with no UN figure.
- **Report.** Not built yet (item S21). The core's screens carry a print report; whether the screening report uses it
  is for that report's own proposal.
- **Sign up and save.** No change. The save never carries a computed number.
- **The fence's check gets simpler:** when the paid site installs the same version, the same inputs give the same
  numbers by construction. What is left to show is that the screening's inputs reach the paid site whole.

**Nothing in the journey breaks.** It changes in three places: the carbon calculator and its figure, Wellington's
questions, and up to two questions from Calvin.

## 6. The fresh public repository

Amy plans a fresh public repository with clean history, guided by Harrison Kerr. **Ruled (ruling 11):** this work goes
first, proven on the live site, and the fresh repository copies it afterward.

- **It never holds `carried/`.** The copy is taken after step 3, so the old copy and its history (item O16) stay
  behind.
- **What carries over as it is:** React 19 and react-leaflet 5, the two exact package versions, the lockfile (so the
  fingerprints travel), the adapter file, the colour-name stylesheet, `scripts/check-calvin-package.mjs`, Wellington's
  missing-facts block, and this proposal under `docs/`.
- **What does not:** the two `engine-carry-*` tags, and the `carried/` lines in `.gitattributes` and `.gitignore`.
- **The update rule travels too:** a new open core version comes in only on Amy's word, in a lane 3 pull request,
  with P1 to P5 run again and the table in the pull request. No automatic update tool.
- **For Harrison Kerr's review:** the whole change is one dependency, one adapter file, one stylesheet and one check.
  It should move to any structure he proposes without rework.

## 7. Amy's rulings, 27 Oct 2026

### First round — each question as it was asked, then her ruling

1. **Rule zero.** May this site install the open core packages, and may the engineer read the core repository on
   GitHub?
   **Ruled: yes,** on GitHub only. CLAUDE.md's rule zero says so, and PROCESS_RULES_for_ShellB.md matches it (second
   round, a). The old wording of both is in `docs/archive/CORRECTIONS.md`.
2. **The route.** npm with provenance, GitHub Packages, or the release-file stop-gap?
   **Ruled: decided after Amy talks with Harrison Kerr.** Until then, a release file pinned by its fingerprint.
3. **The first npm publish.** Does it wait for the core's real number gate (its step M1.2)?
   **Ruled: no npm publish until after the fresh public repository and the full number gate.**
4. **Claim the `@waterbots` npm scope now**, even if publishing waits?
   **Ruled: Amy will claim it.**
5. **Changes in the core:** an engine door with no React, React optional for engine-only users, version `0.1.0`.
   **Ruled: Session C makes the three changes in its own repository.** Nothing is carried by hand. The list has since
   grown (section 1).
6. **New carbon numbers.** Does the carbon figure move to the engine's cited data (official fNRB figures, DAF, age
   tiers)?
   **Ruled: accepted, after Amy sees a before-and-after table on test cases.** This replaces rulings D, E and F of
   2 Sep 2026.
7. **Engine only, or the core's screens?**
   **Ruled, then changed by Amy the same day: the open site uses the open core's calculator screens**, the same
   calculator and look as the paid site. Not its own screens, and not #151's sheet. Her first answer was to keep this
   site's own screens.
8. **Calvin's chat prompt.** The site's own, or the core's `prompt.md`?
   **Ruled: the open core's `prompt.md`,** plus a small open-site add-on only if needed, the same way the paid site
   does.
9. **Calvin's two questions:** people or households, and the filed V1.0 fNRB before a transition figure?
   **Ruled: yes,** when needed. People or households is now Wellington's to ask first (section 11).
10. **Delete `carried/`** in its own pull request after step 2?
    **Ruled: yes,** once the carbon tab runs on the engine.
11. **Order with the fresh repository.**
    **Ruled: this work goes first; the fresh repository copies it afterward.**
12. **Calvin's brief (item A21).** Update `PROPOSAL_calvin-brief.md` to match?
    **Ruled: this proposal replaces it.** The old brief stays on #151's branch, `calvin/engine-crosses`, as history,
    unedited. **Done.**

### Second round

- **a. Rule zero in the process rules.** PROCESS_RULES_for_ShellB.md's standing rule now matches CLAUDE.md, with the
  old wording archived. **AGENT_RULES.md's *The wall* is left as it is, by Amy's ruling:** it covers what agents see
  at runtime, and installing a package does not change that.
- **b. The calculator screens**: ruling 7 above, changed.
- **c. React 19**: section 9 proposes how.
- **d. Two calculator settings this site will turn on**: sliders, and a simple view. Neither exists yet. **They are
  built in the open core by Session C, Calvin's home since the seed, and arrive as a new open core version; never
  patched onto this site.** Section 10 lists what this site needs from each.
- **e. Wellington's screening questions**: section 11. The whole screening stays within 30 questions.

## 8. Still open

Each needs Amy's word before the build steps they touch.

- **A. The list for Session C.** Ruling 5 named three changes; section 1 now lists eight, and section 10 adds the
  two settings. Will she pass the whole list to Session C?
- **B. Two looks on one Quantify step.** The carbon calculator will look like the paid site's; the water worksheet
  stays in this site's look until the core's water step (its M8). Accept that until then, or restyle the water
  worksheet to match?
- **C. Calvin's colour.** The brand book gives Calvin Plum on this site; the paid calculator's look uses Mint for him
  (#151's open point 7). With the paid look here, which wins? The brand book governs, so this is a raise for the book.
- **D. The core's `prompt.md`** has not been read against AGENT_RULES.md or this site's language rules. The build step
  reads it and puts any conflict in the add-on or in front of Amy. Ruling R25, no script for Calvin, still stands.
- **E. Wellington's prompt gate.** 26,034 of 26,199 characters. Section 11 adds text; the gate moves only on her word.
  I will measure after the build and propose a number.
- **F. #151's open points that still apply** with the core's screens: the usage rate has no source yet; the version
  tabs need an "already registered" fact the record does not hold; with no type on the record there are no figures,
  which is every Commons visit; fNRB's citation says V2.0 SDWS 25 where Eq. 1 names SDWS 24; the page script grows
  with the engine's country tables.
- **G. The stove-efficiency slider** (section 10) is a baseline value, not an anticipated-performance value. Under the
  slider rule as written it gets no slider. Keep it out, or name it as an exception?
- **H. CLAUDE.md's Scope section** still describes the two carbon packs as differing in one cited input (rulings D, E
  and F). It changes when step 2 is built, not now.

## 9. The move to React 19

**Why:** the core's calculator screens are written for React 19, and both packages ask for exactly 19.3.1. This site
runs 18.3.1.

**Does the map work on React 19?** **Yes, with one library upgrade.** react-leaflet 5.0.0 asks for React 19 and
Leaflet 1.9, and this site already runs Leaflet 1.9.4. The map uses six react-leaflet pieces (`MapContainer`,
`TileLayer`, `GeoJSON`, `Rectangle`, `useMap`, `useMapEvent`), all in `BasinMap.tsx` and `BasinLayer.tsx`, and
version 5 keeps all six. **Not yet checked:** version 5's change notes, line by line, against those two files. That
is the first thing step 1 does.

**The rest of the site:** a search found none of the things React 19 removes. The page already starts with
`createRoot`; there is no `ReactDOM.render`, no `defaultProps` or `propTypes`, no `forwardRef`, and no `useRef()`
without a starting value. The Vite plugin already supports React 19. The server endpoints use no React.

### Option A — upgrade in place (my pick)

React and React DOM to exactly 19.3.1, the React type packages to 19, react-leaflet to 5.0.0. The map code stays.

- **What changes:** `package.json`, the lockfile, and any small fixes the change notes call for in the two map files.
- **Checks:** every check and the build; then the map by eye, before and after, same width: world view, the zoom-5
  swap from Level 4 to Level 6, a pin, the legend, attribution on. Every step and the Commons open.
- **Risk:** small. Leaflet itself does not change, so the drawing does not change.

### Option B — replace the map library

Drop react-leaflet and drive Leaflet directly from a small wrapper, or move to another map library.

- **What changes:** both map files rewritten. Another library would also change how basins draw.
- **Not my pick:** it rewrites a working map for no gain. It is the fallback if version 5 fails the eyeball.

### Option C — keep React 18, run Calvin's screens in their own React 19 corner

Two copies of React on one page, Calvin's screen mounted apart.

- **Not my pick:** two Reacts, a heavier page, and the record has to cross between them. It solves today's clash and
  makes every later shared screen harder.

**Step 1 is its own pull request, lane 3,** with the map captures in the For Amy block. It does not need the core's
changes, so it can go first.

## 10. The two calculator settings — what this site needs

**Built in the open core by Session C, Calvin's home since the seed, and arriving as a new open core version. Never
patched onto this site.** This site only turns each setting on. Both settings change what is shown, never the
engine's arithmetic.

### (a) Sliders, ex-ante only

For anticipated-performance values, the third kind of value. A learning, "what if" tool for people new to carbon.

**Every slider, as this site needs it:**

1. Shows only in ex-ante mode (before the project runs), and only when the host turns sliders on.
2. Is bounded by that value's methodology floor and ceiling, each cited. Where a methodology names no floor, the
   core says what bounds it and cites it, or asks Amy.
3. Opens at the cautious value the engine carries, with that value's name and citation (ruling R23).
4. Has a pencil to type an exact value.
5. A typed value outside the bounds stays as typed, and the row says plainly that the credit is capped at the bound.
6. Always shows the credited number beside it, worked out by the engine.
7. Carries one plain line on how moving it changes the credits (ruling R23).
8. A moved or typed value takes its own tag, the one the core uses for a value the visitor set.
9. Every symbol reference shows its methodology version, for example "V2.0 SDWS 32" (ruling R22).

**The rows, using #151's six-slider layout as the guide:**

| # | In a visitor's words | Value | Range in #151 | Opens at (#151, updated) | Notes |
|---|---|---|---|---|---|
| 1 | Drinking water per person per day | QPW_p, V2.0 SDWS 29 | 0 to the methodology's cap | The engine's Table 9 figure | Household and community supply; no slider for institutions (R26) |
| 2 | Days a year the water is available | DO_p, V2.0 SDWS 32 | 1 to 365 | 347, the cap for paper logs | Above 347, only days a sensor records count: the capped message |
| 2b | Days the device is in the home | DP_p, V2.0 SDWS 36 | up to 365 | 365, a full year (R24) | Household treatment only; moves down only |
| 3 | Share of water tests that pass | M_q,y, V2.0 SDWS 22 | 0% to 100% | **100%**, by Amy's later ruling (#151 had 90%) | |
| 4 | Share of homes that really use the device | U_p, V2.0 SDWS 34 | 1% to 100%, never 0 | 100%, "no source yet" | Household treatment only; the methodology sets it by a usage survey |
| 5 | Efficiency of the old stove | η, V2.0 SDWS 11 | three-stone fire to improved cookstove | 0.30, improved cookstove | **A baseline value, not anticipated performance** (section 8, point G) |
| 6 | Water per person per day (water benefit) | VWBA D-3, Table D3.3 | 0 to 20 L | 20 L full, 2 L limited | **Not Calvin's carbon calculator**: water stays on this site's code until the core's water step |

So the carbon calculator's slider setting covers rows 1 to 4 for certain. Row 5 waits on Amy's word, and row 6
belongs to the water method.

### (b) A simple view

Hides advanced material. **What this site needs:**

- **A host setting** that opens the calculator in the simple view, and one plain link to show the full working. My
  pick: simple by default on this site and the Commons.
- **Always shown, even in the simple view:**
  - the credited figure, and both versions with the delta line for a transitioning project;
  - the screening tag and the consultant-review tag;
  - every refusal and warning (no official fNRB, filed V1.0 fNRB needed, a zero-credit warning), because an honest
    state is never hidden;
  - the project facts the figure rests on: technology, country, people served and the unit;
  - the sliders, when they are on;
  - a citation for every cited figure, in CITATIONS.md's shape.
- **Hidden in the simple view:** the equation stack, symbols and equation numbers, the "where" lists, charcoal
  convention, embodied emissions, leakage options, the fallback dial, the tag legend and the provenance strip.

## 11. Wellington asks Calvin's missing facts

**Goal:** Calvin opens with his facts filled, and no question is asked twice.

1. **The list comes from Calvin's own package.** The core's `missingProjectFacts` names what Calvin still needs, in
   its order: technology, country, people served, people or households, and household size (only for a country with
   no UN figure). It runs in the browser, on this visit's record, through the adapter file of step 2.
2. **It travels with each ask, as keys only**, the way "What Phoebe found" travels today. Wellington's endpoint accepts
   only those five keys and turns them into a short block headed "What Calvin still needs".
3. **Wellington asks exactly those**, one at a time, in that order, only what is still missing, in his own words. He
   asks them after Phoebe and before he invites Quantify. Technology comes from the class he already asks a
   drinking-water project; people served and its unit he already asks a water supply project.
4. **What he hears fills the record**, returned on the visitor's yes, like type and stage:
   - **country**: a new record field, an ISO country code from a closed list, beside the place as the visitor said it;
   - **household size**: a new record field, rare, a number as said.
5. **Calvin reads the record.** The core's screens take their facts from the project, so the calculator opens filled.
6. **Not Wellington's:** the filed V1.0 fNRB. Calvin asks it, for a transition only (ruling 9, ruling R25).

**Files (lane 3):** `api/_wellingtonPrompt.ts`, `api/_record.ts` (the closed key list),
`src/lib/visit.ts` (country, household size), Wellington's region in
`knowledge-packs/product-shared/agent-primer.md`, where "whatever is still missing when they reach Calvin, Calvin
asks" changes, `scripts/check-wellington.mjs`, and the regenerated prompt modules. One measured run after the change.

### The 30-question budget

A ceiling from the files, not a measured count:

| Who | Questions | Ceiling |
|---|---|---|
| Wellington | what it does, type, class, stage, people served with its unit, place, name | 7 |
| Wellington, for Calvin | country (when the place named none), household size (rare) | 2 |
| Phoebe | the Eligibility rows: 13 carbon, 5 water, fewer once the record and the class filter them | 18 |
| Bridget | the pin | 1 |
| Calvin | the filed V1.0 fNRB, transition only | 1 |
| **Total, worst case** | | **29** |

**A real walk counts it** before step 4's pull request asks for a merge. If a walk goes past 30, my pick is to drop
the name question, which only the desk uses. That is Amy's call.
