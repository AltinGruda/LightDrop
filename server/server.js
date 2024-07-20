const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { PeerServer } = require('peer');

const app = express();
const server = http.createServer(app);
app.use(express.json())
app.use(cors());
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
})
  
// app.use(cors({
//   origin: 'http://localhost:5173', // React app URL
//   methods: ['GET', 'POST'], 
//   allowedHeaders: ['Content-Type']
// }));


const peerServer = new PeerServer({ port: 9000, path: '/peerjs' });

let rooms = {};

app.post('/create-room', (req, res) => {
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

app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  if(!rooms.hasOwnProperty(roomId)){
    res.status(404).json('Room not found!');
  } 
  res.json("Room found!");
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      let user = rooms[roomId]["users"].find(user => user.id === userId);
      user['socketId'] = socket.id;
      io.to(roomId).emit('user-joined', { userId, users: rooms[roomId].users });
      console.log("Joined Room: ", JSON.stringify(rooms));
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      let roomFound = "";
      // find room before removing the user so i can update users in client (via emitting)
      // remove user from the room when user disconnects
      // delete the room when no users is in it
      for(const [key] of Object.entries(rooms)){
        rooms[key]["users"] = rooms[key]["users"].filter(user => user.socketId !== socket.id);
        io.to(key).emit('user-disconnected', { users: rooms[key].users });
        if(rooms[key]["users"].length === 0){
          delete rooms[key];
        }
      }
      
      console.log("Disconnected: ", JSON.stringify(rooms));
    })

})

server.listen(5000, () => console.log('Server started at port 5000'));