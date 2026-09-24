/**
 * The tool definition files — build check.
 *
 * A tool file is the parameter list for one tool: its rows, their states, what
 * each takes, where a value comes from, and its citations by card id. The
 * site's worksheet, the prompt generator, the relay, the seal, an outside Model
 * Context Protocol server and the grading rig are all meant to read the same
 * file, so a drift between a tool file and the cards it cites is a drift in
 * four places at once. This script is the guard on that.
 *
 * IT RE-DERIVES THE CARDS A SECOND WAY rather than importing src/lib/phoebeCards.ts,
 * for the same reason check-cards does: importing the module would only prove the
 * module agrees with itself. It reads the card files, the pack README and the
 * tool file, and holds them to each other.
 *
 * TWO FILES, 24 Sep 2026: the water pack's section of the eligibility worksheet
 * and the carbon pack's. Calvin's and Bridget's tool files join this list as
 * they are written, and the checks below are written per pack, not per tool, so
 * joining costs one entry.
 *
 * IT ALSO HOLDS THREE FACTS TO THE CARD ITSELF, beyond the contract's own list:
 * a row's title, its "Can it be fixed?" value and the phase it is asked in are
 * the card's, and the card is the one home for all three. A card set with no
 * such line — the applies cards carry neither a fixability line nor a Phase
 * line — is skipped for that check and counted in the report, so a silent skip
 * cannot look like a pass.
 *
 * WHAT IT FAILS ON, the contract's own list (§7.4):
 *   - a row cites a card id that is not in the named set;
 *   - a route id has no route card;
 *   - a state, provenance, phase or takes.kind is off its closed list;
 *   - pack.version differs from the pack README's version line;
 *   - a sources entry differs from the pack README's cited-document table;
 *   - a pack that has cards carries a row citing a source instead of a card;
 *   - the row count differs from the card set it mirrors.
 *
 * Run it with the others:
 *   node scripts/check-tool.mjs
 */

import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

/* The closed lists. A new word in any of them is a maintainer's ruling, not an
   edit — the same rule the card gate keeps for its two labelled lines. */

/** takes.kind — the contract's §7.3. */
const KINDS = ['state', 'yesno', 'choice', 'number', 'text', 'date-past', 'date-future'];

/** The phase a row is acted on, the phase-tags ruling of 23 Sep 2026, as slugs. */
const PHASES = ['eligibility', 'partners', 'quantify', 'plan', 'monitor', 'communicate', 'to-remain-eligible'];

/** How a record field came to be filled — the visit's own list. */
const PROVENANCE = ['typed', 'chat', 'pin'];

/** The card's own "Can it be fixed?" value. */
const FIXABLE = ['yes', 'no', 'depends'];

/** Where a row's value may come from, for the entries that are a bare word. */
const PLAIN_FROM = ['conversation', 'typed'];

/** The keyed entries `from` may carry. */
const KEYED_FROM = ['record', 'documents'];

/** The record fields a tool may name, and no others (§7.2). */
const RECORD_FIELDS = ['does', 'name', 'place', 'type', 'stage', 'pin'];

/** Every key a row carries, and no others (§7.3). */
const ROW_KEYS = ['id', 'title', 'asked', 'takes', 'from', 'fixable', 'routes', 'cite'];

/** Every key the file carries at its head (§7.2). */
const FILE_KEYS = ['tool', 'pack', 'section', 'sources', 'record', 'states', 'rows', 'fields', 'outputs'];

/**
 * Every tool file, with the pack it belongs to and the card sets its rows
 * mirror. `sets` maps the name a row cites — `eligibility/4` cites the set
 * `eligibility` — onto the card file that holds those ids and the word that
 * heads a card in it.
 */
const TOOLS = [
  {
    file: 'knowledge-packs/phoebe-eligibility/vwba-2.0/tool/eligibility-worksheet.yaml',
    packDir: 'knowledge-packs/phoebe-eligibility/vwba-2.0',
    sets: {
      applies: { file: 'cards/applies-cards-vwba.md', word: 'Card' },
      eligibility: { file: 'cards/eligibility-cards-vwba.md', word: 'Card' },
    },
    /** The set a route id is looked up in. */
    routes: { file: 'cards/routes-cards-vwba.md', word: 'Route' },
  },
  {
    file: 'knowledge-packs/phoebe-eligibility/gs-paa-v2.0/tool/eligibility-worksheet.yaml',
    packDir: 'knowledge-packs/phoebe-eligibility/gs-paa-v2.0',
    sets: {
      applies: { file: 'cards/applies-cards-gs.md', word: 'Card' },
      eligibility: { file: 'cards/eligibility-cards-gs.md', word: 'Card' },
    },
    routes: { file: 'cards/routes-cards-gs.md', word: 'Route' },
  },
];

