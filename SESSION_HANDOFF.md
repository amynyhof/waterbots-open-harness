# Session handoff

**Current state only.** Rewritten from scratch at the close of 2 Sep 2026, and rewritten from
scratch at every close — maintainer's ruling of 29 Aug 2026, *the opening reads stay thin, forever*.

**No history lives here.** How things came to be is in [BUILD_LOG.md](./BUILD_LOG.md), which is
append-only and is **not** read at the opening. Each open thread's own story is in its row in
[OPEN_ITEMS.md](./OPEN_ITEMS.md); closed items are in
[OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md), which is also not an opening read. If this file
starts explaining how something happened, that is the defect the ruling names.

Read it with [CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence, with
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run, and with
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

---

## Where things stand

**Everything on `main` is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from
`main`. The working tree is clean apart from two ungraded card drafts.

> **One pull request is open as this is written: the free desk, the console in the production
> shape, and the two carbon packs — the whole of 2 Sep 2026, on `feat/free-desk`.** Until it
> merges, every row marked *2 Sep* below is true on that branch and not yet on `main` or on the
> live site. **Thursday's C4SW walk is on waterbots.ai, not here.**

**The console has four surfaces, in the production shape.** A journey bar of six phases across the
top of the centre, four tabs beneath it — Dispatch, Eligibility, Partners (Map), Quantify — and
the desk opens first.

| Surface | State |
|---|---|
| **The desk (Dispatch)** | **2 Sep.** Wellington's desk: project context, rows derived from the visit, the save door. His chat is on the paid site, and the composer says so |
| Basin map (Partners) | Live, keyed CARTO Voyager basemap under a Slate 13% wash. **2 Sep:** a click pins a basin for the visit |
| Eligibility worksheet | Live |
| Quantification (Quantify) | Live. **2 Sep:** three packs — VWBA 2.0 D-3, Carbon · Legacy V1, Carbon · PAA v2.0 — and the transition delta between the two carbon packs |
| Phoebe, Eligibility and Feasibility | Live on Opus 5, capped at 20 messages a day. **2 Sep:** her roster sentence names all three packs, the two carbon clauses signed |
| Wellington, Team Lead | **2 Sep.** Hosts the desk, extended from the shared crew, never forked. Not a post in the primer; Phoebe cannot name him yet |
| Bridget, the map's agent | Named in the map's dock; **her chat is not built** |
| Calvin, the quantification agent | Named in his dock; **his chat is not built** |
| Agent handoff primer | Live — Phoebe inherits it. Three posts; the pack list renders from the registry |
| Shared chat layer | Live, built through Level 2 |
| Project points | Not started — blocked on registry data (item D2) |

## The visit, and what the desk may say

**Everything the console knows about the project in front of it is the visit**, held by the shell
in `src/App.tsx` and shaped in `src/lib/visit.ts`: the project context (name, place, standard of
interest), the pinned basin, the eligibility rows, and every pack's answers. **Nothing is written to
storage. A reload starts over, and the page says so.**

- **Rows derive from the visit and are never invented.** Phoebe's row once a criterion moves;
  Bridget's once a basin is pinned; Calvin's once a pack has a figure, or a row saying what it still
  needs. **The last row is always "Save this project and sign up"**, which opens waterbots.ai in a
  new window and says plainly that nothing is carried across yet — the two-window fallback until the
  bridge (item S7) is real.
- **A row built from a pack's worked example says so first.** The example is labelled on the
  worksheet; the desk must not drop the label.
- **A pin fills the place if it was blank and never overwrites a typed place.**
- **Wellington's count is the number of rows.** An empty visit reads one next step, the save door.
- **Phoebe's row has not been seen on screen.** It derives from the statuses only her live answers
  move, and the sitting made no live model calls.

## The Quantification step, and what it may say

**The step is Quantification. A pack is one tool inside it.** The surface is pack-keyed and knows
nothing about any method — fields, gates, defaults, formula, arithmetic, headline and unit all come
from the pack. **A result is a list of figures, each with its unit, and one is the headline**; the
water pack reports cubic metres and the carbon packs report tonnes of CO₂-equivalent, and the
worksheet draws either without knowing which. Items S10, K5 and K6.

**The two carbon packs are one module, `src/lib/gsSdws.ts`, and differ in one input** — the
non-renewable share of biomass. The PAA tab fills it from MoFuSS Table 5, cited; the legacy tab
fills Uganda, Kenya and Malawi from the CDM's expired default list, cited, and asks for a typed
share elsewhere. **The emission factor is derived and labelled derived** — a straight line in that
share under a stated standard profile. **The PAA tab says which v2.0 adjustments it does not apply**
and that the credited figure is lower, never higher.

- **Blank is never zero, anywhere.** The one zero default — project emissions for a zero-emission
  technology — is the methodology's own rule and shows as a default.
- **The half-day premises build from the methodology's sum**, not from the reference tool's
  defective cell. The field's why-note records the deviation.
- **The transition delta is one line under the tabs**, on either carbon tab, only when both have a
  complete answer. The worked example, Uganda and made up, gives the demo figures.
- **The v2.0 citation carries the cover date, 9 July 2026**, by the errata ruling.
- **Everything the step produces is a screening estimate**, anticipated and never verified, with a
  consultant-review tag wherever it renders.

## The design system as it now stands

**The brand book is `brand/BRAND.md`, version 4.2.** It is gitignored twice over and does not
publish. It carries **Windows line endings**; edit it preserving them. **§6's role label for
Wellington is struck and corrected in place to "Team Lead"**, the maintainer's ruling of 2 Sep 2026.
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is **superseded** by the book and stays
published as history.

- **One light brand.** No dark theme. One set of tokens in `src/styles/tokens.css`.
- **Two grounds.** `--paper` is the content canvas; `--frame` is the frame — top bar, journey bar,
  rail, and the right column's ground.
- **Three planes and no fourth.** A card cannot contain a card.
- **Host panels carry their agent's accent** at 5% fill and 25% border: Wellington **Tide**, Phoebe
  **Anemone**, Bridget **Surf**, Calvin **Plum**.
- **Production is canon for the console's shape.** Journey bar, tab row, row anatomy and the
  calculator's idiom are taken from the saved production pages in `Design refs/` — the look only.
- **Big numbers sit on white, in ink.** An accent belongs on small tags.
- **The stress ramp is unchanged** and is gated by `scripts/check-palette.mjs`.

**Design work starts from an image**, and approval of a look is given on pixels.

## Waiting on the maintainer

- **The open pull request** — the free desk and the carbon packs. Checked in her browser at three
  checkpoints; waiting on review and merge.
- **Wellington's primer sentence**, for the desk's second pass. Until it comes, Phoebe cannot name
  him.
- **Grading the two card drafts** — `activity-cards-vwba-DRAFT.md` and
  `definitions-cards-vwba-DRAFT.md`. They stay uncommitted until then.
- **Whether the export copies should be produced by a script** (item O8).

**Four things wait on real visitors, not on anyone**: the number twenty (item O1), the basemap's
five-million-request ceiling (item O9), the primer review against the abstention log (item A5), and
whether an abstention that cited a card is a fault (item A7).

**One thing waits on production.** The bridge (item S7) is on their desk as their **#149**.

**One thing waits on C4SW, Thursday.** The legacy fNRB shares are the CDM's expired defaults; the
maintainer asks C4SW whether those are the figures the legacy projects were assessed with.

## Phoebe — settings that are stated rather than inherited

- **Claude Opus 5**, thinking adaptively at **medium** effort, budget **16,000** output tokens,
  **call timeout 120 seconds**. All four are written in `api/phoebe.ts`.
- **A reply shorter than 40 characters is refused**, not delivered. The floor is in `api/_reply.ts`.
- **One retry, only for a 400 arriving after five seconds.** `check-cap` proves it.
- **She never writes a citation.** She returns a card number and places a marker.
- **She names Calvin's three packs from the registry.** She quotes no figure from any of them.

## Confirming the build

**Thirteen checks. All must pass.** Three need a build first because they read `dist/`.

```bash
node scripts/check-basins.mjs               # counts, fields, geometry, Level 6 to 4 nesting
node scripts/check-stress.mjs               # join coverage, derivation labelling
node scripts/check-palette.mjs              # ramp lightness order, chroma separation
node scripts/check-cards.mjs                # both card sets parse and are complete
node scripts/check-api-exports.mjs          # the relay can actually answer once deployed
node scripts/check-visitor-id.mjs           # the scrambled identity is stable, unique, salted
node scripts/check-cap.mjs                  # 20 pass, 21 refused, refunds, no double charge
node scripts/check-reply-guard.mjs          # an answer too short to be one is refused
node scripts/check-vwba-d3.mjs              # the water pack answers the way the method says
node scripts/check-gs-sdws.mjs              # both carbon packs reproduce every reference row
node scripts/build-prompt-modules.mjs --check   # cards AND primer are not stale
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

**After editing any card, the agent primer, or the pack registry, run
`node scripts/build-prompt-modules.mjs`.** The primer's pack list renders from the registry, so a
renamed pack makes the staleness gate fail until the module is rebuilt.

## Running it locally

The API key must be in the environment before the server starts, then `npx vite`:

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npx vite
```

**An env file does not work for Phoebe's key.** Vite puts env files into the browser's
`import.meta.env`, and the relay is Node code reading `process.env`.

**The basemap key is the opposite case** and lives in `.env.local` as `VITE_CARTO_KEY`, baked into
the bundle at build time. Without it the map works and every tile is watermarked.

**`PHOEBE_DIAGNOSE=1` turns on failure diagnosis logging.** Off by default. Named in the code as
debt to remove.

> **Two people cannot work in this folder at once.** While the maintainer is checking in the browser,
> the engineer touches nothing.
>
> **And only one dev server at a time.** Start it as `npx vite`, not `npm run dev`.

## Housekeeping — where things are on this machine

- **`gh` is installed and signed in but is not on the shell's PATH.** Call it at
  `C:\Program Files\GitHub CLI\gh.exe`.
- **`brand/BRAND.md` carries Windows line endings** and is gitignored, so nothing normalises it.
- **`brand/assets/bots/` is ignored and re-opened one file at a time.** Four portraits are
  allow-listed: `bridget.svg`, `phoebe.svg`, `calvin.svg`, `wellington.svg`. A new one needs its own
  `!` line or the build passes locally and fails on deploy.
- **`Design refs/` is gitignored** and holds the saved production pages and captures, brought in by
  the maintainer's hand: the dispatch desk and console, the calculator, and the PAA transition and
  legacy calculator pages. Look references only. **The saved pages route away on hydration if
  served**, so read their markup rather than rendering them.
- **`sources-local/methodology/` holds the Gold Standard sources**, the MoFuSS report, the CDM fNRB
  page transcribed, and the synthetic matrix. Never committed. The matrix is synthetic and
  anonymised: never quote provenance from it, never invent identities around it.
- **The browser extension refuses `file://` pages and any local port it has not been allowed**, and
  a tab can end up zoomed to 200% after a renderer timeout; a fresh tab reads at 100%.
- **Other Node processes on this machine may belong to `WaterBotsAI`**, a different repository.
  Not this repo's dev servers and not the engineer's to stop.

## Deployment

| | |
|---|---|
| **Live URL** | https://map.waterbots.ai |
| **Repo** | https://github.com/amynyhof/waterbots-open-harness (public), branch `main` |
| **Host** | Vercel, imported from GitHub — pushes to `main` deploy automatically |
| **Shared store** | Redis, via Vercel Storage, all three environments |
| **Branch hygiene** | Branch protection on `main`; delete-on-merge is on |

| Setting | For | If missing |
|---|---|---|
| `ANTHROPIC_API_KEY` | Phoebe's relay | She says she is not connected |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | The shared store | She does not answer at all |
| `PHOEBE_VISITOR_SALT` | The scrambled visitor identity | Same. **Set once, never changed** |
| `PHOEBE_LOG_KEY` | Opens the abstention log | That address returns nothing |
| `VITE_CARTO_KEY` | The basemap, **at build time** | The map works, every tile watermarked |

**A settings change only reaches a deployment that starts after it**, and doubly so for
`VITE_CARTO_KEY`, which is read when the bundle is built.

## Known conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic and Siberia overlap collides at
  every level; the checks name it and fail on any *other* collision.
- **`getBoundsZoom` clamps to the current `minZoom`.** It is cleared before measuring.
- **HydroBASINS excludes Antarctica.** Southern data limit −55.883; the view extends to −68 by design.
- **The arid and no-data basin fills are near-neutral *and* low-opacity on purpose.** Do not brighten
  them and do not warm them.
- **The basemap wash sits under those two categories**, so it tints what shows through them.
- **The basemap needs a key and has a five-million-request monthly ceiling.** Item O9.
- **The output budget is 16,000 and the ceiling is genuinely reached**, about once in seventy-five.
- **Phoebe gets a marked region of the primer, not the whole file.**
- **Basins are drawn on canvas, not as SVG paths.** A selector like `path.leaflet-interactive` finds
  nothing, and that does not mean the map is empty.
- **The basin layer rebuilds on a pin.** The pin is part of the layer's key, because a pin is a
  style and a handler and the layer re-reads neither without a rebuild.
- **The desk and the two worksheets hold no state of their own** and are mounted only while open;
  the visit holds it. The map and the docks stay mounted.
- **Seven tracked text files still carry Windows line endings on disk.** Nothing is broken.
- **Browser screenshot capture on this machine sometimes returns a page at roughly 200%.** Take it
  again, or open a fresh tab.

## The documents, and which one owns what

**Six opening documents**, read in order at the start of every session — the ritual is owned by
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md).

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules, machine housekeeping | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run; both rituals; visible corrections; bundling; record-once; thin reads; images first | Yes |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | **Superseded by the brand book. Kept as history** | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks, the abstention ladder | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every **open** item, in five families, and the north star | Yes |
| **This file** | Where things stand **now** | Yes |
| [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) | **Closed items, in full. NOT read at the opening** | Yes |
| [BUILD_LOG.md](./BUILD_LOG.md) | **How they came to stand there. NOT read at the opening** | Yes |

