/**
 * Wellington, as the console holds him — his host descriptor and his adapter
 * into the shared chat machinery.
 *
 * ONE PLACE, because two frames render him: the landing's hero chat and the
 * desk. The conversation itself is held by the shell (src/App.tsx) with
 * useConversation; this file is who he is and how an answer of his becomes a
 * turn. His side effects — what he learned writing into the visit — happen in
 * the adapter, before the turn is handed back, the same way Phoebe's worksheet
 * updates do.
 *
 * His role is "Team Lead" — maintainer's naming ruling, 2 Sep 2026, everywhere
 * he is named on this site. Not "Floor manager", and not "host" as a title.
 */

import { crewMember } from './crew';
import { KEEP_CHATTING } from '@waterbots/core/consoleWords';
import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import type { AgentHost, AgentTurn, Ask, AskMeta, TurnAction, TurnButton } from '../chat/evidence';
import { chipsFor } from './chips';
import { handoffButton, onward, type Ending } from './steps';
import type { Surface } from './surfaces';
import { carriedSheet } from './phoebeClient';
import type { Learned, Visit } from './visit';
import type { MapNote, NextStep } from './projectRecord';
import { askWellington, type FoundSheet, type VisitRecord, type WellingtonRoute } from './wellingtonClient';
import { HER_PACKS, type Sheet } from '@waterbots/phoebe';

export const WELLINGTON: AgentHost = {
  name: 'Wellington',
  /* One role word per agent, the crew file's (rule 7; A14). */
  role: crewMember('Wellington').role,
  portrait: wellingtonPortrait,
  colourToken: '--bot-wellington',
  composerPlaceholder: 'Reply to Wellington',
  /* No line under his chat box from 12 Nov 2026, the maintainer's second
     walk of #170. The cap still holds and says so when it is reached. */
  thinkingLine: 'Wellington is thinking…',
  abstainedLabel: 'not something this site holds',
};

/**
 * ~~A route becomes one action under the turn.~~ **Look pass, 8 Sep 2026: it
 * does not.** The next steps live in the right rail only, and Wellington names
 * the step in words; a second button under his turn duplicated the row. The
 * route still comes back as a field, checked against the closed list by the
 * relay and the client, and the console may act on it later; today it draws
 * nothing.
 */
export function actionFor(route: WellingtonRoute): TurnAction | undefined {
  void route;
  return undefined;
}

/** Who meets the visitor on each step a route opens. */
const MEET: Partial<Record<WellingtonRoute, { name: string; surface: Surface }>> = {
  eligibility: { name: 'Phoebe', surface: 'eligibility' },
  map: { name: 'Bridget', surface: 'map' },
  quantification: { name: 'Calvin', surface: 'quantification' },
  /* Her own desk from 23 Nov 2026 (J5). */
  water: { name: 'Violet', surface: 'water' },
};

/** What the visitor is told when a count is refused (J3). It says why, and that nothing was kept. */
const REFUSED_LINE = {
  'below zero': 'That count was not kept: a count can’t be below zero.',
  zero: 'That count was not kept: it has to be at least 1.',
  'not a whole number': 'That count was not kept: it has to be a whole number.',
  'not a number': 'That count was not kept: it is not a number.',
} as const;

/**
 * THE BUTTONS IN THE CHAT AT A HANDOFF — the maintainer's word of 14 Nov 2026
 * (W17). A route to a colleague draws the hand-off, "Step 2 of 3: Partners.
 * Meet Bridget", which opens that step (24 Nov 2026, src/lib/steps.ts), and
 * "Keep chatting", which puts the cursor back in his chat box. Where the map's
 * next step has another agent beside the one he routes to, theirs is drawn too.
 * Built from the route field and the map, never from his prose.
 */
export function actionsFor(
  route: WellingtonRoute,
  onNavigate?: (surface: Surface) => void,
  composerId = 'wb-desk-composer',
  next?: NextStep,
  /** The desk the visitor is on, when he joins another agent's chat. */
  here?: Surface
): TurnButton[] | undefined {
  const meet = MEET[route];
  if (!meet || !onNavigate) return undefined;
  const desks = (next?.kind === 'call' && next.surfaces.includes(meet.surface) ? next.surfaces : [meet.surface]).filter((desk) => desk !== here);
  if (desks.length === 0) return undefined;
  const steps = next?.kind === 'call' || next?.kind === 'gather' ? next.steps : undefined;
  const handoffs = desks.map((surface) => handoffButton(surface, () => onNavigate(surface), steps)).filter((b): b is TurnButton => b !== undefined);
  return [...handoffs, keepChatting(composerId)];
}

/** The desk he has joined, when he speaks in another agent's chat. */
function deskOf(meta?: AskMeta): Surface | undefined {
  return meta?.at === 'eligibility' || meta?.at === 'map' || meta?.at === 'quantification' || meta?.at === 'water' ? meta.at : undefined;
}

function keepChatting(composerId: string): TurnButton {
  return { label: KEEP_CHATTING, go: () => document.getElementById(composerId)?.focus() };
}

/** The visit as the relay expects it, or nothing when every field is blank. */
function recordFrom(visit: Visit): VisitRecord | null {
  const record: VisitRecord = {
    does: visit.context.does.trim(),
    type: visit.context.type,
    kindFacts: visit.context.kindFacts,
    stage: visit.context.stage,
    place: visit.context.place.trim(),
    name: visit.context.name.trim(),
    ...(visit.context.served ? { served: visit.context.served } : {}),
  };
  return record.does || record.type || record.stage || record.place || record.name || record.served || Object.keys(record.kindFacts).length > 0 ? record : null;
}

