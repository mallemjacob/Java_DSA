public class Sum {

     public static int arraySum(int[] array) {
         int sum = 0;

         int count = 0;

         for (int number : array) {
             count = count + 1;
             sum += number;
         }

         System.out.println("Steps: " + count);
         return sum;
     }

     public static void main(String[] args) {
         int[] numbers = {10, 20, 30, 40, 50};
         System.out.println("Input: " + numbers.length);

         System.out.println(arraySum(numbers));
     }
    }