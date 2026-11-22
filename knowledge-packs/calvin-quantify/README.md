# calvin-quantify — screening method packs (open)

**Version 0.2.1.** Calvin staffs Quantify. One tool per way of working a number
out. The live registry is [`src/lib/methodPacks.ts`](../../src/lib/methodPacks.ts).
This pack is not wired. Folder names for live tools match that registry’s keys.

**Carbon is the open core's calculator from 14 Nov 2026**: `@waterbots/calvin` 0.3.0 from 16 Nov
2026 (0.2.0 before), engine gs4gg-carbon 0.19.0, from the release `calvin-v0.3.0`, locked to ex-ante,
and every project gets its V2.0-only view until item A29 passes `creditedUnderV1`. The two `gs-sdws-*`
folders below describe this site's own carbon screening, which is no longer registered; they
retire with `src/lib/gsSdws.ts`.

Everything a pack produces is a **screening estimate** — anticipated, never
delivered, never verified — and carries a consultant-review tag wherever it
renders. A blank figure is never read as zero.

Chat is not live. The calculator is.

## Live tools (registry keys)

| Tool id | Live module |
|---|---|
| [vwba-2.0-d3-volume-provided](./tools/vwba-2.0-d3-volume-provided/) | `@waterbots/violet` 0.5.0, Violet's D-3, from the open core |
| Carbon, V1.0 and V2.0 | `@waterbots/calvin` 0.5.0, from the open core |
| ~~[gs-sdws-legacy-v1](./tools/gs-sdws-legacy-v1/)~~ | ~~[`src/lib/gsSdws.ts`](../../src/lib/gsSdws.ts)~~ not registered from 14 Nov 2026 |
| ~~[gs-sdws-paa-v2](./tools/gs-sdws-paa-v2/)~~ | ~~same module, second variant~~ not registered from 14 Nov 2026 |

## Empty stubs (named on open, not built)

The live D-3 pack already names two other VWBA methods as the ones that fit
instead, and refuses to give a number from D-3 for those projects. The folders
exist so the contract is visible. They hold **no arithmetic**.

| Tool id | Why it sits here |
|---|---|
| [vwba-2.0-d4](./tools/vwba-2.0-d4/) | Putting water back into the ground — named on the live D-3 pack as method D-4. Not built. |
| [vwba-2.0-d6](./tools/vwba-2.0-d6/) | Sanitation — named on the live D-3 pack as method D-6. Not built. |

Further D-methods and further carbon methods each get their own folder when they
go live. No method is invented here. No irrigation table, no metered option, and
no extra carbon method is given a folder until this site has one.

The two Gold Standard folders above **are** the carbon that is live. They are
not stubs.

## The contract

Every specialist keeps the ten lines of **the specialist contract** in
[AGENT_RULES.md](../../AGENT_RULES.md), the maintainer's ruling of 20 Sep 2026.
This table is where Calvin stands against it. His chat is not built (item A12), so
the table is honest about that. Read as of 20 Sep 2026.

| # | Line | Today | Where it is met |
|---|---|---|---|
| 1 | Introduces itself | **No** | The "not answering here yet" line is the console's (`src/components/CalvinScreen.tsx`) |
| 2 | Knows its own tools | **No** | No prompt. This README names the three live packs and two stubs |
| 3 | Sees its tool's state | **No** | Each pack's answers are in the visit; no agent reads them |
| 4 | Walks the user through the tool by talking | **No** | No chat |
| 5 | Fills the tool from answers, and shows what it filled | **No** | The visitor types the fields |
| 6 | Answers only from its own cards, with a citation | **No** | No rule cards; each pack carries one citation. Item K7 is the carbon card pass, logged debt |
| 7 | Knows its limits and its level here | **No** | No prompt. Every figure already reads "screening, not verified" on the worksheet |
| 8 | Knows Wellington leads. Hands back | **No** | No chat |
| 9 | Posts official results to the project record | **Partly, by the tool** | A pack's answers and its status word reach the desk row and the seal, never a figure |
| 10 | Knows what its tool needs, the kind of value each input takes and where it comes from; checks the project context first; says where each value came from | **No — the tool holds most of it** | Every pack field carries its label, one-line help, a longer why, its kind (yes or no, a choice, a number) and its unit in the registry (`src/lib/methodPacks.ts`); no agent reads them, and the packs do not read the record |
