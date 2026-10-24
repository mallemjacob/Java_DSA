// Bottom-up

// public class FactorialBU {

//   public static int factorial(int n) {
//       int result = 1;

//       for (int i = 1; i <= n; i++){
//         result = result * i;
//       }

//       return result;
//   }

//   public static void main(String[] args) {
//       System.out.println(factorial(6));
//   }  
// }


public class FactorialBU {

  public static int factorial(int n) {
      return factorial(n, 1, 1);
  }

  public static int factorial(int n, int i, int product) {
      if (i > n){
        return product;
      }

      return factorial(n, i + 1, product * i);
  }

  public static void main(String[] args) {
      System.out.println(factorial(6));
  }
}