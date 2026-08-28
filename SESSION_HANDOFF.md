# Session handoff

Rewritten at the close of the session of 27 Aug 2026. Read this with
[CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence,
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run,
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md), which says which design rules apply, and
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

**This file exists so a cold reader can pick the work up.** It says where things stand, what is
committed and what is not, what is waiting on the maintainer, and what to do first.

---

## Read this first

**A live fault was found and fixed, and it was not the one anyone was looking for.**

**CARTO ended keyless access to their basemaps, and `map.waterbots.ai` was serving tiles stamped
"API KEY REQUIRED" across the whole map.** It was found by accident, while walking a change to the
basemap style. Warm caches hid it — every browser that had looked at the map before still held clean
tiles. **Any visitor arriving with a cold cache saw the stamp, and had been for some days.**

It applied to `light_all`, the style the map shipped with from launch, so there was no reverting out
of it. **The map now runs keyed, on CARTO's Voyager style**, walked and approved on production. The
whole dependency — the key, the five-million-request ceiling, the attribution condition — is item O9.

**Five steps landed, and each went through a pull request the engineer opened itself.** That is new
this session and is now the rule.

| # | What | Pull request |
|---|---|---|
| 1 | Line endings pinned (item O6, closed) | #8 |
| 2 | Three process rulings logged; the export step ordered (item O8) | #9 |
| 3 | The design canon received and logged | #10 |
| 4 | Brightness pull-up — two card surfaces to full white (item S8) | #11 |
| 5 | The basemap keyed and moved to Voyager (item O9) | #12 |

**One thing is written and waiting: the agent handoff primer, step one.** `agent-primer.md`, pull
request **#13, open and not merged.** The maintainer's in-depth read is next session. **No agent has
the primer**, and the document says so in its own second section.

**Ten checks now, not nine.** `check-basemap-key` joined them.

**Item O7 is closed and delete-on-merge is on.** Branches now delete themselves on merge; it has
already worked unprompted. Only `main` remains, here and on GitHub.

**Two card drafts are still deliberately uncommitted.** `activity-cards-vwba-DRAFT.md` and
`definitions-cards-vwba-DRAFT.md` are drafted but not graded, and Phoebe is not given them.

---

## What is open right now

**Two pull requests are open at this close**, which is unusual and deliberate:

| Pull request | What | State |
|---|---|---|
| **#13** | The agent handoff primer, step one | Awaiting the maintainer's in-depth read |
| **The close-out** | This refresh | Awaiting merge |

**#13 is read before it is merged, not after.** Every sentence in `agent-primer.md` is a sentence an
agent will eventually be allowed to say, which is why the maintainer's read is the eyeball for it
rather than a browser check.

---

## Where the build stands

**Everything is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from `main`.
Vercel builds on every push to that branch.

| Surface | State |
|---|---|
| Basin map | Live, on a keyed CARTO Voyager basemap |
| Eligibility worksheet | Live |
| Phoebe, the Eligibility and Feasibility agent | **Live and answering, capped at 20 messages a day** |
| Bridget, the map's agent | Named in the map's dock; her chat is not built |
| Shared chat layer | Live, built through Level 2 |
| Agent handoff primer | **Written, not merged, and inherited by nobody** |
| Project points | Not started — blocked on registry data (item D2) |

### The map

- **HydroSHEDS HydroBASINS** Level 4 (1,342 basins) at world view, swapping to Level 6
  (16,397 basins) from zoom 5, with a dead band at 4.5 so resting on the boundary cannot thrash an
  8.44 MB layer. Level 6 is lazily fetched on first crossing and viewport-filtered once mounted.
- **WRI Aqueduct 4.0** water stress at 100% coverage. Level 6 renders WRI's published figures with
  no aggregation; Level 4 is an area-weighted majority of its children and is labelled as derived
  wherever it renders.
- **The basemap is CARTO Voyager, keyed.** Read item O9 before touching it.
- **Cover-fit** to the column — the map fills the viewport and pans rather than showing empty bands,
  clamped to one world.

### Phoebe (beta)

She is the Eligibility and Feasibility specialist, sitting with the Eligibility surface. **She
answers for real**, from two committed card sets and nothing else.

- **Model: Claude Sonnet 5**, thinking adaptively at **"medium" effort**, budget 16,000 output
  tokens. All three are stated in `api/phoebe.ts` rather than inherited. If abstention discipline
  ever weakens, raise `EFFORT` first, then `MODEL`.
- **She never writes a citation.** She returns a card number and places a marker; the browser looks
  the card up in the committed file and renders the citation itself.
