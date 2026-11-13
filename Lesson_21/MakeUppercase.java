// public class MakeUppercase {

//     public static String[] makeUppercase(String[] array) {

//         String[] newArray = new String[array.length];
//         // "HELLO", "WORLD", "JAVA"

//         for (int i = 0; i < array.length; i++) {
//             newArray[i] = array[i].toUpperCase();
//         }

//         // Original array --> loop (uppercase) -> new array

//         return newArray;
//     }

//     public static void main(String[] args) {

//         String[] words = {"hello", "world", "java"};

//         String[] result = makeUppercase(words);

//         for (String word : result) {
//             System.out.println(word);
//         }
//     }
// }


public class MakeUppercase {

    public static String[] makeUppercase(String[] array) {

        for (int i = 0; i < array.length; i++) {
            array[i] = array[i].toUpperCase();
        }

        return array;
    }

    public static void main(String[] args) {

        String[] words = {"hello", "world", "java"};

        String[] result = makeUppercase(words);

        for (String word : result) {
            System.out.println(word);
        }
    }
}