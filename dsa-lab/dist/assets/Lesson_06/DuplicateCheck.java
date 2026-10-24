public class DuplicateCheck {

  public static boolean hasDuplicateValue(int[] array) {
      int steps = 0;
      for (int i = 0; i < array.length; i++){
        for (int j = 0; j < array.length; j++){
          steps++;
          if (i != j && array[i] == array[j]){
            System.out.println("Steps: " + steps);
            return true;
          }
        }
      }
      System.out.println("Steps: " + steps);
      return false;
  }

  public static void main(String[] args) {
    int[] array = {1,5,3,9,1,4};

    boolean result = hasDuplicateValue(array);

    System.out.println(result);
      
  }
}
// 1 1  0 0
// 1 5  0 1
// 1 3  0 2
// 1 9  0 3
// 1 1  0 4


// 6 * 6 = 36
// n = 6
