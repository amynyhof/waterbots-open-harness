/**
 * An agent's face, wherever one is drawn — the portrait, or the first letter of the name where the brand
 * book holds no portrait yet (Violet, 23 Nov 2026, J5). The letter is type in ink, never a drawing: what
 * the book does not carry is raised with the maintainer, never invented. When her portrait is in
 * brand/assets/bots, crew.ts names it and this draws it.
 */

export default function AgentFace({ portrait, name, size, alt = '' }: { portrait: string; name: string; size: number; alt?: string }) {
  if (portrait) return <img src={portrait} alt={alt} width={size} height={size} style={{ display: 'block' }} />;
  return (
    <span
      aria-hidden={alt === '' ? true : undefined}
      aria-label={alt === '' ? undefined : alt}
      style={{
        display: 'grid',
        placeItems: 'center',
        width: size,
        height: size,
        fontFamily: 'var(--font-sans)',
        fontSize: Math.round(size * 0.6),
        fontWeight: 600,
        lineHeight: 1,
        color: 'var(--ink)',
      }}
    >
      {name.slice(0, 1)}
    </span>
  );
}
