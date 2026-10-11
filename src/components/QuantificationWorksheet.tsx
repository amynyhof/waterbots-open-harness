/**
 * The Quantification sheet — Calvin's Tool tab, on the carried engine.
 *
 * Calvin's brief (PROPOSAL_calvin-brief.md) §2, step 4 of pull request A. It
 * replaces the tab strip of packs with ONE SHEET: two headlines side by side,
 * then the carbon derivation, then the water column (ruling 2). The carbon
 * side is the sealed engine's, through the wrapper (lib/calvinEngine); the
 * water side is the VWBA 2.0 D-3 pack (lib/vwbaD3), fed the same people count.
 *
 * THE LOOK is the paid calculator's — the text list of block names and tag
 * words and the four captures she carried on 10 Oct 2026 (R10): the version
 * tabs, the summary strip, the derivation card, its five sections in order,
 * each row with its symbol, title, Eq. number, data-sheet chip, state badge and
 * value, and open rows showing "where". Its data, wording beyond those names,
 * composers and saving are not carried.
 *
 * THIS FILE COMPUTES NOTHING. Every figure is the engine's, read from
 * `carbonSheet`, or the D-3 pack's. A dash is an answer: it says what it waits
 * on. On the bundle on hand every carbon headline is a dash — "Baseline fuel
 * data is not on this site yet." — and the rows that do not depend on the fuel
 * mix still show the engine's figures (§1.3, R12).
 *
 * HIDDEN, NOT DELETED (ruling 4). The paid parts the free site does not show
 * are built here behind SHOWN switches, all off: the tag legend, the fNRB
 * provenance strip, the baseline/monitoring marks, pencils on read-only rows,
 * the left rail's analysis basis and save area. One flag turns each back on.
 *
 * THE ANSWERS LIVE IN THE SHELL — the visit's pack values, under CALVIN_KEY for
 * the carbon rows and the D-3 pack's own key for the water rows — so a step
 * away and back keeps them. Nothing is kept between visits.
 */

import { useMemo, useState, type ReactNode } from 'react';
import {
  carbonSheet,
  peopleForWater,
  INSTITUTION_LINE,
  type CarbonInputs,
  type CarbonSheet,
  type Derivation,
  type SheetLine,
  type SliderPosition,
  type Tag,
} from '../lib/calvinEngine';
import {
  CALVIN_FIELDS,
  ENERGY_SOURCES,
  SLIDERS,
  WATER_LITRES_SLIDER,
  countryName,
  matchCountry,
  waterLitresOpening,
  type CalvinFieldKey,
  type SliderKey,
  type SliderSpec,
} from '../lib/calvinFields';
import { EMBODIED_CATEGORIES } from '../../engine/calculators/gs4gg-carbon/scenario';
import m49Json from '../../engine/calculators/data/regions/un-m49.json';
import type { Citation } from '../lib/citation';
import type { FormulaStep, PackValues } from '../lib/methodPacks';
import { DRINKING_WATER_TYPE, GS_CLASS_IDS } from '../lib/projectTypes.generated';
import { registryCitation } from '../lib/registry';
import type { VisitContext } from '../lib/visit';
import { VWBA_D3 } from '../lib/vwbaD3';
import { contextFor, pathwayState, readiness, touched, type Sheet } from '../lib/worksheetState';

/** Where Calvin's carbon rows are kept in the visit's pack values. */
export const CALVIN_KEY = 'calvin-sheet';

/* The paid parts built and switched off on the free site (ruling 4, §2.4). */
const SHOWN = {
  tagLegend: false,
  provenanceStrip: false,
  marks: false,
  pencils: false,
  analysisBasis: false,
  saveArea: false,
} as const;

