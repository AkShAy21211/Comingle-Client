import { useState, useEffect } from "react";
import  SocketIo,{ Socket } from "socket.io-client";

const backendUrl =
  import.meta.env.VITE_NODE_ENV === "DEVELOPMENT"
    ? import.meta.env.VITE_BACKEND_URI_DEV
    : import.meta.env.VITE_BACKEND_URI;

    
    
    
// Add ws:// or wss:// prefix if not already included
const wsProtocol = import.meta.env.VITE_NODE_ENV === "DEVELOPMENT" ? "ws://" : "wss://";
const ws = backendUrl.startsWith("http") ? backendUrl.replace(/^http/, "ws") : wsProtocol + backendUrl;

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance: Socket = SocketIo(ws);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
