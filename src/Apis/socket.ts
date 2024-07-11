import { io, Socket } from "socket.io-client";

const backendUrl =
  import.meta.env.VITE_NODE_ENV === "DEVELOPMENT"
    ? import.meta.env.VITE_BACKEND_URI_DEV
    : import.meta.env.VITE_BACKEND_URI;

let socket: Socket | null = null;

console.log('backend url00000000000000000000',backendUrl);

export const connectToSocket = () => {
  if (socket) {
    console.log("Already connected to WebSocket server");
    return socket;
  }

  console.log("Connecting to:", backendUrl);
  socket = io(backendUrl, {
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
  });

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
