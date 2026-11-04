import java.util.ArrayList;
import java.util.NoSuchElementException;
// import java.util.PriorityQueue;


public class HeapAndPriorityQueueDemo {

  static final class MaxHeap {
      private final ArrayList<Integer> data = new ArrayList<>();
      private boolean showSteps = false;

      public void showSteps(boolean enabled) {
        showSteps = enabled;
      }

      private int parentIndex(int index) { // childIndex = 5
        return (index - 1) / 2; // 4 / 2 = 2
      }

      private int leftChildIndex(int index){ // index = 2
          return  2 * index + 1; // 4 + 1 = 5
      }

      private int rightChildIndex(int index){ // index = 2
          return 2 * index + 2; // 4 + 2 = 6
      }      

      public boolean isEmpty(){
        return data.isEmpty();
      }

      public int size(){
        return data.size();
      }

      public int peek(){
        if (isEmpty()){
          throw new NoSuchElementException("Cannot peek: heap is empty");
        }
        return data.get(0);
      }

      public int lastNode(){
        if (isEmpty()){
          throw new NoSuchElementException("Cannot read last node: heap is empty");
        }
        return data.get(data.size() - 1);
      }

      public void insert(int value) {
          data.add(value);
          int current = data.size() - 1;

          if (showSteps) {
            System.out.println(" Add " + value + " at index " + current + ": " + data);
          }

          while (current > 0) { 
              int parent = parentIndex(current);

              if (data.get(current) <= data.get(parent)){
                break;
              }

              if (showSteps){
                System.out.println(" Swap " + data.get(current) + " with parent " + data.get(parent));
              }

              swap(current, parent);
              current = parent;
              
              if (showSteps){
                System.out.println(" Heap: " + data);
              }              
          }
      }

      public int pop(){
        if (isEmpty()){
          throw new NoSuchElementException("Cannot pop head: heap is empty");
        }

        int largest = data.get(0);
        int last = data.remove(data.size() - 1);

        if (data.isEmpty()){
          return largest;          
        }
        data.set(0, last);
        int current = 0;

        if (showSteps){
          System.out.println(" Remove root " + largest + "; move last value " + last + "to index 0: " + data);
        }

        while (true){
          int left = leftChildIndex(current);

          if (left >= data.size()){
            break;
          }

          int right  = rightChildIndex(current);
          int largerChild = left;
          
          if (right <= data.size() && data.get(right) > data.get(left)){
            largerChild = right;
          }

          if (data.get(current) >= data.get(largerChild)){
            break;
          }

          if (showSteps){
          System.out.println(" swap " + data.get(current) + " with larger child " + data.get(largerChild));
        }

        swap(current, largerChild);
        current = largerChild;
        
        if (showSteps){
            System.out.println(" Heap: " + data);
          }   
        } //while

        return largest;
      } //pop


      private void swap(int first, int second){
        int temp = data.get(first);
        data.set(first, data.get(second));
        data.set(second, temp);
      }

      public boolean isValidMaxHeap(){
        for (int index = 1; index < data.size(); index++){
          if (data.get(index) > data.get(parentIndex(index))){
            return false;
          }
        }
        return true;
      }

      @Override
      public String toString(){
        return data.toString();
      }
  } // Maxheap


  static final class Patient {
    final String name;
    final int severity;
    final long arrivalOrder;

    Patient(String name, int severity, long arrivalOrder){
      if (severity < 1 || severity > 10) {
        throw new IllegalArgumentException("severity must be between 1 and 10");
      }

      this.name = name;
      this.severity = severity;
      this.arrivalOrder = arrivalOrder;

    }

    @Override 
    public String toString(){
      return name + " severity=" + severity;
    }
  }

  public static void main(String[] args) {
    int[] startingValues = {100, 88, 25, 87,16, 8, 12, 86, 50,2,15,3};

    MaxHeap insertionDemo  = new MaxHeap();
    MaxHeap deletionDemo = new MaxHeap();


    for (int value: startingValues){
      insertionDemo.insert(value);
      deletionDemo.insert(value);
    }

    System.out.println("Before: " + insertionDemo);

    insertionDemo.insert(40);
    System.out.println("After: " + insertionDemo);

  }
}