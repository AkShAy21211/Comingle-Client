import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import socket from "../../Apis/socket";
import peer from "../../Utils/peer";
import { FaPhoneSlash } from "react-icons/fa6";



type VideoChat={
  setIsVedio:React.Dispatch<SetStateAction<boolean>>;
}

function VideoChat({setIsVedio}:VideoChat) {
  const [remoteSocket, setRemoteSocket] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [callInitiated, setCallInitiated] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const reciver = useSelector((state: RootState) => state.chat.selectedChat.receiver);

  const handleJoinRoom = useCallback((data: { roomId: string; userId: string }) => {
    const { userId, roomId } = data;
    console.log(userId, roomId);
  }, []);

  const handleUserJoin = useCallback((data: { userId: string; id: string }) => {
    const { userId, id } = data;
    console.log(userId, id);
    setRemoteSocket(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    if (!callInitiated) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocket, offer });
      setStream(stream);
      setCallInitiated(true);
    }
  }, [remoteSocket, callInitiated]);

  const handleIncomingCall = useCallback(async (data: any) => {
    const { from, offer } = data;
    setRemoteSocket(from);
    console.log("incoming call", from, offer);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    setStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
    setIncomingCall(true);
  }, []);

  const sendStreams = useCallback(() => {
    if (stream) {
      for (const track of stream?.getTracks()) {
        peer.peer?.addTrack(track, stream);
      }
    }
  }, [stream]);

  const handleCallAccepted = useCallback((data: any) => {
    const { ans } = data;
    setCallAccepted(true);
    setIncomingCall(false);
    sendStreams();
    peer.setLocalDescription(ans);
    console.log("call accepted", ans);
  }, [sendStreams]);

  const handleEndCall = useCallback(() => {
    setStream(undefined);
    setRemoteStream(undefined);
    setCallInitiated(false);
    setCallAccepted(false);
    setIncomingCall(false);
    setIsVedio(false)
    // Additional logic to inform peer about call termination if needed
  }, []);

  const handleNegotiation = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocket });
  }, [remoteSocket]);

  const handleNegotiationIncoming = useCallback(async (data: any) => {
    const { from, offer } = data;
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans });
  }, []);

  const handleNegotiationFinal = useCallback(async (data: any) => {
    const { ans } = data;
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    socket.on("join:room", handleJoinRoom);
    return () => {
      socket.off("join:room", handleJoinRoom);
    };
  }, [handleJoinRoom]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoin);
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);
    return () => {
      socket.off("user:joined", handleUserJoin);
      socket.off("incomming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationIncoming);
      socket.off("peer:nego:final", handleNegotiationFinal);
    };
  }, [handleUserJoin, handleIncomingCall, handleCallAccepted, handleNegotiationIncoming, handleNegotiationFinal]);

  useEffect(() => {
    peer.peer?.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [handleNegotiation]);

  useEffect(() => {
    peer.peer?.addEventListener("track", (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0] as any);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-5 mt-16 border-t-2 h-screen">
      <div className="flex items-center gap-4">
        {!callAccepted && !callInitiated && !incomingCall && (
          <div className="flex flex-col items-center">
            <img
              src={reciver?.profile?.image}
              className="w-20 h-20 rounded-full mb-2"
              alt="Receiver Profile"
            />
            {remoteSocket && (
              <button
                onClick={handleCallUser}
                className="bg-blue-500 px-4 py-2 text-white rounded-md"
              >
                Call
              </button>
            )}
          </div>
        )}
        {incomingCall && (
          <button onClick={handleCallAccepted} className="bg-green-500 px-4 py-2 text-white rounded-md">
            Answer
          </button>
        )}
       
      </div>
      <div className="flex gap-8 mt-4">
        {remoteStream && (
          <div className="relative w-full">
         
            <ReactPlayer  height="500px" width="100%" playing={true} url={remoteStream} />
            {stream && (
              <div className="absolute bottom-0 right-0 z-10 bg-black opacity-50 text-white p-2">
             
              </div>
            )}
            {stream && (
              <ReactPlayer  style={{float:"right"}} height="100px" width="150px" playing={true} url={stream} />
            )}

             {callAccepted && (
          <button onClick={handleEndCall} className="bg-red-500 rounded-full p-5  text-whit mt-10">
            <FaPhoneSlash color="white"/>
          </button>
        )}
          </div>
          
        )}
        
      </div>
    </div>
  );
}

export default VideoChat;
