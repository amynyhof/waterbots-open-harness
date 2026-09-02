/**
 * The Quantification worksheet — Calvin's centre console.
 *
 * Step 3 of the console's journey: what benefit would this project produce?
 * Same shell as Eligibility — left rail, centre worksheet, right agent dock.
 *
 * THE SHAPE, top to bottom, is the maintainer's ruling of 1 Sep 2026:
 *
 *   1. A tab strip of packs, so the family is visible from the first day.
 *   2. A header carrying the pack's name, what it measures, and the big result.
 *   3. "Does this pack fit?" — the gates as one compact row, not a stack.
 *   4. The formula, written out, with live values dropped into it.
 *   5. The variables, one explained row each.
 *   6. The result, with its citation and its screening tag.
 *
 * A FAILED GATE REPLACES THE FORMULA AND THE VARIABLES with a stop card that
 * names where to go instead. A project that does not fit is not left filling in
 * a form it should not be filling in.
 *
 * THE LOOK is the house calculator's, from the reference the maintainer
 * brought in by hand: dense hairline rows, labels in --ink-2, values in mono
 * and right-aligned, provenance in a small caption, an em dash where a figure
 * is absent. THE BIG RESULT NUMBER IS THIS SITE'S OWN — her ruling of 31 Aug
 * stands over the reference, which carries no large number anywhere.
 *
 * NOTHING HERE IS TYPED TO ANY ONE METHOD. The fields, the gates, the
 * groupings, the defaults, the formula, the arithmetic, the headline and its
 * unit all come from the pack. This file knows how to draw a question, a
 * formula line and a figure; it does not know what D-3 or a tonne of CO₂ is,
 * and it must never learn.
 *
 * THREE LIVE TABS FROM 2 Sep 2026 — the water pack and two carbon packs (item
 * K6) — so the strip is now selectable, and the selected pack is held by the
 * shell as part of the visit. A COMPARISON CARD appears when two packs the
 * registry pairs both have a complete answer. It reads two headlines and
 * subtracts; it never fills a side in.
 *
 * THE ANSWERS LIVE IN THE SHELL, not here — part of the visit
 * (src/lib/visit.ts), so the desk can read Calvin's figure and a step away
 * to the map and back does not lose what was typed. Item S11.
 *
 * THE GATES MOVE INTO CALVIN'S CONVERSATION when his chat goes live, and these
 * toggles fill from his answers then. Not this sprint.
 */

import { useMemo, useState } from 'react';
import type { Citation } from '../lib/citation';
import {
  METHOD_PACKS,
  PACK_COMPARISONS,
  livePacks,
  packByKey,
  type Figure,
  type FormulaStep,
  type MethodPack,
  type PackField,
  type PackResult,
  type PackValues,
} from '../lib/methodPacks';

const num = (n: number, decimals: number) =>
  n.toLocaleString('en-GB', { maximumFractionDigits: decimals });

