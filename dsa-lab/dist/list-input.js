// Linked lists store values; only indices are constrained to be integers.
export function parseListValue(raw) {
  const value = raw.trim();
  if (!value) throw new Error('Enter a value. Use "" for an empty text value.');
  if (value.startsWith('"')) {
    let parsed;
    try { parsed = JSON.parse(value); } catch { throw new Error('Close quoted text with a double quote; escape inner quotes with \\".'); }
    if (typeof parsed !== 'string') throw new Error('A quoted value must be text.');
    if ([...parsed].length > 32) throw new Error('Keep each text value to 32 characters or fewer.');
    return parsed;
  }
  if (/^-?\d+$/.test(value)) {
    const number = Number(value);
    if (!Number.isSafeInteger(number)) throw new Error('Integer values must fit JavaScript’s safe integer range. Quote a large number to store it as text.');
    // Use Java Integer values in the corresponding generic-node example.
    if (number < -2147483648 || number > 2147483647) throw new Error('Use an integer between −2147483648 and 2147483647, or quote it to store text.');
    return number;
  }
  if ([...value].length > 32) throw new Error('Keep each text value to 32 characters or fewer.');
  return value;
}

export function parseListValues(raw) {
  if (!raw.trim()) return [];
  const fields = []; let token = '', quoted = false, escaped = false;
  for (const character of raw) {
    if (quoted) {
      token += character;
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') quoted = false;
    } else if (character === ',') { fields.push(token); token = ''; }
    else { if (character === '"' && !token.trim()) quoted = true; token += character; }
  }
  if (quoted) throw new Error('Close each quoted value with a double quote.');
  fields.push(token);
  if (fields.length > 14) throw new Error('Use at most 14 linked-list values.');
  return fields.map(parseListValue);
}

export const formatListValue = value => typeof value === 'string' ? JSON.stringify(value) : String(value);
