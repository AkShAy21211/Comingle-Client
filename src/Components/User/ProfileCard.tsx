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
    <div className=" w-full h-auto flex flex-col items-center mt-20  ">
      <div
        className={` px-10 py-5 w-auto h-auto      flex flex-col items-center  ${
          isDarkMode ? "border border-gray-900" : " border border-gray-300 shadow-gray-400"
        } rounded-lg `}
      >
       {
        userData?.profile.image? <img
          src={userData?.profile.image}
          className="w-20 h-20 rounded-full "
          alt=""
        />:<Avatar name={userData?.name} size="80" className="rounded-full"/>

       }
        <p className="text-lg  text-center font-bold mt-5">{userData?.username}</p>

        <div className="w-full h-32 gap-10 flex justify-around ">
          <div className=" flex flex-col gap4 justify-center items-center">
            {userData?.profile.followers?.length}
            <p>Followers</p>
          </div>
          <div className=" flex flex-col justify-center items-center">
            {userData?.profile.following?.length}
            <p>Following</p>
          </div>
        </div>

        {location.pathname === "/profile" ? null : (
          <Link className="font-bold text-sm text-custom-blue" to={"/profile"}>
            View profile
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
