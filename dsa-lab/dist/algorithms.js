// Every frame is an immutable snapshot tied to an actual line of its Java example.
export const demos = {};
const clone = value => structuredClone(value);
const arrayField = { key: 'values', label: 'Values', type: 'array', hint: 'Comma-separated integers · up to 14 values' };
const numberField = (key, label, min = -999, max = 999) => ({ key, label, type: 'number', min, max });
const textField = (key, label, hint) => ({ key, label, type: 'text', hint });
const arrayDefaults = { values: [12, 7, 24, 3, 18, 9, 15] };

export function define(id, title, options, code, run) {
  demos[id] = {
    id, title, category: 'Algorithms', kind: 'array', fields: [arrayField],
    defaults: clone(arrayDefaults), time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(1)', curves: ['linear'], counter: 'Comparisons', ...options,
    code: code.trim(),
    build(input) {
      const state = { values: [...(input.values || [])], active: [], sorted: [], pointers: {}, vars: {}, count: 0, writes: 0, result: null, ...clone(options.initial || {}) };
      const frames = [];
      const lines = code.trim().split('\n');
      const ctx = {
        state, input,
        emit(match, title, detail, patch = {}) {
          Object.assign(state, patch);
          const line = lines.findIndex(l => l.includes(match));
          if (line < 0) throw new Error(`${id}: no Java statement for ${match}`);
          frames.push(clone({ ...state, line, title, detail }));
        }
      };
      run(ctx, clone(input));
      if (!frames.length) throw new Error(`${id}: empty trace`);
      return { frames, code: code.trim(), result: clone(state.result) };
    }
  };
}

const javaSwap = `static void swap(int[] a, int i, int j) {
  int temp = a[i]; a[i] = a[j]; a[j] = temp;
}`;

define('array-read', 'Read by index', {
  category: 'Data structures', fields: [arrayField, numberField('index', 'Index', 0, 13)],
  defaults: { values: [10, 20, 30, 40, 50], index: 2 },
  time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }, curves: ['constant', 'linear'], counter: 'Reads'
}, `static int read(int[] a, int index) {
  if (index < 0 || index >= a.length)
    throw new IndexOutOfBoundsException();
  return a[index];
}`, ({ state: s, emit }, p) => {
  emit('if (index', 'Check the index', `Index ${p.index} must be inside the array.`, { vars: { index: p.index, length: s.values.length } });
  if (p.index < 0 || p.index >= s.values.length) {
    emit('throw new', 'Index outside the array', 'There is no slot at that position.', { result: 'Invalid index' }); return;
  }
  emit('return a[index]', 'Jump straight to the slot', `Reading index ${p.index} returns ${s.values[p.index]}. No preceding slots are scanned.`, { active: [p.index], count: 1, result: s.values[p.index] });
});

define('linear-search', 'Linear search', {
  fields: [arrayField, numberField('target', 'Target')], defaults: { values: [12, 7, 24, 3, 18, 9, 15], target: 18 },
  time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, curves: ['linear', 'log']
}, `static int linearSearch(int[] a, int target) {
  for (int i = 0; i < a.length; i++) {
    if (a[i] == target) return i;
  }
  return -1;
}`, ({ state: s, emit }, p) => {
  emit('for (int i', 'Begin at the first value', `Look for ${p.target} from left to right.`, { vars: { target: p.target } });
  for (let i = 0; i < s.values.length; i++) {
    emit('if (a[i]', `Compare ${s.values[i]} with ${p.target}`, s.values[i] === p.target ? `They match. Return index ${i}.` : 'No match. Advance to the next slot.', { active: [i], pointers: { i }, count: s.count + 1, vars: { i, target: p.target, 'a[i]': s.values[i] } });
    if (s.values[i] === p.target) { s.result = i; emit('return i', 'Target found', `The matching value is at index ${i}.`, { sorted: [i], result: i }); return; }
  }
  emit('return -1', 'No match', 'Every value has been checked. Return −1.', { active: [], result: -1 });
});

