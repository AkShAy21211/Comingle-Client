import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/rootReducer";
import {  User } from "../../Interface/interface";
import { useEffect, useState } from "react";
import userApi from "../../Apis/user";
import Avatar from "react-avatar";

function ProfileCard() {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const [userData, setUserData] = useState<User | null>(null);
  const [fetchAgain, setFetchAgain] = useState(false);
  const location = useLocation();
  async function fetchUserProfile() {
    try {
      const response = await userApi.profile();

      if (response) {
        setUserData(response.user);
        setFetchAgain(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserProfile();
  }, [fetchAgain]);
  return (
    <div className="mt-6 w-full">
      <div
        className={`w-full rounded-[28px] px-5 py-6 text-center sm:px-6 ${
          isDarkMode
            ? "border border-white/10 bg-white/5"
            : "border border-white/70 bg-white/90 shadow-[0_22px_45px_-32px_rgba(15,23,42,0.45)]"
        }`}
      >
        {userData?.profile.image ? (
          <img
            src={userData?.profile.image}
            className="mx-auto h-20 w-20 rounded-3xl object-cover ring-4 ring-white/70"
            alt=""
          />
        ) : (
          <Avatar name={userData?.name} size="80" className="mx-auto rounded-3xl" />
        )}
        <p className="mt-4 text-lg font-bold">{userData?.username}</p>
        <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Your profile snapshot
        </p>

        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <div className={`rounded-[22px] px-2 py-4 ${isDarkMode ? "bg-white/5" : "bg-slate-50"}`}>
            <p className="text-xl font-semibold">{userData?.profile.followers?.length || 0}</p>
            <p className="mt-1 text-[11px] font-medium app-muted">Followers</p>
          </div>
          <div className={`rounded-[22px] px-2 py-4 ${isDarkMode ? "bg-white/5" : "bg-slate-50"}`}>
            <p className="text-xl font-semibold">{userData?.profile.following?.length || 0}</p>
            <p className="mt-1 text-[11px] font-medium app-muted">Following</p>
          </div>
        </div>

        {location.pathname === "/profile" ? null : (
          <Link className="mt-5 inline-flex text-sm font-bold text-custom-blue" to={"/profile"}>
            View profile
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
