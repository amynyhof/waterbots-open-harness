# Session handoff

**Current state only.** Rewritten from scratch at the close of 1 Sep 2026, and rewritten from
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

**Everything is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from `main`. The
working tree is clean apart from two ungraded card drafts.

**The console has three surfaces now.** Quantification joined on 1 Sep 2026.

> **Two pull requests are open as this is written, so two rows below are true on a branch and not
> yet on `main`.** #46 gives Calvin the primer's third post — until it merges, the primer carries
> two posts and Phoebe cannot name him. This close-out is the other. Everything else here is on
> `main` and deployed.

| Surface | State |
|---|---|
| Basin map | Live, keyed CARTO Voyager basemap under a Slate 13% wash |
| Eligibility worksheet | Live |
| **Quantification step** | **Live. One method pack fitted; carbon screening named and marked planned** |
| Phoebe, Eligibility and Feasibility | Live on Opus 5, capped at 20 messages a day |
| Bridget, the map's agent | Named in the map's dock; **her chat is not built** |
| **Calvin, the quantification agent** | **Named in his dock; his chat is not built** |
| Agent handoff primer | Live — Phoebe inherits it. **Calvin's third post is in #46, not yet merged** |
| Shared chat layer | Live, built through Level 2 |
| Project points | Not started — blocked on registry data (item D2) |

## The Quantification step, and what it may say

**The step is Quantification. A pack is one tool inside it.** The surface is pack-keyed and knows
nothing about any one method — fields, gates, defaults, formula and arithmetic all come from the
pack. **Do not type the surface to a method**; the same seat has to hold carbon screening and the
other D-methods later. Items S10 and K5.

**One pack is fitted: VWBA 2.0 · D-3 Volume Provided.** Household and community water supply,
ex-ante, Option 3 of Table D3.3. It refuses sanitation (D-6), recharge (D-4), irrigation and metered
supply by name, and tells a project which method fits instead of handing it a number.

- **Everything it produces is a screening estimate** — anticipated, never delivered, never verified —
  and it carries a consultant-review tag wherever it renders.
- **A blank without-project volume is NEVER zero.** It leaves the benefit as a dash and says the
  answer is incomplete. Reading a blank as zero would report the whole with-project volume as
  benefit — a large, confident, wrong number with nothing looking broken.
- **A typed zero IS accepted**, because a project with genuinely no prior supply needs a way to say
  so. **But no example anywhere subtracts a zero** — a training site that does teaches the wrong
  habit. Maintainer's ruling, 1 Sep 2026.
- **Three questions can stop the number**, not five. The 1 km and humanitarian questions are helpers:
  the first moves no litres either way, the second only lets the Sphere rates in.
- **Defaults are returned, never written into a visitor's answers**, so a default is always visibly a
  default. Limited access deliberately has no default number of days.

**The pack writes its own formula and the worksheet only draws it.** If the surface knew that D-3
multiplies people by litres by days, it would be a D-3 surface wearing a general name.

**Calvin's dock has a shape of its own** — a footer strip that never scrolls, carrying *screening
estimate · not verified*. A calculator cannot let those words scroll out of sight.

## The design system as it now stands

**The brand book is `brand/BRAND.md`, version 4.2.** It is gitignored twice over and does not
publish. It carries **Windows line endings**; nothing normalises it, so edit it preserving them.
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is **superseded** by it and stays
published as history.

- **One light brand.** No dark theme, no theme class. One set of tokens in `src/styles/tokens.css`.
- **Two grounds.** `--paper` `#F6F5FA` is the **content** canvas. `--frame` `#FBFBFE` is the frame —
  top bar, rail, and all three docks' ground. Book §2.3.
- **Three planes and no fourth.** Canvas, card, floating. **A card cannot contain a card** — inside a
  white sheet, separate with hairlines rather than a second fill.
- **Neutrals are `--ink`, `--ink-2`, `--ink-3`, `--ink-4`.** `--ink-3` is the readability floor.
- **Host panels carry their agent's accent** at 5% fill and 25% border: Phoebe **Anemone `#A04E7E`**,
  Bridget **Surf `#14C8D9`**, Calvin **Plum `#5848A8`**.
