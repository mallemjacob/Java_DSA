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
