# Shortest Path

There are two possible paths:

- Path 1: Alice → Bob → Fred → Gina — 3 edges
- Path 2: Alice → Diana → Gina — 2 edges
  The shortest path is Alice → Diana → Gina, because it has fewer edges.

## For our example, BFS will remember:

Bob <- Alice
Diana <- Alice
Fred <- Bob
Gina <- Diana

## When we find Gina, we follow those records backward:

Gina → Diana → Alice

Then reverse the sequence:

Alice → Diana → Gina

That's the shortest path.