- **Her colour is Anemone `#A04E7E`**, with Anemone Light `#C36E9F` on her antenna. Ruled 22 Aug
  2026, and **reaffirmed 27 Aug 2026** — the design canon calls her "violet", which in BRAND.md is
  Iris `#7B5BE6`. The maintainer ruled the wording loose and the 22 Aug ruling standing.
- **Her one handoff is hard-coded** in `api/_systemPrompt.ts`: she may name Bridget and say Bridget
  covers the basin map and the water-stress data. That is what the primer replaces.

#### The cap, and what is stored

**20 messages per visitor per UTC day.** A visitor is their network address scrambled with
`PHOEBE_VISITOR_SALT`; the address itself is never stored.

- **Only delivered answers count.** The count rises just before the model is called and is given
  back if the call fails on our side.
- **A malformed request never costs a message.**
- **Missing store, two different answers.** On the platform a missing store stops Phoebe answering
  rather than quietly serving an uncapped public endpoint. On a laptop it warns loudly and lets the
  message through.
- **The abstention log holds no visitor identifier at all.** It keeps when, the topic in Phoebe's
  words, and the question as typed. Newest 500. Read it at `/api/abstentions` with `PHOEBE_LOG_KEY`.
- **The log holds only test entries today.** That is why the primer was written from the rules and
  not from it — see item A5.

#### The token budget

**Phoebe thinks before she writes, that thinking is invisible, and it is charged to the same budget
as her reply.** Budget 16,000, effort "medium". **Do not lower it** — 8,192 was the value that
produced item A4, and 2,048 before that failed on every project description.

**A default nobody wrote down is a decision nobody made.**

---

## Confirming the build

**Ten checks. All must pass.** `check-attribution` and `check-basemap-key` both need a build first,
because they read `dist/`.

```bash
node scripts/check-basins.mjs               # counts, fields, geometry, Level 6 to 4 nesting
node scripts/check-stress.mjs               # join coverage, derivation labelling
node scripts/check-palette.mjs              # ramp lightness order, chroma separation
node scripts/check-cards.mjs                # both card sets parse and are complete
node scripts/check-api-exports.mjs          # the relay can actually answer once deployed
node scripts/check-visitor-id.mjs           # the scrambled identity is stable, unique, salted
node scripts/check-cap.mjs                  # 20 pass, 21 refused, refunds work, the log stores no one
node scripts/build-card-module.mjs --check  # the relay's card copy is not stale
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

**`check-basemap-key` is new, 27 Aug 2026.** It reads the **built bundle** for the basemap key,
because the key is baked in by Vite at build time and the source cannot tell you whether the build
had one. A keyless build produces a map that works, looks healthy, and is watermarked on every tile.
**It was proven in both directions** — a build with the key blanked fails it, the real build passes
it. A guard that only ever passes is worse than no guard.

`check-attribution` greps the **built bundle**, not the source. It is a licence guard, and it now
guards more than it used to: CARTO's free tier is granted **in exchange for** keeping the CARTO and
OpenStreetMap attribution visible.

**After editing any card, run `node scripts/build-card-module.mjs`** or the relay deploys with stale
cards while the worksheet shows current ones.

---

## Running it locally

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npm run dev
```

**Phoebe's key must be in the environment before the server starts.** An env file does not work for
it: Vite puts env files into the browser's `import.meta.env`, but the relay is Node code reading
`process.env`.

**The basemap key is the opposite case and lives in `.env.local`** as `VITE_CARTO_KEY`. Vite bakes
`VITE_`-prefixed values into the bundle at build time. That file is gitignored twice over — by
`*.local` and by the `.env.*` rule added this session. **Without it the map still works and every
tile is watermarked.**

> **Two people cannot work in this folder at once.** The dev server reloads the whole page whenever
> any file changes, including root documents the app never imports. **While the maintainer is
> checking in the browser, the engineer touches nothing.**

---

## Deployment

| | |
|---|---|
| **Live URL** | https://map.waterbots.ai |
| **Vercel URL** | https://waterbots-open-harness.vercel.app |
| **Repo** | https://github.com/amynyhof/waterbots-open-harness (public), branch `main` |
| **Host** | Vercel, imported from GitHub — pushes to `main` deploy automatically |
| **Framework preset** | Vite, build `npm run build`, output `dist`, install `npm install` |
| **Shared store** | Redis, added via Vercel Storage on 25 Aug 2026, all three environments |
| **Branch hygiene** | Branch protection on `main`; **delete-on-merge is on since 27 Aug 2026** |

### Settings a deployment needs