export default function QuantificationWorksheet({
  activeKey,
  onSelect,
  allValues,
  onChange,
}: {
  /** The selected pack's key, held by the shell. */
  activeKey: string;
  onSelect: (key: string) => void;
  /** Every pack's answers, keyed by pack, held by the shell as part of the visit. */
  allValues: Record<string, PackValues>;
  onChange: (packKey: string, values: PackValues) => void;
}) {
  const pack = packByKey(activeKey) ?? livePacks()[0] ?? null;
  const values: PackValues = (pack && allValues[pack.key]) || {};

  const set = (key: string, value: string) => pack && onChange(pack.key, { ...values, [key]: value });

  const result = useMemo(() => pack?.compute(values) ?? null, [pack, values]);
  const steps = useMemo(() => pack?.formula(values) ?? [], [pack, values]);

  const blocked = result?.kind === 'blocked' ? result : null;
  const field = (key: string) => pack?.fields.find((f) => f.key === key);
  const visible = (f: PackField) => !f.when || f.when(values);

  /* Every live pack's headline, for the tab strip and the comparison card. */
  const headlines = useMemo(() => {
    const out: Record<string, Figure | null> = {};
    for (const p of livePacks()) {
      const r = p.compute(allValues[p.key] || {});
      out[p.key] = r.kind === 'complete' ? r.headline : null;
    }
    return out;
  }, [allValues]);

  const exampleOn =
    pack?.example !== undefined && sameValues(values, pack.example.values);

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* THE SAME BOX AS THE ELIGIBILITY WORKSHEET — 880px wide, the same
          gutter — so the sheet's left and right edges land exactly where that
          worksheet's content does. Two free surfaces on one console that do
          not share a margin read as two different products. */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px var(--gutter) 64px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Quantification
        </div>

        <PackTabs activeKey={pack?.key ?? ''} headlines={headlines} onSelect={onSelect} />

        {/* THE SHEET THE SELECTED TAB OPENS INTO. One white surface, joined to
            its tab with no line between them — maintainer's ruling, 1 Sep 2026.
            Everything inside it is separated by hairlines rather than by a
            second fill: a card cannot contain a card. */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-md)',
            borderTopLeftRadius: pack && METHOD_PACKS[0]?.key === pack.key ? 0 : 'var(--r-md)',
            padding: '18px 20px 22px',
          }}
        >
          {!pack ? (
            <EmptySlot />
          ) : (
            <>
              {/* The transition delta, as the production calculator carries it:
                  one line under the tabs, on either side of the comparison,
                  and only when both sides have a complete answer. */}
              {PACK_COMPARISONS.filter(
                (c) => c.minuendKey === pack.key || c.subtrahendKey === pack.key
              ).map((c) => {
                const a = headlines[c.minuendKey];
                const b = headlines[c.subtrahendKey];
                const left = packByKey(c.minuendKey);
                const right = packByKey(c.subtrahendKey);
                if (!a || !b || !left || !right) return null;
                return <DeltaLine key={c.key} title={c.title} note={c.note} a={a} b={b} />;
              })}

              <Header pack={pack} result={result} exampleOn={exampleOn} />

              {pack.tiles && result && <Tiles figures={pack.tiles(values, result)} />}

              <MethodStrip pack={pack} values={values} />

              {pack.example && (
                <ExampleRow
                  pack={pack}
                  on={exampleOn}
                  onLoad={() => onChange(pack.key, { ...pack.example!.values })}
                  onClear={() => onChange(pack.key, {})}
                />
              )}

              <SectionHead>Does this pack fit?</SectionHead>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px 24px',
                  padding: '10px 0 12px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {pack.gateKeys.map((key) => {
                  const f = field(key);
                  return f && visible(f) ? (
                    <GateToggle
                      key={key}
                      field={f}
                      value={values[key] ?? ''}
                      onChange={(v) => set(key, v)}
                    />
                  ) : null;
                })}
              </div>

              {blocked ? (
                <StopCard stopReason={blocked.stopReason} routeForward={blocked.routeForward} />
              ) : (
                <>
                  <SectionHead>The formula</SectionHead>
                  {steps.map((step) => (
                    <FormulaRow key={step.label} step={step} />
                  ))}

                  <SectionHead>The variables</SectionHead>
                  {pack.variableKeys.map((key) => {
                    const f = field(key);
                    return f && visible(f) ? (
                      <Variable
                        key={key}
                        field={f}
                        value={values[key] ?? ''}
                        fallback={pack.defaultFor(key, values)}
                        extraHelp={pack.conditionalHelp(key, values)}
                        onChange={(v) => set(key, v)}
                      />
                    ) : null;
                  })}
                </>
              )}

              <SectionHead>The result</SectionHead>
              <ResultBlock pack={pack} result={result} blocked={Boolean(blocked)} />
            </>
          )}
        </div>

      </div>
    </div>
  );
}

function sameValues(a: PackValues, b: PackValues): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if ((a[k] ?? '') !== (b[k] ?? '')) return false;
  return true;
}

/* --------------------------------------------------------------------------
   The tab strip.
   -------------------------------------------------------------------------- */

