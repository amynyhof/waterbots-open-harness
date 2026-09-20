# bridget-map — map datasets (open)

**Version 0.1.1.** Bridget staffs Partners. Her tool is the map. Her knowledge
is the two datasets already on this site.

| Tool | What it is | Live homes |
|---|---|---|
| [hydrosheds-hydrobasins](./tools/hydrosheds-hydrobasins/) | Basin boundaries, Levels 4 and 6 | [`public/hydrobasins_lev04.json`](../../public/hydrobasins_lev04.json), [`public/hydrobasins_lev06.json`](../../public/hydrobasins_lev06.json), [`src/lib/licences.ts`](../../src/lib/licences.ts) |
| [wri-aqueduct-4.0](./tools/wri-aqueduct-4.0/) | Water stress | [`public/water_stress.json`](../../public/water_stress.json), [`src/lib/licences.ts`](../../src/lib/licences.ts) |

Chat is not live. The map is. Project points are planned and not yet placed.

Two datasets, two attributions. One combined line satisfies neither. Leaflet’s
attribution control stays on. Text only for WWF — no WWF logo.

**Level 6** water stress is WRI’s published figures. **Level 4** is an
area-weighted majority of its children and is labelled derived wherever it
renders.

## The contract

Every specialist keeps the nine lines of **the specialist contract** in
[AGENT_RULES.md](../../AGENT_RULES.md), the maintainer's ruling of 20 Sep 2026.
This table is where Bridget stands against it. Her chat is not built (item A12), so
the table is honest about that. Read as of 20 Sep 2026.

| # | Line | Today | Where it is met |
|---|---|---|---|
| 1 | Introduces itself | **No** | The "not answering here yet" line is the console's (`src/components/BridgetScreen.tsx`) |
| 2 | Knows its own tools | **No** | No prompt. This README names the map and its two datasets |
| 3 | Sees its tool's state | **No** | The pin is in the visit; no agent reads it |
| 4 | Walks the user through the tool by talking | **No** | No chat |
| 5 | Fills the tool from answers, and shows what it filled | **No** | The visitor pins by hand |
| 6 | Answers only from its own cards, with a citation | **No** | No rule cards; two cited datasets. What her cards are is a question for her brief |
| 7 | Knows its limits and its level here | **No** | No prompt. The console says honestly that she is not answering |
| 8 | Knows Wellington leads. Hands back | **No** | No chat. Wellington's stage line already points at the map |
| 9 | Posts official results to the project record | **Partly, by the tool** | The pin writes the place, source "pin", and the basin reading into her desk row and the seal |
