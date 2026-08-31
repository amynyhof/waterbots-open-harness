# Session handoff

**Current state only.** Rewritten from scratch at the close of 30 Aug 2026, and rewritten from
scratch at every close — maintainer's ruling of 29 Aug 2026, *the opening reads stay thin, forever*.

**No history lives here.** How things came to be is in [BUILD_LOG.md](./BUILD_LOG.md), which is
append-only and is **not** read at the opening. Each open thread's own story is in its row in
[OPEN_ITEMS.md](./OPEN_ITEMS.md). If this file starts explaining how something happened, that is the
defect the ruling names.

Read it with [CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence, with
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work is run, and with
[BUILD_PLAN.md](./BUILD_PLAN.md), which says what comes next.

---

## Where things stand

**Everything is live at [map.waterbots.ai](https://map.waterbots.ai)**, deployed from `main`.
`main` equals `origin`. The working tree is clean apart from two ungraded card drafts. Nothing is
half-built and no branch is open.

| Surface | State |
|---|---|
| Basin map | Live, keyed CARTO Voyager basemap under a Slate 13% wash |
| Eligibility worksheet | Live |
| Phoebe, Eligibility and Feasibility | Live on Opus 5, capped at 20 messages a day |
| Bridget, the map's agent | Named in the map's dock, colour settled; **her chat is not built** |
| Agent handoff primer | Live — Phoebe inherits it; abstention ladder rung 2 is live |
| Shared chat layer | Live, built through Level 2 |
| Project points | Not started — blocked on registry data (item D2) |

## The design system as it now stands

**The brand book is the authority, and it is version 4 from 30 Aug 2026.** It lives at
`brand/BRAND.md`, is gitignored, and does not publish.
[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is **superseded** by it, says so at its
own head, and stays published as history.

- **One light brand.** No dark theme, no theme class. One set of tokens in `src/styles/tokens.css`.
- **Two grounds.** `--paper` `#F6F5FA` is the **content** canvas — map and worksheet. `--frame`
  `#FBFBFE` is the **frame** — top bar, rail, and both docks' ground.
- **Three planes and no fourth.** Canvas, card, floating. The derived `--chrome` plane is retired.
- **Neutrals are `--ink`, `--ink-2`, `--ink-3`, `--ink-4`.** `--ink-3` is the readability floor.
- **Shadows only on what floats** — the legend, the credit strip, the basin tooltip. Nothing else.
- **Host panels carry their agent's accent** at 5% fill and 25% border: Phoebe's dock in Anemone
  `#A04E7E`, Bridget's dock and the map legend in Surf `#14C8D9`.
- **The stress ramp is unchanged** and is gated by `scripts/check-palette.mjs`.

**Do not give Arid or No Data a warm fill.** It was tried, it passed the gate, and it was refused on
the merits: the warm bronze made Arid read as a value, and those two categories must read as no
reading at all. The note lives in `src/lib/stressPalette.ts` where the next hand would reach.

## Waiting on the maintainer

**Version 4 of the brand book arrived by her hand on 30 Aug 2026**, and it is in the repository at
`brand/BRAND.md`. It carries every ruling this site owed it.

**The design-exploration screenshots are not coming**, and no folder waits for them — maintainer's
ruling, 30 Aug 2026. The exploration's outcome is recorded in full in item S9 and the wash it led to
is shipped, so there is nothing left for images to teach.

**The four rulings owed to the master book are all in version 4** — the two grounds and the active
navigation item in §2.3, the three shadow values in §4, and the Slate wash in §7. **Phoebe's roster
gap is closed too**, by the roster-extension rule in §6. Item S9 records where each one sits.

**Two fresh raises replaced them, both in item S9.** The book's `--shadow-md` and `--shadow-lg` do
not match this site's token file, though §4 says they do — **ruled 30 Aug 2026, the book wins**, and
the swap is its own step. And coral set as text measures **3.52:1** where §9 asks 4.5:1; a darkened
value is proposed and carried up by hand, never invented here.

**Also outstanding:** Calvin's roster entry, colour and primer entry when his lane opens; grading the
two card drafts, which stay uncommitted until then; and whether the export copies should be a script
(item O8).

**Four things wait on real visitors, not on anyone**, and come due together: the number twenty
(item O1), the basemap's five-million-request ceiling (item O9), the primer review against the
abstention log (item A5), and whether an abstention that cited a card is a fault (item A7).

## Phoebe — settings that are stated rather than inherited

- **Claude Opus 5**, thinking adaptively at **medium** effort, budget **16,000** output tokens,
  **call timeout 120 seconds**. All four are written in `api/phoebe.ts` with the measurements that
  chose them. **A default nobody wrote down is a decision nobody made.**
- **A reply shorter than 40 characters is refused**, not delivered. The floor is in `api/_reply.ts`.
- **One retry, only for a 400 arriving after five seconds.** A retry cannot cost a visitor two of
  their twenty, and `check-cap` proves it.
- **She never writes a citation.** She returns a card number and places a marker; the browser
  renders the citation from the committed file.
- **Her colour is Anemone `#A04E7E`.** She is not on the book's roster; that gap is closed at the
  master book by the maintainer's hand.

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

**After editing any card or the agent primer, run `node scripts/build-prompt-modules.mjs`.**

## Running it locally

```powershell
$env:ANTHROPIC_API_KEY = [Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY','User')
npm run dev
```

**Phoebe's key must be in the environment before the server starts.** An env file does not work: Vite
puts env files into the browser's `import.meta.env`, and the relay is Node code reading `process.env`.

**The basemap key is the opposite case** and lives in `.env.local` as `VITE_CARTO_KEY`, baked into
the bundle at build time. Without it the map works and every tile is watermarked.

**`PHOEBE_DIAGNOSE=1` turns on failure diagnosis logging.** Off by default. It never logs a visitor's
question, only its length. It is named in the code as debt to remove.

> **Two people cannot work in this folder at once.** While the maintainer is checking in the browser,
> the engineer touches nothing.
>
> **And only one dev server at a time.** A second cannot take the port, exits, and requests silently
> go to the first. **Start it as `npx vite`, not `npm run dev`** — the npm wrapper died on 29 Aug and
> left an orphaned server that was still serving but whose output could not be read.

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
- **`getBoundsZoom` clamps to the current `minZoom`.** It is cleared before measuring. Do not
  "simplify" that away.
- **HydroBASINS excludes Antarctica.** Southern data limit −55.883; the view extends to −68 by design.
- **The arid and no-data basin fills are near-neutral *and* low-opacity on purpose**, so the basemap
  shows through and they read as unfilled rather than as a value — 20.93% of basins. **Do not
  brighten them and do not warm them.**
- **The basemap wash sits under those two categories**, so it tints what shows through them. That is
  intended, and it is the first thing to check if they ever start reading as a value.
- **The basemap needs a key and has a five-million-request monthly ceiling.** Item O9.
- **The output budget is 16,000 and the ceiling is genuinely reached**, about once in seventy-five.
  **Raising it buys a longer runaway**, not more room.
- **Phoebe gets a marked region of the primer, not the whole file.** Embedding the whole document
  destabilised ordinary answers.
- **The working folder carries Windows line endings; git stores Unix.** Nothing is broken. Item O10.

## The documents, and which one owns what

**Six opening documents**, read in order at the start of every session — the ritual is owned by
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md).

| File | Owns | Published |
|---|---|---|
| [CLAUDE.md](./CLAUDE.md) | Engineering rules, rule zero, the language rules | Yes |
| [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) | How work is run; both rituals; visible corrections; bundling; record-once; thin reads | Yes |
| [DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) | **Superseded by the brand book. Kept as history** | Yes |
| [AGENT_RULES.md](./AGENT_RULES.md) | How an agent behaves and speaks, the abstention ladder | Yes |
| [CITATIONS.md](./CITATIONS.md) | What a citation is and how it renders | Yes |
| [BUILD_PLAN.md](./BUILD_PLAN.md) | What is being built now and next | Yes |
| [OPEN_ITEMS.md](./OPEN_ITEMS.md) | Every open item, in five families, and the north star | Yes |
| **This file** | Where things stand **now** | Yes |
| [BUILD_LOG.md](./BUILD_LOG.md) | **How they came to stand there. NOT read at the opening** | Yes |

**The brand book (`brand/BRAND.md`) and UI_REFERENCE.md are gitignored and never publish.**
**`agent-primer.md` is lowercase on purpose** — committed content an agent inherits, not a rulebook.

## What to do first

**Run Part 1 of the opening ritual**, in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md): read the six documents, confirm `main`
equals `origin` with the identifiers compared, report where things stand and **what changed
underneath us**, kill stray dev servers, and **check for code reading an unpushed migration**.
**No building in Part 1.**

**Version 4 of the brand book has landed** and what ships has been read against it. Two things
disagree with it and both are open in item S9.

**Then Part 2 — propose the session's plan.** Nothing is scheduled and no family is due, so the plan
follows from what the version 4 book changes.

## Working agreements that are easy to lose

- **No mock or fabricated data, ever.**
- **Propose, approve, build, eyeball, commit word.** An approved plan is a batch approval; it
  loosens nothing else.
- **Pull requests bundle by the maintainer's checkpoints, not by step.** Invisible groundwork rides
  with the visible step it serves; steps inside a bundle stay separate commits.
- **Record once, point everywhere else.** An incident is told in full in the item that owns it.
- **Visible corrections over rewritten history.** A false line is struck and corrected in place.
- **Every pull request opens with a "For Amy" block.** Without it, it is not ready for review.
- **A gate that passes is not a verdict.** `check-palette` passed a fill the maintainer refused on
  sight. The gate measures separation; it cannot measure what a colour reads as.
- **Look at the thing itself.** Twice this week a change was reported as landed when the browser was
  showing something else. Ask the running server what it is serving.
- **A default nobody wrote down is a decision nobody made.**
- **Scope is a rule, not a list.**
