# Bubble Sort

Sorting algorithms: Given an array of unsorted values, how can we sort them so that they end up in ascending order?

Bubble Sort is a basic sorting algorithm and follows these steps:

1. Point to two consecutive values in the array. (Initially, we start by pointing
   to the array’s first two values.) Compare the first item with the second one:
   (01.png)

2. If the two items are out of order (in other words, the left value is greater
   than the right value), swap them (if they already happen to be in the cor-
   rect order, do nothing for this step):
   (02.png)

3. Move the “pointers” one cell to the right:
   (03.png)

4. Repeat Steps 1 through 3 until we reach the end of the array, or if we
   reach the values that have already been sorted. (This will make more
   sense in the walk-through that follows.) At this point, we’ve completed
   our first pass-through of the array—we “passed through” the array by
   pointing to each of its values until we reached the end.

5. We then move the two pointers back to the first two values of the array
   and execute another pass-through of the array by running Steps 1 through
   4 again. We keep on executing these pass-throughs until we have a pass-
   through in which we did not perform any swaps. When this happens, it
   means our array is fully sorted and our work is done.

## Bubble Sort in Action

This is our starting array:

          ```
          [4, 2, 7, 1, 3]
          ```

## The Efficiency of Bubble Sort O(n^2)

The Bubble Sort algorithm contains two significant kinds of steps:

1. Comparisons: two numbers are compared with one another to determine
   which is greater.

    n = 5

    4 + 3 + 2 + 1 = 10 comparisions

    for N elements, we make (N - 1) + (N - 2) + (N - 3) … + 1 comparisons.

2. Swaps: two numbers are swapped with one another to sort them.

    n = 5

    4 + 3 + 2 + 1 = 10 swaps

Total = 20 steps

For such an array with 10 values, we get 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = 45
comparisons, and another 45 swaps. That’s a total of 90 steps.

With an array containing 20 values, we’d have:
19 + 18 + 17 + 16 + 15 + 14 + 13 + 12 + 11 + 10 + 9 + 8 + 7 + 6 + 5 + 4 + 3 +
2 + 1 = 190 comparisons, and approximately 190 swaps, for a total of 380
steps.

As the number of elements increases, the number of steps grows exponentially.
(it grows quadratically)
(04.png)

Because for N values, Bubble Sort takes N2 steps, in Big O we say that Bubble
Sort has an efficiency of O(N^2).

O(N^2) is also referred to as quadratic time.

O(N2) is considered to be a relatively inefficient algorithm, since as the data
increases, the steps increase dramatically.
