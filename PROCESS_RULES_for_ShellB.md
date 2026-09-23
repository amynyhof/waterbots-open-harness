# PROCESS_RULES_for_ShellB.md — How work is run in this repo

Extracted from main-platform working canon (2026-08-23) for use on the
open site. Rules travel as rules; no private-platform files, names, or
paths appear here. The maintainer is Amy. The engineer is whoever is
reading this.

## How a session opens

**Maintainer's ruling, 28 Aug 2026. The close-out has a ritual; the opening now has one too.**
**Every session opens in two parts, in order.**

### Part 1 — Orientation

**No building happens in Part 1.** Not a fix, not a proposal, not a branch.

1. **Read the opening documents**, listed below.
2. **Confirm `main` equals `origin`**, with the two commit identifiers compared and shown, not
   assumed.
3. **Report in plain English:** where we left off, what is in flight, what waits on the
   maintainer's word, and **anything that changed underneath us** since the last session.
4. **Kill stray dev servers.**
5. **Check for code reading an unpushed migration** — see *the migration gate* below. Nothing here
   has migrations yet; the check runs anyway, so the first one does not arrive unguarded.

**"Anything that changed underneath us" is the one people skip.** A pull request merged after the
last close, a setting altered on the platform, a file moved by hand, a provider that stopped being
free. Every one of those has happened here, and each was found late.

### Part 2 — The plan, then the batch

**Propose the session's plan**: the steps in order, each sized by the standing rule above, marking
which need a ruling and which are already approved.

**The maintainer approves the plan once. An approved plan is a batch approval.**

**Build through it without stopping between steps** — a commit per step, ~~a pull request per
step,~~ **a pull request per checkpoint**, and her eyeball wherever a step's own gate requires one.

> **Corrected 29 Aug 2026.** This said *a pull request per step* until the bundling ruling below.
> A commit is still per step; the pull request is now per eyeball stop. See *Pull requests bundle by
> the maintainer's checkpoints, not by step*.

**Interrupt only for three things:**

1. **A ruling that is genuinely needed**, and was not anticipated in the plan.
2. **A surprise that changes the plan** — not a difficulty, a change of shape.
3. **A gate failure.**

**This does not loosen anything else.** A step is still sized by risk. A browser check is still a
browser check. Nothing merges without the maintainer. What the batch removes is the pause between
steps that were already agreed, not any of the gates inside them.

**The close-out still runs once, at the end.**

---

### The opening documents

Read ~~six~~ **four** documents before doing anything else, every new session:
[CLAUDE.md](./CLAUDE.md), **this file**,
[BUILD_PLAN.md](./BUILD_PLAN.md), [OPEN_ITEMS.md](./OPEN_ITEMS.md).
The session has not started until all ~~six~~ four are read.

~~[DESIGN_CANON_for_ShellB.md](./docs/archive/DESIGN_CANON_for_ShellB.md)~~ and
~~[SESSION_HANDOFF.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md)~~ **left
the required open list on 17 Sep 2026.** The design canon is archived; the brand book
wins. The session handoff is retired. **Do not recreate a live root `SESSION_HANDOFF.md`.**
Live state is OPEN_ITEMS, BUILD_PLAN, BUILD_LOG, and git. Never read
[docs/archive/](./docs/archive/README.md) for current state.

**This list is the one home for the opening ritual**, and [CLAUDE.md](./CLAUDE.md) points here
rather than carrying a second copy of the count.

**[BUILD_LOG.md](./BUILD_LOG.md) is deliberately not among them and must not join them.** It is
history, written at the close and read only when someone goes looking. Adding it would undo the
rule it exists to serve — see *the opening reads stay thin, forever*.

**The count moved twice on 27 Aug 2026, both times on the maintainer's ruling.** This list said
four for as long as it existed, leaving itself off its own list, while CLAUDE.md said five and
named this file among them; five was ruled right. Then the design canon arrived and joined the
opening reads, making six. **Corrected 17 Sep 2026: the count is four.** The canon and the
handoff left the required open list. Four is the number this list first held, now on purpose.

## How work moves

Every piece of work follows one sequence, no skipped steps:

1. **Proposal** — the engineer says what it will do and why.
2. **Approval** — Amy says go. No go, no build.
3. **Build** — the engineer builds exactly what was approved.
4. **Eyeball** — Amy checks it in the browser herself.
5. **Commit word** — Amy says commit. Nothing is done until she does.

