import { useEffect, useState } from 'react';
import './App.css'
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const socket = io('http://localhost:5000/')

function App() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [currentPeer, setCurrentPeer] = useState(null);


  const register = () => {
    socket.emit('register', name);
  }

  useEffect(() => {
    socket.on('update-users', (users) => {
      setUsers(users);
    });

    socket.on('signal', (data) => {
      if(currentPeer) {
        currentPeer.signal(data.data);
      }
    });
  }, [currentPeer]);

  const connectToUser = (peerId) => {
    const peer = new SimplePeer({initiator: true});
    peer.on('signal', (data) => {
      peer.emit({ to: peerId, data});
    });

    peer.on('connect', () => {
      console.log('Connected to', peerId);
    });

    setCurrentPeer(peer);
  }

  return (
    <>
      <p>Set your name: </p>
      <input
        type="text"
        placeholder="Your Name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={register}>Register</button>

      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name === name ? `${user.name} (You)` : user.name}
            <button onClick={() => connectToUser(user.id)}>Connect</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
