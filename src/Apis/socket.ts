import socketIOClient from "socket.io-client";

const backendUrl = 
  import.meta.env.VITE_NODE_ENV === "DEVELOPMENT"
    ? import.meta.env.VITE_BACKEND_URI_DEV
    : import.meta.env.VITE_BACKEND_URI;

// Add ws:// or wss:// prefix if not already included
const wsProtocol = import.meta.env.VITE_NODE_ENV === "DEVELOPMENT" ? "ws://" : "wss://";
const ws = backendUrl.startsWith("http") ? backendUrl.replace(/^http/, "ws") : wsProtocol + backendUrl;

const socket = socketIOClient(ws);
console.log(ws);

export default socket;
