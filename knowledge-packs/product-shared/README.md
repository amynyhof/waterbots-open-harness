# product-shared — journey, roster, pathway (open)

**Version 0.6.0.** Shared facts for the open free pathway. No tools folder — this
pack is not a seat with tools.

**The project-type list lives here from 23 Sep 2026**, at
[`project-types.md`](./project-types.md): twenty-five lines, the VWBA guidebook's
twenty activity types, Gold Standard's four safe-water technology classes, and
"none of these", each with one plain sentence and its citation. Approved by the
maintainer on 23 Sep 2026. It is the list Wellington will match a visitor's project
to, confirm in plain words and log on a yes (item A16), and the ids Phoebe's
applies cards read. **It follows the roster rule:** drafted here, carried by her
hand to the paid repository, which becomes its source, and never edited here after
that; a build-time check then holds this site to it. Nothing reads it yet.

**The roster lives here from 18 Sep 2026**, at [`roster.yaml`](./roster.yaml): the
one crew list for both sites, ten seats and three doors, carried whole from
production by the maintainer's hand and **never edited on this site**. It is
replaced byte for byte when she carries a new version. `scripts/check-roster.mjs`
reads it in front of every build and fails the build, naming the line, when this
site's crew file, Commons shelf, primer or Wellington's prompt disagree with it.
Item A13.

~~Nothing here is wired.~~ **Corrected 17 Sep 2026:** the agent primer lives here and
is wired. The live lists stay in code:

| What | Live home |
|---|---|
| The agent primer — who covers what, inherited by Phoebe's and Wellington's prompts | [`agent-primer.md`](./agent-primer.md), here, from 17 Sep 2026; read by `scripts/build-prompt-modules.mjs` and `scripts/check-wellington.mjs` |
| Six phase names | [`src/lib/journey.ts`](../../src/lib/journey.ts) |
| Desk label “Dispatches” | [`src/lib/surfaces.ts`](../../src/lib/surfaces.ts) |
| The crew — every seat, every door | [`roster.yaml`](./roster.yaml), here, from 18 Sep 2026; checked by `scripts/check-roster.mjs` on every build |
| The project types — twenty-four cited types and "none of these" | [`project-types.md`](./project-types.md), here, from 23 Sep 2026; read from 24 Sep 2026 by `scripts/build-prompt-modules.mjs` into Wellington's prompt (short form), his relay's closed lists and the rail |
| ~~Four agents~~ **The seats built on this site's screens** — portrait, colour, which screen opens | [`src/lib/crew.ts`](../../src/lib/crew.ts), checked against the roster, never a second list of it. **Amended 18 Sep 2026.** |

## Pathway (open, free)

A **pathway** is the road of phases a visit walks. On this site it is:

1. **Dispatches** — Wellington’s desk. Not a phase. The visit starts here.
2. **Eligibility** — Phoebe. Live.
3. **Partners** — Bridget’s map. Live.
4. **Quantify** — Calvin. Live.
5. **Plan** — named, gated. Opens with a saved project.
6. **Monitor** — named, gated.
7. **Communicate** — named, gated.

The first three phases after the desk are this site’s tools. The last three belong
to the paid platform and are never clickable here. Naming them is allowed and is
not a claim that they run on this site.

There is no organisation, programme, or consortium layer on this rail.

## Roster (open)

**The roster is [`roster.yaml`](./roster.yaml), and nothing else repeats it.** It
carries every seat, what each one does, and how much it may do at each door. The
seats built on this site today are the ones in `src/lib/crew.ts`, and the check
holds that file to the roster. **Struck 18 Sep 2026** — one home; the table below
was a second copy and had already drifted from the roster on Bridget's label:

~~Four agents, four posts:~~

~~| Agent | Role | Step |~~
~~|---|---|---|~~
~~| Wellington | Team Lead | Dispatches |~~
~~| Phoebe | Eligibility | Eligibility |~~
~~| Bridget | Map | Partners |~~
~~| Calvin | Calculator | Quantify |~~

~~Calvin works on this open site as well as on the Commons. He never works in the
paid console. Wellington and Bridget are the shared crew; Phoebe and Calvin extend
it.~~

~~Reggie is not on this roster. A stub pack exists so the library contract is
visible; this site has no library seat.~~ **Corrected 18 Sep 2026:** Reggie is on
the roster, at the Library seat, level "meet" at the free door and on the Commons,
"unconfirmed" until the maintainer confirms it at the source. Nothing is built for
him here; the stub pack shows the library contract and the check prints his absence.

## What this pack is not

- Not a tool.
- Not a method.
- Not a paste of a private journey that includes tenancy.
