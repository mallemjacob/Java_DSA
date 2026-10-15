public class FactorialTD {

    public static int factorial(int number) {

        // Base case
        if (number <= 1) {
            return 1;
        } else {
            // Recursive call
            return number * factorial(number - 1);
            //return 5 * factorial(4)
            // return 4 * factoral(3)
            // return 3 * factorial(2)
            // return 2 * factorial(1)
        }
    }

    public static void main(String[] args) {

        int number = 5;

        System.out.println(factorial(number));
    }
}