# Understanding Recursion Step by Step: `factorial(3)`

Let's understand how Java executes recursive functions and how it remembers unfinished function calls.

## Java Example

```java
public class Factorial {

    public static int factorial(int number) {
        // Base case
        if (number <= 1) {
            return 1;
        }

        // Recursive case
        return number * factorial(number - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(3)); // 6
    }
}
```

## Step 1: Call `factorial(3)`

We start by calling:

```java
factorial(3);
```

Since `3` is greater than `1`, Java executes:

```java
return 3 * factorial(2);
```

But Java cannot calculate the final answer yet because it doesn't know the value of `factorial(2)`.

So, **Java pauses `factorial(3)`** and starts executing `factorial(2)`.

## Step 2: Execute `factorial(2)`

Now Java executes:

```java
factorial(2);
```

Since `2` is greater than `1`, Java reaches:

```java
return 2 * factorial(1);
```

Again, Java cannot complete the calculation until it knows the result of `factorial(1)`.

So, **Java pauses `factorial(2)`** and starts executing `factorial(1)`.

At this point, both `factorial(3)` and `factorial(2)` are waiting for results.

## Step 3: Execute `factorial(1)`

Java executes:

```java
factorial(1);
```

Since `1` satisfies the base case:

```java
if (number <= 1) {
    return 1;
}
```

Java returns `1`.

**This is where recursion stops calling itself.**

## Step 4: Return to `factorial(2)`

Remember, `factorial(2)` was waiting at:

```java
return 2 * factorial(1);
```

Now that `factorial(1)` has returned `1`, Java calculates:

```text
2 * 1 = 2
```

So, `factorial(2)` returns `2`.

## Step 5: Return to `factorial(3)`

Now Java returns to the unfinished `factorial(3)`.

It was waiting at:

```java
return 3 * factorial(2);
```

Since `factorial(2)` returned `2`, Java calculates:

```text
3 * 2 = 6
```

So, `factorial(3)` returns `6`.

## Step 6: Understanding the Call Stack

How does Java remember which function to return to?

It uses a data structure called the **Call Stack**.

### A. Calling functions (building the stack)

Each new function call is placed on top of the stack:

```text
        TOP OF STACK
+-----------------------------+
| factorial(1) — base case    |
+-----------------------------+
| factorial(2) — waiting      |
+-----------------------------+
| factorial(3) — waiting      |
+-----------------------------+
       BOTTOM OF STACK
```

### B. `factorial(1)` returns

`factorial(1)` returns `1` and is removed from the stack. `factorial(2)` can now finish calculating `2 * 1`.

```text
        TOP OF STACK
+-----------------------------+
| factorial(2) — returns 2    |
+-----------------------------+
| factorial(3) — waiting      |
+-----------------------------+
       BOTTOM OF STACK
```

### C. `factorial(2)` returns

`factorial(2)` returns `2` and is removed from the stack. `factorial(3)` can now finish calculating `3 * 2`.

```text
        TOP OF STACK
+-----------------------------+
| factorial(3) — returns 6    |
+-----------------------------+
       BOTTOM OF STACK
```

### D. Finished

`factorial(3)` returns `6`. All three recursive calls have completed, so the stack frames for these calls are gone.

## Step 7: Final Execution Flow

**Going down (recursive calls):**

```text
factorial(3)
    |
    └── factorial(2)
            |
            └── factorial(1)
                    |
                    └── return 1
```

**Coming back up (returning values):**

```text
factorial(1) returns 1
        ↓
factorial(2) returns 2 * 1 = 2
        ↓
factorial(3) returns 3 * 2 = 6
```

## Key Concept

Recursion works in two phases:

1. **Stack building:** Java calls smaller versions of the function and remembers where each unfinished call must resume.
2. **Stack unwinding:** When the base case is reached, Java returns values to the waiting functions, completing them one by one.

This is why recursion and stacks are closely related. The call stack follows **LIFO (Last In, First Out)** — the last function called is the first one to finish.
