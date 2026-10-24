import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { demos } from '../dist/algorithms.js';
import '../dist/structures.js';
import '../dist/recursion.js';
import '../dist/graphs.js';
import '../dist/exercises.js';
import { parseGraph } from '../dist/graphs.js';
import { chapters } from '../dist/catalog.js';
import { chartSVG, curves } from '../dist/views.js';
import { parseListValue, parseListValues, formatListValue } from '../dist/list-input.js';

const run = (id, override = {}) => demos[id].build({ ...structuredClone(demos[id].defaults), ...override });
const sorted = a => [...a].sort((a, b) => a - b);
const fixtures = [[], [1], [2, 1], [5, 4, 3, 2, 1], [1, 2, 3, 4], [3, 3, 3], [-4, 0, 2, -4, 8], [999, -999, 0]];

test('All 20 chapters map to working interactive topics', () => {
  assert.deepEqual(chapters.map(c => c.id), Array.from({ length: 20 }, (_, i) => i + 1));
  for (const c of chapters) {
    assert.ok(c.sections.length >= 4);
    for (const id of c.topics) assert.ok(demos[id], `Missing demo ${id}`);
  }
  assert.equal(Object.keys(demos).length, 56);
});

for (const d of Object.values(demos)) test(`${d.id}: immutable trace, valid Java locations, final result`, () => {
  const input = structuredClone(d.defaults), original = structuredClone(input);
  const { frames, code, result } = d.build(input);
  assert.deepEqual(input, original, 'The generator must not change caller input');
  assert.ok(frames.length > 0);
  assert.notEqual(result, null);
  assert.deepEqual(frames.at(-1).result, result);
  const saved = structuredClone(frames[0]);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    assert.ok(Number.isInteger(f.line) && f.line >= 0 && f.line < code.split('\n').length);
    assert.ok(code.split('\n')[f.line].trim().length > 0);
    assert.ok(f.title && f.detail);
    if (i) assert.ok(f.count >= frames[i - 1].count, 'Counters must not move backward during forward execution');
  }
  if (frames.length > 1) frames.at(-1).values.push(12345);
  assert.deepEqual(frames[0], saved, 'A later frame cannot change an earlier snapshot');
});

for (const id of ['bubble-sort', 'selection-sort', 'insertion-sort', 'quick-sort']) test(`${id}: sorts empty, duplicate, reversed, and negative values`, () => {
  for (const values of fixtures) assert.deepEqual(run(id, { values }).result, sorted(values));
});

test('Quickselect returns the sorted rank for every position', () => {
  for (const values of fixtures.filter(a => a.length)) for (let rank = 0; rank < values.length; rank++) assert.equal(run('quick-select', { values, rank }).result, sorted(values)[rank]);
  assert.equal(run('quick-select', { values: [], rank: 0 }).result, 'Invalid rank');
});

test('Searches handle boundaries, absence, empty input, and duplicates', () => {
  for (const values of fixtures) for (const target of [-999, -4, 0, 1, 3, 8, 999, 777]) {
    const linear = run('linear-search', { values, target }).result;
    assert.equal(linear, values.indexOf(target));
    const a = sorted(values), binary = run('binary-search', { values: a, target }).result;
    if (!a.includes(target)) assert.equal(binary, -1); else assert.equal(a[binary], target);
  }
});

test('Array operations preserve logical sizes and report invalid indices', () => {
  assert.deepEqual(run('array-insert', { values: [], index: 0, value: 7 }).result, [7]);
  assert.deepEqual(run('array-insert', { values: [1, 2], index: 2, value: 3 }).result, [1, 2, 3]);
  assert.deepEqual(run('array-delete', { values: [7], index: 0 }).result, []);
  assert.equal(run('array-read', { values: [], index: 0 }).result, 'Invalid index');
  assert.equal(run('array-delete', { values: [], index: 0 }).result, 'Invalid index');
  assert.deepEqual(run('ordered-insert', { values: [1, 2, 2, 5], value: 2 }).result, [1, 2, 2, 2, 5]);
  assert.equal(run('set-insert', { values: [2, 4], value: 4 }).result, false);
  assert.deepEqual(run('set-insert', { values: [2, 4], value: 3 }).frames.at(-1).values, [2, 4, 3]);
});

test('Duplicate algorithms agree on every fixture', () => {
  for (const values of fixtures) {
    const expected = new Set(values).size !== values.length;
    assert.equal(run('duplicates', { values }).result, expected);
    assert.equal(run('hash-duplicates', { values }).result, expected);
  }
});

