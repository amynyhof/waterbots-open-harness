/**
 * The Knowledge pack tab — the cards an agent works from, their version and
 * their sources, with "read more" layers. Item S16, slice 3, 9 Sep 2026.
 * Maintainer's amendment of 8 Sep 2026: the Knowledge pack is its own tab —
 * cards, versions, sources.
 *
 * IT DOES NOT KNOW WHOSE PACK IT IS SHOWING. An agent's seat assembles a
 * PackView from its own registry — Phoebe's from src/lib/phoebeCards.ts —
 * and this draws it: a heading, an optional honest line, then one section
 * per pack, each with its tags, its version, one source line and its sets of
 * rows, each set with its own approval chip. A row opens to its layers and
 * closes again; the layers are the card's own plain words, and the citation
 * beneath them is the four-part shape CITATIONS.md fixes, drawn by CiteLine
 * and nowhere else.
 *
 * EVERY WORD COMES FROM A COMMITTED CARD. Nothing here paraphrases a source;
 * the cards already did, and each carries its section, page and canonical
 * link. A draft is named as a draft and never read.
 *
 * RESHAPED 23 SEP 2026 — build-order step 1 under "V1 — the done line", the
 * maintainer's rulings R1 to R10 on the Knowledge-tab proposal. A view holds
 * sections, one per pack, so Phoebe's two pathways show one under the other;
 * the approval chip sits on each set, because the water pack's sets were
 * approved on two dates (R2); a row may wear a phase tag, the card's own Phase
 * word (R1); an ungraded set says "Draft" and nothing more (R4); the Evals
 * section at the foot says no exam has run and points at Credentials (R5);
 * a pack's version is read from its README and worn as a tag (R10). A view
 * with no section label draws as the tab drew before this day, so a seat that
 * holds one pack looks as it did.
 *
 * CALVIN AND BRIDGET JOINED IT ON 24 SEP 2026, the proposal's step 3: their
 * rows wear their tool folders' versions, both tabs gained the Evals section,
 * and Bridget's own MapSources component was retired into this one, so one
 * component now draws every agent's Knowledge tab. An unlabelled section with
 * nothing to tag draws no tag strip at all.
 *
 * A TAG IS A VALUE, A CHIP IS A STATE — CITATIONS.md's own test. The
 * document's short name, the version and the phase are tags; an approval
 * date and "Draft" are chips.
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
  /** "1", "B-3", "M12" or "R-5" — the card's id as the set numbers it. */
  badge: string;
  title: string;
  /**
   * A value drawn as a tag on the row — the card's phase, where it has one,
   * or a tool folder's own version, where the row is a tool rather than a
   * card (Calvin's method packs and Bridget's datasets, 24 Sep 2026).
   */
  tag?: string;
  layers: PackLayer[];
  citation: Citation;
  /** Further canonical links the card names beyond the cite line's, in the card's order. */
  moreLinks?: string[];
}

export interface PackSet {
  label: string;
  /** "approved 21 Aug 2026", drawn as a chip; null when nothing is approved. */
  approved: string | null;
  rows: PackRow[];
}

export interface PackSection {
  key: string;
  /** "Water pathway" — drawn as a heading when a view holds more than one pack. */
  label?: string;
  /** Values — the standard, the appendix — drawn as tags. */
  tags: string[];
  /** "0.7.0", drawn as a tag; null when the pack carries no version. */
  version: string | null;
  source: ReactNode;
  sets: PackSet[];
}

export interface PackDraft {
  badge: string;
  title: string;
}

export interface PackView {
  heading: string;
  /** One honest line under the heading, site copy, when the tab needs one. */
  note?: string;
  sections: PackSection[];
  /** Sets drafted and not yet approved, named so and never read. */
  drafts?: PackDraft[];
  /** Whether to draw the Evals section. */
  evals: boolean;
}

/**
 * The Evals section's one line, the same for every agent (ruling R5,
 * 23 Sep 2026). The only public grade is the one public exam's, kept outside
 * this repository (the one-grader ruling, item S18); its results will show on
 * the Credentials tab once a reader for its result format exists.
 */
export const EVALS_LINE =
  'No exams run yet. Results will show on the Credentials tab, from the one public exam run ' +
  "outside this site on real projects and real knowledge packs. The reader for those results waits " +
  "for that exam's own result format.";

const shortHref = (href: string) => href.replace(/^https?:\/\//, '');

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
        {view.note && (
          <p className="t-body" style={{ margin: '0 0 10px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
            {view.note}
          </p>
        )}

        {view.sections.map((section) => (
          <section key={section.key} aria-label={section.label ?? section.key}>
            {section.label ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '26px 0 8px' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {section.label}
                </h3>
                <Tags section={section} />
              </div>
            ) : (
              (section.tags.length > 0 || section.version) && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                  <Tags section={section} />
                </div>
              )
            )}
            <p className="t-body" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
              {section.source}
            </p>

            {section.sets.map((set) => (
              <div key={set.label}>
                <div className="wb-pack-sec" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="label" style={{ color: 'var(--ink-3)' }}>
                    {set.label}
                  </span>
                  {set.approved && (
                    <span className="chip" style={{ ['--chip-role' as string]: 'var(--state-approved)' }}>
                      {set.approved}
                    </span>
                  )}
                </div>
                <div className="wb-pack-group">
                  {set.rows.map((row) => {
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
                          {row.tag && <span className="tag">{row.tag}</span>}
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
                            {row.moreLinks && row.moreLinks.length > 0 && (
                              <p className="t-caption" style={{ margin: '6px 0 0', color: 'var(--ink-3)' }}>
                                {row.moreLinks.length === 1 ? 'Second link: ' : 'Second links: '}
                                {row.moreLinks.map((href, i) => (
                                  <span key={href}>
                                    {i > 0 && ', '}
                                    <a className="wb-row-action" href={href} target="_blank" rel="noopener noreferrer">
                                      {shortHref(href)}
                                    </a>
                                  </span>
                                ))}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        ))}

        {view.drafts && view.drafts.length > 0 && (
          <section aria-label="Drafted, not approved">
            <div className="wb-pack-sec">
              <span className="label" style={{ color: 'var(--ink-3)' }}>
                DRAFTED · NOT APPROVED
              </span>
            </div>
            <div className="wb-pack-group">
              {view.drafts.map((draft) => (
                <div key={draft.badge} className="wb-pack-row" style={{ cursor: 'default' }}>
                  <span className="wb-pack-badge">{draft.badge}</span>
                  <span>{draft.title}</span>
                  {/* A state, so a chip: outlined at 40% of the pending colour,
                      no fill, the text in ink. "Draft" and nothing more (R4). */}
                  <span
                    className="chip"
                    style={{ marginLeft: 'auto', ['--chip-role' as string]: 'var(--state-pending)' }}
                  >
                    Draft
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {view.evals && (
          <section aria-label="Evals">
            <div className="wb-pack-sec">
              <span className="label" style={{ color: 'var(--ink-3)' }}>
                EVALS
              </span>
            </div>
            <p className="t-body" style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-2)' }}>
              {EVALS_LINE}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

/** The section's tags: the document's short name and the like, then the version. */
function Tags({ section }: { section: PackSection }) {
  return (
    <>
      {section.tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
      {section.version && <span className="tag">v{section.version}</span>}
    </>
  );
}
