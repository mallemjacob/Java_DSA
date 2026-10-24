# Binary search

1. Binary search is a more efficient algorithm for searching an ordered array.
2. It works by repeatedly dividing the search interval in half until the value is found or the interval is empty.
3. O(log n) time complexity.

`[10, 20, 30, 40, 50, 60, 70]`

search for 60

```list
Index:   0   1   2   3   4   5   6

Value:  10  20  30  40  50  60  70
                     ↑
                   middle
```

Is 60 == 40?

```list
[50, 60, 70]
     |
   middle
```

## With an array containing 100 values

Linear search: 100 steps O(n)
Binary search: 7 steps O(log n)

each time we double the size of the ordered array, the number of steps needed for binary search increases by one.

## Searching

We’d like to search for the value 7 inside this ordered array. Here’s how
binary search would work:

Step 1: We begin our search from the central cell. We can immediately jump
to this cell, since we can calculate its index by taking the array’s length and
dividing it by 2. We check the value at this cell:

Step 2: Among the cells to the left of the 9, we inspect the middlemost value.
There are two middlemost values, so we arbitrarily choose the left one:

Step 3: There are two more cells where the 7 can be. We arbitrarily choose
the left one.

Step 4: We inspect the final remaining cell. (If it’s not there, that means there
is no 7 within this ordered array.)

We found the 7 in four steps.

[10,20,30,40,50,60,70,80,90]

log2(8) = 3

8 - 4 - 2 - 1

log2(64) = 6

64 - 32 - 16 - 8 - 4 - 2 - 1

log2(100) = 7

100 - 50 - 25 - 12 - 6 - 3 - 2 - 1

log2(1000)
