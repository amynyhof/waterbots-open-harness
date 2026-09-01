/**
 * The Quantification worksheet — Calvin's centre console.
 *
 * Step 3 of the console's journey: what benefit would this project produce?
 * Same shell as Eligibility — left rail, centre worksheet, right agent dock.
 * No wizard, no standalone calculator page, no second layout.
 *
 * THE LOOK IS THE HOUSE CALCULATOR'S, so the free one and the paid one read as
 * cousins. Maintainer's instruction, 1 Sep 2026, working from a reference she
 * brought in by hand: dense hairline-separated rows, labels in --ink-2, values
 * in mono and right-aligned, provenance in a small caption underneath, and
 * section heads at 13px. An absent value is an em dash in --ink-4, which is
 * how the reference shows one too.
 *
 * WHAT WAS TAKEN FROM THE REFERENCE IS THE LOOK AND ONLY THE LOOK — spacing,
 * shapes, type, the number card. Not its questions, not its arithmetic, not
 * its paid-side features. Rule zero is unchanged: the reference arrived by the
 * maintainer's hand, which is the one sanctioned route.
 *
 * NOTHING HERE IS TYPED TO ANY ONE METHOD. Fields, gates, defaults and the
 * arithmetic all come from the pack. This file knows how to draw a question
 * and a result; it does not know what D-3 is, and it must never learn.
 */

import { useMemo, useState } from 'react';
import {
  cubicMetres,
  fittedPack,
  type PackField,
  type PackResult,
  type PackValues,
} from '../lib/methodPacks';

/** Litres, grouped, with no unit — the unit is its own column. */
const litres = (n: number) => n.toLocaleString('en-GB');
const cubes = (n: number) =>
  cubicMetres(n).toLocaleString('en-GB', { maximumFractionDigits: 2 });

export default function QuantificationWorksheet() {
  const pack = fittedPack();
  const [values, setValues] = useState<PackValues>({});

  const set = (key: string, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const result = useMemo(() => pack?.compute(values) ?? null, [pack, values]);

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px var(--gutter) 64px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Quantification
        </div>
        <h1 className="t-h3" style={{ margin: '0 0 8px' }}>
          What benefit would this project produce?
        </h1>
        <p
          className="t-body"
          style={{ margin: '0 0 22px', color: 'var(--ink-2)', maxWidth: '62ch', fontSize: 14 }}
        >
          Answer the questions and this step works out an early estimate. Nothing is filled in for
          you, and reloading clears it.
        </p>

        {!pack ? (
          <EmptySlot />
        ) : (
          <>
            {/* The pack fitted to the slot, named with its citation. */}
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                padding: '11px 14px',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{pack.name}</div>
                <div className="t-caption" style={{ marginTop: 1, fontSize: 11.5 }}>
                  {pack.scope}
                </div>
              </div>
              <Chip>Screening · not verified</Chip>
            </div>
            <p
              className="t-caption"
              style={{ margin: '7px 0 0', fontSize: 9.5, lineHeight: 1.5, color: 'var(--ink-3)' }}
            >
              {pack.citation.document} · {pack.citation.version} · {pack.citation.section} ·{' '}
              {pack.citation.page} ·{' '}
              <a className="wb-cite-link" href={pack.citation.href} target="_blank" rel="noreferrer">
                {pack.citation.href}
              </a>{' '}
              · CC BY 4.0. Screening estimate produced by this console, not by the publisher.
            </p>

            <SectionHead>Questions</SectionHead>
            {pack.fields.map((field) => (
              <Field
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                fallback={pack.defaultFor(field.key, values)}
                extraHelp={pack.conditionalHelp(field.key, values)}
                onChange={(v) => set(field.key, v)}
              />
            ))}

            <SectionHead>Anticipated volumetric water benefit</SectionHead>
            {result && <Result result={result} />}
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   The pieces.
   -------------------------------------------------------------------------- */

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="t-h4"
      style={{ fontSize: 13, fontWeight: 600, margin: '22px 0 4px', letterSpacing: '-0.01em' }}
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

/** The honest empty slot. Kept for the day a pack is withdrawn. */
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

/**
 * One question.
 *
 * The row is the reference's: label left, control right, hairline underneath,
 * and a small line below carrying the one-line help, where the value came
 * from, and the "why" toggle.
 */
function Field({
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
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
          <Control field={field} value={value} fallback={fallback} onChange={onChange} />
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

function Control({
  field,
  value,
  fallback,
  onChange,
}: {
  field: PackField;
  value: string;
  fallback: string | null;
  onChange: (v: string) => void;
}) {
  if (field.kind === 'number') {
    return (
      <input
        className="t-mono wb-calc-input"
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={fallback ?? field.placeholder ?? ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label={field.label}
      />
    );
  }

  const options =
    field.kind === 'yesno'
      ? [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]
      : (field.choices ?? []);

  return (
    <div style={{ display: 'flex', flex: 'none' }} role="group" aria-label={field.label}>
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

/** One result row: label left, mono value right, an em dash when absent. */
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

function Result({ result }: { result: PackResult }) {
  if (result.kind === 'blocked') {
    return (
      <div style={{ paddingTop: 4 }}>
        <Row label="Anticipated benefit" value={null} />
        <p style={{ margin: '10px 0 0', fontSize: 11.5, lineHeight: 1.65, color: 'var(--ink-2)' }}>
          {result.stopReason}
        </p>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: 11.5,
            lineHeight: 1.65,
            color: 'var(--ink-3)',
            borderLeft: '2px solid color-mix(in oklab, var(--bot-calvin) 35%, transparent)',
            paddingLeft: 9,
          }}
        >
          {result.routeForward}
        </p>
      </div>
    );
  }

  const withProject = result.kind === 'pending' ? null : result.withProjectLitres;
  const benefit = result.kind === 'complete' ? result.benefitLitres : null;

  return (
    <div style={{ paddingTop: 4 }}>
      {/* One row per figure. Litres is the stored unit and leads; cubic
          metres sits under it as the same number said the other way, rather
          than as a second row wearing the same label. */}
      <Row
        label="With the project"
        value={withProject === null ? null : litres(withProject)}
        unit="L / year"
        note={withProject === null ? undefined : `${cubes(withProject)} m³ / year`}
      />
      <Row
        label="Benefit (with − without)"
        value={benefit === null ? null : litres(benefit)}
        unit="L / year"
        note={
          result.kind === 'incomplete'
            ? result.missing
            : benefit === null
              ? undefined
              : `${cubes(benefit)} m³ / year`
        }
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 12,
          flexWrap: 'wrap',
        }}
      >
        <Chip>Screening · consultant review</Chip>
        <span className="t-caption" style={{ fontSize: 10 }}>
          Anticipated. Not delivered, and not verified.
        </span>
      </div>
    </div>
  );
}

