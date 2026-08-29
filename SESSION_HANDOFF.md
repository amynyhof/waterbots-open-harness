# Session handoff

Rewritten at the close of the session of 28 Aug 2026. Read this with
[CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence,
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run,
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) — **now superseded, see below** — and
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

**This file exists so a cold reader can pick the work up.** It says where things stand, what is
committed and what is not, what is waiting on the maintainer, and what to do first.

---

## Read this first

**Phoebe was failing about one request in six, and it is fixed.** That is the whole of this session.

**How it was found matters.** Nobody was looking for it. The agent handoff primer was being tested
against a baseline, the baseline turned out to be sick, and a fault that had been live to the
public since launch surfaced by accident.

**What it was.** Empty answers where she finished normally and said nothing; replies of one to three
characters delivered to visitors as answers; a false `API error 400` that was never our request; and
a budget wall that item A4 recorded as impossible.

**What fixed it.** Moving her to **Opus 5**. The empty-answer rate falls from **12% to 2%**, and she
is faster and cites more cards than before. Two guards followed for what the model change does not
reach.

**The agent handoff primer is live.** Rung 2 of the abstention ladder is no longer *partly live*.
Phoebe says the maintainer's sentence about Bridget **word for word**.

**Eleven checks now**, not ten.

### What changed underneath us, and matters tomorrow

**The brand book arrived by the maintainer's hand — version 3, one light brand.** `BRAND.md` in this
folder **is now that book**. It supersedes the two-theme era and governs both properties.