One topic at a time. One step per exchange where possible.

### Approval is never a commit word for `main`

**Maintainer's ruling, 24 Aug 2026. Carried here from item O5 on 18 Sep 2026, by her word, so that
the rule has one home in the rulebook rather than in an open item.** The five steps above are not
interchangeable: approval covers the building; the maintainer's own review comes after the build,
and the commit word comes after that. Her words, as item O5 recorded them:

> A proposed plan does not list committing or pushing as a step the engineer may carry out. Plans
> end at "built and checked". The engineer then reports **"built, not committed"** and stops, every
> time, including when the maintainer has already said go, including when the site is down, and
> including when the change is one line. If a plan is approved that contains a commit step, the
> engineer stops before it anyway and asks.

**Read with the batch ruling of 28 Aug 2026 above, which came later and narrowed what "commit"
means here.** Under an approved batch the engineer commits each step on its branch and opens the
pull request, because that is how the work reaches her eyeball. What this rule forbids is anything
reaching `main` on the strength of an approval: no push to `main`, no merge, ever, without her
word. The two breaches that made the rule were two pushes straight to `main` during an outage.
**Urgency is the condition this rule exists for.** Item O5 keeps the record and is archived.

### How big is a step

**Maintainer's ruling, 26 Aug 2026. The sequence above is unchanged and is not
breakable.** No second topic starts before the first has landed, and nothing is
built ahead of the approved step. This ruling only says how much work one step
may hold.

**A step is sized by risk, not by count.** One step is one coherent, testable
thing, however many files it touches. The number of files is not the measure and
never was.

**The sizing test, applied when the step is proposed — not after it is built:**

1. Can the maintainer check it in one sitting?
2. Could it be undone in one motion?

**Both yes, and it is one step. Either no, and the proposal must split it**
before it is put forward.

**What that means in practice.** A theme change across the whole site can be one
step, because it is one thing to look at and one thing to undo. A single defect
fix is one step. **Two unrelated fixes are never one step**, however small either
is — they are checked separately and they are undone separately, so they are
proposed separately.

### Design work starts from an image

**Maintainer's ruling, 30 Aug 2026. Into canon.**

> **Any step whose point is how something looks begins from a captured visual reference, and the
> maintainer's approval of a look is given on pixels, not prose.**

**Which steps this binds.** A step whose *point* is appearance — a colour, a fill, a ramp, a
spacing, a shadow, a layout. Not every step that happens to touch a stylesheet: a token rename, a
dead-code removal or a value swap that moves nothing on screen is not design work, and it does not
need an image. **The test is whether the thing being decided is how it looks.** If it is, there is a
picture before there is a proposal.

**What "a captured visual reference" means.** A screenshot, a mockup, or a rendered comparison that
exists as a file — not a description of one, and not a memory of one. It is captured **before** the
proposal is written, because the proposal is meant to argue from it. Where a change alters something
already on screen, the capture is a **before and an after**, in the same viewport, so that the only
difference between the two frames is the change itself.

**And approval is given on pixels.** A written argument that a colour will read as quieter is not a
thing the maintainer can approve, because it is not the thing being decided. **She approves the
image.**

**Why this is worth a rule, in one sentence: it has already cost this repository two ramps.** Two
stress ramps were designed, machine-checked against `check-palette`, and thrown away — and the
finding that ended the exploration was that the map read flat because of the *basemap*, not the
ladder. **The eye found that in one sitting, and no amount of reasoning about the ladder would have
found it.** Item S9 in [OPEN_ITEMS.md](./OPEN_ITEMS.md) carries the whole account.

**It is the same lesson a gate already taught.** `check-palette` passed a warm fill on the arid
basins that the maintainer refused on sight. **A gate measures separation; it cannot measure what a
colour reads as.** A rule that starts design work from an image is that finding turned into a
habit rather than a story.

**What it does not license.** It is not a reason to keep a folder of screenshots of finished work.
The maintainer ruled on 30 Aug 2026 that the design exploration's images were **not** to be carried
in, because its outcome was recorded in full and the wash it led to was shipped — *"an empty seat
reserved forever is its own small untruth about what is expected."* **Those are different things.**
This rule is about what a design step *starts* from; that ruling was about what a finished one
*leaves behind*. An image earns its place at the beginning of the work, not in the archive at the
end of it.

**It does not change how a step is sized**, and it does not add a gate. It changes what has to be
in front of both people before the proposal is written.

