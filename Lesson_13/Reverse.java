public class Reverse {


  public static String reverse(String str) {
      
    // base case
    if (str.isEmpty()){
      return "";
    }

    // recursion
    return reverse(str.substring(1)) + str.charAt(0);

  }
  
  public static void main(String[] args) {
      String str = "abcde";

      System.out.println(reverse(str));
  }

}
