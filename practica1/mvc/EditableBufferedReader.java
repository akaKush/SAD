package mvc;

import java.io.*;
import java.util.*;

public class EditableBufferedReader extends BufferedReader {
        
    private Line line;
    private Console console;

    public EditableBufferedReader(Reader in) {
        super(in);
        this.line = new Line(); //<-- Model
        this.console = new Console(); //<-- View
        this.line.addObserver(this.console);
    }

    public void setRaw() {
        String[] cmd = { "/bin/sh", "-c", "stty -echo raw </dev/tty" }; // Comana per canviar la consola a mode Raw
        Process p;
        try {
            p = Runtime.getRuntime().exec(cmd);
            if (p.waitFor() == 1) {
                p.destroy();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void unsetRaw() {
        String[] cmd = { "/bin/sh", "-c", "stty echo cooked </dev/tty" }; // Comana per canviar la consola a mode Cooked
        Process p;
        try {
            p = Runtime.getRuntime().exec(cmd);
            if (p.waitFor() == 1) {
                p.destroy();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public int read() throws IOException {

        int lect;
        try{
            lect = super.read();
            if (lect == Key.ESC) {
                lect = super.read();
                if (lect == Key.CORCHETE){
                    lect = super.read();
                    switch (lect) {
                        case Key.INSERT:
                            super.read();
                            lect = Key._INSERT;
                            break;
                        case Key.SUPR:
                            super.read();
                            lect = Key._SUPR;
                            break;
                        case Key.HOME:
                            lect= Key._HOME;
                            break;
                        case Key.LEFT:
                            lect= Key._LEFT;
                            break;
                        case Key.RIGHT:
                            lect= Key._RIGHT;
                            break;
                        case Key.END:
                            lect= Key._END;
                            break;
                        default:
                            lect=Key._INVINPUT;
                            break;
                    }
                } else { 
                lect = Key._INVINPUT;
                }
            }else if (lect == Key.BACKSPACE){
            lect = Key._BACKSPACE;
            }
        }catch(IOException e){
            e.printStackTrace();
        }
        return lect;
    }

    public String readLine() throws IOException {

        this.setRaw();
          int r_lect=0;
           do{ 
               r_lect=this.read();
                
                if(r_lect >= Key._ESCAPE){
                    switch (r_lect){
                            case Key._INSERT:
                                this.line.toInsert();
                            break;
                            case Key._SUPR:
                                this.line.suprimir();
                            break;
                            case Key._RIGHT:
                                this.line.right();
                            break;
                            
                            case Key._BACKSPACE:
                                this.line.backspace();
                            break;
                            case Key._END:
                                this.line.end();
                            break;
                            case Key._HOME:
                                this.line.home();
                            break;
                            case Key._LEFT:
                                this.line.left();
                            break;
                            default:
                                this.line.invInput();
                            break;
                           
                    }
                }else if(r_lect!=Key.ENTER){
                    line.addCaracter((char)r_lect);
                }
                     
       } while(r_lect != Key.ENTER);
       this.unsetRaw();
       return line.getLine().toString();
    }

    
}