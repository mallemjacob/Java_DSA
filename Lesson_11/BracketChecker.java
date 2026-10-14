import java.util.ArrayDeque;
import java.util.Deque;


public class BracketChecker { 

  public static boolean isBalanced(String text) {
      Deque<Character> stack = new ArrayDeque<>();

      // '{','[','(', ')',']','}'};


      for (char ch : text.toCharArray()){

        if (ch == '(' || ch == '{' || ch == '['){
          stack.push(ch);
        } else if (ch == ')' || ch == '}' || ch == ']'){

          if (stack.isEmpty()){
            return false;
          }
          
          char open = stack.pop(); // open = '{',   ch = '}'

          if (ch == ')' && open != '(' || ch == '}' && open != '{' || ch == ']' && open != '['){
            return false;
          }

        }
      }
      
      return stack.isEmpty();

  }

  public static void main(String[] args) {
    
    System.out.println(isBalanced("{[()]}"));
    System.out.println(isBalanced("{[(])}"));
    System.out.println(isBalanced("((10 + 20))"));
      
  }  
 }

// Effeciency = O(1)
// Bracket checker = O(N)