**[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is superseded by it and does not yet
say so.** Its superseded header comes by the maintainer's hand under the visible-corrections rule,
with the original reasoning preserved. **Until it lands, that file reads as binding and is not.**

**The book's asset tree is on the maintainer's desktop and has not been moved.** When it comes, it
goes to `brand/assets/`, which is gitignored except for the two files the product ships.

---

## Where the build stands

**Everything is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from `main`.

| Surface | State |
|---|---|
| Basin map | Live, on a keyed CARTO Voyager basemap |
| Eligibility worksheet | Live |
| Phoebe, the Eligibility and Feasibility agent | **Live on Opus 5, capped at 20 messages a day** |
| Bridget, the map's agent | Named in the map's dock; her chat is not built |
| Agent handoff primer | **Live — Phoebe inherits it; rung 2 is live** |
| Shared chat layer | Live, built through Level 2 |
| Project points | Not started — blocked on registry data (item D2) |

### Phoebe, and the settings that are stated rather than inherited

- **Model: Claude Opus 5**, thinking adaptively at **"medium" effort**, budget **16,000** output
  tokens, **call timeout 120 seconds**. All four are written in `api/phoebe.ts` with the
  measurements that chose them. **A default nobody wrote down is a decision nobody made.**
- **A reply shorter than 40 characters is refused**, not delivered. The floor lives in
  `api/_reply.ts` with the evidence for the number.
- **One retry, only for a 400 arriving after five seconds.** A malformed request is rejected in
  milliseconds; the two measured instances came back at 27.8 and 31.4 seconds with parameters
  identical to thirteen successes. **A retry cannot cost a visitor two of their twenty**, and
  `check-cap` proves it.
- **She never writes a citation.** She returns a card number and places a marker; the browser
  renders the citation from the committed file.
- **Her colour is Anemone `#A04E7E`.** Ruled 22 Aug, reaffirmed 27 Aug, and reaffirmed again on
  28 Aug against the new brand book — see *Waiting on the maintainer*.
- **She inherits the agent primer**, generated from a marked region of `agent-primer.md`.

### The diagnosis, in one place

Seventy-five instrumented requests found four faults, and **every one of them failed late**:

| Fault | Rate before | State |
|---|---|---|
| Empty or near-empty reply | 12% | **Fixed** — 2% on Opus; the near-empty variant is refused |
| `API error 400 — Invalid request data` | 3% | **Weather.** Not our request; identical to thirteen successes; arrived after 28–31 seconds. Retried once |
| Budget exhausted at 16,000 | 3% | **Ours** — effort reaches it. Not closed; cut off at 120 seconds |
| Answers varying on identical input | — | **Mostly a measuring error of mine**, corrected in item A6 |

**One number to distrust.** The hard-question rate swung from **23% to 10% on the identical
configuration four hours apart**. A thirty-request sub-sample cannot carry a decision; the
sixty-request figure is the steady one. This is written into item A6 because it will bite the next
comparison too.

---

## Confirming the build

**Eleven checks. All must pass.** Three need a build first because they read `dist/`.

```bash
node scripts/check-basins.mjs               # counts, fields, geometry, Level 6 to 4 nesting
node scripts/check-stress.mjs               # join coverage, derivation labelling
node scripts/check-palette.mjs              # ramp lightness order, chroma separation
node scripts/check-cards.mjs                # both card sets parse and are complete
node scripts/check-api-exports.mjs          # the relay can actually answer once deployed
node scripts/check-visitor-id.mjs           # the scrambled identity is stable, unique, salted
node scripts/check-cap.mjs                  # 20 pass, 21 refused, refunds, no double charge
node scripts/check-reply-guard.mjs          # an answer too short to be one is refused
node scripts/build-prompt-modules.mjs --check   # cards AND primer are not stale
npm run build && node scripts/check-attribution.mjs && node scripts/check-basemap-key.mjs
```

**`check-reply-guard` is new.** The fault it guards appears in about two requests in a hundred, so
waiting for one is not a test. It compiles `api/` the way the platform does and exercises the guard
against the reply lengths actually measured, on both sides of the boundary.

**`check-cap` gained two checks**: one visitor message is charged once whatever happens after it,
and a message failing on both attempts is given back once rather than twice.

**`build-prompt-modules.mjs` was `build-card-module.mjs`** until 28 Aug. It emits two bundles now —
the cards and the primer — and **throws if the primer's region markers are missing**, because
silently embedding the whole file or nothing would each be a wrong prompt that still builds.

**After editing any card or the agent primer, run `node scripts/build-prompt-modules.mjs`.**

---

## Running it locally

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npm run dev
```

**Phoebe's key must be in the environment before the server starts.** An env file does not work for
it: Vite puts env files into the browser's `import.meta.env`, and the relay is Node code reading
`process.env`.

**The basemap key is the opposite case and lives in `.env.local`** as `VITE_CARTO_KEY`, baked into
the bundle at build time. Without it the map works and every tile is watermarked.

**`PHOEBE_DIAGNOSE=1` turns on the failure diagnosis logging.** Off by default. It records the stop
reason, content blocks, token usage, elapsed time, which model and effort produced the answer, and
quotes any reply of forty characters or fewer in full. **It never logs a visitor's question, only
its length.** It is named in the code as debt to remove.

> **Two people cannot work in this folder at once.** The dev server reloads the page whenever any
> file changes. **While the maintainer is checking in the browser, the engineer touches nothing.**
>
> **And only one dev server at a time.** A second cannot take the port, exits, and requests
> silently go to the first — which nearly attributed a measurement to the wrong model on 28 Aug.

---

## Deployment

| | |
|---|---|
| **Live URL** | https://map.waterbots.ai |
| **Repo** | https://github.com/amynyhof/waterbots-open-harness (public), branch `main` |
| **Host** | Vercel, imported from GitHub — pushes to `main` deploy automatically |
| **Shared store** | Redis, via Vercel Storage, all three environments |
| **Branch hygiene** | Branch protection on `main`; delete-on-merge is on |

### Settings a deployment needs

| Setting | For | If missing |
|---|---|---|
| `ANTHROPIC_API_KEY` | Phoebe's relay | She says she is not connected |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | The shared store | On the platform she does not answer at all |
| `PHOEBE_VISITOR_SALT` | The scrambled visitor identity | Same. **Set once, never changed** |
| `PHOEBE_LOG_KEY` | Opens the abstention log | That address returns nothing |
| `VITE_CARTO_KEY` | The basemap, **at build time** | The map works and every tile is watermarked |

**A settings change only reaches a deployment that starts after it**, and doubly so for
`VITE_CARTO_KEY`, which is read when the bundle is built rather than when a request arrives.

---

## Known conditions, recorded so they are not rediscovered as bugs

- **`PFAF_ID` is unique only within a regional tile.** One Arctic and Siberia overlap collides at
  every level; the checks name it and fail on any *other* collision.
- **`getBoundsZoom` clamps to the current `minZoom`.** It is cleared before measuring. Do not
  "simplify" that away.
- **HydroBASINS excludes Antarctica.** Southern data limit −55.883; the view extends to −68 by
  design.
- **Line endings are pinned by `.gitattributes`.** Item O6 carries why, including that the real
  cause was git's cached file size rather than the file's contents.
- **The arid and no-data basin fills are near-neutral *and* low-opacity on purpose**, so the basemap
  shows through and they read as unfilled rather than as a value — 20.93% of basins. **Do not
  brighten them.**
- **The basemap needs a key and has a five-million-request monthly ceiling.** Item O9.
- **The output budget is 16,000 and the ceiling is genuinely reached**, about once in seventy-five.
  Item A4 said there was 13% headroom; that is corrected in place. **Raising it buys a longer
  runaway**, not more room.
- **Phoebe gets a marked region of the primer, not the whole file.** Embedding the whole document
  destabilised ordinary answers. The outer sections are instructions about the prompt and provenance
  for human readers.

---

## The documents, and which one owns what

**Six opening documents**, read in order at the start of every session. **The opening is now a
two-part ritual** — see [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which owns it.

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run; the opening and closing rituals; visible corrections | Yes |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | **Superseded by the brand book, and does not yet say so** | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks, the abstention ladder | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every open item, in five families, and the north star | Yes |

**`agent-primer.md` is lowercase on purpose** — committed content an agent inherits, like the card
sets, not a rulebook. **BRAND.md and UI_REFERENCE.md are gitignored and never publish.**

---

## Waiting on the maintainer

1. **The superseded header for `DESIGN_CANON_for_ShellB.md`** — her text, coming by hand. **This is
   tomorrow's first brand step.**
2. **A one-line amendment to the master brand book**, closing Phoebe's gap at the source. Her ruling
   of 28 Aug: the book's roster is production's crew, and each surface extends it with its own
   agents under the book's rules. **"Recorded, not in use" means not in use on production.** Owed by
   her hand at the book's next revision.
3. **The `--chrome` question.** The book allows three planes and no fourth, and names no fill for
   chrome. This repository has a derived `--chrome` sitting below the canvas. **The book says to
   raise it rather than invent**, and she is taking it to production's book.
4. **The book's asset tree**, on her desktop. It goes to `brand/assets/` when the brand steps run.
5. **Calvin's roster entry, colour and primer entry**, when his lane opens. **The name is canon; the
   rest is not.**
6. **Grading the two card drafts** — Activity and Definitions. Until graded they stay uncommitted
   and Phoebe is not given them.
7. **Whether the export copies should be a script rather than a hand copy** (item O8).

**Four things wait on real visitors, not on anyone**, and will come due together: the number twenty
(item O1), the basemap ceiling (item O9), the primer review against the abstention log (item A5),
and whether an abstention that cited a card is a fault at all (item A7).

---

## What to do first

**Run Part 1 of the opening ritual** — it is new, and it is in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md). Read the six documents, confirm `main`
equals `origin` with the identifiers compared, report where things stand and **what changed
underneath us**, and kill stray dev servers. **No building in Part 1.**

**The thing that changed underneath us is the brand book.** It is already in the folder.

**Then Part 2 — propose the brand plan**, in this order, as the maintainer set it:

1. **The superseded header** on `DESIGN_CANON_for_ShellB.md`, from her text, under the
   visible-corrections rule with the original reasoning preserved.
2. **The brand item logged**, carrying what the book changes here.
3. **The return to the book as sized steps.** The measured differences are in
   [BUILD_PLAN.md](./BUILD_PLAN.md): the canvas moves from `#FBFBFE` to `#F6F5FA`, the hairline from
   9% to 10%, two radii grow, the neutrals are renamed, shadow tokens appear, **the dark theme
   retires**, and Bridget becomes **Surf `#14C8D9`**.

**Nothing is half-built.** Six steps landed and merged today; the working tree is clean apart from
the two ungraded card drafts.

---

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.**
- **Propose, approve, build, eyeball, commit word.** One topic at a time.
- **An approved plan is a batch approval** — build through it without stopping between steps,
  interrupting only for a needed ruling, a surprise that changes the plan, or a gate failure.
  **It loosens nothing else.**
- **Visible corrections over rewritten history.** A false line is struck and corrected in place. The
  record keeps what was believed and when it was corrected.
- **Every pull request opens with a "For Amy" block.** Without it, it is not ready for review.
- **Honest states**, everywhere — including a document that says on its own second page that no
  agent has it yet.
- **A default nobody wrote down is a decision nobody made.** Applied twice today: the missing call
  timeout, and the model setting itself.
- **Scope is a rule, not a list.**
- **Measure the right thing, and look at the thing itself.** This week's hardest lesson, learned
  four times: a status check that confirmed watermarked tiles "served"; a stamp detector that
  counted dark pixels when the stamp was pale; a test that could not tell a timeout from an empty
  answer; and a clean baseline that was luck. **Each time the error was deciding in advance what the
  fault would look like.**
- **A measurement that does not say what produced it is not a measurement.** Every diagnosis line
  now records the model and effort, after a run was nearly credited to the wrong engine.
