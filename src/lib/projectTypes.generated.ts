/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Written by scripts/build-prompt-modules.mjs from committed markdown.
 * Edit the source, not this file, then re-run:
 *
 *   node scripts/build-prompt-modules.mjs
 *
 * The build gate fails if this has drifted from its sources, so a stale copy
 * cannot reach the relay unnoticed.
 *
 * Sources: knowledge-packs/product-shared/project-types.md
 */

/** The list as Wellington reads it: id, the standard's name, one plain sentence; no cites. */
export const PROJECT_TYPES_MD: string = "## Water stewardship activity types — the VWBA guidebook\n\n- C-1 — Agricultural best management practices: Farming in ways that help the land hold water and shed less of it, such as cover crops, no-till, terraces, contour planting or managed grazing.\n- C-2 — Agricultural input management: Managing what goes onto fields, such as fertiliser, pesticide or herbicide, so less of it ends up in the water.\n- C-3 — Irrigation efficiency and conversion: Changing how crops are watered so less water is used, such as switching to drip or fixing the system.\n- C-4 — Activities that reduce demand: Cutting how much water is taken in the first place, such as buying or leasing water rights so the water stays in the river or aquifer.\n- C-5 — Leak detection and repair: Finding leaks in a water system and fixing them.\n- C-6 — Vegetation and land-use changes that cut water use: Changing what grows on the land so it drinks less, such as removing invasive plants, thinning forest or switching crops.\n- C-7 — Runoff capture features: Built features that catch rain and runoff and hold it, such as rain gardens, bioswales or ponds.\n- C-8 — Treatment-focused green infrastructure: Natural-style features built to clean water, such as constructed wetlands.\n- C-9 — Gray infrastructure for treatment: Built plants and pipes that clean wastewater.\n- C-10 — Gray infrastructure for reuse and recycling: Built systems that let used water be cleaned and used again.\n- C-11 — New or alternative water supply: Opening up a new source of water for farms or homes, such as a new well, a rebuilt well, rainwater collection, a piped system or a household connection.\n- C-12 — Instream and habitat restoration: Repairing rivers and streams and the land beside them, such as removing barriers, re-timing dam releases or reconnecting floodplains.\n- C-13 — Recharge-focused infrastructure: Features built to get more water into the ground, such as recharge basins or spreading grounds.\n- C-14 — Wetland and aquatic habitat restoration and creation: Bringing back or making wetlands and other watery habitats that store water.\n- C-15 — Protection of existing water-storing habitat: Agreements such as conservation easements that keep existing wetlands and similar places from being lost.\n- C-16 — Urban surface and runoff management: Managing city surfaces so runoff is cleaner or smaller, such as street sweeping, washing stations or disconnecting paved areas from drains.\n- C-17 — Preserving existing vegetation cover: Keeping forest, meadow or other land cover as it is instead of clearing it.\n- C-18 — Restoring vegetation cover: Bringing trees, grassland or other cover back onto land that lost it.\n- C-19 — Access to potable water supply: Giving households or a community access to water that is safe to drink. A project of this type is also asked which of the four carbon classes below it is.\n- C-20 — Access to sanitation: Giving people access to toilets and safe ways to handle waste.\n\n## Safe-water technology classes — the Gold Standard methodology, asked only for a drinking-water project (C-19)\n\n- HWT — Household water treatment technologies: The water is made safe in the home, at the point where it is drunk, by a filter, chlorine or UV light.\n- IWT — Institutional water treatment technologies: The water is made safe on the premises of a school, clinic, prison or camp, the same ways.\n- CWT — Community level water treatment technologies: The water is made safe at one central point, then piped to homes or collected there at a kiosk or tap.\n- CWS — Community water supply technologies: A new or restored source of water for a community, such as a borehole handpump, a protected spring or a solar pump; if its water is not safe on its own, it is paired with one of the three kinds of treatment above.\n\n## None of these\n\n- NONE — None of these: The project is real and does not match any type above. Logged as honestly as any other; the guidebook says an activity absent from its table is not ruled out, and Phoebe's applies test says what follows.\n";

export interface ProjectType { id: string; name: string; plain: string; axis: 'water' | 'carbon' | 'none' }

