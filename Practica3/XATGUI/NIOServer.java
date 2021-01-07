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
    final Selector selector;
    final static int localport = 9090;
    final ServerSocketChannel serverch;
    HashMap<String,ServerHandler> uMap;

    public static void main(String[] args) {
        try {
            new Thread(new NIOServer(localport)).start();
            System.out.println("SERVER ON PORT: "+localport);
        }
        catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    NIOServer(int port) throws IOException {
        selector = Selector.open();
        serverch = ServerSocketChannel.open();
        serverch.socket().bind(new InetSocketAddress(port));
        serverch.configureBlocking(false);
        SelectionKey sk = serverch.register(selector, SelectionKey.OP_ACCEPT);
        sk.attach(new Acceptor());
        uMap = new HashMap<String,ServerHandler>();
    }
}