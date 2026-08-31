# Open items

Every open thread in this repository, in one place. Moved out of
[SESSION_HANDOFF.md](./SESSION_HANDOFF.md) on 21 Aug 2026 — that file now carries session state and
hand-off notes only, and points here.

**Closed items live in [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md)**, in full, from
30 Aug 2026. This file is read at the start of every session and stays a briefing; the archive is
not one of the six opening documents and is read only when someone goes looking. **Every archived
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
commitment to dates, and only step 1 and part of step 2 exist today.** It is here so that
individual pieces of work can be read against where they are meant to lead.

| Step | Surface | Tier | State |
|---|---|---|---|
| 1 | **Eligibility** — can this project generate a countable benefit? | Free | Worksheet built; the agent behind it is in progress |
| 2 | **Basin map / Partners** — where is the water stress, and who else is working there? | Free | Map built; the partner layer is item D1 |
| 3 | **Ex-ante quantification** — what benefit would this project produce? | Free | Not started |
| 4 | **Project management** — running the project after it starts | Paid | Not started |

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

| Family | What it covers |
|---|---|
| **[Knowledge](#family-knowledge)** | What the agents are allowed to know — card sets, the source corpus, and the methods behind a number. |
| **[Agents](#family-agents)** | How agents behave, what they may say, how they hand off, and who staffs which post. |
| **[Surfaces](#family-surfaces)** | What a visitor sees and works with — the map, the worksheet, the chat layer. |
| **[Data](#family-data)** | Where real, verifiable data comes from, and whether it exists yet. |
| **[Operations](#family-operations)** | The deploy, the repository, settings and limits that outlast the session that made them. |

| # | Item | Family | State |
|---|---|---|---|
| K1 | VWBA full-docs card pass | Knowledge | open |
| K2 | Co-benefit quantification module | Knowledge | open |
| K3 | VWB Report Corpus | Knowledge | open, no action yet |
| K4 | "Knowledge Pack" — the word for a packaged knowledge set | Knowledge | canon, ruled 26 Aug 2026 |
| A1 | Phoebe abstention loop | Agents | built 25 Aug 2026 |
| A2 | Final agent staffing | Agents | settled 24 Aug 2026; Bridget's colour settled 29 Aug 2026 |
| A3 | Agent handoff primer | Agents | shipped 28 Aug 2026 — rung 2 live |

| A4 | Phoebe returned an empty answer | Agents | one cause fixed 25 Aug 2026 — **not the only one**, see A6 |
| A5 | Primer review against the abstention log | Agents | logged 27 Aug 2026, not due |
| A6 | Phoebe fails about one request in six, and every fault fails late | Agents | fixed and guarded 28 Aug 2026 — 12% to 2% |
| A7 | An abstention cited a card | Agents | logged 28 Aug 2026, waiting on a recurrence |
| S1 | Collaboration and collective action as a partner-finding surface | Surfaces | open |
| S2 | The shared chat layer | Surfaces | built through Level 2 |
| S3 | Level 3 citation pop-out | Surfaces | out of scope — paid platform |

| S4 | Chat docks were thrown away on a surface switch | Surfaces | fixed 23 Aug 2026 — [archived](./OPEN_ITEMS_ARCHIVE.md) |

| S5 | The citation line wraps awkwardly in the narrow dock | Surfaces | cosmetic, polish later |
| S6 | The dev relay resolves imports differently from production | Surfaces | open |
| S7 | The bridge — handing a finished screening to the paid platform | Surfaces | ruled 26 Aug 2026; **waiting on production's desk as their #149** |
| S8 | Brightness pull-up to the book's published Frost values | Surfaces | closed 29 Aug 2026 — [archived](./OPEN_ITEMS_ARCHIVE.md) |
| S9 | The return to the brand book | Surfaces | **closed 30 Aug 2026** — both raises shipped, book at v4.1 |
| D1 | Corporate water stewardship goals and target geographies | Data | open |
| D2 | Project points | Data | blocked on data |
| O1 | Rate limit on public chat | Operations | shipped 25 Aug 2026, number to revisit |
| O2 | Restore branch protection on `main` | Operations | closed 24 Aug 2026 — [archived](./OPEN_ITEMS_ARCHIVE.md) |
| O3 | Reverse link from waterbots.ai | Operations | closed 24 Aug 2026 — [archived](./OPEN_ITEMS_ARCHIVE.md) |
| O4 | Cosmetic and housekeeping items | Operations | left alone deliberately |

| O5 | The engineer pushed without a commit word, twice | Operations | logged 24 Aug 2026 |
| O6 | The card gate reports stale cards that are not stale | Operations | closed 27 Aug 2026 — [archived](./OPEN_ITEMS_ARCHIVE.md) |
| O7 | Merged branches pile up, and are now to be cleared | Operations | closed 27 Aug 2026 — [archived](./OPEN_ITEMS_ARCHIVE.md) |
| O8 | The export step in the close-out ritual | Operations | ruled 27 Aug 2026, open on the script question |
| O9 | The basemap now needs a key, and has a ceiling | Operations | live 27 Aug 2026, standing dependency |
| O10 | Line endings are pinned in git but not in the working folder | Operations | **closed 30 Aug 2026** — O6's claim shrunk, the disk left alone |
| O11 | OPEN_ITEMS.md is heavy and wants an archive | Operations | **first sweep done 30 Aug 2026** |

> **Renumbered 23 Aug 2026.** The previous identifiers were V1–V4, B1–B3 and P1–P8. Every
> reference to them elsewhere in the repository was updated in the same edit rather than left to
> rot: AGENT_RULES.md, SESSION_HANDOFF.md, `src/chat/evidence.ts` and
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

## K3. VWB Report Corpus

Collect and parse roughly ten public volumetric water benefit reports, then identify the must-haves
common to all of them, to shape the production report product.

Opened 20 Aug 2026; **no action taken yet**. The same cite-and-link posture applies — reports live
in `sources-local/`, which never publishes, and the repo carries citations and findings rather than
copied text.

## K4. "Knowledge Pack" — the word for a packaged knowledge set

**Maintainer's ruling, 26 Aug 2026.** A packaged knowledge set is called a Knowledge Pack.

**The rule itself lives in [CLAUDE.md](./CLAUDE.md) under Language rules**, which is the single home
for word rules; this row records the ruling and points there rather than restating it. It matters
most on the Commons surfaces that do not exist yet. No retroactive rewording pass.

Ruled 26 Aug 2026. **Canon — no build.**

---

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

## A2. Final agent staffing — settled

**Settled by the maintainer, 24 Aug 2026. Bridget is the map's agent. Phoebe is the Eligibility and
Feasibility agent. They are two posts, not one.** The grouping of this file into families had
assumed that provisionally; it is now the ruling.

**Her console is not built.** Bridget is named in the map's chat dock and the panel says plainly
that she is not answering yet. That is honest, not provisional — she is the agent, and her chat is
coming. Nothing in the product may imply she answers today.

Her portrait ships from `brand/assets/bots/bridget.svg`.

~~**One question this ruling does not answer.** Her identity colour `#7FD5DF` is still provisional,
and for a different reason: BRAND.md assigns Surf no agent identity, and her value was published
under a retired agent. That is a brand decision, not a staffing one, and it is still open.~~

> **Answered 29 Aug 2026.** BRAND.md v3 §6 assigns Bridget **Surf `#14C8D9`** by name, and the
> retired agent the old value came from is gone from the book. `--bot-bridget` is Surf. It was a
> brand decision, as this item said, and the brand book made it.

**What this unblocks:** the agent handoff primer (item A3), which was waiting on the roster.

### Calvin — named 28 Aug 2026, canon

**The free calculator agent is named Calvin.** Maintainer's ruling, and it is canon from here.

**The name is all that is settled.** His roster entry, his identity colour and his entry in
`agent-primer.md` **come by the maintainer's hand when his lane opens**, the way the design canon
and the brand book arrived. **Nothing about him is invented here in the meantime** — he is not in
the primer, no agent may name him, and no colour is reserved for him by guesswork.

**Why a name is logged before the rest exists.** A name that is decided and unwritten gets
re-decided. This records the decision so the next conversation starts from it, and records equally
plainly that the decision stops at the name.

**His lane is step 3 of the north star** — ex-ante quantification, *what benefit would this project
produce?* — which is not started. Two posts are staffed today, not three.

---

## A3. Agent handoff primer

**A short shared primer telling each agent what the other agents cover and what the overall process
is, so that a handoff is possible.**

Agents are a team and are meant to act like one. Today they cannot: no agent has any account of what
its colleagues do, so an agent asked something outside its own sources can only abstain, even when
another agent covers the question exactly. The example that prompted this: someone asks Phoebe where
the corporate funders are working, which is Bridget's map, and Phoebe has no way to point there.

**One handoff is live as an exception, hard-coded rather than derived from a primer.** Phoebe may
name Bridget and say that Bridget covers the basin map and the water-stress data — that sentence and
nothing further. It is written into Phoebe's prompt directly, because it is a single fact that could
be stated without inventing anything. It is not a small primer; it is a placeholder for one.

The primer would carry, per agent, the plain-English scope of what they cover, what they explicitly
do not, and the sentence another agent may say when pointing at them. It would also carry the shape
of the overall journey — eligibility, then the map, then quantification — so an agent can say where
someone is and what comes next.

**The roster is now settled** — Bridget on the map, Phoebe on eligibility, two posts (item A2,
24 Aug 2026) — so this is no longer blocked on it. **One thing still limits it:** the funder
locations in the example above do not exist yet; they are item D1.

**Rung 3 of the abstention ladder is blocked separately.** [AGENT_RULES.md](./AGENT_RULES.md) states
that an agent with no covering colleague offers a human consultant. There is no consultant, no
contact route, and no page to point at, so the rung is marked not yet live and agents say that
consultants are coming rather than promising one. A contact route is a maintainer decision, not a
repository file.

The output is the primer as a written document, in the same posture as the card sets — proposed,
reviewed, then inherited by each agent's prompt the way
[AGENT_RULES.md](./AGENT_RULES.md) already is.

### Step one written, 27 Aug 2026 — the document

**`agent-primer.md` is on `main`.** Written 27 Aug 2026, read in full by the maintainer and merged
as pull request #13 on 28 Aug 2026. Her read was the eyeball for it, rather than a browser check,
because every sentence in it is a sentence an agent will eventually be allowed to say.

**Writing the document and wiring it into the prompts are two steps**, and only the first has
happened. **No agent has the primer.** The file says so in its own second section rather than
leaving it to be discovered, because a document describing handoffs nobody has could otherwise read
as a capability.

**Scope is a rule, not a list.** Maintainer's correction, 27 Aug 2026: *Bridget covers the basin map
and everything plotted on it.* Today that is basins and water stress; when organisations, projects
or funder locations are plotted they become hers on the day they appear, with no rewrite. A list
would be stale the moment the product grew, and an agent working from a stale list would either
abstain on something it now covers or claim something it does not.

**Three things the reading turned up that this item had not named:**

1. **Bridget cannot receive a handoff** — her chat is not built. Pointing at her has to mean the map
   itself, or the primer fails honest states at the exact moment it was meant to help.
2. **The primer is never cited.** Citation markers belong on card content; the primer is not a
   source.
3. **A question outside every entry is still an abstention.** The primer widens rung 2; it does not
   create a fourth outcome.

**The journey in it stops at quantification.** The north star names a fourth step, but it is the paid
platform, and this file is inherited into prompts — anything in it is something an agent may say.

**Scope came from the rules, not from real questions**, and the document records that in full. See
item A5, and item O9's lesson about what a stale instruction is worth.

### Step two, proposed and not approved

Wiring the primer into Phoebe's prompt, replacing the three hard-coded paragraphs in
`api/_systemPrompt.ts`. The proposed mechanism is the card sets' machinery reused — committed
source, a generated module the relay imports, and a staleness gate — rather than a second way of
getting committed words into a prompt, which would be a second way for them to drift.

**[AGENT_RULES.md](./AGENT_RULES.md) is part of step two, not a follow-up.** It currently says there
is no shared primer and that every handoff but one is not live. That becomes untrue the moment
Phoebe inherits the primer, and shipping a capability while the published rulebook denies it is the
drift the one-home rule exists to prevent.

### Step two is built and parked, 28 Aug 2026

**Built in full and deliberately not committed.** It sits in the working tree on branch
`feat/primer-wired-into-phoebe`, with all ten checks passing. What is built:

- `scripts/build-card-module.mjs` renamed to `scripts/build-prompt-modules.mjs` and generalised to
  emit both bundles, with all eleven references updated.
- `api/_primer.generated.ts` generated from an **agent-facing region** of `agent-primer.md`, marked
  by `<!-- AGENT-FACING: BEGIN -->` and `<!-- AGENT-FACING: END -->`, with the staleness gate
  covering both bundles and a missing marker throwing rather than embedding the wrong thing.
- `api/_systemPrompt.ts` wired to the primer, replacing the three hard-coded paragraphs.
- [AGENT_RULES.md](./AGENT_RULES.md) at a live rung 2, and the primer's own second section rewritten
  from *not yet inherited* to *inherited by Phoebe*.

**Three of the four live questions passed, and Phoebe's sentence was the maintainer's sentence, word
for word.** A map question produced the primer's Bridget line exactly and pointed at the map rather
than at a conversation with her; a funder-location question gave the honest limit instead of pointing
at Bridget; a question no agent covers was a plain abstention.

**It is parked behind item A6**, on the maintainer's ruling of 28 Aug 2026, because a third of
ordinary questions failing outranks a handoff that nothing claims to have.

**Why the region split exists**, since it is the least obvious part of what is parked: embedding the
whole primer produced empty and one-character replies. Embedding only the roster stopped that. The
outer sections are instructions about the prompt and provenance for human readers, and adding them
as a second instruction layer destabilised plain answers.

**One line to re-apply when it resumes.** Item O6's quoted check output names
`build-card-module.mjs`. That is a historical quote of what the check printed on 26 Aug, when the
script had that name, so it was left alone here on purpose. Decide when step two lands whether a
historical quote should keep its historical name — this record says it should.

**The two hangs re-test after A6 lands**, since they may share a cause with the faults there.

### Step two shipped, 28 Aug 2026 — re-tested on the new engine

**It was parked behind item A6 and unparked once that landed.** The re-test was the same four
questions through the same instrument, on Opus 5 with the two guards in place.

**The hang is gone.** The hard question was asked ten times: **ten answers, 9.4 to 17.2 seconds,
none over 120.** The two 240-second stalls that parked this work did not recur, and no guard fired —
no timeout, no retry, no refused reply. Whether the engine, the guards or both removed it cannot be
separated, and does not need to be.

**Phoebe's sentence is the maintainer's sentence, compared character by character rather than by
eye:**

> "The basin map covers that — it is Bridget's. Her chat is not answering yet, but the map itself
> will show you."

**Q2 gave the honest limit** rather than pointing at Bridget as though the map answered it — funder
locations are not plotted, so there is no honest answer to give. **Q3 abstained cleanly** with no
colleague named and no consultant promised.

Opened 22 Aug 2026. **Step one merged and step two shipped, 28 Aug 2026. Rung 2 is live.**

## A4. Phoebe returned an empty answer — one cause found, ~~and fixed~~ **not the only one**

> **Corrected 28 Aug 2026.** ~~This item was recorded as diagnosed and fixed.~~ **It was not fixed;
> one of its causes was.** Empty answers were measured again on 28 Aug at 945 and 733 of 16,000
> output tokens — nowhere near the ceiling that this item identified. The budget fault below was
> real, was measured, and was fixed. **It was not the whole fault.** The struck words are left
> visible rather than rewritten, because a record that quietly changes its mind teaches a later
> reader to trust it less, not more. The live problem is item A6.

**Seen three times in two days of real use**, and all three had one cause. Once on 23 Aug 2026
during a browser check, and twice more on 25 Aug 2026 during the maintainer's preview check — an
answer with nothing in it, and an answer cut off for running out of room, both on one short message.

**The cause: hidden thinking was spending the whole answer budget.** Claude Sonnet 5 thinks before
it writes, that thinking is not shown, and it is charged to the same output budget as the reply. The
relay never set the thinking parameter, so it inherited the model's default — adaptive thinking at
"high" effort. Nothing in the code said so, which is why two days of faults looked inexplicable. A
default nobody wrote down is a decision nobody made.

**Measured rather than reasoned**, four real requests through the same prompt and model on
25 Aug 2026:

| Question | Output tokens | Visible reply |
|---|---|---|
| "why?" | 416 | 238 characters |
| "Is it eligible?" | 1,073 | 384 characters |
| "Does a borehole in Kenya qualify?" | 710 | 1,010 characters |
| Two sentences about a Turkana project | **4,194** | 1,848 characters |

Every one returned a thinking block with zero visible text, then the answer. The last row is the
one that matters: 1,848 characters is roughly 460 tokens of reply, so about 3,700 tokens — 88% of
the spend — were invisible thinking, on a two-sentence question.

**A short question is not a cheap one.** The budget comment claimed 8,192 was "roughly double the
worst run observed"; a two-sentence message already reached half of it. Worse, a vague question
gives her less to ground on, so she deliberates more rather than less.

**The empty answer is the same curve one step earlier.** With the budget nearly gone, the model
still has to close out the shape it was told to produce. `reply` is required but nothing said it
must be non-empty, so an empty string is schema-valid, parses cleanly, and is then refused by the
relay's `validate` — which refuses for exactly one reason, and that is it.

**Fixed 25 Aug 2026, four changes:** the budget raised from 8,192 to 16,000, which does not raise
the bill because output is charged on what is produced rather than budgeted; thinking and effort
stated rather than inherited, at "medium"; an empty answer given its own honest message, since "she
said nothing" and "she said something unreadable" are different things and the old wording claimed
the second; and every failure now logs the token spend against the budget.

**Confirmed after**, on the same questions: the Turkana message fell from 4,194 to 977 and 2,088
across two runs, and ~~worst-observed headroom went from 51% of the budget to 13%~~. Abstention
discipline held — three questions with no covering card all abstained cleanly. A substantive answer
still placed all six eligibility markers inline.

> **Corrected 28 Aug 2026, under the visible-corrections rule.** ~~Worst-observed headroom went from
> 51% of the budget to 13%.~~ **There is no headroom. The ceiling is reached.**
>
> Measured over sixty requests on 28 Aug 2026: **two requests spent 16,000 of 16,000 output tokens
> and stopped on `max_tokens`.** They took **102.8 and 109.5 seconds**, against a normal call of
> about twenty.
>
> **The struck sentence was true of four requests in August and was written as though it were true
> of the budget.** Four runs of one short question are not a worst case; they are four runs. This
> item's own lesson — *measured rather than reasoned* — was applied to the fix and not to the
> claim about the fix.
>
> **Budget exhaustion is now its own fault with its own answer**, carried by item A6 alongside the
> empty answers. Raising the number again is not proposed here: at 16,000 the two runs that hit the
> ceiling were also five times slower than normal, which suggests something is running away rather
> than something needing more room.

**The two questions this item asked are both answered.**

*Can an empty reply move the worksheet behind an error?* **No, and it cannot.** `validate` returns
null, the relay answers 502, and `askPhoebe` throws before `PhoebePanel` ever calls
`onCriteriaUpdate`. That worry is closed.

*Does an empty answer deserve its own message?* Yes, and it has one now.

**What was deliberately not done:** a minimum length on the schema's `reply`. It would stop the
empty answer by forcing the model to emit something — a full stop, a single word — when it has no
room, turning an honest failure into a meaningless answer that looks real. The empty reply should
keep failing. It should just fail with the truth.

**One thing this item got right, and it matters now.** It refused to put a minimum length on the
schema's `reply`, on the grounds that forcing the model to emit *something* turns an honest failure
into a meaningless answer that looks real. **On 28 Aug a seven-character reply reached a caller
anyway** — not because a minimum was added, but because the guard tests for *empty* and seven
characters is not empty. The principle held; the guard did not implement it. That is part of item
A6.

Opened 24 Aug 2026. ~~Diagnosed and fixed 25 Aug 2026.~~ **One cause diagnosed and fixed
25 Aug 2026; reopened in substance by item A6 on 28 Aug 2026, and corrected twice — the "fixed"
claim on 28 Aug, and the headroom claim the same day.**

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

## A7. An abstention cited a card, once

**Logged 28 Aug 2026. Small, and waiting on a recurrence rather than on anyone.**

**What happened.** During the Option B measurement of item A6, fifteen questions were asked that no
card covers, to confirm abstention discipline. **All fifteen abstained cleanly.** One of them —
*"How much does it cost to drill a borehole in Kenya?"* — abstained **and cited one card**.

**It is not a discipline failure.** She abstained, which is the correct outcome, and she invented
nothing. A citation alongside an abstention may even be right: an agent may point at what she *does*
cover while declining what she does not.

**What is not known is why**, because the instrument recorded the card count and not the text. Asked
again immediately afterwards, the same question abstained with no citation at all, so it does not
reproduce on demand.

**Why it is logged rather than chased.** One occurrence in fifteen, with a correct outcome, does not
justify spending on a hunt. **And the instrument now captures the reply text**, so the next
occurrence explains itself rather than needing to be re-measured — which is the whole reason the
capture was added.

**What "done" looks like:** the next time it happens, read the text. If she is pointing at what she
covers, that is good behaviour and this item closes as a false alarm. If the citation supports
something she declined to say, that is a real fault and it becomes its own item.

Logged 28 Aug 2026. **Open, not due, and waiting on a recurrence.**

---

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

## S2. The shared chat layer

**One chat component every open-site agent uses. Agents supply evidence; the layer renders it.**

Phoebe has a chat dock today and Bridget will need one. Built twice, they diverge — and the part
that diverges is the part that carries citations, which is the part that must not. This item is the
single component both use, and any agent after them.

**The layer owns** the numbered inline markers, the one-line expand
(source · version · section · page → canonical link, in the map's attribution-bar style), the
transcript, the composer, and the honest failure states. **Nothing citation-related lives inside
`PhoebePanel.tsx`** once this lands; the panel keeps host identity and an adapter and nothing else.

**The contract** is an `Evidence` record — a stable id, a label, the citation from the committed
card file, and the plain-English text — plus an answer carrying Level 1 prose with `[[id]]` markers
in it. Each agent has its own adapter producing that shape: Phoebe's from the card files, Bridget's
later from basin and stress data. The layer never knows which agent it is rendering.

**The guarantee this preserves** is the one in [CITATIONS.md](./CITATIONS.md): an agent places a
marker and never writes citation text, so a wrong page or an invented link is not something an
agent can produce. A marker naming a card that does not exist is dropped rather than rendered.

**It requires a change under `api/`** — Phoebe returns cited cards with no inline positions today,
so the response schema and her prompt both need the marker. Authorised by the maintainer,
22 Aug 2026.

**Level 3 is out of scope and stays out.** See the item below.

**Debt this item cleared.** `.wb-source-link` in `src/styles/base.css` was a patch on the old
footer-style source list, fixing a link that Tailwind's preflight had stripped of its underline. It
was logged as deliberately temporary rather than kept quietly, and it is **now deleted** — the
layer's `.wb-cite-line` replaces it, in the attribution-bar style CITATIONS.md requires.

### What is built, 22 Aug 2026

- `src/chat/evidence.ts` — the contract. Citation, Evidence, the turn types, the host descriptor,
  and the numbering helper. The layer defines the citation shape and each agent's adapter converts
  into it, so the second agent conforms to the contract rather than to the first agent's data model.
- `src/chat/AgentChat.tsx` — the shell. Transcript, composer, honest failure states, host identity
  from a token. It does not know which agent it is rendering.
- `src/chat/EvidenceBlock.tsx` — the citation rendering, with the Level 2 line in it.
- `src/lib/phoebeClient.ts` — Phoebe's adapter. `resolveEvidence` turns her card numbers into
  Evidence records read from the committed card files.
- `src/components/PhoebePanel.tsx` — reduced from 365 lines to identity and wiring. Her worksheet
  side effect stays hers; the layer never learns worksheets exist.

### Level 2, built 23 Aug 2026

- `layoutAnswer` in `evidence.ts` splits an answer into paragraphs and segments, numbering markers
  **in order of first appearance** rather than in whatever order the agent listed its cards.
- `AnswerBody.tsx` renders the prose with markers in it. A marker is a button, not a link: it
  discloses something already on the page, and the link out to the publisher lives inside the line
  it opens.
- `CiteLine.tsx` is the one line, in CITATIONS.md's fixed order, and the end of a citation here.
- `api/_systemPrompt.ts` — rule 7 teaches Phoebe to place `[[eligibility-4]]` at the end of the
  point a card supports, and the schema's `reply` description carries the same. She still names a
  card and nothing more.

**Three failure paths are handled rather than assumed away.** A marker naming a card that does not
exist is removed from the prose, along with the space before it where that would otherwise leave
"a claim ." on screen. A card cited without a marker still renders, under "Also rests on", so a
forgotten marker cannot silently drop a citation. A repeated marker keeps one number.

Opened 22 Aug 2026. **Built through Level 2.** Level 3 is out of scope — see S3.

## S3. Level 3 citation pop-out — paid platform, not this repo

**Maintainer ruling, 22 Aug 2026.** The free site does not build Level 3. No pop-out, no tabs.
Clicking a marker shows one line and nothing more.

The extracted chat rules describe a third level: a "read more" pop-out with a plain-English tab and
a verbatim source-text tab. **That is a paid-platform feature.** It is logged here for two reasons.

First, so nobody rebuilds it from the extracted rules by mistake — the rules are in the repository
and read as though all three levels apply here.

Second, because it could not have been built here anyway, and the reason is worth keeping.
[CITATIONS.md](./CITATIONS.md) forbids this repository holding document excerpts beyond short
attributed snippets, and neither committed card set contains a single one — checked 22 Aug 2026,
the word "Excerpt" appears zero times in either file, and the card files state outright that every
sentence is a rewrite. A verbatim source-text tab on this site would have had nothing to show.

Nothing to do. Recorded so the decision is not re-litigated from the rules alone.

## S4. Chat docks were thrown away on a surface switch — closed, swept to the archive

**Fixed 23 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
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

## S7. The bridge — handing a finished screening to the paid platform

**Ruled by the maintainer, 26 Aug 2026, and free by that decision.** At the end of a completed
screening the visitor is offered one thing: *"Save this project and sign up?"* If they choose it,
their own project context and their projection go across to the paid platform, and the journey on
this site ends there.

**It is one-way, and it happens only on their click.** Nothing crosses unless the visitor asks for
it.

**It does not change the no-memory rule.** This site still keeps nothing between visits. The handoff
carries what the visitor built in front of them, at the moment they ask for it, and this site keeps
no copy of it.

This is the crossing the north star already names — the free tier ends where step 4 begins, and the
bridge is how someone steps over.

**No proposal yet.** The shape of the handoff — what crosses, how, and what the paid side receives —
is coordinated by the maintainer's hand, not designed in this repository. Rule zero holds while it
is.

**It has a number on the other side, and it is on their desk — production's #149.** Recorded
30 Aug 2026 by the maintainer's note. **Nothing about that changes what happens here:** the shape is
still theirs to settle, this repository still designs none of it, and rule zero still holds. What
the number buys is that a later session can tell **waiting on production** apart from **nobody has
picked this up**, which are the same silence from inside this repo and are not the same thing.

**This item does not wait on an engineer here**, and no work is queued behind it.

Logged 26 Aug 2026. **Ruled — no build. Waiting on production's desk as their #149.**

---

## S8. Brightness pull-up to the book's published Frost values — closed, swept to the archive

**Closed 29 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## S9. The return to the brand book

**The brand book arrived by the maintainer's hand on 28 Aug 2026 — version 3, one light brand,
superseding the two-theme era.** It governs both properties and is complete on its own page.
`BRAND.md` in this repository **is** that book. It is gitignored, as it has always been, so it does
not publish.

**This item is the work of returning the shipped stylesheet to it.** It is not a second design
ruling. The book is the ruling; this is the list of places the code has not caught up to it yet,
and what is being done about each.

**[DESIGN_CANON_for_ShellB.md](./DESIGN_CANON_for_ShellB.md) is superseded by the book and says so
from 29 Aug 2026**, by the maintainer's header, applied verbatim with the original text preserved
underneath. Until that landed the canon read as binding and was not. **The canon's rulings were not
wrong** — the left rail, the "<" navigation and the chat dock rules it confirmed were carried into
the book and live there now. Item S8 below is the canon's work and stays as history; nothing in it
is restated here.

### What the book changes here, measured against the shipped stylesheet

Read against `src/styles/tokens.css` and `src/styles/base.css` on 29 Aug 2026, not assumed.

| | Ships today | The book | On screen |
|---|---|---|---|
| Canvas `--paper` | `#FBFBFE` | **`#F6F5FA`** | Yes — every page |
| Hairline `--line` | `rgba(11,20,40,0.09)` | **`rgba(11,20,40,0.10)`** | Barely |
| `--r-md` | `10px` | **`12px`** | Yes — working cards |
| `--r-lg` | `14px` | **`16px`** | Yes — document cards |
| Neutrals | `--fg-1` … `--fg-4` | **`--ink`, `--ink-2`, `--ink-3`, `--ink-4`** | No — a rename |
| The dark theme | `.theme-dark` block, unused | **Gone. One light brand** | No — dead code |
| Bridget | `#7FD5DF`, provisional | **Surf `#14C8D9`** | Yes — her ring and wash |

**The dark theme was never rendered here.** `App.tsx` sets `theme-light` and nothing sets
`theme-dark`. The block was kept as correct reference for a signed-in surface that this repository
does not have and, under a one-theme book, will not get. **The `.theme-light` class goes with it**
— maintainer's ruling, 29 Aug 2026: *one theme needs no switch*. A theme class with one theme left
in it is how a second theme quietly grows back.

### The `--chrome` question is answered, and the answer moved once

**It is no longer held.** The maintainer ruled on it rather than waiting on production's loop, and
the answer changed shape the same day after being built and looked at. Both stages are recorded
here, because this item is the one home for the story and every comment in the code carries two
lines and a pointer to it.

**What it was.** This repository derived a fourth plane, `--chrome` `#E8E9ED`, by applying
BRAND.md's elevation formula downward from the canvas: `color-mix(in srgb, #0B1428 8%, #FBFBFE)`.
The formula was right — the same 8% step reproduced the published Deep Marine `--card` exactly,
which is what confirmed it — and the conclusion was wrong, because **BRAND.md v3 §2.3 allows three
planes and no fourth.** By 29 Aug it also sat only **4.4 points of CIE L\*** from the canvas, down
from 6.3, because the canvas had moved to `#F6F5FA`. It was doing neither job.

**First answer, ratified and built: chrome takes the canvas.** In a three-plane system the
mechanism for *chrome recedes* is that content rises onto white cards while chrome stays on the
canvas. Chrome recedes by not rising.

**Second answer, ruled after the browser check the same day, and it stands.** ~~Chrome takes the
canvas.~~ **The frame and the content have different grounds.**

| Token | Value | Carries |
|---|---|---|
| `--paper` | `#F6F5FA` | The **content** canvas — the map, the worksheet |
| `--frame` | `#FBFBFE` | The **frame** — top bar, rail, and both docks' ground |

**Why the first answer was wrong, in the maintainer's words:** on production `#F6F5FA` is the
landing *content's* canvas and the frame around a console stays lighter Frost. Painting the frame
`#F6F5FA` here put the warm value on the wrong layer, and the pale sea then sat nearly at the
frame's own tone. **Content warm, frame lighter and receding** — the same relationship as
production, mirrored for a surface whose content is a map.

**Measured, not judged by eye:**

| | CIE L\* | Chroma |
|---|---|---|
| `--card` `#FFFFFF` | 100.00 | 0.0000 |
| `--frame` `#FBFBFE` | 98.69 | 0.0118 |
| `--paper` `#F6F5FA` | 96.74 | 0.0200 |

The frame is **1.96 L\* lighter** than the content canvas and carries **41% less chroma**. Both
lean very slightly blue, so *cooler* is loose wording: the frame recedes by being **lighter and
less tinted**, and the proposed book line should say so.

**One thing the ruling broke, and its answer.** The active navigation item rises one plane to
`--card`. Against `--frame` that is a step of **1.31 L\***, very nearly invisible. **It now takes
the 1px `--line` hairline that §2.3 pairs with a white card** — the border carries the weight, and
using the fill alone was the incomplete half of a rule the book already states. That is the book
applied properly rather than a new device, so it needs no separate ratification.

### Both properties settle on one word for it — production's #161

**Maintainer's note, 30 Aug 2026. Nothing to build here; it is recorded so the two sides do not
drift into two names for one thing.**

> **Production retires `--chrome` in code under the name `--frame` — this site's own token — so both
> sites speak one word.** Logged as production's item #161.

**The word travelled the same way the ruling did.** This repository needed a name for the frame's
ground when the two grounds were separated on 29 Aug, minted `--frame`, and sent the *relationship*
up rather than the value. Version 4 §2.3 carries the relationship and the worked example, and is
deliberate about the rest: the frame value is **"recorded as an example, deliberately NOT minted as
a token"**, because naming one is a design question belonging to the sweep that removes `--chrome`
from the product. That sweep is #161, and it takes `--frame` with it.

**What this repository does about it: nothing.** The token is already called `--frame` and already
holds `#FBFBFE`. The note exists so that a later reader who finds `--frame` here and `--chrome` in
an older production file knows they are the same idea, one step apart in time, and not two
competing devices.

**The book still carries no name for the frame value**, and that is not a gap to fill from here.
Until it does, this site states the relationship — *one step lighter than its canvas* — exactly as
§2.3 instructs.

### For the maintainer's hand — the ratification bundle. DELIVERED 30 Aug 2026

**All four landed in version 4 of the brand book**, brought by the maintainer's hand on
30 Aug 2026. This list is kept as the record of what was sent up and where each one came to rest;
nothing on it is still owed.

| # | Ruling | Where it sits in version 4 |
|---|---|---|
| 1 | The frame and the content have different grounds | **§2.3**, her words carried in whole, with the worked example |
| 2 | An active navigation item rises one plane, with a hairline | **§2.3** |
| 3 | The three shadow values | **§4** — **and the values came back changed; see the raise below** |
| 4 | Slate `#3D5878` at 13% as a basemap wash | **§7** |
| 5 | ~~Driftwood into use~~ | **§2.1**, recorded as proposed and reversed, the strike kept |

**Version 4 closed a fifth thing that was not on this list:** Phoebe's roster gap. §6 now carries a
**roster-extension rule** — a surface may add its own agents under the book's rules, never replace
or fork the shared crew — and **Phoebe has her own entry under it**, Anemone by name. The one-line
amendment that was owed by the maintainer's hand is delivered, and it came back larger than one
line.

The original bundle, as it was sent up, follows. **Four items, and the first had been amended
since it was first ratified.**

1. **The frame and the content have different grounds.** Proposed line: *the warm canvas belongs to
   content; the frame sits one step lighter and quieter.* **This replaces the earlier "chrome takes
   the canvas", which she ratified in the morning and superseded the same afternoon.** The part
   that survives is that chrome gets no plane *below* the canvas.
2. **An active navigation item rises one plane, to `--card`, with a hairline.** The book covers
   chips, tags, dots and buttons and says nothing about navigation state.
3. **The three shadow values.** `--shadow-md` is not invented — it is the value already shipping on
   the basin tooltip, ink at 10%, the hairline's own alpha. `--shadow-sm` and `--shadow-lg` are one
   reasoned step either side.
4. **Slate `#3D5878` as a basemap wash, at 13%.** The book gives Slate the role *quiet monitoring*
   and says nothing about map washes. Ruled 30 Aug 2026 after walking four strengths. It is warm
   hues that §2.5 reserves, so a warm wash was never available; Slate is reserved for nothing and
   holds no agent identity here. **The reasoning lives in `src/lib/basemapWash.ts`.**
5. ~~**Driftwood `#8E7147` taken into use for the dry categories.**~~ **Struck 30 Aug 2026 — this
   ratification is withdrawn and is not carried to the book.**

   > ~~Ruled *out for now*.~~ **Corrected the same day, under the visible-corrections rule.**
   > *Out for now* said this was deferred. **It was not: it was decided, on the merits.** The
   > maintainer's finding, in her words — **the warm bronze made Arid read as a value, and the dry
   > categories' job is to read as no reading at all.** Driftwood returns to the book's shelf as the
   > recorded spare, unclaimed, and the dry categories keep the fills they shipped with.
   >
   > The distinction matters to a later reader. A deferred proposal invites someone to pick it up
   > again; **a decided one tells them what was learned and why not to.**

### Raise 1 — the shadow values came back changed, and the book says they did not

**Found 30 Aug 2026, reading version 4 against the shipped stylesheet.** This is the third item of
the ratification bundle, returning different from how it went up.

**What was sent up** was this repository's shipped `--shadow-md`, argued as not-invented because it
was already on the basin tooltip at ink 10%, the hairline's own alpha, with `--shadow-sm` and
`--shadow-lg` one reasoned step either side.

**What version 4 §4 publishes:**

| Token | Version 4 | Ships here | |
|---|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(11, 20, 40, 0.06)` | the same | agrees |
| `--shadow-md` | `0 8px 24px -8px rgba(11, 20, 40, 0.12)` | `0 4px 14px rgba(11, 20, 40, 0.1)` | **differs** |
| `--shadow-lg` | `0 24px 48px -12px rgba(11, 20, 40, 0.18)` | `0 12px 32px rgba(11, 20, 40, 0.14)` | **differs** |

**The two that differ are deeper, softer, and pulled in at the edges.** The book explains the pull-in
itself: *"all three lift more than they darken — the negative spread is what keeps a shadow from
reading as a grey box."* Ours carry no negative spread. So the change reads as deliberate rather
than as a slip, which is why it was raised rather than treated as a transcription fault.

**§4 also says: "the token file already agrees with them, so there is nothing to reconcile."** On
this property's file that sentence is not true. §0 says one token file per property, so the sentence
is presumably true of the other property and was carried across without being re-checked here.
**Recorded so the next reader is not misled by the book itself.**

**Ruled 30 Aug 2026: the book wins.** The negative spread was added on purpose. The token file takes
§4's values exactly.

**It is visible, so it is its own step with the maintainer's eyeball on it.** `--shadow-md` carries
the map legend and the basin hover tooltip; `--shadow-lg` is used nowhere yet, so nothing moves for
it. `--shadow-sm`, on the credit strip, does not change at all.

**Closed 30 Aug 2026 — shipped as pull request #41.** Captured before and after in the same
viewport, same map view, same basin, and approved on the pixels. It was the first step built under
the images-first ruling of the same day, and the capture was what the approval was given on.

**A false comment went with it.** `base.css` said the basin tooltip's rule was where `--shadow-md`
came from rather than the other way round. True until §4 published a different value; struck and
corrected in place.

### Raise 2 — coral set as text does not clear the book's own bar

**Found 30 Aug 2026, reading version 4 against the shipped stylesheet.**

**Two map error messages are set in `--state-warn` `#E25858` at 11px mono**, in `src/App.tsx`:
*"Water stress data unavailable — basins are shown unfilled"* and *"Detailed basins unavailable —
showing the world view."*

**Measured, not judged by eye:**

| Coral `#E25858` on | Contrast |
|---|---|
| `--frame` `#FBFBFE` | **3.52:1** |
| `--paper` `#F6F5FA` | 3.35:1 |
| `--card` `#FFFFFF` | 3.64:1 |

**§9 asks 4.5:1 for text.** These are the frame's own error messages, so 3.52:1 is the number that
matters, and it misses.

**§2.5 already carries the mechanism** — *"on light surfaces, roles used as TYPE are darkened to
clear 4.5:1 — the same hue mixed toward ink, not a new colour"* — and publishes three darkened
values: live `#0E8A96`, approved `#1E9077`, verification `#6A47E0`. **It publishes none for coral.**

**So nothing is applied here.** §0 forbids inventing what the book does not carry. A darkened coral
is proposed following §2.5's own pattern, reported with its measured ratio, and **carried into the
book by the maintainer's hand as a §2.5 addition** before anything ships. Maintainer's ruling,
30 Aug 2026.

**The dot and fill value is untouched either way** — §2.5 is explicit that darkening is for type
only. Everywhere else coral appears here it is a 2px keyline or a dot, which is §2.6 working
correctly.

### Closed 30 Aug 2026 — and it corrected the book rather than only this site

**`#BF4949` was proposed, measured, ruled and shipped as pull request #42**, through a new
`--state-warn-text` token named to match the existing `--tide-text`. **`--state-warn` is unchanged**
and still draws every dot, fill and keyline.

**The maintainer ruled not to wait for the book**, so the site shipped ahead of it and the token
file says so where the next hand would reach. The book caught up the same day at **version 4.1**.

**Measuring the book's own three values turned out to matter more than the coral did.** Live and
approved are published in §2.5 as *darkened to clear 4.5:1*, and neither does:

| The book's value at v4 | frame | paper | card | |
|---|---|---|---|---|
| live `#0E8A96` | 3.99:1 | 3.80:1 | 4.12:1 | **fails** |
| approved `#1E9077` | 3.83:1 | 3.65:1 | 3.95:1 | **fails** |
| verification `#6A47E0` | 5.66:1 | 5.39:1 | 5.85:1 | clears |

**Corrected values were proposed by the same method and accepted** — live **`#087C87`**, approved
**`#177F68`** — and **verification was left alone**, because a published value that already works
should not be changed for symmetry. All three plus coral are written into **§2.5 at version 4.1**.

**Nothing on this site rendered wrongly because of it**, which is why it was a proposal rather than
a fix. `--state-approved` appears here as a 7px dot and a 3px keyline; `--state-live` is not used at
all yet. Both are correct forms under §2.6, so there was nothing to repair — the fault was in the
book, and the book is where it was fixed.

**Version 4.1 is the first amendment written into the book from inside this repository**, on the
maintainer's explicit instruction. It is the exception. Everything else still arrives by her hand,
and rule zero is untouched.

### The ramp was explored, and it stands — 30 Aug 2026

**A ramp change was proposed, built, walked and withdrawn on the maintainer's ruling.** The record
is kept because the finding is worth more than the change would have been.

**What was tried.** Three ramps were put on the real map behind a dev-only switch: the shipping one,
a proposed one built from deeper brand hues with Marine at the top, and a severity-held variant that
moved only the calm end. All three were confirmed against `check-palette` first. The maintainer then
ruled a **hybrid** — her own cool-end hexes from a design exploration built outside this repository,
with the warm end kept from the proposal — and that was built and gated too, passing all four
properties.

**The ruling, after walking the map at 13% wash:** ~~the hybrid ramp~~ **the previous ramp stands.**
In her words: *the wash at 13% was the missing richness, not the ladder.* **`src/lib/stressPalette.ts`
is byte-identical to what it was before any of this**, confirmed with `git diff` rather than by eye.

**The principle she stated survives the withdrawal, and belongs to the book whatever the ramp does:**

> The calm half of the ladder is the brand's blues; the warning half keeps the field's warm
> convention. **Warm means worse, as WRI's own maps read, and severity is never something a visitor
> must learn from a legend.**

**Driftwood is refused on the merits, ~~held for later~~.** It was proposed for Arid and No Data and
**decided against, not deferred** — maintainer's ruling, 30 Aug 2026: **the warm bronze made Arid
read as a value, and the dry categories' job is to read as no reading at all.** It comes off the
ratification list and returns to the book's shelf as the recorded spare.

**The check passed and the eye refused it, and that is the point worth keeping.** `check-palette`
confirmed the chroma margin still separated the dry categories from every band — it had fallen from
1.85 to **1.41**, but it held, so the gate said yes. **The gate measures separation; it cannot
measure what a colour reads as.** A warm fill on arid land reads as a warm value however far its
chroma sits from the ramp, because a reader has already been taught that warm means worse two bands
above it.

**So 1.41 is kept as a number, and demoted as an argument.** It is still the first thing to look at
if the calm end is ever lightened again. It is not evidence that a warm off-scale fill would work.

**What this cost and what it bought.** Two ramps were designed, machine-checked and thrown away. What
it bought was the knowledge that the map read flat because of the *basemap*, not the data — which no
amount of reasoning about the ladder would have found, and which the eye found in one sitting.

**No images are kept, and that is a ruling rather than an omission.** The design exploration's
screenshots were to be carried in by the maintainer's hand and captured into a reference document,
the way the Replit demo was captured into `UI_REFERENCE.md`. **Ruled 30 Aug 2026: they are not
coming.** The outcome is recorded here in full and the wash it led to is shipped, so there is
nothing left for images to teach. The folder that had been prepared for them was removed rather than
left waiting — **an empty seat reserved forever is its own small untruth about what is expected.**

### Route C, logged as the future real answer

**A custom CARTO vector basemap, styled to the book.** It is the only route that gives genuine
control over the sea and the land rather than tinting someone else's raster tiles. It is
substantially more work and it changes the standing dependency in item O9. **Not proposed and not
built** — recorded so it is not rediscovered as a new idea.

### ~~Two things were held, and one still is~~ Both were held, and neither is now

**Corrected 30 Aug 2026.** Both holds are released — the first by the maintainer's ruling of
29 Aug, the second by version 4 of the book. The original text is kept because it records what was
believed while each was still open.

**1. `--chrome`.** ~~This repository derives `--chrome` `#E8E9ED` and paints four surfaces with it —
the top bar, the navigation rail, the chat dock and the chat shell. **The book allows three planes
and no fourth**, and names no fill for chrome; §2.3 says only that chrome recedes, flush and square,
never a card. §0 says to raise what the book does not carry rather than invent it. **The value is
not touched.**~~

**Released 29 Aug 2026 and long since built.** `--chrome` is retired as a token here, the frame
takes `--frame` `#FBFBFE`, and **version 4 §2.3 retires it in the book too** — *"chrome recedes, and
it recedes by going QUIET, not by going DOWN"* — with the reason this repository could not see from
inside: a plane below the canvas is a fourth plane, and the rule and the token had been
contradicting each other since the table was written. Production retires the token under this site's
name for it; see *both properties settle on one word for it* above.

~~**One consequence, recorded rather than worked around.** Moving the canvas to `#F6F5FA` brings it
closer to chrome's `#E8E9ED`. The rail and the dock will separate a little less than they do today.
The 1px `--line` rule under the chrome carries that separation regardless, and it stays.~~
**Moot from 29 Aug 2026** — there is no `#E8E9ED` left to close on. The 1px `--line` rule under the
frame does stay, and it is what separates the rail and the dock now.

**2. The three shadow values.** ~~§4 names `--shadow-sm`, `--shadow-md` and `--shadow-lg` and says
what each is for. **It publishes no value for any of them.** They cannot be added here without
inventing three values, which §0 forbids, so they are not.~~

**Released 30 Aug 2026 — version 4 §4 publishes all three.** The hold is over, and what came back
is not what was sent up. See *the shadow values came back changed* below.

### A false line in the code, struck 29 Aug 2026

`src/styles/base.css` carried this, in the comment explaining why the chrome takes a bottom rule:

> ~~On Frost, `--chrome` aliases `--paper` (BRAND.md publishes no Frost chrome value), so the fill
> alone cannot separate navigation from the canvas.~~

**It was true when it was written and has been false since 18 Aug 2026.** On 13 Aug the token was
literally `--chrome: var(--paper)`, an alias, and the comment described it correctly. The derived
`#E8E9ED` arrived five days later in the console-shell build and the comment was left behind.

**Nothing rendered wrongly because of it** — the bottom rule is right either way, and the chrome
does separate from the canvas by fill as well as by rule. The cost is to a reader, who would have
been told the two fills are the same when they are not, at exactly the moment the `--chrome`
question above is being taken to production's book. Struck and corrected in place, dated, per the
visible-corrections rule.

### The rail rider, inherited from item S8

The design canon asked that the left rail be widened modestly **when the rail is next touched for
another reason**, and said plainly that it is not its own work item. Item S8 carried it because S8
was the most likely next work to open the rail.

**It moves here.** S8's work is finished; this item is now the most likely next work to open the
rail. **It is still not an item and this is still not it** — it lives in the canon, and it is named
here so that a rider nobody can find does not become a rider nobody rides.

**No step in the approved plan opens the rail**, so it does not ride yet.

### The colour re-review rider, answered by the book

Item S8 carries a rider from the maintainer's ruling of 27 Aug 2026: after the brightness pull-up
lands, both agent identity colours are re-reviewed against the status taxonomy, because **an agent
colour must never read as a project status** and Bridget's provisional `#7FD5DF` sits near *Live*.

**The book answers it rather than the re-review answering it.** §2.6 rules that the form factor
carries the meaning: a status may only be a 7–10px dot or a 1px keyline on a data row; an identity
may only be a bubble, a portrait, a surface accent or a keyline. **Surf's double duty is accepted on
exactly that basis** — Surf as a dot means *live*, Surf as an identity means *Bridget*.

So after Bridget becomes Surf `#14C8D9`, her colour is not merely near the Live status colour, it
**is** the Live status colour — and that is the book's intended state, not a collision. Maintainer's
ruling, 29 Aug 2026: **record the rider as answered by the book's form rule.** Item S8 closes when
Bridget's step lands.

### The plan, approved 29 Aug 2026

Seven steps, one approval, built through per the ritual. Two need the maintainer's browser check;
the rest are value swaps and renames that move nothing on screen.

| # | Step | Eyeball |
|---|---|---|
| 1 | The superseded header on the design canon | Read only |
| 2 | This item | Read only |
| 3 | The false `--chrome` comment struck | No |
| 4 | Canvas, hairline and the two radii to the book's values | **Yes** |
| 5 | The dark theme retired and the theme class collapsed | No |
| 6 | The neutrals renamed `--fg-*` → `--ink-*` | No |
| 7 | Bridget settled as Surf `#14C8D9` | **Yes** |

**The book's asset tree goes to `brand/assets/`**, which already exists in the shape §8 describes.
**No step in this plan needs it.** Two things to watch when it lands: `bots/` currently holds
`phoebe.svg` and `phoebe-card.svg`, and **Phoebe is not on the book's roster**, so a wholesale
replace would delete a portrait the product ships. And `.gitignore` publishes exactly three files
out of that tree — `logo/wordmark.svg`, `bots/bridget.svg`, `bots/phoebe.svg`. Everything else
stays unpublished, and anything new arrives unpublished by default.

**Phoebe stays Anemone `#A04E7E`.** The book's roster is production's crew, and each surface extends
it with its own agents under the book's rules. ~~**A one-line amendment to close that gap at the
source is owed by the maintainer's hand** at the master book's next revision.~~ **Delivered in
version 4, 30 Aug 2026, and larger than one line:** §6 carries a **roster-extension rule** — an
added agent is named, takes one accent from the book's palette, ships a portrait in the house form,
and obeys §2.6, and a surface may never invent a colour or point an existing accent at a second
agent — with **Phoebe's own entry beneath it**. §6 also settles the asset split this repository had
worked out by hand: **a shared agent's portrait lives with the shared assets, a surface's own
agent's portrait lives with that surface**, which is why `phoebe.svg` ships from here.

### Closed — 30 Aug 2026

**Everything this item was opened to carry is done.** The seven-step plan is built and merged, the
ratification bundle is delivered into version 4, and both raises against version 4 are shipped —
the shadow values as pull request #41 and the darkened coral as #42, with the book amended to
version 4.1 to match.

**What it cost and what it bought, since this item is the one home for the story.** The return to
the book ran to thirteen pull requests across three sessions, #27 to #42. Two stress ramps were
designed, machine-checked and thrown away, and the finding that ended the exploration — that the map
read flat because of the basemap rather than the ladder — is what the basemap wash came from. **That
finding is also why design work now starts from an image**, which is canon from 30 Aug 2026 and
lives in [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md).

**One rider is still not an item and is still unridden.** The rail-width rider, inherited from item
S8, rides whenever the rail is next opened for another reason. No work in this item opened it.

Logged 29 Aug 2026, **closed 30 Aug 2026.**

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
BUILD_PLAN.md and SESSION_HANDOFF.md both recorded that correctly and this file did not, which is
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

## O2. Restore branch protection on `main` — closed, swept to the archive

**Closed 24 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O3. Reverse link from waterbots.ai — closed, swept to the archive

**Closed 24 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
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

## O5. The engineer pushed without a commit word, twice

**Logged at the maintainer's instruction, 24 Aug 2026.** Recorded rather than absorbed, because a
process breach that leaves no trace is one that repeats.

**What happened.** Two commits — `28e29b6` and `eb5b7ca`, the import fix and the runtime fix — were
committed and pushed to `main` on the strength of a plan approval, not a commit word.

**Why that is a breach even though the maintainer said "go".** The process in
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) has five steps and they are not
interchangeable: propose, approve, build, **eyeball**, **commit word**. Approval covers the
building. The maintainer's own review comes after the build, and the commit word comes after that.

The engineer had written "commit and push" as a step inside each proposed plan, and then treated
approval of the plan as approval of every step in it. That collapses two separate permissions into
one and skips the maintainer's review entirely. The same session had done it correctly hours
earlier — build, stop, browser check, then an explicit "Commit word: go" — so this was a lapse in
practice, not a misunderstanding of the rule.

**Both fixes were correct. That is not mitigation.** The value of the review step is that it catches
the times the work is wrong, and it cannot do that selectively. A process that is followed only when
the engineer judges the work sound is not a process.

**What changes.** A proposed plan does not list committing or pushing as a step the engineer may
carry out. Plans end at "built and checked". The engineer then reports **"built, not committed"** and
stops, every time, including when the maintainer has already said go, including when the site is
down, and including when the change is one line. If a plan is approved that contains a commit step,
the engineer stops before it anyway and asks.

**Urgency is the condition this rule exists for.** Both breaches happened during a production
outage, which is exactly when skipping a review feels most reasonable and is least safe.

Logged 24 Aug 2026. **Standing** — kept as a reminder rather than closed.
---

## O6. The card gate reports stale cards that are not stale — closed, swept to the archive

**Closed 27 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O7. Merged branches pile up, and are now to be cleared — closed, swept to the archive

**Closed 27 Aug 2026. Moved to [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md) on 30 Aug 2026**, in full,
with its dates and its reasoning intact. Nothing was summarised away in the move.

---

## O8. The export step in the close-out ritual — named and ordered

**Proposed and ruled 27 Aug 2026**, from the waiting list left by the session of 26 Aug. The
written proposal that session asked for was put forward, and the maintainer ruled on it the same
day.

**Why it was raised.** The `exports/` folder holds `Shell_B_`-prefixed copies of all fifteen root
documents. It is how material leaves this repository by the maintainer's hand. It is gitignored,
so nothing in the repository refreshes it and no check notices when it is stale. At the close of
26 Aug 2026 it was a session behind: the close-out had been written, reviewed, committed and
merged, and the copies still said 25 Aug. **It was caught by the maintainer, not by the process.**

**The cause was plain.** [PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) owns how a
session closes and lists the steps in order. The export was not among them, which is the whole
reason it was skipped. A step nobody wrote down is a step nobody owes.

### The first half is already ruled

**The maintainer's process ruling of 26 Aug 2026 answers it.** Her close-out ritual names
"export copies regenerated (where the repo has them)" as one of the steps that must run every
time, and says a ritual with a skipped step is an unfinished ritual. **That is the naming this
proposal was going to ask for**, and it is now written into the process rules.

So the proposal does not need to argue for the step. It needs to settle what the ruling did not
reach.

### The second half: the order, now ruled

The 26 Aug ruling listed the steps in this order: root docs refreshed, handoff written, **export
copies regenerated, checkpoint committed**, `main` confirmed equal to `origin`.

The session of 26 Aug had written down a different "done": all fifteen copies regenerated
**after** the final commit rather than before it, "so the copies carry the close-out itself and
not the state just before it."

**These two disagreed, and the disagreement was not cosmetic.**

| Order | What the copies hold |
|---|---|
| Regenerate, then commit | Everything except the close-out commit itself |
| Commit, then regenerate | Everything, including the close-out |

**Maintainer's ruling, 27 Aug 2026: commit first, then regenerate.** The failure that caused this
item was copies sitting one step behind the repository, and regenerating first reproduces that
failure in a smaller form on every close. The cost is only that a session's last action is a hand
copy rather than a commit.

[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md) now carries the ruled order, and the
note that flagged the question while it was open has been removed.

### The second question, kept separate on purpose

**Should the export be a script rather than a hand copy?** That is a larger question and a
different one, and the session of 26 Aug asked that the two be kept apart. They are.

A script would make the step repeatable and would let a check notice staleness. It would also put
a repository file in charge of a folder the repository deliberately does not track, and it would
need to know which fifteen documents count — a list that changes. **No recommendation is offered
here.** It is recorded so it is not lost, and it does not block the ordering question above.

### What is left

**The ordering question is closed and the ritual is written.** What keeps this item open is the
second question above — script or hand copy — which has no ruling and is not due.

Proposed and ruled 27 Aug 2026. **Open only on the script question.**

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

---

## O10. Line endings are pinned in git but not in the working folder

**Found 29 Aug 2026 while editing the stylesheet. Nothing is broken, and it is logged because item
O6 says something about this that is half untrue.**

**What O6 records as done:** a `.gitattributes` file pinning every text file to Unix line endings,
"in git and in the working folder, on every machine that clones this repository."

**The working-folder half does not hold.** `.gitattributes` says `* text=auto eol=lf`, and this
machine has `core.autocrlf=true`. Measured on `src/styles/tokens.css` on 29 Aug: **git's stored blob
has 239 Unix line endings and zero Windows ones; the file on disk had 239 Windows ones and zero
Unix.** The same file, two forms.

**Why nothing is broken, and why the fix still works.** `text=auto` normalises on the way in, so
every commit carries Unix endings and `git status` stays clean — which is exactly the "done" test
item O6 set, and it is genuinely met. The deployment platform builds from what git stores, which has
never changed.

**The likely cause.** Git only rewrites a file on checkout when its content changes. Files that have
not differed between branches since `.gitattributes` landed on 27 Aug have never been rewritten, so
they still carry the form they had before it existed. The rule prevents future drift; it did not
convert what was already there.

**What "done" looks like:** either `git add --renormalize .` plus a fresh checkout so the working
folder matches what the attribute promises, or item O6's sentence corrected to say the rule binds
what git stores rather than what sits on disk. **The second is probably right** — what git stores is
what ships, and it is what the rule was written to protect.

**Not urgent, and deliberately not fixed inside a brand step.** It was found mid-session and left
alone rather than folded into unrelated work.

### Closed — the claim was shrunk, the disk was left alone. 30 Aug 2026

**Maintainer's ruling, 30 Aug 2026: take the honest fix, not the big one.** Item O6's sentence is
struck and corrected in place to say the rule binds **what git stores**. `git add --renormalize`
was **not** run.

**Why the correction and not the renormalize.** Renormalizing would rewrite every tracked text file
for **zero change in what ships** — git already stores Unix endings for all of them, and the
deployment platform builds from what git stores. It would produce a large, content-free commit that
buries the real history of every one of those files, in exchange for tidying a working folder that
nobody deploys from. **The claim was the thing that was wrong, so the claim is the thing that was
fixed.**

**Measured across the whole tracked tree on 30 Aug 2026**, rather than on one file as this item
originally was:

| | Count |
|---|---|
| Tracked text files carrying **LF** on disk | **74** |
| Tracked text files carrying **CRLF** on disk | **7** |
| Tracked text files whose **git blob** carries CRLF | **0** |

The seven are `api/_abstentions.ts`, `api/_cap.ts`, `api/_store.ts`, `api/_visitor.ts`,
`api/abstentions.ts`, `eligibility-cards-vwba.md` and `scripts/check-visitor-id.mjs`.

**That is this item's own diagnosis, confirmed by counting.** Every one of the seven is a file that
has not changed on any branch since `.gitattributes` landed on 27 Aug, so git has never had reason
to rewrite it. Everything touched since — three-quarters of the tree — converted on its first
checkout, exactly as predicted. **The rule prevents drift going forward; it does not convert what
was already there**, and the number of stragglers falls on its own every time one of them is next
edited.

**Nothing is broken, and nothing here needs watching.** `git status` is clean, every commit carries
Unix endings, and the card gate that started this whole thread in item O6 passes.

Logged 30 Aug 2026, ruled and **closed 30 Aug 2026.**

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

**Six items moved in full to [OPEN_ITEMS_ARCHIVE.md](./OPEN_ITEMS_ARCHIVE.md):** S4, S8, O2, O3, O6
and O7. Each keeps its dates, its measurements, its wrong turns and its corrections; **nothing was
summarised away**, which was this item's own test for what "done" looks like.

**Each leaves two things behind.** A one-line row in the index table above, pointing at the archive,
and a short stub where the item stood, saying when it closed and where it went. An item cannot be
lost by being finished.

**What it bought:** this file fell from **2,173 lines to about 1,850** in the same session that
added the version 4 raises, so it ends the day shorter than it started despite growing. The archive
is **not** one of the six opening documents and is never read at the opening.

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

Logged 30 Aug 2026, **first sweep done 30 Aug 2026.** Open as a standing habit — the next sweep runs
when this file gets heavy again.
