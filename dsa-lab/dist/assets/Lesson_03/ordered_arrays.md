# Ordered Arrays

Ordered arrays require that the values are always kept in order, every time a value is added.

1. For example, let’s take the array [3, 17, 80, 202]:

2. Assume we want to insert the value 75 into the array. If this array were a
   classic array, we could insert the 75 at the end, as follows:

3. On the other hand, if this were an ordered array, we’d have no choice but to
   insert the 75 in the proper spot so that the values remain in ascending order:

## Inserting into the ordered array

Step 1: We check the value at index 0 to determine whether the value we want
to insert—the 75—should go to its left or to its right:

Because 75 is greater than 3, we know that the 75 will be inserted somewhere
to its right. However, we don’t know yet exactly which cell it should be
inserted into, so we need to check the next cell.

We’ll call this type of step a comparison, where we compare the value we’re
inserting to a number already present in the ordered array.

Step 2: We inspect the value at the next cell:
Since 75 is greater than 17, we need to move on.

Step 3: We check the value at the next cell:
We encountered the value 80, which is greater than the 75 we wish to
insert. Since we’ve reached the first value that is greater than 75, we can
conclude that the 75 must be placed immediately to the left of this 80 to
maintain the order of this ordered array. To do this, we need to shift data to
make room for the 75.

Step 4: Move the final value to the right:

Step 5: Move the next-to-last value to the right:

Step 6: We can finally insert the 75 into its correct spot:

When inserting into an ordered array, we need to always
conduct a search before the actual insertion to determine the correct spot for
the insertion.

Elements = 4
Steps = 6

1. Search for the correct insertion point — 3 steps
2. Shift elements to make room — 2 steps
3. Insert 75 — 1 step

With an ordered array, linear search can sometimes stop early.
