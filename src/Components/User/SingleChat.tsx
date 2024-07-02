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
import { useNavigate } from "react-router-dom";
import VedioChat from "./VideoChat";
import socket from "../../Apis/socket";
type SingleChatProp = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

function SingleChat({ fetchAgain, setFetchAgain }: SingleChatProp) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [roomId, setRoomId] = useState<String>("");

  /////////////////// FETCH ALL THE MESSAGES //////////////////////////

  const fetchMessages = async () => {
    try {
      if (selectedChat.chatId) {
        setLoading(true);
        const response = await userApi.fetchAllMessages(selectedChat.chatId);
        if (socket) {
          socket.emit("chat initilize", selectedChat.chatId);
        }
        setAllMessages(response.messages);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat.chatId]);

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

  useEffect(() => {
    const handleNewMessage = (newMessageReceived: Message) => {
      if (
        (!selectedChat.chatId && !selectedChat.receiver) ||
        selectedChat.chatId !== newMessageReceived.chat._id
      ) {
        dispatch(setUnreadMessage(newMessageReceived.chat));
        setFetchAgain(!fetchAgain);
      } else {
        setAllMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    const handleNewMessageSent = (newMessageReceived: Message) => {
      if (
        !selectedChat.chatId ||
        newMessageReceived.sender._id === currentUser._id
      ) {
        setAllMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("new message sent", handleNewMessageSent);
    socket.on("message received", handleNewMessage);

    return () => {
      socket.off("message received", handleNewMessage);
      socket.off("new message sent", handleNewMessageSent);
    };
  }, [newMessage, dispatch]);

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
          if (socket) {
            socket.emit("message", response.message);
          }
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

  const handleStartVedioCall = async () => {
    setIsVedioChat(true);
    socket.emit("initialize:video-chat", {roomId:selectedChat.chatId,userId:currentUser._id});
  };

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
              <FaVideo
                size={25}
                onClick={handleStartVedioCall}
                className="mt-2 cursor-pointer"
                color="white"
              />

              <IoIosCloseCircle
                size={25}
                className="mt-2 cursor-pointer"
                onClick={() => dispatch(removeSlectedChat())}
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
      ) : isVedioChat && !selectedChat.chatId ? (
        <div className="flex text-xl justify-center items-center h-[calc(100vh-192px)] mt-16">
          Select a chat to start messaging
        </div>
      ) : (
        <VedioChat setIsVedio={setIsVedioChat} />
      )}
    </div>
  );
}

export default SingleChat;
