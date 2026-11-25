/**
 * What an answer from Calvin or Violet has to pass before anything in it is filled in or filed — 25 Nov 2026, the
 * maintainer's word. The guards are code. They write no figure, and an agent cannot talk its way round one.
 *
 * 1. A NUMBER IS THE VISITOR'S OR IT IS NOT FILLED IN. A number an agent sends is taken only where the visitor gave it, as
 *    they gave it, in this chat. A default, an assumed value or a number worked out from theirs is not one they gave. The
 *    same amount written another way is: "1,600", "1.6 thousand" and "sixteen hundred"; "80%" and a share of 0.8.
 * 2. A KIND OF PROJECT IS THE VISITOR'S TOO. A label is filed only where their own words bear it out. Words for treatment
 *    never file a supply. Whether a kind gives a figure is core's answer alone: no list of what is covered is kept here.
 * 3. A NUMBER OUT OF RANGE IS READ HERE, in the visitor's own words, for the fact just asked about, so its message shows
 *    whether or not the agent sends it.
 *
 * What does not pass goes back to the agent once, in the same turn (api/_calculatorChat.ts). What still does not pass is
 * taken out, and the visitor is told it was not filled in.
 *
 * In its own module with no dependency, so the check scripts can load it compiled as the platform compiles it.
 */

/* --------------------------------------------------------------------------
   Numbers, as a visitor writes them.
   -------------------------------------------------------------------------- */

/** One number in a message: its value, and where it stands in the text. */
export interface Said {
  value: number;
  /** A percentage is the same amount as its share. */
  percent: boolean;
  start: number;
  end: number;
}

const UNITS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const SCALES: Record<string, number> = { k: 1e3, thousand: 1e3, lakh: 1e5, million: 1e6, mn: 1e6, m: 1e6, crore: 1e7, billion: 1e9, bn: 1e9 };
const PERCENT = /^\s*(?:%|percent\b|per cent\b|pct\b)/i;

/** A scale word straight after a number, and how long it is. A lone "m" is metres, so only a capital M touching it counts. */
function scaleAfter(text: string): { by: number; length: number } {
  const match = /^(?:(k|K|M)(?![\w²³])|\s*(thousand|lakhs?|million|mn|crores?|billion|bn)\b)/i.exec(text);
  if (!match) return { by: 1, length: 0 };
  const word = (match[1] ?? match[2]).toLowerCase().replace(/s$/, '');
  if (match[1] === 'm') return { by: 1, length: 0 };
  return { by: SCALES[word] ?? 1, length: match[0].length };
}

const times = (a: number, b: number): number => Number((a * b).toPrecision(15));

/** A whole number in English words, as tokens: "one thousand six hundred and twenty-five". */
function wordsValue(tokens: readonly string[]): number | null {
  let total = 0;
  let run = 0;
  let any = false;
  for (const token of tokens) {
    if (token === 'and' || token === 'a') {
      if (token === 'a' && !any) run = 1;
      continue;
    }
    if (token in UNITS) {
      run += UNITS[token];
      any = true;
    } else if (token === 'hundred') {
      run = (run || 1) * 100;
      any = true;
    } else if (SCALES[token] !== undefined) {
      total += (run || 1) * SCALES[token];
      run = 0;
      any = true;
    } else return null;
  }
  return any ? total + run : null;
}

const NUMBER_WORD = `(?:${Object.keys(UNITS).join('|')}|hundred|thousand|lakh|million|crore|billion)`;
const IN_WORDS = new RegExp(`\\b(?:a\\s+(?=hundred|thousand|lakh|million|crore|billion))?${NUMBER_WORD}(?:(?:\\s+and\\s+|[\\s-]+)${NUMBER_WORD})*\\b`, 'gi');
const PARTS: readonly (readonly [RegExp, number])[] = [
  [/\bthree[\s-]quarters?\b/gi, 0.75],
  [/\b(?:a\s+)?quarter\b/gi, 0.25],
  [/\bhalf\b/gi, 0.5],
];

