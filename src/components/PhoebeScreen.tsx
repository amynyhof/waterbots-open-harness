/**
 * Phoebe's screen — her seat on the agent screen. Item S16, slice 3,
 * 9 Sep 2026. It replaces PhoebePanel, her dock on the right, which is
 * retired; the crew rail with the save button stands where it stood.
 *
 * THIS FILE IS IDENTITY, WIRING AND HER SIDE EFFECT, and nothing else. The
 * screen (src/screen/AgentScreen.tsx) draws the tabs; ScreenChat draws the
 * conversation; the transcript and every citation are the chat layer's. Her
 * tabs: Chat, her conversation in bubbles on her Anemone tint; Tool, the
 * eligibility worksheet, which the shell still holds so her verdicts and its
 * rows cannot disagree; Knowledge pack, the two card sets she reads from,
 * assembled from src/lib/phoebeCards.ts so every word is a committed card's;
 * Credentials, exam and scores only, honest that no exam has been sat.
 *
 * THE CONVERSATION IS HELD HERE, by her seat — one conversation per agent,
 * and a frame never starts its own. The screen and the chat are frames.
 *
 * THE SIDE EFFECT IS HERS, SO IT LIVES HERE. Phoebe moves worksheet rows when
 * an answer lands. That happens inside `ask` below, before the turn is handed
 * back, and the layer never learns that worksheets exist. THE LOOP — 7 Sep
 * 2026: the record goes to Phoebe with every ask; her verdicts come back
 * through onCriteriaUpdate to the criteria, and her row on the desk follows.
 *
 * NO OPENING PARAGRAPH. The dock carried a "Where to start" paragraph above
 * an empty conversation; the desk lost its intro paragraph on 8 Sep 2026 and
 * the screen follows the desk. What that paragraph said now lives where it
 * belongs: the record is on the left rail, what she reads from is on the
 * Knowledge pack tab, and beta is beside her name.
 *
 * SHE IS BETA, and it is stated in words rather than tucked away — early
 * access, shaped with founding users.
 */

import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import type { AgentHost, AgentTurn } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import type { CriterionStatus } from '../lib/criteriaState';
import { nextPhaseAfter } from '../lib/journey';
import {
  CARDS_APPROVED_ON,
  CONSIDERATIONS,
  CONSIDERATION_GROUPS,
  CRITERIA,
} from '../lib/phoebeCards';
import { askPhoebe, carriedRecord, type CriterionUpdate } from '../lib/phoebeClient';
import type { Surface } from '../lib/surfaces';
import type { VisitContext } from '../lib/visit';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, { type PackView } from '../screen/KnowledgePackTab';
import ScreenChat from '../screen/ScreenChat';
import EligibilityWorksheet from './EligibilityWorksheet';

export const PHOEBE: AgentHost = {
  name: 'Phoebe',
  role: 'Eligibility and Feasibility',
  portrait: phoebePortrait,
  colourToken: '--bot-phoebe',
  beta: true,
  composerPlaceholder: 'Tell her about your project, or ask about a criterion.',
  composerNote: 'Nothing is kept between visits. Twenty messages a day.',
  /* A visitor's words for what she is doing — canon rule 4, 8 Sep 2026. */
  thinkingLine: 'Phoebe is reviewing the criteria…',
};

export default function PhoebeScreen({
  onCriteriaUpdate,
  record,
  statuses,
  onOpenMap,
  onNavigate,
}: {
  onCriteriaUpdate: (updates: CriterionUpdate[]) => void;
  /** The visit's project record, carried to Phoebe with every ask. */
  record: VisitContext;
  /** The worksheet's rows, held by the shell. */
  statuses: CriterionStatus[];
  onOpenMap: () => void;
  onNavigate: (surface: Surface) => void;
}) {
  const carried = carriedRecord(record);

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal
  ): Promise<AgentTurn> {
    const answer = await askPhoebe(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      carried,
      signal
    );

    /* Her side effect, fired before the turn is returned so a failed request
       never half-moves the worksheet. */
    if (answer.updates.length) onCriteriaUpdate(answer.updates);

    return {
      role: 'agent',
      text: answer.reply,
      evidence: answer.evidence,
      abstained: answer.abstained,
    };
  }

  const chat = useConversation(ask, PHOEBE.name);

  const next = nextPhaseAfter('eligibility');
  const nextSurface = next?.surface ?? null;

  return (
    <AgentScreen
      host={PHOEBE}
      next={next && nextSurface ? { label: next.label, go: () => onNavigate(nextSurface) } : null}
      tabs={{
        chat: <ScreenChat host={PHOEBE} chat={chat} composerId="wb-phoebe-composer" />,
        tool: <EligibilityWorksheet statuses={statuses} onOpenMap={onOpenMap} />,
        pack: <KnowledgePackTab view={PHOEBE_PACK} />,
        credentials: <CredentialsTab host={PHOEBE} />,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   Her Knowledge Pack, assembled from the registry. The version and the
   canonical link are read from the cards' own citations, never re-typed.
   -------------------------------------------------------------------------- */

const FIRST = CRITERIA[0].citation;

const PHOEBE_PACK: PackView = {
  heading: "Phoebe's Knowledge Pack",
  tags: [FIRST.document, 'Appendix A and B'],
  approved: `approved ${CARDS_APPROVED_ON}`,
  source: (
    <>
      Volumetric Water Benefit Accounting ({FIRST.document}), {FIRST.version}, published by the
      World Resources Institute and its co-authors. Every card is reworded in our own words and
      cites its section and page. Canonical link:{' '}
      <a className="wb-row-action" href={FIRST.href} target="_blank" rel="noopener noreferrer">
        {FIRST.href.replace(/^https?:\/\//, '')}
      </a>
    </>
  ),
  groups: [
    {
      label: `ELIGIBILITY · ${CRITERIA.length === 6 ? 'SIX' : CRITERIA.length} CRITERIA, ALL MUST BE MET`,
      rows: CRITERIA.map((c) => ({
        id: `eligibility-${c.number}`,
        badge: String(c.number),
        title: c.title,
        layers: [
          { heading: 'The rule in plain words', text: c.rule },
          { heading: 'What a project owner would be asked to show', bullets: c.evidence },
        ],
        citation: c.citation,
      })),
    },
    ...CONSIDERATION_GROUPS.map((group) => ({
      label: `FEASIBILITY · ${group.label.toUpperCase()} · GUIDANCE ONLY`,
      rows: CONSIDERATIONS.filter((c) => c.group === group.key).map((c) => ({
        id: `feasibility-${c.number}`,
        badge: `B-${c.number}`,
        title: c.title,
        layers: [
          { heading: 'The consideration in plain words', text: c.summary },
          { heading: 'Why it matters', text: c.why },
          { heading: 'How to weigh it', bullets: c.weigh },
        ],
        citation: c.citation,
      })),
    })),
  ],
  /* Two sets are drafted and wait for the maintainer's grading; neither is
     committed and Phoebe does not read a draft. Named here so the tab is
     honest about what she does not yet hold. Struck when they are graded. */
  drafts: [
    { badge: 'C', title: 'Activity types, Appendix C' },
    { badge: 'G', title: 'Definitions, the glossary' },
  ],
  draftsNote:
    'Phoebe does not read a draft. When she is asked about an activity type she says she does not have that card yet.',
};
