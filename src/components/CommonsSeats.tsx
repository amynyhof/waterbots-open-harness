/**
 * The four seats on the Agent Commons — Phoebe's, Calvin's, Violet's and Bridget's
 * packs opened on the one agent screen as its third consumer. Item S18,
 * slice 3, built 11 Sep 2026.
 *
 * EACH SEAT IS IDENTITY, WIRING AND ITS OWN STATE, and nothing else, on the
 * pattern of the console's PhoebeScreen, CalvinScreen and BridgetScreen —
 * the same hosts, the same pack views and the same Credentials tab, imported
 * from those files and never re-typed (BRAND.md §6: shared, not copied).
 * What differs is what the maintainer's proposal of 9 Sep 2026 said would
 * differ: no memory and a shallower tool.
 *
 * NO RECORD IS CARRIED. Phoebe is asked with no project record, so she works
 * from what the visitor types and nothing else; her verdicts move rows on a
 * worksheet of this seat's own, which starts empty and is not the console's.
 * "Next phase" is null on every seat: there is no journey here. The chats
 * run through the same relays under the same daily caps; a visitor who has
 * used Phoebe's twenty on the console has used them here too, and the
 * composer's note says so.
 *
 * ONE CONVERSATION PER AGENT PER CONSUMER. The Commons is a consumer of the
 * screen, as production is, not a second frame around the console's thread —
 * its Phoebe holds her own conversation, without the record the console's
 * carries, and the two never show one another's turns.
 *
 * THE HAND-BACK GOES TO THE SHELF HERE — contract line 8, item A15, step 4,
 * 21 Sep 2026. There is no desk and no Wellington on the Commons; when her
 * answer sets handBack to "wellington", the one action under her turn is the
 * way back to the shelf, built from the field and never from her prose.
 *
 * BRIDGET'S TOOL IS THE MAP, AND THE MAP IS THE CONSOLE'S. It is drawn once,
 * on the Partners step, and a second copy would fetch the basins again and
 * hold a second Leaflet; her seat here has no Tool tab and her Chat line says
 * where the map is. Calvin's calculator is light and self-contained, so his
 * seat holds one with answers of its own; Violet's does too, from 23 Nov 2026 (J5).
 *
 * EVERY SEAT IS TOLD ITS PLACE (J2, 23 Nov 2026): the Agent Commons door. Phoebe's relay reads it; Calvin's and
 * Violet's screens take it, so their own exports carry their notes on the values still blank or assumed.
 */

import { useMemo, useRef, useState } from 'react';
import type { CalvinProject } from '@waterbots/calvin/screen';
import { checkEntry, emptyRecord, type ProjectRecord } from '@waterbots/core/record';
import { COUNTRIES } from '@waterbots/calvin/engine';
import type { AgentTurn, AskMeta } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import { EMPTY_SHEET, HER_PACKS, applyUpdates, contextFor, worksheetCaption, type Sheet } from '@waterbots/phoebe';
import { EligibilityWorksheet } from '@waterbots/phoebe/screen';
import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import '../styles/phoebe.css';
import { askPhoebe, carriedSheet } from '../lib/phoebeClient';
import AgentScreen, { type ScreenTab } from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
import ScreenChat from '../screen/ScreenChat';
import { BRIDGET, BRIDGET_PACK } from './BridgetScreen';
import { VIOLET, VIOLET_NOT_LIVE_LINE, VIOLET_PACK } from './VioletScreen';
import VioletWater from './VioletWater';
import { CALVIN, CALVIN_NOT_LIVE_LINE, CALVIN_PACK, CalvinTool } from './CalvinScreen';
import { PHOEBE, PHOEBE_PACK, phoebeButtons } from './PhoebeScreen';

