// Original Java teaching notes, organized against the supplied book's contents.
// Each topic ID resolves to a runnable demonstration in algorithms.js.
const section = (title, ...paragraphs) => ({ title, paragraphs });
export const chapters = [
  {
    id: 1, title: 'Why Data Structures Matter', short: 'Arrays & sets', group: 'Foundations', pages: '1–19',
    intro: 'The same data can be organized in different ways. That choice changes how much work reading, searching, inserting, and deleting require.',
    topics: ['array-read', 'linear-search', 'array-insert', 'array-delete', 'set-insert'],
    sections: [
      section('Start with the operations', 'A data structure is a way to organize information; an algorithm is a procedure that acts on it. Choose a structure by asking which operations your program performs most often. A shopping list and a dictionary both store items, but their access patterns differ.'),
      section('Why an index is fast', 'An array stores elements in numbered slots. Given a valid index, the runtime can locate the slot directly: it does not search the preceding values. Reading a slot takes O(1). Finding a value without knowing its index can require checking all n slots: O(n).'),
      section('Making room and closing gaps', 'Inserting at the start of a logical sequence requires shifting existing elements right. Deleting near the start requires shifting later elements left. These operations take O(n) in the worst case. Appending is cheap when capacity already exists; resizing a dynamic array occasionally copies its contents.'),
      section('A set adds a rule', 'A set contains unique values. An array-backed set may need to search before inserting to avoid a duplicate. Java’s HashSet uses hashing instead, giving expected constant-time membership and insertion under suitable hashing. Uniqueness alone does not specify an implementation.')
    ],
    takeaway: 'Knowing a position and finding a value are different tasks.',
    javaNote: 'Java int[] has a fixed length. The insertion and deletion demos use spare capacity plus a logical size. ArrayList<Integer> grows dynamically; its indexed insertions still shift elements.',
    pitfalls: ['An index must be between 0 and length − 1.', 'A null array reference differs from an empty array.', 'ArrayList<Integer> stores boxed integers, unlike int[].'],
    exercise: 'Insert 25 at index 1 in [10, 20, 30, 40]. Which elements must move? Then insert at the end and compare the work.'
  },
  {
    id: 2, title: 'Why Algorithms Matter', short: 'Searching', group: 'Foundations', pages: '21–34',
    intro: 'Two algorithms can solve the same problem with very different amounts of work. Sorted data gives us an especially useful shortcut.',
    topics: ['binary-search', 'linear-search', 'ordered-insert'],
    sections: [
      section('An ordered array creates an opportunity', 'An ascending array maintains the rule a[i] ≤ a[i + 1]. Linear search can stop when it encounters a value larger than the target, but its worst case remains O(n). Insertion must preserve the order and can still shift O(n) elements.'),
      section('Binary search keeps a possible range', 'Start with low = 0 and high = length − 1. The invariant is: if the target exists, at least one occurrence is inside the inclusive range [low, high]. Compute mid = low + (high − low) / 2 and compare a[mid] with the target.'),
      section('Why discarding half is safe', 'If a[mid] is smaller than the target, every value at or left of mid is also too small. Set low = mid + 1. If a[mid] is larger, set high = mid − 1. Equality finishes the search. When low exceeds high, no candidates remain and the result is −1.'),
      section('What logarithmic work means', 'Each unsuccessful iteration removes at least half of the candidates. A nonempty array of n values needs at most floor(log₂ n) + 1 midpoint probes in the worst case. Best case is one probe; worst-case time is O(log n). The iterative version uses O(1) extra space.')
    ],
    takeaway: 'Every eliminated value must be ruled out by the sorted-order invariant.',
    javaNote: 'Integer division chooses the lower midpoint for nonnegative indices. The expression low + (high − low) / 2 avoids the overflow risk of (low + high) / 2. The simulator uses ascending integers and validates their order.',
    pitfalls: ['Binary search requires sorted input and efficient indexed access.', 'A search with duplicates can return any matching index.', 'Use mid + 1 and mid − 1 so the range actually shrinks.'],
    exercise: 'Search for 35 in [10, 20, 30, 40, 50, 60, 70]. Explain the final empty range, then try the first and last values.'
  },
  {
    id: 3, title: 'O Yes! Big O Notation', short: 'Big-O notation', group: 'Foundations', pages: '35–45',
    intro: 'Big-O describes how resource use grows with input size. It helps us reason beyond one machine, one timing measurement, or one example.',
    topics: ['array-read', 'linear-search', 'binary-search', 'array-sum', 'prime', 'leap-year', 'word-builder'],
    sections: [
      section('Choose the input size', 'First say what n represents: the number of array elements, the length of a string, or the number of vertices. Different independent inputs may need different symbols. Scanning arrays of lengths n and m takes O(n + m), not automatically O(n).'),
      section('Count work, then describe its growth', 'Five fixed operations are O(1). Visiting every element a fixed number of times is O(n). Considering every ordered pair is O(n²). Halving a search interval produces O(log n). An exact operation count is useful evidence, but Big-O summarizes the growth category.'),
      section('Drop constants and smaller terms', 'If a count is 3n + 8, the linear term eventually dominates the constant. If it is n² + 4n, the quadratic term dominates. These become O(n) and O(n²). Two algorithms in the same category can still differ significantly in actual work.'),
      section('Name the case and the resource', 'Big-O is an asymptotic upper bound; it does not itself mean “worst case.” We normally state a worst-case time bound unless another case is labeled. Best-case, average-case, expected, and amortized bounds answer different questions. Space complexity describes memory growth separately.')
    ],
    takeaway: 'A growth curve is a model of scaling, not a stopwatch.',
    javaNote: 'A loop body is not always O(1): String concatenation and Arrays.copyOfRange can copy data. Include these costs when analyzing Java code.',
    pitfalls: ['Nested loops are not always quadratic: check their bounds.', 'An expected bound relies on assumptions about the implementation or input.', 'A smaller Big-O need not win on every small input.'],
    exercise: 'Classify 100, 4n + 6, n² + n, and the number of times n can be halved before reaching 1.'
  },
  {
    id: 4, title: 'Speeding Up Your Code with Big O', short: 'Bubble sort & duplicates', group: 'Foundations', pages: '47–60',
    intro: 'Spot repeated work, measure it, and look for a better way to answer the same question.',
    topics: ['bubble-sort', 'duplicates', 'hash-duplicates'],
    sections: [
      section('Bubble sort makes local repairs', 'Compare neighboring values and swap them if the left one is larger. After one full left-to-right pass, the maximum remaining value is at the right edge. Later passes can skip the suffix already in its final position.'),
      section('The sorted suffix is an invariant', 'After k passes, the last k values are final. With n values, at most (n − 1) + (n − 2) + … + 1 neighbor comparisons are needed. This sum is n(n − 1)/2, so worst-case and average-case time are O(n²).'),
      section('An early exit changes the best case', 'If a pass makes no swaps, the entire array is sorted and we can stop. The version in this lab uses that flag, giving O(n) best-case time. It swaps only strictly out-of-order values, preserving the order of equal values: the sort is stable.'),
      section('Duplicate checking reveals a trade-off', 'Comparing every distinct pair uses O(n²) worst-case time and O(1) extra space. Remembering previously seen values in a HashSet gives expected O(n) time and O(n) extra space. A direct boolean-index table needs a known, suitably small value range; HashSet handles arbitrary integer keys.')
    ],
    takeaway: 'Reducing repeated searches can change the entire growth category.',
    javaNote: 'HashSet.add returns false when a value is already present. Its expected constant-time operations assume well-distributed hashes; this is not a universal worst-case guarantee.',
    pitfalls: ['Quadratic growth is not exponential growth.', 'Count comparisons separately from swaps.', 'The early-exit flag must reset at the start of every pass.'],
    exercise: 'Run bubble sort on sorted and reversed versions of the same array. Why do the comparison counts differ?'
  },
  {
    id: 5, title: 'Optimizing Code With and Without Big O', short: 'Selection sort', group: 'Foundations', pages: '63–76',
    intro: 'Algorithms with the same Big-O can do different amounts of work. Selection sort saves writes by delaying the swap.',
    topics: ['selection-sort', 'bubble-sort'],
    sections: [
      section('Find first, swap once', 'For each position start, scan the remaining suffix to find the smallest value. Swap that minimum into start, then move the boundary right. The prefix before start is sorted and contains the smallest values in their final positions.'),
      section('Comparisons remain quadratic', 'The scans require (n − 1) + (n − 2) + … + 1 comparisons regardless of initial order. Best, average, and worst-case time are O(n²). At most n − 1 actual swaps are needed; this lab skips swapping an element with itself.'),
      section('Constant factors still matter', 'Selection sort and bubble sort share a quadratic worst-case bound. Selection sort can make far fewer writes. This may matter when writes are expensive, even though it does not change the asymptotic category.'),
      section('Stability is a separate property', 'A long-distance swap can reverse the order of equal keys. Standard selection sort is therefore not stable. Its iterative, in-place implementation uses O(1) auxiliary space.')
    ],
    takeaway: 'Big-O groups growth rates; it does not erase meaningful operation costs.',
    javaNote: 'Track the index of the minimum, then swap int values after the scan. Do not swap every time a new minimum is discovered.',
    pitfalls: ['An already sorted array still needs the full comparison scan.', 'A self-swap need not count as a data movement.', 'In-place and stable describe different properties.'],
    exercise: 'Compare selection sort and bubble sort on [5, 4, 3, 2, 1]. Count comparisons and swaps separately.'
  },
  {
    id: 6, title: 'Optimizing for Optimistic Scenarios', short: 'Insertion sort', group: 'Foundations', pages: '79–93',
    intro: 'The arrangement of the input can matter as much as its size. Insertion sort takes advantage of order that is already present.',
    topics: ['insertion-sort'],
    sections: [
      section('Grow a sorted prefix', 'Save the next value as key. Shift larger values in the sorted prefix one position right, then put key into the resulting gap. At the beginning of each outer iteration, every value before i is already sorted.'),
      section('A held value explains the gap', 'The key is safe in a temporary variable while values move. During shifting, the array may briefly contain duplicate values because one occurrence represents a gap, not another logical item. The animation labels the held key and gap explicitly.'),
      section('Best, average, and worst cases', 'Sorted input needs about one unsuccessful key comparison per insertion: O(n). Reversed input shifts the whole prefix each time: O(n²). Average random input is also O(n²). More precisely, the number of shifts equals the number of inversions in the input.'),
      section('When it is useful', 'Insertion sort is simple, uses O(1) auxiliary space, and works well on small or nearly sorted sequences. Shifting only values strictly greater than key makes it stable. It is often useful as a small-partition component inside larger sorting strategies.')
    ],
    takeaway: 'Nearly sorted data can need very little repair.',
    javaNote: 'Check j >= 0 before accessing a[j]. Java evaluates && from left to right and short-circuits, so this order prevents an invalid negative index.',
    pitfalls: ['Save key before shifting or its original value may be overwritten.', 'Use > rather than >= to preserve stability.', 'A shift is a write, not a swap.'],
    exercise: 'Compare [1, 2, 3, 5, 4] with [5, 4, 3, 2, 1]. Which values actually move?'
  },
  {
    id: 7, title: 'Big O in Everyday Code', short: 'Analyze everyday code', group: 'Foundations', pages: '95–108',
    intro: 'Read the actual work in the code. Loop nesting, output size, library calls, and independent input sizes all influence the answer.',
    topics: ['mean', 'word-builder'],
    sections: [
      section('Mean of even values', 'Visit each value once. If it is even, add it to a running sum and increment a count. Divide only after the scan. Each element triggers a bounded amount of work, so time is O(n), with O(1) extra space. If no even values exist, return an explicit empty result rather than divide by zero.'),
      section('Pair construction', 'An outer loop over n elements and an inner loop over n elements creates n² ordered pairs. Excluding equal indices gives n(n − 1), which remains quadratic. Storing the output also needs quadratic space; merely displaying pairs one at a time need not.'),
      section('Use the bounds, not the appearance', 'A loop with a fixed bound such as 10 is O(1). Two consecutive n-length loops are O(n). A nested traversal of two independent arrays is O(nm). A palindrome scan moves two pointers inward and examines each position at most once: O(n).'),
      section('Output and hidden work', 'Enumerating all products of distinct pairs has quadratic output. Generating all fixed-length passwords over an alphabet grows exponentially in password length. Repeated Java String concatenation may copy an ever-growing prefix; StringBuilder can avoid that repeated copying.')
    ],
    takeaway: 'Define n, identify repeated work, include output costs, then simplify.',
    javaNote: 'Use a long accumulator when summing int values and a double division for a fractional mean. OptionalDouble can represent the absence of a mean.',
    pitfalls: ['A return inside a loop can change best-case work.', 'Input size is not always the numeric value of an input.', 'Do not omit allocations made by library methods.'],
    exercise: 'What changes if the inner loop begins at i + 1? Does the growth category change?'
  },
  {
    id: 8, title: 'Blazing Fast Lookup with Hash Tables', short: 'Hash tables', group: 'Structures & recursion', pages: '113–131',
    intro: 'A hash table turns a key into a place to look. Fast lookup depends on both the hash function and how collisions are handled.',
    topics: ['hash-map', 'hash-duplicates'],
    sections: [
      section('Keys lead to buckets', 'A hash function turns a key into a hash value; a table maps that value to a bucket index. Looking up the key visits its bucket and checks key equality. Keys need not be integers: names, words, and application IDs can all work.'),
      section('A collision is normal', 'Different keys can map to the same bucket. With separate chaining, a bucket holds multiple entries. We compare the actual keys to distinguish them. Updating an existing key replaces its value rather than adding a second mapping.'),
      section('Load factor and resizing', 'The ratio of entries to buckets is the load factor. As it grows, buckets tend to get longer. Resizing allocates a bigger table and redistributes entries, costing O(n) for that resize. Expected and amortized analyses explain why typical individual operations remain cheap.'),
      section('Lookup as an index', 'Building a hash-based index can replace repeated full scans. A thesaurus maps a word to its synonyms; a frequency map counts occurrences. A set remembers membership only. The right structure depends on what must be retrieved, not just what must be stored.')
    ],
    takeaway: 'Hashing narrows the search; equality confirms the key.',
    javaNote: 'Java HashMap uses hashCode and equals, supports a null key, and has no promised iteration order. This lab uses floorMod(integerKey, 7) and separate chaining for a transparent teaching model; it does not claim to expose Java HashMap internals.',
    pitfalls: ['Average O(1) is not an unconditional worst-case bound.', 'Mutating a key in a way that changes its hash can break lookup.', 'A collision does not mean two keys are equal.'],
    exercise: 'Insert keys 10, 17, and 24 into seven buckets. Why must a lookup compare keys inside bucket 3?'
  },
  {
    id: 9, title: 'Crafting Elegant Code with Stacks and Queues', short: 'Stacks & queues', group: 'Structures & recursion', pages: '133–147',
    intro: 'Restricting how a sequence is accessed makes it easier to express the order in which work should happen.',
    topics: ['stack', 'queue', 'brackets'],
    sections: [
      section('The stack: last in, first out', 'Push adds to the top, peek inspects the top, and pop removes it. The most recently added value leaves first. Undo histories, expression processing, and function calls naturally use this order.'),
      section('The queue: first in, first out', 'Enqueue adds at the back; dequeue removes from the front. Print jobs and breadth-first graph exploration process work in arrival order. A queue should not shift every remaining element on removal: a linked or circular implementation avoids that cost.'),
      section('Behavior is separate from storage', 'Stacks and queues are abstract data types: their rules specify what operations do. An array, linked list, or deque can implement those rules with different performance and capacity behavior.'),
      section('Matching brackets', 'Push each opening bracket. On a closing bracket, the top must be its matching opener. An empty stack at a closing bracket is an error; remaining openers after the scan are also an error. Nesting depth determines the maximum stack size.')
    ],
    takeaway: 'The restriction is useful: it makes processing order explicit.',
    javaNote: 'Prefer Deque<Integer> backed by ArrayDeque for a modern Java stack or queue. Use push/pop/peek for a stack and addLast/pollFirst for a queue. ArrayDeque rejects null; most endpoint operations are amortized O(1).',
    pitfalls: ['Popping an empty stack requires defined error handling.', 'Stack is a legacy Java class; a stack ADT is a broader concept.', 'FIFO is about removal order, not the visual orientation.'],
    exercise: 'Enqueue 3, 8, 5, then remove twice. Repeat with a stack and compare the results.'
  },
  {
    id: 10, title: 'Recursively Recurse with Recursion', short: 'Recursion', group: 'Structures & recursion', pages: '149–159',
    intro: 'A recursive call solves a smaller version of the same problem. Every suspended call waits for its child to return.',
    topics: ['countdown', 'factorial', 'directory'],
    sections: [
      section('Base case and progress', 'A recursive function needs a stopping condition and a step that moves toward it. Countdown stops at zero and calls itself with n − 1. Without either part, execution keeps creating calls until the runtime runs out of stack space.'),
      section('Follow the call stack', 'Each invocation has its own parameters, local variables, and return location. In factorial(n), multiplication waits for factorial(n − 1). Calls accumulate going down, then results flow back up. Distinguish entering a call from returning from it.'),
      section('Factorial as a recurrence', 'For nonnegative n, 0! = 1 and n! = n × (n − 1)! for n > 0. There are n + 1 calls including the base case, giving O(n) time and O(n) call-stack space. The arithmetic model assumes values fit the chosen representation.'),
      section('Directories have recursive shape', 'A directory contains files and other directories. Process an entry, and recursively visit each child directory. With each entry visited once, traversal takes O(v + e) over the directory tree and a call stack proportional to its depth. Real filesystems also need handling for access errors and symbolic-link cycles.')
    ],
    takeaway: 'Draw what each call is waiting for, then trace the returns.',
    javaNote: 'Java does not guarantee tail-call elimination. int factorial overflows after 12!, and long after 20!. BigInteger avoids fixed-width overflow but changes arithmetic costs.',
    pitfalls: ['Negative input needs validation.', 'A small amount of work per call still consumes stack space.', 'The filesystem demo uses a fixed virtual tree; it does not read your disk.'],
    exercise: 'Trace factorial(4). At the deepest point, which multiplications are still waiting?'
  },
  {
    id: 11, title: 'Learning to Write in Recursive', short: 'Recursive thinking', group: 'Structures & recursion', pages: '161–181',
    intro: 'Design the smaller problem first. Then decide how its answer contributes to the answer for the current input.',
    topics: ['reverse', 'count-x', 'recursive-double', 'staircase', 'anagrams'],
    sections: [
      section('Repeat an action or combine an answer', 'Some recursive functions act before making the next call, such as a countdown. Others return a result that must be combined, such as counting matching characters. For counting x from index i, add 1 when the current character matches, then add the count from i + 1.'),
      section('Think from the top down', 'Assume a correct answer exists for a smaller input. To reverse a string from index i, reverse the suffix beginning at i + 1 and append the current character. This is a reasoning technique, not a claim that the smaller answer is computed for free.'),
      section('The staircase recurrence', 'With steps of size 1, 2, or 3, any route to n ends with one of those moves. Thus ways(n) = ways(n − 1) + ways(n − 2) + ways(n − 3). Define ways(0) = 1 for the empty route and ways(n) = 0 for negative n. Naive recursion repeats subproblems; memoization makes the number of distinct states linear.'),
      section('Anagrams branch into possibilities', 'Choose each available character as the next character, then recursively arrange the remaining characters. For n distinct characters there are n! results, each of length n. Materializing them costs at least proportional to that output size. Repeated characters can create duplicate results unless handled explicitly.')
    ],
    takeaway: 'State the smaller problem and the combination rule before writing the call.',
    javaNote: 'The reversal demo intentionally uses string concatenation to expose copying: O(n²) time in this form, with O(n) stack depth. An iterative char[] reversal can use O(n) time. Java char is a UTF-16 code unit, so these string demos restrict inputs to ASCII.',
    pitfalls: ['Printing and returning are different operations.', 'Different base-case conventions can produce different counts.', 'A function with two calls can repeat the same subproblem many times.'],
    exercise: 'Write a recurrence to sum an array from index i without copying any suffix arrays.'
  },
  {
    id: 12, title: 'Dynamic Programming', short: 'Dynamic programming', group: 'Structures & recursion', pages: '185–198',
    intro: 'When recursive branches solve the same subproblem repeatedly, remember its result or compute the needed states in a useful order.',
    topics: ['fibonacci', 'fibonacci-memo', 'fibonacci-bottom', 'recursive-max-copy', 'recursive-max'],
    sections: [
      section('Find repeated states', 'Naive Fibonacci uses fib(n) = fib(n − 1) + fib(n − 2), with fib(0) = 0 and fib(1) = 1. The call tree repeats fib(2), fib(3), and many others. Its time is exponential: O(φⁿ), with O(2ⁿ) a looser upper bound. Maximum stack depth is O(n).'),
      section('Memoization: remember on demand', 'Check a cache before computing a state. If it exists, return it. Otherwise compute the result, store it, and return it. There are n + 1 distinct Fibonacci states, each with constant work besides its children, so the fixed-width arithmetic model gives O(n) time and O(n) cache plus stack space.'),
      section('Bottom-up: choose a computation order', 'Compute fib(0) and fib(1), then build fib(2), fib(3), and so on. Only the previous two values are needed, so a rolling implementation uses O(1) auxiliary space and O(n) time. No recursive stack is required.'),
      section('Remove repeated work before caching everything', 'If a maximum-finding function calls the same suffix maximum twice, saving it in a local variable is enough. Also check the representation: copying the suffix on every call adds quadratic total copying, even after duplicate calls are removed. An index-based implementation avoids that copying.')
    ],
    takeaway: 'A recursion tree can contain many calls but few distinct states.',
    javaNote: 'Use a Map<Integer, Long> or a long[] plus a separate computed flag when zero is a valid cached result. Java long cannot hold arbitrarily large Fibonacci values; the lab caps n for both clarity and arithmetic safety.',
    pitfalls: ['Caching must key every input that affects the result.', 'Space includes the recursion stack as well as the cache.', 'An optimization that saves calls may still leave expensive array copies.'],
    exercise: 'Run fib(7) with and without memoization. Count calls and identify the first cache hit.'
  },
  {
    id: 13, title: 'Recursive Algorithms for Speed', short: 'Quicksort & quickselect', group: 'Structures & recursion', pages: '201–224',
    intro: 'Partition around a pivot to organize a problem. Then recurse into both sides to sort, or just one side to select.',
    topics: ['quick-sort', 'quick-select'],
    sections: [
      section('Partitioning establishes a boundary', 'This lab uses Lomuto partitioning with the last element as pivot. Scan with j; i tracks the end of the region containing values ≤ pivot. When a value qualifies, advance i and move it into that region. Finally move the pivot to i + 1.'),
      section('Quicksort solves both sides', 'After partitioning, the pivot is in its final sorted position. Recursively sort the ranges on its left and right. Balanced partitions give O(n log n) total work. Repeatedly splitting into sizes 0 and n − 1 produces O(n²).'),
      section('Pivot policy changes the cases', 'With the last-element policy, already sorted, reversed, or all-equal data can create bad partitions. Sorted data is not automatically quicksort’s best case. Random pivot selection gives expected O(n log n) time, but a quadratic worst case is still possible.'),
      section('Quickselect solves one side', 'To find the element at zero-based rank k, partition, compare the pivot index with k, and continue only in the relevant side. Expected time under suitable pivot assumptions is O(n), with O(n²) worst case. The iterative version here uses constant auxiliary space and rearranges the input.')
    ],
    takeaway: 'Partitioning is useful even when you do not need a fully sorted result.',
    javaNote: 'The displayed quicksort uses O(log n) stack space on balanced partitions and O(n) in the worst case. It is in-place with respect to array storage, but its call stack still counts. Standard Lomuto quicksort is not stable.',
    pitfalls: ['A single partition does not fully sort either side.', 'Rank k is an index, not a value.', 'Animation swaps exclude self-swaps; the resulting partition is unchanged.'],
    exercise: 'Compare random, ascending, and all-equal inputs using the last element as pivot. Observe partition sizes.'
  },
  {
    id: 14, title: 'Node-Based Data Structures', short: 'Linked lists', group: 'Nodes & networks', pages: '227–245',
    intro: 'An array finds the next item by position. A linked list finds it by following a reference. That small change reshapes the cost of its operations.',
    topics: ['linked-read', 'linked-search', 'linked-insert', 'linked-delete', 'doubly-list'],
    sections: [
      section('A sequence, linked together', 'Each node stores a value and a reference to the next node. A head reference identifies the first node; the final node points to null. The nodes need not occupy neighboring memory locations. Their links define the sequence.'),
      section('Access means walking', 'To read index k, start at head and follow k next references. Searching by value also walks until a match or null. Both take O(n) in the worst case. A linked list has no array-style constant-time indexed access.'),
      section('Insertion rewires links', 'To insert after a known node, first point the new node at the old successor, then point the predecessor at the new node. The rewiring is O(1). Finding the predecessor by index is O(n), so the whole indexed insertion is O(n). Inserting at the head requires no traversal.'),
      section('Deletion preserves the rest of the chain', 'To remove a node after a known predecessor, connect the predecessor to the removed node’s successor. At the head, advance head. Removing the only node leaves head = null. The time depends on whether the necessary node references are already available.'),
      section('Two links, two directions', 'A doubly linked node also stores prev. With head and tail, a queue can add at tail and remove at head in O(1). Inserting or removing must keep both directions consistent, including empty-list and single-node boundaries.')
    ],
    takeaway: 'O(1) rewiring does not make an O(n) search disappear.',
    javaNote: 'A Node<T> stores a value of type T and references to other nodes. Use Node<String> for text or Node<Integer> for integers. Search uses Objects.equals to compare values; == would compare String references. Java manages allocation and garbage collection. java.util.LinkedList is doubly linked; get(index) still traverses.',
    pitfalls: ['Do not lose the old next reference before linking the new node.', 'Head and tail need special handling when the list becomes empty.', 'Extra references and allocations add memory overhead.'],
    exercise: 'Insert 25 at index 2, then delete index 0. Which operation changes head, and which needs a predecessor?'
  },
  {
    id: 15, title: 'Speeding Up All the Things with Binary Search Trees', short: 'Binary search trees', group: 'Nodes & networks', pages: '247–275',
    intro: 'A binary search tree uses branching order to narrow a search. Its performance depends on the height of the tree.',
    topics: ['bst-search', 'bst-insert', 'bst-delete', 'bst-traversal'],
    sections: [
      section('The ordering rule applies to whole subtrees', 'In this lab, values smaller than a node belong in its left subtree and larger values in its right subtree. Duplicates are ignored. Each subtree is itself a binary search tree. This recursive invariant is stronger than only comparing immediate children.'),
      section('Search and insertion follow one path', 'Compare the target with the current node. Go left when smaller and right when larger. A match finishes search; a missing child is the insertion position. Work is O(h), where h is the tree’s height: O(log n) when balanced, O(n) for a chain.'),
      section('Deletion has three structural cases', 'A leaf can be removed. A node with one child can be replaced by that child. For two children, copy the inorder successor—the smallest value in the right subtree—then remove that successor from its old position. Reconnect the returned subtree root so root deletion works too.'),
      section('Traversal reveals the order', 'Inorder visits left subtree, node, then right subtree, producing ascending output under the BST rule. Preorder visits the node first; postorder visits it last. Traversal visits all n nodes in O(n) time and uses O(h) stack space.')
    ],
    takeaway: 'A binary tree is not automatically balanced, and not every binary tree is a BST.',
    javaNote: 'Custom Node classes make links visible for learning. TreeMap and TreeSet provide balanced search-tree behavior for production ordered maps and sets; they are not this unbalanced teaching implementation.',
    pitfalls: ['Sorted insertions can produce a linear chain.', 'The successor can have a right child that must be preserved.', 'Duplicate handling must be explicit.'],
    exercise: 'Delete a leaf, a one-child node, and the root with two children. Check inorder output after each deletion.'
  },
  {
    id: 16, title: 'Keeping Your Priorities Straight with Heaps', short: 'Heaps & priority queues', group: 'Nodes & networks', pages: '277–300',
    intro: 'A heap keeps the next priority item easy to reach without maintaining a fully sorted sequence.',
    topics: ['heap-insert', 'heap-extract'],
    sections: [
      section('Two rules define a binary heap', 'A heap is complete: levels are filled left to right, with only the last level possibly partial. In a max-heap, each parent is at least as large as its children. The root is the maximum, but siblings and different subtrees need not be sorted relative to one another.'),
      section('Insertion bubbles upward', 'Append the new value in the next open position to preserve completeness. While it exceeds its parent, swap upward. Only one rootward path is touched, giving O(log n) worst-case time for sift-up. Dynamic backing-array growth can occasionally require O(n) copying.'),
      section('Extraction repairs downward', 'Save the root, move the last value to the root, and remove the last slot. Repeatedly compare with the larger child and swap down if necessary. Choosing the larger child preserves both parent-child inequalities. Root lookup is O(1); sift-down is O(log n).'),
      section('An array encodes the shape', 'For zero-based index i, left child = 2i + 1, right child = 2i + 2, and parent = (i − 1)/2 for i > 0. Completeness eliminates gaps, so no explicit child references are required. Searching for an arbitrary value still takes O(n) in the worst case.')
    ],
    takeaway: 'A heap gives fast access to an extreme, not fast search for every value.',
    javaNote: 'Java PriorityQueue is a min-heap by default. Use Comparator.reverseOrder() for max-priority behavior. Iterating a PriorityQueue does not produce sorted order.',
    pitfalls: ['A heap’s ordering rule differs from a BST’s.', 'Sift down with the higher-priority child.', 'Handle extracting the only element without reading a nonexistent child.'],
    exercise: 'Insert a new maximum and watch its path. Then extract the root and compare the tree with its array representation.'
  },
  {
    id: 17, title: 'It Doesn’t Hurt to Trie', short: 'Tries & autocomplete', group: 'Nodes & networks', pages: '303–326',
    intro: 'A trie shares the beginning of words. Following a prefix reaches exactly the part of the structure relevant to that prefix.',
    topics: ['trie-insert', 'trie-search'],
    sections: [
      section('Edges represent characters', 'Start at a root that represents the empty prefix. Each character follows a child link. Words such as car and cat share the path c → a. A terminal marker distinguishes a complete stored word from a prefix that merely leads to longer words.'),
      section('Search and insertion', 'For a word of length k, follow one character at a time. A missing edge ends search unsuccessfully. Exact-word search also requires a terminal marker at the final node. Insertion creates missing nodes and marks the final node terminal. With expected constant-time child-map operations, both take O(k).'),
      section('Autocomplete begins with prefix search', 'First locate the node for the prefix. Then traverse only its descendants and collect terminal words. Reaching the prefix takes O(k); reporting suggestions also costs the traversal work and the total output length. It is not O(k) regardless of how many suggestions are produced.'),
      section('Values can improve suggestions', 'A terminal node can store a definition, frequency, or application value. Ranked autocomplete requires additional work or maintained summaries. Maps use memory proportional to actual children, while fixed alphabet arrays trade predictable indexing for potentially many empty slots.')
    ],
    takeaway: 'A prefix path is not necessarily a complete word.',
    javaNote: 'The examples use Map<Character, TrieNode> and lowercase ASCII words. Full Unicode text needs a deliberate policy for code points, normalization, and case handling.',
    pitfalls: ['The root is not a letter.', 'Mark the end of a word even when its path already exists.', 'Include suggestion output costs in autocomplete analysis.'],
    exercise: 'Store car and cart. Search for ca, car, and cart, then request autocomplete for ca.'
  },
  {
    id: 18, title: 'Connecting Everything with Graphs', short: 'Graphs & shortest paths', group: 'Nodes & networks', pages: '329–381',
    intro: 'Graphs describe connections that go beyond a chain or hierarchy. Traversal needs a way to remember what has already been seen.',
    topics: ['dfs', 'bfs', 'dijkstra'],
    sections: [
      section('Vertices, edges, and representation', 'Vertices represent entities; edges represent relationships. Edges may be directed or undirected and may carry weights. An adjacency list uses O(V + E) space, while a matrix uses O(V²). For an undirected list representation, each edge is normally stored in both endpoints’ lists.'),
      section('Depth-first search', 'DFS follows one branch deeply before backtracking. Mark vertices as seen before exploring neighbors to avoid cycles. Recursive DFS uses the call stack; an explicit stack is another implementation. With adjacency lists, a full traversal takes O(V + E) time.'),
      section('Breadth-first search', 'BFS uses a queue to visit vertices by increasing number of edges from the source. Mark on enqueue so a vertex is not enqueued repeatedly. Predecessors reconstruct shortest paths in an unweighted graph. A disconnected graph needs additional starting points for a full traversal.'),
      section('Dijkstra: relax weighted paths', 'Initialize source distance to zero and all others to infinity. Repeatedly settle the unsettled vertex with smallest tentative distance. For each outgoing edge, replace dist[v] if dist[u] + weight is smaller. Nonnegative weights are required. This lab uses a scan to choose the minimum, giving O(V² + E) time; a heap-based implementation has a different bound.')
    ],
    takeaway: 'Traversal order comes from the frontier structure; shortest-path guarantees depend on edge weights.',
    javaNote: 'Use Map<String, List<Edge>> for an adjacency list, HashSet for visited membership, and ArrayDeque for BFS. Use a wider type or guarded arithmetic when adding distances. Infinity must never be treated as a real reachable distance.',
    pitfalls: ['DFS does not generally find shortest paths.', 'BFS finds fewest-edge paths, not minimum weighted cost.', 'Negative weights invalidate Dijkstra’s settling rule.'],
    exercise: 'Run DFS and BFS from A. Then run Dijkstra and notice when a route discovered earlier is improved.'
  },
  {
    id: 19, title: 'Dealing with Space Constraints', short: 'Space complexity', group: 'Beyond the algorithm', pages: '385–393',
    intro: 'Faster code can use more memory. Analyze both resources and say whether you are counting the input, the output, or auxiliary storage.',
    topics: ['copy-array', 'in-place-double', 'factorial', 'hash-duplicates'],
    sections: [
      section('Track live storage as input grows', 'Auxiliary space means working memory beyond the input and, by a stated convention, sometimes beyond the output. A few indices require O(1). A second array of n values requires O(n). A fixed-size primitive type occupies bounded space even if its numeric value changes.'),
      section('Copying versus mutating', 'Doubling into a new array preserves the original and allocates n new slots. Doubling in place uses O(1) auxiliary space but changes the input. Both do O(n) work. Neither choice is universally better: callers may need the original data.'),
      section('The hidden recursion stack', 'A recursive factorial implementation has only a few local variables per call, but n simultaneous calls use O(n) stack space. Iterative factorial can use O(1) auxiliary space. Tail-recursive Java still cannot assume constant stack usage.'),
      section('Trade time for memory deliberately', 'A HashSet can replace repeated duplicate searches, spending O(n) space to reach expected O(n) time. Memoization similarly saves repeated computation by storing states. Measure peak live memory, not just the number of allocation statements in the source.')
    ],
    takeaway: 'A short function can still create a tall call stack or a large output.',
    javaNote: 'Object headers, references, boxing, and collection capacity affect actual Java memory. Big-O describes growth, not an exact byte count. Garbage collection timing is separate from whether a value remains reachable.',
    pitfalls: ['In-place mutation changes what callers observe.', 'Output space and auxiliary space should be labeled separately.', 'Allocating inside a loop does not by itself determine peak live space.'],
    exercise: 'Compare the two doubling demos. Which input changes, how many output slots exist, and what is the peak auxiliary space?'
  },
  {
    id: 20, title: 'Techniques for Code Optimization', short: 'Optimization techniques', group: 'Beyond the algorithm', pages: '395–430',
    intro: 'Start with a correct solution, understand its cost, and look for structure that lets you avoid repeated work.',
    topics: ['two-sum', 'hash-duplicates', 'duplicates', 'greedy-stock'],
    sections: [
      section('Establish a baseline and a target', 'Identify the current bottleneck and its Big-O. Ask what work any correct solution must do—for example, inspecting every unsorted value may require Ω(n). Use that lower-bound reasoning as a target, then check whether constraints allow it to be reached.'),
      section('Replace repeated scans with remembered facts', 'For two-sum, a pair scan is quadratic. During one pass, ask whether target − value has already appeared. A hash table remembers the earlier index. Query before inserting so one element cannot pair with itself. Expected time becomes O(n), with O(n) extra space.'),
      section('Look for patterns and local summaries', 'A stock-profit scan can remember the cheapest earlier price and the best profit so far. Each new price updates those summaries. This greedy-style scan is correct for one buy followed by one sell because every possible sell day is evaluated against its cheapest valid buy day.'),
      section('Change the structure, then justify the result', 'A set helps membership tests, a heap helps repeated priority removal, and a trie helps prefix navigation. A greedy choice needs a correctness argument; it does not solve every optimization problem. Verify edge cases, compare outputs with a simple baseline, and distinguish asymptotic gains from constant-factor improvements.')
    ],
    takeaway: 'A useful optimization removes work while preserving the problem’s rules.',
    javaNote: 'HashMap<Integer, Integer> can remember an earlier index for two-sum. The stock example permits no transaction, so decreasing prices produce profit 0. Integer arithmetic is bounded; choose types that fit the application.',
    pitfalls: ['A faster answer to a different problem is not an optimization.', 'Greedy choices need proof, not just a promising example.', 'Preprocessing and extra memory belong in the cost analysis.'],
    exercise: 'For [8, 2, 6, 1, 7], trace the best one-transaction stock profit. Why can you not buy after selling?'
  }
];

export const book = {
  title: 'A Common-Sense Guide to Data Structures and Algorithms in Python, Volume 1',
  author: 'Jay Wengrow', edition: 'P1.0 · December 2023',
  url: 'https://pragprog.com/titles/jwpython/a-common-sense-guide-to-data-structures-and-algorithms-in-python-volume-1/',
};

export const references = [
  { title: 'Java ArrayList · indexed access, growth & insertion', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayList.html' },
  { title: 'Java HashMap · hashing, equality & performance assumptions', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html' },
  { title: 'Java ArrayDeque · stack & queue operations', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ArrayDeque.html' },
  { title: 'Java PriorityQueue · priorities & operation costs', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/PriorityQueue.html' },
  { title: 'Java TreeMap · balanced ordered maps', url: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/TreeMap.html' }
];
