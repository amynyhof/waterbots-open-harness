# Open items — archive

**Closed items, moved out of [OPEN_ITEMS.md](../OPEN_ITEMS.md) so that the document read at the start
of every session stays a briefing rather than an archive.** Maintainer's ruling, 29 Aug 2026, *the
opening reads stay thin, forever*: a closed item is finished, and it earns a pointer and a home
elsewhere rather than a place in an opening read. The sweep itself was item O11.

**This file is not one of the ~~six~~ four opening documents and is never read at the opening.** It is read
when someone goes looking for how a thing came to be — the same posture as
[BUILD_LOG.md](../BUILD_LOG.md), and for the same reason.

**Nothing here was summarised, trimmed or reworded in the move.** Each item is exactly the text that
stood in OPEN_ITEMS.md, with its dates, its measurements, its wrong turns and its corrections
intact. A closed item's value is entirely in its detail; an archive that abbreviates is an archive
that loses the thing it was made to keep.

**Every item still has a one-line row in the index table in
[OPEN_ITEMS.md](../OPEN_ITEMS.md)**, pointing here, so no item can be lost by being finished.

**This file lives at `docs/OPEN_ITEMS_ARCHIVE.md` from 17 Sep 2026**, moved from the repository
root by the maintainer's ruling in the root tidy of that day, history kept. It is not part of
`docs/archive/`, which holds retired documents; this file is live history that keeps growing.

**Items are added to this file only when they are closed**, and they keep their original
identifiers — S4 stays S4. Identifiers are never reused.

**First sweep: 30 Aug 2026**, six items — S4, S8, O2, O3, O6, O7.
**Second sweep: 2 Sep 2026**, one item — O10.
**Third sweep: 8 Sep 2026**, one item — S7.
**Fourth sweep: 9 Sep 2026**, one item — S16.
**Fifth sweep: 18 Sep 2026, the triage**, eighteen items — K4, K5, K6, K8, A2, A3, A4, A7, A8, A9, A11, S2, S3, S9, S10, S13, O5, O8. Two family sections, Knowledge and Agents, open here for the first time.

---

# Family: Knowledge

What the agents are allowed to know — card sets, the source corpus, and the methods behind a number.

Governed by [CITATIONS.md](../CITATIONS.md).

## K4. "Knowledge Pack" — the word for a packaged knowledge set

**Maintainer's ruling, 26 Aug 2026.** A packaged knowledge set is called a Knowledge Pack.

**The rule itself lives in [CLAUDE.md](../CLAUDE.md) under Language rules**, which is the single home
for word rules; this row records the ruling and points there rather than restating it. It matters
most on the Commons surfaces that do not exist yet. No retroactive rewording pass.

Ruled 26 Aug 2026. **Canon — no build.**

**Closed 18 Sep 2026 in the maintainer's triage.** The rule lives in CLAUDE.md under Language rules; the row was a pointer with nothing left to do.


---

## K5. The VWBA 2.0 D-3 screening pack

**The first method pack fitted to the Quantification step.** Household and community water supply,
ex-ante, Option 3 of Table D3.3: people × litres per person per day × days, capped by the system's
yearly capacity where that is known. Built 1 Sep 2026.

**What it refuses, by name.** Sanitation is method D-6. Putting water back into the ground is D-4.
Irrigation is a different table. Metered supply is Option 1 and is the better route where a meter
exists — a project that is any of these is told which method fits instead of being handed a number
from this one.

**Everything it produces is a screening estimate** — anticipated, never delivered and never verified
— and it carries a consultant-review tag wherever it renders. The guidebook is cited and linked
under CC BY 4.0, with the changes indicated. It is not quoted at length, its tables are not
reproduced, and no page of it is pasted into the code or the interface.

### The without-project volume is the whole difficulty

**It is required, it may be left empty, and an empty one is NEVER zero.** A pack that quietly read a
blank as zero would report the entire with-project volume as benefit — the single easiest way for
this method to produce a large, confident, wrong number with nothing looking broken.

**A zero typed on purpose is still honoured**, because a project with genuinely no prior supply
needs a way to say so, and refusing it would leave that project reading as incomplete forever.
Maintainer's ruling, 1 Sep 2026: *"Typed 0 stays accepted; blank stays a dash."*

**But no example anywhere subtracts a zero.** Her ruling the same day: *"A training site that
subtracts 0 teaches the wrong habit."* The fixture that demonstrates a benefit uses a real
without-project figure.

### Three questions can stop the number, not five

Household or community water, clean enough for that use, and can people get it. **The 1 km question
and the humanitarian question are helpers, not gates** — the first helps prove access and moves no
litres either way, the second only lets the Sphere rates in. Both are marked optional. Maintainer's
ruling, 1 Sep 2026, after her walk; six checks hold the line.

### What confirms it

`scripts/check-vwba-d3.mjs` — **68 checks** against the real compiled module rather than a second
copy of the arithmetic. Its numbers are round, obviously fake and labelled as examples; **no real
project's figures appear anywhere in this repository.**

**Not in this pack, and deliberately:** sanitation, irrigation, recharge, a metered path, Sphere
rates outside a humanitarian answer, carbon terms, cost-share or attribution fields, and any
reconciliation of the 2021 replenishment guidance into 2.0.

Opened and built 1 Sep 2026. **Open as the home for the pack's story**; the next packs are item K2.

**Closed 18 Sep 2026 in the maintainer's triage.** Built and shipped; the row stayed open only as the home for the pack's story, and this archive keeps stories in full. The next packs are item K2.


---

## K6. The Gold Standard safe-drinking-water carbon packs — Legacy V1 and PAA v2.0

**Two screening packs from one module, built 2 Sep 2026.** Gold Standard's *Emission Reductions
from Safe Drinking Water Supply*, in its legacy version 1.0 and its Paris-aligned version 2.0
(PAA-M400-12), as two tabs in the Quantification step: **Carbon · Legacy V1** and **Carbon · PAA
v2.0**. Both are ex-ante, screening tier, consultant review, not verified. Maintainer's spec of
2 Sep 2026 and her rulings D, E and F the same day.

**One equation, one differing input.** Emission reductions are the baseline less project emissions
less leakage; the baseline is litres supplied times an emission factor per litre times one minus
the share of people already on safe water. Method 1 (community supply) sums premises × people ×
litres × operating days, capped by capacity; Method 2 (treatment in the home) takes units × usage ×
the smaller of what the unit makes and what the people drink × days present. **What moves between
the two versions is the fraction of non-renewable biomass.** The PAA tab fills it from the MoFuSS
assessment's Table 5, cited to the project's own site (ruling 2). The legacy tab fills Uganda,
Kenya and Malawi from the CDM's list of expired default country values, cited to the UNFCCC page
and marked historical — which is exactly why they are the legacy shares — and asks for a typed
share for any other country (ruling F, widened once the list was read). A typed share is always
honoured and labelled as the visitor's own.

**The emission factor is derived, and labelled derived.** Under a stated standard profile — wood
80% and charcoal 20% by energy, the methodology's default stove efficiencies, 360.83 kJ to boil a
litre — the methodology's own factor equation reduces to a straight line in the non-renewable
share. The two constants were recovered from the profile and hold at all seven recorded points to
better than one part in a billion; `scripts/check-gs-sdws.mjs` proves it (ruling E).

**The PAA tab says what it does not apply**, on the tab itself: the water-quality modifier, the
usage-rate adjustment for Method 1, statistical conservativeness, the downward adjustment factor
and the lower-of-two crediting baseline. The credited figure is lower, never higher.

**Blank is never zero, anywhere in the module.** The one zero default — project emissions for a
zero-emission technology — is v2.0 §8.2.1's own rule, appears only once the technology gate is
answered, and shows as a default.

**The half-day premises build from the methodology's sum.** The reference tool's half-day cell
omits the premises count and the operating days; the pack builds from Eq. 5 instead, and the
field's why-note records the deviation. The school-mix reference row, whose inputs were not
recorded, is deliberately not a fixture.

**The transition delta** is one line under the tabs, in the production calculator's idiom, shown on
either carbon tab only when both have a complete answer. The worked example — Uganda, made up,
labelled on the header and prefixed on the desk's rows — gives the demo figures.

**The v2.0 citation carries the cover date, 9 July 2026**, by the maintainer's errata ruling for the
document; the running header says 7 July.

**What confirms it:** `scripts/check-gs-sdws.mjs`, **109 checks**, against the real compiled module —
every reference row that carries its inputs, to four decimals; the seven factors; the transition;
both leakage routes; the gates; the tiles; the citations; blank-never-zero in every place it could
fail.

**The two clauses Phoebe's roster renders for these packs are the maintainer's, signed as drafted on
2 Sep 2026.**

