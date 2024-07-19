const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { PeerServer } = require('peer');

const app = express();
const server = http.createServer(app);
app.use(express.json())
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

const peerServer = new PeerServer({ port: 9000, path: '/peerjs' });

let rooms = {};

app.post('/create-room', (req, res) => {
  const { name } = req.body;
  const roomId = nanoid(8);
  rooms[roomId] = { users: []}
  res.json({ roomId });
})

app.post('/join-room', (req, res) => {
  const { name, roomId } = req.body;
  if (rooms[roomId]) {
    const userId = nanoid(8); // Generate a unique user ID
    rooms[roomId].users.push({ id: userId, name });
    res.json({ success: true, userId }); // Include userId in the response
  } else {
    res.status(404).json({ error: "Room not found!"});
  }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      io.to(roomId).emit('user-joined', { userId, users: rooms[roomId].users });
      console.log(JSON.stringify(rooms));
    });

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

})

server.listen(5000, () => console.log('Server started at port 5000'));