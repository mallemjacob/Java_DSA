import java.util.HashSet;
import java.util.Set;


public class GraphBasicsDemo {
    static class Vertex {
      String name;

      Set<Vertex> neighbours = new HashSet<>();

      
      Vertex(String name) {
        this.name = name;
        }
      
      //Undirected
      void addFriend(Vertex friend){
        neighbours.add(friend);
        friend.neighbours.add(this);
      }

      //Directed
      void addFollow(Vertex person) {
        neighbours.add(person);
      }
    }

    static void showConnections(Vertex vertex) {
      System.out.println(vertex.name + " connects to: ");

      if (vertex.neighbours.isEmpty()){
        System.out.println("nobody");
      }

      for (Vertex neighbour : vertex.neighbours){
        System.out.println("  " + neighbour.name);
      }
    }

    public static void main(String[] args) {
     Vertex alice = new Vertex("Alice");
     Vertex bob = new Vertex("Bob");
     Vertex fred = new Vertex("Fred");
     
      alice.addFriend(bob);
      alice.addFriend(fred);
      
      System.out.println("Undirected Graph (friends)");

      showConnections(alice);
      showConnections(bob);
      showConnections(fred);
      
      System.out.println();

      Vertex carol = new Vertex("Carlo");
      Vertex diana = new Vertex("Diana");


      carol.addFollow(diana);

      System.out.println("Directed Graph (follows)");

      showConnections(carol);
      showConnections(diana);

    }

} 