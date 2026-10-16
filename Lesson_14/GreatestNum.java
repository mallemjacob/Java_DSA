import java.util.Arrays;

public class GreatestNum {

  public static Integer max(int[] array) {
      if (array.length == 0){
        return null;
      }

      if (array.length == 1){
        return array[0];
      }

      int[] remainingArray = Arrays.copyOfRange(array, 1, array.length); 

      int maxOfRemaining = max(remainingArray);

      if (array[0] > maxOfRemaining){
        return array[0];
      } else {
        return maxOfRemaining;
      }
  }

  public static void main(String[] args) {
      int[] array = {4, 9, 2, 7, 5};

      System.out.println(max(array));
  }
}
