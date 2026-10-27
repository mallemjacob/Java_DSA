# Binary Search Trees

A binary tree is a tree in which each node has zero, one, or two children.

A binary search tree is a binary tree that also abides by the following rules:

1. Each node can have at most one left child and one right child.
2. A node’s left descendants can only contain values that are less than the
   node itself. Likewise, a node’s right descendants can only contain values
   that are greater than the node itself.

## Searching

The algorithm for searching within a binary search tree is as follows:

1. Designate a node to be the current node. (At the beginning of the algorithm,
   the root node is the first current node.)
2. Inspect the value at the current node.
3. If we’ve found the value we’re looking for, great!
4. If the value we’re looking for is less than the current node, search for it
   in its left subtree.
5. If the value we’re looking for is greater than the current node, search for
   it in its right subtree.
6. Repeat Steps 1 through 5 until we find the value we’re searching for, or
   until we hit the bottom of the tree, in which case our value must not be
   in the tree.

- Example:
  Say we want to search for the 61.
  When searching through a tree, we must always begin at the root:

## Insertion

## Deletion

### Deleting a Node with Two Children
