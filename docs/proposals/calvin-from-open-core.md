# Proposal — Calvin from the open core

**Written 27 Oct 2026 for Amy. Proposal only: nothing is built, installed or deleted.** It answers her brief of
26 Oct 2026: the open site installs Calvin from the open core instead of keeping its own sealed engine copy.
**Ruled the same day:** Amy's twelve answers are in section 7, and what is still open is in section 8. Nothing is
built yet.

## What I read, and what I found

**Read on GitHub only, by Amy's word in the brief:** `amynyhof/waterbots-open-core-modules` at `50fe2f6`, the merge
of its pull request #5 ("Add calculator module", 26 Oct 2026). Nothing was cloned. Rule zero said this site never
reads another repository. Amy ruled yes on 27 Oct 2026 (ruling 1), and CLAUDE.md's rule zero now says so.

**The open core, as it stands:**

- `packages/core` and `packages/calvin`, both `@waterbots/...`, version `0.0.0`, marked `private` (so npm will not
  publish them). **The repository itself is public.** No release and no tag exists yet.
- The seed is recorded in its `SEEDS.md`: seal tag `calculator-seal-2026-10-25`, engine gs4gg-carbon **0.19.0**, 67
  fingerprints, 48 of 48 number checks passing on made-up cases.
- Its own plan already chooses npm: a publish job with provenance (a signed record of which commit built the
  package), Amy's approval on every release, and a first release `0.1.0` (its step M2.2). That waits on four
  hand-steps of hers: the npm scope, an npm token, herself as release reviewer, and a tag rule.
- **Calvin holds carbon only.** The water method (Volumetric Water Benefit Accounting, VWBA, method D-3) is the core's step M8, which will bring this site's water
  file in. Until then the water figure stays on this site's own code.

**The open site, as it stands:**

- `carried/` holds the paid site's engine **v0.16.1** (37 tracked files). **Nothing on `main` reads it.** No file
  in `src/`, `api/` or `scripts/` imports it, and no build setting includes it.
- What visitors see today comes from the site's own screening code: `src/lib/gsSdws.ts` (carbon, two versions) and
  `src/lib/vwbaD3.ts` (water), listed in `src/lib/methodPacks.ts`. The carbon code uses a fixed fuel profile, six
  countries and the MoFuSS fraction of non-renewable biomass (fNRB) figures.
- `src/lib/carried.ts` is a different thing: the receiver for a question carried in from the paid site's landing. It
  stays.

**Found after the first draft: the closed pull request #151.** I missed it in the first draft, and I should have
found it. #151 built Calvin on the old copy, on the branch `calvin/engine-crosses`. Amy closed it without merging on
15 Oct 2026, by her ruling: the free site installs the shared package instead of a hand-built copy of the engine.
**That ruling came first, and this proposal carries it out.** Her closing note on #151 lists what to reuse:

- her rulings R22 to R26: every SDWS reference shows its version; six sliders that teach; household treatment
  days are 365; no script for Calvin, who asks a transitioning project for its filed V1.0 fNRB; schools and clinics
  are v2;
- `scripts/check-calvin-engine.mjs`, 83 checks on made-up projects;
- the Quantify sheet, restyled to match the paid look but built in this site's own code;
- the six-slider layout in `src/lib/calvinFields.ts`, with water quality opening at 100%, not the branch's 90%;
- ten open points, still standing.

`PROPOSAL_calvin-brief.md` is tracked on that branch only. It is not on `main`, and it is not on disk here.

**Three facts that block a plain install today**, all on the core's side:

1. **The package shows nothing usable.** `@waterbots/calvin`'s entry exports only its name. The engine sits inside
   the package but is hidden. The seed's own `engine.ts` already expects a door named `@<scope>/calvin/engine`.
2. **React versions clash.** Both packages ask for React exactly 19.3.1. This site runs React 18.3.1, and its map
   library (react-leaflet 4) needs 18. npm stops an install on that clash.
