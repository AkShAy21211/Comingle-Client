import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  removeSlectedChat,
  setUnreadMessage,
} from "../../Redux/Slice/User/chatSlice";
import { RootState } from "../../Redux/store";
import userApi from "../../Apis/user";
import { Message } from "../../Interface/interface";
import ScrollableChat from "./ScrollableChat";
import { PiSpinnerBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import Avatar from "react-avatar";
import { CgAttachment } from "react-icons/cg";
import Picker from "@emoji-mart/react";
import { FaMicrophone, FaRegStopCircle, FaCircle } from "react-icons/fa";
import audioStartBg from "/User/mixkit-atm-cash-machine-key-press-2841.wav";
import audioEnd from "/User/mixkit-correct-answer-tone-2870.wav";
import TypingIndicator from "../Common/TypingIndicator";
import { FaVideo } from "react-icons/fa6";
import VedioChat from "./VideoChat";
import VideoCallNotificationModal from "./VideoCallNotificationModal";
import Peer, { MediaConnection } from "peerjs";
import { addPeer } from "../../Redux/Slice/User/peerSlice";
import { Bounce, toast } from "react-toastify";
import { playTune, endTune } from "../../Utils/tune";
import { connectToSocket } from "../../Apis/socket";

type SingleChatProp = {
  fetchAgain: boolean;
  peer: Peer | null;
  participants: string[];
  setIncommingCall: React.Dispatch<React.SetStateAction<boolean>>;
  inCommingCall: boolean;
  setIsVedioChat: React.Dispatch<React.SetStateAction<boolean>>;
  isVedioChat: boolean;
  remoteId: string;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  setCallIndication: React.Dispatch<
    React.SetStateAction<{ message: string; room: string; from: string }>
  >;
};

function SingleChat({
  fetchAgain,
  setFetchAgain,
  setCallIndication,
  peer,
  setIsVedioChat,
  isVedioChat,
  remoteId,
  setIncommingCall,
  inCommingCall,
}: SingleChatProp) {
  const socket = connectToSocket();
  const dispatch = useDispatch();
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState<boolean>(false);
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );
  const receiver: any = useSelector(
    (state: RootState) => state.chat.selectedChat.receiver
  );
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const isDarMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIstyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [callingUser, setCallingUser] = useState<{
    userId: string;
    message: string;
  }>();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [currentCall, setCurrentCall] = useState<MediaConnection | null>(null);
  const [incomingPeerId, setIncomingPeerId] = useState("");
  const [pendingAccept, setPendingAccept] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);

  const fetchMessages = async () => {
    try {
      if (!selectedChat.chatId) return;

      setLoading(true);
      const response = await userApi.fetchAllMessages(selectedChat.chatId);

      setAllMessages(response.messages);
      setLoading(false);

      socket?.emit("chat:start", {
        room: selectedChat.chatId,
        peerId: currentUser._id,
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat?.chatId]);

  useEffect(() => {
    const handleTyping = () => setIstyping(true);
    const handleStopTyping = () => setIstyping(false);

    socket?.on("typeing", handleTyping);
    socket?.on("stopTypeing", handleStopTyping);

    return () => {
      socket?.off("typeing", handleTyping);
      socket?.off("stopTypeing", handleStopTyping);
    };
  }, []);

  const handleNewMessage = ({
    message,
    room,
  }: {
    message: Message;
    room: string;
  }) => {
    if (!selectedChat.chatId || selectedChat.chatId !== room) {
      dispatch(setUnreadMessage(message.chat));
    } else {
      setAllMessages((prevMessages) => {
        setFetchAgain(!fetchAgain);
        if (!prevMessages.some((msg) => msg._id === message._id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    }
  };

  const handleNewMessageSent = ({
    message,
    room,
  }: {
    message: Message;
    room: string;
  }) => {
    if (!selectedChat.chatId || selectedChat.chatId === room) {
      setFetchAgain(!fetchAgain);

      setAllMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === message._id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    }
  };

  useEffect(() => {
    socket.on("message received", handleNewMessage);
    socket.on("new message sent", handleNewMessageSent);

    return () => {
      socket.off("message received", handleNewMessage);
      socket.off("new message sent", handleNewMessageSent);
    };
  }, [selectedChat.chatId, fetchAgain]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket?.emit("typeing", selectedChat.chatId);
    }

    const lastTypingTime = new Date().getTime();
    const typingTimeout = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= typingTimeout && typing) {
        socket?.emit("stopTypeing", selectedChat.chatId);
        setTyping(false);
      }
    }, typingTimeout);
  };

  const handleSendMessage = async () => {
    if (!selectedChat) return;

    if (newMessage.trim() || selectedFiles.length) {
      try {
        socket?.emit("stopTypeing", selectedChat.chatId);
        setLoading(true);
        const formData = new FormData();

        if (selectedFiles.length) {
          selectedFiles.forEach((file) => {
            formData.append("files", file);
          });
        }

        if (newMessage) {
          formData.append("message", newMessage);
        }

        if (selectedChat.chatId) {
          formData.append("chatId", selectedChat.chatId);
        }

        const response = await userApi.sendNewMessage(formData);
        if (response) {
          setNewMessage("");
          setFetchAgain(!fetchAgain);

          socket?.emit("message", {
            message: response.message,
            room: selectedChat.chatId,
            to: receiver._id,
          });

          setSelectedFiles([]);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  const previewFile = (file: File, i: number) => {
    const fileType = file.type.split("/")[0];
    const fileExtension = file.name.split(".");
    const extension = fileExtension.pop()?.toLowerCase();

    if (fileType === "image") {
      return (
        <div key={i} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
          <img
            src={URL.createObjectURL(file)}
            className="h-full w-full border-2 border-custom-blue/80 object-cover"
            alt=""
          />
        </div>
      );
    }

    if (fileType === "video") {
      return (
        <div key={i} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
          <video
            src={URL.createObjectURL(file)}
            muted
            className="h-full w-full border-2 border-custom-blue/80 object-cover"
          />
        </div>
      );
    }

    if (fileType === "audio") {
      return (
        <audio
          key={i}
          src={URL.createObjectURL(file)}
          className="h-10 w-52 rounded-full border-2 border-custom-blue/80 object-cover"
          controls
        />
      );
    }

    if (extension === "pdf") {
      return (
        <div key={i} className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
          <iframe
            src={URL.createObjectURL(file)}
            className="h-full w-full border-2 border-custom-blue/80"
            title="PDF Preview"
          />
        </div>
      );
    }

    return (
      <div
        key={i}
        className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-custom-blue/80"
      >
        <span className="text-xs">Unsupported file</span>
      </div>
    );
  };

  const handleOpenFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleEmoji = (e: any) => {
    const emoji = e.native;
    setNewMessage((prev) => prev + emoji);
  };

  const AudioRecorder = () => {
    const startRecording = async () => {
      try {
        const song = new Audio(audioStartBg);
        song.play();
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.current.push(e.data);
          }
        };
        mediaRecorder.current.onstop = () => {
          const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
          const file = new File([recordedBlob], "recordedAudio.webm", {
            type: recordedBlob.type,
          });
          chunks.current = [];
          setSelectedFiles((prevFiles) => [...prevFiles, file]);
        };
        mediaRecorder.current.start();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    const stopRecording = () => {
      const song = new Audio(audioEnd);
      song.play();
      setIsRecording(false);
      if (
        mediaRecorder.current &&
        mediaRecorder.current.state === "recording"
      ) {
        mediaRecorder.current.stop();
      }
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };

    return (
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button onClick={startRecording}>
            <FaMicrophone className="text-custom-blue/90" />
          </button>
        ) : (
          <button onClick={stopRecording}>
            <FaRegStopCircle className="text-custom-blue/90" />
          </button>
        )}
      </div>
    );
  };

  const stopMediaTracks = (stream: MediaStream | null) => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const getCallMediaStream = async (
    facingMode: "user" | "environment" = cameraFacingMode
  ) => {
    return navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 24, max: 30 },
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  };

  const answerIncomingCall = (call: MediaConnection, stream: MediaStream) => {
    call.answer(stream);
    call.on("stream", (peerStream) => {
      dispatch(addPeer({ userId: call.peer, stream: peerStream }));
      setRemoteStream(peerStream);
    });
    setCallIndication({ message: "", room: "", from: "" });
    setIsVedioChat(true);
    setIsModalOpen(false);
    setIncommingCall(false);
    setPendingAccept(false);
    endTune();
  };

  useEffect(() => {
    if (!peer) return;

    const handlePeerCall = (call: MediaConnection) => {
      setCurrentCall(call);
      setIncomingPeerId(call.peer);
    };

    peer.on("call", handlePeerCall);

    return () => {
      peer.off("call", handlePeerCall);
    };
  }, [peer]);

  useEffect(() => {
    if (pendingAccept && currentCall && localStream) {
      answerIncomingCall(currentCall, localStream);
    }
  }, [pendingAccept, currentCall, localStream]);

  const handleStartVedioCall = async () => {
    setIsVedioChat(true);

    let stream: MediaStream | null = null;

    try {
      stream = await getCallMediaStream(cameraFacingMode);
      setLocalStream(stream);

      if (!peer || !receiver?._id) return;

      socket.emit("calluser", {
        room: selectedChat.chatId,
        peerId: currentUser._id,
        to: receiver._id,
        name: currentUser.name,
      });

      const call = peer.call(receiver._id, stream);
      if (!call) {
        throw new Error("Unable to start the call");
      }

      setCurrentCall(call);

      call.on("stream", (peerStream) => {
        dispatch(addPeer({ userId: call.peer, stream: peerStream }));
        setRemoteStream(peerStream);
      });
    } catch (error) {
      setIsVedioChat(false);
      stopMediaTracks(stream);
      setLocalStream(null);
      console.log(error);
      toast.error("Unable to start the video call", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleIncommingCall = async ({
    from,
    message,
  }: {
    from: string;
    message: string;
  }) => {
    try {
      const stream = await getCallMediaStream(cameraFacingMode);
      setLocalStream(stream);
      setCallingUser({ userId: from, message });
      setIsModalOpen(true);
      setIncommingCall(true);
      setPendingAccept(false);
      playTune();
    } catch (error) {
      console.log(error);
      toast.error("Camera or microphone access was denied", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const acceptCall = () => {
    if (currentCall && localStream) {
      answerIncomingCall(currentCall, localStream);
      return;
    }

    setPendingAccept(true);
  };

  const rejectCall = () => {
    const peerTarget = incomingPeerId || callingUser?.userId || remoteId;
    if (currentCall) {
      currentCall.close();
    }
    if (peerTarget) {
      socket?.emit("call:rejcted", {
        room: selectedChat.chatId,
        remoteId: peerTarget,
      });
    }
    stopMediaTracks(localStream);
    endTune();
    setCallIndication({ message: "", room: "", from: "" });
    setIsModalOpen(false);
    setIncommingCall(false);
    setIsVedioChat(false);
    setLocalStream(null);
    setRemoteStream(null);
    setCurrentCall(null);
    setIncomingPeerId("");
    setPendingAccept(false);
  };

  const endCall = () => {
    setIsVedioChat(false);
    stopMediaTracks(localStream);
    stopMediaTracks(remoteStream);
    setLocalStream(null);
    setRemoteStream(null);
    currentCall?.close();
    socket?.emit("call:ended", { room: selectedChat.chatId });
    setIsModalOpen(false);
    setIncommingCall(false);
    setCurrentCall(null);
    setIncomingPeerId("");
    setPendingAccept(false);
  };

  const handleCallRejection = (data: { message: string }) => {
    setIsVedioChat(false);
    endTune();
    stopMediaTracks(localStream);
    stopMediaTracks(remoteStream);
    setLocalStream(null);
    setRemoteStream(null);
    setCurrentCall(null);
    setIncomingPeerId("");
    setPendingAccept(false);
    toast.info(data.message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleCallEnd = (data: { message: string }) => {
    setIsVedioChat(false);
    stopMediaTracks(localStream);
    stopMediaTracks(remoteStream);
    setLocalStream(null);
    setRemoteStream(null);
    setIsModalOpen(false);
    setIncommingCall(false);
    endTune();
    currentCall?.close();
    setCurrentCall(null);
    setIncomingPeerId("");
    setPendingAccept(false);
    toast.info(data.message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleMultipleCall = (data: { message: string }) => {
    if (inCommingCall && currentCall) {
      toast.info(data.message, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    socket?.on("call:rejcted", handleCallRejection);
    socket?.on("call:ended", handleCallEnd);
    socket?.on("incommingCall", handleIncommingCall);
    socket?.on("another:call", handleMultipleCall);

    return () => {
      socket?.off("incommingCall", handleIncommingCall);
      socket?.off("call:rejcted", handleCallRejection);
      socket?.off("call:ended", handleCallEnd);
      socket?.off("another:call", handleMultipleCall);
    };
  }, [currentCall, inCommingCall, localStream, remoteStream]);

  const handleExistChat = () => {
    socket?.emit("exit:chat", {
      room: selectedChat.chatId,
      peerId: currentUser._id,
    });

    dispatch(removeSlectedChat());
  };

  const handleSwitchCamera = async () => {
    if (!localStream) return;

    try {
      setIsSwitchingCamera(true);
      const nextFacingMode = cameraFacingMode === "user" ? "environment" : "user";
      const nextStream = await getCallMediaStream(nextFacingMode);
      const nextVideoTrack = nextStream.getVideoTracks()[0];

      if (!nextVideoTrack) {
        stopMediaTracks(nextStream);
        return;
      }

      const sender = currentCall?.peerConnection
        ?.getSenders()
        .find((item) => item.track?.kind === "video");

      if (sender) {
        await sender.replaceTrack(nextVideoTrack);
      }

      localStream.getVideoTracks().forEach((track) => track.stop());

      const preservedAudioTracks = localStream.getAudioTracks();
      const mergedStream = new MediaStream([
        ...preservedAudioTracks,
        nextVideoTrack,
      ]);

      setLocalStream(mergedStream);
      setCameraFacingMode(nextFacingMode);
    } catch (error) {
      console.log(error);
      toast.error("Unable to switch camera", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  return (
    <div
      className={`${
        selectedChat.chatId ? "col-span-full" : "hidden"
      } px-0 pb-24 lg:block lg:col-span-1`}
    >
      {!isVedioChat && selectedChat.chatId ? (
        <div
          className={`flex h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-none border-t lg:h-[calc(100vh-8rem)] lg:rounded-[32px] lg:border ${
            isDarMode
              ? "border-white/10 bg-slate-950/85"
              : "border-white/80 bg-white/92 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.36)]"
          }`}
        >
          <div
            className={`flex items-center justify-between gap-4 border-b px-4 py-4 transition-colors duration-300 sm:gap-8 sm:px-5 ${
              isDarMode
                ? "border-white/5 bg-slate-900/80 backdrop-blur-xl"
                : "border-gray-100 bg-white/90 backdrop-blur-xl"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                {receiver?.profile.image ? (
                  <img
                    className="h-11 w-11 rounded-full object-cover shadow-sm"
                    src={receiver.profile.image}
                    alt=""
                  />
                ) : (
                  <Avatar
                    size="44"
                    className="rounded-full shadow-sm"
                    name={receiver?.name}
                  />
                )}
                <FaCircle
                  size={12}
                  className={`absolute bottom-0 right-0 rounded-full border-2 ${
                    isDarMode ? "border-slate-900" : "border-white"
                  } ${remoteId ? "text-green-500" : "text-gray-400"}`}
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <p
                  className={`truncate text-[15px] font-semibold tracking-tight sm:text-[17px] ${
                    isDarMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {receiver?.username}
                </p>
                <span
                  className={`text-[13px] font-medium ${
                    remoteId ? "text-green-500" : "text-slate-500"
                  }`}
                >
                  {remoteId ? "Active Now" : "Offline"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-0 sm:gap-4 sm:pr-2">
              <button
                onClick={handleStartVedioCall}
                className={`rounded-full p-2.5 transition-colors duration-300 ${
                  isDarMode
                    ? "bg-white/5 text-white hover:bg-white/10"
                    : "bg-gray-50 text-slate-700 hover:bg-gray-100"
                }`}
              >
                <FaVideo size={20} />
              </button>

              <button
                onClick={handleExistChat}
                className={`rounded-full p-2.5 transition-colors duration-300 ${
                  isDarMode
                    ? "bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                    : "bg-gray-50 text-slate-500 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <IoIosCloseCircle size={22} />
              </button>
            </div>
          </div>

          <div
            id="messages"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
          >
            <ScrollableChat messages={allMessages} />
          </div>

          {isTyping ? <TypingIndicator /> : null}

          {selectedFiles.length > 0 && (
            <div className="flex h-auto w-auto gap-2 overflow-auto overflow-x-scroll px-3 py-2 sm:px-4">
              {selectedFiles.map((file, index) => previewFile(file, index))}
            </div>
          )}

          <div
            className={`border-t px-3 py-3 sm:px-5 ${
              isDarMode
                ? "border-white/5 bg-slate-950/70"
                : "border-gray-100 bg-white/80"
            }`}
          >
            <div className="relative flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleMessageChange}
                  placeholder="Type a message..."
                  className={`h-12 w-full rounded-2xl border py-2 pl-4 pr-12 text-[15px] transition-all focus:outline-none focus:ring-2 focus:ring-custom-blue/30 sm:rounded-full sm:pl-5 sm:pr-14 ${
                    isDarMode
                      ? "border-white/5 bg-slate-800 text-white placeholder-slate-400"
                      : "border-gray-200 bg-gray-50 text-slate-800 placeholder-slate-400"
                  }`}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-xl leading-none text-slate-500 transition hover:text-custom-blue focus:outline-none"
                  onClick={() => setEmojiPickerVisible((prev) => !prev)}
                >
                  🙂
                </button>
              </div>

              <div className="flex items-center justify-end gap-2">
                <div
                  className={`rounded-full p-2 ${
                    isDarMode ? "bg-white/5" : "bg-slate-100"
                  }`}
                >
                  {AudioRecorder()}
                </div>

                <button
                  className={`rounded-full p-2.5 transition ${
                    isDarMode ? "bg-white/5" : "bg-slate-100"
                  }`}
                  onClick={handleOpenFiles}
                >
                  <CgAttachment className="text-blue-600" size={20} />
                </button>

                <button
                  onClick={handleSendMessage}
                  className="rounded-full bg-custom-blue p-2.5 text-white shadow-sm transition hover:bg-custom-blue/90 focus:outline-none"
                >
                  {loading ? (
                    <PiSpinnerBold size={20} className="animate-spin" />
                  ) : (
                    <IoSend size={20} />
                  )}
                </button>
              </div>

              {emojiPickerVisible && (
                <div className="absolute bottom-[calc(100%+0.75rem)] right-0 z-10">
                  <Picker
                    theme={isDarMode ? "dark" : "light"}
                    onEmojiSelect={handleEmoji}
                  />
                </div>
              )}
            </div>
          </div>

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
      ) : !selectedChat.chatId ? (
        <div
          className={`mx-3 mt-24 flex h-[calc(100vh-220px)] items-center justify-center rounded-[28px] border px-6 text-center text-xl lg:mx-0 lg:mt-0 lg:h-[calc(100vh-8rem)] lg:rounded-[32px] ${
            isDarMode
              ? "border-white/10 bg-slate-950/80 text-white"
              : "border-white/80 bg-white/92 text-black shadow-[0_28px_80px_-42px_rgba(15,23,42,0.36)]"
          }`}
        >
          Select a chat to start messaging
        </div>
      ) : (
        <VedioChat
          endCall={endCall}
          stream={localStream}
          peerStream={remoteStream}
          peer={peer}
          switchCamera={handleSwitchCamera}
          canSwitchCamera={Boolean(
            localStream && localStream.getVideoTracks().length > 0
          )}
          isSwitchingCamera={isSwitchingCamera}
        />
      )}

      {inCommingCall && (
        <VideoCallNotificationModal
          setIsOpen={setIsModalOpen}
          onAccept={acceptCall}
          onReject={rejectCall}
          isOpen={isModalOpen}
          message={callingUser?.message}
        />
      )}
    </div>
  );
}

export default SingleChat;
