import { describe, it, expect } from "vitest";

import {
  buildPreset, PRESETS, DEFAULT_STOVE_ETA, STOVE_CLASS_LABEL,
  resolveBaselineEdit, defaultCharcoalConvention, presetShares,
} from "./presets";
import { assertV2Charcoal } from "./baseline-ef";
import { computeLegacyEr } from "./emissions-legacy";

describe("presets — version-aware η, cited (A/C/D; no B)", () => {
  it("methodology-default η is version-aware (V1 0.10 vs V2 0.15 three-stone)", () => {
    expect(buildPreset("traditional-wood-cws", "legacy").stoveStrata[0].eta).toBe(0.1);
    expect(buildPreset("traditional-wood-cws", "paa").stoveStrata[0].eta).toBe(0.15);
    expect(DEFAULT_STOVE_ETA.legacy.threeStone).toBe(0.1);
    expect(DEFAULT_STOVE_ETA.paa.threeStone).toBe(0.15);
  });

  it("filed η (preset C, real filing) override the defaults and don't change with version", () => {
    const legacy = buildPreset("south-asia-multifuel-cws", "legacy");
    const paa = buildPreset("south-asia-multifuel-cws", "paa");
    expect(legacy.stoveStrata.map((s) => s.eta)).toEqual([0.1, 0.3, 0.25, 0.5]);
    expect(paa.stoveStrata.map((s) => s.eta)).toEqual([0.1, 0.3, 0.25, 0.5]); // version-independent
  });

  it("only A/C/D exist — preset B stays dropped (OPEN #26)", () => {
    expect(Object.keys(PRESETS).sort()).toEqual([
      "institutional-wood-iwt",
      "south-asia-multifuel-cws",
      "traditional-wood-cws",
    ]);
  });

  it("every preset carries a citation and positive shares", () => {
    for (const p of Object.values(PRESETS)) {
      expect(p.cite.length).toBeGreaterThan(0);
      for (const s of p.strata) expect(s.share).toBeGreaterThan(0);
    }
  });

  it("a preset feeds computeLegacyEr to a sane EF_b / ER", () => {
    const b = buildPreset("traditional-wood-cws", "legacy");
    const out = computeLegacyEr({
      method: 1, SE_o: 360.83, fNRB: 0.5, stoveStrata: b.stoveStrata, fuelMix: b.fuelMix,
      Q_pop: 1_000_000, C_b: 0, X_cleanboil: 0, M_qy: 1,
    });
    expect(out.EF_b).toBeGreaterThan(0);
    expect(out.ER).toBeGreaterThan(0);
  });
});