3. **The built files run in a browser bundle, not in plain Node.** The README says so. Fine for the site's pages;
   it would break a server endpoint that ran the engine.

## 1. How the site gets the packages

Three ways. In each, the site names one exact version (no `^`), and `package-lock.json` keeps a fingerprint of the
file, so a changed file fails the install instead of slipping in.

### Option A — npm, with provenance (my pick)

The core publishes `@waterbots/core` and `@waterbots/calvin` to the public npm registry through the job it already
has. The site installs them like React.

- **Safety.** npm never lets a version number be reused, so `0.1.0` means the same bytes forever. Provenance ties
  the package to one commit on the core's `main`, and this site's checks can confirm it with `npm audit signatures`.
  The risk: a publish is public and permanent (npm allows removal only for 72 hours).
- **Pinning.** `"@waterbots/calvin": "0.1.0"`, exact, plus the lockfile's fingerprint.
- **What Amy does.** The core's four hand-steps: own the `@waterbots` scope on npm, add the token, set herself as
  the release reviewer, set the tag rule. Then approve the release. Carry three changes to the core first (below).
- **Why it is my pick.** It is the core's own plan, and the paid site will install the same published packages. Two
  sites on one version number is what the v1 fence asks for: the same numbers on both sides.

### Option B — GitHub Packages

The same packages, kept on GitHub's own package store.

- **Safety.** As good as npm for pinning. But **every install needs a token**, even for a public package. That puts
  a secret into Vercel and into this site's checks, which hold none today.
- **Pinning.** The same: exact version plus the lockfile.
- **What Amy does.** Make a token, store it in Vercel and in this repository's settings, and rename the packages to
  `@amynyhof/...`, because GitHub Packages names must match the account.
- **Not my pick:** a new secret on a site that has none, for no gain over A.

### Option C — a pinned commit, as a release file

npm cannot install one folder of a multi-package repository straight from a git commit, and the built files are
not stored in git. The way that works: the core builds each package into one file at a tag and attaches it to a
GitHub release. The site installs that file by its web address.

- **Safety.** The lockfile's fingerprint catches any swap. No signed record unless the core adds one. No account and
  no token.
- **Pinning.** The release file's address plus the lockfile fingerprint.
- **What Amy does.** Approve a release in the core, which first needs a new release job there.
- **When to use it:** only as a stop-gap if she wants Calvin on the open site before the npm steps are done. Moving
  to A later is a one-line change in `package.json`.

**Ruled 27 Oct 2026 (rulings 2 and 3):** the route is decided after Amy talks with Harrison Kerr. **Until then, Option
C: a release file pinned by its fingerprint.** No npm publish until after the fresh public repository and the full
number gate.

### In every option: own the name first

`@waterbots/calvin` asks for `@waterbots/core` by name. Until Amy owns the `@waterbots` scope on npm, a stranger
could publish a package with that name, and an install could pick it up. **Claiming the scope now closes that,**
even if publishing waits. **Ruled (ruling 4):** Amy claims it.

### What the core needs first (made by Session C in its own repository)

**Ruled (ruling 5):** Session C makes these changes in the open core. Nothing is carried by hand, and nothing is done
from here.

1. An engine door: `@waterbots/calvin/engine`, exporting what `engine.ts` exports today, with no React in it.
2. React marked optional for anyone who uses the engine door only, so a React 18 site can install it.
3. A real version (`0.1.0`) and `private` turned off at release, which is its step M2.2.
4. Optional: built files that also run in plain Node, if Calvin's chat ever runs the engine on the server. My
   proposal keeps the engine in the browser, so this can wait.
5. **For the interim route:** a job that builds each package into one release file at a tag and attaches it to a
   GitHub release. This is not one of the three changes in ruling 5 (section 8, point C).

## 2. What changes on the open site

Three steps, each its own commit, in two pull requests.

