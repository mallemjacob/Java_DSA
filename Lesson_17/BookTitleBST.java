public class BookTitleBST {

  private static class Node {
    String title;
    Node left, right;

    Node(String title){
      this.title = title;
    }
  }

  private Node root;

  public void insert(String title){
    root = insert(root, title);
  }

  private Node insert(Node node, String title) {
    if (node == null){
      return new Node(title);
    }

    int comparision = title.compareTo(node.title);

    if (comparision < 0) {
      node.left = insert(node.left, title);
    } else if (comparision > 0){
      node.right = insert(node.right, title);
    }

    return node;

  }

  public void printAlphabetically() {
    inorder(root);
  }

  private void inorder(Node node){
    if (node == null) {
      return;
    }

    inorder(node.left);
    System.out.println(node.title);
    inorder(node.right);
  }


  public static void main(String[] args) {
      BookTitleBST books = new BookTitleBST();

      String[] titles = {
        "Moby Dick",
        "Great Expectations",
        "Robinson Crusoe",
        "Alice in Wonderland",
        "Lord of the Flies",
        "Pride and Prejudice",
        "The Odyssey"
      };


      for (String title : titles){
        books.insert(title);
      }

      books.printAlphabetically();
  }
}