import { define } from './algorithms.js';
import { formatListValue } from './list-input.js';

const arrayField = { key: 'values', label: 'Starting values', type: 'array', hint: 'Comma-separated integers · up to 14 values' };
const num = (key, label, min = -999, max = 999) => ({ key, label, type: 'number', min, max });
const select = (key, label, options) => ({ key, label, type: 'select', options });
const text = (key, label, hint) => ({ key, label, type: 'text', hint });

define('hash-map', 'Hash table · collisions & lookup', {
  category: 'Data structures', kind: 'hash', fields: [arrayField, num('target', 'Lookup / remove key'), select('operation', 'Operation', ['lookup', 'remove'])],
  defaults: { values: [10, 17, 24, 8, 15], target: 17, operation: 'lookup' },
  time: { best: 'O(1) per operation', average: 'O(1) with bounded load', worst: 'O(n) per operation' }, space: 'O(n + buckets)', curves: ['constant', 'linear'], counter: 'Key comparisons'
}, `record Entry(int key, int value) {}
static Integer hashDemo(int[] keys, int target, boolean remove) {
  List<List<Entry>> table = new ArrayList<>();
  for (int b = 0; b < 7; b++) table.add(new ArrayList<>());
  for (int key : keys) {
    int b = Math.floorMod(key, 7);
    List<Entry> chain = table.get(b);
    int found = -1;
    for (int i = 0; i < chain.size(); i++) {
      if (chain.get(i).key() == key) { found = i; break; }
    }
    Entry entry = new Entry(key, key * 10);
    if (found < 0) chain.add(entry);
    else chain.set(found, entry);
  }
  int b = Math.floorMod(target, 7);
  List<Entry> chain = table.get(b);
  for (int i = 0; i < chain.size(); i++) {
    if (chain.get(i).key() == target) {
      int value = chain.get(i).value();
      if (remove) chain.remove(i);
      return value;
    }
  }
  return null;
}`, ({ state: s, emit }, p) => {
  s.buckets = Array.from({ length: 7 }, () => []); emit('List<List<Entry>>', 'Allocate seven buckets', 'This teaching hash table uses integer keys, value = key × 10, and separate chaining.');
  for (const key of p.values) {
    const b = ((key % 7) + 7) % 7; s.activeBucket = b;
    emit('int b = Math.floorMod(key', 'Hash the key', `floorMod(${key}, 7) = ${b}.`, { vars: { key, bucket: b, value: key * 10 } });
    let found = -1;
    for (let i = 0; i < s.buckets[b].length; i++) { emit('if (chain.get(i).key() == key)', 'Check a key in the chain', `Compare ${s.buckets[b][i].key} with ${key}.`, { count: s.count + 1, activeEntry: i }); if (s.buckets[b][i].key === key) { found = i; break; } }
    const entry = { key, value: key * 10 };
    if (found < 0) { s.buckets[b].push(entry); emit('if (found <', 'Append to this bucket', s.buckets[b].length > 1 ? 'A collision is resolved by storing another entry in the chain.' : 'This bucket was empty.', { writes: s.writes + 1, activeEntry: s.buckets[b].length - 1 }); }
    else { s.buckets[b][found] = entry; emit('else chain.set', 'Update an existing key', 'The table keeps one entry per key.', { writes: s.writes + 1, activeEntry: found }); }
  }
  const b = ((p.target % 7) + 7) % 7; emit('int b = Math.floorMod(target', `Find key ${p.target}`, `Only bucket ${b} can contain this key.`, { activeBucket: b, activeEntry: -1, vars: { target: p.target, bucket: b } });
  for (let i = 0; i < s.buckets[b].length; i++) {
    const entry = s.buckets[b][i]; emit('if (chain.get(i).key() == target)', 'Confirm key equality', `${entry.key} == ${p.target} is ${entry.key === p.target}.`, { count: s.count + 1, activeEntry: i });
    if (entry.key === p.target) { if (p.operation === 'remove') { s.buckets[b].splice(i, 1); emit('if (remove)', 'Remove the matching entry', 'The other colliding entries remain reachable.', { writes: s.writes + 1 }); } emit('return value', 'Return the stored value', `Key ${p.target} maps to ${entry.value}.`, { result: entry.value }); return; }
  }
  emit('return null', 'Key absent', 'The entire relevant bucket was checked.', { result: 'null' });
});

