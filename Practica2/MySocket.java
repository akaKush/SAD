import java.net.*;
import java.io.*;

public class MySocket {
    private String hostname;
    private int port;
    private String userName;
 
    public MySocket(String hostname, int port) {
        this.hostname = hostname;
        this.port = port;
    }
    
    /**
     * Each client will be composed by two threads: 
     * -One reading thread that listens all the messages that come from the server
     * -One writing thread that listens to the messages that write the user in the console
     */
    
    public void execute() {
        try {
            Socket socket = new Socket(hostname, port);
 
            System.out.println("Connected to the chat server");
 
            new ReadThread(socket, this).start();
            new WriteThread(socket, this).start();
 
        } catch (UnknownHostException ex) {
            System.out.println("Server not found: " + ex.getMessage());
        } catch (IOException ex) {
            System.out.println("I/O Error: " + ex.getMessage());
        }
 
    }
 
    void setUserName(String userName) {
        this.userName = userName;
    }
 
    String getUserName() {
        return this.userName;
    }
 
 
    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Please try again =)");
            System.out.println("Syntax: java MySocket <hostname> <port-number>");
            System.exit(0);
        }
 
        String hostname = args[0];
        int port = Integer.parseInt(args[1]);
 
        MySocket client = new MySocket(hostname, port);
        client.execute();
    }
}