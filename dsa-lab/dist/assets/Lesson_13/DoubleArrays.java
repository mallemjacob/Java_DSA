
import java.util.Arrays;


public class DoubleArrays {

  public static void doubleArray(int[] array) {
      doubleArray(array, 0);
  }

  private static void doubleArray(int[] array, int index) {
      
    if (index >= array.length){
      return;
    }

    array[index] = array[index] * 2; // {2,4,6,8,10,12};  6

    doubleArray(array, index + 1);

  }

  public static void main(String[] args) {
      int[] numbers = {1,2,3,4,5,6};

      doubleArray(numbers);

      System.out.println(Arrays.toString(numbers));

  }
}