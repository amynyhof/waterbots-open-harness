# Session handoff

**Current state only.** Rewritten from scratch at the close of the 3 Sep 2026 session, run on the
morning of 4 Sep, and rewritten from scratch at every close — maintainer's ruling of 29 Aug 2026,
*the opening reads stay thin, forever*.

**No history lives here.** How things came to be is in [BUILD_LOG.md](./BUILD_LOG.md), which is
append-only and is **not** read at the opening. Each open thread's own story is in its row in
[OPEN_ITEMS.md](./OPEN_ITEMS.md); closed items are in
[OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md), which is also not an opening read.

Read it with [CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence, with
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run, and with
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

---

## Where things stand

**Everything on `main` is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from
`main`. The working tree is clean apart from two ungraded card drafts.

> **One pull request is open as this is written: Wellington's chat, live on the desk — the whole of
> 3 Sep 2026, on `feat/wellington-live`.** Until it merges, every row marked *3 Sep* below is true on
> that branch and not on `main` or the live site.

**The console has four surfaces, in the production shape**, and the desk opens first.

| Surface | State |
|---|---|
| The desk (Dispatch) | Wellington's desk: project context, rows derived from the visit, the save door. **3 Sep: his chat is live on it** |
| Basin map (Partners) | Live, keyed CARTO Voyager basemap under a Slate 13% wash; a click pins a basin for the visit |
| Eligibility worksheet | Live |
| Quantification (Quantify) | Live. Three packs and the transition delta between the two carbon packs |
| **Wellington, Team Lead** | **3 Sep: live on the desk.** Opus 5, thirty messages a day under his own counter. He routes and learns; he answers nothing in a colleague's place |
| Phoebe, Eligibility and Feasibility | Live on Opus 5, twenty a day. **3 Sep: she phrases the roster's facts herself and can name Wellington** |
| Bridget, the map's agent | Named in the map's dock; **her chat is not built** |
| Calvin, the quantification agent | Named in his dock; **his chat is not built** |
| Agent handoff primer | Live — Phoebe and Wellington inherit the roster; Wellington also inherits his own region. **3 Sep: facts and rules, no scripted lines** |
| Shared chat layer | Live, through Level 2. **3 Sep: split into the machine and its frames** |
| Project points | Not started — blocked on registry data (item D2) |

## Wellington, and what he may say

**He is given facts and rules, and phrases the words himself** — maintainer's ruling 1, 3 Sep 2026,
which covers every agent (item A9). Two or three plain sentences a twelve-year-old could read, warm
and teaching. The maintainer approves rules and facts, never wording. No prompt says word for word,
and `check-wellington` refuses one that does.

- **His facts:** Phoebe covers whether a project can count, live on the Eligibility tab. The Quantify
  tab gives a screening figure from the visitor's own numbers; Calvin's, his chat not live. The
  Partners tab is the basin map; Bridget's, her chat not live. Saving and his full desk live on
  waterbots.ai.
- **His rules:** no figure from any worksheet; no invented teammate, capability or place; abstain and
  route outside his lane; screening language only; never press a visitor to sign up.
- **His answer is fields, not prose to parse:** a route (eligibility, quantification, map, paid,
  none) and what he learned (name, place, kind). Checked against closed lists in the relay and again
  in the browser.
- **Only a question outside every lane is logged**, marked as his. Routings are not abstentions.
- **One conversation, held by the shell** in `src/App.tsx`. The desk is a frame around it and starts
  none of its own; the hero chat, when built, is another frame on the same thread.

**Settings, stated in `api/wellington.ts` with their reasons:** Claude Opus 5, medium effort, 16,000
output tokens, 120-second call timeout, one retry for a 400 after five seconds, the 40-character
reply floor, cap thirty. `scripts/measure-wellington.mjs` is the walk with real calls — not a gate.

## The visit, and what the desk may say

**Everything the console knows about the project in front of it is the visit**, held in
`src/App.tsx`, shaped in `src/lib/visit.ts`. Nothing is written to storage; a reload starts over.

- **Three writers into one context, one rule.** The visitor's typing, Wellington's hearing, the
  map pin. A typed entry is never overwritten. A blank field takes the visitor's own words to
  Wellington; the pin fills a blank place. The card labels each field typed, from your
  conversation, or from the map pin.
- **The kind of project** — water, carbon, or not sure — lives in Wellington's plain question, not a
  form control. **The standard-of-interest chips are gone.** A visitor who never chats loses nothing.
- **Rows derive from the visit and are never invented.** The save row is always last and carries
  nothing across. A row from a pack's worked example says so first.
- **Phoebe's row has not been seen on screen.** Only her live answers move it.

## The Quantification step, and what it may say

Unchanged from 2 Sep. Three packs in one pack-keyed slot; the two carbon packs are one module
differing in one cited input; the emission factor is derived and labelled derived; blank is never
zero; everything is a screening estimate with a consultant-review tag. Items S10, K5 and K6.

## The design system as it now stands

**The brand book is `brand/BRAND.md`, version 4.2**, gitignored, Windows line endings. §6's role
label for Wellington reads "Team Lead". [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md)
is superseded and stays as history.

- One light brand; two grounds; three planes; host panels at 5% fill and 25% border in the host's
  accent — Wellington Tide, Phoebe Anemone, Bridget Surf, Calvin Plum.
- **Production is canon for the console's shape**, from the saved pages in `Design refs/`.
- **The current landing does not change** — not its headline, copy or layout — without the
  maintainer's word. It is production's; this site has none.
- **Typing dots are the book's third motion exception** — opacity only, three fading in turn, stopped
  under reduced motion. Ruled 3 Sep 2026; waits on her hand into §5 (item S14).
- **Design work starts from an image**, and approval is given on pixels.

## Waiting on the maintainer

- **The open pull request** — Wellington live. Checked in her browser at the checkpoint; waiting on
  review and merge.
- **The hero chat's demo reference**, into `Design refs/` by her hand. Item S12 builds nothing until
  she says the file is in.
- **The sender's shape for the handoff** (item S13), when production settles it.
- **Typing dots into the brand book's §5** (item S14).
- **Her reading of item A7's recurrence** — the abstention that cited a card reads as the benign
  branch; her reading closes it.
- **Grading the two card drafts** — `activity-cards-vwba-DRAFT.md` and
  `definitions-cards-vwba-DRAFT.md`. They stay uncommitted until then.
- **Whether the export copies should be produced by a script** (item O8).

**Four things wait on real visitors**: the number twenty (item O1), the basemap ceiling (item O9), the
primer review against the abstention log (item A5), and now the number thirty.

**One thing waits on production.** The bridge (item S7) sits on their desk as their #149.

## Confirming the build

**Fourteen checks. All must pass.** Three need a build first because they read `dist/`.

```bash
node scripts/check-basins.mjs
node scripts/check-stress.mjs
node scripts/check-palette.mjs
node scripts/check-cards.mjs
node scripts/check-api-exports.mjs
node scripts/check-visitor-id.mjs
node scripts/check-cap.mjs                  # Phoebe's twenty AND Wellington's thirty, separate counters
node scripts/check-reply-guard.mjs
node scripts/check-vwba-d3.mjs
node scripts/check-gs-sdws.mjs
node scripts/check-wellington.mjs           # his machinery, without a model call
node scripts/build-prompt-modules.mjs --check   # cards, primer AND Wellington's region are not stale
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

**After editing any card, the agent primer, or the pack registry, run
`node scripts/build-prompt-modules.mjs`.** Three bundles now: the cards, the roster region, and
Wellington's own region.

**The measured walk is not a gate.** `node scripts/measure-wellington.mjs [runs]` against a running
dev server spends real calls and prints counts; run it before an eyeball, never in the loop.

## Running it locally

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npx vite
```

The key must be in the environment before the server starts; an env file does not reach the relay.
The basemap key is the opposite case, in `.env.local` as `VITE_CARTO_KEY`. **Start it as `npx vite`,
not `npm run dev`, and only one at a time.** Two people cannot work in this folder at once.

**The dev relay serves every relay on its list in `vite.config.ts`** — `phoebe` and `wellington`. A
new agent's endpoint is a row there, or it is a 404 locally as it would be on the platform with no
file behind it.

## Housekeeping — where things are on this machine

- **`gh` is at `C:\Program Files\GitHub CLI\gh.exe`**, not on PATH.
- **`brand/assets/bots/` is ignored and re-opened one file at a time.** Four portraits are
  allow-listed: `bridget.svg`, `phoebe.svg`, `calvin.svg`, `wellington.svg`.
- **`Design refs/` is gitignored** and holds the saved production pages. The saved pages route away
  on hydration if served; read their markup. **The hero chat's reference is not in it yet.**
- **`sources-local/methodology/` holds the Gold Standard sources**, the MoFuSS report, the CDM fNRB
  page transcribed, and the synthetic matrix. Never committed.
- **No file called AGENTS_SPEC exists here.** The voice rule was built from the maintainer's words and
  the brand book's §1, and lives in AGENT_RULES.md.
- **Port 3000 belongs to `WaterBotsAI`**, a different repository. Not this repo's server.
- **The browser extension refuses `file://` and unallowed local ports**; a tab can zoom itself to
  200%; a fresh tab reads at 100%.

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
| `ANTHROPIC_API_KEY` | Phoebe's and Wellington's relays | Each says it is not connected |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | The shared store | Neither answers at all |
| `PHOEBE_VISITOR_SALT` | The scrambled visitor identity, both counters | Same. **Set once, never changed** |
| `PHOEBE_LOG_KEY` | Opens the abstention log | That address returns nothing |
| `VITE_CARTO_KEY` | The basemap, **at build time** | The map works, every tile watermarked |

**Wellington needs no new setting.** He shares every one of Phoebe's, and his counter lives under
his own key in the same store.

## Known conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic and Siberia overlap collides.
- **`getBoundsZoom` clamps to the current `minZoom`.** It is cleared before measuring.
- **HydroBASINS excludes Antarctica.** The view extends to −68 by design.
- **The arid and no-data fills are near-neutral and low-opacity on purpose.** Do not brighten or warm.
- **The basemap needs a key and has a five-million-request monthly ceiling.** Item O9.
- **The output budget is 16,000 and the ceiling is genuinely reached**, about once in seventy-five.
- **Both agents get a marked region of the primer, not the whole file.**
- **Basins are drawn on canvas, not as SVG paths.**
- **The basin layer rebuilds on a pin**; the pin is part of the layer's key.
- **The desk, the map and the docks stay mounted**; the desk holds Wellington's conversation. The
  two worksheets are mounted only while open.
- **Seven tracked text files still carry Windows line endings on disk.** Nothing is broken.

## The documents, and which one owns what

**Six opening documents**, read in order at the start of every session — the ritual is owned by
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md).

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules, machine housekeeping | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run; both rituals; visible corrections; bundling; record-once; thin reads; images first | Yes |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | **Superseded by the brand book. Kept as history** | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks, the abstention ladder, **facts not lines** | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every **open** item, in five families, and the north star | Yes |
| **This file** | Where things stand **now** | Yes |
| [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) | **Closed items, in full. NOT read at the opening** | Yes |
| [BUILD_LOG.md](./BUILD_LOG.md) | **How they came to stand there. NOT read at the opening** | Yes |