### A session batches steps; the ritual runs once

**Maintainer's ruling, 26 Aug 2026.** A session is one working sitting, and it may land
several steps. **Nothing about a single step changes** — each one still moves through the
full sequence above on its own, sized by risk. What this ruling settles is how steps are
grouped.

**The close-out ritual runs once, at the end of the sitting — never once per step.**
Mid-session, a step that has landed needs only its commit. The documents catch up at the
close.

### Pull requests — the engineer opens them

**Maintainer's ruling, 26 Aug 2026.** The GitHub command-line tool (`gh` — a way of working
with GitHub by typing commands instead of clicking in a browser) is installed and signed in
on the maintainer's machine. From that point the engineer opens its own pull requests, with
the title and the description filled in, and keeps GitHub's delete-branch-on-merge setting
turned on so merged branches do not pile up.

**The maintainer's part becomes reviewing and merging.** The commit word still comes first,
and it is unchanged: opening a pull request is not permission to merge one, and nothing
merges without her.

#### Pull requests bundle by the maintainer's checkpoints, not by step

**Maintainer's ruling, 29 Aug 2026. Already law on production; law here from now.**

> **Everything between two of the maintainer's eyeball stops ships as one pull request.**

**Invisible groundwork rides with the visible step it serves.** A rename, a dead-code removal or a
token tidy is not a thing she can look at, so it does not earn a review of its own — it travels
with the change it was clearing the way for.

**Steps inside a bundle stay separate commits.** The bundle is the review unit; the step is still
the unit of work, and the history still reads one step at a time.

**A step keeps its own pull request only when it needs its own revert handle.** A migration. A
large change of appearance, of the kind that would be judged and possibly undone on its own — the
stress ramp is the example given. A rulebook change is another: canon is exactly the thing you want
to be able to lift out without lifting anything else with it.

**This does not loosen any gate.** Her eyeball still falls where the plan says it falls, the commit
word is unchanged, and nothing merges without her. What it removes is a review queue that grew a
row for every mechanical change.

**It changes nothing about how a step is sized** — see *How big is a step* above. A step is still
one coherent, testable thing. This rule is about how steps are grouped for review, not about how
big one may be.

#### Every description opens with a block for the maintainer

**Maintainer's ruling, 27 Aug 2026.** Every pull request description begins with a block
titled **"For Amy"** — three short parts, plain English at about a 6th-grade level, no
jargon:

1. **What changed** — the files, named, and what each one does in plain words.
2. **What I approved** — the ruling from the conversation that this delivers, in the
   maintainer's own words.
3. **What to check** — what the "Files changed" tab should say, and anything to eyeball.

**Any term a non-engineer would not know gets one plain-English line of explanation.**

**Every capture for the maintainer's eyeball is attached inside the For Amy block as an image,
never printed as a local file path.** Maintainer's ruling, 8 Sep 2026: she reads pull requests from
where a path on the engineer's machine cannot be opened, and a capture she cannot see is not an
eyeball. The engineer's way of doing it, until she says otherwise: the capture is committed on the
branch under `captures/`, named by date and step — `2026-09-08-look-pass-desk.png` — and embedded
in the block by its raw address at the commit that holds it, so the picture outlives the branch's
deletion. A capture sent to her in chat is a courtesy, not the record; the record is the block.
Pull requests before the ruling are not reformatted.

**A pull request that depends on an unpushed migration says so first.** Maintainer's ruling,
29 Aug 2026: its For Amy block opens with **`DO NOT MERGE YET`** on its own first line, naming what
it waits on. A pull request whose code reads a migration that has not landed is a green button that
breaks production, and the only reliable guard is the one a reviewer reads before clicking.

**This repository has no migrations today.** The rule is recorded before the first one rather than
after it, which is the whole point of writing a rule down.

The engineer-facing detail follows below the block, unchanged. This adds a block; it
replaces nothing. **A pull request without the block is not ready for review.**

It binds both shells, and it applies from the first pull request after the ruling. Earlier
ones are not reformatted.

## How the engineer speaks

- Plain English, 4th–6th grade level. No jargon without a one-line
  explanation the first time it appears.
- Never reference an open item by number alone — say what the item is.
- Never claim something was sent, done, or fixed without it actually
  being so. "Built, not tested" and "tested, not committed" are
  different states; name the real one.
- Mistakes are self-reported honestly and immediately. Amy makes all
  rulings.

