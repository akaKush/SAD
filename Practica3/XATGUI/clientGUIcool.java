package practica3;
import java.awt.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
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
    class RXthread extends SwingWorker<String, Object>{

        @Override
        protected String doInBackground() throws Exception {
            BufferedReader in = new BufferedReader(new InputStreamReader(sc.MyGetInputStream()));
            String msg;

            while((msg = in.readLine()) != null){
                System.out.println(name);
                System.out.println(lastLine);
                System.out.println(msg);
                if(msg.contains(lastLine) && msg.contains("joined")){

                    name = lastLine;
                    textRX.append(msg + "\n");

                }else if(msg.contains("updateUser")){
                    String[] temp;
                    temp = msg.split("-");
                    usersConnected.setText("");
                    for(int i = 1; i<temp.length; i++){
                        usersConnected.append("- " + temp[i] + "\n");
                    }
                }else{
                    textRX.append(msg + "\n");
                }
            }
            return msg;
        }

    }

    private void initComponents() {

        //sendButton = new javax.swing.JButton(new ImageIcon("/Users/enric.carrera.aguiar/Documents/UPC/SAD/send.jpg"));
        sendButton = new javax.swing.JButton();
        textTX = new javax.swing.JTextField();
        titleTextLabel = new javax.swing.JLabel();
        jScrollPane2 = new javax.swing.JScrollPane();
        textRX = new javax.swing.JTextArea();

        usersConnected = new javax.swing.JTextArea();

        //setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        textRX.setText("Enter your username please: ");
        textRX.setLineWrap(true); //parteix les linies al final del cuadre de text
        textRX.setWrapStyleWord(true); //les parteix per
        textRX.setEditable(false);
        textRX.setForeground(Color.BLUE);

        usersConnected.setLineWrap(true); //parteix les linies al final del cuadre de text
        usersConnected.setWrapStyleWord(true); //les parteix per
        usersConnected.setEditable(false);
        usersConnected.setForeground(Color.GREEN);

        sendButton.setText("send");
        sendButton.addActionListener((java.awt.event.ActionEvent evt) -> {
            sendButtonActionPerformed(evt, out);
        });

        titleTextLabel.setText("XAT");

        textRX.setColumns(20);
        textRX.setRows(5);
        jScrollPane2.setViewportView(textRX);

        usersConnected.setColumns(20);
        usersConnected.setRows(5);

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(getContentPane());
        getContentPane().setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addGap(192, 192, 192)
                        .addComponent(titleTextLabel, javax.swing.GroupLayout.PREFERRED_SIZE, 31, javax.swing.GroupLayout.PREFERRED_SIZE))
                    .addGroup(layout.createSequentialGroup()
                        .addGap(21, 21, 21)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                            .addGroup(layout.createSequentialGroup()
                                .addComponent(textTX, javax.swing.GroupLayout.PREFERRED_SIZE, 302, javax.swing.GroupLayout.PREFERRED_SIZE)
                                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                                .addComponent(sendButton, javax.swing.GroupLayout.PREFERRED_SIZE, 58, javax.swing.GroupLayout.PREFERRED_SIZE))
                            .addComponent(jScrollPane2, javax.swing.GroupLayout.PREFERRED_SIZE, 365, javax.swing.GroupLayout.PREFERRED_SIZE))
                        .addGap(18, 18, 18)
                        .addComponent(usersConnected, javax.swing.GroupLayout.PREFERRED_SIZE, 141, javax.swing.GroupLayout.PREFERRED_SIZE)))
                .addContainerGap(19, Short.MAX_VALUE))
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                .addGap(7, 7, 7)
                .addComponent(titleTextLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jScrollPane2, javax.swing.GroupLayout.DEFAULT_SIZE, 233, Short.MAX_VALUE)
                        .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                        .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.BASELINE)
                            .addComponent(textTX, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                            .addComponent(sendButton)))
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(usersConnected, javax.swing.GroupLayout.PREFERRED_SIZE, 265, javax.swing.GroupLayout.PREFERRED_SIZE)
                        .addGap(0, 0, Short.MAX_VALUE)))
                .addContainerGap())
        );
        pack();
    }


    private void sendButtonActionPerformed(java.awt.event.ActionEvent evt, PrintWriter out) {
        String textToSend = textTX.getText();

        lastLine = textToSend;
        textTX.setText("");
        out.print(textToSend+"\n");
        out.flush();

        if(name != null){
            textRX.append("** " + name + ": " + textToSend + "\n");
        }else
            textRX.append(textToSend + "\n");
    }

    public static void main(String args[]) {

        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(clientGUIcool.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(clientGUIcool.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(clientGUIcool.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(clientGUIcool.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }

        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new clientGUIcool().setVisible(true);
            }
        });
    }

    private javax.swing.JScrollPane jScrollPane2;
    private javax.swing.JButton sendButton;
    private javax.swing.JTextField textTX;
    private javax.swing.JLabel titleTextLabel;
}