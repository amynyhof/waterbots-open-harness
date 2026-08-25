# Session handoff

Rewritten at the close of the session of 25 Aug 2026. Read this with
[CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence,
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run, and
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

**This file exists so a cold reader can pick the work up.** It says where things stand, what is
committed and what is not, what is waiting on the maintainer, and what to do first.

---

## Read this first

**Phoebe's step 4 is built: the daily cap and the abstention log.** She has a cap of 20 messages per
visitor per UTC day, and every question she declines is now written down where it can be graded.
Both were confirmed by the maintainer in a preview deployment before merge.

**She was live, public and uncapped from 24 to 25 Aug 2026.** That is why step 4 jumped the queue
ahead of the work BUILD_PLAN.md had scheduled.

**The empty answer (item A4) was diagnosed and fixed, and it was not what it looked like.** Hidden
thinking was spending her whole answer budget. The model thinks before it writes, that thinking is
not shown, and it is charged to the same output budget as the reply — and the relay never set the
parameter, so it inherited the default. Three faults across two days had one cause. The measurements
are in item A4.

**Five commits this session**, on branch `feat/phoebe-step-4-cap-and-abstention-log`, from `f617e90`.
Three built step 4, one fixed the token budget, and this docs refresh is the fifth.

**`main` is protected.** Direct pushes are refused; changes go through a pull request. A rejected
push is the ruleset working, not a fault.

**Two card drafts are deliberately uncommitted.** `activity-cards-vwba-DRAFT.md` and
`definitions-cards-vwba-DRAFT.md` are drafted but not graded, and Phoebe is not given them. They stay
untracked until they are graded.

There may also be an untracked `exports/` folder of `Shell_B_`-prefixed copies of the root documents.
Those are the maintainer's export copies. They never commit and nothing reads them.

---

## Where the build stands

**Everything is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from `main`.
Vercel builds on every push to that branch.

| Surface | State |
|---|---|
| Basin map | Live |
| Eligibility worksheet | Live |
| Phoebe, the Eligibility and Feasibility agent | **Live and answering, capped at 20 messages a day** |
| Bridget, the map's agent | Named in the map's dock; her chat is not built |
| Shared chat layer | Live, built through Level 2 |
| Project points | Not started — blocked on registry data (item D2) |

### The map

- **HydroSHEDS HydroBASINS** Level 4 (1,342 basins) at world view, swapping to Level 6
  (16,397 basins) from zoom 5, with a dead band at 4.5 so resting on the boundary cannot thrash an
  8.44 MB layer. Level 6 is lazily fetched on first crossing and viewport-filtered once mounted.
- **WRI Aqueduct 4.0** water stress at 100% coverage. Level 6 renders WRI's published figures with
  no aggregation; Level 4 is an area-weighted majority of its children and is labelled as derived
  wherever it renders.
- **Cover-fit** to the column — the map fills the viewport and pans rather than showing empty
  bands, clamped to one world.

### Phoebe (beta)

She is the Eligibility and Feasibility specialist, sitting with the Eligibility surface. **She
answers for real**, from two committed card sets and nothing else.

- **Model: Claude Sonnet 5**, thinking adaptively at **"medium" effort**, budget 16,000 output
  tokens. All three are stated in `api/phoebe.ts` rather than inherited — see the token budget
  below, which is the whole story of item A4. If abstention discipline ever weakens, raise `EFFORT`
  first, then `MODEL`.
- **She never writes a citation.** She returns a card number and places a marker; the browser looks
  the card up in the committed file and renders the citation itself. A wrong page or an invented
  link is not something she can produce.
- **Her colour is Anemone `#A04E7E`**, with Anemone Light `#C36E9F` on her antenna. Maintainer's
  ruling, 22 Aug 2026.
- **Her whole build is done — steps 1 through 5.** Step 4, the cap and the abstention log, landed
  25 Aug 2026.

#### The cap, and what is stored

**20 messages per visitor per UTC day.** A visitor is their network address scrambled with
`PHOEBE_VISITOR_SALT`; the address itself is never stored and nothing else about the person is read.
The key expires when the day does.

- **Only delivered answers count.** The count rises just before the model is called and is given
  back if the call fails on our side. Nobody spends one of their twenty on our fault.
- **A malformed request never costs a message** — everything a request can be refused for on its own
  terms happens before the counting.
- **Missing store, two different answers.** Anywhere the platform runs the relay, a missing store
  stops Phoebe answering rather than quietly serving an uncapped public endpoint. On a laptop it
  warns loudly and lets the message through. A store that is set up but stumbling lets one message
  through uncounted and logs it.
- **The abstention log holds no visitor identifier at all**, so a question cannot be traced to a
  person. It keeps when, the topic in Phoebe's words, and the question as typed. Newest 500. Read it
  at `/api/abstentions?key=…` with `PHOEBE_LOG_KEY`.

#### The token budget, which is where item A4 lived

**Phoebe thinks before she writes, that thinking is invisible, and it is charged to the same budget
as her reply.** The relay never set the thinking parameter, so it inherited adaptive thinking at
"high" effort. Nothing in the code said so.

Measured 25 Aug 2026 at the old settings: a two-sentence question spent **4,194 output tokens for
1,848 characters of visible answer** — about 88% of the spend invisible. The budget was 8,192 and its
comment claimed that was "roughly double the worst run observed". It was not.

That produced both faults. Run out entirely and the answer is cut off; come close and the model
still closes out the required JSON shape, with an empty `reply` that parses cleanly and is then
refused. Same curve, one step apart.

**After the fix** — budget 16,000, effort "medium" — the same question ran 977 and 2,088 tokens.
Worst-observed headroom went from 51% of budget to 13%. Abstention discipline held.

**A default nobody wrote down is a decision nobody made.** That is the lesson worth keeping, and it
is why every failure path now logs the token spend against the budget.

### Three production faults, and why they matter more than they look

Phoebe worked perfectly on a laptop and failed on every request in production, three times running.
Each fault was invisible locally and obvious once deployed. They are recorded here because the
pattern is worth more than the three fixes.

| Fault | What it did | Fix |
|---|---|---|
| Imports named a file without its extension | Node could not load the module. 500 on every message | Extensions added; the api folder now type-checks as `nodenext`, so an extensionless import fails the build |
| `runtime: 'nodejs'` declared on a web-standard handler | Every request hung, including a `GET` that should answer in a millisecond | Override removed — though this was not actually the cause |
| A **default export** | Vercel always invokes a default export as `(req, res) => void` and ignores what it returns, so nothing was ever written | `POST` and `GET` exported as named methods; `scripts/check-api-exports.mjs` now fails the build on a default export |

**The common cause is one thing: the dev relay was kinder than production.** It resolved
extensionless imports, it built a `Request` by hand, and it reached for `module.default` — the one
shape production does not support. Every local check passed on all three faults.

**Two of the three fixes I proposed were wrong**, because I reasoned about production from local
evidence. What settled it was Vercel's own build log, which named the default-export problem
outright. **When production and local disagree, the platform's log is evidence and local reasoning
is a guess.**

This is item S6, and it is still open. Three guards close three known differences; they do not close
the gap. **The useful signal, if this happens again:** a request that never reaches the model — a
`GET`, or a malformed `POST` — should answer in milliseconds. If it hangs, the fault is in how the
function is invoked, not in the model, the token budget or the key.

### The shared chat layer

`src/chat/` — one chat component every open-site agent uses. Phoebe uses it now; Bridget is meant
to use it unchanged.

- `evidence.ts` is the contract: the citation shape, an Evidence record, the turn types, and
  `layoutAnswer`, which numbers markers in order of first appearance.
- `AgentChat.tsx` is the shell and does not know which agent it renders.
- `AnswerBody.tsx` and `CiteLine.tsx` own every citation on screen.
- **Nothing citation-related lives in an agent's panel.** `PhoebePanel.tsx` is 92 lines of identity
  and wiring.

---

## Confirming the build

Nine checks. All must pass. `check-attribution` needs a build first because it reads `dist/`.

```bash
node scripts/check-basins.mjs               # counts, fields, geometry, Level 6 → 4 nesting
node scripts/check-stress.mjs               # join coverage, derivation labelling
node scripts/check-palette.mjs              # ramp lightness order, chroma separation
node scripts/check-cards.mjs                # both card sets parse and are complete
node scripts/check-api-exports.mjs          # the relay can actually answer once deployed
node scripts/check-visitor-id.mjs           # the scrambled identity is stable, unique, salted
node scripts/check-cap.mjs                  # 20 pass, 21 refused, refunds work, the log stores no one
node scripts/build-card-module.mjs --check  # the relay's card copy is not stale
npm run build && node scripts/check-attribution.mjs
```

`check-api-exports` exists because a default export in `api/` builds cleanly, type-checks cleanly,
works locally, and hangs on every request in production. It cost three failed deploys on
24 Aug 2026 to find. Vercel's own build log named it in the end; this turns that warning into a
local build failure.

`check-attribution` greps the **built bundle**, not the source. It is a licence guard: a refactor
that dropped the HydroSHEDS statement would otherwise leave the map looking perfectly correct.

`check-cards` re-derives both card sets independently of the app's parser, so it proves more than
that the module agrees with itself. It also enforces the canonical link on every card.

`check-visitor-id` re-derives the scrambling through a second crypto interface, so it proves the
recipe rather than agreeing with itself. `check-cap` compiles `api/` to a temporary directory and
runs the **real** relay code against a **stand-in store** on this machine — 21 checks covering the
refusal boundary, the refund, the missing-store behaviour, and the guarantee that no abstention
record holds any trace of who asked. It also fails if any environment setting can move the cap,
which is what stops the testing shortcut coming back.

**That stand-in is not fabricated data**, per the maintainer's ruling of 25 Aug 2026 now written into
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md): the rule protects what a visitor is
shown, and a test stand-in that never reaches a person is a different thing. **What it cannot prove
is that the real store behaves like the stand-in** — that is item S6 territory, and only a deployed
address and a browser settle it.

