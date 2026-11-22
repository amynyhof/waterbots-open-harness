# Proposal — Road to v1 step 5: the water figure from the open core, with Calvin 0.5.0

**Written 21 Nov 2026 for the maintainer. Proposal only: nothing is built.**

It answers her message of 21 Nov 2026. Road to v1 step 5 says the water figure comes from the open core's VWBA D-3
module, in place of this site's `src/lib/vwbaD3.ts`. Her ruling on #187 says the same: "once her first release is
out, swap your own D-3 water calculator for her package, so there is only one D-3 calculator."

**The release is out.** `calvin-violet-v0.5.0` was published on 21 Nov 2026 (01:43 UTC on 22 Nov). It holds:
- Calvin 0.5.0;
- Violet 0.5.0, her first release;
- core 0.1.1, the same file, byte for byte, as in `calvin-v0.4.1`.

The release says "No sum changed, and every reference case gives the same answer."

**The build would be one pull request, lane 3**, because it changes packages, `scripts/`, `src/lib/` and CI. Its For
the maintainer block would carry before-and-after pictures at laptop and phone size.

---

## What I read

I read these on GitHub, at the tag `calvin-violet-v0.5.0`. Nothing was cloned, downloaded or installed.
- **The release notes and its four files:**

  | File | Size | SHA-256 |
  |---|---|---|
  | `waterbots-calvin-0.5.0.tgz` | 673,339 bytes | `0412d39b…6d95af1e4b` |
  | `waterbots-violet-0.5.0.tgz` | 29,274 bytes | `b51f214c…6804a6a02` |
  | `waterbots-core-0.1.1.tgz` | 17,969 bytes | `4e9be070…a446f6b5a`, the same hash as the core file in `vendor/waterbots/` today |
  | `SHA256SUMS.txt` | | |

- **Calvin's README**, the section "Changes in 0.5.0".
- **Violet's README**, and her `package.json`:
  - version 0.5.0, marked private and not published to npm;
  - it depends on `@waterbots/core` 0.1.1, with React 19.3.1 as an optional peer;
  - its entries are `.`, `./engine` and `./screen`.
- **Violet's screen and doors:** `src/screen.ts`, `src/screen/D3Screen.tsx` and `src/doors.ts`.

---

## 1. Install the release

1. **Put the three package files in `vendor/waterbots/`**: `waterbots-calvin-0.5.0.tgz`, `waterbots-violet-0.5.0.tgz` and
   `waterbots-core-0.1.1.tgz`, unchanged. Take them from the release, with its `SHA256SUMS.txt`. The 0.4.1 Calvin file
   goes.
2. **Update `package.json`** to `"@waterbots/calvin": "file:vendor/waterbots/waterbots-calvin-0.5.0.tgz"`, and add
   `"@waterbots/violet": "file:vendor/waterbots/waterbots-violet-0.5.0.tgz"`. The core entry is unchanged. Then run
   `npm install`, so the lockfile pins each file's SHA-512.
3. **Widen `scripts/check-calvin-package.mjs`, or add a sibling `check-violet-package.mjs`.** Either way, it:
   - pins the release tag `calvin-violet-v0.5.0` and all three SHA-256 values;
   - checks the lockfile's SHA-512 values;
   - re-runs Calvin's made-up reference cases, as it does today;
   - adds the Violet check to the CI list in `.github/workflows/checks.yml`.
4. **Regenerate Calvin's scoped styles** with `node scripts/build-calvin-css.mjs`, so `src/styles/calvin.css` carries
   0.5.0's rules under `.wb-calvin`. CI's `--check` holds it current.

## 2. Calvin 0.5.0: the site changes his README asks for

Each step from "Changes in 0.5.0", and what it means here:

| His README says | What this site does |
|---|---|
| Keep importing `@waterbots/calvin/styles.css`. | Already done in `CalvinCalculator.tsx`. No change. |
| The header pins to the top of the area that scrolls. A site with a fixed bar of its own sets `--calvin-pin-top` to that bar's height. A site whose page colour is not `--card` can set `--calvin-pin-bg`. | The site menu sits above the console, not inside the area that scrolls, so I expect no `--calvin-pin-top` on a laptop. On a phone the page scrolls with the menu, so I will measure it. `--calvin-pin-bg` is set only if the panel behind the calculator is not `--card`. Both are measured in the build and shown in pictures. |
| Nothing between the work surface and the area that scrolls may clip its overflow. | I will find any `overflow: hidden` or `auto` between Calvin's work surface and the Tool tab's scroller in `base.css`, and name each one in the pull request. Any that blocks the pin changes only for that wrapper. |
| `unpinFigureBlock: true` can stay: the tiles stay pinned either way. | Kept. **What a visitor sees changes:** the credit tiles now stay at the top while the rest scrolls. Since 21 Nov, with this switch on, nothing was pinned. |
| The controls panel holds only what the site passes in `header`, and Calvin's buttons. A site that puts an introduction of its own in `header` and no longer wants it there takes it out. | This site passes `RecordFacts` as `header`. That is the "Calvin reads the facts from your project record, on the left …" line her walk flagged (S31). **I propose taking the introduction out** and keeping only the "Still needed: …" line, with "Tell Wellington" and no "type the country" (the left rail has no box for the place). The Commons passes its own facts form as `header`, and that stays. |
| `referenceCaseCount` is no longer shown. | This site does not pass it. No change. |
| `VersionTabs` takes `showNote`. | This site does not use `VersionTabs` directly. No change. |

## 3. The swap: Violet's D-3 screen in place of this site's water calculator

**Today:**
- Calvin's Tool tab has two chips, "Carbon credits" and "Water benefits".
- Water benefits is this site's own `QuantificationWorksheet.tsx`, on the pack in `src/lib/vwbaD3.ts`, registered in
  `src/lib/methodPacks.ts`.
