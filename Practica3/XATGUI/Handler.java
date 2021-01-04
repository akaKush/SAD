
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
/**
 *
 * @author MARC BOSCH JORDI PARRA
 */
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

    void read() throws IOException {
        int nbytes;

        try {
            nbytes = socketch.read(rbuff);

            if (nbytes == -1) {
                throw new IOException ("Buffer at -1");
            }
            else {
                byte[] bytes;
                rbuff.flip();
                bytes = new byte[rbuff.remaining()];
                rbuff.get(bytes, 0, bytes.length);
                msg = nick+": "+(new String(bytes, Charset.forName("ISO-8859-1")));

                selkey.interestOps(SelectionKey.OP_WRITE);
                selkey.selector().wakeup();
            }
        }
        catch (IOException ex) {
            selkey.cancel();
            socketch.close();
            uMap.remove(nick);
            String nicklist=nicks(uMap);
            System.out.println("Bye "+nick);
            uMap.forEach((k,s) -> {
                try{
                    s.socketch.write(ByteBuffer.wrap((nick+" left the chat room\n").getBytes()));
                    s.socketch.write(ByteBuffer.wrap(("updateUser-"+nicklist+"\n").getBytes()));
                   } catch (IOException ex1) {
                    Logger.getLogger(ServerHandler.class.getName()).log(Level.SEVERE, null, ex1);
                }
            });
            return;
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
