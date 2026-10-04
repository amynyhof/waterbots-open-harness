import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import daf from "./countries.json";

const registryYaml = readFileSync(
  fileURLToPath(new URL("../../../sources/registry.yaml", import.meta.url)),
  "utf8",
);

const ANCHORS = ["IND", "KEN", "UGA", "MWI", "TZA", "NER"] as const;

describe("DAF country x vintage-window table (CALCULATOR_SPEC §3.4)", () => {
  it("carries the 457 Annex-01 Applicable DAF (2026-2030) for each anchor", () => {
    const c = daf.countries;
    expect(c.IND.daf_2026_2030).toBe(0.0204);
    expect(c.KEN.daf_2026_2030).toBe(0.0345);
    expect(c.UGA.daf_2026_2030).toBe(0.0345);
    expect(c.MWI.daf_2026_2030).toBe(0.0345);
    expect(c.TZA.daf_2026_2030).toBe(0.0345);
    expect(c.NER.daf_2026_2030).toBe(0.0345);
  });

  it("pins the 1.25% absolute floor and every DAF is >= that floor", () => {
    expect(daf.absolute_floor.value).toBe(0.0125);
    for (const iso of ANCHORS) {
      const v = (daf.countries as Record<string, { daf_2026_2030: number }>)[iso].daf_2026_2030;
      expect(v).toBeGreaterThanOrEqual(daf.absolute_floor.value);
    }
  });

  it("references only registry ids that exist in sources/registry.yaml", () => {
    for (const id of daf.registrySources) {
      expect(registryYaml, `registry id "${id}" not found`).toContain(`- id: ${id}`);
    }
  });
});
