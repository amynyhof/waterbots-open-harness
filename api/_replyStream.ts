/**
 * Phoebe's reply, read out of her answer while it is still being written.
 *
 * WHY. Her answer is one JSON object (her prompt's response shape), and the
 * visitor reads only its `reply` field. Waiting for the whole object meant
 * waiting for every field after the reply too — the rows, their reasons, the
 * cited cards — before a single word showed. Streamed, the relay reads the
 * reply's text out of the object as it grows and sends each new piece on. The
 * maintainer's word of 13 Nov 2026 (P13).
 *
 * NOT A SECOND PARSER OF THE ANSWER. This reads one string and nothing else,
 * and nothing it returns is ever recorded or trusted: the whole answer is still
 * parsed and checked by the relay once it is finished, and that checked answer
 * is what the console keeps. A streamed piece is only ever shown, and is
 * replaced by the checked reply when it arrives.
 */

const ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  b: '\b',
  f: '\f',
  '"': '"',
  '\\': '\\',
  '/': '/',
};

/**
 * The reply's text so far, decoded, or null while the reply has not started.
 *
 * Stops short of an escape that is only half written, so a piece never ends in
 * a stray backslash. Reads the first `"reply"` key; a key of that name inside
 * another field's text cannot match, because there its quotes are escaped.
 */
export function replySoFar(partial: string): string | null {
  const key = /"reply"\s*:\s*"/.exec(partial);
  if (!key) return null;
  let i = key.index + key[0].length;
  let out = '';
  while (i < partial.length) {
    const ch = partial[i];
    if (ch === '"') return out;
    if (ch === '\\') {
      const next = partial[i + 1];
      if (next === undefined) break;
      if (next === 'u') {
        const hex = partial.slice(i + 2, i + 6);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) break;
        out += String.fromCharCode(parseInt(hex, 16));
        i += 6;
        continue;
      }
      out += ESCAPES[next] ?? next;
      i += 2;
      continue;
    }
    out += ch;
    i += 1;
  }
  return out;
}

/** The value of `needCards` once it is written, or null before then. */
export function needCardsSoFar(partial: string): string | null {
  return /"needCards"\s*:\s*"([^"\\]*)"/.exec(partial)?.[1] ?? null;
}
