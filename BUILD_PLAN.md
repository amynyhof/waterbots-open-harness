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

**The design ruling is being written — 26 Aug 2026.** The session this file has been waiting on has
an outcome. The direction: **this shell's design language largely prevails** — the light theme, the
left rail, and the "<" navigation — so little change is expected to arrive from the other side.

**It arrives as a design canon document, by the maintainer's hand, as rules-as-rules**, the same way
the process rules arrived. It is not here yet.

**Until it arrives, nothing changes.** The three rules below still hold exactly as written, and so
does rule zero: nothing is fetched, guessed at, or matched from the production side while we wait.

**Until the design canon arrives, three rules hold.**

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

## Just finished — Agents

**Phoebe's step 4 is live, and item A4 is closed.** Session of 25 Aug 2026, merged to `main` as
`a12bfc4` through pull request #2. Confirmed in a preview deployment by the maintainer before merge,
and confirmed against production after it — the checks are in
[SESSION_HANDOFF.md](./SESSION_HANDOFF.md) under *Verified live*.

**The daily cap is live (item O1).** Twenty messages per visitor per UTC day. A visitor is
identified by their network address scrambled with a server-held secret; no address is stored.
Only delivered answers count — anything that fails on our side is given back. At the cap the
visitor is told the limit, why it exists, and when it returns.

**It was taken out of order, and that was the maintainer's call.** The plan below had the empty
answer first and step 4 unqueued. Phoebe went live and public on 24 Aug with no cap at all, which
made the cap urgent in a way the ordering had not anticipated.

**Every abstention is now recorded (item A1)**, readable at a guarded address, holding the question
and no trace of who asked. The grading itself — which gaps become cards — is a maintainer job and is
where that item now sits.

**The empty answer turned out to be the token budget (item A4).** Hidden thinking was spending the
whole answer budget: the model thinks before it writes, that thinking is not shown, and it is
charged to the same budget as the reply. The relay never set the parameter, so it inherited the
default. Three faults in two days had one cause. Measured, fixed, and confirmed — the numbers are in
the item.

**One lesson worth carrying.** A default nobody wrote down is a decision nobody made. The relay's
own comment had already noticed 80–90% of the spend going somewhere invisible and had explained it
wrongly, which is how it survived two sessions.

## Just before that — Surfaces

**The shared chat layer (item S2) is built through Level 2** and passed the maintainer's browser
check on 24 Aug 2026: the contract between an agent and the layer, the chat shell, Phoebe's adapter,
and the numbered marker that sits inside a sentence and opens one line of citation.

**One defect was found and fixed along the way (item S4):** the console shell was throwing a chat
dock away whenever you left its surface, so a conversation vanished while the worksheet it had
filled in survived. Both docks now stay mounted and the off-surface one is hidden, the same
treatment the map already had.

**Two items were left open on purpose.** The citation line wraps poorly in the narrow dock (item S5)
— cosmetic, and worth doing properly alongside the map's legend rather than nudged on its own. And
the collective-action partner surface (item S1) needs the corporate goals and target geographies
(item D1, Data), which do not exist yet.

## Building next — the agent handoff primer

**One thing sits in the Agents family now: the agent handoff primer (item A3).**

[AGENT_RULES.md](./AGENT_RULES.md) publishes rung 2 of the abstention ladder as *partly live*, with
exactly one hard-coded handoff behind it: Phoebe may name Bridget and say Bridget covers the basin
map and the water-stress data. A published rule describing behaviour no agent has is a promise
outstanding, and the primer is what settles it.

**It is not blocked.** Final agent staffing (item A2) was settled on 24 Aug 2026 — Bridget on the
map, Phoebe on eligibility, two posts — so the roster the primer would be written against exists.
One thing limits its worked example: the funder locations it would point at are item D1, and they do
not exist yet.

**There is also now a first piece of real evidence to work from.** The abstention log records what
people actually ask Phoebe that she cannot answer. Some of those gaps will be another agent's
subject rather than a missing card, which is exactly what a handoff primer is for. Reading the log
before writing the primer is the cheaper order.

## Not next, and why

| Family | Why it waits |
|---|---|
| **Knowledge** | Large and unbounded until the full-docs card pass (item K1) reports what card sets are actually needed. Doing it in the wrong order means writing cards nobody asked for. |
| **Surfaces** | The bridge (item S7) was ruled on 26 Aug 2026 but has no proposal — the shape of the handoff is coordinated by the maintainer's hand. The rest of the family is polish (item S5) or waits on data that does not exist yet (item S1). |
| **Data** | Blocked on material the maintainer supplies — registry coordinates for the project points (item D2), public disclosures for corporate goals and target geographies (item D1). Not work that can start from inside the repository. |
| **Operations** | **One small thing is now buildable and waiting on a ruling: the card gate reports stale cards that are not stale on a Windows checkout (item O6), for line-ending reasons.** Two fixes are written up in that item; neither is built. It is minutes of work and it does not compete with the primer for position — it is small enough to take whenever it is ruled on. Otherwise: branch protection on `main` was restored on 24 Aug 2026 (item O2) and work now goes through a pull request. The daily cap (item O1) shipped on 25 Aug; what remains of that item is revisiting the number once there is real usage to reason from, which is not yet. |
