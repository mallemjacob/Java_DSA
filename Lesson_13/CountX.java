public record CountX() {


  public static int countX(String str) {
    
    // base case
    if (str.isEmpty()){
      return 0;
    }

    // recursion
    if (str.charAt(0) == 'x') {
      return 1 + countX(str.substring(1));
    } else {
      return countX(str.substring(1));
    }

  }

  public static void main(String[] args) {
    String str = "axbxcxdxexfxgx";

    System.out.println(countX(str));
  }
}


// axbxcxd --> 3

// axbxcxd
// xbxcxd 1 + 
// bxcxd
// xcxd 1 +
// cxd
// xd 1 +
// d