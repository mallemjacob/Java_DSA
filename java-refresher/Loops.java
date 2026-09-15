public class Loops {
  public static void main(String[] args) {
    // while loop example
    int i = 0;
    while (i < 5) {
      System.out.println("Value of i: " + i);
      i++;
    }

    // do-while loop example
    int j = 0;
    do {
      System.out.println("Value of j: " + j);
      j++;
    } while (j < 5);

    // for loop example
    for (int k = 0; k < 5; k++) {   
      System.out.println("Value of k: " + k);
    }

    // enhanced for loop example
    int[] arr = {10, 20, 30, 40};
    for (int num : arr) {
      System.out.println("Element: " + num);  
    }

    // Finding the largest value
    int[] arr1 = {10, 50, 20, 90, 30};
    int largest = arr1[0];
    for (int k = 1; k < arr1.length; k++) {

    if (arr1[k] > largest) {
        largest = arr1[k];
    }
  }
    System.out.println("The largest value is: " + largest);


    ///////////////////////////////////////////
  }
}