- It reads nothing from the record. It has its own people-served box and its own five fit questions.

**After the swap:**
1. **The Water benefits chip mounts Violet's screen**, `D3Screen` from `@waterbots/violet/screen`:
   - `project` is the same record adapter Calvin uses (`src/lib/calvinProject.ts`), which already passes
     `population: { mode, served }`;
   - `lockView` is `"ex-ante"`, as the open site screens before a project runs.
2. **People served come from the record.** Violet's screen has no box for them and follows the record when the count
   arrives or changes. Missing, it says: "this project's record is missing people served … Fill it in on the project
   record and the figures follow." That closes three of her walk findings for the water calculator: people served
   asked again, its own fit questions, and a minus number of people.
3. **The figure is Violet's.** `onChange` gives the site her input and `D3Result`. The site keeps that one result
   beside the visit, as it keeps Calvin's summary, for:
   - the screening report's "Water benefits, first estimate" row, now carrying her result's `status`, "Draft —
     pending expert review";
   - Calvin's crew line ("Water estimate ready" when her result is whole);
   - the save, which carries her inputs and never a figure, as today.
4. **This site's own D-3 code goes**, so there is one D-3 calculator:
   - `src/lib/vwbaD3.ts`, its entry in `src/lib/methodPacks.ts`, and the D-3 parts of `QuantificationWorksheet.tsx`;
   - `scripts/check-vwba-d3.mjs` and its place in the CI list.

   `METHOD_PACKS` would then be empty. Whether the empty pack seat stays or goes is a question below.
5. **Styles.** Violet's package ships no stylesheet. Her screen is plain markup under `.violet-d3`. This site writes
   its look in its own tokens, scoped to that class, in a file of its own beside `calvin.css`. Her heading is "Water
   provided (VWBA 2.0, D-3)". Her phone layout comes from those styles, which answers the walk's four-line label wrap.
6. **Words in this repository that name the old calculator** are updated: Calvin's Knowledge pack text, his Commons
   card, Wellington's build-update fact (at the next full close-out), CLAUDE.md's Scope, and BUILD_PLAN step 5.

## 4. Proof

1. **The packages are the release's files**: three SHA-256 values and the lockfile's SHA-512, checked in CI.
2. **Calvin's reference cases give the same answers** as on 0.4.1. The release says no sum changed, and the check
   re-runs them.
3. **Violet's hand-worked cases pass here.** Road step 5's "done when" asks for this. Her cases are invented projects,
   worked by hand, each step cited (`docs/vwba-d3-spec.md` in the open core). Her package ships only `dist`, so her
   tests are not in it. See question C.
4. **Before and after, on made-up inputs.** The same invented project goes through this site's D-3 today and Violet's
   after. Each difference is named and explained in a table in the pull request: options, defaults, rounding, what
   counts as missing. The two are not expected to match line for line.
5. **Pictures** at laptop and phone size:
   - Calvin's carbon tab, before and after, showing the pinned tiles and the header without the introduction;
   - the Water benefits tab, before and after;
   - the screening report's water row.

## 5. Questions for the maintainer

- **A. The Commons.** Violet's `doors.ts` says that in the Commons she "asks the user for every value she needs". Her
  0.5.0 screen has no box for people served: it reads the record only. The Commons has no project record. Three
  choices:
  - (a) the Commons shows the water calculator with her "missing people served" line, which cannot be filled there;
  - (b) the Commons hides Water benefits until her package has a Commons door with its own box;
  - (c) the Commons passes the facts typed into its own facts form as the record.

  I recommend **(c)**, since that is what the Commons already does for Calvin. It does not need a new release.
- **B. A path Phoebe ruled out.** Violet's `doors.ts` says "the water calculator always shows". Her walk found a figure
  given for a water path Phoebe had ruled out (A30). The swap does not change who reads Phoebe's findings. Today
  neither calculator does. Does the swap stay at "one D-3 calculator", leaving A30 for the Agent orchestration sprint,
  or should the water chip say the path is ruled out in this same pull request? I recommend leaving it for A30, as
  her paste of 21 Nov says those findings wait for their family's sprint.
- **C. Violet's hand-worked cases here.** Two ways to run them:
  - (a) this repository reads her cases from the release tag on GitHub and keeps them, labelled invented, in its
    check;
  - (b) Session C ships them inside her package, as Calvin ships his, in a later release.

  I recommend **(b)**, because the cases then come with the package and nothing is copied by hand. Until then, step 5
  is not done by its own done line.
- **D. The empty pack seat.** With D-3 gone, `METHOD_PACKS` holds nothing. Keep the empty seat in
  `src/lib/methodPacks.ts` for later D-n methods, or remove it with its checks? I recommend removing it. Violet's
  package is where the D-n methods now live.
- **E. Violet's name.** BUILD_PLAN item A23 says Calvin's VWBA row becomes Violet's, after v1. This swap installs her
  code but leaves the chip under Calvin, with no Violet name, face or colour on this site. Is that right for now?

## 6. What I could not check

- **I did not install the package files or run anything from them.** The hashes above are the release's own. The
  fingerprint check runs in the build.
- **I read Violet's source at the tag, not the built `dist` inside her package file.** The build pull request would
  confirm that the entries `D3Screen`, `recordPopulation`, `followRecord`, `missingPopulationFacts` and `seedD3Input`
  are exported from `@waterbots/violet/screen` as built.
- **I have not measured the pin.** Which wrappers clip overflow, and whether a phone needs `--calvin-pin-top`, is
  measured in the build.
- **Her result's units and the report's wording for it** are read from the screen in the build, not from here.
