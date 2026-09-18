public class NewArray {
  public static void main(String[] args) {

    // int[] arr = {10, 20, 30, 40, 50};

    // Reading elements from the array O(1)

    // System.out.println(arr[0]);
    // System.out.println(arr[1]);
    // System.out.println(arr[2]);
    // System.out.println(arr[3]);
    // System.out.println(arr[4]);


    // // Index ---> Value
    // String[] fruits = {"apples", "babanas", "cucumbers", "dates", "elderberries"};

    // System.out.println(fruits[0]);
    // System.out.println(fruits[3]);

    // Searching for an element in the array O(n)
    // Value ---> Index


    // Big-0? O(n)
    // Worst case scenario
    // 10 elements in the array -- 10 steps
    // 1 million elements in the array -- 1 million steps
    // n = 1 million ---> 1 million steps

  // for (int i = 0; i < arr.length; i++) {
  //     if (arr[i] == 70) {
  //       System.out.println(i);
  //     }
  //   }

    // Update

    // RAM = Random Access Memory
    // 1010 ---> 10
    // 1011 ---> 20
    // 1012 ---> 30
    // 1013 ---> 40
    // 1014 ---> 50


    // Insertion 0(n)
    // int[] arr = new int[6];

    // arr[0] = 10;
    // arr[1] = 20;
    // arr[2] = 30;
    // arr[3] = 40;
    // arr[4] = 50;

    // int size = 5;

    // int index = 2;
    // int value = 60;

    // // for (int i = 0; i < 5; i++){
    // //   System.out.println(i);
    // // }

    // // for (int i = 5; i > 2; i--){
    // for (int i = size; i > index; i--){
    //   arr[i] = arr[i - 1];    // arr[3] = arr[2] ---> 50
    // }

    // arr[index] = value;
    // size++;

    // for (int i = 0; i < size; i++){
    //   System.out.println(arr[i]);
    // }

    // Deletion O(n)
    // int[] arr = {10,20,30,40,50};
    
    // int size = 5;
    // int index = 2;

    // // for (int i = 2; i < 4; i++){
    
    // for (int i = index; i < size - 1; i++){
    //   arr[i] = arr[i + 1];
    // }

    // size--;

    // for (int i = 0; i < size; i++) {
    //   System.out.println(arr[i]);
    // }

    // 1,2,3,4,5,6

    for (int i = 1; i < 6; i++) {
      System.out.println(i);
    }

    System.out.println("-----");

    // 5,4,3,2,1,0
    for (int i = 5; i > 0; i--){
      System.out.println(i);
    }
  }
}




// Reading an array - O(1) - Constant time
// Searching an array - O(n) - Linear time