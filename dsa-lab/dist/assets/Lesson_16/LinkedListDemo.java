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
    this.firstNode = firstNode;
    }

  //Reading
  

  // Searching

  // Insertion

  //Deletion

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
      Node node1 = new Node("once");
      Node node2 = new Node("upon");
      Node node3 = new Node("a");
      Node node4 = new Node("time");

      node1.nextNode = node2;
      node2.nextNode = node3;
      node3.nextNode = node4;

      LinkedList words = new LinkedList(node1);

      words.printList();

  }
}