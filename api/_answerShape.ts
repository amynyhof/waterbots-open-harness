/**
 * The shape of a calculator agent's answer, as it goes to the model and back — 25 Nov 2026.
 *
 * THE PACKAGES SHIP THE SHAPE (CALVIN_ANSWER_SCHEMA, VIOLET_ANSWER_SCHEMA) and the reader that checks it. The model
 * service takes a shape with at most 24 optional fields and 16 fields of more than one type, and Calvin's has 27 and
 * 17, so it would be refused whole. Here the shape is carried another way, and nothing is said another way: the numbers
 * that may be left out or cleared ({ type: ["number", "null"] }) travel as one list of name and value, and come back as
 * the fields they were before the package's own reader sees them. Every other word of the shape is the package's.
 *
 * In its own module with no dependency, so the check scripts can load it compiled as the platform compiles it.
 */

type Schema = Record<string, unknown>;

/** The list's own field, inside the object whose numbers it carries. */
export const NUMBERS = 'numbers';

/** The model service's published limits on one shape. */
export const SHAPE_LIMITS = { optional: 24, unions: 16 } as const;

const isObject = (value: unknown): value is Schema => typeof value === 'object' && value !== null && !Array.isArray(value);

/** A number that may be cleared: { "type": ["number", "null"] }. */
function isClearable(value: unknown): boolean {
  return isObject(value) && Array.isArray(value.type) && value.type.length === 2 && value.type.includes('number') && value.type.includes('null');
}

/** The shape with its clearable numbers as a list, at any depth. The one handed in is not changed. */
export function toWire(schema: Schema): Schema {
  const out: Schema = { ...schema };
  if (Array.isArray(out.type) && out.type.includes('object')) {
    /* An object that may be cleared. The service takes it as one shape or the other. */
    const rest: Schema = { ...out, type: 'object' };
    return { anyOf: [toWire(rest), { type: 'null' }] };
  }
  if (isObject(out.items)) out.items = toWire(out.items);
  if (!isObject(out.properties)) return out;
  const properties: Schema = {};
  const names: string[] = [];
  for (const [name, value] of Object.entries(out.properties)) {
    if (isClearable(value)) names.push(name);
    else properties[name] = isObject(value) ? toWire(value) : value;
  }
  if (names.length > 0) {
    properties[NUMBERS] = {
      type: 'array',
      description: 'The numbers, one entry for each. A null value clears it.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'value'],
        properties: { name: { type: 'string', enum: names }, value: { type: ['number', 'null'] } },
      },
    };
    out.required = [...((out.required as string[] | undefined) ?? []), NUMBERS];
  }
  out.properties = properties;
  return out;
}

/** The answer as the package's own reader expects it: each number back in its own field. */
export function fromWire(answer: unknown): unknown {
  if (Array.isArray(answer)) return answer.map(fromWire);
  if (!isObject(answer)) return answer;
  const out: Schema = {};
  for (const [name, value] of Object.entries(answer)) {
    if (name === NUMBERS && Array.isArray(value)) continue;
    out[name] = fromWire(value);
  }
  if (Array.isArray(answer[NUMBERS])) {
    for (const entry of answer[NUMBERS] as unknown[]) {
      if (isObject(entry) && typeof entry.name === 'string' && !(entry.name in out)) out[entry.name] = entry.value;
    }
  }
  return out;
}

/** How many optional fields a shape has, and how many of more than one type: what the limits count. */
export function shapeCost(schema: unknown): { optional: number; unions: number } {
  const cost = { optional: 0, unions: 0 };
  const visit = (node: unknown): void => {
    if (!isObject(node)) return;
    if (Array.isArray(node.type) || Array.isArray(node.anyOf)) cost.unions += 1;
    if (isObject(node.properties)) {
      const required = Array.isArray(node.required) ? (node.required as string[]) : [];
      cost.optional += Object.keys(node.properties).filter((name) => !required.includes(name)).length;
      Object.values(node.properties).forEach(visit);
    }
    if (Array.isArray(node.anyOf)) node.anyOf.forEach(visit);
    visit(node.items);
  };
  visit(schema);
  return cost;
}
