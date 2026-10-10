/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Written by scripts/build-prompt-modules.mjs from committed source files.
 * Edit the source, not this file, then re-run:
 *
 *   node scripts/build-prompt-modules.mjs
 *
 * The build gate fails if this has drifted from its sources, so a stale copy
 * cannot reach the relay unnoticed.
 *
 * Sources: engine/sources/registry.yaml
 */

export interface RegistryRow {
  id: string;
  title: string;
  publisher: string;
  docRef: string | null;
  /** Null where the source states none; the reader never fills it in. */
  version: string | null;
  published: string;
  canonicalUrl: string;
  license: string;
}

/** Every row of the sealed engine's registry, in file order — the public part only. */
export const REGISTRY_ROWS: readonly RegistryRow[] = [
  {
    "id": "a64-amt-009-fnrb",
    "title": "Fraction of non-renewable biomass (fNRB)",
    "publisher": "UNFCCC (Article 6.4 Mechanism)",
    "docRef": "A6.4-AMT-009",
    "version": "1.0",
    "published": "2026-05-21",
    "canonicalUrl": "https://unfccc.int/sites/default/files/resource/A6.4-AMT-009-v01.0_public.pdf",
    "license": "UNFCCC public document; redistribution unconfirmed — cite-and-link only, pending legal review."
  },
  {
    "id": "cdm-tool33",
    "title": "Default values for common parameters",
    "publisher": "UNFCCC (CDM)",
    "docRef": "CDM TOOL33",
    "version": "3.0",
    "published": "2025-06-12",
    "canonicalUrl": "https://cdm.unfccc.int/methodologies/PAmethodologies/tools/am-tool-33-v3.pdf",
    "license": "UNFCCC public document; redistribution unconfirmed — cite-and-link only, pending legal review."
  },
  {
    "id": "gs-429-1-ertool-cws",
    "title": "SWS ER-Tool — CWS",
    "publisher": "Gold Standard (GS4GG)",
    "docRef": "429.1 V1.0 SWS ER-Tool CWS",
    "version": "1.0",
    "published": "2022-05-02",
    "canonicalUrl": "https://globalgoals.goldstandard.org/safe-drinking-water-supply-er-tool-cws/",
    "license": "© Gold Standard Foundation; publicly downloadable; no explicit reuse licence granted; redistribution unconfirmed — cite-and-link only, pending legal review."
  },
  {
    "id": "gs-429-v1-methodology",
    "title": "Emission Reductions from Safe Drinking Water Supply (legacy)",
    "publisher": "Gold Standard (GS4GG)",
    "docRef": "SDWS v1.0",
    "version": "1.0",
    "published": "2021-05-03",
    "canonicalUrl": "https://globalgoals.goldstandard.org/standards/429_V1.0_EE_SWS_Emission-reductions-from-Safe-Drinking-Water-Supply.pdf",
    "license": "© Gold Standard Foundation; publicly downloadable; no explicit reuse licence granted; redistribution unconfirmed — cite-and-link only, pending legal review."
  },
  {
    "id": "gs-429-v2-methodology",
    "title": "Emission Reductions from Safe Drinking Water Supply",
    "publisher": "Gold Standard (GS4GG)",
    "docRef": "GS4GG PAA M400-12",
    "version": "2.0",
    "published": "2026-07-09",
    "canonicalUrl": "https://globalgoals.goldstandard.org/429-ee-sws-emission-reductions-from-safe-drinking-water-supply/",
    "license": "© Gold Standard Foundation; publicly downloadable; no explicit reuse licence granted; redistribution unconfirmed — cite-and-link only, pending legal review."
  },
  {
    "id": "gs-429-v2-si",
    "title": "Emission Reductions from Safe Drinking Water Supply — Supplementary Information",
    "publisher": "Gold Standard (GS4GG)",
    "docRef": "GS4GG PAA M400-12 SI",
    "version": "1.0",
    "published": "2026-07-09",
    "canonicalUrl": "https://globalgoals.goldstandard.org/standards/429_V2.0_PAA-M400-12-Emission-reductions-from-Safe-Drinking-Water-Supply_SI.pdf",
    "license": "© Gold Standard Foundation; publicly downloadable; no explicit reuse licence granted; redistribution unconfirmed — cite-and-link only, pending legal review."
  },
  {
    "id": "gs-457-daf",
    "title": "Downward Adjustment Factor (DAF) Determination",
    "publisher": "Gold Standard (GS4GG)",
    "docRef": "GS4GG A6 MT400-05 (Tool 05)",
    "version": "1.0",
    "published": "2025-12-22",
    "canonicalUrl": "https://globalgoals.goldstandard.org/457_paa-ms_400_05_downward-adjustment-factor-determination/",
    "license": "© Gold Standard Foundation; publicly downloadable; no explicit reuse licence granted; redistribution unconfirmed — cite-and-link only, pending legal review."
  },
  {
    "id": "mofuss-adm0-zenodo-18865904",
    "title": "MoFuSS global simulations 1km 2010-2050 — national (adm0) fNRB summary",
    "publisher": "A. Ghilardi (UNAM) & R. Bailis (SEI) — MoFuSS",
    "docRef": "MoFuSS global sim, summary_adm0.csv",
    "version": "v6",
    "published": "2025-12-20",
    "canonicalUrl": "https://doi.org/10.5281/zenodo.18865904",
    "license": "Creative Commons Attribution 4.0 International (CC BY 4.0), per the licence stated on the Zenodo record page under 'Rights.' Attribution required; no other restriction."
  },
  {
    "id": "mofuss-fnrb-2024",
    "title": "Updated fNRB Values for Woodfuel Interventions",
    "publisher": "A. Ghilardi (UNAM) & R. Bailis (SEI) — MoFuSS",
    "docRef": "MoFuSS fNRB update",
    "version": null,
    "published": "2024-06-20",
    "canonicalUrl": "https://www.mofuss.unam.mx/mofuss/files/Report_on_Updated_fNRB_Values_20_June_2024.pdf",
    "license": "Creative Commons Attribution 4.0 International (CC BY 4.0). The PDF itself carries no licence line of its own; the same report is deposited by its authors on Zenodo, record 14291479, under CC BY 4.0, and that deposit is read as the authors' own licence grant for the report."
  },
  {
    "id": "un-hh-size-2022",
    "title": "Household Size and Composition 2022 — Average household size by country",
    "publisher": "United Nations, Department of Economic and Social Affairs, Population Division",
    "docRef": "UN DESA/POP Household Size & Composition 2022",
    "version": "2022 update",
    "published": "2022",
    "canonicalUrl": "https://www.un.org/development/desa/pd/data/household-size-and-composition",
    "license": "Creative Commons Attribution 3.0 IGO (CC BY 3.0 IGO), per the licence line on the copyright page of the 2022 Methodology Report (UN DESA/POP/2022/DC/NO. 8), which governs this database. That line reads 'figures and tables in this publication' — it names the report, not the spreadsheet, which carries no licence line of its own; the determination reads the report's licence as governing the database it documents. Attribution required; no other restriction."
  },
  {
    "id": "un-wpp-2024-pop-age1",
    "title": "World Population Prospects 2024 — Total population by single age and sex (File POP/01-1), medium variant",
    "publisher": "United Nations, Department of Economic and Social Affairs, Population Division",
    "docRef": "UN WPP 2024, POP/01-1 (POP/DB/WPP/Rev.2024/POP/F01-1)",
    "version": "2024 revision",
    "published": "2024-07",
    "canonicalUrl": "https://population.un.org/wpp/downloads",
    "license": "Creative Commons Attribution 3.0 IGO (CC BY 3.0 IGO), per the licence line printed in the UN's own Summary of Results and Data Sources and Methodology reports for WPP 2024. Attribution required; no other restriction."
  },
  {
    "id": "unsd-m49",
    "title": "Standard country or area codes for statistical use (M49)",
    "publisher": "United Nations Statistics Division (UNSD)",
    "docRef": "UN M49 geoscheme — overview table (English)",
    "version": "live table, retrieved 2026-09-22",
    "published": "2026-09-22",
    "canonicalUrl": "https://unstats.un.org/unsd/methodology/m49/overview/",
    "license": "© United Nations. Publicly available; redistribution unconfirmed — cite-and-link only, pending legal review."
  }
];
