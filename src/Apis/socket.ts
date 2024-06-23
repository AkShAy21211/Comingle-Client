import { io, Socket } from "socket.io-client";

const currentUser = localStorage.getItem("user");

const user = currentUser ? JSON.parse(currentUser) : null;

let socket: Socket;

export const connectSocket = (): void => {
  if (!socket) {
    socket = io("http://192.168.1.4:5000", {
      transports:['websocket'],
      query: {
        userId: user._id,
      },
    });

    socket.on("connect", () => {
      console.log("connected to server", socket?.id);
    });

    socket.emit("setup",user._id);

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket.io not initialized!");
  }
  return socket;
};
