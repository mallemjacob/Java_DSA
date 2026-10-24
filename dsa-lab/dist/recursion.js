import { define } from './algorithms.js';

const nField = (max = 10) => ({ key: 'n', label: 'Input n', type: 'number', min: 0, max });
const textField = { key: 'text', label: 'Text', type: 'text', hint: 'ASCII text · up to 12 characters' };

for (const factorial of [true, false]) define(factorial ? 'factorial' : 'countdown', factorial ? 'Recursive factorial' : 'Recursive countdown', {
  kind: 'calls', fields: [nField(factorial ? 12 : 10)], defaults: { n: factorial ? 5 : 4 }, space: 'O(n) call stack', counter: 'Calls', curves: ['linear']
}, factorial ? `static long factorial(int n) {
  if (n < 0) throw new IllegalArgumentException();
  if (n == 0) return 1;
  long smaller = factorial(n - 1);
  return n * smaller;
}` : `static void countdown(int n) {
  if (n < 0) throw new IllegalArgumentException();
  if (n == 0) return;
  System.out.println(n);
  countdown(n - 1);
}`, ({ state: s, emit }, p) => {
  s.calls = []; s.memory = []; const output = [];
  const visit = n => {
    s.calls.push({ label: factorial ? `factorial(${n})` : `countdown(${n})`, n });
    emit('if (n == 0)', `Enter ${factorial ? 'factorial' : 'countdown'}(${n})`, n === 0 ? 'The base case stops recursion.' : 'This call owns its own copy of n.', { count: s.count + 1, vars: { n, depth: s.calls.length, pending: factorial ? `${n} × factorial(${n - 1})` : '—' } });
    if (n === 0) { s.calls.pop(); emit('if (n == 0)', factorial ? 'Return 1 from the base case' : 'Return from the base case', 'Resume the suspended caller.', { vars: { n, returned: factorial ? 1 : 'void' } }); return factorial ? 1 : undefined; }
    if (!factorial) { output.push(n); emit('System.out.println', `Print ${n}`, 'Printing happens before the recursive call.', { memory: [...output] }); }
    emit(factorial ? 'long smaller' : 'countdown(n - 1)', `Call with ${n - 1}`, 'The current invocation waits on the call stack.'); const smaller = visit(n - 1);
    const answer = factorial ? n * smaller : undefined;
    if (factorial) emit('return n * smaller', `${n} × ${smaller} = ${answer}`, 'Combine the returned subproblem result.', { vars: { n, smaller, returned: answer } });
    s.calls.pop(); emit(factorial ? 'return n * smaller' : 'countdown(n - 1)', `Leave the call for ${n}`, 'Its stack frame is no longer needed.'); return answer;
  };
  const result = visit(p.n); emit(factorial ? 'return n * smaller' : 'countdown(n - 1)', 'All calls have returned', factorial ? `${p.n}! = ${result}.` : 'The countdown is complete.', { result: factorial ? result : output, vars: { result: factorial ? result : output.join(', ') } });
});

define('directory', 'Recursive directory traversal', {
  kind: 'tree', fields: [], defaults: {}, space: 'O(depth) stack', counter: 'Entries visited', time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' }, curves: ['linear'], complexityNote: 'V is the number of entries and E the parent-child links. This fixed virtual directory is safe to explore without filesystem access.'
}, `record Entry(String name, List<Entry> children) {}
static void walk(Entry entry, List<String> output) {
  output.add(entry.name());
  for (Entry child : entry.children()) {
    walk(child, output);
  }
}`, ({ state: s, emit }) => {
  const entries = [
    { id: 'root', label: 'project/', x: 270, y: 35, children: ['src', 'docs', 'readme'] },
    { id: 'src', label: 'src/', x: 100, y: 115, children: ['main', 'utils'] },
    { id: 'docs', label: 'docs/', x: 330, y: 115, children: ['guide'] },
    { id: 'readme', label: 'README', x: 510, y: 115, children: [] },
    { id: 'main', label: 'Main.java', x: 55, y: 200, children: [] },
    { id: 'utils', label: 'Utils.java', x: 180, y: 200, children: [] },
    { id: 'guide', label: 'guide.md', x: 340, y: 200, children: [] }
  ]; s.nodes = entries; s.edges = entries.flatMap(n => n.children.map(to => ({ from: n.id, to, directed: true }))); s.calls = []; const output = [];
  const visit = id => { const entry = entries.find(n => n.id === id); s.calls.push({ label: `walk(${entry.label})` }); output.push(entry.label); emit('output.add', `Visit ${entry.label}`, 'Preorder traversal processes an entry before its children.', { activeNodes: [id], visitedNodes: [...(s.visitedNodes || []), id], count: s.count + 1, memory: [...output], vars: { entry: entry.label, depth: s.calls.length } }); for (const child of entry.children) { emit('walk(child', 'Recurse into the next child', `Pause ${entry.label} while exploring ${entries.find(n => n.id === child).label}.`); visit(child); } s.calls.pop(); emit('for (Entry child', `Finish ${entry.label}`, 'No children remain for this call.', { activeNodes: s.calls.length ? [] : [id] }); };
  visit('root'); emit('for (Entry child', 'Traversal complete', 'Each entry was visited once.', { result: output, activeNodes: [] });
});

