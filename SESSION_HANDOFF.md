# Session handoff

**Current state only.** Rewritten from scratch at the close of the 8 Sep 2026 sitting, and
rewritten from scratch at every close — maintainer's ruling of 29 Aug 2026, *the opening reads stay
thin, forever*.

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
`main`. Pull request #56, the bridge sender, is merged. The working tree is clean apart from two
ungraded card drafts. **One pull request is open as this is written: this close-out**, docs only.

**The console has four surfaces and one row**, and the desk opens first.

| Surface | State |
|---|---|
| The desk (Dispatches) | Wellington's conversation in the centre; the project record on the left rail, filled by his interview; the crew and the next-step rows on the right. His chat is live |
| Basin map (Partners) | Live, keyed CARTO Voyager basemap under a Slate 13% wash; a click pins a basin for the visit |
| Eligibility worksheet | Live. Phoebe receives the desk's record with every ask |
| Quantification (Quantify) | Live. Three packs and the transition delta between the two carbon packs |
| **The bridge** | **Live from 8 Sep 2026.** The save row is a button with a consent line; the click seals the visit for an hour and moves the page to production's welcome with only a ticket in the address; production claims it once behind `BRIDGE_KEY` |
| Wellington, Team Lead | Live on the desk. Opus 5, thirty messages a day under his own counter |
| Phoebe, Eligibility and Feasibility | Live on Opus 5, twenty a day. Starts from the record, moves a criterion only on evidence |
| Bridget, the map's agent | Named in the map's dock; **her chat is not built**. Her row on the desk asks for the pin once a place is known |
| Calvin, the quantification agent | Named in his dock; **his chat is not built** |
| Agent handoff primer | Live — Phoebe and Wellington inherit the roster; Wellington also inherits his own region. Facts and rules, no scripted lines |
| Project points | Not started — blocked on registry data (item D2) |

**The journey bar is the navigation.** One row: Dispatches first with a hairline after it, then
Eligibility, Partners, Quantify, which click, and Plan, Monitor, Communicate, which are named and
quiet.

## The bridge, as it now runs

- **What crosses** is the visit and nothing else: the four record fields with their source tags,
  the pin as ids with `stressDerived` said outright, each criterion's state and way forward, each
  pack's answers as typed with the pack's own word (complete, incomplete, pending, blocked) and the
  worked-example flag, a sealed-at timestamp. **Never a computed number, never the conversation.**
  The reader in `api/_handoff.ts` refuses a seal carrying anything else, whole.
- **The seal** is `POST /api/handoff`: ten a day per visitor under the counter `handoff`, one hour
  in the store, a 32-character ticket back. **The claim** is `GET /api/handoff/<ticketId>` with
  `Authorization: Bearer <BRIDGE_KEY>`: 200 with the seal once, then 404; 401 for a wrong key; the
  key checked first. **This site keeps no copy.**
- **The lines a visitor reads say what happens, in plain words** — never "seal", "ticket", "store"
  or "claim". The consent line and the local-only line are in `src/components/CrewRail.tsx` and
  `api/handoff/index.ts`; every message on the row says "saving" and what happened.
- **On a laptop the row says saving only works on the live site.** There is no store locally.
- **The check** is `node scripts/check-handoff.mjs`, 65 checks, in the gate list below.

## The loop, as it now runs

- **Wellington learns the record** — what it does, what kind, where it is, what it is called — in
  that order, and what he hears fills the rail. A typed entry is never overwritten. "What it does"
  and "kind" are heard only; their typeable controls are owed (item S11).
- **The record goes to Phoebe** with every ask, as a second system block after her cache breakpoint,
  checked on the relay in `api/_record.ts`.
- **Her verdicts come back** through the criteria to the worksheet and to her row on the desk.
- **Bridget's row** appears once a place is known and asks for the pin.
- **Rows derive from the visit and are never invented.** The save row is always last. Nothing is
  kept between visits.

## What the agents may say

**Facts and rules, never lines** (item A9). The six phase names as written; a person is pointed at
"the Eligibility step", never at a tab. Wellington uses plain words a first-time visitor knows:
never "seat", "console", "dispatch", "rail" or "surface". The rules live in AGENT_RULES.md and in
each agent's prompt file.

**Settings, stated in `api/wellington.ts` and `api/phoebe.ts` with their reasons:** Claude Opus 5,
medium effort, 16,000 output tokens, 120-second call timeout, one retry for a late 400, the reply
floor, caps thirty and twenty. **Wellington's prompt-size gate is 24,000 characters**, and a gate
changes only on the maintainer's word.

## The design system as it now stands

**The brand book is `brand/BRAND.md`, version 4.2**, gitignored, Windows line endings.
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is superseded and stays as history.

- One light brand; two grounds; three planes; host panels at 5% fill and 25% border in the host's
  accent — Wellington Tide, Phoebe Anemone, Bridget Surf, Calvin Plum.