/** Values set in mono: this site's .t-mono carries the family only, so size and tracking are stated. */
const MONO = { fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' } as const;

const CARBON_PACK = 'gs-paa-v2.0';
const WATER_PACK = 'vwba-2.0';

const M49 = (m49Json as unknown as { countries: Record<string, { name: string }> }).countries;
const COUNTRY_OPTIONS = Object.entries(M49)
  .map(([iso, row]) => ({ iso, name: row.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

/* --------------------------------------------------------------------------
   From the record and the typed rows to the wrapper's inputs.
   -------------------------------------------------------------------------- */

function readSlider(values: PackValues, key: SliderKey): SliderPosition | undefined {
  const raw = values[`slider_${key}`];
  if (raw === undefined || raw.trim() === '') return undefined;
  const n = Number(raw);
  /* No chat yet on this pull request, so every slider position is a move. */
  return Number.isFinite(n) ? { value: n, how: 'moved' } : undefined;
}

function answer<K extends CalvinFieldKey>(key: K, raw: unknown) {
  const read = CALVIN_FIELDS[key].read as (v: unknown) => unknown;
  const value = read(raw);
  return value === undefined ? undefined : { value, from: 'typed' as const };
}

/** The record first, then what the visitor typed; never the other way round (§6). */
export function carbonInputsFrom(record: VisitContext, values: PackValues, sheet: Sheet): CarbonInputs {
  const typedClass = CALVIN_FIELDS.gsClass.read(values.gsClass);
  const gsClass = record.gsClass || (record.type === DRINKING_WATER_TYPE ? typedClass ?? '' : '');
  const served = record.served ?? CALVIN_FIELDS.served.read({ count: values.served_count, unit: values.served_unit }) ?? null;
  const country = matchCountry(record.place) ?? CALVIN_FIELDS.country.read(values.country) ?? null;
  const version = contextFor(sheet, CARBON_PACK, gsClass).versionFlag;
  return {
    type: record.type,
    gsClass,
    served,
    country,
    litres: readSlider(values, 'litres'),
    operationalDays: readSlider(values, 'operationalDays'),
    waterQuality: readSlider(values, 'waterQuality'),
    eta: readSlider(values, 'eta'),
    usageRate: readSlider(values, 'usageRate'),
    premises: answer('premises', values.premises) as CarbonInputs['premises'],
    deviceClass: answer('deviceClass', values.deviceClass) as CarbonInputs['deviceClass'],
    deviceUnits: answer('deviceUnits', values.deviceUnits) as CarbonInputs['deviceUnits'],
    householdSize: answer('householdSize', values.householdSize) as CarbonInputs['householdSize'],
    fnrb: answer('fnrb', { value: values.fnrb_value, source: values.fnrb_source }) as CarbonInputs['fnrb'],
    energySource: answer('energySource', values.energySource) as CarbonInputs['energySource'],
    energyAmount: answer('energyAmount', values.energyAmount) as CarbonInputs['energyAmount'],
    versionFlag: version,
    fnrbFiledV1: answer('fnrbFiledV1', { value: values.fnrbFiledV1_value, source: values.fnrbFiledV1_source }) as CarbonInputs['fnrbFiledV1'],
  };
}

/* --------------------------------------------------------------------------
   Phoebe's read decides which headlines show (§2.1, R8).
   -------------------------------------------------------------------------- */

type Hold = 'shown' | 'held' | 'unchecked';

function pathwayHold(sheet: Sheet, pack: string, gsClass: string): Hold {
  const context = contextFor(sheet, pack, gsClass);
  if (pathwayState(sheet, pack, context) === 'does-not-apply') return 'held';
  if (touched(sheet, pack, context) === 0 && pathwayState(sheet, pack, context) === 'unchecked') return 'unchecked';
  return readiness(sheet, pack, context) === 'likely-not' ? 'held' : 'shown';
}

/* --------------------------------------------------------------------------
   Formatting — display only, never arithmetic.
   -------------------------------------------------------------------------- */

function fmt(value: number | string | null, unit?: string): string {
  if (value === null) return '—';
  if (typeof value === 'string') return value;
  if (unit === '%') return `${(value * 100).toLocaleString('en-GB', { maximumFractionDigits: 1 })}`;
  const abs = Math.abs(value);
  if (abs !== 0 && abs < 0.01) return value.toExponential(3);
  if (abs >= 1000) return value.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  return value.toLocaleString('en-GB', { maximumFractionDigits: abs < 1 ? 4 : 2 });
}

/* --------------------------------------------------------------------------
   The sheet.
   -------------------------------------------------------------------------- */

export default function QuantificationWorksheet({
  record,
  sheet,
  allValues,
  onChange,
}: {
  /** The project record. On the Commons it is empty: there is no record there. */
  record: VisitContext;
  /** Phoebe's worksheet, for the pathway reads and the version she sorted. */
  sheet: Sheet;
  allValues: Record<string, PackValues>;
  onChange: (key: string, values: PackValues) => void;
}) {
  const values = allValues[CALVIN_KEY] ?? {};
  const waterOwn = allValues[VWBA_D3.key] ?? {};
  const set = (patch: PackValues) => onChange(CALVIN_KEY, { ...values, ...patch });
  const setWater = (patch: PackValues) => onChange(VWBA_D3.key, { ...waterOwn, ...patch });

  const inputs = useMemo(() => carbonInputsFrom(record, values, sheet), [record, values, sheet]);
  const carbon = useMemo(() => carbonSheet(inputs), [inputs]);

  /* The water column takes the same people count the carbon side uses (§2.5). */
  const waterPeople = useMemo(() => peopleForWater(inputs), [inputs]);
  const waterValues: PackValues = { ...waterOwn, people: waterPeople ? String(waterPeople.people) : '' };
  const waterResult = VWBA_D3.compute(waterValues);

  const carbonHold = pathwayHold(sheet, CARBON_PACK, inputs.gsClass);
  const waterHold = pathwayHold(sheet, WATER_PACK, inputs.gsClass);
  const nothingChecked = carbonHold === 'unchecked' && waterHold === 'unchecked';
  const showCarbon = carbonHold !== 'held';
  const showWater = waterHold !== 'held';

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 64px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Quantification
        </div>

        <Headlines
          carbon={carbon}
          showCarbon={showCarbon}
          showWater={showWater}
          waterHeadline={waterResult.kind === 'complete' ? waterResult.headline.value : null}
          waterLine={waterLine(waterResult, waterPeople !== null, waterOwn)}
        />
        {nothingChecked && (
          <p className="t-caption" style={{ margin: '8px 0 0', fontSize: 11 }}>
            Eligibility has not been checked yet. Both figures are shown; Phoebe’s read on the Eligibility step
            decides which pathway fits.
          </p>
        )}
        {!showCarbon && (
          <p className="t-caption" style={{ margin: '8px 0 0', fontSize: 11 }}>
            Phoebe found the carbon pathway likely does not fit this project, so no carbon figure is worked out.
          </p>
        )}
        {!showWater && (
          <p className="t-caption" style={{ margin: '8px 0 0', fontSize: 11 }}>
            Phoebe found the water pathway likely does not fit this project, so no water figure is worked out.
          </p>
        )}

        <ProjectStrip record={record} inputs={inputs} values={values} set={set} />

        {showCarbon && <CarbonCard carbon={carbon} values={values} set={set} technology={inputs.gsClass} />}

        {showWater && (
          <WaterCard
            own={waterOwn}
            values={waterValues}
            people={waterPeople}
            result={waterResult}
            setWater={setWater}
          />
        )}

        {SHOWN.analysisBasis && <AnalysisBasis />}
        {SHOWN.saveArea && <SaveArea />}
      </div>
    </div>
  );
}

function waterLine(result: ReturnType<typeof VWBA_D3.compute>, hasPeople: boolean, own: PackValues): string {
  if (result.kind === 'blocked') return result.stopReason;
  if (result.kind === 'incomplete') return 'Still needed: the without-project volume. A blank is not zero.';
  if (result.kind === 'complete') return result.headline.secondary ?? '';
  if (!hasPeople) return 'Still needed: people served.';
  if (!own.access_level) return 'Still needed: the access level, full or limited.';
  return 'Still needed: the days a year people have the water.';
}

/* --------------------------------------------------------------------------
   The two headlines (§2.1).
   -------------------------------------------------------------------------- */

function Headlines({
  carbon,
  showCarbon,
  showWater,
  waterHeadline,
  waterLine,
}: {
  carbon: CarbonSheet;
  showCarbon: boolean;
  showWater: boolean;
  waterHeadline: number | null;
  waterLine: string;
}) {
  const o = carbon.outcome;
  const carbonValue = o.kind === 'ok' ? o.result.ER : null;
  const carbonLine =
    o.kind === 'ok'
      ? 'tCO₂e a year, PAA v2.0'
      : o.kind === 'dash'
        ? o.line
        : o.reason === 'institution'
          ? INSTITUTION_LINE
          : o.reason === 'no-class'
            ? 'Still needed: the class of drinking-water project — HWT, IWT, CWT or CWS.'
            : o.reason === 'no-type'
              ? 'Calvin works from the project’s type, which Wellington settles in the chat on Dispatches.'
              : 'The carbon pathway does not name this type of project.';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: showCarbon && showWater ? '1fr 1fr' : '1fr', gap: 12 }}>
      {showWater && (
        <Headline
          category="Water"
          method="VWBA 2.0 · D-3 Volume Provided"
          value={waterHeadline}
          unit="m³ / year"
          line={waterLine}
        />
      )}
      {showCarbon && (
        <Headline
          category="Carbon"
          method="GS4GG PAA v2.0 · Safe Drinking Water"
          value={carbonValue}
          unit="tCO₂e / year"
          line={carbonLine}
        />
      )}
    </div>
  );
}

