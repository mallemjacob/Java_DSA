import java.util.LinkedList;

public class BuiltInLinkedList {
  
    public static void main(String[] args) {
      wordExample();
      colorExample();
    }
    
    // Reading and Searching
    static void wordExample() {
        System.out.println("1. WORD EXAMPLE");

        LinkedList<String> words = new LinkedList<>();

        words.add("once");
        words.add("upon");
        words.add("a");
        words.add("time");

        System.out.println("List: " + words);
        System.out.println("get(3): " + words.get(3));
        System.out.println("indexOf(time): " + words.indexOf("time"));
        System.out.println("First: " + words.getFirst());
        System.out.println("Last: " + words.getLast());
        System.out.println("Size: " + words.size());

    }

    static void colorExample() {
      System.out.println("2. COLOR EXAMPLE");

        LinkedList<String> colors = new LinkedList<>();

        colors.add("blue");
        colors.add("green");
        colors.add("yellow");


        System.out.println("Original: " + colors);

        colors.addFirst("white");
        System.out.println("Insert white: " + colors);

        colors.add(2, "purple");
        System.out.println("Insert purple: " + colors);

        colors.remove(2);
        System.out.println("Delete index 2: " + colors);

        colors.removeFirst();
        System.out.println("Remove first item: " + colors);

        colors.addLast("black");
        System.out.println("Insert black: " + colors);
    }


}
