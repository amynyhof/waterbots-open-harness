/**
 * The screening report — item S21, the maintainer's word of 14 Nov 2026.
 *
 * PRINT-ONLY, LIKE THE PAID CALCULATOR'S EXPORT. Hidden on screen; "Export
 * screening report" in the left rail opens the browser's print dialog, where
 * it prints or saves as a PDF. The feel is taken from the open core's
 * ReportView (packages/calvin, read on GitHub): small section headings, rows of
 * a label and a value with a note under, and a source on every claim.
 *
 * IT GROWS AS THE VISITOR GOES, and it is drawn from the visit and the rows
 * alone — never from anyone's prose, and nothing is invented:
 *   1. Wellington's project details, each one or "Not given yet" (plain words
 *      from 21 Nov 2026, the maintainer's word);
 *   2. Phoebe's results per funding path — what is in place, what makes it unlikely
 *      and why, what can be fixed, what is still to find out — with each card's
 *      citation, which path looks plausible, and how to reach a person;
 *   3. Bridget's basin and its water-stress reading, with the attribution the
 *      datasets require, or "Not done yet";
 *   4. Calvin's screening figures and his full working, or "Not done yet";
 *   5. Violet's water estimate, or "Not done yet" (her own section from 23 Nov 2026, J5).
 * A pathway that reads unlikely says what would change it, from the shared record (J4), and its calculator's
 * section says the agent was not called.
 *
 * THE AGENTS' NOTES (the maintainer's word of 23 Nov 2026): sections 4 and 5 carry each agent's own notes on the
 * values still blank or assumed, under the label core gives them. There is no note box on this site.
 * Nothing is kept: the report is the visit as it stands, printed.
 */

import type { ReactNode } from 'react';
import { cardFor, type Citation } from '../lib/phoebeCards';
import { AQUEDUCT_CITATION, HYDROBASINS_CITATION, PRODUCT_NAME } from '../lib/licences';
import { PROJECT_STAGES, projectType } from '../lib/projectTypes.generated';
import { HER_PACKS, section, verdictRows, pathwayRows } from '../lib/worksheet.generated';
import { contextFor, stateOf, type Sheet } from '../lib/worksheetState';
import { NotesOnValues, type NoteLine } from '@waterbots/core/notes';
import type { AgentMap } from '@waterbots/core/agentMap';
import type { ProjectRecord } from '@waterbots/core/record';
import { D3_ENGINE_VERSION } from '@waterbots/violet/engine';
import { deskRows, pathStatus, servedWords, WATER_SUPPLY_TYPES, type CarbonFigure, type Visit } from '../lib/visit';
import { NO_CALCULATOR_YET, closedBy, noCalculatorFor, pathwayForPack, waterHasNoCalculator } from '../lib/projectRecord';
import { GS4GG_CALCULATOR_VERSION } from '@waterbots/calvin/engine';
import { CALVIN_PACKAGE_VERSION, VIOLET_PACKAGE_VERSION } from '../lib/calvinProject';
import { SCREENING_WORKING_SLOT } from './CalvinCalculator';

/** A detail the visitor has not given yet. Plain words, the maintainer's word of 21 Nov 2026. */
const AWAITING = 'Not given yet';
const FIRST_SCREENING = 'This is a first screening, not an official decision.';

/** Each funding path by its plain name. */
const PLAIN_PATH: Record<string, string> = { water: 'Water benefits', carbon: 'Carbon credits' };

const STATUS_WORDS: Record<ReturnType<typeof pathStatus>, string> = {
  likely: 'likely',
  unlikely: 'unlikely',
  'more to learn': 'more to learn',
  'not started': 'not checked yet',
};

function Heading({ children }: { children: ReactNode }) {
  return <h2 style={{ fontSize: 13, fontWeight: 600, margin: '18px 0 6px' }}>{children}</h2>;
}

function Row({ k, v, note }: { k: string; v: string; note?: ReactNode }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)', padding: '4px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 11 }}>
        <span style={{ color: 'var(--ink-2)' }}>{k}</span>
        <span style={{ textAlign: 'right' }}>{v}</span>
      </div>
      {note ? <div style={{ fontSize: 9.5, color: 'var(--ink-3)', marginTop: 2 }}>{note}</div> : null}
    </div>
  );
}

function Source({ citation }: { citation: Citation }) {
  return (
    <>
      Source: {citation.full}. {citation.href}
    </>
  );
}

/** One row of Phoebe's worksheet in the report: its title, her sentence, the card's citation. */
interface ReportLine {
  title: string;
  because?: string;
  citation?: Citation;
}