- **Big numbers sit on white, in ink.** An accent belongs on small tags — chips, pills, keylines —
  never as a wash behind a figure. Maintainer's ruling, 1 Sep 2026.
- **The stress ramp is unchanged** and is gated by `scripts/check-palette.mjs`.

**Calvin's Plum is a knowing exception to book §6**, which gives Plum to Reggie and forbids pointing
an accent at a second agent. So is his portrait, drawn here rather than carried in. Both are the
maintainer's rulings of 31 Aug 2026 and both are recorded in the book at §6.

**Do not give Calvin Mint.** It was the obvious pick — Vector holds the calculator seat on the paid
side in Mint — and it was refused on the merits: §2.1 also makes Mint *Success / approved*, and this
step's whole message is that its number is not verified. Walked in the browser, it read as approval.

**Do not give Arid or No Data a warm fill.** Tried, passed the gate, refused on the merits. The note
lives in `src/lib/stressPalette.ts`.

**Design work starts from an image**, and approval of a look is given on pixels.

## Waiting on the maintainer

- **Pull request #46** — Calvin takes the primer's third post. Open, checked in her browser, waiting
  on review and merge.
- **This close-out** — its own pull request, once opened.
- **Grading the two card drafts** — `activity-cards-vwba-DRAFT.md` and
  `definitions-cards-vwba-DRAFT.md`. They stay uncommitted until then.
- **Whether the export copies should be produced by a script** (item O8).

**Four things wait on real visitors, not on anyone**: the number twenty (item O1), the basemap's
five-million-request ceiling (item O9), the primer review against the abstention log (item A5), and
whether an abstention that cited a card is a fault (item A7).

**One thing waits on production.** The bridge (item S7) is on their desk as their **#149**.

**One thing was named and never arrived.** `Design refs/` was named in a ruling of 1 Sep 2026 and is
not on disk. The work it was meant to inform was built from the maintainer's written description and
from the second file already in `Calculator design ref/`. Both folder names are gitignored, so either
is safe to drop in.

## Phoebe — settings that are stated rather than inherited

- **Claude Opus 5**, thinking adaptively at **medium** effort, budget **16,000** output tokens,
  **call timeout 120 seconds**. All four are written in `api/phoebe.ts` with the measurements that
  chose them. **A default nobody wrote down is a decision nobody made.**
- **A reply shorter than 40 characters is refused**, not delivered. The floor is in `api/_reply.ts`.
- **One retry, only for a 400 arriving after five seconds.** `check-cap` proves it cannot cost a
  visitor two of their twenty.
- **She never writes a citation.** She returns a card number and places a marker; the browser renders
  the citation from the committed file.
- **Once #46 merges she can name Calvin and point at the Quantification step**, which she cannot do
  today. She still quotes no figure from it — the worksheet keeps nothing between visits and no agent
  can see what a visitor entered. Confirmed in the browser on the branch.

## Confirming the build

**Twelve checks. All must pass.** Three need a build first because they read `dist/`.

