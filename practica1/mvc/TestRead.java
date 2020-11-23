import java.io.*;
public class TestRead {
    public static void main(String[] args) {
        BufferedReader in = new EditableBufferedReader(
          new InputStreamReader(System.in));
        int str = 0;
        try {
          str = in.read();
        } catch (IOException e) { e.printStackTrace(); }
        System.out.println("\nline is: " + str);
      } 
}