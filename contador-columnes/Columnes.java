//echo -e "lines\ncols"|tput -S comando per executar

import java.io.*;
import java.util.*;

public class Columnes {

  public static void main(String[] args) {

        /*
          The command tput cols returns the number of columns of a terminal
          We get the information with InputStreamReder -> get ch from bytes
          With BufferedReader we read until the end of the line -> returns a string
          Then we have to convert the string into and int and print it 
          Finally we close the stream
        */
        
         try {
            String[] cmd = {"sh", "-c", "tput cols "};
            Process p = Runtime.getRuntime().exec(cmd);
            p.waitFor();
            InputStreamReader in = new InputStreamReader(p.getInputStream());
            BufferedReader br = new BufferedReader (in);
            int numero = Integer.parseInt (br.readLine());
            System.out.print(numero);
            in.close();
           
        } catch (IOException e) { e.printStackTrace(); }
        catch( InterruptedException e) {e.printStackTrace();}
    
  }
  
}

