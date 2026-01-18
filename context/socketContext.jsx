import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
const SOCKET_URL = "https://auth-api-4-h4v4.onrender.com";
//  import.meta.env.DEV
// ? "http://localhost:5000"
// :

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    s.on("connect", () => {
      // console.log("✅ Socket connected:", s.id);
    });

    s.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(s);

    return () => s.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
