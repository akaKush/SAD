package mvc;

import java.io.Console;

public class EditableBufferedReader extends BufferedReader {

    /**
     * @param args
     */
    public static void main(String[] args) { //afegeixo main pq sino em salta un error
        // TODO code application logic here
    }

    public EditableBufferedReader(Reader in) {
        super(in);
    }

    public void setRaw() throws InterruptedException, IOException {
        String[] cmd = {"sh", "-c", "stty -echo raw</dev/tty"};
        Runtime.getRuntime().exec(cmd);
    }

    public void unsetRaw() throws IOException, InterruptedException {
        String[] cmd = {"sh", "-c", "stty echo cooked</dev/tty"};
        Runtime.getRuntime().exec(cmd);
    }



    @Override
    public int read() {

        int lect;
        try{
            if ((lect = super.read()) != Key.ESC) {
                return lect;
            }
            lect = super.read();
            if (lect == Key.CRTL_C) {
                System.err.print("Exiting");   
                return Key.EXIT_KEY;
            }
            if (lect == Key.CLAU) {
                lect = super.read();
                return lect - 1000;
            }
        } catch (IOException ex) {
            System.out.println("Interrupted Exception");
        }
        return Key.CARAC;
    }

    public String readLine() throws IOException {

        Console console = new Console(lines);
        lines.addObserver(console);
        this.setRaw();
        int lect = -1;

        try{
            while( lect != Key.CRTL_C){
                lect = this.read();

                switch(lect){
                    case (Key.UP - 1000):
                        lines.moveUp();
                        break;
                    case (Key.DOWN - 1000):
                        lines.moveDown();
                        break;
                    case (Key.RIGHT - 1000):
                        lines.moveRight();
                        break;
                    case (Key.LEFT - 1000):
                        lines.moveLeft();
                        break;
                    case (Key.INSERT - 1000):
                        //flush Buffer
                        this.read();
                        lines.setMode();
                        break;
                    case (Key.SUPR - 1000):
                        this.read();
                        lines.suprimirChar();
                        break;
                    case (Key.HOME - 1000):
                        lines.moveHome();
                        break;
                    case (Key.END - 1000):
                        lines.moveEnd();
                        break;
                    case (Key.EXIT):
                        lines.newLine();
                        break;
                    case (Key.DEL):
                        lines.deleteChar();
                        break;
                    case (Key.CARAC):
                        console.clear();
                        System.out.println("Error while entering code");
                        this.unsetRaw();
                        return "ERROR";
                    case (Key.CRTL_C):
                        break;
                    default:
                        lines.addChar((char) lect);
                        break;
                }
            }
        } catch (IndexOutOfBoundsException ex) {
            System.out.println("Error: out of boundaries");
        }
        this.unsetRaw();
        console.clear();
        return lines.toString();
    }

}