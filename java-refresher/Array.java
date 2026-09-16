public class Array {
  public static void main(String[] args) {

    // int[] arr = {10, 20, 30, 40};

    // for (int i = 0; i < arr.length; i++) {
    //   System.out.println("Element at index " + i + ": " + arr[i]);
    // }

    // int[] numbers = {10, 20, 30, 40};

    // System.out.println(numbers[0]); // Output: 10

    // numbers[0] = 100; // Update the value at index 0

    // System.out.println(numbers[0]); // Output: 100

    // String[] fruits = {"Apple", "Banana", "Mango", "Orange", "Grapes"};

    // System.out.println(fruits[0]); // Apple
    // System.out.println(fruits[2]); // Mango

    // for (int i = 0; i < fruits.length; i++) {
    //   System.out.println(fruits[i]);
    // }
    
    int[] arr = {10, 20, 30, 40};

    for (int i = 0; i < arr.length; i++){
      if (arr[i] == 80) {
        System.out.println("Found 80 at index: " + i);
        break;
      } else {
        System.out.println("Element at index " + i + ": " + arr[i]);
      }
    }

  }
}


// my computer = 10 secs, 8gb,i5
// your computer = 5 sec, 16gb, i7

// server = 1 sec, 64gb, Xeon