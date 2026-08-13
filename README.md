# WaterBots Open Harness

An interactive world map of HydroSHEDS watershed basins, coloured by water stress, with a small set
of real water project locations — and the foundation of an AI chat console in the WaterBots style.

It deploys standalone and is linked from [waterbots.ai](https://waterbots.ai).

> **Status: in development.** Scaffolding and design tokens only. The map, the basin data and the
> chat console are not built yet. Nothing on the current page is product UI.

## Running locally

```bash
npm install
npm run dev
```

The dev server runs on **port 5173** (pinned, `strictPort`).

## Licence

The **source code** in this repository is licensed under the Apache License 2.0 — see
[LICENSE](./LICENSE).

**The data is licensed separately, and not under Apache 2.0.** Two datasets are used, under two
different licences, each with its own attribution requirement. Both attributions are displayed in
the product; neither is satisfied by a combined credit line.

---

### HydroSHEDS / HydroBASINS — basin boundaries

HydroBASINS is distributed under the HydroSHEDS License Agreement — a custom World Wildlife Fund
licence, **not** a Creative Commons licence. It is free for non-commercial and commercial use,
subject to the terms of that agreement.

The following copyright statement is required by Exhibit B of the License Agreement and is
reproduced verbatim, with this product's name filled in:

> This product **WaterBots Open Harness** incorporates data from the HydroSHEDS version 1 database
> which is © World Wildlife Fund, Inc. (2006-2022) and has been used herein under license. WWF has
> not evaluated the data as altered and incorporated within **WaterBots Open Harness**, and
> therefore gives no warranty regarding its accuracy, completeness, currency or suitability for any
> particular purpose. Portions of the HydroSHEDS v1 database incorporate data which are the
> intellectual property rights of © USGS (2006-2008), NASA (2000-2005), ESRI (1992-1998), CIAT
> (2004-2006), UNEP-WCMC (1993), WWF (2004), Commonwealth of Australia (2007), and Her Royal Majesty
> and the British Crown and are used under license. The HydroSHEDS v1 database and more information
> are available at https://www.hydrosheds.org.

Attribution is **text only**. No WWF logo, trademark, trade name or service mark is used anywhere in
this product.

**Scientific citations:**

- Lehner, B., Grill G. (2013): Global river hydrography and network routing: baseline data and new
  approaches to study the world's large river systems. _Hydrological Processes_, 27(15): 2171–2186.
  Data is available at www.hydrosheds.org.
- Lehner, B., Verdin, K., Jarvis, A. (2008): New global hydrography derived from spaceborne
  elevation data. _Eos, Transactions, AGU_, 89(10): 93-94.

---

### WRI Aqueduct 4.0 — water stress

Water stress data is from WRI Aqueduct 4.0, © World Resources Institute, licensed under the
[Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

**Suggested citation**, as published by WRI:

> Kuzma, S., M.F.P. Bierkens, S. Lakshman, T. Luo, L. Saccoccia, E. H. Sutanudjaja, and R. Van Beek.
> 2023. "Aqueduct 4.0: Updated decision-relevant global water risk indicators." Technical Note.
> Washington, DC: World Resources Institute. Available online at: doi.org/10.46830/writn.23.00061.

**Derived, not as-published.** Aqueduct 4.0 publishes water stress for HydroSHEDS **Level 6** basins.
This product renders **Level 3** basins, so stress values are aggregated upward by area-weighted
mean and re-binned to Aqueduct's published category thresholds. WRI does not publish a Level 3 water
stress score — the aggregation is ours, and is labelled as such wherever it renders. `No Data` and
`Arid and Low Water Use` are carried through as their own categories and are never averaged into a
stress level.

---

### Basemap

Map tiles carry their own attribution, displayed in the map's attribution control alongside the
above. Leaflet's attribution control is always enabled.

## Theme

v1 renders on **Frost**, the light theme. The map is a public surface with no login, and BRAND.md's
surface rule puts public and orientation surfaces on light. The Deep Marine tokens are retained in
`src/styles/tokens.css` as correct reference but no v1 component applies them.

Note that Frost has no four-surface ladder: BRAND.md publishes `--card` and `--raised` as the same
white, and authors the ladder for Deep Marine only. On Frost, separation is carried by the 1px
`--line` border rather than by fill.

## Open brand questions

Values deliberately left undefined rather than guessed:

- **`--chrome` on Frost** — BRAND.md's `--chrome` token and its "chrome recedes" rule exist only in
  the Deep Marine block. Frost has no published navigation surface. It currently aliases `--paper`
  with a `--line` rule for separation. A real value is needed before the left rail and chat dock are
  built.
- **Bridget's identity colour** — the roster assigns her Surf, but Surf carries no agent identity in
  this repo, so she is the only crew member without one on Frost. She is also the placeholder chat
  host. Needed before the console shell.
- **Stress ramp intermediates** — BRAND.md publishes no tint or sequential ramps. The two
  intermediate stress categories have no published values, and the published anchors do not order by
  lightness. Resolved at step 4.

Reggie's gap was dark-only; his Plum is published for Frost and is in use.

Final agent staffing of the map remains an open maintainer decision. Bridget appears in v1 as a
placeholder host only and does not answer.

## Not in this repository

Brand source files, design references and prior-prototype material are held locally and are
gitignored. They are not published here.