**Step 1 — install, prove the package, show nothing new (lane 3).**
- `package.json` and `package-lock.json`: the two packages, exact versions.
- New `scripts/check-calvin-package.mjs`: re-runs the package's own made-up cases (proof P1, below) and checks the
  installed version is the pinned one. Added to `.github/workflows/checks.yml`.
- No screen changes. It rides in the same pull request as step 2, as groundwork.

**Step 2 — the carbon tab runs on the engine (lane 3, with Amy's browser check).**
- `src/lib/gsSdws.ts` keeps the site's fields, words and citations but stops doing sums. It turns the visitor's
  answers into the engine's input, calls the engine, and shows the result. The fixed fuel profile, the straight
  line and the six-country MoFuSS table go; the engine's cited data takes over.
- `scripts/check-gs-sdws.mjs` is rewritten to prove step 2 (proofs P2 and P3, below).
- Where #151 already built this on the old copy (the sheet, the six sliders, `check-calvin-engine.mjs`), step 2
  reuses it, with the import paths moved to the package. Which screen that means is section 8, point A.
- `knowledge-packs/calvin-quantify/`: its README and CHANGELOG name the engine and its version.
- `src/lib/vwbaD3.ts` and `scripts/check-vwba-d3.mjs`: **no change.** Water stays on the site's own code until the
  core's water step.

**Screens.** Calvin's Tool tab, on the desk and on the Commons (the same screen). His Knowledge tab shows the engine
and its version. The core's own screens are not used: they need React 19, and the brand book governs here.

**Agents.** Calvin's chat is not built yet (item A21). Its proposal planned to read `carried/`; it would read the
engine door instead. **Ruled (ruling 8):** his chat uses the open core's `prompt.md`, plus a small open-site add-on
only if needed, the same way the paid site does. Wellington, Phoebe and Bridget: no change. Wellington's build-update fact mentions the switch at
the next full close-out.

**What a visitor would notice:**
- The carbon figure can move (section 4 says why and by how much).
- More countries work: every country with an official figure, and a regional figure for the rest of Asia, Latin
  America and sub-Saharan Africa. A country in none of them gets a plain "no figure" instead of a number.
- The Paris-aligned tab applies the downward adjustment factor (DAF), so its figure is lower than today's.
- A transition figure needs the project's filed V1.0 fNRB (section 5).
- The water figure does not change.

## 3. Deleting the old sealed engine copy

**Ruled (ruling 10):** yes, `carried/` is deleted in its own pull request once the carbon tab runs on the engine.

**What goes, in its own pull request after step 2 is merged (lane 3):**
- `carried/`, all 37 tracked files.
- `.gitattributes`: the `carried/** -text` line and its comment.
- `.gitignore`: the `!carried/calculators/data/legacy/` line and its comment.
- `CLAUDE.md` and `BUILD_PLAN.md`: the lines that describe `carried/`, rewritten to name the package.
- **Kept:** the tags `engine-carry-2026-09-27` and `engine-carry-2026-10-04`, the `carried/**` line in
  `.github/lanes.json` (it keeps any future copy in lane 3) and its cases in `scripts/check-lanes.mjs`.

**Why after step 2, not before:** proof P2 runs the old copy and the package side by side. The old copy is needed
until that table is in a merged pull request.

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

**An honest warning first: the carbon numbers will not all stay the same.** Today's site does not use the sealed
engine; it uses its own simpler screening sums. Moving to the engine changes some answers, for known reasons. What the
proofs show is that every difference has a named cause, and that the site's engine is the paid site's engine.

- **P1 — the package is the seal.** In this site's checks, every case in the package's `expected-outputs.json` (45
  made-up cases and 2 fNRB cases) runs through the installed package and must match exactly. The engine version must
  read `0.19.0`. The lockfile fingerprint must match the published file.
- **P2 — the package against the old copy here.** The same 45 cases run through `carried/` v0.16.1 too. They should
  match, except where the engine's own notes for 0.17.0 to 0.19.0 say they move: the full DAF table, and the cases
  where 0.18.0 refuses rather than assumes a missing fact. **Any other difference stops the work** and goes to Amy.
- **P3 — the site before against the site after.** Every made-up case in `scripts/check-gs-sdws.mjs` runs through
  today's code and through the new one. One table: old figure, new figure, difference, cause. The causes I expect:
  - fNRB source: MoFuSS (today) against the official national figures the engine cites. India 0.06 → 0.07, Kenya
    0.30 → 0.29, Uganda 0.35 → 0.39, Malawi 0.49 → 0.48, Tanzania 0.51 → 0.51, Niger 0.60 → 0.61.
  - The DAF, which today's Paris-aligned tab leaves out.
  - Age tiers on household runs (the engine's Table 9 step), which today's code leaves out.
  - Where the same fNRB and the same fuel profile are typed into both, the two should agree to four decimal places.
    **That is a target to measure, not a promise.**
- **P4 — water is unchanged.** `scripts/check-vwba-d3.mjs` passes with no edits.

**Amy approves on the table and on pixels:** a before-and-after capture of Calvin's Tool tab, same case, same width,
in the pull request's For Amy block.

**Ruled (ruling 6):** the new carbon figures are accepted once Amy has seen the before-and-after table on test cases.
This replaces her rulings D, E and F of 2 Sep 2026.

## 5. The v1 journey

Wellington → Phoebe → Bridget → Calvin → report / sign up.

- **Wellington.** No change. His prompt stays at 26,034 characters against the 26,199 gate.
- **Phoebe.** No change.
- **Bridget.** No change: map and pin as today.
- **Calvin.** **This is the v1 condition met:** his carbon number comes from the same engine as the paid site. It
  also changes two things he has to know:
  - **People or households.** Engine 0.19.0 refuses a count with no unit. Wellington already keeps
    `record.served` with its unit (`people` or `households`), so this fits with no new question when he has asked
    it. When he has not, Calvin asks. That may be one more question toward the 30.
  - **Transition needs the filed V1.0 fNRB.** Since 0.12.0 the engine will not work out a transition without the
    project's own filed figure. Calvin asks for it, says where it is written (the project's own design document),
    and with no filing gives a plain "no transition figure" instead of a borrowed one. Today's site borrows a
    national default. This affects transition screenings only.
- **Report.** Not built yet (item S21). It would print the engine name and version beside the figures.
- **Sign up and save.** No change. The save never carries a computed number.
- **The fence's check gets simpler:** when the paid site installs the same version, the same inputs give the same
  numbers by construction. What is left to show is that the screening's inputs reach the paid site whole.

**Nothing in the journey breaks.** Two things change: the carbon figure, and up to two questions from Calvin.
**Ruled (ruling 9):** Calvin may ask "people or households?" and for the filed fNRB when needed. The second matches
her ruling R25 of 10 Oct 2026.

## 6. The fresh public repository

Amy plans a fresh public repository with clean history, guided by Harrison Kerr.

- **It never holds `carried/`.** If this work lands first, the snapshot has no `carried/`. If the fresh repository
  comes first, the snapshot leaves `carried/` out. Either way, the old copy and its history (item O16) stay behind.
- **What carries over as it is:** the two exact versions in `package.json`, the lockfile (so the fingerprints travel),
  `scripts/check-calvin-package.mjs`, the rewritten `gsSdws.ts` and its check, and this proposal under `docs/`.
- **What does not:** the two `engine-carry-*` tags, and the `carried/` lines in `.gitattributes` and `.gitignore`.
- **The update rule travels too:** a new Calvin version comes in only on Amy's word, in a lane 3 pull request, with
  P1 to P3 run again and the table in the pull request. No automatic update tool.
- **For Harrison Kerr's review:** the whole change is one dependency, one file that turns answers into engine
  input, and one check. It should move to any structure he proposes without rework.

**Ruled (ruling 11):** this work goes first, proven on the live site, and the fresh repository copies it afterward.

## 7. What needed Amy's word — ruled 27 Oct 2026

Each question as it was asked, then her ruling.

1. **Rule zero.** May this site install the open core packages, and may the engineer read the core repository on
   GitHub?
   **Ruled: yes,** on GitHub only. CLAUDE.md's rule zero now says so; the old wording is in
   `docs/archive/CORRECTIONS.md`.
2. **The route.** npm with provenance (my pick), GitHub Packages, or the release-file stop-gap?
   **Ruled: decided after Amy talks with Harrison Kerr.** Until then, a release file pinned by its fingerprint
   (Option C).
3. **The first npm publish.** Does it wait for the core's real number gate (its step M1.2)?
   **Ruled: no npm publish until after the fresh public repository and the full number gate.**
4. **Claim the `@waterbots` npm scope now**, even if publishing waits?
   **Ruled: Amy will claim it.**
5. **Carry to the core** the engine door with no React, React optional for engine-only users, and version `0.1.0`?
   **Ruled: Session C makes the three changes in its own repository.** Nothing is carried by hand.
6. **New carbon numbers.** Does the carbon figure move to the engine's cited data (official fNRB figures, DAF, age
   tiers)?
   **Ruled: accepted, after Amy sees a before-and-after table on test cases.** This replaces rulings D, E and F of
   2 Sep 2026.
