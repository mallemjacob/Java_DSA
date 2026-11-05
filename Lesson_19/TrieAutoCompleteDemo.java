import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

public class TrieAutoCompleteDemo {

  static class TrieNode {
    Map<Character, TrieNode> children = new TreeMap<>();
    boolean isEndOfWord = false;

  }

  static class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word){ //cat
        TrieNode current = root;

        for (char letter : word.toCharArray()){ // c, a, t
          if (!current.children.containsKey(letter)) {
            current.children.put(letter, new TrieNode());
          }
            current = current.children.get(letter);
        }

        current.isEndOfWord = true;
    }

    private TrieNode findNode(String text){
      TrieNode currrent = root;


      for (char letter : text.toCharArray()){
        currrent = currrent.children.get(letter);
        if (currrent == null){
          return null;
        }
      }
      return currrent;
    }

    public boolean search(String word){
      TrieNode node = findNode(word);

      return node != null && node.isEndOfWord;
    }

    public boolean startsWith(String prefix){
      return findNode(prefix) != null;
    }

    public List<String> autocomplete(String prefix, int limit){
      List<String> suggestions = new ArrayList<>();
      TrieNode prefixNode = findNode(prefix);

      if (prefixNode == null || limit <= 0){
        return suggestions;
      }

      collectWords(prefixNode, prefix, suggestions, limit);
      return suggestions;
    }

    private void collectWords(TrieNode node, String wordsSoFar, List<String> suggestions, int limit){
      if (suggestions.size() >= limit){
        return;
      }

      if (node.isEndOfWord){
        suggestions.add(wordsSoFar);
      }

      for (Map.Entry<Character, TrieNode> entry : node.children.entrySet()){
        collectWords(entry.getValue(), wordsSoFar + entry.getKey(), suggestions, limit);

        if (suggestions.size() >= limit){
          return;
        }
      }
    }
  }

  public static void main(String[] args) {
    Trie trie = new Trie();

    String[] words = {"ape","apple","application","apply","apricot","banana","bat","batch","bath", "cat","care","dog","door"};

    for (String word : words){
      trie.insert(word);
    }

    System.out.println("search(\"app\"): " + trie.search("app"));
    System.out.println("search(\"ap\"): " + trie.search("ap"));
    System.out.println("startsWith(\"app\"): " + trie.startsWith("app"));


    Scanner scanner = new Scanner(System.in);
    System.out.println("\nAutocomplete ready! Type exit to exit");

    while (true) {
      System.out.println("Enter a prefix: ");

      if (!scanner.hasNextLine()){
        break;
      }

      String prefix = scanner.nextLine().trim().toLowerCase(Locale.ROOT);

      if (prefix.equals("exit")){
        break;
      }


      if (prefix.isEmpty()){
        System.out.println("Please type atleast one letter");
        continue;
      }

      List<String> suggestions = trie.autocomplete(prefix, 5);

      if (suggestions.isEmpty()){
        System.out.println("No suggestions found");
      } else {
        System.out.println("Suggestions: " + suggestions);
      }     
    }

    scanner.close();
    System.out.println("Finished!");

    
  }  
}