import java.util.ArrayDeque;
import java.util.Queue;


public class PrintManager {

  Queue<String> printQueue = new ArrayDeque<>();


  public void addPrintJob(String document) {
      printQueue.offer(document);
      System.out.println("Added: " + document);
  }

  public void printDocuments(){
    while (!printQueue.isEmpty()) { 
        String document = printQueue.poll();

        System.out.println("Printing: " + document);
    }
  }

  public static void main(String[] args) {
      PrintManager printer = new PrintManager();

      printer.addPrintJob("Resume.pdf");
      printer.addPrintJob("Project.pdf");
      printer.addPrintJob("Assignment.pdf");

      System.out.println("--- Printing documents ---");

      printer.printDocuments();
  }
  
}