for (const reverse of [true, false]) define(reverse ? 'reverse' : 'count-x', reverse ? 'Reverse a string recursively' : 'Count x recursively', {
  kind: 'calls', fields: [textField], defaults: { text: reverse ? 'java' : 'xoxxox' }, space: 'O(n) stack' + (reverse ? ' + intermediate strings' : ''), time: { best: reverse ? 'O(n²)' : 'O(n)', average: reverse ? 'O(n²)' : 'O(n)', worst: reverse ? 'O(n²)' : 'O(n)' }, curves: reverse ? ['quadratic', 'linear'] : ['linear'], counter: 'Calls'
}, reverse ? `static String reverse(String text, int i) {
  if (i == text.length()) return "";
  String suffix = reverse(text, i + 1);
  return suffix + text.charAt(i);
}` : `static int countX(String text, int i) {
  if (i == text.length()) return 0;
  int suffix = countX(text, i + 1);
  return (text.charAt(i) == 'x' ? 1 : 0) + suffix;
}`, ({ state: s, emit }, p) => {
  s.calls = []; s.sourceText = p.text;
  const visit = i => {
    s.calls.push({ label: `${reverse ? 'reverse' : 'countX'}(“${p.text}”, ${i})` }); emit('if (i ==', `Enter at index ${i}`, i === p.text.length ? 'The suffix is empty: use the base result.' : `This call handles “${p.text[i]}” and the remaining suffix.`, { textIndex: i, count: s.count + 1, vars: { i, length: p.text.length } });
    if (i === p.text.length) { s.calls.pop(); emit('if (i ==', 'Return the empty-suffix result', reverse ? 'An empty suffix reverses to an empty string.' : 'An empty suffix contains zero x characters.'); return reverse ? '' : 0; }
    emit(reverse ? 'String suffix' : 'int suffix', 'Solve the smaller suffix', `Call at index ${i + 1}.`); const suffix = visit(i + 1); const answer = reverse ? suffix + p.text[i] : suffix + (p.text[i] === 'x' ? 1 : 0);
    emit(reverse ? 'return suffix +' : 'return (text.charAt', 'Combine the answer', reverse ? `“${suffix}” + “${p.text[i]}” = “${answer}”.` : `${p.text[i] === 'x' ? 1 : 0} + ${suffix} = ${answer}.`, { vars: { i, suffix, returned: answer }, textIndex: i }); s.calls.pop(); return answer;
  };
  const result = visit(0); emit(reverse ? 'return suffix +' : 'return (text.charAt', 'Recursion complete', `Result: ${JSON.stringify(result)}.`, { result, textIndex: -1 });
});

define('staircase', 'Staircase · 1, 2, or 3 steps', {
  kind: 'calls', fields: [nField(7)], defaults: { n: 4 }, time: { best: 'O(1) at base', average: 'Exponential', worst: 'O(3ⁿ) upper bound' }, space: 'O(n) stack', curves: ['exponential', 'linear'], counter: 'Calls'
}, `static long ways(int n) {
  if (n == 0) return 1;
  if (n < 0) return 0;
  long one = ways(n - 1);
  long two = ways(n - 2);
  long three = ways(n - 3);
  return one + two + three;
}`, ({ state: s, emit }, p) => {
  s.calls = []; const visit = n => { s.calls.push({ label: `ways(${n})` }); emit(n < 0 ? 'if (n < 0)' : 'if (n == 0)', `Enter ways(${n})`, n < 0 ? 'Overshooting contributes no route.' : n === 0 ? 'Exactly reaching the goal contributes one route.' : 'Split by the size of the final move.', { count: s.count + 1, vars: { n, depth: s.calls.length } }); if (n <= 0) { s.calls.pop(); return n === 0 ? 1 : 0; } emit('long one', 'Try a one-step move', 'Solve the remaining distance.'); const one = visit(n - 1); emit('long two', 'Try a two-step move', 'Count these routes separately.'); const two = visit(n - 2); emit('long three', 'Try a three-step move', 'Count routes ending with three steps.'); const three = visit(n - 3); emit('return one +', 'Add the disjoint choices', `${one} + ${two} + ${three} = ${one + two + three}.`, { vars: { n, one, two, three } }); s.calls.pop(); return one + two + three; };
  const result = visit(p.n); emit('return one +', 'All routes counted', `${result} routes reach stair ${p.n}.`, { result });
});

