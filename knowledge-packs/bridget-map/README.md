# bridget-map — map datasets (open)

**Version 0.1.2.** Bridget staffs Partners. Her tool is the map. Her knowledge
is the two datasets already on this site.

| Tool | What it is | Live homes |
|---|---|---|
| [hydrosheds-hydrobasins](./tools/hydrosheds-hydrobasins/) | Basin boundaries, Levels 4 and 6 | [`public/hydrobasins_lev04.json`](../../public/hydrobasins_lev04.json), [`public/hydrobasins_lev06.json`](../../public/hydrobasins_lev06.json), [`src/lib/licences.ts`](../../src/lib/licences.ts) |
| [wri-aqueduct-4.0](./tools/wri-aqueduct-4.0/) | Water stress | [`public/water_stress.json`](../../public/water_stress.json), [`src/lib/licences.ts`](../../src/lib/licences.ts) |

Her chat is live beside the map from 31 Oct 2026: she says what she does and why the
basin matters, asks for the pin, and says the water stress where it landed. Project points are planned and not yet placed.

Two datasets, two attributions. One combined line satisfies neither. Leaflet’s
attribution control stays on. Text only for WWF — no WWF logo.

**Level 6** water stress is WRI’s published figures. **Level 4** is an
area-weighted majority of its children and is labelled derived wherever it
renders.

## The contract

Every specialist keeps the ten lines of **the specialist contract** in
[AGENT_RULES.md](../../AGENT_RULES.md), the maintainer's ruling of 20 Sep 2026.
This table is where Bridget stands against it. Her chat went live on the maintainer's
two rulings of 31 Oct 2026 (item A22), doing one thing: the pin. Read as of 31 Oct 2026.

| # | Line | Today | Where it is met |
|---|---|---|---|
| 1 | Introduces itself | **Yes** | In her own words, the first time her chat shows: who she is, what she does, why the basin matters to funders and partners, and that she is still being built. The meaning of the last is the maintainer's (`BRIDGET_STILL_BUILT`, `api/_bridgetPrompt.ts`); `check-wellington` holds the five beats and their order |
| 2 | Knows its own tools | **Partly** | Her prompt knows the map and what it shows, and each pin says whether its reading is WRI's or derived. It does not carry the two dataset folders named here |
| 3 | Sees its tool's state | **Yes** | The place the visitor told Wellington, phone or computer, the pin as the map read it, and whether the right rail offers Quantify ride with every ask, checked in `api/_bridgetPin.ts` |
| 4 | Walks the user through the tool by talking | **Yes, one question** | She says why the pin matters, then asks for it, in the place's own words, and nothing else |
| 5 | Fills the tool from answers, and shows what it filled | **No** | The visitor pins by hand; she says back what the pin holds |
| 6 | Answers only from its own cards, with a citation | **No** | No rule cards. She answers only from the pin and her prompt, and cites nothing. What her cards are is a question for her brief |
| 7 | Knows its limits and its level here | **Yes** | Her prompt says what she does today and what is coming, and carries the level sentence `check-roster` holds to the roster |
| 8 | Knows Wellington leads. Hands back | **Yes** | After the pin, where the right rail offers Quantify, she says Calvin is next, by its button. No button of her own, except the 'Back to Wellington' link when no pathway goes on to Quantify, the same hand-back Phoebe uses. The console draws that link from the `handBack` field, "Back to Wellington on Dispatches", as it does for Phoebe. The relay holds the field to which (`settleHandBack`, `api/_bridgetPin.ts`); the pin moves the visit on (`pinnedVisit`, `src/lib/visit.ts`) |
| 9 | Posts official results to the project record | **Partly, by the tool** | The pin writes the place, source "pin", and the basin reading into her desk row and the seal |
| 10 | Knows what its tool needs, the kind of value each input takes and where it comes from; checks the project context first; says where each value came from | **Partly** | The map takes one input, a click or a tap on a basin. She reads the place Wellington heard before she asks, and says whether a reading is published or derived |
