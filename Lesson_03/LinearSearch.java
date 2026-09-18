public class LinearSearch {
  public static void main(String[] args){
    
    // O(n)
    // Ordered array - stop the loop when the value is greater than the value to search
    int[] arr = {10,20,30,40,50,60};

    // O(n)
    // Unordered array - loop all the elements to find the value
    // int[] arr = {10,20,30,40,50,60,25};

    
    System.out.println(linearsearch(arr, 60));

  }

  public static int linearsearch(int[] arr, int value_to_search){
    for (int i = 0; i < arr.length; i++){
      if (arr[i] == value_to_search){
        return i;
      } else if (arr[i] > value_to_search){
        break;
      }
    }
    return -1;
  }
}