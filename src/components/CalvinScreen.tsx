/**
 * Calvin's screen — the calculator's seat on the agent screen. Item S16,
 * slice 4, 9 Sep 2026. It replaces CalvinPanel, his dock on the right, which
 * is retired; the crew rail with the save button stands where it stood.
 *
 * HIS CHAT IS NOT LIVE, so the screen opens on Tool, which is the
 * quantification worksheet, and the Chat tab carries the one plain line
 * saying he is not answering here yet — maintainer's ruling 1 of 9 Sep 2026.
 * No composer.
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

import type { ReactNode } from 'react';
import type { CalvinProject } from '@waterbots/calvin/screen';
import type { Place } from '@waterbots/core/places';
import { GS4GG_CALCULATOR_VERSION } from '@waterbots/calvin/engine';
import calvinPortrait from '../../brand/assets/bots/calvin.svg';
import type { AgentHost } from '../chat/evidence';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackView } from '../screen/KnowledgePackTab';
import NotLiveChat from '../screen/NotLiveChat';
import HandOff from './HandOff';
import { CalvinCarbon, RecordFacts, type CalvinSummary } from './CalvinCalculator';
import { CALVIN_PACKAGE_VERSION, CALVIN_RELEASE } from '../lib/calvinProject';
import { GS_SDWS_LEGACY_V1, GS_SDWS_PAA_V2 } from '../lib/gsSdws';

export const CALVIN: AgentHost = {
  name: 'Calvin',
  role: 'Carbon credits calculator',
  portrait: calvinPortrait,
  colourToken: '--bot-calvin',
  composerPlaceholder: 'Reply to Calvin',
  composerNote: 'Nothing is kept between visits.',
  thinkingLine: 'Calvin is working it out…',
};

/** The one plain line — ruling 1, 9 Sep 2026. A visitor's words. */
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
}: {
  project: CalvinProject;
  /** Where Calvin is working: the Free site or the Agent Commons (J2). */
  place: Place;
  header?: (missing: string[]) => ReactNode;
  onSummary?: (summary: CalvinSummary) => void;
  /** On the console's Quantify step, not the Commons: the left rail's screening report is the one export. */
  screening?: boolean;
}) {
  return (
    <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
      <CalvinCarbon project={project} header={header} onSummary={onSummary} screening={screening} place={place} />
    </div>
  );
}

export default function CalvinScreen({
  project,
  onSummary,
  unknownLabel,
  closed = null,
  invite = '',
  waiting = false,
}: {
  project: CalvinProject;
  /** The figure and the facts still needed, handed to the shell so the crew panel and the report read them. */
  onSummary: (summary: CalvinSummary) => void;
  /** The project's own label, when Calvin does not cover it. */
  unknownLabel?: string;
  /** What his desk shows in place of the calculator when the agent map closes it (J4). */
  closed?: ReactNode;
  /** Wellington's hand-off line, at the head of his desk (24 Nov 2026). */
  invite?: string;
  /** True while he is writing it. */
  waiting?: boolean;
}) {
  return (
    <AgentScreen
      host={CALVIN}
      opensOn="tool"
      tabs={{
        chat: <NotLiveChat host={CALVIN} line={CALVIN_NOT_LIVE_LINE} lead={<HandOff line={invite} waiting={waiting} />} />,
        tool: (
          <>
            {closed ?? <HandOff line={invite} waiting={waiting} framed />}
            {/* Kept mounted behind a closed desk, so nothing the visitor set is lost if the reading changes. */}
            <div style={{ display: closed ? 'none' : 'contents' }}>
              <CalvinTool
                project={project}
                place="free-site"
                /* Only when the record lacks something: an empty header would still draw its frame. */
                header={(missing) => (missing.length > 0 ? <RecordFacts missing={missing} unknownLabel={unknownLabel} /> : null)}
                onSummary={onSummary}
                screening
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
