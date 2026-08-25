# PROCESS_RULES_for_ShellB.md — How work is run in this repo

Extracted from main-platform working canon (2026-08-23) for use on the
open site. Rules travel as rules; no private-platform files, names, or
paths appear here. The maintainer is Amy. The engineer is whoever is
reading this.

## How a session opens

Read four files before doing anything else, every new session:
[CLAUDE.md](./CLAUDE.md), [BUILD_PLAN.md](./BUILD_PLAN.md),
[OPEN_ITEMS.md](./OPEN_ITEMS.md), [SESSION_HANDOFF.md](./SESSION_HANDOFF.md).
The session has not started until all four are read.

## How work moves

Every piece of work follows one sequence, no skipped steps:

1. **Proposal** — the engineer says what it will do and why.
2. **Approval** — Amy says go. No go, no build.
3. **Build** — the engineer builds exactly what was approved.
4. **Eyeball** — Amy checks it in the browser herself.
5. **Commit word** — Amy says commit. Nothing is done until she does.

One topic at a time. One step per exchange where possible.

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

Before the final commit of a session:

1. Refresh the root docs so they tell the truth: BUILD_PLAN.md,
   OPEN_ITEMS.md, CLAUDE.md, SESSION_HANDOFF.md, and any rulebook
   touched this session.
2. SESSION_HANDOFF.md is rewritten so a cold reader can resume:
   where we are, what is committed vs. uncommitted, what is waiting
   on Amy, what comes next.
3. The library is never more than one session stale.

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
