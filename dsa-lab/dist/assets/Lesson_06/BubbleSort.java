public class BubbleSort {


  public static int[] bubbleSort(int[] array) {
      int last_index = array.length - 1; 
      boolean sorted = false;

      while (!sorted) { 
        sorted = true;
        
        for (int i = 0; i < last_index; i++){
          if (array[i] > array[i + 1]) {

            // array[i] -> largest, array[i + 1] -> smallest

            // swap
            int temp = array[i];
            array[i] = array[i + 1];
            array[i + 1] = temp;

            sorted = false;
          }
        }

        last_index--;
          
      }

      return array;

  }

  public static void main(String[] args) {
      int[] numbers = {4,2,7,1,3};

      bubbleSort(numbers);

      for (int number : numbers){
          System.out.println(number + " ");
      }
  }
}