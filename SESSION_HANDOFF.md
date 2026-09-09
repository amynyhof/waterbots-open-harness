# Session handoff

**Current state only.** Rewritten from scratch at the close of 9 Sep 2026, the agent screen's day,
and rewritten from scratch at every close — maintainer's ruling of 29 Aug 2026, *the opening reads
stay thin, forever*.

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
`main`. Pull requests #61, #62 and #63 are merged: the pictures, the desk, Phoebe's screen.
**Pull request #64, Bridget's and Calvin's screens, was still open on GitHub as this was written**,
although the maintainer's message said it was merged; this close-out's branch was cut from #64's
branch, so it carries slice 4 until #64 lands and shrinks to docs when it does. The working tree is
clean apart from the two ungraded card drafts.

**Every step is an agent screen, and the desk opens first.**

| Screen | State |
|---|---|
| The desk (Dispatches) | Wellington's screen: his chat in bubbles on the Chat tab, Knowledge pack and Credentials beside it, "Next phase: Eligibility". His chat is live |
| Eligibility | Phoebe's screen: her chat on her tint, the worksheet as Tool, her Knowledge pack from the committed cards, Credentials. Her chat is live and receives the record with every ask |
| Partners | Bridget's screen, opening on Tool, the map; a keyed CARTO Voyager basemap under a Slate 13% wash; a click pins a basin. Her Chat tab says she is not answering here yet |
| Quantify | Calvin's screen, opening on Tool, the calculator with three packs and the transition delta. His Chat tab says he is not answering here yet. No "Next phase": the save button is the way on |
| The right column | The crew with the save button at its foot, on every step. The host docks are gone |
| The bridge | Live. The save button seals the visit for an hour and moves the page to production's welcome with only a ticket in the address; production claims it once behind `BRIDGE_KEY` |
| Wellington, Team Lead | Live. Opus 5, thirty messages a day. Opens warmly, one question at a time, names the next step in words |
| Phoebe, Eligibility and Feasibility | Live on Opus 5, twenty a day. Starts from the record; a planned project is normal |
| Bridget and Calvin | Named, with screens; **neither chat is built** |
| Agent handoff primer | Live — Phoebe and Wellington inherit the roster; the primer now says each step has tabs of its own and an agent still points at the step |
| Project points | Not started — blocked on registry data (item D2) |

**The journey bar is the navigation.** One row: Dispatches first with a hairline after it, then
Eligibility, Partners, Quantify, which click, and Plan, Monitor, Communicate, which are named and
quiet. The tabs under it belong to each agent's screen and are never a place an agent sends anyone.

## The agent screen, as it is built

- **One component, `src/screen/AgentScreen.tsx`**, and four seats that consume it: `Desk.tsx`,
  `PhoebeScreen.tsx`, `BridgetScreen.tsx`, `CalvinScreen.tsx`. The Chat tab body is
  `src/screen/ScreenChat.tsx`; the not-live Chat tab is `NotLiveChat.tsx`; the pack view is
  `KnowledgePackTab.tsx`; the exam is `CredentialsTab.tsx`. The transcript draws bubbles for the
  screen and rows nowhere any more.
- **The tabs wear the agent's colour** (ruling 3, 9 Sep 2026): the row at 5% of the accent with a
  25% hairline, the active tab at 12%, bold, underlined 2px; the active crew card underlined the
  same. The accent arrives as `--screen-accent` from the host's token.
- **Where the chat is not live the screen opens on Tool** and the Chat tab carries one plain line
  (ruling 1). **Memory is never a tab**; the record's source shows only behind the (i) (ruling 2),
  owed to whichever slice first builds a source into the rail.
- **Panels stack under `visibility`, not `display`**, so the map stays drawn; the open panel inherits
  visibility rather than forcing it, or a hidden screen shows through another.
- **The B→A raise and the carry list for production** are under item S16 in the archive, once.

## What the agents may say

