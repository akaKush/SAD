package practica3;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MySocketcool extends Socket{
    Socket sc;

    //constructor
    public MySocketcool(String host, int port){
        try {
            this.sc = new Socket(host, port);
        } catch (IOException ex) {
            Logger.getLogger(MySocketcool.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public MySocketcool(Socket soc){
        this.sc = soc;
    }

    public void MyConnect(SocketAddress endpoint){
        try {
            this.sc.connect(endpoint);
        } catch (IOException ex) {
            Logger.getLogger(MySocketcool.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public InputStream MyGetInputStream(){
        
    }

    public OutputStream MyGetOutputStream(){
        
    }
    
    @Override
    public void close(){
        try {
            sc.close();
        } catch (IOException ex) {
            Logger.getLogger(MySocketcool.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}