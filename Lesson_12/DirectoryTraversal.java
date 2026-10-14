import java.io.File;

public class DirectoryTraversal {

  public static void printSubDirectories(String directoryName) {
      
      File directory = new File(directoryName);

      File[] files = directory.listFiles();

      if (files == null){
        return;
      }

      for (File file : files){
        if (file.isDirectory()){
          System.out.println(file.getPath());
          
          File[] subFiles = file.listFiles();

          if (subFiles == null){
            continue;
          }

          for(File subFile : subFiles){
            if (subFile.isDirectory()){
              System.out.println(subFile.getPath());
            }
          }


        }
      }

  }

  public static void main(String[] args) {
      printSubDirectories(".");
  }
}