function Lines({ label, lines }: { label: string; lines: ReportLine[] }) {
  if (lines.length === 0) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>{label}</div>
      {lines.map((line, i) => (
        <Row
          key={i}
          k={line.title}
          v=""
          note={
            <>
              {line.because ? <span>{line.because} </span> : null}
              {line.citation ? <Source citation={line.citation} /> : null}
            </>
          }
        />
      ))}
    </div>
  );
}

export default function ScreeningReport({
  visit,
  sheet,
  showPerson,
  record,
  map,
  carbon = null,
  calvinNotes = [],
  violetNotes = [],
}: {
  visit: Visit;
  sheet: Sheet;
  /** Calvin's carbon headline from the open core's engine, once Quantify was opened. */
  carbon?: CarbonFigure | null;
  /** The shared project record and the agent map, as they stand (J3, J4). */
  record: ProjectRecord;
  map: AgentMap;
  /** Each agent's own notes on the values still blank or assumed. */
  calvinNotes?: NoteLine[];
  violetNotes?: NoteLine[];
  /** A path is unlikely, so the box to send the project to the team is offered. */
  showPerson: boolean;
}) {
  const c = visit.context;
  const type = c.type ? projectType(c.type) : undefined;
  const gsClass = c.gsClass ? projectType(c.gsClass) : undefined;
  const stage = PROJECT_STAGES.find((s) => s.id === c.stage);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const paths = HER_PACKS.filter((pack) => section(pack) !== undefined).map((pack) => {
    const pathway = pathwayForPack(pack);
    const part = section(pack)!;
    const context = contextFor(sheet, pack, c.gsClass);
    const status = pathStatus(visit, sheet, pack);
    const line = (id: string, card: string): ReportLine => {
      const held = stateOf(sheet, pack, id);
      const found = cardFor(pack, card);
      return { title: found?.title ?? id, because: held.because, citation: found?.citation };
    };
    const rows = verdictRows(pack, context);
    const inState = (state: string) => rows.filter((row) => stateOf(sheet, pack, row.id).state === state).map((row) => line(row.id, row.card));
    const notApplying = pathwayRows(pack, context)
      .filter((row) => (stateOf(sheet, pack, row.id).state as string) === 'does-not-apply')
      .map((row) => line(row.id, row.card));
    const unchecked = rows.filter((row) => stateOf(sheet, pack, row.id).state === 'unchecked').length;
    return {
      key: pack,
      name: PLAIN_PATH[part.sectionId] ?? part.sectionName,
      status,
      met: inState('met'),
      stops: [...notApplying, ...inState('blocked')],
      wouldChange: pathway && record.pathways[pathway]?.wouldChange,
      fixable: inState('fixable'),
      unknown: inState('unknown'),
      unchecked,
    };
  });
  const plausible = paths.filter((p) => p.status === 'likely' || p.status === 'more to learn').map((p) => p.name);
  const phoebeStarted = paths.some((p) => p.status !== 'not started');

  const violet = deskRows(visit, sheet).filter((row) => row.from === 'violet');
  const calvinClosed = closedBy(map, 'calvin');
  const violetClosed = closedBy(map, 'violet');
  /* Water benefits stay in play with no calculator: the maintainer's sentence (25 Nov 2026). */
  const noWaterCalculator = waterHasNoCalculator(map);
  const pin = visit.pin;

  return (
    <article className="wb-report" aria-hidden>
      <header style={{ borderBottom: '2px solid var(--ink)', paddingBottom: 8 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-2)' }}>
          {PRODUCT_NAME} · open.waterbots.ai
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: '4px 0 2px' }}>Screening report{c.name.trim() ? `: ${c.name.trim()}` : ''}</h1>
        <div style={{ fontSize: 11, color: 'var(--ink-2)' }}>
          Prepared {today}. {FIRST_SCREENING}
        </div>
      </header>

      <Heading>1. Your project, as you told Wellington</Heading>
      <Row k="Project name" v={c.name.trim() || AWAITING} />
      <Row k="What it does" v={c.does.trim() || AWAITING} />
      <Row k="What type" v={type ? (gsClass ? `${type.name} · ${gsClass.name}` : type.name) : AWAITING} note={type?.plain} />
      <Row k="Stage" v={stage?.words ?? AWAITING} />
      {(c.served || WATER_SUPPLY_TYPES.includes(c.type)) && <Row k="People served" v={c.served ? servedWords(c.served) : AWAITING} />}
      <Row k="Where it is" v={c.place.trim() || AWAITING} />

      <Heading>2. Which funding paths might suit it, with Phoebe</Heading>
      {!phoebeStarted ? (
        <p style={{ fontSize: 11 }}>Not done yet.</p>
      ) : (
        <>
          <Row k="Paths that look plausible" v={plausible.length ? plausible.join(', ') : 'None for now'} />
          {paths.map((p) => (
            <div key={p.key} style={{ marginTop: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                {p.name}: {STATUS_WORDS[p.status]}
              </div>
              <Lines label="In place" lines={p.met} />
              <Lines label="Unlikely, and why" lines={p.stops} />
              <Lines label="Can be fixed" lines={p.fixable} />
              <Lines label="Still to find out" lines={p.unknown} />
              {p.wouldChange && p.status !== 'likely' && <Row k="What would change it" v="" note={p.wouldChange} />}
              {p.status !== 'unlikely' && p.unchecked > 0 && (
                <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 4 }}>
                  {p.unchecked} {p.unchecked === 1 ? 'question' : 'questions'} not asked yet.
                </div>
              )}
            </div>
          ))}
          <p style={{ fontSize: 10.5, marginTop: 10 }}>
            To talk this through with a person, write to hello@waterbots.ai
            {showPerson ? ', or tick "Send my project to the WaterBots team" beside the save button and save the project' : ''}.
          </p>
        </>
      )}

      <Heading>3. Where it sits, with Bridget</Heading>
      {pin ? (
        <>
          <Row k="Basin" v={`HYBAS ${pin.hybasId}, ${Math.round(pin.subAreaKm2).toLocaleString('en-GB')} km²`} />
          <Row
            k="Water stress"
            v={pin.stressLabel}
            note={
              pin.level === 4
                ? "Derived by this site from the smaller basins inside it, an area-weighted majority; not WRI's own figure."
                : "WRI's published figure for this basin."
            }
          />
          <div style={{ fontSize: 9.5, color: 'var(--ink-3)', marginTop: 4 }}>
            Sources: {HYDROBASINS_CITATION} {AQUEDUCT_CITATION}
          </div>
        </>
      ) : (
        <p style={{ fontSize: 11 }}>Not done yet.</p>
      )}

      <Heading>4. A first estimate, with Calvin</Heading>
      {carbon && (
        <Row
          k="Carbon credits, first estimate (ex-ante)"
          v={`${carbon.er.toLocaleString('en-GB', { maximumFractionDigits: 1 })} tCO₂e a year`}
          note={`Gold Standard's safe drinking water methodology, ${carbon.version === 'paa' ? 'version 2.0' : 'version 1.0'}. Worked out by the open core's engine, gs4gg-carbon ${GS4GG_CALCULATOR_VERSION}, in @waterbots/calvin ${CALVIN_PACKAGE_VERSION}. Calvin's full working follows.`}
        />
      )}
      {/* Calvin's full working, the package's own report, drawn here by the
          calculator on Quantify (CalvinCalculator.tsx, SCREENING_WORKING_SLOT).
          Shown only beside the figure; it ends with his notes. Inside .wb-calvin, so the core's own
          classes, scoped there (calvin.css), lay it out. */}
      <div id={SCREENING_WORKING_SLOT} className="wb-calvin wb-report-working" style={carbon ? undefined : { display: 'none' }} />
      {calvinClosed && <p style={{ fontSize: 11 }}>Calvin was not called: carbon credits read unlikely. Section 2 says what would change it.</p>}
      {!carbon && !calvinClosed && <p style={{ fontSize: 11 }}>Not done yet.</p>}
      {/* With no figure his working is not drawn, so his notes stand on their own. */}
      {!carbon && !calvinClosed && <NotesOnValues lines={calvinNotes} agent="Calvin" />}

      <Heading>5. The water it would provide, with Violet</Heading>
      {violet.map((row) => (
        <Row
          key={row.key}
          k="Water benefits, first estimate"
          v=""
          note={`${row.sentence} Worked out by the open core's D-3 engine, version ${D3_ENGINE_VERSION}, in @waterbots/violet ${VIOLET_PACKAGE_VERSION}.`}
        />
      ))}
      {noWaterCalculator && <p style={{ fontSize: 11 }}>{NO_CALCULATOR_YET}</p>}
      {violetClosed && !noCalculatorFor(map, 'violet') && <p style={{ fontSize: 11 }}>Violet was not called: water benefits read unlikely. Section 2 says what would change it.</p>}
      {violet.length === 0 && !noWaterCalculator && (!violetClosed || noCalculatorFor(map, 'violet')) && <p style={{ fontSize: 11 }}>Not done yet.</p>}
      {!violetClosed && <NotesOnValues lines={violetNotes} agent="Violet" />}

      <footer style={{ marginTop: 18, borderTop: '1px solid var(--line)', paddingTop: 6, fontSize: 9.5, color: 'var(--ink-3)' }}>
        {FIRST_SCREENING} Nothing from this visit is kept on this site.
      </footer>
    </article>
  );
}
