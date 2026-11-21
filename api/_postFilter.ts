/**
 * The filter in front of the supporters board — the maintainer's word of 18 Nov 2026 on #176: block
 * sexually explicit words, the worst rude words and obvious spam, and show a plain message when a
 * post is blocked. It reads only what would go on the page (the name and comment, and the title and
 * organisation where the form shows them), and it says only "blocked" or not: it never names the word.
 *
 * KEPT SHORT ON PURPOSE. A long list blocks real people: "stopcock" is a plumbing word, Scunthorpe a
 * town, and water work speaks of sanitation and of women's safety at the water point. So:
 *   - a few stems are blocked anywhere inside a word, because no ordinary word holds them;
 *   - the rest are blocked only as whole words, with a plain ending (-s, -es, -ing, -ed);
 *   - letters swapped for look-alikes (f*ck, sh1t, @ss) and words spelled out (f u c k) are read back.
 * Links are refused before this, in api/_supporters.ts. Nothing here is a person's name list.
 */

/** Blocked anywhere inside a word. */
const INSIDE = [
  'fuck', 'motherf', 'nigger', 'faggot', 'blowjob', 'handjob', 'cumshot', 'gangbang', 'pornhub', 'onlyfans',
  'asshole', 'arsehole', 'dickhead', 'wanker', 'masturbat', 'pedophil', 'paedophil', 'bullshit', 'horseshit',
];

/** Blocked as whole words, with a plain ending. */
const WORDS = [
  // the worst rude words
  'shit', 'shitty', 'cunt', 'bitch', 'twat', 'fuk', 'fck', 'fuq', 'stfu', 'slut', 'whore',
  // slurs
  'nigga', 'fag', 'retard', 'kike', 'spic', 'chink', 'tranny',
  // sexually explicit
  'porn', 'porno', 'xxx', 'nsfw', 'nude', 'nudes', 'tits', 'titty', 'titties', 'boob', 'boobs', 'pussy', 'cock',
  'penis', 'vagina', 'dildo', 'milf', 'hentai', 'orgasm', 'horny', 'sexy', 'sexting', 'camgirl', 'erotic',
  // obvious spam
  'viagra', 'cialis', 'casino', 'betting', 'gambling', 'forex', 'bitcoin', 'crypto', 'payday',
  'backlink', 'whatsapp', 'telegram', 'escort',
];

/** Obvious spam, as phrases. */
const PHRASES = ['click here', 'buy now', 'make money', 'earn money', 'free money', 'work from home', 'promo code', 'dating site', 'dm me'];

/* No -y or -er: "spic" + y is spicy, and "cock" + er is a dog and a surname. */
const ENDINGS = ['', 's', 'es', 'ing', 'ed'];

const LOOK_ALIKES: Record<string, string> = { '0': 'o', '1': 'i', '!': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', $: 's', '7': 't', '*': 'u' };

/** Lower case, accents off, look-alike letters read back. */
function plain(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[01!34@5$7*]/g, (c) => LOOK_ALIKES[c] ?? c);
}

/** The words of a text, with letters spelled out one by one ("f u c k", "f.u.c.k") joined back up. */
function words(text: string): string[] {
  const tokens = plain(text).split(/[^a-z]+/).filter(Boolean);
  const out: string[] = [];
  let run = '';
  for (const t of tokens) {
    if (t.length === 1) {
      run += t;
      continue;
    }
    if (run.length > 1) out.push(run);
    run = '';
    out.push(t);
  }
  if (run.length > 1) out.push(run);
  return out;
}

function blockedWord(word: string): boolean {
  if (INSIDE.some((stem) => word.includes(stem))) return true;
  return WORDS.some((w) => ENDINGS.some((e) => word === w + e));
}

/** A phone number (nine digits or more, so "1 000 000 litres" passes) or an address to write to is an advert on a public board. */
const CONTACT = /(\S+@\S+\.\S+|@[a-z0-9_]{3,}|(?:\+?\d[\s\-().]*){9,})/i;
/** The same character ten times, or the same word five times running. */
const NOISE = /(.)\1{9,}|\b(\w+)\b(?:\W+\2\b){4,}/i;

/** True when any of these texts must not go on the board. */
export function blockedPost(texts: string[]): boolean {
  for (const text of texts) {
    if (!text) continue;
    if (CONTACT.test(text) || NOISE.test(text)) return true;
    const p = ` ${words(text).join(' ')} `;
    if (PHRASES.some((phrase) => p.includes(` ${phrase} `))) return true;
    if (words(text).some(blockedWord)) return true;
  }
  return false;
}

/** What the visitor reads when a post is blocked. Plain words; it never names the word. */
export const BLOCKED_LINE =
  'This can’t go on the page. Please take out rude or sexual words, phone numbers, email addresses and anything that looks like an advert, then send it again. Nothing was kept.';