**Not in these packs, deliberately:** suppressed-demand baselines, the institutional age tiers,
embodied-emission deductions, the downward adjustment factor, monitoring, registration, and any
reconciliation between the versions beyond the one input that moves.

Opened and built 2 Sep 2026. **Open as the home for the packs' story.**

**Closed 18 Sep 2026 in the maintainer's triage.** Built and shipped; the row stayed open only as the home for the packs' story, and this archive keeps stories in full. The carbon cards are item K7.


---

## K8. Phoebe's VWBA pack is the cards' one home — canon

**Maintainer's ruling, 17 Sep 2026.** Phoebe's two card sets had sat at the repository root since
21 Aug 2026, with her pack folder pointing at them and saying "this tree stays a pointer." The
ruling overturned that on purpose: **the pack is the home.** Both files moved into
`knowledge-packs/phoebe-eligibility/vwba-2.0/cards/` with `git mv`, history kept, and every
reader followed. Built and merged the same day, pull request #84.

**Two further rulings in the same brief.**

- **The new pack shape is the rule going forward, one pack at a time.** One folder per standard,
  holding `cards/`, `tool/`, `evals/`, `README.md`, `CHANGELOG.md`. Phoebe's pack is the
  first in it; the other packs stay as they were scaffolded on 16 Sep 2026 until their own briefs.
  The tree README says so, with the old shape's lines struck.
- **The one broken link was fixed, not logged as debt.** Line 44 of the eligibility cards linked
  to the process rules by a root-relative path. The move was proven byte for byte first, then the
  link was fixed as a second commit in the same pull request, the generator re-run, and the
  one-line diff shown. Her single eyeball covered both.

**What it was checked against.** The two exported strings in `api/_cards.generated.ts`, saved
before the move and compared after: identical. The Eligibility step's Tool tab, its full page
text hashed before and after in the dev server: identical. `check-cards`, the generator's
staleness check, and the production build all passed. Both captures are in the pull request.

**Old references.** BUILD_LOG, OPEN_ITEMS_ARCHIVE and the archived handoff mention the old root
paths in prose. They were true when written and are not edited. The pack changelog's 0.2.0 entry
names the old paths and the new.

**What waits.** The two untracked DRAFT card files — Appendix C activities and the glossary — stay
at the root until the maintainer moves them by hand; their home is the cards folder once
approved. ~~Roster work is the next brief, not started.~~ **Corrected 17 Sep 2026, second sitting:**
the root tidy came first; the OPEN_ITEMS triage (item O11) is the next brief; roster work waits
on her word.

Built 17 Sep 2026. **Canon.**

**Closed 18 Sep 2026 in the maintainer's triage.** The move is done and the pack-shape rule lives in the tree README. The other packs' moves are item K9.


---

# Family: Agents

How agents behave, what they may say, how they hand off, and who staffs which post.

Governed by [AGENT_RULES.md](../AGENT_RULES.md).

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

~~**The name is all that is settled.**~~ **Settled in full on 1 Sep 2026, when his lane opened.** He
staffs the Quantification step (item S10), his accent is **Plum `#5848A8`**, his portrait is
`brand/assets/bots/calvin.svg` drawn in the house form, and **he holds the primer's third post** —
every sentence of it the maintainer's own, signed before it was written in. His chat is not built and
the panel says so.

**Two of those were knowing exceptions to the brand book**, ruled by her and recorded in the book at
§6 rather than only in code: the accent is pointed at a second agent, which §6 forbids, paired with a
dock shape of his own; and the portrait was drawn here, where §6 says it arrives with the Commons
design.

~~His roster entry, his identity colour and his entry in `agent-primer.md` **come by the maintainer's
hand when his lane opens**, the way the design canon and the brand book arrived. **Nothing about him
is invented here in the meantime** — he is not in the primer, no agent may name him, and no colour is
reserved for him by guesswork.~~ **All three arrived on 1 Sep 2026.** The struck line is kept because
it was the right rule while it held: nothing about him was invented before she ruled.

**Why a name is logged before the rest exists.** A name that is decided and unwritten gets
re-decided. This records the decision so the next conversation starts from it, and records equally
plainly that the decision stops at the name.

~~**His lane is step 3 of the north star** — ex-ante quantification, *what benefit would this project
produce?* — which is not started. Two posts are staffed today, not three.~~ **Step 3 was built on
1 Sep 2026 and three posts are staffed**, though only Phoebe's chat answers.

**Closed 18 Sep 2026 in the maintainer's triage.** Staffing is settled. The two chats not yet built, Bridget's and Calvin's, have their own row from today: item A12.


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

**Rung 3 of the abstention ladder is blocked separately.** [AGENT_RULES.md](../AGENT_RULES.md) states
that an agent with no covering colleague offers a human consultant. There is no consultant, no
contact route, and no page to point at, so the rung is marked not yet live and agents say that
consultants are coming rather than promising one. A contact route is a maintainer decision, not a
repository file.

The output is the primer as a written document, in the same posture as the card sets — proposed,
reviewed, then inherited by each agent's prompt the way
[AGENT_RULES.md](../AGENT_RULES.md) already is.

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

**[AGENT_RULES.md](../AGENT_RULES.md) is part of step two, not a follow-up.** It currently says there
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
- [AGENT_RULES.md](../AGENT_RULES.md) at a live rung 2, and the primer's own second section rewritten
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

**Closed 18 Sep 2026 in the maintainer's triage.** Step one and step two both shipped; the primer's home settled on 17 Sep 2026 in knowledge-packs/product-shared/. Nothing owed.


---

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

**Closed 18 Sep 2026 in the maintainer's triage.** Duplicate pair A4/A6, as this item says of itself: A6 owns the live fault and everything still open.


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

### It recurred, 3 Sep 2026 — and the text was read

**The same question, through the measured walk of Wellington's build**: *"How much does it cost
to drill a borehole in Kenya?"*, asked of Phoebe once on the final prompts. She abstained and cited
one card, exactly as on 28 Aug. This time the instrument kept the text:

> "I do not have a card for that — drilling costs in a specific country sit outside what I cover,
> and I would only be guessing if I answered. What I can do is work through whether a project can
> generate a volumetric water benefit, using the six eligibility criteria, and talk about the
> considerations that help you choose between eligible projects."

**That is the benign branch this item named:** she is pointing at what she does cover, and the
citation supports the thing she offered, not the thing she declined. **The reading is the
maintainer's to confirm** — it is her call whether this closes as a false alarm — and it is
recorded here rather than closed by the engineer. The walk's log carried the full reply.

Logged 28 Aug 2026. **Recurred 3 Sep 2026; the text reads as the benign branch. Waiting on the
maintainer's reading to close.**

**Closed 18 Sep 2026 in the maintainer's triage.** The maintainer accepted the benign reading on 18 Sep 2026: Phoebe pointed at what she covers, and the citation supported the thing she offered. A false alarm, as the item said it would be if the text read that way.


---

## A8. Wellington's chat, live on the desk

**Built 3 Sep 2026, on Phoebe's proven pattern — a real agent on real machinery.** The composer's
disabled state is gone. Maintainer's brief of 2 Sep 2026 and her rulings the same day: cap
thirty, Opus 5 at medium, abstention logging only for a question outside every lane.

**His endpoint** is `api/wellington.ts`: Opus 5 at medium effort, a 16,000-token budget, a
120-second timeout, one retry for a late 400, the 40-character reply floor, thirty a day under his
own counter, and a refund on anything undelivered. Every setting is stated in code with its reason.
**Thirty, not twenty**, because his prompt carries no card sets — a message to him costs about a
twentieth of one to Phoebe — and a routing conversation runs longer in turns and shorter in words.
The counters are not a pool: `check-cap` proves a visitor who spent all of Phoebe's twenty still has
all of his thirty. **Opus, not a cheaper tier**, for the measured reason in item A6: Sonnet at medium
went empty about one time in eight on Phoebe's work, and a host who speaks first cannot be the one
who goes silent. Dropping the tier is one line and a later ruling.

**His answer is structured.** A route field — eligibility, quantification, map, paid, or none —
and a learned-context field, both checked against closed lists in the relay and again in the
browser. An unknown route becomes none; an unknown kind is dropped; an essay is not a project name.
Nothing is read out of his prose. A route renders as one quiet action under his turn; what he
learned writes into the visit under item S11's provenance rule.

**Only a question outside every lane is logged**, marked as his. His routings are not abstentions
and are not written down — ruling C, 2 Sep 2026.

**One conversation, held by the shell.** The desk is a frame around it and starts none of its own;
any second frame — the hero chat, item S12 — shows the same thread. Never a second panel, never
duplicated. The desk stays mounted so a step to a tab he sent the visitor to, and back, keeps the
transcript: the item S4 fault, found again in the first walk and fixed the same way.

