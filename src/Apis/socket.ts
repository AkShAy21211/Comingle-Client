import { io, Socket } from "socket.io-client";

const backendUrl =
  import.meta.env.VITE_NODE_ENV === "DEVELOPMENT"
    ? import.meta.env.VITE_BACKEND_URI_DEV
    : import.meta.env.VITE_BACKEND_URI;

let socket: Socket | null = null;

export const connectToSocket = () => {
  if (socket) {
    console.log("Already connected to WebSocket server");
    return socket;
  }

  socket = io(backendUrl);

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket is not connected. Call connectToSocket() first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Disconnected from WebSocket server");
  } else {
    console.log("Socket is already disconnected");
  }
};
