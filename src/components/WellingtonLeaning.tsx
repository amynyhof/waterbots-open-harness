/**
 * Wellington, leaning — the figure from the maintainer's concept note, carried
 * in by her hand on 28 Oct 2026 and drawn here as she sent it: his house form
 * (rounded-square head, ringed eye and dot eye, gentle wave mouth, straight
 * antenna with a haloed dot) leaning back at ease. Only the colours move to
 * tokens: Tide through currentColor, and the face's white through --card.
 *
 * Decoration only: hidden from screen readers, never clickable, and faded, so
 * it stays in the background.
 */

import type { CSSProperties } from 'react';

const FACE = { stroke: 'var(--card)' } as const;

export default function WellingtonLeaning({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 360"
      width={330}
      height={371}
      className={className}
      aria-hidden
      focusable="false"
      style={{ color: 'var(--tide)', pointerEvents: 'none', overflow: 'visible', ...style }}
    >
      <path
        d="M 196 336 Q 150 300 112 286 Q 92 310 66 344"
        stroke="currentColor"
        strokeWidth={15}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx={56} cy={348} rx={17} ry={9} fill="currentColor" />
      <path d="M 206 342 L 48 340" stroke="currentColor" strokeWidth={15} fill="none" strokeLinecap="round" />
      <ellipse cx={36} cy={338} rx={17} ry={9} fill="currentColor" transform="rotate(-12 36 338)" />
      <g transform="rotate(14 210 345)">
        <rect x={176} y={226} width={68} height={120} rx={24} fill="currentColor" />
        <path d="M 196 252 Q 150 262 118 286" stroke="currentColor" strokeWidth={13} fill="none" strokeLinecap="round" />
        <circle cx={114} cy={288} r={10} fill="currentColor" />
        <line x1={226} y1={96} x2={240} y2={44} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
        <circle cx={242} cy={36} r={11} fill="currentColor" />
        <circle cx={242} cy={36} r={20} fill="none" stroke="currentColor" strokeWidth={2.4} opacity={0.5} />
        <path d="M 232 248 Q 284 268 292 324" stroke="currentColor" strokeWidth={13} fill="none" strokeLinecap="round" />
        <ellipse cx={294} cy={330} rx={12} ry={8} fill="currentColor" transform="rotate(-14 294 330)" />
        <rect x={128} y={94} width={144} height={128} rx={44} fill="currentColor" />
        <circle cx={160} cy={150} r={17} fill="none" strokeWidth={4.5} style={FACE} />
        <circle cx={154} cy={150} r={5} style={{ fill: 'var(--card)' }} />
        <path d="M 134 190 Q 146 200 160 194" strokeWidth={4.5} fill="none" strokeLinecap="round" style={FACE} />
      </g>
    </svg>
  );
}
