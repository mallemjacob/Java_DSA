
import java.util.ArrayDeque;
import java.util.Deque;

public class StackDemo {
  public static void main(String[] args) {
      
    // Empty stack
    Deque<Integer> stack = new ArrayDeque<>();

    // Insert elements
    stack.push(10);
    stack.push(20);
    stack.push(30);


    System.out.println("Stack: " + stack);


    //Read
    System.out.println("Peek: " + stack.peek());

    System.out.println("Size: " + stack.size());

    System.out.println("Is empty? " + stack.isEmpty());


    // // Remove
    // System.out.println("Pop: " + stack.pop());


    // System.out.println("Stack: " + stack);

    // //Read
    // System.out.println("Peek: " + stack.peek());


    // System.out.println("Pop: " + stack.pop());

    //  System.out.println("Stack: " + stack);

    // //Read
    // System.out.println("Peek: " + stack.peek());

  }
}