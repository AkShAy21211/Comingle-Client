import socketIOClient from "socket.io-client";
const backendUrl =
  import.meta.env.VITE_NODE_ENV === "DEVELOPMENT"
    ? import.meta.env.VITE_BACKEND_URI_DEV
    : import.meta.env.VITE_BACKEND_URI;

const ws = backendUrl;
const socket = socketIOClient(ws);

export default socket;