const problems = [];
const note = (message) => problems.push(message);

const read = (path) => {
  try {
    return readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  } catch {
    note(`${path}: missing`);
    return '';
  }
};

/**
 * Every card a file carries, in the file's own order: its id, its title, and
 * the two labelled lines the tool file mirrors. A card that carries neither
 * line returns null for both, and the caller counts the skip rather than
 * passing silently.
 */
function readCards(text, word) {
  const heads = [...text.matchAll(new RegExp(String.raw`^## ${word} (\S+)\s+\u2014\s+(.+)$`, 'gm'))];
  return heads.map((head, i) => {
    const body = text.slice(head.index + head[0].length, heads[i + 1]?.index ?? text.length);
    return {
      id: head[1],
      title: head[2].trim(),
      fixable: labelledWord(body, String.raw`Can it be fixed\?`),
      phase: labelledWord(body, String.raw`Phase\.`),
    };
  });
}

/**
 * The first word of a labelled line, lower-cased and slugged: "**Can it be
 * fixed? Depends, on one fact: ...**" gives "depends"; "**Phase.** To remain
 * eligible." gives "to-remain-eligible". Null when the card has no such line.
 */
function labelledWord(body, label) {
  const match = body.match(new RegExp(String.raw`\*\*${label}\s*(?:\*\*)?\s*([^.*,:;]+)`));
  if (!match) return null;
  return match[1].trim().toLowerCase().replace(/\s+/g, '-');
}

/** Prose from a README table cell, flattened the way the card reader flattens it. */
const flatten = (text) =>
  text
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(^|[\s(])\*(?!\s)(.+?)\*/g, '$1$2')
    .trim();

/** One row of a two-column README table, by its bold label. */
const tableRow = (text, label) => {
  const match = text.match(new RegExp(String.raw`^\| \*\*${label}\*\* \| (.+?) \|\s*$`, 'm'));
  return match ? flatten(match[1]) : null;
};

/**
 * Every document a pack README cites, as {document, version, link}.
 *
 * TWO TABLE SHAPES, BECAUSE THE TWO PACKS HAVE TWO. The water pack cites one
 * document and writes it down the page, a bold label per row. The carbon pack
 * cites fourteen and writes them across four tables, a document per row. Both
 * are read here rather than one shape being imposed on a README that has
 * already been graded — a gate that asks a document to be reformatted for its
 * own convenience is the wrong way round.
 *
 * A row with no link is skipped, which is how the carbon README's two "same
 * page" rows fall out. A tool file does not have to list every document its
 * pack cites; what it lists has to agree.
 */
function citedDocuments(readme) {
  const found = [];

  const labelled = tableRow(readme, 'Link');
  if (labelled && /^https?:\/\//.test(labelled)) {
    found.push({
      document: tableRow(readme, 'Document'),
      version: tableRow(readme, 'Version'),
      link: labelled,
    });
  }

  for (const m of readme.matchAll(/^\| (.+?) \| (.+?) \| (https?:\/\/\S+?) \|\s*$/gm)) {
    found.push({ document: flatten(m[1]), version: flatten(m[2]), link: flatten(m[3]) });
  }

  return found;
}

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const summary = [];

