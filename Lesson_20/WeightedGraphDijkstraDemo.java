
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class WeightedGraphDijkstraDemo {

    // Represents one city (vertex) in the weighted graph.
    static class City {

        String name;

        // Destination city -> flight price.
        Map<City, Integer> routes = new LinkedHashMap<>();

        City(String name) {
            this.name = name;
        }

        // Adds a directed weighted edge.
        void add_route(City city, int price) {

            // Dijkstra requires non-negative weights.
            if (price < 0) {
                throw new IllegalArgumentException(
                    "Dijkstra requires non-negative weights."
                );
            }

            routes.put(city, price);
        }

        @Override
        public String toString() {
            return name;
        }
    }

    // Dijkstra's algorithm.
    static List<String> dijkstra_shortest_path(
            City starting_city, City final_destination) {

        // Stores the cheapest known price to each city.
        Map<String, Integer> cheapest_prices_table =
            new HashMap<>();

        // Stores the previous city in the cheapest route.
        Map<String, String> cheapest_previous_stopover_city_table =
            new HashMap<>();

        // Cities discovered but not yet visited.
        List<City> unvisited_cities = new ArrayList<>();

        // Records cities whose cheapest prices are finalized.
        Map<String, Boolean> visited_cities = new HashMap<>();

        // Starting city costs zero.
        cheapest_prices_table.put(starting_city.name, 0);

        // Initially, only the starting city is unvisited.
        unvisited_cities.add(starting_city);

        City current_city = starting_city;

        while (!unvisited_cities.isEmpty()) {

            // Mark current city as visited.
            visited_cities.put(current_city.name, true);

            // Remove it from unvisited cities.
            unvisited_cities.remove(current_city);

            // Examine every adjacent city.
            for (City adjacent_city : current_city.routes.keySet()) {

                // Get the price of the direct flight.
                int price = current_city.routes.get(adjacent_city);

                // Add the adjacent city if it is new and unvisited.
                if (!Boolean.TRUE.equals(
                        visited_cities.get(adjacent_city.name))
                        && !unvisited_cities.contains(adjacent_city)) {

                    unvisited_cities.add(adjacent_city);
                }

                // Calculate total price through current city.
                int price_through_current_city =
                    cheapest_prices_table.get(current_city.name) + price;

                // Check whether this is the first route
                // or whether this route is cheaper.
                if (!cheapest_prices_table.containsKey(adjacent_city.name)
                        || price_through_current_city
                        < cheapest_prices_table.get(adjacent_city.name)) {

                    // Update cheapest price.
                    cheapest_prices_table.put(
                        adjacent_city.name,
                        price_through_current_city
                    );

                    // Remember the previous city.
                    cheapest_previous_stopover_city_table.put(
                        adjacent_city.name,
                        current_city.name
                    );
                }
            }

            // Find the cheapest unvisited city.
            int cheapest_price = Integer.MAX_VALUE;

            City next_city = null;

            for (City city : unvisited_cities) {

                if (cheapest_prices_table.get(city.name)
                        < cheapest_price) {

                    current_city = city;
                    next_city = city;

                    cheapest_price =
                        cheapest_prices_table.get(city.name);
                }
            }

            if (next_city == null) {
                break;
            }
        }

        // Check whether the destination is reachable.
        if (!cheapest_prices_table.containsKey(final_destination.name)) {
            return new ArrayList<>();
        }

        // Reconstruct the shortest path backwards.
        List<String> shortest_path = new ArrayList<>();

        String current_city_name = final_destination.name;

        while (current_city_name != null) {

            shortest_path.add(0, current_city_name);

            current_city_name =
                cheapest_previous_stopover_city_table.get(
                    current_city_name
                );
        }

        System.out.println(
            "Cheapest total price: $" +
            cheapest_prices_table.get(final_destination.name)
        );

        return shortest_path;
    }

    public static void main(String[] args) {

        // Create cities.
        City atlanta = new City("Atlanta");
        City boston = new City("Boston");
        City chicago = new City("Chicago");
        City denver = new City("Denver");
        City el_paso = new City("El Paso");

        // Add directed weighted edges.
        atlanta.add_route(boston, 100);
        atlanta.add_route(denver, 160);

        boston.add_route(chicago, 120);
        boston.add_route(denver, 180);

        denver.add_route(chicago, 40);
        denver.add_route(el_paso, 140);

        chicago.add_route(el_paso, 80);

        el_paso.add_route(boston, 100);

        // Find cheapest route from Atlanta to El Paso.
        List<String> shortest_path =
            dijkstra_shortest_path(atlanta, chicago);

        if (shortest_path.isEmpty()) {

            System.out.println("No route found.");

        } else {

            System.out.println(
                "Cheapest route: " +
                String.join(" -> ", shortest_path)
            );
        }
    }
}
