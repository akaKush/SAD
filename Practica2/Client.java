import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;
import java.io.InputStreamReader;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Client {
    public static String name="initial", lastLine = "initial";
    public static void main(String[] args) throws IOException{
        MySocket sc = new MySocket(args[0],Integer.parseInt(args[1]));
        Scanner teclat = new Scanner(System.in);
        PrintWriter out = new PrintWriter(sc.MyGetOutputStream(), true);
        BufferedReader in = new BufferedReader(new InputStreamReader(sc.MyGetInputStream()));
        Thread inputFlow = new Thread(new Runnable(){
            public void run(){
                String linia;
                while((linia = teclat.nextLine()) != null){
                    lastLine = linia;
                    out.print(linia+"\n");
                    out.flush();
                }
            }
        });
        Thread outputFlow = new Thread(new Runnable(){
            public void run(){
                try {
                    String msg;
                    while((msg = in.readLine()) != null){
                        if(msg.contains(lastLine) && msg.contains("joined")){
                            name = lastLine;
                        }
                        System.out.println(msg);
                      }
                } catch (IOException ex) {
                    Logger.getLogger(Client.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        inputFlow.start();
        outputFlow.start();
        System.out.println("CLIENT STARTED");
        System.out.println("insert logout to close connection and CTRL+D to close chat");
    }
}
