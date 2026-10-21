# Quick Sort

best case - all sorted --> 1,2,3,4,5
worst case - reverse --> 5,4,3,2,1
average case - random - 3,1,2,5,4

Quick Sort is a popular Divide and Conquer sorting algorithm. It sorts an array by selecting an element called a pivot, placing it in its correct sorted position, and recursively sorting the elements on either side.

`[8, 3, 1, 7, 0, 10, 2]`

pivot = 2
left = 1,0
right = 8, 3, 7, 10

left: 3,1,0,2
pivot = 1
left = 0
right = 3,2

right: 8, 10
pivot = 8
left = 8
right = 10

Quick Sort follows three main steps:

1. Choose a pivot: We'll use the last element of the array (2).
2. Partition: Move elements smaller than or equal to the pivot to its left, and larger elements to its right.
3. Recursion: Repeat this process for the left and right portions until everything is sorted.

## Partitioning

To partition an array is to take a random value from the array—which is then
called the pivot—and make sure that every number that is less than the pivot
ends up to the left of the pivot and that every number greater than the pivot
ends up to the right of the pivot.