define('anagrams', 'Generate anagrams', {
  kind: 'calls', fields: [{ ...textField, hint: '1–5 distinct lowercase letters' }], defaults: { text: 'cat' }, time: { best: 'O(n · n!) output', average: 'O(n · n!) output', worst: 'O(n² · n!) safe bound' }, space: 'O(n²) working strings + output', curves: ['factorial', 'quadratic'], counter: 'Recursive calls', complexityNote: 'n is word length. There are n! outputs for distinct letters, with n characters each. String copies and intermediate suffixes also cost work; the stated worst bound includes conservative copying overhead.'
}, `static void anagrams(String prefix, String rest, List<String> output) {
  if (rest.isEmpty()) { output.add(prefix); return; }
  for (int i = 0; i < rest.length(); i++) {
    char chosen = rest.charAt(i);
    String remaining = rest.substring(0, i) + rest.substring(i + 1);
    anagrams(prefix + chosen, remaining, output);
  }
}`, ({ state: s, emit }, p) => {
  s.calls = []; const output = []; const visit = (prefix, rest) => { s.calls.push({ label: `“${prefix}” + arrange(“${rest}”)` }); emit('if (rest.isEmpty()', rest ? `Arrange “${rest}”` : `Emit “${prefix}”`, rest ? 'Choose each available character for the next position.' : 'No characters remain.', { count: s.count + 1, vars: { prefix, rest } }); if (!rest) { output.push(prefix); emit('output.add(prefix)', 'A complete arrangement', 'Store this result.', { memory: [...output] }); } else for (let i = 0; i < rest.length; i++) { const chosen = rest[i], remaining = rest.slice(0, i) + rest.slice(i + 1); emit('char chosen', `Choose “${chosen}”`, `Next prefix: “${prefix + chosen}”.`, { vars: { prefix, rest, i, chosen } }); emit('anagrams(prefix +', 'Recurse with the remaining characters', `Remaining: “${remaining}”.`); visit(prefix + chosen, remaining); } s.calls.pop(); };
  visit('', p.text); emit('if (rest.isEmpty()', 'Generation complete', `${output.length} arrangements were produced.`, { result: output });
});

