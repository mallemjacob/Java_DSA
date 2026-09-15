# DSA Lesson 1

## Code quality

- **Maintainability:** readability, organization, and modularity.
- **Efficiency:** how well code scales as the input grows.

## Algorithms and data structures

An **algorithm** is a procedure for solving a problem.

A **data structure** organizes data for efficient use.

```text
Data structure = how data is organized
Algorithm      = what we do with the data
```

Examples of data structures:

```text
Array, Linked List, Stack, Queue, Hash Table, Tree, Graph
```

Example algorithm:

```java
static int findMax(int[] numbers) {
    int max = numbers[0];

    for (int number : numbers) {
        if (number > max) {
            max = number;
        }
    }

    return max;
}
```

## Why study DSA?

DSA focuses on whether code remains efficient as the input becomes large.

The input size is usually represented by `n`:

```java
int[] numbers = {10, 20, 30}; // n = 3
```

## Big-O notation

Big-O describes how an algorithm's work grows as `n` increases. We focus on the growth pattern rather than exact operation counts.

### `O(1)` — Constant time

The work stays roughly the same regardless of input size.

```java
static int getFirst(int[] numbers) {
    return numbers[0];
}
```

### `O(n)` — Linear time

The algorithm visits each element once.

```java
static void printNumbers(int[] numbers) {
    for (int number : numbers) {
        System.out.println(number);
    }
}
```

### `O(n²)` — Quadratic time

Nested loops over the same input commonly produce quadratic time.

```java
static void printPairs(int[] numbers) {
    for (int i = 0; i < numbers.length; i++) {
        for (int j = 0; j < numbers.length; j++) {
            System.out.println(numbers[i] + " " + numbers[j]);
        }
    }
}
```

## Big-O rules

- One simple loop over the input → often `O(n)`.
- Nested loops over the same input → often `O(n²)`.
- Direct array access → often `O(1)`.
- Ignore constants: `O(2n)` and `O(5n)` become `O(n)`.
- Keep the dominant term: `O(n² + n)` becomes `O(n²)`.

| Big-O   | Name      | Example                  |
| ------- | --------- | ------------------------ |
| `O(1)`  | Constant  | Access one array element |
| `O(n)`  | Linear    | Loop through an array    |
| `O(n²)` | Quadratic | Nested loops             |

## Java refresher

### Methods

```java
static int add(int a, int b) {
    return a + b;
}

int result = add(10, 20);
```

### Arrays

```java
int[] numbers = {10, 20, 30, 40};

numbers[0];       // Array indexes start at 0
numbers.length;   // Number of elements
```

### Loops

```java
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

for (int number : numbers) {
    System.out.println(number);
}
```
