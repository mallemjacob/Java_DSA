# Selection Sort

Selection Sort repeatedly finds the smallest element from the unsorted part of an array and places it at the beginning.

1. We check each cell of the array from left to right to determine which value
   is least. As we move from cell to cell, we keep track of the lowest value
   we’ve encountered so far. (We’ll do this by storing its index in a variable.)
   If we encounter a cell that contains a value that is even lower than the
   one in our variable, we replace it so that the variable now points to the
   new index. (01.png)

2. Once we’ve determined which index contains
   the lowest value, we swap its value with the
   value we began the pass-through with. This
   would be index 0 in the first pass-through,
   index 1 in the second pass-through, and so
   on. (02.png)

3. Each pass-through consists of Steps 1 and 2.
   We repeat the pass-throughs until we reach a pass-through that would
   start at the end of the array. By this point, the array will have been fully
   sorted.

## The Efficiency of Selection Sort

Selection Sort contains two types of steps: comparisons and swaps.
We compare each value with the lowest number we’ve encountered in each pass-
through, and we swap the lowest number into its correct position.

With an array containing 5 elements {4, 2, 7, 1, 3} (03.png)

Comparisions = 10

That’s a grand total of 4 + 3 + 2 + 1 = 10 comparisons.

To put it in a way that works for arrays of all sizes, we’d say that for N ele-
ments, we make

(N - 1) + (N - 2) + (N - 3) … + 1 comparisons.

Swaps = 4
we only need to make a maximum of one swap per pass-through.

## Ignoring Constants

if there are N data elements, how many steps will the algorithm take? Because Selection Sort takes roughly half of N^2 steps, it would seem reasonable that we’d describe the efficiency of Selection Sort as being O(N^2 / 2). That is, for N data elements, there are N^2 / 2 steps.

- Big O notation ignores constants.

Big O notation never includes regular numbers that aren’t an exponent. We simply drop these regular numbers from the expression.

In our case, then, even though the algorithm takes N^2 / 2 steps, we drop the
“/ 2” because it’s a regular number and express the efficiency as O(N2).

For an algorithm that takes N / 2 steps, we’d call it O(N).

An algorithm that takes N2 + 10 steps would be expressed as O(N2) since we
drop the 10, which is a regular number.

With an algorithm that takes 2N steps (meaning N \* 2), we drop the regular
number and call it O(N).

Even O(100N), which is 100 times slower than O(N), is also referred to as O(N).

## 1st round

lowest_value = 1 at index 0

lowest_value = 2 at index 1

lowest_value = 4 at index 3

## 2nd round

lowest_value = 2 at index 1

## 3rd round

lowest_value = 3 at index 2

lowest_value = 4 at index 3

lowest_value = 7 at index 4

## 4th round

lowest_value = 4 at index 3

Bubble sort = 100 steps
Selection sort = 50 steps

O(1)
O(N)
O(log N)
O(N^2)