```bash
node scripts/check-basins.mjs               # counts, fields, geometry, Level 6 to 4 nesting
node scripts/check-stress.mjs               # join coverage, derivation labelling
node scripts/check-palette.mjs              # ramp lightness order, chroma separation
node scripts/check-cards.mjs                # both card sets parse and are complete
node scripts/check-api-exports.mjs          # the relay can actually answer once deployed
node scripts/check-visitor-id.mjs           # the scrambled identity is stable, unique, salted
node scripts/check-cap.mjs                  # 20 pass, 21 refused, refunds, no double charge
node scripts/check-reply-guard.mjs          # an answer too short to be one is refused
node scripts/check-vwba-d3.mjs              # the screening pack answers the way the method says
node scripts/build-prompt-modules.mjs --check   # cards AND primer are not stale
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

**After editing any card or the agent primer, run `node scripts/build-prompt-modules.mjs`.**

**From #46, that script also reads the method pack registry** and renders the primer's pack list from
it, so a renamed pack makes the staleness gate fail until the module is rebuilt. It also adds four
checks to `check-vwba-d3`, taking it from 63 to 68.

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

**`PHOEBE_DIAGNOSE=1` turns on failure diagnosis logging.** Off by default. It never logs a visitor's
question, only its length. It is named in the code as debt to remove.

> **Two people cannot work in this folder at once.** While the maintainer is checking in the browser,
> the engineer touches nothing.
>
> **And only one dev server at a time.** A second cannot take the port, exits, and requests silently
> go to the first. **Start it as `npx vite`, not `npm run dev`.**

## Housekeeping — where things are on this machine

- **`gh` is installed and signed in but is not on the shell's PATH.** Call it at
  `C:\Program Files\GitHub CLI\gh.exe`. Called bare it reports "command not found" and looks,
  wrongly, like a missing tool.
- **`brand/BRAND.md` carries Windows line endings** and is gitignored, so nothing normalises it.
- **`brand/assets/bots/` is ignored and re-opened one file at a time.** A new portrait needs its own
  `!` line in `.gitignore` or the build passes locally and fails on deploy. Three are allow-listed:
  `bridget.svg`, `phoebe.svg`, `calvin.svg`.
- **`Calculator design ref/` and `Design refs/` are gitignored.** Engineer-eyes-only look references,
  brought in by the maintainer's hand. Rule zero is unchanged: the engineer never fetches or guesses
  at the production side.
- **Other Node processes on this machine may belong to `WaterBotsAI`**, which is a different
  repository. They are not this repo's dev servers and are not the engineer's to stop.

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
`VITE_CARTO_KEY`, which is read when the bundle is built rather than when a request arrives.

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
- **Phoebe gets a marked region of the primer, not the whole file.** Embedding the whole document
  destabilised ordinary answers.
- **Basins are drawn on canvas, not as SVG paths.** A selector like `path.leaflet-interactive` finds
  nothing, and that does not mean the map is empty.
- **The Quantification surface is mounted only while you are on it**, unlike the map and the docks,
  because it holds no state worth preserving yet. When a visitor's figures need to survive a step
  away, it joins the others.
- **Seven tracked text files still carry Windows line endings on disk.** Nothing is broken — every
  git blob is Unix, and that is what ships. Item O10 is closed on that basis.
- **Browser screenshot capture on this machine sometimes returns a page rendered at roughly 200%**,
  always immediately after a renderer timeout. It is a capture artefact, not the build. Take the
  screenshot again.

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

**[OPEN_ITEMS.md](./OPEN_ITEMS.md) is over 2,000 lines again** and grew by about 200 this session.
The first sweep on 30 Aug took it from 2,173 to about 1,850. Item O11 is the standing habit and the
next sweep is due; item O10 is the obvious first candidate.

## What to do first

**Run Part 1 of the opening ritual**, in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md): read the six documents, confirm `main`
equals `origin` with the identifiers compared, report where things stand and **what changed
underneath us**, kill stray dev servers, and **check for code reading an unpushed migration**.
**No building in Part 1.**

**Then Part 2 — propose the session's plan.** Nothing is scheduled and no family is due. The three
obvious candidates are named in [BUILD_PLAN.md](./BUILD_PLAN.md) and none is chosen.

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.**
- **Propose, approve, build, eyeball, commit word.** An approved plan is a batch approval; it
  loosens nothing else.
- **Plans end at "built and checked."** The engineer reports *built, not committed* and stops, even
  when the maintainer has already said go. Item O5.
- **Merge a checkpoint's pull request before building the next one on the same branch**, or the two
  travel together whether or not that was intended.
- **Design work starts from an image**, and approval of a look is given on pixels, not prose.
- **A form that looks like it works and does not is a false success state.** Fields ship with the
  arithmetic behind them or they do not ship.
- **Record once, point everywhere else.** **Visible corrections over rewritten history.**
- **Every pull request opens with a "For Amy" block.**
- **A gate that passes is not a verdict.** It measures separation; it cannot measure what a colour
  reads as.
- **Measure the book too**, and **check a new instrument against a known reading** before trusting a
  number it produces.
- **Look at the thing itself.** Ask the running server what it is serving.
- **Anything an agent inherits is rendered from its source, not retyped.**
- **Never `git add -A`.** Stage named files.
