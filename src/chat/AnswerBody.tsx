/**
 * Level 1, with its markers.
 *
 * The plain answer is what a reader gets by default and is complete on its own.
 * A marker sits inline where a card carries a point; activating it opens the one
 * line of Level 2 beneath that paragraph, close to the sentence it belongs to
 * rather than in a footer the reader has to hunt through.
 *
 * THE READER CHOOSES. Nothing is expanded until someone asks for it — a citation
 * means everything is look-up-able, not that everything is shown.
 *
 * THE MARKER IS A BUTTON, not a link. It discloses something already on the
 * page; the link out to the publisher lives inside the line it opens.
 */

import { useState } from 'react';
import CiteLine, { DataTableNote } from './CiteLine';
import { emphasiseClosingQuestion, layoutAnswer, type Evidence, type Segment } from './evidence';

export default function AnswerBody({
  text,
  evidence,
  boldClosingQuestion = false,
}: {
  text: string;
  evidence: Evidence[];
  /** Set the closing question in bold. Display only; Phoebe's chat asks for it. */
  boldClosingQuestion?: boolean;
}) {
  const layout = layoutAnswer(text, evidence);
  const paragraphs = boldClosingQuestion ? emphasiseClosingQuestion(layout.paragraphs) : layout.paragraphs;
  const [open, setOpen] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /* One piece of prose: text as it is, a chip as its button. The bold closing
     question draws its own pieces through here, so a chip inside it still opens. */
  function drawSegment(segment: Segment, key: number) {
    if (segment.kind === 'text') return segment.text;
    return (
      <button
        key={key}
        type="button"
        className="tag wb-cite-marker"
        onClick={() => toggle(segment.item.id)}
        aria-expanded={open.has(segment.item.id)}
        aria-controls={`cite-${segment.item.id}`}
        aria-label={`Reference ${segment.ref}: ${segment.item.label}`}
      >
        ref{segment.ref}
      </button>
    );
  }

  return (
    <>
      {paragraphs.map((segments, p) => {
        /* The citations to show under this paragraph: markers in it, opened,
           each shown once however many times its marker appears. */
        const shown: { ref: number; item: Evidence }[] = [];
        for (const segment of segments.flatMap((s) => (s.kind === 'strong' ? s.parts : [s]))) {
          if (segment.kind !== 'marker') continue;
          if (!open.has(segment.item.id)) continue;
          if (shown.some((s) => s.item.id === segment.item.id)) continue;
          shown.push({ ref: segment.ref, item: segment.item });
        }

        return (
          <div key={p} style={{ marginBottom: 9 }}>
            <p
              className="t-body"
              style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', whiteSpace: 'pre-wrap' }}
            >
              {segments.map((segment, i) =>
                segment.kind === 'strong' ? (
                  <strong key={i} style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    {segment.parts.map((part, j) => drawSegment(part, j))}
                  </strong>
                ) : (
                  drawSegment(segment, i)
                )
              )}
            </p>

            {shown.map(({ ref, item }) => (
              <div key={item.id} style={{ marginTop: 6 }}>
                <div className="t-caption" style={{ marginBottom: 3, color: 'var(--ink-2)' }}>
                  ref{ref} · {item.label}
                </div>
                <CiteLine item={item} id={`cite-${item.id}`} />
                {item.isDataTable && <DataTableNote />}
              </div>
            ))}
          </div>
        );
      })}

      {/* Evidence the agent cited but never marked. Shown rather than dropped:
          a forgotten marker must not silently remove a citation. */}
      {layout.unmarked.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 9, borderTop: '1px solid var(--line)' }}>
          <div className="eyebrow" style={{ marginBottom: 7, fontSize: 9.5 }}>
            Also rests on
          </div>
          {layout.unmarked.map((item) => (
            <div key={item.id} style={{ marginBottom: 8 }}>
              <div className="t-caption" style={{ marginBottom: 3, color: 'var(--ink-2)' }}>
                {item.label}
              </div>
              <CiteLine item={item} />
              {item.isDataTable && <DataTableNote />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
