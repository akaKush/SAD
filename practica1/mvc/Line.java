package mvc;


public class Line {
    private StringLine line;
    private boolean mode;
    //si mode --> sobreescribim (setChartAt)
    //si !mode --> insertem (insertChartAt)
    private int posx;


    //default constructor
    public Line(int maxX) {
        this.posx = 0;
        this. line = new StringLine(maxX);
        this.mode = Boolean.FALSE;
    }

    //constructor si passem maxY com a paràmetre
    public Line(int maxX, int maxY) {
        this.posx = 0;
        this.line = new StringLine(maxX, maxY);
        this.mode = Boolean.FALSE;
    }


    //constructor si els parametres són mode i line (newline)
    public Line(boolean mode, StringLine newLine) {
        this.line = newLine;
        this.mode = mode;
        this.posx = newLine.length();
    }

    public boolean getMode() {
        return this.mode;
    }

    public void setMode(Boolean mode) {
        this.mode = mode;
    }

    public void addChar(char c) throws IndexOutOfBoundsException {
        //primer comprovem si volem insertar o sobreescriure
        if(mode) this.line.setChartAt(c, this.posx);
        else this.line.insertChartAt(c, this.posx);
        this.posx++;
    }

    public void deleteChar() throws IndexOutOfBoundsException {
        this.line.deleteCharAt(this.posx - 1);
        this.posx--;
    }

    public void suprimirChar() throws IndexOutOfBoundsException {
        this.line.suprCharAt(this.posx);
    }

    public void moveLeft() {
        if (this.posx > 0) this.posx--;
        else throw new IndexOutOfBoundsException("Left");
    }

    public void moveRight() {
        if (this.posx < this.line.MAX) this.posx++;
        else throw new IndexOutOfBoundsException("Right");
    }

    public void moveEnd() {
        this.posx = this.line.length();
    }

    public void moveHome() {
        this.posx = 0;
    }

    public int getLinePos(){
        return this.posx;
    }

    public void setPos(int posx){
        if(posx > 0 && posx < line.MAX) {
            this.posx = posx;
        }
    }

    @Override
    public String toString() {
        return line.toString();
    }

    public int getLength() {
        return this.line.length();
    }

    public StringLine getStringLine(){
        return this.line;
    }

    public Line concat(Line line_to_concat) {
        if(line!=null){
            this.posx = this.posx + line_to_concat.getLength();
            return (new Line(this.mode, this.line.concat(line_to_concat.getStringLine())));
        }
        return null;
    }

    
}
