# Graphs

A graph is a data structure used to represent relationships or connections between different objects.

## Graphs vs. Trees

- while all trees are graphs, not all graphs are trees.

- Specifically, for a graph to be considered a tree, it cannot have cycles, and
  all nodes must be connected.

- A graph may have nodes that form what is known as a cycle—that is, nodes
  that reference each other circularly. In the previous example, Alice is friends
  with Diana, and Diana is connected to Bob, and Bob is connected…to Alice.
  These three nodes form a cycle.
  Trees, on the other hand, are not “allowed” to have cycles. If a graph has a
  cycle, then it’s not a tree.

- Another characteristic specific to trees is that every node is somehow connect-
  ed to every other node, even if the connections are indirect. However, it’s
  possible for a graph to not be fully connected.

### Graph Jargon

node = each node is called a vertex
edge = the connection between two nodes is called an edge
vertices = the plural of vertex
neighbor = a node that is connected to another node is called a neighbor via an edge
connected graph = a graph in which every node is connected to every other node, either directly or indirectly

Term ===== Simple explanation
Vertex (node) = An individual object, such as Alice
Edge = A connection between two vertices
Adjacent vertices = Two vertices connected directly
Neighbor = Another name for an adjacent vertex
Path = A sequence of connections between vertices
Cycle = A path that returns to its starting vertex without repeating intermediate vertices
Connected graph = Every vertex can be reached from every other vertex (in an undirected graph)

## Where do we use graphs?

Graphs are widely used in applications such as social networks, Google Maps, flight-route planning, computer networks, recommendation systems, and dependency tracking.

- BFS (Breadth-First Search) is a graph traversal algorithm that explores all the vertices of a graph in breadthward motion. It starts from a selected node (source) and explores all its neighbors before moving on to the next level of neighbors.

- DFS (Depth-First Search) is another graph traversal algorithm that explores as far as possible along each branch before backtracking. It starts from a selected node (source) and explores one neighbor, then continues to explore deeper into the graph until it reaches a dead end, at which point it backtracks to explore other neighbors.

## Big-O

O(1) = Constant work Accessing a known vertex's neighbor set
O(N) = Work grows with N Checking N items one by one
O(V + E) = Work grows with vertices and edges DFS and BFS traversal

V = Vertices: Number of nodes in the graph.
E = Edges: Number of connections between vertices.

5 vertices: A, B, C, D, E.
4 edges: A–B, A–C, B–D, C–E.

## Cynthia, Bob, Alice, Fed, Elise, Diana.

6 vertices
7 Edges

## graph databases - Neo4j

facebook
linkedin

# Shortest path using BFS

# Weighted graphs

# Djikstra's algorithm

time complexity
space complexity
