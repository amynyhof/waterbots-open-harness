/**
 * Calvin's screen — the calculator's seat on the agent screen. Item S16,
 * slice 4, 9 Sep 2026. It replaces CalvinPanel, his dock on the right, which
 * is retired; the crew rail with the save button stands where it stood.
 *
 * HIS CHAT IS LIVE FROM 25 NOV 2026 (the shared console behaviours, item 9): the screen opens on it, Wellington's line
 * heads it, and his calculator fills as the visitor answers (src/screen/useCalculatorChat.ts). In the Agent Commons it
 * is not, so his seat there still opens on Tool with the one plain line.
 *
 * THE DOCK'S CAVEAT STRIP IS NOT CARRIED OVER, and nothing is lost by that:
 * the worksheet says it is a first screening, not an official decision, on
 * its method strip and on the result, beside the consultant-review tag
 * (wording of 14 Nov 2026), wherever a figure renders. The
 * strip was a second statement of the same thing beside the first.
 *
 * HIS KNOWLEDGE PACK IS HIS CALCULATOR, THE OPEN CORE'S. Calvin carries no rule
 * cards: one row per version of the method, from @waterbots/calvin. Violet's D-3
 * moved to her own desk on 23 Nov 2026 (VioletScreen.tsx, J5). Each wears its
 * package's version (src/lib/calvinProject.ts, held to the lockfile
 * by scripts/check-calvin-package.mjs). The Evals section sits at the foot of
 * the tab (ruling R5), the same sentence every agent's tab carries.
 *
 * THERE IS NO "NEXT PHASE" ON QUANTIFY. The phase after it is Plan, which
 * opens with a saved project, so the way on is the save button at the foot
 * of the crew rail — the proposal's fourth slice, approved 8 Sep 2026.
 *
 * HIS ACCENT IS REEF from 31 Oct 2026, the maintainer's ruling; it was Plum,
 * Reggie's, by a knowing exception from 31 Aug. It is read from his token as
 * ever, and it never carries text: his text is Deep Reef, from 1 Nov 2026
 * (src/styles/tokens.css).
 */

import { useRef, type MutableRefObject, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { CalculatorState, CalvinProject } from '@waterbots/calvin/screen';
import type { Place } from '@waterbots/core/places';
import type { GivenFacts } from '@waterbots/core/record';
import { GS4GG_CALCULATOR_VERSION } from '@waterbots/calvin/engine';
import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import type { AgentHost, AgentTurn, TurnButton } from '../chat/evidence';
import type { CalculatorAnswer } from '../lib/calculatorClient';
import type { TurnFacts } from '../lib/told';
import type { Surface } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackView } from '../screen/KnowledgePackTab';
import ScreenChat from '../screen/ScreenChat';
import { settled, useCalculatorChat } from '../screen/useCalculatorChat';
import HandOff from './HandOff';
import { CalvinCarbon, RecordFacts, type CalvinSummary } from './CalvinCalculator';
import { CALVIN_PACKAGE_VERSION, CALVIN_RELEASE } from '../lib/calvinProject';
import { GS_SDWS_LEGACY_V1, GS_SDWS_PAA_V2 } from '../lib/gsSdws';

export const CALVIN: AgentHost = {
  name: 'Calvin',
  role: 'Carbon credits calculator',
  portrait: calvinPortrait,
  colourToken: '--bot-calvin',
  nameToken: '--bot-calvin-text',
  composerPlaceholder: 'Reply to Calvin',
  composerNote: 'Nothing is kept between visits.',
  thinkingLine: 'Calvin is working it out…',
};

/** The one plain line — ruling 1, 9 Sep 2026. A visitor's words. In the Agent Commons alone from 25 Nov 2026. */
export const CALVIN_NOT_LIVE_LINE =
  'Calvin is not answering here yet. The calculator works: type in what you know.';

/**
 * THE TOOL TAB HOLDS HIS CARBON CALCULATOR, the open core's (CalvinCalculator.tsx), locked to ex-ante.
 * FROM 23 NOV 2026 THE "WATER BENEFITS" CHIP IS GONE (J5): Violet is her own crew member and her D-3 screen is on
 * her own desk (VioletScreen.tsx), which moved out of here whole. With one calculator there is nothing to choose,
 * so the row of chips went with it.
 */
