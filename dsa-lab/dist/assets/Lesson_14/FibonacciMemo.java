import java.util.HashMap;
import java.util.Map;


public class FibonacciMemo {

  public static int fib(int n, Map<Integer, Integer> memo) {

    // base case
    if (n == 0 || n == 1){
      return n;
    }

    if (!memo.containsKey(n)){
      memo.put(n, fib(n - 2, memo) + fib(n - 1, memo));
    }

    return memo.get(n);
      
  }
  public static void main(String[] args) {
      Map<Integer, Integer> memo = new HashMap<>();

      System.out.println(fib(6, memo));

      System.out.println(memo);
  }
}