test('Stack, queue and brackets handle exhaustion and nesting', () => {
  assert.deepEqual(run('stack', { values: [1, 2, 3], removals: 10 }).result, [3, 2, 1]);
  assert.deepEqual(run('queue', { values: [1, 2, 3], removals: 10 }).result, [1, 2, 3]);
  assert.deepEqual(run('stack', { values: [], removals: 2 }).result, []);
  for (const [text, expected] of [['', true], ['([]{})', true], ['([)]', false], [')', false], ['((', false]]) assert.equal(run('brackets', { text }).result, expected);
});

test('Hash chaining supports collisions, updates, negative keys and removal', () => {
  const r = run('hash-map', { values: [-4, 3, 10, 3], target: 3, operation: 'remove' });
  assert.equal(r.result, 30);
  assert.deepEqual(r.frames.at(-1).buckets[3].map(e => e.key), [-4, 10]);
  assert.equal(run('hash-map', { values: [], target: 1 }).result, 'null');
});

test('Linked list operations handle head, tail, empty, and invalid cases', () => {
  for (const id of ['linked-insert', 'doubly-list']) {
    assert.deepEqual(run(id, { values: [], index: 0, value: 4 }).result, [4]);
    assert.deepEqual(run(id, { values: [1, 3], index: 1, value: 2 }).result, [1, 2, 3]);
    assert.deepEqual(run(id, { values: [1, 3], index: 2, value: 4 }).result, [1, 3, 4]);
    assert.equal(run(id, { values: [], index: 1 }).result, 'Invalid index');
  }
  assert.deepEqual(run('linked-delete', { values: [1], index: 0 }).result, []);
  assert.deepEqual(run('linked-delete', { values: [1, 2, 3], index: 2 }).result, [1, 2]);
  assert.equal(run('linked-search', { values: [], target: 5 }).result, -1);
  assert.equal(run('linked-delete', { values: [], index: 0 }).result, 'Invalid index');
});

test('Linked-list input accepts text, integers, quoted commas, numeric text, and Unicode', () => {
  assert.deepEqual(parseListValues(' Alice, Bob, Carol '), ['Alice', 'Bob', 'Carol']);
  assert.deepEqual(parseListValues('12, -3, "12", "Last, First", "", தமிழ்'), [12, -3, '12', 'Last, First', '', 'தமிழ்']);
  const values = ['A "quoted" name', 'two, parts', '12', '', 12, -3, 'தமிழ்'];
  assert.deepEqual(parseListValues(values.map(formatListValue).join(', ')), values);
  assert.deepEqual(parseListValues('  '), []);
  assert.equal(parseListValue('Carol'), 'Carol');
  assert.equal(parseListValue('"12"'), '12');
  assert.equal(parseListValue('12'), 12);
  for (const text of ['Alice,,Bob', '"unfinished', Array(15).fill('a').join(','), 'a'.repeat(33), '2147483648']) assert.throws(() => parseListValues(text));
});

test('Linked-list reading returns by index without mutating values', () => {
  const values = ['Alice', 'Bob', 'Carol', 'Dave'];
  for (let index = 0; index < values.length; index++) {
    const trace = run('linked-read', { values, index });
    assert.equal(trace.result, values[index]);
    assert.equal(trace.frames.at(-1).count, index);
    assert.deepEqual(trace.frames.at(-1).values, values);
    assert.ok(trace.code.split('\n')[trace.frames.at(-1).line].includes('return current.value'));
  }
  assert.equal(run('linked-read', { values: [], index: 0 }).result, 'Invalid index');
  assert.equal(run('linked-read', { values, index: -1 }).result, 'Invalid index');
  const outside = run('linked-read', { values, index: values.length });
  assert.equal(outside.result, 'Invalid index');
  assert.ok(outside.code.split('\n')[outside.frames.at(-1).line].includes('"Index: "'));
  assert.equal(run('linked-read', { values: [128, 256], index: 1 }).result, 256);
});

test('Linked-list operations handle string equality, mixed types, duplicate text, and boundaries', () => {
  const values = ['Alice', 'Bob', 'Carol'];
  assert.equal(run('linked-search', { values, target: 'Carol' }).result, 2);
  assert.equal(run('linked-search', { values, target: 'carol' }).result, -1);
  assert.equal(run('linked-search', { values: ['Bob', 'Bob'], target: 'Bob' }).result, 0);
  assert.equal(run('linked-search', { values: [12, '12'], target: '12' }).result, 1);
  assert.equal(run('linked-search', { values: [12, '12'], target: 12 }).result, 0);
  for (const id of ['linked-insert', 'doubly-list']) {
    assert.deepEqual(run(id, { values, index: 0, value: 'Eve' }).result, ['Eve', ...values]);
    assert.deepEqual(run(id, { values, index: 1, value: 'Eve' }).result, ['Alice', 'Eve', 'Bob', 'Carol']);
    assert.deepEqual(run(id, { values, index: 3, value: 'Eve' }).result, [...values, 'Eve']);
    assert.deepEqual(run(id, { values: [], index: 0, value: 'Eve' }).result, ['Eve']);
  }
  assert.deepEqual(run('linked-delete', { values, index: 1 }).result, ['Alice', 'Carol']);
  assert.deepEqual(run('linked-delete', { values: ['Alice'], index: 0 }).result, []);
});