/** Every number in a message. A number that a scale word follows is the whole of it, so "3 million" is never 3. */
export function numbersIn(text: string): Said[] {
  const out: Said[] = [];
  const digits = /(?<![\w.,])([-−]|minus\s+)?(\d{1,3}(?:[,'’ \u00a0\u202f]\d{2,3})*(?:[,'’ \u00a0\u202f]\d{3})(?!\d)|\d+)(?:([.,])(\d+))?/gi;
  for (const match of text.matchAll(digits)) {
    const start = match.index ?? 0;
    const sign = match[1] ? -1 : 1;
    const whole = match[2].replace(/[,'’ \u00a0\u202f]/g, '');
    /* "1,600" was read whole above, so a comma here is a decimal comma. */
    const value = Number(match[4] !== undefined ? `${whole}.${match[4]}` : whole) * sign;
    const scale = scaleAfter(text.slice(start + match[0].length));
    const end = start + match[0].length + scale.length;
    out.push({ value: times(value, scale.by), percent: PERCENT.test(text.slice(end)), start, end });
    /* "1.600" is written for 1,600 in much of the world. Both readings are in the words. */
    if (match[3] === '.' && match[4]?.length === 3 && whole.length <= 3 && whole !== '0') out.push({ value: times(Number(whole + match[4]) * sign, scale.by), percent: false, start, end });
  }
  /* A word already read as part of another number is not read again: the "million" of "3 million", the "quarter" of "three
     quarters". */
  const free = (start: number, end: number): boolean => !out.some((n) => start < n.end && end > n.start);
  for (const [pattern, value] of PARTS) {
    for (const match of text.matchAll(pattern)) {
      const start = match.index ?? 0;
      const joint = /^\s+an?\b/i.exec(text.slice(start + match[0].length))?.[0].length ?? 0;
      const scale = scaleAfter(text.slice(start + match[0].length + joint));
      const end = start + match[0].length + (scale.length > 0 ? joint + scale.length : 0);
      if (free(start, end)) out.push({ value: times(value, scale.by), percent: false, start, end });
    }
  }
  for (const match of text.matchAll(IN_WORDS)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (!free(start, end)) continue;
    const value = wordsValue(match[0].toLowerCase().split(/[\s-]+/));
    const sign = /\bminus\s+$/i.test(text.slice(0, start)) ? -1 : 1;
    if (value !== null) out.push({ value: value * sign, percent: PERCENT.test(text.slice(end)), start, end });
  }
  return out;
}

const same = (a: number, b: number): boolean => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/** The amount itself: a percentage as its share. */
const amount = (n: Said): number => (n.percent ? times(n.value, 0.01) : n.value);

/** Whether the visitor gave this number, in any of their messages in this chat. */
export function gave(messages: readonly string[], value: number): boolean {
  return messages.some((text) => numbersIn(text).some((n) => same(n.value, value) || (n.percent && same(amount(n), value))));
}

const NOTHING = /\b(?:zero|none|nothing|nil|no water)\b/i;
const NEW_SUPPLY = /\b(?:brand[- ]new|completely new|entirely new|totally new|new supply|did(?: not|n['’]t) exist)\b/i;
const CLEARS = /\b(?:clear|remove|delete|blank|undo|take (?:it|that|this) (?:out|off|away))\b/i;

/* --------------------------------------------------------------------------
   The kind of project, as a visitor tells it.
   -------------------------------------------------------------------------- */

/** What the visitor's words say the project does. */
export interface KindSaid {
  treats: boolean;
  /** Words only a supply, not a treatment plant, is told with. */
  supplies: boolean;
  /** A new or restored source, said beside treatment. */
  newSource: boolean;
  home: boolean;
  institution: boolean;
  central: boolean;
}

const TREATS =
  /\b(?:treat(?:s|ed|ing|ments?)?|purif\w+|filter\w*|filtrat\w+|disinfect\w*|chlorin\w+|sterili[sz]\w+|desalin\w+|decontaminat\w+|reverse osmosis|ultraviolet|uv|membranes?|(?:water|central|package) plants?|clean(?:s|ing) (?:(?:the|their|dirty|raw|river|lake|surface) )*water|ma(?:ke|kes|king|de) (?:(?:the|their|this|it|water) )*(?:safe|drinkable|potable))\b/gi;
const WELL = "(?:(?:a|an|the|one|two|three|four|five|\\d+|new|old|dug|drilled|deep|shallow|protected|open|community|village|our|their|rebuilt|restored|repaired) wells?|tube ?wells?|wells)";
const SOURCE = `(?:bore ?holes?|${WELL}|springs?|hand ?pumps?|rain ?water)`;
const SUPPLIES = new RegExp(`\\b(?:${SOURCE}|pumps?|suppl(?:y|ies)|sources?|pip(?:es?|ed|ing|elines?)|stand ?pipes?|drill\\w*)\\b`, 'i');
const NEW_SOURCE = new RegExp(
  `\\b(?:new|newly|restor\\w+|rehabilitat\\w+|rebuil\\w+|repair\\w*|drill\\w*|dig|digs|digging|dug|another|second|also|plus)\\b[^.?!;]{0,40}?\\b(?:${SOURCE}|sources?|suppl(?:y|ies))\\b|\\b(?:${SOURCE}|sources?|suppl(?:y|ies))\\b[^.?!;]{0,30}?\\b(?:restored|rehabilitated|rebuilt|repaired|drilled|dug|new)\\b`,
  'i'
);
const HOME = /\b(?:house ?holds?|homes?|houses?|famil(?:y|ies)|kitchens?|point[- ]of[- ]use)\b/i;
const INSTITUTION = /\b(?:schools?|clinics?|hospitals?|health cent(?:er|re)s?|prisons?|camps?|institution\w*|universit\w+)\b/i;
const CENTRAL = /\b(?:central\w*|plants?|kiosks?|stations?|municipal|piped|pipes|one point|community[- ]level)\b/i;

/** Said as not so: "no treatment", "does not treat it". Never "not only treatment", "not sure", or across a turn of the sentence. */
const DENIED = /\b(?:no|not|without|never|\w+n['’]t)(?!\s+(?:only|just|merely|sure|certain|yet)\b)(?:\s+(?!(?:but|rather|instead|it|this|that|its|is|only|just)\b)\w+){0,3}\s+$/i;

function mentionsTreatment(text: string): boolean {
  for (const match of text.matchAll(TREATS)) if (!DENIED.test(text.slice(0, match.index ?? 0))) return true;
  return false;
}

/** What the visitor's own words say, all of them together. Treatment once said is never taken back by a later word here. */
export function kindSaid(texts: readonly string[]): KindSaid {
  const any = (pattern: RegExp): boolean => texts.some((text) => pattern.test(text));
  return { treats: texts.some(mentionsTreatment), supplies: any(SUPPLIES), newSource: any(NEW_SOURCE), home: any(HOME), institution: any(INSTITUTION), central: any(CENTRAL) };
}

const isTreatment = (label: string): boolean => /treatment/i.test(label);

/** Whether the visitor's words bear a label out. The label is core's, and its own words say which kind it is. */
export function bearsOut(said: KindSaid, label: string): boolean {
  if (!isTreatment(label)) return said.supplies && !said.treats;
  /* Treatment with a new or restored source: a person on the WaterBots team looks at it, and nothing new is filed. */
  if (!said.treats || said.newSource) return false;
  if (/household/i.test(label)) return said.home && !said.central;
  if (/institution/i.test(label)) return said.institution;
  return said.central || (!said.home && !said.institution);
}

/** Whether the visitor has since said something the kind filed in a chat does not fit, so it comes off the record. */
export function nowDenied(said: KindSaid, label: string): boolean {
  return said.treats && (!isTreatment(label) || (/household/i.test(label) && said.central));
}

/* --------------------------------------------------------------------------
   One answer, checked.
   -------------------------------------------------------------------------- */

/** What the relay knows of the agent's screen, for one turn. Fields are named as the answer names them. */
export interface TurnGuard {
  /** The fact just asked about, by the package's own key, and the field it fills. */
  asked: string | null;
  /** What a field holds now, so a number sent again changes nothing and is nobody's fault. */
  held: (field: string) => number | null | undefined;
  /** The package's own message where a field refuses a number, or null. */
  refuses: (field: string, value: number) => string | null;
  /** Fields a visitor names by the words around a number, each with what the agent calls it. */
  named: Partial<Record<NamedBy, string>>;
  /** What the project does, in the visitor's own words to Wellington. */
  does: string;
  /** The kind already on the record, and whether one of these two chats filed it. */
  kind: string;
  filedInChat: boolean;
}

export interface Checked<T> {
  answer: T;
  /** Numbers taken out that the visitor did not give, as the note to the agent names them. */
  numbers: { field: string; value: number | null }[];
  /** A kind taken out that their words do not bear out. */
  kind: string | null;
}

interface Answer {
  facts?: unknown;
  values?: unknown;
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

/** A copy of one part of an answer, with each number and each cleared value kept or left out. */
function sift(part: Record<string, unknown>, path: string, keep: (field: string, value: number | null) => boolean): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(part)) {
    const field = path ? `${path}.${key}` : key;
    if (typeof value === 'number' || value === null) {
      if (keep(field, value)) out[key] = value;
    } else if (isObject(value)) {
      const inner = sift(value, field, keep);
      /* A value with its source, less its value, is nothing. */
      if (Object.keys(inner).length > 0 && !('value' in value && !('value' in inner))) out[key] = inner;
    } else out[key] = value;
  }
  return out;
}

/** The answer with only what the visitor gave in this chat. `messages` are their own words here, oldest first. */
export function checkAnswer<T extends Answer>(answer: T, messages: readonly string[], guard: TurnGuard): Checked<T> {
  const numbers: Checked<T>['numbers'] = [];
  const last = messages[messages.length - 1] ?? '';
  const keep = (field: string, value: number | null): boolean => {
    /* A fact's own name is the same in both parts of an answer. */
    const held = guard.held(field);
    if (value === null ? held === null || held === undefined : held === value) return false;
    const ok =
      value === null
        ? CLEARS.test(last)
        : gave(messages, value) ||
          (value === 0 && field === guard.asked && (NOTHING.test(last) || (field === 'withoutProjectM3PerYear' && NEW_SUPPLY.test(last))));
    if (!ok) numbers.push({ field, value });
    return ok;
  };
  const facts = isObject(answer.facts) ? sift(answer.facts, '', keep) : undefined;
  const values = isObject(answer.values) ? sift(answer.values, '', keep) : undefined;

  let kind: string | null = null;
  const filed = isObject(facts?.technology) ? facts.technology.label : undefined;
  if (facts && typeof filed === 'string') {
    /* The record's own kind said again files nothing. One already there is never changed from a calculator's chat. */
    const ok = guard.kind === '' && bearsOut(kindSaid([guard.does, ...messages]), filed);
    if (!ok) {
      delete facts.technology;
      if (filed !== guard.kind) kind = filed;
    }
  }
  return { answer: { ...answer, ...(facts ? { facts } : {}), ...(values ? { values } : {}) }, numbers, kind };
}

/* --------------------------------------------------------------------------
   A number out of range, read in the visitor's own words.
   -------------------------------------------------------------------------- */

/** The words that name a value beside its number, so "400 days" is the days whatever was asked. */
export type NamedBy = 'days' | 'hours a day' | 'hours a year' | 'litres a person' | 'people a household' | 'fnrb';

const NAMES: readonly (readonly [NamedBy, RegExp])[] = [
  ['days', /^[\s-]*days?\b(?!\s*(?:ago|before|earlier|later|from now))/i],
  ['hours a day', /^\s*(?:hours?|hrs?)\s*(?:a|per|each|every|in a|\/)\s*day\b/i],
  ['hours a year', /^\s*(?:hours?|hrs?)\s*(?:a|per|each|every|in a|\/)\s*year\b/i],
  ['litres a person', /^\s*(?:l|lit(?:re|er)s?)\s*(?:a|per|each|for each|\/)\s*(?:person|head|capita)\b/i],
  ['people a household', /^\s*(?:people|persons|members)?\s*(?:in|per|to|for|\/)\s*(?:a |each |every )?(?:household|home|house|family)\b/i],
];
const FNRB_BEFORE = /\bfnrb\b[^.\d]{0,24}$/i;
const YEAR_BEFORE = /\b(?:in|since|from|of|by|until|during)\s+$/i;
/** A number that counts something else is not the answer to a question about a share, days or an amount of water. */
const COUNTS_ELSE = /^\s*(?:people|persons|households|homes|families|villages|schools|users|months?|years?|weeks?|km|kilomet\w+|met(?:re|er)s?|usd|dollars?)\b/i;

/** The messages for numbers in the visitor's last words that are out of range, each once. */
export function refusedIn(text: string, guard: TurnGuard): string[] {
  const out: string[] = [];
  const forAsked: Said[] = [];
  const said = numbersIn(text);
  for (const n of said) {
    /* Two readings of one number ("1.600") are never a refusal by the other. */
    const twin = said.some((o) => o !== n && o.start === n.start);
    const after = text.slice(n.end);
    const name = FNRB_BEFORE.test(text.slice(0, n.start)) ? 'fnrb' : NAMES.find(([, pattern]) => pattern.test(after))?.[0];
    if (name !== undefined) {
      const field = guard.named[name];
      const message = field === undefined || twin ? null : guard.refuses(field, amount(n));
      if (message !== null) out.push(message);
      continue;
    }
    if (n.value >= 1900 && n.value <= 2100 && YEAR_BEFORE.test(text.slice(0, n.start))) continue;
    if (guard.asked !== null && !/^(?:population|household)/.test(guard.asked) && COUNTS_ELSE.test(after)) continue;
    forAsked.push(n);
  }
  /* Where one of several is in range, that one is the answer. */
  const { asked } = guard;
  if (asked !== null && forAsked.length > 0) {
    const messages = forAsked.map((n) => guard.refuses(asked, amount(n)));
    if (messages.every((m) => m !== null)) out.push(...(messages as string[]));
  }
  return [...new Set(out)];
}

/* --------------------------------------------------------------------------
   What the agent is told. Facts about the site's own checks, never lines to say.
   -------------------------------------------------------------------------- */

/** After the package's block: the four kinds, so the right one is filed. The lines are the site's own project type list. */
export function siteNote(kinds: readonly { id: string; name: string; plain: string }[], denied: boolean): string {
  return [
    '# From this site: the kinds of drinking-water project',
    '',
    ...kinds.map((k) => `- ${k.id}, ${k.name}: ${k.plain}`),
    '',
    'File a kind only from what the visitor has said. A project that treats water is never filed as a supply. If they say it also has a new or restored source, say that a person on the WaterBots team should look at it, and file no kind.',
    ...(denied ? ['', 'What the visitor has said does not fit the kind that was filed here, so the site has taken it off the record and shows no figure. Ask what the project builds.'] : []),
  ].join('\n');
}

/** The same question again, with what did not pass. Never shown. */
export function sentBackNote(checked: Pick<Checked<Answer>, 'numbers' | 'kind'>): string {
  return [
    '# Sent back by this site',
    '',
    'Your answer held something the visitor has not said in this chat. The site has filled in none of it:',
    ...checked.numbers.map((n) => `- ${n.field}: ${n.value === null ? 'cleared, and they did not ask for that' : n.value}`),
    ...(checked.kind !== null ? [`- the kind of project: ${checked.kind}. Wellington can settle it with them: if they are sure, set handBack to "wellington".`] : []),
    '',
    'Only a number the visitor gave is filled in, as they gave it. A default, an assumed value or one worked out from theirs is not one they gave. If a fact is needed in another unit, ask them for it in that unit. Answer the visitor again, and do not say that any of it is filled in.',
  ].join('\n');
}