**What confirms it:** `scripts/check-wellington.mjs`, **41 checks** on the machinery without a
model call, and `scripts/measure-wellington.mjs`, the walk with real calls — not a gate, run by hand
before an eyeball and reported with counts. On the final prompts, three runs each: a carbon figure
routed to Quantify three of three; an eligibility judgment to Phoebe three of three; a basin
question to the map three of three; a carbon price abstained three of three; a first-turn project
description learned all three context fields three of three. No reply quoted a figure. Median
call under seven seconds. Phoebe's three standing questions held.

**Not exercised on screen:** Phoebe's desk row, which only her live answers move.

**Debt named here, owned elsewhere:** his answers run long (item A10).

Built 3 Sep 2026. **Open as the home for his chat's story.**

**Closed 18 Sep 2026 in the maintainer's triage.** Built; open only as the story's home. The one debt it named, his answers running long, is item A10 and stays open.


---

## A9. Agents phrase the roster's facts themselves — canon

**Maintainer's ruling 1, 3 Sep 2026, and it covers every agent.** An agent is given facts and
rules and phrases the words itself: two or three plain sentences a twelve-year-old could read,
warm and teaching, at or under a sixth-grade reading level. The maintainer approves the rules an
agent keeps and the facts it holds; she does not sign its sentences. Nothing an agent inherits is
a script.

**What changed on the day.** Every quoted "what another agent may say" sentence in
`agent-primer.md` was struck in place and replaced with facts — what the colleague covers, whether
they answer, where they are found. Wellington's own region of the primer was rewritten the same way
before it ever deployed: facts about the crew and the rules he keeps, no welcome line, no lane
sentences. Both prompts say "in your own plain words" where they said "word for word".
[AGENT_RULES.md](../AGENT_RULES.md) records the ruling under rung 2 with the old rule struck.
`check-wellington` refuses any prompt that still says word for word.

**Why it is worth a rule.** A signed sentence is honest on the day it is signed and a script
forever after. Facts stay true as the site grows; the wording follows the visitor.

**The rule itself lives in [AGENT_RULES.md](../AGENT_RULES.md)**; this row records the ruling and
points there. **Canon — no build.**

**Closed 18 Sep 2026 in the maintainer's triage.** The rule lives in AGENT_RULES.md; the row was a pointer.


---

## A11. The phase names are canon, and agents point at the step, never a tab

**Maintainer's naming ruling, 5 Sep 2026, amended the same day and again on 7 Sep, and resolved
in the same pull request.**

1. **The six phase names stay as written:** Eligibility, Partners, Quantify, Plan, Monitor,
   Communicate.
2. **The desk's tab is "Dispatches"** everywhere, matching production — the tab, the copy, the
   primer, the docs. It was "Dispatch" from 2 Sep to 5 Sep.
3. **Agents say the phase names, never their own versions** — "Quantify" not "the quantification
   step", "Partners" not "the basin map" when naming the phase. Describing what a phase does is
   fine; the phase's name is fixed.
4. ~~**Amendment, the same day: the tab row reads Dispatches · Eligibility · Map · Calculator.** Tab
   words match production's tool names; the journey bar above keeps the phase names.~~ **Replaced
   7 Sep 2026** — the tab row lasted two commits on a branch and never merged.
5. **There is no tab row, from 7 Sep 2026.** The journey bar is the navigation, one row: Dispatches
   first with a hairline after it, then the six phases. Agents point people at the step by its phase
   name — "the Eligibility step" — never at a tab. The shape itself is item S15.

**The rule itself lives in [AGENT_RULES.md](../AGENT_RULES.md) under Speech**, one home; this row
records the ruling and what moved. What moved: the tab row and its list in `src/lib/surfaces.ts`,
gone; the primer's roster region (Wellington's routing line, every "where" line, the journey
table's two rows, the crew facts) and two lines in his own region; Wellington's prompt, where it
names surfaces or points anywhere, and a rule paragraph added to it; README, BUILD_PLAN,
SESSION_HANDOFF and item S11's own text. The generated primer
modules were rebuilt and the staleness gate is green. Phoebe's own prompt text named no phase and
needed no change; she inherits the corrected roster.

**Item S10 keeps its title, "The Quantification step."** It is the item's name and the surface's
name in engineering prose, not an agent's phrase; the ruling binds what agents say.

Ruled and **resolved 5 Sep 2026.** Recorded here rather than swept, for one session.

**Closed 18 Sep 2026 in the maintainer's triage.** Resolved in the same pull request; the row said it was recorded rather than swept for one session, and that session has passed. Pair A11/S15: S15 keeps the shape's carry to production.


---

# Family: Surfaces

## S4. Chat docks were thrown away on a surface switch

**Fixed 23 Aug 2026.** Recorded because it was a real defect found in a browser check, and because
the reasoning behind the fix is the kind that gets undone by a later tidy-up.

**What went wrong.** A visitor could work through several criteria with Phoebe, glance at the map,
come back, and find the worksheet still filled in but the whole conversation gone. The worksheet
survived because its state is held in the console shell; the conversation did not, because it is
held inside the chat dock, and the shell threw the dock away whenever you left its surface.

The mismatch is what made it bad. Half the work remembered and half of it forgotten reads as the
product losing what someone said.

**Where it was.** The console shell, `src/App.tsx` — not the shared chat layer. A chat component
holding its own conversation is correct and is what makes it reusable; the shell destroying that
component was the bug. **Bridget would have inherited it**, and so would every agent after her,
because the shell showed one dock or the other with the same either/or switch.

**The fix.** Both docks stay mounted and the one you are not on is hidden — the same treatment the
map already had a few lines above, for the same reason. Hidden means hidden from everyone: it is
taken out of the tab order and out of the accessibility tree, so nobody can type into a composer
they cannot see.

**A refresh still empties everything**, and the page still says so. That is the
no-memory-across-visits ruling of 21 Aug 2026 and it stands. Stepping over to the map and back is
not a new visit, so it must not behave like one.

**Two fixes considered and rejected.** Lifting the conversation into the shell would work, but it
puts one agent's conversation in the shell and then the next agent's too, which is the opposite of
what the shared layer is for. Saving it to browser storage would break the no-memory ruling.

**A note on how it was found.** The maintainer reported the page jumping back to the map and losing
the conversation. That specific symptom turned out to be the dev server reloading the page because
the engineer was editing files during her browser check — not a product fault. This defect was
found while chasing that, and it is the real one.

---

## S8. Brightness pull-up to BRAND.md's published Frost values

**From the design canon, received 27 Aug 2026** and held at
[DESIGN_CANON_for_ShellB.md](./archive/DESIGN_CANON_for_ShellB.md), which is the home for the ruling
itself. This item is the work it asks for.

**The canon's note, in its own words:** the site "currently reads more muted than BRAND.md's
published Frost values," and the ruling is BRAND.md at full published brightness — Paper Frost
canvas, pure white cards with hairline borders, Tide `#2B5BFF` at full strength for primary
actions, accents at their published values. **The engineer's derived values — chrome, the agent
colours, the stress ramp — were derived correctly and stand.** The canon says so explicitly. This
is about surfaces and accents that drifted softer than the book.

**The canon asks for it as one sized step, proposed.** It is not built and no proposal has been
written.

### One thing measured on receipt, which the proposal will have to start from

**The tokens are already at the published values.** `src/styles/tokens.css` was read on receipt
rather than assumed:

| Token | In the file | BRAND.md publishes |
|---|---|---|
| `--paper` | `#fbfbfe` | Paper Frost `#FBFBFE` |
| `--card` / `--raised` | `#ffffff` | `#FFFFFF` |
| `--tide` | `#2b5bff` | Tide `#2B5BFF` |
| `--line` | `rgba(11,20,40,0.09)` | `rgba(11,20,40,0.09)` |

**So whatever reads muted is in how the tokens are applied, not in the tokens themselves** — a
component reaching for a softer token than the book intends, a wash, or an opacity. **The
proposal must find the specific places before it proposes anything**, and must not "fix" this by
editing values that already match the book.

**Bridget's provisional `#7FD5DF` is a lifted, softer member of the Surf family**, where BRAND.md
publishes Surf as `#14C8D9`. It is **not** brightened as part of this item — the maintainer ruled
on 27 Aug 2026 that she stays provisional at her current colour. It is picked up afterwards by the
taxonomy rider below.

### The agent colours — ruled, and a re-review rides on this item

The canon's standing rules say "agent identity colors remain platform rules (Phoebe violet;
Bridget Surf, provisional)." In BRAND.md, violet is Iris `#7B5BE6`, while Phoebe's colour here is
**Anemone `#A04E7E`** — a muted berry-magenta, set by the maintainer's ruling of 22 Aug 2026
precisely to move her *off* the provisional Plum and Iris pair taken from her portrait.

**Maintainer's ruling, 27 Aug 2026: Anemone stands.** "Violet" in the canon was loose wording, not
a new decision. The ruling of 22 Aug holds and nothing about Phoebe's colour changes.