**[OPEN_ITEMS.md](./OPEN_ITEMS.md) is over 2,300 lines.** Seven items joined this session and none
left; item O11's next sweep is due, and the settled halves of A2, A3 and A4 still need the
maintainer's word to split.

## What to do first

**Run Part 1 of the opening ritual**, in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md). **No building in Part 1.**

**Then Part 2.** The next build is the hero chat (item S12) and it is blocked on the maintainer's
reference file. **Do not build toward it, and do not build a landing, until she says the file is
in.** If it is in, propose against item S12's recorded shape and the reference, and nothing else.

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.** A worked example is labelled as made up wherever it renders.
- **Propose, approve, build, eyeball, commit word.** An approved plan is a batch approval; it
  loosens nothing else.
- **Ask which thing a brief means before building it.** "The landing's question box" meant a page
  this repository has never had. One question would have saved a build and an eyeball.
- **The current landing never changes without the maintainer's word.** It is not this site's.
- **Agents get facts and rules, not lines.** No prompt says word for word; the check refuses it.
- **One conversation per agent, held by the shell.** A frame never starts its own.
- **A typed entry is never overwritten by what an agent heard.**
- **Design work starts from an image**, and approval is given on pixels.
- **Production is canon for the console's shape**; take the look, never the data.
- **Blank is never zero.** Any pack, any field. **Cite or it does not ship.**
- **Record once, point everywhere else.** **Visible corrections over rewritten history.**
- **Every pull request opens with a "For Amy" block.**
- **A check's reference rounded by hand disagrees at the fourth decimal.** Compare against the
  module's own figure.
- **Look at the thing itself.** A hot reload does not rebuild a map layer.
- **Anything an agent inherits is rendered from its source, not retyped.**
- **Never `git add -A`.** Stage named files.
