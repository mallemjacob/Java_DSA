public class InsertionSort {


  public static int[] insertionSort(int[] array) {
      for (int i = 1; i < array.length; i++) { // i = 3
        int tempValue = array[i];  // tempValue = array[3] --> tempValue = 1
        int position = i - 1; // 3 - 1 = 2 --> position = 2

        
        while (position >= 0) { // - 1 >= 0 --> position = -1
            if (array[position] > tempValue) { // array[0] > 1 --> 2 > 1 --> true
              array[position + 1] = array[position]; // array[1] = array[0]
              position = position - 1; // position = 0 - 1; // position = -1;
            } else {
                break;
            }
        }

        array[position + 1] = tempValue; //array[0] = 1

      }
      return array;
  }


  public static void main(String[] args) {
      int[] array = {4,2,7,1,3};

      insertionSort(array);


      for (int number : array){
        System.out.println(number + " ");
      }
  }  
}