export function CalvinTool({
  project,
  header,
  onSummary,
  place,
  screening = false,
  seat,
}: {
  project: CalvinProject;
  /** Where Calvin is working: the Free site or the Agent Commons (J2). */
  place: Place;
  header?: (missing: string[]) => ReactNode;
  onSummary?: (summary: CalvinSummary) => void;
  /** On the console's Quantify step, not the Commons: the left rail's screening report is the one export. */
  screening?: boolean;
  /** The calculator as it stands, for his chat. */
  seat?: MutableRefObject<CalculatorState | null>;
}) {
  return (
    <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
      <CalvinCarbon project={project} header={header} onSummary={onSummary} screening={screening} place={place} seat={seat} />
    </div>
  );
}

export default function CalvinScreen({
  project,
  counts,
  kindIs,
  onSummary,
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
  project: CalvinProject;
  /** Whether the kind of project gives a figure: core's answer, from the record (25 Nov 2026). */
  counts: boolean;
  /** The project's facts as the record holds them, which the relay works out what the agent does from (core 0.4.0). */
  kindIs: () => TurnFacts;
  /** The figure and the facts still needed, handed to the shell so the crew panel and the report read them. */
  onSummary: (summary: CalvinSummary) => void;
  /** What his desk shows in place of the calculator when the agent map closes it (J4). */
  closed?: ReactNode;
  /** Wellington's hand-off line, at the head of his desk (24 Nov 2026). */
  invite?: string;
  /** True while he is writing it. */
  waiting?: boolean;
  /** The buttons to what comes next (24 Nov 2026, src/lib/steps.ts). */
  wayOn?: TurnButton[];
  /** True while Quantify, on his desk, is the step in view: he speaks first then, not on mount. */
  visible: boolean;
  /** Bumped each time the visitor opens him from the crew, which opens his Chat tab first. */
  showChat?: number;
  /** Writes what the visitor told him to the visit, and returns a message for each number refused. A kind of project their
      words no longer fit comes off the record. */
  onTold: (given: GivenFacts) => string[];
  /** His part is done: a figure that came from the visitor's answers. */
  onDone: () => void;
  /** The way on, read when his answer lands. */
  onward: () => TurnButton[];
  onWellington: (at: Surface, composerId: string) => Promise<AgentTurn | null>;
  heAsks: () => boolean;
  onReplyToHim: (text: string, at: Surface, composerId: string) => Promise<AgentTurn | null>;
}) {
  const seat = useRef<CalculatorState | null>(null);
  const countsNow = useRef(counts);
  countsNow.current = counts;
  const shows = (): boolean => {
    const calc = seat.current;
    return countsNow.current && calc !== null && calc.result !== null && calc.missingFacts.length === 0 && !calc.fnrbRefusal && !calc.filedFnrbRefusal;
  };
  const { chat, tab, setTab, composerId } = useCalculatorChat({
    host: CALVIN,
    name: 'Calvin',
    desk: 'quantification',
    seat: {
      turn: (answered) => {
        const calc = seat.current;
        if (!calc) return null;
        const figure = countsNow.current ? calc.paaResult : null;
        const fnrb = figure?.provenance.find((p) => p.field === 'fNRB');
        return {
          ...kindIs(),
          state: calc.state,
          screen: calc.pageContext(),
          /* Opening his chat ends nothing while he still has something to ask, so he is told his figure shows once the
             visitor has answered him (the maintainer's ruling of 25 Nov 2026). */
          figure: figure !== null && answered,
          ...(figure && fnrb ? { fnrb: { value: figure.fNRB, label: fnrb.label } } : {}),
          sliders: calc.sliders,
          transition: calc.transition,
          ...(project.notCoveredYet !== undefined ? { notCoveredYet: project.notCoveredYet } : {}),
        };
      },
      apply: async (answer: CalculatorAnswer) => {
        /* The record first, so the screen follows it, and then the screen's own values. */
        const told = Object.keys(answer.facts).length > 0;
        const refused = told ? onTold(answer.facts) : [];
        await settled();
        let fill: ReturnType<CalculatorState['fill']> | undefined;
        flushSync(() => {
          fill = seat.current?.fill({ values: answer.values });
        });
        /* People served and household size are the record's, so a number he put on the screen goes there too. */
        const value = answer.values as Record<string, unknown>;
        const served = fill?.filled.includes('populationCount') && typeof value.populationCount === 'number' ? value.populationCount : undefined;
        const householdSize = fill?.filled.includes('householdSizeOverride') && typeof value.householdSizeOverride === 'number' ? value.householdSizeOverride : undefined;
        if (served !== undefined || householdSize !== undefined) onTold({ population: { ...(served !== undefined ? { served } : {}), ...(householdSize !== undefined ? { householdSize } : {}) } });
        await settled();
        return { refused: [...new Set([...refused, ...(fill?.refused.map((r) => r.message) ?? [])])], filled: told || (fill?.filled.length ?? 0) > 0 };
      },
      asks: () => seat.current?.asks ?? [],
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

  return (
    <AgentScreen
      host={CALVIN}
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
          <ScreenChat host={CALVIN} chat={chat} composerId={composerId} waitingFor={waiting ? WELLINGTON : undefined} />
        ),
        tool: (
          <>
            <HandOff line="" wayOn={wayOn} framed />
            {closed}
            {/* Kept mounted behind a closed desk, so nothing the visitor set is lost if the reading changes. A number the
                visitor types here is their answer too, so a figure it gives ends his part. */}
            <div style={{ display: closed ? 'none' : 'contents' }} onInput={() => window.setTimeout(() => void settled().then(() => shows() && onDone()), 0)}>
              <CalvinTool
                project={project}
                place="free-site"
                /* Only when the record lacks something: an empty header would still draw its frame. */
                header={(missing) => (missing.length > 0 && project.notCoveredYet === undefined ? <RecordFacts missing={missing} /> : null)}
                onSummary={onSummary}
                screening
                seat={seat}
              />
            </div>
          </>
        ),
        pack: <KnowledgePackTab view={CALVIN_PACK} />,
        credentials: <CredentialsTab host={CALVIN} />,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   His Knowledge Pack, assembled from the registry.
   -------------------------------------------------------------------------- */

export const CALVIN_PACK: PackView = {
  heading: "Calvin's Knowledge Pack",
  /* One section, unlabelled: he holds one calculator. */
  sections: [
    {
      key: 'method-packs',
      tags: [GS_SDWS_PAA_V2.citation.document],
      version: null,
      source: (
        <>
          Calvin carries no rule cards. His carbon calculator is the open core&rsquo;s, @waterbots/calvin{' '}
          {CALVIN_PACKAGE_VERSION} from the release {CALVIN_RELEASE}, with its engine, gs4gg-carbon{' '}
          {GS4GG_CALCULATOR_VERSION}, which does every sum; here it shows the ex-ante view only. Everything it
          produces is a screening estimate: anticipated, not delivered. This is a first screening, not an
          official decision.
        </>
      ),
      sets: [
        {
          label: 'CARBON · THE OPEN CORE’S CALCULATOR',
          approved: null,
          rows: [GS_SDWS_LEGACY_V1, GS_SDWS_PAA_V2].map((p, i) => ({
            id: `core-${p.key}`,
            badge: i === 0 ? 'V1' : 'V2',
            title: p.name,
            tag: `calvin ${CALVIN_PACKAGE_VERSION}`,
            layers: [
              { heading: 'What it measures', text: p.measures },
              { heading: 'What it covers', text: p.scope },
              {
                heading: 'Where the numbers come from',
                text: `The open core's engine, gs4gg-carbon ${GS4GG_CALCULATOR_VERSION}, installed from the release ${CALVIN_RELEASE} and checked against its fingerprint. This site computes none of it.`,
              },
            ],
            citation: p.citation,
          })),
        },
      ],
    },
  ],
  evals: true,
};
