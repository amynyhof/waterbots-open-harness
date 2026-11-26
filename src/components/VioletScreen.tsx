/**
 * Violet's desk — the water calculator's seat on the agent screen, and her own crew member from 23 Nov 2026
 * (J5, item A23). Until then her D-3 screen sat under Calvin's "Water benefits" chip.
 *
 * HER SEAT WORD AND HER JOB LINE ARE THE CREW LIST'S. The seat word is held to it by scripts/check-roster.mjs;
 * the job line is read from it (src/lib/rosterLine.ts).
 *
 * HER CHAT IS LIVE FROM 25 NOV 2026, like Calvin's (src/screen/useCalculatorChat.ts). Her screen's state is her package's
 * hook (`useD3State`), held here so the chat fills it. In the Agent Commons her chat is not live.
 *
 * HER COLOUR IS ORCHID, read from her token. Orchid never carries text (4.29:1 on white) and has no text shade
 * yet, so her name is set in ink. The brand book holds no portrait of her, so her initial is drawn (AgentFace).
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { GivenFacts, ProjectRecord } from '@waterbots/core/record';
import type { VioletAnswer } from '@waterbots/violet';
import { useD3State } from '@waterbots/violet/screen';
import type { AgentHost, AgentTurn, TurnButton } from '../chat/evidence';
import type { CalculatorAnswer } from '../lib/calculatorClient';
import type { TurnFacts } from '../lib/told';
import { FACT_LABEL } from '@waterbots/core/projectKinds';
import { waterAnswer } from '@waterbots/core/record';
import type { Surface } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import { VIOLET_PACKAGE_VERSION, VIOLET_RELEASE } from '../lib/calvinProject';
import { WATER_D3_LISTING } from '../lib/methodPacks';
import { rosterJobAtDesk } from '../lib/rosterLine';
import type { WaterEstimate } from '../lib/visit';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackView } from '../screen/KnowledgePackTab';
import ScreenChat from '../screen/ScreenChat';
import { settled, useCalculatorChat } from '../screen/useCalculatorChat';
import { RecordFacts } from './CalvinCalculator';
import HandOff from './HandOff';
import VioletWater from './VioletWater';

export const VIOLET: AgentHost = {
  name: 'Violet',
  role: 'Volumetric water benefits calculator',
  portrait: '',
  colourToken: '--bot-violet',
  nameToken: '--ink',
  composerPlaceholder: 'Reply to Violet',
  composerNote: 'Nothing is kept between visits.',
  thinkingLine: 'Violet is working it out…',
};

/** The one plain line, in the shape of Calvin's. In the Agent Commons alone from 25 Nov 2026. */
export const VIOLET_NOT_LIVE_LINE = 'Violet is not answering here yet. The calculator works: type in what you know.';