**Bridget stays provisional at her current colour**, `#7FD5DF`. Same ruling, same day.

### Rider on this item — re-review both agent colours against the status taxonomy

**Maintainer's ruling, 27 Aug 2026.** After the brightness pull-up lands, both agent identity
colours are checked against the status taxonomy. **An agent colour must never read as a project
status.** A visitor who has learned that one colour means *live* should not meet the same colour
meaning *this is Bridget*.

**The specific worry, and it is not hypothetical.** Bridget's provisional `#7FD5DF` is a lifted
member of the Surf family, and the taxonomy sets `--state-live` at Surf `#14C8D9`. **Her colour
sits near Live.** Pulling the surfaces up to full published brightness moves everything around
both of them, which is exactly why the check comes after the pull-up and not before it.

The taxonomy to check against, as `src/styles/tokens.css` carries it today:

| State | Value |
|---|---|
| Live | `#14C8D9` — Surf |
| Approved | `#2BC9A5` — Mint |
| Pending | `#E8A12B` — Amber |
| Locked | `#98A0B2` |
| Warn | `#E25858` — Coral |

**This rides on S8 and is not its own item**, and it does not gate the pull-up — it follows it.

### The rail rider, recorded here so it is not lost

The canon also notes the left rail may read slightly thin, and asks that it be widened modestly
**when the rail is next touched for another reason**. It says plainly: *"Not its own work item —
log it as a rider."*

**So it is not an item and this is not it.** It lives in the canon. It is named here because this
item is the most likely next work to open the rail, and a rider nobody can find is a rider nobody
rides.

> **Handed on 29 Aug 2026.** This item's work is finished, so it is no longer the most likely next
> work to open the rail. **The rider now sits with item S9**, the return to the brand book. It is
> still not an item, and S9 is still not it.

### What shipped, 27 Aug 2026

**Two card surfaces pulled to full published white** — pull request #11. The citation line in the
chat dock and the map's credit strip were each painting a white card at 92%, so the page behind
tinted them. Both now paint `var(--card)`, with the hairline border already in place doing the
separating, exactly as BRAND.md pairs them.

**No token was touched, because none was wrong.** `src/styles/tokens.css` already sat at the
published values — Paper Frost `#FBFBFE`, card `#FFFFFF`, Tide `#2B5BFF`, the published line value
— and primary actions were already full-strength Tide. The softness was in how tokens were applied.
**Brightening a value that already matches the book would have moved the site away from BRAND.md
while appearing to obey the canon**, which is the trap this item was written to name.

**Then the maintainer named the map itself** — the grey base tiles, the pale fills, the grey no-data
land. That turned out to be a different thing again and is recorded at item O9: the basemap was not
dark, it was nearly colourless, and it had also stopped being free. The map now runs on CARTO's
Voyager style, which is the maintainer's ruling of 27 Aug 2026 after walking it.

**The arid and no-data basins were never touched and never will be by this item.** They are
deliberately near-neutral *and* deliberately low-opacity so the basemap shows through — the palette
file says so in its own words. They read as grey fog because they were windows onto a grey basemap.
A living basemap fixes them without weakening the distinction between "not a reading" and "a low
reading", which covers a fifth of all basins.

**The one open design question is answered.** Voyager's sea and the Low-stress band are both pale
cyan, and whether they would blur could not be settled by arithmetic. **Maintainer's verdict after
walking production, 27 Aug 2026: they read apart — the hairline borders on basins separate them from
open sea at every zoom tried.**

### Closed 29 Aug 2026 — the rider is answered by the book, not by a re-review

**The brightness work was done on 27 Aug.** What kept this item open was the rider: both agent
identity colours re-reviewed against the status taxonomy, because an agent colour must never read
as a project status and Bridget's provisional `#7FD5DF` sat near *Live*.

**BRAND.md v3 answers it, and the answer is better than the re-review would have been.** §2.6 rules
that **the form factor carries the meaning**: a status may only be a 7-10px dot or a 1px keyline on
a data row; an identity may only be a bubble, a portrait, a surface accent or a keyline. Surf as a
dot means *live*; Surf as a portrait means *Bridget*. **The book accepts Surf's double duty on
exactly that basis.**

So Bridget's colour is no longer merely *near* the Live colour — since 29 Aug it **is** the Live
colour, `#14C8D9`, and that is the book's intended state rather than a collision. The check that
matters is not "are these two colours far enough apart" but "is each one only ever used in its own
form", and that is a rule to hold rather than a measurement to take.

**Phoebe was re-reviewed too, and stands.** Anemone `#A04E7E` is unclaimed by any state in the
taxonomy and by any other agent.

Received 27 Aug 2026. Shipped 27 Aug 2026. **Closed 29 Aug 2026**, with the rider answered by
BRAND.md v3 §2.6 — see item S9.

---

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

~~**This item does not wait on an engineer here**, and no work is queued behind it.~~

**The contract, ruled 7 Sep 2026.** Production is building its half of "Save this project and
sign up" — their #149 — and the shape below came from their proposal, carried by the maintainer's
hand, which is how rule zero says it travels. This side builds its half **after slice 3 of the desk
plan, unless the maintainer says otherwise.** Recorded here as the ruled contract; not built.

1. **The button and one consent line** telling the visitor what crosses.
2. **On click, the visit is sealed** under a random ticket id in the existing short-lived store —
   the same store the daily caps use — **good for one hour.** The seal holds:
   - the four record fields — what it does, what kind, where it is, what it is called — each with
     its source tag: typed, told Wellington, or from the pin;
   - the basin pin: the HydroSHEDS and Pfafstetter ids, the level, the stress label, the area —
     ids only, as this site holds it today;
   - Phoebe's worksheet: each criterion's state and its way forward;
   - each calculator pack's answers, flagged complete or incomplete, and flagged worked-example
     where that is what they are;
   - a sealed-at timestamp.
   **Never a computed number. Never the conversation's turns.**
3. **The visitor goes to production's sign-up with only the ticket id in the address.**
4. **A hand-over-once endpoint behind a shared key.** Production claims the ticket server to
   server; this side hands the seal over and deletes it. One claim, then gone.
5. **The key lives in settings, never in code** — the same way the model key and the store's
   settings do.

**Visitor identity comes from sign-up on production's side.** This site never holds it, and needs
none of it.

**What this side can send exactly as ruled, checked against the code on 7 Sep 2026:** every
field in the seal exists in the visit today — the four fields carry their source tags; the pin is
ids, level, label and area; each criterion holds its state and, when it is not yet met, its way
forward; each pack's answers are strings and the worked-example test already exists for the desk
rows. The store speaks raw commands over its REST pipeline, so a one-hour expiry and a
get-and-delete are ordinary calls. Two things the build will have to say plainly: the complete or
incomplete flag on a pack is worked out by the pack, so it is a classification, not a number; and
a Level 4 pin's stress label is derived from its Level 6 basins, which the level in the seal lets
production see. **Local development has no store**, so the save door on a developer's machine
will have to state that it cannot seal, the honest way the caps already fail closed.

**Built 8 Sep 2026, pull request #56, merged the same day.** The three facts landed by the
maintainer's hand that morning — the landing `https://www.waterbots.ai/welcome?handoff=<ticketId>`,
with the ticket 16 to 128 characters of `A–Z a–z 0–9 _ -` and the visitor going through sign-in
first; the claim `GET https://map.waterbots.ai/api/handoff/<ticketId>` with
`Authorization: Bearer <BRIDGE_KEY>` and `Accept: application/json`, called once from production's
server, answering 200 with the sealed body once and then 404, 404 for unknown, expired or already
claimed, 401 for a wrong key; and the key's name, `BRIDGE_KEY`, set on this project's Production
settings with the value production holds. The sender was built the same day in one pull request,
three steps, one eyeball on the button and the consent line.

**Her rulings of 8 Sep 2026.** Ten seals a day per visitor, under the counter `handoff`, the same
shape as the chat caps. The pack's own word goes across, all four — complete, incomplete, pending,
blocked — with the worked-example flag beside it: a label, never a figure. The same window: the
link became a button, the click seals, and the page moves to the landing. And on the pixels: **the
lines a visitor reads say what happens, in plain words** — no "seal", "ticket", "store" or "claim"
where a first-time visitor reads. The consent line reads *Going with you: what you said about the
project, the basin you pinned, where each eligibility criterion stands, and the numbers you typed
in. Not the results worked out here, and not your conversation. Nothing stays on this site.* The
test copy says *Saving only works on the live site, not on this test copy. Nothing was kept.*

