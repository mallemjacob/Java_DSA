import java.util.NavigableSet;
import java.util.TreeSet;


public class TreeSetBST {

  // BST
  private NavigableSet<Integer> bst = new TreeSet<>();

  // Insert
  public boolean insert(int value){
    return bst.add(value);
  }

  // Search
  public boolean search(int value){
    return bst.contains(value);
  }

  // Delete
  public boolean delete(int value){
    return bst.remove(value);
  }

  // Inorder Traversal (Ascending order)
  public void inorderTraversal(){
    if (bst.isEmpty()){
      System.out.println("Tree is empty");
      return;
    }

    for (int value : bst){
      System.out.println(value + " ");
    }
    System.out.println();
  }



  public static void main(String[] args) {
      TreeSetBST tree = new TreeSetBST();

      int[] values = {50, 25, 75, 10, 33, 56, 89, 4, 11, 30, 40, 52, 61, 82, 95};

      System.out.println("Inserting elements");

      for (int value : values){
        System.out.println(value + " inserted " + tree.insert(value));
      }

      System.out.println("\nInorder Traversal: ");
      tree.inorderTraversal();
  }
}