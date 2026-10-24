import java.util.ArrayDeque;
import java.util.Queue;


public class QueueDemo {
  public static void main(String[] args) {
      Queue<Integer> queue = new ArrayDeque<>();

      //Enqueue
      queue.offer(10);
      queue.offer(20);
      queue.offer(30);

      System.out.println("Queue: " + queue);
      System.out.println("Size: " + queue.size());


      // Read
      System.out.println("Peek: " + queue.peek());

      // Dequeue
      System.out.println("Removed: " + queue.poll());
      System.out.println("Removed: " + queue.poll());

      System.out.println("Queue: " + queue);
      System.out.println("Size: " + queue.size());

      System.out.println("Is empty? " + queue.isEmpty());
  }
}
