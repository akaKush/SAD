
//constants necessàries

const express = require('express');
const app = express(); //crea la express app
const http = require('http').Server(app); //app esta al http server
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000; //tria un altre port si 3000 no està disponible




http.listen(PORT, () => {
    console.log("listening on port " + PORT);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')  //envia la vista html que s'ha de mostrar
})

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log("client is connected " + socket.id ) //si es connecta un client, ens mostra el seu ID
    
    socket.on('chat', (data) => {
        io.sockets.emit('chat', data)
    });

    socket.on('userTyping', (data) => {
        socket.broadcast.emit('userTyping', data)
    })

})