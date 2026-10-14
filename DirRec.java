import java.io.File;

public class DirRec {

  public static void printSubDirectories(String directoryName) {
      
      File directory = new File(directoryName);

      File[] files = directory.listFiles(); 
      

      // Base case
      if (files == null){
        return;
      }

      for (File file : files){
        if (file.isDirectory()){
          System.out.println(file.getPath()); // ./hi/there/welcome/to
          
          // recursion
          printSubDirectories(file.getPath()); //printSubDirectories('./hi/there/welcome/to')
        }
      }

  }


   public static void main(String[] args) {
      printSubDirectories("."); //printSubDirectories('Lesson_12')
  } 
}