## Corrections replace text; the archive keeps the old wording

**Maintainer's ruling, 23 Sep 2026, canon.** It replaces the rule of 28 Aug 2026
that struck a false line through in place; that rule's whole text is the first
entry in [docs/archive/CORRECTIONS.md](./docs/archive/CORRECTIONS.md).

> **No crossed-out text in any live document. A correction replaces the text;
> the old wording and its date go to the archive or the CHANGELOG, never struck
> in place.**

**Why it is worth a rule.** A live document is read for what is true now. A
line that carries its own past wording makes every reader do the correction
again, and a document with many of them stops being a briefing. The record of
what was believed and when it changed still matters, so it is kept, in one
place made for it, where a reader who goes looking will find it.

**What it applies to.** Every tracked document: the rulebooks, the open items,
the build plan, the card sets, and code comments that state a fact about the
system. **It is about corrections, not about editing.** Rewriting a paragraph
that was merely unclear, tightening prose, or reorganising a file are ordinary
edits and need no entry. The rule bites when something the document *asserted*
turns out to be untrue.

**How it is done.** Replace the false words with the true ones. Then write the
old wording, whole, with the date and a line on why, in the archive or the
CHANGELOG: a pack's old wording goes in that pack's CHANGELOG; anything else
goes in `docs/archive/CORRECTIONS.md`. The live document may say "corrected on
a date, see the changelog" in a few words; it never shows the old text.

**Where a correction is large enough to be its own thing**, it becomes an open
item and the live document points at it, rather than the item's whole story
being retold in two places.

**The sweep.** Every strike that existed when this rule was made is item C1's
to move, one document at a time; until a document is swept, its old strikes
stand and are not a defect of that document.

## Open items and families

### Record once, point everywhere else

**Maintainer's ruling, 29 Aug 2026. Already law on production; law here from now.**

> **An incident is recorded fully once, in the item that owns it. Everywhere else carries two lines
> and a pointer.**

**Why.** A fault told in full in three places is three accounts that drift, and a reader who finds
them disagreeing cannot tell which is current. It is the same disease *one home per rule* was
written to cure, applied to what happened rather than to what is required.

**What two lines look like:** what it was, and where the whole story lives. Not a summary that
grows back into a second account. If a pointer needs a third line to be useful, the owning item is
the thing to improve.

**It does not license thinness in the owning item.** The full record is still full — the
measurements, the wrong turns, the dates. It is only told once.

- Every open item belongs to a family. A new item joins a family or
  starts one; starting one is a maintainer decision, recorded with
  its reason.
- If an item seems to fit nowhere, the families are wrong — not the
  item.
- Global fixes over patchwork. Work is grouped and built by family,
  not picked off one row at a time.
- Shortcuts are taken only under real pressure, named as shortcuts,
  and logged as debt. Debt is recorded, never quietly kept.

## The opening reads stay thin, forever

**Maintainer's ruling, 29 Aug 2026. Already law on production; law here from now.**

> **A growing opening document is a defect, and it is flagged as one.**

~~Six~~ **Four** documents are read before every session starts. If they grow without bound, the ritual that
exists to make a session start well becomes the reason it starts slowly, and the parts that matter
get skimmed. **The reads are a briefing, not an archive.** Retired documents live in
[docs/archive/](./docs/archive/README.md) and are never opening reads.

**Three rules hold the line.**

1. ~~**[SESSION_HANDOFF.md](./docs/archive/SESSION_HANDOFF_retired_2026-09-17.md) is current state only, and is rewritten from
   scratch at every close.** Not amended, not appended to. Where we are, what is committed and what
   is not, what waits on the maintainer, what comes next. **A sentence about how something came to
   be is history and does not belong in it.**~~
   **Corrected 17 Sep 2026:** there is no live root session handoff. Live state is
   [OPEN_ITEMS.md](./OPEN_ITEMS.md) and [BUILD_PLAN.md](./BUILD_PLAN.md). History is
   [BUILD_LOG.md](./BUILD_LOG.md). The retired handoff is in
   [docs/archive/](./docs/archive/README.md). **Do not recreate a live root
   `SESSION_HANDOFF.md`.** Never read the archive for current state.

2. **History lives in [BUILD_LOG.md](./BUILD_LOG.md), which is append-only and is never read at the
   opening.** It is not one of the ~~six~~ four. It is written to once per session, at the close, and read
   only when someone goes looking for how a thing came to be. Nothing in it is ever edited — a
   correction is a new entry that says what it corrects, which is the visible-corrections rule
   applied to a log rather than to a claim.