**What shipped.** `api/_handoff.ts` holds the seal's shape and the reader; a key that is not on the
list refuses the whole seal, so a body carrying `messages`, `figures` or `headline` is turned
away, never trimmed. `api/handoff/index.ts` seals, with `SET … EX 3600 NX` so a repeated ticket is
refused rather than overwritten. `api/handoff/[ticketId].ts` claims, with `GETDEL` so two racing
claims cannot both win, the key checked first and in constant time over hashes, and nothing but the
outcome logged. `src/lib/handoff.ts` is the one place the visit becomes a seal; it reads no figure.
The row's button and consent line live in the crew rail. `scripts/check-handoff.mjs` runs 65 checks
against the stand-in store, including the desk's own seal going through the route and the whole
round trip. The dev relay and the api-exports gate learned routes in a subfolder. Two things
production reads off the seal, as promised above: a pack's `status` is the pack's classification
and never a number, and a Level 4 pin carries `stressDerived: true`.

**Confirmed on the live site after merge, 8 Sep 2026.** A seal from an empty visit came back with a
32-character ticket and an hour's expiry; a wrong key and a missing key both answered 401; a GET on
the seal address answered 405; a path two segments deep answered 404. **The two right-key claims —
200 once, then 404 — were not run by the engineer, who never holds the key and found it in no
environment on the machine.** ~~They are the maintainer's to run, and until she has, the real store's
answer to `GETDEL` is confirmed only by the stand-in — item S6's standing gap, in one more place.~~
**Confirmed by the maintainer's own walk, 8 Sep 2026, later the same day: she saved a screening from
the live desk and it reached production.** The crossing works end to end, and the real store's
`GETDEL` answered as the stand-in does. No curl was needed.

Logged 26 Aug 2026. Contract ruled 7 Sep 2026. ~~**Not built; builds after slice 3.**~~ **Built 8 Sep 2026, pull request #56. Closed and moved to the archive the same day.**

---
## S16. Phase screens — every phase page is a screen; a candidate for production

**Logged 8 Sep 2026 from the maintainer's brief, item 12 of the day.** In her words: *every phase
page is a screen: the agent's chat in the middle, its tool (criteria, map, calculator) as a tab.
Where the agent's chat is not live, the tool shows first with one plain line saying so. "Next
phase" button on every step. Save reachable from every step. Chat bubbles for visitor and agent.
Log as a B→A candidate.*

