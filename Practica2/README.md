# Introducció
En aquesta pràctica es proposa la programació d’una aplicació Xat textual amb servidor centralitzat. El servidor fa un broadcast dels missatges originats per un client a la resta de clients. Cada client s’identifica per un nick que s’envia al servidor quan aquest es connecta.


# Parts de la pràctica
Es demana:

1. Programar dues classes MySocket i MyServerSocket que siguin funcionalment equivalents a les classes de Java Socket i ServerSocket però que encapsu-li’n excepcions i els corresponents streams de text BufferedReader i PrintWriter. Aquestes classes hauran de disposar de mètodes de lectura/escriptura dels tipus bàsics.

2. El Servidor:
El Servidor està composat per MyServerSocket y Server. 
MyServerSocket s'encarrega de la llògica general de l'aplicació. 
El servidor manté un diccionari de parells (nick,socket). Aquest diccionari pot ser accedit en mode lectura o escriptura de forma que el servidor haurà de garantir-ne la seva consistència.
public static ConcurrentHashMap<String, Server> clients = new ConcurrentHashMap<String, Server>();
La classe Server s'encarrega d'atendre a cada client en particular.

3. El client:
El Client està compost per la classe MySocket, ReadThread, WriteThread.
La classe MySocket conté el socket que es comunica amb el servidor.
La classe ReadThread llegeix la informació que arriba per el servidor i la mostra per consola.
La classe WriteThread llegeix la informació que introdueix l'usuari per consola i l'envia pel socket que es
comunica amb el servidor.

4. Per executar l'apliació
Servidor: java MyServerSocket <port-number>
Client: java Main <host> <port-number>