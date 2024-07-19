import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Peer } from 'peerjs';

const socket = io('http://localhost:5000');

const JoinRoom = () => {
  const { roomId } = useParams();
  const name = localStorage.getItem('name');
  const [users, setUsers] = useState([]);

  const [peerId, setPeerId] = useState(null);
  const [peerInstance, setPeerInstance] = useState(null);
  
    const sendFile = (conn, file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target.result;
        const fileData = {
            buffer,
            type: file.type,
            name: file.name
        };
        conn.send(fileData);
      };
      reader.readAsArrayBuffer(file);
    };

  useEffect(() => {
    console.log("Inside useEffect")
    const connectToNewUser = (newUserId) => {
      const conn = peerInstance.connect(newUserId);
  
      conn.on('data', data => {
        console.log('Received:', data);
      });
    };

    const fetchUsers = async () => {
      const response = await axios.post('http://localhost:5000/join-room', { roomId, name });
      if (response.data.success) {
        const { userId } = response.data;
        socket.emit('join-room', roomId);
        // Create a new PeerJS instance for this user
        const peer = new Peer(userId, {
          host: 'localhost',
          port: 9000,
          path: '/peerjs',
        });

        setPeerInstance(peer);

        peer.on('open', (id) => {
          setPeerId(id);
        })

        peer.on('connection', conn => {
          conn.on('data', data => {
            console.log('Received:', data);
            const blob = new Blob([data.buffer], {type: data.type});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = data.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          });
        });

        socket.on('user-joined', ({ userId: newUserId, users }) => {
          setUsers(users);
          if (newUserId !== userId) {
            connectToNewUser(newUserId);
          }
        });
      }
    };
    fetchUsers();
  }, [name, roomId]);



  return (
    <div>
        <div>
          <h2>Room Key: {roomId}</h2>
          <p>Users in Room:</p>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
          <input type="file" onChange={(e) => {
            const file = e.target.files[0];
            console.log(file.type)
            users.forEach(user => {
              if (user.id !== peerId) {
                const conn = peerInstance.connect(user.id);
                conn.on('open', () => {
                  sendFile(conn, file);
                });
              }
            });
          }} />
        </div>
    </div>
  );
};

export default JoinRoom;
