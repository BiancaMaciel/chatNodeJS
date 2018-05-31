const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app); //define protocolo HTTP
const io = require('socket.io')(server); //config web socket

app.use(express.static(path.join(__dirname, 'public'))); //path frontend da aplicação
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => { //definindo a rota inicial
    res.render('index.html');
});

let messages = [];

/**
 * - Toda vez que algum cliente se conectar ele vai receber o socket
 */
io.on('connection', socket => {
    console.log(`Socket conctado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
})

server.listen(3000); //porta de escuta