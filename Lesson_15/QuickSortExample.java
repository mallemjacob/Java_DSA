import java.util.Arrays;


public class QuickSortExample {


  public static void quicksort(int[] arr, int low, int high) { // arr, low = 0, high = 6
      if (low < high){

          int pivotIndex = partition(arr, low, high); // pivotIndex = 2;

          // {1, 0, 2, 7, 3, 10, 8};


          // {1, 0}
          quicksort(arr, low, pivotIndex - 1); // arr, low = 0,  high = 1


          // {7, 3, 10, 8}
          quicksort(arr, pivotIndex + 1, high); // arr, 3, 6
      }
  }


  public static int partition(int[] arr, int low, int high) { // arr, low = 0, high = 6
      
      int pivot = arr[high]; // arr[6] = 2; pivot = 2

      int i = low - 1; // i = 0 - 1 --> i = -1

      for (int j = low; j < high; j++){ // int j = 6; 6 < 6; 
          if (arr[j] <= pivot){ // arr[5] --> 10 <= 2
              i++; // i = 1

              // swap
              int temp = arr[i]; // arr[1] --> temp = 3
              arr[i] = arr[j]; // arr[1] = 0
              arr[j] = temp; // arr[4] = 3

              // {1, 0, 8, 7, 3, 10, 2};
          }
      }

      // place pivot in the correct position
      int temp = arr[i + 1]; // arr[1 + 1] --> arr[2] --> 8
      arr[i + 1] = arr[high]; // arr[2] = 2
      arr[high] = temp; // arr[6] = 8

       // {1, 0, 2, 7, 3, 10, 8};

      return i + 1; // 2
          
  }


  public static void main(String[] args) {

      int[] arr = {8, 3, 1, 7, 0, 10, 2};

      quicksort(arr, 0, arr.length - 1);


      System.out.println(Arrays.toString(arr));
  }
}

//    smaller     2     larger