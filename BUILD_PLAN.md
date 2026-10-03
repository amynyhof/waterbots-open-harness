# BUILD_PLAN.md — what is being built, and why

Which family of work is being built now, which comes next, and what each one is
waiting on. **This file commits to an order, not to dates.**

**It is the one plan file from 3 Oct 2026**, the maintainer's ruling: OPEN_ITEMS.md is folded in
here and retired, and every open item is under *Open items, by family* below. Read it with
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work
moves from a proposal to a commit.

**This file is rewritten whenever the plan changes**, and refreshed at every
session close, so it never describes a plan we have already left behind.

**Finished work's history is in [BUILD_LOG.md](./BUILD_LOG.md), not here.** The "Previously" sections
that stood in this file until 3 Oct 2026 are in that day's entry, Part B.

---

## North star — the console's journey

Recorded 21 Aug 2026 as the shape the console is being built toward; no dates are promised.

| Step | Surface | Tier | State |
|---|---|---|---|
| 1 | **Eligibility** — can this project generate a countable benefit? | Free | Worksheet built; Phoebe live from 24 Aug 2026, on both pathways from 26 Sep |
| 2 | **Basin map / Partners** — where is the water stress, and who else is working there? | Free | Map built; the partner layer is item D1 |
| 3 | **Ex-ante quantification** — what benefit would this project produce? | Free | Built 1 Sep 2026, three screening packs; Calvin's chat is item A21 |
| 4 | **Project management** — running the project after it starts | Paid | Not in this repository |

**The desk sits in front of all four**: Wellington's, where the visit's next steps collect and the save
door stands. **The free tier ends where step 4 begins**, and the theme turns from Frost to Deep Marine
there. This repository is the free tier; nothing of the paid platform is built, described or linked from
here, and rule zero holds.

---

## Compatibility goal

**This is the standing direction. It sits under the north star above and shapes how everything
below is built.**

**Shell B is heading toward compatibility with the production console.** Someone
who steps up to the paid platform should find the step seamless: the same
behaviours and the same shapes, in a different colour, with more tabs. What a
person learns on the free surfaces keeps working when they cross over.

**The final look is not settled, and this is not a one-way copy.** Some of what
this shell works out may flow back the other way. **Which parts settle where is
decided in a design session with the production side** — not in this repository,
and not by an engineer working in it.

**The brand book is the design authority, and it is version 4.2 from 31 Aug 2026.** ~~BRAND.md v3 is
the design authority — 28 Aug 2026.~~ ~~It is version 4.~~ Version 3 held for two days; version 4 and
then 4.1 both landed on 30 Aug. The book governs both properties and is complete on its own page.
It lives at `brand/BRAND.md`, gitignored, and does not publish. ~~The design canon is the outcome of the session this file was waiting on.~~ **The
canon is superseded by the book** and says so at its own head; it stays published as history, and
where the two disagree the book wins.

**The canon's rulings were not wrong.** The Frost light theme, the left rail with its "Collapse" row
and "<" glyph, and the chat dock's citation and formatting rules were all carried into the book and
live there now. Both of the things it asked for are done: the brightness pull-up shipped on 27 Aug
(item S8, now closed) and the rail-width rider rode on 29 Aug when the rail was next opened.

**Three rules held while we waited. Two of them are permanent and one has done its job.**

1. **Build to this repository's own rules.** [CLAUDE.md](./CLAUDE.md),
   [AGENT_RULES.md](./AGENT_RULES.md), [CITATIONS.md](./CITATIONS.md),
   ~~[DESIGN_CANON_for_ShellB.md](./docs/archive/DESIGN_CANON_for_ShellB.md) and~~ the brand book
   are what binds. The compatibility goal is a direction, not a specification, and it
   does not override any of them. **Still holds.** **Corrected 17 Sep 2026:** the
   canon is archived under [docs/archive/](./docs/archive/README.md); the book wins.
