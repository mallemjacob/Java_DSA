
import java.util.Arrays;

// Word Builder


// inout --> {"a","b","c","d"} --->  4 * 4 ---> 16, 5 * 5 --> 25, 10 * 10 --> 100


// output --> ab, ac, ad,  ba, bc, bd  ca, cb, cd,  da, db, dc ---> 12

public class WordBuilder {

  public static String[] wordBuilder(String[] array) {
      String[] collection = new String[array.length * (array.length - 1) * (array.length - 2)]; // 12

      int index = 0;

      for (int indexI = 0; indexI < array.length; indexI++){
        for (int indexJ = 0; indexJ < array.length; indexJ++){
          for (int indexK = 0; indexK < array.length; indexK++){
              if (indexI != indexJ && indexJ != indexK && indexI != indexK) {
                    collection[index] = array[indexI] + array[indexJ] + array[indexK];
                    index++;
          }
          }          
        }
      }

      return collection;
  }

  public static void main(String[] args) {
      String[] letters = {"a","b","c","d"};

      String[] result = wordBuilder(letters);

      System.out.println(Arrays.toString(result));

  }
}


// Input = 4
// Steps = 16
// Efficentcy = 0(N^2)