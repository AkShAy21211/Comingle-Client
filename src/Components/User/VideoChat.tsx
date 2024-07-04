import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { BsMicFill } from "react-icons/bs";
import { FaMicrophoneSlash } from "react-icons/fa";
import { MdOutlineCallEnd } from "react-icons/md";
import { HiMiniVideoCameraSlash } from "react-icons/hi2";
import { BsFillCameraVideoFill } from "react-icons/bs";
import socket from "../../Apis/socket";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
interface VideoChatProps {
  stream: MediaStream | null;
  peerStream: MediaStream | null;
  peer: Peer | null;
  endCall: () => void;
}

const VideoChat: React.FC<VideoChatProps> = ({
  stream,
  peer,
  peerStream,
  endCall,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [remoteAudioMuted, setRemoteAudioMuted] = useState(false);
  const [remoteVideoMuted, setRemoteVideoMuted] = useState(false);
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );
  const receiver: any = useSelector(
    (state: RootState) => state.chat.selectedChat.receiver
  );
    const [isSpeaking, setIsSpeaking] = useState(false); // State to track speaking activity

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    if (peerStream && remoteRef.current) {
      remoteRef.current.srcObject = peerStream;
    }

       // Track audio activity in the peerStream
       if(!peerStream) return;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(peerStream);

      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioActivity = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

        // Adjust threshold as needed based on your audio levels
        const threshold = 100;

        if (average > threshold) {
          setIsSpeaking(true);
        } else {
          setIsSpeaking(false);
        }
      };

      // Start monitoring audio activity
      const interval = setInterval(updateAudioActivity, 200); // Adjust interval as needed

      return () => {
        clearInterval(interval);
        audioContext.close();
      };
  }, [stream, peerStream, peer, remoteVideoMuted]);

  const toggleAudio = () => {
    if (stream) {
      socket.emit("audio:status", { room: selectedChat.chatId });
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudioMuted(!audioMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      socket.emit("vedio:status", { room: selectedChat.chatId });
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoMuted(!videoMuted);
    }
  };

  const handleRemoteVideoStatus = () => {
    setRemoteVideoMuted(!remoteVideoMuted);
  };
  const handleRemoteAudioStatus = () => {
    setRemoteAudioMuted(!remoteAudioMuted);
  };

  useEffect(() => {
    socket.on("audio:status", handleRemoteAudioStatus);
    socket.on("vedio:status", handleRemoteVideoStatus);

    return () => {
      socket.off("audio:status", handleRemoteAudioStatus);
      socket.off("vedio:status", handleRemoteVideoStatus);
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="relative mt-16 md:mt-1 lg:mt-1 w-full h-full md:w-1/2  bg-gray-800 rounded-lg overflow-hidden">
          <p className="absolute top-2 left-2 text-sm font-semibold p-1 rounded-md">
            {remoteAudioMuted ? (
              <FaMicrophoneSlash className="text-custom-blue/80" size={20} />
            ) : (
              <BsMicFill className={` ${isSpeaking?'text-blue-600 scale-125    ':'text-custom-blue/80'}`} size={20} />
            )}
          </p>
          <p className="absolute top-2 left-10 text-sm font-semibold p-1 rounded-md">
            {remoteVideoMuted ? (
              <HiMiniVideoCameraSlash
                className="text-custom-blue/80"
                size={20}
              />
            ) : (
              <BsFillCameraVideoFill
                className="text-custom-blue/80"
                size={20}
              />
            )}
          </p>
          {!remoteVideoMuted ? (
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            ></video>
          ) : (
            <div className="w-auto  h-96 flex justify-center items-center ">
              {receiver.profile.image ? (
                <img
                  className="w-32 h-32 rounded-full"
                  src={receiver?.profile?.image}
                  alt=""
                />
              ) : (
                <Avatar
                  className="w-32 h-32 rounded-full"
                  name={receiver.name}
                />
              )}
            </div>
          )}
          {/* Local video positioned bottom-right */}
          {stream && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute bottom-2 right-2 w-20 md:w-32 h-28 md:h-48 object-cover rounded-md border-2 border-white"
            ></video>
          )}
        </div>
        {/* <div className="relative w-full mt-1 h-64 md:w-1/2 md:h-96 bg-gray-800 rounded-lg overflow-hidden">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        </div> */}
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full text-sm font-semibold ${
            audioMuted ? "bg-red-600" : "bg-custom-teal"
          }`}
        >
          {audioMuted ? <FaMicrophoneSlash /> : <BsMicFill />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full text-sm font-semibold ${
            videoMuted ? "bg-red-600" : "bg-custom-teal"
          }`}
        >
          {videoMuted ? <HiMiniVideoCameraSlash /> : <BsFillCameraVideoFill />}
        </button>
        <button
          onClick={endCall}
          className="p-4 bg-red-600 rounded-full text-sm font-semibold"
        >
          <MdOutlineCallEnd />
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
