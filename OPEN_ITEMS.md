# Open items

Every open thread in this repository, in one place. Moved out of
[SESSION_HANDOFF.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md) on 21 Aug 2026 —
~~that file now carries session state and hand-off notes only, and points here.~~
**Corrected 17 Sep 2026:** the live root handoff is retired. Live state is this file,
[BUILD_PLAN.md](./BUILD_PLAN.md), [BUILD_LOG.md](./BUILD_LOG.md), and git. The retired
handoff is in [docs/archive/](./docs/archive/README.md). Do not recreate a live root
`SESSION_HANDOFF.md`.

**Closed items leave this file at every close-out and live in [BUILD_LOG.md](./BUILD_LOG.md)**, in
full, from 3 Oct 2026 — the maintainer's ruling of 1 Oct 2026, step 9 of the close-out ritual.
**No closed row stays in the index table below.** Items that closed before that date are in
[OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md). **To find an item whose number is no longer
here, search BUILD_LOG.md for its number.** This file is read at the start of every session and stays a
briefing; neither the log nor the archive is one of the four opening documents.

Read this with [CLAUDE.md](./CLAUDE.md), which is the rulebook and takes precedence, with
[AGENT_RULES.md](./AGENT_RULES.md), which binds every agent, and with
[CITATIONS.md](./CITATIONS.md), which binds anything that cites a source.

**Nothing here is in progress unless it says so.** An item on this list is a thing that is known,
recorded, and waiting — not a thing being worked on.

---

## The build plan lives in its own file

**What is being built now, what comes next, and the compatibility goal are in
[BUILD_PLAN.md](./BUILD_PLAN.md).** This file holds the items themselves; that
one holds the order they are worked in. Neither repeats the other.

---

## North star — the console's journey

Recorded 21 Aug 2026 as the shape the console is being built toward. **None of this is a
commitment to dates, and ~~only step 1 and part of step 2 exist today.~~** **Corrected 17 Sep 2026:** Eligibility, Partners (the map), and Quantify are live; the partner layer is still item D1; step 4 is paid and not started. It is here so that
individual pieces of work can be read against where they are meant to lead.

| Step | Surface | Tier | State |
|---|---|---|---|
| 1 | **Eligibility** — can this project generate a countable benefit? | Free | ~~Worksheet built; the agent behind it is in progress~~ **Corrected 17 Sep 2026:** worksheet built; Phoebe live from 24 Aug 2026 |
| 2 | **Basin map / Partners** — where is the water stress, and who else is working there? | Free | Map built; the partner layer is item D1 |
| 3 | **Ex-ante quantification** — what benefit would this project produce? | Free | ~~Not started~~ **Built 1 Sep 2026.** The step, and ~~one screening pack~~ **three screening packs (2 Sep 2026)** in it. Calvin's post; his chat is not built |
| 4 | **Project management** — running the project after it starts | Paid | Not started |

**The desk sits in front of all four steps from 2 Sep 2026** — Wellington's dispatch desk, the console's
fourth surface, where the visit's next steps collect and the save door to the paid platform stands.
It is item S11 and is not a step of the journey; it is where the journey is looked at.

**The free tier ends where step 4 begins.** Everything up to and including quantification is open
to anyone; managing a live project is where the paid platform takes over.

**The theme turns marine at step 4.** The free surfaces are Frost, the light theme this repository
ships. The paid tier is Deep Marine, and the change of surface is meant to be felt — it marks
crossing from open tools into the platform, rather than being a styling preference.

> This repository is the free tier. Step 4 is named here for context only; nothing about the paid
> platform is built, described, or linked from this repo, and rule zero still holds.


---

## Families

Items are grouped by **what kind of thing the work is**. That axis was chosen because it stays
stable when an agent is renamed or a surface is added — the earlier grouping mixed a subject, an
agent and a layer, which is why two items could each have belonged in two places.

**Every item belongs to a family.** A new item joins one or starts one, and starting one is a
maintainer decision recorded with its reason. **There are no loose rows.** If an item seems to fit
nowhere, that is a sign the families are wrong, not that the item is special.

**Buckets — a second axis, from the maintainer's triage of 18 Sep 2026.** A family says what kind of thing an
item is; a bucket says what it is for now. Five buckets, one per row, ruled by her:

| Bucket | What it holds |
|---|---|
| **BONES** | Agent structure, packs, roster, Wellington's orchestration, and debt that trips agents or engineers |
| **WALKTHROUGH** | Needed for a simple VWBA path from this site into the paid site |
| **PARTNER** | Needed for the Agent Commons or a partner demo |
| **PARK** | Real, but not now |
| **CLOSE** | Done, duplicate, stale, or overtaken by a newer ruling — swept to the archive, index row kept, shown as *closed* |

A row keeps its bucket until she moves it. The triage of 18 Sep 2026 is recorded in BUILD_LOG.md under
item O11; the full sort was a proposal file at the root, untracked, and deleted once the sweep merged.

**Shell A and Shell B.** Shell A is the paid site, production. Shell B is this repository, the free
site. Recorded 3 Oct 2026 on the maintainer's word. A carry to Shell A is always her hand, never an
action here (rule zero), and item O14 lists them once.

