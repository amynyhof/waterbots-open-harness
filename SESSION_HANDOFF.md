# Session handoff

**Current state only.** Rewritten from scratch at the close of the sitting of 11 Sep 2026, the
Agent Commons', and rewritten from scratch at every close — maintainer's ruling of 29 Aug 2026,
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
`main`. Pull requests #68 to #70 are merged: the Agent Commons' pictures, its address and shelf, and
open-one. **This close-out's pull request is the only thing open.** The working tree is clean apart
from the two ungraded card drafts.

**Two pages.** The console at `/`, and the Agent Commons at `/commons`, opened by the one word at
the right of the top bar; the wordmark is the way back and the browser's back button works. The
console stays mounted under the Commons.

| Screen | State |
|---|---|
| The desk (Dispatches) | Wellington's screen: his chat in bubbles on the Chat tab, Knowledge pack and Credentials beside it, "Next phase: Eligibility". His chat is live. A question carried in from waterbots.ai's landing box is his first turn |
| Eligibility | Phoebe's screen: her chat on her tint, the worksheet as Tool, her Knowledge pack from the committed cards, Credentials. Her chat is live and receives the record with every ask |
| Partners | Bridget's screen, opening on Tool, the map; a keyed CARTO Voyager basemap under a Slate 13% wash; a click pins a basin. Her Chat tab says she is not answering here yet |
| Quantify | Calvin's screen, opening on Tool, the calculator with three packs and the transition delta. His Chat tab says he is not answering here yet. No "Next phase": the save button is the way on |
| The right column | The crew with the save button at its foot, on every console step |
| **The Agent Commons** | **Live from 11 Sep 2026 (item S18, v0).** The shelf: five cards from the registries, each wearing its holder's face, a short line, a short document name, and "not yet graded". Open one and the holder's screen appears alone — no crew, no next phase — under one row carrying the way back, the pack's name once, and "Sign up to manage a project". Phoebe's seat has her own conversation with no record and a worksheet of its own; Calvin's a calculator of its own, opened on the clicked pack; Bridget's her datasets and no map. Nothing is kept |
| The bridge, out | Live. The save button seals the visit for an hour and moves the page to production's welcome with only a ticket in the address; production claims it once behind `BRIDGE_KEY` |
| The receiver, in | Live (item S13). `?question=` in the address is read once, the address cleaned, Dispatches opened, the question sent to Wellington in a bubble; on the Commons' address it still lands on Dispatches. Ten a day per visitor on its own counter. **Production's sender is not built**; its contract is under item S13 |
| Wellington, Team Lead | Live. Opus 5, thirty messages a day |
| Phoebe, Eligibility and Feasibility | Live on Opus 5, twenty a day — the same twenty on the console and the Commons |
| Bridget and Calvin | Named, with screens on both pages; **neither chat is built** |
| Credentials, every agent | Reads "not yet graded" and says the grade is the one public exam's, run outside this site; none has been run |
| Project points | Not started — blocked on registry data (item D2) |

**The journey bar is the console's navigation.** One row: Dispatches first with a hairline after it,
then Eligibility, Partners, Quantify, which click, and Plan, Monitor, Communicate, named and quiet.
The Commons has no journey bar and no left rail.

## The agent screen, as it is built

- **One component, `src/screen/AgentScreen.tsx`**, and seven consumers: the console's `Desk.tsx`,
  `PhoebeScreen.tsx`, `BridgetScreen.tsx`, `CalvinScreen.tsx`, and the Commons' three seats in
  `src/components/CommonsSeats.tsx`. The Chat tab body is `ScreenChat.tsx`; the not-live Chat tab
  is `NotLiveChat.tsx`; the pack view is `KnowledgePackTab.tsx`; the exam is `CredentialsTab.tsx`.
  The pack views and Calvin's not-live line are exported from the console screens and reused, never
  re-typed.
- **The screen takes an `idSlug`** from its consumer, because two mounted screens of one agent
  shared tab and panel ids. The console's seats use the host's name; the Commons' pass
  `commons-phoebe` and the like.
- **The tabs wear the agent's colour**; the active crew card on the console is underlined the same.
- **Where the chat is not live the screen opens on Tool**, or on Knowledge pack where there is no
  tool (Bridget on the Commons). **Memory is never a tab.**
- **Panels, surfaces and pages all stack under `visibility`, not `display`.** The one in view
  INHERITS visibility (`undefined`); only the hidden one sets `'hidden'`. An explicit "visible"
  beats a hidden ancestor, and that fault has been found twice now.

## The Agent Commons, as it is built

- **`src/lib/pages.ts`** is the one home for the two addresses; `vercel.json` carries the one
  rewrite. Opening a pack is on-page state, not a path; a reload returns to the shelf.
