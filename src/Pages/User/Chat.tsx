import { Fragment, useEffect, useState } from "react";
import RecentChats from "../../Components/User/RecentChats";
import SingleChat from "../../Components/User/SingleChat";
import Header from "../../Components/User/Header";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import Peer from "peerjs";
import { connectToSocket } from "../../Apis/socket";
function Chat() {
  const socket = connectToSocket();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [me, setMe] = useState<Peer | null>(null);
  const [participants, setParticipant] = useState<string[]>([]);
  const [remoteId, setRemoteId] = useState("");
  const selectedChat = useSelector(
    (state: RootState) => state.chat.selectedChat
  );
  const [inCommingCall, setIncommingCall] = useState(false);
  const [isVedioChat, setIsVedioChat] = useState(false);

  const [callIndication, setCallIndication] = useState({
    message: "",
    room: "",
    from: "",
  });
  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_NODE_ENV === "DEVELOPMENT"
        ? import.meta.env.VITE_BACKEND_URI_DEV
        : import.meta.env.VITE_BACKEND_URI;
    const parsedBackendUrl = new URL(backendUrl);
    const peer = new Peer(currentUser._id, {
      host: parsedBackendUrl.hostname,
      port:
        parsedBackendUrl.port !== ""
          ? Number(parsedBackendUrl.port)
          : parsedBackendUrl.protocol === "https:"
            ? 443
            : 80,
      path: "/peerjs",
      secure: parsedBackendUrl.protocol === "https:",
    });
    handleAllowMedia();
    peer.on("open", (id) => {
      setMe(peer);

      socket.emit("user:joined", { userId: id });
    });
  }, [currentUser._id]);

  const handleAllowMedia = async () => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  };

  const handleGetUsers = ({ members }: { members: string[] }) => {
    setParticipant(members.toString().split(","));
    const remoteUser = members.find((id) => id !== currentUser._id);

    if (remoteUser) {
      setRemoteId(remoteUser);
    }
  };
  const handleUserLeft = (data: { room: string; members: string[] }) => {
    const { room, members } = data;

    if (room !== selectedChat.chatId) return;

    setParticipant(members.toString().split(","));
    setRemoteId("");
  };

  const handleIncommingCall = ({
    message,
    room,
    from,
  }: {
    message: string;
    room: string;
    from: string;
  }) => {
    setCallIndication({ message, room, from });
    setIncommingCall(true);
  };

  useEffect(() => {
    socket.on("get:users", handleGetUsers);
    socket.on("user:left", handleUserLeft);
    socket.on("call", handleIncommingCall);

    return () => {
      socket.off("get:users", handleGetUsers);
      socket.off("user:left", handleUserLeft);
      socket.off("call", handleIncommingCall);
    };
  }, [handleGetUsers, handleIncommingCall, handleUserLeft, isVedioChat]);

  return (
    <Fragment>
      <Header />
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 px-0 pt-24 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:pt-28 xl:px-8">
        <RecentChats
          inCommingCall={inCommingCall}
          setIncommingCall={setIncommingCall}
          callIndication={callIndication}
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
        />
        <SingleChat
          setIncommingCall={setIncommingCall}
          setIsVedioChat={setIsVedioChat}
          isVedioChat={isVedioChat}
          inCommingCall={inCommingCall}
          setCallIndication={setCallIndication}
          participants={participants}
          remoteId={remoteId}
          peer={me}
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
        />
      </div>
    </Fragment>
  );
}

export default Chat;
