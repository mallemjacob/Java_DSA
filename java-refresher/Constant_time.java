public class Constant_time {
  // Constant time complexity O(1)
  public static void main(String[] args) {
    int[] arr = {10, 20, 30, 40, 50, 60, 70, 80};  // n = 8

    System.out.println("Element at index 3: " + arr[3]);  // O(1) operation


    // number of operations = 8
    // O(n)
    for (int i = 0; i < arr.length; i++) {
      System.out.println("Element at index " + i + ": " + arr[i]);
    }
  }
}


// is my program working, did i get solutoion
// how many operations are performed , 100, 100, O(n)
