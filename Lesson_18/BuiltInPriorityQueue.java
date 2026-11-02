
import java.util.Collections;
import java.util.Comparator;
import java.util.PriorityQueue;



public class BuiltInPriorityQueue {

  static class Patient {
    final String name;
    final int severity;
    final long arrivalOrder;

        public Patient(String name, int severity, long arrivalOrder) {
            this.name = name;
            this.severity = severity;
            this.arrivalOrder = arrivalOrder;
        }

        @Override 
        public String toString(){
          return name + " Severity  " + severity;
        }
  }

  public static void main(String[] args) {
   demonstrateMinHeap();
   demonstrateMaxHeap();
   demonstrateHospitalTriage();  
  }


  public static void demonstrateMinHeap() {
      System.out.println("1. Min Heap");
      PriorityQueue<Integer> minHeap = new PriorityQueue<>();

      for (int value: new int[] {40, 10, 30, 20, 50}){
        minHeap.offer(value);
      }

      System.out.println("Peek smallest " + minHeap.peek());
      System.out.println("Poll order");

      while (!minHeap.isEmpty()) { 
          System.out.println(minHeap.poll());
          System.out.println(minHeap.isEmpty() ? "\n" : " ");
      }
      System.out.println("");
  }

  private static void demonstrateMaxHeap() {
    System.out.println("2. Max Heap");
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

    int[] initialValues = {100, 88, 25, 87, 16, 8, 12, 86, 50, 2, 15, 3};

    for (int value : initialValues){
      maxHeap.offer(value);
    }

    System.out.println("Before insert, highest: " + maxHeap.peek());
    maxHeap.offer(40);
    System.out.println("After inserting 40, highest: " + maxHeap.peek());
    System.out.println("Poll highest: " + maxHeap.poll());
    System.out.println("New highest: " + maxHeap.peek());
    System.out.println("Heap size: " + maxHeap.size());
  }


  private static void demonstrateHospitalTriage() {
    System.out.println("Hospital Triage");

    Comparator<Patient> priorityRules = Comparator.comparingInt((Patient p) -> p.severity).reversed().thenComparingLong(p -> p.arrivalOrder);

    PriorityQueue<Patient> patients = new PriorityQueue<>(priorityRules);

    patients.offer(new Patient("Patient A", 6, 0));
    patients.offer(new Patient("Patient B", 4, 1));
    patients.offer(new Patient("Patient C", 10, 2));
    patients.offer(new Patient("Patient D", 2, 3));
    patients.offer(new Patient("Patient E", 3, 4));
    

    System.out.println("Next patient: " + patients.peek());

    System.out.println("Treatment order: ");

    while (!patients.isEmpty()) { 
        System.out.println(" " + patients.poll());
    }

    System.out.println("After all patients, peek: " + patients.peek());

  }
}