| Setting | What it is for | If it is missing |
|---|---|---|
| `ANTHROPIC_API_KEY` | Phoebe's relay | She says she is not connected |
| `KV_REST_API_URL` | The shared store | On the platform, she does not answer at all |
| `KV_REST_API_TOKEN` | The shared store | Same |
| `PHOEBE_VISITOR_SALT` | The scrambled visitor identity | Same |
| `PHOEBE_LOG_KEY` | Opens the abstention log | That address returns nothing |
| **`VITE_CARTO_KEY`** | **The basemap** | **The map works and every tile is watermarked** |

**`PHOEBE_VISITOR_SALT` is set once and never changed.** Changing it makes every visitor look new
and resets every count to zero.

**A settings change only reaches a deployment that starts after it.** True of all six, and **doubly
true of `VITE_CARTO_KEY`**, which is read when the bundle is built rather than when a request
arrives.

### Domain and DNS

`map.waterbots.ai` is a CNAME pointing at Vercel. DNS is managed at **Namecheap**. TLS is a Let's
Encrypt certificate issued 19 Aug 2026, valid to 17 Nov 2026, renewing automatically.

### Verified live, 27 Aug 2026

**Walked on production by the maintainer after the merge of #12, with a hard reload to force fresh
tiles rather than cached ones.**

- **No watermark anywhere.** The live fault is closed.
- **Voyager is live** — the seas read as water, and the arid and no-data basins read as land seen
  faintly rather than as grey fog.
- **The sea and the Low-stress band read apart.** This was the one open design question, and
  arithmetic could not settle it. **The hairline borders on basins separate them from open sea at
  every zoom tried.**

**The hard reload is the point.** A normal reload showed a clean map for days while cold visitors
saw a stamped one.

---

## Data pipeline

The source data is **not in this repository** — it is far too large and is reproducible.

| Input | Size | Where |
|---|---|---|
| HydroSHEDS shapefiles, levels 3 to 6 | ~1.2 GB | `data-src/`, gitignored, re-downloadable by script |
| WRI Aqueduct 4.0 download | 737 MB | `legacy/`, gitignored, **not** downloaded by any script |

```bash
node scripts/build-basins.mjs          # downloads, converts, simplifies both levels
node scripts/build-basins.mjs --clean  # and removes data-src/ afterwards
node scripts/build-stress.mjs          # needs the Aqueduct CSV
```

### Known conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic and Siberia overlap produces
  exactly one collision at every level. The check scripts name it and fail on any *other* collision.
- **`getBoundsZoom` clamps to the current `minZoom`.** `minZoom` is cleared before measuring. Do not
  "simplify" that away.
- **HydroBASINS excludes Antarctica.** The southern data limit is -55.883; the view extends to -68
  deliberately, and the strip below the limit is basemap only.
- **The card parser was line-ending sensitive.** Both the parser and the card-module gate normalise
  line endings. Do not remove that.
- **Line endings are pinned by `.gitattributes` since 27 Aug 2026.** The card gate used to fail on a
  clean tree. Item O6 carries the whole story, including that the real cause was git's **cached file
  size**, not the file's contents.
- **The relay's output budget is 16,000 tokens**, and most of it is spent before the first visible
  word. Do not lower it.
- **The arid and no-data basin fills are near-neutral *and* low-opacity on purpose**, so the basemap
  shows through and they read as unfilled rather than as a value. That is 20.93% of basins. **Do not
  "brighten" them** — it would make an absence of data look like a reading.
- **The basemap needs a key and has a monthly ceiling.** Item O9. Do not change the tile URL without
  reading it.

---

## The documents, and which one owns what

**Six opening documents**, read in order at the start of every session. The count moved twice on
27 Aug 2026 — four to five when CLAUDE.md and the process rules were reconciled, five to six when
the design canon joined.

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run, and the opening and closing rituals | Yes |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | Which design rules apply here and at what strength | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks, the abstention ladder | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next, the compatibility goal | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every open item, in five families, and the north star | Yes |

**Four of them are rulebooks with one home per rule**: CLAUDE.md, CITATIONS.md, AGENT_RULES.md and
DESIGN_CANON_for_ShellB.md. It was three until the canon arrived on 27 Aug 2026.

**`agent-primer.md` is lowercase on purpose.** This repository writes rulebooks in capitals and
committed content in lowercase, the way the card sets are. The primer is content an agent inherits,
not a rulebook.

`CHAT_FORMAT_RULES_for_ShellB.md` is a **historical extraction record, not a live rulebook**.

BRAND.md and UI_REFERENCE.md are gitignored and never publish.

---

## Waiting on the maintainer