define('binary-search', 'Binary search', {
  fields: [arrayField, numberField('target', 'Target')], defaults: { values: [10, 20, 30, 40, 50, 60, 70], target: 60 }, sortedInput: true,
  time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, curves: ['log', 'linear'], counter: 'Midpoint probes'
}, `static int binarySearch(int[] a, int target) {
  int low = 0, high = a.length - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`, ({ state: s, emit }, p) => {
  let low = 0, high = s.values.length - 1;
  const vars = mid => ({ low, high, ...(mid === undefined ? {} : { mid, 'a[mid]': s.values[mid] }), target: p.target });
  emit('int low', 'Keep the full range', 'Every index is a candidate until a comparison rules it out.', { range: [low, high], pointers: { low, high }, vars: vars() });
  while (low <= high) {
    emit('while (low', 'The range is nonempty', `${low} ≤ ${high}. There is still a candidate to inspect.`, { vars: vars() });
    const mid = low + Math.floor((high - low) / 2);
    emit('int mid', 'Find the middle', `mid = ${low} + (${high} − ${low}) / 2 = ${mid}, using integer division.`, { active: [mid], pointers: { low, mid, high }, vars: vars(mid) });
    emit('if (a[mid] ==', `Compare ${s.values[mid]} with ${p.target}`, s.values[mid] === p.target ? 'The values match. Return this index.' : 'They differ. Use the sorted order to choose a side.', { count: s.count + 1 });
    if (s.values[mid] === p.target) {
      emit('return mid', 'Found it', `${p.target} is at index ${mid}, after ${s.count} midpoint probe${s.count === 1 ? '' : 's'}.`, { result: mid, sorted: [mid] }); return;
    }
    emit('if (a[mid] <', 'Choose the remaining half', `${s.values[mid]} < ${p.target} is ${s.values[mid] < p.target}.`);
    if (s.values[mid] < p.target) { low = mid + 1; emit('low = mid', 'Discard the left half', `All values through index ${mid} are too small. Move low to ${low}.`, { range: [low, high], pointers: { low, high }, active: [], vars: vars() }); }
    else { high = mid - 1; emit('high = mid', 'Discard the right half', `All values from index ${mid} onward are too large. Move high to ${high}.`, { range: [low, high], pointers: { low, high }, active: [], vars: vars() }); }
  }
  emit('return -1', 'The range is empty', `low (${low}) is greater than high (${high}). ${p.target} is absent.`, { result: -1, active: [] });
});

const insertionCode = `static int insert(int[] a, int size, int index, int value) {
  if (size == a.length || index < 0 || index > size)
    throw new IllegalArgumentException();
  for (int j = size; j > index; j--) {
    a[j] = a[j - 1];
  }
  a[index] = value;
  return size + 1;
}`;
for (const ordered of [false, true]) define(ordered ? 'ordered-insert' : 'array-insert', ordered ? 'Ordered insertion' : 'Insert into an array', {
  category: 'Data structures', fields: ordered ? [arrayField, numberField('value', 'New value')] : [arrayField, numberField('index', 'Insert at', 0, 14), numberField('value', 'New value')],
  defaults: { values: [10, 20, 30, 40, 50], index: 2, value: 25 }, sortedInput: ordered,
  time: { best: ordered ? 'O(n)' : 'O(1)', average: 'O(n)', worst: 'O(n)' }, curves: ['linear'], counter: 'Shifts'
}, ordered ? `static int orderedInsert(int[] a, int size, int value) {
  int index = 0;
  while (index < size && a[index] <= value) index++;
  return insert(a, size, index, value);
}
${insertionCode}` : insertionCode, ({ state: s, emit }, p) => {
  const size = s.values.length;
  let index = p.index;
  emit(ordered ? 'int index' : 'if (size', ordered ? 'Locate the insertion point' : 'Check the insertion point', 'The backing array has one spare slot; size counts the logical values.', { vars: { size, value: p.value, capacity: size + 1 } });
  if (ordered) { index = 0; while (index < size && s.values[index] <= p.value) { emit('while (index', `Inspect index ${index}`, `${s.values[index]} ≤ ${p.value}; the new value belongs farther right.`, { active: [index], vars: { index, value: p.value, size } }); index++; } }
  if (index < 0 || index > size) { emit('throw new', 'Invalid insertion index', `Use an index from 0 through ${size}.`, { result: 'Invalid index' }); return; }
  s.values.push(null);
  for (let j = size; j > index; j--) { s.values[j] = s.values[j - 1]; emit('a[j] =', 'Shift one value right', `Copy ${s.values[j]} from index ${j - 1} to ${j}.`, { active: [j - 1, j], gap: j - 1, count: s.count + 1, writes: s.writes + 1, pointers: { j }, vars: { index, j, value: p.value, size } }); }
  s.values[index] = p.value;
  emit('a[index] =', 'Fill the gap', `Store ${p.value} at index ${index}.`, { active: [index], gap: null, writes: s.writes + 1 });
  emit('return size +', 'Logical size increases', `There are now ${size + 1} values.`, { result: [...s.values], vars: { size: size + 1, index, value: p.value } });
});

