public class Prime {

    public static boolean isPrime(int number) {
        int count = 0;
        if (number < 2) {
            return false;
        }

        for (int i = 2; i < number; i++) {     // i = 2; 2 < 7 --> 2,3,4,5,6
            count = count + 1;
            if (number % i == 0) {
                System.out.println(count);
                return false;
            }
        }
        System.out.println(count);
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(7));  // true
        System.out.println(isPrime(10)); // false
    }
}

// input
// steps
// effciency
