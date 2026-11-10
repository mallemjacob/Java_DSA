1. Start at any vertex within the graph. We’ll call this the starting vertex.
2. Add the starting vertex to the hash table to mark it as having been visited.
3. Add the starting vertex to a queue.
4. Start a loop that runs while the queue isn’t empty.
5. Within this loop, remove the first vertex from the queue. We’ll call this
the current vertex.
6. Iterate over all the adjacent vertices of current vertex.
7. If the adjacent vertex was already visited, ignore it.
8. If the adjacent vertex has not yet been visited, mark it as visited by adding
it to a hash table, and add it to the queue.
9. Repeat this loop (starting from Step 4) until the queue is empty.
