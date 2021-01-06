import java.io.*;
import java.net.*;
import java.util.*;


public class Server extends Thread {
    private Socket socket;
    private MyServerSocket server;
    private PrintWriter writer;
 
    public Server(Socket socket, MyServerSocket server) {
        this.socket = socket;
        this.server = server;
    }
    
    /**
     * When a new client connects
     * All the other connected clients are send it to the new client
     * When the client leaves it notifies all the other clients
    */

    public void run() {
        try {
            InputStream input = socket.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(input));
 
            OutputStream output = socket.getOutputStream();
            writer = new PrintWriter(output, true);
 
            printUsers();
 
            String userName = reader.readLine();
            server.addUserName(userName, this);
 
            String serverMessage = "New user connected: " + userName;
            server.broadcast(serverMessage, userName);
 
            String clientMessage;
 
            do {
                clientMessage = reader.readLine();
                serverMessage = "[" + userName + "]: " + clientMessage;
                server.broadcast(serverMessage, userName);
 
            } while (clientMessage != null);
 
            server.removeUser(userName, this);
            socket.close();
 
            serverMessage = userName + " has quitted.";
            server.broadcast(serverMessage, userName);
 
        } catch (IOException ex) {
            System.out.println("Error in Server: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
 
    /**
     * Sends a list of online users to the newly connected user.
     */
    void printUsers() {
        if (server.hasUsers()) {
            writer.println("Connected users: " + server.getUserNames());
        } else {
            writer.println("No other users connected");
        }
    }
 
    /**
     * Sends a message to the client.
     */
    void sendMessage(String message) {
        writer.println(message);
    }
}