function Headline({ category, method, value, unit, line }: { category: string; method: string; value: number | null; unit: string; line: string }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '14px 20px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <CategoryChip>{category}</CategoryChip>
        <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{method}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
        <span style={{ ...MONO, fontSize: 17, fontWeight: 600, lineHeight: 1.1, color: value === null ? 'var(--ink-4)' : 'var(--ink)' }}>
          {value === null ? '—' : fmt(value)}
        </span>
        {value !== null && <TagBadge tag="derived" />}
      </div>
      <div style={{ ...MONO, fontSize: 9.5, color: 'var(--ink-4)', marginTop: 1 }}>{unit}</div>
      <div style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--ink-3)', marginTop: 6, minHeight: 16 }}>{line}</div>
      <div style={{ marginTop: 8 }}>
        <Badge color="var(--bot-calvin)" upper={false}>Screening · consultant review</Badge>
      </div>
    </div>
  );
}

/** The small category chip a version tab carries, used on the headlines too. */
function CategoryChip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        ...MONO,
        fontSize: 8,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '0 4px',
        borderRadius: 'var(--r-pill)',
        color: 'var(--ink)',
        background: 'color-mix(in oklab, var(--tide) 12%, transparent)',
        boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--tide) 40%, transparent)',
      }}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------------------------
   What Calvin works from: the record's fields, or a box where it has none.
   -------------------------------------------------------------------------- */

function ProjectStrip({
  record,
  inputs,
  values,
  set,
}: {
  record: VisitContext;
  inputs: CarbonInputs;
  values: PackValues;
  set: (patch: PackValues) => void;
}) {
  const placeCountry = matchCountry(record.place);
  return (
    <div style={{ marginTop: 14, padding: '14px 20px', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', background: 'var(--card)' }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        What Calvin works from
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px 18px' }}>
        <StripItem label="Country" note={placeCountry ? 'from the place on the project record' : CALVIN_FIELDS.country.whereFrom}>
          {placeCountry ? (
            <Fixed>{countryName(placeCountry)}</Fixed>
          ) : (
            <select
              className="t-mono wb-calc-input"
              style={{ width: 200, textAlign: 'left' }}
              value={values.country ?? ''}
              onChange={(e) => set({ country: e.target.value })}
              aria-label="Country"
            >
              <option value="">Choose a country</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.iso} value={c.iso}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </StripItem>
        <StripItem
          label="Class of drinking-water project"
          note={record.gsClass ? 'from the project record' : record.type === DRINKING_WATER_TYPE ? CALVIN_FIELDS.gsClass.whereFrom : 'only for a drinking-water project'}
        >
          {record.gsClass ? (
            <Fixed>{record.gsClass}</Fixed>
          ) : record.type === DRINKING_WATER_TYPE ? (
            <Segmented
              options={GS_CLASS_IDS.map((id) => ({ value: id, label: id }))}
              value={values.gsClass ?? ''}
              onChange={(v) => set({ gsClass: v })}
              label="Class of drinking-water project"
            />
          ) : (
            <Fixed>—</Fixed>
          )}
        </StripItem>
        <StripItem label="People served" note={record.served ? 'from the project record' : CALVIN_FIELDS.served.whereFrom}>
          {record.served ? (
            <Fixed>
              {record.served.count.toLocaleString('en-GB')} {record.served.unit}
            </Fixed>
          ) : (
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                className="t-mono wb-calc-input"
                inputMode="numeric"
                value={values.served_count ?? ''}
                onChange={(e) => set({ served_count: e.target.value })}
                aria-label="People served, count"
                placeholder="count"
              />
              <Segmented
                options={[
                  { value: 'people', label: 'people' },
                  { value: 'households', label: 'households' },
                ]}
                value={values.served_unit ?? ''}
                onChange={(v) => set({ served_unit: v })}
                label="People or households"
              />
            </span>
          )}
        </StripItem>
      </div>
      {inputs.versionFlag === 'transitioning' && (
        <p className="t-caption" style={{ margin: '8px 0 0', fontSize: 10.5 }}>
          Phoebe sorted this project as transitioning from the 2021 version, so the Legacy V1.0 side is shown too.
        </p>
      )}
    </div>
  );
}

function StripItem({ label, note, children }: { label: string; note: string; children: ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, color: 'var(--ink-4)', marginBottom: 3 }}>{label}</div>
      {children}
      <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>{note}</div>
    </div>
  );
}

function Fixed({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...MONO, fontSize: 12, color: 'var(--ink)' }}>
      {children}
    </span>
  );
}

