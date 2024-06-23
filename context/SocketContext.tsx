import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../src/Redux/rootReducer";

type Props = {
  children: React.ReactNode;
};
const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: Props) => {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    if (currentUser) {
      const newSocket = io("http://192.168.1.4:5000", {
        query: {
          userId: currentUser._id,
        },
      });

      newSocket.on("connect", () => {
      newSocket.emit("setup");
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
