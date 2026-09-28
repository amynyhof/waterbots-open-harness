import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import factors from "./factors.json";

const registryYaml = readFileSync(
  fileURLToPath(new URL("../../../sources/registry.yaml", import.meta.url)),
  "utf8",
);

describe("embodied-emission factors (V2 §9.2 Table 10, p.36; parameter table p.58)", () => {
  it("carries the seven Table 10 defaults in tCO2e per unit or system", () => {
    const c = factors.categories;
    expect(c["basic-filter"].factor).toBe(0.008);
    expect(c["advanced-treatment"].factor).toBe(0.012);
    expect(c["biosand-concrete"].factor).toBe(0.065);
    expect(c["biosand-plastic"].factor).toBe(0.025);
    expect(c["rehabilitation"].factor).toBe(1.0);
    expect(c["cwt-kiosk"].factor).toBe(2.0);
    expect(c["new-borehole-mechanised"].factor).toBe(4.5);
    expect(factors.amortisationYears.value).toBe(5);
  });

  it("every category names its technology class and a page-cited source", () => {
    for (const [id, cat] of Object.entries(factors.categories)) {
      expect(["HWT/IWT", "CWT/CWS"], id).toContain(cat.technology);
      expect(cat.cite, id).toMatch(/p\.36/);
      expect(cat.factor, id).toBeGreaterThan(0);
    }
  });

  it("references only registry ids that exist in sources/registry.yaml", () => {
    const ids = new Set<string>(factors.registrySources);
    for (const cat of Object.values(factors.categories)) ids.add(cat.registry);
    ids.add(factors.amortisationYears.registry);
    for (const id of ids) {
      expect(registryYaml, `registry id "${id}" not found`).toContain(`- id: ${id}`);
    }
  });
});
