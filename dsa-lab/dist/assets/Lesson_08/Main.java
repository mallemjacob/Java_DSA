import java.util.ArrayList;

public class Main {

  public static ArrayList<Integer> intersection(int[] firstArray, int[] secondArray) {

      ArrayList<Integer> result = new ArrayList<>();

      int comparisions = 0;

      for (int i : firstArray){
        for (int j : secondArray){
          comparisions = comparisions + 1;
          if (i == j) {
            result.add(i);
            break;
          }
        }
      }

      System.out.println(comparisions);

      return result;
  }


  public static void main(String[] args) {

    int[] firstArray = {3,1,4,2};
    int[] secondArray = {4,5,3,6,7};

    ArrayList<Integer> result = intersection(firstArray, secondArray);

    System.out.println(result);
      
  }
}


// Comparisons = 12
// Indentical = 10

// O(N + N) --> 2N ---> O(N)

// O(N * M)
