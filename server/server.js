const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { nanoid } = require('nanoid');

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

let rooms = {};

app.post('/create-room', (req, res) => {
  const { name } = req.body;
  const roomId = nanoid(8);
  rooms[roomId] = { users: []}
  res.json({ roomId });
})

app.post('/join-room', (req, res) => {
  const { name, roomId } = req.body;
  if(rooms[roomId]) {
    rooms[roomId].users.push({ id: nanoid(8), name });
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Room not found!"});
  }
})

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      io.to(roomId).emit('user-joined', rooms[roomId].users);
      console.log(JSON.stringify(rooms))
    });

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

})

server.listen(5000, () => console.log('Server started at port 5000'));