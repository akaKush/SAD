//package mvc;


interface Key {
    
    // Codification used between Line and Console in notifyObservers
   
     // Valors dentrada de system.in
     static final int ENTER = 13;
     static final int ESC = 27;
     static final int INSERT = 50; // ^[[2~
     static final int SUPR = 51; // ^[[3~
     static final int LEFT = 68; // ^[[D
     static final int RIGHT = 67; // ^[[C
     static final int END = 70; // ^[[6~
     static final int HOME = 72; // ^[[5~
     static final int CORCHETE = 91;
     static final int BACKSPACE = 127;
     // valors interns de comunicació entre ReadLine() i Line
     static final int _ESCAPE= 200; //a partir de 200 hem definit les escape secuences
     static final int _INSERT = 201;
     static final int _SUPR = 205;
     static final int _HOME = 208;
     static final int _LEFT = 204;
     static final int _RIGHT = 202;
     static final int _END = 203;
     static final int _BACKSPACE = 206;
     static final int _INVINPUT=207;
   
     public final static Integer cDEL = 1008;
     public final static Integer cRIGHT = 1009;
     public final static Integer cLEFT = 1010;
     public final static Integer cHOME = 1011;
     public final static Integer cEND = 1012;
     public final static Integer cINSERT = 1013;
     public final static Integer cBS = 1014;
     public final static Integer cREPLACE = 1015;
    
   }