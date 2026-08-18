/**
 * Data & licences.
 *
 * Opened from the "Data & licences" link in Leaflet's attribution control,
 * which stays enabled and always carries the short credit line.
 *
 * This panel is where the full obligations are met. HydroSHEDS Exhibit B
 * requires its statement be displayed "in a reasonably prominent manner" in
 * "the documentation or metadata" of the product — one click from every view,
 * in body text at full contrast, alongside the same statement in the README.
 *
 * It also states how the values on screen were produced. A reader is entitled
 * to know which numbers are WRI's and which are ours.
 */

import { useEffect, useRef } from 'react';
import {
  AQUEDUCT_CITATION,
  AQUEDUCT_LICENCE,
  HYDROBASINS_CITATION,
  HYDROSHEDS_CITATION,
  HYDROSHEDS_EXHIBIT_B,
} from '../lib/licences';
import type { StressDocument } from '../lib/stress';

export default function LicencePanel({
  stressDoc,
  onClose,
}: {
  stressDoc: StressDocument | null;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1200,
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'color-mix(in srgb, var(--fg-1) 26%, transparent)',
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Data and licences"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="card card-document"
        style={{
          width: 'min(660px, 100%)',
          maxHeight: '100%',
          overflowY: 'auto',
          /* Shadows are reserved for floating elements. This is one. */
          boxShadow: '0 18px 48px rgba(11, 20, 40, 0.18)',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <h2 className="t-h3" style={{ margin: 0 }}>
            Data &amp; licences
          </h2>
          <button className="btn" onClick={onClose} aria-label="Close" style={{ padding: '4px 10px', flex: 'none' }}>
            Close
          </button>
        </div>

        <p className="t-body" style={{ color: 'var(--fg-2)', marginTop: 10, marginBottom: 0 }}>
          This map draws on two datasets, published under two different licences. Each carries its
          own attribution requirement.
        </p>

        <Section eyebrow="Basin boundaries">
          <p className="t-body" style={{ margin: '0 0 10px', color: 'var(--fg-2)' }}>
            Watershed boundaries are HydroSHEDS HydroBASINS version 1.c, used under the HydroSHEDS
            License Agreement. The following statement is required by Exhibit B of that agreement.
          </p>
          <blockquote
            style={{
              margin: 0,
              padding: '12px 14px',
              borderLeft: '2px solid var(--line)',
              background: 'var(--paper)',
              borderRadius: 'var(--r-xs)',
            }}
          >
            <p className="t-caption" style={{ margin: 0, color: 'var(--fg-2)', lineHeight: 1.6 }}>
              {HYDROSHEDS_EXHIBIT_B}
            </p>
          </blockquote>
          <p className="t-caption" style={{ margin: '10px 0 0' }}>
            Attribution is text only. No World Wildlife Fund logo, trademark or mark is used
            anywhere in this product.
          </p>
        </Section>

        <Section eyebrow="Water stress">
          <p className="t-body" style={{ margin: '0 0 10px', color: 'var(--fg-2)' }}>
            {AQUEDUCT_LICENCE} A copy of the licence is at{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">
              creativecommons.org/licenses/by/4.0
            </a>
            .
          </p>
          <Citation>{AQUEDUCT_CITATION}</Citation>
        </Section>

        <Section eyebrow="How these values were produced">
          <Derivation
            level="Level 6 — the detail view, from zoom 5"
            note={
              stressDoc?.levels?.['6']?.note ??
              'WRI’s published values for each basin. No aggregation, no interpolation.'
            }
          />
          <Derivation
            level="Level 4 — the world view"
            note={
              stressDoc?.levels?.['4']?.note ??
              'Derived, not published by WRI. Each basin takes the category covering the largest share of its area across its Level 6 children.'
            }
          />
          <p className="t-caption" style={{ margin: '10px 0 0', lineHeight: 1.6 }}>
            Two categories are not points on the stress scale and are shown apart from it.{' '}
            <strong>Arid and Low Water Use</strong> means the water-use denominator is too small for
            a stress ratio to be meaningful — it does not mean low stress. <strong>No Data</strong>{' '}
            is an absence of measurement. Together they cover 3,431 of 16,396 basins.
          </p>
        </Section>

        <Section eyebrow="Citations">
          <Citation>{HYDROBASINS_CITATION}</Citation>
          <Citation>{HYDROSHEDS_CITATION}</Citation>
        </Section>

        <Section eyebrow="Basemap">
          <p className="t-body" style={{ margin: 0, color: 'var(--fg-2)' }}>
            Map tiles by{' '}
            <a href="https://carto.com/attributions" target="_blank" rel="noopener">
              CARTO
            </a>
            , under CC BY 3.0. Map data ©{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">
              OpenStreetMap
            </a>{' '}
            contributors, under the Open Database License.
          </p>
        </Section>

        <Section eyebrow="This software">
          <p className="t-body" style={{ margin: 0, color: 'var(--fg-2)' }}>
            The source code of this map is licensed under the Apache License 2.0. The data licences
            above are separate and are not granted by it.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 26 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        {eyebrow}
      </div>
      {children}
    </section>
  );
}

function Citation({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="t-caption"
      style={{ margin: '0 0 10px', lineHeight: 1.6, paddingLeft: 14, textIndent: -14 }}
    >
      {children}
    </p>
  );
}

function Derivation({ level, note }: { level: string; note: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="label" style={{ color: 'var(--fg-1)', marginBottom: 2 }}>
        {level}
      </div>
      <p className="t-caption" style={{ margin: 0, lineHeight: 1.6 }}>
        {note}
      </p>
    </div>
  );
}
