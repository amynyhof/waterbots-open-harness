# tool — the carbon section of the eligibility worksheet

**No code lives here.** This page names the tool this pack fills and where that tool reads from.

- **The tool is defined in [`eligibility-worksheet.yaml`](./eligibility-worksheet.yaml)**, beside
  this page: the rows, their states, what each takes, where a value comes from, which class or
  version each row exists for, and each row's citations by card id. From 25 Sep 2026 the runtime
  reads it — the worksheet on screen, Phoebe's prompt, and the checks all come from that one file.
- **One tool, one section per pack.** By the maintainer's ruling of 22 Sep 2026 (R3) the eligibility
  worksheet holds one section per pack, each with a pathway state above its rows: Not yet checked,
  Applies, or Does not apply with the cited reason. This pack fills the carbon section; the water
  pack fills the other.
- **Which rows open** is decided by the applies cards: the technology class and the version set
  which of the 32 rows a project is asked about. A household filter project never hears about
  boreholes.
- **The live reader** is [`src/lib/worksheet.generated.ts`](../../../../src/lib/worksheet.generated.ts)
  and its twin under `api/`, both written from the tool files by
  [`scripts/build-worksheet-module.mjs`](../../../../scripts/build-worksheet-module.mjs) under a
  staleness gate, so the console and the relay cannot hold different rows.
- **The build gates** are [`scripts/check-tool.mjs`](../../../../scripts/check-tool.mjs), which holds
  every row to the card it cites, and [`scripts/check-phoebe.mjs`](../../../../scripts/check-phoebe.mjs),
  which holds the runtime to the tool files.
- **Her relay reads this pack's cards** through
  [`scripts/build-prompt-modules.mjs`](../../../../scripts/build-prompt-modules.mjs), staged: the
  applies cards at the door, the rest once this pathway applies, never when it does not.

## What Phoebe is told about this section

**It is generated from the tool file**, not written here. There is no agent-facing region on this
page and there never was one: the region on the water pack's page retired on 25 Sep 2026, by the
maintainer's ruling R1 of that day, so that a tool is defined once in one file in its pack.

**Nothing on this page reaches her prompt.** It is for people.
