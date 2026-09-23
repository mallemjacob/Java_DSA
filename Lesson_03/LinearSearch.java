public class LinearSearch {
  public static void main(String[] args){
    
    // O(n)
    // Ordered array - stop the loop when the value is greater than the value to search
    int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100};

    // O(n)
    // Unordered array - loop all the elements to find the value
    // int[] arr = {10,20,30,40,50,60,25};

    int target = 100;

    int index = linearsearch(arr, target);
    if (index != -1) {
        System.out.println("Element found at index: " + index);
      } else {
        System.out.println("Element not found");
      }

  }

  public static int linearsearch(int[] arr, int value_to_search){
    int count = 0;
    for (int i = 0; i < arr.length; i++){
      count = count + 1;
      if (arr[i] == value_to_search){
        System.out.println("Number of steps: " + count);
        return i;
      } else if (arr[i] > value_to_search){
        break;
      }
    }
    System.out.println("Number of steps: " + count);
    return -1;
  }
}