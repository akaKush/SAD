import java.net.Socket;
import java.net.UnknownHostException;
import java.io.*;
import java.util.*;

public class MySocket{

    //Variables definition
    Socket ms;
    PrintWriter dout;
    BufferedReader din;

    public static void main(String[] args){
        new MySocket();
    }

    //Constructor of the socket
    public MySocket(){

        try{
            //Creates a stream socket and connects it to the 
            //specified port number at the specified IP address.
            this.ms = new Socket("localhost", 4000);

            //Create a OutPutStream of Data
            this.dout = new PrintWriter(this.ms.getOutputStream());

            //Create an InputStream of Data
            InputStreamReader in = new InputStreamReader(this.ms.getInputStream());
        
            this.din = new BufferedReader(in);

            //Start listening for input
            listenForInput();

        }catch(UnknownHostException e){
            //Handle exception
            e.printStackTrace();

        }catch(IOException e){
            //Handle exception
            e.printStackTrace();
        
        }
        
    }

    //Close all the socket connections
    public void closeSCon(){
        try{
            this.din.close();
            this.dout.close();
            this.ms.close();
        }catch(IOException e){
            e.printStackTrace();
        }
    }

    
    public void listenForInput(){

        Scanner console = new Scanner(System.in);

        while(true){

            //Check if is there new line
            while(!console.hasNextLine()){

                try {
                    //Sleep the thread in order to reduce the CPU usage
                    Thread.sleep(1);
                } catch (InterruptedException e) {
                    //Handle exception
                    e.printStackTrace();
                }
            }

            //Read the data from the user
            String input = console.nextLine();
            System.out.println(input);
            if(input == null){
                break;
            }
            //Output the data through the socket
            try{
                dout.println(input);
                dout.flush();

                //Check if is there response from the server
                while(this.din.ready() == false){

                    try {
                        //Sleep the thread in order to reduce the CPU usage
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        //Handle exception
                        e.printStackTrace();
                }

                String reply = this.din.readLine();
                System.out.println(reply);
            }
            }catch(IOException e){
                e.printStackTrace();
                break;
            }
           
        }

        //Close all connections
        this.closeSCon();
    }

    
}