# BUILD_PLAN.md — what is being built, and why

Which family of work is being built now, which comes next, and what each one is
waiting on. **This file commits to an order, not to dates.**

Read it with [OPEN_ITEMS.md](./OPEN_ITEMS.md), which holds the items themselves
and the north star they lead toward, and with
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work
moves from a proposal to a commit.

**This file is rewritten whenever the plan changes**, and refreshed at every
session close, so it never describes a plan we have already left behind.

**Finished work's history is in [BUILD_LOG.md](./BUILD_LOG.md), not here.** The "Previously" sections
that stood in this file until 3 Oct 2026 are in that day's entry, Part B.

---

## Compatibility goal

**This is the standing direction. It sits under the north star in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) and shapes how everything below is built.**

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

**Step 2, Wellington type and stage, is done 24 Sep 2026: #119, merged on her word** — item A16 in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) is its home: the short-form list in his prompt, type and class and
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

**Recorded 3 Oct 2026 on the maintainer's approval of the tidy-up of 1 Oct.** Every open item in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) belongs to one of its six families, and each family's open work is
tied here to a step of the v1 order above, or to **after v1**. The tie is the engineer's reading of
"V1 — the done line", for her to move. The items and their buckets live in OPEN_ITEMS.md and are not
copied here. A family with nothing on a step says so.

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
