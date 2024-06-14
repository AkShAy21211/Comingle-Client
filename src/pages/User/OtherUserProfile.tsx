import CountBox from "../../Components/User/CountBox";
import PostGrid from "../../Components/User/PostGrid";
import ProfileAndBg from "../../Components/User/ProfileAndBg";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useParams } from "react-router-dom";
import { log } from "console";
import userApi from "../../Apis/user";
import { useEffect, useState } from "react";
import { User } from "../../Interface/interface";

function OtherUserProfile() {
  const notOwnPrfile = true;
  const { username } = useParams();
  const [user, setUser] = useState<User|null>(null);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const fetchUser = async () => {
    try {
      if (username) {
        const user = await userApi.getOtherUserProfile(username);

        console.log('fwjwjfojwefjoiwefjni',user);
        
        if (user) {
          setUser(user.user);
        }

        console.log(user);
        
      }
    } catch (error) {
      console.log(error);
    }
  };

useEffect(()=>{

fetchUser()
},[])
  
  return (
    <div
      className={` ${
        isDarkMode ? "bg-black text-white" : ""
      } h-full mb-16 flex justify-center 
       col-span-full lg:col-start-2 lg:col-end-5 
       `}
    >
      <div
        className={` h-full ${
          isDarkMode ? " lg:border-x" : ""
        } shadow-xl overflow-auto overscroll-y-auto  lg:w-4/5 
       bg-red flex flex-col 
        items-center mb-10`}
      >
        <ProfileAndBg user={user} notOwnProfile={notOwnPrfile} />
        <CountBox />
        <PostGrid />
      </div>
    </div>
  );
}

export default OtherUserProfile;
