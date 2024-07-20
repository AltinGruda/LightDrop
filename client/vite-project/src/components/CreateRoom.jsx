import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const name = localStorage.getItem("name");
      const response = await axios.post("http://localhost:5000/create-room", {
        name,
      });
      setRoomId(response.data.roomId);
      toast("Room has been created!");
    } catch (error) {
      toast.error("Cannot create room!");
    }
  };

  const handleJoinRoom = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/room/${roomId}`);
      console.log(response);
      navigate(`/join-room/${roomId}`);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div>
      <button onClick={handleCreateRoom}>Create Room</button>
      <p>or join one</p>
      {roomId && <p>Your room key: {roomId}</p>}
      <input type="text" onChange={(e) => setRoomId(e.target.value)} />
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default CreateRoom;
