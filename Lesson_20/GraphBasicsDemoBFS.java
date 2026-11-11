import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Queue;
import java.util.Set;

public class GraphBasicsDemoBFS {

  static class Vertex {
      String name;

      Set<Vertex> neighbours = new LinkedHashSet<>();

      
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


    // BFS: Breadth-first search

    static void bfs(Vertex start){
      Queue<Vertex> queue = new ArrayDeque<>();

      Set<Vertex> visited = new HashSet<>();

      visited.add(start);

      queue.offer(start);

      while (!queue.isEmpty()) { 
          Vertex current = queue.poll();

          System.out.println(current.name);

          for(Vertex neighbour: current.neighbours){
            if (visited.add(neighbour)){
              queue.offer(neighbour);
            }
          }
      }
    }

   public static void main(String[] args) {

    Vertex alice = new Vertex("Alice");
    Vertex bob = new Vertex("Bob");
    Vertex diana = new Vertex("Diana");
    Vertex fred = new Vertex("Fred");
    Vertex elaine = new Vertex("Elaine");


    // alice -> bob -> fred
    // alice -> diana -> elaine
    alice.addFriend(bob);
    alice.addFriend(diana);
    bob.addFriend(fred);
    diana.addFriend(elaine);

    System.out.println("BFS starting from Alice");

    bfs(alice);
    }

}