test('BST deletion preserves sorted values for all structural cases', () => {
  const cases = [[[], 1], [[5], 5], [[5, 3], 5], [[5, 7], 5], [[40, 20, 60, 10, 30, 50, 70, 55], 40], [[5, 3, 7], 9], [[1, 2, 3, 4], 2]];
  for (const [values, target] of cases) {
    const expected = sorted([...new Set(values)].filter(v => v !== target));
    assert.deepEqual(run('bst-delete', { values, target }).result, expected);
  }
  assert.deepEqual(run('bst-insert', { values: [], target: 5 }).result, [5]);
  assert.deepEqual(run('bst-traversal', { values: [8, 3, 9, 1, 4] }).result, [1, 3, 4, 8, 9]);
});

test('Heap operations preserve max-heap order and the multiset', () => {
  const valid = a => a.every((v, i) => i === 0 || a[Math.floor((i - 1) / 2)] >= v);
  for (const values of fixtures) {
    const inserted = run('heap-insert', { values, value: 12 }).result;
    assert.ok(valid(inserted)); assert.deepEqual(sorted(inserted), sorted([...values, 12]));
    const removed = run('heap-extract', { values });
    if (values.length) { assert.equal(removed.result, Math.max(...values)); assert.ok(valid(removed.frames.at(-1).values)); const remaining = sorted(values); remaining.pop(); assert.deepEqual(sorted(removed.frames.at(-1).values), remaining); }
    else assert.equal(removed.result, 'Empty heap');
  }
});

test('Trie distinguishes an exact word, shared prefix, absent prefix and empty prefix', () => {
  assert.deepEqual(run('trie-search', { words: 'car, cart, cat', word: 'ca' }).result, ['car', 'cart', 'cat']);
  assert.equal(run('trie-search', { words: 'car, cart', word: 'ca' }).frames.at(-1).vars.exactWord, false);
  assert.equal(run('trie-search', { words: 'car, cart', word: 'car' }).frames.at(-1).vars.exactWord, true);
  assert.deepEqual(run('trie-search', { words: 'car', word: 'z' }).result, []);
  assert.deepEqual(run('trie-search', { words: 'car, cat', word: '' }).result, ['car', 'cat']);
});

test('Recursion and dynamic programming return known values', () => {
  let factorial = 1;
  for (let n = 0; n <= 10; n++) { if (n) factorial *= n; assert.equal(run('factorial', { n }).result, factorial); }
  const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
  for (const id of ['fibonacci', 'fibonacci-memo', 'fibonacci-bottom']) fib.forEach((value, n) => assert.equal(run(id, { n }).result, value));
  assert.ok(run('fibonacci-memo').frames.at(-1).count < run('fibonacci').frames.at(-1).count);
  assert.equal(run('reverse', { text: '' }).result, '');
  assert.equal(run('count-x', { text: 'xxx' }).result, 3);
  assert.equal(run('staircase', { n: 0 }).result, 1);
  assert.equal(run('staircase', { n: 4 }).result, 7);
  assert.equal(run('anagrams', { text: 'abcd' }).result.length, 24);
});

test('Graph traversal handles cycles, directed edges and disconnected starts', () => {
  for (const id of ['bfs', 'dfs']) {
    assert.deepEqual(run(id, { edges: 'A-B, B-C, C-A, D-E', start: 'A' }).result, ['A', 'B', 'C']);
    assert.deepEqual(run(id, { edges: 'A-B, B-C', start: 'C', direction: 'directed' }).result, ['C']);
    assert.deepEqual(run(id, { edges: '', start: 'H' }).result, ['H']);
  }
  assert.deepEqual(run('bfs', { edges: 'A-B, A-C, B-D, C-E', start: 'A' }).result, ['A', 'B', 'C', 'D', 'E']);
  assert.deepEqual(run('dfs', { edges: 'A-B, A-C, B-D, C-E', start: 'A' }).result, ['A', 'B', 'D', 'C', 'E']);
  assert.throws(() => parseGraph('A-B:-1'), /Use edges/);
});

test('Dijkstra improves a prior route and leaves unreachable distances infinite', () => {
  assert.deepEqual(run('dijkstra').result, { A: 0, B: 3, C: 2, D: 8, E: 10, F: 13 });
  assert.deepEqual(run('dijkstra', { edges: 'A-B:8, A-C:1, C-B:1, D-E:0', start: 'A', direction: 'directed' }).result, { A: 0, B: 2, C: 1, D: '∞', E: '∞' });
  assert.deepEqual(run('dijkstra', { edges: 'A-B:0, B-C:0', start: 'A' }).result, { A: 0, B: 0, C: 0 });
});

