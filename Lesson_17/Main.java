public class Main {

  // Node
  static class Node {
    int data;
    Node left;
    Node right;

    Node(int data) {
      this.data = data;
    }
  }

  // Tree
  static class BST {
    Node root;

    // Insert a new value
    void insert(int data) {
      root = insertNode(root, data);
    }

    Node insertNode(Node node, int data){
      if (node == null){
        return new Node(data);
      }

      if (data < node.data){
        node.left = insertNode(node.left, data);
      } else if (data > node.data){
        node.right = insertNode(node.right, data);
      }

      return node;

    }

    // Read
    void display(Node node){
      if (node == null){
        return;
      }

      display(node.left);
      System.out.println(node.data + " ");
      display(node.right);

    }
  }



  public static void main(String[] args) {
      BST tree = new BST();

      tree.insert(50);
      tree.insert(30);
      tree.insert(70);
      tree.insert(20);
      tree.insert(40);
      tree.insert(60);
      tree.insert(80);

      System.out.println("BST Inorder traversal");
      tree.display(tree.root);
  }

}