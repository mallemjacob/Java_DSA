# Node-Based Data Structures

Nodes = pieces of data that may be dispersed throughout the computer’s memory.
Node-based data structures offer new ways to organize and access data that
provide a number of major performance advantages.

## Linked Lists

"once", "up" "on" "a"
{'a','b','c'}
{1,2,3,4,5,6}

a = 1001
b = 1002
c = 1003

a = 1001
b = 2004
c = 3657

Like an array, a linked list is a data structure that represents a list of items.

### Lists

contiguous group of empty cells in memory and designates them to store data

### Linked lists

1. the data from linked lists can be scattered across different
   cells throughout the computer’s memory.

2. Connected data that are dispersed throughout memory are known as nodes.

3. Each node represents one item in the list.

- The big question, then, is this:
  if the nodes are not next to each other in memory, how does the
  computer know which nodes are part of the same linked list?

- Each node also comes with a little extra
  information—namely, the memory address of the next node in the list.

4. This extra piece of data—this pointer to the next node’s memory address—is
   known as a link.

- Head: A linked list’s first node is also referred to as its head.
- Tail: Its last node its tail.

If the computer knows at which memory address the linked list begins, it has all it needs to begin working with the list! Since each node contains a link to the next node, all the computer needs to do is follow each link to string together the entire list.

Term ------> Meaning
Node ------> An object containing data and a reference
Head ------> Reference to the first node
Tail ------> Reference to the last node, if maintained
Next ------> Reference connecting one node to another
null ------> Indicates that no next node exists
Traversal -> Visiting nodes one after another

## Implementing a Linked List

### Reading O(N)

It would take N steps for N nodes in the list.
To read from the third node, then, the computer must go through a process. First, it accesses the first node. It then follows the first node’s link to the second node and then the second node’s link to the third node.

### Searching O(N)

To search for a value, we need
to go through a similar process to the one we did with reading; that is, we begin with the head and follow the links of each node to the next one. Along the way, we inspect each value until we find what we’re looking for.

### Insertion O(1)

With linked lists, however, insertion at the beginning of the list takes just one step—which is O(1)

### Deletion O(1)

once --> cat --> upon --> a --> time

python3 dsa-lab/serve.py