for (const isStack of [true, false]) define(isStack ? 'stack' : 'queue', isStack ? 'Stack · push & pop' : 'Queue · enqueue & dequeue', {
  category: 'Data structures', kind: isStack ? 'stack' : 'queue', fields: [arrayField, num('removals', isStack ? 'Pops after filling' : 'Dequeues after filling', 0, 15)], defaults: { values: [12, 7, 24, 18], removals: 2 },
  time: { best: 'O(1) per endpoint operation', average: 'O(1) amortized', worst: 'O(n) when resizing' }, space: 'O(n) storage', curves: ['constant', 'linear'], counter: 'Endpoint operations', writeLabel: 'Removals'
}, `static List<Integer> ${isStack ? 'stack' : 'queue'}Demo(int[] values, int removals) {
  Deque<Integer> work = new ArrayDeque<>();
  List<Integer> removed = new ArrayList<>();
  for (int value : values) {
    work.${isStack ? 'push' : 'addLast'}(value);
  }
  for (int i = 0; i < removals; i++) {
    if (work.isEmpty()) break;
    removed.add(work.${isStack ? 'pop' : 'removeFirst'}());
  }
  return removed;
}`, ({ state: s, emit }, p) => {
  s.values = []; emit('Deque<Integer>', isStack ? 'An empty stack' : 'An empty queue', isStack ? 'The rightmost item in this diagram is the top.' : 'The front is on the left and the back is on the right.', { memory: [] });
  for (const value of p.values) { s.values.push(value); emit(isStack ? 'work.push' : 'work.addLast', isStack ? `Push ${value}` : `Enqueue ${value}`, isStack ? 'This value becomes the new top.' : 'Add at the back of the queue.', { active: [s.values.length - 1], count: s.count + 1, vars: { value, size: s.values.length } }); }
  const removed = [];
  for (let i = 0; i < p.removals; i++) {
    emit('if (work.isEmpty()', 'Check before removal', s.values.length ? 'There is a value available.' : 'The structure is empty. Stop safely.', { active: s.values.length ? [isStack ? s.values.length - 1 : 0] : [] }); if (!s.values.length) break;
    const value = isStack ? s.values.pop() : s.values.shift(); removed.push(value); emit('removed.add', isStack ? `Pop ${value}` : `Dequeue ${value}`, isStack ? 'The newest remaining value leaves first.' : 'The earliest remaining value leaves first.', { memory: [...removed], count: s.count + 1, writes: s.writes + 1, active: [], vars: { removed: value, size: s.values.length } });
  }
  emit('return removed', 'Operation sequence complete', `Removal order: ${removed.join(', ') || '(none)'}.`, { result: removed, active: [] });
});

define('brackets', 'Balanced brackets', {
  kind: 'stack', fields: [text('text', 'Bracket expression', 'Use (, ), [, ], {, } · up to 30 characters')], defaults: { text: '{[()]}' }, counter: 'Characters read', space: 'O(n)', curves: ['linear']
}, `static boolean balanced(String text) {
  Deque<Character> stack = new ArrayDeque<>();
  for (char c : text.toCharArray()) {
    int open = "([{​".indexOf(c);
    int close = ")]}​".indexOf(c);
    if (open >= 0) stack.push(c);
    else if (close >= 0) {
      if (stack.isEmpty()) return false;
      if (stack.pop() != "([{​".charAt(close)) return false;
    }
  }
  return stack.isEmpty();
}`.replaceAll('\u200b', ''), ({ state: s, emit }, p) => {
  s.values = []; emit('Deque<Character>', 'Prepare the opener stack', 'Closers must match the most recent unmatched opener.', { sourceText: p.text });
  for (let i = 0; i < p.text.length; i++) {
    const c = p.text[i]; emit('for (char c', `Read “${c}”`, `Character index ${i}.`, { count: s.count + 1, textIndex: i, vars: { i, character: c } });
    if ('([{'.includes(c)) { s.values.push(c); emit('if (open >=', 'Push an opening bracket', 'Remember the nesting order.', { active: [s.values.length - 1] }); }
    else if (')]}'.includes(c)) {
      if (!s.values.length) { emit('if (stack.isEmpty()', 'Unmatched closer', 'No opening bracket is available.', { result: false }); return; }
      const top = s.values.pop(), expected = '([{'.charAt(')]}'.indexOf(c)); emit('if (stack.pop()', 'Pop and compare', `Expected “${expected}”; popped “${top}”.`, { active: [] }); if (top !== expected) { emit('if (stack.pop()', 'Mismatched nesting', 'The types of brackets do not match.', { result: false }); return; }
    }
  }
  emit('return stack.isEmpty', s.values.length ? 'Unclosed opener remains' : 'All brackets match', s.values.length ? 'The expression ended before every opener was closed.' : 'Every closer matched and the stack is empty.', { result: !s.values.length, active: [] });
});

const nodeCode = `// Use Node<String> for text, Node<Integer> for integers.
static class Node<T> {
  T value;
  Node<T> next, prev;
  Node(T value) { this.value = value; }
}`;

function listState(s, nodes, head, doubly = false) {
  const order = []; let cursor = head;
  while (cursor !== null && nodes[cursor] && !order.includes(cursor)) { order.push(cursor); cursor = nodes[cursor].next; }
  const detached = Object.keys(nodes).filter(k => !order.includes(k));
  const width = Math.max(74, ...Object.values(nodes).map(n => Math.min(250, 26 + [...String(n.value)].length * 7.5)));
  s.nodes = [...order, ...detached].map((id, i) => ({ id, label: String(nodes[id].value), width, x: width / 2 + 24 + (order.includes(id) ? order.indexOf(id) : i - order.length) * (width + 42), y: order.includes(id) ? 110 : 225, sub: id === head ? 'head' : doubly && id === order.at(-1) ? 'tail' : id }));
  s.edges = Object.entries(nodes).flatMap(([id, node]) => [
    ...(node.next !== null && nodes[node.next] ? [{ from: id, to: node.next, directed: true }] : []),
    ...(doubly && node.prev !== null && nodes[node.prev] ? [{ from: id, to: node.prev, directed: true, back: true }] : [])
  ]);
  s.values = order.map(id => nodes[id].value); s.listHead = head; s.nullTail = order.at(-1);
}

