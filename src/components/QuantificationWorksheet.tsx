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
 * THE FORMULA IDIOM — a tab strip, a big result, the formula written out with
 * live values in it, variables as explained rows — came from the prototype's
 * calculator. Its data, its revenue block, its "verified" language and its
 * agent panel were NOT taken and do not belong on this site.
 *
 * NOTHING HERE IS TYPED TO ANY ONE METHOD. The fields, the gates, the
 * groupings, the defaults, the formula and the arithmetic all come from the
 * pack. This file knows how to draw a question, a formula line and a result;
 * it does not know what D-3 is, and it must never learn.
 *
 * THE GATES MOVE INTO CALVIN'S CONVERSATION when his chat goes live, and these
 * toggles fill from his answers then. Not this sprint.
 */

import { useMemo, useState } from 'react';
import {
  METHOD_PACKS,
  cubicMetres,
  fittedPack,
  type FormulaStep,
  type MethodPack,
  type PackField,
  type PackResult,
  type PackValues,
} from '../lib/methodPacks';

const group = (n: number) => n.toLocaleString('en-GB');
const cubes = (n: number) => cubicMetres(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });

export default function QuantificationWorksheet() {
  const pack = fittedPack();
  const [values, setValues] = useState<PackValues>({});

  const set = (key: string, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const result = useMemo(() => pack?.compute(values) ?? null, [pack, values]);
  const steps = useMemo(() => pack?.formula(values) ?? [], [pack, values]);

  const blocked = result?.kind === 'blocked' ? result : null;
  const field = (key: string) => pack?.fields.find((f) => f.key === key);

  const benefit = result?.kind === 'complete' ? result.benefitLitres : null;
  /* The tab carries the pack's own headline figure, in the reported unit. */
  const headline = benefit === null ? null : `${cubes(benefit)} m³/yr`;
  const hasCapacity = (values.capacity_lpy ?? '').trim() !== '';

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px var(--gutter) 64px' }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Quantification
        </div>

        <PackTabs headline={headline} />

        {/* THE SHEET THE SELECTED TAB OPENS INTO. One white surface, joined to
            its tab with no line between them — maintainer's ruling, 1 Sep 2026.
            Everything inside it is separated by hairlines rather than by a
            second fill: a card cannot contain a card. */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-md)',
            borderTopLeftRadius: METHOD_PACKS[0]?.state === 'live' ? 0 : 'var(--r-md)',
            padding: '18px 20px 22px',
          }}
        >
        {!pack ? (
          <EmptySlot />
        ) : (
          <>
            <Header pack={pack} result={result} />

            <MethodStrip pack={pack} hasCapacity={hasCapacity} />

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
                return f ? (
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
                  return f ? (
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

/* --------------------------------------------------------------------------
   The tab strip.
   -------------------------------------------------------------------------- */

/**
 * Every pack the console knows about, answering or not.
 *
 * The strip exists so the family is visible from the first day: this seat holds
 * more than one tool, and a strip with a single tab hides that.
 *
 * A PLANNED PACK IS NAMED, MARKED PLANNED, AND IS NOT CLICKABLE. A tab that
 * opened into something resembling a working tool would be the same false
 * success state a live-looking composer would be.
 */
function PackTabs({ headline }: { headline: string | null }) {
  return (
    <div
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
        return (
          <span
            key={p.key}
            aria-disabled={!live}
            aria-current={live ? 'page' : undefined}
            title={live ? undefined : 'Planned. Not built yet.'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 4,
              flex: 'none',
              padding: '8px 12px',
              borderRadius: 'var(--r-md) var(--r-md) 0 0',
              cursor: live ? 'default' : 'not-allowed',
              /* THE SELECTED TAB OPENS INTO THE SHEET. It is the same white,
                 and its bottom edge is painted in that white so it covers the
                 sheet's own top hairline — the join a folder tab makes.
                 An unselected tab sits back on the Frost ground and keeps its
                 hairline, so the two read as different planes. */
              background: live ? 'var(--card)' : 'transparent',
              borderTop: `1px solid ${live ? 'var(--line)' : 'transparent'}`,
              borderLeft: `1px solid ${live ? 'var(--line)' : 'transparent'}`,
              borderRight: `1px solid ${live ? 'var(--line)' : 'transparent'}`,
              borderBottom: `1px solid ${live ? 'var(--card)' : 'var(--line)'}`,
              marginBottom: -1,
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
              {live ? 'live' : 'planned'}
            </span>
            <span style={{ fontSize: 13, color: live ? 'var(--ink)' : 'var(--ink-3)' }}>
              {p.name}
            </span>
            <span
              className="t-mono"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: live ? 'var(--ink)' : 'var(--ink-4)',
              }}
            >
              {live ? (headline ?? '—') : 'not built'}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * The method, said once.
 *
 * Not more questions and not a paste of the guidebook: what the pack reports,
 * the defining line in the method's own terms, and the one option actually in
 * use — so a reader can tell which of the method's several routes produced
 * their figure. The capping step appears only when a capacity was given.
 */
function MethodStrip({ pack, hasCapacity }: { pack: MethodPack; hasCapacity: boolean }) {
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
      <div className="t-mono" style={{ fontSize: 10, lineHeight: 1.7, color: 'var(--ink-3)' }}>
        {pack.method.optionLine}
      </div>
      {hasCapacity && (
        <div className="t-mono" style={{ fontSize: 10, lineHeight: 1.7, color: 'var(--ink-3)' }}>
          {pack.method.capacityLine}
        </div>
      )}
      <div className="t-caption" style={{ fontSize: 9.5, marginTop: 5 }}>
        {pack.method.optionName} · anticipated, screening, not verified.
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The header, carrying the big result.
   -------------------------------------------------------------------------- */

function Header({ pack, result }: { pack: MethodPack; result: PackResult | null }) {
  const benefit = result?.kind === 'complete' ? result.benefitLitres : null;

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
          <div style={{ marginTop: 9 }}>
            <Chip>Screening · not verified</Chip>
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
            Anticipated benefit
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
                benefit === null
                  ? '1px dashed color-mix(in oklab, var(--ink-4) 65%, transparent)'
                  : '1px solid transparent',
              color: benefit === null ? 'var(--ink-4)' : 'var(--ink)',
            }}
          >
            {benefit === null ? '—' : cubes(benefit)}
          </div>
          <div className="t-mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>
            m³ / year
          </div>
          <div className="t-mono" style={{ fontSize: 10.5, color: 'var(--ink-4)', marginTop: 3 }}>
            {benefit === null ? '—' : group(benefit)} L / year
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

/** One line of the formula: what it works out, then the same line with values. */
function FormulaRow({ step }: { step: FormulaStep }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)', padding: '7px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          alignItems: 'baseline',
        }}
      >
        <span style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{step.label}</span>
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
        style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.55 }}
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
  const withProject =
    result && (result.kind === 'incomplete' || result.kind === 'complete')
      ? result.withProjectLitres
      : null;
  const benefit = result?.kind === 'complete' ? result.benefitLitres : null;

  return (
    <div style={{ paddingTop: 4 }}>
      {!blocked && (
        <>
          <Row
            label="With the project"
            value={withProject === null ? null : group(withProject)}
            unit="L / year"
            note={withProject === null ? undefined : `${cubes(withProject)} m³ / year`}
          />
          <Row
            label="Anticipated benefit"
            value={benefit === null ? null : group(benefit)}
            unit="L / year"
            note={
              result?.kind === 'incomplete'
                ? result.missing
                : benefit === null
                  ? undefined
                  : `${cubes(benefit)} m³ / year`
            }
          />
        </>
      )}

      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}
      >
        <Chip>Screening · consultant review</Chip>
        <span className="t-caption" style={{ fontSize: 10 }}>
          Anticipated. Not delivered, and not verified.
        </span>
      </div>

      <p
        className="t-caption"
        style={{ margin: '10px 0 0', fontSize: 9.5, lineHeight: 1.55, color: 'var(--ink-3)' }}
      >
        {pack.citation.document} · {pack.citation.version} · {pack.citation.section} ·{' '}
        {pack.citation.page} ·{' '}
        <a className="wb-cite-link" href={pack.citation.href} target="_blank" rel="noreferrer">
          {pack.citation.href}
        </a>{' '}
        · CC BY 4.0. Screening estimate produced by this console, not by the publisher.
      </p>
    </div>
  );
}

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
    <div style={{ display: 'flex', flex: 'none' }} role="group" aria-label={label}>
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

function Chip({ children }: { children: React.ReactNode }) {
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
        color: 'var(--bot-calvin)',
        background: 'color-mix(in oklab, var(--bot-calvin) 8%, transparent)',
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
