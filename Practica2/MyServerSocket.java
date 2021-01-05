import java.net.*;
import java.io.*;
import java.util.*;

public class MyServerSocket {

    ServerSocket ss;
    Socket s; 
    PrintWriter dout;
    BufferedReader din;

    public static void main(String[] args){
        new MyServerSocket();
    }

    public MyServerSocket(){

        try{

            //Creates a stream socket and connects it to the 
            //specified port number
            this.ss = new ServerSocket(4000);
            System.out.println("Server Running on port: 4000");

            //Wait until there is a connection from a client
            this.s = this.ss.accept();
            System.out.println("client connected");

            //Create a OutPutStream of Data
            this.dout = new PrintWriter(this.s.getOutputStream());

            //Create an InputStream of Data
            InputStreamReader in = new InputStreamReader(this.s.getInputStream());
            this.din = new BufferedReader(in);
            
            //Listen from Data from Client
            this.listenForData();

        }catch(IOException e){
            e.printStackTrace();
        }
        
    }

    //Close all the socket connections
    public void closeSCon(){
        try{

            this.din.close();
            this.dout.close();
            this.s.close();
            this.ss.close();

        }catch(IOException e){
            e.printStackTrace();
        }
    }

    public void listenForData(){

        while(true){

            try{

                 //Check if is there response from the client
                 while(this.din.ready() == false){

                    try {
                        //Sleep the thread in order to reduce the CPU usage
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        //Handle exception
                        e.printStackTrace();
                }
            }
                String dataIn = this.din.readLine();
                System.out.println("Response: " + dataIn);

                this.dout.println(dataIn);
                this.dout.flush();
   
            }catch(IOException e){
                //Handle exception
                e.printStackTrace();
                break;
            }

        }

        this.closeSCon();
    }
}