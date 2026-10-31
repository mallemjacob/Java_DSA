import java.util.NoSuchElementException;

public class BSTDemo {

    static class BinarySearchTree {
        private static class Node {
            int value;
            Node left;
            Node right;

            Node(int value) {
                this.value = value;
            }
        }

        private Node root;
        private int size;

        // Insert a value. Duplicate values are ignored.
        public void insert(int value) {
            root = insert(root, value);
        }

        private Node insert(Node node, int value) {
            if (node == null) {
                size++;
                return new Node(value);
            }

            if (value < node.value) {
                node.left = insert(node.left, value);
            } else if (value > node.value) {
                node.right = insert(node.right, value);
            }

            return node;
        }

        // Recursive search
        public boolean contains(int value) {
            return search(root, value) != null;
        }

        private Node search(Node node, int value) {
            if (node == null || node.value == value) {
                return node;
            }

            if (value < node.value) {
                return search(node.left, value);
            }

            return search(node.right, value);
        }

        // Show nodes visited during a search
        public String searchPath(int value) {
            StringBuilder path = new StringBuilder();
            Node current = root;

            while (current != null) {
                if (path.length() > 0) {
                    path.append(" -> ");
                }

                path.append(current.value);

                if (value == current.value) {
                    return path + " (found)";
                }

                current = value < current.value
                        ? current.left
                        : current.right;
            }

            return path + " -> null (not found)";
        }

        // Iterative deletion
        public boolean delete(int value) {
            Node parent = null;
            Node current = root;

            // Find the node to delete
            while (current != null && current.value != value) {
                parent = current;
                current = value < current.value
                        ? current.left
                        : current.right;
            }

            if (current == null) {
                return false;
            }

            // Case: node has two children
            if (current.left != null && current.right != null) {
                Node successorParent = current;
                Node successor = current.right;

                // Find smallest value in right subtree
                while (successor.left != null) {
                    successorParent = successor;
                    successor = successor.left;
                }

                current.value = successor.value;

                // Remove successor from its old position
                parent = successorParent;
                current = successor;
            }

            // Current node now has 0 or 1 child
            Node child = current.left != null
                    ? current.left
                    : current.right;

            if (parent == null) {
                root = child;
            } else if (parent.left == current) {
                parent.left = child;
            } else {
                parent.right = child;
            }

            size--;
            return true;
        }

        // Inorder: Left -> Root -> Right
        public void printInorder() {
            inorder(root);
            System.out.println();
        }

        private void inorder(Node node) {
            if (node == null) return;

            inorder(node.left);
            System.out.print(node.value + " ");
            inorder(node.right);
        }

        // Preorder: Root -> Left -> Right
        public void printPreorder() {
            preorder(root);
            System.out.println();
        }

        private void preorder(Node node) {
            if (node == null) return;

            System.out.print(node.value + " ");
            preorder(node.left);
            preorder(node.right);
        }

        // Postorder: Left -> Right -> Root
        public void printPostorder() {
            postorder(root);
            System.out.println();
        }

        private void postorder(Node node) {
            if (node == null) return;

            postorder(node.left);
            postorder(node.right);
            System.out.print(node.value + " ");
        }

        public int min() {
            if (root == null) {
                throw new NoSuchElementException("Tree is empty");
            }

            Node node = root;
            while (node.left != null) {
                node = node.left;
            }

            return node.value;
        }

        public int max() {
            if (root == null) {
                throw new NoSuchElementException("Tree is empty");
            }

            Node node = root;
            while (node.right != null) {
                node = node.right;
            }

            return node.value;
        }

        // Height measured in levels
        // Empty tree = 0, leaf = 1
        public int height() {
            return height(root);
        }

        private int height(Node node) {
            if (node == null) return 0;

            return 1 + Math.max(
                    height(node.left),
                    height(node.right)
            );
        }

        public int size() {
            return size;
        }
    }

    public static void main(String[] args) {
        BinarySearchTree bst = new BinarySearchTree();

        // BST from Chapter 15
        int[] values = {
            50, 25, 75, 10, 33, 56, 89,
            4, 11, 30, 40, 52, 61, 82, 95
        };

        for (int value : values) {
            bst.insert(value);
        }

        System.out.print("Inorder:   ");
        bst.printInorder();

        System.out.print("Preorder:  ");
        bst.printPreorder();

        System.out.print("Postorder: ");
        bst.printPostorder();

        System.out.println("Search for 61: " + bst.searchPath(61));
        System.out.println("Contains 100? " + bst.contains(100));
        System.out.println("Size: " + bst.size());
        System.out.println("Height (levels): " + bst.height());
        System.out.println("Minimum: " + bst.min()
                + ", Maximum: " + bst.max());

        bst.insert(45);
        System.out.print("After insert 45: ");
        bst.printInorder();

        bst.delete(4);       // Leaf node
        System.out.print("After delete 4:  ");
        bst.printInorder();

        bst.delete(10);      // One child
        System.out.print("After delete 10: ");
        bst.printInorder();

        bst.delete(56);      // Two children
        System.out.print("After delete 56: ");
        bst.printInorder();

        bst.delete(50);      // Root node
        System.out.print("After delete 50: ");
        bst.printInorder();

        System.out.println("Final size: " + bst.size());
        System.out.println("Final root search path for 52: "
                + bst.searchPath(52));
    }
}