test('Optimization examples match brute-force answers', () => {
  for (const values of fixtures) {
    assert.deepEqual(run('copy-array', { values }).result, values.map(v => v * 2));
    assert.deepEqual(run('in-place-double', { values }).result, values.map(v => v * 2));
    for (const target of [-8, 0, 2, 6, 8]) {
      const result = run('two-sum', { values, target }).result;
      const possible = values.some((v, i) => values.some((w, j) => i !== j && v + w === target));
      assert.equal(result.length === 2, possible);
      if (result.length) { assert.notEqual(result[0], result[1]); assert.equal(values[result[0]] + values[result[1]], target); }
    }
  }
  assert.equal(run('mean', { values: [1, 3] }).result, 'No even values');
  assert.equal(run('greedy-stock', { values: [9, 7, 4, 1] }).result, 0);
  assert.equal(run('greedy-stock', { values: [8, 2, 6, 1, 7] }).result, 6);
});

test('Complexity charts stay finite on both scales and all supported ranges', () => {
  for (const scale of ['linear', 'log']) for (const n of [8, 16, 32, 64, 128]) {
    const svg = chartSVG(Object.keys(curves), n, scale, Math.floor(n / 2));
    assert.ok(!svg.includes('NaN') && !svg.includes('Infinity'));
  }
});

test('Standalone lesson exercises match numeric and calendar edge cases', () => {
  for (const values of fixtures) {
    assert.equal(run('array-sum', { values }).result, values.reduce((sum, v) => sum + v, 0));
    assert.deepEqual(run('recursive-double', { values }).result, values.map(v => v * 2));
    for (const id of ['recursive-max', 'recursive-max-copy']) assert.equal(run(id, { values }).result, values.length ? Math.max(...values) : 'null');
  }
  for (const [number, expected] of [[0, false], [1, false], [2, true], [4, false], [17, true], [49, false]]) assert.equal(run('prime', { number }).result, expected);
  for (const [year, expected] of [[1900, false], [2000, true], [2024, true], [2023, false], [2100, false]]) assert.equal(run('leap-year', { year }).result, expected);
});

test('Generic linked-list Java runs correctly for String and Integer nodes', { timeout: 60000 }, () => {
  const directory = mkdtempSync(join(tmpdir(), 'dsa-linked-java-'));
  try {
    const cases = [
      ['linked-read', 'System.out.print(read(head, 1));', 'Bob'],
      ['linked-search', 'System.out.print(search(head, new String("Bob")));', '1'],
      ['linked-search', 'Node<Integer> numbers = new Node<>(128); numbers.next = new Node<>(256); System.out.print(search(numbers, 256));', '1'],
      ['linked-insert', 'head = insert(head, 1, "Eve"); System.out.print(readValues(head));', 'Alice,Eve,Bob'],
      ['linked-delete', 'head = delete(head, 0); System.out.print(readValues(head));', 'Bob'],
      ['doubly-list', 'head = insert(head, 1, "Eve"); System.out.print(head.next.value + ":" + head.next.next.prev.value);', 'Eve:Eve']
    ];
    for (let i = 0; i < cases.length; i++) {
      const [id, statement, expected] = cases[i], name = `Linked${i}`, path = join(directory, name + '.java');
      writeFileSync(path, `import java.util.*;\nclass ${name} {\n${demos[id].code}\nstatic String readValues(Node<?> node) { List<String> out = new ArrayList<>(); while(node != null) { out.add(String.valueOf(node.value)); node = node.next; } return String.join(",", out); }\npublic static void main(String[] args) { Node<String> head = new Node<>(new String("Alice")); head.next = new Node<>(new String("Bob")); head.next.prev = head; ${statement} }\n}`);
      const compiled = spawnSync('javac', ['-d', directory, path], { encoding: 'utf8', timeout: 15000 });
      assert.equal(compiled.status, 0, compiled.stderr);
      const executed = spawnSync('java', ['-cp', directory, name], { encoding: 'utf8', timeout: 10000 });
      assert.equal(executed.status, 0, executed.stderr); assert.equal(executed.stdout, expected);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('Every displayed Java example compiles with the JDK', { timeout: 60000 }, () => {
  const directory = mkdtempSync(join(tmpdir(), 'dsa-java-'));
  try {
    const files = Object.values(demos).map((d, i) => {
      const path = join(directory, `Demo${i}.java`);
      writeFileSync(path, `import java.util.*;\nfinal class Demo${i} {\n${d.code}\n}\n`);
      return path;
    });
    const result = spawnSync('javac', ['-d', directory, ...files], { encoding: 'utf8', timeout: 50000 });
    assert.equal(result.status, 0, result.stderr || result.error?.message);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