/* --------------------------------------------------------------------------
   The carbon card: version tabs, summary strip, the derivation.
   -------------------------------------------------------------------------- */

function CarbonCard({ carbon, values, set, technology }: { carbon: CarbonSheet; values: PackValues; set: (patch: PackValues) => void; technology: string }) {
  const t = carbon.transition;
  return (
    <section style={{ marginTop: 18 }} aria-label="Carbon">
      {t.shown && (
        <>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', borderBottom: '1px solid var(--line)' }}>
            <VersionTab label="Legacy V1.0" value={t.legacy} on={false} />
            <VersionTab label="PAA v2.0" value={t.paa} on />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--ink-3)' }}>
            Transition delta (PAA − Legacy):{' '}
            <span style={{ ...MONO, color: t.delta === null ? 'var(--ink-4)' : t.delta >= 0 ? 'var(--ink)' : 'var(--state-warn-text)' }}>
              {t.delta === null ? '—' : `${t.delta >= 0 ? '+' : ''}${fmt(t.delta)} tCO₂e/yr`}
            </span>
          </p>
          <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>
            The difference the change of methodology version makes, worked out on the same project data.
          </p>
          {t.refusal && (
            <Panel title="Filed V1.0 fNRB needed" text={t.refusal.message}>
              <FnrbBoxes
                value={values.fnrbFiledV1_value ?? ''}
                source={values.fnrbFiledV1_source ?? ''}
                onValue={(v) => set({ fnrbFiledV1_value: v })}
                onSource={(v) => set({ fnrbFiledV1_source: v })}
                label="Filed V1.0 fNRB"
              />
              <p style={{ margin: '8px 0 0', fontSize: 10, color: 'var(--ink-4)' }}>Where to find it: {t.refusal.cite}</p>
            </Panel>
          )}
        </>
      )}

      {/* The warning bar: only when a warning exists — a complete run's engine warnings. */}
      {carbon.outcome.kind === 'ok' && carbon.outcome.result.warnings.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '8px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--coral)', background: 'color-mix(in oklab, var(--coral) 8%, transparent)' }}>
          <span aria-hidden style={{ width: 8, height: 8, borderRadius: 'var(--r-pill)', background: 'var(--coral)', flex: 'none' }} />
          <span style={{ fontSize: 12, color: 'var(--state-warn-text)' }}>{carbon.outcome.result.warnings.join(' ')}</span>
        </div>
      )}

      <Summary carbon={carbon} />

      {SHOWN.tagLegend && <TagLegend />}

      <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '14px 20px 8px', marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingBottom: 4 }}>
          <span className="eyebrow">PAA v2.0 · derivation</span>
          <span style={{ ...MONO, fontSize: 10, color: 'var(--ink-4)' }}>{carbon.methodLabel ?? ''}</span>
        </div>
        <p style={{ margin: 0, fontSize: 10, color: 'var(--ink-4)' }}>
          Shown in the order it is worked out; Eq. numbers cite the methodology. Click a row to open or close it.
        </p>

        {carbon.blocks.length === 0 ? (
          <p style={{ margin: '12px 0 8px', fontSize: 13, color: 'var(--ink-3)' }}>
            {carbon.outcome.kind === 'none' && carbon.outcome.reason === 'institution'
              ? INSTITUTION_LINE
              : 'No carbon calculation runs for this project yet. The headline above says why.'}
          </p>
        ) : (
          carbon.blocks.map((block) => (
            <div key={block.key}>
              {block.key === 'ADJ' ? (
                <SubHeader label={block.title} note="Three checks on the water volume, then the country’s yearly ambition cut." />
              ) : (
                <SectionRule>{block.title}</SectionRule>
              )}
              {block.derivations.map((d) => (
                <DerivationRow key={d.key} d={d} values={values} set={set} technology={technology} />
              ))}
            </div>
          ))
        )}
      </section>

      <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 0', fontSize: 10, lineHeight: 1.4, color: 'var(--ink-4)' }}>
        <span
          style={{
            ...MONO,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            flex: 'none',
            fontSize: 10,
            padding: '0 8px',
            borderRadius: 'var(--r-pill)',
            color: 'var(--ink)',
            background: 'color-mix(in oklab, var(--iris) 14%, transparent)',
            boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--iris) 40%, transparent)',
          }}
        >
          <span aria-hidden style={{ width: 8, height: 8, borderRadius: 'var(--r-pill)', background: 'var(--iris)' }} />
          Beta
        </span>
        <span>
          Beta — a screening estimate on the paid site’s sealed engine, v0.16.1. Anticipated, not delivered and not
          verified; for a consultant’s review.
        </span>
      </p>
    </section>
  );
}

function VersionTab({ label, value, on }: { label: string; value: number | null; on: boolean }) {
  return (
    <div
      aria-current={on ? 'true' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 4,
        padding: '8px 12px',
        border: `1px solid ${on ? 'var(--tide)' : 'var(--line)'}`,
        borderRadius: 'var(--r-sm) var(--r-sm) 0 0',
        background: on ? 'var(--card)' : 'transparent',
        boxShadow: on ? 'inset 0 -2px 0 var(--tide)' : 'none',
      }}
    >
      <CategoryChip>Carbon</CategoryChip>
      <span style={{ fontSize: 13, fontWeight: 600, color: on ? 'var(--ink)' : 'var(--ink-3)' }}>{label}</span>
      <span style={{ ...MONO, fontSize: 13, fontWeight: 700, color: value !== null && on ? 'var(--tide-text)' : 'var(--ink-4)' }}>
        {value === null ? '—' : `${fmt(value)} tCO₂e/yr`}
      </span>
    </div>
  );
}

