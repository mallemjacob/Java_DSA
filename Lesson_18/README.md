# Priority Queues

A priority queue is a list whose deletions and access are just like a classic
queue but whose insertions are like an ordered array. So we only delete and
access data from the front of the priority queue, but when we insert data, we
always make sure the data remains sorted in a specific order.

1. When we insert data, we ensure we always maintain proper order.
2. Data can only be removed from the end of the array. (This will represent
   the front of the priority queue.)

array = {10,9,8,7}

## Heaps

The binary heap is a specific kind of binary tree.
The heap is a binary tree that maintains the following conditions:

1. The value of each node must be greater than each of its descendant nodes.
   This rule is known as the heap condition.
2. The tree must be complete.

### The Heap Condition

The heap condition says that each node’s value must be greater than each
and every one of its descendants.

### Heap Insertion

To insert a new value into the heap, we perform the following algorithm:

1. We create a node containing the new value and insert it at the next
   available rightmost spot in the bottom level. Thus, this value becomes
   the heap’s last node.
2. Next, we compare this new node with its parent node.
3. If the new node is greater than its parent node, we swap the new node
   with the parent node.
4. We repeat Step 3, effectively moving the new node up through the heap,
   until the new node has a parent whose value is greater than it.

### Heap Deletion

The first thing to know about deleting a value from a heap is that we only
ever delete the root node. This is right in line with the way a priority queue
works, in that we only access and remove the highest-priority item.
The algorithm for deleting the root node of a heap is as follows:

1. Move the last node into where the root node was, effectively removing the
   original root node.
2. Trickle the root node down into its proper place. I’ll explain how trickling
   down works shortly.