- **`src/lib/commonsShelf.ts`** assembles the cards from `phoebeCards.ts`, `methodPacks.ts` and
  the licences module. Each method pack carries `shelf: { line, document }` in its registry entry,
  written once. Bridget's line and tag live in the shelf module, once. `grade` is null on every card
  and only a real card from Deb's rig may ever fill it — ONE GRADER, REAL ONLY.
- **`src/components/Commons.tsx`** is the page — the one row and the stacked panes; `CommonsShelf.tsx`
  draws the shelf; `CommonsSeats.tsx` holds the seats. A seat stays mounted once opened. **The crew
  roster is `src/lib/crew.ts`** and the row `CrewRow.tsx`; the console's crew rail reads both.
- **The history push lives outside the state updater** in `App.tsx`; inside it, development mode
  ran it twice and the back button went nowhere.

## What the agents may say

**Facts and rules, never lines** (item A9), and **four rules on pace and posture** in AGENT_RULES.md.
The six phase names as written; a person is pointed at "the Eligibility step", never at a tab.

**Settings, stated in `api/wellington.ts` and `api/phoebe.ts` with their reasons:** Claude Opus 5,
medium effort, 16,000 output tokens, 120-second call timeout, one retry for a late 400, the reply
floor, caps thirty and twenty. **Wellington's prompt-size gate is 24,000 characters**, and a gate
changes only on the maintainer's word.

## The loop and the bridge, as they run

- **Wellington learns the record** and what he hears fills the rail; a typed entry is never
  overwritten. **The record goes to Phoebe** with every ask on the console; her verdicts come back
  through one helper, `applyCriterionUpdates` in `src/lib/phoebeClient.ts`, shared with the Commons
  seat. **Rows derive from the visit and are never invented.**
- **The seal** (`POST /api/handoff`) and **the claim** (`GET /api/handoff/<ticketId>`, bearer
  `BRIDGE_KEY`) are unchanged. **This site keeps no copy.** Every line a visitor reads says what
  happens, in plain words.

## The design system as it now stands

**The brand book is `brand/BRAND.md`, version 4.2**, gitignored, Windows line endings.
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is superseded and stays as history.

- One light brand; two grounds; three planes; the tab row and the bubbles are accent-tinted panels
  in the host's accent — Wellington Tide, Phoebe Anemone, Bridget Surf, Calvin Plum.
- **The save button is the book's §7 primary** on the console; on the Commons the sign-up door
  takes that place, in the same class. "Next phase" is §7's secondary, in Tide.
- **The book does not carry the agent screen or the Commons.** The agent screen's raise is under
  item S16 in the archive; a raise for the Commons' one row is owed and not yet written.
- **Typing dots are the book's third motion exception** (item S14); waits on her hand into §5.
- **Design work starts from an image**, approval is given on pixels, and **every capture for her
  eyeball is attached inside the pull request's For Amy block as an image** — committed under
  `captures/` and embedded by raw address at the commit.

## Waiting on the maintainer

- **This close-out's pull request**, docs only.
- **The Workshop (item S19)** — the proposal is next, on her word. Four rulings in her words are
  under the item, with the dependencies logged.
- **"Connect with a human expert" (item S20)** — two design questions for a session: the form's
  fields, and whether a builder's contact is public or relayed. No proposal until the session.
- **Slice 4 of the Commons** waits on Deb's per-case file, the first of three changes to his rig
  under item S18; she takes them to him. **Slice 5, the flag button, is later.**
- **The sender for the receiver**, on production, to the contract under item S13.
- **The B→A raise of the agent screen into the brand book's §7**, and **the carry list for
  production**, under item S16 in the archive; a raise for the Commons' row is owed.
- **Item S17's design session**; **the hero chat (item S12) is parked**; **typing dots (S14)**.
- **Grading the two card drafts** — `activity-cards-vwba-DRAFT.md` and
  `definitions-cards-vwba-DRAFT.md`. They stay uncommitted until then.
- **Thirteen local branches with deleted remotes** sit on this machine from before 11 Sep; pruned
  on her word, harmless until then.
- **Whether the export copies should be produced by a script** (item O8), and item O11's next sweep.

**Four things wait on real visitors**: the numbers twenty, thirty, ten and ten (item O1), the
basemap ceiling (item O9), the primer review against the abstention log (item A5), and **Phoebe's
length under the canon** — on her three real calls of 8, 9 and 11 Sep she was right on posture and
long on words.

## Confirming the build

**Fifteen commands. All must pass.** Three need a build first because they read `dist/`.

