public class ArrayInsert {
  public static void main(String[] args){
      // Array Insertion   
      // int[] arr = new int[6];

      // arr[0] = 10;
      // arr[1] = 20;
      // arr[2] = 30;
      // arr[3] = 40;
      // arr[4] = 50;

      // int size = 5;

      // int index = 2;
      // int value = 70;

      // for (int i = size; i > index; i--){
      //     arr[i] = arr[i - 1];
      // }

      // arr[index] = value;
      // size++;

      // for (int i = 0; i < size; i++){
      //     System.out.println(arr[i]);
      // }


      // Array Deletion
      int[] arr = {10, 20, 30, 40, 50};

      int size = 5;
      int index = 2;

      for (int i = index; i < size - 1; i++){
          arr[i] = arr[i + 1];
      }
      // for (int i = 2; i < 4; i++){
      //     arr[i] = arr[i + 1];
      // }
      size--;
      for (int i = 0; i < size; i++) {
            System.out.println(arr[i]);
        }

  }
}