/**
 * Every pack the console knows about, answering or not.
 *
 * The strip exists so the family is visible from the first day: this seat holds
 * more than one tool, and a strip with a single tab hides that.
 *
 * A LIVE TAB IS SELECTABLE. A PLANNED PACK IS NAMED, MARKED PLANNED, AND IS
 * NOT CLICKABLE — a tab that opened into something resembling a working tool
 * would be the same false success state a live-looking composer would be.
 */
function PackTabs({
  activeKey,
  headlines,
  onSelect,
}: {
  activeKey: string;
  headlines: Record<string, Figure | null>;
  onSelect: (key: string) => void;
}) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {METHOD_PACKS.map((p) => {
        const live = p.state === 'live';
        const on = live && p.key === activeKey;
        const h = live ? headlines[p.key] : null;
        const Tag = live ? 'button' : 'span';
        return (
          <Tag
            key={p.key}
            type={live ? 'button' : undefined}
            role={live ? 'tab' : undefined}
            aria-selected={live ? on : undefined}
            aria-disabled={!live}
            onClick={live ? () => onSelect(p.key) : undefined}
            title={live ? undefined : 'Planned. Not built yet.'}
            className={live ? 'wb-pack-tab' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 4,
              flex: 'none',
              padding: '8px 12px',
              borderRadius: 'var(--r-md) var(--r-md) 0 0',
              cursor: live ? (on ? 'default' : 'pointer') : 'not-allowed',
              /* THE SELECTED TAB OPENS INTO THE SHEET. It is the same white,
                 and its bottom edge is painted in that white so it covers the
                 sheet's own top hairline — the join a folder tab makes.
                 An unselected tab sits back on the Frost ground and keeps its
                 hairline, so the two read as different planes. */
              background: on ? 'var(--card)' : 'transparent',
              borderTop: `1px solid ${on ? 'var(--line)' : 'transparent'}`,
              borderLeft: `1px solid ${on ? 'var(--line)' : 'transparent'}`,
              borderRight: `1px solid ${on ? 'var(--line)' : 'transparent'}`,
              borderBottom: `1px solid ${on ? 'var(--card)' : 'var(--line)'}`,
              marginBottom: -1,
              font: 'inherit',
              textAlign: 'left',
            }}
          >
            {/* The small tag is where the accent lives. */}
            <span
              className="t-mono"
              style={{
                fontSize: 8,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '1px 5px',
                borderRadius: 'var(--r-pill)',
                color: 'var(--ink)',
                background: live
                  ? 'color-mix(in oklab, var(--bot-calvin) 12%, transparent)'
                  : 'color-mix(in oklab, var(--ink-4) 14%, transparent)',
                boxShadow: live
                  ? 'inset 0 0 0 1px color-mix(in oklab, var(--bot-calvin) 40%, transparent)'
                  : 'inset 0 0 0 1px color-mix(in oklab, var(--ink-4) 40%, transparent)',
              }}
            >
              {live ? (p as MethodPack).category : 'planned'}
            </span>
            <span style={{ fontSize: 13, color: live ? (on ? 'var(--ink)' : 'var(--ink-2)') : 'var(--ink-3)' }}>
              {p.name}
            </span>
            <span
              className="t-mono"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: live ? (h ? 'var(--ink)' : 'var(--ink-4)') : 'var(--ink-4)',
              }}
            >
              {live ? (h ? `${num(h.value, h.decimals)} ${h.unit}` : '—') : 'not built'}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}

/**
 * The method, said once.
 *
 * Not more questions and not a paste of the guidebook: what the pack reports,
 * the defining line in the method's own terms, and the lines the pack adds for
 * the current answers — the option in use, a cap, a stated simplification.
 */
