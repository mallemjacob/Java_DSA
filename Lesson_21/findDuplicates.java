public class findDuplicates {

  public static void findDup(int[] numbers) {

      for (int i = 0; i < numbers.length; i++) {

          for (int j = i + 1; j < numbers.length; j++) {

              if (numbers[i] == numbers[j]) {
                  System.out.println(numbers[i]);
              }
          }
      }
  }

    public static void main(String[] args) {

        int[] nums = {1,2,3,4,5,5,7,1,2,8}; // n = 10

        findDup(nums);
        
    }
}


// space = O(1)
// time = O(n^2)