for (const operation of ['read', 'search', 'insert', 'delete', 'doubly']) {
  const code = operation === 'read' ? `static <T> T read(Node<T> head, int index) {
  if (index < 0) throw new IndexOutOfBoundsException("Negative index");
  Node<T> current = head;
  for (int i = 0; current != null; i++) {
    if (i == index) return current.value;
    current = current.next;
  }
  throw new IndexOutOfBoundsException("Index: " + index);
}` : operation === 'search' ? `static <T> int search(Node<T> head, T target) {
  Node<T> current = head;
  int index = 0;
  while (current != null) {
    if (Objects.equals(current.value, target)) return index;
    current = current.next;
    index++;
  }
  return -1;
}` : operation === 'delete' ? `static <T> Node<T> delete(Node<T> head, int index) {
  if (index < 0) throw new IndexOutOfBoundsException();
  if (head == null) throw new IndexOutOfBoundsException();
  if (index == 0) return head.next;
  Node<T> before = head;
  for (int i = 0; i < index - 1; i++) {
    if (before.next == null) throw new IndexOutOfBoundsException();
    before = before.next;
  }
  if (before.next == null) throw new IndexOutOfBoundsException();
  before.next = before.next.next;
  return head;
}` : `static <T> Node<T> insert(Node<T> head, int index, T value) {
  if (index < 0) throw new IndexOutOfBoundsException();
  Node<T> fresh = new Node<>(value);
  if (index == 0) {
    fresh.next = head;${operation === 'doubly' ? '\n    if (head != null) head.prev = fresh;' : ''}
    return fresh;
  }
  Node<T> before = head;
  for (int i = 0; i < index - 1; i++) {
    if (before == null) throw new IndexOutOfBoundsException();
    before = before.next;
  }
  if (before == null) throw new IndexOutOfBoundsException();
  fresh.next = before.next;${operation === 'doubly' ? '\n  fresh.prev = before;\n  if (before.next != null) before.next.prev = fresh;' : ''}
  before.next = fresh;
  return head;
}`;
  define(operation === 'doubly' ? 'doubly-list' : `linked-${operation}`, ({ read: 'Linked list · read by index', search: 'Linked list · search', insert: 'Linked list · insert', delete: 'Linked list · delete', doubly: 'Doubly linked list · insert' })[operation], {
    category: 'Data structures', kind: 'linked', fields: [{ key: 'values', label: 'Starting values', type: 'list', hint: 'Text or integers, separated by commas · e.g. Alice, Bob, Carol · quote numeric text as "12"' }, ...(operation === 'search' ? [{ key: 'target', label: 'Target value', type: 'value' }] : [num('index', operation === 'read' ? 'Read index (zero-based)' : 'Index', 0, 14)]), ...(operation === 'insert' || operation === 'doubly' ? [{ key: 'value', label: 'New value', type: 'value' }] : [])],
    defaults: { values: ['Alice', 'Bob', 'Carol', 'Dave'], target: 'Carol', index: 2, value: 'Eve' }, time: { best: 'O(1)', average: operation === 'search' ? 'O(n)' : 'O(n) by index', worst: 'O(n)' }, space: 'O(1) auxiliary', curves: ['linear', 'constant'], counter: operation === 'search' ? 'Value comparisons' : 'Links followed', writeLabel: 'Link updates',
    complexityNote: operation === 'search' ? 'n is the number of nodes. O(n) counts value comparisons. String equality can also examine up to m characters, so unrestricted strings can give O(nm) worst-case work. Text is limited to 32 characters in this visualizer.' : 'n is the number of nodes. Reading by index follows links from head; accessing index k takes O(k + 1) time. Indexed insertion and deletion also include finding the necessary node. Link rewiring itself takes O(1).'
  }, `${nodeCode}\n${code}`, ({ state: s, emit }, p) => {
    const nodes = {}; p.values.forEach((v, i) => { nodes['n' + i] = { value: v, next: i < p.values.length - 1 ? 'n' + (i + 1) : null, prev: i > 0 ? 'n' + (i - 1) : null }; }); let head = p.values.length ? 'n0' : null;
    const update = () => listState(s, nodes, head, operation === 'doubly'); update();
    if (operation === 'read') {
      emit('if (index <', 'Check the requested index', 'Indices start at zero. Reading follows links and returns the value at that position.', { vars: { index: p.index } });
      if (p.index < 0) { emit('throw new IndexOutOfBoundsException("Negative index")', 'Invalid index', 'A list index cannot be negative.', { result: 'Invalid index' }); return; }
      let current = head;
      emit('Node<T> current', 'Begin at head', 'The first node is at index 0.', { activeNodes: current ? [current] : [], vars: { index: p.index, i: 0, current: current ?? 'null' } });
      for (let i = 0; current !== null; i++) {
        emit('if (i == index)', `Is this index ${p.index}?`, `Current position: ${i}. ${i === p.index ? 'Read this node’s value.' : 'Continue to the next node.'}`, { activeNodes: [current], vars: { index: p.index, i, current } });
        if (i === p.index) { emit('return current.value', 'Return the value at this index', `read(${p.index}) returns ${formatListValue(nodes[current].value)} after following ${s.count} next link${s.count === 1 ? '' : 's'}.`, { result: nodes[current].value, visitedNodes: [current] }); return; }
        current = nodes[current].next;
        emit('current = current.next', 'Follow the next reference', current === null ? 'The list ends here.' : `Advance to index ${i + 1}.`, { count: s.count + 1, activeNodes: current ? [current] : [], vars: { index: p.index, i: i + 1, current: current ?? 'null' } });
      }
      emit('throw new IndexOutOfBoundsException("Index: "', 'Index outside the list', `There is no value at index ${p.index}; traversal reached null.`, { result: 'Invalid index' }); return;
    }
    if (operation === 'search') {
      let current = head, index = 0; emit('Node<T> current', 'Begin at head', 'The links determine the order; there is no direct indexed jump.', { activeNodes: current ? [current] : [], vars: { target: p.target, index, current: current ?? 'null' } });
      while (current !== null) { emit('if (Objects.equals', 'Compare this node’s value', `Objects.equals(${formatListValue(nodes[current].value)}, ${formatListValue(p.target)}) is ${nodes[current].value === p.target}. Text comparisons are case-sensitive.`, { count: s.count + 1, activeNodes: [current], vars: { index, target: p.target, current } }); if (nodes[current].value === p.target) { emit('return index', 'Value found', `The match is ${index} links from head.`, { result: index, visitedNodes: [current] }); return; } current = nodes[current].next; emit('current = current.next', 'Follow next', current === null ? 'The end of the chain has been reached.' : 'Move to the referenced node.', { activeNodes: current ? [current] : [] }); index++; }
      emit('return -1', 'Value absent', 'Traversal reached null without a match.', { result: -1 }); return;
    }
    const insertion = operation !== 'delete';
    const valid = p.index >= 0 && p.index < p.values.length + (insertion ? 1 : 0);
    emit('if (index <', 'Check the requested position', `Index ${p.index} ${valid ? 'is valid.' : 'is outside this list.'}`, { vars: { index: p.index, size: p.values.length } });
    if (!valid) { emit('throw new IndexOutOfBoundsException', 'Invalid index', 'Choose an existing index, or the end position for insertion.', { result: 'Invalid index' }); return; }
    let before = head;
    if (insertion) { nodes.fresh = { value: p.value, next: null, prev: null }; update(); emit('Node<T> fresh =', 'Allocate a new node', `The new node stores ${formatListValue(p.value)}; it is not yet in the chain.`, { activeNodes: ['fresh'], vars: { index: p.index, value: p.value } }); }
    if (p.index === 0) {
      if (insertion) { nodes.fresh.next = head; update(); emit('fresh.next = head', 'Link the new node to the old head', 'Preserve access to the existing chain.', { activeNodes: ['fresh'], writes: s.writes + 1 }); if (operation === 'doubly' && head !== null) { nodes[head].prev = 'fresh'; update(); emit('head.prev = fresh', 'Repair the backward link', 'The old head now points back to the new node.', { writes: s.writes + 1 }); } head = 'fresh'; update(); emit('return fresh', 'Return the new head', 'The caller must retain this returned reference.', { result: [...s.values], activeNodes: ['fresh'] }); }
      else { const removed = head; head = nodes[head].next; delete nodes[removed]; update(); emit('if (index == 0)', 'Advance head', 'The former first node is no longer in the list.', { writes: 1, result: [...s.values], activeNodes: head ? [head] : [] }); }
      return;
    }
    emit('Node<T> before = head', 'Find the predecessor', 'Walk to the node immediately before the requested position.', { activeNodes: [before] });
    for (let i = 0; i < p.index - 1; i++) { before = nodes[before].next; emit('before = before.next', 'Follow a link', `Move to predecessor candidate ${before}.`, { count: s.count + 1, activeNodes: [before], vars: { index: p.index, i: i + 1, before } }); }
    if (insertion) {
      nodes.fresh.next = nodes[before].next; update(); emit('fresh.next = before.next', 'Save the old successor', 'Link the new node forward before changing the predecessor.', { activeNodes: ['fresh', before], writes: s.writes + 1 });
      if (operation === 'doubly') { nodes.fresh.prev = before; update(); emit('fresh.prev = before', 'Link backward', 'The new node remembers its predecessor.', { writes: s.writes + 1 }); const next = nodes[before].next; if (next) { nodes[next].prev = 'fresh'; update(); emit('before.next.prev = fresh', 'Update the successor’s backward link', 'Both directions must agree.', { writes: s.writes + 1 }); } }
      nodes[before].next = 'fresh'; update(); emit('before.next = fresh', 'Splice into the chain', 'The predecessor now leads through the new node.', { writes: s.writes + 1 });
    } else { const removed = nodes[before].next; nodes[before].next = nodes[removed].next; update(); emit('before.next = before.next.next', 'Bypass the removed node', 'The detached node is no longer reachable from head.', { activeNodes: [before, removed], writes: s.writes + 1 }); delete nodes[removed]; update(); }
    emit('return head', 'Return the list head', 'Traversal cost and link updates are shown separately.', { result: [...s.values], activeNodes: [], vars: { head: head ?? 'null', size: s.values.length } });
  });
}

