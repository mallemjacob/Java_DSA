import java.util.ArrayList;

public class ArrayLists {
  public static void main(String[] args) {

  ArrayList<String> fruits = new ArrayList<>();

  fruits.add("Apple");
  fruits.add("Banana");
  fruits.add("Mango");
  fruits.add("Orange");
  fruits.add("Grapes");
  System.out.println(fruits);
  
  fruits.remove("Mango");
  System.out.println(fruits);

  fruits.add(2, "Pineapple");
  System.out.println(fruits);

  fruits.set(1, "Strawberry");
  System.out.println(fruits);

  fruits.clear();
  System.out.println(fruits);

  }
}
