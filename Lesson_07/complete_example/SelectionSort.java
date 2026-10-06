package Lesson_07.complete_example;

public class SelectionSort {

  public static int[] selectionSort(int[] array) {
    int comparisions = 0;
    int swaps = 0;

    for(int i = 0; i < array.length - 1; i++){
      int lowestNumberIndex = i;

      for(int j = i + 1; j < array.length; j++){

        comparisions = comparisions + 1;
        if (array[j] < array[lowestNumberIndex]){
          lowestNumberIndex = j;
        }

      }

      swaps = swaps + 1;
      if(lowestNumberIndex != i){  // 3 != 0
          int temp = array[i];
          array[i] = array[lowestNumberIndex];
          array[lowestNumberIndex] = temp;
      }
    }
    System.out.println("Number of comparasions: " + comparisions);
    System.out.println("Number of swaps: " + swaps);

    return array;

  }


  public static void main(String[] args) {
    int[] array = {10,9,8,7,6,5,4,3,2,1};

    selectionSort(array);

    for (int number : array){
      System.out.print(number + " ");
    }
  }
}
