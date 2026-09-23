# tool — the carbon section of the eligibility worksheet

**No code lives here, and nothing reads this page yet.** It names the tool this pack will
fill and where that tool will read from, once built.

- **The tool** is the eligibility worksheet on the Tool tab of Phoebe's screen, the same
  one tool the water pack names. By the maintainer's ruling of 22 Sep 2026 (R3) the
  worksheet holds **one section per pack**, each with a pathway state above its rows:
  Not yet checked, Applies, or Does not apply with the cited reason. This pack fills the
  carbon section. Rows keep the three states they have today.
- **Which rows open** is decided by the applies cards: the technology class and the
  version set which of the 32 rows a project is asked about. A household filter project
  never hears about boreholes.
- **The live reader-to-be** is [`src/lib/phoebeCards.ts`](../../../../src/lib/phoebeCards.ts),
  pack-keyed at proposal step 5. Today it reads the water pack's two files and nothing
  else.
- **The build gate-to-be** is [`scripts/check-cards.mjs`](../../../../scripts/check-cards.mjs),
  which will re-derive this pack's sets a second way at step 5. Today it names the water
  pack's files only.
- **Her relay** will read this pack through
  [`scripts/build-prompt-modules.mjs`](../../../../scripts/build-prompt-modules.mjs) at
  step 5, under the same staleness gate.

## What Phoebe will be told about this section

An agent-facing region, between markers the generator recognises, arrives at proposal
step 8 and not before: the carbon section, its rows, what each takes, where its value
comes from, and the rule the maintainer gave on 22 Sep 2026 (R4) that questions are
written to cover both pathways whenever one answer can, that a verdict covers every row
the answer settles, and that when a pathway drops out she says so and continues with the
other. **There is no such region on this page today**, so nothing here reaches her prompt.