/** Every row of the file, in file order. */
export const PROJECT_TYPES: readonly ProjectType[] = [
  {
    "id": "C-1",
    "name": "Agricultural best management practices",
    "plain": "Farming in ways that help the land hold water and shed less of it, such as cover crops, no-till, terraces, contour planting or managed grazing.",
    "axis": "water"
  },
  {
    "id": "C-2",
    "name": "Agricultural input management",
    "plain": "Managing what goes onto fields, such as fertiliser, pesticide or herbicide, so less of it ends up in the water.",
    "axis": "water"
  },
  {
    "id": "C-3",
    "name": "Irrigation efficiency and conversion",
    "plain": "Changing how crops are watered so less water is used, such as switching to drip or fixing the system.",
    "axis": "water"
  },
  {
    "id": "C-4",
    "name": "Activities that reduce demand",
    "plain": "Cutting how much water is taken in the first place, such as buying or leasing water rights so the water stays in the river or aquifer.",
    "axis": "water"
  },
  {
    "id": "C-5",
    "name": "Leak detection and repair",
    "plain": "Finding leaks in a water system and fixing them.",
    "axis": "water"
  },
  {
    "id": "C-6",
    "name": "Vegetation and land-use changes that cut water use",
    "plain": "Changing what grows on the land so it drinks less, such as removing invasive plants, thinning forest or switching crops.",
    "axis": "water"
  },
  {
    "id": "C-7",
    "name": "Runoff capture features",
    "plain": "Built features that catch rain and runoff and hold it, such as rain gardens, bioswales or ponds.",
    "axis": "water"
  },
  {
    "id": "C-8",
    "name": "Treatment-focused green infrastructure",
    "plain": "Natural-style features built to clean water, such as constructed wetlands.",
    "axis": "water"
  },
  {
    "id": "C-9",
    "name": "Gray infrastructure for treatment",
    "plain": "Built plants and pipes that clean wastewater.",
    "axis": "water"
  },
  {
    "id": "C-10",
    "name": "Gray infrastructure for reuse and recycling",
    "plain": "Built systems that let used water be cleaned and used again.",
    "axis": "water"
  },
  {
    "id": "C-11",
    "name": "New or alternative water supply",
    "plain": "Opening up a new source of water for farms or homes, such as a new well, a rebuilt well, rainwater collection, a piped system or a household connection.",
    "axis": "water"
  },
  {
    "id": "C-12",
    "name": "Instream and habitat restoration",
    "plain": "Repairing rivers and streams and the land beside them, such as removing barriers, re-timing dam releases or reconnecting floodplains.",
    "axis": "water"
  },
  {
    "id": "C-13",
    "name": "Recharge-focused infrastructure",
    "plain": "Features built to get more water into the ground, such as recharge basins or spreading grounds.",
    "axis": "water"
  },
  {
    "id": "C-14",
    "name": "Wetland and aquatic habitat restoration and creation",
    "plain": "Bringing back or making wetlands and other watery habitats that store water.",
    "axis": "water"
  },
  {
    "id": "C-15",
    "name": "Protection of existing water-storing habitat",
    "plain": "Agreements such as conservation easements that keep existing wetlands and similar places from being lost.",
    "axis": "water"
  },
  {
    "id": "C-16",
    "name": "Urban surface and runoff management",
    "plain": "Managing city surfaces so runoff is cleaner or smaller, such as street sweeping, washing stations or disconnecting paved areas from drains.",
    "axis": "water"
  },
  {
    "id": "C-17",
    "name": "Preserving existing vegetation cover",
    "plain": "Keeping forest, meadow or other land cover as it is instead of clearing it.",
    "axis": "water"
  },
  {
    "id": "C-18",
    "name": "Restoring vegetation cover",
    "plain": "Bringing trees, grassland or other cover back onto land that lost it.",
    "axis": "water"
  },
  {
    "id": "C-19",
    "name": "Access to potable water supply",
    "plain": "Giving households or a community access to water that is safe to drink. A project of this type is also asked which of the four carbon classes below it is.",
    "axis": "water"
  },
  {
    "id": "C-20",
    "name": "Access to sanitation",
    "plain": "Giving people access to toilets and safe ways to handle waste.",
    "axis": "water"
  },
  {
    "id": "HWT",
    "name": "Household water treatment technologies",
    "plain": "The water is made safe in the home, at the point where it is drunk, by a filter, chlorine or UV light.",
    "axis": "carbon"
  },
  {
    "id": "IWT",
    "name": "Institutional water treatment technologies",
    "plain": "The water is made safe on the premises of a school, clinic, prison or camp, the same ways.",
    "axis": "carbon"
  },
  {
    "id": "CWT",
    "name": "Community level water treatment technologies",
    "plain": "The water is made safe at one central point, then piped to homes or collected there at a kiosk or tap.",
    "axis": "carbon"
  },
  {
    "id": "CWS",
    "name": "Community water supply technologies",
    "plain": "A new or restored source of water for a community, such as a borehole handpump, a protected spring or a solar pump; if its water is not safe on its own, it is paired with one of the three kinds of treatment above.",
    "axis": "carbon"
  },
  {
    "id": "NONE",
    "name": "None of these",
    "plain": "The project is real and does not match any type above. Logged as honestly as any other; the guidebook says an activity absent from its table is not ruled out, and Phoebe's applies test says what follows.",
    "axis": "none"
  }
];

/** What `type` may hold: the twenty water-axis ids and NONE. A class is never a type. */
export const PROJECT_TYPE_IDS = ["C-1","C-2","C-3","C-4","C-5","C-6","C-7","C-8","C-9","C-10","C-11","C-12","C-13","C-14","C-15","C-16","C-17","C-18","C-19","C-20","NONE"] as const;
export type ProjectTypeId = (typeof PROJECT_TYPE_IDS)[number];

/** What `gsClass` may hold, and only beside a drinking-water project, C-19. */
export const GS_CLASS_IDS = ["HWT","IWT","CWT","CWS"] as const;
export type GsClassId = (typeof GS_CLASS_IDS)[number];

/** The one type that also takes a class. */
export const DRINKING_WATER_TYPE: ProjectTypeId = 'C-19';

/** The stage of a project, as Wellington asks it and logs it on the visitor's yes. */
export const PROJECT_STAGES = [
  {
    "id": "paper",
    "words": "on paper",
    "plain": "still a plan — nothing has been spent on building it yet"
  },
  {
    "id": "building",
    "words": "being built",
    "plain": "work has started and it is not running yet"
  },
  {
    "id": "running",
    "words": "already running",
    "plain": "it is in use today"
  }
] as const;
export const PROJECT_STAGE_IDS = ["paper","building","running"] as const;
export type ProjectStageId = (typeof PROJECT_STAGE_IDS)[number];

export function projectType(id: string): ProjectType | undefined {
  return PROJECT_TYPES.find((t) => t.id === id);
}
