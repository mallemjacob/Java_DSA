# HashMap

1. What is a hash map?
   A hash table is a data structure that stores information as key-value pairs.

key = identifies the information we want.
value = the information associated with that key.

2. Why not just use an array?

    `int[] numbers = {61, 30, 91, 11, 54, 38, 72};`

    We want to find the number 72.

    The array is unordered, so we might need to examine every element until we find 72.

    If the array contains N elements, linear search takes O(N) time in the worst case.

    For 1,000 elements, we might perform 1,000 comparisons.

3. We can use a hash map for searching faster. O(1) average.

    `menu.get("hamburger");`

    How does Java know where the hamburger entry is stored without checking every entry one by one?

4. It uses a hash function.
   A hash function takes a key and produces a hash value that helps the hash table determine where to look for the corresponding entry.

    This process of taking characters and converting them to numbers is known
    as hashing.

    the code that is used to convert those letters into particular
    numbers is called a hash function.

    A = 1
    B = 2
    C = 3
    D = 4
    E = 5

    BAD = 214
    hash("BAD") = `2 * 1 * 4 = 8`

    dictioanry.put("BAD", "a bad word");

    dictionary.get("BAD") will return "a bad word"

    CAB = 312
    hash("CAB") = `3 * 1 * 2 = 6`

    dictionary.put("CAB", "taxi");

    ACE = 135
    hash("ACE") = `1 * 3 * 5 = 15`

    CEA = 315
    hash("CEA") = `3 * 5 * 1 = 15`

    dictionary.put("ACE", "star");

    dictionary.get("ACE") will return "star"

    O(1) time complexity for searching in a hash table.

5. What happens when two keys collide?
   A collision occurs when two different keys map to the same bucket.

```hash
  Key "evil"  ──> bucket 8
  Key "dab"   ──> bucket 8
```

We use seperate chaining to resolve collisions. Each bucket contains a linked list of entries that map to the same bucket.

6. Four HashMap operations you should know
    - `put(key, value)` - adds a key-value pair to the hash table.
    - `get(key)` - retrieves the value associated with the key.
    - `remove(key)` - removes the key-value pair from the hash table.
    - `containsKey(key)` - checks if the key exists in the hash table.

## using a hash table as an index

`int[] numbers = {61, 30, 91, 11, 54, 38, 72};`

Does this array contain the number 72?

We have to run linear search every time.

or we can build a hash table once and use its keys as an index of the numbers.

```Java
HashMap<Integer, Boolean> index = new HashMap<>();

int[] numbers = {61, 30, 91, 11, 54, 38, 72};

// Build the index
for (int number : numbers) {
    index.put(number, true);
}

// 61: true
// 30: true
// 91: true
// 11: true
// 54: true
// 38: true
// 72: true


// "french fries" : 0.25
// "hamburger" : 0.50
// "soda": 0.75


// Check whether a number exists
System.out.println(index.containsKey(72));
System.out.println(index.containsKey(100));
```
