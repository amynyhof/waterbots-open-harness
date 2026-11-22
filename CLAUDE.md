# CLAUDE.md — how this repository works

This is the public, Apache 2.0 home of the WaterBots open site, live at https://open.waterbots.ai: a
world map of HydroSHEDS watershed basins coloured by water stress, and a free screening console where
the WaterBots agents (Wellington, Phoebe, Bridget, Calvin) help a visitor check a water project. Vercel
builds it from `main` on every push. The paid site is "Shell A"; this repository is "Shell B".

## The rules are on two pages

- **[RULINGS.md](./RULINGS.md)**: every ruling for how the whole site behaves.
- **[FAMILY_OPEN_CLOSE.md](./FAMILY_OPEN_CLOSE.md)**: how a family of work opens and closes.

Both are exact copies of the masters in the handoff folder. Only the maintainer changes them; a session
never edits them here. This repository holds no close-out rules of its own.

Beside them:

- **[AGENT_RULES.md](./AGENT_RULES.md)**: how every agent behaves, read by every agent.
- **[docs/modules/](./docs/modules/)**: one short rulings file per module: Wellington, Phoebe, Bridget
  and the map, the console, the save and questions carried in, the Agent Commons, Register your
  interest and Supporters, and analytics.
- Calvin and Violet are the open core's modules; their rulings live in the open core, not here.

## The plan and the log

- **[BUILD_PLAN.md](./BUILD_PLAN.md)**: the v1 finish line at the top, then every open item in its
  family.
- **[BUILD_LOG.md](./BUILD_LOG.md)**: the last three months only. GitHub's history keeps the rest.

## How-to facts

**Folders.**
- The handoff folder is `%USERPROFILE%\GitHub\handoff\`. This session reads its paste from
  `handoff\pastes\B.md` and writes its report to `handoff\reports\B.md`, overwriting it each time. It
  never opens another session's files there.
- `brand/BRAND.md` is the brand book, version 4.2. It is gitignored and has Windows line endings; keep
  them when editing.
- `legacy/` is gitignored reference material only. `sources-local/` is gitignored and holds source PDFs
  for local reading; they are never committed.
- `captures/` holds pictures for pull requests. A picture is committed on the branch, named by date and
  step, and embedded by its raw address at that commit.
- `vendor/waterbots/` holds the open core's release files, pinned by fingerprint.
  `scripts/check-calvin-package.mjs` checks them against the release's SHA-256 and the lockfile's
  SHA-512, and re-runs the package's own test cases.

**Knowledge packs** (`knowledge-packs/`). A pack holds `cards/`, `tool/`, `evals/`, a README and a
CHANGELOG. A tool is defined once, in `<pack>/tool/<tool-id>.yaml`, citing cards by id;
`scripts/check-tool.mjs` holds each row to the card it cites. The crew list is
`knowledge-packs/product-shared/roster.yaml`, carried whole from the paid site and never edited here;
`scripts/check-roster.mjs` runs in front of every build and fails it, naming the line, when the site
disagrees with it.

**Before every push.**
- The name scan: `node scripts/check-names.mjs --added origin/main` checks the lines and file names a
  pull request adds; `node scripts/check-names.mjs` alone checks every tracked file. The machine
  setting `WB_NAMES_LIST` holds the list's path. The list is in two places, the maintainer's file and
  the repository secret `NAMES_TO_BLOCK`, and she changes both together. Its output shows file, line,
  kind and counts, never a name. Never print or copy the list.
- The secrets scan: `git diff origin/main...HEAD | node scripts/scan-diff.mjs --secrets`.

**A carry** through the handoff folder checks each file's SHA-256 against the bundle's packing list
and runs the name scan on it.

**Checks.** `.github/workflows/checks.yml` lists every check; each runs as `node scripts/check-<name>.mjs`.
Also `node scripts/build-prompt-modules.mjs --check`, `node scripts/build-calvin-css.mjs --check`,
`npm run build` and `node scripts/check-attribution.mjs`. The README's *Running locally* and
*Confirming the build* say how to run the site and what each check guards.

**Lanes.** GitHub labels each pull request from its files, using `.github/lanes.json`; a file on no list
is lane 3.

**This machine.** The GitHub tool is installed and signed in but not on the shell's path: call it at
`C:\Program Files\GitHub CLI\gh.exe`. The session's local settings deny `gh pr merge`.

## Waiting for the maintainer: not on the rulings page yet

These stand until she places them on the rulings page or drops them.

- **Honest states.** No silent failures and no false success messages: the product says what really
  happened. A session reports its own mistakes at once.
- **How a session writes to her.** Plain English at a 4th- to 6th-grade level, never an item by its
  number alone. A pull request opens with a block for her (what changed, what she approved, what to
  check), then Coach decisions, then What I ran, with the name scan's count.
- **The brand book governs design, alone.** Never invent colours, type or styles outside it. What the
  book does not carry is raised with her, never invented; changes to the book arrive by her hand.
