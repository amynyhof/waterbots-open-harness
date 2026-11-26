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
 * packs, water then carbon, assembled from her package (@waterbots/phoebe) so every
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
 * A15. When her answer sets handBack to "wellington" — her part done, or the
 * question out of her lane — Wellington joins this chat with the next step
 * and its button (the maintainer's ruling of 14 Nov 2026), built from the field
 * and never from her prose.
 *
 * NO OPENING PARAGRAPH. The dock carried a "Where to start" paragraph above
 * an empty conversation; the desk lost its intro paragraph on 8 Sep 2026 and
 * the screen follows the desk. What that paragraph said now lives where it
 * belongs: the record is on the left rail, what she reads from is on the
 * Knowledge pack tab. The beta tag beside her name is gone from 21 Nov 2026,
 * the maintainer's word: the site says it is early once, beside waterbots.ai.
 */

import { useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import phoebePortrait from '../../brand/assets/bots/phoebe.svg';
import type { AgentHost, AgentTurn, TurnButton } from '../chat/evidence';
import { useConversation } from '../chat/useConversation';
import { meetShowing } from '../lib/blue';
import { Reached } from '../chat/reached';
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
  HER_PACKS,
  worksheetCaption,
  contextFor,
  applyUpdates,
  type Citation,
  type Sheet,
  type Verdicts,
} from '@waterbots/phoebe';
import { EligibilityWorksheet } from '@waterbots/phoebe/screen';
import '../styles/phoebe.css';
import { chipsFor, withWayOn } from '../lib/chips';
import { answersHim, hisTurn } from '../screen/useCalculatorChat';
import { askPhoebe, carriedRecord, carriedSheet } from '../lib/phoebeClient';
import type { Surface } from '../lib/surfaces';
import { herClass, nothingLeftToAsk, onePathDone, type VisitContext } from '../lib/visit';
import AgentScreen, { type ScreenTab } from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import KnowledgePackTab, {
  type PackLayer,
  type PackRow,
  type PackSection,
  type PackView,
} from '../screen/KnowledgePackTab';
import ScreenChat from '../screen/ScreenChat';

export const PHOEBE: AgentHost = {
  name: 'Phoebe',
  role: 'Eligibility and Feasibility',
  portrait: phoebePortrait,
  colourToken: '--bot-phoebe',
  composerPlaceholder: 'Tell her about your project, or ask her a question.',
  /* No line under her chat box, the maintainer's word of 13 Nov 2026, as Wellington's
     went on 12 Nov: the daily cap still says so when it is reached. */
  /* A visitor's words for what she is doing — canon rule 4, 8 Sep 2026. */
  thinkingLine: 'Phoebe is reviewing the criteria…',
  /* Her closing question is set in bold — display only, the maintainer's word,
     30 Sep 2026. Nothing about her prompt, her relay or the record changes. */
  boldClosingQuestion: true,
};

/**
 * Her one helper chip: "Learn more about …", only where she named an idea in
 * learnMore — the maintainer's word of 14 Nov 2026 (P22), which took away the
 * blue button that moved her on, the same day. A quiet chip, not blue (P24). It
 * sends a real message the visitor can see in their bubble.
 */
function learnMoreChip(learnMore: string, send: (text: string) => void): TurnButton | undefined {
  if (!learnMore) return undefined;
  return { label: `Learn more about ${learnMore}`, go: () => send(`Tell me more about ${learnMore}.`) };
}

/**
 * The chips under her latest message, from 24 Nov 2026 (src/lib/chips.ts): the
 * answers to the question she just asked, the one that opens her tool where she
 * points at it, then her one helper. Shared by the console and the Commons.
 */
export function phoebeButtons(
  answer: { answers: readonly string[]; learnMore: string; showTool: boolean },
  send: (text: string) => void,
  tool: { label: string; open: () => void }
): TurnButton[] | undefined {
  return chipsFor({
    answers: answer.answers,
    send,
    tab: answer.showTool ? tool : null,
    helper: learnMoreChip(answer.learnMore, send),
  });
}

export default function PhoebeScreen({
  onVerdicts,
  record,
  sheet,
  onOpenMap,
  visible,
  eligibilityDone,
  invite = '',
  waiting = false,
  onWellington,
  onMeet,
  onward,
  onHandedOn,
  onWorkedAgain,
  showChat = 0,
  heAsks,
  onReplyToHim,
}: {
  onVerdicts: (verdicts: Verdicts) => void;
  /** The visit's project record, carried to Phoebe with every ask. */
  record: VisitContext;
  /** The worksheet as the shell holds it, per pack and per row. */
  sheet: Sheet;
  onOpenMap: () => void;
  onNavigate: (surface: Surface) => void;
  /** True while Eligibility is the visible step — first-open runs then, not on mount. */
  visible: boolean;
  /** Every criterion has a verdict — she should send them back to Wellington. */
  eligibilityDone: boolean;
  /**
   * Wellington's handoff line, shown at the top of her page before her hello —
   * the maintainer's word of 14 Nov 2026 (W22). Display only: it is his real
   * words with his face, and it is never sent to her as one of her turns.
   */
  invite?: string;
  /** True while he is writing that line: she waits for it, so it heads her page whatever way the visitor came (24 Nov 2026). */
  waiting?: boolean;
  /** Brings Wellington into her chat with the next step, once her part is done. */
  onWellington?: (at: Surface, composerId: string) => Promise<AgentTurn | null>;
  /** Wellington has asked something here, so the visitor's next words are for him (25 Nov 2026). */
  heAsks?: () => boolean;
  onReplyToHim?: (text: string, at: Surface, composerId: string) => Promise<AgentTurn | null>;
  /** Tells the shell whether "Meet <name>" is under her chat's latest turn (one blue button, 16 Nov 2026). */
  onMeet?: (showing: boolean) => void;
  /** The buttons to what comes next, under her replies once her step is done (24 Nov 2026, src/lib/steps.ts). */
  onward?: () => TurnButton[];
  /** Tells the shell her step is ended: she handed the visitor on with a path done or closed (24 Nov 2026). */
  onHandedOn?: () => void;
  /** Tells the shell she has worked her readings out again, after a fact they rest on changed (core 0.5.0). */
  onWorkedAgain?: () => void;
  /** Bumped each time the visitor opens her from the crew, which opens her Chat tab first (24 Nov 2026). */
  showChat?: number;
}) {
  const carried = carriedRecord(record);

  /* WELLINGTON COMES TO YOU — the maintainer's ruling of 14 Nov 2026. When her
     answer sets handBack (her part done, or a question not hers) he joins this
     chat with the next step and its button, under his own face, where a link
     back to the desk used to be. No agent sends the visitor back to him. */
  async function wellingtonJoins() {
    if (!onWellington) return;
    const turn = await onWellington('eligibility', 'wb-phoebe-composer');
    if (turn) chatRef.current.append([hisTurn(turn, heAsks, (text) => void chatRef.current.sendText(text))]);
    else joined.current = false;
  }
  const joined = useRef(false);

  /* The card sets she has been given this visit. Staged loading (ruling R6)
     sends only what the visit has reached, and a set she has already used must
     not vanish from under her, so the console remembers what came back and
     sends it with the next ask. It is visit state, not memory: a reload clears
     it with everything else. */
  const loaded = useRef<string[]>([]);

  /* THE TABS THAT GUIDE — the maintainer's word of 14 Nov 2026. A dot on the
     Tool tab from the message that says her quiz is there (P15) until the
     visitor opens it; a dot on the Chat tab while they are on Tool, to bring
     them back (P20). In her own colour, through the screen's accent. */
  const [tab, setTab] = useState<ScreenTab>('chat');
  const [toolDot, setToolDot] = useState(false);
  const onTab = (next: ScreenTab) => {
    setTab(next);
    if (next === 'tool') setToolDot(false);
  };

  async function ask(
    history: { role: 'user' | 'agent'; text: string }[],
    signal: AbortSignal,
    meta?: { opened?: boolean; introduced?: boolean },
    onLive?: (text: string | null) => void
  ): Promise<AgentTurn> {
    const last = history[history.length - 1];
    if (!meta?.opened && last?.role === 'user' && answersHim(chatRef.current.turns, heAsks)) {
      const his = await onReplyToHim?.(last.text, 'eligibility', 'wb-phoebe-composer');
      if (his) return hisTurn(his, heAsks, (text) => void chatRef.current.sendText(text));
    }
    const answer = await askPhoebe(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      carried,
      signal,
      /* The rows go with every ask — contract line 3, 21 Sep 2026 — so she
         sees what is filled in and what is still missing. */
      {
        opened: meta?.opened === true,
        introduced: meta?.opened === true && meta.introduced === true,
        eligibilityDone,
        sheet: carriedSheet(sheet, HER_PACKS),
        loaded: loaded.current,
        door: 'free-site',
        /* Her reply shows as it is written (13 Nov 2026). */
        onLive,
      }
    );

    if (answer.loaded) loaded.current = answer.loaded;
    if (answer.showTool) setToolDot(true);
    /* She was told a fact changed, and this turn worked every reading out again: her results go on the record, and the
       mark comes off (`addPhoebeResults`, phoebe 0.2.0). Her first hello sets nothing, so it clears nothing. */
    if (carried?.factsChanged && meta?.opened !== true) onWorkedAgain?.();

    /* Her side effect, fired before the turn is returned so a failed request
       never half-moves the worksheet. */
    const moved = answer.rows.length > 0 || answer.pathways.length > 0;
    if (moved || answer.sorts.length > 0) {
      onVerdicts({ rows: answer.rows, pathways: answer.pathways, sorts: answer.sorts });
    }

    /* He joins once her answer has landed, from the field alone. */
    /* HE COMES AT THE END OF HER STEP, EVERY TIME (24 Nov 2026). It hung on her remembering the field. Where nothing
       is left for her to ask, and she was told so on this ask, he comes whether or not she set it, once. */
    const done = eligibilityDone && nothingLeftToAsk(sheet, herClass({ context: record })) && meta?.opened !== true && !joined.current;
    const joins = answer.handBack === 'wellington' || done;
    const after = applyUpdates(sheet, {
      rows: answer.rows,
      pathways: answer.pathways,
      sorts: answer.sorts,
    });
    if (answer.handBack === 'wellington' && !answer.abstained && onePathDone(after, herClass({ context: record }))) onHandedOn?.();
    if (joins) {
      /* Coming for a question that is not hers, part-way, is not the end of her step. */
      if (nothingLeftToAsk(after, herClass({ context: record }))) joined.current = true;
      window.setTimeout(() => void wellingtonJoins(), 0);
    }

    return {
      role: 'agent',
      text: answer.reply,
      /* No citations in her chat, the maintainer's word of 12 Nov 2026: they
         stay on the worksheet rows, beside the row each one supports. What she
         cites still travels in answer.evidence; the chat just does not draw it,
         and a stray marker is dropped from the text for want of evidence. */
      evidence: [],
      abstained: answer.abstained,
      /* The shown line — contract line 5: what the worksheet holds after this
         turn, from her verdicts alone, only under a turn that moved a row. */
      ...(moved
        ? {
            caption: worksheetCaption(
              after,
              HER_PACKS.map((pack) => ({
                pack,
                context: contextFor(after, pack, herClass({ context: record })),
              }))
            ),
          }
        : {}),
      /* The chips that answer what she just asked, then "Learn more about …" where
         she named an idea (P22). No helper under her first hello, and nothing once
         she has handed back, because his buttons come next. */
      ...(joins
        ? {}
        : {
            buttons: withWayOn(
              phoebeButtons(
                meta?.opened ? { ...answer, learnMore: '', showTool: false } : answer,
                (text) => void chatRef.current.sendText(text),
                { label: 'Tool', open: () => onTab('tool') }
              ),
              nothingLeftToAsk(after, herClass({ context: record })) ? onward?.() : undefined
            ),
          }),
    };
  }

  useEffect(() => {
    if (showChat > 0) setTab('chat');
  }, [showChat]);

  const chat = useConversation(ask, PHOEBE.name);
  /* ONE BLUE BUTTON (16 Nov 2026): the shell decides which button is blue, so
     it is told whether Wellington's "Meet <name>" is the latest thing here. */
  const reached = useContext(Reached);
  const meet = meetShowing(chat.turns, reached);
  useEffect(() => {
    onMeet?.(meet);
  }, [meet, onMeet]);

  const opened = useRef(false);
  const chatRef = useRef(chat);
  chatRef.current = chat;
  useEffect(() => {
    if (!visible || opened.current || waiting) return;
    opened.current = true;
    /* W22: his handoff line first, then her hello. The chat layer never sends
       a turn with a speaker to her (useConversation's forAsk). */
    if (invite.trim()) {
      chatRef.current.seed([{ role: 'agent', text: invite.trim(), evidence: [], speaker: WELLINGTON }]);
    }
    void chatRef.current.askOpened({ opened: true, introduced: invite.trim() !== '' });
  }, [visible, invite, waiting]);

  return (
    <AgentScreen
      host={PHOEBE}
      active={tab}
      onActiveChange={onTab}
      dots={{ tool: toolDot, chat: tab === 'tool' && chat.turns.some((turn) => turn.role === 'agent') }}
      tabs={{
        chat: <ScreenChat host={PHOEBE} chat={chat} composerId="wb-phoebe-composer" waitingFor={waiting ? WELLINGTON : undefined} />,
        tool: (
          <div className="wb-phoebe-tool">
            <EligibilityWorksheet
              sheet={sheet}
              gsClass={herClass({ context: record })}
              herPacks={HER_PACKS}
              onOpenMap={onOpenMap}
              portrait={phoebePortrait}
              resetsOnReload
            />
          </div>
        ),
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
  /* THE HONEST LINE IS GONE, 25 SEP 2026. It said she read the water pathway
     today and the carbon cards were shown but not hers. Both packs are hers
     from build-order step 3, pull request B, so the line stopped being true
     and was removed rather than reworded. Ruling R3 of 23 Sep 2026 asked for
     it only while it was true; the old wording is in the pack CHANGELOG. */
  note:
    'Phoebe reads both pathways from these cards. A set she has not been given on a turn is one ' +
    'she asks for; she never answers from a card that is not in front of her.',
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