for (const tool of TOOLS) {
  const raw = read(tool.file);
  if (!raw) continue;

  let doc;
  try {
    doc = parse(raw);
  } catch (error) {
    note(`${tool.file}: does not parse as YAML — ${error.message}`);
    continue;
  }
  if (!isPlainObject(doc)) {
    note(`${tool.file}: is not a mapping`);
    continue;
  }

  /* ---- The file's own keys ------------------------------------------------ */

  for (const key of Object.keys(doc)) {
    if (!FILE_KEYS.includes(key)) note(`${tool.file}: unknown top-level key "${key}"`);
  }
  for (const key of ['tool', 'pack', 'section', 'sources', 'record', 'states', 'outputs']) {
    if (doc[key] === undefined) note(`${tool.file}: no "${key}" key`);
  }
  const rows = doc.rows ?? doc.fields;
  if (!Array.isArray(rows)) {
    note(`${tool.file}: no "rows" or "fields" list`);
    continue;
  }

  if (!doc.tool?.id) note(`${tool.file}: the tool has no id`);
  if (!doc.section?.id) note(`${tool.file}: the section has no id`);

  /* ---- The pack's version, against its README ----------------------------- */

  const readme = read(`${tool.packDir}/README.md`);
  const readmeVersion = readme.match(/\*\*Version (\d+\.\d+\.\d+)\b/)?.[1];
  if (!readmeVersion) note(`${tool.packDir}/README.md: no "**Version x.y.z" line`);
  if (readmeVersion && doc.pack?.version !== readmeVersion) {
    note(
      `${tool.file}: pack.version is ${JSON.stringify(doc.pack?.version)} but ` +
        `${tool.packDir}/README.md says ${readmeVersion}`
    );
  }

  /* ---- The sources, against the README's cited-document table -------------- */

  const cited = citedDocuments(readme);
  if (cited.length === 0) note(`${tool.packDir}/README.md: no cited-documents table with a link`);

  const sources = Array.isArray(doc.sources) ? doc.sources : [];
  if (sources.length === 0) note(`${tool.file}: no sources listed`);
  for (const source of sources) {
    if (!source?.id) note(`${tool.file}: a source has no id`);
    if (!source?.publisher) note(`${tool.file}: source "${source?.id}" has no publisher`);

    /* A source is found by its link, which is the one part of a citation that
       cannot be worded two ways. Then the document and the version must be the
       README's, word for word: the pack README is their one home, and a tool
       file that says something else about a document is the drift this catches. */
    const row = cited.find((r) => r.link === source?.link);
    if (!row) {
      note(
        `${tool.file}: source "${source?.id}" links to ${JSON.stringify(source?.link)}, which is ` +
          `no row of ${tool.packDir}/README.md's cited-documents tables`
      );
      continue;
    }
    for (const key of ['document', 'version']) {
      if (source[key] !== row[key]) {
        note(
          `${tool.file}: source "${source.id}" ${key} is ${JSON.stringify(source[key])} but the pack ` +
            `README says ${JSON.stringify(row[key])}`
        );
      }
    }
  }

  /* ---- The closed lists the file declares --------------------------------- */

  const states = isPlainObject(doc.states) ? doc.states : {};
  for (const [listName, list] of Object.entries(states)) {
    if (!Array.isArray(list) || list.length === 0) {
      note(`${tool.file}: the state list "${listName}" is empty`);
      continue;
    }
    for (const state of list) {
      if (!state?.id) note(`${tool.file}: a state in "${listName}" has no id`);
      if (!state?.label) note(`${tool.file}: state "${state?.id}" in "${listName}" has no label`);
      if (!('carries' in (state ?? {}))) note(`${tool.file}: state "${state?.id}" does not say what it carries`);
      if (!('colour' in (state ?? {}))) note(`${tool.file}: state "${state?.id}" has no colour token`);
    }
  }

  /* ---- The record fields --------------------------------------------------- */

  const record = Array.isArray(doc.record) ? doc.record : [];
  if (record.length === 0) note(`${tool.file}: no record fields listed`);
  for (const field of record) {
    if (!RECORD_FIELDS.includes(field?.field)) {
      note(`${tool.file}: record field ${JSON.stringify(field?.field)} is off the closed list`);
    }
    if (!KINDS.includes(field?.takes?.kind)) {
      note(`${tool.file}: record field "${field?.field}" takes kind ${JSON.stringify(field?.takes?.kind)}, off the closed list`);
    }
    const provenance = Array.isArray(field?.provenance) ? field.provenance : [];
    if (provenance.length === 0) note(`${tool.file}: record field "${field?.field}" names no provenance`);
    for (const value of provenance) {
      if (!PROVENANCE.includes(value)) {
        note(`${tool.file}: record field "${field?.field}" provenance ${JSON.stringify(value)} is off the closed list`);
      }
    }
  }

  /* ---- The cards this pack holds ------------------------------------------ */

  const setCards = {};
  const setIds = {};
  for (const [name, set] of Object.entries(tool.sets)) {
    setCards[name] = new Map(readCards(read(`${tool.packDir}/${set.file}`), set.word).map((c) => [c.id, c]));
    setIds[name] = [...setCards[name].keys()];
    if (setIds[name].length === 0) note(`${tool.packDir}/${set.file}: no cards found`);
  }
  const routeIds = readCards(read(`${tool.packDir}/${tool.routes.file}`), tool.routes.word).map((c) => c.id);
  if (routeIds.length === 0) note(`${tool.packDir}/${tool.routes.file}: no route cards found`);

  const hasCards = Object.values(setIds).some((ids) => ids.length > 0);

  /* Rows whose card carries no labelled line to hold them to. Counted, and
     printed, so a skip is never mistaken for a check that passed. */
  let skippedFixable = 0;
  let skippedPhase = 0;

  /* ---- Every row ----------------------------------------------------------- */

  const citedPerSet = {};

  rows.forEach((row, i) => {
    const where = `${tool.file}: row ${i + 1} (${JSON.stringify(row?.id)})`;

    for (const key of Object.keys(row ?? {})) {
      if (!ROW_KEYS.includes(key)) note(`${where}: unknown key "${key}"`);
    }
    for (const key of ROW_KEYS) {
      if (row?.[key] === undefined) note(`${where}: no "${key}" key`);
    }
    if (!row?.title) note(`${where}: no title`);

    /* The phase it is acted on. */
    if (!PHASES.includes(row?.asked)) {
      note(`${where}: asked ${JSON.stringify(row?.asked)} is off the closed list of phases`);
    }

    /* What it takes, and which closed list the value comes from. */
    if (!KINDS.includes(row?.takes?.kind)) {
      note(`${where}: takes.kind ${JSON.stringify(row?.takes?.kind)} is off the closed list`);
    }
    const of = row?.takes?.of;
    if (of !== undefined && !(of in states)) {
      note(`${where}: takes.of names "${of}", which the file's states do not declare`);
    }

    /* Where the value comes from. */
    const from = Array.isArray(row?.from) ? row.from : [];
    if (from.length === 0) note(`${where}: names nowhere the value comes from`);
    for (const entry of from) {
      if (typeof entry === 'string') {
        if (!PLAIN_FROM.includes(entry)) note(`${where}: from ${JSON.stringify(entry)} is off the closed list`);
        continue;
      }
      if (!isPlainObject(entry)) {
        note(`${where}: a from entry is neither a word nor a keyed value`);
        continue;
      }
      const keys = Object.keys(entry);
      if (keys.length !== 1 || !KEYED_FROM.includes(keys[0])) {
        note(`${where}: a from entry carries ${JSON.stringify(keys)}, not one of ${KEYED_FROM.join(' or ')}`);
        continue;
      }
      if (keys[0] === 'record' && !RECORD_FIELDS.includes(entry.record)) {
        note(`${where}: from record ${JSON.stringify(entry.record)} is off the closed list`);
      }
      if (keys[0] === 'record' && !record.some((f) => f?.field === entry.record)) {
        note(`${where}: from record "${entry.record}", which this file's record block does not name`);
      }
      if (keys[0] === 'documents' && typeof entry.documents !== 'string') {
        note(`${where}: from documents is not one plain sentence`);
      }
    }

    /* The card's own "Can it be fixed?" value. */
    if (!FIXABLE.includes(row?.fixable)) {
      note(`${where}: fixable ${JSON.stringify(row?.fixable)} is off the closed list ${FIXABLE.join(' / ')}`);
    }

    /* The routes a Fixable verdict may name. Always a route card's id. */
    const routes = Array.isArray(row?.routes) ? row.routes : [];
    for (const id of routes) {
      if (!routeIds.includes(id)) {
        note(`${where}: route ${JSON.stringify(id)} has no card in ${tool.routes.file}`);
      }
    }
    if (row?.fixable === 'no' && routes.length > 0) {
      note(`${where}: says it cannot be fixed and still names a route`);
    }

    /* The citation. A pack with cards cites a card, never a source. */
    const cite = isPlainObject(row?.cite) ? row.cite : {};
    if (hasCards && cite.source !== undefined) {
      note(`${where}: cites a source, but this pack has cards — every row of it cites a card id`);
    }
    if (typeof cite.card !== 'string') {
      note(`${where}: has no "cite.card"`);
      return;
    }
    const [setName, cardId] = cite.card.split('/');
    if (!(setName in setIds)) {
      note(`${where}: cites the set "${setName}", which this pack does not hold`);
      return;
    }
    const card = setCards[setName].get(cardId);
    if (!card) {
      note(`${where}: cites card "${cite.card}", which is not in ${tool.sets[setName].file}`);
      return;
    }
    (citedPerSet[setName] ??= []).push(cardId);

    /* The card is the one home for these three. A tool file that says
       something else about its own row is the drift this gate exists for. */
    if (row.title !== card.title) {
      note(`${where}: title is ${JSON.stringify(row.title)} but card ${cite.card} is titled ${JSON.stringify(card.title)}`);
    }
    if (card.fixable === null) skippedFixable += 1;
    else if (row.fixable !== card.fixable) {
      note(`${where}: fixable is ${JSON.stringify(row.fixable)} but card ${cite.card} says ${JSON.stringify(card.fixable)}`);
    }
    if (card.phase === null) skippedPhase += 1;
    else if (row.asked !== card.phase) {
      note(`${where}: asked is ${JSON.stringify(row.asked)} but card ${cite.card}'s Phase line says ${JSON.stringify(card.phase)}`);
    }
  });

  /* ---- The row count, against the card set each row mirrors ---------------- */

  for (const [name, ids] of Object.entries(setIds)) {
    const mirrored = citedPerSet[name] ?? [];
    if (mirrored.length !== ids.length) {
      note(
        `${tool.file}: ${mirrored.length} row(s) cite the "${name}" set, but ` +
          `${tool.sets[name].file} holds ${ids.length} card(s)`
      );
    }
    const duplicates = mirrored.filter((id, i) => mirrored.indexOf(id) !== i);
    for (const id of new Set(duplicates)) {
      note(`${tool.file}: more than one row cites "${name}/${id}"`);
    }
  }

  /* ---- What the tool posts back -------------------------------------------- */

  const outputs = Array.isArray(doc.outputs) ? doc.outputs : [];
  if (outputs.length === 0) note(`${tool.file}: names nothing it posts to the record`);
  for (const output of outputs) {
    if (!output?.id) note(`${tool.file}: an output has no id`);
    if (!output?.posts) note(`${tool.file}: output "${output?.id}" does not say what it posts`);
    if (!KINDS.includes(output?.takes?.kind)) {
      note(`${tool.file}: output "${output?.id}" takes kind ${JSON.stringify(output?.takes?.kind)}, off the closed list`);
    }
    const of = output?.takes?.of;
    if (of !== undefined && !(of in states)) {
      note(`${tool.file}: output "${output?.id}" takes.of names "${of}", which the file's states do not declare`);
    }
  }

  summary.push({
    file: tool.file,
    rows: rows.length,
    sets: Object.entries(setIds)
      .map(([name, ids]) => `${name} ${(citedPerSet[name] ?? []).length}/${ids.length}`)
      .join(' · '),
    routes: routeIds.length,
    states: Object.keys(states).length,
    skippedFixable,
    skippedPhase,
  });
}

