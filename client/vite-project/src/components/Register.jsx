import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    localStorage.setItem('name', name);
    navigate('/create-room');
  };

  return (
    <div>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
