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

    ServerHandler(Selector sel, SocketChannel sc, String nick, HashMap<String,ServerHandler> uMap) throws IOException {
        this.socketch = sc;
        socketch.configureBlocking(false);
        this.nick = nick;
        this.uMap = uMap;

        selkey = socketch.register(sel, SelectionKey.OP_READ);
        selkey.attach(this);
        selkey.interestOps(SelectionKey.OP_READ);
        sel.wakeup();
    }
    public String nicks(HashMap umap){
        String nicks=umap.keySet().toString();
        nicks=nicks.replace("[","");
        nicks=nicks.replace("]","");
        nicks=nicks.replace(", ","-");
        return nicks;
    }

    public void run() {
        try {
            if (selkey.isReadable())
                read();
            else if (selkey.isWritable())
                write();
        }
        catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    void write() throws IOException {
        uMap.forEach((k,s) -> {
            if(!nick.equals(k)){
                try{
                    s.socketch.write(ByteBuffer.wrap(msg.getBytes()));
                }catch (IOException ex) {
                    ex.printStackTrace();
                }
            };
        });
        System.out.print(msg);

        rbuff.clear();
        selkey.interestOps(SelectionKey.OP_READ);
        selkey.selector().wakeup();
    }
}