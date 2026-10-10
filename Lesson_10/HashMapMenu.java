import java.util.HashMap;

public class HashMapMenu {
  public static void main(String[] args) {
      HashMap<String, Double> menu = new HashMap<>();

      menu.put("french fries", 0.75);
      menu.put("hamburger", 2.50);
      menu.put("hot dog", 1.50);
      menu.put("soda", 0.60);


      System.out.println(menu.get("french fries"));
      System.out.println(menu.get("hamburger"));
      System.out.println(menu.get("hot dog"));
      System.out.println(menu.get("soda"));

      System.out.println("Soda key exists: ");
      System.out.println(menu.containsKey("soda"));

      System.out.println(menu.containsKey("apple"));

      menu.remove("soda");

      System.out.println("Soda key exists: ");
      System.out.println(menu.containsKey("soda"));
  }
}