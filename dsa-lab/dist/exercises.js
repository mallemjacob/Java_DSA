import { define } from './algorithms.js';
const arrayField = { key: 'values', label: 'Values', type: 'array', hint: 'Comma-separated integers · up to 14 values' };

define('array-sum', 'Sum an array', { fields: [arrayField], defaults: { values: [10, 20, 30, 40, 50] }, counter: 'Values added' }, `static long sum(int[] values) {
  long total = 0;
  for (int value : values) {
    total += value;
  }
  return total;
}`, ({ state: s, emit }) => {
  let total = 0; emit('long total', 'Start with zero', 'An empty array has sum 0.', { vars: { total } });
  s.values.forEach((value, i) => { total += value; emit('total += value', `Add ${value}`, `Running total: ${total}.`, { active: [i], count: s.count + 1, vars: { value, total } }); });
  emit('return total', 'Return the sum', 'Each input value was read once.', { result: total, active: [] });
});

define('prime', 'Prime check · trial division', {
  fields: [{ key: 'number', label: 'Number', type: 'number', min: 0, max: 999 }], defaults: { number: 17 }, counter: 'Trial divisions',
  time: { best: 'O(1)', average: 'Input-dependent', worst: 'O(n) trials' }, curves: ['linear', 'constant'], complexityNote: 'Here n is the numeric value being tested, not its bit length. This version follows your lesson and tries divisors through n − 1. Testing only through √n is a possible improvement.'
}, `static boolean isPrime(int number) {
  if (number < 2) return false;
  for (int divisor = 2; divisor < number; divisor++) {
    if (number % divisor == 0) return false;
  }
  return true;
}`, ({ state: s, emit }, p) => {
  s.values = [p.number]; emit('if (number < 2)', 'Check the definition', 'Prime numbers are integers greater than 1 with no positive divisors other than 1 and themselves.', { vars: { number: p.number } });
  if (p.number < 2) { emit('return false', 'Not prime', 'Neither 0 nor 1 is prime.', { result: false }); return; }
  for (let divisor = 2; divisor < p.number; divisor++) { const remainder = p.number % divisor; emit('if (number % divisor', `Try divisor ${divisor}`, `${p.number} % ${divisor} = ${remainder}.`, { values: [p.number, divisor, remainder], active: [1, 2], pointers: { number: 0, divisor: 1, remainder: 2 }, count: s.count + 1, vars: { number: p.number, divisor, remainder } }); if (remainder === 0) { emit('if (number % divisor', 'A proper divisor was found', `${divisor} divides ${p.number}, so the number is composite.`, { result: false }); return; } }
  emit('return true', 'No proper divisor found', `${p.number} is prime.`, { result: true, active: [] });
});

define('leap-year', 'Leap-year rules', {
  fields: [{ key: 'year', label: 'Year', type: 'number', min: 1, max: 9999 }], defaults: { year: 1900 }, counter: 'Divisibility checks',
  time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, curves: ['constant', 'linear']
}, `static boolean isLeapYear(int year) {
  if (year % 100 == 0) {
    return year % 400 == 0;
  }
  return year % 4 == 0;
}`, ({ state: s, emit }, p) => {
  s.values = [p.year]; emit('if (year % 100', 'Is it a century year?', `${p.year} % 100 = ${p.year % 100}.`, { active: [0], count: 1, vars: { year: p.year, 'year % 100': p.year % 100 } });
  if (p.year % 100 === 0) emit('return year % 400', 'Century years need the 400-year rule', `${p.year} ${p.year % 400 === 0 ? 'is' : 'is not'} divisible by 400.`, { result: p.year % 400 === 0, count: 2, vars: { year: p.year, 'year % 400': p.year % 400 } });
  else emit('return year % 4', 'Use the four-year rule', `${p.year} ${p.year % 4 === 0 ? 'is' : 'is not'} divisible by 4.`, { result: p.year % 4 === 0, count: 2, vars: { year: p.year, 'year % 4': p.year % 4 } });
});

