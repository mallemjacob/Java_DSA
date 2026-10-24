# Java Data Structures and Algorithms — Linked Lists

**Lesson:** Build, visualize, and analyze singly linked lists in Java; then learn how doubly linked lists and Java's library implementation relate to them.

## Learning objectives

By the end of the lesson, students should be able to:

1. Explain `Node`, `data`, `next`, `head`, `tail`, and `null`.
2. Build and traverse a singly linked list using Java object references.
3. Insert at the beginning, end, and a specified zero-based index.
4. Search for, delete, and reverse nodes.
5. Analyze time complexity and compare lists with arrays.
6. Explain how a doubly linked list differs from a singly linked list.

## 1. What is a linked list?

A linked list is a linear data structure built from _nodes_. Each singly linked node stores a value and a reference to the next node. Unlike an array, its nodes need not occupy consecutive memory addresses.

```text
head
 |
 v
[10 | next] -> [20 | next] -> [30 | null]
                                   ^
                                  tail
```

- **Node:** A single object containing data and a link.
- **Head:** Reference to the first node, or `null` if empty.
- **Tail:** Optional reference to the last node. We maintain it for efficient appending.
- **Next:** Reference to the subsequent node.
- **Traversal:** Start at `head`, repeatedly follow `next` until reaching `null`.
- **Index:** Position measured from 0; unlike an array, a node at a given index cannot be reached directly.

Java uses _object references_, not manually dereferenced C pointers. Unreachable objects can be garbage-collected.

## 2. The Node class

```java
class Node {
    int data;
    Node next;

    Node(int value) {
        data = value;
        next = null;
    }
}
```

Create a list with three nodes:

```java
Node a = new Node(10);
Node b = new Node(20);
Node c = new Node(30);
a.next = b;
b.next = c;
Node head = a;
```

This creates `head -> [10] -> [20] -> [30] -> null`.

## 3. Step-by-step operations

### Traverse: O(n)

```java
Node current = head;
while (current != null) {
    System.out.println(current.data);
    current = current.next;
}
```

### Insert at head: O(1)

**Before:** `head -> [20] -> [30] -> null`  
**After:** `head -> [10] -> [20] -> [30] -> null`

```java
Node newNode = new Node(10);
newNode.next = head;
head = newNode;
```

If the original list is empty, update `tail` to the new node too.

### Append: O(1) with tail

```java
Node newNode = new Node(40);
if (head == null) {
    head = tail = newNode;
} else {
    tail.next = newNode;
    tail = newNode;
}
```

Without a `tail` reference, finding the last node takes O(n).

### Insert in middle: O(n) to find predecessor, O(1) to link

**Before:** `head -> [10] -> [30] -> null`  
**After:** `head -> [10] -> [20] -> [30] -> null`

```java
Node newNode = new Node(20);
newNode.next = previous.next; // Link new node forward first.
previous.next = newNode;      // Then redirect the previous node.
```

**Key teaching point:** Reversing the assignment order can lose access to the original remainder of the list.

### Search: O(n)

Start at head, compare data, and advance until the value is found or the list ends. Best case O(1), worst case O(n).

### Remove first node: O(1)

```java
head = head.next;
if (head == null) tail = null;
```

Always handle the empty list before removing.

### Remove after predecessor: O(1) once predecessor is known

```java
Node target = previous.next;
previous.next = target.next;
if (target == tail) tail = previous;
```

Finding the predecessor by index or value generally takes O(n).

### Reverse: O(n) time, O(1) extra space

For `10 -> 20 -> 30 -> null`, redirect links so the order becomes `30 -> 20 -> 10 -> null`.

```java
Node previous = null;
Node current = head;
tail = head;
while (current != null) {
    Node nextNode = current.next;
    current.next = previous;
    previous = current;
    current = nextNode;
}
head = previous;
```

The `nextNode` temporary variable prevents the rest of the original list from being lost.

## 4. Big O efficiency

| Operation                 | Singly linked list with head + tail | Notes                   |
| ------------------------- | ----------------------------------- | ----------------------- |
| Read first element        | O(1)                                | Directly through `head` |
| Read last element         | O(1)                                | Directly through `tail` |
| Read element at index i   | O(n)                                | Follow links to index i |
| Find an element by value  | O(n)                                | Linear search           |
| Insert at beginning       | O(1)                                | Update head             |
| Append at end             | O(1)                                | Using tail              |
| Insert at arbitrary index | O(n)                                | Traverse to predecessor |
| Delete first element      | O(1)                                | Update head             |
| Delete by index or value  | O(n)                                | Traverse to predecessor |
| Reverse the list          | O(n)                                | Visit all nodes         |
| Storage                   | O(n)                                | Nodes plus references   |

