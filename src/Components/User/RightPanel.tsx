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
    <div
      className={`h-svh ${
        isDarkMode ? "bg-black text-white" : ""
      } col-start-5 col-end-6 sticky top-0 shadow-lg hidden lg:block  overflow-hidden`}
    >
      <div className="flex flex-col  h-full p-10 mt-16">
        <UserAvatar
          onlineUsers={onlineUsers}
          friends={friends}
          suggestions="Friends"
          isRight
        />
        <ProfileCard />

        {/* {!showPremiumAds.includes(location.pathname) && (
          <PremiumAd isPremiumPage={false} />
        )} */}
      </div>
    </div>
  );
}

export default RightPanel;
