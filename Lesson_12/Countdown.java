public class Countdown {

  public static void countdown(int number) {

      // Base case
      if (number < 0) {
        return;
      }

      System.out.println(number);
      
      // Recursive call
      countdown(number - 1);
    }
  public static void main(String[] args) {
      countdown(5);
  }
}


// 5
// 4
// 3
// 2
// 1
// 0
// -----base case
// -1
// -2
// -3