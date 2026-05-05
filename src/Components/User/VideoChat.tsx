import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { BsMicFill, BsFillCameraVideoFill } from "react-icons/bs";
import { FaMicrophoneSlash } from "react-icons/fa";
import { MdOutlineCallEnd } from "react-icons/md";
import { HiMiniVideoCameraSlash } from "react-icons/hi2";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { connectToSocket } from "../../Apis/socket";

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
  const socket = connectToSocket();
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
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    if (peerStream && remoteRef.current) {
      remoteRef.current.srcObject = peerStream;
    }

    if (!peerStream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(peerStream);

    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateAudioActivity = () => {
      analyser.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

      setIsSpeaking(average > 100);
    };

    const interval = setInterval(updateAudioActivity, 200);

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
      socket.emit("video:status", { room: selectedChat.chatId });
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoMuted(!videoMuted);
    }
  };

  useEffect(() => {
    const handleRemoteVideoStatus = () => {
      setRemoteVideoMuted((prev) => !prev);
    };
    const handleRemoteAudioStatus = () => {
      setRemoteAudioMuted((prev) => !prev);
    };

    socket.on("audio:status", handleRemoteAudioStatus);
    socket.on("video:status", handleRemoteVideoStatus);

    return () => {
      socket.off("audio:status", handleRemoteAudioStatus);
      socket.off("video:status", handleRemoteVideoStatus);
    };
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-3 py-24 text-white lg:min-h-[calc(100vh-8rem)] lg:px-6 lg:py-8">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-4">
        <div className="relative mt-2 h-[62vh] w-full overflow-hidden rounded-[28px] bg-slate-950 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.6)] sm:h-[68vh] lg:mt-0 lg:h-[72vh]">
          <p className="absolute left-2 top-2 rounded-md p-1 text-sm font-semibold">
            {remoteAudioMuted ? (
              <FaMicrophoneSlash className="text-custom-blue/80" size={20} />
            ) : (
              <BsMicFill
                className={`${
                  isSpeaking
                    ? "scale-125 text-blue-600"
                    : "text-custom-blue/80"
                }`}
                size={20}
              />
            )}
          </p>
          <p className="absolute left-10 top-2 rounded-md p-1 text-sm font-semibold">
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
              id="remoteVideo"
              playsInline
              className="h-full w-full object-cover"
            ></video>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900/80">
              {receiver?.profile?.image ? (
                <img
                  className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                  src={receiver.profile.image}
                  alt=""
                />
              ) : (
                <Avatar
                  className="h-32 w-32 rounded-full"
                  name={receiver?.name}
                />
              )}
            </div>
          )}

          {stream && (
            <video
              ref={videoRef}
              autoPlay
              muted
              id="localVideo"
              playsInline
              className="absolute bottom-3 right-3 h-24 w-20 rounded-2xl border-2 border-white/80 object-cover shadow-lg sm:h-32 sm:w-24 lg:bottom-5 lg:right-5 lg:h-40 lg:w-32"
            ></video>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={toggleAudio}
          className={`rounded-full p-4 text-sm font-semibold shadow-sm transition ${
            audioMuted ? "bg-red-600" : "bg-custom-teal"
          }`}
        >
          {audioMuted ? <FaMicrophoneSlash /> : <BsMicFill />}
        </button>
        <button
          onClick={toggleVideo}
          className={`rounded-full p-4 text-sm font-semibold shadow-sm transition ${
            videoMuted ? "bg-red-600" : "bg-custom-teal"
          }`}
        >
          {videoMuted ? <HiMiniVideoCameraSlash /> : <BsFillCameraVideoFill />}
        </button>
        <button
          onClick={endCall}
          className="rounded-full bg-red-600 p-4 text-sm font-semibold shadow-sm transition"
        >
          <MdOutlineCallEnd />
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
