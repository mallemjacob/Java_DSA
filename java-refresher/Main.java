import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        ArrayList<String> fruits = new ArrayList<>();

        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Mango");
        fruits.add("Orange");

        System.out.println(fruits);


        // Read
        System.out.println(fruits.get(2));     // Mango

        // Add to end
        fruits.add("Grapes");

        // Insert at index 1
        fruits.add(1, "Pineapple");

        // Update index 2
        fruits.set(2, "Watermelon");

        // Delete by index
        fruits.remove(2);

        // Delete by value
        fruits.remove("Mango");

        // Number of elements
        System.out.println(fruits.size());
    }
}