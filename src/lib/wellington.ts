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

import wellingtonPortrait from '../../brand/assets/bots/wellington.svg';
import type { AgentHost, AgentTurn, Ask, TurnAction } from '../chat/evidence';
import { carriedSheet } from './phoebeClient';
import type { Learned, Visit } from './visit';
import { askWellington, type FoundSheet, type VisitRecord, type WellingtonRoute } from './wellingtonClient';
import { HER_PACKS } from './worksheet.generated';
import type { Sheet } from './worksheetState';

export const WELLINGTON: AgentHost = {
  name: 'Wellington',
  role: 'Team Lead',
  portrait: wellingtonPortrait,
  colourToken: '--bot-wellington',
  composerPlaceholder: 'Reply to Wellington',
  composerNote: 'Nothing is kept between visits. Thirty messages a day.',
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

/** The visit as the relay expects it, or nothing when every field is blank. */
function recordFrom(visit: Visit): VisitRecord | null {
  const record: VisitRecord = {
    does: visit.context.does.trim(),
    type: visit.context.type,
    gsClass: visit.context.gsClass,
    stage: visit.context.stage,
    place: visit.context.place.trim(),
    name: visit.context.name.trim(),
    ...(visit.context.served ? { served: visit.context.served } : {}),
  };
  return record.does || record.type || record.stage || record.place || record.name || record.served ? record : null;
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
  onRouted: (route: WellingtonRoute, reply: string) => void,
  getSheet: () => Sheet
): Ask {
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
      { sheet, returned: meta?.opened === true }
    );
    if (Object.keys(answer.learned).length > 0) onLearned(answer.learned);
    onRouted(answer.route, answer.reply);
    return {
      role: 'agent',
      text: answer.reply,
      evidence: [],
      abstained: answer.abstained,
      action: actionFor(answer.route),
    };
  };
}
