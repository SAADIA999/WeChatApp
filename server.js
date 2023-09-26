const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

io.on("connection", (socket) => {
    console.log('A user connected');

    socket.on("join", (username) => {
        socket.username = username;
        const welcomeMsg = `Welcome to the chat, ${username}!`;
        socket.emit('message', welcomeMsg);
        socket.broadcast.emit("message", `${username} has joined the chat.`);
    });

    socket.on('chat', (message) => {
        console.log('From client:', message);
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('message', `${socket.username} has left the chat.`);
        }
        console.log('A user disconnected');
    });
});

const PORT = 3001
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