**What it changes.** Today the desk is the one screen with a conversation in the middle; the
Eligibility, Partners and Quantify steps open a tool in the centre with the agent's dock on the
right. Under this item every step takes the desk's shape — conversation first, tool as a tab — and
the three whose agents are not live (Bridget's map, Calvin's calculator; Phoebe's chat is live) show
the tool first with one plain line saying the agent is not answering yet. A "Next phase" button on
every step moves the journey forward, and the save button is reachable from every step, not only
from Dispatches. Chat turns become bubbles, the visitor's and the agent's.

**How it proceeds.** A design pass: **proposal first, images first**, after the look pass of 8 Sep
2026 (#59, merged). Nothing is built until the maintainer has approved the pictures, and the
proposal comes on her word. The bubbles are a change to the transcript the desk and the docks
share; the "not answering yet" line and the "Next phase" button are new copy, written to the
plain-words rule.

**A candidate for production.** Like the one-row bar (item S15), the shape is this site's to try
first and production's to take later, by the maintainer's hand; nothing here is designed from a
guess at the production side.

Logged 8 Sep 2026. **Proposal owed; not built.**


### Closed 9 Sep 2026 — built in four slices, pull requests #61 to #64

**The proposal was approved as written on 8 Sep 2026** — the shared parts, what differs per
consumer, six slices, the captures, and no change to Phoebe's route — and amended the same day to
**four tabs: Chat · Tool · Knowledge pack · Credentials.** The Knowledge pack is its own tab (cards,
versions, sources); Credentials is exam and scores only; **memory is never a tab** — it stays in the
project record on the left rail, tagged by source.

**Slice 1, the pictures (#61).** Six captures at 1280 by 720, drawn inside the running app by
script over the real frame and two real turns, one to Wellington and one to Phoebe. Approved on
pixels on 9 Sep 2026 with three rulings, applied from slice 2 on:

1. **The "not answering here yet" line belongs on the agent's Chat tab, not on Tool.** Tool is just
   the tool. When the chat is not live, Tool still opens first.
2. **The record's source ("Wellington heard this") shows only on hover, behind the (i).** No line
   under values. ~~Drawn as a line in the pictures.~~ **Owed to whichever slice first builds a
   source into the rail; nothing does yet, so nothing shows.**
3. **Tabs wear the agent's colour.** The row sits on a light tint of the agent's accent; the active
   tab is a step darker, bold, underlined in the accent; the active crew card is underlined in the
   same colour. That is how a visitor sees the tabs belong to that agent.

**Slice 2, the desk (#62).** The screen built once in `src/screen/AgentScreen.tsx`, the desk its
first consumer: Wellington in bubbles, Chat · Knowledge pack · Credentials (he has no tool),
"Next phase: Eligibility" at the row's right end, the active crew card underlined in Tide.

**Slice 3, Phoebe's screen (#63).** Her chat in the centre on her Anemone tint; the worksheet as
Tool; the Knowledge pack assembled from the committed card registry with the approval date read
from the files' own status lines; Credentials one component for every agent; her dock retired and
the crew rail with the save button in its place. The Chat tab body moved into
`src/screen/ScreenChat.tsx` so both screens draw the conversation with one component.

**Slice 4, Bridget's and Calvin's screens (#64).** Tool first — the map and the calculator, moved
inside their screens and mounted for the whole visit; the one plain line on each Chat tab, no
composer; Bridget's pack the map's two datasets, cited as the licences module cites them; Calvin's
pack the live method packs from the registry; both docks and the dock frame deleted; the crew rail
with the save button on every step. The screen's panels stack under `visibility` rather than
`display`, so the map stays drawn across a tab switch, and the open panel inherits visibility
rather than forcing it — forcing it let a hidden screen's map show through another, found in the
first capture and fixed before the second.

**Slice 5 needed no build of its own**: the Credentials honest state landed with slice 3 across
every agent. **Slice 6 is this close-out.**

**Calls made and kept**, each recorded in its pull request's For Amy block: the active tab's
underline is the agent's colour and the "Next phase" button is Tide, because it is navigation; a
state chip's text is ink with the state's colour on the outline, because amber may not carry type;
the bubble label reads Name · Role above the agent's bubble and the visitor's bubble has no label;
Phoebe's dock's "Where to start" paragraph is gone, following the desk's no-intro rule, and what it
said lives on the rail, the Knowledge pack tab and beside her name; her composer note states her cap;
Calvin's caveat strip is not carried over because the worksheet says "screening, not verified" on
its method strip, its result and its consultant-review tag; the roles read Map and Calculator,
matching the crew rail; there is no "Next phase" on Quantify, because Plan opens with a saved project
and the save button is the way on.

**Real model calls across the four slices: four.** Two for the pictures, one for the desk's capture,
one for Phoebe's. None for slice 4, whose agents do not answer.

### The B→A raise — what the brand book should carry, by the maintainer's hand

**The book does not carry the agent screen, and §0 says what it does not carry is raised, never
invented.** Proposed for §7, Components, in the book's own terms:

> **The agent screen.** One screen per agent: the agent's chat in the middle, and tabs above it —
> Chat, always; Tool, when the agent has one; Knowledge pack; Credentials. **The tab row wears the
> agent's accent** as an accent-tinted panel: about 5% fill and a hairline at about 25%. The active
> tab is a step darker (about 12%), bold, and underlined 2px in the accent; the active crew card
> takes the same underline. **Chat bubbles** follow §6's rule that the accent is used wherever the
> agent speaks: the visitor's bubble on the right on `--card` with the hairline, the agent's on the
> left at 5% fill and 25% border in its accent, its portrait beside it, signed `Name · Role` above.
> **"Next phase"** is a secondary button (Tide) at the right end of the row; on the last free step
> the save button is the way on. **Where the chat is not live the screen opens on Tool**, and the
> Chat tab carries one plain line saying so — no composer. The accent is an identity throughout
> (§2.6): a tint, a keyline, a bubble, never a status dot; Surf carries keylines and tints and never
> text. **Three consumers, one screen** — the Commons (no memory), the open site (no memory, one
> visit), production (memory saved to the project) — differ only in memory and in how deep the tool
> goes; memory is never a tab.

**Until the book carries it, this site states it as above and points here.**

### The carry list for production — every file that makes the screen

**Full source paths, and what each needs on the other side.** Production is Next.js; this site is
Vite. Nothing here is designed from a guess at production's side — the list says what each file
depends on, and production decides how to meet it.

| File | What it is | What it needs on the other side |
|---|---|---|
| `src/screen/AgentScreen.tsx` | The screen: tab row, "Next phase", stacked panels hidden by visibility | The `AgentHost` type; the classes `.wb-tabs`, `.wb-tab`, `.wb-next-phase`; the custom property `--screen-accent`, which it sets from the host's token |
| `src/screen/ScreenChat.tsx` | The Chat tab: host header, bubbles, the one composer | `Transcript` with `look="bubbles"`; the `Conversation` type; `.wb-composer`, `.wb-composer-desk`, `.wb-send-desk`, `.chrome`, `.tag`, `.t-mono`, `.t-caption`; tokens `--card`, `--line`, `--gutter`, `--r-md`, `--ink-3`; the portrait as an image address |
| `src/screen/NotLiveChat.tsx` | The Chat tab of an agent whose chat is not live | The host header from `ScreenChat.tsx` and nothing else |
| `src/screen/KnowledgePackTab.tsx` | Cards, versions, sources; rows that open to layers | The `Citation` type; `CiteLine` and `.wb-cite-*`; `.wb-pack-*`; `.chip` and `.tag` with `--chip-role`; `--state-approved`, `--state-pending` |
| `src/screen/CredentialsTab.tsx` | Exam and scores, honest that none exists | `.wb-pack-*`; `.chip` with `--chip-role`; `--state-pending` |
| `src/chat/Transcript.tsx` | Turns as rows or as bubbles | `AnswerBody`, `CiteLine`, the evidence types; `.wb-turn`, `.wb-turn-me`, `.wb-turn-host`, `.wb-turn-body`, `.wb-turn-portrait`, `.wb-turn-who`, `.wb-bubble`; `--turn-accent`, set per turn from the host's token |
| `src/chat/AnswerBody.tsx`, `src/chat/CiteLine.tsx`, `src/chat/evidence.ts`, `src/chat/useConversation.ts` | The chat layer: markers, citations in the four-part shape, the host and turn types, the conversation hook with abort and the honest error | A relay per agent behind `/api/<agent>`, which the clients call with `fetch`; production's own routes, its own caps and its own memory |
| `src/styles/tokens.css` | The tokens, transcribed from the book | The `--bot-*` tokens per agent — Wellington Tide, Phoebe Anemone `#A04E7E`, Bridget Surf, Calvin Plum — plus `--tide`, `--tide-text`, `--tide-hover`, the grounds, the inks, the radii, the fonts, `--gutter`. Production has the book's own; Phoebe's and Calvin's must be added wherever they are hosted |
| `src/styles/base.css` | The stylesheet | The sections headed "The agent screen" and "The Knowledge pack and Credentials tabs", plus what they lean on: `.wb-composer*`, `.wb-send-desk`, `.wb-cite-*`, `.chip`, `.tag`, `.label`, `.eyebrow`, `.t-*`, `.wb-crew-row` |
| `src/components/CrewRail.tsx` | The crew with the active card's underline and the save button at its foot | The portraits and the `--bot-*` tokens; the save button is this site's bridge and production has its own way on |
| `src/lib/journey.ts` | The phases and `nextPhaseAfter`, which names the "Next phase" button | Production's own phases; only the shape carries |
| `src/components/Desk.tsx`, `src/components/PhoebeScreen.tsx`, `src/components/BridgetScreen.tsx`, `src/components/CalvinScreen.tsx` | The four seats — each assembles its agent's tabs and holds or receives its conversation | Production writes its own seats, with memory passed in; Phoebe's pack view reads `src/lib/phoebeCards.ts`, Calvin's reads `src/lib/methodPacks.ts` |
| `brand/assets/bots/wellington.svg`, `phoebe.svg`, `bridget.svg`, `calvin.svg` | The portraits | §8: a shared agent's portrait lives with the shared assets; Phoebe's lives with the open site |

**Vite-only, which production must swap:**

- **`?raw` imports.** `src/lib/phoebeCards.ts` reads the two card files with `import … from
  '../../eligibility-cards-vwba.md?raw'`. Next.js has no `?raw`; read the files with `fs` in a
  server module at build time, or add a raw loader.
- **SVG imports as addresses.** Every portrait is `import x from '….svg'` and Vite returns a URL
  string. Next.js returns an image object, so use `.src`, or serve the portraits from `public/`.
- **`src/vite-env.d.ts`** declares those two import kinds for the type checker; production declares
  its own.
- **`import.meta.env.VITE_*`** is used only by the map (`VITE_CARTO_KEY` in `BasinMap.tsx`), not by
  the screen; noted so the map's Tool tab is not carried without it.
- **Relative `fetch('/api/…')`** in `phoebeClient.ts` and `wellingtonClient.ts` reaches Vercel
  functions here; production's API routes answer the same shape or the clients change.
- **`color-mix(in oklab, …)`** and custom properties set from React style objects are browser
  features, not Vite's; they carry unchanged.

Logged 8 Sep 2026. **Built 9 Sep 2026, pull requests #61 to #64. Closed and moved to the archive
the same day; the raise and the carry wait on the maintainer's hand.**

---

---

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

**The guarantee this preserves** is the one in [CITATIONS.md](../CITATIONS.md): an agent places a
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

**Closed 18 Sep 2026 in the maintainer's triage.** Built; Level 3 is item S3 and out of scope; nothing owed.


---

## S3. Level 3 citation pop-out — paid platform, not this repo

**Maintainer ruling, 22 Aug 2026.** The free site does not build Level 3. No pop-out, no tabs.
Clicking a marker shows one line and nothing more.

The extracted chat rules describe a third level: a "read more" pop-out with a plain-English tab and
a verbatim source-text tab. **That is a paid-platform feature.** It is logged here for two reasons.

First, so nobody rebuilds it from the extracted rules by mistake — the rules are in the repository
and read as though all three levels apply here.

Second, because it could not have been built here anyway, and the reason is worth keeping.
[CITATIONS.md](../CITATIONS.md) forbids this repository holding document excerpts beyond short
attributed snippets, and neither committed card set contains a single one — checked 22 Aug 2026,
the word "Excerpt" appears zero times in either file, and the card files state outright that every
sentence is a rewrite. A verbatim source-text tab on this site would have had nothing to show.

Nothing to do. Recorded so the decision is not re-litigated from the rules alone.

**Closed 18 Sep 2026 in the maintainer's triage.** A ruling with nothing to do; this archive keeps the reason it is not rebuilt.


---

## S9. The return to the brand book

**The brand book arrived by the maintainer's hand on 28 Aug 2026 — version 3, one light brand,
superseding the two-theme era.** It governs both properties and is complete on its own page.
`BRAND.md` in this repository **is** that book. It is gitignored, as it has always been, so it does
not publish.

**This item is the work of returning the shipped stylesheet to it.** It is not a second design
ruling. The book is the ruling; this is the list of places the code has not caught up to it yet,
and what is being done about each.

**[DESIGN_CANON_for_ShellB.md](./archive/DESIGN_CANON_for_ShellB.md) is superseded by the book and says so
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
lives in [PROCESS_RULES_for_ShellB.md](../PROCESS_RULES_for_ShellB.md).

**One rider is still not an item and is still unridden.** The rail-width rider, inherited from item
S8, rides whenever the rail is next opened for another reason. No work in this item opened it.

Logged 29 Aug 2026, **closed 30 Aug 2026.**

**Closed 18 Sep 2026 in the maintainer's triage.** Closed on 30 Aug 2026 and still in the opening read at 450 lines. Its two riders have homes: the rail-width rider folds into item S5, Route C into item O9.


---

## S10. The Quantification step

**The console's third surface, built 1 Sep 2026.** Step 3 of the north star: *what benefit would
this project produce?* Same shell as Eligibility — left rail, centre worksheet, right agent dock. No
wizard, no standalone calculator page, no second layout, no new URL.

**The step is Quantification. A pack is one tool inside it.** That separation is the point: the same
seat has to hold carbon screening, the other D-methods, and methods from standards this console does
not carry yet. **The surface is pack-keyed and knows nothing about any one method** — the fields,
the gates, the groupings, the defaults, the formula and the arithmetic all come from the pack. The
first pack is item K5.

**What is on it, top to bottom** — the maintainer's ruling of 1 Sep 2026, after two walks: a tab
strip of packs so the family is visible from the first day; a header with the pack's name, what it
measures and the big result; a short method strip saying the method once; the gates as one compact
row; the formula written out with live values dropped in; the variables as explained rows; the
result with its citation and screening tag.

**A failed gate replaces the formula and the variables with a stop card**, so nobody fills in a form
that cannot produce an answer.

### The look, and where it came from

**Two design references arrived by the maintainer's hand** on 1 Sep 2026 and are gitignored. **What
was taken is the look only** — row density, the card-tab shape, the formula idiom. **Not their data,
their revenue block, their "verified" language or their agent panel.** Rule zero is unchanged: the
engineer never fetches or guesses at the production side, and these arrived because she carried them
across, which is the one sanctioned route.

**Three corrections came out of her walks**, each recorded because each was a real fault: the first
build read as a wall of text rather than a calculator; the second washed a violet page behind the
numbers when purple belongs on small tags; and the sheet sat narrower than the Eligibility
worksheet, so two free surfaces on one console did not share a margin.

**The selected tab and the sheet are one joined white surface**, the tab painting its bottom edge in
the sheet's own white so it covers the sheet's top hairline. An unselected tab sits back on the
Frost ground with its hairline, so the two read as different planes.

### Calvin's dock has a shape of its own

Phoebe's and Bridget's docks are top-anchored. **Calvin's adds a footer strip that never scrolls**,
carrying the one line that must not leave the screen: *screening estimate · not verified.* A
calculator cannot let those words scroll out of sight, and a chat dock's shape allows exactly that.
It is why the maintainer approved a new shape rather than a recoloured one.

**His chat is not built**, and the panel says so plainly — the same posture as Bridget's. **The
gates move into his conversation when it goes live**, and the toggles fill from his answers then.
Not this sprint.

### Two faults this work created, and closed

1. **A portrait that would have failed only on deploy.** `brand/assets/bots/` is ignored and
   re-opened one file at a time, so `calvin.svg` was invisible to git: the build passed locally and
   the Vercel build would have failed on a missing import. It has its own negation now, confirmed by
   staging it rather than by reading the rule.
2. **A field that could vanish from the page.** Splitting the fields into gates and variables meant
   a field in neither list would disappear while the arithmetic still read it. Four checks hold the
   two lists to covering every field exactly once.

**From 2 Sep 2026 the slot holds three packs** (item K6), the tabs are selectable, a pack's result
is figures with units and a headline rather than litres by name, and ~~carbon screening is named
on the tab strip and marked planned~~ the planned placeholder is gone. The step's answers moved
into the visit (item S11) so the desk can read them.

Built 1 Sep 2026. **Open as the home for the surface's story.** What remains is Calvin's chat, which
is not scheduled.

**Closed 18 Sep 2026 in the maintainer's triage.** Built; open only as the surface's story. Calvin's chat, the one thing it named as remaining, is item A12.


---

## S13. The handoff receiver — a question carried in from the production landing

**Logged 3 Sep 2026, by the maintainer's confirmed shape. Not built.**

**The shape.** The production landing keeps its question box. Typing there hands the visitor to
this site with the question carried — **a URL handoff, the save door in reverse.** This site
receives it and opens the hero chat (item S12) with the question already sent and Wellington
answering. No retyping.

**Each shell builds only its side.** Production builds the sender; this site builds the receiver.
Rule zero is unchanged: the shape of what is carried, and how, travels by the maintainer's hand,
the way the bridge (item S7) does. Nothing here is designed from a guess at the production side.

**What "done" looks like:** a receiver that takes a carried question, opens the hero chat, and
sends it; a check that a malformed or absent carry opens the page honestly empty rather than
inventing a question; and the sender's shape recorded here when it arrives.

~~Logged 3 Sep 2026. **Not built. Waits on item S12 and on the sender's shape by the maintainer's
hand.**~~

**Built 9 Sep 2026, by the maintainer's word of that day, with the hero chat (item S12) parked.**
The receiver lands on the desk instead: the desk reads the question from the address, opens
Dispatches, and hands it to Wellington as the visitor's first turn, in a bubble, so his answer is
the first thing they see. The address is cleaned the moment the question is read, so a reload or a
shared link cannot send it twice; nothing is kept. **Bad or empty input is ignored with no error** —
a missing, blank, over-long or unreadable question opens the page as it always opens.

~~**The sender's contract, for production to carry — one line:** open
`https://map.waterbots.ai/?question=<the question, percent-encoded as UTF-8 the way
encodeURIComponent writes it, at most 500 characters once decoded>`. Only the first `question=` is
read.~~ **Amended 15 Sep 2026, pull request #74.** The contract is

`https://map.waterbots.ai/?question=<≤500>[&does=<≤300>][&name=<≤80>][&place=<≤80>]`

Percent-encoded UTF-8 the way `encodeURIComponent` writes it. Caps counted after decoding. Omit
empty keys. No kind. No provenance in the URL — this site stamps chat. Caps are the sender's job;
this site ignores broken, over-long, or empty fields, never cuts them, and never shows an error.
One bad field does not drop the others. Only the first of each key is read. The contract lives in
`src/lib/carried.ts` and the gate in `scripts/check-wellington.mjs` holds it
~~(77 from 15 Sep 2026)~~ **(87 from 16 Sep 2026)**.

**Optional facts, 15 Sep 2026, #74.** `does`, `name` and `place` ride beside the question and fill
the visit card through the existing `learnedContext` writer, provenance chat. Facts without a
question fill the card only; no question is invented. A reload after the address is cleaned does
not re-apply them. ~~**Wellington's chat was not rewritten this slice:** the card and Phoebe get the
facts; he may still ask in chat for facts that were only in the params.~~ **Visit-aware from
16 Sep 2026, #76:** Wellington receives the same record on every ask (`readRecord`, his own block
headed “What this visit already holds”). Filled does / name / place / kind are treated as known;
he may still ask for anything missing. Kind is still never in the URL. The first carried send
reads a ref written before that send, so it is not blank. Phoebe’s block is unchanged.

**Ten a day per visitor**, the bridge's number, by the maintainer's word: a carried question is
counted under its own counter on Wellington's relay, on top of his thirty and never instead of it,
so a landing page is not a way round his cap. **The shape was the engineer's reading of "ten-a-day
cap applies", stated as an assumption in the pull request, and the maintainer approved it on
9 Sep 2026 with the merge of #66.** The eleventh is refused in plain words and the desk
composer still works. The gate in `scripts/check-cap.mjs` holds the number.

**Proved with one real call on 9 Sep 2026**, the capture in the pull request. A first attempt was
aborted at the local relay before the model was reached: React's development double-mount ran the
conversation's cleanup and cancelled the request in flight, so the send is now deferred one tick
and the code says why.

**Open as the home for the receiver's story.** The hero page, when it comes, is fed by the same
receiver.

**Closed 18 Sep 2026 in the maintainer's triage.** Built and twice amended; the sender's contract is recorded here for production to carry. The hero page is item S12 and is parked.


---

# Family: Operations

## O2. Restore branch protection on `main` — closed

**Restored by the maintainer, 24 Aug 2026.** The owner bypass is removed and `main` requires a pull
request again.

The bypass had been held open deliberately since 20 Aug 2026 so the v1 build and this session's work
could be pushed directly. That allowance is over.

**What this means for the next session: direct pushes to `main` will be refused.** Changes go
through a pull request. An engineer who finds a push rejected has not hit a fault — that is the
ruleset doing its job, and the answer is a branch and a pull request, not a request to reopen the
bypass.

This was a live GitHub setting rather than a repository file, so nothing here enforces it and
nothing here can verify it. It is recorded on the maintainer's word.

---

## O3. Reverse link from waterbots.ai — closed

**The link is live.** Confirmed by the maintainer, 24 Aug 2026. waterbots.ai links to this map.

It was always the marketing site's job rather than this repository's, and it is recorded here only
because the README describes the relationship between the two sites and has to be true about it.
Nothing further to do.

---

## O6. The card gate reports stale cards that are not stale

**Found 26 Aug 2026**, while repairing an accidental move of the `api/` folder. It is small, it is
not urgent, and it is worth fixing because a gate that cries wolf is a gate people learn to ignore.

**What it looks like.** On this machine, on a fresh checkout, one of the nine checks fails:

```
node scripts/build-card-module.mjs --check
STALE — api/_cards.generated.ts does not match the card files.
The relay would deploy with out-of-date cards.
```

**Phoebe's cards are not out of date.** That was checked rather than assumed: the card text carried
inside the relay's copy was compared character by character against both committed card files, and
it matches exactly. Nothing about her knowledge is wrong, and nothing reaches a visitor.

**What it actually is: line endings.** Every line in a text file ends with a marker, and Windows and
Linux use different ones. Git stores one form and is set, on this machine, to write the other form
into the folder on checkout. The two forms mean the same thing, and git knows it — which is why
`git status` and a comparison against `main` both show no difference.

The gate does not know it. It rebuilds what the file *should* say and compares the raw characters,
so fifteen invisible markers read as a mismatch:

| | Line-end markers | Size |
|---|---|---|
| As git stores it | 0 | 44,299 bytes |
| As checked out here | 15 | 44,314 bytes |

Fifteen markers, fifteen bytes, same words.

**The script already knew about this problem and solved half of it.** Its own comment says the card
files it reads may arrive with either form and normalises them before use, "without this the
generated module differs by platform and the staleness gate fails on a clean tree." That care was
applied to what it reads and not to what it compares against.

**Why it matters at all.** Nothing is broken in production — the deployment platform builds from
what git stores, which has never changed. The cost is entirely to the people working here: a check
that fails on a clean tree teaches its reader that failures are normal, and the next real staleness
will look the same as this one.

### Two ways to settle it

1. **Pin the line endings** — a `.gitattributes` file telling git to leave this file's line endings
   alone on every machine. **Recommended.** It fixes the cause rather than the symptom, it works for
   anyone who clones the repository rather than only here, and it guards the same class of trouble
   that has already bitten this repository once: the card parser was line-ending sensitive and
   rendered a blank page on a Windows checkout while the Linux build was perfectly fine.
2. **Teach the gate to ignore line endings when it compares** — one line, mirroring what the script
   already does to the files it reads. Cheaper and narrower; it fixes this one gate and leaves the
   underlying difference in place for the next thing that trips on it.

**Neither is built.** Both are small enough to be one step by the sizing ruling of 26 Aug 2026 —
one thing to look at, one thing to undo.

### What not to do

**Do not settle it by regenerating the card module and committing the result.** That was done once
on 26 Aug 2026, at the maintainer's word, to get a clean run of the checks — and it is a patch, not
a fix. It writes the file in the form the gate wants, and then the next checkout writes it back the
other way and the gate fails again. Worse, in between, `git status` shows the file as modified with
nothing in it to commit, which is its own small confusion.

**A prediction worth recording, because it was wrong.** The engineer said that regenerating would
leave git showing nothing. It did not — git flagged the file as modified while reporting zero bytes
to stage. Switching branches afterwards did *not* undo it, because git preserves a file it believes
you have edited. So the patch survives longer than expected and is more confusing than expected,
which is an argument for fixing the cause and not the symptom.

### Ruled — pin the line endings

**Maintainer's ruling, 26 Aug 2026: take the durable fix.** A `.gitattributes` file pinning the line
endings, not the one-line change to the gate. The cause is fixed for every machine that clones this
repository rather than for this one only.

**It is the first step of the next session, before the agent handoff primer.** It is minutes of work
and it stops a check crying wolf on every fresh checkout, so it goes first — the primer is the
session's real work and follows immediately after.

**No build tonight.** Ruled and recorded only.

**What "done" looks like**, so the next session does not have to re-derive it: `git status` clean and
the card gate passing at the same time, on a fresh checkout, without the generator having to be
re-run. The patch currently in the folder — `api/_cards.generated.ts` showing as modified with zero
bytes to stage — should disappear as part of this, not be committed.

### Closed — fixed 27 Aug 2026

**A `.gitattributes` file pinning every text file to Unix line endings**, ~~in git and in the
working folder,~~ **in what git stores**, on every machine that clones this repository. Merged as
pull request #8. The "done" test above was met exactly: `git status` clean and the card gate passing
together, with the generator never re-run.

> **Corrected 30 Aug 2026, under the visible-corrections rule.** ~~"in git and in the working
> folder"~~ claimed more than the rule delivers. **`text=auto eol=lf` binds what git stores, which
> is what ships and what the rule was written to protect.** It does not reach back and rewrite files
> already sitting in the working folder — git only rewrites a file on checkout when its content
> changes, so a file that has not differed between branches since 27 Aug still carries whatever form
> it had before. **Nothing about the fix or its "done" test is affected**; only the sentence
> describing its reach was too wide. Item O10 owns the full story.

**The cause was one layer below what this item recorded.** The file in the folder already held Unix
endings and was byte-for-byte identical to what git stores — the same blob, `557be86f`. Git had
**cached the Windows length** for it, 44,314 against an actual 44,299, and it compares that cached
size before it compares content, so it reported the file as modified without ever looking inside.

That single fact explains all three puzzles this item recorded separately: `git diff` showed nothing
to stage, regenerating the file did not clear it, and switching branches did not undo it. The fix
still works for the reason the ruling gave, and it also clears the stale cache, because the next
checkout finally writes the form git expects.

**Nothing tracked in this repository was carrying Windows line endings**, confirmed with
`git add --renormalize`, so the rule prevents future drift rather than converting anything.

Logged 26 Aug 2026, ruled 26 Aug 2026, **fixed and closed 27 Aug 2026.**

---

## O7. Merged branches pile up, and are now to be cleared

**Maintainer's ruling, 26 Aug 2026: delete the merged branches, and turn on GitHub's
delete-on-merge so they stop accumulating.**

**Why there are any.** `main` is protected, so every change goes through a pull request and every
pull request leaves its branch behind once merged. Nothing deletes them, so the list grows by one or
two each session. None of them does any harm — every commit in them is already on `main` — but a long
list of dead branches makes the live one harder to see, and makes it easy to branch from a stale
one by mistake.

**What was there when this was ruled**, all confirmed merged into `main` by `git branch --merged`:

| Where | Branches |
|---|---|
| This machine | `docs/session-close-out`, `docs/bridge-vocab-design-canon`, `docs/step-sizing-ruling` |
| GitHub | the same three, plus `docs/session-close-out-25-aug` and `feat/phoebe-step-4-cap-and-abstention-log` |

**Two halves, and only one of them is repository work.**

1. **Deleting the branches** — the local three and the remote five. Safe, and confirmed safe rather
   than assumed: `git branch --merged main` lists every one of them, which means `main` already
   holds every commit they carry.
2. **Turning on delete-on-merge** — a live GitHub setting, in the repository's own settings, not a
   file here. **Nothing in this repository enforces it and nothing here can confirm it**, the same
   way branch protection (item O2) is recorded on the maintainer's word. It is the half that stops
   this coming back.

**No build tonight.** Ruled and recorded only. The branch holding this close-out is not one of the
five — it is still open and becomes deletable once its own pull request merges.

### Closed — both halves done 27 Aug 2026

**Delete-on-merge is on.** Turned on through GitHub's API and read back to confirm: `false` → `true`.
It has already worked on its own — every branch merged after it was set has been deleted by GitHub
without anyone asking.

**Every merged branch is gone**, here and on GitHub. The five named above, plus the four this
session created and merged, each confirmed an ancestor of `main` before deletion rather than
trusted. `main` is the only branch that remains.

**One thing was not as recorded.** The five branches on GitHub had already been deleted by the time
the setting was turned on, so the remote half needed nothing. That is noted rather than smoothed
over: the item's picture of the remote was a session old.

Logged and ruled 26 Aug 2026. **Closed 27 Aug 2026.**

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

## O5. The engineer pushed without a commit word, twice

**Logged at the maintainer's instruction, 24 Aug 2026.** Recorded rather than absorbed, because a
process breach that leaves no trace is one that repeats.

**What happened.** Two commits — `28e29b6` and `eb5b7ca`, the import fix and the runtime fix — were
committed and pushed to `main` on the strength of a plan approval, not a commit word.

**Why that is a breach even though the maintainer said "go".** The process in
[PROCESS_RULES_for_ShellB.md](../PROCESS_RULES_for_ShellB.md) has five steps and they are not
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

**Closed 18 Sep 2026 in the maintainer's triage.** Its rule, approval is never a commit word for main, was carried into PROCESS_RULES_for_ShellB.md under "How work moves" on 18 Sep 2026, dated, by the maintainer's word. This record stays as the reason the rule exists.


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

**The cause was plain.** [PROCESS_RULES_for_ShellB.md](../PROCESS_RULES_for_ShellB.md) owns how a
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

[PROCESS_RULES_for_ShellB.md](../PROCESS_RULES_for_ShellB.md) now carries the ruled order, and the
note that flagged the question while it was open has been removed.

### The second question, kept separate on purpose

**Should the export be a script rather than a hand copy?** That is a larger question and a
different one, and the session of 26 Aug asked that the two be kept apart. They are.

A script would make the step repeatable and would let a check notice staleness. It would also put
a repository file in charge of a folder the repository deliberately does not track, and it would
need to know which fifteen documents count — a list that changes. **No recommendation is offered
here.** It is recorded so it is not lost, and it does not block the ordering question above.

### What is left

~~**The ordering question is closed and the ritual is written.** What keeps this item open is the
second question above — script or hand copy — which has no ruling and is not due.~~

**Closed 17 Sep 2026, maintainer's ruling: the exports folder is retired.** The project library
now syncs from GitHub, so hand-carried copies are no longer needed. The step left the close-out
ritual in [PROCESS_RULES_for_ShellB.md](../PROCESS_RULES_for_ShellB.md) with a dated strike, the
folder was deleted, and its ignore rule went with it, since nothing else used it. The script
question above is moot: there is nothing left to copy.

Proposed and ruled 27 Aug 2026. ~~**Open only on the script question.**~~ **Closed 17 Sep 2026.**

**Closed 18 Sep 2026 in the maintainer's triage.** The step and the folder are retired; swept the day after it closed.