/**
 * His adapter: the relay's answer becomes a turn, and what he learned goes to
 * the visit. `getVisit` is read at send time from a ref the shell keeps
 * current, so a carried first turn already has the URL facts — not the blank
 * visit from the last paint. His route advances the screening loop.
 */
export function wellingtonAsk(
  onLearned: (learned: Learned) => void,
  getVisit: () => Visit,
  onRouted: (route: WellingtonRoute, reply: string, isIntroduction?: boolean) => void,
  getSheet: () => Sheet,
  /** Opens a step, for the "Meet <name>" button at a handoff (W17). */
  onNavigate?: (surface: Surface) => void,
  /** The agent map as it stands, read at send time (J4). */
  getMap?: () => MapNote,
  /** His hand-off line for a desk the visitor opened by another way than his button (24 Nov 2026). */
  onHandedOver?: (to: Surface, line: string) => void,
  /** Sends a chip's words as the visitor's own message on his desk (24 Nov 2026). */
  say?: (text: string) => void,
  /** What comes next on the map, and what the console does at the end of the steps (24 Nov 2026, src/lib/steps.ts). */
  getNext?: () => NextStep,
  ending?: Ending,
  /** The maintainer's sentence, where water benefits stay in play and no calculator covers this kind of project yet. */
  getNotice?: () => string
): Ask {
  /* THERE IS ALWAYS A WAY ON (24 Nov 2026). A hand-off, or the report and Save at the end, from the map whatever his
     field says; before it, the chips that answer what he just asked. */
  function buttonsAfter(route: WellingtonRoute, answers: readonly string[], meta?: AskMeta): TurnButton[] | undefined {
    const next = getNext?.();
    const here = deskOf(meta);
    const routed = actionsFor(route, onNavigate, meta?.composerId, next, here);
    /* His own hand-off first; and the map's way on beside it where he routed somewhere else. */
    if (routed) {
      const more = (next && ending ? onward(next, ending, here) : []).filter((b) => !routed.some((r) => r.label === b.label));
      return [...routed.slice(0, -1), ...more, ...routed.slice(-1)];
    }
    const ownDesk = !meta?.at || meta.at === 'open';
    const way = next && ending ? onward(next, ending, here) : [];
    const chips = say && ownDesk ? (chipsFor({ answers, send: say }) ?? []) : [];
    const all = [...chips, ...way, ...(here ? [keepChatting(meta?.composerId ?? 'wb-desk-composer')] : [])];
    return all.length ? all : undefined;
  }

  /* Where water benefits stay in play with no calculator, the sentence shows under his turn at the end of a step, once
     the next step is Quantify or none (25 Nov 2026). From the map, never from his prose. */
  function notice(meta?: AskMeta): string {
    const next = getNext?.();
    const atQuantify = next?.kind === 'done' || (next?.kind === 'call' && next.surfaces.every((s) => s === 'quantification' || s === 'water'));
    /* Once, as Quantify comes up; not again at its end. */
    const before = meta?.at === 'eligibility' || meta?.at === 'map';
    return before && atQuantify ? (getNotice?.() ?? '') : '';
  }

  return async (history, signal, meta): Promise<AgentTurn> => {
    const visit = getVisit();
    /* WHAT PHOEBE FOUND goes with every ask — item A17, 26 Sep 2026 — as ids
       and states only. Her `because` and her routes stay on her side. */
    const sheet: FoundSheet[] = carriedSheet(getSheet(), HER_PACKS).map(({ pack, rows, sorts }) => ({
      pack,
      rows: rows.map(({ id, state }) => ({ id, state })),
      ...(sorts ? { sorts } : {}),
    }));
    const answer = await askWellington(
      history.map(({ role, text }) => ({
        role: role === 'agent' ? ('assistant' as const) : ('user' as const),
        content: text,
      })),
      signal,
      /* A question carried in from the production landing says so, so the
         relay can count it under the carried cap (item S13). */
      meta?.carried === true,
      recordFrom(visit),
      visit.stage,
      /* The desk's one turn when the visitor comes back from Phoebe is sent
         through askOpened, so it arrives here as `opened`. */
      { sheet, returned: meta?.opened === true, ...(meta?.at ? { at: meta.at } : {}), ...(meta?.to ? { to: meta.to } : {}), ...(getMap ? { map: getMap() } : {}) }
    );
    if (Object.keys(answer.learned).length > 0) onLearned(answer.learned);
    /* W24, 14 Nov 2026: on Phoebe's page he speaks to her, so her page gets
       his introduction; his reply to the visitor stays here. Without one, his
       reply is shown there as before (W22). */
    /* On a hand-off the visitor is on that page already, so nothing is routed: the line is put at its head. */
    if (meta?.at === 'handoff') {
      if (meta.to && answer.route !== 'none') onHandedOver?.(meta.to, answer.introduction ?? answer.reply);
    } else {
    onRouted(answer.route, answer.introduction ?? answer.reply, answer.introduction !== undefined);
    }
    const caption = answer.refused ? REFUSED_LINE[answer.refused] : notice(meta);
    return {
      role: 'agent',
      text: answer.reply,
      evidence: [],
      abstained: answer.abstained,
      action: actionFor(answer.route),
      answers: answer.answers,
      ...(caption ? { caption } : {}),
      /* In another agent's chat, "Keep chatting" focuses that chat's box. */
      /* A handoff's two buttons are the answer to it. Otherwise, on his own desk, the chips that answer what he just
         asked; in another agent's chat the box is that agent's, so he draws none there. */
      buttons: buttonsAfter(answer.route, answer.answers, meta),
    };
  };
}