**Facts and rules, never lines** (item A9), and **four rules on pace and posture** in AGENT_RULES.md:
short replies, one question at a time, every reply ends with the next step; "I don't know" is a
valid answer; a planned project is normal, the criteria are things to do; status lines in a
visitor's words. The six phase names as written; a person is pointed at "the Eligibility step",
never at a tab. Plain words a first-time visitor knows.

**Settings, stated in `api/wellington.ts` and `api/phoebe.ts` with their reasons:** Claude Opus 5,
medium effort, 16,000 output tokens, 120-second call timeout, one retry for a late 400, the reply
floor, caps thirty and twenty. **Wellington's prompt-size gate is 24,000 characters**, and a gate
changes only on the maintainer's word.

## The loop and the bridge, as they run

- **Wellington learns the record** — what it does, what kind, where it is — and what he hears fills
  the rail; the name is typed or heard into the project card. A typed entry is never overwritten.
- **The record goes to Phoebe** with every ask; her verdicts come back to the worksheet, her Tool
  tab, and to her row. **Bridget's row** asks for the pin once a place is known. **Rows derive from
  the visit and are never invented**; the save button is not a row.
- **The seal** (`POST /api/handoff`): the four record fields with source tags, the pin as ids with
  `stressDerived`, each criterion's state and way forward, each pack's answers as typed with the
  pack's own word and the worked-example flag, a timestamp. Never a computed number, never the
  conversation. Ten a day per visitor. **The claim** (`GET /api/handoff/<ticketId>`, bearer
  `BRIDGE_KEY`): 200 once, then 404; 401 for a wrong key. **This site keeps no copy.**
- **Every line a visitor reads says what happens, in plain words.** Never "seal", "ticket", "store"
  or "claim".

## The design system as it now stands

**The brand book is `brand/BRAND.md`, version 4.2**, gitignored, Windows line endings.
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is superseded and stays as history.

- One light brand; two grounds; three planes; the tab row and the bubbles are accent-tinted panels
  in the host's accent — Wellington Tide, Phoebe Anemone, Bridget Surf, Calvin Plum.
- **The save button is the book's §7 primary**, the one primary action on the site. "Next phase" is
  §7's secondary, in Tide, because it is navigation.
- **The book does not carry the agent screen.** The raise is written under item S16 in the archive
  and waits on the maintainer's hand into §7.
- **Typing dots are the book's third motion exception** (item S14); waits on her hand into §5.
- **Design work starts from an image**, and approval is given on pixels. **Every capture for her
  eyeball is attached inside the pull request's For Amy block as an image** — committed under
  `captures/` on the branch and embedded by raw address at the commit.

## Waiting on the maintainer

- **Pull request #64**, slice 4, which GitHub showed open at this close; and **this close-out's
  pull request**, docs, which waits on it.
- **The B→A raise of the agent screen into the brand book's §7**, and **the carry list for
  production**, both under item S16 in the archive.
- **Item S17's design session** — the agent watching its Tool tab and commenting, the pulsing teal
  dot on Chat, and the four open questions. No proposal until the session has met.
- **The hero chat's reference file** into `Design refs/` (item S12). Nothing is built toward it.
- **The sender's shape for the handoff receiver** (item S13).
- **Typing dots into the brand book's §5** (item S14).
- **Grading the two card drafts** — `activity-cards-vwba-DRAFT.md` and
  `definitions-cards-vwba-DRAFT.md`. They stay uncommitted until then; Phoebe's Knowledge pack tab
  names them as drafted and not yet graded.
- **Whether the export copies should be produced by a script** (item O8), and item O11's next sweep.

**Four things wait on real visitors**: the numbers twenty, thirty and ten (item O1), the basemap
ceiling (item O9), the primer review against the abstention log (item A5), and **Phoebe's length
under the canon** — on the two real calls of 8 and 9 Sep she was right on posture and long on words.

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
`handoff` with its ticket route below it. **There is no store locally**; the caps let messages
through and say so, and the save button says saving only works on the live site. `BRIDGE_KEY` is not
on this machine, so the local claim answers 503 and names the setting.

