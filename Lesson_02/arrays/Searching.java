public class Searching {
  public static void main(String[] args) {


    // Searching for an element in the array O(n)
    // Value ---> Index


    // Big-0? O(n)
    // Worst case scenario
    // 10 elements in the array -- 10 steps
    // 1 million elements in the array -- 1 million steps
    // n = 1 million ---> 1 million steps
  
    int[] arr = {10, 20, 30, 40, 50};
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == 30) {
          System.out.println(i);
        }
      }

    // Update

    // RAM = Random Access Memory
    // 1010 ---> 10
    // 1011 ---> 20
    // 1012 ---> 30
    // 1013 ---> 40
    // 1014 ---> 50


  }
}