const bstNode = `static class Node {
  int value; Node left, right;
  Node(int value) { this.value = value; }
}`;
const bstInsert = `static Node insert(Node node, int value) {
  if (node == null) return new Node(value);
  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  return node;
}`;

function treeState(s, root, highlight = []) {
  const nodes = [], edges = []; let column = 0;
  const walk = (node, depth) => { if (!node) return; walk(node.left, depth + 1); nodes.push({ id: node.id, label: String(node.value), x: 45 + column++ * 55, y: 40 + depth * 68, sub: node === root ? 'root' : '' }); for (const child of [node.left, node.right]) if (child) edges.push({ from: node.id, to: child.id, directed: true }); walk(node.right, depth + 1); };
  walk(root, 0); s.nodes = nodes; s.edges = edges; s.activeNodes = highlight; s.values = nodes.map(n => Number(n.label));
}

for (const operation of ['search', 'insert', 'delete', 'traversal']) {
  const main = operation === 'search' ? `static boolean contains(Node node, int target) {
  while (node != null) {
    if (target == node.value) return true;
    if (target < node.value) node = node.left;
    else node = node.right;
  }
  return false;
}` : operation === 'delete' ? `static Node delete(Node node, int target) {
  if (node == null) return null;
  if (target < node.value) node.left = delete(node.left, target);
  else if (target > node.value) node.right = delete(node.right, target);
  else {
    if (node.left == null) return node.right;
    if (node.right == null) return node.left;
    Node successor = node.right;
    while (successor.left != null) successor = successor.left;
    node.value = successor.value;
    node.right = delete(node.right, successor.value);
  }
  return node;
}` : operation === 'traversal' ? `static void inorder(Node node, List<Integer> output) {
  if (node == null) return;
  inorder(node.left, output);
  output.add(node.value);
  inorder(node.right, output);
}` : '';
  define('bst-' + operation, { search: 'BST · search', insert: 'BST · insert', delete: 'BST · delete', traversal: 'BST · inorder traversal' }[operation], {
    category: 'Data structures', kind: 'tree', fields: [arrayField, ...(operation === 'traversal' ? [] : [num('target', operation === 'insert' ? 'New value' : 'Target')])],
    defaults: { values: [40, 20, 60, 10, 30, 50, 70], target: operation === 'insert' ? 25 : operation === 'delete' ? 40 : 50 },
    time: { best: operation === 'traversal' ? 'O(n)' : 'O(1)', average: operation === 'traversal' ? 'O(n)' : 'O(h) · O(log n) if balanced', worst: 'O(n)' }, space: operation === 'search' ? 'O(1) auxiliary' : 'O(h) stack', curves: operation === 'traversal' ? ['linear'] : ['log', 'linear'], counter: operation === 'traversal' ? 'Nodes output' : 'Nodes compared', writeLabel: 'Link / value updates'
  }, `${bstNode}\n${operation === 'insert' ? bstInsert : main}`, ({ state: s, emit }, p) => {
    let serial = 0, root = null;
    const newNode = value => ({ id: 't' + serial++, value, left: null, right: null });
    const seed = (node, value) => { if (!node) return newNode(value); if (value < node.value) node.left = seed(node.left, value); if (value > node.value) node.right = seed(node.right, value); return node; };
    for (const value of p.values) root = seed(root, value);
    treeState(s, root); emit(operation === 'search' ? 'while (node !=' : operation === 'traversal' ? 'if (node == null) return;' : 'if (node == null)', 'Starting search tree', 'Starting values are inserted in the supplied order. Duplicate values are ignored.', { vars: { target: p.target ?? '—' } });
    if (operation === 'search') {
      let node = root;
      while (node) { treeState(s, root, [node.id]); emit('if (target ==', 'Compare at this node', `${p.target} versus ${node.value}.`, { count: s.count + 1, vars: { target: p.target, current: node.value } }); if (p.target === node.value) { emit('return true', 'Target found', 'Only one root-to-node path was followed.', { result: true, visitedNodes: [node.id] }); return; } const left = p.target < node.value; node = left ? node.left : node.right; treeState(s, root, node ? [node.id] : []); emit(left ? 'node = node.left' : 'else node = node.right', left ? 'Follow the left branch' : 'Follow the right branch', left ? 'All larger candidates are excluded.' : 'All smaller candidates are excluded.'); }
      emit('return false', 'Target absent', 'The chosen child reference is null.', { result: false }); return;
    }
    if (operation === 'traversal') {
      const output = []; const visit = node => { if (!node) return; treeState(s, root, [node.id]); emit('inorder(node.left', 'Visit the left subtree', `Pause at ${node.value} while handling smaller values.`, { vars: { current: node.value } }); visit(node.left); output.push(node.value); treeState(s, root, [node.id]); emit('output.add', `Output ${node.value}`, 'The left subtree is complete.', { count: s.count + 1, memory: [...output], visitedNodes: [...(s.visitedNodes || []), node.id] }); emit('inorder(node.right', 'Visit the right subtree', 'Continue with larger values.'); visit(node.right); }; visit(root); emit('if (node == null) return;', 'Inorder complete', 'The output is sorted.', { result: output, activeNodes: [] }); return;
    }
    const traceInsert = node => {
      if (!node) { const fresh = newNode(p.target); return fresh; }
      treeState(s, root, [node.id]); emit('if (value <', 'Compare the insertion value', `${p.target} versus ${node.value}.`, { count: s.count + 1, vars: { value: p.target, current: node.value } });
      if (p.target < node.value) { node.left = traceInsert(node.left); treeState(s, root, [node.id]); emit('node.left = insert', 'Reconnect the left subtree', 'Keep the returned subtree root.', { writes: s.writes + 1 }); }
      else if (p.target > node.value) { node.right = traceInsert(node.right); treeState(s, root, [node.id]); emit('node.right = insert', 'Reconnect the right subtree', 'The BST invariant is preserved.', { writes: s.writes + 1 }); }
      else emit('return node;', 'Duplicate ignored', 'This tree stores unique values.'); return node;
    };
    const remove = (node, target) => {
      if (!node) { emit('if (node == null) return null', 'Reached null', 'There is no matching node in this subtree.'); return null; }
      treeState(s, root, [node.id]); emit('if (target <', 'Compare the deletion target', `${target} versus ${node.value}.`, { count: s.count + 1, vars: { target, current: node.value } });
      if (target < node.value) { node.left = remove(node.left, target); treeState(s, root, [node.id]); emit('node.left = delete', 'Reconnect left subtree', 'Keep all remaining descendants.', { writes: s.writes + 1 }); }
      else if (target > node.value) { node.right = remove(node.right, target); treeState(s, root, [node.id]); emit('else if (target >', 'Reconnect right subtree', 'Keep the returned child root.', { writes: s.writes + 1 }); }
      else {
        if (!node.left) { emit('if (node.left == null)', 'Replace with right child', 'This also handles a leaf, whose right child is null.'); return node.right; }
        if (!node.right) { emit('if (node.right == null)', 'Replace with left child', 'There is one subtree to preserve.'); return node.left; }
        let successor = node.right; emit('Node successor', 'Find the inorder successor', 'It is the smallest value in the right subtree.');
        while (successor.left) { successor = successor.left; treeState(s, root, [node.id, successor.id]); emit('while (successor.left', 'Follow a left link', 'Continue toward the smallest right-subtree value.'); }
        node.value = successor.value; treeState(s, root, [node.id, successor.id]); emit('node.value = successor.value', 'Copy the successor value', 'The old successor node must now be removed.', { writes: s.writes + 1 }); node.right = remove(node.right, successor.value); treeState(s, root, [node.id]); emit('node.right = delete(node.right, successor', 'Remove the old successor', 'Its possible right child is preserved.', { writes: s.writes + 1 });
      }
      return node;
    };
    root = operation === 'insert' ? traceInsert(root) : remove(root, p.target); treeState(s, root); emit('return node;', operation === 'insert' ? 'Insertion complete' : 'Deletion complete', 'The returned root represents the updated tree.', { result: [...s.values], activeNodes: [] });
  });
}

