import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.*;

public class Server {

	private Selector selector;
	private ByteBuffer buffer = ByteBuffer.allocate(2048);
	private ServerSocket serverSocket;
	private Map<String, Object> set = new HashMap<>();
	private Map<String, String> names = new HashMap<>();

	public Server(int port) throws IOException {
		ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
		serverSocketChannel.configureBlocking(false);
		serverSocket = serverSocketChannel.socket();
		serverSocket.bind(new InetSocketAddress(port));
		selector = Selector.open();
		serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);
		System.out.println("Server is running on " + port + "...");
	}

	public void listen() throws IOException {
		while (true) {
			selector.select();
			Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();
			while (iterator.hasNext()) {
				SelectionKey key = iterator.next();
				iterator.remove();
				handleKey(key);
			}
			selector.selectedKeys().clear();
		}
	}

	private void handleKey(SelectionKey key) throws IOException {
		ServerSocketChannel server;
		SocketChannel client;
		if (key.isAcceptable()) {
			server = ((ServerSocketChannel) key.channel());
			client = server.accept();
			client.configureBlocking(false);
			client.register(selector, SelectionKey.OP_READ);
			System.out.println("Receive connection from " + client.getRemoteAddress());
			write(client, "Welcome to the chat room, please enter your nickname!");
			
			key.interestOps(SelectionKey.OP_ACCEPT);
		} else if (key.isReadable()) {
			client = ((SocketChannel) key.channel());
			try {
				String[] msg = rec(client).split("###");
				if (msg.length > 0) {
					if (msg.length == 1) {
						if (set.containsKey(msg[0])) {
							 write(client, " Duplicate nickname: " + msg[0] + " ! Please re-enter!");
						} else {
							set.put(msg[0], null);
							names.put(client.getRemoteAddress().toString(),msg[0]);
							write(client, "hello " + msg[0]);
							boardMsg( msg[0] + " has joined the room", null);
							boardMsg("namesXX" + this.getUserNames(), null);
						}
					} else if (msg.length == 2) {
						System.out.println(client.getRemoteAddress() + " named " + msg[0] + " said： " + msg[1]);
						boardMsg(msg[0] + ": " + msg[1], client);
					}
				}
				key.interestOps(SelectionKey.OP_READ);
			} catch (Exception e) {
				String address = client.getRemoteAddress().toString();
				System.out.println("receive disconnection from " + address);
				String name = names.get(address);
				set.remove(name);
				names.remove(address);
				client.close();
				boardMsg(name + " has left the chat!\n", null);
			}
		}
    }
    
    /**
     * Returns all the names of the clients
     */
    String getUserNames() {
        String userNames = "";
        for (String key : this.names.keySet()) {
            userNames += "," + this.names.get(key);
        }
        return userNames;
	}
	

     /**
     * Returns true if there are other users connected 
     */
    boolean hasUsers() {
        return !this.names.isEmpty();
    }

	private void boardMsg(String msg, SocketChannel except) throws IOException {
		for (SelectionKey k : selector.keys()) {
			Channel target = k.channel();
			if (target.isOpen() && target instanceof SocketChannel && target != except) {
				write((SocketChannel) target, msg);
			}
		}
	}

	private String rec(SocketChannel channel) throws IOException {
		buffer.clear();
		int count = channel.read(buffer);
		return new String(buffer.array(), 0, count, StandardCharsets.UTF_8);
	}

	private void write(SocketChannel channel, String content) throws IOException {
		buffer.clear();
		buffer.put(content.getBytes(StandardCharsets.UTF_8));
		buffer.flip();
		channel.write(buffer);
	}

	public static void main(String[] args) throws IOException {
		Server server = new Server(7777);
		server.listen();
	}
}