1. **Read and merge pull request #13**, the agent handoff primer. The in-depth read is the eyeball.
2. **Approve BRAND.md on the production side.** The brand alignment document arrives here by the
   maintainer's hand once that happens — rules-as-rules, the way the process rules and the design
   canon did. **Nothing here waits on it and nothing is anticipated.**
3. **The BRAND.md amendment is still unwritten.** Anemone is now Phoebe's and Anemone Light is a new
   brand value, but BRAND.md still records both only as unclaimed spares. **Not yet logged as an
   open item** — it needs a family.
4. **`brand/assets/bots/phoebe-card.svg` is still Plum and Iris.** Unpublished and untracked, so
   nothing ships wrong. **Not yet logged as an open item** — it needs a family.
5. **Bridget's identity colour.** `#7FD5DF` is still provisional, reaffirmed as provisional on
   27 Aug 2026, and it now carries a rider: after the brightness work, both agent colours are
   re-reviewed against the status taxonomy, because **an agent colour must never read as a project
   status and her soft Surf sits near *Live***.
6. **Grading the two card drafts** — Activity (Appendix C) and Definitions (the glossary). Until
   they are graded they stay uncommitted and Phoebe is not given them.
7. **Whether the export copies should be produced by a script rather than by hand (item O8).** The
   ordering half is ruled and done; this half is open and unhurried.

**Three things that used to sit on this list are not due**, and it is worth saying why rather than
letting them look forgotten:

- **Grading the abstention log.** It holds only test entries.
- **Revisiting the number twenty (item O1).** No usage to reason from.
- **The basemap's five-million-request ceiling (item O9).** Same condition.

**All three wait on the same thing: real visitors.** They will come due together, alongside item A5.

---

## What to do first

**Read [BUILD_PLAN.md](./BUILD_PLAN.md).** It says step two of the primer is next, and why.

**Check `git status` before starting.** An earlier session opened by finding Phoebe's whole relay
folder moved out of place, uncommitted and unexplained.

**Then, in order:**

1. **The maintainer reads and merges pull request #13.** Nothing in the primer moves until she has.
2. **Walk the landing** — production, which she has already walked once cold, and whatever she wants
   to see again.
3. **Step two of the primer**, once #13 is merged: wire it into `api/_systemPrompt.ts` using the
   card sets' machinery — committed source, generated module, staleness gate — and edit
   [AGENT_RULES.md](./AGENT_RULES.md) **in the same step**, because it says today that no shared
   primer exists.
4. **The brand alignment document**, if it has arrived by the maintainer's hand.

**How step two is confirmed:** not by reading the diff, but by asking Phoebe four questions on a
running server. A map question should produce the primer's Bridget sentence and send the person to
the map rather than to a conversation with her. A funder-location question should produce the honest
limit, not a pointer to Bridget as though the map answered it. A question no agent covers should
still be a plain abstention. And an ordinary eligibility question should be completely unchanged.

**Nothing is half-built.** Five steps landed and merged; one document is written and awaiting a
read. No code is part-finished.

---

## Working agreements that are easy to lose

All of these are in the rulebooks and binding. They are repeated because they shaped this session.

- **No mock or fabricated data, ever.** Real basins, registry-verified coordinates, or nothing.
- **Propose, approve, build, eyeball, commit word.** No step skipped, one topic at a time.
- **A session batches steps; the close-out ritual runs once**, at the end of the sitting.
- **Every pull request opens with a "For Amy" block** — what changed, what was approved, what to
  check — in plain English, with a line of explanation for any term a non-engineer would not know.
  **A pull request without it is not ready for review.**
- **Honest states.** A failed load says so; a derived value says it is derived; an agent with no card
  abstains rather than guessing; **and a document describing a capability nobody has says so on its
  own second page.**
- **Two datasets, two attributions**, and now a third obligation: CARTO's free tier is granted in
  exchange for keeping its attribution visible.
- **Rule zero: this repo sees only this repo.** Rules arrive as extracted files brought by the
  maintainer.
- **A default nobody wrote down is a decision nobody made.**
- **Scope is a rule, not a list.** The maintainer's correction to the primer, and it generalises:
  *Bridget covers the basin map and everything plotted on it* survives the product growing, where a
  list of what is on the map today would be stale the moment something was added.
- **Measure the right thing, and look at the thing itself.** This session's hardest lesson, learned
  twice in one hour. A status check said the tiles served, and they did — stamped. A purpose-built
  detector then cleared them too, because it counted dark pixels and the watermark is soft
  grey-blue. **Both failures were deciding in advance what the fault would look like and measuring
  for that.** The maintainer found it by opening the map. The older form of this lesson — the
  platform's log is evidence and local reasoning is a guess — is the same lesson pointed elsewhere.
