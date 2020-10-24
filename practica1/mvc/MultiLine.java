package mvc;

import java.util.Observable;

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

}