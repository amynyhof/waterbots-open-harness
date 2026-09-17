# Knowledge packs — open tree

**Version 0.1.0 (open).** Scaffold only. Nothing in this folder is wired into the live
site. The console still reads its cards, method packs, and map data from the paths
named below.

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

Every seat pack — not Calvin only — follows this shape:

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
| [product-shared/](./product-shared/) | Shared journey, roster, and open free pathway | none — by design |
| [wellington-host/](./wellington-host/) | Host and orchestrator stub | note: no named tools yet |
| [phoebe-eligibility/](./phoebe-eligibility/) | Eligibility and feasibility | `eligibility`, `feasibility` — more tools get their own folders later |
| [bridget-map/](./bridget-map/) | Map datasets already on open | `hydrosheds-hydrobasins`, `wri-aqueduct-4.0` |
| [calvin-quantify/](./calvin-quantify/) | Screening method packs | one folder per live `methodPacks` key, plus empty stubs for D-methods already named as not built |
| [reggie-library/](./reggie-library/) | Library seat stub — this site has no library seat yet | empty stubs, one package per standard already on open, to show the contract |

## What this tree does not hold

- Runtime wiring. The live site is unchanged.
- Source PDFs, long excerpts, or method arithmetic invented for a stub.
- Phoebe’s card bodies. Those stay in [`eligibility-cards-vwba.md`](../eligibility-cards-vwba.md)
  and [`feasibility-cards-vwba.md`](../feasibility-cards-vwba.md), read by
  [`src/lib/phoebeCards.ts`](../src/lib/phoebeCards.ts). Tools here **point** at them.
- Organisation, programme, or consortium folders.
- Kind in any URL. That rule is unchanged and lives on the receiver, not here.

## Citations

[CITATIONS.md](../CITATIONS.md) binds every cited line. A tool README names the
document, its version, and the publisher’s link. It does not paste the PDF.

Two datasets, two attributions — HydroSHEDS / HydroBASINS and WRI Aqueduct 4.0 —
stay separate. Derived values are labelled derived. Those rules live in
[CLAUDE.md](../CLAUDE.md) under Data licensing.

## Version

Tree **v0.1.0**. See [CHANGELOG.md](./CHANGELOG.md).
