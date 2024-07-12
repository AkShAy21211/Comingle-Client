import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChatType, User } from "../../Interface/interface";
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
import { RiChatOffFill } from "react-icons/ri";
import ExpandableSearchBar from "../Common/ExpandableSearchBar";
import _ from "lodash";
import { IoMdClose } from "react-icons/io";
import {connectToSocket} from "../../Apis/socket";

type RecentChatsProp = {
  fetchAgain: boolean;
  setIncommingCall: React.Dispatch<React.SetStateAction<boolean>>;
  inCommingCall: boolean;
  callIndication: { room: string; message: string };
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

function RecentChats({
  fetchAgain,
  callIndication,
  setFetchAgain,
  inCommingCall,
  setIncommingCall,
}: RecentChatsProp) {
    const socket = connectToSocket()
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
  const divRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [allUsers, setAllUsers] = useState<User[] | []>([]);
  const [isFocused, setIsFocused] = useState(false);
  ////////////////// FETCH CHATS //////////////////////////////
  const fetchChats = async () => {
    try {
      const response = await userApi.fetchAllChats();
      if (response) {
        setChats(response.chats);
        setFetchAgain(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchUsers = useCallback(
    _.debounce(async (name) => {
      if (!name) {
        const response = await userApi.getAllUsers();
        if (response) {
          setAllUsers(response.users);
        }
      } else {
        const response = await userApi.searchUsers(name);
        if (response) {
          setAllUsers(response.users);
        }
      }
    }, 300),
    []
  );

  const handleMessage = async (participantId: string) => {
    try {
      await userApi.accessChat(participantId);
      await userApi.fetchAllChats();

      setTimeout(() => {
        setIsFocused(false);
        setFetchAgain(!fetchAgain);
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (callIndication.room && divRefs.current[callIndication.room]) {
      divRefs.current[callIndication.room]?.click();
      setIncommingCall(true);
      dispatch(removeUnreadMessage(callIndication.room));
    }
  }, [inCommingCall, callIndication.room]);

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const handleAccessChat = (chatId: string, receiver: User) => {
    dispatch(setSelectedChat({ chatId: chatId, reciver: receiver }));
    dispatch(removeUnreadMessage(chatId));
  };

  const getUnreadMessages = (chatId: string) => {
    const count = unReadMessages.filter((chat) => chat._id === chatId).length;
    return (
      <span className="text-nowrap">
        {unReadMessages.find((unreadChat) => unreadChat._id === chatId)
          ? `${isDarMode ? "⚪" : "⚫"} ${count} new message`
          : ""}
      </span>
    );
  };
  const handleNewChat = ({ room }: { room: string }) => {
    console.log("new chat");

    if (chats?.length === 0) {
      setFetchAgain(!fetchAgain);
    } else if (!chats?.find((chat) => chat._id === room)) {
      setFetchAgain(!fetchAgain);
    } else {
      setFetchAgain(false);
    }
  };

  useEffect(() => {
    socket?.on("new:chat", handleNewChat);

    return () => {
      socket?.on("new:chat", handleNewChat);
    };
  }, []);
  console.log("unread messagfes", unReadMessages);

  return (
    <Fragment>
      <div
        className={` col-span-full  ${
          isDarMode ? "bg-black" : "bg-white"
        }  ${
          selectedChat.chatId ? "hidden lg:block" : ""
        } lg:col-span-1 sticky top-0  shadow-lg     h-screen `}
      >
        <div className="mt-20 p-3 flex-col">
          <button onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack
              className={`${isDarMode ? "text-white" : "text-black"}`}
              size={25}
            />
          </button>
          <ExpandableSearchBar
            isFocused={isFocused}
            searchUsers={searchUsers}
            setIsFocused={setIsFocused}
          />
          <div
            className={`  ${
              allUsers.length && isFocused ? "flex" : "hidden"
            }  rounded-md w-96 bg-transparent backdrop-blur-sm h-full  overflow-scroll mt-8 z-50 fixed`}
          >
            <ul className="w-96">
              <li className="float-end px-8">
                <button>
                  <IoMdClose onClick={() => setIsFocused(false)} size={20} />
                </button>
              </li>
              {allUsers.length ? (
                allUsers.map((user: User) => (
                  <li
                    key={user._id}
                    onClick={() => handleMessage(user._id)}
                    className="flex m-5 p-5 hover:bg-custom-blue/50 rounded-md w-auto gap-2 cursor-pointer"
                  >
                    {user.profile.image ? (
                      <img
                        src={user.profile.image}
                        className="w-8 h-8  rounded-full"
                        alt=""
                      />
                    ) : (
                      <Avatar
                        name={user.name}
                        className="rounded-full"
                        size="30"
                      />
                    )}
                    <p className="p-1">{user.username}</p>
                  </li>
                ))
              ) : (
                <li className="flex m-5 gap-2 cursor-pointer">
                  <p className="p-2">No user found</p>
                </li>
              )}
            </ul>
          </div>
        </div>
        {chats?.length ? (
          chats.map((chat: ChatType) => {
            const receiver = chat.participants.find(
              (p) => p._id !== currentUser._id
            );

            return (
              <div
                key={chat._id}
                data-key={chat._id}
                ref={(el) => (divRefs.current[chat._id] = el)}
                onClick={() => handleAccessChat(chat._id, receiver as User)}
                className={` mt-5 ${
                  isDarMode ? "bg-black  text-white" : ""
                } flex justify-between gap-5  cursor-pointer p-5 ${
                  isDarMode && selectedChat.chatId === chat._id
                    ? "bg-custom-blue/20"
                    : !isDarMode && selectedChat.chatId === chat._id
                    ? "bg-gray-200"
                    : ""
                } ${
                  callIndication.room === chat._id
                    ? "bg-green-300 animate-pulse transition transform duration-0"
                    : ""
                }`}
              >
                <div className="flex gap-3 w-auto h-full justify-between">
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
                    <p className="p-2">{receiver?.username}</p>
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
                          ? chat.latestMessage.message.trim().slice(0, 20) || (
                              <MdOutlinePermMedia className="mt-1" />
                            )
                          : ""}
                      </span>
                    </div>
                    {callIndication && callIndication.room == chat._id && (
                      <p className="text-xs text-green-600 font-bold">
                        {callIndication.message}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs  text-end flex flex-col  justify-between">
                  <span className="flex wau  flex-col   items-end lg:gap-0">
                    {FormattedRelativeTime(chat.updatedAt)}
                  </span>
                  {getUnreadMessages(chat._id)}
                </p>
              </div>
            );
          })
        ) : (
          <div
            className={` ${
              isDarMode ? "bg-black border-y text-white" : ""
            } flex justify-between gap-5  cursor-pointer p-5  `}
          >
            <div className="flex gap-1 w-full h-full   justify-center items-center">
              <RiChatOffFill size={20} />{" "}
              <p className="m-5">You dont have any chats</p>
            </div>

            <p></p>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default RecentChats;