export function PhoebeCommonsSeat({ onBack }: { onBack: () => void }) {
  const [sheet, setSheet] = useState<Sheet>(EMPTY_SHEET);
  const loaded = useRef<string[]>([]);
  /* The guiding dots and buttons, as on the console (14 Nov 2026). */
  const [tab, setTab] = useState<ScreenTab>('chat');
  const [toolDot, setToolDot] = useState(false);
  const chatRef = useRef<ReturnType<typeof useConversation> | null>(null);

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal,
    meta?: AskMeta,
    onLive?: (text: string | null) => void
  ): Promise<AgentTurn> {
    /* No record: the Commons carries no visit. The seat's own rows do go,
       though — contract line 3, 21 Sep 2026 — so she sees her tool's state
       here as on the console. */
    const answer = await askPhoebe(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      null,
      signal,
      {
        sheet: carriedSheet(sheet, HER_PACKS),
        loaded: loaded.current,
        onLive,
        door: 'agent-commons',
        /* Her opened turn: nobody has introduced her here, so she says who she is (rule 17). */
        ...(meta?.opened ? { opened: true } : {}),
      }
    );
    if (answer.loaded) loaded.current = answer.loaded;
    if (answer.showTool) setToolDot(true);
    const verdicts = { rows: answer.rows, pathways: answer.pathways, sorts: answer.sorts };
    const moved = answer.rows.length > 0 || answer.pathways.length > 0;
    if (moved || answer.sorts.length > 0) {
      setSheet((current) => applyUpdates(current, verdicts));
    }
    const after = applyUpdates(sheet, verdicts);
    return {
      role: 'agent',
      text: answer.reply,
      evidence: answer.evidence,
      abstained: answer.abstained,
      /* The shown line — contract line 5 — from her verdicts alone. */
      ...(moved
        ? {
            caption: worksheetCaption(
              after,
              HER_PACKS.map((pack) => ({ pack, context: contextFor(after, pack, '') }))
            ),
          }
        : {}),
      /* The way back to the shelf, from the field alone. */
      ...(answer.handBack === 'wellington' ? { action: { label: 'Back to the shelf', go: onBack } } : {}),
      ...(answer.handBack === 'wellington'
        ? {}
        : {
            /* No helper under her first answer, as on the console. */
            buttons: phoebeButtons(history.length <= 1 ? { ...answer, learnMore: '', showTool: false } : answer, (text) => void chatRef.current?.sendText(text), {
              label: 'Eligibility quiz',
              open: () => {
                setTab('tool');
                setToolDot(false);
              },
            }),
          }),
    };
  }

  const chat = useConversation(ask, PHOEBE.name);
  chatRef.current = chat;

  return (
    <AgentScreen
      host={PHOEBE}
      idSlug="commons-phoebe"
      toolLabel="Eligibility quiz"
      active={tab}
      onActiveChange={(next) => {
        setTab(next);
        if (next === 'tool') setToolDot(false);
      }}
      dots={{ tool: toolDot, chat: tab === 'tool' && chat.turns.some((turn) => turn.role === 'agent') }}
      tabs={{
        chat: <ScreenChat host={PHOEBE} chat={chat} composerId="wb-commons-phoebe-composer" />,
        /* Her package's Tool tab, the same worksheet as before (@waterbots/phoebe 0.1.0), in this site's tokens. */
        tool: (
          <div className="wb-phoebe-tool">
            <EligibilityWorksheet sheet={sheet} gsClass="" herPacks={HER_PACKS} portrait={phoebePortrait} resetsOnReload />
          </div>
        ),
        pack: <KnowledgePackTab view={PHOEBE_PACK} />,
        credentials: <CredentialsTab host={PHOEBE} />,
      }}
    />
  );
}

/**
 * THE COMMONS HOLDS NO RECORD, so Calvin's carbon calculator — the open core's,
 * from 14 Nov 2026 — takes its project facts from this small form, in the
 * lens's header, the slot a host fills. The facts stay in this page and are
 * never sent anywhere. Nothing is filled in for the visitor.
 */
interface CommonsFacts {
  country: string;
  technology: '' | 'CWS' | 'HWT';
  served: string;
  unit: 'people' | 'households';
}

/** The count typed, when core's fact check takes it. A count below zero is refused where it is entered (J3). */
function servedOf(facts: CommonsFacts): number | undefined {
  if (facts.served.trim() === '') return undefined;
  const count = Number(facts.served);
  return checkEntry('population.served', count).ok ? count : undefined;
}

/** What is wrong with the count typed, in plain words, or nothing. */
function servedProblem(facts: CommonsFacts): string | null {
  if (facts.served.trim() === '') return null;
  const check = checkEntry('population.served', Number(facts.served));
  if (check.ok) return null;
  return check.problem === 'below zero'
    ? 'A count can’t be below zero.'
    : check.problem === 'zero'
      ? 'A count has to be at least 1.'
      : 'A count has to be a whole number.';
}

