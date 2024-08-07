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
  });
  useEffect(() => {
    const peer = new Peer(currentUser._id, {
      host: import.meta.env.VITE_PEER_SERVER,
      port: 443,
      path: "/peerjs/myapp",
      secure: true,
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
  }: {
    message: string;
    room: string;
  }) => {
    setCallIndication({ message, room });
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
      <div className="grid  grid-cols-4">
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
