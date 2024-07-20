import "./App.css";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" exact element={<Register />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room/:roomId" element={<JoinRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