**After editing any card, run `node scripts/build-card-module.mjs`** or the relay deploys with stale
cards while the worksheet shows current ones — a disagreement no visitor could see.

---

## Running it locally

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npm run dev
```

**The key must be in the environment before the server starts.** A `.env` file does not work: Vite
puts env files into the browser's `import.meta.env`, but the relay is Node code reading
`process.env`. The maintainer's key is set as a user-level Windows environment variable, which a
newly opened terminal picks up but a long-running process does not.

`/api/phoebe` is served in development by a plugin in `vite.config.ts` that loads the same handler
Vercel deploys, so there is no second copy to drift.

**There is no cap locally**, and that is deliberate rather than an oversight. With no shared store
configured, the relay logs `this message was not counted against any cap — development only` and
answers. Anywhere the platform runs it, the same missing store stops her answering instead. If you
want the cap locally, set `KV_REST_API_URL`, `KV_REST_API_TOKEN` and `PHOEBE_VISITOR_SALT` in the
shell before starting the server.

> **Two people cannot work in this folder at once.** The dev server reloads the whole page whenever
> any file changes, including root documents the app never imports. That wipes the open conversation
> and drops the reader back on the map. It cost an hour of false bug-hunting on 23 Aug 2026. **While
> the maintainer is checking in the browser, the engineer touches nothing.**

---

## Deployment

| | |
|---|---|
| **Live URL** | https://map.waterbots.ai |
| **Vercel URL** | https://waterbots-open-harness.vercel.app |
| **Repo** | https://github.com/amynyhof/waterbots-open-harness (public), branch `main` |
| **Host** | Vercel, imported from GitHub — pushes to `main` deploy automatically |
| **Framework preset** | Vite · build `npm run build` · output `dist` · install `npm install` |
| **Environment variables** | none for the map; five for Phoebe — see below |
| **Shared store** | Redis, added via Vercel Storage on 25 Aug 2026, connected to all three environments |
| **Config file** | none — no `vercel.json`, no rewrites needed |

### Settings Phoebe needs

All set by the maintainer on 25 Aug 2026, across Production, Preview and Development.

| Setting | What it is for | If it is missing |
|---|---|---|
| `ANTHROPIC_API_KEY` | Her relay | She says she is not connected |
| `KV_REST_API_URL` | The shared store | On the platform, she does not answer at all |
| `KV_REST_API_TOKEN` | The shared store | Same |
| `PHOEBE_VISITOR_SALT` | The secret mixed into the scrambled visitor identity | Same |
| `PHOEBE_LOG_KEY` | Opens `/api/abstentions` | That address returns nothing |

**`PHOEBE_VISITOR_SALT` is set once and never changed.** Changing it makes every visitor look new
and resets every count to zero. It is not a rotating secret.

**The store's alternative names are also read** — `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` — so a store provisioned the other way needs no code change.

**A settings change only reaches a deployment that starts after it.** Adding or editing any of these
requires a redeploy before it takes effect.

### Domain and DNS

`map.waterbots.ai` is a CNAME pointing at Vercel. DNS is managed at **Namecheap**.

> The exact record value should be read from the Vercel **Settings → Domains** panel or from
> Namecheap. Vercel issues a per-project target and it is not ours to guess.

TLS is a Let's Encrypt certificate issued 19 Aug 2026, valid to 17 Nov 2026, renewing
automatically.

### Verified live

Checked against `map.waterbots.ai` before this session, not assumed:

- All three data files return HTTP 200 at byte-exact sizes (2,232,356 / 8,854,936 / 299,225).
- **Brotli compression is on** — 2.72 MB over the wire against 11.39 MB raw. A visitor who never
  zooms past z5 transfers roughly 685 KB.
- A nonexistent path returns a real 404, not an HTML fallback masquerading as data.
- Every required attribution string is present in the shipped bundle; no unfilled Exhibit B
  placeholder, no WWF logo reference.
- Zero console messages.

---

## Data pipeline

The source data is **not in this repository** — it is far too large and is reproducible.

| Input | Size | Where |
|---|---|---|
| HydroSHEDS shapefiles, levels 3–6 | ~1.2 GB | `data-src/`, gitignored, re-downloadable by script |
| WRI Aqueduct 4.0 download | 737 MB | `legacy/`, gitignored, **not** downloaded by any script |

```bash
node scripts/build-basins.mjs          # downloads, converts, simplifies both levels
node scripts/build-basins.mjs --clean  # and removes data-src/ afterwards
node scripts/build-stress.mjs          # needs the Aqueduct CSV
```

`build-basins.mjs` fetches everything it needs. **`build-stress.mjs` does not** — it reads the
Aqueduct CSV from `legacy/` and exits with instructions if it is missing. Set `AQUEDUCT_CSV` to
point elsewhere. Download it from https://www.wri.org/data/aqueduct-global-maps-40-data.

Only the three small outputs in `public/` are committed.

### Known conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic/Siberia overlap produces exactly
  one collision at every level — `353` → `3530` → `353020`. It is in the untouched source
  shapefiles. The check scripts name it and fail on any *other* collision.
- **`getBoundsZoom` clamps to the current `minZoom`.** Setting `minZoom` from its own output is a
  ratchet that can only climb, and it cropped the world when the column narrowed. `minZoom` is
  cleared before measuring. Do not "simplify" that away.
- **HydroBASINS excludes Antarctica.** The southern data limit is −55.883. The view deliberately
  extends to −68 so the Antarctic coastline gives context; the strip below the data limit is
  basemap only, by design.
- **The card parser was CRLF-sensitive** and rendered a blank page on a Windows checkout while
  Vercel's Linux build was fine. Both the parser and the card-module gate now normalise line
  endings. Do not remove that.
- **The relay's output budget is 8192 tokens, and most of it is spent before the first visible
  word.** Phoebe reasons through six criteria inside the same budget as her answer; measured runs
  used 2,762 to 4,423 tokens for a visible answer of about 1,500 characters. At the old value of
  2048 every project description failed. Do not lower it.

---

## The documents, and which one owns what

Six root documents. **Each rule has exactly one home**, and where a rule belongs elsewhere the file
points at it rather than restating it.

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run — propose, approve, build, eyeball, commit | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks, the abstention ladder | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next, the compatibility goal | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every open item, in five families, and the north star | Yes |

`CHAT_FORMAT_RULES_for_ShellB.md` is a **historical extraction record, not a live rulebook** — its
rules were distributed into the files above on 22 Aug 2026 and its header says so.

BRAND.md and UI_REFERENCE.md are gitignored and never publish.

**Open items are grouped into five families** — Knowledge, Agents, Surfaces, Data, Operations —
and **every item belongs to one**. There are no loose rows. They were renumbered on 23 Aug 2026;
the old V, B and P identifiers are gone and every reference to them was updated in the same edit.

---

## Waiting on the maintainer

1. **The BRAND.md amendment is still unwritten.** Anemone is now Phoebe's and Anemone Light is a
   new brand value, but BRAND.md still records both only as unclaimed spares. The tokens and the
   portrait are correct; the roster document is not. **Not yet logged as an open item** — it needs
   a family.
2. **`brand/assets/bots/phoebe-card.svg` is still Plum and Iris.** It is unpublished and untracked,
   so nothing ships wrong, but it now disagrees with the portrait that does ship. **Not yet logged
   as an open item** — it needs a family.
3. **Bridget's identity colour.** Staffing was settled on 24 Aug 2026 — she is the map's agent —
   but `#7FD5DF` is still provisional, because BRAND.md assigns Surf no agent identity and the
   value was published under a retired agent. A brand decision, not a staffing one.
