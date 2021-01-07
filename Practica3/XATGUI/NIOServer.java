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

    class Acceptor implements Runnable {
        public void run() {
            try {
                SocketChannel socketch = serverch.accept();
                System.out.println(socketch.toString() + ": Socket Accepted");
                if (socketch != null){
                    System.out.println(socketch.toString() + ": Login Attempt");
                    ByteBuffer rbuff = ByteBuffer.allocate(1024);
                    int nbytes = socketch.read(rbuff);
                    if (nbytes == -1) {
                        socketch.close();
                    }
                    else {
                        byte[] bytes;
                        rbuff.flip();
                        bytes = new byte[rbuff.remaining()];
                        rbuff.get(bytes, 0, bytes.length);
                        String nick = (new String(bytes, Charset.forName("ISO-8859-1"))).trim();
                        String resp = (!uMap.containsKey(nick)? "true" : "false");

                        if (resp.equals("true")){
                            System.out.println(socketch.toString() + ": Nick assigned = "+nick);
                            uMap.put(nick,new ServerHandler(selector, socketch, nick, uMap));
                            System.out.println("Welcome to the chat server "+nick);
                            String nicklist=nicks(uMap);
                            uMap.forEach((k,s) -> {
                                try{
                                    s.socketch.write(ByteBuffer.wrap((nick+" joined the chat\n").getBytes()));
                                    s.socketch.write(ByteBuffer.wrap(("updateUser-"+nicklist+"\n").getBytes()));
                                }catch (IOException ex) {
                                    ex.printStackTrace();
                                }
                            });
                        } else {
                           socketch.close();
                        }
                    }
                }
            }
            catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
}