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
 * BRIDGET'S TOOL IS THE MAP, AND THE MAP IS THE CONSOLE'S. It is drawn once,
 * on the Partners step, and a second copy would fetch the basins again and
 * hold a second Leaflet; her seat here has no Tool tab and her Chat line says
 * where the map is. Calvin's calculator is light and self-contained, so his
 * seat holds one with answers of its own, opened on the pack whose card was
 * clicked.
 */

import { useEffect, useState } from 'react';
import type { AgentTurn } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import { initialStatuses, type CriterionStatus } from '../lib/criteriaState';
import { fittedPack, type PackValues } from '../lib/methodPacks';
import { CRITERIA } from '../lib/phoebeCards';
import { applyCriterionUpdates, askPhoebe } from '../lib/phoebeClient';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
import ScreenChat from '../screen/ScreenChat';
import { BRIDGET, MapSources } from './BridgetScreen';
import { CALVIN, CALVIN_NOT_LIVE_LINE, CALVIN_PACK } from './CalvinScreen';
import EligibilityWorksheet from './EligibilityWorksheet';
import { PHOEBE, PHOEBE_PACK } from './PhoebeScreen';
import QuantificationWorksheet from './QuantificationWorksheet';

export function PhoebeCommonsSeat() {
  const [statuses, setStatuses] = useState<CriterionStatus[]>(() => initialStatuses(CRITERIA.length));

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal
  ): Promise<AgentTurn> {
    /* No record: the Commons carries no visit. */
    const answer = await askPhoebe(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      null,
      signal
    );
    if (answer.updates.length) setStatuses((s) => applyCriterionUpdates(s, answer.updates));
    return {
      role: 'agent',
      text: answer.reply,
      evidence: answer.evidence,
      abstained: answer.abstained,
    };
  }

  const chat = useConversation(ask, PHOEBE.name);

  return (
    <AgentScreen
      host={PHOEBE}
      idSlug="commons-phoebe"
      next={null}
      tabs={{
        chat: <ScreenChat host={PHOEBE} chat={chat} composerId="wb-commons-phoebe-composer" />,
        tool: <EligibilityWorksheet statuses={statuses} />,
        pack: <KnowledgePackTab view={PHOEBE_PACK} />,
        credentials: <CredentialsTab host={PHOEBE} />,
      }}
    />
  );
}

export function CalvinCommonsSeat({ packKey }: { packKey: string | null }) {
  const [activeKey, setActiveKey] = useState<string>(packKey ?? fittedPack()?.key ?? '');
  /* A click on another of his cards moves the calculator to that pack. */
  useEffect(() => {
    if (packKey) setActiveKey(packKey);
  }, [packKey]);
  const [values, setValues] = useState<Record<string, PackValues>>({});

  return (
    <AgentScreen
      host={CALVIN}
      idSlug="commons-calvin"
      opensOn="tool"
      next={null}
      tabs={{
        chat: <NotLiveChat host={CALVIN} line={CALVIN_NOT_LIVE_LINE} />,
        tool: (
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <QuantificationWorksheet
              activeKey={activeKey}
              onSelect={setActiveKey}
              allValues={values}
              onChange={(key, next) => setValues((v) => ({ ...v, [key]: next }))}
            />
          </div>
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
      next={null}
      tabs={{
        chat: <NotLiveChat host={BRIDGET} line={BRIDGET_COMMONS_LINE} />,
        pack: <MapSources />,
        credentials: <CredentialsTab host={BRIDGET} />,
      }}
    />
  );
}
