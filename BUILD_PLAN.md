# BUILD_PLAN.md — the one plan file

What is being built, in what order, and every open item. **This file commits to an order, not to dates.**
**It is the only plan file from 3 Oct 2026**, the maintainer's ruling: OPEN_ITEMS.md was folded in here and
retired. Read it with [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work
moves from a proposal to a commit.

**Five parts, in this order:** the v1 fence; the per-seat v1 order; the Road to v1; the sprints, one per family that
has work on a v1 step; and the families whose work is all after v1, ending in the After v1 list.

**Size limit: 400 lines.** The maintainer's ruling of 3 Oct 2026. An item is six lines at most; a longer
write-up goes to BUILD_LOG.md and the item points at it. A full close-out that finds this file past 400 lines
says so in its report (step 10 of the full close-out ritual). A light close that finds it still past
400 after trimming says a full close is needed.

**How it is kept.** Rewritten when the plan changes and refreshed at every full close-out. A closed item leaves
at the full close-out for [BUILD_LOG.md](./BUILD_LOG.md), with nothing left behind (step 9). Every item belongs
to a family; starting a family is her decision.

**Where the detail is.** Each item's full write-up, as it stood on 3 Oct 2026, is in BUILD_LOG.md, in the
entry "one plan file", Part A, under the item's number. Finished work is in BUILD_LOG.md too: search for
the item's number. Items closed before 3 Oct 2026 are in
[docs/OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md).

**Tags on an item.** Its v1 step or "After v1", then its bucket, her five of 18 Sep 2026: BONES (agent
structure, packs, debt that trips agents or engineers), WALKTHROUGH (a simple VWBA path into the paid
site), PARTNER (the Commons or a partner demo), PARK (real, not now), and "v1" for an item moved onto the
v1 order. **Shell A is the paid site; Shell B is this repository.** A carry to Shell A is her hand, never
an action here (rule zero).

---

## The v1 fence — the one finish line (the maintainer's word, 30 Oct 2026)

**V1 is done when both parts hold.** Her wording of 7 Oct 2026 is in docs/archive/CORRECTIONS.md.

1. **Reliable.** The carbon calculators reproduce one real household water treatment (HWT) filing (Mali) and one
   real community water supply (CWS) filing (Tanzania). The VWBA D-3 module reproduces the VWBA 2.0 guidebook's
   worked example. No figure from either filing comes into this repository; the guidebook's example may, cited.
2. **Whole journey.** A visitor runs a screening (Wellington → Phoebe → Bridget → Calvin → report or sign up). We
   count the questions on each walk and report the average. The project saves to the paid site. Same inputs give
   the same numbers on both sites. Where the paid site uses more precise data, the difference can be explained,
   or the report shows what changed. **Benchmarks and pass rates are v2.**

**Also in v1:**
- **Transition screening.** If Wellington hears the project is already registered for carbon, the
  screening also shows its transitional volume, still maps it, quantifies it, checks VWBA, and offers
  the report and the move to the paid site.
- **VWBA covers water supply project types only.**
- **Defaults rule.** See CLAUDE.md, Scope.
- **Build rule.** Each module (screening, transition, VWBA, report) has its own inputs, outputs and
  card. Each module standing alone in the Agent Commons is v2.

**New items go to v1 only if they block the finish line.** Anything else goes to After v1.

---

## Direction — the north star and the compatibility goal

| Step | Surface | Tier | State |
|---|---|---|---|
| 1 | **Eligibility** — can this project generate a countable benefit? | Free | Worksheet built; Phoebe live, on both pathways from 26 Sep 2026 |
| 2 | **Basin map / Partners** — where is the water stress, and who else is working there? | Free | Map built; the partner layer is item D1 |
| 3 | **Ex-ante quantification** — what benefit would this project produce? | Free | Built 1 Sep 2026, three screening packs; Calvin's chat is item A21 |
| 4 | **Project management** — running the project after it starts | Paid | Not in this repository |

**The desk sits in front of all four**: Wellington's, where the visit's next steps collect and the save
door stands. **The free tier ends where step 4 begins**, and the theme turns from Frost to Deep Marine
there. Nothing of the paid platform is built, described or linked from here.

**Shell B is heading toward compatibility with the production console.** Someone who steps up to the paid
platform should find the step seamless: the same behaviours and shapes, in a different colour, with more
tabs. It is not a one-way copy; which parts settle where is decided in a design session with the
production side, never by an engineer here. **The brand book, version 4.2, is the design authority**; it
lives at `brand/BRAND.md`, gitignored. Two rules stand:

1. **Build to this repository's own rules.** CLAUDE.md, AGENT_RULES.md, CITATIONS.md and the brand book
   bind. The compatibility goal is a direction, not a specification, and overrides none of them.
2. **Never copy from, fetch from, or match the production site unaided.** Not its files, shapes or wording,
   and not by inference from memory. Rules travel as rules, by the maintainer's hand.

---

## The v1 order — per-seat conditions under the fence (ruled 23 Sep 2026)

The finish line is the fence above and nothing else. These are the conditions each seat meets on
the way to it.

- **Wellington** asks type, stage, place, name; sends to Phoebe, then Calvin; reads back what
  Phoebe found. Done when one real walk goes end to end with no wrong turn.
- **Phoebe** runs both packs: five row states, readiness per pathway, the tools line, the human
  door once. Done at an 80% pass.
- **Calvin** talks; picks the pack from the record; asks only for what is missing; his carbon
  number comes from the same engine as the paid site. Done when his screening numbers match the paid
  site's calculators run on the saved project's inputs (the v1 fence; the maintainer's ruling, 10 Oct
  2026). Reproducing real filings is the paid site's check, not Calvin's.
- **Bridget**: map and pin as today. She introduces herself, says what the map shows, hands back.
- **Commons**: Phoebe and Calvin work there too, no memory; Bridget introduces herself. Two Calvin
  cards on one engine: screening, transition.
- **The screening report exports free.**
- **Card sets are sealed at their versions on 23 Sep 2026.** No new cards until a real project fails
  on one.
- **Every card set shows as cards in its agent's Knowledge tab.** An unreviewed card says Draft.
  The Evals section says "no exams run yet" until the harness runs.
- **Runs**: one short run after a prompt change. No new exam questions.
- **Parked until after v1**: Water Wide Web, the Reggie, Monty and Audrey packs, D-4, D-6, the
  cleanup sweep, harness grades, fees, the two draft water card sets.

---

## Road to v1 — this repository's work, in order (30 Oct 2026)

Only the work here that the finish line needs, in the engineer's order, for her to move. Nothing on it is built
yet. It rests on #156, the proposal to install Calvin from the open core, merged with her word on its open points.
The old step numbers (1 to 8) stay on items as names; old steps 1 to 3 are done, 24–26 Sep 2026, in the log.

| # | Step, in one line | Depends on | Done when |
|---|---|---|---|
| 1 | **The water module reproduces the VWBA 2.0 guidebook's worked example**, as a cited case in `check-vwba-d3`. | Her hand: the example's inputs, figure and page, never the guidebook itself (CITATIONS.md). | The check reproduces the example's figure; she has passed the case and its citation. |
| 2 | **React 19 under the map**, so the open core's calculator screens can run here (#156, §9). | Nothing outside this repository. | Before-and-after map pictures she has passed; every check and the build pass. |
| 3 | **Calvin's carbon calculator from the open core** on his Tool tab, simple view and sliders on (A21). | The open core (Session C): the release file and the eight changes in #156 §1, plus sliders and the simple view. The version pinned is the one shown reproducing Mali and Tanzania, on the paid side. | Proofs P1 to P5 of #156 pass; she has passed the before-and-after table and the tab in the browser. |
| 4 | **Wellington asks the core facts first**: type and class, country, how many served, people or households, and whether it is already registered for carbon (the transition). | Her rewrite of his instructions, freeing at least 249 characters plus the new question's; the gate stays at 26,199. Step 3. | The record holds the new fields; one measured run; his prompt under the gate. |
| 5 | **Calvin's chat**, on the open core's prompt, asking only what is missing (A21). | The core's `prompt.md` read against AGENT_RULES.md (#156, open point C). Steps 3 and 4. | One measured run; on a walk he opens with his facts filled and asks at most household size and, for a transition, the filed V1.0 fraction of non-renewable biomass (fNRB). |
| 6 | **The water figure matches the paid site's VWBA calculator**: from the open core once it holds the water method, or this site's D-3 shown equal. | The open core's water step (its M8), or the paid site's figures on made-up cases, by her hand. Step 1. | Same numbers on made-up cases, or each difference explained, in a table she has passed. |
| 7 | **Bridget's hello** (A22, old step 6): who she is, what the map shows, then back. | Nothing outside this repository. | A walk passes through her and back with no wrong turn; her eyeball. |
| 8 | **The screening report, free** (S21, old step 8): printed or saved, every figure cited. | Steps 3, 5 and 6. Whether it uses the core's print report is its own proposal. | She prints one from a walk; every figure matches the screen and carries its citation. |
| 9 | **The save carries every input the figures rest on**, never a computed number (old step 7). | Steps 3 to 6. The paid site's receiver reads them: her carry (O14), its item #243. | A test visit saved here opens on the paid site with every input filled. |
| 10 | **The v1 walks**: whole screenings, counted and compared. | Everything above; the paid site runs the same open core version. | Questions counted on each walk and the average reported; the paid site's carbon and VWBA figures on each saved project equal the screening's, or each difference is explained or shown in a report; written in BUILD_LOG; she has watched one. |

**After v1, not needed for the finish line:** deleting `carried/` (ruled, #156 step 3); the Commons check (S23,
old step 4); A14; benchmarks and pass rates, Phoebe's 80% among them (v2); the fresh public repository; the After v1 list.

- **The engine bundle is at `carried/`**: gs4gg-carbon v0.16.1, the paid site's `calculator-seal-2026-10-03`,
  34 files, 34 of 34 hashes verified, crossed 3 Oct 2026 (#147). Tagged `engine-carry-2026-10-04`; the first bundle
  was tagged `engine-carry-2026-09-27` (#132). Nothing edits it here, and nothing in the site reads it yet.
- **Wellington's prompt is 26,034 characters against a gate of 26,199.** The gate moves only on her word.
- **Standing rules across every step:** a proposal before each; at least one eyeball stop per pull
  request; a measured run after any prompt change; the build-update fact refreshed at every full close-out.

---

## Sprints — one per family, in order

A sprint is a family with work on a v1 step. Each holds all of its family's open items: the v1 items
first, in step order, then that family's after-v1 items. The order is the engineer's reading of the v1
order above, for her to move.

### Sprint 1 — Agents: Calvin (step 5), then Bridget (step 6)

How agents behave, what they may say, how they hand off. Governed by AGENT_RULES.md.

**A21 · Calvin's brief — his chat, the carried engine, carbon beside water.** Step 5 · BONES. Proposed
27 Sep 2026 as `PROPOSAL_calvin-brief.md`, untracked at the root; nothing is built. R2 to R11 ruled yes on
1 Oct 2026, her notes in its §13. **R1 is closed**: the v0.16.1 bundle crossed 3 Oct 2026, scrubbed of the
filing's figures (O16). Done when his screening numbers match the paid site's calculators run on the saved
project's inputs (the v1 fence; the maintainer's ruling, 10 Oct 2026). Baseline marker: `--tide-text`
(chosen 9 Oct 2026; teal dropped).

**A14 · Screen host role words — one home.** Step 6, before or with A22 · BONES. `BridgetScreen.tsx` says
`role: 'Map'` where her crew card says "Partners"; `PhoebeScreen.tsx` carries its own too. The chat header
draws them and `check-roster` does not read them. Her ruling is owed: the field goes and the header reads
the crew file, or the check reads the records. Not fixed, by her word of 18 Sep 2026.

**A22 · Bridget's hello.** Step 6 · BONES. From the v1 done line: the map and the pin as today; she
introduces herself, says what the map shows, and hands back. It is not her chat (A12). No proposal yet.

**A5 · Primer review against the abstention log.** After v1 · PARK. The primer was written from the rules,
not from real questions, because there were none. Once there is real traffic, read the log against it:
gaps that are another agent's subject, and anything no agent covers. Waits on usage, with O1, O9, A20.

**A10 · Wellington's answers run long.** After v1 · BONES. The target is two or three plain sentences; his
replies ran four or five. Done is a measured pass on the length rule, counts and not impressions, and a
check that reads sentence counts off a walk. On her word.

**A12 · Bridget's chat.** After v1 · PARK. Not built; her Chat tab carries one plain line and no composer.
It would run on Phoebe's pattern: an endpoint and a daily cap of her own, the same guards, read against
the specialist contract's ten lines. Calvin's chat left this row for A21.

**A20 · Phoebe's runaway call is cut off, not prevented.** After v1 · PARK. One request in seventy-five
spent all 16,000 output tokens; `CALL_TIMEOUT_MS`, 120 seconds, ends it. Done is a real count once there
is traffic, then a smaller budget with a measured reason or a line saying the timeout is enough.

### Sprint 2 — Surfaces: the Commons check (step 4), then the report export (step 8)

What a visitor sees and works with. Her browser review is the gate.

**S23 · The Commons check.** Step 4 · PARTNER. From the v1 done line: Phoebe and Calvin work on the
Commons too, with no memory; Bridget introduces herself; Calvin has two cards on one engine, screening
and transition. His part waits on A21. No proposal yet.

**S21 · The screening report exports free.** Step 8 · v1. Her word of 23 Sep 2026: every tool, with or
without answers, exportable as an easy-to-read, properly cited document. The screening report is the first
export, in the phase-tags shape. It needs Calvin's figures. Proposal first, from a captured reference.

**S11 · The free desk — two typeable controls owed.** After v1 · WALKTHROUGH. "What it does" and the
project type are heard in chat only; a visitor who never chats cannot fill them. Everything else is built.

**S18 · Agent Commons — slices 4 and 5.** After v1 · PARTNER. v0, slices 1 to 3, is built (#68 to #70).
Slice 4, Credentials fed by the grader's rig, waits on his per-case file and the three rig changes she takes to
him; it reads "not yet graded" until a real card exists. Slice 5, the flag button, is later. One grader,
real only, and an agent opens alone: canon in CLAUDE.md. **28 Oct 2026:** the site moves to open.waterbots.ai,
every page takes the main site's menu, and the Commons is rewritten as a list of modules, her words. The
same day, a second word: the page is centred under the menu and the sign-up bar is gone; the carbon packs
read "In development · partner review", the health guide is Heather's and "Proposed", Phoebe's reads "Beta"; and four modules
seeking a build partner and a domain consultant are listed below, with the button that asks a partner in. A
third word the same day: one list, the foot text gone, the button at the header's right, plain-text cells, a
display-only community rating, "Coming soon" for Calvin and Bridget, Heather "Proposal pending", "Work
with us" emails for the seeking rows, the module page centred with "About this module", and an address per
module that opens, /commons/phoebe first. A fourth word the same day: status becomes six stages, from seeking
partners to graduated, each a name and a bar in one Tide shade, pale to solid, with an (i) legend; "Beta" is
a tag on Phoebe, open to try, not a stage; the count line goes; a new opening, grading note and carbon
method links in her words; Phoebe's Tool tab reads "Eligibility quiz" on the Commons; and the menu marks the
page you are on. Her leaning Wellington, from the concept note, sits faded right of the opening, hidden below
1240px.

**S24 · The site on a phone.** After v1 · WALKTHROUGH. Her word of 29 Oct 2026, from that day's mobile check:
every finding fixed in one pull request. At 900px and below the screening fills the screen, the rail and the crew
slide over it, the step's name sits under the rings; the Commons and a module's tabs scroll with the page; the
menu takes the live page's three rows. Desktop unchanged. Waits on her check on a real phone; a 44px tap area
for the main site's menu is hers to carry.

**S19 · The Workshop — make your own agent on the Commons.** After v1 · PARTNER. Not built; the proposal
is next on her word. Her cost model, review before publishing and the two-shape save are in the write-up.
Waits on the rig's pack-file shape, by her hand.

**S20 · "Connect with a human expert" on every Commons agent.** After v1 · PARTNER. Not built. Two design
questions are hers: the form's fields, and whether a builder's contact is public or relayed. Where the
form goes is a fact she carries.

**S6 · The dev relay resolves imports differently from production.** After v1 · BONES. Three outages on
24 Aug 2026, three guards since (the api type-check mode, named HTTP exports, `check-api-exports`). The gap
stays: anything development tolerates that Node would not. Closing it means exercising the relay as
Vercel does before a push, or a named guard per known difference. Never a second copy of the handler.

**S12 · The hero chat — a full page that is the conversation.** After v1 · PARK. Parked 9 Sep 2026. Waits
on a demo reference brought in by her hand: the `Design refs/` folder was deleted on her word on 3 Oct
2026, so the hero-chat reference must be brought in again if S12 is picked up. The landing never changes
without her word; a landing built on 3 Sep was rejected whole.

**S14 · Typing dots — the book's third motion exception.** After v1 · PARK. Ruled 3 Sep 2026: three dots
fading by opacity, stopped under reduced motion. Waits on her hand into brand book §5. No build until S12.

**S15 · One row — a candidate shape for Shell A.** After v1 · PARK. Built here 7 Sep 2026: the journey bar
is the navigation. Offered to production by her hand, when she chooses.

**S17 · The agent watches its Tool tab and comments; a teal dot on Chat.** After v1 · PARK. Parked for a
design session, both shells. Four questions are open, in her words, in the write-up. No proposal yet.

**S1 · Collective action as a partner-finding surface.** After v1 · PARK. Regional collective action
groups: which exist, where, how to reach them. The companion to D1. Not started.

**S5 · Narrow-column wraps.** After v1 · PARK. The citation line wraps badly in the narrow dock; cosmetic.
One piece of work with O4's legend strip and the rail-width rider.

**S22 · The Blocked row colour.** After v1 · PARK. Blocked rows reuse `--state-pending` until her pixels;
the brand book's §2.5 has no stopped state that is not an error. A raise for the book, from an image.

### Sprint 3 — Operations: the carry to the paid site (step 7)

The deploy, the repository, settings and limits. Step 7 is the carry, by her hand.

**O14 · Carries owed by her hand — listed once.** Step 7 · PARK. **To Shell A:** the seal's contract
(`type`, `gsClass`, `stage`, rows and a read per pathway, `wantsHuman`, `record.served`; `kind` retires
when its receiver reads them, and that receiver is not fixed, Shell A item #243); `project-types.md`; the
ten-line contract; Q11; the paid-site tools line; the transition module; the one-row shape; the agent
screen's file list; open.waterbots.ai for the landing box, the claim and the menu (28 Oct 2026). **To the brand book:** typing dots §5, the agent screen §7. **To this site:** the
sign-up address, the confirmed roster columns. **To the grader:**
three rig changes.

**O1 · Revisit the daily cap against real usage.** After v1 · PARK. Thirty a day per visitor is live
(`DAILY_CAP` in `api/_cap.ts`); it is a starting point, not a figure from usage. Looked at with A5, O9
and A20 when there is traffic. The cap has no setting outside the code; raising or clearing it is her call.

**O4 · Cosmetic and housekeeping.** After v1 · PARK. The collapsed legend strip wraps at narrow widths;
`hydrobasins_lev06.json` is tracked at 8.44 MB, not generated at deploy; data files ship with unhashed names.

**O9 · The basemap needs a key and has a ceiling.** After v1 · PARK. CARTO Voyager, `VITE_CARTO_KEY` read
at build time, five million tile requests a month, attribution kept visible; `check-basemap-key` guards
the bundle. Nothing is due until there is usage. Route C, a custom vector basemap, is not proposed.

**O12 · The map page is heavy.** After v1 · WALKTHROUGH. A pin at world view redraws 1,342 basins and
stalls the page. Look at whether the pin redraws every polygon, and whether the hidden map keeps drawing.

**O13 · Banned words in old code.** After v1 · BONES. `validate()` in `api/_wellingtonAnswer.ts` and its
callers, and "console" in Bridget's and Calvin's dock copy. One hygiene pass; no behaviour changes.

**O15 · Four storage keys show "Needs Attention" in Vercel.** After v1 · PARK. `KV_URL`, `REDIS_URL`,
`KV_REST_API_TOKEN` and `KV_REST_API_READ_ONLY_TOKEN`. Not looked at; first read the platform's message
for each. Check later, on her word.

**O16 · Real-project figures in the carried bundle, public since #132.** Step 5 · BONES. The sweep of 3 Oct 2026
found the India filing's figures in `presets.ts`, `emissions-legacy.ts` and `MANIFEST.md`. #244 is the paid site's
item for real numbers left in this repository's public history. Her ruling of 3 Oct 2026: the "Test Project" and
"Malawi" figures were play numbers, retired by the paid site. The v0.16.1 bundle crossed 3 Oct 2026 without them.
Open: the figures stay in `main`'s history before it. List: BUILD_LOG.

---

## After v1 — the families with no work on a v1 step

The same shape. Nothing here is started before v1 is done, except on her word.

### Knowledge

What the agents may know. Governed by CITATIONS.md. The card sets are sealed for v1.

**K1 · VWBA full-docs card pass.** BONES. Read the manual end to end and propose which further card sets
are warranted. Not started. Two untracked drafts at the root, `activity-cards-vwba-DRAFT.md` and
`definitions-cards-vwba-DRAFT.md`, are parked until after v1, on her word.

**K2 · Co-benefit quantification module.** PARK. One card per method, so a co-benefit that can be
quantified is, and one that cannot stays words. Not started.

**K3 · VWB report corpus.** PARK. About ten public volumetric water benefit reports, parsed for their
common must-haves. One is held, by her hand. No action yet.

**K9 · Calvin's and Bridget's packs move to the new pack shape.** BONES. One brief each, the way
Phoebe's did: `git mv`, every reader follows, the move proved byte for byte. Calvin's comes after A21,
which leaves his pack where it is.

**K10 · Phoebe ready for the grader's rig.** BONES. Her cards are reviewed by the maintainer and the engineer
notes are split out (#94). Left: exam questions drafted for her signature, then exported in the rig's
case shape, which arrives by her hand. Her done line of an 80% pass is the rig's to say.

**K12 · Three carbon route cards no card carries.** PARK. The pump-drive change that cards T1 and M2
name, and M14's justified sub-national area. The card sets are sealed until a real project fails on one.

**K13 · A reading-grade figure for route cards.** PARK. `check-cards` prints a grade for every route
card and plain-words line against a grade-6 target; printed, never enforced. Not built.

### Data

Where real, verifiable data comes from. An empty, honest state beats a fabricated one.

**D1 · Corporate water goals and target geographies.** PARK. Public disclosures mapped to basins, so
Bridget can answer who funds water work here. Every point traceable to its disclosure; no inferred
coordinates. Not started.

**D2 · Project points.** PARK. Blocked on registry-verified data from the maintainer: the registry and a
link, the project's id and name as stated there, coordinates as published. A dot at a plausible-looking
spot is never an option.

### Cleanup

Debt in the documents themselves.

**C1 · Sweep every struck line into the archive.** BONES. Her ruling of 23 Sep 2026: no crossed-out text
in any live document. Strikes from before it wait in CLAUDE.md, PROCESS_RULES, AGENT_RULES, CITATIONS, the
READMEs and the card files. One document a commit; the rulebooks and card files each their own pull
request. Proposal first, with a count of strikes per document.

### Safety pass

Known weaknesses in tools this machine runs, not in what visitors get. Not v1.

**SP1 · A separate GitHub account for sessions.** BONES. A second account that can open pull requests but
cannot merge, enforced by branch protection (only Amy's account may merge). First on this list: the deny
rules in session settings are a fence a session could edit away, branch protection is not. Needs her to
create the account and set the rule; a proposal comes first.

**SP2 · The eight `npm audit` findings.** PARK. All are in build-time tools, none in the live site's own
dependencies: seven come through `mapshaper` (`adm-zip`, `@xmldom/xmldom`, `fflate`, `file-type`, `image-size`
and two that depend on them), one through Vite (`source-map-js`); `geographiclib`, deprecated, is mapshaper's too.
Plan: `npm audit fix` without force on a throwaway branch; all checks and the build; rebuild the basins,
byte-identical; upgrade `mapshaper` if a release drops `geographiclib`. Lane 3; proposal first; the paused
install scripts for `better-sqlite3` and `esbuild` stay paused.

**SP3 · Switch lane 1 auto-merge on.** PARK. The job is built and off (`LANE1_AUTOMERGE` unset in the
repository's variables, and guarded on the number gate having patterns). Switch it on only once the
keyed-fingerprint number gate ships, in the open core work; then flip Allow auto-merge and branch protection by hand.

**SP4 · Pin every GitHub Action by full commit hash instead of tag.** BONES. `actions/checkout`, `actions/setup-node`,
`gitleaks/gitleaks-action` and any others in `.github/workflows/`, per the second reader's re-attack on #152. A tag can be moved to
different code; a full commit hash cannot. Lane 3 (it edits CI); proposal first.

**SP5 · Check linting, formatting and strict typing; switch on what is missing.** After v1 · BONES. Find out which
of the three the repository already runs, and turn on the ones it does not. Proposal first, with what is on and
what is off.

**SP6 · A human engineer reviews the structure.** Now, not blocking v1 · BONES. One question put to a person:
what would you keep, what would you fix first, what would you worry about. It covers all three repositories. The
review itself is her hand's work, outside this repository (rule zero); only its findings come back here, as items.

---

## After v1

Nothing here is started before v1 is done, except on her word. First in the list is the next thing
to pick up.

**V2-1 · Watershed map — click a watershed, see its water facts.** After v1. A visitor clicks a basin
and reads its water facts. Every fact traceable to its source; no invented values. No proposal yet.

**V2-2 · WHO cooking-fuel data by fuel type — WHO shares this database on request under a data-sharing
agreement (see [link](https://www.who.int/data/gho/data/themes/air-pollution/who-household-energy-db)).
Request it via householdenergy@who.int; use it only if the agreement allows use in this tool.** If so,
replace the screening's conservative fuel-mix floor with WHO's by-fuel-type mix. After v1. No proposal
yet.
