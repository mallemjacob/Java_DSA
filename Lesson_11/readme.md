# Stacks and Queues -- arrays

1. They’re simply arrays with restrictions.
2. They're elegant tools for handling temporary data.

Temporary data is information that doesn’t have any meaning after it’s processed, so you
can throw it away once you’re done with it.

Stacks and queues handle this kind of temporary data but have a special
focus on the order in which the data is handled.

## Stacks

A stack stores data in the same way arrays do—it’s simply a list of elements.
But they have the following three constraints:
• Data can be inserted only at the end of a stack.
• Data can be deleted only from the end of a stack.
• Only the last element of a stack can be read.

The first item in the array becomes the bottom of the stack,
while the last item becomes the stack’s top.

### To see a stack in action, let’s start with an empty stack.

1. Inserting a new value into a stack is also called `pushing onto the stack`.

```
{}
{5}
{5,3}
{5,3,0}
```

Note that we’re always adding data to the top (that is, the end) of the stack.
If we wanted to insert the 0 into the bottom or middle of the stack, we couldn’t,
because that’s the nature of a stack: data can only be added to the top.

2. Removing elements from the top of the stack is called `popping from the stack`.
   Because of a stack’s restrictions, we can only pop data from the top.

```
{5,3,0}
{5,3}
{5}
```

`LIFO : last in, first out.`

## Queues

A queue is another data structure designed to process temporary data.
With queues, the first item added to the queue is the first item to be removed.

`FIFO : first in, first out.`

As with a line of people, a queue is usually depicted horizontally.
It’s also common to refer to the beginning of the queue as its front and the end of the
queue as its back.

Like stacks, queues are arrays with three restrictions.

• Data can be inserted only at the end of a queue. (This is identical behavior
to the stack.)
• Data can be deleted only from the front of a queue. (This is the opposite
behavior of the stack.)
• Only the element at the front of a queue can be read. (This, too, is the
opposite of behavior of the stack.)

## Abstract Data Type (ADT) - Stack, Queue

An Abstract Data Type describes what operations are allowed and how they behave, without specifying exactly how the data must be stored internally.

For example, a stack tells us:

- We may insert only at the top.
- We may remove only from the top.
- We may read the top element.

But it doesn't specify whether the stack should use an array, a linked list, or another internal structure.
