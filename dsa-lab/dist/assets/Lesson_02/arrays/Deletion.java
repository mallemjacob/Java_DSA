public class Deletion {
  public static void main(String[] args) {

    // Deletion O(n)
    int[] arr = {10,20,30,40,50};
    
    int size = 5;
    int index = 2;

    for (int i = index; i < size - 1; i++){
      arr[i] = arr[i + 1];
    }

    size--;

    for (int i = 0; i < size; i++) {
      System.out.println(arr[i]);
    }

  }
}
