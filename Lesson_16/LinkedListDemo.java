class Node {
  String data;
  Node nextNode;

  Node(String data) {
    this.data = data;
    this.nextNode = null;
  }
}


class LinkedList {
  private Node firstNode;

  LinkedList(Node firstNode) {
    this.firstNode = firstNode; // this.firstNode = node1
    } 

  // Reading O(N)
  String read(int index){ // index = 3
    if (index < 0){
      return null;
    }

    Node currentNode = firstNode; // currentNode = node4
    int currentIndex = 0; // currentIndex = 3

          // node4 != null     &&        3   <   3
    while (currentNode != null && currentIndex < index) {  
        currentNode = currentNode.nextNode;  // node3.nextNode
        currentIndex++;
    }

    if (currentNode == null){
      return null;
    }

    return currentNode.data; // node4.data

  }


  // Searching O(N)
  int search(String value){ // value = "time"

    Node currentNode = firstNode; // currentNode = node4
    int currentIndex = 0;         // currentIndex = 3

    while (currentNode != null) { // node4 != null
        if (currentNode.data.equals(value)){ // "node4.data".equals("time")
          return currentIndex;
        }
        
        currentNode = currentNode.nextNode; // currentNode = node4;
        currentIndex++; // currentIndex = 3


    }
    return -1;
  }


  // Insertion
  void insert(int index, String value){ // 4, "green"
    if (index < 0){
      throw new IndexOutOfBoundsException();
    }

    Node newNode = new Node(value); // newNode = "green"

    if (index == 0) {
      newNode.nextNode = firstNode;
      firstNode = newNode;
      return;
    }

    Node currentNode = firstNode; // currentNode = "node1"
    int currentIndex = 0;         // currentIndex = 0

    while (currentNode != null && currentIndex < index - 1) {  // 3 < 3
        currentNode = currentNode.nextNode;  // node4
        currentIndex++;                      // 3
    }

    if (currentNode == null){
      throw new IndexOutOfBoundsException();
    }

    newNode.nextNode = currentNode.nextNode;
    currentNode.nextNode = newNode;

  }


  //Deletion


  // Print All values
  void printList(){
    Node currentNode = firstNode;

    while (currentNode != null) { 
        System.out.println(currentNode.data);
        currentNode = currentNode.nextNode;
    }

    System.out.println("null");

  }

}



public class LinkedListDemo {
  public static void main(String[] args) {
      Node node1 = new Node("once"); // head
      Node node2 = new Node("upon");
      Node node3 = new Node("a");
      Node node4 = new Node("time");
      // Node node5 = new Node("cat");
      
      node1.nextNode = node2;
      node2.nextNode = node3;
      node3.nextNode = node4;
      // node4.nextNode = node5;

      LinkedList words = new LinkedList(node1);

      // words.printList();

      System.out.println("read(3): " + words.read(3));

      System.out.println("search(\"time\"): " + words.search("time"));
      System.out.println("search(\"cat\"): " + words.search("cat"));


      // LinkedList colors = new LinkedList(new Node("blue"));

      words.insert(4, "green");
      words.insert(5, "red");

      System.out.println("New Words");
      words.printList();

  }
}