// Amy's ruling (1), 2026-09-26: the stove and fuel rows take typed SHARES; the engine resolves them.
describe("resolveBaselineEdit — typed shares, the 100% guard, [#213] charcoal", () => {
  const stove = { threeStone: 0.6, otherConventional: 0, ics: 0.4, fossil: 0 };
  const fuel = { wood: 0.7, charcoal: 0.3, lpg: 0 };

  it("turns shares into strata with the version's SDWS 11 η, zero-share classes dropped", () => {
    const paa = resolveBaselineEdit({ stoveShares: stove }, "paa");
    expect(paa.held).toEqual([]);
    expect(paa.stoveStrata!.map((s) => [s.share, s.eta])).toEqual([[0.6, 0.15], [0.4, 0.3]]);
    const legacy = resolveBaselineEdit({ stoveShares: stove }, "legacy");
    expect(legacy.stoveStrata!.map((s) => s.eta)).toEqual([0.1, 0.3]);
  });

  it("holds a list that does not add up to 100%, and says so — the preset stands for that half", () => {
    const r = resolveBaselineEdit({ stoveShares: { ...stove, ics: 0.3 }, fuelShares: fuel, charcoalConvention: "6:1" }, "paa");
    expect(r.stoveStrata).toBeUndefined();
    expect(r.fuelMix).toBeDefined(); // the other half is independent
    expect(r.held.join(" ")).toMatch(/add up to 90%/);
  });

  it("accepts a list within half a point of 100% (33.3 / 33.3 / 33.4)", () => {
    const r = resolveBaselineEdit({ stoveShares: { threeStone: 0.333, otherConventional: 0.333, ics: 0.334, fossil: 0 } }, "paa");
    expect(r.held).toEqual([]);
  });

  it("a fossil fuel system share needs its own η — SDWS 11 gives no default", () => {
    const s = { threeStone: 0.8, otherConventional: 0, ics: 0, fossil: 0.2 };
    expect(resolveBaselineEdit({ stoveShares: s }, "paa").held.join(" ")).toMatch(/efficiency/);
    const ok = resolveBaselineEdit({ stoveShares: s, fossilStoveEta: 0.5 }, "paa");
    expect(ok.stoveStrata!.find((x) => x.label === STOVE_CLASS_LABEL.fossil)!.eta).toBe(0.5);
  });

  it("a charcoal share needs its V2.0 factor set on EITHER rulebook (the seat always runs the V2.0 twin)", () => {
    for (const v of ["paa", "legacy"] as const) {
      expect(resolveBaselineEdit({ fuelShares: fuel }, v).held.join(" ")).toMatch(/charcoal share needs/);
    }
  });

  it("charcoal: V1's factors on legacy, the named convention's on PAA — and the engine's guard accepts it", () => {
    const legacy = resolveBaselineEdit({ fuelShares: fuel, charcoalConvention: "6:1" }, "legacy").fuelMix!;
    expect(legacy.find((f) => f.fuel === "charcoal")!.ef_co2).toBe(165.22);
    const paa = resolveBaselineEdit({ fuelShares: fuel, charcoalConvention: "6:1" }, "paa").fuelMix!;
    const ch = paa.find((f) => f.fuel === "charcoal")!;
    expect([ch.ef_co2, ch.ef_nonco2]).toEqual([355.36, 89.68]);
    expect(() => assertV2Charcoal(paa)).not.toThrow();
  });

  it("LPG is fossil — full CO₂, no fNRB", () => {
    const r = resolveBaselineEdit({ fuelShares: { wood: 0.9, charcoal: 0, lpg: 0.1 } }, "legacy");
    expect(r.fuelMix!.find((f) => f.fuel === "lpg")!.fossil).toBe(true);
  });

  it("pre-selects WCCF 6:1 only for Sub-Saharan Africa; elsewhere nothing is pre-selected (Q8)", () => {
    expect(defaultCharcoalConvention("UGA")).toBe("6:1");
    expect(defaultCharcoalConvention("IND")).toBeUndefined();
    expect(defaultCharcoalConvention("EGY")).toBeUndefined(); // Northern Africa is not M49 202
  });

  it("the traditional-wood preset opens the boxes at 100% three-stone and 100% wood", () => {
    expect(presetShares("traditional-wood-cws")).toEqual({
      stove: { threeStone: 1, otherConventional: 0, ics: 0, fossil: 0 },
      fuel: { wood: 1, charcoal: 0, lpg: 0, kerosene: 0, coal: 0, electricity: 0 },
    });
    expect(presetShares("south-asia-multifuel-cws")).toBeNull(); // filed η, no SDWS 6 class
  });
});

// [#213]: a preset's charcoal entry is resolved per version — V1's figures on legacy, the named V2
// convention's on PAA — so the South Asia preset never feeds V1 charcoal to a v2.0 run.
describe("buildPreset — charcoal resolved per version ([#213])", () => {
  it("legacy keeps V1's 165.22 / 44.83; PAA swaps in WCCF 4:1 (India) 236.91 / 61.74 and says so", () => {
    const legacy = buildPreset("south-asia-multifuel-cws", "legacy").fuelMix.find((f) => f.fuel === "charcoal")!;
    expect([legacy.ef_co2, legacy.ef_nonco2]).toEqual([165.22, 44.83]);
    const paa = buildPreset("south-asia-multifuel-cws", "paa");
    const ch = paa.fuelMix.find((f) => f.fuel === "charcoal")!;
    expect([ch.ef_co2, ch.ef_nonco2, ch.v2Charcoal]).toEqual([236.91, 61.74, "4:1"]);
    expect(paa.notes.some((n) => /Charcoal factors resolved to V2/.test(n))).toBe(true);
  });
});
