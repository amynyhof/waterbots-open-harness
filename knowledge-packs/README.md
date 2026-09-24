# Knowledge packs — open tree

**Version 0.17.0 (open); the history is in [CHANGELOG.md](./CHANGELOG.md).** ~~Scaffold only. Nothing in this folder is wired into the live
site.~~ **Corrected 17 Sep 2026:** Phoebe's pack is wired. The live site reads her two
card sets from [`phoebe-eligibility/vwba-2.0/cards/`](./phoebe-eligibility/vwba-2.0/cards/).
The other packs are still scaffold; the console reads their method packs and map data
from the paths named below. **From 17 Sep 2026 the agent primer lives in
[`product-shared/`](./product-shared/agent-primer.md)** and Phoebe's and Wellington's prompts
are generated from it there.

This tree is the public-safe folder shape for what each agent works from. Folder
**names** and stub **shapes** match the standing pack contract. The copy here is
rewritten for the open rail. It is not a paste of any private tree.

## What this rail is

**Open only.** The free pathway on this site: Dispatches (the desk), then Eligibility,
Partners, Quantify. Plan, Monitor, and Communicate are named on the journey bar and
stay gated here. There is no organisation, programme, or consortium layer in this
tree.

A **pathway** is that road of phases. That is the word this tree uses.

## Standing pack shape

**The rule going forward, maintainer's ruling of 17 Sep 2026.** A pack is one folder
per standard, and inside it:

```
<seat-pack>/
  README.md                 — the seat, pointing at its packs
  CHANGELOG.md              — the seat's own semver, citing <pack>@version
  <standard>/               — one pack, e.g. vwba-2.0/
    cards/                  — the card files the live site reads
    tool/                   — README naming the checklist and its live reader; no code
    evals/                  — README; says plainly when no exam has been sat
    README.md               — what the agent knows, helps with, does not cover
    CHANGELOG.md            — the pack's own semver
```

**Phoebe's pack is the first in it.** The other packs move one at a time, each on its
own brief, and stay as they are until then.

**Every seat pack README carries a section "The contract"**, from 20 Sep 2026: one line
pointing at the specialist contract in [AGENT_RULES.md](../AGENT_RULES.md), and a ten-row
table saying where that agent stands against it today. The contract has one home, the
rulebook; the table is the per-agent state and lives on the pack.

~~Every seat pack — not Calvin only — follows this shape:~~ **Struck 17 Sep 2026.** The
shape below is the old one. It still describes every pack but Phoebe's:

```
<seat-pack>/
  README.md
  CHANGELOG.md
  tools/                    — required whenever the seat will have tools
    <tool-id>/
      README.md             — one tool; cited document name, version, and link only
      CHANGELOG.md          — that tool’s own semver
```

The seat `CHANGELOG.md` cites `tool-id@version` when a tool changes.

`product-shared/` has **no** `tools/` folder. It holds the shared journey, roster, and
pathway only.

An empty `tools/` with a README note is allowed only when the seat truly has no tools
yet. That is Wellington today.

## Folder map

| Pack | What it is | `tools/` |
|---|---|---|
| [product-shared/](./product-shared/) | Shared journey, open free pathway, **the roster — `roster.yaml`, carried from production, checked at every build from 18 Sep 2026** — and **the project-type list, `project-types.md`, approved 23 Sep 2026, on the same rule** | none — by design |
| [wellington-host/](./wellington-host/) | Host and orchestrator stub | note: no named tools yet |
| [phoebe-eligibility/](./phoebe-eligibility/) | Eligibility and feasibility — **the cards' home, new shape** | none — [`vwba-2.0/`](./phoebe-eligibility/vwba-2.0/) holds `cards`, `tool`, `evals`; [`gs-paa-v2.0/`](./phoebe-eligibility/gs-paa-v2.0/) sits beside it from 22 Sep 2026, a scaffold, not live |
| [bridget-map/](./bridget-map/) | Map datasets already on open | `hydrosheds-hydrobasins`, `wri-aqueduct-4.0` |
| [calvin-quantify/](./calvin-quantify/) | Screening method packs | one folder per live `methodPacks` key, plus empty stubs for D-methods already named as not built |
| [reggie-library/](./reggie-library/) | Library seat stub — this site has no library seat yet | empty stubs, one package per standard already on open, to show the contract |

## What this tree does not hold

- Runtime wiring. The live site is unchanged.
- Source PDFs, long excerpts, or method arithmetic invented for a stub.
- ~~Phoebe’s card bodies. Those stay in `eligibility-cards-vwba.md` and
  `feasibility-cards-vwba.md` at the repository root, read by
  `src/lib/phoebeCards.ts`. Tools here **point** at them.~~ **Corrected 17 Sep 2026:**
  Phoebe's card bodies live here, in
  [`phoebe-eligibility/vwba-2.0/cards/`](./phoebe-eligibility/vwba-2.0/cards/), and
  [`src/lib/phoebeCards.ts`](../src/lib/phoebeCards.ts) reads them from here. The pack
  is the home, by the maintainer's ruling.
- Organisation, programme, or consortium folders.
- Kind in any URL. That rule is unchanged and lives on the receiver, not here.

## Citations

[CITATIONS.md](../CITATIONS.md) binds every cited line. A tool README names the
document, its version, and the publisher’s link. It does not paste the PDF.

Two datasets, two attributions — HydroSHEDS / HydroBASINS and WRI Aqueduct 4.0 —
stay separate. Derived values are labelled derived. Those rules live in
[CLAUDE.md](../CLAUDE.md) under Data licensing.

## Version

See [CHANGELOG.md](./CHANGELOG.md) for the tree's full version history. Corrected 23 Sep 2026:
this line used to restate the version number here too, and had drifted stale (it read "Tree
v0.5.1" against a head that already said 0.11.0); the old wording is kept in the tree's own
[CHANGELOG.md](./CHANGELOG.md). One number, stated once, at the top of this page.
