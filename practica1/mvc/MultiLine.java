package mvc;

import java.util.Observable;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;


public class MultiLine extends Observable {

    private Line[] lines;
    private boolean mode; //mode = sobreescriptura. !mode = inserció
    private int posy; //és la posició del cursor respecte la línia, no sobre la comanda
    public final int MAX_Lines; //Màxim de línies verticals possibles
    public final int MAX_Cols;

    public MultiLine (int maxcols, int maxfils){
        this.mode = Boolean.FALSE;
        this.posy = 0;
        this.MAX_Cols = maxcols;
        this.MAX_Lines = maxfils;
        this.lines = new Line[MAX_Lines];
        this.lines[this.posy] = new Line(this.MAX_Cols, this.MAX_Lines);
    }

    public Boolean newLine() {
        //comprovem la possibilitat de que no estiguem a la última línia,
        //pero que no puguem suportar més Lines (a partir de la última actual)
        if (this.lines[this.MAX_Lines - 1] == null) {
            this.posy++;
            for(int i = this.MAX_Lines -1; i> this.posy; i--){
                this.lines[i] = this.lines[i-1];
            }
            this.lines[this.posy] = new Line(this.MAX_Cols, this.MAX_Lines);
            this.lines[this.posy].setMode(this.mode);
            this.setChanged(); //hem d'utilitzar metodes de PropertyChangeListener
            this.
        }
    }

}