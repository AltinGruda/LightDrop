import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const JoinRoom = () => {
  const { roomId } = useParams();
  const name = localStorage.getItem('name');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("Inside useEffect")
    const fetchUsers = async () => {
      const response = await axios.post('http://localhost:5000/join-room', { roomId, name });
      if (response.data.success) {
        socket.emit('join-room', roomId);
        socket.on('user-joined', (users) => {
          setUsers(users);
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
        </div>
    </div>
  );
};

export default JoinRoom;