- **The bridge's button is the book's §7 primary**: solid Tide, light label, `--r-md`, hover
  darkens, press scales to 0.98. It is the one primary action on the site, because it is the one
  that takes the visitor somewhere else with their work.
- **Production is canon for the console's shape**, from the saved pages in `Design refs/`.
- **The current landing does not change** without the maintainer's word. It is production's.
- **Typing dots are the book's third motion exception** (item S14); waits on her hand into §5.
- **Design work starts from an image**, and approval is given on pixels.

## Waiting on the maintainer

- **This close-out's pull request** — review and merge.
- **The two right-key claims on the live site.** The engineer never holds `BRIDGE_KEY`, so they were
  not run. From anywhere with the key, seal from the live desk, then:
  ```
  curl -i https://map.waterbots.ai/api/handoff/<ticketId> -H "Authorization: Bearer <BRIDGE_KEY>" -H "Accept: application/json"
  ```
  First call 200 with the JSON, second call 404. That is the only proof the real store answers the
  read-and-delete command the way the stand-in does (item S6's standing gap).
- **The hero chat's reference file** into `Design refs/` (item S12). Nothing is built toward it.
- **The sender's shape for the handoff receiver** (item S13).
- **Typing dots into the brand book's §5** (item S14).
- **Grading the two card drafts** — `activity-cards-vwba-DRAFT.md` and
  `definitions-cards-vwba-DRAFT.md`. They stay uncommitted until then.
- **Whether the export copies should be produced by a script** (item O8), and item O11's next sweep.

**Four things wait on real visitors**: the numbers twenty, thirty and now ten (item O1), the
basemap ceiling (item O9), and the primer review against the abstention log (item A5).

## Confirming the build

**Fifteen commands. All must pass.** Three need a build first because they read `dist/`.

```bash
node scripts/check-basins.mjs
node scripts/check-stress.mjs
node scripts/check-palette.mjs
node scripts/check-cards.mjs
node scripts/check-api-exports.mjs          # walks api/ subfolders too
node scripts/check-visitor-id.mjs
node scripts/check-cap.mjs                  # Phoebe's twenty AND Wellington's thirty, separate counters
node scripts/check-reply-guard.mjs
node scripts/check-vwba-d3.mjs
node scripts/check-gs-sdws.mjs
node scripts/check-wellington.mjs           # his machinery and the record carried to Phoebe, no model call
node scripts/check-handoff.mjs              # the bridge: seal, cap, claim, round trip, against the stand-in store
node scripts/build-prompt-modules.mjs --check   # cards, primer AND Wellington's region are not stale
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

**After editing any card, the agent primer, or the pack registry, run
`node scripts/build-prompt-modules.mjs`.**

**The measured walk is not a gate.** `node scripts/measure-wellington.mjs [runs]` against a running
dev server spends real calls and prints counts; run it before an eyeball, never in the loop. **Every
real call in a sitting is counted and reported.**

## Running it locally

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npx vite
```

The key must be in the environment before the server starts; an env file does not reach the relay.
The basemap key is the opposite case, in `.env.local` as `VITE_CARTO_KEY`. **Start it as `npx vite`,
not `npm run dev`, and only one at a time.**

**The dev relay serves every relay on its list in `vite.config.ts`** — `phoebe`, `wellington`, and
`handoff` with its ticket route below it. A flat route answers 404 below itself, as production does.
**There is no store locally**; the caps say so and let messages through, and the save row says
saving only works on the live site. `BRIDGE_KEY` is not on this machine, so the local claim answers
503 and names the setting.

## Housekeeping — where things are on this machine

- **`gh` is at `C:\Program Files\GitHub CLI\gh.exe`**, not on PATH.
- **`brand/assets/bots/` is ignored and re-opened one file at a time.** Four portraits are
  allow-listed: `bridget.svg`, `phoebe.svg`, `calvin.svg`, `wellington.svg`.
- **`Design refs/` is gitignored** and holds the saved production pages; read their markup. **The
  hero chat's reference is not in it yet.**
- **`sources-local/methodology/` holds the Gold Standard sources** and the synthetic matrix. Never
  committed.
- **`exports/` is gitignored** and holds the maintainer's copies of the root documents, regenerated
  after each close-out's checkpoint commit.
- **Port 3000 belongs to `WaterBotsAI`**, a different repository. Not this repo's server. **Port 5174
  was another repository's dev server on 8 Sep** — not ours, not touched.
- **The browser extension**: a fresh tab reads at 100%; a batch cannot wait more than ten seconds at
  a time; **captures on the map page time out on a basin redraw** (item O12) — read the state by
  script and capture the desk instead. A click by element reference did not always land on the
  save button; a click by coordinate did.

## Deployment

| | |
|---|---|
| **Live URL** | https://map.waterbots.ai |
| **Repo** | https://github.com/amynyhof/waterbots-open-harness (public), branch `main` |
| **Host** | Vercel, imported from GitHub — pushes to `main` deploy automatically |
| **Shared store** | Redis, via Vercel Storage, all three environments |
| **Branch hygiene** | Branch protection on `main`; delete-on-merge is on; close-outs go through a pull request |

| Setting | For | If missing |
|---|---|---|
| `ANTHROPIC_API_KEY` | Phoebe's and Wellington's relays | Each says it is not connected |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | The shared store | Neither agent answers; the save row says saving is not working |
| `PHOEBE_VISITOR_SALT` | The scrambled visitor identity, all three counters | Same. **Set once, never changed** |
| `PHOEBE_LOG_KEY` | Opens the abstention log | That address returns nothing |
| `BRIDGE_KEY` | The claim, `GET /api/handoff/<ticketId>` | That address answers 503 and names the setting. **Production only** — a preview deploy's claim answers 503 by design |
| `VITE_CARTO_KEY` | The basemap, **at build time** | The map works, every tile watermarked |

## Known conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic and Siberia overlap collides.
- **`getBoundsZoom` clamps to the current `minZoom`.** It is cleared before measuring.
- **HydroBASINS excludes Antarctica.** The view extends to −68 by design.
- **The arid and no-data fills are near-neutral and low-opacity on purpose.** Do not brighten or warm.
- **The basemap needs a key and has a five-million-request monthly ceiling.** Item O9.
- **The output budget is 16,000 and the ceiling is genuinely reached**, about once in seventy-five.
- **Both agents get a marked region of the primer, not the whole file.** Phoebe also gets the
  record block, uncached, after her cards.
- **Basins are drawn on canvas, not as SVG paths.** The world-view redraw after a pin is heavy
  (item O12).
- **The desk, the map and the docks stay mounted**; the desk holds Wellington's conversation. A git
  checkout under the dev server reloads the page and empties every conversation.
- **A seal expires after an hour, and a claim deletes it sooner.** A visitor who takes longer than
  an hour to sign up finds nothing waiting; production sees a 404 and this site cannot tell the
  cases apart. By design.
- **The real store's `GETDEL` and `SET … NX` are confirmed only by the stand-in** until the
  maintainer runs the right-key claims. Item S6's gap, in one more place.
- **Phoebe's relay still says `validate()`** in old code (item O13); a later hygiene pass.
- **Bridget's and Calvin's dock copy still says "console"**, and the crew rail's footer still says
  only Phoebe answers on this site; the plain-words rule was applied to the desk, to Wellington and
  to the bridge, not to the docks or the footer.
- **Seven tracked text files still carry Windows line endings on disk.** Nothing is broken.

## The documents, and which one owns what

**Six opening documents**, read in order at the start of every session — the ritual is owned by
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md).

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules, machine housekeeping | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run; both rituals; visible corrections; bundling; record-once; thin reads; images first | Yes |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | **Superseded by the brand book. Kept as history** | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks, the abstention ladder, facts not lines, phase names, step not tab | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every **open** item, in five families, and the north star | Yes |
| **This file** | Where things stand **now** | Yes |
| [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) | **Closed items, in full. NOT read at the opening** | Yes |
| [BUILD_LOG.md](./BUILD_LOG.md) | **How they came to stand there. NOT read at the opening** | Yes |

