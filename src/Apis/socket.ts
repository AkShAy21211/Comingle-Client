import socketIOClient from "socket.io-client";

const ws = "http://192.168.1.4:5000";
 const socket = socketIOClient(ws);


 export default socket
