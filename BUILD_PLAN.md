# BUILD_PLAN.md — the one plan file

What is being built, in what order, and every open item. **This file commits to an order, not to dates.**
**It is the only plan file from 3 Oct 2026**, the maintainer's ruling: OPEN_ITEMS.md was folded in here and
retired. Read it with [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work
moves from a proposal to a commit.

**Three parts, in this order:** the v1 order; the sprints, one per family that has work on a v1 step; and
the families whose work is all after v1.

**Size limit: 400 lines.** The maintainer's ruling of 3 Oct 2026. An item is six lines at most; a longer
write-up goes to BUILD_LOG.md and the item points at it. A close-out that finds this file past 400 lines
says so in its report (step 10 of the close-out ritual).

**How it is kept.** Rewritten when the plan changes and refreshed at every close-out. A closed item leaves
at the close-out for [BUILD_LOG.md](./BUILD_LOG.md), with nothing left behind (step 9). Every item belongs
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

## The v1 order — the done line (the maintainer, 23 Sep 2026)

The free site is v1 when a stranger with a real project can, in thirty messages, learn: the
project type and stage; which pathway it likely fits (water, carbon, both, neither); a screening
number for each fit; its basin; and save it.

- **Wellington** asks type, stage, place, name; sends to Phoebe, then Calvin; reads back what
  Phoebe found. Done when one real walk goes end to end with no wrong turn.
- **Phoebe** runs both packs: five row states, readiness per pathway, the tools line, the human
  door once. Done at an 80% pass.
- **Calvin** talks; picks the pack from the record; asks only for what is missing; his carbon
  number comes from the same engine as the paid site. Done when the Malawi test project gives the
  same number on both sites.
- **Bridget**: map and pin as today. She introduces herself, says what the map shows, hands back.
- **Commons**: Phoebe and Calvin work there too, no memory; Bridget introduces herself. Two Calvin
  cards on one engine: screening, transition.
- **The screening report exports free.**
- **Card sets are sealed at their versions on this date.** No new cards until a real project fails
  on one.
- **Every card set shows as cards in its agent's Knowledge tab.** An unreviewed card says Draft.
  The Evals section says "no exams run yet" until the harness runs.
- **Runs**: one short run after a prompt change. No new exam questions.
- **Parked until after v1**: Water Wide Web, the Reggie, Monty and Audrey packs, D-4, D-6, the
  cleanup sweep, harness grades, fees, the two draft water card sets.

**The build order, and where each step stands.** Steps keep their numbers; the rows are in working order.

| Step | What | State | Item |
|---|---|---|---|
| 1 | The Knowledge and Tool tab | Done 24 Sep 2026, #111 to #116 | in the log |
| 2 | Wellington: type and stage | Done 24 Sep 2026, #119; reads back what Phoebe found #128; people served #130 | in the log |
| 3 | Phoebe's carbon runtime | Done 26 Sep 2026, #121 to #126. Her 80% pass is not measured; that is the rig's to say | in the log |
| 5 | Calvin's brief, with the carried engine | **Next.** Waits on the engine re-sealed at v0.16.1 and ruling R1 | A21 |
| 4 | The Commons check | Not started | S23 |
| 6 | Bridget's hello | Not started | A22, A14 |
| 7 | The carry to the paid site, by her hand | Hers | O14 |
| 8 | The screening report export, free | Not started; needs Calvin's figures | S21 |

- **Step 5 moved ahead of the rest on her word of 24 Sep 2026**, once the engine was sealed and carried.
  Step 8 was added on 3 Oct 2026 and numbered last so no step renumbers; where it sits among 6, 7 and 8
  is hers to say.
- **The engine bundle is at `carried/`**, tagged `engine-carry-2026-09-27` (#132): the paid site's
  `calculator-seal-2026-09-26`, gs4gg-carbon v0.16.0, 32 of 32 hashes verified. Nothing edits it here.
- **Wellington's prompt is 26,043 characters against a gate of 26,199.** The gate moves only on her word.
- **Standing rules across every step:** a proposal before each; at least one eyeball stop per pull
  request; a measured run after any prompt change; the build-update fact refreshed at every close-out.

---

## Sprints — one per family, in order

A sprint is a family with work on a v1 step. Each holds all of its family's open items: the v1 items
first, in step order, then that family's after-v1 items. The order is the engineer's reading of the v1
order above, for her to move.

### Sprint 1 — Agents: Calvin (step 5), then Bridget (step 6)

How agents behave, what they may say, how they hand off. Governed by AGENT_RULES.md.

**A21 · Calvin's brief — his chat, the carried engine, carbon beside water.** Step 5 · BONES. Proposed
27 Sep 2026 as `PROPOSAL_calvin-brief.md`, untracked at the root; nothing is built. R2 to R11 ruled yes on
1 Oct 2026, her notes in its §13. **R1 is open**: it waits on the engine scrub and the re-seal at v0.16.1,
Shell A's and hers to carry. Done when the Malawi test project gives the same number on both sites. Owes
the teal baseline marker, a design value she carries from production.

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
Slice 4, Credentials fed by Deb's rig, waits on his per-case file and the three rig changes she takes to
him; it reads "not yet graded" until a real card exists. Slice 5, the flag button, is later. One grader,
real only, and an agent opens alone: canon in CLAUDE.md.

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
on a demo reference in `Design refs/` by her hand. The landing never changes without her word; a landing
built on 3 Sep was rejected whole.

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
screen's file list. **To the brand book:** typing dots §5, the agent screen §7. **To this site:** the
sign-up address, the confirmed roster columns, the engine re-sealed at v0.16.1. **To Deb:** three rig changes.

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

**K10 · Phoebe ready for Deb's rig.** BONES. Her cards are reviewed by the maintainer and the engineer
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
