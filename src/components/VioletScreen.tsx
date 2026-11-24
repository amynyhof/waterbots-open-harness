/**
 * Violet's desk — the water calculator's seat on the agent screen, and her own crew member from 23 Nov 2026
 * (J5, item A23). Until then her D-3 screen sat under Calvin's "Water benefits" chip.
 *
 * HER SEAT WORD AND HER JOB LINE ARE THE CREW LIST'S. The seat word is held to it by scripts/check-roster.mjs;
 * the job line is read from it (src/lib/rosterLine.ts).
 *
 * HER CHAT IS NOT LIVE, like Calvin's, so the screen opens on Tool and the Chat tab holds one plain line.
 *
 * HER COLOUR IS ORCHID, read from her token. Orchid never carries text (4.29:1 on white) and has no text shade
 * yet, so her name is set in ink. The brand book holds no portrait of her, so her initial is drawn (AgentFace).
 */

import type { ReactNode } from 'react';
import type { ProjectRecord } from '@waterbots/core/record';
import type { AgentHost, TurnButton } from '../chat/evidence';
import { VIOLET_PACKAGE_VERSION, VIOLET_RELEASE } from '../lib/calvinProject';
import { WATER_D3_LISTING } from '../lib/methodPacks';
import { rosterJobAtDesk } from '../lib/rosterLine';
import type { WaterEstimate } from '../lib/visit';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackView } from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
import HandOff from './HandOff';
import VioletWater from './VioletWater';

export const VIOLET: AgentHost = {
  name: 'Violet',
  role: 'Volumetric water benefits calculator',
  portrait: '',
  colourToken: '--bot-violet',
  composerPlaceholder: 'Reply to Violet',
  composerNote: 'Nothing is kept between visits.',
  thinkingLine: 'Violet is working it out…',
};

/** The one plain line, in the shape of Calvin's. */
export const VIOLET_NOT_LIVE_LINE = 'Violet is not answering here yet. The calculator works: type in what you know.';

export default function VioletScreen({
  record,
  onWater,
  closed = null,
  invite = '',
  waiting = false,
  wayOn = [],
}: {
  /** The shared project record: her screen opens on it and follows it. */
  record: ProjectRecord;
  /** What her screen gives back after every change, handed to the shell for the crew line, the report and the save. */
  onWater: (water: WaterEstimate) => void;
  /** What her desk shows in place of the calculator when the agent map closes it (J4). */
  closed?: ReactNode;
  /** Wellington's hand-off line, at the head of her desk (24 Nov 2026). */
  invite?: string;
  /** True while he is writing it. */
  waiting?: boolean;
  /** The buttons to what comes next (24 Nov 2026, src/lib/steps.ts). */
  wayOn?: TurnButton[];
}) {
  return (
    <AgentScreen
      host={VIOLET}
      opensOn="tool"
      tabs={{
        chat: <NotLiveChat host={VIOLET} line={VIOLET_NOT_LIVE_LINE} note={rosterJobAtDesk('violet')} lead={<HandOff line={invite} waiting={waiting} wayOn={wayOn} />} />,
        tool: (
          <>
            {/* A closed desk has no line of his, and still has the way on. */}
            {closed ? <HandOff line="" wayOn={wayOn} framed /> : <HandOff line={invite} waiting={waiting} wayOn={wayOn} framed />}
            {closed}
            {/* Kept mounted behind a closed desk, so nothing the visitor set is lost if the reading changes. */}
            <div style={{ display: closed ? 'none' : 'contents' }}>
              <VioletWater record={record} place="free-site" onChange={onWater} hideExportButton />
            </div>
          </>
        ),
        pack: <KnowledgePackTab view={VIOLET_PACK} />,
        credentials: <CredentialsTab host={VIOLET} />,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   Her Knowledge Pack. The one row moved here whole from Calvin's, with her
   package's own version and release.
   -------------------------------------------------------------------------- */

export const VIOLET_PACK: PackView = {
  heading: "Violet's Knowledge Pack",
  sections: [
    {
      key: 'method-packs',
      tags: [WATER_D3_LISTING.citation.document],
      version: null,
      source: (
        <>
          {rosterJobAtDesk('violet')} Violet carries no rule cards. Her calculator is the open core&rsquo;s D-3
          module, @waterbots/violet {VIOLET_PACKAGE_VERSION} from the release {VIOLET_RELEASE}, whose engine does
          every water sum; here it shows the ex-ante view only. Everything it produces is a screening estimate:
          anticipated, not delivered. This is a first screening, not an official decision.
        </>
      ),
      sets: [
        {
          label: 'WATER · THE OPEN CORE’S D-3 MODULE',
          approved: null,
          rows: [
            {
              id: 'core-vwba-d3',
              badge: 'D-3',
              title: WATER_D3_LISTING.name,
              tag: `violet ${VIOLET_PACKAGE_VERSION}`,
              layers: [
                { heading: 'What it measures', text: WATER_D3_LISTING.measures },
                { heading: 'What it covers', text: WATER_D3_LISTING.scope },
                { heading: 'The indicator', text: WATER_D3_LISTING.indicator },
                {
                  heading: 'Where the numbers come from',
                  text: `The open core's D-3 engine, in @waterbots/violet ${VIOLET_PACKAGE_VERSION}, installed from the release ${VIOLET_RELEASE} and checked against its fingerprint. This site computes none of it. Every result is a draft until an outside expert checks the module.`,
                },
              ],
              citation: WATER_D3_LISTING.citation,
            },
          ],
        },
      ],
    },
  ],
  evals: true,
};
