import UserAvatar from "./UserAvatar";
import PremiumAd from "./PremiumAd";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useLocation } from "react-router-dom";
import userApi from "../../Apis/user";
import { useEffect, useState } from "react";
import { User } from '../../Interface/interface';

const benefits = [
  "Verified Badge",
  "Ads free experience",
  "Up to 200 follows per day",
];

function RightPanel() {
  const location = useLocation();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const showPremiumAds = ["/settings/subscription"];
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [friends, setFriends] = useState<any[]>([]);

  const getFriends = async () => {
    try {
      const user: User = await userApi.getFriends(currentUser._id);
      const followers: any[] = user.profile.followers || [];
      const following: any[] = user.profile.following || [];

      // Combine followers and following into one array
      const combinedFriends = [...followers, ...following];

      // Remove duplicates if necessary
      const uniqueFriends = Array.from(new Set(combinedFriends.map(friend => friend._id)))
        .map(id => combinedFriends.find(friend => friend._id === id));

      setFriends(uniqueFriends);
      console.log("Friends:", uniqueFriends);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div
      className={`h-svh ${
        isDarkMode ? "bg-black text-white" : ""
      } col-start-5 col-end-6 sticky top-0 shadow-lg hidden lg:block overflow-hidden`}
    >
      <div className="flex-1 p-10 mt-14">
        <UserAvatar friends={friends} suggestions="Friends" isRight />
        {!showPremiumAds.includes(location.pathname) && (
          <PremiumAd isPremiumPage={false} />
        )}
      </div>
    </div>
  );
}

export default RightPanel;