2. **Flag drift as an open item, in its family.** This one was for the design
   session, and the design session has happened. **It is retired as a standing
   rule**, and what it was collecting is now settled by the canon. Anything that
   still looks like drift is an ordinary open item.
3. **Never copy from, fetch from, or match the production site unaided.** Not its
   files, not its shapes, not its wording, and not by inference from memory. This
   is rule zero in CLAUDE.md and the wall in CITATIONS.md, applied to design.
   **A compatibility goal is not permission to go and look** — rules travel as
   rules, and they travel by the maintainer's hand. **Still holds**, and the canon
   restates it itself.

---

## V1 — the done line (the maintainer, 23 Sep 2026)

**Corrected 23 Sep 2026.** This replaces the section that stood here, "The next order — ruled
23 Sep 2026 at the close-out," a four-pull-request order from the same day's earlier close-out.
That order is not wrong so much as overtaken: this ruling, made later the same day, says what
"done" means for the whole free site rather than ordering the next four pull requests, and it
folds the earlier order's work into a seven-step build order below. The old section's whole text
is kept in [docs/archive/CORRECTIONS.md](./docs/archive/CORRECTIONS.md), dated, under the
no-strikes rule.

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

**Build order after the seal:** (1) the Knowledge and Tool tab; (2) Wellington type and stage;
(3) Phoebe's carbon runtime; (4) the Commons check; (5) Calvin's brief with the carried engine;
(6) Bridget's hello; (7) the carry to the paid site, by the maintainer's hand; (8) the screening
report export, free (item S21), added 3 Oct 2026 on her word. **Step 8 is numbered last so that no
step before it renumbers.** It needs Calvin's figures, so in time it follows step 5; where it sits
among steps 6, 7 and 8 is hers to say.

**Amended 24 Sep 2026, her word:** Calvin's brief (step 5) moves ahead of Phoebe's carbon runtime (step 3) once the paid site's engine is sealed and carried by her hand; Wellington (step 2) proceeds now.

**Step 5 carries one ruling of its own, 24 Sep 2026.** Every field a baseline survey could later
change carries **the teal marker**, on every method and every project type — the same colour and
the same meaning as the paid site's baseline marker. It is one mark with one meaning across both
properties, so a visitor who crosses over reads it without learning it twice. The marker is a
design value the maintainer carries from production by her hand, under rule zero; this file records
that it is owed, not what it looks like.

**Step 2, Wellington type and stage, is done 24 Sep 2026: #119, merged on her word** — item A16, in
[BUILD_LOG.md](./BUILD_LOG.md), is its home: the short-form list in his prompt, type and class and
stage confirmed then logged, "what kind" retired from the record, the rail and both prompts, the
seal's contract change on item O14, the gate to 26,199 by the measured amount. **The seal carries the
word `kind` again from 25 Sep 2026**, derived from the type, because production's receiver still
reads it; item O14 holds the carry, and the correction is in
[docs/archive/CORRECTIONS.md](./docs/archive/CORRECTIONS.md). The trim that made room for it is #118, the same day.
**Step 3, Phoebe's carbon runtime, is done, 26 Sep 2026.** Four pull requests, all merged on her
word: #121, the save-door patch (`kind` back on the seal); #122, the water pathway on its tool file,
five row states, the readiness read; #124, the carbon pathway beside it, staged by pathway state and
sorted by class and version; #126, the door to a person — her offer once on a Blocked row, a box and
a note at the save door, the tools line there, and on a ticked save an email to the WaterBots team.
`RESEND_API_KEY` is set in Production and Preview (26 Sep 2026) and waterbots.ai is verified in Resend,
recorded 3 Oct 2026 on her word. Items A18 and K7 are built; the proposal file is deleted. Her done line's 80% pass is not measured yet; that is the harness's to say.

