import java.util.*;
import java.io.*;

public class Line extends Observable{
    ArrayList<Integer> buffer;
    private int posCursor;
    private int length;
    private int pos;
    private boolean insert;

    private String[] action;
    private StringBuilder line;

    public Line() {
        this.buffer = new ArrayList<>();
        this.line = new StringBuilder();
        this.posCursor = 0;
        this.length = 0;
        this.insert = false;
        this.action = new String[2];

    }

    public StringBuilder getLine() {
        return this.line;
    }

    public int getPosCursor() {
        return this.posCursor;
    }
    public int getLength() {
        return this.line.length();
    }

    public Boolean getMode() {
        return this.insert;
    }


    public void invInput(){
        action[0]="false";
        this.setChanged(); //mètode està deprecated
        this.notifyObservers(action); //metode està depecrated

    } 



    public void addCaracter(char newChar) {

        if (getMode()) { //mode insert
            this.line.replace(this.posCursor, this.posCursor + 1, "" + newChar);
            action[0]="true";
            action[1] = "" + newChar;
            this.setChanged();
            this.notifyObservers(action);

        } else {        //add character

            this.line = this.line.insert(this.posCursor, newChar);
            action[0] = "true";//"insertChar";
            action[1] = ANSI.INSERT+newChar;  /*ANSI.INSERT + */
            this.setChanged();
            this.notifyObservers(action);
           
        }
     
        this.posCursor++;

    }

    public void toInsert() {
       
        this.insert = !this.insert;

    }

    public void backspace() {
       if ((this.getLength() > 0) && this.posCursor > 0) {
            int pos=this.posCursor - 1;
            this.line.deleteCharAt(pos);
            this.posCursor--;
            action[0] = "true";
            action[1] = ANSI.BS;
            this.setChanged();
            this.notifyObservers(action);
        }
    }

    public void end() {
        int posFin = this.getLength() - this.posCursor;
        this.posCursor = this.getLength();
        action[0] = "true";
        action[1] = ANSI.END1+posFin+ANSI.END2; // In this case we pass the number to move
        this.setChanged();
        this.notifyObservers(action);
    }

    public void home() {
        this.posCursor = 0;
        action[0] = "true";
        action[1] = ANSI.HOME;
        this.setChanged();
        this.notifyObservers(action);
    }

    public void left() {
 
        if (this.posCursor > 0) {
            this.posCursor--;
            action[0] = "true";
            action[1] = ANSI.LEFT;
            this.setChanged();
            this.notifyObservers(action);
        }
    }

    public void right() {
      
        if (this.posCursor < this.getLength()) {
            this.posCursor++;
            action[0] = "true";
            action[1] = ANSI.RIGHT;
            this.setChanged();
            this.notifyObservers(action);
        }
    }

    public void suprimir() {
      
       if (this.posCursor < getLength()) {
            int pos=this.posCursor;
            this.line.deleteCharAt(pos);
            action[0] = "true";
            action[1] = ANSI.DEL;
            this.setChanged();
            this.notifyObservers(action);
        }
    }
}
