# PROCESS_RULES_for_ShellB.md — How work is run in this repo

Extracted from main-platform working canon (2026-08-23) for use on the
open site. Rules travel as rules; no private-platform files, names, or
paths appear here. The maintainer is Amy. The engineer is whoever is
reading this.

## How a session opens

Read five documents before doing anything else, every new session:
[CLAUDE.md](./CLAUDE.md), **this file**, [BUILD_PLAN.md](./BUILD_PLAN.md),
[OPEN_ITEMS.md](./OPEN_ITEMS.md), [SESSION_HANDOFF.md](./SESSION_HANDOFF.md).
The session has not started until all five are read.

**This list is the one home for the opening ritual.** It said four for as long as it existed,
leaving itself off its own list, while [CLAUDE.md](./CLAUDE.md) said five and named this file
among them. Corrected 27 Aug 2026 on the maintainer's ruling: five is right, and CLAUDE.md
points here rather than carrying a second copy of the count.

## How work moves

Every piece of work follows one sequence, no skipped steps:

1. **Proposal** — the engineer says what it will do and why.
2. **Approval** — Amy says go. No go, no build.
3. **Build** — the engineer builds exactly what was approved.
4. **Eyeball** — Amy checks it in the browser herself.
5. **Commit word** — Amy says commit. Nothing is done until she does.

One topic at a time. One step per exchange where possible.

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

#### Every description opens with a block for the maintainer

**Maintainer's ruling, 27 Aug 2026.** Every pull request description begins with a block
titled **"For Amy"** — three short parts, plain English at about a 6th-grade level, no
jargon:

1. **What changed** — the files, named, and what each one does in plain words.
2. **What I approved** — the ruling from the conversation that this delivers, in the
   maintainer's own words.
3. **What to check** — what the "Files changed" tab should say, and anything to eyeball.

**Any term a non-engineer would not know gets one plain-English line of explanation.**

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

## Open items and families

- Every open item belongs to a family. A new item joins a family or
  starts one; starting one is a maintainer decision, recorded with
  its reason.
- If an item seems to fit nowhere, the families are wrong — not the
  item.
- Global fixes over patchwork. Work is grouped and built by family,
  not picked off one row at a time.
- Shortcuts are taken only under real pressure, named as shortcuts,
  and logged as debt. Debt is recorded, never quietly kept.

## How a session closes

**The close-out is one complete act.** Maintainer's ruling, 26 Aug 2026: the ritual below
includes every step, every time. **A ritual with a skipped step is an unfinished ritual.**

1. Refresh the root docs so they tell the truth: BUILD_PLAN.md,
   OPEN_ITEMS.md, CLAUDE.md, SESSION_HANDOFF.md, and any rulebook
   touched this session.
2. SESSION_HANDOFF.md is rewritten so a cold reader can resume:
   where we are, what is committed vs. uncommitted, what is waiting
   on Amy, what comes next.
3. Commit the checkpoint.
4. **Then** regenerate the export copies, where the repository keeps them.
   In this repository that is the `exports/` folder — the maintainer's
   copies of the root documents, which she carries elsewhere by hand.
   It is gitignored, so nothing here refreshes it and no check notices
   when it is stale. That is why it is a named step.
5. Confirm `main` is equal to `origin`.

**The copies are made after the final commit, not before it**, so they carry the close-out
itself rather than the state just before it. Maintainer's ruling, 27 Aug 2026 — see item O8 in
[OPEN_ITEMS.md](./OPEN_ITEMS.md) for why the order matters. Regenerating first was how the
copies fell a session behind on 26 Aug.

The library is never more than one session stale.

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
