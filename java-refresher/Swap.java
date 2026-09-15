public class Swap {
  public static void main(String[] args) {
    int a = 10;
    int b = 20;

    System.out.println("Before swapping:");
    System.out.println("a = " + a);
    System.out.println("b = " + b);

    int temp = a;
    a = b;
    b = temp;

    System.out.println("After swapping:");
    System.out.println("a = " + a);
    System.out.println("b = " + b);


    int number = 12;
    boolean result = number > 0 && number % 2 == 0;
    System.out.println("Is the number positive and even? " + result);
  }
}