**Careful distinction:** Once you _already have_ a reference to the correct predecessor, linking or unlinking is O(1). This does not make searching for the predecessor O(1).

## 5. Linked list versus Java arrays / ArrayList

| Feature                | Array / ArrayList           | Singly linked list          |
| ---------------------- | --------------------------- | --------------------------- |
| Get by index           | O(1)                        | O(n)                        |
| Search unsorted values | O(n)                        | O(n)                        |
| Insert at front        | O(n) due to shifting        | O(1)                        |
| Remove from front      | O(n) due to shifting        | O(1)                        |
| Append                 | O(1) amortized in ArrayList | O(1) with tail              |
| Memory per element     | Generally lower             | Reference overhead per node |
| CPU cache locality     | Generally better            | Often worse                 |

**When to use:** Linked lists are especially useful for teaching reference manipulation and implementing some queues or other linked structures. In many real-world Java applications, `ArrayList` is preferable for lists that are often indexed or traversed because it generally has better memory locality.

## 6. Doubly linked lists

A doubly linked node has both `prev` and `next`:

```text
null <- [10] <-> [20] <-> [30] -> null
          ^                  ^
         head               tail
```

```java
class DoublyNode {
    int data;
    DoublyNode prev;
    DoublyNode next;

    DoublyNode(int value) {
        data = value;
    }
}
```

A doubly linked list can traverse backward from `tail`. If you already hold a reference to a node, removing it by relinking neighbors can be O(1) (with appropriate head/tail updates). The tradeoff is an extra reference per node and additional pointer updates.

## 7. Java's built-in LinkedList

`java.util.LinkedList` is a **doubly linked list** implementing `List` and `Deque`.

```java
import java.util.LinkedList;

public class BuiltInLinkedListDemo {
    public static void main(String[] args) {
        LinkedList<Integer> nums = new LinkedList<>();
        nums.addFirst(20);
        nums.addLast(30);
        nums.addFirst(10);
        System.out.println(nums);   // [10, 20, 30]
        System.out.println(nums.get(1)); // 20; indexed access is O(n)
        nums.removeFirst();
        nums.removeLast();
        System.out.println(nums);   // [20]
    }
}
```

Prefer coding the structure from scratch while learning. Use the library class when appropriate in applications. Do not confuse `LinkedList` with `ArrayList`, which uses a resizable array.

## 8. Common mistakes

1. Forgetting to advance `current = current.next` in traversal causes an infinite loop.
2. Setting `previous.next = newNode` before storing/linking the rest of the list can break the chain.
3. Forgetting to update `tail` when deleting the last node creates an incorrect tail.
4. Not handling an empty list (`head == null`) causes a `NullPointerException`.
5. Confusing **index** with **value**: deleting index 2 is not deleting value 2.
6. Assuming random indexed access is O(1) because arrays have it — linked lists do not.
7. Forgetting that removing from a one-node list must reset **both** `head` and `tail`.

## 9. Classroom trace exercise

Start empty. Perform:

1. `addLast(10)`
2. `addLast(20)`
3. `addFirst(5)`
4. `addAt(2, 15)`
5. `removeAt(1)`
6. `reverse()`

Students should draw the list after **every** operation and record head, tail, and size.

**Answer:**

```text
1. 10                         head=10, tail=10, size=1
2. 10 -> 20                   head=10, tail=20, size=2
3. 5 -> 10 -> 20              head=5,  tail=20, size=3
4. 5 -> 10 -> 15 -> 20        head=5,  tail=20, size=4
5. 5 -> 15 -> 20              head=5,  tail=20, size=3
6. 20 -> 15 -> 5              head=20, tail=5,  size=3
```

## 10. Student practice assignments

1. Add a `countOccurrences(int value)` method; analyze its complexity.
2. Add a `getMiddle()` method with slow and fast references.
3. Add a `removeLast()` method and explain why it is O(n) for a singly linked list, even with `tail`.
4. Test `addFirst`, `addLast`, `removeAt`, and `reverse` on empty and one-node lists.
5. Explain why a doubly linked list is useful for back-and-forth traversal.
6. Stretch: detect a cycle with Floyd's tortoise-and-hare algorithm.
