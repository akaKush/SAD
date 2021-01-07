package practica3;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.nio.channels.Selector;
import java.nio.channels.SelectionKey;
import java.nio.channels.SocketChannel;
import java.util.logging.Level;
import java.util.logging.Logger;

class ServerHandler implements Runnable {
    final SocketChannel socketch;
    final SelectionKey selkey;
    String nick;
    HashMap<String,ServerHandler> uMap;
    ByteBuffer rbuff = ByteBuffer.allocate(1024);
    String msg;
}