define('recursive-double', 'Double an array recursively', { fields: [arrayField], defaults: { values: [1, 2, 3, 4, 5] }, counter: 'Calls', space: 'O(n) call stack' }, `static void doubleArray(int[] values, int index) {
  if (index >= values.length) return;
  values[index] = values[index] * 2;
  doubleArray(values, index + 1);
}`, ({ state: s, emit }) => {
  s.calls = []; const visit = index => { s.calls.push({ label: `doubleArray(values, ${index})` }); emit('if (index >=', 'Check the remaining suffix', index === s.values.length ? 'There are no values left.' : `Index ${index} is valid.`, { active: index < s.values.length ? [index] : [], count: s.count + 1, vars: { index, depth: s.calls.length } }); if (index < s.values.length) { s.values[index] *= 2; emit('values[index] =', 'Double this slot', `Store ${s.values[index]} in the original array.`, { writes: s.writes + 1 }); emit('doubleArray(values, index + 1)', 'Handle the next position', 'The current call waits while the suffix is processed.'); visit(index + 1); } s.calls.pop(); };
  visit(0); emit('if (index >=', 'All calls returned', 'The original array has been modified.', { result: [...s.values], active: [] });
});

for (const copy of [true, false]) define(copy ? 'recursive-max-copy' : 'recursive-max', copy ? 'Recursive maximum · copied suffixes' : 'Recursive maximum · index only', {
  fields: [arrayField], defaults: { values: [4, 9, 2, 7, 5] }, counter: 'Calls', writeLabel: 'Copied slots',
  time: { best: copy ? 'O(n²)' : 'O(n)', average: copy ? 'O(n²)' : 'O(n)', worst: copy ? 'O(n²)' : 'O(n)' },
  space: copy ? 'O(n²) live suffix slots + stack' : 'O(n) stack', curves: ['linear', 'quadratic'],
  complexityNote: copy ? 'The arrays of lengths n − 1, n − 2, … remain referenced by waiting calls. Both total copying and peak retained array slots are quadratic for this implementation.' : 'The same original array is shared by all calls; only the index changes. No suffix arrays are allocated.'
}, copy ? `static Integer max(int[] values) {
  if (values.length == 0) return null;
  if (values.length == 1) return values[0];
  int[] suffix = Arrays.copyOfRange(values, 1, values.length);
  int smallerMax = max(suffix);
  return Math.max(values[0], smallerMax);
}` : `static Integer max(int[] values, int index) {
  if (index >= values.length) return null;
  if (index == values.length - 1) return values[index];
  int smallerMax = max(values, index + 1);
  return Math.max(values[index], smallerMax);
}`, ({ state: s, emit }) => {
  s.calls = []; s.memory = [];
  const visit = index => {
    s.calls.push({ label: copy ? `max([${s.values.slice(index).join(', ')}])` : `max(values, ${index})` });
    emit(copy ? 'if (values.length == 0)' : 'if (index >=', 'Enter a smaller maximum problem', `The suffix begins at original index ${index}.`, { count: s.count + 1, vars: { index, 'suffix length': s.values.length - index, depth: s.calls.length }, active: index < s.values.length ? [index] : [] });
    if (index >= s.values.length) { s.calls.pop(); return 'null'; }
    if (index === s.values.length - 1) { emit(copy ? 'if (values.length == 1)' : 'if (index == values.length', 'One value is its own maximum', `Return ${s.values[index]}.`); s.calls.pop(); return s.values[index]; }
    if (copy) { const suffix = s.values.slice(index + 1); s.memory.push(`[${suffix.join(', ')}]`); emit('int[] suffix', 'Allocate and copy a suffix', `${suffix.length} integer slots are copied; earlier calls still retain their arrays.`, { writes: s.writes + suffix.length }); }
    emit(copy ? 'int smallerMax = max(suffix)' : 'int smallerMax = max(values', 'Compute the suffix maximum once', 'Save the result instead of calling the same subproblem twice.'); const smallerMax = visit(index + 1); const result = Math.max(s.values[index], smallerMax);
    emit(copy ? 'return Math.max(values[0]' : 'return Math.max(values[index]', 'Combine with the current value', `max(${s.values[index]}, ${smallerMax}) = ${result}.`, { active: [index], vars: { index, current: s.values[index], smallerMax, result } }); s.calls.pop(); if (copy) s.memory.pop(); return result;
  };
  const result = visit(0); emit(copy ? 'return Math.max(values[0]' : 'return Math.max(values[index]', 'Maximum complete', result === 'null' ? 'The empty input has no maximum.' : `Maximum: ${result}.`, { result, active: [] });
});