/* ---- Report --------------------------------------------------------------- */

console.log('Tool definition files — build check\n');
for (const row of summary) {
  console.log(`  ${row.file}`);
  console.log(`    rows                ${row.rows}`);
  console.log(`    cards mirrored      ${row.sets}`);
  console.log(`    route cards to cite ${row.routes}`);
  console.log(`    closed lists        ${row.states}`);
  console.log(
    `    held to the card    ${row.rows} title(s) · ${row.rows - row.skippedFixable} fixable ` +
      `(${row.skippedFixable} card(s) carry no such line) · ${row.rows - row.skippedPhase} phase ` +
      `(${row.skippedPhase} carry no Phase line)`
  );
}
console.log(
  '\n  every row carries the contract\'s eight keys and no others; every row cites a card id\n' +
    '  in a set this pack holds; every route names a route card; every phase, provenance,\n' +
    "  kind and fixable value is on its closed list; the pack's version and its cited\n" +
    "  document agree with the pack README"
);

if (problems.length) {
  console.log(`\nFAILED — ${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.log(`  - ${p}`);
  console.log(
    '\nA tool file is read by the worksheet, the prompt generator, the relay, the\n' +
      'seal and an outside reader, so a drift here is a drift in five places. Fix the\n' +
      'file, or the card it cites, rather than loosening this script.'
  );
  process.exit(1);
}

console.log('\nPASSED — every tool file matches its cards and its pack.');
