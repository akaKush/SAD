import java.io.*;
import java.util.*;




// setRaw: passa la consola de mode cooked a mode raw.
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

    // unsetRaw: passa la consola de mode raw a mode cooked.
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



/* METODES READ & READLINE


public  int read() throws IOException{

        int caracter = 0;
        caracter = super.read();
        if(caracter == ESC){
            caracter = super.read();
            if(caracter == CORCHETE){
                caracter = super.read();
                switch(caracter){
                    case RIGHT:
                        return SEC_RIGHT;

                    case LEFT:
                        return SEC_LEFT;

                    case HOME:
                        return SEC_HOME;

                    case END:
                        return SEC_FIN;

                    case INSERT:
                        caracter = super.read();
                        if(caracter == TRONCHO){
                            return SEC_INSERT;
                        }
                        return -1;

                    case DELETE:
                        caracter = this.read();
                        if(caracter == TRONCHO){
                            return SEC_DELETE;
                        }
                        return -1;

                    default:
                        return -1;

                }
            }
        }else if(caracter == BACKSPACE){
            return BACKSPACE;
        }else{
            return caracter;
        }
        return -1;
    }




    
    public String readLine() throws IOException{

        int caracter = 0;
        do{
            caracter = this.read();
            if(caracter >= ESCAPE_SEC){
                switch (caracter){
                    case SEC_INSERT:
                        this.linia.changeInsert();
                    break;
                    case SEC_DELETE:
                        this.linia.Delete();
                        //System.out.print("\033[1P");
                    break;
                    case SEC_FIN:
                        this.linia.Fin();
                    break;
                    case SEC_HOME:
                        this.linia.Home();
                    break;
                    case SEC_LEFT:
                        this.linia.Left();
                    break;
                    case SEC_RIGHT:
                        this.linia.Right();
                    break;
                }
            }
            else if (caracter == SEC_BACKSPACE){
                this.linia.Backspace();

            }

            else if (caracter != ENTER){
                this.linia.addCaracter(caracter);
            }
                //___DEBUG___
                int aux = this.linia.getPos()+1;                  //CODI BO
                System.out.print("\r"+this.linia.toString());    //CODI BO
                System.out.print("\033["+aux+"G");                //CODI BO
        }while(caracter != ENTER);
        this.linia.enter();
        return this.linia.toString();
    }

*/