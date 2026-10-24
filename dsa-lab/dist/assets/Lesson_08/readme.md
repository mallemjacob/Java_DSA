# Insertion Sort

Insertion Sort consists of the following steps:

1.  In the first pass-through, we temporarily remove the value at index 1 (the
    second cell) and store it in a temporary variable. This will leave a gap at
    that index, since it contains no value:
    In subsequent pass-throughs, we remove the values at the subsequent
    indexes.

2.  We then begin a shifting phase, where we take each value to the left of
    the gap and compare it to the value in the temporary variable:

    If the value to the left of the gap is greater than the temporary variable,
    we shift that value to the right:

    As we shift values to the right, inherently the gap moves leftward. As soon
    as we encounter a value that is lower than the temporarily removed value,
    or we reach the left end of the array, this shifting phase is over.

3.  We then insert the temporarily removed value into the current gap:

4.  Steps 1 through 3 represent a single pass-through. We repeat these pass-
    throughs until the pass-through begins at the final index of the array. By
    then, the array will have been fully sorted.

4,2,7,1,3

## 1st pass-through:

index 1

## 2nd pass-through:

index 2

## 3rd pass-through:

index 3

---

## The Efficiency of Insertion Sort

Four types of steps occur in Insertion Sort: removals, comparisons, shifts,
and insertions.

### Comparisons

A comparison takes place each time we
compare a value to the left of the gap with the temp_value.

`1 + 2 + 3 + … + (N - 1) comparisons.`

In our example array that contains five elements, that’s a maximum of:
`1 + 2 + 3 + 4 = 10 comparisons.`

For an array containing 10 elements, there would be:
`1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 = 45 comparisons.`

When examining this pattern, it emerges that for an array containing N ele-
ments, there are approximately N^2 / 2 comparisons. (10^2 / 2 is 50, and 20^2 / 2
is 200. We’ll look at this pattern more closely in the next chapter.)

`10^2/2 = 50 comparisons`
`20^2/2 = 200 comparisons`

### Shifts

Shifts occur each time we move a value one cell to the right.

`N^2 / 2 shifts.`

```
N^2 / 2 comparisons
        +
N^2 / 2 shifts
-------------------------
N^2 comparisons and shifts.`
```

### Removing and inserting

Removing and inserting the temp_value from the array happens once per pass-
through.

```
N^2 comparisons and shifts combined
N - 1 removals
N - 1 insertions
_____________________________
N^2 + 2N - 2 steps

```

But, Big O ignores constants.
So it is `O(N^2 + N)`

- Important rule to remember about Big O notation:

* Big O notation only takes into account the highest order of N when we have
  multiple orders added together.

In other words, if we have an algorithm that takes N4 + N3 + N2 + N steps, we
only consider N4 to be significant

We can apply this same concept to Insertion Sort. Even though we’ve already
simplified Insertion Sort down to `N^2 + N` steps, we simplify the expression
further by throwing out the lower order, reducing it to `O(N^2)`.

Inserion Sort is `O(N^2)`.

## The Average Case

```
5,6 4,1,2,3
1,2,3,4,5,6
```

Indeed, in a worst-case scenario, Selection Sort is faster than Insertion Sort.
However, it’s critical we also take into account the average-case scenario.

Best- and worst-case scenarios happen relatively infrequently. In the real
world, average scenarios are what occur most of the time. (02.png)

Insertion sort (Array in descending order)
worst case = `O(N^2)`
average case = `O(N^2 / 2)` --> `O(N^2)`
best case = `O(N)`

Examples

```
Best case = [1, 2, 3, 4] --> 3 comparisons, 0 shifts, 0 removals, 0 insertions
Worst case = [4, 3, 2, 1] --> 6 comparisons, 6 shifts, 3 removals, 3 insertions
Average case = [1, 3, 4, 2] --> 4 comparisons, 2 shifts, 3 removals, 3 insertions
```

## Selection Sort vs Insertion Sort

Selection Sort takes `N^2 / 2` steps in all cases, from worst to average to best-case scenarios. (04.png)

So which is better: Selection Sort or Insertion Sort? The answer is, well, it
depends. In an average case—where an array is randomly sorted—they perform
similarly. If you have reason to assume you’ll be dealing with data that is
mostly sorted, Insertion Sort will be a better choice. If you have reason to
assume you’ll be dealing with data that is mostly sorted in reverse order,
Selection Sort will be faster. If you have no idea what the data will be like,
that’s essentially an average case, and both will be equal.

## A Practical Example

Finding the intersection between two arrays.
The intersection is a list of all the values that occur in both of the arrays.

If you have the arrays `[3, 1, 4, 2]` and `[4, 5, 3, 6]`, the intersection would be a third
array `[3, 4]`.
