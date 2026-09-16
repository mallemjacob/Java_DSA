# DSA Lesson 2 — Arrays in Java

## 1. What is an array?

An array stores multiple values under one variable name.

```java
int[] numbers = {10, 20, 30, 40, 50};
```

Mental model:

```text
Index:     0    1    2    3    4
          ↓    ↓    ↓    ↓    ↓
Value:   [10] [20] [30] [40] [50]
```

Each value has an **index**.

Java arrays use zero-based indexing:

```text
first element  → index 0
second element → index 1
third element  → index 2
```

---

There are two common ways.

### Create with values

```java
int[] numbers = {10, 20, 30, 40};
```

### Create with a fixed size

```java
int[] numbers = new int[5];
```

This creates space for five integers.

Initially:

```text
[0, 0, 0, 0, 0]
```

Then:

```java
numbers[0] = 10;
numbers[1] = 20;
```

Now:

```text
[10, 20, 0, 0, 0]
```

Important:

> A normal Java array has a **fixed size** after creation.

---

# 3. Reading an element

```java
int[] numbers = {10, 20, 30, 40, 50};

System.out.println(numbers[2]);
```

Output:

```text
30
```

The important DSA question is:

> How long does Java take to access `numbers[2]`?

The answer is:

```text
O(1)
```

---

# 4. Why is array access O(1)?

This is an important mental model.

Suppose:

```text
Index:     0    1    2    3    4
Value:    10   20   30   40   50
```

When we write:

```java
numbers[3]
```

Java does **not** do this:

```text
numbers[0]
↓
numbers[1]
↓
numbers[2]
↓
numbers[3]
```

It can calculate where index `3` is and access it directly.

Conceptually:

```text
array starting location
        +
index × element size
        ↓
location of requested element
```

So whether we request:

```java
numbers[0]
```

or:

```java
numbers[100]
```

the array can directly calculate the appropriate position.

Therefore:

```text
Array access = O(1)
```

This is one of the biggest advantages of arrays.

---

# 5. Updating an element

Updating is also constant time.

```java
int[] numbers = {10, 20, 30, 40};

numbers[2] = 100;
```

Before:

```text
[10, 20, 30, 40]
```

After:

```text
[10, 20, 100, 40]
```

Complexity:

```text
O(1)
```

Because Java directly accesses index `2`.

---

# 6. Traversing an array

Traversing means visiting every element.

```java
int[] numbers = {10, 20, 30, 40};

for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
```

Output:

```text
10
20
30
40
```

If the array contains `n` elements, we visit `n` elements.

Therefore:

```text
Traversal = O(n)
```

---

# 7. Java refresher — `arr.length`

For arrays:

```java
numbers.length
```

Notice:

```java
length
```

not:

```java
length()
```

Example:

```java
int[] numbers = {10, 20, 30};

System.out.println(numbers.length);
```

Output:

```text
3
```

This will be used constantly in DSA.

---

# 8. Traditional `for` loop

For DSA, get comfortable with this:

```java
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
```

Break it down:

```java
int i = 0;
```

Start at index `0`.

```java
i < numbers.length;
```

Continue while `i` is a valid index.

```java
i++;
```

Move to the next index.

---

# 9. Enhanced `for` loop

Java also has:

```java
for (int number : numbers) {
    System.out.println(number);
}
```

This means:

> For each `number` inside `numbers`.

It's convenient when you only need the values.

But in DSA we often need the **index**, so you'll frequently use:

```java
for (int i = 0; i < numbers.length; i++)
```

---

# 10. Searching an array

Suppose:

```java
int[] numbers = {10, 50, 20, 80, 30};
```

We want to know whether `80` exists.

One simple approach:

```java
static boolean contains(int[] numbers, int target) {

    for (int i = 0; i < numbers.length; i++) {

        if (numbers[i] == target) {
            return true;
        }
    }

    return false;
}
```

Calling it:

```java
System.out.println(contains(numbers, 80));
```

Output:

```text
true
```

Worst case:

```text
[10, 50, 20, 80, 30]
                      ↑
                   target
```

We might have to inspect the whole array.

So:

```text
Search in an unsorted array
≈ O(n)
```

---

# 11. Find the maximum

Very common beginner DSA exercise:

```java
static int findMax(int[] numbers) {

    int max = numbers[0];

    for (int i = 1; i < numbers.length; i++) {

        if (numbers[i] > max) {
            max = numbers[i];
        }
    }

    return max;
}
```

Example:

```text
[8, 4, 15, 2, 10]
```

Trace it:

```text
max = 8

4 > 8?   no
15 > 8?  yes → max = 15
2 > 15?  no
10 > 15? no
```

Result:

```text
15
```

Complexity:

```text
O(n)
```

Because every element may need to be checked.

---

# 12. Insertion into an array

This is where arrays become more interesting.

Suppose we have:

```text
[10, 20, 30, 40, _]
```

and want to insert:

```text
15
```

at index `1`.

We can't simply overwrite:

```text
[10, 15, 30, 40, _]
```

because we'd lose `20`.

Instead we shift elements:

```text
Before

[10, 20, 30, 40, _]

Move 40 →
[10, 20, 30, 40, 40]

Move 30 →
[10, 20, 30, 30, 40]

Move 20 →
[10, 20, 20, 30, 40]

Insert 15

[10, 15, 20, 30, 40]
```

Potentially many elements must move.

So insertion at the beginning/middle can be:

```text
O(n)
```

Insertion at a known free position at the end can effectively be:

```text
O(1)
```

for a fixed array when space already exists.

---

# 13. Deletion

Suppose:

```text
[10, 20, 30, 40, 50]
```

Delete:

```text
20
```

If we remove it, there's a gap:

```text
[10, _, 30, 40, 50]
```

So remaining elements may need to shift left:

```text
[10, 30, 40, 50, _]
```

Potential work:

```text
O(n)
```

---

# 14. Array operation complexity

This table is important.

| Operation                  | Typical Big-O |
| -------------------------- | ------------: |
| Access by index            |        `O(1)` |
| Update by index            |        `O(1)` |
| Traverse                   |        `O(n)` |
| Search unsorted array      |        `O(n)` |
| Insert at beginning/middle |        `O(n)` |
| Delete at beginning/middle |        `O(n)` |

---

# 15. Why arrays are fast for indexing

The key advantage:

```text
Index known
   ↓
Direct access
   ↓
O(1)
```

Example:

```java
numbers[900];
```

Java doesn't search through 900 elements.

It directly calculates where index 900 is.

---

# 16. Fixed size — major limitation

Java arrays have fixed size.

```java
int[] numbers = new int[5];
```

You cannot suddenly make this exact array hold ten elements.

You'd need another array or a dynamic collection.

This is one reason Java has:

```java
ArrayList<Integer>
```

---

## Lesson 2 takeaway

```text
ARRAY

[10] [20] [30] [40]
  0    1    2    3
```

and especially:

```text
Access by index    → O(1)

Update by index    → O(1)

Traverse           → O(n)

Search             → O(n)

Insert with shift  → O(n)

Delete with shift  → O(n)
```
