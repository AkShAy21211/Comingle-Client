import UserAvatar from "./UserAvatar";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import userApi from "../../Apis/user";
import { useEffect, useState } from "react";
import { User } from "../../Interface/interface";
import { connectToSocket } from "../../Apis/socket";
import ProfileCard from "./ProfileCard";

function RightPanel() {
  const socket = connectToSocket();

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [friends, setFriends] = useState<any[]>([]);
  const [onlineUsers, setOnineUsers] = useState<string[] | []>([]);
  const getFriends = async () => {
    try {
      const user: User = await userApi.getFriends(currentUser._id);
      const followers: any[] = user.profile.followers || [];
      const following: any[] = user.profile.following || [];

      const combinedFriends = [...followers, ...following];

      const uniqueFriends = Array.from(
        new Set(combinedFriends.map((friend) => friend._id))
      ).map((id) => combinedFriends.find((friend) => friend._id === id));

      setFriends(uniqueFriends);
      console.log("Friends:", uniqueFriends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    if (onlineUsers.length === 0) {
      socket?.emit("request:onlineUsers");
    }
    socket?.on("onlineUsers", (onlineUsers: any) => {
      setOnineUsers(onlineUsers);
    });

    return () => {
      socket?.off("onlineUsers");
      socket?.off("request:onlineUsers");
    };
  }, []);

  return (
    <div className={`sticky top-28 hidden self-start lg:col-span-1 lg:block`}>
      <div className={`app-panel ml-auto flex max-h-[calc(100vh-7.5rem)] w-full max-w-[240px] flex-col overflow-y-auto p-5 ${
        isDarkMode ? "border-white/10 bg-slate-900/60 text-white" : ""
      }`}>
        <UserAvatar
          onlineUsers={onlineUsers}
          friends={friends}
          suggestions="Friends"
          isRight
        />
        <ProfileCard />

      </div>
    </div>
  );
}

export default RightPanel;
