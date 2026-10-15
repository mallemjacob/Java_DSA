# Learning to Write in Recursive

Recursive Trick: Passing Extra Parameters

Doubling the array numbers.

`[1, 2, 3, 4, 5]`
`[2, 4, 6, 8, 10]`

Using extra function parameters is a common technique in writing recursive functions.

## Recursive Category: Calculations

1. The first category of recursive functions—those whose job it is to repeatedly execute a task.
   we found that one area in which recursion shines is where we need to act on a problem
   that has an arbitrary number of levels of depth.

2. The second general category: performing a calculation based on a subproblem.
   A second area in which recursion shines is where it is able to make a calculation based on a subproblem of the problem at hand.

let’s refer to the factorial problem:

`6 * 5 * 4 * 3 * 2 * 1`

To write a function that calculates the factorial of a number, we could use a
classic loop that starts with the 1 and builds up from there. That is, we’d
multiply the 2 by the 1, and then multiply 3 by the result, and then 4, and
so on until we reach 6.

However, we could approach the problem differently: we could calculate the
factorial based on its subproblem.

### Subproblem

A subproblem is a version of the very same problem applied to a smaller input.
Let’s apply this to our case.

If you think about it, factorial(6) will be 6 multiplied by whatever the result of
factorial(5) is.

Since factorial(6) is:
`6 * 5 * 4 * 3 * 2 * 1`

and factorial(5) is:
`5 * 4 * 3 * 2 * 1`

we can conclude that factorial(6) is equivalent to:
`6 * factorial(5)`.

That is, once we have the result of factorial(5), we can simply multiply that
result by 6 to get the answer to factorial(6).

Since factorial(5) is the smaller problem that can be used to compute the result
for the bigger problem, we call factorial(5) a subproblem of factorial(6).

```java

// Factorial Using Recursion

public class Main {

    public static int factorial(int number) {

        // Base case
        if (number <= 1) {
            return 1;
        } else {
            // Recursive call
            return number * factorial(number - 1);
            //return 5 * factorial(4)
        }
    }

    public static void main(String[] args) {

        int number = 5;

        System.out.println(factorial(number));
    }
}
```

The key line here is return `number * factorial(number - 1)`, in which we compute the result as number multiplied by our subproblem, which is `factorial(number - 1)`.

## Two Approaches to Calculations

When writing a function that makes a calculation, there are
two potential approaches: we can try to build the solution from the “bottom-
up,” or we can attack the problem going “top-down” by making the calculation
based on the problem’s subproblem.

Indeed, computer science literature refers to the terms `bottom-up` and `top-down` in regard to recursion strategies.

1. Top-down: Start with the original (larger) problem and break it into smaller subproblems.
2. Bottom-up: Start with the smallest subproblem and build toward the original problem.

### Top-Down Recursion: A New Way of Thinking

Recursion shines when implementing a top-down approach because going top-down offers a new
mental strategy for tackling a problem.

let’s take another look at the key line from our top-down
factorial implementation:

`return number * factorial(number - 1)`

This line of code makes its calculation based on factorial(number - 1). When we
write this line of code, do we have to understand how the factorial function it’s
calling works? Technically, we don’t. Whenever we write code that calls
another function, we assume that the function will return the correct value
without necessarily understanding how its internals work.

Here as well, when we calculate our answer based on calling the factorial
function, we don’t need to understand how the factorial function works; we can
just expect it to return the correct result. Of course, the weird part is that
we’re the ones writing the factorial function! This line of code exists within the
factorial function itself. But that’s what is so great about top-down thinking: in
a way, we can solve the problem without even knowing how to solve the
problem.

## String Reversal

The function accepts the argument "abcde", it’ll return "edcba"

1. First, let’s identify the subproblem.
2. So for the string "abcde", let’s assume the subproblem is "bcde". This subproblem
   is the same as the original string minus its first character.

"abcde" --> "edcba"
