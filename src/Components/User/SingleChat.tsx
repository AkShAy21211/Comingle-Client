import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  removeSlectedChat,
  removeUnreadMessage,
  setUnreadMessage,
} from "../../Redux/Slice/User/chatSlice";
import { RootState } from "../../Redux/store";
import userApi from "../../Apis/user";
import { Message, Sender } from "../../Interface/interface";
import ScrollableChat from "./ScrollableChat";
import { PiSpinnerBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import Avatar from "react-avatar";
import socket from "../../Apis/Endpoints/socket";
import { CgAttachment } from "react-icons/cg";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import classNames from "classnames";

type SingleChatProp = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

function SingleChat({ fetchAgain, setFetchAgain }: SingleChatProp) {
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
  /////////////////// FETCH ALL THE MESSAGES //////////////////////////

  const fetchMessages = async () => {
    try {
      if (selectedChat.chatId) {
        setLoading(true);

        const response = await userApi.fetchAllMessages(selectedChat.chatId);
        setAllMessages(response.messages);

        const findReciver = response.messages.find(
          (msg: Message) => msg.sender._id !== currentUser._id
        );

        console.log(response);

       
        socket.emit("Chat", selectedChat);
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

  /////////////////// HANDLE NEW MESSAGE ///////////////////////////////

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!selectedChat) return;

    if (newMessage.trim() || selectedFiles) {
      try {
        setLoading(true);
        setFetchAgain(fetchAgain);
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
          setAllMessages([...allMessages, response.message]);
          socket.emit("message", response.message);
          setSelectedFiles([]);
          setFetchAgain(true);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);

        console.error(error);
      }
    }
  };

  useEffect(() => {
    socket.on("message received", (newMessageRecived) => {
      if (!selectedChat || selectedChat.chatId !== newMessageRecived.chat._id) {
        console.log(newMessageRecived);

        dispatch(setUnreadMessage(newMessageRecived.chat));
      } else {
        setAllMessages([...allMessages, newMessageRecived]);
        setFetchAgain(true);
      }
    });

    return () => {
      socket.off("message received");
    };
  });

  const previewFile = (file: File, i: number) => {
    const fileType = file.type.split("/")[0];
    const fileExtension = file.name.split(".");
    const extension = fileExtension.pop()?.toLowerCase();

    console.log(extension);

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
            controls
          />
        </div>
      );
    } else if (fileType === "audio") {
      return (
        <div key={i} className="w-20 h-20 flex-shrink-0">
          <audio
            src={URL.createObjectURL(file)}
            className="object-cover border-custom-blue/90 border-4 w-full h-full"
            controls
          />
        </div>
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

  return (
    <div
      className={`${
        selectedChat.chatId ? "col-span-full" : "hidden"
      } lg:block lg:col-span-3  border ${
        isDarMode ? "bg-black" : "bg-white"
      } border-white`}
    >
      {selectedChat.chatId ? (
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
            <IoIosCloseCircle
              size={25}
              className="mt-2 cursor-pointer"
              onClick={() => dispatch(removeSlectedChat())}
              color="white"
            />
          </div>
          <div
            id="messages"
            className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-192px)]"
          >
            <ScrollableChat messages={allMessages} />
          </div>

          {selectedFiles && (
            <div className=" h-fit w-fit  flex bg-slate-400 gap-1 overflow-auto overflow-x-scroll">
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
                isDarMode ? "bg-black" : "bg-gray-200"
              } border rounded-lg py-2 px-4 mr-2 focus:outline-none focus:ring-2`}
            />
            <button
              className="text-white px-4 py-2 border-none rounded-lg focus:outline-none"
              onClick={toggleEmojiPicker}
            >
              😊
            </button>
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
      ) : (
        <div className="flex text-xl justify-center items-center h-[calc(100vh-192px)] mt-16">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}

export default SingleChat;
