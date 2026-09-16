public class LinearSearch {

    public static Integer linearSearch(int[] array, int searchValue) {

        for (int index = 0; index < array.length; index++) {

            if (array[index] == searchValue) {
                return index;
            } 
            else if (array[index] > searchValue) {
                break;
            }
        }

        return null;
    }

    public static void main(String[] args) {

        int[] array = {3, 17, 75, 80, 202};

        System.out.println(linearSearch(array, 22));
    }
}