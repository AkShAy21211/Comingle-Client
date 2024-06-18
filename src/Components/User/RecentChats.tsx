import React, { Fragment, useEffect, useState } from "react";
import { ChatType, CurrentUser } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import FormattedRelativeTime from "../../Utils/Time";
import {
  removeUnreadMessage,
  setSelectedChat,
} from "../../Redux/Slice/User/chatSlice";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import socket from "../../Apis/Endpoints/socket";

type RecentChatsProp = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

function RecentChats({ fetchAgain, setFetchAgain }: RecentChatsProp) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [chats, setChats] = useState<ChatType[]>([]);
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );
  const unReadMessages: any[] = useSelector(
    (state: RootState) => state.chat.unreadMessage
  );
  const isDarMode = useSelector((state: RootState) => state.ui.isDarkMode);

  console.log("unread", unReadMessages);

  const fetchChats = async () => {
    try {
      const response = await userApi.fetchAllChats();
      console.log(response);

      if (response) {
        setChats(response.chats);
        setFetchAgain(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const handleAccessChat = (chatId: any, receiver: any) => {
    dispatch(setSelectedChat({ chatId: chatId, reciver: receiver }));
    dispatch(removeUnreadMessage(chatId));
  };
  
  useEffect(() => {
    socket.on("message received", (newMessageRecived) => {
        fetchChats();
      
    });

    return () => {
      socket.off("message received");
    };
  });

  return (
    <Fragment>
      <div
        className={` col-span-full border ${
          isDarMode ? "bg-black" : "bg-white"
        } border-white ${
          selectedChat.chatId ? "hidden lg:block" : ""
        } lg:col-span-1 sticky top-0  shadow-lg     h-screen border-gray-400`}
      >
        <div className="mt-20 p-3">
          <button onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack
              className={`${isDarMode ? "text-white" : "text-black"}`}
              size={25}
            />
          </button>
        </div>
        {chats.map((chat) => {
          const receiver = chat.participants.find(
            (p) => p._id !== currentUser._id
          );

          return (
            <div
              key={chat._id}
              onClick={() => handleAccessChat(chat._id, receiver)}
              className={` ${
                isDarMode ? "bg-black border-y text-white" : ""
              } flex justify-between gap-5  cursor-pointer p-5 ${
                isDarMode && selectedChat.chatId === chat._id
                  ? "bg-custom-blue/20"
                  : !isDarMode && selectedChat.chatId === chat._id
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <div className="flex gap-5 justify-between">
                {receiver?.profile.image ? (
                  <img
                    className="w-12 h-12 rounded-full"
                    src={receiver?.profile.image}
                    alt=""
                  />
                ) : (
                  <Avatar
                    size="45"
                    name={receiver?.name}
                    className="rounded-full"
                  />
                )}
                <div className="flex flex-col">
                  <p>{receiver?.username}</p>
                  <p className="text-gray-500">
                    {chat.latestMessage
                      ? chat.latestMessage.sender._id === currentUser._id
                        ? "you:"
                        : receiver?.username + ":"
                      : ""}{" "}
                    {chat.latestMessage ? chat.latestMessage.message : ""}
                  </p>
                </div>
              </div>
              <p className="text-xs  text-end flex flex-col  justify-between">
                {FormattedRelativeTime(chat.updatedAt)}
                <p>
                  {unReadMessages.find(
                    (unreadChat) => unreadChat._id === chat._id
                  )
                    ? `${isDarMode ? "⚪" : "⚫"} new message`
                    : ""}
                </p>
              </p>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}

export default RecentChats;
