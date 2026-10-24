# Array

## Java Array Operations

A Java array stores a **fixed number of elements of the same type**.

```java
int[] array = {10, 20, 30, 40, 50};
```

Conceptually:

```text
Index:    0    1    2    3    4
        ┌────┬────┬────┬────┬────┐
Value:  │ 10 │ 20 │ 30 │ 40 │ 50 │
        └────┴────┴────┴────┴────┘
```

### Reading — O(1)

Reading means providing an **index** and asking for the value stored at that index.

```java
int value = array[3];

System.out.println(value);   // 40
```

The computer does not need to visit indexes `0`, `1`, and `2` first. It can calculate the location of index `3` and access it directly.

```text
array[3]
   │
   ▼
  40
```

Therefore:

```text
Reading/access by index = O(1)
```

The size of the array does not change the number of operations required for indexed access.

---

### Searching — O(n)

Searching means providing a **value** and trying to find which index contains it.

For example, find `40`:

```java
int[] array = {10, 20, 30, 40, 50};
```

With linear search:

```text
10 → not 40
20 → not 40
30 → not 40
40 → found
```

Java knows how to access a particular index directly, but if we only provide a value, it does not automatically know which index contains that value.

In the worst case, we may have to check every element.

```text
N elements → maximum N checks
```

Therefore:

```text
Linear search = O(n)
```

Example:

```java
for (int i = 0; i < array.length; i++) {
    if (array[i] == 40) {
        System.out.println("Found at index: " + i);
        break;
    }
}
```

If the array is sorted, other algorithms such as **binary search** can search in **O(log n)**.

---

### Insertion — O(n)

A Java array has a **fixed size**.

```java
int[] array = new int[5];
```

This array always has 5 slots. We cannot simply add a sixth slot to it.

However, if an array has an unused slot, we can conceptually insert an element by shifting existing elements.

Suppose we have:

```text
[10][20][30][40][ ]
```

and want to insert `15` at index `1`.

First shift elements to the right:

```text
[10][  ][20][30][40]
```

Then insert `15`:

```text
[10][15][20][30][40]
```

Java example:

```java
int[] array = {10, 20, 30, 40, 0};

int insertIndex = 1;

for (int i = 3; i >= insertIndex; i--) {
    array[i + 1] = array[i];
}

array[insertIndex] = 15;
```

In the worst case, inserting near the beginning requires shifting many elements.

Therefore:

```text
Insertion with shifting = O(n)
```

If the array is already completely full, a larger array must be created and the existing elements copied into it.

---

### Deletion — O(n)

Java arrays do not actually shrink when an element is deleted.

Instead, we can remove an element logically by shifting the elements after it to the left.

Suppose:

```text
[10][20][30][40][50]
```

Delete the element at index `1` (`20`):

```text
[10][30][40][50][ ]
```

The elements:

```text
30
40
50
```

have to move one position to the left.

Example:

```java
int[] array = {10, 20, 30, 40, 50};

int deleteIndex = 1;

for (int i = deleteIndex; i < array.length - 1; i++) {
    array[i] = array[i + 1];
}

array[array.length - 1] = 0;
```

In the worst case, deleting near the beginning requires shifting almost every element.

Therefore:

```text
Deletion with shifting = O(n)
```

---

## Summary

| Operation         | What we provide  | What Java does               |    Big-O |
| ----------------- | ---------------- | ---------------------------- | -------: |
| **Reading**       | Index            | Directly accesses that index | **O(1)** |
| **Linear Search** | Value            | Checks elements until found  | **O(n)** |
| **Insertion**     | Value + position | May shift elements right     | **O(n)** |
| **Deletion**      | Position         | May shift elements left      | **O(n)** |

The key mental model is:

```text
Know the index?
      │
      └── array[index] ───────────────► O(1)

Know only the value?
      │
      └── search elements ────────────► O(n)

Need to insert/delete?
      │
      └── may need to shift elements ─► O(n)

```