define('array-delete', 'Delete from an array', { category: 'Data structures', fields: [arrayField, numberField('index', 'Delete index', 0, 13)], defaults: { values: [10, 20, 30, 40, 50], index: 1 }, time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }, counter: 'Shifts' }, `static int delete(int[] a, int size, int index) {
  if (index < 0 || index >= size)
    throw new IndexOutOfBoundsException();
  for (int j = index; j < size - 1; j++) {
    a[j] = a[j + 1];
  }
  a[size - 1] = 0;
  return size - 1;
}`, ({ state: s, emit }, p) => {
  const size = s.values.length;
  emit('if (index', 'Check the deletion index', `There are ${size} logical values.`, { vars: { size, index: p.index } });
  if (p.index < 0 || p.index >= size) { emit('throw new', 'Invalid index', 'Choose an existing slot.', { result: 'Invalid index' }); return; }
  for (let j = p.index; j < size - 1; j++) { s.values[j] = s.values[j + 1]; emit('a[j] =', 'Close the gap', `Move ${s.values[j]} from ${j + 1} to ${j}.`, { count: s.count + 1, writes: s.writes + 1, active: [j, j + 1], gap: j + 1, vars: { size, index: p.index, j } }); }
  s.values.pop(); emit('a[size - 1]', 'Clear the unused slot', 'The old last slot is no longer part of the logical sequence.', { gap: null, active: [], writes: s.writes + 1 });
  emit('return size -', 'Logical size decreases', `There are now ${s.values.length} values.`, { result: [...s.values], vars: { size: s.values.length } });
});

define('set-insert', 'Insert into an array-backed set', { category: 'Data structures', fields: [arrayField, numberField('value', 'New value')], defaults: { values: [10, 20, 30, 40], value: 30 }, counter: 'Equality checks' }, `static boolean addUnique(List<Integer> values, int value) {
  for (int existing : values) {
    if (existing == value) return false;
  }
  values.add(value);
  return true;
}`, ({ state: s, emit }, p) => {
  // In this Java loop, existing is primitive int, so == is numeric equality.
  s.values = [...new Set(s.values)];
  emit('for (int existing', 'Check uniqueness first', 'This teaching set is backed by a list, so membership requires a scan.', { vars: { value: p.value } });
  for (let i = 0; i < s.values.length; i++) { emit('if (existing', `Check ${s.values[i]}`, s.values[i] === p.value ? 'The value already exists. Reject this insertion.' : 'This is a different value.', { active: [i], count: s.count + 1, vars: { existing: s.values[i], value: p.value }, ...(s.values[i] === p.value ? { result: false } : {}) }); if (s.values[i] === p.value) return; }
  s.values.push(p.value); emit('values.add', 'Add a new unique value', 'No duplicate was found.', { active: [s.values.length - 1], writes: 1 }); emit('return true', 'Insertion accepted', 'The uniqueness rule is preserved.', { result: true });
});

