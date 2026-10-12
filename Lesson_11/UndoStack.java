import java.util.ArrayDeque;
import java.util.Deque;

public class UndoStack {
  public static void main(String[] args) {
      

    // Empty stack
    Deque<String> actions = new ArrayDeque<>();

    actions.push("Type hello");
    actions.push("Type world");
    actions.push("Make text bold");

    System.out.println("Undo: " + actions.poll());
    System.out.println("Undo: " + actions.poll());

    System.out.println("Next action to undo: " + actions.peek());

  }
}
