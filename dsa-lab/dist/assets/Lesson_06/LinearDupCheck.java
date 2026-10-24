public class LinearDupCheck {

  public static boolean hasDuplicateValue(int[] array) {

      int steps = 0;
      int[] existingNumbers = new int[11];

      // existingNumbers = [*, 1, *, 1, *, 1, *, *, *, 1, *]

      // existingNumbers[1]
      // existingNumbers[5]
      // existingNumbers[3]
      // existingNumbers[9]
      // existingNumbers[1]
      // existingNumbers[4]

      for (int i = 0; i < array.length; i++){

        // array[i] --> array[0] --> 1
        // existingNumbers[1]
        steps++;
        if (existingNumbers[array[i]] == 1) {
            System.out.println("Steps: " + steps);
            return true;
        } else {
          existingNumbers[array[i]] = 1;
        }
                                               
      }
      System.out.println("Steps: " + steps);
      return false;
  }

  public static void main(String[] args) {
    int[] array = {1,5,3,9,1,4}; 
    // indexes  =  0,1,2,3,4,5
    // array[0] = 1
    // array[1] = 5

    boolean result = hasDuplicateValue(array);

    System.out.println(result);
      
  }
}



// 0,1,2,3,4,5,6,7,8,9,10