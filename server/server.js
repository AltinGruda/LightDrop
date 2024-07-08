const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // React app URL
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
});
  
  app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));
let users = [];

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('register', (name) => {
        users.push({id: socket.id, name});
        console.log(users);
        io.emit('update-users', users);
    });
})

server.listen(5000, () => console.log('Server started at port 5000'));