**Next: Calvin's brief (step 5), item A21 — proposed 27 Sep 2026; her rulings of 1 Oct 2026: R2 to
R11 all yes, R1 still open.** `PROPOSAL_calvin-brief.md` sits at the root, untracked, and nothing of it
is built. R1 — whether the strings the manifest flagged in `presets.ts`, `emissions-legacy.ts` and
`quantity.ts` publish as they are — waits on the engine scrub and the re-seal at v0.16.1, which is
Shell A's and hers to carry. The brief does not move until the bundle arrives.

**The free-site fixes of 30 Sep 2026 are live — #134 to #138, each merged on her word — and the demo
ran on `main` at #138** (her word).
- **#134**, the wordmark starts over: a full load of the landing, so the record, the worksheet and
  every conversation clear and Wellington is at his greeting. The `waterbots.ai` link in the rail is
  untouched, and the server-side daily caps are not reset by it.
- **#136**, four fixes and two more. Every chat box grows to three lines, then scrolls. **No desk has a
  "Next phase" chip** — her ruling of 30 Sep 2026, replacing the 16 Sep rule on this site: next steps
  live in the right rail only. A rail row that sends the visitor somewhere clears once taken. Phoebe's
  desk opens on her own greeting: his routing message was a display-only copy on her thread, filtered
  out of every ask to her relay, in no seal, so dropping it touched only what is drawn (the visit's
  `eligibilityInvite` field stays, now written and not read). The Done-later section of her Tool tab
  is collapsed by default. **The bold closing question**: when her reply ends in a question, that last
  sentence is bold; display only, `emphasiseClosingQuestion` in `src/chat/evidence.ts`; the Commons
  shows the same Phoebe, so it is bold there too.
- **#137**, rows clear when taken, on every step: a pin takes the map invite, and his invite to
  Quantify lands next where a pathway read allows it (likely eligible or not enough known). **Only
  rows that send the visitor somewhere clear** — her ruling: the pinned basin's water-stress reading,
  Phoebe's readings and Calvin's figures are record facts and stay. One rule, `rowTaken` in
  `src/lib/visit.ts`.
- **#138**, the bold question sees past citation chips: a chip between the last word and the
  question mark no longer hides it, and the whole final sentence, chips included, is bold.
- **#135** logged item A19, below.

**Item A19, the nine characters, is found.** His prompt measured 26,117 on `main` against BUILD_PLAN's
26,108. The 26,108 was the 27 Sep figure; the 29 Sep close-out's build-update refresh added exactly nine
characters to the generated module (572 to 581), and BUILD_LOG's 29 Sep entry had already recorded
26,117. Nothing was wrong in the prompt; two live lines had kept the older figure, and are corrected.
After this close-out's refresh his prompt is **26,043** against the unchanged gate of 26,199, 156
characters of room.

**Not on the plan yet, said once:** the daily cap has no setting outside the code. It is a constant
in `api/_cap.ts`, a check fails the build if an environment variable can move it, and a count can
only be cleared by deleting its key in the Upstash database. The cap hit from the maintainer's IP in
rehearsal showed that; no item is logged, because raising or clearing it is her call.

