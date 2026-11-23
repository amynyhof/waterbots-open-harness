# Bridget and the map — module rulings

Bridget's and the map's own rulings. The whole site's are in [RULINGS.md](../../RULINGS.md); every
agent's are in [AGENT_RULES.md](../../AGENT_RULES.md).

## Bridget

- Her scope is the basin map and everything plotted on it. Her crew role is "Partners", the roster's
  word.
- Her screen has tabs Chat, Map, Knowledge pack and Credentials, and opens on Chat. Thirty messages a
  day, under her own counter.
- The Map tab opens on the country the visitor told Wellington, matched from Natural Earth's country
  names, or on the whole world when no single country is named; never a guess. The map zooms to the
  country as soon as the place is known.
- She opens in her own words, from her voice card, and asks for the pin. Where Wellington's line shows
  above her first answer, he has introduced her, and she does not say again who she is (agent rule
  17). A pin brings the visitor back
  to Chat, where she gives the basin and its water-stress reading, and says when it is derived.
- She never guesses, never names a project, partner, funder or place the visitor did not type, and
  never says she checks anything.

### What she adds to the project record (agent rule 10)

- **Nothing herself, today.** The console keeps the pin and the basin's place when the visitor clicks
  the map. Whether she should add anything is a **gap, for the maintainer**.

### Her reasons to send someone to the WaterBots team (agent rule 13)

- **Gap, for the maintainer.** The repository gives her no reason yet.

## The map

- Two basin layers with a zoom swap: Level 4 at world view, Level 6 from zoom 5. Level 3 was tried and
  rejected.
- The basemap is CARTO Voyager with a Slate wash at 13%. The water-stress ramp uses calm brand blues and
  warm warnings; Driftwood is not used for the dry categories.

## Data licences

Two datasets, two separate attributions. One combined line satisfies neither.

- **HydroSHEDS / HydroBASINS** has a custom WWF licence, not Creative Commons. The full copyright
  statement from License Agreement Exhibit B is shown in a reasonably prominent way, with the product
  name filled in. Text only: WWF's name may appear in the attribution, but never a WWF logo or
  trademark. The scientific citations (Lehner & Grill 2013; Lehner, Verdin & Jarvis 2008) go in the
  README and any About page.
- **WRI Aqueduct 4.0** is CC-BY 4.0. It needs visible credit to World Resources Institute, with the
  suggested citation (Kuzma et al. 2023) in the README.
- **Derived values say they are derived.** Level 6 shows WRI's published figures. Level 4 is an
  area-weighted majority of its children and says so wherever it shows.
- **Basemap tiles** carry their provider's own credit (© OpenStreetMap contributors, © CARTO). The
  map's attribution control stays on.
