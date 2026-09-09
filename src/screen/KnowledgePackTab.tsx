/**
 * The Knowledge pack tab — the cards an agent works from, their version and
 * their sources, with "read more" layers. Item S16, slice 3, 9 Sep 2026.
 * Maintainer's amendment of 8 Sep 2026: the Knowledge pack is its own tab —
 * cards, versions, sources.
 *
 * IT DOES NOT KNOW WHOSE PACK IT IS SHOWING. An agent's seat assembles a
 * PackView from its own registry — Phoebe's from src/lib/phoebeCards.ts —
 * and this draws it: a heading, the tags, the approval as a chip, one source
 * line, then the groups of rows. A row opens to its layers and closes again;
 * the layers are the card's own plain words, and the citation beneath them
 * is the four-part shape CITATIONS.md fixes, drawn by CiteLine and nowhere
 * else.
 *
 * EVERY WORD COMES FROM A COMMITTED CARD. Nothing here paraphrases a source;
 * the cards already did, and each carries its section, page and canonical
 * link. A draft is named as a draft and never read.
 */

import { useState, type ReactNode } from 'react';
import CiteLine from '../chat/CiteLine';
import type { Citation } from '../lib/citation';
import { SCREEN_COLUMN } from './ScreenChat';

export interface PackLayer {
  heading: string;
  text?: string;
  bullets?: string[];
}

export interface PackRow {
  id: string;
  /** "1" or "B-3" — the card's number as the set numbers it. */
  badge: string;
  title: string;
  layers: PackLayer[];
  citation: Citation;
}

export interface PackGroup {
  label: string;
  rows: PackRow[];
}

export interface PackDraft {
  badge: string;
  title: string;
}

export interface PackView {
  heading: string;
  /** Values — the standard, the appendix — drawn as tags. */
  tags: string[];
  /** "approved 21 Aug 2026", drawn as a chip; null when nothing is approved. */
  approved: string | null;
  source: ReactNode;
  groups: PackGroup[];
  /** Sets drafted and not yet graded, named so and never read. */
  drafts?: PackDraft[];
  draftsNote?: string;
}

export default function KnowledgePackTab({ view }: { view: PackView }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ maxWidth: SCREEN_COLUMN, margin: '0 auto', padding: '22px var(--gutter) 24px' }}>
        <h2 style={{ fontSize: 20, margin: '0 0 8px', letterSpacing: '-0.015em', lineHeight: 1.25 }}>
          {view.heading}
        </h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
          {view.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
          {view.approved && (
            <span className="chip" style={{ ['--chip-role' as string]: 'var(--state-approved)' }}>
              {view.approved}
            </span>
          )}
        </div>
        <p className="t-body" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
          {view.source}
        </p>

        {view.groups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <div className="wb-pack-sec">
              <span className="label" style={{ color: 'var(--ink-3)' }}>
                {group.label}
              </span>
            </div>
            <div className="wb-pack-group">
              {group.rows.map((row) => {
                const isOpen = open.has(row.id);
                const panelId = `wb-pack-${row.id}`;
                return (
                  <div key={row.id}>
                    <button
                      type="button"
                      className="wb-pack-row"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(row.id)}
                    >
                      <span className="wb-pack-badge">{row.badge}</span>
                      <span>{row.title}</span>
                      <span className="wb-pack-more">{isOpen ? 'Read less' : 'Read more'}</span>
                    </button>
                    {isOpen && (
                      <div className="wb-pack-open" id={panelId}>
                        {row.layers.map((layer) => (
                          <div key={layer.heading}>
                            <div className="wb-pack-k">{layer.heading}</div>
                            {layer.text}
                            {layer.bullets && (
                              <ul>
                                {layer.bullets.map((b) => (
                                  <li key={b}>{b}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                        <div className="wb-pack-k">Source</div>
                        <CiteLine
                          item={{
                            id: row.id,
                            label: row.title,
                            citation: row.citation,
                            plainEnglish: row.layers[0]?.text ?? row.title,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {view.drafts && view.drafts.length > 0 && (
          <section aria-label="Drafted, not yet graded">
            <div className="wb-pack-sec">
              <span className="label" style={{ color: 'var(--ink-3)' }}>
                DRAFTED · NOT YET GRADED
              </span>
            </div>
            <div className="wb-pack-group">
              {view.drafts.map((draft) => (
                <div key={draft.badge} className="wb-pack-row" style={{ cursor: 'default' }}>
                  <span className="wb-pack-badge">{draft.badge}</span>
                  <span>{draft.title}</span>
                  <span
                    className="chip"
                    style={{ marginLeft: 'auto', ['--chip-role' as string]: 'var(--state-pending)' }}
                  >
                    not yet graded
                  </span>
                </div>
              ))}
            </div>
            {view.draftsNote && (
              <p className="t-caption" style={{ margin: '8px 0 0', color: 'var(--ink-3)' }}>
                {view.draftsNote}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