const heapHelpers = `static void swap(List<Integer> heap, int i, int j) {
  int value = heap.get(i); heap.set(i, heap.get(j)); heap.set(j, value);
}`;
for (const insert of [true, false]) define(insert ? 'heap-insert' : 'heap-extract', insert ? 'Max-heap · insert' : 'Max-heap · extract maximum', {
  category: 'Data structures', kind: 'heap', fields: [arrayField, ...(insert ? [num('value', 'New value')] : [])], defaults: { values: [60, 40, 50, 10, 30, 20], value: 75 },
  time: { best: 'O(1)', average: 'O(log n)', worst: insert ? 'O(log n) sift · O(n) on resize' : 'O(log n)' }, space: 'O(1) auxiliary, excluding capacity', curves: ['log', 'linear'], counter: 'Priority comparisons'
}, insert ? `static void offer(List<Integer> heap, int value) {
  heap.add(value);
  int i = heap.size() - 1;
  while (i > 0) {
    int parent = (i - 1) / 2;
    if (heap.get(parent) >= heap.get(i)) break;
    swap(heap, parent, i);
    i = parent;
  }
}
${heapHelpers}` : `static int extractMax(List<Integer> heap) {
  if (heap.isEmpty()) throw new NoSuchElementException();
  int max = heap.get(0);
  int last = heap.remove(heap.size() - 1);
  if (heap.isEmpty()) return max;
  heap.set(0, last);
  int i = 0;
  while (2 * i + 1 < heap.size()) {
    int child = 2 * i + 1;
    if (child + 1 < heap.size() && heap.get(child + 1) > heap.get(child)) child++;
    if (heap.get(i) >= heap.get(child)) break;
    swap(heap, i, child);
    i = child;
  }
  return max;
}
${heapHelpers}`, ({ state: s, emit }, p) => {
  // Build a valid starting max-heap without charging setup to the operation.
  s.values = [];
  for (const value of p.values) { s.values.push(value); let i = s.values.length - 1; while (i > 0) { const parent = Math.floor((i - 1) / 2); if (s.values[parent] >= s.values[i]) break; [s.values[parent], s.values[i]] = [s.values[i], s.values[parent]]; i = parent; } }
  const update = active => { s.nodes = s.values.map((value, i) => { const level = Math.floor(Math.log2(i + 1)); const pos = i - (2 ** level - 1); return { id: 'h' + i, label: String(value), x: (pos + 0.5) * (640 / 2 ** level), y: 40 + level * 70, sub: String(i) }; }); s.edges = s.values.slice(1).map((_, n) => ({ from: 'h' + Math.floor(n / 2), to: 'h' + (n + 1), directed: true })); s.activeNodes = (active || []).map(i => 'h' + i); s.active = active || []; };
  update(); emit(insert ? 'heap.add(value)' : 'if (heap.isEmpty()', insert ? 'Starting max-heap' : 'Check the heap', 'Starting values are heapified first; setup is excluded from operation counters.', { vars: { size: s.values.length } });
  if (insert) {
    s.values.push(p.value); let i = s.values.length - 1; update([i]); emit('heap.add(value)', 'Preserve completeness', `New value ${p.value} begins at index ${i}.`, { vars: { i, value: p.value } });
    while (i > 0) { const parent = Math.floor((i - 1) / 2); update([i, parent]); emit('if (heap.get(parent)', 'Compare with parent', `${s.values[parent]} ≥ ${s.values[i]} is ${s.values[parent] >= s.values[i]}.`, { count: s.count + 1, vars: { i, parent } }); if (s.values[parent] >= s.values[i]) break; [s.values[parent], s.values[i]] = [s.values[i], s.values[parent]]; update([i, parent]); emit('swap(heap, parent', 'Sift up', 'Move the higher-priority value toward the root.', { writes: s.writes + 1 }); i = parent; }
    update(); emit('while (i >', 'Heap restored', 'The max-heap rule holds on every parent-child link.', { result: [...s.values] });
  } else {
    if (!s.values.length) { emit('throw new NoSuchElementException', 'Heap is empty', 'There is no maximum to remove.', { result: 'Empty heap' }); return; }
    const max = s.values[0]; update([0]); emit('int max', 'Save the maximum', `The root contains ${max}.`, { vars: { max } }); const last = s.values.pop(); update(); emit('int last =', 'Remove the last position', 'This preserves the complete shape.'); if (!s.values.length) { emit('if (heap.isEmpty()) return max', 'The heap is now empty', 'The single value was the maximum.', { result: max }); return; }
    s.values[0] = last; let i = 0; update([0]); emit('heap.set(0', 'Move the last value to the root', 'Repair the ordering downward.');
    while (2 * i + 1 < s.values.length) { let child = 2 * i + 1; if (child + 1 < s.values.length) { update([child, child + 1]); emit('if (child + 1', 'Choose the larger child', 'The higher-priority child must rise first.', { count: s.count + 1 }); if (s.values[child + 1] > s.values[child]) child++; } update([i, child]); emit('if (heap.get(i)', 'Compare parent and chosen child', `${s.values[i]} ≥ ${s.values[child]} is ${s.values[i] >= s.values[child]}.`, { count: s.count + 1, vars: { i, child } }); if (s.values[i] >= s.values[child]) break; [s.values[i], s.values[child]] = [s.values[child], s.values[i]]; update([i, child]); emit('swap(heap, i, child)', 'Sift down', 'Promote the larger child.', { writes: s.writes + 1 }); i = child; }
    update(); emit('return max;', 'Return the maximum', 'The remaining values still form a valid max-heap.', { result: max });
  }
});