function Summary({ carbon }: { carbon: CarbonSheet }) {
  const s = carbon.summary;
  const tiles: { value: number | null; label: string; unit: string }[] = [
    { value: s.erPerPerson, label: 'ER / person / yr', unit: 'tCO₂e' },
    { value: s.efb, label: 'Baseline EF_b (Eq.1)', unit: 'tCO₂e / L' },
    { value: s.qy, label: 'Water volume Q_y', unit: 'ML / yr' },
    { value: s.total, label: 'Total · 1st CP (5 yr)', unit: 'tCO₂e' },
  ];
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--shadow-sm)', padding: '14px 20px', marginTop: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px 24px' }}>
        {tiles.map((t) => (
          <div key={t.label} style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ ...MONO, fontSize: 17, fontWeight: 600, lineHeight: 1.1, color: t.value === null ? 'var(--ink-4)' : 'var(--ink)' }}>
                {fmt(t.value)}
              </span>
              {t.value !== null && <TagBadge tag="derived" />}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 4, lineHeight: 1.25 }}>{t.label}</div>
            <div style={{ ...MONO, fontSize: 9.5, color: 'var(--ink-4)', marginTop: 1 }}>{t.unit}</div>
          </div>
        ))}
      </div>
      {SHOWN.provenanceStrip && <ProvenanceStrip />}
    </div>
  );
}

/* --------------------------------------------------------------------------
   One derivation row: closed, a header; open, its sentence, formula and rows.
   -------------------------------------------------------------------------- */

function DerivationRow({ d, values, set, technology }: { d: Derivation; values: PackValues; set: (patch: PackValues) => void; technology?: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="wb-calc-row"
        style={{ display: 'flex', width: '100%', alignItems: 'baseline', gap: 8, background: 'none', border: 0, padding: '8px 4px', cursor: 'pointer', font: 'inherit', textAlign: 'left', borderRadius: 'var(--r-sm)' }}
      >
        <span style={{ alignSelf: 'center', color: 'var(--ink-4)' }}>
          <Chevron open={open} />
        </span>
        <span style={{ ...MONO, fontSize: 12, fontWeight: 700, color: 'var(--ink)', width: 54, flex: 'none' }}>{d.symbol}</span>
        <span style={{ fontSize: 13, color: 'var(--ink-2)', flex: 1, minWidth: 0 }}>
          {d.title}
          <span style={{ ...MONO, fontSize: 9, color: 'var(--ink-4)', marginLeft: 6, letterSpacing: '0.02em' }}>{d.eq}</span>
        </span>
        {d.flag && (
          <span style={{ alignSelf: 'center' }}>
            <Badge color="var(--amber)">{d.flag}</Badge>
          </span>
        )}
        {d.value !== null && (
          <span style={{ alignSelf: 'center' }}>
            <TagBadge tag={typeof d.value === 'string' ? 'default' : 'derived'} />
          </span>
        )}
        <span style={{ ...MONO, fontSize: 12, color: d.value === null ? 'var(--ink-4)' : 'var(--ink)', whiteSpace: 'nowrap', flex: 'none' }}>
          {fmt(d.value)}
          {d.value !== null && typeof d.value === 'number' && <span style={{ color: 'var(--ink-4)' }}> {d.unit}</span>}
        </span>
      </button>

      {open && (
        <div style={{ paddingLeft: 40, paddingBottom: 12 }}>
          <p style={{ ...MONO, margin: 0, fontSize: 10, color: 'var(--ink-4)', letterSpacing: '0.02em' }}>{d.per}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, fontStyle: 'italic', color: 'var(--ink-3)', lineHeight: 1.5 }}>{d.plain}</p>
          <div style={{ ...MONO, fontSize: 11, color: 'var(--ink-2)', marginTop: 8 }}>{d.formula}</div>
          {d.value === null && d.dashLine && (
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>— {d.dashLine}</div>
          )}
          {d.where.length > 0 && (
            <>
              <div className="eyebrow solo" style={{ fontSize: 9, color: 'var(--ink-4)', marginTop: 12 }}>where</div>
              <div style={{ marginTop: 4 }}>
                {d.where.map((line) => (
                  <Line key={line.key} line={line} values={values} set={set} technology={technology} />
                ))}
              </div>
            </>
          )}
          {d.panel && (
            <Panel title={d.panel.title} text={d.panel.text} compact={d.panel.kind === 'amber'}>
              {d.panel.field === 'fnrb' && (
                <FnrbBoxes
                  value={values.fnrb_value ?? ''}
                  source={values.fnrb_source ?? ''}
                  onValue={(v) => set({ fnrb_value: v })}
                  onSource={(v) => set({ fnrb_source: v })}
                  label="Your project's own fNRB"
                />
              )}
            </Panel>
          )}
          {typeof d.value === 'number' && (
            <div style={{ ...MONO, marginTop: 8, padding: '4px 8px', borderRadius: 'var(--r-sm)', background: 'color-mix(in oklab, var(--tide) 6%, transparent)', fontSize: 11, color: 'var(--ink-3)' }}>
              {d.symbol} = <span style={{ color: 'var(--tide-text)' }}>{fmt(d.value)} {d.unit}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
      style={{ display: 'block', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur) var(--ease)', flexShrink: 0 }}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function Line({ line, values, set, technology }: { line: SheetLine; values: PackValues; set: (patch: PackValues) => void; technology?: string }) {
  const spec = line.slider ? SLIDERS[line.slider] : undefined;
  const cite = line.source?.registryId ? safeCitation(line.source.registryId, line.source.section, line.source.page) : null;
  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--ink-2)', flex: '1 1 200px', minWidth: 0 }}>{line.label}</span>
        {line.chip && <SdwsChip>{line.chip}</SdwsChip>}
        {SHOWN.marks && line.mark && <MarkBadge mark={line.mark} />}
        {line.tag && <TagBadge tag={line.tag} />}
        {SHOWN.pencils && <Pencil />}
        {spec ? (
          <SliderControl spec={spec} value={typeof line.value === 'number' ? line.value : null} onChange={(v) => set({ [`slider_${spec.key}`]: String(v) })} />
        ) : line.field && BOX_FIELDS.has(line.field) ? (
          <FieldBox
            field={line.field}
            values={values}
            set={set}
            placeholder={typeof line.value === 'number' ? fmt(line.value) : undefined}
            technology={technology}
          />
        ) : (
          <span style={{ ...MONO, fontSize: 11, color: line.value === null ? 'var(--ink-4)' : 'var(--ink)', whiteSpace: 'nowrap' }}>
            {fmt(line.value, line.unit)}
            {line.value !== null && line.unit && <span style={{ color: 'var(--ink-4)' }}>{line.unit === '%' ? '%' : ` ${line.unit}`}</span>}
          </span>
        )}
      </div>
      {line.note && (
        <div style={{ fontSize: 10, color: 'var(--ink-4)', lineHeight: 1.5 }}>
          {line.note}
          {cite && (
            <>
              {' · '}
              <a className="wb-cite-link" href={cite.href} target="_blank" rel="noreferrer" title={cite.full}>
                {cite.document}
              </a>
            </>
          )}
        </div>
      )}
      {spec && <div style={{ fontSize: 10, color: 'var(--ink-3)', fontStyle: 'italic', lineHeight: 1.5 }}>{spec.credits}</div>}
      {line.warn && <p style={{ margin: '2px 0 0', fontSize: 10, color: 'var(--ink-2)', paddingLeft: 8, borderLeft: '2px solid var(--amber)' }}>{line.warn}</p>}
    </div>
  );
}

function safeCitation(id: string, section?: string, page?: string): Citation | null {
  try {
    return registryCitation(id, section ?? '', page ?? '');
  } catch {
    return null;
  }
}

/* --------------------------------------------------------------------------
   Controls.
   -------------------------------------------------------------------------- */

function SliderControl({ spec, value, onChange }: { spec: SliderSpec; value: number | null; onChange: (v: number) => void }) {
  const unit = spec.percent ? '%' : spec.key === 'operationalDays' ? 'd' : 'L';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none', alignSelf: 'center' }}>
      <input
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value ?? spec.min}
        disabled={value === null}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={spec.label}
        style={{ width: 120, accentColor: 'var(--tide)' }}
      />
      <span style={{ ...MONO, fontSize: 11, color: value === null ? 'var(--ink-4)' : 'var(--ink)', width: 44, textAlign: 'right' }}>
        {value === null ? '—' : spec.percent ? Math.round(value * 100) : fmt(value)}
      </span>
      <span style={{ ...MONO, fontSize: 10, color: 'var(--ink-4)', minWidth: 18 }}>{unit}</span>
    </span>
  );
}

