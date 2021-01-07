package practica3;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.channels.Selector;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Iterator;

class NIOServer implements Runnable {
    Socket sc;
    public MySocketcool(String host, int port){
        try {
            this.sc = new Socket(host, port);
        } catch (IOException ex) {
            Logger.getLogger(MySocketcool.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}