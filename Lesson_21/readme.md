# Dealing with Space Constraints

How much memory an algorithm consumes? This measure is known as space
complexity.

Space complexity becomes an important factor when memory is limited. If
you have an enormous amount of data, or are programming for a small device
with limited memory, space complexity can matter a lot.

## Big O of Space Complexity

We use Big O notation to describe space complexity just as they do for time complexity.

- For time complexity, the key question was: if there are N data elements, how
  many steps will the algorithm take?

- When it comes to memory consumption, the key question is: if there are N
  data elements, how many units of memory will the algorithm consume?

### Let's take a simple example.

Let’s say we’re writing a function that accepts an array of strings and returns
an array of those strings in ALL CAPS.

```java
public class MakeUppercase {

    public static String[] makeUppercase(String[] array) {

        String[] newArray = new String[array.length];
        // "HELLO", "WORLD", "JAVA"

        for (int i = 0; i < array.length; i++) {
            newArray[i] = array[i].toUpperCase();
        }

        // Original array --> loop (uppercase) -> new array

        return newArray;
    }

    public static void main(String[] args) {

        String[] words = {"hello", "world", "java"};

        String[] result = makeUppercase(words);

        for (String word : result) {
            System.out.println(word);
        }
    }
}

```

- Creates a new array.
- Original array remains unchanged.
- Space complexity: O(n).

In this make_uppercase function, we accept an array. We then create a brand-new
array called new_array and fill it with uppercase versions of each string from
the original array.

By the time this function is complete, we’ll have two arrays floating around
in our computer’s memory.

if there are N data elements, how many
units of memory will the algorithm consume?

Because our function generated an additional N data elements (in the form
of new_array), we’d say that this function has a space efficiency of O(N).

```Big-O
Space Complexity = O(n) --> We create a new array containing n elements.
Time Complexity = O(n) --> We visit every element once.
```

```java
public class MakeUppercase {

    public static String[] makeUppercase(String[] array) {

        for (int i = 0; i < array.length; i++) {
            array[i] = array[i].toUpperCase();
        }

        return array;
    }

    public static void main(String[] args) {

        String[] words = {"hello", "world", "java"};

        String[] result = makeUppercase(words);

        for (String word : result) {
            System.out.println(word);
        }
    }
}
```

- Modifies the original array directly.
- Does not create another array to store the results.
- Space complexity: O(1) auxiliary space.

## Auxiliary space

It’s worth emphasizing that when using Big O to describe space complexity,
we’re only counting the new data the algorithm is generating. Even our second
make_uppercase function deals with N elements of data in the form of the array
passed into the function. However, we’re not factoring those N elements into
our Big O description, since the original array exists in any case, and we’re
only focused on the extra space the algorithm consumes.
This extra space is more formally known as auxiliary space.

## Trade-Offs Between Time and Space

In programming, we often have multiple ways to solve the same problem.

Some solutions use more memory to save time, while others use less memory but may require more processing time.

This is called a time-space trade-off.

### Approach 1: Use nested loops (less space)

```java
public static void findDuplicates(int[] numbers) {

    for (int i = 0; i < numbers.length; i++) {

        for (int j = i + 1; j < numbers.length; j++) {

            if (numbers[i] == numbers[j]) {
                System.out.println(numbers[i]);
            }
        }
    }
}
```

Take the first number.
Compare it with every number after it.
Repeat for the remaining numbers.
Print a number whenever a duplicate is found.

Complexity:

- Time: O(n²) — nested loops compare elements against each other.
- Auxiliary Space: O(1) — we don't create another data structure.

### Approach 2: Use a HashSet (more space)

```java
import java.util.HashSet;

public static void findDuplicates(int[] numbers) {

    HashSet<Integer> seen = new HashSet<>();

    for (int number : numbers) {

        if (seen.contains(number)) {
            System.out.println(number);
        } else {
            seen.add(number);
        }
    }
}
```

Create an empty HashSet.
Visit each number.
Check whether the number already exists in the HashSet.
If it exists, it's a duplicate.
Otherwise, add it to the HashSet.

Complexity:

- Time: O(n) average — HashSet lookup and insertion are generally O(1).
- Auxiliary Space: O(n) — the HashSet may store up to n elements.

### Approach 3: Using Sorting to Find Duplicates

```java
import java.util.Arrays;

public class HasDuplicateValue {

    public static boolean hasDuplicateValue(int[] array) {

        Arrays.sort(array);  // 10,10,20,30,40,40,50,60,70

        for (int i = 0; i < array.length - 1; i++) {

            if (array[i] == array[i + 1]) {
                return true;
            }
        }

        return false;
    }

    public static void main(String[] args) {

        int[] numbers = {10, 20, 30, 20, 40, 10};

        boolean result = hasDuplicateValue(numbers);

        System.out.println(result);
    }
}
```

Because the array is sorted, duplicate values will always be next to each other.

Complexity:

- Time: O(n log n) — Sorting takes O(n log n); scanning takes O(n).
- Auxiliary Space: Depends on sorting implementation — Java's primitive array sorting may use additional workspace.

## The Hidden Cost of Recursion

```java
public class RecursionExample {

    public static void recurse(int n) {

        if (n < 0) {
            return;
        }

        System.out.println(n);

        recurse(n - 1);
    }

    public static void main(String[] args) {

        recurse(5);
    }
}

```

Output

```
5
4
3
2
1
0
```

The function calls itself repeatedly, decreasing n by 1 each time.

```
Recursive call sequence
1. recurse(5) → prints 5
2. recurse(4) → prints 4
3. recurse(3) → prints 3
4. recurse(2) → prints 2
5. recurse(1) → prints 1
6. recurse(0) → prints 0
7. recurse(-1) → condition is true, so returns.
```

- Complexity Analysis
  Time Complexity: O(n)
  If we call recurse(5), the function executes 6 times (5, 4, 3, 2, 1, 0), plus one final call with -1 that checks the base condition.
  As n increases, the number of recursive calls increases proportionally.
  Therefore, time complexity is O(n).

* Space Complexity: O(n)
  This is where the hidden cost of recursion comes in.
  Every recursive function call creates a new stack frame in the Java call stack.
