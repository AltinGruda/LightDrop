import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const STAGGER_CHILD_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, type: "spring" } },
  };

  const handleRegister = () => {
    localStorage.setItem("name", name);
    navigate("/create-room");
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
        <motion.div variants={STAGGER_CHILD_VARIANTS} className="space-y-10">
          <h1 className="font-display text-4xl font-bold text-foreground transition-colors sm:text-5xl">
            Welcome to LightDrop
          </h1>
          <p className="max-w-md text-accent-foreground/80 transition-colors sm:text-lg">
            LightDrop gives you the power to securely share your files with your
            friends.
          </p>
        </motion.div>
        <motion.div
          variants={STAGGER_CHILD_VARIANTS}
          className="flex flex-col space-y-10 items-center"
        >
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleRegister}
            className="inline-block py-3 text-md text-white bg-gray-800 px-6 hover:bg-gray-700 rounded-xl w-fit"
          >
            Register
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
