import java.util.HashMap;

public class HashMapIndex {
  public static void main(String[] args) {

      int[] numbers = {61, 30, 91, 11, 54, 38, 72};

      HashMap<Integer, Integer> index = new HashMap<>();


      for (int number : numbers){
        index.put(number, 0);
      }

      System.out.println(index.containsKey(72));
      System.out.println(index.containsKey(100));
  }
}