define('bubble-sort', 'Bubble sort', { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, curves: ['quadratic', 'linear'] }, `static void bubbleSort(int[] a) {
  for (int end = a.length - 1; end > 0; end--) {
    boolean swapped = false;
    for (int j = 0; j < end; j++) {
      if (a[j] > a[j + 1]) {
        swap(a, j, j + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}
${javaSwap}`, ({ state: s, emit }) => {
  emit('for (int end', 'Begin with the full array', 'Each pass fixes the largest remaining value at the right edge.');
  for (let end = s.values.length - 1; end > 0; end--) {
    let swapped = false;
    emit('boolean swapped', 'Start a new pass', 'Reset the flag. A pass without swaps means the array is sorted.', { active: [], vars: { end, swapped }, range: [0, end] });
    for (let j = 0; j < end; j++) {
      emit('if (a[j] >', 'Compare neighbors', `${s.values[j]} > ${s.values[j + 1]} is ${s.values[j] > s.values[j + 1]}.`, { active: [j, j + 1], pointers: { j }, count: s.count + 1, vars: { end, j, swapped } });
      if (s.values[j] > s.values[j + 1]) {
        [s.values[j], s.values[j + 1]] = [s.values[j + 1], s.values[j]];
        emit('swap(a, j', 'Swap the neighbors', 'The larger value moves one position toward the right.', { writes: s.writes + 1, event: 'swap' }); swapped = true;
        emit('swapped = true', 'Remember the repair', 'At least one pair was out of order in this pass.', { vars: { end, j, swapped }, event: '' });
      }
    }
    s.sorted.push(end);
    emit('if (!swapped)', swapped ? 'This maximum is final' : 'No swaps: finish early', swapped ? `Index ${end} is now sorted.` : 'Every neighboring pair was already ordered.', { active: [], vars: { end, swapped } });
    if (!swapped) break;
  }
  emit('if (!swapped)', 'Array sorted', 'The complete sequence is in ascending order.', { active: [], range: null, pointers: {}, sorted: s.values.map((_, i) => i), result: [...s.values] });
});

define('selection-sort', 'Selection sort', { time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }, curves: ['quadratic'] }, `static void selectionSort(int[] a) {
  for (int start = 0; start < a.length - 1; start++) {
    int min = start;
    for (int j = start + 1; j < a.length; j++) {
      if (a[j] < a[min]) min = j;
    }
    if (min != start) swap(a, start, min);
  }
}
${javaSwap}`, ({ state: s, emit }) => {
  emit('for (int start', 'Grow a sorted prefix', 'Find the smallest value in each remaining suffix.');
  for (let start = 0; start < s.values.length - 1; start++) {
    let min = start; emit('int min', 'Assume the first candidate is smallest', `Begin the scan at index ${start}.`, { active: [start], pointers: { min }, vars: { start, min } });
    for (let j = start + 1; j < s.values.length; j++) {
      const smaller = s.values[j] < s.values[min];
      emit('if (a[j] <', 'Compare with the current minimum', `${s.values[j]} < ${s.values[min]} is ${smaller}.${smaller ? ' Update min to ' + j + '.' : ''}`, { active: [j, min], count: s.count + 1, pointers: { min, j }, vars: { start, min: smaller ? j : min, j } }); if (smaller) min = j;
    }
    if (min !== start) { [s.values[start], s.values[min]] = [s.values[min], s.values[start]]; s.writes++; }
    s.sorted.push(start); emit('if (min !=', 'Place the minimum', `Index ${start} now holds its final value.`, { active: [start, min], pointers: {}, vars: { start, min }, event: 'swap' });
  }
  emit('if (min !=', 'Array sorted', 'The last remaining value is also final.', { sorted: s.values.map((_, i) => i), active: [], event: '', result: [...s.values] });
});

