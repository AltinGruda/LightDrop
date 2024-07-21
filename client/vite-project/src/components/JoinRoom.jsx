import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { Peer } from "peerjs";
import { motion } from "framer-motion";

const socket = io("https://light-drop-api.vercel.app/");

const JoinRoom = () => {
  const { roomId } = useParams();
  const name = localStorage.getItem("name");
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
        name: file.name,
      };
      conn.send(fileData);
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    console.log("Inside useEffect");
    const connectToNewUser = (newUserId) => {
      const conn = peerInstance.connect(newUserId);

      conn.on("data", (data) => {
        console.log("Received:", data);
      });
    };

    const fetchUsers = async () => {
      const response = await axios.post(
        "https://light-drop-api.vercel.app/join-room",
        {
          roomId,
          name,
        }
      );
      if (response.data.success) {
        const { userId } = response.data;
        socket.emit("join-room", roomId, userId);
        // Create a new PeerJS instance for this user
        const peer = new Peer(userId, {
          host: "localhost",
          port: 9000,
          path: "/peerjs",
        });

        setPeerInstance(peer);

        peer.on("open", (id) => {
          setPeerId(id);
        });

        peer.on("connection", (conn) => {
          conn.on("data", (data) => {
            console.log("Received:", data);
            const blob = new Blob([data.buffer], { type: data.type });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = data.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          });
        });

        socket.on("user-joined", ({ userId: newUserId, users }) => {
          setUsers(users);
          if (newUserId !== userId) {
            connectToNewUser(newUserId);
          }
        });

        socket.on("user-disconnected", ({ users }) => {
          setUsers(users);
        });
      }
    };
    fetchUsers();
  }, [name, roomId]);

  if (users.length === 0) {
    return <div>Room does not exist.</div>;
  }
  console.log(users);

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
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-[800px] sm:w-[780px] bg-white">
            <div className="py-6 px-9 ring-1 ring-inset ring-gray-300 rounded-md">
              <motion.div
                className="mb-5 flex justify-center"
                variants={STAGGER_CHILD_VARIANTS}
              >
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Room key: &nbsp;
                </label>
                <p className="mb-3 block text-base font-medium text-[#07074D]">
                  {roomId}
                </p>
              </motion.div>
              <motion.div className="mb-5" variants={STAGGER_CHILD_VARIANTS}>
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Users in the room:
                </label>
                <div className="flex flex-col gap-y-2">
                  {users.map((user) => (
                    <div className="flex items-center gap-x-6" key={user.id}>
                      <span className="h-12 w-12 rounded-full flex items-center justify-center bg-teal-700">
                        {user.name[0]?.toUpperCase()}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                          {user.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mb-6 pt-4"
                variants={STAGGER_CHILD_VARIANTS}
              >
                <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                  Upload File
                </label>

                <div className="mb-8">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      console.log(file.type);
                      users.forEach((user) => {
                        if (user.id !== peerId) {
                          const conn = peerInstance.connect(user.id);
                          conn.on("open", () => {
                            sendFile(conn, file);
                          });
                        }
                      });
                    }}
                  />
                  <label
                    htmlFor="file"
                    className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                  >
                    <div>
                      <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                        Drop files here
                      </span>
                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                        Or
                      </span>
                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                        Browse
                      </span>
                    </div>
                  </label>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JoinRoom;