**The engine bundle is merged on `main` at `carried/`, 27 Sep 2026, pull request #132, tagged
`engine-carry-2026-09-27`** (commit b099ca1, on `main`'s history by a merge commit). It is the paid
site's `calculator-seal-2026-09-26` (gs4gg-carbon v0.16.0), placed by her hand and committed as it
stands: 32 files, plus the manifest, the hash list and `carried/HOW-TO-CALL.md`, a short note for
an outside caller naming the entry point, the two pre-checks, the required inputs, what comes back
and the two refusals. **The hashes were verified from a fresh clone of the tag: 32 of 32 match.**
Two repository rules made that true: `carried/** -text` in `.gitattributes`, because git's
line-ending normalisation had changed 27 of the 32 files on the first commit; and
`!carried/calculators/data/legacy/` in `.gitignore`, because the root rule for the old prototype
folder had swallowed the bundle's folder of the same name. The first commit, b13e73b, is on no
branch and no tag. `carried/sources/registry.yaml` holds the twelve registry rows the data files
cite; the household size, UN DESA *Household Size and Composition 2022*, is cleared for attribution
only — CC BY 3.0 IGO, the Carlisle determination 27b on the paid side, 27 Sep 2026 — and no source
in the bundle's registry is pending. **Deb has both tags, `v1-tools-2026-09-24` and
`engine-carry-2026-09-27`, as of 28 Sep 2026.** Still to come after Calvin's brief, in the order
above: the Commons check (step 4), Bridget's hello (step 6), the carry to the paid site (step 7).
**The screening report export (item S21) is step 8 of the order**, from 3 Oct 2026; the done line
asks for it and it was on none of the first seven.

**Wellington reading back what Phoebe found (item A17) is done, 26 Sep 2026: #128, merged on her
word.** Each ask carries her worksheet as row ids and states only, read into a "What Phoebe found"
note: each pathway's read, and any Blocked or still-open row by id and its title from the tool file,
never her sentences. He greets a visitor coming back from her once, on his own, knowing what she
found. A route to Quantify becomes "none" when every pathway reads likely not or does not apply; a
pathway she has not looked at yet reads not enough known. His prompt is 25,894, under the unchanged
gate of 26,199: a 261-character rule in, a 140-character repeat of rules 1 and 2 out.

**Wellington collects people served, 27 Sep 2026: #130, merged on her word.** For a water supply
project (C-11 or C-19) he asks how many people or households it serves, after the stage and before
he routes, and logs a whole count and its unit as the visitor said it; households are never
converted on this site, and the conversion is Calvin's brief, from a household size with a source.
It reaches him and Phoebe on the record, shows as a People served row on the rail, and rides the
seal as `record.served`. His primer's line that people counts and the technology wait for Quantify
is replaced by the true rule: they come from the visitor's description and answers, and whatever is
still missing when they reach Calvin, Calvin asks. His prompt's repeat of the visit block's own
lines was cut to make room: 26,073, under the unchanged 26,199; 26,108 after the 27 Sep build-update
refresh, 26,117 after the 29 Sep one, 26,043 after the 30 Sep one.

**Step 1 is done, 24 Sep 2026.** Four pull requests,
all merged on her word, and the proposal file deleted at the close-out.

- **#111** — the pack-keyed reader and Phoebe's Knowledge tab: every approved card in both packs,
  grouped water then carbon, each set with its own approval chip, the drafts saying Draft, the
  Evals section, and the honest line that she reads the water cards today.
- **#113** — Calvin's and Bridget's tabs: a version on every row read from its tool folder, the
  same Evals section, Bridget's rows onto the shared component, `MapSources` retired, so one
  component draws every agent's Knowledge tab.
- **#114** — the water pack's tool definition file, the contract of §7, **pulled forward into this
  step by her word**, ahead of Phoebe's runtime step where §7 first named it; and
  `scripts/check-tool.mjs`, the gate, run by hand with the other checks on her ruling.
- **#115 and #116** — the carbon pack's tool file, thirty-six rows; then the optional ninth key,
  `applies`, ruling R9 as amended: which rows exist for a project's technology class or version,
  read from the card's own line. The gate holds a row's title, its fixability, its phase and its
  `applies` to the card.

**Nothing reads either tool file yet.** Both `tool/README.md` files and their agent-facing regions
stand as they are and still feed Phoebe's prompt; they retire when her runtime step reads the file
instead. The three fixes a carbon card describes that no route card carries are logged on the
carbon pack's page as route cards to draft after v1.

**The standing rules hold across every step:** a proposal before each, one eyeball stop per pull
request at least, the measured run after any prompt change, and the build-update fact refreshed at
every close-out (the close-out ritual's step 8).

## Family work — each family tied to a v1 step, or to "after v1"

**Recorded 3 Oct 2026 on the maintainer's approval of the tidy-up of 1 Oct.** Every open item
belongs to one of six families, and each family's open work is tied here to a step of the v1 order
above, or to **after v1**. The tie is the engineer's reading of "V1 — the done line", for her to
move. The items themselves are under *Open items, by family* below. A family with nothing on a step
says so.

| Family | On a v1 step | After v1 |
|---|---|---|
| **Knowledge** | None. The card sets are sealed at their versions (23 Sep 2026) and step 1, the Knowledge tabs, is done. | K1 full-docs card pass; K2 co-benefit module; K3 report corpus; K9 Calvin's and Bridget's packs to the new shape, after step 5; K10 part 3 and Phoebe's 80% pass, which wait on Deb's rig; K12 three carbon route cards; K13 the reading-grade figure |
| **Agents** | **Step 5:** A21, Calvin's brief — his chat and the carried engine. **Step 6:** A22, Bridget's hello, with A14 (her role word) before or with it. | A5 primer review; A10 Wellington's answers run long; A12 Bridget's chat; A20 Phoebe's runaway call |
| **Surfaces** | **Step 4:** S23, the Commons check. **Step 8:** S21, the screening report export. | S11's two typeable controls; S18 slice 4 (Deb's rig) and slice 5; S1, S5, S6, S12, S14, S15, S17, S19, S20, S22 |
| **Data** | None. | D1 and D2; both wait on material only the maintainer can supply |
| **Operations** | **Step 7:** O14, the carries owed by her hand — every row Shell A's or the brand book's, except the three changes to Deb's rig. | O1 revisit the number thirty; O4; O9; O12; O13; O15 |
| **Cleanup** | None. | C1, the sweep of struck lines |

**Shell A is the paid site.** What crosses to it is her hand, never an action in this repository, and
item O14 lists each carry once. Production's receiver is not fixed (Shell A item #243). Items S14, S15
and S17 are shapes to offer production, later, and sit after v1.

**Not on any step, said once.** The daily cap has no setting outside the code (see "Not on the plan
yet" under the V1 section); no item is logged, because raising or clearing it is her call.

## Open items, by family

**Every open item, folded in from OPEN_ITEMS.md on 3 Oct 2026.** Six lines an item at most. The full
write-up of each, as it stood that day, is in [BUILD_LOG.md](./BUILD_LOG.md), in the entry "one plan
file", Part A, under the item's number. Closed items are in BUILD_LOG.md too; items closed before
3 Oct 2026 are in [docs/OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md).

**Buckets**, her five of 18 Sep 2026, one per item: BONES (agent structure, packs, debt that trips
agents or engineers), WALKTHROUGH (a simple VWBA path into the paid site), PARTNER (the Commons or a
partner demo), PARK (real, not now), and "v1" for an item moved onto the v1 order. **Shell A is the
paid site; Shell B is this repository.** A carry to Shell A is her hand, never an action here.

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

### Agents

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

### Surfaces

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

### Data

Where real, verifiable data comes from. An empty, honest state beats a fabricated one.

**D1 · Corporate water goals and target geographies.** PARK. Public disclosures mapped to basins, so
Bridget can answer who funds water work here. Every point traceable to its disclosure; no inferred
coordinates. Not started.

**D2 · Project points.** PARK. Blocked on registry-verified data from the maintainer: the registry and a
link, the project's id and name as stated there, coordinates as published. A dot at a plausible-looking
spot is never an option.

### Operations

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

### Cleanup

Debt in the documents themselves.

**C1 · Sweep every struck line into the archive.** BONES. Her ruling of 23 Sep 2026: no crossed-out text
in any live document. Strikes from before it wait in CLAUDE.md, PROCESS_RULES, AGENT_RULES, CITATIONS, the
READMEs and the card files. One document a commit; the rulebooks and card files each their own pull
request. Proposal first, with a count of strikes per document.