define('insertion-sort', 'Insertion sort', { time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' }, curves: ['quadratic', 'linear'], counter: 'Key comparisons', writeLabel: 'Writes' }, `static void insertionSort(int[] a) {
  for (int i = 1; i < a.length; i++) {
    int key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
}`, ({ state: s, emit }) => {
  emit('for (int i', 'A one-value prefix is already sorted', 'Insert each later value into that prefix.', { sorted: s.values.length ? [0] : [] });
  for (let i = 1; i < s.values.length; i++) {
    const key = s.values[i]; let j = i - 1;
    emit('int key', 'Hold the next value', `Save ${key} outside the array while making room.`, { held: key, gap: i, active: [i], vars: { i, j, key } });
    while (j >= 0) {
      emit('while (j >=', 'Compare the key with its left neighbor', `${s.values[j]} > ${key} is ${s.values[j] > key}.`, { active: [j], count: s.count + 1, pointers: { j }, vars: { i, j, key } }); if (s.values[j] <= key) break;
      s.values[j + 1] = s.values[j]; emit('a[j + 1] = a[j]', 'Shift the larger value right', 'The temporary key remains safe outside the array.', { active: [j, j + 1], gap: j, writes: s.writes + 1 });
      j--; emit('j--;', 'Move left', 'Continue inside the sorted prefix.', { vars: { i, j, key }, pointers: { j } });
    }
    s.values[j + 1] = key; emit('a[j + 1] = key', 'Insert the held key', `Place ${key} in slot ${j + 1}. The prefix through ${i} is sorted.`, { gap: null, held: null, active: [j + 1], sorted: Array.from({ length: i + 1 }, (_, k) => k), writes: s.writes + 1 });
  }
  emit('a[j + 1] = key', 'Array sorted', 'All values are part of the sorted prefix.', { active: [], pointers: {}, result: [...s.values] });
});

define('duplicates', 'Duplicate check · pair scan', { defaults: { values: [4, 8, 2, 7, 8, 3] }, time: { best: 'O(1)', average: 'O(n²)', worst: 'O(n²)' }, curves: ['quadratic', 'linear'] }, `static boolean hasDuplicate(int[] a) {
  for (int i = 0; i < a.length; i++) {
    for (int j = i + 1; j < a.length; j++) {
      if (a[i] == a[j]) return true;
    }
  }
  return false;
}`, ({ state: s, emit }) => {
  emit('for (int i', 'Inspect distinct pairs', 'Compare each value only with values after it.');
  for (let i = 0; i < s.values.length; i++) for (let j = i + 1; j < s.values.length; j++) {
    emit('if (a[i]', 'Check a pair', `${s.values[i]} == ${s.values[j]} is ${s.values[i] === s.values[j]}.`, { active: [i, j], count: s.count + 1, pointers: { i, j }, vars: { i, j } });
    if (s.values[i] === s.values[j]) { emit('return true', 'Duplicate found', `The same value occurs at indices ${i} and ${j}.`, { sorted: [i, j], result: true }); return; }
  }
  emit('return false', 'All values are distinct', 'No pair matched.', { result: false, active: [], pointers: {} });
});

define('hash-duplicates', 'Duplicate check · hash set', { defaults: { values: [4, 8, 2, 7, 8, 3] }, time: { best: 'O(1)', average: 'O(n) expected', worst: 'Hash-dependent' }, space: 'O(n)', curves: ['linear', 'quadratic'], counter: 'Membership checks' }, `static boolean hasDuplicate(int[] a) {
  Set<Integer> seen = new HashSet<>();
  for (int i = 0; i < a.length; i++) {
    if (seen.contains(a[i])) return true;
    seen.add(a[i]);
  }
  return false;
}`, ({ state: s, emit }) => {
  const seen = new Set(); emit('Set<Integer>', 'Remember what has been seen', 'An empty set begins the scan.', { memory: [] });
  for (let i = 0; i < s.values.length; i++) {
    emit('if (seen.contains', 'Look up the current value', `Has ${s.values[i]} appeared before? ${seen.has(s.values[i]) ? 'Yes.' : 'No.'}`, { active: [i], count: s.count + 1, vars: { i, value: s.values[i], 'seen.size': seen.size } });
    if (seen.has(s.values[i])) { emit('return true', 'Duplicate found', `${s.values[i]} is already in the set.`, { result: true, sorted: [i] }); return; }
    seen.add(s.values[i]); emit('seen.add', 'Remember this value', `Add ${s.values[i]} to the set.`, { memory: [...seen], writes: s.writes + 1 });
  }
  emit('return false', 'No duplicates', 'Each value was new when it was visited.', { result: false, active: [] });
});

define('mean', 'Mean of even numbers', { counter: 'Values inspected' }, `static OptionalDouble evenMean(int[] a) {
  long sum = 0;
  int count = 0;
  for (int value : a) {
    if (value % 2 == 0) {
      sum += value;
      count++;
    }
  }
  return count == 0 ? OptionalDouble.empty()
      : OptionalDouble.of((double) sum / count);
}`, ({ state: s, emit }) => {
  let sum = 0, count = 0; emit('long sum', 'Initialize the accumulators', 'Keep a running sum and count of even values.', { vars: { sum, count } });
  s.values.forEach((value, i) => { emit('if (value %', 'Is this value even?', `${value} % 2 == 0 is ${value % 2 === 0}.`, { active: [i], count: s.count + 1, vars: { value, sum, count } }); if (value % 2 === 0) { sum += value; emit('sum +=', 'Add to the sum', `The sum becomes ${sum}.`, { vars: { value, sum, count } }); count++; emit('count++;', 'Count the even value', `There are now ${count} even values.`, { vars: { value, sum, count } }); } });
  emit('return count ==', count ? 'Compute the mean' : 'No even values', count ? `${sum} / ${count} = ${sum / count}.` : 'Return an empty OptionalDouble; division by zero is avoided.', { active: [], result: count ? sum / count : 'No even values' });
});

define('word-builder', 'Build every ordered pair', { defaults: { values: [1, 2, 3, 4] }, time: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }, space: 'O(n²) output', curves: ['quadratic', 'linear'], counter: 'Pairs emitted' }, `static List<String> pairs(int[] a) {
  List<String> output = new ArrayList<>();
  for (int i = 0; i < a.length; i++) {
    for (int j = 0; j < a.length; j++) {
      output.add(a[i] + ":" + a[j]);
    }
  }
  return output;
}`, ({ state: s, emit }) => {
  const output = []; emit('List<String>', 'Prepare the output', 'Every ordered pair is included, including pairs with the same index.', { memory: [] });
  for (let i = 0; i < s.values.length; i++) for (let j = 0; j < s.values.length; j++) { output.push(`${s.values[i]}:${s.values[j]}`); emit('output.add', 'Emit one pair', `Pair index ${i} with index ${j}.`, { active: [i, j], pointers: { i, j }, vars: { i, j, 'output.size': output.length }, count: output.length, memory: [...output] }); }
  emit('return output', 'All pairs produced', `${s.values.length} × ${s.values.length} = ${output.length} pairs.`, { result: output, active: [], pointers: {} });
});

const partitionCode = `static int partition(int[] a, int low, int high) {
  int pivot = a[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (a[j] <= pivot) {
      i++;
      if (i != j) swap(a, i, j);
    }
  }
  if (i + 1 != high) swap(a, i + 1, high);
  return i + 1;
}
${javaSwap}`;

function partitionTrace(ctx, low, high, depth) {
  const { state: s, emit } = ctx; const pivot = s.values[high]; let i = low - 1;
  emit('int pivot', `Choose pivot ${pivot}`, `Partition only indices ${low} through ${high}.`, { range: [low, high], active: [high], pointers: { pivot: high }, vars: { low, high, pivot, depth }, depth });
  emit('int i = low', 'Begin with an empty left region', `i starts at ${i}.`, { vars: { low, high, pivot, i, depth } });
  for (let j = low; j < high; j++) {
    emit('if (a[j] <=', 'Compare with the pivot', `${s.values[j]} ≤ ${pivot} is ${s.values[j] <= pivot}.`, { active: [j, high], count: s.count + 1, pointers: { i, j, pivot: high }, vars: { low, high, pivot, i, j, depth } });
    if (s.values[j] <= pivot) {
      i++; emit('i++;', 'Grow the left partition', `Indices ${low} through ${i} will contain values ≤ ${pivot}.`, { pointers: { i, j, pivot: high }, vars: { low, high, pivot, i, j, depth } });
      if (i !== j) { [s.values[i], s.values[j]] = [s.values[j], s.values[i]]; s.writes++; }
      emit('if (i != j)', i === j ? 'Already in the correct region' : 'Move into the left region', i === j ? 'No data movement is needed.' : `Swap slots ${i} and ${j}.`, { active: [i, j], event: i === j ? '' : 'swap' });
    }
  }
  const pos = i + 1;
  if (pos !== high) { [s.values[pos], s.values[high]] = [s.values[high], s.values[pos]]; s.writes++; }
  emit('if (i + 1 !=', 'Place the pivot', `Pivot ${pivot} belongs at index ${pos}.`, { active: [pos, high], event: 'swap', pointers: { pivot: pos } });
  emit('return i + 1', 'Partition complete', 'Every value on the left is ≤ pivot; every value on the right is larger.', { event: '', vars: { low, high, pivot, position: pos, depth } }); return pos;
}

define('quick-sort', 'Quicksort', { time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n) balanced · O(n) worst', curves: ['nlog', 'quadratic'] }, `static void quicksort(int[] a, int low, int high) {
  if (low >= high) return;
  int p = partition(a, low, high);
  quicksort(a, low, p - 1);
  quicksort(a, p + 1, high);
}
${partitionCode}`, ctx => {
  const { state: s, emit } = ctx;
  function sort(low, high, depth) {
    emit('if (low >=', 'Check this recursive range', `Range [${low}, ${high}] ${low >= high ? 'needs no partition.' : 'contains more than one value.'}`, { range: [low, high], active: [], vars: { low, high, depth } });
    if (low >= high) { if (low === high) s.sorted.push(low); return; }
    const p = partitionTrace(ctx, low, high, depth); s.sorted.push(p);
    emit('quicksort(a, low', 'Recurse into the left side', `The pivot at ${p} stays fixed.`, { active: [], pointers: {} }); sort(low, p - 1, depth + 1);
    emit('quicksort(a, p +', 'Recurse into the right side', `Now handle indices ${p + 1} through ${high}.`, { active: [], pointers: {}, vars: { low, high, p, depth } }); sort(p + 1, high, depth + 1);
  }
  sort(0, s.values.length - 1, 0); emit('if (low >=', 'Array sorted', 'All recursive ranges are complete.', { result: [...s.values], active: [], range: null, pointers: {}, sorted: s.values.map((_, i) => i) });
});

define('quick-select', 'Quickselect', { fields: [arrayField, numberField('rank', 'Rank k (zero-based)', 0, 13)], defaults: { ...arrayDefaults, rank: 3 }, time: { best: 'O(n)', average: 'O(n) with suitable pivots', worst: 'O(n²)' }, curves: ['linear', 'quadratic'] }, `static int quickselect(int[] a, int k) {
  if (k < 0 || k >= a.length) throw new IllegalArgumentException();
  int low = 0, high = a.length - 1;
  while (low <= high) {
    int p = partition(a, low, high);
    if (p == k) return a[p];
    if (k < p) high = p - 1;
    else low = p + 1;
  }
  throw new IllegalStateException();
}
${partitionCode}`, ctx => {
  const { state: s, emit } = ctx; const p = ctx.input; // assigned below by wrapper
  const k = p.rank;
  if (k < 0 || k >= s.values.length) { emit('if (k <', 'Invalid rank', 'Choose an existing zero-based rank.', { result: 'Invalid rank' }); return; }
  let low = 0, high = s.values.length - 1; emit('int low', 'Locate one rank', `Find the value that would occupy sorted index ${k}.`, { vars: { k, low, high } });
  while (low <= high) { const pos = partitionTrace(ctx, low, high, 0); if (pos === k) { emit('if (p == k)', 'Requested rank found', `Sorted index ${k} contains ${s.values[pos]}. Other regions need not be sorted.`, { result: s.values[pos], sorted: [pos], active: [pos], pointers: { k: pos } }); return; } if (k < pos) { high = pos - 1; emit('if (k < p)', 'Continue left only', `Rank ${k} lies before pivot index ${pos}.`, { range: [low, high], vars: { k, low, high, p: pos } }); } else { low = pos + 1; emit('else low =', 'Continue right only', `Rank ${k} lies after pivot index ${pos}.`, { range: [low, high], vars: { k, low, high, p: pos } }); } }
});

// Supply parsed input to all builders through both supported access patterns.
