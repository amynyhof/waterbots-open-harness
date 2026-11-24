# BUILD_PLAN.md — the one plan file

## The v1 fence — the one finish line (the maintainer's word, 30 Oct 2026)

**V1 is done when both parts hold.**

1. **Reliable.** The carbon calculators reproduce one real filing of each kind: household water treatment (HWT)
   and community water supply (CWS). The VWBA D-3 module follows the VWBA 2.0 guidebook's
   method on test cases worked by hand, with every step cited; an outside expert checks it once the prototype is
   up. The guidebook has no worked example for D-3. No figure from either filing comes into this repository.
2. **Whole journey.** A visitor runs a screening (Wellington → Phoebe → Bridget → Calvin → report or sign up). We
   count the questions on each walk and report the average. The project saves to the paid site. Same inputs give
   the same numbers on both sites. Where the paid site uses more precise data, the difference can be explained,
   or the report shows what changed (the paid site's report, after the save). **Benchmarks and pass rates are v2.**

**Also in v1:**
- **The free screening runs eligibility, carbon (V1 and V2) and VWBA D-3, for everyone.** The water figure comes
  from the open core's VWBA D-3 module, built by Session C, never this site's own code.
- **Transition screening.** If Wellington hears the project is already registered for carbon, the
  screening also shows its transitional volume, still maps it, quantifies it, checks VWBA, and offers
  the report and the move to the paid site.
- **VWBA covers water supply project types only.**
- **Defaults rule.** See RULINGS.md, section 2.
- **Build rule.** Each module (screening, transition, VWBA, report) has its own inputs, outputs and
  card. Each module standing alone in the Agent Commons is v2.

**New items go to v1 only if they block the finish line.** Anything else goes to After v1.

---

What is being built, in what order, and every open item, each in its family. This file commits to an order, not to
dates. How a family opens and closes is in [FAMILY_OPEN_CLOSE.md](./FAMILY_OPEN_CLOSE.md); the rulings are in
[RULINGS.md](./RULINGS.md). A finished item leaves this file and becomes one line in [BUILD_LOG.md](./BUILD_LOG.md).

**Marks on an item.** Its v1 step or "After v1", then its bucket: BONES (agent structure, packs, debt that trips
agents or engineers), WALKTHROUGH (a simple VWBA path into the paid site), PARTNER (the Commons or a partner demo),
PARK (real, not now), and "v1" for an item moved onto the v1 order. Shell A is the paid site; Shell B is this
repository.

---

## Direction — the north star and the compatibility goal

| Step | Surface | Tier | State |
|---|---|---|---|
| 1 | **Eligibility** — can this project generate a countable benefit? | Free | Worksheet built; Phoebe live, on both pathways from 26 Sep 2026 |
| 2 | **Basin map / Partners** — where is the water stress, and who else is working there? | Free | Map built; the partner layer is item D1 |
| 3 | **Ex-ante quantification** — what benefit would this project produce? | Free | Built 1 Sep 2026; both calculators are the open core's: carbon (calvin 0.6.0) on Calvin's desk and water (Violet's D-3, violet 0.6.0) on hers, from 23 Nov 2026; Calvin's chat is item A21 |
| 4 | **Project management** — running the project after it starts | Paid | Not in this repository |

**The desk sits in front of all four**: Wellington's, where the visit starts. From 14 Nov 2026 his next steps
come in the chat, and from 21 Nov 2026 the save is the site menu's one button. **The free tier ends where step 4 begins**,
and the theme turns from Frost to Deep Marine there. Nothing of the paid platform is built, described or linked from here.

**Shell B is heading toward compatibility with the production console** (RULINGS.md, section 6). Someone who steps
up to the paid platform should find the step seamless: the same behaviours and shapes, in a different colour, with
more tabs.

---

## The v1 order — per-seat conditions under the fence (ruled 23 Sep 2026)

The finish line is the fence above and nothing else. These are the conditions each seat meets on the way to it.

- **Wellington** asks type, stage, place, name; sends to Phoebe, then Calvin; reads back what
  Phoebe found. Done when one real walk goes end to end with no wrong turn.
- **Phoebe** runs both packs: five row states, readiness per pathway, the tools line, the human
  door once. Her 80% pass is v2 (her word, 30 Oct 2026).
- **Calvin** talks; picks the pack from the record; asks only for what is missing; his carbon number comes
  from the same engine as the paid site. Done when the same inputs give the same numbers on both sites (the fence).
- **Bridget**: map and pin as today. She introduces herself, says what the map shows, hands back.
- **Commons**: v2, not a v1 condition (her word, 30 Oct 2026).
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

Only the work here that the finish line needs, in the engineer's order, for her to move. Step 1 is done (#164); steps 2, 3, 6 and 7 have work built, each recorded in its item; steps 4, 8 and 9 are not built. **Step 5 is built (22 Nov 2026) and stays open on one line:** Violet's hand-worked cases pass here once Session C ships them inside her package, in a later release (her ruling C, 22 Nov 2026). It rests on #156,
the proposal to install Calvin from the open core, merged with her word on its open points. The old step numbers (1 to 8) stay on items as names; old steps 1 to 3 are done, 24–26 Sep 2026, in the log.

| # | Step, in one line | Depends on | Done when |
|---|---|---|---|
| 1 | **React 19 under the map**, so the open core's calculator screens can run here (#156, §9). | Nothing outside this repository. | Before-and-after map pictures she has passed; every check and the build pass. |
| 2 | **Calvin's carbon calculator from the open core** on his Tool tab, V1 and V2, simple view and sliders on (A21). | The open core (Session C): the eight changes in #156 §1, sliders and the simple view. Pinned to the open core release that includes the sliders, as a release file. | Proofs P1 to P5 of #156 pass; she has passed the before-and-after table and the tab in the browser; **`carried/` is removed from this repository in the same swap, required for v1** (ruling 1 Nov 2026: the paid repository keeps the private original as the archive). **14 Nov 2026: calvin 0.2.0 installed, ex-ante with sliders, `carried/` deleted; P1 to P3 run. 0.2.0 has no simple view, and shows a new project no figure without a filed V1.0 fNRB: both for Session C.** Now 0.6.0, from 23 Nov 2026 (A21). |
| 3 | **Wellington asks the core facts first**: type and class, country, how many served, people or households, and whether it is already registered for carbon (the transition). | Her rewrite of his instructions, freeing room for the new question; the gate holds. Step 2. | The record holds the new fields; one measured run; his prompt under the gate. |
| 4 | **Calvin's chat**, on the open core's prompt, asking only what is missing (A21). | The core's `prompt.md` read against AGENT_RULES.md (#156, open point C). Steps 2 and 3. | One measured run; on a walk he opens with his facts filled and asks at most household size and, for a transition, the filed V1.0 fraction of non-renewable biomass (fNRB). |
| 5 | **The water figure from the open core's VWBA D-3 module**, in place of this site's `vwbaD3.ts`. | Session C builds the module, with the test cases worked by hand and every step cited, in a pinned open core release. Step 2. | The hand-worked cases pass here; she has passed the water figure in the browser. |
| 6 | **Bridget's chat** (A22, old step 6): her opening, the pin, the reading, then Calvin or back. | Nothing outside this repository. | A walk passes through her and back with no wrong turn; her eyeball. |
| 7 | **The screening report, free** (S21, old step 8): printed or saved, every figure cited. | Steps 2, 4 and 5. Whether it uses the core's print report is its own proposal. | She prints one from a walk; every figure matches the screen and carries its citation. |
| 8 | **The save carries every input the figures rest on**, never a computed number (old step 7). | Steps 2 to 5. The paid site's receiver reads them: her carry (O14), its item #243. | A test visit saved here opens on the paid site with every input filled. |
| 9 | **The v1 walks**: whole screenings, counted and compared. | Everything above; the paid site runs the same open core release. | Questions counted on each walk and the average reported; the paid site's carbon and VWBA figures on each saved project equal the screening's, or each difference is explained or shown in the paid site's report after the save; written in BUILD_LOG; she has watched one. |

**After v1, not needed for the finish line:** A14; npm (v2); the Commons and S23, benchmarks and pass rates, Phoebe's 80% among them (v2).

- **Wellington's prompt gate is 35,150 characters, and Phoebe's largest case 209,982** (measured plus 500, family 1's second pull request). The limits stay. From her ruling of 22 Nov 2026 a session raises them itself by measured plus 500, without asking, and states the old and new size in its pull request.
- **Her own walk of the preview stands in for the measured walk on everyday pull requests** (her ruling of 22 Nov 2026). The measured walk runs once before v1, when the model key has a safe home (A32).

---

## The nine families

One set of nine families for all three repositories, the maintainer's word of 21 Nov 2026. It replaces this file's seven
(Agents, Surfaces, Operations, Knowledge, Data, Cleanup, Safety pass) and its sprints. An item kept its number, its words and its
v1 step or "After v1" mark; only its family changed. Within a family, v1 items come first. Starting a family's sprint is her decision.

### 1 · Agent orchestration

What belongs here: how agents plug into both sites; the one shared project record; what each agent reads and writes; which pathway and method a project is on and which are unlikely; hand-offs between agents; installing core releases.

**The v1 scope of family 1, ruled by the maintainer on 22 Nov 2026.** The same words go to all three sessions. Everything else in family 1 stays "after v1". The sprint opened 22 Nov 2026; this repository's part comes in two pull requests, the second after Session C's release.

GUIDING LINE: Wellington manages the team to gather what the project needs and keep it moving. The other agents do their tasks, collect what they need, and report back to him. He helps with the next steps.

- **J1.** Release Calvin and Violet 0.5.1 as one joined release. After it, each agent gets its own release, so one agent can be updated without the other. Both sites install the same release in the same batch.
- **J2.** Doors. Each host tells each agent which door it is at: Free site, Paid site, Agent Commons or MCP (agent rule 21). An agent working alone asks for what it needs itself. This covers how Calvin opens in the Agent Commons.
- **J3.** The shared project record. Every agent adds its facts and results to one record, and the paid site reads it (agent rule 10). It holds each pathway's reading (likely, more to learn, unlikely) with its reason and what would change it. It refuses a count below zero where it is entered. One shared list turns each site's technology label into the record's code.
- **J4.** The agent map. ONE map, kept in the core, reads the project's facts and the door, and says which agents are in play, which method applies, and what comes next. It is worked out from facts, so the same project always gets the same agents. Wellington leads from it on both sites. It replaces one-off rules. It must cover at least: on "likely" or "more to learn" a pathway's calculator agent is called and shows; on "unlikely" it is not called, and the visitor is told what would change it; with no pathway forward Bridget is not called and Wellington points to the WaterBots team; a transitioning project also sees the legacy calculator (today it does not); one entry for each carbon method. Session C proposes the design FIRST; the maintainer approves it before anyone builds it.
- **J5.** Finalize all five current agents in v1: Wellington, Phoebe, Bridget, Calvin and Violet, each as an installable package in the core. Bridget's map data needs a rights check before it goes into a public repo. Violet becomes her own crew member on both sites, through the shared spec.
- **J6.** Saving a screening into the paid site: the count of people served crosses over correctly, and the paid record never shows "people" as a unit nobody chose.
- **J7.** The maintainer signs off the first water-benefit activity type (safe drinking water supply). No building.
- **J8.** Reword the 30 lines the seed checks catch on the paid site, before the next agent moves into the core.
- **J9.** Close the gaps against the agent rules: agents never talk about their own limits (rule 6); a build rule for a needed fact left blank (rule 11); no repeat introductions (rule 17); the link to the WaterBots team and the consulting page (rule 13; the address waits on the maintainer).

**Where this repository stands on them.** J4's design is approved as Session C designed it (22 Nov 2026), with the maintainer's lobby chat on the paid site, not a door and not this repository's. **Built in the first pull request:** J9's rules 6, 11 and 17 (A31); rule 13's link waits on the address. **J1 in its own pull request, 22 Nov 2026:** calvin-violet-v0.5.1 installed (Calvin 0.5.1, Violet 0.5.1, core 0.1.2), no sum changed; every agent here reads rules 1 to 21 from core. **The second pull request, 23 Nov 2026:** core 0.2.0, Calvin 0.6.0 and Violet 0.6.0 installed, no sum changed; each agent told its place (J2, A27); Violet her own crew member (J5, A23); the shared record and the fact check where a count is entered (J3); the agent map, with the site's own rules it replaces switched off (J4, A29, A30); the agents' notes in the export. **Still open here:** this site's side of J6; the agents as installable packages in the core and D3 (J5). J7 is the maintainer's; J8 is Session A's.

**A21 · Calvin's brief — his chat, the engine, carbon beside water.** Step 5 · BONES. **27 Oct 2026: replaced by** the proposal to install Calvin from the open core (#156, in GitHub's history):
Calvin's engine and screens from the open core, React 19, Wellington asks the core facts first. Ruled; six open.
Done when his screening numbers match the paid site's calculators run on the saved project's inputs (the v1 fence; her ruling, 10 Oct 2026). Baseline marker: `--tide-text` (chosen 9 Oct 2026; teal dropped). **21 Nov 2026: calvin 0.4.0 installed from the release (#178), with `unpinFigureBlock` on everywhere and `hideExportButton` on Quantify, where the left rail's screening report is the one export; the Commons keeps his export; no figure changed.** **22 Nov 2026: calvin 0.5.0 from calvin-violet-v0.5.0, tiles pinned, his intro gone; no sum changed.** **22 Nov 2026: calvin 0.5.1 from calvin-violet-v0.5.1 (J1), a missing value a blank box; no sum changed.** **23 Nov 2026: calvin 0.6.0 from calvin-v0.6.0, his place and his notes in the export; no sum changed.**

**A14 · Screen host role words — one home.** Step 6, before or with A22 · BONES. `BridgetScreen.tsx` says
`role: 'Map'` where her crew card says "Partners"; `PhoebeScreen.tsx` carries its own too. The chat header
draws them and `check-roster` does not read them. Her ruling is owed: the field goes and the header reads the crew file, or the check reads the records. Not fixed, by her word of 18 Sep 2026.

**A27 · Agent door bug.** v1 · BONES. Her word of 12 Nov 2026: in the Agent Commons, Phoebe tells visitors to go to Wellington. In the Commons,
every agent works alone and asks for what she needs herself; on the sites, she hands back to Wellington. Each module must know which door it is at (see the plug-in contract). **22 Nov 2026 (#193):** rule 21 names four doors. Phoebe has one set of instructions at the Free site and the Agent Commons, and nothing tells her which door she is at; she can only guess from whether the visitor's record came with the message. Wellington and Bridget are at the Free site door only. **Built 23 Nov 2026 (J2):** each host names the door, and Phoebe's relay tells her which one she is at. Waits on the maintainer's walk.

**A29 · The legacy calculator for a transitioning project.** v1 · BONES. Her ruling of 22 Nov 2026: the question "already earning Gold Standard credits?" is already asked. What is missing is the legacy calculator for a transitioning project. J4 covers it. **Built 23 Nov 2026:** Phoebe's answer sets it on the shared record, and Calvin then shows the legacy calculator and the transition, and asks for the filed V1.0 fNRB first. Waits on the maintainer's walk.

**O14 · Carries owed — listed once.** Step 7 · PARK. From 21 Nov 2026 a carry goes through the handoff folder, only when she names it.
**Through the folder, to Shell A:** the seal's contract (`type`, `gsClass`, `stage`, rows and a read per pathway, `wantsHuman`, `record.served`; `kind` retires
when its receiver reads them, and that receiver is not fixed, Shell A item #243); `project-types.md`; the ten-line contract; Q11; the paid-site tools line; the
transition module; the one-row shape; the agent screen's file list; open.waterbots.ai for the landing box, the claim and the menu (28 Oct 2026). **Through the folder,
to this site:** the sign-up address, the confirmed roster columns, and a `roster.yaml` with rule 21's four doors and without its lines that repeat the agent rules (found 22 Nov 2026). **Route not yet ruled:** the brand book (typing dots §5, the agent screen §7); the grader (three rig changes).
**Done:** `roster.yaml` without the maintainer's name, carried 2 Nov 2026, version 0.3.1, `product-shared@0.6.3`; Web Analytics, built #179 and on in Vercel 21 Nov 2026.

**A31 · What the agent rules of 22 Nov 2026 still need built.** After v1 · BONES. Found while building #193. Rules 6, 11 and 17 are J9, built in family 1's first pull request: Phoebe and Bridget answer "what can you do" with what they can help with, and Phoebe says her sources do not cover a gap rather than that she has no card; Wellington's visit block names what is needed and still blank; where his line shows above theirs, Phoebe and Bridget do not introduce themselves again. Left, each waiting for her ruling:
- Rule 13: the reasons each agent sends someone to the WaterBots team. The repository gives Wellington and Bridget none, and Phoebe one (`docs/modules/`). The link to the consulting page is needed in Wellington's and Phoebe's instructions, the shared roster and the save door's team box; this site holds no address for it yet (J9).
- Rule 6: Bridget's "still being built" sentence says what she can only do today. It keeps the maintainer's own wording, so it changes on her word.
- Rule 10: Bridget adds nothing to the project record herself; the console stores the pin.
- Rule 8: no (ref) marker beside a fact in the chat; Phoebe's sources show on her worksheet rows.

**A30 · The walk of 21 Nov 2026 — what the agents knew and handed on.** v1 · BONES. Eight findings from her walk (full list:
the build log as it stood at #193, in GitHub's history). The D-3 swap and the water calculator's re-asking closed on 22 Nov 2026; six wait for this sprint.
**Her rulings of 21 Nov 2026 for it** (whole in the build log as it stood at #193, in GitHub's history): the words are "likely", "more to learn" and "unlikely",
never "ruled out"; on likely the host calls that pathway's calculator agent and it shows; on more to learn the same, flagged as
missing information; on unlikely it is not called and does not show, the visitor is told what would change it and may browse it
in the Commons. This replaces "the water calculator always shows". Built from a shared spec on both sites, not here alone. **Built here 23 Nov 2026 on core's agent map (J4).** Left, found while building it, for the maintainer's word: Phoebe's step counts as done when one path is done and the other is only started, so the other mostly reads "more to learn"; her rows are not cleared when a fact changes; the Agent Commons rows for Calvin and Violet still say "Coming soon", so an unlikely path's calculator cannot be opened there yet. For Session C: the map asks about four pathways and this site reads two.

**A23 · Calvin's VWBA row becomes Violet's.** v1 · BONES. Her word of 30 Oct 2026: the VWBA agent is Violet, host of the
D-n modules in the Commons; not on the roster yet, by her hand. **Moved to v1 on her ruling of 21 Nov 2026:** Violet becomes her own
crew member on the v1 road, through the shared spec with both sites. Until then her D-3 screen sits under Calvin's "Water
benefits" chip (22 Nov 2026). Her Orchid (4.29:1) needs a darker text shade when she is built, as Calvin has Deep Reef (1 Nov 2026). **Built 23 Nov 2026 (J5):** her own seat and desk, from the crew list. Left, by the maintainer's hand: her portrait (her initial is drawn), her Orchid text shade (her name is ink), and the brand book's §6, which still says no agent called Violet.

**A20 · Phoebe's runaway call is cut off, not prevented.** After v1 · PARK. One request in seventy-five
spent all 16,000 output tokens; `CALL_TIMEOUT_MS`, 120 seconds, ends it. Done is a real count once there
is traffic, then a smaller budget with a measured reason or a line saying the timeout is enough.

### 2 · Calculators and methods

What belongs here: the maths, method values, defaults, labels and where each value comes from.

**CM1 · The walk of 21 Nov 2026 — the water calculator's inputs.** v1 · BONES. One finding from her walk of the live
site: a minus number of people was ignored with no message. The full list: the build log as it stood at #193, in GitHub's history. From 22 Nov 2026 the water
calculator has no people box (Violet takes the count from the record). **Closed by J3, 23 Nov 2026:** a count below zero said to
Wellington is refused by core's fact check, and the visitor is told why. Waits on the maintainer's walk.

**V2-2 · WHO cooking-fuel data by fuel type — WHO shares this database on request under a data-sharing
agreement (see [link](https://www.who.int/data/gho/data/themes/air-pollution/who-household-energy-db)).
Request it via householdenergy@who.int; use it only if the agreement allows use in this tool.** If so,
replace the screening's conservative fuel-mix floor with WHO's by-fuel-type mix. After v1. No proposal
yet.

### 3 · Knowledge

What belongs here: what the agents are allowed to know: cards, packs, hosted copies.

**A25 · Agents' knowledge copies refresh whenever their files change.** v1 · BONES. Her word of 31 Oct 2026. The primer,
the cards and the lists reach the relays as generated copies (`scripts/build-prompt-modules.mjs`), written by hand; CI's
`--check` fails a stale copy, but nothing refreshes one. Done is a copy that cannot ship stale and needs no hand. Proposal first.

**A5 · Primer review against the abstention log.** After v1 · PARK. The primer was written from the rules,
not from real questions, because there were none. Once there is real traffic, read the log against it:
gaps that are another agent's subject, and anything no agent covers. Waits on usage, with O1, O9, A20.

**K1 · VWBA full-docs card pass.** After v1 · BONES. Read the manual end to end and propose which further card sets
are warranted. Not started. Two untracked drafts at the root, `activity-cards-vwba-DRAFT.md` and
`definitions-cards-vwba-DRAFT.md`, are parked until after v1, on her word.

**K2 · Co-benefit quantification module.** After v1 · PARK. One card per method, so a co-benefit that can be
quantified is, and one that cannot stays words. Not started.

**K3 · VWB report corpus.** After v1 · PARK. About ten public volumetric water benefit reports, parsed for their
common must-haves. One is held, by her hand. No action yet.

**K9 · Calvin's and Bridget's packs move to the new pack shape.** After v1 · BONES. One brief each, the way
Phoebe's did: `git mv`, every reader follows, the move proved byte for byte. Calvin's comes after A21,
which leaves his pack where it is.

**K10 · Phoebe ready for the grader's rig.** After v1 · BONES. Her cards are reviewed by the maintainer and the engineer
notes are split out (#94). Left: exam questions drafted for her signature, then exported in the rig's
case shape, which arrives by her hand. Her done line of an 80% pass is the rig's to say.

**K12 · Three carbon route cards no card carries.** After v1 · PARK. The pump-drive change that cards T1 and M2
name, and M14's justified sub-national area. The card sets are sealed until a real project fails on one.

**K13 · A reading-grade figure for route cards.** After v1 · PARK. `check-cards` prints a grade for every route
card and plain-words line against a grade-6 target; printed, never enforced. Not built.

**K14 · Knowledge the agent rules left behind.** After v1 · BONES. Found 22 Nov 2026.
- Rule 7: Wellington's basic facts about water benefits and carbon credits live in his instructions, not in a pack with a source.
- The shared roster still carries live-or-coming facts that the build status sheet now holds, such as "his chat is not live yet" and the journey table's State column.

**C2 · Two sealed cards point at retired pages: a routine knowledge update.** After v1 · BONES. Her ruling of 22 Nov 2026: the sealed cards stay as they are, and these fixes wait for the routine knowledge updates of this family. The water eligibility cards point at "Pace and posture" in the old `AGENT_RULES.md`, and the carbon eligibility cards at `CITATIONS.md` (retired in #192). Every other old pointer was fixed on 22 Nov 2026.

**K15 · Two copied-text matches.** After v1 · BONES. The ten-word match in the carbon eligibility cards and the nine-word match in the carbon grader notes wait for the maintainer's knowledge pack review sprint (her word of 23 Nov 2026).

### 4 · Console and surfaces

What belongs here: what a visitor sees and clicks, the same on both sites: layout, navigation, header, Save, words, phone, design, report.

**A26 · Wellington's rewrite.** Step 3 · v1 · BONES. Built 5 Nov 2026 as approved; her walks' fixes, the voice card and "Wellington comes to you" 12–14 Nov 2026. His prompt is 34,650 against a gate of 35,150, measured 23 Nov 2026 in family 1's second pull request. Waiting on the one measured walk before v1 (A32).

**A28 · Phoebe's walk fixes.** v1 · BONES. Her word of 12–14 Nov 2026: rounds two and three (#173), the limit of 4 sentences or 400 characters approved 14 Nov. On the preview her first word came at 4.8 to 6.1 seconds and whole answers took 5.8 to 9.3 (14 Nov). The skipped hello is fixed. From 14 Nov a voice card, the shared plain-words list, the order of questions, and a ruled-out path saved the same turn (W25). Waiting on the one measured walk before v1 (A32).

**S21 · The screening report exports free.** Step 8 · v1. Her word of 23 Sep 2026: every tool, with or
without answers, exportable as an easy-to-read, properly cited document. The screening report is the first
export, in the phase-tags shape. **A first version is built on her word of 14 Nov 2026 (#173)**: print-only, from the left rail, growing with the visit, in the feel of the core's ReportView. From 16 Nov 2026 (#174) it is the one export on Quantify, and it carries Calvin's figure and his full working.

**S25 · Tap size on phones.** v1 · WALKTHROUGH. Her word of 31 Oct 2026, after her preview check of #167. Every control a
visitor taps, measured at phone width against a size she rules; S24's 44px for the main site's menu is the same question
there. Proposal first, with the measurements.

**A10 · Wellington's answers run long.** After v1 · BONES. The target is two or three plain sentences; his
replies ran four or five. Done is a measured pass on the length rule, counts and not impressions, and a
check that reads sentence counts off a walk. On her word.

**S11 · The free desk — two typeable controls owed.** After v1 · WALKTHROUGH. "What it does" and the
project type are heard in chat only; a visitor who never chats cannot fill them. Everything else is built.

**S18 · Agent Commons — slices 4 and 5.** After v1 · PARTNER. v0, slices 1 to 3, is built (#68 to #70).
Slice 4, Credentials fed by the grader's rig, waits on his per-case file and the three rig changes she takes to
him; it reads "not yet graded" until a real card exists. Slice 5, the flag button, is later. One grader,
real only, and an agent opens alone: docs/modules/commons.md. Its 28 Oct 2026 rewrite is built.

**S24 · The site on a phone.** After v1 · WALKTHROUGH. Her word of 29 Oct 2026: built.
Waits on her check on a real phone; a 44px tap area for the main site's menu is hers to carry (S25).

**S23 · The Commons check.** After v1 · PARTNER. v2, her word of 30 Oct 2026; it was old step 4. Phoebe and
Calvin work on the Commons with no memory; Bridget introduces herself; Calvin's two cards on one engine. No proposal.

**S26 · The Commons list in its own content file.** After v1 · PARTNER. v2, her word of 31 Oct 2026. The list of
modules lives in code, `src/lib/commonsShelf.ts`; it moves to a content file of its own, so a row changes without
touching code. Proposal first.

**S27 · VWBA D-1 to D-9 rows on the Commons.** After v1 · PARTNER. v2, her word of 31 Oct 2026. One row for each of
the VWBA methods D-1 to D-9 on the Commons list, each with a real status, never an invented one; Violet hosts them (A23).
No proposal yet.

**S19 · The Workshop — make your own agent on the Commons.** After v1 · PARTNER. Not built; the proposal
is next on her word. Her cost model, review before publishing and the two-shape save are in the write-up.
Waits on the rig's pack-file shape, by her hand.

**S20 · "Connect with a human expert" on every Commons agent.** After v1 · PARTNER. Not built. Two design
questions are hers: the form's fields, and whether a builder's contact is public or relayed. Where the
form goes is a fact she carries.

**S12 · The hero chat — a full page that is the conversation.** After v1 · PARK. Parked 9 Sep 2026. Waits
on a demo reference brought in by her hand: the `Design refs/` folder was deleted on her word on 3 Oct
2026, so the hero-chat reference must be brought in again if S12 is picked up. The landing never changes without her word.

**S14 · Typing dots — the book's third motion exception.** After v1 · PARK. Ruled 3 Sep 2026: three dots
fading by opacity, stopped under reduced motion. Waits on her hand into brand book §5. No build until S12.

**S15 · One row — a candidate shape for Shell A.** After v1 · PARK. Built here 7 Sep 2026: the journey bar
is the navigation. Offered to production by her hand, when she chooses.

**S17 · The agent watches its Tool tab and comments; a teal dot on Chat.** After v1 · PARK. Parked for a
design session, both shells. Four questions are open, in her words, in the write-up. No proposal yet.

**S5 · Narrow-column wraps.** After v1 · PARK. Citation lines wrap badly in the narrow dock; one piece with O4's legend strip and the rail-width rider.

**S30 · Phoebe's screen, for the console pass (job 2).** PARK, not built; her word of 14 Nov 2026, with S29 (three blue buttons at once, her walk of #170; **settled 16 Nov 2026: one blue at a time, built, `src/lib/blue.ts`**): a small progress bar
for her questions; an Eligibility quiz tracker in the left rail, the Project Record collapsed while she works, in place of the "Worksheet — …" line in chat; what belongs in the right panel. ~~Once "Save this project" shows, Sign up goes quiet: one blue.~~ Built 16 Nov 2026.

**S22 · The Blocked row colour.** After v1 · PARK. Blocked rows reuse `--state-pending` until her pixels;
the brand book's §2.5 has no stopped state that is not an error. A raise for the book, from an image.

**S31 · The walk of 21 Nov 2026 — what the visitor sees.** After v1 · WALKTHROUGH. Four findings from her walk (full list:
the build log as it stood at #193, in GitHub's history). Closed on 22 Nov 2026, waiting on her eyeball: Calvin's intro with "on the left", the line of method
symbols and the Beta sticker are gone (calvin 0.5.0); Violet's labels sit above their boxes on a phone. Still open: the Commons
rows for the calculators and Phoebe, and the "beta" at the bottom left.

### 5 · v1 proof and grading

What belongs here: showing it works: real-filing matches, same numbers, whole-journey walks, question counts, exams, the grading rig.

**A22 · Bridget's chat.** Step 6 · BONES. Built and merged 31 Oct 2026 on her three rulings (#167). Done when a walk passes through her and back with no wrong turn (road step 6). Closes A12.

**A32 · The measured walks wait on the model key.** v1 · BONES. A26, A28 and road step 9 each wait on a measured walk. The
model key has not been on this machine since at least 31 Oct 2026. The walk scripts can point at another address (`WB_BASE`), so a
walk could run against a preview, whose server holds the key; that uses her credit and the preview's daily limit. **Her ruling of 22 Nov 2026:** her own walk of the preview stands in for the
measured walk on everyday pull requests. The measured walk runs once before v1, when the model key has a safe home.

### 6 · Data and map

What belongs here: real outside data and the rights to use it: basins, project points, corporate goals.

**D3 · Map data rights.** v1 · BONES. For the maintainer, her ruling of 22 Nov 2026 (J5): a rights check on each map data file in this repo and before any of it moves to the core. The map's basin and water-stress files are already public here. Change no data.

**S28 · Countries named inside another country's name still zoom.** After v1 · WALKTHROUGH. v2, her word of 31 Oct 2026.
Four countries whose names are part of another country's name open the Map tab on the whole world today (`src/lib/placeBox.ts`); done is their own, never a guess.

**S1 · Collective action as a partner-finding surface.** After v1 · PARK. Regional collective action
groups: which exist, where, how to reach them. The companion to D1. Not started.

**D1 · Corporate water goals and target geographies.** After v1 · PARK. Public disclosures mapped to basins, so
Bridget can answer who funds water work here. Every point traceable to its disclosure; no inferred
coordinates. Not started.

**D2 · Project points.** After v1 · PARK. Blocked on registry-verified data from the maintainer: the registry and a
link, the project's id and name as stated there, coordinates as published. A dot at a plausible-looking
spot is never an option.

**V2-1 · Watershed map — click a watershed, see its water facts.** After v1. A visitor clicks a basin
and reads its water facts. Every fact traceable to its source; no invented values. No proposal yet.

### 7 · Paid platform

What belongs here: paid-only structure: roles, organizations, programs, documents.

Nothing here.

### 8 · Security and hygiene

What belongs here: secrets, names to block, alerts, repo settings, speed and weight, stale rules and docs, close-outs.

Routine hygiene, about once a month: check that nothing in this repo repeats or disagrees with a master page (rulings, agent rules, family page, status sheet). Fix what does.

**O16 · Real-project figures in the carried bundle, public since #132.** Step 5 · BONES. The sweep of 3 Oct 2026
found one real filing's figures in `presets.ts`, `emissions-legacy.ts` and `MANIFEST.md` (`carried/` deleted 14 Nov 2026). #244 is the paid site's
item for real numbers left in this repository's public history. Open: the figures stay in `main`'s history before it. List: the build log as it stood at #193, in GitHub's history.

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

**O17 · The first page weighs 1,201 kB.** After v1 · WALKTHROUGH. v2, her word of 31 Oct 2026. The site's one script
file, past the build's own 500 kB warning (776 kB when logged, 795 kB on #167 with the country boxes, 1,200.69 kB measured 21 Nov 2026). Done is a measured figure she rules on, and what was cut. With O12.

**O13 · Banned words in old code.** After v1 · BONES. `validate()` in `api/_wellingtonAnswer.ts` and its
callers, and "console" in Bridget's and Calvin's dock copy. One hygiene pass; no behaviour changes.

**O15 · Four storage keys show "Needs Attention" in Vercel.** After v1 · PARK. `KV_URL`, `REDIS_URL`,
`KV_REST_API_TOKEN` and `KV_REST_API_READ_ONLY_TOKEN`. Not looked at; first read the platform's message
for each. Check later, on her word.

**S6 · The dev relay resolves imports differently from production.** After v1 · BONES. Three outages on
24 Aug 2026, three guards since (the api type-check mode, named HTTP exports, `check-api-exports`). The gap
stays: anything development tolerates that Node would not. Closing it means exercising the relay as
Vercel does before a push, or a named guard per known difference. Never a second copy of the handler.

**C1 · Delete every struck line.** After v1 · BONES. No crossed-out text in any live document, and no archive copy
(RULINGS.md, section 7). The rule files lost theirs on 22 Nov 2026. Strikes still wait in the README and in the
knowledge packs' READMEs and card files. Proposal first, with a count per document.

**C3 · For the engineer: confirm and delete unused code.** After v1 · BONES. The maintainer's ruling of 22 Nov 2026: unused code
waits for the engineer. The list from #194, line numbers as merged in #194 (commit 18c7a84):
1. `src/lib/gsSdws.ts`, lines 1–1003: the old carbon calculator. Its maths runs nowhere; carbon comes from the open core, and
   proof P3, which used it as the "before", ran on 14 Nov 2026 (#174). **Before the file goes, four bits of text that Calvin's
   Knowledge pack tab reads move to a short list, like the water one:** each method's name, what it measures, its scope and its
   citation (lines 75–95 and 1002–1003).
2. `scripts/check-gs-sdws.mjs`, lines 1–496: 108 checks on that calculator only, and its line in `checks.yml`.
3. `src/lib/methodPacks.ts`, lines 1–298: the shape of this site's own calculators, kept only because `gsSdws.ts` is written in
   it. The water listing and the calculator list (lines 300–362) are used and stay.
4. `src/lib/methodPacks.ts`, lines 364–381: `PackComparison`, `PACK_COMPARISONS` (an empty list), `cubicMetres`.
5. `src/lib/visit.ts`, lines 612–660: `sendsSomewhere`, `rowTaken`, `nextStepRows`, `inviteSurface`, the old right-rail rows;
   only a check reads them.
6. `src/lib/visit.ts`, lines 438–545 (`deskRows`): the Phoebe, Bridget and Wellington rows; only Calvin's are drawn, in the
   screening report.
7. `src/lib/worksheetState.ts`, lines 108–109 (`PATHWAY_LABEL`, `READ_LABEL`) and 186–196 (`anyRowIn`).
8. `src/lib/phoebeCards.ts`, lines 617–621: `CARDS_APPROVED_ON`.
9. `src/lib/surfaces.ts`, lines 23–24: `ConsoleSurface`, a second name for the same type.
10. `scripts/measure-levels.mjs` (126 lines) and `scripts/measure-join.mjs` (163 lines): one-off measurements from August 2026.
11. **The checks switched off on 22 Nov 2026** (her ruling, family 1's first pull request): each matched exact sentences in an
    agent's instructions. Each is commented out where it stood, under one note at the top of its file, so it no longer runs. Line
    numbers are where each starts in that pull request.
    - `scripts/check-wellington.mjs`, 25 checks: lines 165, 182, 183, 186, 210, 212, 228, 239, 256, 269, 285, 332, 378, 787,
      1021, 1049, 1082, 1087, 1096, 1101, 1107, 1114, 1132, 1188 and 1242. Line 1242 treated the word "consultant" as a fault.
    - `scripts/check-phoebe.mjs`, 32 checks: lines 327, 505, 515, 532, 541, 551, 562, 572, 580, 588, 596, 606, 613, 620, 626, 631,
      639, 646, 655, 662, 668, 678, 691, 704, 738, 751, 769, 780, 796, 809, 814 and 822. Line 588 treated the word "consultant" as a fault.
    - The structure checks stay on: the whole agent rules page in each agent, no older rule left, the status sheet present, the gates,
      and the machinery that does not depend on wording.

Kept, though they look unused, because something planned needs them: `walkGrades` in `api/_reply.ts` (lines 213–217) and the
three measure scripts (A32); `PROJECT_MAPPING_NOTE` in `src/lib/site.ts` (lines 18–21; projects on the map are coming);
`scripts/build-basins.mjs` and `scripts/build-stress.mjs` (they rebuild the map's data); `scripts/check-basemap-key.mjs` (run
by hand; it needs the real key); the automerge job in `.github/workflows/lanes.yml`, lines 81–118 (switched on 22 Nov 2026).

**C4 · Leftovers from the clean-up of 22 Nov 2026.** After v1 · BONES. Written down, not chased.
- `CLAUDE.md` says this session's settings deny `gh pr merge`; on 22 Nov 2026 two merges ran from the session on her word. The
  line is out of date (lane 3).
- `check-phoebe`, `check-tool` and `check-handoff` run on this machine but not in GitHub's checks. Adding them needs her yes.
- `.github/workflows/names.yml` has a comment pointing at a deleted proposal, kept because the name scan stays exactly as it is.
- The knowledge packs' CHANGELOGs keep old card wording ("Old wording:"), copies of dead text; with C1.
- A Vercel preview needs a sign-in, so a session cannot take a picture of one; pictures come from a local server.

**C5 · Trufflehog read nothing on pull requests until #196.** After v1 · BONES. Found 22 Nov 2026: its check passed on #193 to #196 after
scanning 0 chunks and 0 bytes, most likely because it was told to scan from `main`, which a pull request's checkout does not have. #196 gives
it no base and no head. Session C and Session A cannot read this repository; the coach asks them to check their own.

**SP1 · A separate GitHub account for sessions.** After v1 · BONES. A second account that can open pull requests but
cannot merge, enforced by branch protection (only the maintainer's account may merge). First on this list: the deny
rules in session settings are a fence a session could edit away, branch protection is not. Needs her to
create the account and set the rule; a proposal comes first.

**SP2 · The nine `npm audit` findings.** After v1 · PARK. All are in build-time tools, none in the live site's own
dependencies: seven come through `mapshaper` (`adm-zip`, `@xmldom/xmldom`, `fflate`, `file-type`, `image-size`
and two that depend on them), one through Vite (`source-map-js`), and from 21 Nov 2026 Vite itself; `geographiclib`, deprecated, is mapshaper's too.
Plan: `npm audit fix` without force on a throwaway branch; all checks and the build; rebuild the basins,
byte-identical; upgrade `mapshaper` if a release drops `geographiclib`. Lane 3; proposal first; the paused
install scripts for `better-sqlite3` and `esbuild` stay paused.

**SP4 · Pin every GitHub Action by full commit hash instead of tag.** After v1 · BONES. `actions/checkout`, `actions/setup-node`,
`gitleaks/gitleaks-action` and any others in `.github/workflows/`, per the second reader's re-attack on #152. A tag can be moved to
different code; a full commit hash cannot. Lane 3 (it edits CI); proposal first.

**SP5 · Check linting, formatting and strict typing; switch on what is missing.** After v1 · BONES. Find out which
of the three the repository already runs, and turn on the ones it does not. Proposal first, with what is on and
what is off.

### 9 · Experts and partners

What belongs here: what outside experts review, what we owe partners, and what we send them.

**SP6 · A human engineer reviews the structure.** Now, not blocking v1 · BONES. One question put to a person:
what would you keep, what would you fix first, what would you worry about. It covers all three repositories. The
review itself is her hand's work, outside this repository (rule zero); only its findings come back here, as items.
