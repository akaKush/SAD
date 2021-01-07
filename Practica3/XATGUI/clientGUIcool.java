package practica3;
import java.awt.*;
import javax.swing.*;
import java.io.BufferedReader;
import java.io.PrintWriter;
import java.io.InputStreamReader;

public class clientGUIcool extends JFrame{
    public JFrame monguer = this;
    public static final int SERVER_PORT = 9090;
    public static final String SERVER_HOST = "localhost";
    public static String name, lastLine = "initial";
    public static MySocketcool sc = new MySocketcool(SERVER_HOST ,SERVER_PORT);
    public static JTextArea textRX, usersConnected;
    public static PrintWriter out = new PrintWriter(sc.MyGetOutputStream(), true);

    public clientGUIcool() {
        initComponents();
        clientGUIcool.RXthread reader = new RXthread();
        clientGUIcool.userClose updater = new userClose();
        reader.execute();
        updater.execute();

    }

    class userClose extends SwingWorker<String, Object>{

        @Override
        protected String doInBackground() throws Exception {
            monguer.addWindowListener(new WindowAdapter(){
            @Override
            public void windowClosing(WindowEvent e){
                sc.close();
                System.out.println("CLOSING CONNECTION");
                System.exit(0);
            }
        });
        return null;

        }

    }

    
}