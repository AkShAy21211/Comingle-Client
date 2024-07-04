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
import { FaMicrophone } from "react-icons/fa";
import { FaRegStopCircle } from "react-icons/fa";
import audioStartBg from "/User/mixkit-atm-cash-machine-key-press-2841.wav";
import audioEnd from "/User/mixkit-correct-answer-tone-2870.wav";
import TypingIndicator from "../Common/TypingIndicator";
import { FaVideo } from "react-icons/fa6";
import VedioChat from "./VideoChat";
import socket from "../../Apis/socket";
import VideoCallNotificationModal from "./VideoCallNotificationModal";
import Peer, { MediaConnection } from "peerjs";
import { addPeer } from "../../Redux/Slice/User/peerSlice";
import { FaCircle } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import { playTune,endTune } from "../../Utils/tune";
type SingleChatProp = {
  fetchAgain: boolean;
  peer: Peer | null;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

function SingleChat({ fetchAgain, setFetchAgain, peer }: SingleChatProp) {
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
  const [isVedioChat, setIsVedioChat] = useState(false);

  /////////////////// FETCH ALL THE MESSAGES //////////////////////////

  const fetchMessages = async () => {
    try {
      if (!selectedChat.chatId) return;

      setLoading(true);
      const response = await userApi.fetchAllMessages(selectedChat?.chatId);

      setAllMessages(response.messages);
      setLoading(false);

      socket.emit("chat:start", {
        room: selectedChat?.chatId,
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
    socket.on("typeing", () => {
      setIstyping(true);
    });

    socket.on("stopTypeing", () => {
      setIstyping(false);
    });

    return () => {
      socket.off("typeing");
      socket.off("stopTypeing");
    };
  }, [typing]);



  const handleNewMessage = ({
    message,
    room,
  }: {
    message: Message;
    room: string;
  }) => {
    if (!selectedChat.chatId || selectedChat.chatId !== room) {
      console.log("New unread message", message);
      dispatch(setUnreadMessage({ chat: message.chat }));
      setFetchAgain(!fetchAgain);
    } else {
      console.log("New message", message);
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
    if (
      selectedChat.chatId === room &&
      message.sender._id === currentUser._id
    ) {
      console.log("New message sent", message);
      setFetchAgain(!fetchAgain);

      setAllMessages((prevMessages) => {
        // Check if message already exists to avoid duplicates
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
  }, [
    selectedChat.chatId,
    allMessages,
    handleNewMessage,
    handleNewMessageSent,
  ]);

  /////////////////// HANDLE NEW MESSAGE ///////////////////////////////
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typeing", selectedChat.chatId);
    }

    const lastTypingTime = new Date().getTime();
    const typingTimeout = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= typingTimeout && typing) {
        socket.emit("stopTypeing", selectedChat.chatId);
        setTyping(false);
      }
    }, typingTimeout);
  };

  const handleSendMessage = async () => {
    if (!selectedChat) return;

    if (newMessage.trim() || selectedFiles) {
      try {
        socket.emit("stopTypeing", selectedChat.chatId);
        setLoading(true);
        const formData = new FormData();
        if (selectedFiles) {
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

          socket.emit("message", {
            message: response.message,
            room: selectedChat.chatId,
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
        <div key={i} className="w-20 h-20 flex-shrink-0">
          <img
            src={URL.createObjectURL(file)}
            className="object-cover border-custom-blue/90 border-4 w-full h-full"
            alt=""
          />
        </div>
      );
    } else if (fileType === "video") {
      return (
        <div key={i} className="w-20 h-20 flex-shrink-0">
          <video
            src={URL.createObjectURL(file)}
            muted
            className="object-cover border-custom-blue/90 border-4 w-full h-full"
          />
        </div>
      );
    } else if (fileType === "audio") {
      return (
        <audio
          src={URL.createObjectURL(file)}
          className="object-cover rounded-full border-custom-blue/90 border-4 w-52 h-10"
          controls
        />
      );
    } else if (extension === "pdf") {
      return (
        <div key={i} className="w-20 h-20 flex-shrink-0">
          <iframe
            src={URL.createObjectURL(file)}
            className="border-custom-blue/90 border-4 w-full h-full"
            title="PDF Preview"
          />
        </div>
      );
    } else {
      return (
        <div
          key={i}
          className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-custom-blue/90 border-4"
        >
          <span className="text-xs">Unsupported file</span>
        </div>
      );
    }
  };

  const handleOpenFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  const handleEmoji = (e: any) => {
    const emoji = e.native;
    setNewMessage((prev) => prev + emoji);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  const AudioRecorder = () => {
    const startRecording = async () => {
      try {
        let song = new Audio(audioStartBg);
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
          // Pass file to previewFile
          setSelectedFiles((prevFiles) => [...prevFiles, file]);
        };
        mediaRecorder.current.start();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert(
          "Error accessing microphone. Please ensure microphone permissions are granted."
        );
        // Handle error gracefully, show a message to the user, etc.
      }
    };

    const stopRecording = () => {
      let song = new Audio(audioEnd);
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
      <div className="flex gap-2 items-center">
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

  const [inCommingCall, setIncommingCall] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [callingUser, setCallingUser] = useState<{
    userId: string;
    name: string;
  }>();
  const [participants, setParticipant] = useState<string[]>([]);
  const [remoteId, setRemoteId] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [currentCall, setCurrentCall] = useState<MediaConnection | null>(null);
  const peerState = useSelector((state: RootState) => state.peer);

  const handleGetUsers = ({
    room,
    members,
  }: {
    room: string;
    members: string[];
  }) => {
    if (room !== selectedChat.chatId) return;

    setParticipant(members.toString().split(","));
    const remoteUser = members.find((id) => id !== currentUser._id);

    if (remoteUser) {
      setRemoteId(remoteUser);
    }
    console.log("ssssssssss", members);
  };

  const handleStartVedioCall = async () => {
    setIsVedioChat(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      if (!peer) return;

      socket.emit("calluser", {
        room: selectedChat.chatId,
        peerId: currentUser._id,
        name: currentUser.name,
      });
      const call = peer.call(remoteId, stream);

      call.on("stream", (peerStream) => {
        console.log("stream of the remote user", peerStream);

        dispatch(addPeer({ userId: call.peer, stream: peerStream }));
        setRemoteStream(peerStream);
      });
    } catch (error) {
      console.log("error accessing user media");
      alert(error)
    }
  };

  const handleIncommingCall = async ({
    from,
    room,
    name,
  }: {
    from: string;
    to: string;
    name: string;
    room: string;
  }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setCallingUser({ userId: from, name: name });
      setIsModalOpen(true);
      setIncommingCall(true);
      playTune()
      if (peer) {
        console.log("me is ok");

        peer.on("call", (call) => {
          setCurrentCall(call);
        });
      }
    } catch (error) {
      console.log(error);
            alert(error)

    }
  };

  const acceptCall = () => {
    if (currentCall && localStream) {
      currentCall.answer(localStream);
      currentCall.on("stream", (remoteStream) => {
        console.log("insde remote stream event", currentCall);
        dispatch(addPeer({ userId: currentCall.peer, stream: remoteStream }));
        setRemoteStream(remoteStream);
      });
      setIsVedioChat(true);
      setIsModalOpen(false);
      setIncommingCall(false);
      endTune()
    }
  };

  const rejectCall = () => {
    if (currentCall) {
      currentCall.close();
      setCurrentCall(null);
      socket.emit("call:rejcted", { room: selectedChat.chatId });
    }
    endTune()
    setIsModalOpen(false);
    setIncommingCall(false);
  };

  const handleUserLeft = (data: { room: string; members: string[] }) => {
    const { room, members } = data;

    if (room !== selectedChat.chatId) return;
    console.log("user left chat room", members, room);

    setParticipant(members.toString().split(","));
  };

  const handleCallRejection = (data: { message: string }) => {
    setIsVedioChat(false);
    endTune()
    toast.info(data.message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  useEffect(() => {
    socket.on("call:rejcted", handleCallRejection);
    socket.on("get:users", handleGetUsers);
    socket.on("incommingCall", handleIncommingCall);
    socket.on("user:left", handleUserLeft);

    return () => {
      socket.off("get:users", handleGetUsers);
      socket.off("incommingCall", handleIncommingCall);
      socket.off("user:left", handleUserLeft);
      socket.off("call:rejcted", handleCallRejection);
    };
  }, [handleGetUsers, handleIncommingCall, handleUserLeft]);

  const handleExistChat = () => {
    socket.emit("exit:chat", {
      room: selectedChat.chatId,
      peerId: currentUser._id,
    });

    dispatch(removeSlectedChat());
  };

  console.log("peers.............", { peerState });

  return (
    <div
      className={`${
        selectedChat.chatId ? "col-span-full" : "hidden"
      } lg:block lg:col-span-3  border ${
        isDarMode ? "bg-black" : "bg-white"
      } border-white`}
    >
      {!isVedioChat && selectedChat.chatId ? (
        <>
          <div className="mb-1 flex mt-16 justify-between gap-8 p-5 border-t-2 h-20 bg-custom-blue/90 backdrop:blur-xl">
            <div className="flex items-center gap-2">
              {receiver?.profile.image ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={receiver.profile.image}
                  alt=""
                />
              ) : (
                <Avatar
                  size="45"
                  className="rounded-full"
                  name={receiver?.name}
                />
              )}
              <p className="p-2 text-white text-lg">{receiver?.username}</p>
            </div>
            <div className="flex gap-5">
              <FaCircle
                size={10}
                className={`mt-4 ${
                  participants.some((id) => id !== currentUser._id)
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <FaVideo
                size={25}
                onClick={handleStartVedioCall}
                className="mt-2 cursor-pointer"
                color="white"
              />

              <IoIosCloseCircle
                size={25}
                className="mt-2 cursor-pointer"
                onClick={handleExistChat}
                color="white"
              />
            </div>
          </div>
          <div
            id="messages"
            className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-192px)]"
          >
            <ScrollableChat messages={allMessages} />
          </div>

          {isTyping ? <TypingIndicator /> : <></>}

          {selectedFiles && (
            <div className=" h-auto w-auto  flex gap-1 overflow-auto overflow-x-scroll">
              {selectedFiles.map((file, index) => previewFile(file, index))}
            </div>
          )}

          <div className="flex justify-center w-full items-center border-t-2 p-2 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="Type your message..."
              className={`flex-1  ${
                isDarMode ? "bg-black text-white" : "bg-gray-200"
              } border rounded-lg py-2 px-4 mr-2 focus:outline-none focus:ring-2 ml-1 `}
            />
            <button
              className="text-white px-4 py-2 border-none rounded-lg focus:outline-none"
              onClick={toggleEmojiPicker}
            >
              😊
            </button>
            {AudioRecorder()}
            {emojiPickerVisible && (
              <div className="absolute bottom-14 right-30 z-10">
                <Picker
                  theme={isDarMode ? "dark" : "light"}
                  onEmojiSelect={handleEmoji}
                />
              </div>
            )}
            <button className="text-white px-4 py-2  border-none  rounded-lg focus:outline-none ">
              <CgAttachment
                onClick={handleOpenFiles}
                className="text-blue-600"
                size={20}
              />
            </button>

            <button
              onClick={handleSendMessage}
              className="text-white px-4 py-2  border-none  rounded-lg focus:outline-none "
            >
              {loading ? (
                <PiSpinnerBold
                  size={20}
                  className="animate-spin text-blue-600"
                />
              ) : (
                <IoSend className="text-blue-600" size={20} />
              )}
            </button>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
        </>
      ) : !selectedChat.chatId ? (
        <div className="flex text-xl justify-center items-center h-[calc(100vh-192px)] mt-16">
          Select a chat to start messaging
        </div>
      ) : (
        <VedioChat endCall={()=>{}} stream={localStream} peerStream={remoteStream} peer={peer} />
      )}

      {inCommingCall && (
        <VideoCallNotificationModal
          setIsOpen={setIsModalOpen}
          onAccept={acceptCall}
          onReject={rejectCall}
          isOpen={isModalOpen}
          callerName={callingUser?.name}
        />
      )}
    </div>
  );
}

export default SingleChat;
