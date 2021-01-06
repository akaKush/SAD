import java.io.*;
import java.net.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class MyServerSocket {

    private int port;
    //Store all the clients in a map: key -> client name , value -> a thread that servers a client
    public static ConcurrentHashMap<String, Server> clients = new ConcurrentHashMap<String, Server>();

    public MyServerSocket(int port) {
        this.port = port;
    }
 
    public void execute() {
        try (ServerSocket serverSocket = new ServerSocket(port)) {
 
            System.out.println("Chat Server is listening on port " + port);
 
            while (true) {
                //Waits until a new client is connected
                Socket socket = serverSocket.accept();
                System.out.println("New user connected");
                
                //Start a thread that will server to this client
                Server newUser = new Server(socket, this);
                
                newUser.start();
 
            }
 
        } catch (IOException ex) {
            //Handle exceptions
            System.out.println("Error in the server: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
 
    public static void main(String[] args) {
        
        //Handle user admin not starting correctly the server
        if (args.length < 1) {
            System.out.println("Please try again =)");
            System.out.println("Syntax: java MyServerSocket <port-number>");
            System.exit(0);
        }
        
        //Parse the port of the server
        int port = Integer.parseInt(args[0]);
        
        //Initialize the server
        MyServerSocket server = new MyServerSocket(port);

        //Start the server
        server.execute();
    }
 
    /**
     * Delivers a message from one user to others (broadcasting)
     */
    void broadcast(String message, String excludeUser) {
       
        for (String key : this.clients.keySet()) { 

            //Checks not sending the message to the same user
            if(!key.equals(excludeUser)){
                this.clients.get(key).sendMessage(message);
            }
         }
        
    }
 
    /**
     * Stores username and the threads that 
     * servers this newly connected client.
     */
    void addUserName(String userName, Server server) {
     
        this.clients.put(userName, server);
    }
 
    /**
     * When a client is disconneted, removes the associated username and UserThread
     * The client that leaves notifies to other clients -> check class Server in the run method
     */
    void removeUser(String userName, Server aUser) {
        
        clients.remove(userName);
        System.out.println("The user " + userName + " quitted");
    }
 
    /**
     * Returns all the names of the clients
     */
    Set<String> getUserNames() {
        Set<String> userNames = new HashSet<>();
        for (String key : this.clients.keySet()) {
            userNames.add(key);
        }
        return userNames;
    }
 
    /**
     * Returns true if there are other users connected 
     */
    boolean hasUsers() {
        return !this.clients.isEmpty();
    }
}