3. **An item's own row carries its own story**, in [OPEN_ITEMS.md](./OPEN_ITEMS.md), recorded once
   per *record once, point everywhere else* above.

**When OPEN_ITEMS.md gets heavy, sweep the closed items to an archive file.** A closed item is
finished; it earns a pointer and a home elsewhere, not a place in a document read at the start of
every session. Sweeping is ordinary tidying and needs no ruling — deciding what a *family* is still
does.

**Flagging is part of the job.** An engineer who notices an opening document growing says so in the
Part 1 report, rather than reading it dutifully and saying nothing.

## How a session closes

**The close-out is one complete act.** Maintainer's ruling, 26 Aug 2026: the ritual below
includes every step, every time. **A ritual with a skipped step is an unfinished ritual.**

1. Refresh the root docs so they tell the truth: BUILD_PLAN.md,
   OPEN_ITEMS.md, CLAUDE.md, and any rulebook touched this session.
2. **Append this session to [BUILD_LOG.md](./BUILD_LOG.md)** — what was built, what was learned,
   what was decided. Append only; nothing already in it is edited.
3. ~~SESSION_HANDOFF.md is **rewritten from scratch**, current state only, so a cold reader can
   resume: where we are, what is committed vs. uncommitted, what is waiting on Amy, what comes
   next. **It carries no history** — that is what BUILD_LOG is for.~~
   **Corrected 17 Sep 2026: no handoff rewrite.** There is no live root
   `SESSION_HANDOFF.md`. Close-out refreshes BUILD_PLAN, OPEN_ITEMS, and CLAUDE (if
   touched), and appends BUILD_LOG only. Do not recreate a live root handoff.
4. **Check for code reading an unpushed migration**, the same check Part 1 runs.
5. Commit the checkpoint.
6. ~~**Then** regenerate the export copies, where the repository keeps them.
   In this repository that is the `exports/` folder — the maintainer's
   copies of the root documents, which she carries elsewhere by hand.
   It is gitignored, so nothing here refreshes it and no check notices
   when it is stale. That is why it is a named step.~~
   **Retired 17 Sep 2026, maintainer's ruling.** The project library now syncs
   from GitHub, so hand-carried copies are no longer needed. The `exports/`
   folder is deleted and its ignore rule is gone. There is no export step. The
   number is kept so older references to "step 6" still point at something.
7. Confirm `main` is equal to `origin`.
8. **Refresh Wellington's build-update fact**, the maintainer's ruling of 23 Sep 2026:
   `knowledge-packs/wellington-host/build-update.md`, dated, what is built and what is next, in
   facts he phrases; regenerate the prompt modules so the staleness gate passes. The desk's one
   line says a visitor can ask him for a build update, and this step is what makes that line
   true at every close.

~~**The copies are made after the final commit, not before it**, so they carry the close-out
itself rather than the state just before it. Maintainer's ruling, 27 Aug 2026 — see item O8 in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) for why the order matters. Regenerating first was how the
copies fell a session behind on 26 Aug.~~

~~The library is never more than one session stale.~~

**Struck 17 Sep 2026:** there are no copies to order. Item O8 in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) keeps the story of the step while it lived.

## Standing rules that govern everything above

- **Rule zero:** this repo sees only this repo. The engineer never
  fetches, guesses at, or imitates the private platform. Rules
  arrive as extracted rule files like this one, brought by Amy.
- **No fabricated data, ever.** Not in tests, not in demos, not as
  placeholders that look real.
- **A test stand-in for infrastructure is not fabricated data.** The rule
  above protects what a visitor is shown. A stand-in for a database or
  another service, used by a check script and never reaching a person, is a
  different thing and is allowed. Maintainer's ruling, 25 Aug 2026, made when
  a daily message cap could otherwise only be confirmed by sending twenty-one
  real messages. The stand-in must be named as one where it lives.
- **Honest states:** unbuilt capability is stated plainly ("planned,"
  "not live yet"), never simulated.
- **Compatibility goal:** owned by [BUILD_PLAN.md](./BUILD_PLAN.md).
  The full statement lives there, with the three rules that hold
  until the design session happens. It was briefly restated here and
  is not any more — two copies of a rule are two rules that can
  disagree.
