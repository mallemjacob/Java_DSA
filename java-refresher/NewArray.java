public class NewArray {
  public static void main(String[] args) {

    int[] arr = {10, 20, 30, 40, 50};

    // Reading elements from the array O(1)
    System.out.println(arr[0]);
    System.out.println(arr[1]);
    System.out.println(arr[2]);
    System.out.println(arr[3]);
    System.out.println(arr[4]);


    // Index ---> Value
    String[] fruits = {"apples", "babanas", "cucumbers", "dates", "elderberries"};

    System.out.println(fruits[0]);
    System.out.println(fruits[3]);

    // Searching for an element in the array O(n)
    // Value ---> Index


    // Big-0? O(n)
    // Worst case scenario
    // 10 elements in the array -- 10 steps
    // 1 million elements in the array -- 1 million steps
    // n = 1 million ---> 1 million steps

  for (int i = 0; i < arr.length; i++) {
      if (arr[i] == 70) {
        System.out.println(i);
      }
    }

    // RAM = Random Access MMemory
    // 1010 ---> 10
    // 1011 ---> 20
    // 1012 ---> 30
    // 1013 ---> 40
    // 1014 ---> 50
  }
}