**[OPEN_ITEMS.md](./OPEN_ITEMS.md) is about 2,450 lines.** Item S7 left for the archive this
sitting, the third sweep; none joined. Item O11's next sweep is still due.

## What to do first

**Run Part 1 of the opening ritual**, in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md). **No building in Part 1.** Ask whether
the maintainer has run the two right-key claims on the live site; if she has, record the answer in
item S6's row.

**Then Part 2**, decided at the open. The hero chat (item S12) is next and waits on the maintainer's
reference file; if it is not in, do not start it. The candidates that need no file are in
[BUILD_PLAN.md](./BUILD_PLAN.md).

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.** A worked example is labelled as made up wherever it renders.
- **Propose, approve, build, eyeball, commit word.** An approved plan is a batch approval; it
  loosens nothing else.
- **A gate changes only on the maintainer's word.** Report the trip; propose the number; wait.
- **Ask which thing a brief means before building it.**
- **The current landing never changes without the maintainer's word.** It is not this site's.
- **Agents get facts and rules, not lines.** No prompt says word for word; the check refuses it.
- **Agents say phase names as written, point at the step, and use a visitor's words.**
- **Every line a visitor reads says what happens, in plain words.** Not how it works. This caught
  the bridge's first capture.
- **One conversation per agent, held by the shell.** A frame never starts its own.
- **A typed entry is never overwritten by what an agent heard.**
- **What crosses to another agent or another site is the visitor's own words** — never a verdict,
  never a figure, never a conversation.
- **Every real call is counted and reported.**
- **Design work starts from an image**, and approval is given on pixels.
- **Production is canon for the console's shape**; take the look, never the data.
- **Blank is never zero.** Any pack, any field. **Cite or it does not ship.**
- **Record once, point everywhere else.** **Visible corrections over rewritten history.**
- **Every pull request opens with a "For Amy" block.**
- **Never `git add -A`.** Stage named files.
