import java.io.*;
import java.net.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MyServerSocket extends ServerSocket {
    ServerSocket ss;
    MySocket sc;
    public MyServerSocket(int port) throws IOException{

        this.ss = new ServerSocket(port);
    }

    @Override
    public MySocket accept(){
        try {
            this.sc = new MySocket(ss.accept());
            return sc;
        } catch (IOException ex) {
            Logger.getLogger(MyServerSocket.class.getName()).log(Level.SEVERE, null, ex);
        }
        return  null;
    }
    @Override
    public void close(){
        try {
            this.ss.close();
        } catch (IOException ex) {
            Logger.getLogger(MyServerSocket.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