for (const mode of ['naive', 'memo', 'bottom']) {
  const code = mode === 'naive' ? `static long fib(int n) {
  if (n < 2) return n;
  long left = fib(n - 1);
  long right = fib(n - 2);
  return left + right;
}` : mode === 'memo' ? `static long fib(int n, Map<Integer, Long> memo) {
  if (memo.containsKey(n)) return memo.get(n);
  if (n < 2) return n;
  long left = fib(n - 1, memo);
  long right = fib(n - 2, memo);
  long result = left + right;
  memo.put(n, result);
  return result;
}` : `static long fib(int n) {
  if (n < 2) return n;
  long previous = 0, current = 1;
  for (int i = 2; i <= n; i++) {
    long next = previous + current;
    previous = current;
    current = next;
  }
  return current;
}`;
  define(mode === 'naive' ? 'fibonacci' : 'fibonacci-' + mode, { naive: 'Fibonacci · naive recursion', memo: 'Fibonacci · memoization', bottom: 'Fibonacci · bottom-up' }[mode], {
    kind: mode === 'bottom' ? 'array' : 'calls', fields: [nField(mode === 'naive' ? 9 : 20)], defaults: { n: 7 }, counter: mode === 'bottom' ? 'States computed' : 'Calls',
    time: { best: 'O(1) at base', average: mode === 'naive' ? 'O(φⁿ)' : 'O(n)', worst: mode === 'naive' ? 'O(2ⁿ) upper bound' : 'O(n)' }, space: mode === 'bottom' ? 'O(1) auxiliary' : 'O(n)', curves: mode === 'naive' ? ['exponential', 'linear'] : ['linear', 'exponential']
  }, code, ({ state: s, emit }, p) => {
    s.calls = []; s.values = []; s.memory = [];
    if (mode === 'bottom') {
      emit('if (n < 2)', 'Check the base cases', 'fib(0) = 0 and fib(1) = 1.', { vars: { n: p.n } }); if (p.n < 2) { emit('if (n < 2)', 'Base result', `Return ${p.n}.`, { result: p.n, values: [p.n] }); return; }
      let previous = 0, current = 1; s.values = [previous, current]; emit('long previous', 'Keep two rolling values', 'Only the previous two states are needed.', { vars: { previous, current } });
      for (let i = 2; i <= p.n; i++) { const next = previous + current; emit('long next', `Compute fib(${i})`, `${previous} + ${current} = ${next}.`, { count: s.count + 1, vars: { i, previous, current, next }, active: [0, 1] }); previous = current; s.values[0] = previous; emit('previous = current', 'Advance the earlier value', 'The old current becomes previous.', { vars: { i, previous, current, next }, active: [0] }); current = next; s.values[1] = current; emit('current = next', 'Advance the current value', 'Two rolling slots are sufficient.', { vars: { i, previous, current }, active: [1] }); }
      emit('return current', 'Return the last state', `fib(${p.n}) = ${current}.`, { result: current, active: [] }); return;
    }
    const memo = new Map(); let hits = 0; const visit = n => {
      s.calls.push({ label: `fib(${n})` }); emit(mode === 'memo' ? 'if (memo.containsKey' : 'if (n < 2)', `Enter fib(${n})`, 'Each invocation is counted, including cache hits and base cases.', { count: s.count + 1, vars: { n, depth: s.calls.length, ...(mode === 'memo' ? { cacheHits: hits } : {}) } });
      if (mode === 'memo' && memo.has(n)) { hits++; emit('return memo.get(n)', 'Reuse the cached answer', `fib(${n}) = ${memo.get(n)}; no child calls are needed.`, { vars: { n, cached: memo.get(n), cacheHits: hits } }); s.calls.pop(); return memo.get(n); }
      if (n < 2) { emit('if (n < 2)', 'Base result', `fib(${n}) = ${n}.`); s.calls.pop(); return n; }
      emit('long left', 'Solve the left subproblem', `Call fib(${n - 1}).`); const left = visit(n - 1); emit('long right', 'Solve the right subproblem', `Call fib(${n - 2}).`); const right = visit(n - 2); const result = left + right;
      if (mode === 'memo') { memo.set(n, result); emit('memo.put', 'Remember this state', `Cache fib(${n}) = ${result}.`, { memory: [...memo].map(([k, v]) => `${k} → ${v}`), writes: s.writes + 1 }); }
      emit(mode === 'memo' ? 'return result' : 'return left +', 'Return the combined answer', `${left} + ${right} = ${result}.`, { vars: { n, left, right, result, ...(mode === 'memo' ? { cacheHits: hits } : {}) } }); s.calls.pop(); return result;
    };
    const result = visit(p.n); emit(mode === 'memo' ? 'return result' : 'return left +', 'Fibonacci complete', `fib(${p.n}) = ${result}.${mode === 'memo' ? ` Cache hits: ${hits}.` : ''}`, { result });
  });
}

for (const copy of [true, false]) define(copy ? 'copy-array' : 'in-place-double', copy ? 'Double values · new array' : 'Double values · in place', {
  fields: [{ key: 'values', label: 'Values', type: 'array' }], defaults: { values: [2, 4, 6, 8, 10] }, space: copy ? 'O(n) allocated output' : 'O(1) auxiliary', curves: ['linear', 'constant'], counter: 'Values processed', writeLabel: 'Writes'
}, copy ? `static int[] doubled(int[] input) {
  int[] output = new int[input.length];
  for (int i = 0; i < input.length; i++) {
    output[i] = input[i] * 2;
  }
  return output;
}` : `static void doubleInPlace(int[] input) {
  for (int i = 0; i < input.length; i++) {
    input[i] *= 2;
  }
}`, ({ state: s, emit }, p) => {
  s.memory = copy ? Array(p.values.length).fill(0) : [];
  emit(copy ? 'int[] output' : 'for (int i', copy ? 'Allocate a second array' : 'Use the original array', copy ? `Allocate ${p.values.length} new integer slots. The input stays unchanged.` : 'Only the loop index needs additional storage.', { vars: { 'extra slots': copy ? p.values.length : 0 } });
  for (let i = 0; i < s.values.length; i++) { if (copy) s.memory[i] = s.values[i] * 2; else s.values[i] *= 2; emit(copy ? 'output[i] =' : 'input[i] *=', `Double index ${i}`, copy ? `Write ${s.memory[i]} into the output array.` : `The input slot now contains ${s.values[i]}.`, { active: [i], count: s.count + 1, writes: s.writes + 1, vars: { i, 'extra slots': copy ? p.values.length : 0 } }); }
  emit(copy ? 'return output' : 'input[i] *=', 'Transformation complete', copy ? 'The original array is preserved.' : 'The caller observes the modified input.', { result: copy ? [...s.memory] : [...s.values], active: [] });
});

