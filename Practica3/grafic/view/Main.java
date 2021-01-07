import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Main {
	public static void main(String[] args) throws InterruptedException {
		
		//Main Container
        JFrame frame = new JFrame("SAD ChatRoom");
		frame.setSize(600, 450);
		frame.setLocation(600, 450);
		frame.setContentPane(new JPanel());
		frame.getContentPane().setLayout(null);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		//Messages Container
		JTextArea board = new JTextArea("");
		JScrollPane js = new JScrollPane(board);
		js.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		js.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
		js.setBounds(150, 40, 400, 300);
		frame.getContentPane().add(js);

		//Online Concats container
		JTextArea contactBoard = new JTextArea("");
		JScrollPane jsC = new JScrollPane(contactBoard);
		jsC.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		jsC.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
		jsC.setBounds(30, 40, 90, 300);
		frame.getContentPane().add(jsC);


		//Messahes Input Container
		JTextArea pf = new JTextArea("");
		JScrollPane js2 = new JScrollPane(pf);
		js2.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
		js2.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
		js2.setBounds(150, 375, 250, 50);
		frame.getContentPane().add(js2);

		//Send message button
		JButton b = new JButton("ENVIAR");
		b.setBounds(400, 375, 150, 50);


		b.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				try {
					if (Client.success) {
						Client.sendMsg(pf.getText());
						board.append("You：" + pf.getText() + "\r\n");
                        board.setCaretPosition(board.getText().length());
                        String from = pf.getText();
                        if (from.length() > 0)
                            pf.replaceRange(" ",0,from.length());
					}else{
                        Client.setName(pf.getText());
                        String from = pf.getText();
                        if (from.length() > 0)
                            pf.replaceRange(" ",0,from.length());
					}
				} catch (Exception ee) {
					board.append("Server error, the program will close soon.....");
					try {
						Thread.sleep(1000);
					} catch (InterruptedException e1) {
						e1.printStackTrace();
					}
					System.exit(-1);
				}
			}
		});
		frame.getContentPane().add(b);
		frame.setVisible(true);
		try {
			Client.start();
			new Client.MessageThread(board, contactBoard).start();
		} catch (Exception e) {
			board.append("Server error, the program will close soon.....");
			Thread.sleep(1000);
			System.exit(-1);
		}
	}
}