```bash
node scripts/check-basins.mjs
node scripts/check-stress.mjs
node scripts/check-palette.mjs
node scripts/check-cards.mjs
node scripts/check-api-exports.mjs          # walks api/ subfolders too
node scripts/check-visitor-id.mjs
node scripts/check-cap.mjs                  # Phoebe's twenty, Wellington's thirty AND the carried ten, separate counters
node scripts/check-reply-guard.mjs
node scripts/check-vwba-d3.mjs
node scripts/check-gs-sdws.mjs
node scripts/check-wellington.mjs           # his machinery, the record carried to Phoebe, and the carried question's parser — no model call
node scripts/check-handoff.mjs              # the bridge: seal, cap, claim, round trip, against the stand-in store
node scripts/build-prompt-modules.mjs --check   # cards, primer AND Wellington's region are not stale
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

**After editing any card, the agent primer, or the pack registry, run
`node scripts/build-prompt-modules.mjs`.** No gate covers the Commons yet; it was walked in the
browser by script at each slice — open, back, back button, no duplicate ids, the console's Phoebe
untouched by the Commons' turn.

**The measured walk is not a gate.** `node scripts/measure-wellington.mjs [runs]` against a running
dev server spends real calls. **Every real call in a sitting is counted and reported.**

## Running it locally

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npx vite
```

The key must be in the environment before the server starts; an env file does not reach the relay.
The basemap key is in `.env.local` as `VITE_CARTO_KEY`. **Start it as `npx vite`, not `npm run dev`,
and only one at a time.** The Commons is at `http://localhost:5173/commons`; Vite serves the address
without the rewrite, which only the host needs. To try the receiver, open
`http://localhost:5173/?question=<encoded text>`.

**The dev relay serves every relay on its list in `vite.config.ts`** — `phoebe`, `wellington`, and
`handoff` with its ticket route below it. **There is no store locally**; the caps let messages
through and say so. `BRIDGE_KEY` is not on this machine, so the local claim answers 503.

## Housekeeping — where things are on this machine

- **`gh` is at `C:\Program Files\GitHub CLI\gh.exe`**, not on PATH.
- **`brand/assets/bots/` is ignored and re-opened one file at a time.** Four portraits are
  allow-listed: `bridget.svg`, `phoebe.svg`, `calvin.svg`, `wellington.svg`.
- **`Design refs/` is gitignored** and holds the saved production pages.
- **`sources-local/methodology/` holds the Gold Standard sources.** Never committed.
- **`exports/` is gitignored** and holds the maintainer's copies of the root documents — every root
  `.md` and the brand book, prefixed `Shell_B_` — regenerated after each close-out's checkpoint
  commit.
- **Port 3000 belongs to `WaterBotsAI`**, a different repository.
- **The browser extension**: a script cannot wait more than about ten seconds, and a script that
  spans a page navigation dies — navigate with the tool first, then run the walk. A screenshot with
  `save_to_disk` lands in a Temp folder; convert and scale it to a 1280 by 720 PNG into `captures/`
  with `System.Drawing`, sizing the app's root to 1280 by 720 by script first and taking the zoom of
  that region; move the mouse off the frame before the zoom. **Pick a composer by its placeholder or
  its panel id**, never "the first visible one": every mounted screen's panel reports itself
  visible. A file edit under the dev server can reload the page and reset on-page state, the
  Commons' open pack included.
- **A long shell command carrying a large quoted block fails to parse before running anything.**
  Write the block with the file tool and splice it with short commands.
- **Local `main` can fall behind `origin`** when pull requests merge between sittings. The opening's
  compare catches it; fast-forward before cutting a branch.
- **The machine's clock can disagree with the maintainer's date by a day.** Her date is the one
  recorded for a ruling; the disagreement is noted, never silently resolved.

## Deployment

| | |
|---|---|
| **Live URL** | https://map.waterbots.ai — the Commons at `/commons` |
| **Repo** | https://github.com/amynyhof/waterbots-open-harness (public), branch `main` |
| **Host** | Vercel, imported from GitHub — pushes to `main` deploy automatically; `vercel.json` carries one rewrite, `/commons` to the page |
| **Shared store** | Redis, via Vercel Storage, all three environments |
| **Branch hygiene** | Branch protection on `main`; delete-on-merge is on; close-outs go through a pull request |

| Setting | For | If missing |
|---|---|---|
| `ANTHROPIC_API_KEY` | Phoebe's and Wellington's relays | Each says it is not connected |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | The shared store | Neither agent answers; the save button says saving is not working |
| `PHOEBE_VISITOR_SALT` | The scrambled visitor identity, all four counters | Same. **Set once, never changed** |
| `PHOEBE_LOG_KEY` | Opens the abstention log | That address returns nothing |
| `BRIDGE_KEY` | The claim | That address answers 503 and names the setting. **Production only** |
| `VITE_CARTO_KEY` | The basemap, **at build time** | The map works, every tile watermarked |

