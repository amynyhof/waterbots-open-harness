/**
 * The free desk — Wellington's dispatch desk on the open site.
 *
 * THE DESK IS THE FIRST AGENT SCREEN — item S16, slice 2, 9 Sep 2026. The
 * screen (src/screen/AgentScreen.tsx) is built once and the desk is its first
 * consumer: Wellington's chat in bubbles on the Chat tab, his Knowledge pack
 * and Credentials tabs beside it, and "Next phase: Eligibility" at the right
 * end of the row. He has no tool, so there is no Tool tab. The look follows
 * the pictures of 8 Sep 2026 (#61), approved on pixels with three rulings.
 *
 * SLICE 3 MOVED THE CHAT OUT. The header, the bubbles and the composer that
 * slice 2 built here are now src/screen/ScreenChat.tsx, so Phoebe's screen
 * draws its conversation with the same component; and the credentials tab is
 * src/screen/CredentialsTab.tsx, one for every agent. This file is the desk's
 * identity and wiring, and the one sentence that is only his.
 *
 * THE CENTRE IS THE CONVERSATION AND NOTHING ELSE — maintainer's ruling 3 of
 * 4 Sep 2026, from the reference she brought in by hand: chat dominates the
 * page, no other noise. The host's header, his turns, the one composer. The
 * project context left the centre for the rail, where it is the record his
 * interview populates; the dispatch rows left for the crew column, where each
 * seat holds its own. Item S11's second pass.
 *
 * WELLINGTON IS LIVE HERE — a real agent on real machinery, on Phoebe's
 * proven pattern. The composer is the one composer per screen (BRAND.md §6),
 * and it is the same machine the docks used (src/chat/useConversation.ts) in
 * a different frame. There are NO scripted messages and no fake typing.
 *
 * HE ASKS THE PROJECT QUESTIONS HIMSELF, in the order the seats need them:
 * what it does, where, what it is called, what kind. His answers come back as
 * a field and write into the visit under one rule — a typed entry is never
 * overwritten, and the rail says where each field came from.
 *
 * THE CONVERSATION IS THE SHELL'S, not the desk's — App.tsx holds it and
 * hands it down, so stepping away and back never empties it.
 *
 * HIS KNOWLEDGE PACK TAB SAYS WHAT IS TRUE. Wellington carries no Knowledge
 * Pack — he works from the crew's roster and this visit's record — and the
 * tab says so in a sentence rather than showing an empty frame or inventing
 * a card. No mock data, ever.
 */

import type { ReactNode } from 'react';
import type { Conversation } from '../chat/useConversation';
import { nextPhaseAfter } from '../lib/journey';
import type { Surface } from '../lib/surfaces';
import { WELLINGTON } from '../lib/wellington';
import AgentScreen from '../screen/AgentScreen';
import CredentialsTab from '../screen/CredentialsTab';
import ScreenChat, { SCREEN_COLUMN } from '../screen/ScreenChat';

export default function Desk({
  chat,
  onNavigate,
}: {
  chat: Conversation;
  onNavigate: (surface: Surface) => void;
}) {
  const next = nextPhaseAfter('desk');
  const nextSurface = next?.surface ?? null;

  return (
    <AgentScreen
      host={WELLINGTON}
      next={next && nextSurface ? { label: next.label, go: () => onNavigate(nextSurface) } : null}
      tabs={{
        chat: <ScreenChat host={WELLINGTON} chat={chat} composerId="wb-desk-composer" />,
        pack: (
          <QuietTab heading={`${WELLINGTON.name}'s Knowledge Pack`}>
            {WELLINGTON.name} carries no Knowledge Pack. He works from what the crew can do and
            from what you tell him in this visit, and he points you to the right step. Phoebe's
            pack, the eligibility and feasibility cards, is on the Eligibility step.
          </QuietTab>
        ),
        credentials: <CredentialsTab host={WELLINGTON} />,
      }}
    />
  );
}

/* --------------------------------------------------------------------------
   A quiet tab — a heading and a sentence or two that say what is true. The
   honest empty state, in the screen column's measure.
   -------------------------------------------------------------------------- */

function QuietTab({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
        <h2 style={{ fontSize: 20, margin: '0 0 8px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
          {heading}
        </h2>
        <p className="t-body" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          {children}
        </p>
      </div>
    </div>
  );
}
