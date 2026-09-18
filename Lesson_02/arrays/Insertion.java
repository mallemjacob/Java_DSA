public class Insertion {
  public static void main(String[] args) {

    // Insertion O(n)
    int[] arr = new int[6];

    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    arr[3] = 40;
    arr[4] = 50;

    int size = 5;

    int index = 2;
    int value = 60;

    for (int i = size; i > index; i--){
      arr[i] = arr[i - 1];    // arr[3] = arr[2] ---> 50
    }

    arr[index] = value;
    size++;

    for (int i = 0; i < size; i++){
      System.out.println(arr[i]);
    }

  }
}