const trieJava = `static class TrieNode {
  Map<Character, TrieNode> children = new TreeMap<>();
  boolean terminal;
}
static void insert(TrieNode root, String word) {
  TrieNode current = root;
  for (char c : word.toCharArray()) {
    current.children.putIfAbsent(c, new TrieNode());
    current = current.children.get(c); // inserted word
  }
  current.terminal = true;
}
static void collect(TrieNode node, String prefix, List<String> output) {
  if (node.terminal) output.add(prefix);
  for (var entry : node.children.entrySet()) {
    collect(entry.getValue(), prefix + entry.getKey(), output);
  }
}
static List<String> autocomplete(TrieNode root, String prefix) {
  TrieNode current = root;
  for (char c : prefix.toCharArray()) {
    if (!current.children.containsKey(c)) return List.of();
    current = current.children.get(c); // query prefix
  }
  List<String> output = new ArrayList<>();
  collect(current, prefix, output);
  return output;
}`;
for (const insert of [true, false]) define(insert ? 'trie-insert' : 'trie-search', insert ? 'Trie · insert a word' : 'Trie · prefix & autocomplete', {
  category: 'Data structures', kind: 'trie', fields: [text('words', 'Stored words', 'Comma-separated lowercase words · up to 6 words of 7 letters'), text('word', insert ? 'New word' : 'Prefix', 'Lowercase letters · up to 7')], defaults: { words: 'car, cat, cart, dog', word: insert ? 'can' : 'ca' },
  time: { best: 'O(k)', average: 'O(k) path lookup', worst: insert ? 'O(k log σ)' : 'O(k log σ + traversal + output)' }, space: insert ? 'O(k) new nodes' : 'O(height + output)', curves: ['linear'], counter: 'Character edges followed', complexityNote: 'k is query length; σ is alphabet size. The example uses TreeMap child maps (log σ per lookup); with a fixed alphabet this factor is bounded. Autocomplete also visits descendants and builds its output.'
}, trieJava, ({ state: s, emit }, p) => {
  let serial = 0; const root = { id: 'r', ch: '∅', prefix: '', terminal: false, children: {} };
  const add = word => { let node = root; for (const ch of word) { node.children[ch] ||= { id: 'c' + serial++, ch, prefix: node.prefix + ch, terminal: false, children: {} }; node = node.children[ch]; } node.terminal = true; };
  p.words.split(',').map(w => w.trim()).filter(Boolean).forEach(add);
  const update = active => { const nodes = [], edges = []; let x = 0; const place = (node, depth) => { const children = Object.values(node.children).sort((a, b) => a.ch.localeCompare(b.ch)); children.forEach(c => place(c, depth + 1)); const childNodes = nodes.filter(n => children.some(c => c.id === n.id)); const px = childNodes.length ? childNodes.reduce((sum, n) => sum + n.x, 0) / childNodes.length : 35 + x++ * 55; nodes.push({ id: node.id, label: node.ch, x: px, y: 35 + depth * 60, terminal: node.terminal, sub: node.terminal ? 'word' : '' }); children.forEach(c => edges.push({ from: node.id, to: c.id, directed: true })); }; place(root, 0); s.nodes = nodes; s.edges = edges; s.activeNodes = active ? [active.id] : []; };
  update(root); emit(insert ? 'static void insert' : 'static List<String> autocomplete', 'Begin at the empty prefix', 'A double outline marks a complete stored word.', { vars: { query: p.word, prefix: '' } });
  let current = root;
  for (let i = 0; i < p.word.length; i++) {
    const c = p.word[i];
    if (insert) { const exists = !!current.children[c]; current.children[c] ||= { id: 'c' + serial++, ch: c, prefix: current.prefix + c, terminal: false, children: {} }; update(current.children[c]); emit('current.children.putIfAbsent', exists ? `Reuse edge “${c}”` : `Create edge “${c}”`, exists ? 'This prefix already exists.' : 'Allocate the missing prefix node.', { writes: s.writes + (exists ? 0 : 1) }); }
    else { update(current); emit('if (!current.children.containsKey', `Look for edge “${c}”`, current.children[c] ? 'The prefix can continue.' : 'No word follows this prefix.', { vars: { character: c, prefix: current.prefix } }); if (!current.children[c]) { emit('return List.of()', 'Prefix absent', 'There are no suggestions.', { result: [], memory: [] }); return; } }
    current = current.children[c]; update(current); emit(insert ? 'current = current.children.get(c); // inserted word' : 'current = current.children.get(c); // query prefix', `Follow “${c}”`, `The path now spells “${current.prefix}”.`, { count: s.count + 1, vars: { character: c, prefix: current.prefix, terminal: current.terminal } });
  }
  if (insert) { current.terminal = true; update(current); emit('current.terminal =', 'Mark a complete word', `“${p.word}” is now stored, even if the path existed already.`, { result: p.word, writes: s.writes + 1 }); }
  else {
    const output = []; const collect = node => { update(node); if (node.terminal) { output.push(node.prefix); emit('if (node.terminal)', `Suggest “${node.prefix}”`, 'A terminal marker completes this word.', { memory: [...output] }); } for (const child of Object.values(node.children).sort((a, b) => a.ch.localeCompare(b.ch))) { emit('collect(entry.getValue()', 'Explore this prefix subtree', 'Autocomplete visits only descendants of the query prefix.'); collect(child); } }; collect(current); update(current); emit('return output;', 'Suggestions complete', `${output.length} stored word${output.length === 1 ? '' : 's'} share this prefix.`, { result: output, vars: { prefix: p.word, exactWord: current.terminal } });
  }
});