4. **The design session with the production side**, which settles the compatibility goal. No date.
5. **Grading the two card drafts** — Activity (Appendix C) and Definitions (the glossary). Until
   they are graded they stay uncommitted and Phoebe is not given them.
6. **Delete `PHOEBE_TEST_CAP` from the Vercel settings.** A testing shortcut lowered the cap so it
   could be proved in four messages instead of twenty-one. **The code that read it is gone** — it was
   removed before merge, and `check-cap` now fails if any setting can move the cap again. The setting
   itself does nothing now, but it should not be left lying in the project. Preview environment.
7. **Grade the abstention log.** This is what item A1 was built for and it is the part no repository
   file can do. Read `/api/abstentions?key=…`, and for each gap decide: a legitimate limit of the
   card set, or a card to write.
8. **Revisit the number twenty (item O1)** once there is real usage to reason from. It was chosen
   before any traffic existed. The daily counts and the abstention log are the first real evidence
   that will exist for that decision — there is none yet, so this is not due.

---

## What to do first

**Read [BUILD_PLAN.md](./BUILD_PLAN.md).** It says the agent handoff primer is next, and why.

**Branch first.** `main` is protected, so work goes through a pull request.

The next piece of work is **the agent handoff primer (item A3)** — a short shared document telling
each agent what the others cover, so an agent asked something outside its own sources can point
rather than only abstain. The staffing ruling of 24 Aug 2026 unblocked it and nothing else holds it
up, though the worked example it would most want — where the corporate funders are working — is item
D1 and does not exist yet.

