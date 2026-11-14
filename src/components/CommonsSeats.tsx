/**
 * The three seats on the Agent Commons — Phoebe's, Calvin's and Bridget's
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
 * seat holds one with answers of its own, opened on the pack whose card was
 * clicked.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCalculatorState, type CalvinProject } from '@waterbots/calvin/screen';
import { COUNTRIES } from '@waterbots/calvin/engine';
import type { AgentTurn, AskMeta } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import {
  EMPTY_SHEET,
  applyUpdates,
  contextFor,
  worksheetCaption,
  type Sheet,
} from '../lib/worksheetState';
import { HER_PACKS } from '../lib/worksheet.generated';
import { fittedPack, type PackValues } from '../lib/methodPacks';
import { askPhoebe, carriedSheet } from '../lib/phoebeClient';
import AgentScreen, { type ScreenTab } from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
import ScreenChat from '../screen/ScreenChat';
import { BRIDGET, BRIDGET_PACK } from './BridgetScreen';
import { CALVIN, CALVIN_NOT_LIVE_LINE, CALVIN_PACK, CalvinTool } from './CalvinScreen';
import EligibilityWorksheet from './EligibilityWorksheet';
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
    _meta?: AskMeta,
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
      { sheet: carriedSheet(sheet, HER_PACKS), loaded: loaded.current, onLive }
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
      ...(answer.handBack === 'wellington' || history.length <= 1
        ? {}
        : { buttons: phoebeButtons(answer.learnMore, (text) => void chatRef.current?.sendText(text)) }),
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
        tool: <EligibilityWorksheet sheet={sheet} gsClass="" herPacks={HER_PACKS} />,
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

function CommonsFactsForm({ facts, onChange }: { facts: CommonsFacts; onChange: (next: CommonsFacts) => void }) {
  const label = { display: 'block', fontSize: 12, color: 'var(--ink-2)', margin: '8px 0 3px' } as const;
  return (
    <div style={{ marginBottom: 12 }}>
      <p className="t-caption" style={{ margin: 0, color: 'var(--ink-2)' }}>
        Tell Calvin about your project. Nothing here is kept.
      </p>
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
      <label style={label} htmlFor="commons-calvin-served">How many it serves</label>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          id="commons-calvin-served"
          className="wb-rail-input"
          inputMode="numeric"
          value={facts.served}
          onChange={(e) => onChange({ ...facts, served: e.target.value.replace(/[^0-9]/g, '') })}
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
    </div>
  );
}

export function CalvinCommonsSeat({ packKey }: { packKey: string | null }) {
  const [activeKey, setActiveKey] = useState<string>(fittedPack()?.key ?? '');
  /* A water card opens the water worksheet; the carbon card opens the core's calculator. */
  const opensOn: 'carbon' | 'water' = packKey && packKey === fittedPack()?.key ? 'water' : 'carbon';
  useEffect(() => {
    if (opensOn === 'water' && packKey) setActiveKey(packKey);
  }, [packKey, opensOn]);
  const [values, setValues] = useState<Record<string, PackValues>>({});
  const [facts, setFacts] = useState<CommonsFacts>({ country: '', technology: '', served: '', unit: 'people' });
  const project: CalvinProject = useMemo(() => {
    const served = Number(facts.served);
    return {
      name: 'Your project',
      standards: ['carbon'],
      ...(facts.technology ? { technology: facts.technology } : {}),
      ...(facts.country ? { country: facts.country } : {}),
      ...(served > 0 ? { population: { mode: facts.unit, served } } : {}),
    };
  }, [facts]);
  const calc = useCalculatorState(project, { exAnteOnly: true });
  /* The core takes the number served only when it first opens, so a count
     typed afterwards is handed on, as on the console (App.tsx). */
  const patchCalc = calc.patch;
  const served = project.population?.served ?? null;
  const lastServed = useRef<number | null>(null);
  useEffect(() => {
    if (served === lastServed.current) return;
    lastServed.current = served;
    if (served !== null) patchCalc({ populationCount: served });
  }, [served, patchCalc]);

  return (
    <AgentScreen
      host={CALVIN}
      idSlug="commons-calvin"
      opensOn="tool"
      tabs={{
        chat: <NotLiveChat host={CALVIN} line={CALVIN_NOT_LIVE_LINE} />,
        tool: (
          <CalvinTool
            key={opensOn}
            calc={calc}
            project={project}
            header={<CommonsFactsForm facts={facts} onChange={setFacts} />}
            activeKey={activeKey}
            onSelect={setActiveKey}
            allValues={values}
            onChange={(key, next) => setValues((v) => ({ ...v, [key]: next }))}
            opensOn={opensOn}
          />
        ),
        pack: <KnowledgePackTab view={CALVIN_PACK} />,
        credentials: <CredentialsTab host={CALVIN} />,
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
