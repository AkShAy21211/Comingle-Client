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
  callIndication: { room: string; message: string; from?: string };
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

  return (
    <Fragment>
      <div
        className={`col-span-full overflow-y-auto px-3 pb-24 ${
          selectedChat.chatId ? "hidden lg:block" : ""
        } lg:sticky lg:top-28 lg:col-span-1 lg:h-[calc(100vh-8rem)] lg:px-0`}
      >
        <div
          className={`rounded-none border-b px-4 pb-4 pt-5 sm:px-5 lg:rounded-[30px] lg:border lg:px-5 lg:pb-5 lg:pt-5 ${
            isDarMode
              ? "border-white/10 bg-slate-950/85 text-white"
              : "border-white/80 bg-white/90 text-slate-900 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.38)]"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] app-muted">
                Messages
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">Chats</h2>
            </div>
            <button onClick={() => navigate(-1)}>
              <IoMdArrowRoundBack
                className={`${isDarMode ? "text-white" : "text-black"}`}
                size={25}
              />
            </button>
          </div>
          <ExpandableSearchBar
            searchUsers={searchUsers}
            setIsFocused={setIsFocused}
          />
          <div
            className={`${
              allUsers.length && isFocused ? "flex" : "hidden"
            } fixed z-50 mt-4 h-[70vh] w-[calc(100%-2rem)] max-w-md overflow-scroll rounded-2xl border border-white/10 bg-slate-950/90 p-2 backdrop-blur-xl`}
          >
            <ul className="w-full">
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
                    className="m-2 flex w-auto cursor-pointer gap-2 rounded-xl p-4 hover:bg-custom-blue/30"
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
                    <p className={`p-1 ${isDarMode?"text-white":"text-black"}`}>{user.username}</p>
                  </li>
                ))
              ) : (
                <li className="flex m-5 gap-2 cursor-pointer">
                  <p className={`p-2 ${isDarMode?"text-white":"text-black"}`}>No user found</p>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-4 space-y-3 lg:mt-5">
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
                className={`flex cursor-pointer justify-between gap-3 rounded-[24px] border p-4 transition-all duration-300 ${
                  isDarMode
                    ? "border-white/10 bg-slate-950/75 text-white hover:bg-white/5"
                    : "border-white/80 bg-white/90 text-slate-900 shadow-[0_22px_48px_-36px_rgba(15,23,42,0.42)] hover:-translate-y-0.5"
                } ${
                  isDarMode && selectedChat.chatId === chat._id
                    ? "border-cyan-400/30 bg-custom-blue/20"
                    : !isDarMode && selectedChat.chatId === chat._id
                    ? "border-cyan-200 bg-sky-50"
                    : ""
                } ${
                  callIndication.room === chat._id
                    ? "ring-2 ring-green-400/60 animate-pulse"
                    : ""
                }`}
              >
                <div className="flex h-full w-auto min-w-0 justify-between gap-3">
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
                  <div className="flex w-full min-w-0 flex-col">
                    <p className="truncate p-1 text-sm font-semibold sm:text-base">{receiver?.username}</p>
                    <div className={`flex w-full max-w-xs gap-2 text-sm ${isDarMode ? "text-slate-400" : "text-slate-500"}`}>
                      <p className="shrink-0">
                        {chat.latestMessage
                          ? chat.latestMessage.sender._id === currentUser._id
                            ? "you:"
                            : ""
                          : ""}
                      </p>
                      <span className="w-32 truncate text-sm sm:w-40">
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
                <p className="flex min-w-[74px] flex-col justify-between text-end text-[11px] sm:text-xs">
                  <span className="flex flex-col items-end lg:gap-0">
                    {FormattedRelativeTime(chat.updatedAt)}
                  </span>
                  {getUnreadMessages(chat._id)}
                </p>
              </div>
            );
            })
          ) : (
          <div
            className={`mt-6 flex items-center justify-center gap-3 rounded-[28px] border p-8 text-center ${
              isDarMode
                ? "border-white/10 bg-slate-950/80 text-white"
                : "border-white/80 bg-white/90 text-slate-900 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.38)]"
            }`}
          >
            <div className="flex h-full w-full items-center justify-center gap-2">
              <RiChatOffFill size={20} />{" "}
              <p className="text-sm sm:text-base">You dont have any chats</p>
            </div>
          </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default RecentChats;