## Housekeeping — where things are on this machine

- **`gh` is at `C:\Program Files\GitHub CLI\gh.exe`**, not on PATH.
- **`brand/assets/bots/` is ignored and re-opened one file at a time.** Four portraits are
  allow-listed: `bridget.svg`, `phoebe.svg`, `calvin.svg`, `wellington.svg`.
- **`Design refs/` is gitignored** and holds the saved production pages. **The hero chat's reference
  is not in it yet.**
- **`sources-local/methodology/` holds the Gold Standard sources** and the synthetic matrix. Never
  committed.
- **`exports/` is gitignored** and holds the maintainer's copies of the root documents, regenerated
  after each close-out's checkpoint commit.
- **Port 3000 belongs to `WaterBotsAI`**, a different repository.
- **The browser extension**: a batch cannot wait more than ten seconds; captures on the map page
  time out on a basin redraw (item O12). The window will not shrink below the screen; for a laptop
  capture, size the app's root to 1280 by 720 by script and take the zoom of that region, then resize
  the saved file to 1280 by 720 — the region's scale differs from tab to tab, so check the edges.
  **The first click after a page load does not land in a composer**: focus it by script, set the
  value through the native setter with an input event, and dispatch the Enter key. The page's
  markup cannot be handed out of the extension; draw over the live page by script instead. A file
  edit under the dev server can reload the page and empty a typed composer.
- **A long shell command carrying a large quoted block fails to parse before running anything.**
  Write the block with the file tool and splice it with short commands.

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
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | The shared store | Neither agent answers; the save button says saving is not working |
| `PHOEBE_VISITOR_SALT` | The scrambled visitor identity, all three counters | Same. **Set once, never changed** |
| `PHOEBE_LOG_KEY` | Opens the abstention log | That address returns nothing |
| `BRIDGE_KEY` | The claim | That address answers 503 and names the setting. **Production only** |
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
- **All four screens stay mounted.** A git checkout under the dev server reloads the page and
  empties every conversation.
- **A seal expires after an hour, and a claim deletes it sooner.** Production sees a 404 either way.
- **Wellington's route comes back as a field and draws nothing.** The field is kept for the console
  to act on later.
- **Phoebe's relay still says `validate()`** in old code (item O13); a later hygiene pass.
- **`.wb-panel` and `.wb-dock` styles remain in `base.css`** with the docks gone; the licence panel
  still uses `.wb-panel`. A later hygiene pass decides the rest.
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

**[OPEN_ITEMS.md](./OPEN_ITEMS.md) is about 2,490 lines.** Item S16 left for the archive this
sitting and item S17 joined. Item O11's next sweep is still due.

## What to do first

**Run Part 1 of the opening ritual**, in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md). **No building in Part 1.** Check first
whether #64 and this close-out have merged; if not, that is the first thing to say.

**Then Part 2 on the maintainer's word.** Nothing is queued to build: the hero chat waits on its
reference, item S17 waits on its design session, and the raise and the carry wait on her hand. The
candidates that need no file are in [BUILD_PLAN.md](./BUILD_PLAN.md).

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.** A worked example is labelled as made up wherever it renders.
- **Propose, approve, build, eyeball, commit word.** An approved plan is a batch approval; it
  loosens nothing else.
- **A gate changes only on the maintainer's word.** Report the trip; propose the number; wait.
- **Ask which thing a brief means before building it.**
- **The current landing never changes without the maintainer's word.** It is not this site's.
- **Agents get facts and rules, not lines.** No prompt says word for word; the check refuses it.
- **Agents say phase names as written, point at the step, and use a visitor's words.**
- **Every line a visitor reads says what happens, in plain words.** Not how it works.
- **Every capture for her eyeball goes inside the For Amy block as an image.** Not a path.
- **One conversation per agent, held by the shell or the agent's own seat.** A frame never starts
  its own.
- **Built once, used everywhere.** A second chat, a second tab row, a second bubble is a defect.
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