**The brand book and UI_REFERENCE.md are gitignored and never publish.**
**`agent-primer.md` is lowercase on purpose** — committed content an agent inherits, not a rulebook.

**[OPEN_ITEMS.md](./OPEN_ITEMS.md) is over 2,000 lines.** Item O10 was swept to the archive on
2 Sep 2026 and three items joined; item O11 is the standing habit and the next sweep is due.

## What to do first

**Run Part 1 of the opening ritual**, in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md): read the six documents, confirm `main`
equals `origin` with the identifiers compared, report where things stand and **what changed
underneath us**, kill stray dev servers, and **check for code reading an unpushed migration**.
**No building in Part 1.**

**Then Part 2 — propose the session's plan.** Nothing is scheduled. The candidates are named in
[BUILD_PLAN.md](./BUILD_PLAN.md) and none is chosen.

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.** A worked example is labelled as made up wherever it renders,
  on the desk included.
- **Propose, approve, build, eyeball, commit word.** An approved plan is a batch approval; it
  loosens nothing else.
- **Plans end at "built and checked."** The engineer reports *built, not committed* and stops.
- **Merge a checkpoint's pull request before building the next one on the same branch**, or the two
  travel together.
- **Design work starts from an image**, and approval of a look is given on pixels, not prose.
- **Production is canon for the console's shape.** Match layout, row anatomy and density from the
  saved pages; take none of their data, composers, organisations, roles or saving.
- **A form that looks like it works and does not is a false success state.** Fields ship with the
  arithmetic behind them or they do not ship.
- **Blank is never zero.** Any pack, any field.
- **Cite or it does not ship.** A default with no source asks instead.
- **Record once, point everywhere else.** **Visible corrections over rewritten history.**
- **Every pull request opens with a "For Amy" block.**
- **A gate that passes is not a verdict.** It measures separation; it cannot measure what a colour
  reads as.
- **Measure the book too**, and **check a new instrument against a known reading** before trusting
  it. A check's reference figure rounded by hand will disagree with the unrounded arithmetic at the
  fourth decimal; compare against the module's own figure.
- **Look at the thing itself.** A hot reload does not rebuild a map layer; a fault seen right after
  an edit may be the old layer.
- **Anything an agent inherits is rendered from its source, not retyped.**
- **Never `git add -A`.** Stage named files.
