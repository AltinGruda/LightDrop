import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const name = localStorage.getItem('name');
    const response = await axios.post('http://localhost:5000/create-room', { name });
    setRoomId(response.data.roomId);
  };

  const handleJoinRoom = () => {
    navigate(`/join-room/${roomId}`);
  };

  return (
    <div>
      <h2>Create Room</h2>
      <button onClick={handleCreateRoom}>Create Room</button>
      <p>or join one</p>
      <input type="text" onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={handleJoinRoom}>Join Room</button>
      {roomId && (
        <div>
          <p>Room ID: {roomId}</p>
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