**Read the abstention log before writing it.** That log now records what people actually ask Phoebe
that she cannot answer. Some of those gaps will turn out to be another agent's subject rather than a
missing card, which is exactly what the primer is for. Writing the primer from real questions is
cheaper than writing it from guesses and then revising it.

**Nothing is half-landed.** Step 4 is complete and merged, item A4 is closed, and no work was left
part-built at the close of this session.

---

## Working agreements that are easy to lose

All of these are in the rulebooks and binding. They are repeated here because they shaped nearly
every decision in this session.

- **No mock or fabricated data, ever.** Real basins, registry-verified coordinates, or nothing.
- **Propose, approve, build, eyeball, commit word.** No step skipped, one topic at a time.
- **Honest states.** A failed load says so; a derived value says it is derived; a disabled control
  says why; an agent with no card abstains rather than guessing.
- **Two datasets, two attributions.** One combined credit line satisfies neither licence.
- **Shortcuts are named as shortcuts and logged as debt**, never quietly kept.
- **Rule zero: this repo sees only this repo.** Rules arrive as extracted files brought by the
  maintainer; nothing is fetched, guessed at, or imitated.
- **A default nobody wrote down is a decision nobody made.** Item A4 hid for two days behind a model
  setting the code never stated. Where a library's default shapes behaviour that matters, write it
  down in the code even when the value you write is the default.
- **Measure before claiming.** The A4 diagnosis is four real requests, not an argument. The last
  session's lesson was that the platform's log is evidence and local reasoning is a guess; this one
  is the same lesson pointed at a library.