function MethodStrip({ pack, values }: { pack: MethodPack; values: PackValues }) {
  return (
    <div
      /* No fill and no box: the sheet is already the white surface, and a card
         cannot contain a card. A hairline separates it instead. */
      style={{
        borderBottom: '1px solid var(--line)',
        padding: '11px 0 12px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'baseline' }}>
        <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>
          Indicator — <strong style={{ color: 'var(--ink)' }}>{pack.method.indicator}</strong>
        </span>
        <span className="t-mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
          {pack.method.indicatorUnit}
        </span>
      </div>
      <div
        className="t-mono"
        style={{ fontSize: 10, lineHeight: 1.7, color: 'var(--ink-2)', marginTop: 7 }}
      >
        {pack.method.definition}
      </div>
      {pack.method.lines(values).map((line, i) => (
        <div key={i} className="t-mono" style={{ fontSize: 10, lineHeight: 1.7, color: 'var(--ink-3)' }}>
          {line}
        </div>
      ))}
      <div className="t-caption" style={{ fontSize: 9.5, marginTop: 5 }}>
        {pack.method.optionName} · anticipated, screening, not verified.
      </div>
    </div>
  );
}

/** The worked example, offered and labelled. Loading it is one click; so is clearing it. */
function ExampleRow({
  pack,
  on,
  onLoad,
  onClear,
}: {
  pack: MethodPack;
  on: boolean;
  onLoad: () => void;
  onClear: () => void;
}) {
  const ex = pack.example!;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '9px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <span className="t-caption" style={{ fontSize: 10.5, lineHeight: 1.5 }}>
        {ex.note}
      </span>
      <button type="button" className="wb-row-action" style={{ flex: 'none' }} onClick={on ? onClear : onLoad}>
        {on ? 'Clear the example' : `Use the example figures`}
      </button>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The header, carrying the big result.
   -------------------------------------------------------------------------- */

function Header({
  pack,
  result,
  exampleOn,
}: {
  pack: MethodPack;
  result: PackResult | null;
  exampleOn: boolean;
}) {
  const h = result?.kind === 'complete' ? result.headline : null;

  return (
    <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1 style={{ fontSize: 19, margin: '0 0 5px', letterSpacing: '-0.015em' }}>{pack.name}</h1>
          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              lineHeight: 1.6,
              color: 'var(--ink-2)',
              maxWidth: '52ch',
            }}
          >
            {pack.measures}
          </p>
          <div style={{ marginTop: 9, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Chip>Screening · not verified</Chip>
            {exampleOn && pack.example && <Chip muted>{pack.example.label}</Chip>}
          </div>
        </div>

        {/* The big result. An em dash until there is a figure to show. */}
        <div style={{ flex: 'none', textAlign: 'right', minWidth: 185 }}>
          <div
            className="t-mono"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
            }}
          >
            {pack.headlineLabel}
          </div>
          {/* The number sits on white in ink. The accent belongs on the small
              tags, not behind a figure this size — maintainer's ruling,
              1 Sep 2026. An empty slot keeps its dashed outline, so the eye
              knows a number lands here before one does. */}
          <div
            className="t-mono"
            style={{
              fontSize: 38,
              fontWeight: 500,
              lineHeight: 1.1,
              marginTop: 5,
              padding: '8px 14px',
              borderRadius: 'var(--r-sm)',
              background: 'transparent',
              border:
                h === null
                  ? '1px dashed color-mix(in oklab, var(--ink-4) 65%, transparent)'
                  : '1px solid transparent',
              color: h === null ? 'var(--ink-4)' : 'var(--ink)',
            }}
          >
            {h === null ? '—' : num(h.value, h.decimals)}
          </div>
          <div className="t-mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>
            {h === null ? '' : h.unit}
          </div>
          <div className="t-mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', marginTop: 3 }}>
            {h?.secondary ?? '—'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Gates, formula, variables, result.
   -------------------------------------------------------------------------- */

/** A gate as one compact toggle with a single line under it. */
function GateToggle({
  field,
  value,
  onChange,
}: {
  field: PackField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ flex: '1 1 225px', minWidth: 200 }}>
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}
      >
        <span style={{ fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.35 }}>
          {field.label}
          {!field.required && (
            <span
              className="t-mono"
              style={{
                fontSize: 8.5,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-4)',
                marginLeft: 6,
              }}
            >
              optional
            </span>
          )}
        </span>
        <Segmented
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={value}
          onChange={onChange}
          label={field.label}
        />
      </div>
      <div style={{ fontSize: 9.5, lineHeight: 1.5, color: 'var(--ink-3)', marginTop: 3 }}>
        {field.help}
      </div>
    </div>
  );
}

