import "./App.css";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="mx-auto flex h-screen max-w-3x flex-col items-center justify-center overflow-x-hidden">
      <div
        className="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" exact element={<Register />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room/:roomId" element={<JoinRoom />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