## Known conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic and Siberia overlap collides.
- **`getBoundsZoom` clamps to the current `minZoom`.** It is cleared before measuring.
- **HydroBASINS excludes Antarctica.** The view extends to −68 by design.
- **The arid and no-data fills are near-neutral and low-opacity on purpose.**
- **The basemap needs a key and has a five-million-request monthly ceiling.** Item O9.
- **The output budget is 16,000 and the ceiling is genuinely reached**, about once in seventy-five.
- **Both agents get a marked region of the primer, not the whole file.**
- **Basins are drawn on canvas, not as SVG paths.** The world-view redraw after a pin is heavy
  (item O12).
- **All four console screens, the Commons page and any opened seat stay mounted.** A git checkout
  under the dev server reloads the page and empties every conversation.
- **A seal expires after an hour, and a claim deletes it sooner.**
- **A carried question is sent from a zero-delay timer, on purpose**, against React's development
  double-mount.
- **The Commons' Phoebe and the console's Phoebe are two conversations**, one per consumer, and
  share one daily cap. Neither shows the other's turns.
- **Phoebe's relay still says `validate()`** in old code (item O13); a later hygiene pass.
- **`.wb-panel` and `.wb-dock` styles remain in `base.css`** with the docks gone; a later hygiene
  pass decides the rest.
- **Seven tracked text files still carry Windows line endings on disk.** Nothing is broken.

## The documents, and which one owns what

**Six opening documents**, read in order at the start of every session — the ritual is owned by
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md).

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules, machine housekeeping | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run; both rituals; the For Amy block and its captures; visible corrections; bundling; record-once; thin reads; images first | Yes |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | **Superseded by the brand book. Kept as history** | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks; pace and posture; the abstention ladder; facts not lines; phase names | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every **open** item, in five families, and the north star | Yes |
| **This file** | Where things stand **now** | Yes |
| [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) | **Closed items, in full. NOT read at the opening** | Yes |
| [BUILD_LOG.md](./BUILD_LOG.md) | **How they came to stand there. NOT read at the opening** | Yes |

**[OPEN_ITEMS.md](./OPEN_ITEMS.md) is about 2,800 lines and growing.** Item S18 is v0-done but stays
open as the home for slices 4 and 5; items S19 and S20 are new. Item O11's next sweep is due — S18's
slices 1 to 3 story is a candidate for the archive once slice 4 lands.

## What to do first

**Run Part 1 of the opening ritual**, in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md). **No building in Part 1.** Check first
whether this close-out has merged, and whether local `main` matches `origin`.

**Then Part 2 on the maintainer's word.** Nothing is queued to build. The Workshop's proposal (item
S19) is the next piece of writing, on her word; item S20 waits on a design session; slice 4 waits on
Deb; production's sender is production's. The candidates that need no file are in
[BUILD_PLAN.md](./BUILD_PLAN.md).

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.** A worked example is labelled as made up wherever it renders.
- **Propose, approve, build, eyeball, commit word.** An approved plan is a batch approval; it
  loosens nothing else. **Stop at the first capture** when she says so.
- **A gate changes only on the maintainer's word.** Report the trip; propose the number; wait.
- **A reading of a brief is stated as an assumption in the pull request**, so the maintainer can
  approve or move it. Every call made this sitting was stated that way.
- **Ask which thing a brief means before building it.**
- **The current landing never changes without the maintainer's word.** It is not this site's.
- **Agents get facts and rules, not lines.** No prompt says word for word; the check refuses it.
- **Agents say phase names as written, point at the step, and use a visitor's words.**
- **Every line a visitor reads says what happens, in plain words.** Not how it works.
- **Every capture for her eyeball goes inside the For Amy block as an image.** Not a path.
- **One conversation per agent per consumer.** A frame never starts its own; a consumer holds its
  own.
- **Built once, used everywhere.** A second chat, a second tab row, a second bubble is a defect.
- **The one in view inherits visibility; only the hidden one sets it.**
- **A typed entry is never overwritten by what an agent heard.**
- **What crosses to another agent or another site is the visitor's own words** — never a verdict,
  never a figure, never a conversation.
- **Every real call is counted and reported**, attempted and delivered alike.
- **Design work starts from an image**, and approval is given on pixels.
- **Production is canon for the console's shape**; take the look, never the data.
- **Blank is never zero.** Any pack, any field. **Cite or it does not ship.**
- **Record once, point everywhere else.** **Visible corrections over rewritten history.**
- **Every pull request opens with a "For Amy" block.**
- **Never `git add -A`.** Stage named files.
