import { Fragment, useEffect, useState } from "react";
import RecentChats from "../../Components/User/RecentChats";
import SingleChat from "../../Components/User/SingleChat";
import Header from "../../Components/User/Header";
import { RootState } from "../../Redux/rootReducer";
import { useSelector } from "react-redux";
import Peer from "peerjs";

function Chat() {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [me, setMe] = useState<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer(currentUser._id, {
      host: "peer-server-6c7b.onrender.com",
      port: 443,
      path: "/peerjs/myapp",
      secure: true,
    });

    peer.on("open", (id) => {
      console.log("My peer ID is:", id, currentUser._id);
      setMe(peer);
    });
  }, []);

  return (
    <Fragment>
      <Header />
      <div className="grid  grid-cols-4">
        <RecentChats setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
        <SingleChat peer={me} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
      </div>
    </Fragment>
  );
}

export default Chat;
