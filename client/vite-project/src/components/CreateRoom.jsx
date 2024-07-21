import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const name = localStorage.getItem("name");
      const response = await axios.post(
        "https://light-drop-api.vercel.app/create-room",
        {
          name,
        }
      );
      setRoomId(response.data.roomId);
      toast("Room has been created!");
    } catch (error) {
      toast.error("Cannot create room!");
    }
  };

  const handleJoinRoom = async () => {
    try {
      const response = await axios.get(
        `https://light-drop-api.vercel.app/room/${roomInput}`
      );
      console.log(response);
      navigate(`/join-room/${roomInput}`);
    } catch (error) {
      toast.error("Cannot join room.");
    }
  };

  const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
  };
  return (
    <motion.div
      className="z-10"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
      >
        <motion.div
          variants={STAGGER_CHILD_VARIANTS}
          className="flex flex-col items-center space-y-10 text-center"
        >
          <motion.p className="text-2xl font-bold tracking-tighter text-foreground">
            LightDrop
          </motion.p>
          <motion.h2 className="font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl">
            Enter your room key or create one
          </motion.h2>
        </motion.div>
        <motion.div variants={STAGGER_CHILD_VARIANTS}>
          <button
            onClick={handleCreateRoom}
            className="inline-block py-3 text-md text-white bg-gray-800 px-6 hover:bg-gray-700 rounded-xl w-fit"
          >
            Create Room
          </button>
        </motion.div>
        {roomId && (
          <motion.div
            className="flex items-center gap-x-2"
            variants={STAGGER_CHILD_VARIANTS}
          >
            <motion.p>Your room key: {roomId}</motion.p>
            <svg
              className="h-6 w-6 text-black-500 hover:text-blue-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-200 hover:cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => {
                navigator.clipboard.writeText(roomId);
                toast("Copied to clipboard.");
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </motion.div>
        )}
        <motion.div
          variants={STAGGER_CHILD_VARIANTS}
          className="flex space-x-2"
        >
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Room key"
            onChange={(e) => setRoomInput(e.target.value)}
          />
          <a
            onClick={handleJoinRoom}
            className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group hover:cursor-pointer"
          >
            <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
            <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
              Join
            </span>
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CreateRoom;