| Family | What it covers |
|---|---|
| **[Knowledge](#family-knowledge)** | What the agents are allowed to know — card sets, the source corpus, and the methods behind a number. |
| **[Agents](#family-agents)** | How agents behave, what they may say, how they hand off, and who staffs which post. |
| **[Surfaces](#family-surfaces)** | What a visitor sees and works with — the map, the worksheet, the chat layer. |
| **[Data](#family-data)** | Where real, verifiable data comes from, and whether it exists yet. |
| **[Operations](#family-operations)** | The deploy, the repository, settings and limits that outlast the session that made them. |
| **[Cleanup](#family-cleanup)** | Debt in the documents themselves — wording, strikes, structure — that no other family owns. **Started 23 Sep 2026 by the maintainer's ruling**, with the sweep of struck lines as its first item; the reason is that a document-wide sweep belongs to no surface, agent, dataset or deploy. |

| # | Item | Family | Bucket | State |
|---|---|---|---|---|
| K1 | VWBA full-docs card pass | Knowledge | BONES | open |
| K2 | Co-benefit quantification module | Knowledge | PARK | open |
| K3 | VWB Report Corpus | Knowledge | PARK | open, no action yet |
| K9 | Calvin's and Bridget's packs move to the new pack shape | Knowledge | BONES | **logged 18 Sep 2026 from the maintainer's brief** — one brief each, the way Phoebe's did; not started |
| K10 | Phoebe ready for Deb's rig — cards reviewed, engineer notes split out, exam questions signed | Knowledge | BONES | **logged 18 Sep 2026 from the maintainer's brief** — not started |
| K12 | Three carbon route cards no card carries | Knowledge | PARK | **logged 3 Oct 2026** — a residue of K7; after v1, the sets being sealed |
| K13 | A reading-grade figure printed for every route card and plain-words line | Knowledge | PARK | **logged 3 Oct 2026** — a residue of A18; a grade-6 target, printed and not enforced; not built |
| A5 | Primer review against the abstention log | Agents | PARK | logged 27 Aug 2026, not due |
| A10 | Wellington's answers run long | Agents | BONES | **logged 3 Sep 2026 as debt** — tightening comes later |
| A12 | The two chats not built — Bridget's and Calvin's | Agents | PARK | **adopted 18 Sep 2026** from items A2 and S10; not scheduled |
| A14 | Screen host role words — one home | Agents | BONES | **logged 18 Sep 2026 from the maintainer's word** — not fixed now |
| A20 | Phoebe's runaway call is cut off at 120 seconds, not prevented | Agents | PARK | **logged 3 Oct 2026** — a residue of A6; revisit with real usage |
| A21 | Calvin's brief — his chat, the carried engine, carbon beside water | Agents | BONES | **proposed 27 Sep 2026; R2 to R11 ruled yes 1 Oct 2026; R1 open** — waits on the engine scrub and the re-seal at v0.16.1; build-order step 5 |
| A22 | Bridget's hello — she introduces herself, says what the map shows, hands back | Agents | BONES | **logged 3 Oct 2026 from the v1 done line** — build-order step 6; no proposal yet |
| S1 | Collaboration and collective action as a partner-finding surface | Surfaces | PARK | open |
| S5 | The citation line wraps awkwardly in the narrow dock | Surfaces | PARK | cosmetic, polish later |
| S6 | The dev relay resolves imports differently from production | Surfaces | BONES | open |
| S11 | The free desk, and the console in the production shape | Surfaces | WALKTHROUGH | **built 2 Sep 2026** — Wellington's desk, the journey bar, ~~four tabs~~ one row from 7 Sep; **his chat live on it from 3 Sep; the desk plan's three slices landed 5–7 Sep** |
| S12 | The hero chat — a full page that is the conversation | Surfaces | PARK | **logged 3 Sep 2026, not built; parked as a later item by the maintainer's word, 9 Sep 2026** — the receiver (S13) lands on the desk without it |
| S14 | Typing dots — the book's third motion exception | Surfaces | PARK | **ruled 3 Sep 2026** — waits on the maintainer's hand into §5 |
| S15 | One row — the journey bar is the navigation; a candidate for production | Surfaces | PARK | **built 7 Sep 2026** — the tab row removed; offered to production by the maintainer's hand, later |
| S17 | The agent watches its Tool tab and comments; a pulsing teal dot on Chat | Surfaces | PARK | **logged 9 Sep 2026, parked for a design session, both sides** — no proposal yet |
| S18 | Agent Commons — a public gallery of graded knowledge packs, each wearing an agent face | Surfaces | PARTNER | **v0 done — slices 1 to 3 built and merged by 11 Sep 2026 (#68 to #70)**; slice 4 waits on Deb's per-case file; slice 5, the flag button, later |
| S19 | The Workshop — make your own agent on the Commons | Surfaces | PARTNER | **logged 11 Sep 2026, not built** — slice 3 has landed; the proposal is next, on the maintainer's word |
| S20 | "Connect with a human expert" on every Commons agent | Surfaces | PARTNER | **logged 11 Sep 2026, not built** — two design questions open for the session |
| S21 | Every tool exportable as an easy-to-read, properly cited document | Surfaces | PARK | **logged 23 Sep 2026 from the maintainer's word** — with or without answers; not started **Listed 26 Sep 2026 as open v1 work** — the done line says the screening report exports free |
| S22 | The Blocked row colour — the interim one, until the maintainer's pixels | Surfaces | PARK | **logged 3 Oct 2026** — a residue of A18; a raise for the brand book's §2.5 |
| S23 | The Commons check — Phoebe, Calvin and Bridget on the Commons to the v1 done line | Surfaces | PARTNER | **logged 3 Oct 2026 from the v1 done line** — build-order step 4; no proposal yet |
| D1 | Corporate water stewardship goals and target geographies | Data | PARK | open |
| D2 | Project points | Data | PARK | blocked on data |
| O1 | Rate limit on public chat | Operations | PARK | shipped 25 Aug 2026 at twenty; **thirty from 23 Sep 2026**, her ruling on the phase-tags proposal; still to revisit against real usage |
| O4 | Cosmetic and housekeeping items | Operations | PARK | left alone deliberately |
| O9 | The basemap now needs a key, and has a ceiling | Operations | PARK | live 27 Aug 2026, standing dependency |
| O12 | The map page is heavy — the renderer stalls on a basin redraw | Operations | WALKTHROUGH | **logged 7 Sep 2026**, not this slice |
| O13 | Phoebe's relay still says `validate()` — a banned word in old code | Operations | BONES | **logged 7 Sep 2026** — rename to "check" in a later hygiene pass, not now |
| O14 | Carries owed by the maintainer's hand — listed once | Operations | PARK | **adopted 18 Sep 2026**; each waits on her hand |
| O15 | Four storage keys show "Needs Attention" in Vercel | Operations | PARK | **logged 3 Oct 2026 from the maintainer's word** — check later; not looked at |
| C1 | Sweep every existing struck line into the archive | Cleanup | BONES | **logged 23 Sep 2026 from the maintainer's ruling** — the batch of 22–23 Sep is clean; every older strike waits; not started |

> **Renumbered 23 Aug 2026.** The previous identifiers were V1–V4, B1–B3 and P1–P8. Every
> reference to them elsewhere in the repository was updated in the same edit rather than left to
> rot: AGENT_RULES.md, [SESSION_HANDOFF.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md), `src/chat/evidence.ts` and
> `src/chat/EvidenceBlock.tsx`.

---

# Family: Knowledge

What the agents are allowed to know — card sets, the source corpus, and the methods behind a number.

Governed by [CITATIONS.md](./CITATIONS.md). Every item here ends in a card or a cited method, or it ends in an honest gap.

## K1. VWBA full-docs card pass

**A complete read of the VWBA manual, to identify the additional card sets Phoebe needs beyond
Eligibility and Feasibility.**

The card work so far has been driven appendix by appendix, on request. This item is the systematic
pass: read the manual end to end and report which further card sets are warranted — what each would
cover, which pages found it, and how it would relate to the sets that already exist.

The output is a written proposal listing candidate sets, not the sets themselves.

Opened 21 Aug 2026. Not started.

**Two full draft card sets already exist, ahead of this item's own scope.**
`activity-cards-vwba-DRAFT.md` (20 cards, Appendix C, the activity-type lookup) and
`definitions-cards-vwba-DRAFT.md` (34 cards, the glossary) sit untracked at the repository
root. Neither is approved, and neither is read by anything; the live Knowledge tab names both
as "not yet graded" drafts. On the maintainer's word, both are **parked until after v1** —
not graded this cycle, not folded into this item's proposal, and not deleted. The files stay
where they are.

## K2. Co-benefit quantification module

**Per-method cards — carbon methodologies, water quality benefit accounting, the SDG-tool pattern —
so that co-benefits get numbers wherever a method exists to produce them.**

Feasibility card B-7 asks whether a project delivers benefits beyond water volume, and names water
quality, water access, carbon, biodiversity, and social and economic impacts. But it leaves those
benefits describable only in words unless a method exists to quantify them. That asymmetry is
flagged on the card itself: the volumetric benefit has a prescribed method behind it, the
co-benefits often do not.

This module closes that gap where it can be closed honestly — one card per method, each carrying
its own citation and canonical link, so a co-benefit that *can* be quantified is quantified rather
than narrated. Where no method exists, that stays the answer.

Opened 21 Aug 2026. Not started.

**Pair K2/K7, 18 Sep 2026.** Item K7, the carbon card pass, is the carbon slice of what this item describes. K7 first and this after, or K7 folds in here, on the maintainer's word.

## K3. VWB Report Corpus

Collect and parse roughly ten public volumetric water benefit reports, then identify the must-haves
common to all of them, to shape the production report product.

Opened 20 Aug 2026; **no action taken yet**. The same cite-and-link posture applies — reports live
in `sources-local/`, which never publishes, and the repo carries citations and findings rather than
copied text.

## K9. Calvin's and Bridget's packs move to the new pack shape

**Logged 18 Sep 2026 from the maintainer's brief. Not started.** Her words, kept whole:

> Calvin's and Bridget's packs move to the new pack shape, one brief each, the way Phoebe's did.

**What the new shape is.** One folder per standard inside the seat pack, holding `cards/`, `tool/`,
`evals/`, a README and a changelog — the rule going forward from 17 Sep 2026, written in the
knowledge-packs tree README, with Phoebe's `phoebe-eligibility/vwba-2.0/` as the first pack in it
(item K8, archived). Calvin's seat, `knowledge-packs/calvin-quantify/`, and Bridget's,
`knowledge-packs/bridget-map/`, still hold the older `tools/<tool-id>/` shape from the scaffold of
16 Sep 2026, and the console reads Calvin's three method packs and Bridget's two datasets from code,
not from the tree.

**"The way Phoebe's did" is the method, not only the destination.** Move with `git mv` so history is
kept; every reader follows in the same change; prove the move first — whatever the site reads, saved
before and compared after, byte for byte — then fix what the move broke as a second commit; one
capture for her eyeball. Where a pack's live reader is a registry in `src/lib/` rather than a
markdown file, the proof is the built module's output before and after.

**Two briefs, one pack at a time, in the order she chooses.** Nothing moves before its brief.

**Calvin's brief (item A21) does not move his pack.** Its proposal leaves this item unchanged; the
pack move is its own brief, after step 5.

Logged 18 Sep 2026. **Not started. Bucket BONES.**

## K10. Phoebe ready for Deb's rig — cards reviewed, engineer notes split out, exam questions signed

**Logged 18 Sep 2026 from the maintainer's brief. Not started.** Her words, kept whole:

> Phoebe ready for Deb's rig. I review her cards. Engineer notes to me are split out of the card
> files so she does not read them as knowledge. Her exam questions are drafted for my signature,
> then exported.

**Three parts, in her order.**

1. **She reviews the cards.** Both card sets in `knowledge-packs/phoebe-eligibility/vwba-2.0/cards/`,
   read by her end to end. A maintainer job; the engineer's part is to make the read easy and to
   record what she rules.
2. **Engineer notes come out of the card files.** Today the generator embeds each card file whole
   into her prompt, so every line in it reaches her as knowledge — including the notes written to
   the maintainer, the "not yet cross-checked" lines, and the approval bookkeeping. The split moves
   those into a sibling file in the pack that the generator never reads, and leaves the cards as
   cards. Proof: the generated strings shrink by exactly the notes and nothing else; `check-cards`
   still passes; the Eligibility step reads the same.
3. **Her exam questions, drafted for her signature, then exported.** Questions are drafted here in
   plain words, one per card or per criterion as the review finds fit; she signs them; then they
   are written out in the rig's case shape. **The rig's shape arrives by her hand** (rule zero — it
   was read on 9 Sep 2026 and nothing of it is in this tree; see item S18, slice 4), and REAL ONLY
   holds: a case rests on a real project, never an invented one.

**Dependencies.** Part 3 waits on the rig's case shape and on Deb's per-case file (item S18, slice
4). **Recorded 3 Oct 2026, on the maintainer's word.** Part 1 is done: she has reviewed Phoebe's VWBA
cards. Part 2 was built as step 1 of the specialist contract (the grader notes now sit in
`vwba-2.0/cards/grader-notes.md`, #94). What is left is part 3, and Phoebe's done line of an 80%
pass, which is the rig's to say.

Parts 1 and 2 can go first. Proposal before any of it.

Logged 18 Sep 2026. **Not started. Bucket BONES.**

## K12. Three carbon route cards no card carries

**Logged 3 Oct 2026, a residue of item K7, moved out when K7 swept.** A carbon eligibility card
describes three fixes that no route card carries: the change of pump drive that cards T1 and M2 name,
and the justified sub-national area that card M14 names. Each would be a route card drafted from the
methodology, the documents it names as binding, or a held published project, and graded by the
maintainer like the other nineteen; a gap with no source gets no card. They are also listed on the
carbon pack's own page.

**Not started, and parked on purpose.** The v1 done line seals every card set at its version, and no
card is added until a real project fails on one.

Logged 3 Oct 2026. **Bucket PARK.**

## K13. A reading-grade figure for every route card and plain-words line

**Logged 3 Oct 2026, a residue of item A18, moved out when A18 swept.** The guide-not-gate proposal
asked that `check-cards` print a reading-grade figure for every route card and plain-words line
against a grade-6 target, printed and not enforced (her rider on R8, 23 Sep 2026). It was not built.
It is not a threshold: it is a number on the page, and a threshold would change only on her word.

Logged 3 Oct 2026. **Not built. Bucket PARK.**

# Family: Agents

How agents behave, what they may say, how they hand off, and who staffs which post.

Governed by [AGENT_RULES.md](./AGENT_RULES.md). Every item here is read against it, and the
specialist contract's ten lines are the standard each specialist is held to.

## A5. Primer review against the abstention log, once there is real traffic

**Logged 27 Aug 2026, on the maintainer's ruling. Not due, and deliberately not blocking
anything.**

The agent handoff primer (item A3) was written from the rules: from
[AGENT_RULES.md](./AGENT_RULES.md), the staffing ruling of 24 Aug 2026, and what each surface
actually holds. **It was not written from real questions**, and `agent-primer.md` says so in its
own closing section rather than leaving it to be discovered.

**The reason is that there are no real questions yet.** The abstention log (item A1) holds only
test entries, so reading it would teach nothing about what visitors actually ask. The build plan's
instruction to read the log before writing the primer was good reasoning about a log that had
something in it; it does not apply to one that does not. **Maintainer's ruling, 27 Aug 2026:
write the primer from the rules, wire it in from the rules, and log this review for later.**

**What the review is.** Once real visitors have been asking Phoebe questions she cannot answer,
read the log and check the primer against it. Two things to look for:

1. **Gaps that are another agent's subject** rather than a missing card — those are what a primer
   exists for, and any the primer does not already cover belong in it.
2. **Anything no agent covers at all** — which is a fact about the product, and belongs in the
   primer's own list of honest limits rather than being quietly left out.

**What it is not.** It is not the grading of the log, which is item A1's purpose and a maintainer
job: deciding for each gap whether it is a legitimate limit of the card set or a card to write.
This item only asks whether the primer's account of who covers what survives contact with real
questions.

**What "done" looks like:** the log read against the primer once there is traffic to read, and
either the primer corrected or a line recording that it held up.

Logged 27 Aug 2026. **Waiting on real usage, which does not exist yet — the same condition that
holds item O1's revisit of the number twenty.**

---

## A10. Wellington's answers run long

**Logged 3 Sep 2026 as debt, by the maintainer's instruction. Not for now.**

The target is two or three plain sentences. On the walk his replies ran to four, sometimes five,
against that target — the first-turn reply in the captures was four. Every one routed correctly
and quoted no figure; the fault is length, not substance.

**What "done" looks like:** a measured pass on the prompt's length rule, reported the way item A6
was — counts, not impressions — and a check that reads sentence counts off a walk. Tightening
comes later, on the maintainer's word.

Logged 3 Sep 2026. **Open, not due.**

## A12. The two chats not built — Bridget's and Calvin's

**Adopted 18 Sep 2026 in the maintainer's triage**, from item A2 (Bridget's chat, "coming") and item S10
(Calvin's chat, "not scheduled"), both now archived. One row, not two, because they are the same
kind of thing: an agent with a screen, a Tool tab and a Knowledge pack tab, whose Chat tab carries
one plain line and no composer.

- **Bridget** opens on the map. Her chat would receive the handoffs the primer already points at her
  for (item A3, archived, named this: pointing at her has to mean the map itself until she answers).
- **Calvin** opens on the calculator. His chat would move the step's gates into his conversation and
  fill the toggles from his answers (item S10, archived).

Both would run on Phoebe's proven pattern — an endpoint of their own, a daily cap of their own, the
same guards, every setting stated in code — and both panels say plainly today that the chat is not
built. Honest states hold.

**Updated 3 Oct 2026.** Calvin's chat is now item A21, build-order step 5; this row holds Bridget's chat
only. Her hello on the v1 done line is item A22, step 6, and is not a chat. Both are read against the
specialist contract's ten lines; the table on each pack README says where they stand.

Logged 18 Sep 2026. **Not scheduled. Bucket PARK.**

## A14. Screen host role words — one home

**Logged 18 Sep 2026 from the maintainer's word, at the merge of the one-roster pull request (#91).
Not fixed now.** Her words:

> Log one row, do not fix now: the screen host records for Bridget and Phoebe carry their own role
> words ("Map", "Eligibility and Feasibility"). They are not drawn and the check does not read them.
> Either they go, or the check reads them. One home.

**Where they are.** `src/components/BridgetScreen.tsx` carries `role: 'Map'` and
`src/components/PhoebeScreen.tsx` carries `role: 'Eligibility and Feasibility'` on their `AgentHost`
records. The chat header (`src/screen/ScreenChat.tsx`) draws a host's role beneath the name, so
Phoebe's is on screen today and Bridget's would be the day her chat goes live, reading "Map" where
her crew card reads "Partners". `scripts/check-roster.mjs` reads the crew file, the shelf, the
primer and Wellington's prompt, and not these.

**The two ways, for her ruling.** Either the field goes and the header reads the crew file's role
through `crewMember(name).role`, so the word is typed once; or the check walks each `AgentHost`
record and holds its `role` to the roster's seat label, which would trip Phoebe's today. The first
is smaller and is the one-home rule applied; the second keeps a second copy and guards it.

**Not scheduled.** Bucket BONES.

## A20. Phoebe's runaway call is cut off at 120 seconds, not prevented

**Logged 3 Oct 2026, a residue of item A6, moved out when A6 swept.** One request in seventy-five
spent all 16,000 output tokens on Phoebe and ran more than a hundred seconds against a normal twenty.
Switching her to Opus 5 did not remove it, and a change of effort did reach it, so it is ours and not
upstream weather. The relay's own 120-second timeout (`CALL_TIMEOUT_MS` in `api/phoebe.ts`, the same
in `api/wellington.ts`) ends such a call; nothing prevents it. The false "Invalid request data" 400
is upstream weather, guarded by one retry that costs a visitor nothing.

**What "done" looks like:** a real count of runaway calls once there is real traffic, then either a
smaller budget with a measured reason or a line saying the timeout is enough. Revisit with items O1,
A5 and O9, which wait on the same usage.

Logged 3 Oct 2026. **Bucket PARK.**

## A21. Calvin's brief — his chat, the carried engine, carbon beside water

**Proposed 27 Sep 2026 as `PROPOSAL_calvin-brief.md`, untracked at the repository root. Build-order
step 5 under "V1 — the done line". Nothing is built.** Calvin talks; picks the pack from the record;
asks only for what is missing; and his carbon number comes from the engine carried at `carried/`, the
same engine as the paid site. His done line is that the Malawi test project gives the same number on
both sites.

**Her rulings of 1 Oct 2026 on its §13.** R2 to R11 are all yes, each recorded in the proposal as
"Ruled 1 Oct 2026: YES.", with these notes: R5, days at 347 and water quality at 100% show as
ASSUMED, each with a slider; R6, a country missing from the UN household file, Calvin asks; R7,
"every value used" means inputs, never results; R8, carbon sits beside water when Phoebe reads likely
or not enough known; R11, Calvin writes only the class and people served to the record. **R1 is
still open:** whether the strings the manifest flagged in `presets.ts`, `emissions-legacy.ts` and
`quantity.ts` publish as they are. It waits on the engine scrub and the re-seal at v0.16.1, which is
Shell A's and hers to carry. Nothing is built until it arrives. Step 5 also carries the teal baseline
marker (her ruling of 24 Sep 2026), a design value she carries from production.

Logged 27 Sep 2026; rulings 1 Oct 2026. **Bucket BONES.**

## A22. Bridget's hello — she introduces herself, says what the map shows, hands back

**Logged 3 Oct 2026 from the v1 done line, which was not an item before. Build-order step 6. No
proposal yet.** The done line for Bridget: the map and the pin as they are today; she introduces
herself, says what the map shows, and hands back. It is not her chat (item A12 holds that, parked).
Item A14, the role word on her screen host record, reads "Map" where her crew card reads "Partners",
and is the first thing her hello would show; it goes before or with this.

Logged 3 Oct 2026. **Not started. Bucket BONES.**

# Family: Surfaces

What a visitor sees and works with — the map, the worksheet, the chat layer.

Every item here ends in something on screen, so the maintainer’s browser review is the gate.

## S1. Collaboration and collective action as a partner-finding surface

**Regional collective action groups as a way to find partners.**

Feasibility card B-10 does something unusual: it goes past evaluating an opportunity and suggests
joining a regional collective action group, or helping start one, as a way of finding and
supporting projects. That makes collective action a *surface* rather than only a consideration —
something a user could be pointed toward, not merely asked about.

This item is that surface: what such groups exist, where, and how someone would reach them. It is
the natural companion to D1 — one finds who funds work in a place, the other finds who is already
organised there.

Opened 21 Aug 2026. Not started.

## S5. The citation line wraps awkwardly in the narrow dock

**Cosmetic. Logged 24 Aug 2026 in the maintainer's browser check, and deliberately not fixed.**

The expanded citation — document, version, section, page, then the link — is one line by design, and
in the chat dock's narrow column it wraps in a way that reads poorly. Nothing is lost or hidden;
every part of the citation is present and the link works. It is the shape of the wrap that is wrong,
not the content.

**Polish later.** Fixing it well probably means deciding what may fold and what must stay together —
the version is the part most likely to be droppable to a second line — rather than nudging the
spacing until one width looks right.

Related: the collapsed legend strip on the map wraps at very narrow columns too, recorded in the
cosmetic and housekeeping list under Operations. If both are addressed, they are one piece of work
about narrow columns rather than two.

**Folded in, 18 Sep 2026:** the rail-width rider from the design canon, carried by item S8 and then by S9 — widen the left rail modestly when it is next opened for another reason. It is the same narrow-column work as the two wraps. Pair S5/O4.

## S6. The dev relay resolves imports differently from production

**The one path that could catch a production-only fault is the path that behaves least like
production.** Opened 24 Aug 2026, after it caused a live outage. **It caused a second one the same
day, within the hour, before this item had even been read.**

Phoebe's relay is served in development by a plugin in `vite.config.ts` that loads the same handler
Vercel deploys. That was deliberate — one handler, no second copy to drift — and it is still right.
But **Vite resolves module paths and Node does not resolve them the same way**. In production the
handler is compiled and run by plain Node, which requires a local import to name the file exactly,
extension included.

**What it cost.** Two imports in `api/` named their files without an extension. Every check passed:
the type checker was set to a mode that assumes a bundler will sort the paths out, and the dev relay
resolved them happily. Phoebe answered perfectly on a laptop and could never have answered once
deployed. The deploy was green, the key was correct, and every message returned a 500.

**What was done about it.** The two imports were corrected and the api folder's type-check mode was
changed to match how the code actually runs, so an extensionless import is now a build failure
rather than a production one. That guard was confirmed by removing an extension on purpose and
watching the build stop.

### The second outage, an hour later

With the imports fixed, every request still failed — and a `GET`, which should answer 405 in a
millisecond without touching the model, hung for over two minutes. That ruled out the model, the
token budget and the key.

The handler is written against the web standard: it takes a `Request` and returns a `Response`. It
declared `runtime: 'nodejs'`, which told Vercel to invoke it the Node way instead, handing it
`(req, res)` and waiting for something to be written to `res`. Nothing ever was, so every request
hung until the platform gave up.

**The dev plugin had been supplying the missing shape by hand** — reading the body, constructing a
`Request`, calling the handler, and writing the returned `Response` out itself. The handler had
never once worked in production and worked perfectly on a laptop every time.

The runtime override was removed. The dev plugin was narrowed so it stops compensating: headers and
method now pass through as they arrived rather than being defaulted, and a handler that returns
anything other than a `Response` fails loudly instead of being tolerated. The rules that keep it
honest are written at the top of `vite.config.ts`.

**The edge runtime was considered and rejected.** It would match the handler's shape unambiguously,
but it caps how long a response may take, and Phoebe is slow by design — she reasons through six
criteria before writing. Trading a hang for a truncation is not a fix.

### The third outage, the same evening

With the runtime override removed, every request still hung. Vercel's own build log finally named
it:

> default export returned a Response. The default-export signature is `(req, res) => void` —
> returns are ignored. Fix: export a fetch function or a named HTTP method.

**A default export is always invoked the Node way, whatever the runtime says.** The handler took a
`Request` and returned a `Response` to a caller that never reads return values, so nothing was ever
written. Two attempts to fix this by changing the runtime were both wrong, because the runtime was
never the variable.

The handler now exports `POST` and `GET` as named methods, which Vercel invokes the web way and
whose `Response` it uses. The dev plugin used to reach for `module.default` — **the one shape
production does not support** — which is the whole reason this looked fine locally for three
deploys. It routes by method now, exactly as Vercel does.

`scripts/check-api-exports.mjs` was added as a build gate: a default export under `api/`, or a route
file exporting no HTTP method, now fails the build in about a second. Both failure modes were
confirmed by breaking the file on purpose and watching the gate stop.

### Why this item stays open

The three guards close three specific differences. They do not close the gap that produced them.
Anything else the dev relay resolves, polyfills or tolerates that Node would not is still invisible
until it reaches production — built-in APIs, environment variables, streaming, response headers,
request size limits.

**Three times in one day is not bad luck.** Each one was invisible locally and obvious in
production, and each guard was written after the outage rather than before it. Every remaining
difference is a production outage that has not happened yet.

**What would close it.** Something that exercises the relay the way Vercel does before a push, or a
narrower guard set that names each known difference and tests for it. The first is better and
larger; the second is cheap and partial. Neither is designed yet.

**What not to do.** Do not fix this by giving development its own copy of the handler. Two copies
that drift is a worse problem than one copy resolved two ways.

## S11. The free desk, and the console in the production shape

**The console's fourth surface and its new shape, built 2 Sep 2026.** Maintainer's brief and
rulings A, B and C of that day; look pass against the saved production pages the same evening.

**The shape is production's.** Under the top bar the centre carries a journey bar of six phases —
Eligibility, Partners, Quantify open this site's surfaces; Plan, Monitor, Communicate are named,
quieter, do not click, and ~~one caption says~~ their title says they open with a saved project — ~~and a
row of four tabs: Dispatch, Eligibility, Partners (Map), Quantify, with a hairline after the first
and the row on its Tide rule~~ **and, from 7 Sep 2026, no tab row: the same row carries Dispatches
first, a hairline, then the six phases — item S15.** The desk opens first (ruling B). The left rail names the visit's project only,
unsaved, this visit. **Production is canon for the console's shape**: the journey bar's measure,
~~the tab row~~ (gone 7 Sep 2026), the row anatomy and the calculator's idiom were read from the saved markup and matched
— the look only, never their data, composers, organisations, roles or saving.

**Wellington's desk.** His header — **Team Lead**, the maintainer's naming ruling of 2 Sep 2026,
struck into the book's §6 the same day — a project-context card (name, place, standard of
interest; ruling A), a "Needs you" card of dispatch rows, the desk chat, and the one composer at
the bottom of the centre, honestly disabled with the maintainer's own sentence: *Wellington answers
on the paid site — here he organizes your next steps.* No live model is called. The right column on
the desk is the crew — Wellington, Phoebe, Bridget, Calvin — each face opening its own surface;
Wellington's count is the number of rows. **Wellington is extended, never forked**: the shared
portrait and the Tide accent, read from the token. He is not a post in the primer; Phoebe cannot
name him until the maintainer's sentence comes with the desk's second pass.

**The visit lives in the shell** (`src/lib/visit.ts`): context, the pinned basin, the eligibility
rows and every pack's answers, kept for this visit only. Nothing is written to storage; a reload
starts over and the page says so. **Rows derive from the visit and are never invented** — Phoebe's
once a criterion moves, Bridget's once a basin is pinned, Calvin's once a pack has a figure, and
always last **"Save this project and sign up"**. ~~That opens waterbots.ai in a new window and says
that nothing is carried across yet — the two-window fallback until the bridge (item S7) is real.~~
**From 8 Sep 2026 the row is the bridge**: the click seals the visit and the page moves to
production's sign-up with only a ticket in the address (item S7, archived). A row built from a pack's worked example says so first.

**The map pin.** A click on a basin pins it for the visit with the Tide stroke; a click on the
pinned basin unpins. The pin fills the place field if it was blank and never overwrites a typed
place. The pin is part of the basin layer's key, because a pin is a style and a handler and the
layer re-reads neither without a rebuild.

**Not exercised on screen:** Phoebe's row, which only her live answers move; the sitting made no
live model calls.

**Wellington's chat is live on it from 3 Sep 2026** — item A8 is its home. The composer's disabled
state and copy are gone; his replies land on the desk under production's divider, never on a row;
a route is one action under his turn. **The "standard of interest" chips died as a form concept the
same day**, by the maintainer's brief: the form keeps name and place, the kind of project lives in
his plain question, and a visitor who never chats loses nothing that blocks them. **The context
card says where each field came from** — typed, from the conversation, from the map pin — and a
typed entry is never overwritten by what he heard.

### The desk becomes the conversation — slice 1, 5 Sep 2026

**Maintainer's ruling 3 of 4 Sep 2026, from the reference she brought in by hand: the centre is the
conversation and nothing else.** The project context left the centre for the rail, where it is the
record Wellington's interview populates; the dispatch rows left for the crew column. The centre is
his header, the desk divider, his turns, the one composer. Eyeballed on four captures at one
viewport and given the commit word on 5 Sep.

**The project-context fields — ruled 5 Sep 2026, from Bob, and logged here and in the primer.**
Must-have at screening, asked in this order:

| # | Field | Who needs it |
|---|---|---|
| 1 | What it does — a short activity line | Phoebe, Calvin |
| 2 | Kind — water, carbon, or not sure; "not sure" stays valid | Phoebe, Calvin |
| 3 | Place — a country or named place, in words | Phoebe, Bridget before any pin, Calvin |
| 4 | Name | the desk only |

Slice 2 adds a fifth: the basin pin, via Bridget's map, after a place exists. **Off the rail until
Quantify:** rough people or household counts, the technology. **Never asked at screening:**
sign-up details, programmes or consortiums, a crediting period, baseline shares, project or leakage
emissions, planning or monitoring documents, worksheet numbers, published emission factors.
**Standing rules:** never invent a value; "not sure" is always a real answer; every field stays
typeable with no chat.

**One standing rule is not yet met, and is recorded rather than hidden.** "What it does" and "kind"
are heard only; the rail carries no control for them. Ruling 4 the same day shipped slice 1 with
fields 1 to 4 as built and no new controls, so the two typeable controls are owed to a later slice.

**Two look rulings the same day, built into the same pull request:** the caption saying the last
three phases open with a saved project is gone from the journey bar, and **the bar never scrolls** —
below the width its labels need it collapses to numbered rings, (1) to (6), with the label in the
title.

**The hero chat is a separate surface, not this one** — item S12. The console carry stands as
built: entering the console, the conversation comes along as the desk thread, and the desk drops
the noise around it.

**Slice 2, built 7 Sep 2026 — the basin pin via Bridget.** Her row appears once a place is known,
from typing, from Wellington's interview, or from a pin, and asks for the pin; a pinned basin fills
it with the basin's published reading, the Level 4 line still saying derived. A visit with no place
shows no row of hers. Three eyeball rulings from the same day landed in the same pull request:
**the desk's composer is production's to the pixel** — one line, 13px, the card plane, 816px, the
desk column narrowed to match; **plain words in Wellington's prompt** — never "seat", "console",
"dispatch", "rail" or "surface", facts and rules only, no scripted line, and the same words taken
out of what he reads and out of the desk's own page copy; and **the prompt size gate raised to
24,000 characters** — the engineer's call, accepted after the fact, and gates change on the
maintainer's word from here. Bridget's and Calvin's dock copy still says "console"; not this slice.

**Slice 3, built 7 Sep 2026 — Phoebe's row closes the loop.** Her verdicts had reached her row
through the criteria since 2 Sep; nothing Wellington learned reached her, and her panel asked the
visitor to say it all again. Now the four record fields ride with each of her requests as a second
system block after the cache breakpoint — the visitor's own words, checked on the relay in
`api/_record.ts`, never a verdict, never a figure, never the desk conversation's turns — and her
opening reads the record back. Walked with real calls: she started from the record, moved nothing
until she had evidence, then moved one criterion to met and one to not yet, and the desk showed
her row. Pull request #54.

**The three slices are done.** What remains of the desk plan is the two typeable controls owed
for "what it does" and the project type (the control for "kind" retired with "kind" on 24 Sep 2026,
item A16), and whatever the hero page (item S12) asks of the desk.

Built 2 Sep 2026. **Open as the home for the surface's story.**

**Bucket WALKTHROUGH, 18 Sep 2026.** The open remainder is the two typeable controls for "what it does" and the project type ("kind" retired 24 Sep 2026, item A16); a visitor who never chats cannot fill them today. Everything else here is built and is the story's record.

### The build note, 23 Sep 2026

**Her ruling, in her words:** "one honest line on the free site's desk: the site is under build;
look around; the agents and the free screening are being built so a visitor can find out whether
their project is a good fit for impact funding; ask Wellington for a build update. Wellington gets
a dated build-update fact he phrases (what is built, what is next), refreshed at every close-out;
add that line to the close-out ritual." **Built the same day:** the line above his chat on the
desk, in her words; `knowledge-packs/wellington-host/build-update.md` with an agent-facing region
generated into his prompt as "The build update", dated, facts he phrases only when asked;
`check-wellington` holds that it is present, dated and unscripted; step 8 of the close-out ritual
in PROCESS_RULES refreshes it. Measured run on the pull request; capture in the For Amy block.

## S12. The hero chat — a full page that is the conversation

**Logged 3 Sep 2026, by the maintainer's confirmed shape. Not built. Waits on a demo reference
arriving in `Design refs/` by her hand.**

**The shape, for the record.** A visitor who types into the production landing's question box is
handed to this site with the question carried (item S13). This site receives it and opens the hero
chat as its own full page: **the whole viewport is the conversation** — not a section beneath a
landing, not a boxed panel on a page. Built to the demo reference, which sets the bar for its look:
signed agent bubbles with a name-and-role eyebrow, distinct visitor bubbles, typing dots while
Wellington thinks (item S14), a simple input. This site's own visitors can reach the same page.
Beneath the chat, two quiet doors: sign up or sign in on waterbots.ai, and explore the open console.

**The console carry stays as built.** Entering the console, the conversation comes along as the desk
thread — one thread, never a second panel, never duplicated. The machinery for that is already
live: the shell holds Wellington's one conversation (item A8), and any second frame around him
shows it.

**What was rejected, and why it is recorded.** On 3 Sep 2026 the engineer built a landing page in
front of the desk — a headline, a question box, a boxed chat section beneath it, two doors — and
the maintainer rejected it entirely: a new landing was invented, and a small boxed section is not a
hero chat. Nothing of it was kept or committed. **The current landing does not change — not its
headline, not its copy, not its layout — ever, without her word.** Recorded so it is not rebuilt
from the same misreading.

**What "done" looks like:** the page built to the reference, the pixels approved, and one thread
from the porch into the desk confirmed in the browser.

Logged 3 Sep 2026. **Not built. Waiting on the reference file.**

**Parked, 9 Sep 2026, by the maintainer's word:** a later item, not built. The receiver (item S13)
was built the same day without it — a carried question lands on the desk, which is Wellington's
screen, rather than on a hero page. When the hero chat is built, the same receiver feeds it: the
shell holds the one conversation and any frame around it shows the thread.

## S14. Typing dots — the book's third motion exception

**Ruled 3 Sep 2026, by the maintainer. Waits on her hand into the brand book's §5.**

BRAND.md §5 says almost nothing moves on its own and names two exceptions: the live dot and the
landing hero's ripple. **Typing dots while an agent thinks are the third**, ruled for the hero
chat (item S12): **three dots fading in turn, by opacity only — nothing slides, nothing bounces —
and stopped under reduced motion**, where the agent's thinking line reads in their place so the
state is never silent.

**They were drawn once and discarded with the rejected landing surface**, so nothing in the code
carries them today. When the hero chat is built, the comment where the dots live records this
exception until the book carries it.

Ruled 3 Sep 2026. **Waits on the maintainer's hand into §5. No build until item S12.**

## S15. One row — the journey bar is the navigation; a candidate for production

**Maintainer's ruling, 7 Sep 2026, built the same day on pull request #51's branch.** The open
site has one row, not two. The tab row is removed; the journey bar is the navigation. The row reads
Dispatches | Eligibility · Partners · Quantify · Plan · Monitor · Communicate.

- **Dispatches sits first with a hairline after it.** It is the desk, not a phase: no dot, no
  number, and it never fills.
- **Eligibility, Partners and Quantify click** and open the screening tools — Phoebe's screen, the
  map, the calculator. The phase names stay canon (item A11); no tool name sits on this row.
- **Plan, Monitor and Communicate stay named, quiet, no click, no caption.** Their title says they
  open with a saved project.
- **At narrow widths the bar collapses to rings (1) to (6)**, and Dispatches keeps its own mark — a
  ring holding a dot rather than a number, the engineer's reading of "its own mark", because the
  desk has no number on the road.
- **The tab row's Tide rule left with the tab row.** The bar keeps its own hairline. The engineer's
  call; the rule was the tab row's device, not the bar's.

**A candidate for production, later — Shell B to Shell A.** Production carries two rows, the journey
bar and a tab row of tool names. This one-row shape is offered to production by the maintainer's
hand when she chooses; nothing here fetches from or writes to the other repository (rule zero).
Logged, not scheduled.

**Agents point at the step, never at a tab** — "the Eligibility step", "the Partners step", "the
Quantify step"; the desk is "the desk" or Dispatches. The rule sits in
[AGENT_RULES.md](./AGENT_RULES.md) under Speech; item A11 records the naming rulings it belongs to.

---
## S17. The agent watches its Tool tab and comments — parked for a design session, both sides

**Logged 9 Sep 2026 from the maintainer's brief, at the close of the agent screen's four slices.**
In her words: *the agent sees everything the visitor does on its Tool tab and can comment on it.
When the agent comments, a pulsing teal dot appears on the Chat tab.* Both sides, B→A: this site
and production design it together.

**What it would change.** Today the Tool tab and the Chat tab of an agent screen (item S16) know
nothing of each other beyond the loop that already runs — Phoebe's verdicts move the worksheet's
rows, and the record goes to her with every ask. Under this item the agent also sees what the
visitor does on the tool — a basin pinned, a criterion opened, a figure typed — and may say
something about it on the Chat tab, unasked. The visitor is told there is something to read by a
pulsing teal dot on the Chat tab and nothing louder.

**Open questions for the session, in the maintainer's words.** None is answered here:

- What the agent may change.
- What the visitor may change.
- What saves from each.
- How the two are told apart.

**Two things the rulebooks already say, for the session to weigh rather than for this item to
decide.** First, the brand book's §7 says only the Live dot pulses, and §2.6 says a status may only
be a dot or a keyline while an identity may never be a dot — so a pulsing teal dot on the Chat tab
is a status signal ("live", something new) and not the agent's colour, and Bridget's Surf and the
live teal being one value (§2.6, the form carries the meaning) is exactly the case the book
anticipates. Second, agents speak under AGENT_RULES.md — short, one thing at a time, in a visitor's
words — and a comment made unasked is still a turn under those rules; nothing is scripted and
nothing is invented from what the visitor did not do.

**Parked.** No proposal is owed until the design session has met; nothing is built toward it.

Logged 9 Sep 2026. **Parked for a design session; no proposal yet.**

## S18. Agent Commons — a public gallery of graded knowledge packs, each wearing an agent face

**Logged 9 Sep 2026 from the maintainer's rulings of that day.** The rulings already made when the
proposal was asked for, in her words: *name "Agent Commons"; word "knowledge pack"; a public gallery
of graded knowledge packs wearing an agent face; scroll the agents and see what each is good at;
open one → its agent screen (Chat · Tool if any · Knowledge pack · Credentials), no memory, capped
chat; Credentials is the read-more ladder with "not yet graded" when true; a flag button on each
case later; free to explore; sign up to manage a project.*

**Two rulings the same day, into canon.** Both are recorded in [CLAUDE.md](./CLAUDE.md)'s scope and
pointed at from here.

- **ONE GRADER.** In her words: *Deb's rig is the only public grade. The Commons shows Deb's rig's
  card and nothing else; this site's and production's own evals are internal gates, never a public
  score. Credentials on the Commons reads "not yet graded" until a real card from Deb's rig exists.*
  "Deb's rig" is the grading harness kept outside this repository, in Deb's own private one; it was
  read on 9 Sep 2026 through the GitHub API by the maintainer's word, nothing cloned and nothing
  changed, and rule zero stands — anything it needs is a written note the maintainer carries to Deb
  herself.
- **REAL ONLY.** In her words: *Grades on the Commons come from real projects and real knowledge
  packs run through Deb's rig. No invented cases, ever.*

**The proposal, approved as written on 9 Sep 2026.** *Where it lives:* its own address,
`map.waterbots.ai/commons`, opened by one word, "Agent Commons", at the right of the top bar and
never on the journey bar, which stays the journey; one rewrite rule for Vercel, since the site has
none today; no left rail, no record, no save button; the crew stays in the right column, and where
the save button sits reads "Sign up to manage a project", a plain link to production. *The shelf:*
one card per knowledge pack, wearing the face of the agent who holds it, one line on what it is
good at, a version tag and a state chip, read from the registries that already exist — Phoebe's
cards, Calvin's three method packs, Bridget's two datasets — and nothing typed twice; Wellington
carries no knowledge pack and has no card, and the shelf says so in a line. *Open one:* the
built-once agent screen as its third consumer, memory-less, its chat capped on the same counters,
no "Next phase" because there is no journey here, a back row naming the pack once.

**Slices, in order, images first.**

1. **Pictures** — three at 1280 by 720: the shelf; Phoebe's pack open on Chat; Calvin's open on
   Credentials. **Drawn 9 Sep 2026 inside the running app by script over the real frame**, one real
   turn to Phoebe, in the pull request's For Amy block for her eyeball.
2. **The address and the shelf.** Approved to build, on her approval of the pixels.
3. **Open one** — the screen as the third consumer, the sign-up link in place of save. Approved to
   build.
4. **Credentials fed by Deb's rig.** **Waits on Deb.** The three changes his rig needs, which the
   maintainer takes to him herself:
   - **Save the per-case answers and the judge's calls.** Today the rig keeps three things per case
     after grading — the case id, the verdict (pass, abstain or fail) and the failure lines — and
     discards the agent's answer and its tool calls. Its test command prints and saves nothing. Its
     trust-card command re-runs every case a second time to get the claims back and writes one
     gitignored markdown file: counts, a knowledge rate, the claims with what they cite, the failure
     lines; a passing case shows no rule checked, the project facts are not in it, tool calls are
     not in it. The questions and the judge's rules are already saved, one YAML file per case under
     the pack's `tests/cases/`: the description, task and project block are the question, the
     `expected` block is the rules. The smallest change, about 25 lines: keep the output and tool
     calls on the per-case result, and write a JSON file beside the markdown with one record per
     case — id, description, task, project, the expected block, output, tool calls, verdict,
     failures — plus pack id and version, agent name and version, and the date; then stop ignoring
     it. His repository is private, so the file still reaches this site by her hand.
   - **Sit this site's live agents.** The rig's reference agent calls no model by design; it reads
     the pack's YAML and formulas and is deterministic. A public grade of Phoebe or Wellington needs
     their relays sat, not the reference agent.
   - **Real cases.** His own design notes say the existing exam cases use invented Kilifi and
     Turkana projects that do not meet the no-fabricated-data rule; the VWBA case 001, on a real
     Meta 2023 report figure, is the exception. Under REAL ONLY none of the invented ones can show.
5. **The flag button** on each case. Later, not v0.

**Calls made in slice 1, each stated in the pull request.** Picture 3 shows Calvin's Credentials
tab rather than Tool, because Tool is the calculator already approved on 9 Sep 2026 and unchanged,
and Credentials is where the day's rulings show. The built Credentials tab says the score is the
maintainer's; the picture's wording moves it to the one public exam, per ONE GRADER, in a visitor's
words — a text change owed to slice 3. The chip reads "not yet graded" on the shelf and on
Credentials alike. Phoebe's card is one card for her two card sets, because her Knowledge pack tab
is one pack; Bridget's is one card for the map's two datasets for the same reason.

**Real model calls in slice 1: two.** One to Phoebe, intended, for the second picture. One to
Wellington, by mistake: the script sent to the first composer it could see, and every mounted
screen's panel reports itself visible. The answer was not used and the script was corrected.

**#68 merged on 10 Sep 2026, and the pictures were approved with one correction — the maintainer's
ruling, which she dated 11 Sep 2026.** In her words: *in the Commons an agent opens ALONE. No crew
rail, no other agents beside it, no next steps. It is a contained unit — open, chat, leave. The only
other thing on the screen is the way out: back to the shelf, and "Sign up to manage a project". Fix
the layout in slice 3; no new picture needed.* Slice 3's shape in the proposal above is corrected by
this: ~~the crew stays in the right column~~ — on an open pack there is no right column, and the two
ways out are the only other things on the screen. The shelf's picture stands as approved, crew and
all. The ruling is recorded in [CLAUDE.md](./CLAUDE.md)'s scope and pointed at from here.

**Slice 2 built, 11 Sep 2026.** *The address:* `/commons`, one home in `src/lib/pages.ts` — a page,
not a surface; one rewrite rule in `vercel.json`, the site's first; the browser's back button works;
the console is hidden under the Commons and never unmounted, so a conversation and the drawn map
survive the step out and back. *The word:* "Agent Commons" at the right of the top bar on both pages,
in ink and bold when it is the page; the wordmark is the way back. *The shelf:*
`src/lib/commonsShelf.ts` assembles the five cards from the registries — Phoebe's from her card sets,
Calvin's three from the method packs, one card per live pack, Bridget's naming the map's two
datasets — and `CommonsShelf.tsx` draws them; `CommonsRail.tsx` lists the crew and carries the
sign-up door where the save button sits. The roster moved out of the crew rail into `src/lib/crew.ts`
and the row into `CrewRow.tsx`, so the console's rail and the Commons' column draw the same four
from one place.

**Calls made in slice 2, each stated in the pull request.**

- **No "Open" on a card yet.** The picture shows one; it arrives with slice 3, when there is a
  screen to open. A link to nowhere is a false affordance.
- **The crew rows on the shelf are a listing, not doors.** Same look, no hover, no hand: on the
  Commons an agent is opened from its pack's card, and a row that quietly left for the console would
  be a side door. One prop flips it.
- **The cards read the registries' own sentences, and they run longer than the picture's.** The
  picture's one-liners and short tags were hand-written for the drawing; the rule that nothing is
  typed twice puts each pack's own `measures` sentence and its citation's document name on the card
  instead. The cards are taller than drawn and the shelf no longer fits one laptop screen. Two ways
  to close it, hers to pick: keep the registry's words, or add a short shelf line and a short document
  name to the pack registry, once, and read those.
- **The sign-up door goes to waterbots.ai's front door**, not the bridge's welcome address, which
  expects a ticket. It moves on her word if production has a sign-up address.
- **The date.** The machine's clock read 10 Sep 2026 while this was built, five minutes after #68
  merged; the maintainer dated her rulings 11 Sep. Her date is the one recorded.

**Two faults found in the first browser walk, both fixed before the commit.** The desk showed
through the shelf: each console surface's wrapper set its visibility to "visible" outright, which
overrides a hidden ancestor — the same fault the agent screen's panels had in item S16 slice 4,
fixed the same way, the open surface inherits. And the back button landed on the same page: the
history push sat inside a state updater, which React's development mode runs twice; it is outside
it now.

**Real model calls in slice 2: none.**

**#69 merged and slice 2 approved, 11 Sep 2026, with two rulings.** In her words: *(1) each card
gets one short "good at" line and a short document name — draft the lines, I approve on pixels;
(2) no crew rail on the shelf — the shelf is the crew. Shelf plus "Sign up to manage a project"
only.* Both landed with slice 3. The lines and short names are drafted into the pack registry once —
`shelf: { line, document }` on each method pack, in the slice 1 picture's own words — and the shelf
reads them; Phoebe's and Bridget's lines were already short and stand. The crew column is gone from
the Commons entirely, and with it the static crew row.

**Slice 3 built, 11 Sep 2026 — open one, alone.** `Commons.tsx` is the page: one row under the top
bar carrying the sign-up door and, when a pack is open, the way back and the pack's name once —
"‹ Agent Commons / Phoebe's knowledge pack · Eligibility and feasibility cards", the slice 1
picture's row. Nothing beside the centre. `CommonsSeats.tsx` holds the three seats on the one agent
screen as its third consumer: Phoebe's with her own conversation, asked with no record, and a
worksheet of the seat's own that her verdicts move; Calvin's with a calculator of its own, opened on
the pack whose card was clicked; Bridget's with her datasets and Credentials, no map. No "Next
phase" anywhere. A seat stays mounted once opened. The hosts, the pack views and the Credentials tab
are the console's, exported and never re-typed. The Credentials tab now says the grade is the one
public exam's, on every consumer — the text change owed from slice 1.

**Calls made in slice 3, each stated in the pull request.**

- **Tool depth.** Phoebe's worksheet and Calvin's calculator come to the Commons with state of their
  own; Bridget's map does not, because it is drawn once on the Partners step and a second copy would
  fetch the basins again. Her Chat line says where the map is.
- **A separate conversation per consumer.** The Commons' Phoebe is not the console's thread with the
  record taken off; it is the third consumer's own, as production's will be. One conversation per
  agent per consumer.
- **The same caps.** Her twenty a day are the same twenty here; the composer's note says so.
- **No address per pack.** Opening is state, not a path; a reload returns to the shelf. A path per
  pack is one line in `pages.ts` and one rewrite rule, on her word.
- **The eligible banner keeps its words and loses its button** on the Commons, where there is no map
  to open.
- **The capture shows the answer, not the header.** The transcript follows the newest turn, as on
  the console, and her answer is long enough to scroll the header above the frame.

**A fault found in the browser walk and fixed before the commit.** The agent screen built its tab
and panel ids from the host's name alone, so the console's Phoebe and the Commons' Phoebe shared
ids while both were mounted. The screen now takes an id slug from its consumer.

**Real model calls in slice 3: one**, to Phoebe, intended, for the capture.

Logged 9 Sep 2026. ~~**Slice 1 drawn; slices 2 and 3 approved to build; slice 4 waits on Deb.**~~
~~**Slice 1 approved with one correction and slice 2 built, 11 Sep 2026; slice 3 next, on the
corrected shape; slice 4 waits on Deb.**~~ ~~**Slices 1 to 3 built by 11 Sep 2026; slice 3 waits on
her eyeball; slice 4 waits on Deb.**~~ **#70 merged and slice 3 approved, 11 Sep 2026. Commons v0 —
slices 1 to 3 — is done. Slice 4 waits on Deb's per-case file, the first of the three changes above;
slice 5, the flag button, is later.** The three card lines and short names were approved with the
merge.

---

## S19. The Workshop — make your own agent on the Commons

**Logged 11 Sep 2026 from the maintainer's rulings of that day, for after the Commons' slices 1 to 3
(item S18). Nothing is built toward it; the proposal follows slice 3.** Her words, kept whole:

- *A visitor can make an agent on the Commons: name it, pick its colour, hand it a knowledge pack (a
  paper, a dataset), later a tool. Same agent screen. Aquaya wants this; their first try is one
  research paper.*
- *Cost model, in order: (1) free to try, tightly capped — one draft agent per visitor, one small
  pack, ten messages a day, gone when they leave; (2) bring your own key — the builder's agent runs
  on their bill, no cap from us; (3) builder subscription later, on demand — hosted, private drafts
  kept, one-click publish.*
- *Publishing: private until the builder publishes; publishing to the Commons is free but reviewed
  by Amy first.*
- *Format: every workshop pack is saved in BOTH shapes from day one — this site's cards and Deb's
  cartridge YAML — so any agent can sit his exam without rework. Grading stays manual until his rig
  can run on a trigger; log that dependency.*

The rig's own word for its pack file appears above only inside her quotation; everything written new
says "Knowledge Pack", per the language rules in [CLAUDE.md](./CLAUDE.md).

**Read against the canon already ruled, so the proposal starts from it.**

- **Same agent screen.** A made agent is the one screen's fourth consumer (item S16): Chat, Knowledge
  pack and Credentials, Tool later — and it opens alone, as every agent on the Commons does from the
  ruling above.
- **ONE GRADER and REAL ONLY hold.** A made agent's Credentials reads "not yet graded" until a real
  card from Deb's rig exists for it. This site grades nothing in public, and a builder's own checks
  are not a score.
- **BRAND.md §6 says nobody is minted here, and no accent points at a second agent.** A visitor's
  made agent is not crew, and its colour is the visitor's pick. That is a raise for the book, not a
  quiet exception; it goes up with the proposal.
- **No mock data.** A draft agent with no pack yet is an empty, honest state. No sample pack is ever
  invented for it, and a paper handed over is read as it is or refused with a reason.
- **The free tier is a counter of its own** — beside Phoebe's twenty, Wellington's thirty and the
  two tens, and revisited with them under item O1. "Gone when they leave" is the no-memory rule as it
  already stands. Bring-your-own-key puts a visitor's key through this site's relay; how it is held
  for one call and never kept is the proposal's first question.

**Dependencies, logged.**

- **Slices 1 to 3 of the Commons come first** (item S18).
- **The two-shape save** needs the rig's pack-file shape carried here by the maintainer's hand, as
  everything of Deb's is (rule zero). It was read on 9 Sep 2026 and nothing of it is in this tree.
- **Grading stays manual until Deb's rig can run on a trigger.** Until then a made agent sits its
  exam when the maintainer runs the rig by hand and carries the card back. The trigger is a fourth
  change to his rig, beside the three under item S18 slice 4, and she takes it to him.
- **Review before publishing is hers, by hand**, until there is a queue worth building a tool for.

**Not built. ~~Proposal after slice 3.~~ Slice 3 landed on 11 Sep 2026; the proposal is next, on the
maintainer's word.**

---

## S20. "Connect with a human expert" on every Commons agent

**Logged 11 Sep 2026 from the maintainer's rulings of that day, at the close of the sitting that
finished Commons v0. Nothing is built toward it.** Her words, kept whole:

> *"Connect with a human expert" on every Commons agent. A button on the agent screen, beside
> sign-up. House agents route to WaterBots consulting; workshop agents route to their builder if the
> builder opted in, else to WaterBots. Sends a short contact form only; the conversation is not
> kept, so nothing is attached unless the visitor pastes it. Free to click; what happens after is
> the human's business. Design questions for the session: the form's fields, whether the builder's
> contact is public or relayed through us. No build yet.*

**Read against the canon already ruled, so the proposal starts from it.**

- **Where it sits.** On the Commons an agent opens alone, and the only other things on the screen
  are the way back and the sign-up door (item S18's ruling of 11 Sep 2026). This button joins the
  sign-up door in that one row: a third thing on the screen, ruled by her, and the row is where it
  goes. Whether it is a second primary or a secondary beside the primary is a design question for
  the same session — the book's §7 has one primary per page.
- **Nothing is kept, so nothing is attached.** The conversation is not stored anywhere on this site
  and never will be by this item; the form carries only what the visitor types into it. That is
  the same line the composer already draws under every chat.
- **Two routes.** House agents — Phoebe, Calvin, Bridget, and any crew pack — go to WaterBots
  consulting. A workshop agent (item S19) goes to its builder only if the builder opted in when
  publishing, else to WaterBots. The opt-in is a field on the workshop's publish step, so S19's
  proposal should leave room for it.
- **Every line a visitor reads says what happens, in plain words** — what the form sends, to whom,
  and that the conversation does not go with it.
- **A form is a send** — the visitor's own words to a human, not to a model. It is not a relay call
  and counts under no agent's cap; it needs its own small guard against being fired blindly, which
  the proposal states.

**Design questions, hers, for the session.**

1. **The form's fields.** The smallest honest set is a name, a way to reach them, and a few lines
   of what they want; anything more is the proposal's to argue.
2. **Whether a builder's contact is public or relayed through us.** Public means the button is a
   plain link the builder gave; relayed means this site or production forwards it and the builder's
   address never shows. The second keeps a builder's address off a public page and gives a place to
   stop abuse; the first keeps this site out of the middle. The proposal states both.

**Dependencies, logged.** Workshop agents do not exist until item S19 builds; the house-agent route
can build first, on its own, once the two questions are answered. Where the form goes — an address,
a mailbox, production — is a fact the maintainer carries, never guessed here (rule zero).

**Not built. The design session comes first.**

---


## S21. Every tool exportable as an easy-to-read, properly cited document

**Logged 23 Sep 2026 from the maintainer's word. Not started.** Her words:

> Every tool, with or without answers, exportable as an easy-to-read, properly cited
> informational document.

**What it means.** Each tool on this site — the eligibility worksheet with its criteria, rows and
routes; the calculator with its fields and figures; the map with its pinned basin and its two
attributions — can be turned into a document a person can read away from the screen: the tool's
own plain words, every citation in the four-part shape of [CITATIONS.md](./CITATIONS.md), the
licence lines the data requires, and, where answers exist, the answers with their provenance and
the consultant-review tag. With no answers it is the blank tool, honestly blank. Nothing in it is
computed that the screen does not already compute, and nothing is kept here by making it.

**Read against the canon already ruled.** Estimates say estimate; derived values say derived;
Level 4 stress says area-weighted; both attributions stay separate; the bridge's rule that never a
computed number crosses to production is a rule about the seal, not about a document a visitor
takes for themselves. Format, look and where the door sits are the proposal's, from a captured
reference (design work starts from an image).

**The screening report is the first export, in the phase-tags shape — her ruling of 23 Sep 2026.**
From `PROPOSAL_phase-tags-by-nav.md` §7: the project's name, type and stage from the record; each
pathway with its applies result; the Eligibility rows with their states, routes, citations and the
readiness read; then the shown groups in the navigation's order, each row with its card's plain
words, its tag, its seat and its four-part citation, Not yet checked as they honestly are; the
paid-site tools line; the two licence lines where a pin is on the record; the consultant-review
tag. Blank rows stay blank. Third in the next order, with the Knowledge tab.

**Not scheduled. Proposal first. Bucket PARK.**

## S22. The Blocked row colour — the interim one

**Logged 3 Oct 2026, a residue of item A18, moved out when A18 swept.** Blocked rows reuse
`--state-pending` with the word "Blocked" until the maintainer's pixels. The brand book's §2.5 has no
stopped state that is not an error, so a stopped-but-not-wrong colour is a raise for the book by her
hand. Design work starts from an image: a captured reference comes before any proposal.

Logged 3 Oct 2026. **Not started. Bucket PARK.**

## S23. The Commons check — Phoebe, Calvin and Bridget on the Commons to the v1 done line

**Logged 3 Oct 2026 from the v1 done line, which was not an item before. Build-order step 4. No
proposal yet.** The done line for the Commons: Phoebe and Calvin work there too, with no memory;
Bridget introduces herself; and Calvin has two cards on one engine, screening and transition.
Commons v0, slices 1 to 3, is built (item S18); Credentials from Deb's rig (slice 4) is not part of v1.
Calvin's work there waits on item A21.

Logged 3 Oct 2026. **Not started. Bucket PARTNER.**

# Family: Data

Where real, verifiable data comes from, and whether it exists yet.

The no-fabricated-data rule in [CLAUDE.md](./CLAUDE.md) is the whole difficulty in each of these. An empty, honest state beats a fabricated one.

## D1. Corporate water stewardship goals and target geographies

**Public data — CDP disclosures, corporate sustainability reports — mapped to basins, so Bridget
can answer "who funds water work here?"**

The map already shows where water stress is. It cannot yet show who is doing anything about it.
This item is the layer that would connect the two: publicly disclosed corporate water goals and the
geographies they name, resolved to basins so the question can be asked spatially.

**The usual bar applies and is the whole difficulty.** Disclosures are public but uneven — a
company may name a country, a river, a watershed, or nothing locatable at all. Anything placed on
the map must be traceable to the disclosure it came from, and anything approximate must say so
where it renders. No inferred coordinates.

Opened 21 Aug 2026. Not started.

## D2. Project points — the blocked step

Nothing goes on the map until it can be verified. For each point the build needs:

1. The **registry** and a link.
2. **Project ID, name, developer, country** as that registry states them.
3. **Coordinates as published**, plus the retrieval date.

**The likely snag:** public carbon registries often publish a country or region but not point
coordinates. If so, the honest options are to ship basins only, or to place points at a documented
administrative centroid, visibly labelled approximate in both tooltip and legend. **A dot at a
plausible-looking spot is not one of the options.**

The prior prototype's hardcoded project array is **not** a source — its coordinates are rounded to
~0.05°, which reads as hand-placement.

---

# Family: Operations

The deploy, the repository, settings and limits that outlast the session that made them.

Little of this is product, and several are not repository files at all — they are live settings the maintainer changes by hand.

## O1. Rate limit on public chat

**A cap of 30 messages a day per visitor is live in production.** It was 20, from the maintainer's
ruling of 21 Aug 2026, built on 25 Aug 2026, until 23 Sep 2026 (the move is below); it was confirmed
in a preview deployment and again against `map.waterbots.ai` after merge. The code says 30:
`DAILY_CAP` in `api/_cap.ts`.

**This row used to say the cap shipped in v1. It did not.** From 24 Aug, when Phoebe went live, until
25 Aug, the public chat had no cap at all — the relay counted nothing and its own header said so.
BUILD_PLAN.md and [SESSION_HANDOFF.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md) both recorded that correctly and this file did not, which is
how a wrong row survived a session close. Recorded rather than quietly corrected, because a document
that was wrong once is worth knowing about.

**How it works.** A visitor is identified by their network address scrambled with a server-held
secret; no address is stored and nothing else about the person is read. The count is kept per UTC
calendar day and expires with the day. Only delivered answers count — anything that fails on our
side is given back. At the cap the visitor is told the limit, why it exists, and when it returns.
Anywhere the platform runs the relay, a missing store stops Phoebe answering rather than quietly
serving an uncapped public endpoint.

**This item stays open only to revisit the number.** The number is a starting point chosen before there
was any traffic to reason from, not a figure derived from usage. Once real usage exists, the number
should be reconsidered against it — raised, lowered, or reshaped into something other than a flat
daily count. **The abstention log and the daily counts are the first real evidence** that will exist
for that decision.

Opened 21 Aug 2026.

**Moved to thirty, 23 Sep 2026.** The maintainer's ruling on the phase-tags proposal: the free
screen walks the Eligibility rows of both pathways, and the proposal's count showed twenty holding
for one pathway and tight for both; thirty matches Wellington's, for the reason his was set. The
number is still a starting point, not a figure from usage.

**Three rows wait on the same thing, real usage** — this one, item A5 (the primer review) and item O9 (the basemap ceiling). Recorded 18 Sep 2026 so that when there is traffic they are looked at together.

## O4. Cosmetic and housekeeping items

- **The collapsed legend strip wraps** at very narrow columns. Cosmetic; left alone deliberately.
- **`public/hydrobasins_lev06.json` is 8.44 MB in git history.** Fine in practice — `.git` is under
  4 MB because it compresses well — but it is tracked rather than generated at deploy. Reversible
  now, awkward later.
- **Data files ship with unhashed filenames**, so they do not get immutable-asset caching. They
  carry ETags with `must-revalidate`, so a rebuild will not serve stale data. Only worth revisiting
  if traffic makes it matter.

---

## O9. The basemap now needs a key, and the free tier has a ceiling

**Live since 27 Aug 2026.** A standing dependency rather than a task: it is recorded so a later
session knows the map rests on a keyed third-party service with a limit, and does not rediscover it
the hard way.

### What happened

**CARTO ended keyless access to their basemaps, and the live site was serving stamped tiles.** Every
tile came back with "API KEY REQUIRED" written across it. Confirmed on `map.waterbots.ai` with a
hard reload, not inferred.

**Warm caches are why nobody saw it.** Tiles cache hard and for a long time, so the maintainer's
browser and the engineer's both held clean tiles from before the change. **A visitor arriving with a
cold cache saw the stamp, and had been for some days.**

**It was never about the style being changed at the time.** `light_all`, the style this map shipped
with from launch, is stamped too — checked fresh past cache at every zoom from 0 to 5, both styles,
twelve tiles, twelve stamps. There was no staying put and no reverting out of it.

### What the dependency is

| | |
|---|---|
| Provider | CARTO, Voyager raster style |
| Setting | `VITE_CARTO_KEY`, **read at build time** |
| Free allowance | **5 million tile requests a calendar month**, raster and vector combined |
| Past the limit | CARTO get in touch rather than cutting off; non-commercial projects usually get a higher limit, commercial ones move to an agreement |
| Condition of the free tier | **CARTO and OpenStreetMap attribution stays visible** |

**The key is baked in by Vite when the bundle is built**, not read at runtime like Phoebe's
settings. So it must be in the deployment platform's settings *before* the build, and a settings
change only reaches a deployment that starts after it.

**The key travels to the browser** and is readable in the shipped JavaScript. That is inherent to
browser map tiles — a rate-limit token, not a secret. It is not held in this repository.

**`scripts/check-basemap-key.mjs` reads the built bundle** and fails if the tile URL ships without a
key, the same way `check-attribution` guards the licence strings. It was proven in both directions:
a build with the key blanked fails it, the real build passes it. A guard that only ever passes is
worse than no guard.

### What is not due yet

**The 5 million ceiling.** There is no usage to reason from — the same condition that holds item O1's
revisit of the number twenty and item A5's primer review. When there is traffic, this is the third
thing to look at.

### The lesson, which cost this session twice

**A status check confirmed the tiles served, and they did serve — stamped.** Then a purpose-built
stamp detector cleared them too, because it counted *dark* pixels and the stamp is soft grey-blue,
well above the threshold chosen for it.

**Both failures were the same failure: deciding in advance what the fault would look like, then
measuring for that.** The maintainer found it in seconds by opening the map. This repository already
had the lesson in another form — the platform's log is evidence and local reasoning is a guess. The
version to keep is broader: **the instrument that settles a visual question is a pair of eyes on the
thing itself.**

Logged 27 Aug 2026. **Open as a standing dependency, with nothing due until there is real usage.**

**Folded in, 18 Sep 2026:** Route C, a custom CARTO vector basemap styled to the brand book, logged under item S9 as the only route that gives real control over sea and land. It changes this dependency, so it lives here now. Not proposed, not built.

---

## O12. The map page is heavy — the renderer stalls on a basin redraw

**Logged 7 Sep 2026, from slice 2's captures. Not this slice.** With the Partners step open at
world view — 1,342 Level 4 basins drawn — a click that pins a basin, and the redraw that follows,
froze the page long enough that the browser's screenshot command timed out at thirty seconds,
twice, and once returned a tiled fragment. The pin itself landed and the desk read it back
correctly; the cost is the redraw. The desk, kept mounted behind the map, then stalled once more on
its own capture, which suggests the hidden map keeps working after the switch.

**What to look at when it is picked up:** whether the pin redraws every polygon or only the two
that changed; whether the map keeps rendering while hidden (item S4's keep-mounted rule is right,
but a hidden map need not draw); and whether the world-view layer wants simplifying. Nothing here
changes any data or any attribution. Recorded rather than fixed, by the maintainer's word.

## O13. Phoebe's relay still says `validate()` — a banned word in old code

**Logged 7 Sep 2026, by the maintainer's word: rename in a later hygiene pass, not now.** The
language rules in CLAUDE.md retire "validate" and "validation"; say "check" or point at the test
suite. Phoebe's relay, `api/phoebe.ts`, predates the rule and carries a `validate()` function, its
call, and four comments that name it, plus the same shape in `api/_wellingtonAnswer.ts` and the
check that loads it. None of it reaches a visitor. Slice 3 kept the word out of its own files and
left these alone, because a rename inside a working relay is its own small change with its own
eyeball, not a rider on a feature.

**What the pass does when it comes:** rename the functions to `checkAnswer` or the like, reword
the comments, and update `scripts/check-wellington.mjs`, which imports one of them by name. No
behaviour changes. Recorded here rather than done, by the maintainer's word.

**Folded in, 18 Sep 2026:** Bridget's and Calvin's dock copy still says "console", a word the plain-words rule keeps out of what an agent or a visitor reads (item S11, slice 2). Same hygiene pass: banned words wherever old code or copy still carries them.

## O14. Carries owed by the maintainer's hand — listed once

**Adopted 18 Sep 2026 in the maintainer's triage.** Several items end with a thing that only she can
carry — into the brand book, to production, or to Deb — and each was recorded inside the item that
owned it, where a later reader may not look. This row lists them once and points at the owner. Rule
zero holds for every one: nothing here is fetched, written to, or guessed at on the other side.

| Owed | Where it goes | Owner |
|---|---|---|
| Typing dots, the third motion exception | Brand book §5 | item S14 |
| One row — the journey bar as the navigation | Production, as a candidate shape | item S15 |
| The agent screen as a §7 component, and the carry list of files for production | Brand book §7; production | item S16 (archived) |
| Production's sign-up address for the Commons door | This site, once she carries it | item S18 |
| The three changes Deb's rig needs, and later the trigger | Deb | item S18, slice 4; item S19 |
| The confirmed free and Commons columns of `roster.yaml`, carried again, and the roster's two "this repository" lines corrected at source | This site | item A13 (swept 3 Oct 2026) |
| The specialist contract — the ten-line section of AGENT_RULES.md, her words | Production | item A15 (swept 3 Oct 2026) |
| `project-types.md` — drafted here, the paid repository becomes its source and this site is then held to it, the roster's rule; her word of 23 Sep 2026 | Production, then back to this site | item A16 |
| The carbon "no" list to the reviewer as Q11; her word of 23 Sep 2026, named at the M1–M17 grade: the Blocked cases on M5 (nobody boils or goes without), M12 (the host country's list excludes the activity), M13 (viable without carbon finance, pricing will not change), M14 (common practice with no justified narrower area) | The paid side | items A18, K7 |
| One contract change to the seal: `type`, `gsClass` and `stage` for `kind` (**this site's sender changed 24 Sep 2026**, item A16: `record.type` an id from `project-types.md` or NONE or blank, `record.gsClass` one of HWT, IWT, CWT, CWS only beside C-19, `record.stage` one of paper, building, running, each with its source tag). **Until this carry lands the seal also carries `kind` again**, her ruling of 25 Sep 2026 after a live save arrived on production as an empty record: derived from the type, one of water, carbon, both, neither, and refused when it disagrees with the type. The word retires from the seal on the day production's receiver reads the three new fields. The whole account is under item A16, *The save door broke, and the word came back*. Also owed: rows and a readiness read per pathway; the send-to-a-person field and a note. **Recorded 3 Oct 2026: production's receiver is not fixed; it is Shell A item #243** | Production | items K7, A16, A18 |
| `record.served` on the seal from 27 Sep 2026: people served as the visitor said it, `value` a whole count as digits or blank, `unit` people or households or blank, and its source tag; production's receiver ignores it until its storage is carried | Production | item A16 |
| The "tools and resources on the paid site" line, her canon of 23 Sep 2026: production's side of the save door and its sign-up should say the same thing this site's save door will say | Production | item A18 |
| The transition-assistance module, overseen by trusted consultants, that card T4 tells a transitioning project is coming to the paid site; her word of 23 Sep 2026 | Production | items K7, A18 |
| The engine scrub and the re-seal at v0.16.1: the strings flagged in `presets.ts`, `emissions-legacy.ts` and `quantity.ts` | This site, once she carries the bundle | item A21, ruling R1 |

A carry leaves this table when it lands, and the date goes to BUILD_LOG.md at that close-out. Nothing is
built toward any of them from here.

Logged 18 Sep 2026. **Each waits on her hand. Bucket PARK.**


## O15. Four storage keys show "Needs Attention" in Vercel

**Logged 3 Oct 2026, from the maintainer's word: check later.** Four storage keys show "Needs
Attention" on the hosting platform. They have not been looked at, and their names and what they
guard are not in the record. The first step is to read the four names and the platform's message off
its storage page, by her hand or on her screen. The short-lived store the daily caps and the save
door use is a possible neighbourhood, but that is a guess and not a finding.

Logged 3 Oct 2026. **Not looked at. Bucket PARK.**

# Family: Cleanup

Debt in the documents themselves — wording, strikes, structure — that no other family owns.
**Started 23 Sep 2026 by the maintainer's ruling**, when she made the no-strikes rule canon and
asked for one open item in a cleanup family, creating it if none existed. None did. Its reason: a
document-wide sweep belongs to no surface, agent, dataset or deploy, and a family that has to hold
one row nobody else can is the sign the families were one short.

Governed by [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), *Corrections replace
text; the archive keeps the old wording*, and by *docs never drift* in [CLAUDE.md](./CLAUDE.md).

## C1. Sweep every existing struck line into the archive

**Logged 23 Sep 2026 from the maintainer's ruling. Not started.** Her words:

> No crossed-out text in any live document. A correction replaces the text; the old wording and
> its date go to the archive or the CHANGELOG, never struck in place. Apply it in #100 now: the
> 20 Aug paragraph and any other strike in this batch move to the archive; live docs hold only
> current text. Log one open item in a cleanup family (create it if none): sweep every existing
> struck line into the archive.

**What is already clean.** The batch of 22–23 Sep 2026 (pull requests #99 and #100): the head of
the eligibility card file, the seat, water-pack and tree READMEs, the K7 row here and the K7
heading in BUILD_PLAN. Their old wording is in the pack CHANGELOGs and in
[docs/archive/CORRECTIONS.md](./docs/archive/CORRECTIONS.md), the file this rule made.

**What waits.** Every strike that existed before the ruling: in CLAUDE.md, PROCESS_RULES,
AGENT_RULES, CITATIONS, this file's index table and item bodies, BUILD_PLAN, the tree and pack
READMEs, the feasibility and eligibility card files below their heads, and code comments that
carry a struck fact. One document at a time, each its own commit: the strike replaced by current
text, the old wording moved whole with its date and reason to the archive file or the pack's
CHANGELOG. Where a struck line reaches an agent's prompt (the card files), the measured run follows,
as it did for #100.

**Sizing.** A document is one step; a sitting may hold several. The card files and the rulebooks
each get their own pull request because canon lifts out alone. Proposal first, with the count of
strikes per document, so she can order them.

Logged 23 Sep 2026. **Not started. Proposal first. Bucket BONES.**
