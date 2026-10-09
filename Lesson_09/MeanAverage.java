public class MeanAverage {

  public static Integer averageOfEvenNumber(int[] array) {
      int sum = 0;
      int countOfEvenNumbers = 0;

      for (int number : array) {
        if (number % 2 == 0) {
          sum += number;
          countOfEvenNumbers++;
        }
      }

      if (countOfEvenNumbers == 0){
        return null;
      }

      return sum / countOfEvenNumbers;
  }

  public static void main(String[] args) {
      int [] numbers = {2,5,8,3,10};

      System.out.println(averageOfEvenNumber(numbers));

  }
}

// Input = 5
// Steps = 5 loops
// Efficentcy = 0(N)