/** The stop card. It replaces the formula and the variables entirely. */
function StopCard({ stopReason, routeForward }: { stopReason: string; routeForward: string }) {
  return (
    <div
      style={{
        marginTop: 16,
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-md)',
        background: 'transparent',
        padding: '15px 17px',
      }}
    >
      <div
        className="t-mono"
        style={{
          fontSize: 9.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--bot-calvin)',
          marginBottom: 7,
        }}
      >
        This pack does not fit
      </div>
      <p style={{ margin: '0 0 9px', fontSize: 12.5, lineHeight: 1.65, color: 'var(--ink-2)' }}>
        {stopReason}
      </p>
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: 'var(--ink-3)' }}>
        {routeForward}
      </p>
    </div>
  );
}

/**
 * One line of the formula, in the production calculator's row anatomy: the
 * method's symbol, what the line works out, the equation number, the value.
 * Then the same line with the visitor's figures in it. A pack with no symbol
 * or equation number simply leaves those columns empty.
 */
function FormulaRow({ step }: { step: FormulaStep }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)', padding: '7px 0' }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'baseline',
        }}
      >
        {step.symbol && (
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink)', flex: 'none', minWidth: 34 }}>
            {step.symbol}
          </span>
        )}
        <span style={{ fontSize: 11.5, color: 'var(--ink-2)', flex: 1, minWidth: 0 }}>{step.label}</span>
        {step.eq && (
          <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-4)', flex: 'none' }}>
            {step.eq}
          </span>
        )}
        <span
          className="t-mono"
          style={{
            fontSize: 12,
            whiteSpace: 'nowrap',
            color: step.value === null ? 'var(--ink-4)' : 'var(--ink)',
          }}
        >
          {step.value ?? '—'}
          {step.unit && (
            <span style={{ color: 'var(--ink-4)', marginLeft: 6, fontSize: 10 }}>{step.unit}</span>
          )}
        </span>
      </div>
      <div
        className="t-mono"
        style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.55, overflowWrap: 'anywhere' }}
      >
        {step.terms}
        <span style={{ color: 'var(--ink-4)' }}> · </span>
        <span style={{ color: 'var(--ink-2)' }}>{step.live}</span>
      </div>
    </div>
  );
}

/** One variable: the input, where its value came from, and what it means. */
function Variable({
  field,
  value,
  fallback,
  extraHelp,
  onChange,
}: {
  field: PackField;
  value: string;
  fallback: string | null;
  extraHelp: string | null;
  onChange: (v: string) => void;
}) {
  const [why, setWhy] = useState(false);
  const provenance = value.trim() !== '' ? 'Entered' : fallback ? `Default — ${fallback}` : null;

  return (
    <>
      {field.group && (
        <div
          className="t-mono"
          style={{
            fontSize: 9.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
            padding: '12px 0 2px',
          }}
        >
          {field.group}
        </div>
      )}
      <div style={{ borderBottom: '1px solid var(--line)', padding: '7px 0 6px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
        >
          <label style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.45 }}>
            {field.label}
            {field.required && (
              <span
                className="t-mono"
                style={{
                  fontSize: 8.5,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-4)',
                  marginLeft: 7,
                }}
              >
                required
              </span>
            )}
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 'none' }}>
            {field.kind === 'number' ? (
              <input
                className="t-mono wb-calc-input"
                type="text"
                inputMode="decimal"
                value={value}
                placeholder={fallback ?? field.placeholder ?? ''}
                onChange={(e) => onChange(e.target.value)}
                aria-label={field.label}
              />
            ) : (
              <Segmented
                options={field.choices ?? []}
                value={value}
                onChange={onChange}
                label={field.label}
              />
            )}
            {field.unit && field.kind === 'number' && (
              <span
                className="t-mono"
                style={{ fontSize: 10, color: 'var(--ink-4)', whiteSpace: 'nowrap', width: 84 }}
              >
                {field.unit}
              </span>
            )}
          </div>
        </div>

        <div style={{ fontSize: 9.5, lineHeight: 1.55, color: 'var(--ink-3)', marginTop: 2 }}>
          {field.help}
          {provenance && (
            <span className="t-mono" style={{ marginLeft: 8, color: 'var(--ink-4)', fontSize: 9 }}>
              {provenance}
            </span>
          )}
          {field.why && (
            <button
              type="button"
              onClick={() => setWhy((v) => !v)}
              aria-expanded={why}
              className="t-mono"
              style={{
                marginLeft: 8,
                padding: 0,
                border: 0,
                background: 'none',
                cursor: 'pointer',
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--bot-calvin)',
              }}
            >
              why
            </button>
          )}
        </div>

        {why && field.why && (
          <p
            style={{
              margin: '5px 0 3px',
              fontSize: 10.5,
              lineHeight: 1.65,
              color: 'var(--ink-3)',
              maxWidth: '68ch',
            }}
          >
            {field.why}
          </p>
        )}

        {extraHelp && (
          <p
            style={{
              margin: '5px 0 3px',
              fontSize: 10.5,
              lineHeight: 1.65,
              color: 'var(--ink-3)',
              maxWidth: '68ch',
              borderLeft: '2px solid color-mix(in oklab, var(--bot-calvin) 35%, transparent)',
              paddingLeft: 8,
            }}
          >
            {extraHelp}
          </p>
        )}
      </div>
    </>
  );
}

