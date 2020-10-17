//echo -e "lines\ncols"|tput -S comando per executar

import java.io.*;
import java.util.*;

public class Columnes {

  public static void main(String[] args) {

        
         try {
            String[] cmd = {"sh", "-c", "echo -e '\ncols'|tput -S"};
            Runtime.getRuntime().exec(cmd);
        } catch (IOException e) { e.printStackTrace(); }
    
  }
  
}

