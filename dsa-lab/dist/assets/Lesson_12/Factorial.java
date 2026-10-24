public class Factorial {

  public static int factorial(int number) {
      if (number <= 1){
        return 1;
      } else {
        return number * factorial(number - 1);
      }
  }

  public static void main(String[] args) {
      int number = 5;

      int result = factorial(number);

      System.out.println("The factorial of 5 is " + result);
  }
}


// 5 * 4 * 3 * 2 * 1


//call

// enters the method

// return

// call stack




