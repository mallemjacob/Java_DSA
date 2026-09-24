public class LeapYear {

     public static boolean isLeapYear(int year) {
        int count = 0;
        if (year % 100 == 0) {
            count = count + 1;
            if (year % 400 == 0) {
                System.out.println(count);
                return true;
            } else {
                System.out.println(count);
                return false;
            }
        }
        count = count + 1;
        System.out.println(count);
        return year % 4 == 0;
     }

     public static void main(String[] args) {
         System.out.println(isLeapYear(2024)); // true
         System.out.println(isLeapYear(1900)); // true
         System.out.println(isLeapYear(2000)); // false
         System.out.println(isLeapYear(2023)); // false
     }
    }

// input
// steps
// effciency
