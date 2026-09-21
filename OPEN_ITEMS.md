# Open items

Every open thread in this repository, in one place. Moved out of
[SESSION_HANDOFF.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md) on 21 Aug 2026 —
~~that file now carries session state and hand-off notes only, and points here.~~
**Corrected 17 Sep 2026:** the live root handoff is retired. Live state is this file,
[BUILD_PLAN.md](./BUILD_PLAN.md), [BUILD_LOG.md](./BUILD_LOG.md), and git. The retired
handoff is in [docs/archive/](./docs/archive/README.md). Do not recreate a live root
`SESSION_HANDOFF.md`.

**Closed items live in [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md)**, in full, from
30 Aug 2026, ~~at the repository root~~ **under `docs/` from 17 Sep 2026, every link followed**. This file is read at the start of every session and stays a briefing; the archive is
not one of the ~~six~~ four opening documents and is read only when someone goes looking. **Every archived
item keeps its row in the index table below**, so nothing is lost by being finished. The reasoning
is item O11.

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

A row keeps its bucket until she moves it. Item O11 records the triage; the full sort was a proposal
file at the root, untracked, and deleted once the sweep merged.

| Family | What it covers |
|---|---|
| **[Knowledge](#family-knowledge)** | What the agents are allowed to know — card sets, the source corpus, and the methods behind a number. |
| **[Agents](#family-agents)** | How agents behave, what they may say, how they hand off, and who staffs which post. |
| **[Surfaces](#family-surfaces)** | What a visitor sees and works with — the map, the worksheet, the chat layer. |
| **[Data](#family-data)** | Where real, verifiable data comes from, and whether it exists yet. |
| **[Operations](#family-operations)** | The deploy, the repository, settings and limits that outlast the session that made them. |

| # | Item | Family | Bucket | State |
|---|---|---|---|---|
| K1 | VWBA full-docs card pass | Knowledge | BONES | open |
| K2 | Co-benefit quantification module | Knowledge | PARK | open |
| K3 | VWB Report Corpus | Knowledge | PARK | open, no action yet |
| K4 | "Knowledge Pack" — the word for a packaged knowledge set | Knowledge | closed | canon, ruled 26 Aug 2026 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K5 | The VWBA 2.0 D-3 screening pack | Knowledge | closed | **built 1 Sep 2026** — the first pack in the slot — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K6 | The Gold Standard safe-drinking-water carbon packs, Legacy V1 and PAA v2.0 | Knowledge | closed | **built 2 Sep 2026** — two packs, one module, the transition delta — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K7 | A carbon card pass in Phoebe's card format | Knowledge | BONES | **logged 2 Sep 2026 as debt** — after Thursday, not built |
| K8 | Phoebe's VWBA pack is the cards' one home; the new pack shape, one pack at a time | Knowledge | closed | **built 17 Sep 2026, #84** — canon — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| K9 | Calvin's and Bridget's packs move to the new pack shape | Knowledge | BONES | **logged 18 Sep 2026 from the maintainer's brief** — one brief each, the way Phoebe's did; not started |
| K10 | Phoebe ready for Deb's rig — cards reviewed, engineer notes split out, exam questions signed | Knowledge | BONES | **logged 18 Sep 2026 from the maintainer's brief** — not started |
| A1 | Phoebe abstention loop | Agents | PARK | built 25 Aug 2026 |
| A2 | Final agent staffing | Agents | closed | settled 24 Aug 2026; Bridget's colour settled 29 Aug 2026 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A3 | Agent handoff primer | Agents | closed | shipped 28 Aug 2026 — rung 2 live — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A4 | Phoebe returned an empty answer | Agents | closed | one cause fixed 25 Aug 2026 — **not the only one**, see A6 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A5 | Primer review against the abstention log | Agents | PARK | logged 27 Aug 2026, not due |
| A6 | Phoebe fails about one request in six, and every fault fails late | Agents | BONES | fixed and guarded 28 Aug 2026 — 12% to 2% |
| A7 | An abstention cited a card | Agents | closed | logged 28 Aug 2026; **recurred 3 Sep 2026, benign branch** — reading owed — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A8 | Wellington's chat, live on the desk | Agents | closed | **built 3 Sep 2026** — on Phoebe's pattern, thirty a day — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A9 | Agents phrase the roster's facts themselves | Agents | closed | **canon, ruled 3 Sep 2026** — no word-for-word lines anywhere — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A10 | Wellington's answers run long | Agents | BONES | **logged 3 Sep 2026 as debt** — tightening comes later |
| A11 | The phase names are canon, and agents point at the step, never a tab | Agents | closed | **ruled and resolved 5 Sep 2026**, amended 7 Sep, same pull request — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| A12 | The two chats not built — Bridget's and Calvin's | Agents | PARK | **adopted 18 Sep 2026** from items A2 and S10; not scheduled |
| A14 | Screen host role words — one home | Agents | BONES | **logged 18 Sep 2026 from the maintainer's word** — not fixed now |
| A15 | The specialist contract — ten lines every specialist keeps; Phoebe first | Agents | BONES | **ruled 20 Sep 2026; the batch approved the same day** — steps 0 to 3 merged (#93, #94, #95) by 21 Sep; steps 4 to 6 remain as pull request D |
| A13 | One roster — roster.yaml from production, checked against the primer and crew.ts | Agents | BONES | ~~**logged 18 Sep 2026 from the maintainer's brief** — waits on her carry~~ **built 18 Sep 2026, #91 merged** — the free and Commons columns stay "unconfirmed" until she carries a confirmed file |
| S1 | Collaboration and collective action as a partner-finding surface | Surfaces | PARK | open |
| S2 | The shared chat layer | Surfaces | closed | built through Level 2 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S3 | Level 3 citation pop-out | Surfaces | closed | out of scope — paid platform — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S4 | Chat docks were thrown away on a surface switch | Surfaces | closed | fixed 23 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S5 | The citation line wraps awkwardly in the narrow dock | Surfaces | PARK | cosmetic, polish later |
| S6 | The dev relay resolves imports differently from production | Surfaces | BONES | open |
| S7 | The bridge — handing a finished screening to the paid platform | Surfaces | closed | ruled 26 Aug 2026; the contract ruled 7 Sep 2026; **built 8 Sep 2026, #56** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S8 | Brightness pull-up to the book's published Frost values | Surfaces | closed | closed 29 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S9 | The return to the brand book | Surfaces | closed | **closed 30 Aug 2026** — both raises shipped, book at v4.1 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S10 | The Quantification step | Surfaces | closed | **built 1 Sep 2026** — the third surface, pack-keyed; three packs from 2 Sep — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S11 | The free desk, and the console in the production shape | Surfaces | WALKTHROUGH | **built 2 Sep 2026** — Wellington's desk, the journey bar, ~~four tabs~~ one row from 7 Sep; **his chat live on it from 3 Sep; the desk plan's three slices landed 5–7 Sep** |
| S12 | The hero chat — a full page that is the conversation | Surfaces | PARK | **logged 3 Sep 2026, not built; parked as a later item by the maintainer's word, 9 Sep 2026** — the receiver (S13) lands on the desk without it |
| S13 | The handoff receiver — a question carried in from the production landing | Surfaces | closed | ~~logged 3 Sep 2026, not built~~ **built 9 Sep 2026** — the desk receives it; **optional does/name/place from 15 Sep 2026, #74**; **Wellington visit-aware from 16 Sep 2026, #76**; the sender's contract is recorded here for production to carry — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| S14 | Typing dots — the book's third motion exception | Surfaces | PARK | **ruled 3 Sep 2026** — waits on the maintainer's hand into §5 |
| S15 | One row — the journey bar is the navigation; a candidate for production | Surfaces | PARK | **built 7 Sep 2026** — the tab row removed; offered to production by the maintainer's hand, later |
| S16 | The agent screen — every step is a screen, the agent's chat in the middle and its tool as a tab; a candidate for production | Surfaces | closed | **built 9 Sep 2026, #61 to #64** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md); the B→A raise into the book and the carry list wait on the maintainer's hand |
| S17 | The agent watches its Tool tab and comments; a pulsing teal dot on Chat | Surfaces | PARK | **logged 9 Sep 2026, parked for a design session, both sides** — no proposal yet |
| S18 | Agent Commons — a public gallery of graded knowledge packs, each wearing an agent face | Surfaces | PARTNER | **v0 done — slices 1 to 3 built and merged by 11 Sep 2026 (#68 to #70)**; slice 4 waits on Deb's per-case file; slice 5, the flag button, later |
| S19 | The Workshop — make your own agent on the Commons | Surfaces | PARTNER | **logged 11 Sep 2026, not built** — slice 3 has landed; the proposal is next, on the maintainer's word |
| S20 | "Connect with a human expert" on every Commons agent | Surfaces | PARTNER | **logged 11 Sep 2026, not built** — two design questions open for the session |
| D1 | Corporate water stewardship goals and target geographies | Data | PARK | open |
| D2 | Project points | Data | PARK | blocked on data |
| O1 | Rate limit on public chat | Operations | PARK | shipped 25 Aug 2026, number to revisit |
| O2 | Restore branch protection on `main` | Operations | closed | closed 24 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O3 | Reverse link from waterbots.ai | Operations | closed | closed 24 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O4 | Cosmetic and housekeeping items | Operations | PARK | left alone deliberately |
| O5 | The engineer pushed without a commit word, twice | Operations | closed | logged 24 Aug 2026 — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O6 | The card gate reports stale cards that are not stale | Operations | closed | closed 27 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O7 | Merged branches pile up, and are now to be cleared | Operations | closed | closed 27 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O8 | The export step in the close-out ritual | Operations | closed | ~~ruled 27 Aug 2026, open on the script question~~ **closed 17 Sep 2026** — the step and the folder are retired — **swept 18 Sep 2026** — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O9 | The basemap now needs a key, and has a ceiling | Operations | PARK | live 27 Aug 2026, standing dependency |
| O10 | Line endings are pinned in git but not in the working folder | Operations | closed | closed 30 Aug 2026 — [archived](./docs/OPEN_ITEMS_ARCHIVE.md) |
| O11 | OPEN_ITEMS.md is heavy and wants an archive | Operations | BONES | **two sweeps done** — 30 Aug and 2 Sep 2026; **the triage is the next brief, 17 Sep 2026** |
| O12 | The map page is heavy — the renderer stalls on a basin redraw | Operations | WALKTHROUGH | **logged 7 Sep 2026**, not this slice |
| O13 | Phoebe's relay still says `validate()` — a banned word in old code | Operations | BONES | **logged 7 Sep 2026** — rename to "check" in a later hygiene pass, not now |
| O14 | Carries owed by the maintainer's hand — listed once | Operations | PARK | **adopted 18 Sep 2026**; each waits on her hand |

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

## K4. "Knowledge Pack" — closed, swept to the archive

**Canon, ruled 26 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## K5. The VWBA 2.0 D-3 screening pack — closed, swept to the archive

**Built 1 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## K6. The Gold Standard safe-drinking-water carbon packs — closed, swept to the archive

**Built 2 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## K7. A carbon card pass in Phoebe's card format

**Debt, logged 2 Sep 2026 and not built.** After Thursday's C4SW walk: a card pass in Phoebe's
card format, drafted from the two Gold Standard PDFs in `sources-local/methodology/`, graded by
the maintainer, and carried through the same pipeline as the VWBA cards — committed source, a
generated module, a staleness gate. Until it lands Phoebe has no carbon cards and abstains on
carbon questions, which is the correct outcome.

**Why it is a row and not a task.** The maintainer asked for one open-items row so it is not
lost. It waits for Thursday and on her word.

Logged 2 Sep 2026. **Not started.**

## K8. Phoebe's VWBA pack is the cards' one home — closed, swept to the archive

**Built and canon, 17 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

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
4). Parts 1 and 2 can go first. Proposal before any of it.

Logged 18 Sep 2026. **Not started. Bucket BONES.**


# Family: Agents

How agents behave, what they may say, how they hand off, and who staffs which post.

Governed by [AGENT_RULES.md](./AGENT_RULES.md). One rulebook, one family.

## A1. Phoebe abstention loop

**Log every abstention visibly, so the maintainer can grade each one and decide whether it becomes
a new card.**

When Phoebe declines to answer — because no card covers the question, because the source is silent,
or because the evidence a project owner supplied does not reach any criterion — that abstention is
recorded where it can be read, not swallowed. Each logged abstention is then graded, and the
outcome is a maintainer decision: leave it as a legitimate limit of the card set, or turn it into a
new card.

This is the mechanism by which the card sets grow from real questions rather than from guesses
about what might be asked. It also keeps the honest-states rule true for the agent as well as the
map: a refusal to answer has to be visible, not silent.

**Built 25 Aug 2026 and live in production.** Every abstention is now recorded and readable.

**What a record holds:** when it happened, what Phoebe called the topic in her own few words, and
the question as the person typed it. The real question is kept — maintainer's ruling, 25 Aug 2026 —
because "curve number method" tells you a gap exists while the question tells you what card to
write. A question longer than 500 characters is cut and the record says plainly that it was.

**What a record does not hold: any trace of who asked.** The scrambled identity the daily cap counts
against is deliberately not written here, so a question can never be tied back to a person, or to
any other question by the same person. The two stores share a database and nothing else, and a check
enforces that rather than a comment asking for it.

The most recent 500 are kept; older ones fall off the end. Writing a record can never cost someone
their answer — a failure to record goes to the log and the answer still goes out.

**Reading them:** `/api/abstentions?key=…`, guarded by `PHOEBE_LOG_KEY`. A guarded address was
chosen over the storage dashboard on 25 Aug 2026, because this file describes grading as a routine
and a routine built on an awkward tool is a routine that stops happening. It returns data rather
than a page, deliberately: every question in it was typed by a member of the public.

**What is left of this item is the grading itself**, which is a maintainer job and not a repository
one. Read the log, and for each gap decide: a legitimate limit of the card set, or a card to write.

Opened 21 Aug 2026. Mechanism built 25 Aug 2026; grading is ongoing.

---

## A2. Final agent staffing — closed, swept to the archive

**Settled 24 Aug 2026; Calvin settled 1 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## A3. Agent handoff primer — closed, swept to the archive

**Shipped 28 Aug 2026, rung 2 live. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## A4. Phoebe returned an empty answer — closed, swept to the archive

**One cause fixed 25 Aug 2026; the rest is item A6. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

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

## A6. Phoebe fails about one request in six, and every fault fails late

**Top priority. Measured 28 Aug 2026, twenty requests, and it is live.**

**This affects real visitors on `map.waterbots.ai` today.** It is not caused by the agent handoff
primer, it predates it, and it was found only because the primer was being tested against a
baseline.

### What was measured

One question, asked twenty times through the real relay: *"We are planning to restore 40 hectares of
wetland upstream of our bottling plant in a water-stressed basin. Would that be eligible to generate
a countable benefit?"* Ten through `main`'s prompt, ten through the parked step-two prompt. Each
attempt recorded its HTTP status, elapsed time, reply length and cited-card count.

**`main`, no primer — the code that is deployed:**

| # | Result | Time |
|---|---|---|
| 1 | Short — 569 characters, 6 cards | 21.6s |
| 2 | Full — 1,247 characters | 15.4s |
| 3 | **HTTP 502 — empty answer, refused** | 12.3s |
| 4 | **HTTP 502 — API error 400, "Invalid request data"** | 25.2s |
| 5 | Full — 1,503 characters | 22.0s |
| 6 | Full — 1,503 characters | 21.5s |
| 7 | Short — 640 characters, **0 cards** | 48.3s |
| 8 | Full — 1,331 characters | 18.1s |
| 9 | **HTTP 502 — empty answer, refused** | 11.7s |
| 10 | Full — 1,424 characters | 18.6s |

**With the parked primer, for comparison:**

| # | Result | Time |
|---|---|---|
| 1 | **Timeout — no response** | 240s |
| 2 | Full — 1,730 characters | 25.0s |
| 3 | Full — 1,028 characters | 22.5s |
| 4 | **Timeout — no response** | 240s |
| 5 | Full — 1,207 characters | 23.2s |
| 6 | Full — 1,494 characters | 21.0s |
| 7 | Full — 1,685 characters | 12.2s |
| 8 | **Degenerate — 7 characters, delivered** | 23.9s |
| 9 | Full — 1,222 characters | 15.4s |
| 10 | Full — 1,831 characters | 22.2s |

**Three failures in ten on each side.** The rate is the same; the shape differs. The primer does not
make Phoebe less reliable — it changes how she fails.

### Four faults, and they are not one fault

1. **Empty answers far below the budget.** Logged at **945** and **733** of 16,000 output tokens.
   Item A4 recorded this symptom as fixed, and its cause — hidden thinking exhausting the budget —
   was real and was fixed. **This is a different cause with the same symptom.** A4 is corrected
   rather than reopened.
2. **`API error 400 — Invalid request data`**, request id `req_011CeV9mhFbtJtXQBh1E41qK`. **That is
   our request being rejected**, not the model answering badly. It has never been seen before and
   nothing in the repository explains it.
3. **A seven-character reply was delivered to the caller.** Item A4 deliberately refused to put a
   minimum length on the schema, arguing that forcing the model to emit something turns an honest
   failure into a meaningless answer that looks real. **The guard tests for an empty reply, and
   seven characters is not empty**, so it passed. The principle was right and the guard does not
   implement it. **This is the same lie the guard exists to stop.**
4. **Answers vary enormously on identical input** — 569 to 1,503 characters, one citing six cards
   and another citing none, on the same question through the same prompt.

### One fault that belongs to the parked primer, not here

**Two requests hung with no response at all**, and `main` did not hang once in twenty attempts today.
The relay logs the line printed immediately before the model is called and then nothing — no error,
no refusal, no token count. **It is waiting on a call that never returns, and it has no timeout of
its own to end the wait.**

Locally that is an infinite wait. On the deployment platform it would hit the platform's own function
limit and return a gateway error, so a visitor would see a failure rather than a hung page.

**It is recorded here because it may share a cause with the faults above** and re-measuring it is
part of this item's work. It does not belong to the primer until that has been checked.

### The diagnosis, 28 Aug 2026 — seventy-five requests, instrumented

**The relay was instrumented first** so that failures explain themselves: stop reason, content
blocks, token usage, elapsed time, the parsed shape, and — for a reply of forty characters or fewer
— the reply quoted in full. It is behind `PHOEBE_DIAGNOSE=1`, off by default, and is debt to remove
when this item closes.

**Seventy-five requests across three questions**, all against the deployed prompt.

| Fault | Rate | State |
|---|---|---|
| Empty or near-empty reply | **9 in 75 — 12%** | **Explained** |
| `API error 400 — Invalid request data` | 2 in 75 — 3% | **Explained, and its message is false** |
| Budget exhausted at 16,000 | 2 in 75 — 3% | **Explained** |
| Answers varying on identical input | — | **Mostly not a fault** |
| Any failure | **13 in 75 — 17%** | |

#### Fault 1 and 3 — she finishes on purpose and says nothing

```
stopReason: "end_turn"        output: 920 of 16000
parsedKeys: [reply, citedCards, abstained]
textPreview: {"reply": "","citedCards":[],"abstained": false}
```

**Not the budget** — 920 to 1,525 of 16,000, measured across five instances. **Not truncation** —
`end_turn` with valid JSON. **Not a refusal** — no refusal stop reason in seventy-five requests.
**Not a parsing fault** — it parses cleanly with the right keys.

She spends 900 to 1,500 output tokens, most of it hidden thinking, then writes a well-formed answer
whose reply is an empty string and whose `abstained` flag is **false**. She does not consider it a
refusal. She simply produces nothing.

**Fault 3 is the same event with a character in it.** Four replies of one to three characters were
delivered to callers, same `end_turn`, same `abstained: false`, same zero cards. They are not empty,
so the guard passed them. **What those characters were is still unknown** — the instrument that
would quote them was added afterwards and has not caught one since. That gap is named rather than
filled with a guess.

#### Fault 2 — the "invalid request" is not our request

Reproduced twice. The instrumentation recorded what was sent, and it is **identical to the thirteen
requests that succeeded in the same run**:

```
model: claude-sonnet-5   maxTokens: 16000   effort: medium
systemChars: 53810       messageCount: 1    messageChars: [163]
```

**And the timing settles it.** Both failures returned after **27.8 and 31.4 seconds**. A genuinely
malformed request is rejected in milliseconds, because nothing has to be computed to know it is
malformed. **A 400 arriving after half a minute of work is a failure during generation wearing the
label of a client error.**

That is why nothing in this repository explained it. There was nothing to explain.

#### Fault 5 — the budget wall, which item A4 said did not exist

Two requests spent **16,000 of 16,000** and stopped on `max_tokens`, taking **102.8 and
109.5 seconds** against a normal call of about twenty. A4's headroom claim is corrected in place
under the visible-corrections rule.

**Five times slower, not slightly slower.** That is a runaway rather than a shortage of room, which
is why raising the number is not the obvious answer.

#### Fault 4 — mostly the measuring instrument, not Phoebe

Answers do vary, and far less than first reported. **The first pass called anything under 800
characters a failure**, which mislabelled twelve correct short answers to a simple question. The
real variance is the empty-answer fault plus legitimate differences between questions.

### The shape all of it shares

**Every fault fails late.** Nine hundred to 1,500 tokens of thinking and then nothing; 28 to
31 seconds and then a false 400; 102 seconds and then a wall. **None of them is a bad request, a bad
card, or a bad schema** — the inputs are identical to the successes in every case measured.

They are one thing failing to finish, which is why a fix has to touch how she thinks rather than
what she is given.

### What the difficulty of the question does

| Question | Empty-answer rate |
|---|---|
| Wetland restoration — complex, six criteria | **7 in 30 — 23%** |
| Community consultation — simple, one card | 1 in 15 |
| Feasibility — the other card set | **0 in 15** |

**The harder the question, the more often she says nothing.**

### What a fix has to move, and how it is proved

**The empty-answer rate is the number: 12% overall, 23% on hard questions.** The proof is the same
seventy-five requests, the same three questions, the same instrument.

**Budget exhaustion and the false 400 are separate faults with separate answers**, and a fix
proposal must say for each whether a model or effort change can reach it, or whether it is upstream
weather that can only be guarded against. Maintainer's ruling, 28 Aug 2026: **if it is weather, the
guard proposal — including the near-empty hole — rides next.**

### The fix, ruled and shipped 28 Aug 2026 — Opus 5

**Four measured runs, sixty to seventy-five requests each, same three questions, same instrument.**

| | Sonnet · medium<br>morning | Sonnet · low<br>Option A | Sonnet · medium<br>fresh | **Opus · medium**<br>**Option B** |
|---|---|---|---|---|
| Empty answers, 60 | 8 — 13% | 6 — 10% | 7 — 12% | **1 — 2%** |
| Empty, hard question | 7 in 30 — 23% | 5 in 30 — 17% | 3 in 30 — 10% | **1 in 30 — 3%** |
| Calls over 240 seconds | 0 | **8** | 0 | **0** |
| Budget wall | 2 | 0 | 0 | 1 |
| Median call | ~20s | 7.1s | 14.6s | **8.2s** |
| Mean output tokens | ~2,000 | 558 | 1,086 | **705** |
| Cards on hard answers | — | 5.0 | 4.1 | **4.8** |
| Abstention discipline | — | 15 of 15 | — | **15 of 15** |

**Option A was refused.** It barely moved the rate and produced eight calls over four minutes where
a same-hour `medium` baseline produced none. Maintainer's ruling: *a four-minute wait is worse than
the fault it barely dents.*

**Option B was ruled and shipped.** It clears every condition set for it: the hard-question rate
falls from 23% to 3%, discipline holds at fifteen of fifteen, citation improves rather than
degrades, and it is faster than the baseline rather than slower.

**The upgrade was the one line the code had named since 21 Aug 2026**, which said to raise the model
if abstention discipline proved weak. **Discipline was never weak — the answer was.** The same line
fixed it.

**Cost:** Opus is dearer per token and produced fewer tokens, 705 against 1,086, and answered
faster. The net is the maintainer's to weigh and is not guessed at here.

### A measurement caveat that outlives this item

**The hard-question rate swung from 23% to 10% on the identical configuration four hours apart.**
Same model, same effort, same question, same instrument.

**A thirty-request sub-sample cannot carry a decision.** The sixty-request figure is the steady one
— 13% and 12% on two separate `medium` runs — and the ruling rests on that. Framing 23% as a stable
target was overconfident, and it is recorded here so the next comparison is sized properly.

### The budget wall is ours, and it is banked

**Effort reaches it.** `low` produced none in seventy-five; `medium` produced two on Sonnet and one
on Opus. That settles the question the fix proposal owed: **the wall is not upstream weather.**

**It is not fixed and Opus does not remove it** — one request in seventy-five still spent 16,000 of
16,000. **It belongs to the guard proposal's scope**, along with the near-empty hole and the false
`API error 400`, which remains weather.

### The guards, shipped 28 Aug 2026 — what the model change does not reach

**Two steps, run as one approved plan.**

**A reply shorter than 40 characters is refused rather than delivered.** `api/_reply.ts` holds the
floor as a named constant; `scripts/check-reply-guard.mjs` is the eleventh check and proves it in
both directions. **This is not the schema minimum item A4 refused** — A4 declined to make the model
say more, and this refuses to hand a non-answer to a visitor. Same principle, opposite direction.

**The relay has a timeout of its own, 120 seconds, where it had none at all.** Locally that was an
unbounded wait; on the platform the deployment's own limit ended the request and a visitor got a
gateway error instead of the honest message this relay gives everywhere else. **A default nobody
wrote down is a decision nobody made** — this item's own family lesson, unapplied until now.

**One retry, only for a 400 arriving after five seconds**, because a malformed request is rejected
in milliseconds and the two measured instances came back at 27.8 and 31.4 seconds. **A retry cannot
cost a visitor two of their twenty**, and `check-cap` now proves it rather than the code merely
asserting it.

**The budget wall is not closed by any of this.** It is cut off at 120 seconds rather than run to
completion, which limits its cost without removing its cause.

### What this item is, and is not

**It is a diagnosis, not a fix.** Finding the faults comes first, and any fix is proposed separately
once there is something to fix rather than something to guess at.

**What "done" looks like for the diagnosis:** each of the four faults above either explained with
evidence, or shown not to exist. Then, and only then, a proposal.

### Why this outranks everything else in this lane

**A third of visitor questions failing is worse than any feature being missing.** The agent handoff
primer is built and parked. Nothing published claims it is live, so nothing is dishonest while it
waits.

**And the honest note about how this was found.** Two earlier baseline runs came back nine-for-nine
clean, and were reported as a clean baseline. They were small samples and luck. **The clean baseline
was wrong, and reporting it as a baseline was wrong**, which is why this item carries the raw twenty
rather than a summary.

Opened 28 Aug 2026. **Diagnosed, fixed and shipped 28 Aug 2026 — Opus 5, 12% to 2%. Open on what
the fix does not reach: the budget wall, the near-empty hole, and the false 400, all of which go to
the guard proposal.**

---

## A7. An abstention cited a card, once — closed, swept to the archive

**Closed 18 Sep 2026, the benign reading accepted. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## A8. Wellington's chat, live on the desk — closed, swept to the archive

**Built 3 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## A9. Agents phrase the roster's facts themselves — closed, swept to the archive

**Canon, ruled 3 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

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

## A11. The phase names are canon, and agents point at the step, never a tab — closed, swept to the archive

**Ruled and resolved 5 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

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

Logged 18 Sep 2026. **Not scheduled. Bucket PARK.**

## A13. One roster — roster.yaml from production, checked against the primer and crew.ts

**Logged 18 Sep 2026 from the maintainer's brief. Waits on her carry. Not started.** Her words, kept whole:

> One roster. I will carry roster.yaml from production. The primer's crew facts and
> `src/lib/crew.ts` get checked against it, and the build fails if they disagree. Levels are Meet,
> Screen, Work.

**What holds the roster today, in four places.** The crew list in `src/lib/crew.ts` (four agents,
their roles and steps); the crew facts in the primer's regions,
`knowledge-packs/product-shared/agent-primer.md`; the roster table in that pack's README; and the
brand book's §6, which is gitignored and governs. Four homes for one fact is the drift the one-home
rule exists to stop.

**The shape, as read from her words.** A `roster.yaml` arrives by her hand, from production, the way
every shared rule arrives (rule zero — nothing is fetched). A check in `scripts/` reads it and
compares what this site says against it — names, roles, steps, whatever the file carries — and the
build fails on any disagreement, the way the card gate fails on a stale card. Whether the file then
becomes the source that `crew.ts` and the primer are generated from, or only the thing they are
checked against, is a question for the proposal.

**"Levels are Meet, Screen, Work."** Her words, recorded as given. What a level is on this site is
not known here and is not guessed; it is defined when the file arrives.

~~Logged 18 Sep 2026. **Waits on the maintainer's carry of `roster.yaml`. Bucket BONES.**~~

**Built 18 Sep 2026, pull request #91, merged the same day on her eyeball.** She carried `roster.yaml` by hand
the same day, version 0.3.0, ruled 17 Sep; it sits in the shared pack and this site never edits it.
The levels are the file's own — meet, screen, work, later, none — and the doors are free, commons
and paid; both are read from the file, never typed into the check.

- **Checked, not generated**, by her go on the proposal: `src/lib/crew.ts` holds only what the
  roster does not (portrait, colour, whether the accent may carry text, which screen opens) and
  the primer is her approved prose with its struck history. `scripts/check-roster.mjs` holds the
  crew file, the Commons shelf, both primer regions and Wellington's people sentence to the roster,
  and runs in front of `npm run build`, so a disagreement fails the deploy and names the line.
  `npm run roster:check` runs it alone, under production's name for it.
- **"unconfirmed" passes either way, always.** A new allowed word for `built` is one row in the
  check (`BUILT_WORDS`); she said she may add "partly" at the source for a seat whose tool is open
  and whose chat is not.
- **What tripped:** Bridget's role in `crew.ts` read "Map" where the roster's seat is "Partners".
  Her ruling: `crew.ts` changes. Her card reads "Partners" on the desk and on the Commons shelf.
- **Allowed and printed:** Reggie, Goldie, Edgar, Monty, Melody and Audrey are on the roster and
  not built here; Ally is a second face of the Partners seat and nowhere on this site. Nothing is
  built for any of them; later briefs.
- **Her four rulings of 18 Sep 2026:** the primer's "basin map" wording stays this brief;
  Wellington's prompt sentence naming the four stays her wording, checked and never rendered;
  Ally as above; the check in front of the build, with `yaml` as a dev dependency.
- **The other homes point at the file.** The shared pack README's roster table is struck, dated;
  it had already drifted on Bridget's label. Shared pack 0.3.0, tree 0.3.0.
- **What she took to the source:** the table of what is truly built at the free door and on the
  Commons, ten seats; and the two "this repository" lines in the roster that mean the paid site.
  Both were in the proposal, which is deleted.
- **Two finds left for her word, not changed:** the screen host records' own role words. Logged
  as item A14 on her word the same day; the story lives there.

**Open until:** she confirms the free and Commons columns at the source and carries the file
again. **Bucket BONES.**

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

## A15. The specialist contract — ten lines every specialist keeps; Phoebe first

**Ruled 20 Sep 2026 from the maintainer's brief; proposal approved as a batch the same day.**
Her ten lines live once, in [AGENT_RULES.md](./AGENT_RULES.md) under "The specialist
contract", in her words. This row is the work's home. Her reason, in her words:

> Every specialist on this site must behave the same way, so I can review one agent at a
> time against one standard, and Deb's rig can grade each line.

**Line 10 was added the same day, by her word, before the rulebook section merged**: what
knowledge and values the tool needs, the kind of value each input takes, where it usually comes
from; check the project context first, ask only for what is missing, say where each value came
from. With it she named where the project context is at each door; both are in AGENT_RULES.md.
Each pack table is ten rows. Phoebe reads partly on line 10; what reaching yes adds to steps 2
and 3 is reported to her and waits on her go.

**Where each agent stood on 20 Sep 2026**, read from the code: Phoebe one yes, seven partly,
one no on the first nine, partly on the tenth — she never saw her own worksheet, was never told her level, and read the grader
notes at the foot of her card files as knowledge. Bridget and Calvin, with no chat, no on
nearly every line; the tool posts to the record and the agent does not exist to. The full
tables live on each pack README under "The contract".

**Her four rulings of 20 Sep 2026, on the proposal:**

1. **Rung 2 stays as written, and line 8 adds to it.** Out of her lane a specialist still
   says the colleague's facts in her own words, and sets a hand-back field so the console
   offers the way back to Wellington, because he routes. Recorded in AGENT_RULES.md.
2. **The grader-notes split (item K10, part 2) goes first.** Her card review runs alongside
   as her own job; any wording she changes lands as its own commit under her eyeball, never
   inside the move.
3. **The shown line proceeds on prose**, with a before-and-after capture in the pull request;
   same place and size as the citation line, no new colour; she may strike it at the eyeball.
4. **The measured bar: no worse than 1 in 60 empty answers over sixty requests.** If any
   measured run is worse, the engineer stops and tells her before going on. And every For
   Amy block carries the measured counts in one plain sentence, and roughly what the run cost
   in API calls.

**The plan, six steps, four pull requests, four eyeball stops.** Step 0, the contract into the
rulebook and the pack tables (own pull request). Step 1, the notes split (own pull request).
Steps 2 and 3, her tool, her level and her lead in her prompt, and the worksheet's rows sent
to her with every ask and read back as the record's eligibility section (one pull request, one
walk). Steps 4, 5 and 6, the hand-back field, the walk in order with the shown line, and the
A6 instrument removed (one pull request, one full walk). Item A6's residual faults block no
line; they set the proof method.

**Named, not built:** Wellington's side — reading her verdicts from the record and greeting
the visitor back knowing what she found. Its own brief, after Phoebe. Calvin's and Bridget's
briefs come after, each on the same nine lines; the lists are on their pack READMEs' tables
and in item A12.

**Where it stands, 21 Sep 2026.** Steps 0 to 3 merged on her eyeball: #93, #94, #95. Two measured runs,
both zero empty in sixty. Lines 1, 2, 3, 6, 7 and 10 read yes for Phoebe; 8 and 9 moved; 4 and 5 wait on
step 5. Steps 4, 5 and 6 remain as pull request D with one full walk at eyeball stop 4; the exact plan for
them is in [BUILD_PLAN.md](./BUILD_PLAN.md) under *In progress*.

**Bucket BONES.** In progress from 20 Sep 2026.


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

## S2. The shared chat layer — closed, swept to the archive

**Built through Level 2, 23 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## S3. Level 3 citation pop-out — closed, swept to the archive

**Ruled out of scope, 22 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## S4. Chat docks were thrown away on a surface switch — closed, swept to the archive

**Fixed 23 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

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

## S7. The bridge — handing a finished screening to the paid platform — closed, swept to the archive

**Built 8 Sep 2026, pull request #56. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) the
same day**, in full, with the contract, the three facts, the rulings and the live-site check intact.
Nothing was summarised away in the move.

---

## S8. Brightness pull-up to the book's published Frost values — closed, swept to the archive

**Closed 29 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## S9. The return to the brand book — closed, swept to the archive

**Closed 30 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## S10. The Quantification step — closed, swept to the archive

**Built 1 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

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
for "what it does" and "kind", and whatever the hero page (item S12) asks of the desk.

Built 2 Sep 2026. **Open as the home for the surface's story.**

**Bucket WALKTHROUGH, 18 Sep 2026.** The open remainder is the two typeable controls for "what it does" and "kind"; a visitor who never chats cannot fill them today. Everything else here is built and is the story's record.

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

## S13. The handoff receiver — closed, swept to the archive

**Built 9 Sep 2026, amended 15 and 16 Sep. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

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

**A cap of 20 messages per day per visitor is live in production**, per the maintainer's ruling of
21 Aug 2026, built on 25 Aug 2026, confirmed in a preview deployment and again against
`map.waterbots.ai` after merge.

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

**This item stays open only to revisit the number.** Twenty is a starting point chosen before there
was any traffic to reason from, not a figure derived from usage. Once real usage exists, the number
should be reconsidered against it — raised, lowered, or reshaped into something other than a flat
daily count. **The abstention log and the daily counts are the first real evidence** that will exist
for that decision.

Opened 21 Aug 2026.

**Three rows wait on the same thing, real usage** — this one, item A5 (the primer review) and item O9 (the basemap ceiling). Recorded 18 Sep 2026 so that when there is traffic they are looked at together.

## O2. Restore branch protection on `main` — closed, swept to the archive

**Closed 24 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O3. Reverse link from waterbots.ai — closed, swept to the archive

**Closed 24 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O4. Cosmetic and housekeeping items

- **The collapsed legend strip wraps** at very narrow columns. Cosmetic; left alone deliberately.
- **`public/hydrobasins_lev06.json` is 8.44 MB in git history.** Fine in practice — `.git` is under
  4 MB because it compresses well — but it is tracked rather than generated at deploy. Reversible
  now, awkward later.
- **Data files ship with unhashed filenames**, so they do not get immutable-asset caching. They
  carry ETags with `must-revalidate`, so a rebuild will not serve stale data. Only worth revisiting
  if traffic makes it matter.

---

## O5. The engineer pushed without a commit word, twice — closed, swept to the archive

**Logged 24 Aug 2026; rule carried to the process rules 18 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O6. The card gate reports stale cards that are not stale — closed, swept to the archive

**Closed 27 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O7. Merged branches pile up, and are now to be cleared — closed, swept to the archive

**Closed 27 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O8. The export step in the close-out ritual — closed, swept to the archive

**Closed 17 Sep 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 18 Sep 2026**, in full, with its dates and its reasoning intact. Nothing was summarised away in the move.

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

## O10. Line endings are pinned in git but not in the working folder — closed, swept to the archive

**Closed 30 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) on 2 Sep 2026**, in full,
with its dates and its measurements intact. Nothing was summarised away in the move.

---

## O11. OPEN_ITEMS.md is heavy and wants an archive

**Flagged 30 Aug 2026, under the maintainer's ruling that the opening reads stay thin, forever.**
That ruling says plainly that a growing opening document is a defect and that an engineer who
notices one says so.

**This file is 1,900-odd lines and grew by about 300 in one session.** It is read at the start of
every session, and a good part of it is items that are closed and finished: O2, O3, O6, O7, S4, S8,
and the settled halves of A2, A3 and A4.

**What the ruling prescribes:** sweep closed items to an archive file. A closed item is finished; it
earns a pointer and a home elsewhere, not a place in a document read at the start of every session.

**Sweeping is ordinary tidying and needs no ruling.** It is logged rather than done because it was
noticed at a close-out, and moving a third of this file is not a thing to do in the last ten minutes
of a session. **What does need a decision is nothing** — the families stay as they are; only closed
rows move.

**What "done" looks like:** an archive file holding the closed items in full, each with its dates and
its reasoning intact, and a one-line row left behind in the index table here pointing at it. Nothing
is summarised away in the move.

### The first sweep — done 30 Aug 2026

**Six items moved in full to [OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md):** S4, S8, O2, O3, O6
and O7. Each keeps its dates, its measurements, its wrong turns and its corrections; **nothing was
summarised away**, which was this item's own test for what "done" looks like.

**Each leaves two things behind.** A one-line row in the index table above, pointing at the archive,
and a short stub where the item stood, saying when it closed and where it went. An item cannot be
lost by being finished.

**What it bought:** this file fell from **2,173 lines to about 1,850** in the same session that
added the version 4 raises, so it ends the day shorter than it started despite growing. The archive
is **not** one of the ~~six~~ four opening documents and is never read at the opening.

**The settled halves of A2, A3 and A4 stayed put**, and that is deliberate rather than an omission.
This item named them as candidates, but each sits inside an item that is still live — A4 in
particular says plainly that its cause was *not the only one* and points at A6. **Splitting a live
item's insides is more than ordinary tidying**, and the ruling that licenses sweeping licenses
moving *closed items*, not editing open ones. It is left for the maintainer to say whether those
items should be split at all.

**Item O10 closed the same day and was not swept.** A freshly closed item is worth leaving in place
for a session, where the next reader will look for it. It is the obvious first candidate for the
next sweep.

**The families did not change**, exactly as this item predicted: only closed rows moved.

### The second sweep — 2 Sep 2026

**Item O10 moved in full**, the obvious candidate the first sweep named. Three items joined the file
the same day — K6, K7 and S11 — so the file did not get shorter, and it stays over 2,000 lines. The
next candidates are the settled halves the first sweep declined to split, which still need the
maintainer's word.

### The triage — logged as the next brief, 17 Sep 2026

**Flagged again at the open of the root-tidy sitting of 17 Sep 2026:** this file stood at
2,855 lines and 176 KB, read at the start of every session. The maintainer's word at the close of
that sitting: *"Not in this batch: the OPEN_ITEMS sweep. Log it as the next brief. I want that list
triaged, not just swept."*

**What that asks for, as read here and hers to correct on the proposal.** A sweep moves closed rows
to the archive and touches nothing open. A triage reads every open row and gives it a state: still
open and why; closed and swept; folded into another item; or split, where an item carries a
settled half and a live half — the settled halves of A2, A3 and A4 that the first sweep declined to
split without her word. Families stay as they are unless the triage shows they are wrong, which is
her decision under the families rule. The archive now lives at
[docs/OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md).

**Proposal first; nothing is moved until she says go.**

Logged 30 Aug 2026, **first sweep done 30 Aug 2026, second sweep done 2 Sep 2026.** Open as a
standing habit — ~~the next sweep runs when this file gets heavy again~~ **the triage is the next
brief, 17 Sep 2026**.

### The triage — done 18 Sep 2026

**The maintainer's go, 18 Sep 2026, on the sort proposed the same day.** Every open row was put in one of five
buckets — BONES, WALKTHROUGH, PARTNER, PARK, CLOSE — defined once under *Families* above and shown in
a new column of the index table. Eighteen rows closed and were swept to
[docs/OPEN_ITEMS_ARCHIVE.md](./docs/OPEN_ITEMS_ARCHIVE.md) in full, each with a dated line saying
why: K4, K5, K6, K8, A2, A3, A4, A7, A8, A9, A11, S2, S3, S9, S10, S13, O5, O8. Two of them needed
a ruling first — A7's benign reading was accepted, and O5's rule went into the process rules before
its record left. Every moved item's text was checked verbatim against the archive.

**Orphans adopted.** Eight threads had lived inside other items with no row of their own. Two became
rows: item A12 (the two chats not built) and item O14 (carries by the maintainer's hand). Three
folded into rows that already existed: the dock copy saying "console" into O13, the rail-width
rider into S5, Route C into O9. Three stay where they were, named: the typeable controls under S11,
the diagnostic switch under A6, a path per Commons pack under S18. Pairs named: A4/A6, A11/S15,
S5/O4, K2/K7, S12/S14, and the three rows waiting on real usage.

**Three rows added from her brief, all BONES:** A13 (one roster), K9 (Calvin's and Bridget's packs
to the new shape), K10 (Phoebe ready for Deb's rig).

**What it bought:** the opening read fell from 2,881 lines to the figure in the build log of
18 Sep 2026, with nothing summarised away. The proposal file, `triage-2026-09-18.md`, was untracked
and is deleted after the merge. The families did not change.

Logged 30 Aug 2026; first sweep 30 Aug, second 2 Sep, **triage and third sweep 18 Sep 2026.** Open as a
standing habit — the next triage runs when this file gets heavy again, on her word.

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
| ~~`roster.yaml` from production~~ **Landed 18 Sep 2026**, version 0.3.0; the next carry is the confirmed one | This site | item A13 |
| The specialist contract — the nine-line section of AGENT_RULES.md, her words | Production | item A15 |

A carry is struck from this table when it lands, with the date. Nothing is built toward any of them
from here.

Logged 18 Sep 2026. **Each waits on her hand. Bucket PARK.**

