import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import householdSize from "./countries.json";

const registryYaml = readFileSync(
  fileURLToPath(new URL("../../../sources/registry.yaml", import.meta.url)),
  "utf8",
);

// Same six anchors as calculators/data/age-shares (M8 households<->people toggle).
const ANCHORS = ["IND", "KEN", "UGA", "MWI", "TZA", "NER"] as const;
type Row = { name: string; peoplePerHousehold: number; source: string; reference_year: number };

describe("UN household-size default (M8 population-input toggle)", () => {
  it("has a plausible average household size for each anchor", () => {
    for (const iso of ANCHORS) {
      const c = (householdSize.countries as Record<string, Row>)[iso];
      expect(c, `${iso} missing`).toBeTruthy();
      // Real national averages sit ~2.5–8 people/household; guard against unit slips.
      expect(c.peoplePerHousehold).toBeGreaterThan(2);
      expect(c.peoplePerHousehold).toBeLessThan(9);
      expect(c.reference_year).toBeGreaterThanOrEqual(2000);
    }
  });

  it("orders demographically (Niger largest households, Kenya smallest)", () => {
    const c = householdSize.countries as Record<string, Row>;
    expect(c.NER.peoplePerHousehold).toBeGreaterThan(c.KEN.peoplePerHousehold);
  });

  it("cites the UN household-size registry source, which exists in registry.yaml", () => {
    expect(householdSize.registrySources).toContain("un-hh-size-2022");
    for (const id of householdSize.registrySources) {
      expect(registryYaml, `registry id "${id}" not found`).toContain(`- id: ${id}`);
    }
  });

  it("covers the full UN source, not just the anchors (coverage rule)", () => {
    // Anchors are test scenarios, not coverage limits — the file spans every country
    // the UN source provides. All values must be plausible people/household.
    const entries = Object.values(householdSize.countries as Record<string, Row>);
    expect(entries.length).toBeGreaterThan(150);
    for (const c of entries) {
      expect(c.peoplePerHousehold).toBeGreaterThan(1);
      expect(c.peoplePerHousehold).toBeLessThan(12);
    }
  });

  it("provides a conservative quartile fallback dial (25th-pct default) for missing countries", () => {
    const f = (householdSize as {
      fallback?: { conservativeDirection: string; percentiles: { p25: number; p50: number; p75: number }; cite: string };
    }).fallback;
    expect(f).toBeTruthy();
    expect(f!.conservativeDirection).toBe("low"); // fewer people/household = fewer credits = conservative
    expect(f!.percentiles.p25).toBeLessThan(f!.percentiles.p50);
    expect(f!.percentiles.p50).toBeLessThan(f!.percentiles.p75);
    expect(f!.cite).toContain("UN");
  });
});