define('two-sum', 'Two-sum · remember complements', {
  fields: [{ key: 'values', label: 'Values', type: 'array' }, { key: 'target', label: 'Target sum', type: 'number', min: -999, max: 999 }], defaults: { values: [8, 3, 12, 5, 7, 2], target: 10 }, time: { best: 'O(1)', average: 'O(n) expected', worst: 'Hash-dependent' }, space: 'O(n)', curves: ['linear', 'quadratic'], counter: 'Complement lookups'
}, `static int[] twoSum(int[] a, int target) {
  Map<Integer, Integer> seen = new HashMap<>();
  for (int i = 0; i < a.length; i++) {
    int need = target - a[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(a[i], i);
  }
  return new int[0];
}`, ({ state: s, emit }, p) => {
  const seen = new Map(); emit('Map<Integer', 'Remember earlier indices', 'Look for the complement before inserting the current value.', { memory: [], vars: { target: p.target } });
  for (let i = 0; i < s.values.length; i++) { const need = p.target - s.values[i]; emit('int need', 'Compute the complement', `${p.target} − ${s.values[i]} = ${need}.`, { active: [i], vars: { i, value: s.values[i], need, target: p.target } }); emit('if (seen.containsKey', 'Look up the complement', seen.has(need) ? 'A matching earlier index exists.' : 'No earlier value completes the pair.', { count: s.count + 1 }); if (seen.has(need)) { const first = seen.get(need); emit('return new int[]{', 'Pair found', `${s.values[first]} + ${s.values[i]} = ${p.target}.`, { active: [first, i], sorted: [first, i], result: [first, i] }); return; } seen.set(s.values[i], i); emit('seen.put', 'Remember this index', 'It can be used by a later element.', { memory: [...seen].map(([value, index]) => `${value} → index ${index}`), writes: s.writes + 1 }); }
  emit('return new int[0]', 'No pair exists', 'Every potential later endpoint was checked.', { result: [], active: [] });
});

define('greedy-stock', 'Best single stock trade', {
  fields: [{ key: 'values', label: 'Daily prices', type: 'array' }], defaults: { values: [8, 2, 6, 1, 7, 4] }, counter: 'Days considered', curves: ['linear', 'quadratic']
}, `static int maxProfit(int[] prices) {
  if (prices.length == 0) return 0;
  int cheapest = prices[0], best = 0;
  for (int i = 1; i < prices.length; i++) {
    best = Math.max(best, prices[i] - cheapest);
    cheapest = Math.min(cheapest, prices[i]);
  }
  return best;
}`, ({ state: s, emit }) => {
  if (!s.values.length) { emit('if (prices.length', 'No trading days', 'No transaction is possible.', { result: 0 }); return; }
  let cheapest = s.values[0], best = 0, buyIndex = 0; emit('int cheapest', 'Remember the first price', 'A valid purchase must precede its sale.', { vars: { cheapest, best }, pointers: { buy: 0 } });
  for (let i = 1; i < s.values.length; i++) { const profit = s.values[i] - cheapest; best = Math.max(best, profit); emit('best = Math.max', 'Evaluate selling today', `Price ${s.values[i]} − cheapest earlier price ${cheapest} = ${profit}. Best profit: ${best}.`, { active: [buyIndex, i], pointers: { buy: buyIndex, sell: i }, count: s.count + 1, vars: { i, cheapest, profit, best } }); if (s.values[i] < cheapest) { cheapest = s.values[i]; buyIndex = i; } emit('cheapest = Math.min', 'Update the cheapest price', 'This price becomes eligible for a later sale.', { pointers: { buy: buyIndex }, vars: { i, cheapest, best } }); }
  emit('return best', 'Best achievable profit', 'At most one buy followed by one sale; choosing no transaction is allowed.', { result: best, active: [], pointers: {} });
});