function ResultBlock({
  pack,
  result,
  blocked,
}: {
  pack: MethodPack;
  result: PackResult | null;
  blocked: boolean;
}) {
  const figures =
    result && (result.kind === 'incomplete' || result.kind === 'complete') ? result.figures : [];
  const missing = result?.kind === 'incomplete' ? result.missing : null;

  return (
    <div style={{ paddingTop: 4 }}>
      {!blocked &&
        figures.map((f) => (
          <Row
            key={f.key}
            label={f.label}
            value={num(f.value, f.decimals)}
            unit={f.unit}
            note={f.note ?? f.secondary}
          />
        ))}
      {!blocked && missing && (
        <Row label="Still needed" value={null} note={missing} />
      )}

      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}
      >
        <Chip>Screening · consultant review</Chip>
        <span className="t-caption" style={{ fontSize: 10 }}>
          Anticipated. Not delivered, and not verified.
        </span>
      </div>

      <CiteLine citation={pack.citation} lead="Method" />
      {pack.alsoCites?.map((c) => (
        <CiteLine key={c.href + c.section} citation={c} lead="Defaults" />
      ))}
      <p className="t-caption" style={{ margin: '6px 0 0', fontSize: 9.5, lineHeight: 1.55 }}>
        Screening estimate produced by this console, not by the publisher. No standards body endorses
        or certifies it.
      </p>
    </div>
  );
}

function CiteLine({ citation, lead }: { citation: Citation; lead: string }) {
  return (
    <p
      className="t-caption"
      style={{ margin: '10px 0 0', fontSize: 9.5, lineHeight: 1.55, color: 'var(--ink-3)' }}
    >
      <span style={{ color: 'var(--ink-4)' }}>{lead} · </span>
      {citation.document} · {citation.version} · {citation.section} · {citation.page} ·{' '}
      <a className="wb-cite-link" href={citation.href} target="_blank" rel="noreferrer" title={citation.full}>
        {citation.href}
      </a>
    </p>
  );
}

/* --------------------------------------------------------------------------
   The transition delta line and the stat tiles — the production calculator's
   idiom, from the saved page the maintainer brought in by hand on 2 Sep 2026.
   The look only: a caption, a mono figure with its percent in brackets, and a
   one-line note; then a row of small tiles, value over label over unit.
   -------------------------------------------------------------------------- */