function CommonsFactsForm({ facts, onChange, agent = 'Calvin', servedOnly = false }: { facts: CommonsFacts; onChange: (next: CommonsFacts) => void; agent?: string; servedOnly?: boolean }) {
  const problem = servedProblem(facts);
  const id = `commons-${agent.toLowerCase()}`;
  const label = { display: 'block', fontSize: 12, color: 'var(--ink-2)', margin: '8px 0 3px' } as const;
  return (
    <div style={{ marginBottom: 12 }}>
      <p className="t-caption" style={{ margin: 0, color: 'var(--ink-2)' }}>
        Tell {agent} about your project. Nothing here is kept.
      </p>
      {!servedOnly && (<>
      <label style={label} htmlFor="commons-calvin-system">The water system</label>
      <select
        id="commons-calvin-system"
        className="wb-rail-input"
        value={facts.technology}
        onChange={(e) => onChange({ ...facts, technology: e.target.value as CommonsFacts['technology'] })}
      >
        <option value="">Choose one</option>
        <option value="CWS">A new water source a community collects from</option>
        <option value="HWT">Water made safe in the home</option>
      </select>
      <label style={label} htmlFor="commons-calvin-country">The country</label>
      <select
        id="commons-calvin-country"
        className="wb-rail-input"
        value={facts.country}
        onChange={(e) => onChange({ ...facts, country: e.target.value })}
      >
        <option value="">Choose one</option>
        {COUNTRIES.map((c) => (
          <option key={c.iso} value={c.iso}>
            {c.name}
          </option>
        ))}
      </select>
      </>)}
      <label style={label} htmlFor={`${id}-served`}>How many it serves</label>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          id={`${id}-served`}
          className="wb-rail-input"
          inputMode="numeric"
          value={facts.served}
          aria-invalid={problem !== null || undefined}
          /* The minus sign is kept, so a count below zero is refused with a reason and never turned into another number. */
          onChange={(e) => onChange({ ...facts, served: e.target.value.replace(/[^0-9.-]/g, '') })}
          style={{ flex: 1, minWidth: 0 }}
        />
        <select
          className="wb-rail-input"
          aria-label="People or households"
          value={facts.unit}
          onChange={(e) => onChange({ ...facts, unit: e.target.value as CommonsFacts['unit'] })}
          style={{ width: 'auto' }}
        >
          <option value="people">people</option>
          <option value="households">households</option>
        </select>
      </div>
      {problem && (
        <p role="alert" style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--state-warn-text)' }}>
          {problem}
        </p>
      )}
    </div>
  );
}

export function CalvinCommonsSeat() {
  const [facts, setFacts] = useState<CommonsFacts>({ country: '', technology: '', served: '', unit: 'people' });
  const project: CalvinProject = useMemo(() => {
    const served = servedOf(facts);
    return {
      name: 'Your project',
      standards: ['carbon'],
      /* No Project Record page at this door either (calvin 0.9.0). */
      recordPage: false,
      ...(facts.technology ? { technology: facts.technology } : {}),
      ...(facts.country ? { country: facts.country } : {}),
      ...(served !== undefined ? { population: { mode: facts.unit, served } } : {}),
    };
  }, [facts]);
  /* The calculator holds its own state and opens again once a technology is
     chosen, as on the console (CalvinCarbon, 16 Nov 2026); the count typed
     afterwards is handed on there. */

  return (
    <AgentScreen
      host={CALVIN}
      idSlug="commons-calvin"
      opensOn="tool"
      tabs={{
        chat: <NotLiveChat host={CALVIN} line={CALVIN_NOT_LIVE_LINE} />,
        tool: (
          <CalvinTool
            project={project}
            place="agent-commons"
            header={() => <CommonsFactsForm facts={facts} onChange={setFacts} />}
          />
        ),
        pack: <KnowledgePackTab view={CALVIN_PACK} />,
        credentials: <CredentialsTab host={CALVIN} />,
      }}
    />
  );
}

/**
 * VIOLET'S SEAT, her own from 23 Nov 2026 (J5). The Commons holds no record, so she keeps a temporary one of the
 * same shape from what the visitor types: how many it serves. The rest she asks on her own screen. Her export
 * stays here, because the Commons has no screening report, and it carries her notes.
 */
export function VioletCommonsSeat() {
  const [facts, setFacts] = useState<CommonsFacts>({ country: '', technology: '', served: '', unit: 'people' });
  const record: ProjectRecord = useMemo(() => {
    const served = servedOf(facts);
    const out = emptyRecord();
    if (served !== undefined) {
      out.facts.population = { value: { mode: facts.unit, served }, source: { by: 'person', note: 'typed in the Agent Commons' } };
    }
    return out;
  }, [facts]);
  return (
    <AgentScreen
      host={VIOLET}
      idSlug="commons-violet"
      opensOn="tool"
      tabs={{
        chat: <NotLiveChat host={VIOLET} line={VIOLET_NOT_LIVE_LINE} />,
        tool: (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 'none', background: 'var(--card)', borderBottom: '1px solid var(--line)', padding: '12px 18px 2px' }}>
              <CommonsFactsForm facts={facts} onChange={setFacts} agent="Violet" servedOnly />
            </div>
            <VioletWater record={record} place="agent-commons" />
          </div>
        ),
        pack: <KnowledgePackTab view={VIOLET_PACK} />,
        credentials: <CredentialsTab host={VIOLET} />,
      }}
    />
  );
}

/** Her one plain line here, a visitor's words: not answering, and where the map is. */
const BRIDGET_COMMONS_LINE =
  'Bridget is not answering here yet. Her map is on the Partners step, back on the main page.';

export function BridgetCommonsSeat() {
  return (
    <AgentScreen
      host={BRIDGET}
      idSlug="commons-bridget"
      opensOn="pack"
      tabs={{
        chat: <NotLiveChat host={BRIDGET} line={BRIDGET_COMMONS_LINE} />,
        pack: <KnowledgePackTab view={BRIDGET_PACK} />,
        credentials: <CredentialsTab host={BRIDGET} />,
      }}
    />
  );
}