7. **Engine only, or the core's screens?**
   **Ruled: keep this site's own screens; use the engine only.**
8. **Calvin's chat prompt.** The site's own (my pick), or the core's `prompt.md`?
   **Ruled: the open core's `prompt.md`,** plus a small open-site add-on only if needed, the same way the paid site
   does.
9. **Calvin's two questions:** people or households, and the filed V1.0 fNRB before a transition figure?
   **Ruled: yes,** when needed.
10. **Delete `carried/`** in its own pull request after step 2?
    **Ruled: yes,** once the carbon tab runs on the engine.
11. **Order with the fresh repository.**
    **Ruled: this work goes first; the fresh repository copies it afterward.**
12. **Calvin's brief (item A21).** Update `PROPOSAL_calvin-brief.md` to match?
    **Ruled: yes.** Not done yet: the brief is not where the plan file said it was (section 8, point B).

## 8. Still open after the rulings

Each needs Amy's word before the build proposal.

- **A. Which screen is "this site's own"?** Today's Quantify tab on `main`, or #151's sheet, restyled to match the
  paid look but built in this site's own code? My reading is #151's, because her closing note lists it for reuse.
- **B. Where Calvin's brief is updated.** It is tracked only on `calvin/engine-crosses`, the closed #151's branch, and
  is 705 lines. Three ways: update it on that branch; bring it into this pull request under `docs/proposals/`, checked
  first for figures that must not publish; or fold its standing rulings (R1 to R26) into this proposal and retire it.
- **C. The release file needs a release job in the core.** That is a fourth change for Session C, beyond ruling 5's
  three.
- **D. Rule zero is now written two ways.** CLAUDE.md has the open core exception. PROCESS_RULES_for_ShellB.md's
  standing rules still say "this repo sees only this repo", and AGENT_RULES.md's *The wall* restates rule zero for
  agents. CLAUDE.md calls a difference between them a defect to raise, so I raise it. Fixing it is one line in
  PROCESS_RULES, on her word. *The wall* needs a look at the same time: it is about the private platform, and the
  open core is not that, but ruling 8 brings its prompt here.
- **E. The core's `prompt.md` has not been read against AGENT_RULES.md** or this site's language rules. The build
  step reads it and puts any conflict in the add-on or in front of Amy. Her ruling R25, no script for Calvin, still
  stands.
- **F. #151's ten open points** still stand, as her closing note lists them. They go into the build proposal.
- **G. CLAUDE.md's Scope section** still describes the two carbon packs as differing in one cited input (rulings D, E
  and F). It changes when step 2 is built, not now.
