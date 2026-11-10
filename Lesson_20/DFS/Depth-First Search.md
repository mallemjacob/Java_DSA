# Depth-first search (DFS)

1. Start at any random vertex within the graph.
2. Add the current vertex to the hash table to mark it as having been visited.
3. Iterate through the current vertex’s adjacent vertices.
4. For each adjacent vertex, if the adjacent vertex has already been visited,
   ignore it.
5. If the adjacent vertex has not yet been visited, recursively perform depth-
   first search on that vertex.
