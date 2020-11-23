import java.io.*;
import java.util.*;


/**
*
*   @author akaKush, JordiParra
*/


public class EditableBufferedReader extends BufferedReader {

    private Line linia;
    private int posicio;
    private int length;

    private static final char ESC = '\033';
    private static final char _ESC = 199;
    private static final int ESQUERRA = 200;
    private static final int DRETA = 201;
    private static final int INICI = 203;
    private static final int FINAL = 204;
    private static final int DEL = 205;
    private static final int INS = 206;

    private static final int USELESS = 202;
    private static final int BACKSPACE = 127;
    private static final int ENTER = 10;

    
    public EditableBufferedReader(Reader in){
        super(in);
        this.linia = new Line();
        this.posicio = 0;
        this.length = 0;
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

    /**
    * Escribim el codi de la funció READ
    *
    * Aquesta ha de llegir el següent caràcter que apretem al teclat
    * El problema és que cada caràcter te un codi associat, els quals son:
    *
    *   (right) Fletxa Dreta:       ESC [ C
    *   (left) Fletxa Esquerra:     ESC [ D
    *   (home) Inici Linea:         ESC [ H o ESC O H, ESC [ 1 -
    *   (end) Final Linea:          ESC [ F o ESC O F, ESC [ 4 -
    *   (ins) Insertar:             ESC [ 2 -
    *   (del) Eliminar:             ESC [ 3  
    *   
    *   Això implica que si el caràcter comença per ESC, continuem llegint
    *   per identificar quina es la tecla que s'ha premut
    *
    *   Si !comença per ESC => llegim el caracter directament
    */

    public int read() throws IOException {
        int car = 0;
        //int num = 0;

        //comprovem si el primer car != ESC, si ho és surt de la funcio
       

        //si no ho era continuem llegint
        car = super.read();
        if(car != ESC) {
            //return car;
        }
        else if (car == ESC) {
            car = super.read();
            switch (car = super.read()) {
                case 'C':
                    car = DRETA;
                case 'D':
                car = ESQUERRA;
                case 'H':
                car = INICI;
                case 'F':
                car = FINAL;
                case 'B':
                car = USELESS;
                case '2':
                    if((car = super.read()) == '~') car = INS;
                    else   car = '2';
                case '3':
                    if((car = super.read()) == '~') car = DEL;
                    else    car = '3';

                default:
                    //return car;
            }
        }
        return car;
    }


    public String readLine() throws IOException, InterruptedIOException {

        int car = 0;
        do{
            car=this.read();

            if(car >= _ESC){
                switch (car){
                    case INS:
                        this.linia.changeInsert();
                    break;
                    case DEL:
                        this.linia.delete();
                    break;
                    case DRETA:
                        this.linia.right();
                    break;

                    case BACKSPACE:
                        this.linia.backspace();
                    break;
                    case FINAL:
                        this.linia.fin();
                    break;
                    case INICI:
                        this.linia.home();
                    break;
                    case ESQUERRA:
                        this.linia.left();
                    break;
                    default:
                        System.out.println("Invalid input 1");
                    break;

                }
            }else if(car != ENTER){
                this.linia.addCaracter(car);
            }
            
            // int aux = this.linia.getPos()+1;                
            // System.out.print("\r"+this.linia.toString());
            // System.out.print("\033["+aux+"G");       
        }while(car != ENTER);
        //System.out.println(car);
        return this.linia.toString();
    }

}