export default function VioletScreen({
  record,
  counts,
  kindIs,
  onWater,
  closed = null,
  invite = '',
  waiting = false,
  wayOn = [],
  visible,
  showChat = 0,
  onTold,
  onDone,
  onward,
  onWellington,
  heAsks,
  onReplyToHim,
}: {
  /** The shared project record: her screen opens on it and follows it. */
  record: ProjectRecord;
  /** Whether the kind of project gives a figure: core's answer, from the record (25 Nov 2026). */
  counts: boolean;
  /** The project's facts as the record holds them, which the relay works out what the agent does from (core 0.4.0). */
  kindIs: () => TurnFacts;
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
  /** True while her desk is the step in view: she speaks first then, not on mount. */
  visible: boolean;
  /** Bumped each time the visitor opens her from the crew, which opens her Chat tab first. */
  showChat?: number;
  /** Writes what the visitor told her to the visit, and returns a message for each number refused. A kind of project their
      words no longer fit comes off the record. */
  onTold: (given: GivenFacts) => string[];
  /** Her part is done: a figure that came from the visitor's answers. */
  onDone: () => void;
  /** The way on, read when her answer lands. */
  onward: () => TurnButton[];
  onWellington: (at: Surface, composerId: string) => Promise<AgentTurn | null>;
  heAsks: () => boolean;
  onReplyToHim: (text: string, at: Surface, composerId: string) => Promise<AgentTurn | null>;
}) {
  const state = useD3State({ record, place: 'free-site', lockView: 'ex-ante', onChange: (input, result) => onWater({ input, result }) });
  const seat = useRef(state);
  seat.current = state;
  const recordRef = useRef(record);
  recordRef.current = record;
  const countsNow = useRef(counts);
  countsNow.current = counts;
  const shows = (): boolean => countsNow.current && seat.current.stop === null && seat.current.result.vwbM3PerYear !== null;

  const { chat, tab, setTab, composerId } = useCalculatorChat({
    host: VIOLET,
    name: 'Violet',
    desk: 'water',
    seat: {
      turn: () => {
        return {
          ...kindIs(),
          input: seat.current.input,
          projectName: seat.current.project?.name ?? '',
          chosen: seat.current.chosen,
          refusals: seat.current.refusals,
        };
      },
      apply: async (answer: CalculatorAnswer) => {
        const told = Object.keys(answer.facts).length > 0;
        const refused = told ? onTold(answer.facts) : [];
        await settled();
        const values = answer.values as VioletAnswer;
        let fill: ReturnType<typeof state.fill> | undefined;
        flushSync(() => {
          fill = seat.current.fill(values);
        });
        /* People served are the record's: what she put on her screen goes there too, and her screen follows it. */
        const population = Object.fromEntries(Object.entries(values.population ?? {}).filter(([key]) => fill?.filled.includes(`population.${key}`)));
        if (Object.keys(population).length > 0) onTold({ population });
        await settled();
        return { refused: [...new Set([...refused, ...(fill?.refused.map((r) => r.message) ?? [])])], filled: told || (fill?.filled.length ?? 0) > 0 };
      },
      asks: () => seat.current.asks,
      figure: shows,
    },
    visible: visible && closed === null,
    invite,
    waiting,
    showChat,
    onward,
    onWellington,
    heAsks,
    onReplyToHim,
    onDone,
  });

  /* Her figure needs the visitor to have said where the water comes from and whether it is treated (core 0.4.0): until then
     core's answer names the one fact still blank, and there is no figure to show. Home use is asked by Wellington. */
  const answer = waterAnswer(record.facts);
  const unsaid = answer.says === 'ask' && answer.fact !== 'homeUse' ? FACT_LABEL[answer.fact] : null;
  const ended = state.chosen && shows() && !state.asks.some((ask) => ask.needed);
  useEffect(() => {
    if (ended) onDone();
  }, [ended, onDone]);

  return (
    <AgentScreen
      host={VIOLET}
      active={tab}
      onActiveChange={setTab}
      dots={{ chat: tab === 'tool' && chat.turns.some((turn) => turn.role === 'agent') }}
      tabs={{
        chat: closed ? (
          <>
            <HandOff line="" wayOn={wayOn} framed />
            {closed}
          </>
        ) : (
          <ScreenChat host={VIOLET} chat={chat} composerId={composerId} waitingFor={waiting ? WELLINGTON : undefined} />
        ),
        tool: (
          <>
            <HandOff line="" wayOn={wayOn} framed />
            {closed}
            {/* A fact core needs to work out how the water is counted is blank, so there is no figure to show: the same line as
                Calvin's, in core's words for the fact. */}
            {!closed && unsaid !== null && (
              <div style={{ padding: '14px 18px 0' }}>
                <RecordFacts missing={[unsaid]} />
              </div>
            )}
            {/* Kept mounted behind a closed desk, so nothing the visitor set is lost if the reading changes. */}
            <div style={{ display: closed || unsaid !== null ? 'none' : 'contents' }}>
              <VioletWater record={record} place="free-site" state={state} hideExportButton />
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
