
# Explicació de la pràctica

Primer executem el Server, i el deixem en execució, mentres en paral·lel correm un client per consola, en el qual podem comprovar com s'envien els missatges d'un client a l'altre.

A la segona part, hem desenvolupat un client gràfic amb Swing, la qual executa el Server i també la part Main del client.

Si volem executar un client per consola fem servir el fitxer Client (dins de la carpeta view), i allà podem veure els diferents usuaris connectats, amb els quals el client pot parlar. 

# Introducció
Aquesta pràctica consta de dues parts: servidor amb selector nio i patrò reactor, i xat gràfic amb Swing.

# Selector NIO i patrò reactor
Programeu el servidor fent servir el patrò reactor vist a classe i l’API NIO. Proveu el xat.

# Xat gràfic
Programeu una interfíce gràfica senzilla per al xat. Hauria de disposar com a mínim d’una àrea d’entrada, una àrea de missatges i una d’usuaris.

L’àrea d’usuaris s’hauria d’implementar amb JList. La majoria de widgets gràfics com JList disposen de model i modificant aquest model es modifica la vista del widget—es a dir, tenen implementat internament el patrò MVC—. Feu servir el model DefaultListModel—o derivat— com a model de JList.

Proveu el xat gràfic amb varis usuaris connectats.