/** The rows that draw a box here. People served is typed in the strip above, and fNRB in its refusal panel. */
const BOX_FIELDS: ReadonlySet<CalvinFieldKey> = new Set<CalvinFieldKey>([
  'premises',
  'deviceClass',
  'deviceUnits',
  'householdSize',
  'energySource',
  'energyAmount',
]);

function FieldBox({
  field,
  values,
  set,
  placeholder,
  technology,
}: {
  field: CalvinFieldKey;
  values: PackValues;
  set: (patch: PackValues) => void;
  /** The value in force when nothing is typed — a derived count, shown as the box's hint. */
  placeholder?: string;
  /** The project's class, so the device list offers only Table 10's classes for it. */
  technology?: string;
}) {
  if (field === 'energySource') {
    return (
      <Segmented
        options={ENERGY_SOURCES.map((s) => ({ value: s, label: s === 'grid' ? 'grid' : s }))}
        value={values.energySource ?? ''}
        onChange={(v) => set({ energySource: v, ...(v === 'none' ? { energyAmount: '' } : {}) })}
        label={CALVIN_FIELDS.energySource.label}
      />
    );
  }
  if (field === 'deviceClass') {
    return (
      <select
        className="t-mono wb-calc-input"
        style={{ width: 230, textAlign: 'left' }}
        value={values.deviceClass ?? ''}
        onChange={(e) => set({ deviceClass: e.target.value })}
        aria-label={CALVIN_FIELDS.deviceClass.label}
      >
        <option value="">Choose the kind of device</option>
        {Object.entries(EMBODIED_CATEGORIES)
          .filter(([, c]) => !technology || c.technology.split('/').includes(technology))
          .map(([id, c]) => (
          <option key={id} value={id}>
            {c.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      className="t-mono wb-calc-input"
      inputMode="decimal"
      value={values[field] ?? ''}
      onChange={(e) => set({ [field]: e.target.value })}
      aria-label={CALVIN_FIELDS[field].label}
      placeholder={placeholder ?? CALVIN_FIELDS[field].kind}
      style={{ width: 72, padding: '1px 6px', alignSelf: 'center' }}
    />
  );
}

function FnrbBoxes({ value, source, onValue, onSource, label }: { value: string; source: string; onValue: (v: string) => void; onSource: (v: string) => void; label: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <input className="t-mono wb-calc-input" style={{ width: 72, padding: '1px 6px' }} inputMode="decimal" value={value} onChange={(e) => onValue(e.target.value)} aria-label={`${label}, value`} placeholder="0 to 1" />
      <input
        className="wb-calc-input"
        style={{ width: 260, textAlign: 'left' }}
        value={source}
        onChange={(e) => onSource(e.target.value)}
        aria-label={`${label}, source`}
        placeholder="where it came from — document and page"
      />
    </div>
  );
}

function Segmented({ options, value, onChange, label }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div style={{ display: 'flex', flex: 'none', flexWrap: 'wrap' }} role="group" aria-label={label}>
      {options.map((option, i) => {
        const on = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? '' : option.value)}
            className="t-mono wb-calc-seg"
            style={{
              borderTopLeftRadius: i === 0 ? 'var(--r-sm)' : 0,
              borderBottomLeftRadius: i === 0 ? 'var(--r-sm)' : 0,
              borderTopRightRadius: i === options.length - 1 ? 'var(--r-sm)' : 0,
              borderBottomRightRadius: i === options.length - 1 ? 'var(--r-sm)' : 0,
              borderLeftWidth: i === 0 ? 1 : 0,
              background: on ? 'color-mix(in oklab, var(--bot-calvin) 10%, var(--card))' : 'var(--card)',
              color: on ? 'var(--bot-calvin)' : 'var(--ink-3)',
              borderColor: on ? 'color-mix(in oklab, var(--bot-calvin) 40%, transparent)' : 'var(--line)',
              padding: '3px 9px',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Badges, rules and panels.
   -------------------------------------------------------------------------- */

const TAG_ROLE: Record<Tag, string> = {
  entered: 'var(--iris)',
  default: 'var(--ink-4)',
  derived: 'var(--ink-4)',
  assumed: 'var(--amber)',
};

function TagBadge({ tag }: { tag: Tag }) {
  return <Badge color={TAG_ROLE[tag]}>{tag}</Badge>;
}

/** The one small badge: 8px mono on a 12% wash with a 40% inset line. States, marks and data-sheet chips share it. */
function Badge({ color, children, upper = true }: { color: string; children: ReactNode; upper?: boolean }) {
  return (
    <span
      style={{
        ...MONO,
        flex: 'none',
        fontSize: 8,
        letterSpacing: '0.06em',
        textTransform: upper ? 'uppercase' : 'none',
        padding: '0 4px',
        borderRadius: 'var(--r-sm)',
        color: 'var(--ink)',
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${color} 40%, transparent)`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** "V2.0 SDWS 11" — the data sheet a value belongs to. */
function SdwsChip({ children }: { children: ReactNode }) {
  return (
    <Badge color="var(--tide)" upper={false}>
      {children}
    </Badge>
  );
}

/** The pencil — built and switched off on read-only rows (§2.4). */
function Pencil() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, color: 'var(--iris)', opacity: 0.85 }}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function MarkBadge({ mark }: { mark: 'baseline' | 'monitoring' }) {
  return <Badge color={mark === 'baseline' ? 'var(--tide-text)' : 'var(--slate)'}>{mark}</Badge>;
}

/** One step below a section: smaller, no rule, with its one plain line. */
function SubHeader({ label, note }: { label: string; note: string }) {
  return (
    <div style={{ marginTop: 8, paddingLeft: 26 }}>
      <span style={{ ...MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>{label}</span>
      <p style={{ margin: '2px 0 4px', fontSize: 11, fontStyle: 'italic', color: 'var(--ink-3)' }}>{note}</p>
    </div>
  );
}

function SectionRule({ children }: { children: ReactNode }) {
  return (
    <div style={{ marginTop: 12, paddingTop: 4, paddingBottom: 4 }}>
      <span className="eyebrow">{children}</span>
    </div>
  );
}

function Panel({ title, text, compact, children }: { title: string; text: string; compact?: boolean; children?: ReactNode }) {
  return (
    <div
      style={{
        marginTop: 8,
        padding: compact ? 8 : 16,
        borderRadius: compact ? 'var(--r-md)' : 'var(--r-lg)',
        border: '1px solid var(--amber)',
        background: 'color-mix(in oklab, var(--amber) 8%, transparent)',
      }}
    >
      <span className="eyebrow" style={{ color: 'var(--amber)', fontSize: compact ? 9 : 11 }}>{title}</span>
      <p style={{ margin: compact ? '4px 0 0' : '8px 0 0', fontSize: compact ? 10 : 13, color: compact ? 'var(--ink-3)' : 'var(--ink)', lineHeight: 1.55 }}>{text}</p>
      {children}
    </div>
  );
}

/** "What the tags mean" and "What the marks mean" — built and switched off (§2.4). */
function TagLegend() {
  return (
    <div className="t-caption" style={{ fontSize: 10.5, marginTop: 10, lineHeight: 1.6 }}>
      <div>
        What the tags mean: <strong>entered</strong> — you said it · <strong>default</strong> — a cited value, used as
        published · <strong>derived</strong> — worked out from other values · <strong>assumed</strong> — a figure you
        set that no source gives.
      </div>
      <div>
        What the marks mean: <MarkBadge mark="baseline" /> a baseline survey sets this value · <MarkBadge mark="monitoring" /> monitoring sets
        this value.
      </div>
    </div>
  );
}

/** The fNRB · vintage · defaults · fallback strip — built and switched off (§2.4). */
function ProvenanceStrip() {
  return <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--line)' }}>fNRB · vintage · defaults · fallback dial(s) fired</div>;
}

/** The paid left rail's analysis basis — built and switched off; the free site screens ex-ante only. */
function AnalysisBasis() {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="t-mono" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Analysis basis</div>
      <Segmented options={[{ value: 'ex-ante', label: 'Ex-ante' }, { value: 'ex-post', label: 'Ex-post' }]} value="ex-ante" onChange={() => undefined} label="Basis" />
      <p className="t-caption" style={{ fontSize: 10, margin: '4px 0 0' }}>Values live inside their formula rows.</p>
    </div>
  );
}

/** The paid left rail's save area — built and switched off; this site's save door is in the right rail. */
function SaveArea() {
  return (
    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
      <span className="chip">modified · unsaved</span>
      <button type="button" className="wb-row-action">Save changes</button>
      <button type="button" className="wb-row-action">Export report (PDF)</button>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The water column — VWBA 2.0 D-3, fed the carbon side's people count (§2.5).
   -------------------------------------------------------------------------- */

function WaterCard({
  own,
  values,
  people,
  result,
  setWater,
}: {
  own: PackValues;
  values: PackValues;
  people: { people: number; derived: boolean } | null;
  result: ReturnType<typeof VWBA_D3.compute>;
  setWater: (patch: PackValues) => void;
}) {
  const opening = waterLitresOpening(own.access_level);
  const moved = (own.lpcd ?? '').trim() !== '';
  const litres = moved ? Number(own.lpcd) : opening ?? null;
  const steps: FormulaStep[] = VWBA_D3.formula(values);
  const gateKeys = ['activity_is_wash_supply', 'quality_ok', 'access_ok'];
  const field = (key: string) => VWBA_D3.fields.find((f) => f.key === key)!;
  const d3Cite = VWBA_D3.citation;

  return (
    <section aria-label="Water" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', padding: '14px 20px 14px', marginTop: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, paddingBottom: 4 }}>
        <span className="eyebrow">VWBA 2.0 · D-3 · derivation</span>
        <span style={{ ...MONO, fontSize: 10, color: 'var(--ink-4)' }}>{VWBA_D3.method.optionName}</span>
      </div>

      <SectionRule>Does this method fit?</SectionRule>
      {gateKeys.map((key) => (
        <WaterRow key={key} label={field(key).label} note={field(key).help}>
          <Segmented
            options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
            value={own[key] ?? ''}
            onChange={(v) => setWater({ [key]: v })}
            label={field(key).label}
          />
        </WaterRow>
      ))}

      {result.kind === 'blocked' ? (
        <Panel title="This method does not fit" text={result.stopReason}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 4 }}>{result.routeForward}</div>
        </Panel>
      ) : (
        <>
          <SectionRule>Volume provided</SectionRule>
          <WaterRow
            label="People served"
            note={people ? (people.derived ? 'the same count the carbon side uses — derived from households by the engine' : 'from the project record — the same count the carbon side uses') : 'Still needed: people served, above.'}
          >
            {people && <TagBadge tag={people.derived ? 'derived' : 'entered'} />}
            <span className="t-mono" style={{ fontSize: 11.5, color: people ? 'var(--ink)' : 'var(--ink-4)' }}>{people ? fmt(people.people) : '—'}</span>
          </WaterRow>
          <WaterRow label={field('access_level').label} note={field('access_level').help}>
            <Segmented
              options={field('access_level').choices ?? []}
              value={own.access_level ?? ''}
              onChange={(v) => setWater({ access_level: v })}
              label={field('access_level').label}
            />
          </WaterRow>
          <WaterRow
            label="Water per person per day"
            chip="VWBA 2.0 Table D3.3"
            note={
              opening === undefined
                ? 'Still needed: the access level, full or limited.'
                : moved
                  ? `A figure you set, not the table's (${opening} L, VWBA 2.0 D-3, Table D3.3, p. 46).`
                  : `default ${opening} L — ${own.access_level} access, VWBA 2.0 D-3, Table D3.3, p. 46`
            }
            credits={opening === undefined ? undefined : WATER_LITRES_SLIDER.credits}
          >
            {opening !== undefined && (
              <>
                <TagBadge tag={moved ? 'assumed' : 'default'} />
                <SliderControl spec={WATER_LITRES_SLIDER} value={litres} onChange={(v) => setWater({ lpcd: String(v) })} />
              </>
            )}
          </WaterRow>
          {(['days', 'capacity_lpy', 'without_lpy'] as const).map((key) => {
            const f = field(key);
            const fallback = VWBA_D3.defaultFor(key, own);
            return (
              <WaterRow key={key} label={f.label} note={f.help}>
                {(own[key] ?? '').trim() !== '' ? <TagBadge tag="entered" /> : fallback ? <TagBadge tag="default" /> : null}
                <input
                  className="t-mono wb-calc-input"
                  inputMode="decimal"
                  value={own[key] ?? ''}
                  placeholder={fallback ?? f.placeholder ?? ''}
                  onChange={(e) => setWater({ [key]: e.target.value })}
                  aria-label={f.label}
                />
                <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-4)', width: 70 }}>{f.unit}</span>
              </WaterRow>
            );
          })}

          <SectionRule>The formula</SectionRule>
          {steps.map((step) => (
            <div key={step.label} style={{ borderBottom: '1px solid var(--line)', padding: '6px 0' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontSize: 11.5, color: 'var(--ink-2)', flex: 1 }}>{step.label}</span>
                {step.value !== null && <TagBadge tag="derived" />}
                <span className="t-mono" style={{ fontSize: 12, color: step.value === null ? 'var(--ink-4)' : 'var(--ink)' }}>
                  {step.value ?? '—'} <span style={{ fontSize: 10, color: 'var(--ink-4)' }}>{step.unit}</span>
                </span>
              </div>
              <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
                {step.terms} · <span style={{ color: 'var(--ink-2)' }}>{step.live}</span>
              </div>
            </div>
          ))}
          {result.kind === 'incomplete' && <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 6 }}>— {result.missing}</div>}
        </>
      )}

      <p className="t-caption" style={{ margin: '10px 0 0', fontSize: 9.5, lineHeight: 1.55 }}>
        <span style={{ color: 'var(--ink-4)' }}>Method · </span>
        {d3Cite.document} · {d3Cite.version} · {d3Cite.section} · {d3Cite.page} ·{' '}
        <a className="wb-cite-link" href={d3Cite.href} target="_blank" rel="noreferrer" title={d3Cite.full}>
          {d3Cite.href}
        </a>
      </p>
      <p className="t-caption" style={{ margin: '4px 0 0', fontSize: 9.5 }}>
        Screening estimate produced on this site, not by the publisher. Anticipated, not delivered and not verified.
      </p>
    </section>
  );
}

function WaterRow({ label, note, chip, credits, children }: { label: string; note?: string; chip?: string; credits?: string; children?: ReactNode }) {
  return (
    <div style={{ padding: '6px 0', borderTop: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--ink-2)', flex: '1 1 240px', minWidth: 0 }}>{label}</span>
        {chip && <SdwsChip>{chip}</SdwsChip>}
        {children}
      </div>
      {note && <div style={{ fontSize: 10, color: 'var(--ink-4)', lineHeight: 1.5 }}>{note}</div>}
      {credits && <div style={{ fontSize: 10, color: 'var(--ink-3)', fontStyle: 'italic', lineHeight: 1.5 }}>{credits}</div>}
    </div>
  );
}
