import java.util.HashSet;
import java.util.Set;

public class GraphBasicsDemoDFS {

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

    // DFS: Depth-first search
    static boolean dfsSearch(Vertex current, String target, Set<Vertex> visited){

      if(visited.contains(current)){
        return false;
      }

      visited.add(current);

      if (current.name.equals(target)){
        return true;
      }

      for (Vertex neighbour : current.neighbours){
        if (dfsSearch(neighbour, target, visited)){
          return true;
        }
      }

      return false;

    }

    public static void main(String[] args) {

    
    Vertex alice = new Vertex("Alice");
    Vertex bob = new Vertex("Bob");
    Vertex diana = new Vertex("Diana");
    Vertex fred = new Vertex("Fred");
     
    alice.addFriend(bob);
    bob.addFriend(diana);
    diana.addFriend(fred);

    // alice -> bob -> diana -> fred


    System.out.println("Find Fred: " + dfsSearch(alice, "Fred", new HashSet<>()));

    System.out.println("Find Zoe: " + dfsSearch(alice, "Zoe", new HashSet<>()));


    }
}