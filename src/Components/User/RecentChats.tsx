import React, { Fragment, useEffect, useState } from "react";
import { ChatType, CurrentUser } from "../../Interface/interface";
import userApi from "../../Apis/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  removeUnreadMessage,
  setSelectedChat,
} from "../../Redux/Slice/User/chatSlice";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { MdOutlinePermMedia } from "react-icons/md";
import FormattedRelativeTime from "../../Utils/Time";
import { CiClock1 } from "react-icons/ci";

type RecentChatsProp = {
  fetchAgain: boolean;
};

function RecentChats({ fetchAgain }: RecentChatsProp) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [chats, setChats] = useState<ChatType[] | null>(null);
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );
  const unReadMessages: any[] = useSelector(
    (state: RootState) => state.chat.unreadMessage
  );
  const isDarMode = useSelector((state: RootState) => state.ui.isDarkMode);

  ////////////////// FETCH CHATS //////////////////////////////
  const fetchChats = async () => {
    try {
      const response = await userApi.fetchAllChats();
      if (response) {
        setChats(response.chats);
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
        {chats &&
          chats.map((chat: ChatType) => {
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
                  <div className="flex flex-col w-full">
                    <p>{receiver?.username}</p>
                    <div className="text-gray-500 flex   gap-4 w-full max-w-xs ">
                      <p>
                        {chat.latestMessage
                          ? chat.latestMessage.sender._id === currentUser._id
                            ? "you:"
                            : ""
                          : ""}
                      </p>
                      <span className="text-wrap text-sm  break-words w-40 ">
                        {chat.latestMessage
                          ? chat.latestMessage.message.trim().slice(0,20) || (
                              <MdOutlinePermMedia className="mt-1" />
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs  text-end flex flex-col  justify-between">
                 <span className="flex  flex-col text-nowrap  items-end lg:gap-0"> 
                  { FormattedRelativeTime(chat.updatedAt)}
                  </span>
                  <span>
                    {unReadMessages.find(
                      (unreadChat) => unreadChat._id === chat._id
                    )
                      ? `${isDarMode ? "⚪" : "⚫"} new message`
                      : ""}
                  </span>
                </p>
              </div>
            );
          })}
      </div>
    </Fragment>
  );
}

export default RecentChats;
