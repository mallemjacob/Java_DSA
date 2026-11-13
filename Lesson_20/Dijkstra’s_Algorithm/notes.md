# Weighted graph

weighted graph, adds additional information to the edges of the graph.

A weight can represent:

- Distance between cities.
- Flight ticket price.
- Network latency.
- Travel time.
- Cost of performing an operation.

## The Shortest Path Problem

Weighted graphs can be very useful in modeling all sorts of datasets, and
they also come with some powerful algorithms that help us make the most
out of that data.

## Dijkstra’s Algorithm (Dike-struh)

1. We visit the starting city, making it our “current city.”
2. We check the prices from the current city to each of its adjacent cities.
3. If the price to an adjacent city from the starting city is cheaper than the
   price currently in cheapest_prices_table (or the adjacent city isn’t yet in the
   cheapest_prices_table at all):
   a. We update the cheapest_prices_table to reflect this cheaper price.
   b. We update the cheapest_previous_stopover_city_table, making the adjacent city
   the key and the current city the value.
4. We then visit whichever unvisited city has the cheapest price from the
   starting city, making it the current city.
5. We repeat the Steps 2 through 4 until we’ve visited every known city.

## Finding the Shortest Path

If we just want to know the cheapest price from Atlanta to El Paso, we can
look in our cheapest_prices_table and see that it’s $280. But if we want to figure
out the exact path to fly to snag that low price, we have one last thing to do.

Remember the cheapest_previous_stopover_city_table? It’s now time to use that data.

Currently, the `cheapest_previous_stopover_city_table` looks like this:

```
Cheapest Previous Stopover City from Atlanta:
---------------------------------------------
Boston  Chicago Denver  El Paso
Atlanta Denver  Atlanta Chicago
```

We can use this table to draw the shortest path from Atlanta to El Paso—if
we go backward.

Let’s look at El Paso. Its corresponding city is Chicago. This means the
cheapest route from Atlanta to El Paso involves stopping over in Chicago as
the immediate step before flying to El Paso. Let’s write this down:

`Chicago -> El Paso`

Now, if we look up Chicago in the cheapest_previous_stopover_city_table, we can see
that its corresponding value is Denver. This means the cheapest route from
Atlanta to Chicago involves stopping in Denver right before Chicago. Let’s add
this to our figure:

`Denver -> Chicago -> El Paso`

If we then look up Denver in the cheapest_previous_stopover_city_table, we can see
that the cheapest flight to get from Atlanta to Denver is to fly directly from
Atlanta to Denver:

`Atlanta -> Denver -> Chicago -> El Paso`

Now, Atlanta happens to be our starting city, so this route is the exact path
we’d take from Atlanta to El Paso to get the cheapest price.

Let’s review the logic we’re using to chain together the cheapest path.

Remember, the cheapest_previous_stopover_city_table contains, for each destination,
the second-to-last stop before that destination to earn the cheapest price if
you’re flying from Atlanta.

So from the cheapest_previous_stopover_city_table, we can see that the cheapest price
from Atlanta to El Paso means:

• We need to fly directly from Chicago to El Paso, and
• We need to fly directly from Denver to Chicago, and
• We need to fly directly from Atlanta to Denver.

This means that the following is our cheapest path:

`Atlanta -> Denver -> Chicago -> El Paso`

### The Efficiency of Dijkstra’s Algorithm

When we use a simple array for keeping track of the cities we haven’t visited
yet (unvisited_cities), our algorithm can take up to O(V2) steps. This is because
the worst-case scenario for Dijkstra’s algorithm is when each vertex has an
edge leading to every other vertex within the graph. In this case, for every
vertex we visit, we check the weight of the path from that vertex to every
other vertex. This is V vertices multiplied by V vertices, which is O(V2).

so, ``Dijkstra’s algorithm is O(V^2)` in the worst case.
