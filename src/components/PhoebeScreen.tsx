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
 * rows cannot disagree; Knowledge pack, every approved card set in both her
 * packs, water then carbon, assembled from src/lib/phoebeCards.ts so every
 * word is a committed card's — the two water sets she reads from today and
 * the five she does not yet, said so on the tab (23 Sep 2026);
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
 * THE HAND-BACK IS A FIELD, AND THIS SEAT ACTS ON IT — contract line 8, item
 * A15, step 4, 21 Sep 2026. When her answer sets handBack to "wellington" —
 * her part done, or the question out of her lane — the turn carries one
 * quiet action, the way back to Dispatches, built from the field and never
 * from her prose. It is the chat layer's own turn action, the one Wellington's
 * route stopped drawing at the look pass of 8 Sep 2026 because the rail
 * already held his next step; hers is the way back to him, which the rail
 * does not hold, and the maintainer may strike it at the eyeball.
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

import { useEffect, useRef, type ReactNode } from 'react';
import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import type { AgentHost, AgentTurn } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import type { Citation } from '../lib/citation';
import { worksheetCaption, type CriterionStatus } from '../lib/criteriaState';
import { nextPhaseAfter, nextPhaseCompetes } from '../lib/journey';
import { DESK_LABEL } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import {
  APPROVED_ON,
  CARBON_APPLIES,
  CARBON_ELIGIBILITY,
  CARBON_ELIGIBILITY_PARTS,
  CARBON_PACK,
  CARBON_ROUTES,
  CONSIDERATIONS,
  CONSIDERATION_GROUPS,
  CRITERIA,
  WATER_APPLIES,
  WATER_PACK,
  WATER_ROUTES,
  type AppliesCard,
  type PackInfo,
  type Phase,
  type RouteCard,
} from '../lib/phoebeCards';
import { applyCriterionUpdates, askPhoebe, carriedRecord, type CriterionUpdate } from '../lib/phoebeClient';
import type { Surface } from '../lib/surfaces';
import type { VisitContext } from '../lib/visit';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, {
  type PackLayer,
  type PackRow,
  type PackSection,
  type PackView,
} from '../screen/KnowledgePackTab';
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
  visible,
  eligibilityInvite,
  eligibilityDone,
  inviteSurface,
}: {
  onCriteriaUpdate: (updates: CriterionUpdate[]) => void;
  /** The visit's project record, carried to Phoebe with every ask. */
  record: VisitContext;
  /** The worksheet's rows, held by the shell. */
  statuses: CriterionStatus[];
  onOpenMap: () => void;
  onNavigate: (surface: Surface) => void;
  /** True while Eligibility is the visible step — first-open runs then, not on mount. */
  visible: boolean;
  /** Wellington's real Dispatches invite, copied onto this thread once. */
  eligibilityInvite: string;
  /** Every criterion has a verdict — she should send them back to Wellington. */
  eligibilityDone: boolean;
  inviteSurface: Surface | null;
}) {
  const carried = carriedRecord(record);

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal,
    meta?: { opened?: boolean }
  ): Promise<AgentTurn> {
    const answer = await askPhoebe(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      carried,
      signal,
      /* The rows go with every ask — contract line 3, 21 Sep 2026 — so she
         sees what is filled in and what is still missing. */
      { opened: meta?.opened === true, eligibilityDone, worksheet: statuses }
    );

    /* Her side effect, fired before the turn is returned so a failed request
       never half-moves the worksheet. */
    if (answer.updates.length) onCriteriaUpdate(answer.updates);

    return {
      role: 'agent',
      text: answer.reply,
      evidence: answer.evidence,
      abstained: answer.abstained,
      /* The shown line — contract line 5: what the worksheet holds after this
         turn, from her verdicts alone, only under a turn that moved a row. */
      ...(answer.updates.length
        ? { caption: worksheetCaption(applyCriterionUpdates(statuses, answer.updates)) }
        : {}),
      /* The way back to him, from the field alone. */
      ...(answer.handBack === 'wellington'
        ? { action: { label: `Back to Wellington on ${DESK_LABEL}`, go: () => onNavigate('desk') } }
        : {}),
    };
  }

  const chat = useConversation(ask, PHOEBE.name);

  const opened = useRef(false);
  const inviteRef = useRef(eligibilityInvite);
  inviteRef.current = eligibilityInvite;
  const chatRef = useRef(chat);
  chatRef.current = chat;
  useEffect(() => {
    if (!visible || opened.current) return;
    opened.current = true;
    const invite = inviteRef.current.trim();
    if (invite) {
      chatRef.current.seed([
        {
          role: 'agent',
          text: invite,
          evidence: [],
          speaker: WELLINGTON,
        },
      ]);
    }
    void chatRef.current.askOpened();
  }, [visible]);

  const next = nextPhaseAfter('eligibility');
  const nextSurface = next?.surface ?? null;

  return (
    <AgentScreen
      host={PHOEBE}
      next={next && nextSurface ? { label: next.label, go: () => onNavigate(nextSurface) } : null}
      nextQuiet={nextPhaseCompetes('eligibility', inviteSurface)}
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
   Her Knowledge Pack, assembled from the registry — every approved set in
   both packs, water then carbon, one row per card (build-order step 1,
   23 Sep 2026, rulings R1 to R5). The version, the document name, the source
   and the canonical link are read from the packs' own files, never re-typed.
   The carbon cards are shown and not yet read by her, and the tab says so
   (R3); the line is struck at build-order step 3.
   -------------------------------------------------------------------------- */

const FIRST = CRITERIA[0].citation;
const FIRST_CARBON = CARBON_ELIGIBILITY[0].citation;

const EVIDENCE_HEADING = 'What a project owner would be asked to show';

/** The pack's source line, in the words of its eligibility file's source table. */
function sourceLine(pack: PackInfo, citation: Citation): ReactNode {
  return (
    <>
      {pack.source.document}. {citation.version}. {pack.source.publisher}. Every card is reworded in
      our own words and cites its section and page. Canonical link:{' '}
      <a className="wb-row-action" href={citation.href} target="_blank" rel="noopener noreferrer">
        {citation.href.replace(/^https?:\/\//, '')}
      </a>
    </>
  );
}

/** The Phase layer is drawn only when the card carries a "Kept up by" clause; the word is the row's tag. */
function phaseLayer(phase: Phase): PackLayer[] {
  return phase.keptUp ? [{ heading: 'Phase', text: `${phase.phase}. ${phase.keptUp}` }] : [];
}

function appliesRow(prefix: string, card: AppliesCard): PackRow {
  return {
    id: `${prefix}-applies-${card.id}`,
    badge: card.id,
    title: card.title,
    layers: [
      { heading: 'The test in plain words', text: card.test },
      { heading: 'Applies to', text: card.appliesTo },
      { heading: EVIDENCE_HEADING, bullets: card.evidence },
      { heading: card.ifNo.heading, text: card.ifNo.text },
    ],
    citation: card.citation,
    moreLinks: card.moreLinks,
  };
}

function routeRow(prefix: string, card: RouteCard): PackRow {
  return {
    id: `${prefix}-routes-${card.id}`,
    badge: card.id,
    title: card.title,
    layers: [
      { heading: 'The gap', text: card.gap },
      { heading: 'The route in plain words', text: card.route },
      { heading: 'What it does not promise', text: card.notPromise },
    ],
    citation: card.citation,
    moreLinks: card.moreLinks,
  };
}

const approved = (date: string) => `approved ${date}`;

const WATER_SECTION: PackSection = {
  key: 'water',
  label: 'Water pathway',
  tags: [FIRST.document],
  version: WATER_PACK.version,
  source: sourceLine(WATER_PACK, FIRST),
  sets: [
    {
      label: `APPLIES · ${WATER_APPLIES.length} QUESTIONS · DOES THIS PATHWAY APPLY?`,
      approved: approved(APPROVED_ON.waterApplies),
      rows: WATER_APPLIES.map((c) => appliesRow('water', c)),
    },
    {
      label: `ELIGIBILITY · ${CRITERIA.length === 6 ? 'SIX' : CRITERIA.length} CRITERIA, ALL MUST BE MET`,
      approved: approved(APPROVED_ON.waterEligibility),
      rows: CRITERIA.map((c) => ({
        id: `water-eligibility-${c.number}`,
        badge: String(c.number),
        title: c.title,
        tag: c.phase.phase,
        layers: [
          { heading: 'The rule in plain words', text: c.rule },
          { heading: 'Can it be fixed?', text: c.fixable.text },
          ...phaseLayer(c.phase),
          { heading: EVIDENCE_HEADING, bullets: c.evidence },
        ],
        citation: c.citation,
        moreLinks: c.moreLinks,
      })),
    },
    ...CONSIDERATION_GROUPS.map((group, i) => ({
      label: `FEASIBILITY · ${group.label.toUpperCase()} · GUIDANCE ONLY`,
      approved: i === 0 ? approved(APPROVED_ON.waterFeasibility) : null,
      rows: CONSIDERATIONS.filter((c) => c.group === group.key).map((c) => ({
        id: `water-feasibility-${c.number}`,
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
    {
      label: `ROUTES · ${WATER_ROUTES.length} CITED FIXES`,
      approved: approved(APPROVED_ON.waterRoutes),
      rows: WATER_ROUTES.map((c) => routeRow('water', c)),
    },
  ],
};

const CARBON_SECTION: PackSection = {
  key: 'carbon',
  label: 'Carbon pathway',
  tags: [FIRST_CARBON.document],
  version: CARBON_PACK.version,
  source: sourceLine(CARBON_PACK, FIRST_CARBON),
  sets: [
    {
      label: `APPLIES · ${CARBON_APPLIES.length} QUESTIONS · DOES THIS PATHWAY APPLY?`,
      approved: approved(APPROVED_ON.carbonApplies),
      rows: CARBON_APPLIES.map((c) => appliesRow('carbon', c)),
    },
    ...CARBON_ELIGIBILITY_PARTS.map((part, i) => ({
      label: `ELIGIBILITY · ${part.label.toUpperCase()} · ${part.range}`,
      approved: i === 0 ? approved(APPROVED_ON.carbonEligibility) : null,
      rows: CARBON_ELIGIBILITY.filter((c) => c.part === part.key).map((c) => ({
        id: `carbon-eligibility-${c.id}`,
        badge: c.id,
        title: c.title,
        tag: c.phase.phase,
        layers: [
          { heading: 'The rule in plain words', text: c.rule },
          { heading: 'Can it be fixed?', text: c.fixable.text },
          ...phaseLayer(c.phase),
          { heading: 'Applies to', text: c.appliesTo },
          { heading: 'External standard', text: c.external },
          { heading: EVIDENCE_HEADING, bullets: c.evidence },
        ],
        citation: c.citation,
        moreLinks: c.moreLinks,
      })),
    })),
    {
      label: `ROUTES · ${CARBON_ROUTES.length} CITED FIXES`,
      approved: approved(APPROVED_ON.carbonRoutes),
      rows: CARBON_ROUTES.map((c) => routeRow('carbon', c)),
    },
  ],
};

export const PHOEBE_PACK: PackView = {
  heading: "Phoebe's Knowledge Pack",
  /* Site copy, not a prompt: the carbon cards are shown here and reach her
     at build-order step 3. Struck then. Ruling R3, 23 Sep 2026. */
  note:
    "Phoebe reads the water pathway's cards today. The carbon pathway's cards are shown here and " +
    'reach her when her carbon runtime is built.',
  sections: [WATER_SECTION, CARBON_SECTION],
  /* Two sets are drafted and wait for the maintainer's grading; neither is
     committed and Phoebe does not read a draft. Named here so the tab is
     honest about what she does not yet hold; parked until after v1 (item K1).
     Struck when they are graded. */
  drafts: [
    { badge: 'C', title: 'Activity types, Appendix C' },
    { badge: 'G', title: 'Definitions, the glossary' },
  ],
  evals: true,
};
