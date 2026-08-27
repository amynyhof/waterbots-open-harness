# Session handoff

Rewritten at the close of the session of 26 Aug 2026. Read this with
[CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence,
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run, and
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

**This file exists so a cold reader can pick the work up.** It says where things stand, what is
committed and what is not, what is waiting on the maintainer, and what to do first.

---

## Read this first

**Nothing was built this session and nothing shipped.** Two documents were merged, one accident was
repaired, and one small repository fault was found and fixed. **The product is exactly where the
session of 25 Aug left it** — Phoebe is live and capped, the map is live, and no code changed.

**Phoebe's relay folder was moved by accident, and it has been put back.** All eight files that make
up `api/` — the handler, the daily cap, the visitor identity, the abstention log, the card copy —
were found sitting in `src/api/` at the start of this session, with `api/` gone. Nothing in git did
it; there is no commit and no reflog entry. It was a stray drag in the folder, confirmed as
accidental by the maintainer.

**Had it been committed, Phoebe would have gone off the air.** The deployment platform only runs
functions from a folder called `api` at the top of the repository. It also broke the build, the dev
server and three of the nine checks, all of which name that path.

It was restored **from the commit itself** rather than by moving the copies back, so what is in the
folder came from git and not from a copy of unknown history. The stray copies were checked first and
held nothing the restore did not, and there was no ninth file among them. Confirmed afterwards:
`api/` is identical to `main`, file by file, with nothing to stage.

**All nine checks pass.** Measured at the close of this session, not assumed.

**Two documents merged this session.** The bridge to the paid platform was logged and "Knowledge
Pack" was made canon (pull request #4, commit `db5b8b6`); the ruling on how big a step is landed in
the process rules (pull request #5, commit `8a7d52e`). Both are on `main`.

**One new item — the card gate fails on a Windows checkout (item O6).** Found while repairing the
accident above. **The cards are not stale**; that was checked character by character against both
card files. The gate compares raw text, and this machine writes the file out with different line
endings from the ones the gate expects, so it reports a difference git does not see. Re-running the
generator settles it for now, and that is a patch rather than a fix. **Ruled the same evening: pin
the line endings, and build it first thing next session** — see item O6.

**Two card drafts are deliberately uncommitted.** `activity-cards-vwba-DRAFT.md` and
`definitions-cards-vwba-DRAFT.md` are drafted but not graded, and Phoebe is not given them. They stay
untracked until they are graded.

**The untracked `exports/` folder holds `Shell_B_`-prefixed copies of all fifteen root documents.**
They are the maintainer's export copies — how material leaves this repository by her hand. They
never commit and nothing here reads them.

**They were regenerated at the close of 26 Aug 2026, after the close-out merged**, so they carry the
close-out rather than the state just before it. Eleven of the fifteen were confirmed against `main`
afterwards; the other four — BRAND.md, UI_REFERENCE.md and the two card drafts — are not on `main`
at all and can only come from the folder.

**They had been missed at this close and were a session behind until the maintainer caught it.**
Nothing in the repository refreshes them and no check notices when they are stale, because the
folder is gitignored. Making the export a named step of the close-out ritual is on the waiting list
below as a proposal for next session.

### Branch tidy — five merged branches are still lying about

`main` is protected and every change goes through a pull request, so each session leaves a branch
behind. None of them is doing anything now.

**Here on this machine, all merged into `main`:**

| Branch | Its commit |
|---|---|
| `docs/session-close-out` | `4bc0b06` |
| `docs/bridge-vocab-design-canon` | `db5b8b6` |
| `docs/step-sizing-ruling` | `8a7d52e` |

**On GitHub, the same three plus two older ones:** `docs/session-close-out-25-aug` and
`feat/phoebe-step-4-cap-and-abstention-log`.

**Deleting them is safe** — every commit in them is on `main`, which is what `git branch --merged`
confirms. **Ruled on 26 Aug 2026: delete them, and turn on GitHub's delete-on-merge so they stop
accumulating.** Neither half was done that evening; both are item O7. The branch carrying this
close-out is not among the five — it joins them once its own pull request merges.

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

**Checked against `map.waterbots.ai` immediately after the merge of 25 Aug 2026, not assumed.**

**Why this mattered more than usual.** The relay is now *fail-closed* on the platform: with no
shared store it refuses to answer at all rather than quietly serving an uncapped public endpoint. So
a settings mistake would not have looked like a settings mistake — Phoebe would simply have told
every visitor that her daily limit was not running. Four checks settled it.

| Check | Result | What it proves |
|---|---|---|
| `GET /api/phoebe` | 405 in 0.44s | The function is invoked correctly. A hang here is the item S6 signal |
| `GET /api/abstentions` with no key | 401 | The new route deployed and is guarded |
| `GET /api/abstentions?key=wrong` | 401, not 503 | `PHOEBE_LOG_KEY` reached Production |
| `POST /api/phoebe` | **200, a real answer in 5.9s** | The store reached Production. **This was the one that mattered** |

That last answer cited all six eligibility cards inline and reported `cacheWrite: 18788`,
`output: 395` — the prompt cache re-warming on a fresh deployment, and 395 tokens against a 16,000
budget, which is the fixed setting behaving.

**The test question was chosen so she would not abstain**, so nothing was written to the abstention
log. That log is meant to hold real visitor questions; seeding it with an engineer's test would give
the maintainer something false to grade.

Checked before this session and still true:

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
- **Line endings differ between this machine and the commit, and one gate notices.** Git stores
  these files one way and checks them out on Windows the other way. Most things do not care; the
  card gate compares raw text and does, so on a fresh checkout it reports stale cards that are not
  stale. Item O6 carries the whole story and the fix. **Do not "fix" it by regenerating the card
  module and committing the result** — that treats the symptom and leaves the next checkout to
  produce it again.
- **The relay's output budget is 16,000 tokens, and most of it is spent before the first visible
  word.** Phoebe thinks before she writes, that thinking is invisible, and it is charged to the same
  budget as the answer. Do not lower it — 8,192 was the value that produced item A4, and 2,048
  before that failed on every project description. The full measurements are in the token budget
  section above. **This row said 8,192 until 26 Aug 2026**, having been left behind when item A4 was
  fixed; it is corrected here rather than quietly, because a stale number in a known-conditions list
  is exactly the kind of thing a later session trusts.

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
6. **Grade the abstention log.** This is what item A1 was built for and it is the part no repository
   file can do. Read `/api/abstentions?key=…`, and for each gap decide: a legitimate limit of the
   card set, or a card to write.
7. **Revisit the number twenty (item O1)** once there is real usage to reason from. It was chosen
   before any traffic existed. The daily counts and the abstention log are the first real evidence
   that will exist for that decision — there is none yet, so this is not due.
8. **Turn on GitHub's delete-on-merge (item O7).** Ruled on 26 Aug 2026 along with deleting the
   branches themselves. **This half is a live GitHub setting, not a repository file** — nothing here
   enforces it and nothing here can confirm it, the same as branch protection (item O2). It is the
   half that stops merged branches accumulating again; deleting the existing ones is the engineer's
   half and is on the list below.
9. **Rule on making the export step part of the close-out ritual.** The engineer is to put this
   forward as a written proposal next session; it is listed here because changing the ritual is the
   maintainer's decision, not the engineer's.

   **Why it is being raised.** The `exports/` folder holds `Shell_B_`-prefixed copies of all fifteen
   root documents. It is how material leaves this repository by the maintainer's hand, and it is
   gitignored, so nothing in the repository refreshes it and no check notices when it is stale. At
   the close of 26 Aug 2026 it was a session behind — the close-out had been written, reviewed,
   committed and merged, and the copies still said 25 Aug. **It was caught by the maintainer, not by
   the process**, and it was regenerated the same evening.

   **What the proposal would say.** [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md)
   owns how a session closes and lists the steps in order. The export step is not among them, which
   is the whole reason it was skipped. Adding it as a named step is the smallest change that fixes
   the cause. Whether it should also be a script rather than a hand copy is a second question and a
   larger one, and the proposal should keep the two apart.

   **What "done" looks like:** all fifteen copies regenerated from the root documents as they stand
   at the moment of the close, after the final commit rather than before it, so the copies carry the
   close-out itself and not the state just before it.

**Two rulings came in on 26 Aug 2026 and are no longer waiting on anyone** — they are work, not
decisions. Pin the line endings (item O6), first thing next session. Delete the merged branches
(item O7). Both are recorded in [OPEN_ITEMS.md](./OPEN_ITEMS.md) with what "done" looks like.

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

**Two small things come first, both ruled on 26 Aug 2026 and neither built.**

1. **Pin the line endings (item O6).** A `.gitattributes` file, minutes of work. Done means
   `git status` clean and the card gate passing together, on a fresh checkout, with no need to
   re-run the generator. The patch sitting in the folder now — `api/_cards.generated.ts` showing as
   modified with nothing to stage — should go away as part of this rather than be committed.
2. **Delete the merged branches (item O7)** — three here, five on GitHub, all confirmed merged.
   Turning on GitHub's delete-on-merge is the maintainer's half and is on the waiting list above.
3. **Write the proposal to make the export step part of the close-out ritual.** A written proposal,
   not a change — the reasoning and what it should cover are in the waiting list above.

**None of the three blocks the primer** and together they are a short first hour.

**Nothing is half-built.** Nothing was built this session. The accidental folder move is fully
repaired and confirmed, the nine checks all pass, and no code changed. The only loose thread is the
ruling on item O6.

**Check `git status` before starting.** This session opened by finding Phoebe's whole relay folder
moved out of place, uncommitted and unexplained, and it would have taken her off the air had it been
committed. It cost nothing to catch because it was looked at first.

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
