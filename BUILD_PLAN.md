# BUILD_PLAN.md — what is being built, and why

Which family of work is being built now, which comes next, and what each one is
waiting on. **This file commits to an order, not to dates.**

Read it with [OPEN_ITEMS.md](./OPEN_ITEMS.md), which holds the items themselves
and the north star they lead toward, and with
[PROCESS_RULES_for_ShellB.md](./PROCESS_RULES_for_ShellB.md), which says how work
moves from a proposal to a commit.

**This file is rewritten whenever the plan changes**, and refreshed at every
session close, so it never describes a plan we have already left behind.

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

**Until that session happens, three rules hold.**

1. **Build to this repository's own rules.** [CLAUDE.md](./CLAUDE.md),
   [AGENT_RULES.md](./AGENT_RULES.md), [CITATIONS.md](./CITATIONS.md) and
   BRAND.md are what binds today. The compatibility goal is a direction, not a
   specification, and it does not override any of them.
2. **Flag drift as an open item, in its family.** Where something built here
   looks likely to diverge from the production console, log it where that work
   lives rather than resolving it quietly in either direction. The design session
   needs the list.
3. **Never copy from, fetch from, or match the production site unaided.** Not its
   files, not its shapes, not its wording, and not by inference from memory. This
   is rule zero in CLAUDE.md and the wall in CITATIONS.md, applied to design.
   **A compatibility goal is not permission to go and look** — rules travel as
   rules, and they travel by the maintainer's hand.

---

## Just finished — Surfaces

**The shared chat layer (item S2) is built through Level 2** and passed the
maintainer's browser check on 24 Aug 2026: the contract between an agent and the
layer, the chat shell, Phoebe's adapter, and the numbered marker that sits inside
a sentence and opens one line of citation.

It was taken first because it was half-landed in the working tree. Half-landed
work is the only kind that costs more the longer it waits — a second agent built
against an unfinished contract would inherit the gap.

**One defect was found and fixed along the way (item S4):** the console shell was
throwing a chat dock away whenever you left its surface, so a conversation
vanished while the worksheet it had filled in survived. Both docks now stay
mounted and the off-surface one is hidden, the same treatment the map already
had.

**Two items were left open on purpose.** The citation line wraps poorly in the
narrow dock (item S5) — cosmetic, and worth doing properly alongside the map's
legend rather than nudged on its own. And the collective-action partner surface
(item S1) needs the corporate goals and target geographies (item D1, Data), which
do not exist yet.

**Nothing in Surfaces is the natural next step**, which is why the plan moves on.

## Building next — Agents

**Two things sit in this family now, and the order between them matters. A third
is unqueued and larger — see below.**

**First, the empty answer (item A4).** Phoebe returned an answer with nothing in
it once, on 23 Aug 2026, and the reader was shown a message that misdescribes
what happened. It is small, it is unexplained, and an unexplained failure in the
answer path should not be left underneath new agent work.

**Then, the agent handoff primer (item A3).**
[AGENT_RULES.md](./AGENT_RULES.md) publishes rung 2 of the abstention ladder as
*partly live*, with exactly one hard-coded handoff behind it: Phoebe may name
Bridget and say Bridget covers the basin map and the water-stress data. A
published rule describing behaviour no agent has is a promise outstanding, and
the primer is what settles it.

**Not queued, and bigger than both:** Phoebe's step 4 — abstention logging and
the rate limit — was never built. Every abstention should be recorded so it can
be graded into a new card (item A1), and the public chat has **no cap at all**
today. Both need shared storage, which the maintainer provisions rather than the
repository. This is the largest unbuilt piece of the agent work and it sits in
neither queue.

**The primer is no longer blocked.** Final agent staffing (item A2) was settled
on 24 Aug 2026 — Bridget on the map, Phoebe on eligibility, two posts — so the
roster the primer would be written against now exists. Neither of these two items
is waiting on anything.

## Not next, and why

| Family | Why it waits |
|---|---|
| **Knowledge** | Large and unbounded until the full-docs card pass (item K1) reports what card sets are actually needed. Doing it in the wrong order means writing cards nobody asked for. |
| **Data** | Blocked on material the maintainer supplies — registry coordinates for the project points (item D2), public disclosures for corporate goals and target geographies (item D1). Not work that can start from inside the repository. |
| **Operations** | Nothing to build. **Restoring branch protection on `main` (item O2) is now due** — it was set for after this week's push, week ending Sunday 23 Aug 2026, which has passed. It is a live GitHub setting, not a repository file, so the maintainer makes the change by hand once this session's commits land. |
