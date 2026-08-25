# Session handoff

Rewritten at the close of the session of 22–24 Aug 2026. Read this with
[CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence,
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run, and
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

**This file exists so a cold reader can pick the work up.** It says where things stand, what is
committed and what is not, what is waiting on the maintainer, and what to do first.

---

## Read this first — the state of the tree

**This session's work is committed.** Eight commits on 24 Aug 2026, from `ddd42c1`, ending with
this one: the README, the relay and card pipeline, the shared chat layer, the Eligibility surface,
AGENT_RULES.md, the rulebook consolidation, the five families and build plan, and this handoff.

The maintainer's browser check passed on all five points before the commit word was given.

**Two card drafts are deliberately uncommitted.** `activity-cards-vwba-DRAFT.md` and
`definitions-cards-vwba-DRAFT.md` are drafted but not graded, and Phoebe is not given them. They
stay untracked until they are graded.

**Committed is not deployed for Phoebe.** Pushing `main` deploys the site, but her relay still needs
`ANTHROPIC_API_KEY` set in Vercel. Until that is done she reports honestly that she is not
connected. See "Waiting on the maintainer".

---

## Where the build stands

**The map is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from `main`. Vercel
builds on every push to that branch, so this session's work ships with the push that carries these
commits.

| Surface | State |
|---|---|
| Basin map | Live in production |
| Eligibility worksheet | Committed; live once `main` is pushed |
| Phoebe, the Eligibility and Feasibility agent | Committed and answering locally; silent in production until her key is set in Vercel |
| Bridget, the map's agent | Named in the map's dock; her chat is not built |
| Shared chat layer | Committed, built through Level 2 |
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

- **Model: Claude Sonnet 5.** If abstention discipline ever weakens, the upgrade is one line —
  `MODEL` in `api/phoebe.ts`.
- **She never writes a citation.** She returns a card number and places a marker; the browser looks
  the card up in the committed file and renders the citation itself. A wrong page or an invented
  link is not something she can produce.
- **Her colour is Anemone `#A04E7E`**, with Anemone Light `#C36E9F` on her antenna. Maintainer's
  ruling, 22 Aug 2026.
- **Steps 1–3 of her build are done.** Step 4 — abstention logging and the rate limit — is not
  started. Step 5 is this close-out.

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

Seven checks. All must pass. `check-attribution` needs a build first because it reads `dist/`.

```bash
node scripts/check-basins.mjs               # counts, fields, geometry, Level 6 → 4 nesting
node scripts/check-stress.mjs               # join coverage, derivation labelling
node scripts/check-palette.mjs              # ramp lightness order, chroma separation
node scripts/check-cards.mjs                # both card sets parse and are complete
node scripts/check-api-exports.mjs          # the relay can actually answer once deployed
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
| **Environment variables** | none for the map. **Phoebe's relay needs `ANTHROPIC_API_KEY` and it is NOT set in Vercel yet** — see "Waiting on the maintainer" |
| **Config file** | none — no `vercel.json`, no rewrites needed |

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

1. **`ANTHROPIC_API_KEY` in Vercel.** Settings → Environment Variables, all three environments,
   then redeploy — Vercel injects env vars at build time, so a running deployment will not pick it
   up on its own. **Until this is done, Phoebe answers locally and not in production**, where she
   will honestly report that she is not connected.
2. **Restore branch protection on `main` (item O2).** Now due — it was set for after the week
   ending Sunday 23 Aug 2026. Settings → Rules → Rulesets → the ruleset covering `main` → Bypass
   list → remove the owner entry → Save. Do this after this session's commits land.
3. **The BRAND.md amendment is still unwritten.** Anemone is now Phoebe's and Anemone Light is a
   new brand value, but BRAND.md still records both only as unclaimed spares. The tokens and the
   portrait are correct; the roster document is not. **Not yet logged as an open item** — it needs
   a family.
4. **`brand/assets/bots/phoebe-card.svg` is still Plum and Iris.** It is unpublished and untracked,
   so nothing ships wrong, but it now disagrees with the portrait that does ship. **Not yet logged
   as an open item** — it needs a family.
5. **Bridget's identity colour.** Staffing was settled on 24 Aug 2026 — she is the map's agent —
   but `#7FD5DF` is still provisional, because BRAND.md assigns Surf no agent identity and the
   value was published under a retired agent. A brand decision, not a staffing one.
6. **The design session with the production side**, which settles the compatibility goal. No date.

---

## What to do first

**Read [BUILD_PLAN.md](./BUILD_PLAN.md).** It says Agents is next, and in what order.

The first piece of work is **the empty answer (item A4)** — Phoebe returned an answer with nothing
in it once, and the reader was shown a message that misdescribes what happened. Small, unexplained,
and sitting underneath the answer path. After that, **the agent handoff primer (item A3)**, which
the staffing ruling of 24 Aug 2026 unblocked.

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