function DeltaLine({ title, note, a, b }: { title: string; note: string; a: Figure; b: Figure }) {
  const delta = a.value - b.value;
  const pct = b.value === 0 ? null : (delta / b.value) * 100;
  const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '');
  const same = a.unit === b.unit;
  return (
    <div style={{ padding: '2px 0 12px', borderBottom: '1px solid var(--line)', marginBottom: 14 }}>
      <div className="t-caption" style={{ fontSize: 11, color: 'var(--ink-3)' }}>
        {title}:{' '}
        <span className="t-mono" style={{ color: 'var(--ink)', fontSize: 12 }}>
          {same ? `${sign(delta)}${num(Math.abs(delta), a.decimals)} ${a.unit}` : '—'}
          {same && pct !== null && ` (${sign(pct)}${num(Math.abs(pct), 1)}%)`}
        </span>
      </div>
      <div className="t-caption" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 3 }}>
        {note}
      </div>
    </div>
  );
}

function Tiles({ figures }: { figures: Figure[] }) {
  if (figures.length === 0) return null;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(figures.length, 4)}, minmax(0, 1fr))`,
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      {figures.map((f) => (
        <div key={f.key} style={{ minWidth: 0 }}>
          <div className="t-mono" style={{ fontSize: 15, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {num(f.value, f.decimals)}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-4)', marginTop: 2, lineHeight: 1.35 }}>{f.label}</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{f.unit}</div>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------------
   The comparison card. RETIRED 2 Sep 2026 by the look pass — the production
   calculator carries the transition as one line under the tabs, and so does
   this worksheet now. Kept out of the tree; DeltaLine replaced it.
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   Small shared pieces.
   -------------------------------------------------------------------------- */

function Segmented({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div style={{ display: 'flex', flex: 'none', flexWrap: 'wrap', justifyContent: 'flex-end' }} role="group" aria-label={label}>
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
              background: on
                ? 'color-mix(in oklab, var(--bot-calvin) 10%, var(--card))'
                : 'var(--card)',
              color: on ? 'var(--bot-calvin)' : 'var(--ink-3)',
              borderColor: on
                ? 'color-mix(in oklab, var(--bot-calvin) 40%, transparent)'
                : 'var(--line)',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Row({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: string | null;
  unit?: string;
  note?: string;
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)', padding: '4px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: 11,
          alignItems: 'baseline',
        }}
      >
        <span style={{ color: 'var(--ink-2)' }}>{label}</span>
        <span
          className="t-mono"
          style={{
            textAlign: 'right',
            color: value === null ? 'var(--ink-4)' : 'var(--ink)',
            whiteSpace: 'nowrap',
          }}
        >
          {value ?? '—'}
          {unit && (
            <span style={{ color: 'var(--ink-4)', marginLeft: 6, fontSize: 10 }}>{unit}</span>
          )}
        </span>
      </div>
      {note && (
        <div className="t-caption" style={{ fontSize: 9.5, marginTop: 1, lineHeight: 1.5 }}>
          {note}
        </div>
      )}
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="t-h4"
      style={{ fontSize: 13, fontWeight: 600, margin: '20px 0 2px', letterSpacing: '-0.01em' }}
    >
      {children}
    </h2>
  );
}

function Chip({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className="t-mono"
      style={{
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        padding: '4px 9px',
        borderRadius: 'var(--r-pill)',
        color: muted ? 'var(--ink-2)' : 'var(--bot-calvin)',
        background: muted
          ? 'color-mix(in oklab, var(--ink-4) 14%, transparent)'
          : 'color-mix(in oklab, var(--bot-calvin) 8%, transparent)',
        flex: 'none',
      }}
    >
      {children}
    </span>
  );
}

/** The honest empty slot. Kept for the day no pack can answer. */
function EmptySlot() {
  return (
    <div
      style={{
        border: '1px dashed color-mix(in oklab, var(--ink-4) 70%, transparent)',
        borderRadius: 'var(--r-md)',
        padding: '22px 20px',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>No method pack is fitted yet.</div>
      <p className="t-caption" style={{ margin: 0, maxWidth: '62ch', lineHeight: 1.7 }}>
        The step is built and the slot is empty. Its questions appear here when a pack is fitted to
        it.
      </p>
    </div>
  );
}
